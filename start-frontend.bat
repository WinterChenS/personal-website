@echo off
chcp 65001 >nul
echo ========================================
echo    个人网站启动脚本（前端模式）
echo ========================================
echo.
echo [提示] 此模式仅运行前端，使用模拟数据
echo 如需完整功能，请安装 Maven 和 Java 21
echo.
echo 正在启动前端服务...
cd frontend
call npm run dev
