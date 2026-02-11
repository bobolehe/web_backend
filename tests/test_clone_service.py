"""克隆服务测试"""
from app.services.clone_service import CloneService


class DummySession:
    def __init__(self):
        self.closed = False

    def close(self):
        self.closed = True


def test_extract_preferred_port():
    assert CloneService._extract_preferred_port("example.com:8080") == 8080
    assert CloneService._extract_preferred_port("127.0.0.1:7001") == 7001


def test_extract_preferred_port_invalid_cases():
    assert CloneService._extract_preferred_port("example.com") is None
    assert CloneService._extract_preferred_port("example.com:abc") is None
    assert CloneService._extract_preferred_port("example.com:70000") is None


def test_clone_website_uses_internal_session(monkeypatch):
    dummy_session = DummySession()

    def fake_session_local():
        return dummy_session

    def fake_clone_with_session(db, project_id):
        assert db is dummy_session
        assert project_id == "p-1"
        return True

    monkeypatch.setattr("app.services.clone_service.SessionLocal", fake_session_local)
    monkeypatch.setattr(CloneService, "_clone_website_with_session", fake_clone_with_session)

    result = CloneService.clone_website("p-1")

    assert result is True
    assert dummy_session.closed is True
