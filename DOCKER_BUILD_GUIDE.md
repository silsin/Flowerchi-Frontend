# Docker Build and Re-run Guide

This project includes scripts to automate Docker container building and restarting.

## Quick Start

### Using PowerShell (Recommended)
```powershell
.\docker-rebuild.ps1
```

### Using Command Prompt (CMD)
```cmd
docker-rebuild.bat
```

## Script Options

### PowerShell Script

```powershell
# Standard build
.\docker-rebuild.ps1

# Build with docker-edge profile (nginx + certbot)
.\docker-rebuild.ps1 -Profile docker-edge

# Clean build (removes volumes, fresh database)
.\docker-rebuild.ps1 -CleanBuild

# Build without cache
.\docker-rebuild.ps1 -NoCache

# Show logs after build
.\docker-rebuild.ps1 -Logs

# Combine options
.\docker-rebuild.ps1 -Profile docker-edge -CleanBuild -Logs
```

### Batch Script

```cmd
REM Standard build
docker-rebuild.bat

REM Build with docker-edge profile
docker-rebuild.bat --profile docker-edge

REM Clean build
docker-rebuild.bat --clean

REM Build without cache
docker-rebuild.bat --no-cache

REM Show logs after build
docker-rebuild.bat --logs

REM Combine options
docker-rebuild.bat --profile docker-edge --clean --logs

REM Help
docker-rebuild.bat --help
```

## What the Scripts Do

1. **Verify Prerequisites**
   - Checks if Docker is installed
   - Verifies Docker daemon is running
   - Confirms `.env` file exists

2. **Stop Containers**
   - Gracefully stops all running containers
   - Cleans up networks

3. **Clean Build (Optional)**
   - Removes volumes (if `--clean` or `-CleanBuild` specified)
   - Useful for resetting database state

4. **Build Images**
   - Builds Docker images based on Dockerfile(s)
   - Uses cache by default (faster)
   - Option to rebuild without cache if needed

5. **Start Containers**
   - Starts all services defined in docker-compose.yaml
   - Waits for services to be ready

6. **Health Check**
   - Verifies all services are running
   - Displays service status

## Environment Setup

Before running the scripts, ensure you have a `.env` file configured:

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - POSTGRES_PASSWORD
# - AUTH_SECRET
# - NEXT_PUBLIC_APP_URL
```

## Services

### Default Profile
- **app**: Next.js application (port 3000)
- **db**: PostgreSQL database (port 5432)

### Docker-Edge Profile (includes default + edge services)
- **nginx**: Reverse proxy (ports 80, 443)
- **certbot**: Let's Encrypt certificate manager

## Access Points

- **Application**: http://localhost:3000 (default profile)
- **Edge Domain**: Configured domain (docker-edge profile)

## Viewing Logs

### Real-time logs
```bash
docker compose logs --follow
```

### Last 50 lines
```bash
docker compose logs --tail 50
```

### Specific service logs
```bash
docker compose logs --follow app
docker compose logs --follow db
```

## Common Tasks

### Full clean rebuild
```powershell
.\docker-rebuild.ps1 -CleanBuild -NoCache -Logs
```

```cmd
docker-rebuild.bat --clean --no-cache --logs
```

### Edge deployment rebuild
```powershell
.\docker-rebuild.ps1 -Profile docker-edge -Logs
```

```cmd
docker-rebuild.bat --profile docker-edge --logs
```

### Rebuild and watch logs
```powershell
.\docker-rebuild.ps1 -Logs
# Logs continue to display...
# Press Ctrl+C to exit
```

### Rebuild app only (without database)
```bash
docker compose up -d --build app
```

### Full cleanup (containers + volumes)
```bash
docker compose down -v
```

## Troubleshooting

### Docker daemon not running
- Open Docker Desktop application
- Wait for it to fully start

### Port already in use
- Check what's using the port: `netstat -ano | findstr :3000`
- Either stop that service or change port in `.env`

### Build failures
- Run with `--no-cache` flag to force clean build
- Check Docker Desktop resource allocation (Settings → Resources)
- Ensure sufficient disk space available

### Database connection errors
- Verify POSTGRES_PASSWORD in `.env`
- Check if db service is healthy: `docker compose ps`
- View db logs: `docker compose logs db`

### Permission denied errors (Linux/Mac)
- Ensure user is in docker group: `sudo usermod -aG docker $USER`
- Or prefix commands with `sudo`

## Manual Docker Commands

If you prefer manual control:

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (clean state)
docker compose down -v

# Build images
docker compose build

# Start services
docker compose up -d

# View status
docker compose ps

# View logs
docker compose logs --follow

# Rebuild specific service
docker compose up -d --build app
```

## Performance Tips

- **First build**: May take 5-10 minutes (dependencies download)
- **Subsequent builds**: Typically 1-2 minutes (uses cache)
- **Full rebuild without cache**: Comparable to first build

## Notes

- Scripts use `docker compose` (v2) - ensure you have the latest Docker Desktop
- Volumes persist between runs (unless `--clean` flag used)
- Containers are configured to restart automatically on failure
- Database is automatically initialized on first run
