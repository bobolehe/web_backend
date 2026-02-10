"""
功能开关数据模型
"""
from sqlalchemy import Column, String, Boolean, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class FeatureFlag(Base):
    """功能开关模型"""
    __tablename__ = "feature_flags"

    name = Column(String(100), primary_key=True)
    enabled = Column(Boolean, nullable=False, default=True)
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<FeatureFlag(name={self.name}, enabled={self.enabled})>"
