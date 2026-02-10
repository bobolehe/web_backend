"""
认证功能测试
"""
import pytest
from app.services.auth_service import AuthService
from app.models import AdminUser


def test_password_hashing():
    """测试密码哈希"""
    password = "test_password_123"
    hashed = AuthService.get_password_hash(password)
    
    assert hashed != password
    assert AuthService.verify_password(password, hashed)
    assert not AuthService.verify_password("wrong_password", hashed)


def test_create_access_token():
    """测试创建 JWT token"""
    data = {"sub": "testuser"}
    token = AuthService.create_access_token(data)
    
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_verify_token():
    """测试验证 JWT token"""
    data = {"sub": "testuser"}
    token = AuthService.create_access_token(data)
    
    payload = AuthService.verify_token(token)
    assert payload is not None
    assert payload["sub"] == "testuser"
    
    # 测试无效 token
    invalid_payload = AuthService.verify_token("invalid_token")
    assert invalid_payload is None


def test_create_user(db_session):
    """测试创建用户"""
    user = AuthService.create_user(
        db=db_session,
        username="testuser",
        password="password123",
        email="test@example.com"
    )
    
    assert user.id is not None
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.password_hash != "password123"
    assert AuthService.verify_password("password123", user.password_hash)


def test_authenticate_user(db_session):
    """测试用户认证"""
    # 创建测试用户
    AuthService.create_user(
        db=db_session,
        username="authtest",
        password="password123"
    )
    
    # 测试正确的凭证
    user = AuthService.authenticate_user(db_session, "authtest", "password123")
    assert user is not None
    assert user.username == "authtest"
    assert user.last_login is not None
    
    # 测试错误的密码
    user = AuthService.authenticate_user(db_session, "authtest", "wrong_password")
    assert user is None
    
    # 测试不存在的用户
    user = AuthService.authenticate_user(db_session, "nonexistent", "password123")
    assert user is None


def test_get_current_user(db_session):
    """测试从 token 获取当前用户"""
    # 创建测试用户
    created_user = AuthService.create_user(
        db=db_session,
        username="tokentest",
        password="password123"
    )
    
    # 创建 token
    token = AuthService.create_access_token({"sub": "tokentest"})
    
    # 从 token 获取用户
    user = AuthService.get_current_user(db_session, token)
    assert user is not None
    assert user.username == "tokentest"
    assert user.id == created_user.id
    
    # 测试无效 token
    user = AuthService.get_current_user(db_session, "invalid_token")
    assert user is None


def test_login_endpoint(client, db_session):
    """测试登录 API 端点"""
    # 创建测试用户
    AuthService.create_user(
        db=db_session,
        username="apitest",
        password="password123"
    )
    
    # 测试登录
    response = client.post(
        "/api/auth/login",
        data={"username": "apitest", "password": "password123"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    # 测试错误的密码
    response = client.post(
        "/api/auth/login",
        data={"username": "apitest", "password": "wrong_password"}
    )
    assert response.status_code == 401


def test_get_me_endpoint(client, db_session):
    """测试获取当前用户信息端点"""
    # 创建测试用户
    AuthService.create_user(
        db=db_session,
        username="metest",
        password="password123",
        email="me@example.com"
    )
    
    # 登录获取 token
    login_response = client.post(
        "/api/auth/login",
        data={"username": "metest", "password": "password123"}
    )
    token = login_response.json()["access_token"]
    
    # 获取当前用户信息
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "metest"
    assert data["email"] == "me@example.com"
    
    # 测试未认证访问
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_register_endpoint(client, db_session):
    """测试注册端点"""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "password": "password123",
            "email": "new@example.com"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    
    # 测试重复用户名
    response = client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "password": "password123"
        }
    )
    assert response.status_code == 400
