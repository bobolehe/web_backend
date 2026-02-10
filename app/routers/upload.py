"""
文件上传 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pathlib import Path
import uuid
import os
from app.routers.auth import get_current_user
from app.logger import logger

router = APIRouter(prefix="/api/upload", tags=["文件上传"])

# 上传目录配置
UPLOAD_DIR = Path("uploads/screenshots")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# 确保上传目录存在
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/screenshot", summary="上传截图")
async def upload_screenshot(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """
    上传项目截图
    
    - **file**: 图片文件（支持 jpg, jpeg, png, gif, webp）
    - 最大文件大小: 10MB
    
    返回上传后的文件路径
    """
    # 检查文件扩展名
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"不支持的文件格式。支持的格式: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # 读取文件内容并检查大小
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"文件大小超过限制（最大 {MAX_FILE_SIZE // 1024 // 1024}MB）"
        )
    
    # 生成唯一文件名
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # 保存文件
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # 返回相对路径
        relative_path = f"/uploads/screenshots/{unique_filename}"
        
        logger.info(f"User '{current_user.username}' uploaded screenshot: {relative_path}")
        
        return {
            "filename": unique_filename,
            "path": relative_path,
            "size": len(contents)
        }
    except Exception as e:
        logger.error(f"Failed to save uploaded file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="文件保存失败"
        )
