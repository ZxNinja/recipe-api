@echo off
echo.
echo ============================================
echo    🚀 STARTING ULTRA-FAST RECIPE API
echo ============================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if database.json exists
if not exist "database.json" (
    echo ❌ database.json not found!
    echo Please make sure database.json is in the same folder.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo ✅ Starting server...
echo.
echo ============================================
echo    🌐 API will be available at:
echo    http://localhost:3000
echo ============================================
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js