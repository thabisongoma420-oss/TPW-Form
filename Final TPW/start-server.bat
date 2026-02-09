@echo off
cd /d "%~dp0"
echo Checking for existing server processes...
echo.

REM Kill any process using port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3000"') do taskkill /PID %%a /F 2>nul

echo Starting Application Form Server...
echo.
node server.js
pause
