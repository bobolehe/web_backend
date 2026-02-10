# 克隆管理系统 (Clone Management System)

一个基于 Python + FastAPI 的网页克隆管理平台，支持通过 Playwright 克隆网页，并通过自定义域名提供访问。

## 功能特性

- 🌐 **网页克隆**: 使用 Playwright 自动克隆网页的样式和功能
- 🔗 **域名路由**: 支持自定义域名访问克隆页面
- 📊 **访问监控**: 记录和分析访问日志
- 📧 **邮件通知**: 克隆任务完成/失败时发送邮件通知
- ⚙️ **系统配置**: 灵活的系统参数和功能开关配置
- 🔐 **安全认证**: JWT 认证保护管理接口

## 技术栈

- **后端**: Python 3.10+, FastAPI, SQLAlchemy
- **数据库**: PostgreSQL
- **浏览器自动化**: Playwright
- **认证**: JWT (python-jose)
- **邮件**: aiosmtplib
- **测试**: Pytest, Hypothesis

## 快速开始

### 1. 环境要求

- Python 3.10 或更高版本
- SQLite (Python 自带，无需额外安装)
- Node.js (用于 Playwright)

**注意**: 如果需要使用 PostgreSQL，请修改 `.env` 文件中的 `DATABASE_URL` 并安装 `psycopg2-binary`。

### 2. 安装依赖

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\\Scripts\\activate
# Linux/Mac
source venv/bin/activate

# 安装 Python 依赖
pip install -r requirements.txt

# 安装 Playwright 浏览器
playwright install chromium
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接等参数
```

### 4. 初始化数据库

```bash
# 运行数据库迁移
alembic upgrade head
```

### 5. 启动应用

```bash
# 开发模式
python app/main.py

# 或使用 uvicorn
uvicorn app.main:app --reload
```

应用将在 http://localhost:8000 启动

### 6. 访问 API 文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 项目结构

```
clone-management-system/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 应用入口
│   ├── config.py            # 配置管理
│   ├── database.py          # 数据库连接
│   ├── logger.py            # 日志配置
│   ├── models/              # 数据模型
│   ├── schemas/             # Pydantic 模式
│   ├── services/            # 业务逻辑服务
│   ├── routers/             # API 路由
│   └── middleware/          # 中间件
├── tests/                   # 测试文件
├── alembic/                 # 数据库迁移
├── cloned_content/          # 克隆内容存储
├── requirements.txt         # Python 依赖
├── .env.example             # 环境变量模板
└── README.md
```

## 开发指南

### 运行测试

```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_projects.py

# 运行属性测试
pytest tests/property_tests/

# 查看测试覆盖率
pytest --cov=app tests/
```

### 数据库迁移

```bash
# 创建新迁移
alembic revision --autogenerate -m "描述"

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

## API 文档

详细的 API 文档请访问 `/docs` 端点查看 Swagger UI。

主要 API 端点：

- `POST /api/auth/login` - 用户登录
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建克隆项目
- `GET /api/logs` - 获取访问日志
- `GET /api/logs/stats` - 获取统计数据
- `GET /api/config` - 获取系统配置
- `PUT /api/config` - 更新系统配置

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
