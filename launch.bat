@echo off
title No Sleep App Launcher

echo.
echo =======================================
echo       No Sleep App Launcher
echo =======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Starting No Sleep App...
echo.

REM Run the launcher script
node scripts/launcher.js

pause