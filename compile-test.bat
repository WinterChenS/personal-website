@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.3+9
set PATH=%JAVA_HOME%\bin;%PATH%
set MAVEN_HOME=C:\Program Files\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

echo Java version:
java -version
echo.
echo Maven version:
mvn -version
echo.
echo Compiling...
cd /d "%~dp0backend"
mvn compile -DskipTests 2>&1 | findstr /C:"BUILD" /C:"ERROR"
echo.
echo Done.