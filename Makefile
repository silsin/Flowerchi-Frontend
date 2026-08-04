.PHONY: help setup start stop restart logs logs-app logs-db clean db-connect db-backup db-restore health

# Default target
help:
	@echo "=========================================="
	@echo "   Flowerchi Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Setup & Management:"
	@echo "  make setup          - Automatic setup (generates .env, starts services)"
	@echo "  make start          - Start all services"
	@echo "  make stop           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make clean          - Stop and remove all containers (keeps data)"
	@echo "  make clean-all      - Stop and remove everything including data ⚠️"
	@echo ""
	@echo "Logs & Monitoring:"
	@echo "  make logs           - View all logs"
	@echo "  make logs-app       - View application logs"
	@echo "  make logs-db        - View database logs"
	@echo "  make health         - Check service health"
	@echo ""
	@echo "Database Management:"
	@echo "  make db-connect     - Connect to PostgreSQL shell"
	@echo "  make db-backup      - Backup database to backup.sql"
	@echo "  make db-restore     - Restore database from backup.sql"
	@echo "  make db-init        - Re-initialize database schema"
	@echo ""
	@echo "Development:"
	@echo "  make build          - Build application (npm run build)"
	@echo "  make dev            - Start development server locally"
	@echo "  make test           - Run tests"
	@echo ""
	@echo "=========================================="

# Setup: Generate .env, create database, start services
setup:
	@echo "Starting Flowerchi setup..."
	@if [ -f setup.sh ]; then \
		chmod +x setup.sh; \
		./setup.sh; \
	else \
		echo "setup.sh not found"; \
		exit 1; \
	fi

# Start services
start:
	@echo "Starting services..."
	docker-compose up -d --build
	@echo "✓ Services started"
	@echo "Application: http://localhost:3000"

# Stop services
stop:
	@echo "Stopping services..."
	docker-compose stop
	@echo "✓ Services stopped (data preserved)"

# Restart services
restart:
	@echo "Restarting services..."
	docker-compose restart
	@echo "✓ Services restarted"

# Clean up (keep data)
clean:
	@echo "Removing containers (keeping data)..."
	docker-compose down
	@echo "✓ Containers removed"
	@echo "To restart: make start"

# Complete cleanup (delete everything)
clean-all:
	@echo "⚠️  Removing ALL containers and data..."
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "✓ Everything removed"; \
	else \
		echo "Cancelled"; \
	fi

# View all logs
logs:
	docker-compose logs -f

# View application logs
logs-app:
	docker-compose logs -f app

# View database logs
logs-db:
	docker-compose logs -f db

# Check service health
health:
	@echo "Checking service health..."
	@echo ""
	@echo "Container Status:"
	@docker-compose ps
	@echo ""
	@echo "Database Status:"
	@docker-compose exec -T db pg_isready -U flowerchi -d flowerchi 2>/dev/null && echo "✓ PostgreSQL is ready" || echo "✗ PostgreSQL not ready"
	@echo ""
	@echo "Application Status:"
	@curl -s http://localhost:3000 > /dev/null && echo "✓ Application is responding" || echo "✗ Application not responding"
	@echo ""

# Connect to PostgreSQL
db-connect:
	@echo "Connecting to PostgreSQL..."
	docker-compose exec db psql -U flowerchi -d flowerchi

# Backup database
db-backup:
	@echo "Backing up database..."
	docker-compose exec db pg_dump -U flowerchi flowerchi > backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✓ Database backed up to backup-*.sql"

# Restore database
db-restore:
	@if [ ! -f backup.sql ]; then \
		echo "backup.sql not found"; \
		exit 1; \
	fi
	@echo "⚠️  Restoring database from backup.sql..."
	@read -p "Are you sure? This will overwrite current data (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec -T db psql -U flowerchi flowerchi < backup.sql; \
		echo "✓ Database restored"; \
	else \
		echo "Cancelled"; \
	fi

# Reinitialize database
db-init:
	@echo "⚠️  Reinitializing database..."
	@read -p "This will reset all data. Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec -T db psql -U flowerchi -d flowerchi -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"; \
		docker-compose exec -T db psql -U flowerchi -d flowerchi -f /docker-entrypoint-initdb.d/01-init.sql; \
		echo "✓ Database reinitialized"; \
	else \
		echo "Cancelled"; \
	fi

# Build application
build:
	@echo "Building application..."
	npm run build
	@echo "✓ Build complete"

# Development server
dev:
	@echo "Starting development server..."
	npm run dev

# Run tests
test:
	@echo "Running tests..."
	npm run test

# Show environment info
info:
	@echo "=========================================="
	@echo "   Flowerchi Environment Information"
	@echo "=========================================="
	@echo ""
	@echo "Docker Version:"
	@docker --version
	@echo ""
	@echo "Docker Compose Version:"
	@docker-compose --version
	@echo ""
	@echo "Service Status:"
	@docker-compose ps
	@echo ""
	@echo "Environment (.env file):"
	@if [ -f .env ]; then \
		echo "✓ .env file exists"; \
		grep -E "^(DATABASE_URL|AUTH_SECRET|APP_PORT)" .env | sed 's/=.*PASSWORD.*/=***HIDDEN***/'; \
	else \
		echo "✗ .env file not found"; \
	fi
	@echo ""

.DEFAULT_GOAL := help
