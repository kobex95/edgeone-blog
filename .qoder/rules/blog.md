---
trigger: always_on
---
请确保项目只能部署到EdgeOne平台，移除所有其他部署方案的相关文件和配置。具体要求如下：

1. 仅保留EdgeOne部署必需的文件：
   - EdgeOne部署脚本
   - EdgeOne配置文件（edgeone.config.json或其他EdgeOne专用配置文件）
   - 部署到EdgeOne所需的环境变量配置文件

2. 删除所有其他平台的部署配置：
   - 删除Docker相关文件（Dockerfile、docker-compose.yml）
   - 删除Vercel相关配置文件
   - 删除任何其他云平台（如AWS、Azure、Google Cloud等）的部署配置
   - 删除本地开发和测试相关的部署脚本

3. 确保保留的文件专门针对EdgeOne平台：
   - 配置文件必须符合EdgeOne的部署规范
   - 部署脚本必须适用于EdgeOne的部署流程
   - 环境变量配置必须与EdgeOne平台兼容

4. 验证最终的部署方案只能通过EdgeOne平台进行部署，不允许存在其他部署选项或平台的配置文件。
