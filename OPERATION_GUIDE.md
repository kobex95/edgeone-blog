# EdgeOne Pages 函数部署操作指南

## 🚨 紧急处理步骤

根据您的情况（函数显示空白），请严格按照以下步骤操作：

## 🔧 EdgeOne 控制台操作步骤

### 步骤1: 检查Pages项目设置

1. 登录 EdgeOne 控制台
2. 进入 **Pages** 服务
3. 选择您的项目 **edgeone-blog**
4. 点击 **设置** 标签

### 步骤2: 配置函数目录

在项目设置中找到 **函数配置** 部分：
- **函数目录**: `edge-functions`
- **Node.js版本**: `18.x`
- **构建命令**: `npm run build`
- **发布目录**: `dist/client`

### 步骤3: 手动触发重新部署

1. 返回 **部署** 标签
2. 点击 **重新部署** 按钮
3. 选择 **清除缓存并重新部署**

### 步骤4: 验证函数部署

部署完成后：
1. 进入 **函数** 服务页面
2. 查看函数列表
3. 应该能看到 `simple-api-handler` 函数
4. 点击函数查看详细信息和日志

## 📁 项目结构调整

确保您的项目结构如下：

```
mu-blog/
├── edge-functions/
│   └── simple-api-handler.js
├── dist/
│   └── client/
│       ├── index.html
│       └── function-test.html
├── public/
│   └── function-test.html
├── edgeone.json
├── edgeone.toml
└── package.json
```

## 🧪 部署后验证

### 1. 访问测试页面
```
https://your-domain.com/function-test.html
```

### 2. 检查函数状态
在EdgeOne控制台的函数页面查看：
- 函数是否显示在列表中
- 最后部署时间
- 执行日志

### 3. API测试
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## ⚠️ 常见问题解决

### 问题1: 函数仍然不显示
**解决方案**:
1. 确认 `edge-functions` 目录存在且包含 `.js` 文件
2. 检查文件权限
3. 确认函数文件导出了默认处理函数

### 问题2: 404错误持续
**解决方案**:
1. 检查Pages项目的发布目录设置
2. 确认路由配置正确
3. 清除CDN缓存

### 问题3: 环境变量未生效
**解决方案**:
1. 在Pages设置中重新添加环境变量
2. 重新部署应用
3. 检查变量名称是否正确

## 🆘 紧急联系

如果按照以上步骤仍无法解决问题：
1. 截图EdgeOne控制台的函数页面（显示空白的部分）
2. 提供完整的部署日志
3. 联系EdgeOne技术支持，说明：
   - Pages项目名称
   - GitHub仓库地址
   - 具体的错误现象

## 📋 检查清单

部署前确认：
- [ ] `edge-functions/simple-api-handler.js` 文件存在
- [ ] `edgeone.json` 配置文件正确
- [ ] Pages项目已连接GitHub仓库
- [ ] 环境变量已配置
- [ ] 构建命令 `npm run build` 能正常执行

部署后验证：
- [ ] 函数在控制台显示
- [ ] 测试页面可访问
- [ ] API请求返回正确响应
- [ ] 登录功能正常工作