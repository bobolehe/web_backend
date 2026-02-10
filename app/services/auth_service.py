"""
认证服务
处理密码哈希、JWT token 生成和验证
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.models import AdminUser
from app.logger import logger

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """认证服务类"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        验证密码
        
        Args:
            plain_password: 明文密码
            hashed_password: 哈希密码
            
        Returns:
            密码是否匹配
        """
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """
        生成密码哈希
        
        Args:
            password: 明文密码
            
        Returns:
            哈希后的密码
        """
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        创建 JWT access token
        
        Args:
            data: 要编码的数据
            expires_delta: 过期时间增量
            
        Returns:
            JWT token 字符串
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """
        验证 JWT token
        
        Args:
            token: JWT token 字符串
            
        Returns:
            解码后的 payload，如果验证失败返回 None
        """
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return payload
        except JWTError as e:
            logger.warning(f"Token verification failed: {e}")
            return None
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[AdminUser]:
        """
        认证用户
        
        Args:
            db: 数据库会话
            username: 用户名
            password: 密码
            
        Returns:
            认证成功返回用户对象，失败返回 None
        """
        user = db.query(AdminUser).filter(AdminUser.username == username).first()
        
        if not user:
            logger.info(f"Authentication failed: user '{username}' not found")
            return None
        
        if not AuthService.verify_password(password, user.password_hash):
            logger.info(f"Authentication failed: invalid password for user '{username}'")
            return None
        
        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        db.commit()
        
        logger.info(f"User '{username}' authenticated successfully")
        return user
    
    @staticmethod
    def get_current_user(db: Session, token: str) -> Optional[AdminUser]:
        """
        从 token 获取当前用户
        
        Args:
            db: 数据库会话
            token: JWT token
            
        Returns:
            用户对象，如果验证失败返回 None
        """
        payload = AuthService.verify_token(token)
        
        if payload is None:
            return None
        
        username: str = payload.get("sub")
        if username is None:
            return None
        
        user = db.query(AdminUser).filter(AdminUser.username == username).first()
        return user
    
    @staticmethod
    def create_user(db: Session, username: str, password: str, email: Optional[str] = None) -> AdminUser:
        """
        创建新用户
        
        Args:
            db: 数据库会话
            username: 用户名
            password: 密码
            email: 邮箱（可选）
            
        Returns:
            创建的用户对象
        """
        hashed_password = AuthService.get_password_hash(password)
        user = AdminUser(
            username=username,
            password_hash=hashed_password,
            email=email
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        logger.info(f"User '{username}' created successfully")
        return user
