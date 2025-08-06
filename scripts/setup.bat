@echo off
echo ========================================
echo    iManage Uploader - Quick Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo Choose the LTS version and make sure to add it to PATH
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)
echo.

REM Check if npm is available
echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    echo Please reinstall Node.js
    pause
    exit /b 1
) else (
    echo ✅ npm is available
    npm --version
)
echo.

REM Install dependencies
echo [3/5] Installing application dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    echo Please check your internet connection and try again
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully
)
echo.

REM Check if .env file exists
echo [4/5] Setting up configuration...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Created .env configuration file
        echo ⚠️  IMPORTANT: Please edit .env file and update your database password!
        echo    Look for DATABASE_URL and replace 'password' with your PostgreSQL password
    ) else (
        echo ❌ .env.example file not found!
        echo Please make sure you're in the correct directory
        pause
        exit /b 1
    )
) else (
    echo ✅ Configuration file already exists
)
echo.

REM Setup database tables
echo [5/5] Setting up database tables...
echo Make sure PostgreSQL is running and you've created the 'imanage_uploader' database
echo Press any key to continue with database setup, or Ctrl+C to skip...
pause >nul

npm run db:push
if %errorlevel% neq 0 (
    echo ❌ Database setup failed!
    echo Please check:
    echo   1. PostgreSQL is running
    echo   2. Database 'imanage_uploader' exists
    echo   3. Password in .env file is correct
    echo.
    echo You can run 'npm run db:push' manually later
) else (
    echo ✅ Database tables created successfully
)
echo.

echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure your .env file has the correct database password
echo 2. Run: npm run dev
echo 3. Open browser to: http://localhost:5000
echo 4. Login with demo credentials:
echo    Server: https://demo.imanage.com
echo    Username: demo
echo    Password: demo
echo.
echo Press any key to exit...
pause >nul
