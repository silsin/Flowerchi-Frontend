@echo off
REM Flowerchi Automatic Setup Script - Windows
REM This script automatically sets up the entire application

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ==========================================
echo    Flowerchi Automatic Setup
echo ==========================================
echo.

REM Color codes using ANSI escape sequences (Windows 10+)
set "BLUE=[34m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "RESET=[0m"

REM Check if .env exists
if exist .env (
    echo [!YELLOW!] .env file already exists. Skipping creation.
) else (
    echo [*] Creating .env file from template...
    if not exist .env.example (
        echo [!RED!] .env.example not found
        exit /b 1
    )
    copy .env.example .env >nul
    echo [!GREEN!] .env created
)

REM Generate random passwords using PowerShell
echo [*] Generating strong passwords...
for /f "delims=" %%A in ('powershell -Command "[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))"') do set "POSTGRES_PASSWORD=%%A"
for /f "delims=" %%A in ('powershell -Command "[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))"') do set "AUTH_SECRET=%%A"

echo [!GREEN!] Passwords generated

REM Update .env file using PowerShell
echo [*] Updating .env with generated values...
powershell -Command "(Get-Content .env) -replace 'replace-with-a-long-random-password', '%POSTGRES_PASSWORD%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'replace-with-at-least-32-random-characters', '%AUTH_SECRET%' | Set-Content .env"

echo [!GREEN!] .env updated with generated passwords

REM Check if Docker is installed
echo [*] Checking for Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [!RED!] Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    exit /b 1
)
echo [!GREEN!] Docker found

REM Check if Docker Compose is available
echo [*] Checking for Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [!RED!] Docker Compose is not available. Make sure Docker Desktop is installed with Compose enabled.
    exit /b 1
)
echo [!GREEN!] Docker Compose found

REM Check if Docker daemon is running
echo [*] Checking if Docker daemon is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo [!RED!] Docker daemon is not running. Please start Docker Desktop.
    exit /b 1
)
echo [!GREEN!] Docker daemon is running

REM Stop existing containers
echo [*] Stopping any existing containers...
docker-compose down 2>nul
echo [!GREEN!] Containers stopped

REM Build and start services
echo [*] Building and starting services (this may take a few minutes)...
docker-compose up -d --build
if errorlevel 1 (
    echo [!RED!] Failed to start services
    exit /b 1
)
echo [!GREEN!] Services started

REM Wait for database to be ready
echo [*] Waiting for PostgreSQL to be ready...
set "attempt=0"
set "max_attempts=30"

:wait_db
docker-compose exec -T db pg_isready -U flowerchi -d flowerchi >nul 2>&1
if errorlevel 0 (
    echo.
    echo [!GREEN!] PostgreSQL is ready
    goto db_ready
)

set /a attempt=attempt+1
if %attempt% geq %max_attempts% (
    echo.
    echo [!RED!] PostgreSQL did not start after %max_attempts% attempts
    exit /b 1
)

<nul set /p "=."
timeout /t 1 /nobreak >nul
goto wait_db

:db_ready

REM Verify database schema
echo [*] Verifying database schema...
docker-compose exec -T db psql -U flowerchi -d flowerchi -c "\dt" >nul 2>&1
if errorlevel 1 (
    echo [!RED!] Failed to verify database schema
    exit /b 1
)
echo [!GREEN!] Database schema verified

REM Wait for app to be ready
echo [*] Waiting for application to start (10 seconds)...
timeout /t 10 /nobreak >nul

set "attempt=0"
set "max_attempts=60"

:wait_app
for /f %%A in ('powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).StatusCode } catch { Write-Output '000' }" 2^>nul') do set "status_code=%%A"

if "%status_code%"=="200" (
    echo.
    echo [!GREEN!] Application is responding
    goto app_ready
)

set /a attempt=attempt+1
if %attempt% geq %max_attempts% (
    echo.
    echo [!YELLOW!] Application may not be fully ready yet, but containers are running
    goto app_ready
)

<nul set /p "=."
timeout /t 1 /nobreak >nul
goto wait_app

:app_ready

REM Display summary
echo.
echo ==========================================
echo    Setup Complete!
echo ==========================================
echo.
echo Database Configuration:
echo   Database: flowerchi
echo   User: flowerchi
echo   Password: (auto-generated, check .env)
echo   Port: 5432
echo.
echo Application URL:
echo   http://localhost:3000
echo.
echo Admin Setup:
echo   1. Visit http://localhost:3000/setup
echo   2. Create your first administrator account
echo   3. You'll be automatically logged in
echo.
echo Useful Commands:
echo   View logs:          docker-compose logs -f app
echo   View DB logs:       docker-compose logs -f db
echo   Stop services:      docker-compose stop
echo   Start services:     docker-compose start
echo   Restart services:   docker-compose restart
echo   Remove everything:  docker-compose down -v
echo.
echo Next Steps:
echo   1. Open http://localhost:3000 in your browser
echo   2. Go to /setup to create first admin
echo   3. Log in and start using the app
echo.
echo ==========================================
echo.

pause
