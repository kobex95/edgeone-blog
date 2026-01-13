@echo off
REM EdgeOne 平台部署脚本 (Windows版本)
REM 使用方法: deploy-edgeone.bat

echo 🚀 开始部署到 EdgeOne 平台...

REM 检查必要工具
where edgeone >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 edgeone CLI 工具，请先安装
    echo 安装指南: https://edgeone.cloud/docs/cli/install
    pause
    exit /b 1
)

REM 检查配置文件
if not exist "edgeone.config.json" (
    echo ❌ 未找到 edgeone.config.json 配置文件
    pause
    exit /b 1
)

REM 构建项目
echo 🔨 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 部署到 EdgeOne
echo 📤 部署到 EdgeOne...
edgeone deploy --config edgeone.config.json

if %errorlevel% equ 0 (
    echo ✅ 部署完成！
    
    REM 显示应用信息
    echo 📋 应用信息:
    edgeone apps list | findstr mu-blog
    
    echo 🔗 访问地址将在 EdgeOne 控制台显示
) else (
    echo ❌ 部署失败
)

pause