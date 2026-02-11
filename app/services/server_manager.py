"""
HTTP 服务器管理器
为每个克隆项目启动独立的 HTTP 服务器（支持反向代理）
"""
import http.server
import socketserver
import threading
from pathlib import Path
from typing import Dict, Optional
import socket
import urllib.request
import urllib.error
from urllib.parse import urljoin

from app.logger import logger


class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """支持反向代理的 HTTP 请求处理器"""
    
    # 类变量，用于存储项目配置
    project_id = None
    content_dir = None
    source_url = None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(self.content_dir), **kwargs)
    
    def do_GET(self):
        """处理 GET 请求"""
        self._handle_request('GET')
    
    def do_POST(self):
        """处理 POST 请求"""
        self._handle_request('POST')
    
    def do_PUT(self):
        """处理 PUT 请求"""
        self._handle_request('PUT')
    
    def do_DELETE(self):
        """处理 DELETE 请求"""
        self._handle_request('DELETE')
    
    def do_OPTIONS(self):
        """处理 OPTIONS 请求（CORS 预检）"""
        self._handle_request('OPTIONS')
    
    def _handle_request(self, method):
        """统一处理所有类型的请求"""
        # 如果请求的是本地文件（HTML、CSS、JS等），直接返回
        if self._is_static_file(self.path):
            if method == 'GET':
                super().do_GET()
            else:
                self.send_error(405, "Method Not Allowed")
            return
        
        # 否则，代理到原始服务器
        if self.source_url:
            self._proxy_request(method)
        else:
            self.send_error(404, "Not Found - No proxy configured")
    
    def _is_static_file(self, path):
        """判断是否是静态文件请求"""
        # 移除查询参数
        path = path.split('?')[0]
        
        # 静态文件扩展名
        static_extensions = [
            '.html', '.htm', '.css', '.js', '.json',
            '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.webp',
            '.woff', '.woff2', '.ttf', '.eot', '.otf',
            '.mp4', '.webm', '.mp3', '.wav',
            '.pdf', '.zip', '.txt', '.map'
        ]
        
        # 检查是否是根路径或 index.html
        if path == '/' or path == '/index.html':
            return True
        
        # 检查文件扩展名
        for ext in static_extensions:
            if path.lower().endswith(ext):
                # 检查文件是否存在于本地
                local_path = Path(self.directory) / path.lstrip('/')
                if local_path.exists() and local_path.is_file():
                    return True
        
        return False
    
    def _proxy_request(self, method):
        """代理请求到原始服务器"""
        try:
            # 构建完整的目标 URL
            target_url = urljoin(self.source_url, self.path)
            
            # 读取请求体（如果有）
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # 创建请求
            req = urllib.request.Request(target_url, data=body, method=method)
            
            # 复制请求头（排除一些不需要的头）
            skip_headers = ['host', 'connection', 'content-length']
            for key, value in self.headers.items():
                if key.lower() not in skip_headers:
                    req.add_header(key, value)
            
            # 发送请求
            with urllib.request.urlopen(req, timeout=30) as response:
                # 发送响应状态
                self.send_response(response.status)
                
                # 发送响应头
                for key, value in response.headers.items():
                    # 跳过一些可能导致问题的头
                    if key.lower() not in ['transfer-encoding', 'connection']:
                        self.send_header(key, value)
                
                # 添加 CORS 头
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', '*')
                
                self.end_headers()
                
                # 发送响应体
                if method != 'OPTIONS':
                    self.wfile.write(response.read())
            
            logger.info(f"[Project {self.project_id}] Proxied {method} {self.path} -> {target_url}")
            
        except urllib.error.HTTPError as e:
            # HTTP 错误
            self.send_error(e.code, e.reason)
            logger.warning(f"[Project {self.project_id}] Proxy error {method} {self.path}: {e.code} {e.reason}")
        except Exception as e:
            # 其他错误
            self.send_error(502, f"Bad Gateway: {str(e)}")
            logger.error(f"[Project {self.project_id}] Proxy error {method} {self.path}: {str(e)}")
    
    def log_message(self, format, *args):
        """自定义日志输出 - 记录所有请求"""
        logger.info(f"[Project {self.project_id}] {format % args}")
    
    def log_error(self, format, *args):
        """记录错误"""
        logger.error(f"[Project {self.project_id}] ERROR: {format % args}")


