"""
克隆项目服务
处理项目的 CRUD 操作
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Project, ProjectStatus
from app.logger import logger


class ProjectService:
    """项目服务类"""
    
    @staticmethod
    def create_project(
        db: Session,
        name: str,
        domain: str,
        source_url: Optional[str] = None,
        source_screenshot: Optional[str] = None
    ) -> Project:
        """
        创建新项目
        
        Args:
            db: 数据库会话
            name: 项目名称
            domain: 自定义域名
            source_url: 源网址
            source_screenshot: 源截图路径
            
        Returns:
            创建的项目对象
        """
        project = Project(
            name=name,
            domain=domain,
            source_url=source_url,
            source_screenshot=source_screenshot,
            status=ProjectStatus.PENDING
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        logger.info(f"Project '{name}' created with ID: {project.id}")
        return project
    
    @staticmethod
    def get_project(db: Session, project_id: str) -> Optional[Project]:
        """
        获取项目详情
        
        Args:
            db: 数据库会话
            project_id: 项目ID
            
        Returns:
            项目对象，如果不存在返回 None
        """
        return db.query(Project).filter(Project.id == project_id).first()
    
    @staticmethod
    def get_project_by_domain(db: Session, domain: str) -> Optional[Project]:
        """
        根据域名获取项目
        
        Args:
            db: 数据库会话
            domain: 域名
            
        Returns:
            项目对象，如果不存在返回 None
        """
        return db.query(Project).filter(Project.domain == domain).first()
    
    @staticmethod
    def get_projects(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: Optional[ProjectStatus] = None
    ) -> tuple[List[Project], int]:
        """
        获取项目列表
        
        Args:
            db: 数据库会话
            skip: 跳过的记录数
            limit: 返回的最大记录数
            status: 按状态过滤（可选）
            
        Returns:
            (项目列表, 总数)
        """
        query = db.query(Project)
        
        if status:
            query = query.filter(Project.status == status)
        
        total = query.count()
        projects = query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()
        
        return projects, total
    
    @staticmethod
    def update_project(
        db: Session,
        project_id: str,
        name: Optional[str] = None,
        domain: Optional[str] = None,
        source_url: Optional[str] = None,
        source_screenshot: Optional[str] = None
    ) -> Optional[Project]:
        """
        更新项目
        
        Args:
            db: 数据库会话
            project_id: 项目ID
            name: 项目名称
            domain: 自定义域名
            source_url: 源网址
            source_screenshot: 源截图路径
            
        Returns:
            更新后的项目对象，如果不存在返回 None
        """
        project = ProjectService.get_project(db, project_id)
        
        if not project:
            return None
        
        # 记录源网址是否变更
        source_url_changed = False
        
        if name is not None:
            project.name = name
        if domain is not None:
            project.domain = domain
        if source_url is not None and source_url != project.source_url:
            project.source_url = source_url
            source_url_changed = True
        if source_screenshot is not None:
            project.source_screenshot = source_screenshot
        
        # 如果源网址变更，重置状态为 PENDING
        if source_url_changed:
            project.status = ProjectStatus.PENDING
            project.content_path = None
            project.error_message = None
            logger.info(f"Project '{project.name}' source URL changed, status reset to PENDING")
        
        db.commit()
        db.refresh(project)
        
        logger.info(f"Project '{project.name}' updated")
        return project
    
    @staticmethod
    def delete_project(db: Session, project_id: str) -> bool:
        """
        删除项目
        
        Args:
            db: 数据库会话
            project_id: 项目ID
            
        Returns:
            是否删除成功
        """
        project = ProjectService.get_project(db, project_id)
        
        if not project:
            return False
        
        project_name = project.name
        db.delete(project)
        db.commit()
        
        logger.info(f"Project '{project_name}' deleted")
        return True
    
    @staticmethod
    def update_project_status(
        db: Session,
        project_id: str,
        status: ProjectStatus,
        content_path: Optional[str] = None,
        error_message: Optional[str] = None
    ) -> Optional[Project]:
        """
        更新项目状态
        
        Args:
            db: 数据库会话
            project_id: 项目ID
            status: 新状态
            content_path: 克隆内容路径
            error_message: 错误信息
            
        Returns:
            更新后的项目对象，如果不存在返回 None
        """
        project = ProjectService.get_project(db, project_id)
        
        if not project:
            return None
        
        project.status = status
        
        if content_path is not None:
            project.content_path = content_path
        
        if error_message is not None:
            project.error_message = error_message
        
        db.commit()
        db.refresh(project)
        
        logger.info(f"Project '{project.name}' status updated to {status.value}")
        return project
