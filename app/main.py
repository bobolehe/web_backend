"""
FastAPI 应用主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.logger import logger
from app.database import init_db
from app.routers import auth, projects
from app.routers import upload
from app.middleware.domain_router import DomainRouterMiddleware
import os

# 创建 FastAPI 应用实例
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加域名路由中间件
app.add_middleware(DomainRouterMiddleware)

# 注册路由
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(upload.router)

# 挂载静态文件目录
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 挂载上传文件目录
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# 挂载克隆网站目录
cloned_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cloned_sites")
if os.path.exists(cloned_dir):
    app.mount("/cloned", StaticFiles(directory=cloned_dir, html=True), name="cloned")


@app.on_event("startup")
async def startup_event():
    """应用启动事件"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully")
    
    # 重启所有已完成项目的 HTTP 服务器
    from app.database import SessionLocal
    from app.models.project import Project, ProjectStatus
    from app.services.server_manager import ServerManager
    from pathlib import Path
    
    logger.info("Restarting HTTP servers for completed projects...")
    db = SessionLocal()
    try:
        completed_projects = db.query(Project).filter(
            Project.status == ProjectStatus.COMPLETED,
            Project.content_path.isnot(None)
        ).all()
        
        restarted_count = 0
        for project in completed_projects:
            try:
                project_dir = Path("cloned_sites") / project.id
                if not project_dir.exists():
                    logger.warning(f"Project directory not found: {project_dir}")
                    continue
                
                # 从域名中解析端口
                preferred_port = None
                if project.domain and ':' in project.domain:
                    parts = project.domain.split(':')
                    try:
                        preferred_port = int(parts[-1])
                    except ValueError:
                        pass
                
                # 启动服务器（带反向代理）
                port = ServerManager.start_server(
                    project.id, 
                    project_dir, 
                    preferred_port,
                    source_url=project.source_url  # 传递源 URL 用于代理
                )
                
                if port:
                    if project.port != str(port):
                        # 更新数据库中的端口信息
                        project.port = str(port)
                        db.commit()
                    restarted_count += 1
                else:
                    logger.warning(f"Failed to start server for project {project.id}")
                    
            except Exception as e:
                logger.error(f"Error restarting server for project {project.id}: {str(e)}")
                continue
                    
        logger.info(f"Restarted {restarted_count} HTTP servers")
    except Exception as e:
        logger.error(f"Error restarting servers: {str(e)}")
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    from app.services.server_manager import ServerManager
    
    logger.info(f"Shutting down {settings.app_name}")
    logger.info("Stopping all HTTP servers...")
    ServerManager.stop_all_servers()
    logger.info("All HTTP servers stopped")


@app.get("/")
async def root():
    """根路径返回前端页面"""
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8845,
        reload=settings.debug
    )
