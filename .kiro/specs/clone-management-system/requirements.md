# 需求文档

## 简介

克隆管理系统是一个后台管理平台，允许管理员创建和管理网页克隆项目，监控访问日志，并配置系统参数。用户可以提供截图、网址或域名，系统通过 Playwright 克隆网页的样式和功能，并通过自定义域名提供访问。

## 术语表

- **System**: 克隆管理系统
- **Clone_Project**: 克隆项目，包含源网址、目标域名、克隆内容等信息
- **Admin**: 系统管理员用户
- **Playwright**: 浏览器自动化工具，用于网页克隆
- **Access_Log**: 域名访问日志记录
- **Email_Config**: 邮件发送配置信息

## 需求

### 需求 1: 克隆项目管理

**用户故事:** 作为管理员，我想要创建和管理克隆项目，以便用户可以通过自定义域名访问克隆的网页。

#### 验收标准

1. WHEN 管理员提供源网址、截图或域名信息 THEN THE System SHALL 创建一个新的克隆项目记录
2. WHEN 克隆项目创建成功 THEN THE System SHALL 使用 Playwright 克隆目标网页的样式和功能
3. WHEN 管理员为克隆项目配置自定义域名 THEN THE System SHALL 将该域名绑定到克隆页面
4. WHEN 用户通过自定义域名访问 THEN THE System SHALL 返回克隆的网页内容
5. WHEN 管理员请求查看克隆项目列表 THEN THE System SHALL 显示所有克隆项目及其状态信息

### 需求 2: 克隆项目编辑与删除

**用户故事:** 作为管理员，我想要编辑或删除已有的克隆项目，以便维护和更新克隆内容。

#### 验收标准

1. WHEN 管理员选择编辑克隆项目 THEN THE System SHALL 允许修改源网址、域名和其他配置信息
2. WHEN 管理员更新克隆项目的源网址 THEN THE System SHALL 重新执行克隆操作
3. WHEN 管理员删除克隆项目 THEN THE System SHALL 移除该项目及其关联的域名绑定
4. WHEN 克隆项目被删除 THEN THE System SHALL 保留该项目的历史访问日志

### 需求 3: 克隆状态管理

**用户故事:** 作为管理员，我想要查看和管理克隆项目的状态，以便了解克隆任务的执行情况。

#### 验收标准

1. WHEN 克隆任务正在执行 THEN THE System SHALL 显示"进行中"状态
2. WHEN 克隆任务成功完成 THEN THE System SHALL 显示"已完成"状态
3. WHEN 克隆任务失败 THEN THE System SHALL 显示"失败"状态并记录错误信息
4. WHEN 管理员查看失败的克隆项目 THEN THE System SHALL 显示详细的错误信息
5. WHEN 管理员请求重试失败的克隆任务 THEN THE System SHALL 重新执行克隆操作

### 需求 4: 访问日志监控

**用户故事:** 作为管理员，我想要查看域名访问日志，以便监控克隆页面的使用情况。

#### 验收标准

1. WHEN 用户访问克隆页面 THEN THE System SHALL 记录访问时间、IP地址、用户代理和访问的域名
2. WHEN 管理员打开监控页面 THEN THE System SHALL 显示所有域名的访问日志列表
3. WHEN 管理员筛选特定域名的日志 THEN THE System SHALL 仅显示该域名的访问记录
4. WHEN 管理员筛选特定时间范围的日志 THEN THE System SHALL 仅显示该时间范围内的访问记录
5. WHEN 访问日志超过保留期限 THEN THE System SHALL 自动清理过期的日志记录

### 需求 5: 访问统计分析

**用户故事:** 作为管理员，我想要查看访问统计数据，以便分析克隆页面的流量情况。

#### 验收标准

1. WHEN 管理员查看监控页面 THEN THE System SHALL 显示每个域名的总访问次数
2. WHEN 管理员查看监控页面 THEN THE System SHALL 显示每个域名的独立访问者数量
3. WHEN 管理员选择时间范围 THEN THE System SHALL 显示该时间范围内的访问趋势图表
4. WHEN 管理员查看访问来源 THEN THE System SHALL 显示访问者的地理位置分布

### 需求 6: 系统配置管理

**用户故事:** 作为管理员，我想要配置系统参数，以便控制系统的行为和功能。

#### 验收标准

1. WHEN 管理员打开系统配置页面 THEN THE System SHALL 显示所有可配置的系统参数
2. WHEN 管理员修改系统配置 THEN THE System SHALL 验证配置值的有效性
3. WHEN 配置值无效 THEN THE System SHALL 显示错误提示并阻止保存
4. WHEN 管理员保存有效的配置 THEN THE System SHALL 更新系统配置并立即生效
5. WHEN 系统配置更新失败 THEN THE System SHALL 保留原有配置并显示错误信息

### 需求 7: 邮件配置管理

**用户故事:** 作为管理员，我想要配置邮件发送参数，以便系统可以发送通知邮件。

#### 验收标准

1. WHEN 管理员配置邮件服务器 THEN THE System SHALL 允许输入 SMTP 服务器地址、端口、用户名和密码
2. WHEN 管理员保存邮件配置 THEN THE System SHALL 验证 SMTP 连接是否可用
3. WHEN SMTP 连接验证失败 THEN THE System SHALL 显示错误信息并阻止保存
4. WHEN 邮件配置保存成功 THEN THE System SHALL 使用新配置发送测试邮件
5. WHEN 管理员启用邮件通知 THEN THE System SHALL 在克隆任务完成或失败时发送邮件通知

### 需求 8: 状态开关配置

**用户故事:** 作为管理员，我想要配置系统功能的启用状态，以便控制特定功能的开关。

#### 验收标准

1. WHEN 管理员查看系统配置 THEN THE System SHALL 显示所有功能开关及其当前状态
2. WHEN 管理员切换功能开关 THEN THE System SHALL 立即更新该功能的启用状态
3. WHEN 邮件通知功能被禁用 THEN THE System SHALL 停止发送所有邮件通知
4. WHEN 访问日志功能被禁用 THEN THE System SHALL 停止记录新的访问日志
5. WHEN 功能开关状态改变 THEN THE System SHALL 记录配置变更的操作日志

### 需求 9: 用户认证与授权

**用户故事:** 作为系统，我需要验证管理员身份，以便保护后台管理功能的安全性。

#### 验收标准

1. WHEN 未认证用户访问后台管理页面 THEN THE System SHALL 重定向到登录页面
2. WHEN 管理员提供正确的用户名和密码 THEN THE System SHALL 授予访问权限并跳转到管理页面
3. WHEN 管理员提供错误的凭证 THEN THE System SHALL 显示错误信息并拒绝访问
4. WHEN 管理员会话超时 THEN THE System SHALL 要求重新登录
5. WHEN 管理员登出 THEN THE System SHALL 清除会话并重定向到登录页面

### 需求 10: 数据持久化

**用户故事:** 作为系统，我需要持久化存储数据，以便在系统重启后保留所有配置和记录。

#### 验收标准

1. WHEN 克隆项目被创建或更新 THEN THE System SHALL 将数据持久化到数据库
2. WHEN 访问日志被记录 THEN THE System SHALL 将日志数据持久化到数据库
3. WHEN 系统配置被修改 THEN THE System SHALL 将配置持久化到数据库
4. WHEN 系统重启 THEN THE System SHALL 从数据库加载所有克隆项目、日志和配置
5. WHEN 数据库连接失败 THEN THE System SHALL 显示错误信息并阻止数据操作
