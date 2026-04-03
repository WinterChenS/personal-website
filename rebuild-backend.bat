@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.3+9
set PATH=%JAVA_HOME%\bin;%PATH%
set MAVEN_HOME=C:\Program Files\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

echo ========================================
echo 重新编译后端
echo ========================================
echo.
echo Java: %JAVA_HOME%
echo Maven: %MAVEN_HOME%
echo.

cd /d "%~dp0backend"

echo 正在清理并编译...
call "%MAVEN_HOME%\bin\mvn.cmd" clean compile -DskipTests

echo.
echo ========================================
echo 编译完成！
echo ========================================
pause