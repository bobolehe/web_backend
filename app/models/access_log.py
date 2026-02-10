"""
访问日志数据模型
"""
from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class AccessLog(Base):
    """访问日志模型"""
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    domain = Column(String(255), nullable=False, index=True)
    ip = Column(String(45), nullable=False)  # 支持 IPv6
    user_agent = Column(Text, nullable=True)
    path = Column(String(500), nullable=True)
    referer = Column(Text, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=func.now(), index=True)

    # 关系
    # project = relationship("Project", backref="access_logs")

    def __repr__(self):
        return f"<AccessLog(id={self.id}, domain={self.domain}, ip={self.ip}, timestamp={self.timestamp})>"


# 创建复合索引以优化查询性能
Index('idx_access_logs_project_timestamp', AccessLog.project_id, AccessLog.timestamp)
Index('idx_access_logs_domain_timestamp', AccessLog.domain, AccessLog.timestamp)
