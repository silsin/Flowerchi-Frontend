#!/bin/bash

# Docker Build and Re-run Script for Flowerchi Frontend
# Usage: ./docker-rebuild.sh [OPTIONS]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
PROFILE="default"
CLEAN_BUILD=false
SHOW_LOGS=false
NO_CACHE=""

# Functions
log_info() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] INFO: $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] SUCCESS: $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ERROR: $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING: $1${NC}"
}

show_help() {
    cat << EOF
Docker Build and Re-run Script for Flowerchi Frontend

Usage: $0 [OPTIONS]

Options:
    --profile PROFILE       Use specific profile (default: default)
                           Available: default, docker-edge
    --clean                Clean build (remove volumes and data)
    --logs                 Show logs after build
    --no-cache             Build without cache
    -h, --help             Show this help message

Examples:
    $0                              # Standard build
    $0 --profile docker-edge        # Build with edge profile (nginx + certbot)
    $0 --clean                      # Clean build
    $0 --no-cache --logs            # Build without cache and show logs
    $0 --profile docker-edge --logs # Edge profile with logs

EOF
    exit 0
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    log_success "Docker is installed"
}

check_docker_running() {
    if ! docker ps &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
    log_success "Docker daemon is running"
}

check_env_file() {
    if [ ! -f ".env" ]; then
        log_error ".env file not found"
        log_info "Please copy .env.example to .env and configure it"
        exit 1
    fi
    log_success ".env file found"
}

stop_containers() {
    log_info "Stopping running containers..."
    if [ "$PROFILE" == "docker-edge" ]; then
        docker compose --profile "$PROFILE" down || log_warn "Could not stop containers"
    else
        docker compose down || log_warn "Could not stop containers"
    fi
    log_success "Containers stopped"
}

clean_volumes() {
    log_info "Removing volumes for clean build..."
    docker volume prune -f --filter "label!=keep" 2>/dev/null || true
    log_success "Volumes removed"
}

build_containers() {
    log_info "Building Docker containers..."
    
    if [ "$PROFILE" == "docker-edge" ]; then
        docker compose --profile "$PROFILE" build $NO_CACHE
    else
        docker compose build $NO_CACHE
    fi
    
    if [ $? -eq 0 ]; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
        exit 1
    fi
}

start_containers() {
    log_info "Starting containers..."
    
    if [ "$PROFILE" == "docker-edge" ]; then
        docker compose --profile "$PROFILE" up -d
    else
        docker compose up -d
    fi
    
    if [ $? -eq 0 ]; then
        log_success "Containers started successfully"
    else
        log_error "Failed to start containers"
        exit 1
    fi
}

check_health() {
    log_info "Waiting for services to be ready..."
    sleep 3
    
    log_info "Checking service health..."
    docker compose ps --format "table {{.Service}}\t{{.State}}"
}

show_logs() {
    log_info "Displaying container logs (last 50 lines)..."
    docker compose logs --tail 50 --timestamps
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            ;;
    esac
done

# Main execution
main() {
    echo ""
    echo "========================================"
    echo "Flowerchi Docker Build & Re-run Script"
    echo "========================================"
    echo ""
    
    log_info "Profile: $PROFILE"
    log_info "Clean Build: $CLEAN_BUILD"
    log_info "No Cache: ${NO_CACHE:- (using cache)}"
    echo ""
    
    # Checks
    check_docker
    check_docker_running
    check_env_file
    echo ""
    
    # Execute
    stop_containers
    
    if [ "$CLEAN_BUILD" = true ]; then
        clean_volumes
    fi
    
    if [ -n "$NO_CACHE" ]; then
        log_info "Building without cache (--no-cache)"
    fi
    
    build_containers
    start_containers
    check_health
    
    echo ""
    echo "========================================"
    log_success "Docker containers are ready!"
    echo "========================================"
    log_info "Access the application at: http://localhost:3000"
    
    if [ "$PROFILE" == "docker-edge" ]; then
        log_info "Edge services available at configured domain"
    fi
    
    echo ""
    
    if [ "$SHOW_LOGS" = true ]; then
        echo ""
        show_logs
    else
        log_info "To view logs, run: docker compose logs --follow"
    fi
    
    echo ""
}

# Run main
main
