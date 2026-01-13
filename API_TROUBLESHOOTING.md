# EdgeOne Pages API配置说明

## 🚨 405错误解决方案

当出现405 Method Not Allowed错误时，通常是API路由配置问题。

## 🔧 关键配置项

### 必需的环境变量

在EdgeOne Pages控制台中配置以下环境变量：

```env
# 基础配置
NODE_ENV=production

# 管理员账户
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# 安全配置
JWT_SECRET=your-very-secure-jwt-secret-here

# 数据库配置
DATABASE_URL=libsql://your-database.turso.io
DATABASE_TOKEN=your-database-token

# Twikoo评论系统
TWIKOO_ENV_ID=your-twikoo-env-id
```

## 🛠️ API路由调试

### 1. 测试不同的API端点

访问 `/api-debug` 页面进行以下测试：

1. **相对路径测试**: `/api/auth/login`
2. **绝对路径测试**: `https://your-domain.com/api/auth/login`
3. **直接域名测试**: 尝试各种可能的API域名组合

### 2. 常见问题及解决方案

#### 问题1: 405 Method Not Allowed
**原因**: 请求被发送到错误的端点或对象存储
**解决方案**: 
- 检查EdgeOne Pages的路由配置
- 确认函数路由正确指向API处理器
- 验证环境变量配置

#### 问题2: CORS错误
**原因**: 跨域请求被阻止
**解决方案**:
- 在API函数中添加正确的CORS头
- 确保请求来源被允许

#### 问题3: 404 Not Found
**原因**: API路由未正确配置
**解决方案**:
- 检查`.edgeone/functions.json`配置
- 确认函数文件存在且正确导出

## 🔍 调试步骤

### 步骤1: 访问调试页面
```
https://your-domain.com/api-debug
```

### 步骤2: 运行所有测试
- 点击每个测试按钮
- 记录成功和失败的结果
- 查看详细的错误信息

### 步骤3: 检查环境变量
在调试页面中点击"检查环境变量"按钮

### 步骤4: 验证函数配置
检查以下文件：
- `.edgeone/functions.json`
- `edge-functions/api-handler.js`
- `edgeone-pages.json`

## 📊 预期结果

成功的API响应应该类似：
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## 🆘 紧急联系方式

如果问题持续存在：
1. 查看EdgeOne控制台的函数执行日志
2. 检查部署状态和错误信息
3. 联系EdgeOne技术支持

## 📝 备注

- 确保所有敏感信息通过环境变量配置
- 定期轮换JWT密钥和管理员密码
- 监控API使用情况和错误率