class ServerManager:
    """HTTP 服务器管理器"""
    
    # 存储所有运行中的服务器 {project_id: (server, thread)}
    _servers: Dict[str, tuple] = {}
    
    # 端口范围
    PORT_START = 7000
    PORT_END = 9000
    
    @classmethod
    def find_available_port(cls, preferred_port: Optional[int] = None) -> Optional[int]:
        """
        查找可用端口
        
        Args:
            preferred_port: 首选端口（如果指定，会优先尝试使用）
            
        Returns:
            可用端口号，如果没有可用端口则返回 None
        """
        # 如果指定了首选端口，优先尝试
        if preferred_port:
            if cls._is_port_available(preferred_port):
                logger.info(f"Using preferred port: {preferred_port}")
                return preferred_port
            else:
                logger.warning(f"Preferred port {preferred_port} is not available, searching for alternative...")
        
        # 在范围内查找可用端口
        for port in range(cls.PORT_START, cls.PORT_END):
            if cls._is_port_available(port):
                logger.info(f"Found available port: {port}")
                return port
        
        return None
    
    @classmethod
    def _is_port_available(cls, port: int) -> bool:
        """检查端口是否可用"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('127.0.0.1', port))
                return True
        except OSError:
            return False
    
    @classmethod
    def start_server(cls, project_id: str, content_dir: Path, port: Optional[int] = None, source_url: Optional[str] = None) -> Optional[int]:
        """
        为项目启动 HTTP 服务器（支持反向代理）
        
        Args:
            project_id: 项目ID
            content_dir: 内容目录
            port: 指定端口（可选）
            source_url: 源网站URL（用于反向代理）
            
        Returns:
            实际使用的端口号，失败返回 None
        """
        # 如果已经有服务器在运行，先停止
        if project_id in cls._servers:
            cls.stop_server(project_id)
        
        # 查找可用端口
        actual_port = cls.find_available_port(port)
        if not actual_port:
            logger.error(f"No available port found for project {project_id}")
            return None
        
        try:
            # 创建自定义请求处理器类
            class CustomHandler(ProxyHTTPRequestHandler):
                pass
            
            # 设置类变量
            CustomHandler.project_id = project_id
            CustomHandler.content_dir = content_dir
            CustomHandler.source_url = source_url
            
            # 创建服务器
            server = socketserver.TCPServer(('127.0.0.1', actual_port), CustomHandler)
            server.allow_reuse_address = True
            
            # 在新线程中运行服务器
            def serve():
                if source_url:
                    logger.info(f"Starting HTTP server with proxy for project {project_id} on port {actual_port}")
                    logger.info(f"Proxy target: {source_url}")
                else:
                    logger.info(f"Starting static-only HTTP server for project {project_id} on port {actual_port}")
                server.serve_forever()
            
            thread = threading.Thread(target=serve, daemon=True)
            thread.start()
            
            # 保存服务器信息
            cls._servers[project_id] = (server, thread)
            
            logger.info(f"HTTP server started for project {project_id} on http://127.0.0.1:{actual_port}")
            return actual_port
            
        except Exception as e:
            logger.error(f"Failed to start server for project {project_id}: {str(e)}")
            return None
    
    @classmethod
    def stop_server(cls, project_id: str) -> bool:
        """
        停止项目的 HTTP 服务器
        
        Args:
            project_id: 项目ID
            
        Returns:
            是否成功停止
        """
        if project_id not in cls._servers:
            return False
        
        try:
            server, thread = cls._servers[project_id]
            server.shutdown()
            server.server_close()
            del cls._servers[project_id]
            logger.info(f"HTTP server stopped for project {project_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to stop server for project {project_id}: {str(e)}")
            return False
    
    @classmethod
    def get_server_info(cls, project_id: str) -> Optional[dict]:
        """
        获取服务器信息
        
        Args:
            project_id: 项目ID
            
        Returns:
            服务器信息字典，如果不存在则返回 None
        """
        if project_id not in cls._servers:
            return None
        
        server, thread = cls._servers[project_id]
        return {
            'project_id': project_id,
            'port': server.server_address[1],
            'host': server.server_address[0],
            'url': f"http://{server.server_address[0]}:{server.server_address[1]}",
            'running': thread.is_alive()
        }
    
    @classmethod
    def list_servers(cls) -> list:
        """列出所有运行中的服务器"""
        return [cls.get_server_info(pid) for pid in cls._servers.keys()]
    
    @classmethod
    def stop_all_servers(cls):
        """停止所有服务器"""
        project_ids = list(cls._servers.keys())
        for project_id in project_ids:
            cls.stop_server(project_id)
