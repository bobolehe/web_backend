// API 基础 URL
const API_BASE = '';

// 全局变量
let token = localStorage.getItem('token');
let currentUser = null;
let projectModal = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
    
    // 绑定登录表单
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 绑定注册表单
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // 初始化文件上传
    initFileUpload();
    
    // 检查是否已登录
    if (token) {
        checkAuth();
    } else {
        showLogin();
    }
});

// 显示登录页面
function showLogin() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'none';
}

// 显示注册页面
function showRegister() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'block';
    document.getElementById('mainPage').style.display = 'none';
}

// 显示主页面
function showMain() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            token = data.access_token;
            localStorage.setItem('token', token);
            
            await checkAuth();
            showSuccess('登录成功！');
        } else {
            const error = await response.json();
            // 处理不同格式的错误信息
            let errorMsg = '登录失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            } else if (Array.isArray(error.detail)) {
                errorMsg = error.detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
            } else if (error.detail) {
                errorMsg = JSON.stringify(error.detail);
            }
            showError(errorMsg);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Login error:', error);
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            showSuccess('注册成功！请登录');
            showLogin();
            document.getElementById('loginUsername').value = username;
        } else {
            const error = await response.json();
            // 处理不同格式的错误信息
            let errorMsg = '注册失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            } else if (Array.isArray(error.detail)) {
                errorMsg = error.detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
            } else if (error.detail) {
                errorMsg = JSON.stringify(error.detail);
            }
            showError(errorMsg);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Register error:', error);
    }
}

// 检查认证状态
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('username').textContent = currentUser.username;
            showMain();
            loadProjects();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        logout();
    }
}

// 退出登录
function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    showLogin();
}

// 加载项目列表
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/api/projects`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            renderProjects(data.items);
        } else {
            showError('加载项目列表失败');
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Load projects error:', error);
    }
}

// 渲染项目列表
function renderProjects(projects) {
    const tbody = document.getElementById('projectList');
    
    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">暂无项目</td></tr>';
        return;
    }
    
    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>${escapeHtml(project.name)}</td>
            <td><code>${escapeHtml(project.domain)}</code></td>
            <td>${project.source_url ? `<a href="${escapeHtml(project.source_url)}" target="_blank">${escapeHtml(project.source_url)}</a>` : '-'}</td>
            <td>${getStatusBadge(project.status)}</td>
            <td>${formatDate(project.created_at)}</td>
            <td class="project-actions">
                ${project.status === 'pending' && project.source_url ? `
                    <button class="btn btn-sm btn-success" onclick="startClone('${project.id}')" title="开始克隆">
                        <i class="bi bi-play-fill"></i>
                    </button>
                ` : ''}
                ${project.status === 'failed' && project.source_url ? `
                    <button class="btn btn-sm btn-warning" onclick="startClone('${project.id}')" title="重试克隆">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                ` : ''}
                ${project.status === 'completed' && project.port ? `
                    <a href="http://127.0.0.1:${escapeHtml(project.port)}" target="_blank" class="btn btn-sm btn-info" title="访问 (端口 ${escapeHtml(project.port)})">
                        <i class="bi bi-box-arrow-up-right"></i> :${escapeHtml(project.port)}
                    </a>
                    <button class="btn btn-sm btn-warning" onclick="restartProject('${project.id}')" title="重新克隆并重启">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="stopServer('${project.id}')" title="停止服务器">
                        <i class="bi bi-stop-fill"></i>
                    </button>
                ` : ''}
                ${project.status === 'completed' && !project.port && project.content_path ? `
                    <button class="btn btn-sm btn-success" onclick="startServer('${project.id}')" title="启动服务器">
                        <i class="bi bi-play-fill"></i> 启动
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="restartProject('${project.id}')" title="重新克隆">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                ` : ''}
                ${project.status === 'completed' && project.content_path && !project.port ? `
                    <a href="${escapeHtml(project.content_path)}" target="_blank" class="btn btn-sm btn-info" title="查看">
                        <i class="bi bi-eye"></i>
                    </a>
                ` : ''}
                <button class="btn btn-sm btn-outline-primary" onclick="editProject('${project.id}')" title="编辑">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProject('${project.id}', '${escapeHtml(project.name)}')" title="删除">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 获取状态徽章
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge bg-secondary status-badge">待处理</span>',
        'cloning': '<span class="badge bg-primary status-badge"><span class="spinner-border spinner-border-sm me-1"></span>克隆中</span>',
        'completed': '<span class="badge bg-success status-badge">已完成</span>',
        'failed': '<span class="badge bg-danger status-badge">失败</span>'
    };
    return badges[status] || status;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 显示创建项目模态框
function showCreateModal() {
    document.getElementById('projectModalTitle').textContent = '创建项目';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    clearScreenshot(); // 清除截图预览
    projectModal.show();
}

// 编辑项目
async function editProject(projectId) {
    try {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const project = await response.json();
            document.getElementById('projectModalTitle').textContent = '编辑项目';
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectDomain').value = project.domain;
            document.getElementById('projectUrl').value = project.source_url || '';
            document.getElementById('projectScreenshot').value = project.source_screenshot || '';
            
            // 显示截图预览
            if (project.source_screenshot) {
                const uploadPlaceholder = document.getElementById('uploadPlaceholder');
                const uploadPreview = document.getElementById('uploadPreview');
                const previewImage = document.getElementById('previewImage');
                
                previewImage.src = project.source_screenshot;
                uploadPlaceholder.style.display = 'none';
                uploadPreview.style.display = 'block';
            } else {
                clearScreenshot();
            }
            
            projectModal.show();
        } else {
            showError('加载项目信息失败');
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Edit project error:', error);
    }
}

// 保存项目
async function saveProject() {
    const projectId = document.getElementById('projectId').value;
    const name = document.getElementById('projectName').value.trim();
    const domain = document.getElementById('projectDomain').value.trim();
    const source_url = document.getElementById('projectUrl').value.trim() || null;
    const source_screenshot = document.getElementById('projectScreenshot').value.trim() || null;
    
    if (!name || !domain) {
        showError('请填写必填字段');
        return;
    }
    
    const data = { name, domain, source_url, source_screenshot };
    
    try {
        const url = projectId ? `${API_BASE}/api/projects/${projectId}` : `${API_BASE}/api/projects`;
        const method = projectId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showSuccess(projectId ? '项目更新成功' : '项目创建成功');
            projectModal.hide();
            loadProjects();
        } else {
            const error = await response.json();
            // 处理不同格式的错误信息
            let errorMsg = '保存失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            } else if (Array.isArray(error.detail)) {
                errorMsg = error.detail.map(e => {
                    if (typeof e === 'string') return e;
                    if (e.msg) return `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`;
                    return JSON.stringify(e);
                }).join('; ');
            } else if (error.detail && typeof error.detail === 'object') {
                errorMsg = JSON.stringify(error.detail);
            } else if (error.message) {
                errorMsg = error.message;
            }
            showError(errorMsg);
            console.error('Save error:', error);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Save project error:', error);
    }
}

// 删除项目
async function deleteProject(projectId, projectName) {
    if (!confirm(`确定要删除项目"${projectName}"吗？此操作不可恢复。`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showSuccess('项目删除成功');
            loadProjects();
        } else {
            const error = await response.json();
            showError(error.detail || '删除失败');
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Delete project error:', error);
    }
}

// 显示成功消息
function showSuccess(message) {
    alert(message); // 简单实现，可以后续改为 toast 通知
}

// 显示错误消息
function showError(message) {
    alert('错误: ' + message);
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化文件上传
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('screenshotFile');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadProgress = document.getElementById('uploadProgress');
    const previewImage = document.getElementById('previewImage');
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', function(e) {
        if (e.target.closest('.btn-danger')) return; // 忽略删除按钮的点击
        fileInput.click();
    });
    
    // 文件选择后处理
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // 拖拽事件
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        } else {
            showError('请上传图片文件');
        }
    });
}

// 处理文件上传
async function handleFileUpload(file) {
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadProgress = document.getElementById('uploadProgress');
    const previewImage = document.getElementById('previewImage');
    const screenshotInput = document.getElementById('projectScreenshot');
    
    // 显示上传进度
    uploadPlaceholder.style.display = 'none';
    uploadPreview.style.display = 'none';
    uploadProgress.style.display = 'block';
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE}/api/upload/screenshot`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // 显示预览
            previewImage.src = data.path;
            screenshotInput.value = data.path;
            
            uploadProgress.style.display = 'none';
            uploadPreview.style.display = 'block';
        } else {
            const error = await response.json();
            let errorMsg = '上传失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            }
            showError(errorMsg);
            
            // 恢复初始状态
            uploadProgress.style.display = 'none';
            uploadPlaceholder.style.display = 'block';
        }
    } catch (error) {
        showError('上传失败，请稍后重试');
        console.error('Upload error:', error);
        
        // 恢复初始状态
        uploadProgress.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
    }
}

