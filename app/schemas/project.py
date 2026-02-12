"""
克隆项目相关的 Pydantic 模式
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from app.models.project import ProjectStatus, CloneMode
from app.utils.validators import validate_url, validate_domain, validate_project_name


class ProjectCreate(BaseModel):
    """创建项目请求模式"""

    name: str = Field(..., min_length=1, max_length=255, description="项目名称")
    source_url: Optional[str] = Field(None, description="源网址")
    source_screenshot: Optional[str] = Field(None, description="源截图路径")
    domain: str = Field(..., min_length=3, max_length=255, description="自定义域名")
    clone_mode: CloneMode = Field(
        CloneMode.STATIC,
        description="克隆模式: static(Playwright克隆) 或 proxy(缓存代理)",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """验证项目名称"""
        is_valid, error_msg = validate_project_name(v)
        if not is_valid:
            raise ValueError(error_msg)
        return v.strip()

    @field_validator("source_url")
    @classmethod
    def validate_source_url(cls, v: Optional[str]) -> Optional[str]:
        """验证源网址"""
        if v is None or v.strip() == "":
            return None

        is_valid, error_msg = validate_url(v)
        if not is_valid:
            raise ValueError(error_msg)
        return v.strip()

    @field_validator("domain")
    @classmethod
    def validate_domain_field(cls, v: str) -> str:
        """验证域名"""
        is_valid, error_msg = validate_domain(v)
        if not is_valid:
            raise ValueError(error_msg)
        return v.strip().lower()


class ProjectUpdate(BaseModel):
    """更新项目请求模式"""

    name: Optional[str] = Field(
        None, min_length=1, max_length=255, description="项目名称"
    )
    source_url: Optional[str] = Field(None, description="源网址")
    source_screenshot: Optional[str] = Field(None, description="源截图路径")
    domain: Optional[str] = Field(
        None, min_length=3, max_length=255, description="自定义域名"
    )
    clone_mode: Optional[CloneMode] = Field(
        None, description="克隆模式: static(Playwright克隆) 或 proxy(缓存代理)"
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        """验证项目名称"""
        if v is None:
            return None

        is_valid, error_msg = validate_project_name(v)
        if not is_valid:
            raise ValueError(error_msg)
        return v.strip()

    @field_validator("source_url")
    @classmethod
    def validate_source_url(cls, v: Optional[str]) -> Optional[str]:
        """验证源网址"""
        if v is None or v.strip() == "":
            return None

        is_valid, error_msg = validate_url(v)
        if not is_valid:
            raise ValueError(error_msg)
        return v.strip()

    @field_validator("domain")
    @classmethod
    def validate_domain_field(cls, v: Optional[str]) -> Optional[str]:
        """验证域名"""
        if v is None:
            return None

        is_valid, error_msg = validate_domain(v)
        if not is_valid:
            raise ValueError(error_msg)
        return v.strip().lower()


class ProjectResponse(BaseModel):
    """项目响应模式"""

    id: str = Field(..., description="项目ID")
    name: str = Field(..., description="项目名称")
    source_url: Optional[str] = Field(None, description="源网址")
    source_screenshot: Optional[str] = Field(None, description="源截图路径")
    domain: str = Field(..., description="自定义域名")
    clone_mode: CloneMode = Field(CloneMode.STATIC, description="克隆模式")
    status: ProjectStatus = Field(..., description="项目状态")
    content_path: Optional[str] = Field(None, description="克隆内容路径")
    error_message: Optional[str] = Field(None, description="错误信息")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """项目列表响应模式"""

    total: int = Field(..., description="总数")
    items: list[ProjectResponse] = Field(..., description="项目列表")
