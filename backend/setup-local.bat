@echo off
echo ============================================
echo Sanskriti - Local Database Setup
echo ============================================
echo.
echo This script will help you set up MySQL locally.
echo.
echo STEP 1: Create Database
echo ------------------------
echo Please run this command and enter your MySQL root password when prompted:
echo.
echo mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sanskriti_db;"
echo.
pause
echo.

echo ============================================
echo Running: Creating database...
echo ============================================
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sanskriti_db;"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to create database!
    echo Please make sure MySQL is running and you entered the correct password.
    pause
    exit /b 1
)

echo.
echo ✅ Database created successfully!
echo.
echo ============================================
echo STEP 2: Update .env File
echo ============================================
echo.
echo Opening .env file...
echo Please update the DATABASE_URL line with your MySQL password:
echo.
echo DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/sanskriti_db"
echo.
echo Replace YOUR_PASSWORD with your actual MySQL root password.
echo.
pause

notepad .env

echo.
echo ============================================
echo STEP 3: Generate Prisma Client
echo ============================================
call npx prisma generate

if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo STEP 4: Run Database Migrations
echo ============================================
call npx prisma migrate dev --name init

if %errorlevel% neq 0 (
    echo ERROR: Migration failed! Please check your DATABASE_URL in .env
    pause
    exit /b 1
)

echo.
echo ============================================
echo STEP 5: Seed Database with Test Users
echo ============================================
call node seed.js

if %errorlevel% neq 0 (
    echo ERROR: Seeding failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo 🎉 Setup Complete!
echo ============================================
echo.
echo Your local database is ready!
echo.
echo Test users created:
echo   - Admin:    userId: admin      password: admin123
echo   - Customer: userId: test_user  password: password123
echo.
echo Next steps:
echo   1. Start backend:  npm run dev
echo   2. Start frontend: cd ../frontend ^&^& npm run dev
echo   3. Visit: http://localhost:5173
echo.
pause
