"""
域名路由中间件
"""
from fastapi import Request, Response
from fastapi.responses import FileResponse, HTMLResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pathlib import Path
import os

from app.database import SessionLocal
from app.services.project_service import ProjectService
from app.models.project import ProjectStatus
from app.logger import logger


class DomainRouterMiddleware(BaseHTTPMiddleware):
    """
    域名路由中间件
    
    根据请求的域名（Host 头）查找对应的项目，并返回克隆的网站内容
    """
    
    # 排除的路径（API 和管理界面）
    EXCLUDED_PATHS = ['/api/', '/static/', '/uploads/', '/cloned/', '/docs', '/redoc', '/openapi.json', '/health']
    
    async def dispatch(self, request: Request, call_next):
        """处理请求"""
        
        # 获取请求路径
        path = request.url.path
        
        # 检查是否是排除的路径
        if any(path.startswith(excluded) for excluded in self.EXCLUDED_PATHS):
            return await call_next(request)
        
        # 获取 Host 头
        host = request.headers.get('host', '').lower()
        
        if not host:
            return await call_next(request)
        
        # 检查是否是本地管理域名（localhost, 127.0.0.1）
        if host.startswith('localhost') or host.startswith('127.0.0.1'):
            # 如果访问根路径，返回管理界面
            if path == '/':
                return await call_next(request)
            # 其他路径继续正常处理
            return await call_next(request)
        
        # 查找匹配的项目
        db = SessionLocal()
        try:
            project = ProjectService.get_project_by_domain(db, host)
            
            if not project:
                # 域名未绑定
                logger.warning(f"Domain '{host}' not found")
                return HTMLResponse(
                    content=f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>域名未绑定</title>
                        <style>
                            body {{
                                font-family: Arial, sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                background-color: #f5f5f5;
                            }}
                            .container {{
                                text-align: center;
                                padding: 40px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }}
                            h1 {{ color: #dc3545; }}
                            p {{ color: #6c757d; }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>404 - 域名未绑定</h1>
                            <p>域名 <strong>{host}</strong> 未绑定到任何项目</p>
                        </div>
                    </body>
                    </html>
                    """,
                    status_code=404
                )
            
            # 检查项目状态
            if project.status != ProjectStatus.COMPLETED:
                status_text = {
                    ProjectStatus.PENDING: '待处理',
                    ProjectStatus.CLONING: '克隆中',
                    ProjectStatus.FAILED: '克隆失败'
                }.get(project.status, '未知状态')
                
                return HTMLResponse(
                    content=f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>网站未就绪</title>
                        <style>
                            body {{
                                font-family: Arial, sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                background-color: #f5f5f5;
                            }}
                            .container {{
                                text-align: center;
                                padding: 40px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }}
                            h1 {{ color: #ffc107; }}
                            p {{ color: #6c757d; }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>网站未就绪</h1>
                            <p>项目 <strong>{project.name}</strong> 当前状态: <strong>{status_text}</strong></p>
                            {f'<p style="color: #dc3545;">错误信息: {project.error_message}</p>' if project.error_message else ''}
                        </div>
                    </body>
                    </html>
                    """,
                    status_code=503
                )
            
            # 检查内容路径
            if not project.content_path:
                return HTMLResponse(
                    content="""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>内容不存在</title>
                    </head>
                    <body>
                        <h1>500 - 内容不存在</h1>
                        <p>项目内容路径未设置</p>
                    </body>
                    </html>
                    """,
                    status_code=500
                )
            
            # 构建文件路径
            # content_path 格式: /cloned/{project_id}/index.html
            file_path = project.content_path.lstrip('/')
            full_path = Path(file_path)
            
            # 如果请求的是子路径，尝试拼接
            if path != '/':
                # 移除 index.html，添加请求的路径
                base_dir = full_path.parent
                requested_file = base_dir / path.lstrip('/')
                if requested_file.exists() and requested_file.is_file():
                    full_path = requested_file
            
            # 检查文件是否存在
            if not full_path.exists():
                return HTMLResponse(
                    content=f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>文件不存在</title>
                    </head>
                    <body>
                        <h1>404 - 文件不存在</h1>
                        <p>请求的文件不存在</p>
                    </body>
                    </html>
                    """,
                    status_code=404
                )
            
            # 返回文件
            logger.info(f"Serving {full_path} for domain {host}")
            return FileResponse(full_path)
            
        finally:
            db.close()
