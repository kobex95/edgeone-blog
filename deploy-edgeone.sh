#!/bin/bash

# EdgeOne 平台部署脚本
# 使用方法: ./deploy-edgeone.sh

set -e

echo "🚀 开始部署到 EdgeOne 平台..."

# 检查必要工具
if ! command -v edgeone &> /dev/null; then
    echo "❌ 未找到 edgeone CLI 工具，请先安装"
    echo "安装指南: https://edgeone.cloud/docs/cli/install"
    exit 1
fi

# 检查配置文件
if [ ! -f "edgeone.config.json" ]; then
    echo "❌ 未找到 edgeone.config.json 配置文件"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署到 EdgeOne
echo "📤 部署到 EdgeOne..."
edgeone deploy --config edgeone.config.json

echo "✅ 部署完成！"

# 显示应用信息
echo "📋 应用信息:"
edgeone apps list | grep mu-blog

echo "🔗 访问地址将在 EdgeOne 控制台显示"