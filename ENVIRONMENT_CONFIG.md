# EdgeOne 部署环境变量配置说明

在 EdgeOne 控制台的应用设置中，需要配置以下环境变量：

## 必需的环境变量

### 数据库配置 (Turso)
```
DATABASE_URL=libsql://your-database-name.turso.io
DATABASE_TOKEN=your-database-token-here
```

### 安全配置
```
JWT_SECRET=your-strong-jwt-secret-key-here
```

### 管理员账户
```
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
```

### Twikoo 评论系统
```
TWIKOO_ENV_ID=your-twikoo-environment-id
```

## 获取配置值的方法

### 1. Turso 数据库配置
- 访问 https://turso.tech/
- 创建免费账户并创建数据库
- 获取数据库 URL 和认证 Token

### 2. JWT Secret
- 生成强随机字符串作为 JWT 密钥
- 推荐长度：32个字符以上
- 可以使用在线工具生成或使用命令：
  ```bash
  openssl rand -hex 32
  ```

### 3. 管理员账户
- 设置安全的用户名和密码
- 密码建议包含大小写字母、数字和特殊字符

### 4. Twikoo 环境 ID
- 访问 Twikoo 官网获取环境 ID
- 用于文章评论功能

## EdgeOne 控制台配置步骤

1. 登录 EdgeOne 控制台
2. 进入应用管理页面
3. 选择你的博客应用
4. 在"环境变量"选项卡中添加上述变量
5. 保存配置并重新部署应用

## 注意事项

- 所有敏感信息都应该通过环境变量配置
- 不要在代码中硬编码敏感信息
- 定期轮换 JWT secret 和管理员密码
- 生产环境中使用强密码策略