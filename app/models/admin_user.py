"""
管理员用户数据模型
"""
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
import uuid

from app.database import Base


class AdminUser(Base):
    """管理员用户模型"""
    __tablename__ = "admin_users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    last_login = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<AdminUser(id={self.id}, username={self.username}, email={self.email})>"
