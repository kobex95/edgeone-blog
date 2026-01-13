#!/bin/bash
# EdgeOne Pages 部署前检查脚本

echo "🔍 检查EdgeOne Pages部署准备..."

# 检查必要文件
echo "📁 检查必要文件:"
if [ -d "edge-functions" ]; then
    echo "✅ edge-functions 目录存在"
    ls -la edge-functions/
else
    echo "❌ edge-functions 目录不存在"
fi

if [ -f "edgeone.json" ]; then
    echo "✅ edgeone.json 配置文件存在"
else
    echo "❌ edgeone.json 配置文件不存在"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json 文件存在"
else
    echo "❌ package.json 文件不存在"
fi

# 检查构建
echo ""
echo "🏗️ 检查构建:"
if npm run build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
fi

echo ""
echo "📋 部署前检查完成"
echo "请在EdgeOne控制台Pages项目中设置:"
echo "- 函数目录: edge-functions"
echo "- 构建命令: npm run build"
echo "- 发布目录: dist/client"