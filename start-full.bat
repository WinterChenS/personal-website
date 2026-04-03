@echo off
echo ========================================
echo 个人网站 - 完整启动脚本
echo ========================================
echo.

:: 设置 Java 21 环境
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.3+9
set PATH=%JAVA_HOME%\bin;%PATH%

:: 设置 Maven 环境
set MAVEN_HOME=C:\Program Files\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

echo [1/3] 检查环境...
echo Java: %JAVA_HOME%
echo Maven: %MAVEN_HOME%
echo.

:: 启动后端
echo [2/3] 启动后端服务 (端口 8080)...
cd /d "%~dp0backend"
start "Backend Server" cmd /c "%MAVEN_HOME%\bin\mvn.cmd spring-boot:run"
echo 等待后端启动...
timeout /t 20 /nobreak >nul
echo 后端已启动!
echo.

:: 启动前端
echo [3/3] 启动前端服务 (端口 3000)...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /c "npm run dev"
echo.

echo ========================================
echo 启动完成!
echo ========================================
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8080
echo 管理后台: http://localhost:3000/admin
echo H2 控制台: http://localhost:8080/h2-console
echo.
echo 管理员账号: admin
echo 管理员密码: admin123
echo.
echo 按任意键打开网站...
pause >nul
start http://localhost:3000