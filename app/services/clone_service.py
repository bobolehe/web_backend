"""
网页克隆服务
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from sqlalchemy.orm import Session
from typing import Optional
import re
from urllib.parse import urlparse
import hashlib

from app.models.project import Project, ProjectStatus
from app.services.project_service import ProjectService
from app.services.server_manager import ServerManager
from app.logger import logger


class CloneService:
    """网页克隆服务类"""
    
    # 克隆内容保存目录
    CLONE_DIR = Path("cloned_sites")
    
    @classmethod
    def _get_resource_path(cls, url: str, base_url: str) -> str:
        """
        获取资源的本地路径
        
        Args:
            url: 资源URL
            base_url: 基础URL
            
        Returns:
            本地相对路径
        """
        parsed = urlparse(url)
        path = parsed.path
        
        # 如果路径为空或只是 /，使用 hash 生成文件名
        if not path or path == '/':
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            return f"assets/{url_hash}.html"
        
        # 移除开头的 /
        path = path.lstrip('/')
        
        # 如果没有扩展名，添加适当的扩展名
        if '.' not in path.split('/')[-1]:
            path = f"{path}/index.html"
        
        return path
    
    @classmethod
    def clone_website(cls, db: Session, project_id: str) -> bool:
        """
        克隆网站（完全静态化版本 - 使用 Playwright 资源拦截）
        
        Args:
            db: 数据库会话
            project_id: 项目ID
            
        Returns:
            是否成功
        """
        # 获取项目
        project = ProjectService.get_project(db, project_id)
        if not project:
            logger.error(f"Project {project_id} not found")
            return False
        
        if not project.source_url:
            logger.error(f"Project {project_id} has no source_url")
            ProjectService.update_project_status(
                db, project_id, ProjectStatus.FAILED,
                error_message="未设置源网址"
            )
            return False
        
        try:
            # 更新状态为克隆中
            ProjectService.update_project_status(db, project_id, ProjectStatus.CLONING)
            logger.info(f"Starting to clone {project.source_url} for project {project_id}")
            
            # 创建项目目录
            project_dir = cls.CLONE_DIR / project_id
            project_dir.mkdir(parents=True, exist_ok=True)
            
            # 解析基础 URL
            parsed_url = urlparse(project.source_url)
            base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
            
            # 存储已下载的资源
            downloaded_resources = {}
            
            # 使用同步 Playwright 并拦截所有资源
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-setuid-sandbox']
                )
                
                context = browser.new_context()
                page = context.new_page()
                
                # 拦截所有请求并保存资源
                def handle_route(route):
                    request = route.request
                    url = request.url
                    
                    try:
                        # 继续请求
                        response = route.fetch()
                        
                        # 只保存特定类型的资源
                        resource_type = request.resource_type
                        if resource_type in ['stylesheet', 'script', 'image', 'font', 'media']:
                            # 生成本地路径
                            local_path = cls._get_resource_path(url, base_url)
                            save_path = project_dir / local_path
                            
                            # 保存资源
                            save_path.parent.mkdir(parents=True, exist_ok=True)
                            with open(save_path, 'wb') as f:
                                f.write(response.body())
                            
                            downloaded_resources[url] = '/' + local_path
                            logger.info(f"Saved {resource_type}: {url} -> {local_path}")
                        
                        # 继续响应
                        route.fulfill(response=response)
                        
                    except Exception as e:
                        logger.warning(f"Failed to intercept {url}: {str(e)}")
                        route.continue_()
                
                # 启用路由拦截
                page.route("**/*", handle_route)
                
                try:
                    # 访问页面（使用 load 事件，增加超时时间）
                    page.goto(project.source_url, wait_until='load', timeout=120000)
                    
                    # 等待额外时间让资源加载
                    page.wait_for_timeout(5000)
                    
                    # 获取页面内容
                    html_content = page.content()
                    
                finally:
                    page.close()
                    context.close()
                    browser.close()
            
            # 替换 HTML 中的 URL
            logger.info(f"Replacing URLs in HTML for project {project_id}")
            for original_url, local_path in downloaded_resources.items():
                # 替换各种可能的 URL 格式
                html_content = html_content.replace(f'"{original_url}"', f'"{local_path}"')
                html_content = html_content.replace(f"'{original_url}'", f"'{local_path}'")
                html_content = html_content.replace(f'({original_url})', f'({local_path})')
            
            # 移除 <base> 标签
            html_content = re.sub(r'<base[^>]*>', '', html_content, flags=re.IGNORECASE)
            
            # 注入请求拦截脚本
            intercept_script = """
