# 部署到EdgeOne平台详细指南

## 准备工作

### 1. 注册和配置服务

#### Turso数据库设置
1. 访问 [Turso官网](https://turso.tech/)
2. 注册免费账户
3. 创建新的数据库实例
4. 获取以下信息：
   - Database URL (格式类似: `libsql://your-db-name.turso.io`)
   - Authentication Token

#### EdgeOne平台设置
1. 访问 [EdgeOne控制台](https://edgeone.cloud/)
2. 注册账户并完成实名认证
3. 安装EdgeOne CLI工具

#### Twikoo评论系统设置
1. 访问 [Twikoo官网](https://twikoo.js.org/)
2. 按照文档创建评论环境
3. 获取环境ID

### 2. 安装EdgeOne CLI

```bash
# Windows (使用PowerShell)
iwr https://edgeone.cloud/install.ps1 -useb | iex

# macOS/Linux
curl -fsSL https://edgeone.cloud/install.sh | sh
```

验证安装：
```bash
edgeone --version
```

### 3. 本地环境配置

1. 复制环境配置文件：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入实际配置：
   ```env
   # 数据库配置
   DATABASE_URL=你的Turso数据库URL
   DATABASE_TOKEN=你的数据库Token
   
   # 安全配置
   JWT_SECRET=生成的强随机字符串
   
   # 管理员账户
   ADMIN_USERNAME=你的管理员用户名
   ADMIN_PASSWORD=你的安全密码
   
   # Twikoo配置
   TWIKOO_ENV_ID=你的Twikoo环境ID
   ```

## 部署步骤

### 方法一：使用自动化脚本（推荐）

#### Windows用户
```cmd
deploy-edgeone.bat
```

#### Linux/macOS用户
```bash
chmod +x deploy-edgeone.sh
./deploy-edgeone.sh
```

### 方法二：手动部署

1. **登录EdgeOne**
   ```bash
   edgeone login
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署应用**
   ```bash
   edgeone deploy --config edgeone.config.json
   ```

## EdgeOne控制台配置

### 1. 环境变量设置

在EdgeOne控制台中：

1. 进入应用管理页面
2. 选择你的博客应用
3. 点击"环境变量"选项卡
4. 添加以下变量：

```
DATABASE_URL = libsql://your-database.turso.io
DATABASE_TOKEN = your-database-token
JWT_SECRET = your-jwt-secret
ADMIN_USERNAME = your-admin-username
ADMIN_PASSWORD = your-admin-password
TWIKOO_ENV_ID = your-twikoo-env-id
NODE_ENV = production
PORT = 8080
```

### 2. 域名配置

1. 在EdgeOne控制台申请自定义域名
2. 配置DNS解析记录
3. 启用HTTPS证书

### 3. 性能优化

在应用设置中调整：
- 实例数量：根据预期流量调整
- CPU和内存：根据实际使用情况优化
- 缓存策略：启用静态资源缓存

## 部署后验证

### 1. 基础功能测试

访问你的博客网站，检查：
- [ ] 首页正常加载
- [ ] 文章列表显示正常
- [ ] 文章详情页可访问
- [ ] 响应式布局正常

### 2. 管理功能测试

1. 访问 `/login` 页面
2. 使用配置的管理员账户登录
3. 测试以下功能：
   - [ ] 创建新文章
   - [ ] 编辑现有文章
   - [ ] 删除文章
   - [ ] 查看统计数据

### 3. 数据库验证

检查数据库中是否正确创建了表结构和初始数据。

## 常见问题解决

### 1. 部署失败

**问题**: 部署过程中出现错误
**解决方案**: 
- 检查 `edgeone.config.json` 配置是否正确
- 确认所有依赖包已正确安装
- 查看EdgeOne控制台的详细错误日志

### 2. 数据库连接失败

**问题**: 应用无法连接到Turso数据库
**解决方案**:
- 验证 `DATABASE_URL` 和 `DATABASE_TOKEN` 是否正确
- 检查Turso控制台中的数据库状态
- 确认网络连接正常

### 3. 环境变量未生效

**问题**: 配置的环境变量没有被应用读取
**解决方案**:
- 在EdgeOne控制台重新保存环境变量
- 重新部署应用
- 检查变量名称是否完全匹配

### 4. 静态资源加载失败

**问题**: CSS、JS等静态文件404
**解决方案**:
- 确认构建过程完成且无错误
- 检查 `dist/client` 目录是否存在正确文件
- 验证EdgeOne的静态文件服务配置

## 监控和维护

### 1. 日志查看

```bash
# 查看应用日志
edgeone logs --app mu-blog

# 实时跟踪日志
edgeone logs --app mu-blog --follow
```

### 2. 性能监控

在EdgeOne控制台查看：
- CPU和内存使用率
- 网络流量统计
- 响应时间监控
- 错误率统计

### 3. 定期维护

- 定期更新依赖包版本
- 轮换JWT密钥和管理员密码
- 备份重要数据
- 监控应用性能指标

## 故障排除

### 应急回滚

如果新版本出现问题：

```bash
# 查看部署历史
edgeone deployments list --app mu-blog

# 回滚到指定版本
edgeone rollback --app mu-blog --deployment-id DEPLOYMENT_ID
```

### 联系支持

遇到技术问题时：
1. 查阅EdgeOne官方文档
2. 在社区论坛寻求帮助
3. 联系技术支持团队