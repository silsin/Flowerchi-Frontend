@echo off
REM Docker Build and Re-run Script for Flowerchi Frontend
REM This script builds and restarts Docker containers

setlocal enabledelayedexpansion

set PROFILE=default
set CLEANBUILD=0
set SHOWCLOG=0
set NOCACHE=

REM Parse command line arguments
:parse_args
if "%1"=="" goto args_done
if "%1"=="--profile" (
    set PROFILE=%2
    shift
    shift
    goto parse_args
)
if "%1"=="--clean" (
    set CLEANBUILD=1
    shift
    goto parse_args
)
if "%1"=="--logs" (
    set SHOWLOGS=1
    shift
    goto parse_args
)
if "%1"=="--no-cache" (
    set NOCACHE=--no-cache
    shift
    goto parse_args
)
if "%1"=="--help" (
    goto show_help
)
shift
goto parse_args

:args_done

REM Check for Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop for Windows
    exit /b 1
)

REM Check if Docker daemon is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker daemon is not running
    echo Please start Docker Desktop
    exit /b 1
)

REM Check for .env file
if not exist ".env" (
    echo [ERROR] .env file not found
    echo Please copy .env.example to .env and configure it
    exit /b 1
)

echo.
echo ========================================
echo Flowerchi Docker Build ^& Re-run Script
echo ========================================
echo Profile: %PROFILE%
echo Clean Build: %CLEANBUILD%
echo.

REM Stop containers
echo [INFO] Stopping running containers...
if "%PROFILE%"=="docker-edge" (
    docker compose --profile %PROFILE% down
) else (
    docker compose down
)

if errorlevel 1 (
    echo [WARNING] Could not stop containers
)

REM Remove volumes if clean build
if %CLEANBUILD%==1 (
    echo [INFO] Removing volumes for clean build...
    docker volume prune -f --filter "label!=keep" 2>nul
)

REM Build containers
echo [INFO] Building Docker containers...
if "%PROFILE%"=="docker-edge" (
    if "%NOCACHE%"=="" (
        docker compose --profile %PROFILE% build
    ) else (
        echo [INFO] Building without cache (--no-cache)
        docker compose --profile %PROFILE% build %NOCACHE%
    )
) else (
    if "%NOCACHE%"=="" (
        docker compose build
    ) else (
        echo [INFO] Building without cache (--no-cache)
        docker compose build %NOCACHE%
    )
)

if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)

echo [SUCCESS] Build completed successfully

REM Start containers
echo [INFO] Starting containers...
if "%PROFILE%"=="docker-edge" (
    docker compose --profile %PROFILE% up -d
) else (
    docker compose up -d
)

if errorlevel 1 (
    echo [ERROR] Failed to start containers
    exit /b 1
)

echo [SUCCESS] Containers started successfully

REM Wait for services
echo [INFO] Waiting for services to be ready...
timeout /t 3 /nobreak

echo.
echo ========================================
echo [SUCCESS] Docker containers are ready!
echo ========================================
echo Access the application at: http://localhost:3000
if "%PROFILE%"=="docker-edge" (
    echo Edge services available at configured domain
)

echo.
if %SHOWLOGS%==1 (
    echo [INFO] Displaying container logs...
    docker compose logs --tail 50 --timestamps
) else (
    echo [INFO] To view logs, run: docker compose logs --follow
)

exit /b 0

:show_help
echo.
echo Docker Build and Re-run Script Usage:
echo.
echo Usage: docker-rebuild.bat [OPTIONS]
echo.
echo Options:
echo   --profile docker-edge     Use docker-edge profile (includes nginx and certbot)
echo   --clean                   Clean build (remove volumes)
echo   --logs                    Show logs after build
echo   --no-cache                Build without cache
echo   --help                    Show this help message
echo.
echo Examples:
echo   docker-rebuild.bat                          # Standard build
echo   docker-rebuild.bat --profile docker-edge    # Build with edge profile
echo   docker-rebuild.bat --clean                  # Clean build
echo   docker-rebuild.bat --no-cache --logs        # Build without cache and show logs
echo.
exit /b 0
