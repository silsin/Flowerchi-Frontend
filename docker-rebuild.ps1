# Docker Build and Re-run Script for Flowerchi Frontend
# This script builds and restarts Docker containers

param(
    [Parameter(Mandatory = $false)]
    [string]$Profile = "default",
    [Parameter(Mandatory = $false)]
    [switch]$CleanBuild = $false,
    [Parameter(Mandatory = $false)]
    [switch]$Logs = $false,
    [Parameter(Mandatory = $false)]
    [switch]$NoCache = $false
)

# Colors for output
$colors = @{
    success = "Green"
    error   = "Red"
    warning = "Yellow"
    info    = "Cyan"
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "info"
    )
    $color = $colors[$Level]
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] $Message" -ForegroundColor $color
}

function Test-DockerInstalled {
    try {
        $null = docker --version
        Write-Log "Docker is installed" "success"
        return $true
    }
    catch {
        Write-Log "Docker is not installed or not in PATH" "error"
        return $false
    }
}

function Test-DockerRunning {
    try {
        $null = docker ps
        Write-Log "Docker daemon is running" "success"
        return $true
    }
    catch {
        Write-Log "Docker daemon is not running" "error"
        return $false
    }
}

function Stop-Containers {
    Write-Log "Stopping running containers..." "info"
    try {
        if ($Profile -eq "docker-edge") {
            docker compose --profile $Profile down
        }
        else {
            docker compose down
        }
        Write-Log "Containers stopped successfully" "success"
        return $true
    }
    catch {
        Write-Log "Error stopping containers: $_" "warning"
        return $false
    }
}

function Remove-Volumes {
    Write-Log "Removing volumes for clean build..." "info"
    try {
        docker volume prune -f --filter "label!=keep" 2>$null
        Write-Log "Volumes removed" "success"
    }
    catch {
        Write-Log "Could not remove all volumes (this is okay)" "warning"
    }
}

function Build-Containers {
    Write-Log "Building Docker containers..." "info"
    $buildArgs = @()
    
    if ($NoCache) {
        $buildArgs += "--no-cache"
        Write-Log "Building without cache (--no-cache)" "info"
    }
    
    try {
        if ($Profile -eq "docker-edge") {
            Write-Log "Building with profile: docker-edge" "info"
            docker compose --profile $Profile build $buildArgs
        }
        else {
            docker compose build $buildArgs
        }
        Write-Log "Build completed successfully" "success"
        return $true
    }
    catch {
        Write-Log "Build failed: $_" "error"
        return $false
    }
}

function Start-Containers {
    Write-Log "Starting containers..." "info"
    try {
        if ($Profile -eq "docker-edge") {
            docker compose --profile $Profile up -d
        }
        else {
            docker compose up -d
        }
        Write-Log "Containers started successfully" "success"
        
        # Wait for services to be ready
        Write-Log "Waiting for services to be ready..." "info"
        Start-Sleep -Seconds 3
        
        # Check service health
        Check-ServiceHealth
        return $true
    }
    catch {
        Write-Log "Failed to start containers: $_" "error"
        return $false
    }
}

function Check-ServiceHealth {
    Write-Log "Checking service health..." "info"
    
    try {
        $status = docker compose ps --format "json" | ConvertFrom-Json
        foreach ($service in $status) {
            if ($service.State -match "running") {
                Write-Log "✓ $($service.Service) is running" "success"
            }
            else {
                Write-Log "✗ $($service.Service) state: $($service.State)" "warning"
            }
        }
    }
    catch {
        Write-Log "Could not check service status" "warning"
    }
}

function Show-Logs {
    Write-Log "Displaying container logs (last 50 lines)..." "info"
    docker compose logs --tail 50 --timestamps
}

# Main execution
function Main {
    Write-Log "========================================" "info"
    Write-Log "Flowerchi Docker Build & Re-run Script" "info"
    Write-Log "========================================" "info"
    
    # Check prerequisites
    if (-not (Test-DockerInstalled)) {
        Write-Log "Please install Docker Desktop for Windows" "error"
        exit 1
    }
    
    if (-not (Test-DockerRunning)) {
        Write-Log "Please start Docker Desktop" "error"
        exit 1
    }
    
    # Check for .env file
    if (-not (Test-Path ".env")) {
        Write-Log ".env file not found. Please copy .env.example to .env and configure it" "error"
        exit 1
    }
    
    Write-Log "Profile: $Profile" "info"
    Write-Log "Clean Build: $CleanBuild" "info"
    Write-Log ""
    
    # Execute steps
    if (-not (Stop-Containers)) {
        Write-Log "Failed to stop containers" "error"
        exit 1
    }
    
    if ($CleanBuild) {
        Remove-Volumes
    }
    
    if (-not (Build-Containers)) {
        Write-Log "Build failed" "error"
        exit 1
    }
    
    if (-not (Start-Containers)) {
        Write-Log "Failed to start containers" "error"
        exit 1
    }
    
    Write-Log "" "info"
    Write-Log "========================================" "success"
    Write-Log "Docker containers are ready!" "success"
    Write-Log "========================================" "success"
    Write-Log "Access the application at: http://localhost:3000" "info"
    
    if ($Profile -eq "docker-edge") {
        Write-Log "Edge services available at configured domain" "info"
    }
    
    if ($Logs) {
        Write-Log "" "info"
        Show-Logs
    }
    else {
        Write-Log "To view logs, run: docker compose logs --follow" "info"
    }
}

# Execute main function
Main
