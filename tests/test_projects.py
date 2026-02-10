"""
克隆项目管理测试
"""
import pytest
from sqlalchemy.orm import Session
from app.models.project import Project, ProjectStatus
from app.services.project_service import ProjectService
from app.utils.validators import validate_url, validate_domain, validate_project_name


class TestProjectService:
    """测试项目服务"""
    
    def test_create_project(self, db_session: Session):
        """测试创建项目"""
        project = ProjectService.create_project(
            db=db_session,
            name="测试项目",
            domain="test.example.com",
            source_url="https://example.com",
            source_screenshot="/path/to/screenshot.png"
        )
        
        assert project.id is not None
        assert project.name == "测试项目"
        assert project.domain == "test.example.com"
        assert project.source_url == "https://example.com"
        assert project.source_screenshot == "/path/to/screenshot.png"
        assert project.status == ProjectStatus.PENDING
        assert project.content_path is None
        assert project.error_message is None
    
    def test_create_project_minimal(self, db_session: Session):
        """测试创建最小项目（仅必填字段）"""
        project = ProjectService.create_project(
            db=db_session,
            name="最小项目",
            domain="minimal.example.com"
        )
        
        assert project.id is not None
        assert project.name == "最小项目"
        assert project.domain == "minimal.example.com"
        assert project.source_url is None
        assert project.source_screenshot is None
        assert project.status == ProjectStatus.PENDING
    
    def test_get_project(self, db_session: Session):
        """测试获取项目"""
        # 创建项目
        created = ProjectService.create_project(
            db=db_session,
            name="获取测试",
            domain="get.example.com"
        )
        
        # 获取项目
        project = ProjectService.get_project(db_session, created.id)
        
        assert project is not None
        assert project.id == created.id
        assert project.name == "获取测试"
    
    def test_get_project_not_found(self, db_session: Session):
        """测试获取不存在的项目"""
        project = ProjectService.get_project(db_session, "nonexistent-id")
        assert project is None
    
    def test_get_project_by_domain(self, db_session: Session):
        """测试通过域名获取项目"""
        # 创建项目
        created = ProjectService.create_project(
            db=db_session,
            name="域名测试",
            domain="domain.example.com"
        )
        
        # 通过域名获取
        project = ProjectService.get_project_by_domain(db_session, "domain.example.com")
        
        assert project is not None
        assert project.id == created.id
        assert project.domain == "domain.example.com"
    
    def test_get_project_by_domain_not_found(self, db_session: Session):
        """测试通过不存在的域名获取项目"""
        project = ProjectService.get_project_by_domain(db_session, "nonexistent.example.com")
        assert project is None
    
    def test_get_projects_pagination(self, db_session: Session):
        """测试项目列表分页"""
        # 创建多个项目
        for i in range(5):
            ProjectService.create_project(
                db=db_session,
                name=f"项目{i}",
                domain=f"project{i}.example.com"
            )
        
        # 获取第一页
        projects, total = ProjectService.get_projects(db_session, skip=0, limit=2)
        assert len(projects) == 2
        assert total == 5
        
        # 获取第二页
        projects, total = ProjectService.get_projects(db_session, skip=2, limit=2)
        assert len(projects) == 2
        assert total == 5
        
        # 获取第三页
        projects, total = ProjectService.get_projects(db_session, skip=4, limit=2)
        assert len(projects) == 1
        assert total == 5
    
    def test_get_projects_filter_by_status(self, db_session: Session):
        """测试按状态过滤项目"""
        # 创建不同状态的项目
        p1 = ProjectService.create_project(db_session, "项目1", "p1.example.com")
        p2 = ProjectService.create_project(db_session, "项目2", "p2.example.com")
        p3 = ProjectService.create_project(db_session, "项目3", "p3.example.com")
        
        # 更新状态
        ProjectService.update_project_status(db_session, p2.id, ProjectStatus.CLONING)
        ProjectService.update_project_status(db_session, p3.id, ProjectStatus.COMPLETED, content_path="/path/to/content")
        
        # 过滤 PENDING 状态
        projects, total = ProjectService.get_projects(db_session, status=ProjectStatus.PENDING)
        assert total == 1
        assert projects[0].id == p1.id
        
        # 过滤 CLONING 状态
        projects, total = ProjectService.get_projects(db_session, status=ProjectStatus.CLONING)
        assert total == 1
        assert projects[0].id == p2.id
        
        # 过滤 COMPLETED 状态
        projects, total = ProjectService.get_projects(db_session, status=ProjectStatus.COMPLETED)
        assert total == 1
        assert projects[0].id == p3.id
    
    def test_update_project(self, db_session: Session):
        """测试更新项目"""
        # 创建项目
        project = ProjectService.create_project(
            db=db_session,
            name="原始名称",
            domain="original.example.com",
            source_url="https://original.com"
        )
        
        # 更新项目
        updated = ProjectService.update_project(
            db=db_session,
            project_id=project.id,
            name="新名称",
            domain="new.example.com",
            source_url="https://new.com"
        )
        
        assert updated.id == project.id
        assert updated.name == "新名称"
        assert updated.domain == "new.example.com"
        assert updated.source_url == "https://new.com"
    
    def test_update_project_partial(self, db_session: Session):
        """测试部分更新项目"""
        # 创建项目
        project = ProjectService.create_project(
            db=db_session,
            name="原始名称",
            domain="original.example.com",
            source_url="https://original.com"
        )
        
        # 仅更新名称
        updated = ProjectService.update_project(
            db=db_session,
            project_id=project.id,
            name="新名称"
        )
        
        assert updated.name == "新名称"
        assert updated.domain == "original.example.com"  # 未改变
        assert updated.source_url == "https://original.com"  # 未改变
    
    def test_update_project_source_url_resets_status(self, db_session: Session):
        """测试更新源网址会重置状态"""
        # 创建项目并设置为完成状态
        project = ProjectService.create_project(
            db=db_session,
            name="测试项目",
            domain="test.example.com",
            source_url="https://original.com"
        )
        ProjectService.update_project_status(
            db_session, project.id, ProjectStatus.COMPLETED, content_path="/path/to/content"
        )
        
        # 更新源网址
        updated = ProjectService.update_project(
            db=db_session,
            project_id=project.id,
            source_url="https://new.com"
        )
        
        # 状态应该重置为 PENDING
        assert updated.status == ProjectStatus.PENDING
        assert updated.content_path is None
        assert updated.error_message is None
    
    def test_update_project_status(self, db_session: Session):
        """测试更新项目状态"""
        # 创建项目
        project = ProjectService.create_project(
            db=db_session,
            name="状态测试",
            domain="status.example.com"
        )
        
        # 更新为 CLONING
        updated = ProjectService.update_project_status(db_session, project.id, ProjectStatus.CLONING)
        assert updated.status == ProjectStatus.CLONING
        
        # 更新为 COMPLETED
        updated = ProjectService.update_project_status(
            db_session, project.id, ProjectStatus.COMPLETED, content_path="/path/to/content"
        )
        assert updated.status == ProjectStatus.COMPLETED
        assert updated.content_path == "/path/to/content"
        assert updated.error_message is None
        
        # 更新为 FAILED
        updated = ProjectService.update_project_status(
            db_session, project.id, ProjectStatus.FAILED, error_message="克隆失败"
        )
        assert updated.status == ProjectStatus.FAILED
        assert updated.error_message == "克隆失败"
    
    def test_delete_project(self, db_session: Session):
        """测试删除项目"""
        # 创建项目
        project = ProjectService.create_project(
            db=db_session,
            name="删除测试",
            domain="delete.example.com"
        )
        
        # 删除项目
        success = ProjectService.delete_project(db_session, project.id)
        assert success is True
        
        # 验证项目已删除
        deleted = ProjectService.get_project(db_session, project.id)
        assert deleted is None
    
    def test_delete_project_not_found(self, db_session: Session):
        """测试删除不存在的项目"""
        success = ProjectService.delete_project(db_session, "nonexistent-id")
        assert success is False


