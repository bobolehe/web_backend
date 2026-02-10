"""
网页克隆服务
"""
import asyncio
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, Browser, Page
from sqlalchemy.orm import Session
from typing import Optional
import re
from urllib.parse import urljoin, urlparse
import os
import threading

from app.models.project import Project, ProjectStatus
from app.services.project_service import ProjectService
from app.services.server_manager import ServerManager
from app.logger import logger


class CloneService:
    """网页克隆服务类"""
    
    # 克隆内容保存目录
    CLONE_DIR = Path("cloned_sites")
    
    @classmethod
    def clone_website(cls, db: Session, project_id: str) -> bool:
        """
        克隆网站（同步版本）
        
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
            
            # 使用同步 Playwright
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-setuid-sandbox']
                )
                page = browser.new_page()
                
                try:
                    # 访问页面（使用 load 事件，更快）
                    page.goto(project.source_url, wait_until='load', timeout=60000)
                    
                    # 等待一小段时间让 JavaScript 执行
                    page.wait_for_timeout(2000)
                    
                    # 获取页面内容
                    content = page.content()
                    
                    # 保存 HTML
                    html_file = project_dir / "index.html"
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    # 从域名中解析端口
                    preferred_port = None
                    if ':' in project.domain:
                        # 域名格式: 127.0.0.1:7754 或 example.com:8080
                        parts = project.domain.split(':')
                        try:
                            preferred_port = int(parts[-1])
                        except ValueError:
                            logger.warning(f"Invalid port in domain: {project.domain}")
                    
                    # 启动 HTTP 服务器
                    port = ServerManager.start_server(project_id, project_dir, preferred_port)
                    
                    if port:
                        # 更新项目状态为完成，并保存端口信息
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
                    
                finally:
                    page.close()
                    browser.close()
                
        except Exception as e:
            error_msg = f"克隆失败: {str(e)}"
            logger.error(f"Error cloning {project.source_url}: {error_msg}")
            ProjectService.update_project_status(
                db, project_id, ProjectStatus.FAILED,
                error_message=error_msg
            )
            return False