// 清除截图
function clearScreenshot() {
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const screenshotInput = document.getElementById('projectScreenshot');
    const fileInput = document.getElementById('screenshotFile');
    
    previewImage.src = '';
    screenshotInput.value = '';
    fileInput.value = '';
    
    uploadPreview.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
}


// 开始克隆项目
async function startClone(projectId) {
    if (!confirm('确定要开始克隆此项目吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}/clone`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showSuccess('克隆任务已启动，请稍后刷新查看结果');
            // 3秒后自动刷新项目列表
            setTimeout(() => {
                loadProjects();
            }, 3000);
        } else {
            const error = await response.json();
            let errorMsg = '启动克隆失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            }
            showError(errorMsg);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Start clone error:', error);
    }
}

// 重新克隆并重启项目
async function restartProject(projectId) {
    if (!confirm('确定要重新克隆此项目吗？这将停止当前服务器并重新克隆网站。')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}/restart`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showSuccess('重新克隆任务已启动，请稍后刷新查看结果');
            // 3秒后自动刷新项目列表
            setTimeout(() => {
                loadProjects();
            }, 3000);
        } else {
            const error = await response.json();
            let errorMsg = '重新克隆失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            }
            showError(errorMsg);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Restart project error:', error);
    }
}

// 启动服务器
async function startServer(projectId) {
    try {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}/start`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            showSuccess(`服务器启动成功！端口: ${data.port}`);
            loadProjects();
        } else {
            const error = await response.json();
            let errorMsg = '启动服务器失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            }
            showError(errorMsg);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Start server error:', error);
    }
}

// 停止服务器
async function stopServer(projectId) {
    if (!confirm('确定要停止此项目的HTTP服务器吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/projects/${projectId}/stop`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            showSuccess('服务器已停止');
            loadProjects();
        } else {
            const error = await response.json();
            let errorMsg = '停止服务器失败';
            if (typeof error.detail === 'string') {
                errorMsg = error.detail;
            }
            showError(errorMsg);
        }
    } catch (error) {
        showError('网络错误，请稍后重试');
        console.error('Stop server error:', error);
    }
}
