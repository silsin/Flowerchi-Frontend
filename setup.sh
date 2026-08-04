#!/bin/bash

# Flowerchi Automatic Setup Script - Linux/Mac
# This script automatically sets up the entire application

set -e  # Exit on any error

echo "=========================================="
echo "   Flowerchi Automatic Setup"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_step() {
    echo -e "${BLUE}[*] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[✓] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
    echo -e "${RED}[✗] $1${NC}"
}

# Check if .env exists
if [ -f ".env" ]; then
    print_warning ".env file already exists. Skipping creation."
else
    print_step "Creating .env file from template..."
    cp .env.example .env
    print_success ".env created"
fi

# Generate strong random values
print_step "Generating strong passwords..."

if command -v openssl &> /dev/null; then
    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    AUTH_SECRET=$(openssl rand -base64 32)
else
    print_error "OpenSSL not found. Please install it or manually set passwords in .env"
    exit 1
fi

print_success "Passwords generated"

# Update .env with generated values
print_step "Updating .env with generated values..."

# Escape special characters for sed
POSTGRES_PASSWORD_ESCAPED=$(printf '%s\n' "$POSTGRES_PASSWORD" | sed -e 's/[\/&]/\\&/g')
AUTH_SECRET_ESCAPED=$(printf '%s\n' "$AUTH_SECRET" | sed -e 's/[\/&]/\\&/g')

# macOS uses different sed syntax
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/replace-with-a-long-random-password/$POSTGRES_PASSWORD_ESCAPED/" .env
    sed -i '' "s/replace-with-at-least-32-random-characters/$AUTH_SECRET_ESCAPED/" .env
else
    sed -i "s/replace-with-a-long-random-password/$POSTGRES_PASSWORD_ESCAPED/" .env
    sed -i "s/replace-with-at-least-32-random-characters/$AUTH_SECRET_ESCAPED/" .env
fi

print_success ".env updated with generated passwords"

# Check if Docker is installed
print_step "Checking for Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi
print_success "Docker found"

# Check if Docker Compose is installed
print_step "Checking for Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it via: sudo apt install docker-compose (Linux) or brew install docker-compose (Mac)"
    exit 1
fi
print_success "Docker Compose found"

# Check if Docker daemon is running
print_step "Checking if Docker daemon is running..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker daemon is not running. Please start Docker."
    exit 1
fi
print_success "Docker daemon is running"

# Stop existing containers if running
print_step "Stopping any existing containers..."
docker-compose down 2>/dev/null || true
print_success "Containers stopped"

# Build and start services
print_step "Building and starting services (this may take a few minutes)..."
docker-compose up -d --build

# Wait for database to be ready
print_step "Waiting for PostgreSQL to be ready..."
attempt=0
max_attempts=30
until docker-compose exec -T db pg_isready -U flowerchi -d flowerchi > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        print_error "PostgreSQL did not start after $max_attempts attempts"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""
print_success "PostgreSQL is ready"

# Verify database schema
print_step "Verifying database schema..."
if docker-compose exec -T db psql -U flowerchi -d flowerchi -c "\dt" > /dev/null 2>&1; then
    print_success "Database schema verified"
else
    print_error "Failed to verify database schema"
    exit 1
fi

# Wait for app to be ready
print_step "Waiting for application to start..."
sleep 10
attempt=0
max_attempts=60
until curl -s http://localhost:3000 > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        print_warning "Application may not be fully ready yet, but containers are running"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""
print_success "Application is responding"

# Display summary
echo ""
echo "=========================================="
echo -e "${GREEN}   Setup Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}Database Configuration:${NC}"
echo "  Database: flowerchi"
echo "  User: flowerchi"
echo "  Password: (auto-generated, check .env)"
echo "  Port: 5432"
echo ""
echo -e "${BLUE}Application URL:${NC}"
echo "  http://localhost:3000"
echo ""
echo -e "${BLUE}Admin Setup:${NC}"
echo "  1. Visit http://localhost:3000/setup"
echo "  2. Create your first administrator account"
echo "  3. You'll be automatically logged in"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs:          docker-compose logs -f app"
echo "  View DB logs:       docker-compose logs -f db"
echo "  Stop services:      docker-compose stop"
echo "  Start services:     docker-compose start"
echo "  Restart services:   docker-compose restart"
echo "  Remove everything:  docker-compose down -v"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Go to /setup to create first admin"
echo "  3. Log in and start using the app"
echo ""
echo "=========================================="
