# Mu Blog - 基于Vue.js的博客系统

一个现代化的博客系统，专为EdgeOne平台设计，采用Vue.js全栈技术栈，集成Turso数据库和Twikoo评论系统。

## 🌟 特性

- **现代化技术栈**: Vue 3 + Express + Turso数据库
- **响应式设计**: 完美适配移动端和桌面端
- **完整博客功能**: 文章管理、分类标签、搜索功能
- **安全认证**: JWT Token认证，管理员权限控制
- **评论系统**: 集成Twikoo评论功能
- **一键部署**: 专门为EdgeOne平台优化的部署方案
- **SEO友好**: 支持搜索引擎优化

## 🚀 技术架构

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Vue Router** - 客户端路由管理
- **Pinia** - 状态管理
- **Axios** - HTTP客户端
- **Marked** - Markdown渲染
- **Highlight.js** - 代码高亮

### 后端
- **Node.js + Express** - 服务端框架
- **JWT** - 身份认证
- **Turso (libSQL)** - 边缘数据库
- **Bcrypt** - 密码加密

### 部署平台
- **EdgeOne** - 边缘计算平台
- **自动扩缩容** - 根据流量自动调整资源

## 📁 项目结构

```
mu-blog/
├── src/                    # 前端源码
│   ├── assets/            # 静态资源
│   ├── components/        # Vue组件
│   ├── stores/           # Pinia状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件
│   └── router.js         # 路由配置
├── server/               # 后端服务
│   ├── controllers/      # 控制器
│   ├── middleware/       # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由定义
│   └── server.js        # 服务器入口
├── dist/                # 构建输出
├── edgeone.config.json  # EdgeOne配置
├── package.json         # 项目依赖
└── README.md           # 项目文档
```

## 🛠️ 快速开始

### 1. 环境准备

确保已安装：
- Node.js (>= 16.0.0)
- npm 或 yarn
- EdgeOne CLI 工具

### 2. 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd mu-blog

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env

# 配置环境变量 (参考 ENVIRONMENT_CONFIG.md)
# 编辑 .env 文件，填入必要的配置信息

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看应用

### 3. 构建生产版本

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## ☁️ EdgeOne 部署

### 自动部署 (推荐)

```bash
# Windows 用户
deploy-edgeone.bat

# Linux/Mac 用户
chmod +x deploy-edgeone.sh
./deploy-edgeone.sh
```

### 手动部署步骤

1. **安装 EdgeOne CLI**
   ```bash
   # 参考官方文档安装
   https://edgeone.cloud/docs/cli/install
   ```

2. **配置环境变量**
   - 登录 EdgeOne 控制台
   - 在应用设置中配置环境变量
   - 参考 `ENVIRONMENT_CONFIG.md` 文件

3. **部署应用**
   ```bash
   edgeone deploy --config edgeone.config.json
   ```

## ⚙️ 环境变量配置

详细配置说明请查看 [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md)

关键配置项：
- `DATABASE_URL` - Turso数据库连接URL
- `DATABASE_TOKEN` - 数据库认证Token
- `JWT_SECRET` - JWT密钥
- `ADMIN_USERNAME` - 管理员用户名
- `ADMIN_PASSWORD` - 管理员密码
- `TWIKOO_ENV_ID` - Twikoo环境ID

## 🔧 开发指南

### 项目启动

```bash
# 开发模式 (前后端同时启动)
npm run dev

# 仅启动前端
npm run dev:client

# 仅启动后端
npm run dev:server
```

### 代码规范

- 使用ESLint进行代码检查
- 遵循Vue 3 Composition API规范
- 组件命名使用PascalCase
- 文件命名使用kebab-case

### 目录约定

- `src/views/` - 页面级组件
- `src/components/` - 可复用组件
- `src/stores/` - 状态管理
- `server/routes/` - API路由
- `server/models/` - 数据模型

## 📱 功能特性

### 用户功能
- [x] 文章浏览和搜索
- [x] 分类和标签筛选
- [x] 文章详情页
- [x] 响应式设计
- [x] 评论系统集成

### 管理功能
- [x] 管理员登录认证
- [x] 文章创建和编辑
- [x] 文章状态管理（草稿/发布）
- [x] 分类和标签管理
- [x] 数据统计面板

### 技术特性
- [x] RESTful API设计
- [x] JWT身份认证
- [x] 数据库迁移自动化
- [x] 错误处理机制
- [x] 日志记录

## 🎯 API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 文章接口
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles/:id/view` - 增加浏览量
- `POST /api/articles/:id/like` - 文章点赞

### 管理接口
- `GET /api/admin/stats` - 获取统计数据
- `GET /api/admin/articles` - 获取所有文章
- `POST /api/admin/articles` - 创建文章
- `PUT /api/admin/articles/:id` - 更新文章
- `DELETE /api/admin/articles/:id` - 删除文章

## 📊 数据库设计

### Users 表
存储管理员用户信息

### Articles 表
存储博客文章内容

### Categories 表
存储文章分类信息

### Tags 表
存储文章标签信息

## 🔒 安全措施

- JWT Token认证
- 密码BCrypt加密
- SQL注入防护
- XSS攻击防护
- CORS跨域配置
- 输入验证和清理

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 前端框架
- [Express](https://expressjs.com/) - 后端框架
- [Turso](https://turso.tech/) - 边缘数据库
- [EdgeOne](https://edgeone.cloud/) - 部署平台
- [Twikoo](https://twikoo.js.org/) - 评论系统

## 📞 支持

如有问题，请提交Issue或联系开发者。