@echo off
echo ========================================
echo  Prisma Client Regeneration Script
echo ========================================
echo.
echo This script will:
echo 1. Stop any running Node processes
echo 2. Regenerate Prisma Client
echo 3. Restart the backend server
echo.
pause

echo.
echo [1/3] Stopping Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node processes stopped
    timeout /t 2 /nobreak >nul
) else (
    echo ℹ No Node processes were running
)

echo.
echo [2/3] Regenerating Prisma Client...
cd backend
call npx prisma generate
if %errorlevel% equ 0 (
    echo ✓ Prisma Client generated successfully
) else (
    echo ✗ Failed to generate Prisma Client
    echo Please close VS Code and try again
    pause
    exit /b 1
)

echo.
echo [3/3] Starting backend server...
start cmd /k "cd backend && npm run dev"
echo ✓ Backend server started in new window

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for backend server to start (check the new window)
echo 2. Hard refresh your browser (Ctrl+Shift+R)
echo 3. Navigate to Admin -^> Settings
echo 4. You should now see the new fields!
echo.
pause