<script>
(function() {
    'use strict';
    
    const currentOrigin = window.location.origin;
    const BLOCK_MODE = false;  // false = 只记录不阻止, true = 阻止外部请求
    
    console.log('[Request Interceptor] Initialized. Current origin:', currentOrigin);
    console.log('[Request Interceptor] Block mode:', BLOCK_MODE ? 'ENABLED' : 'DISABLED (logging only)');
    
    // 拦截 fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        try {
            const fullUrl = new URL(url, currentOrigin).href;
            
            if (!fullUrl.startsWith(currentOrigin)) {
                console.warn('[Request Interceptor] External fetch request:', fullUrl);
                if (BLOCK_MODE) {
                    return Promise.reject(new Error('External requests are blocked'));
                }
            } else {
                console.log('[Request Interceptor] Local fetch request:', fullUrl);
            }
        } catch (e) {
            console.error('[Request Interceptor] Error parsing URL:', url, e);
        }
        
        return originalFetch.apply(this, args);
    };
    
    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        try {
            const fullUrl = new URL(url, currentOrigin).href;
            
            if (!fullUrl.startsWith(currentOrigin)) {
                console.warn('[Request Interceptor] External XHR request:', method, fullUrl);
                if (BLOCK_MODE) {
                    throw new Error('External requests are blocked');
                }
            } else {
                console.log('[Request Interceptor] Local XHR request:', method, fullUrl);
            }
        } catch (e) {
            if (e.message === 'External requests are blocked') {
                throw e;
            }
            console.error('[Request Interceptor] Error parsing URL:', url, e);
        }
        
        return originalOpen.call(this, method, url, ...rest);
    };
    
    // 监听所有未捕获的错误
    window.addEventListener('error', function(e) {
        console.error('[Request Interceptor] Uncaught error:', e.message, e.filename, e.lineno);
    }, true);
    
    // 监听所有未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', function(e) {
        console.error('[Request Interceptor] Unhandled promise rejection:', e.reason);
    });
    
    console.log('[Request Interceptor] Monitoring enabled');
})();
</script>
"""
            
            # 在 <head> 标签后立即注入脚本（确保最先执行）
            if '<head>' in html_content:
                html_content = html_content.replace('<head>', f'<head>\n{intercept_script}', 1)
            elif '<html>' in html_content:
                html_content = html_content.replace('<html>', f'<html>\n{intercept_script}', 1)
            else:
                # 如果没有 head 或 html 标签，添加到开头
                html_content = intercept_script + html_content
            
            # 保存处理后的 HTML
            html_file = project_dir / "index.html"
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logger.info(f"Saved HTML to {html_file}, downloaded {len(downloaded_resources)} resources")
            
            # 从域名中解析端口
            preferred_port = None
            if ':' in project.domain:
                parts = project.domain.split(':')
                try:
                    preferred_port = int(parts[-1])
                except ValueError:
                    logger.warning(f"Invalid port in domain: {project.domain}")
            
            # 启动 HTTP 服务器（带反向代理）
            port = ServerManager.start_server(
                project_id, 
                project_dir, 
                preferred_port,
                source_url=project.source_url  # 启用反向代理
            )
            
            if port:
                # 更新项目状态为完成
                content_path = f"/cloned/{project_id}/index.html"
                project.port = str(port)
                ProjectService.update_project_status(
                    db, project_id, ProjectStatus.COMPLETED,
                    content_path=content_path
                )
                
                logger.info(f"Successfully cloned {project.source_url}, accessible at http://127.0.0.1:{port}")
            else:
                # 端口分配失败，但克隆成功
                content_path = f"/cloned/{project_id}/index.html"
                ProjectService.update_project_status(
                    db, project_id, ProjectStatus.COMPLETED,
                    content_path=content_path
                )
                logger.warning(f"Cloned {project.source_url} but failed to start HTTP server")
            
            return True
                
        except Exception as e:
            error_msg = f"克隆失败: {str(e)}"
            logger.error(f"Error cloning {project.source_url}: {error_msg}")
            import traceback
            logger.error(traceback.format_exc())
            ProjectService.update_project_status(
                db, project_id, ProjectStatus.FAILED,
                error_message=error_msg
            )
            return False
