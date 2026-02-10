"""
数据模型单元测试
"""
import pytest
from datetime import datetime
from app.models import Project, ProjectStatus, AccessLog, SystemConfig, FeatureFlag, AdminUser


def test_project_creation(db_session):
    """测试创建项目"""
    project = Project(
        name="Test Project",
        domain="test.example.com",
        source_url="https://example.com",
        status=ProjectStatus.PENDING
    )
    db_session.add(project)
    db_session.commit()
    
    assert project.id is not None
    assert project.name == "Test Project"
    assert project.domain == "test.example.com"
    assert project.status == ProjectStatus.PENDING
    assert project.created_at is not None


def test_access_log_creation(db_session):
    """测试创建访问日志"""
    # 先创建一个项目
    project = Project(
        name="Test Project",
        domain="test.example.com",
        status=ProjectStatus.COMPLETED
    )
    db_session.add(project)
    db_session.commit()
    
    # 创建访问日志
    log = AccessLog(
        project_id=project.id,
        domain="test.example.com",
        ip="192.168.1.1",
        user_agent="Mozilla/5.0",
        path="/index.html"
    )
    db_session.add(log)
    db_session.commit()
    
    assert log.id is not None
    assert log.project_id == project.id
    assert log.ip == "192.168.1.1"
    assert log.timestamp is not None


def test_system_config_creation(db_session):
    """测试创建系统配置"""
    config = SystemConfig(
        key="test_key",
        value="test_value",
        description="Test configuration"
    )
    db_session.add(config)
    db_session.commit()
    
    assert config.key == "test_key"
    assert config.value == "test_value"
    assert config.updated_at is not None


def test_feature_flag_creation(db_session):
    """测试创建功能开关"""
    flag = FeatureFlag(
        name="test_feature",
        enabled=True,
        description="Test feature flag"
    )
    db_session.add(flag)
    db_session.commit()
    
    assert flag.name == "test_feature"
    assert flag.enabled is True
    assert flag.updated_at is not None


def test_admin_user_creation(db_session):
    """测试创建管理员用户"""
    user = AdminUser(
        username="admin",
        password_hash="hashed_password",
        email="admin@example.com"
    )
    db_session.add(user)
    db_session.commit()
    
    assert user.id is not None
    assert user.username == "admin"
    assert user.email == "admin@example.com"
    assert user.created_at is not None


def test_project_status_enum():
    """测试项目状态枚举"""
    assert ProjectStatus.PENDING.value == "pending"
    assert ProjectStatus.CLONING.value == "cloning"
    assert ProjectStatus.COMPLETED.value == "completed"
    assert ProjectStatus.FAILED.value == "failed"
