@echo off
chcp 65001 >nul
echo ========================================
echo    个人网站启动脚本
echo ========================================
echo.

:: 检查 Java
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Java，请先安装 Java 21
    pause
    exit /b 1
)

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [1/4] 安装前端依赖...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [错误] 前端依赖安装失败
    pause
    exit /b 1
)

echo.
echo [2/4] 启动后端服务...
cd ..\backend
start "后端服务" cmd /c "mvn spring-boot:run"

echo 等待后端启动...
timeout /t 15 /nobreak >nul

echo.
echo [3/4] 启动前端开发服务器...
cd ..\frontend
start "前端服务" cmd /c "npm run dev"

echo.
echo ========================================
echo    启动完成！
echo ========================================
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8080
echo 管理后台: http://localhost:3000/admin
echo.
echo 默认管理员账号:
echo   用户名: admin
echo   密码: admin123
echo.
echo 按任意键打开浏览器...
pause >nul
start http://localhost:3000
