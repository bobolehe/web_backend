"""
HTTP 服务器管理器
为每个克隆项目启动独立的 HTTP 服务器
"""
import http.server
import socketserver
import threading
from pathlib import Path
from typing import Dict, Optional
import socket

from app.logger import logger


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
    def start_server(cls, project_id: str, content_dir: Path, port: Optional[int] = None) -> Optional[int]:
        """
        为项目启动 HTTP 服务器
        
        Args:
            project_id: 项目ID
            content_dir: 内容目录
            port: 指定端口（可选）
            
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
            # 创建自定义请求处理器
            class CustomHandler(http.server.SimpleHTTPRequestHandler):
                def __init__(self, *args, **kwargs):
                    super().__init__(*args, directory=str(content_dir), **kwargs)
                
                def log_message(self, format, *args):
                    # 自定义日志输出
                    logger.info(f"[Project {project_id}] {format % args}")
            
            # 创建服务器
            server = socketserver.TCPServer(('127.0.0.1', actual_port), CustomHandler)
            server.allow_reuse_address = True
            
            # 在新线程中运行服务器
            def serve():
                logger.info(f"Starting HTTP server for project {project_id} on port {actual_port}")
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
