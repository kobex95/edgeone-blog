# EdgeOne Pages 函数路由修复指南

## 🚨 紧急修复步骤

根据您的测试结果，问题根源是EdgeOne Pages没有正确将API请求路由到函数处理器。

## 🔧 立即执行的修复操作

### 步骤1: 替换配置文件

在EdgeOne控制台中，将现有的Pages配置替换为以下内容：

```json
{
  "name": "mu-blog",
  "framework": "vite",
  "functions": {
    "directory": "edge-functions",
    "routes": [
      {
        "pattern": "/api/(.*)",
        "function": "simple-api-handler"
      }
    ]
  },
  "build": {
    "command": "npm run build",
    "publish": "dist/client"
  },
  "routes": [
    {
      "pattern": "/api/*",
      "function": "simple-api-handler"
    },
    {
      "pattern": "/*",
      "serve": "dist/client"
    }
  ]
}
```

### 步骤2: 部署简化版函数

确保 `edge-functions/simple-api-handler.js` 文件存在于您的仓库中。

### 步骤3: 环境变量配置

在EdgeOne Pages控制台中配置：

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## 🧪 验证修复结果

部署完成后，进行以下测试：

### 1. API测试
访问 `/api-debug` 页面，运行测试：
- ✅ 应该看到成功的API响应
- ✅ 不再出现405错误
- ✅ 返回JSON格式数据而非XML

### 2. 登录测试
访问 `/debug-login` 页面：
- 使用用户名: `admin`
- 使用密码: `admin123`
- 应该能够成功登录

### 3. 直接API测试
```bash
# 测试登录接口
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

预期响应：
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  },
  "message": "登录成功"
}
```

## ⚠️ 常见问题及解决方案

### 问题1: 仍然返回405错误
**解决方案**:
1. 确认函数文件名正确：`simple-api-handler.js`
2. 检查EdgeOne控制台的函数部署状态
3. 确认路由模式正确配置

### 问题2: 函数未找到
**解决方案**:
1. 检查 `edge-functions` 目录结构
2. 确认文件权限正确
3. 重新部署应用

### 问题3: CORS错误
**解决方案**:
已在函数中添加CORS头，如果仍有问题：
1. 检查浏览器控制台错误详情
2. 确认请求来源域名正确

## 📊 监控和日志

在EdgeOne控制台中查看：
- 函数执行日志
- 请求统计信息
- 错误率监控

## 🆘 紧急联系

如果按照以上步骤仍无法解决问题：
1. 截图完整的错误信息
2. 提供EdgeOne控制台的部署日志
3. 联系EdgeOne技术支持团队

## 📝 备注

这个简化版的API处理器包含了最基本的登录和文章功能，足以验证路由配置是否正确。一旦确认路由工作正常，可以逐步替换为完整的API实现。