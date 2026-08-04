# Flowerchi Automatic Setup Script - Windows PowerShell
# This script automatically sets up the entire application
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Color codes
$colors = @{
    'Blue'   = [System.ConsoleColor]::Cyan
    'Green'  = [System.ConsoleColor]::Green
    'Yellow' = [System.ConsoleColor]::Yellow
    'Red'    = [System.ConsoleColor]::Red
}

function Print-Step {
    param([string]$message)
    Write-Host "[*] $message" -ForegroundColor $colors['Blue']
}

function Print-Success {
    param([string]$message)
    Write-Host "[✓] $message" -ForegroundColor $colors['Green']
}

function Print-Warning {
    param([string]$message)
    Write-Host "[!] $message" -ForegroundColor $colors['Yellow']
}

function Print-Error {
    param([string]$message)
    Write-Host "[✗] $message" -ForegroundColor $colors['Red']
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Flowerchi Automatic Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Print-Warning "Not running as Administrator. Some operations may fail."
    Print-Step "Consider running: powershell -ExecutionPolicy Bypass -File setup.ps1 -Verb RunAs"
}

# Check if .env exists
if (Test-Path ".env") {
    Print-Warning ".env file already exists. Skipping creation."
} else {
    Print-Step "Creating .env file from template..."
    if (-not (Test-Path ".env.example")) {
        Print-Error ".env.example not found"
        exit 1
    }
    Copy-Item -Path ".env.example" -Destination ".env"
    Print-Success ".env created"
}

# Generate strong random values
Print-Step "Generating strong passwords..."
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$POSTGRES_PASSWORD = [Convert]::ToBase64String($bytes)

$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$AUTH_SECRET = [Convert]::ToBase64String($bytes)

Print-Success "Passwords generated"

# Update .env with generated values
Print-Step "Updating .env with generated values..."
$envContent = Get-Content ".env" -Raw
$envContent = $envContent -replace "replace-with-a-long-random-password", $POSTGRES_PASSWORD
$envContent = $envContent -replace "replace-with-at-least-32-random-characters", $AUTH_SECRET
Set-Content -Path ".env" -Value $envContent
Print-Success ".env updated with generated passwords"

# Check if Docker is installed
Print-Step "Checking for Docker..."
try {
    $dockerVersion = docker --version 2>$null
    Print-Success "Docker found: $dockerVersion"
} catch {
    Print-Error "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
}

# Check if Docker Compose is available
Print-Step "Checking for Docker Compose..."
try {
    $composeVersion = docker-compose --version 2>$null
    Print-Success "Docker Compose found: $composeVersion"
} catch {
    Print-Error "Docker Compose is not available. Make sure Docker Desktop is installed with Compose enabled."
    exit 1
}

# Check if Docker daemon is running
Print-Step "Checking if Docker daemon is running..."
try {
    docker info >$null 2>&1
    Print-Success "Docker daemon is running"
} catch {
    Print-Error "Docker daemon is not running. Please start Docker Desktop."
    exit 1
}

# Stop existing containers
Print-Step "Stopping any existing containers..."
try {
    docker-compose down 2>$null
} catch {
    # Ignore errors if nothing is running
}
Print-Success "Containers stopped"

# Build and start services
Print-Step "Building and starting services (this may take a few minutes)..."
try {
    docker-compose up -d --build
    Print-Success "Services started"
} catch {
    Print-Error "Failed to start services: $_"
    exit 1
}

# Wait for database to be ready
Print-Step "Waiting for PostgreSQL to be ready..."
$attempt = 0
$maxAttempts = 30

while ($attempt -lt $maxAttempts) {
    try {
        $result = docker-compose exec -T db pg_isready -U flowerchi -d flowerchi 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Print-Success "PostgreSQL is ready"
            break
        }
    } catch {
        # Continue waiting
    }
    $attempt++
    if ($attempt -lt $maxAttempts) {
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 1
    }
}

if ($attempt -ge $maxAttempts) {
    Write-Host ""
    Print-Error "PostgreSQL did not start after $maxAttempts attempts"
    exit 1
}

# Verify database schema
Print-Step "Verifying database schema..."
try {
    docker-compose exec -T db psql -U flowerchi -d flowerchi -c "\dt" >$null 2>&1
    Print-Success "Database schema verified"
} catch {
    Print-Error "Failed to verify database schema"
    exit 1
}

# Wait for app to be ready
Print-Step "Waiting for application to start (10 seconds)..."
Start-Sleep -Seconds 10

$attempt = 0
$maxAttempts = 60
$appReady = $false

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host ""
            Print-Success "Application is responding"
            $appReady = $true
            break
        }
    } catch {
        # Continue waiting
    }
    $attempt++
    if ($attempt -lt $maxAttempts) {
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 1
    }
}

if (-not $appReady -and $attempt -ge $maxAttempts) {
    Write-Host ""
    Print-Warning "Application may not be fully ready yet, but containers are running"
}

# Display summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  Database: flowerchi"
Write-Host "  User: flowerchi"
Write-Host "  Password: (auto-generated, check .env)"
Write-Host "  Port: 5432"
Write-Host ""
Write-Host "Application URL:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000"
Write-Host ""
Write-Host "Admin Setup:" -ForegroundColor Cyan
Write-Host "  1. Visit http://localhost:3000/setup"
Write-Host "  2. Create your first administrator account"
Write-Host "  3. You'll be automatically logged in"
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "  View logs:          docker-compose logs -f app"
Write-Host "  View DB logs:       docker-compose logs -f db"
Write-Host "  Stop services:      docker-compose stop"
Write-Host "  Start services:     docker-compose start"
Write-Host "  Restart services:   docker-compose restart"
Write-Host "  Remove everything:  docker-compose down -v"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000 in your browser"
Write-Host "  2. Go to /setup to create first admin"
Write-Host "  3. Log in and start using the app"
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Prompt to open browser
$openBrowser = Read-Host "Would you like to open http://localhost:3000 in your browser? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "yes") {
    Start-Process "http://localhost:3000"
}
