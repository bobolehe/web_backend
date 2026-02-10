"""
认证相关的 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse, CreateUserRequest
from app.config import settings
from app.logger import logger

router = APIRouter(prefix="/api/auth", tags=["认证"])

# OAuth2 密码流
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    获取当前认证用户的依赖函数
    """
    user = AuthService.get_current_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭证",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("/login", response_model=TokenResponse, summary="用户登录")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    用户登录接口
    
    - **username**: 用户名
    - **password**: 密码
    
    返回 JWT access token
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 创建 access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = AuthService.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    logger.info(f"User '{user.username}' logged in successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/logout", summary="用户登出")
async def logout(current_user = Depends(get_current_user)):
    """
    用户登出接口
    
    注意：JWT token 是无状态的，实际的登出需要在客户端删除 token
    """
    logger.info(f"User '{current_user.username}' logged out")
    return {"message": "登出成功"}


@router.get("/me", response_model=UserResponse, summary="获取当前用户信息")
async def get_me(current_user = Depends(get_current_user)):
    """
    获取当前登录用户的信息
    """
    return current_user


@router.post("/register", response_model=UserResponse, summary="注册新用户", status_code=status.HTTP_201_CREATED)
async def register(
    user_data: CreateUserRequest,
    db: Session = Depends(get_db)
):
    """
    注册新用户接口（仅用于开发/测试）
    
    - **username**: 用户名（3-100字符）
    - **password**: 密码（至少6字符）
    - **email**: 邮箱（可选）
    """
    # 检查用户名是否已存在
    from app.models import AdminUser
    existing_user = db.query(AdminUser).filter(AdminUser.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 创建新用户
    user = AuthService.create_user(
        db=db,
        username=user_data.username,
        password=user_data.password,
        email=user_data.email
    )
    
    return user
