"""
网页克隆服务
"""
from pathlib import Path
from typing import Optional

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.project import ProjectStatus
from app.services.project_service import ProjectService
from app.services.server_manager import ServerManager
from app.logger import logger


class CloneService:
    """网页克隆服务类"""

    # 克隆内容保存目录
    CLONE_DIR = Path("cloned_sites")

    @classmethod
    def clone_website(cls, project_id: str) -> bool:
        """
        克隆网站（后台任务入口）

        为避免请求结束后数据库连接失效，这里自行创建并管理数据库会话。

        Args:
            project_id: 项目ID

        Returns:
            是否成功
        """
        db: Session = SessionLocal()
        try:
            return cls._clone_website_with_session(db, project_id)
        finally:
            db.close()

    @classmethod
    def _clone_website_with_session(cls, db: Session, project_id: str) -> bool:
        """使用给定数据库会话执行克隆流程。"""
        project = ProjectService.get_project(db, project_id)
        if not project:
            logger.error(f"Project {project_id} not found")
            return False

        if not project.source_url:
            logger.error(f"Project {project_id} has no source_url")
            ProjectService.update_project_status(
                db,
                project_id,
                ProjectStatus.FAILED,
                error_message="未设置源网址",
            )
            return False

        try:
            ProjectService.update_project_status(db, project_id, ProjectStatus.CLONING)
            logger.info(f"Starting to clone {project.source_url} for project {project_id}")

            project_dir = cls.CLONE_DIR / project_id
            project_dir.mkdir(parents=True, exist_ok=True)

            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                    ],
                )
                context = browser.new_context(ignore_https_errors=True)
                page = context.new_page()

                try:
                    cls._navigate_with_retry(page, project.source_url)
                    html_file = cls._save_page_content(page, project_dir)

                    preferred_port = cls._extract_preferred_port(project.domain)
                    port = ServerManager.start_server(project_id, project_dir, preferred_port)

                    content_path = f"/cloned/{project_id}/{html_file.name}"
                    if port:
                        project.port = str(port)
                        ProjectService.update_project_status(
                            db,
                            project_id,
                            ProjectStatus.COMPLETED,
                            content_path=content_path,
                        )
                        logger.info(
                            f"Successfully cloned {project.source_url}, accessible at http://127.0.0.1:{port}"
                        )
                    else:
                        ProjectService.update_project_status(
                            db,
                            project_id,
                            ProjectStatus.COMPLETED,
                            content_path=content_path,
                        )
                        logger.warning(
                            f"Cloned {project.source_url} but failed to start HTTP server"
                        )

                    return True
                finally:
                    page.close()
                    context.close()
                    browser.close()

        except Exception as exc:
            error_msg = f"克隆失败: {str(exc)}"
            logger.error(f"Error cloning {project.source_url}: {error_msg}")
            ProjectService.update_project_status(
                db,
                project_id,
                ProjectStatus.FAILED,
                error_message=error_msg,
            )
            return False

    @staticmethod
    def _extract_preferred_port(domain: str) -> Optional[int]:
        """从项目域名中提取端口号。"""
        if not domain or ":" not in domain:
            return None

        port_segment = domain.rsplit(":", maxsplit=1)[-1]
        try:
            port = int(port_segment)
            if 1 <= port <= 65535:
                return port
            logger.warning(f"Port out of range in domain: {domain}")
        except ValueError:
            logger.warning(f"Invalid port in domain: {domain}")

        return None

    @staticmethod
    def _navigate_with_retry(page, url: str, timeout_ms: int = 45000) -> None:
        """
        页面访问策略：先快速进入 DOM 就绪态，再短暂等待网络空闲。

        相比固定 sleep，能在多数页面上更快完成，同时保留动态站点兼容性。
        """
        page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
        try:
            page.wait_for_load_state("networkidle", timeout=5000)
        except PlaywrightTimeoutError:
            logger.debug("networkidle wait timed out, continue with current DOM snapshot")

    @staticmethod
    def _save_page_content(page, project_dir: Path) -> Path:
        """保存当前页面 HTML 内容。"""
        content = page.content()
        html_file = project_dir / "index.html"
        html_file.write_text(content, encoding="utf-8")
        return html_file