class TestValidators:
    """测试输入验证器"""
    
    def test_validate_url_valid(self):
        """测试有效的 URL"""
        valid_urls = [
            "http://example.com",
            "https://example.com",
            "https://www.example.com",
            "https://example.com/path",
            "https://example.com/path?query=value",
            "https://sub.example.com:8080/path"
        ]
        
        for url in valid_urls:
            is_valid, error = validate_url(url)
            assert is_valid, f"URL '{url}' should be valid, but got error: {error}"
    
    def test_validate_url_invalid(self):
        """测试无效的 URL"""
        invalid_urls = [
            "",
            "   ",
            "example.com",  # 缺少协议
            "ftp://example.com",  # 不支持的协议
            "http://",  # 缺少域名
            "://example.com"  # 缺少协议名
        ]
        
        for url in invalid_urls:
            is_valid, error = validate_url(url)
            assert not is_valid, f"URL '{url}' should be invalid"
            assert error != "", f"Should have error message for '{url}'"
    
    def test_validate_domain_valid(self):
        """测试有效的域名"""
        valid_domains = [
            "example.com",
            "www.example.com",
            "sub.example.com",
            "example.co.uk",
            "test-domain.com",
            "a.b.c.example.com"
        ]
        
        for domain in valid_domains:
            is_valid, error = validate_domain(domain)
            assert is_valid, f"Domain '{domain}' should be valid, but got error: {error}"
    
    def test_validate_domain_invalid(self):
        """测试无效的域名"""
        invalid_domains = [
            "",
            "   ",
            "example",  # 缺少顶级域名
            "-example.com",  # 以连字符开头
            "example-.com",  # 以连字符结尾
            ".example.com",  # 以点开头
            "example..com",  # 连续的点
            "example.com.",  # 以点结尾
            "example .com",  # 包含空格
            "a" * 64 + ".com"  # 标签过长
        ]
        
        for domain in invalid_domains:
            is_valid, error = validate_domain(domain)
            assert not is_valid, f"Domain '{domain}' should be invalid"
            assert error != "", f"Should have error message for '{domain}'"
    
    def test_validate_project_name_valid(self):
        """测试有效的项目名称"""
        valid_names = [
            "测试项目",
            "Test Project",
            "项目123",
            "My-Project_2024"
        ]
        
        for name in valid_names:
            is_valid, error = validate_project_name(name)
            assert is_valid, f"Name '{name}' should be valid, but got error: {error}"
    
    def test_validate_project_name_invalid(self):
        """测试无效的项目名称"""
        invalid_names = [
            "",
            "   ",
            "A",  # 太短
            "A" * 101  # 太长
        ]
        
        for name in invalid_names:
            is_valid, error = validate_project_name(name)
            assert not is_valid, f"Name '{name}' should be invalid"
            assert error != "", f"Should have error message for '{name}'"
