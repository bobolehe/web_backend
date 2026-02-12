"""
克隆项目数据模型
"""

from sqlalchemy import Column, String, Text, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid

from app.database import Base


class ProjectStatus(str, enum.Enum):
    """项目状态枚举"""

    PENDING = "pending"
    CLONING = "cloning"
    COMPLETED = "completed"
    FAILED = "failed"


class CloneMode(str, enum.Enum):
    """克隆模式枚举"""

    STATIC = "static"  # Playwright 预加载克隆（下载所有静态资源）
    PROXY = "proxy"  # 缓存式反向代理（按需代理并缓存）


class Project(Base):
    """克隆项目模型"""

    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    source_url = Column(Text, nullable=True)
    source_screenshot = Column(Text, nullable=True)
    domain = Column(String(255), unique=True, nullable=False, index=True)
    port = Column(String(10), nullable=True)  # 服务端口
    clone_mode = Column(SQLEnum(CloneMode), nullable=False, default=CloneMode.STATIC)
    status = Column(
        SQLEnum(ProjectStatus),
        nullable=False,
        default=ProjectStatus.PENDING,
        index=True,
    )
    content_path = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name}, domain={self.domain}, status={self.status}, mode={self.clone_mode})>"
