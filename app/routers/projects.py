"""
克隆项目管理 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.services.project_service import ProjectService
from app.services.clone_service import CloneService
from app.services.server_manager import ServerManager
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from app.models import ProjectStatus
from app.logger import logger

router = APIRouter(prefix="/api/projects", tags=["克隆项目"])


@router.get("", response_model=ProjectListResponse, summary="获取项目列表")
async def get_projects(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(100, ge=1, le=1000, description="返回的最大记录数"),
    status: Optional[ProjectStatus] = Query(None, description="按状态过滤"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    获取克隆项目列表
    
    - **skip**: 跳过的记录数（分页）
    - **limit**: 返回的最大记录数
    - **status**: 按状态过滤（可选）
    """
    projects, total = ProjectService.get_projects(db, skip=skip, limit=limit, status=status)
    
    return {
        "total": total,
        "items": projects
    }


@router.post("", response_model=ProjectResponse, summary="创建新项目", status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    创建新的克隆项目
    
    - **name**: 项目名称
    - **domain**: 自定义域名（唯一）
    - **source_url**: 源网址（可选）
    - **source_screenshot**: 源截图路径（可选）
    """
    # 检查域名是否已存在
    existing_project = ProjectService.get_project_by_domain(db, project_data.domain)
    if existing_project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"域名 '{project_data.domain}' 已被使用"
        )
    
    # 创建项目
    project = ProjectService.create_project(
        db=db,
        name=project_data.name,
        domain=project_data.domain,
        source_url=project_data.source_url,
        source_screenshot=project_data.source_screenshot
    )
    
    logger.info(f"User '{current_user.username}' created project '{project.name}'")
    
    return project


@router.get("/{project_id}", response_model=ProjectResponse, summary="获取项目详情")
async def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    获取指定项目的详细信息
    
    - **project_id**: 项目ID
    """
    project = ProjectService.get_project(db, project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"项目 ID '{project_id}' 不存在"
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse, summary="更新项目")
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    更新项目信息
    
    - **project_id**: 项目ID
    - **name**: 项目名称（可选）
    - **domain**: 自定义域名（可选）
    - **source_url**: 源网址（可选，更新后会重新触发克隆）
    - **source_screenshot**: 源截图路径（可选）
    """
    # 检查项目是否存在
    existing_project = ProjectService.get_project(db, project_id)
    if not existing_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"项目 ID '{project_id}' 不存在"
        )
    
    # 如果更新域名，检查新域名是否已被使用
    if project_data.domain and project_data.domain != existing_project.domain:
        domain_check = ProjectService.get_project_by_domain(db, project_data.domain)
        if domain_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"域名 '{project_data.domain}' 已被使用"
            )
    
    # 更新项目
    project = ProjectService.update_project(
        db=db,
        project_id=project_id,
        name=project_data.name,
        domain=project_data.domain,
        source_url=project_data.source_url,
        source_screenshot=project_data.source_screenshot
    )
    
    logger.info(f"User '{current_user.username}' updated project '{project.name}'")
    
    return project


@router.delete("/{project_id}", summary="删除项目", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    删除项目
    
    - **project_id**: 项目ID
    
    注意：删除项目会保留其历史访问日志，但会停止HTTP服务器
    """
    # 停止HTTP服务器
    ServerManager.stop_server(project_id)
    
    success = ProjectService.delete_project(db, project_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"项目 ID '{project_id}' 不存在"
        )
    
    logger.info(f"User '{current_user.username}' deleted project ID '{project_id}'")
    
    return None


@router.post("/{project_id}/clone", summary="开始克隆项目")
async def clone_project(
    project_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    开始克隆项目
    
    - **project_id**: 项目ID
    
    克隆任务将在后台执行
    """
    # 检查项目是否存在
    project = ProjectService.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"项目 ID '{project_id}' 不存在"
        )
    
    # 检查是否有源网址
    if not project.source_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="项目未设置源网址，无法克隆"
        )
    
    # 添加后台任务
    background_tasks.add_task(CloneService.clone_website, project_id)
    
    logger.info(f"User '{current_user.username}' started cloning project '{project.name}'")
    
    return {
        "message": "克隆任务已启动",
        "project_id": project_id
    }
