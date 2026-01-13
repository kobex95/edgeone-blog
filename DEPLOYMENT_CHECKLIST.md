# EdgeOne Pages 部署检查清单

## 🚨 紧急情况处理

如果API测试仍然失败，请按以下步骤逐一检查：

## 🔍 必须检查的项目

### 1. EdgeOne 控制台配置
- [ ] 确认Pages项目已正确创建
- [ ] 检查GitHub仓库连接状态
- [ ] 验证环境变量是否已设置：
  ```
  ADMIN_USERNAME=admin
  ADMIN_PASSWORD=admin123
  ```

### 2. 函数部署状态
- [ ] 在Functions页面查看函数列表
- [ ] 确认 `simple-api-handler` 函数已部署
- [ ] 检查函数的执行日志
- [ ] 验证函数的触发器配置

### 3. 路由配置验证
- [ ] 确认 `/api/*` 路径已正确路由到函数
- [ ] 检查是否存在路由冲突
- [ ] 验证重定向规则是否正确

## 🧪 紧急测试步骤

### 步骤1: 访问函数测试页面
```
https://your-domain.com/function-test.html
```

### 步骤2: 手动测试API
使用浏览器开发者工具的Console执行：

```javascript
// 测试基础连接
fetch('/api/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// 测试登录
fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'admin', password: 'admin123'})
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 步骤3: 检查网络请求
在浏览器开发者工具中：
1. 打开Network标签
2. 刷新页面
3. 查看API请求的响应
4. 确认请求是否被正确路由

## 🆘 如果所有方法都失败

### 最后的解决方案：

1. **创建全新的Pages项目**
   - 删除现有项目
   - 重新创建Pages项目
   - 重新连接GitHub仓库

2. **使用备用部署方案**
   - 考虑使用传统的EdgeOne应用部署
   - 或迁移到其他支持函数的平台

3. **联系技术支持**
   - 提供完整的部署日志
   - 截图所有测试结果
   - 描述具体的错误现象

## 📋 环境变量配置模板

在EdgeOne Pages控制台的Environment Variables中添加：

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-very-secure-jwt-secret-here
DATABASE_URL=libsql://your-database.turso.io  
DATABASE_TOKEN=your-database-token
TWIKOO_ENV_ID=your-twikoo-env-id
```

## ⚠️ 常见错误及解决方案

| 错误类型 | 可能原因 | 解决方案 |
|---------|---------|---------|
| 405 Method Not Allowed | 路由配置错误 | 检查函数路由设置 |
| 404 Not Found | 函数未部署 | 重新部署函数 |
| CORS Error | 跨域配置问题 | 检查CORS头设置 |
| Timeout | 函数执行超时 | 优化函数代码 |

## 📊 成功部署的标准

✅ 部署成功的标志：
- 访问 `/function-test.html` 显示测试页面
- API测试返回JSON数据而非XML错误
- 登录功能正常工作
- 控制台显示函数执行日志