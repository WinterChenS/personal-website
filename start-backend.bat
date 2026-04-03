@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.3+9
set PATH=%JAVA_HOME%\bin;%PATH%
set MAVEN_HOME=C:\Program Files\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

echo Starting backend server...
echo Java: %JAVA_HOME%
echo Maven: %MAVEN_HOME%

cd /d "%~dp0backend"

echo Running: mvn spring-boot:run
call "%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run

pause