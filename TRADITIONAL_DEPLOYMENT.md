# EdgeOne 传统应用部署方案

## 🚨 当函数服务不可用时的替代方案

如果EdgeOne函数服务无法开通或使用，可以使用传统的应用部署方式。

## 📁 项目结构调整

### 1. 创建应用配置文件

已创建 `app.json` 文件，包含：
```json
{
  "name": "mu-blog",
  "version": "1.0.0", 
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "build": "vite build"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 2. 部署方式变更

从 **Pages + Functions** 改为 **传统应用部署**

## 🔧 部署步骤

### 步骤1: 在EdgeOne创建应用

1. 进入EdgeOne控制台
2. 选择"**应用托管**"或"**Web应用**"服务
3. 点击"**创建应用**"
4. 选择"**从代码仓库部署**"
5. 连接您的GitHub仓库

### 步骤2: 配置应用设置

```
应用名称: mu-blog
运行环境: Node.js 18
启动命令: npm start
构建命令: npm run build
发布目录: dist/client
```

### 步骤3: 配置环境变量

在应用设置中添加：
```
PORT=8080
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DATABASE_URL=your-turso-db-url
DATABASE_TOKEN=your-db-token
JWT_SECRET=your-jwt-secret
TWIKOO_ENV_ID=your-twikoo-id
```

### 步骤4: 部署应用

1. 点击"**部署**"按钮
2. 等待构建和部署完成
3. 获取应用访问域名

## 🧪 验证部署结果

### 1. 访问应用
```
https://your-app-domain.edgeone.app
```

### 2. 测试API功能
```bash
curl https://your-app-domain.edgeone.app/api/articles
curl -X POST https://your-app-domain.edgeone.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. 验证前端功能
- 首页正常显示
- 文章列表可访问
- 登录功能正常
- 管理后台可使用

## ⚠️ 注意事项

### 优势
- ✅ 无需函数服务支持
- ✅ 部署流程更简单
- ✅ 传统Node.js应用兼容性好

### 劣势
- ❌ 无法享受函数的按需计费优势
- ❌ 冷启动时间可能较长
- ❌ 扩缩容不如函数灵活

## 🆘 故障排除

### 问题1: 应用启动失败
**解决方案**:
- 检查 `server.js` 文件是否存在
- 确认环境变量配置正确
- 查看应用日志排查错误

### 问题2: 静态文件404
**解决方案**:
- 确认构建命令执行成功
- 检查发布目录配置
- 验证 `dist/client` 目录结构

### 问题3: 数据库连接失败
**解决方案**:
- 确认Turso数据库配置正确
- 检查网络连接和防火墙设置
- 验证数据库Token有效性

## 📊 成功标准

✅ 部署成功的标志：
- 应用状态显示"运行中"
- 前端页面正常访问
- API接口返回正确数据
- 登录和管理功能正常工作

这个方案可以绕过函数服务的限制，使用传统的应用部署方式实现相同的功能。