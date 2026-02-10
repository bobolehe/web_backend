"""
应用配置模块
使用 Pydantic Settings 管理环境变量和配置
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """应用配置类"""
    
    # 数据库配置
    database_url: str = Field(default="sqlite:///./clone_management.db")
    
    # JWT 配置
    secret_key: str = Field(default="your-secret-key-change-in-production")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    
    # 应用配置
    app_name: str = Field(default="Clone Management System")
    app_version: str = Field(default="1.0.0")
    debug: bool = Field(default=False)
    
    # CORS 配置
    allowed_origins: str = Field(default="http://localhost:3000,http://localhost:8000")
    
    @property
    def cors_origins(self) -> List[str]:
        """解析 CORS 允许的源"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    # 文件存储
    clone_storage_path: str = Field(default="./cloned_content")
    
    # 邮件配置
    smtp_host: str = Field(default="smtp.gmail.com")
    smtp_port: int = Field(default=587)
    smtp_user: str = Field(default="")
    smtp_password: str = Field(default="")
    smtp_from: str = Field(default="noreply@example.com")
    
    # 功能开关
    enable_email_notifications: bool = Field(default=True)
    enable_access_logging: bool = Field(default=True)
    
    # 日志配置
    log_level: str = Field(default="INFO")
    log_retention_days: int = Field(default=30)
    
    # Playwright 配置
    playwright_timeout: int = Field(default=30000)
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 全局配置实例
settings = Settings()
