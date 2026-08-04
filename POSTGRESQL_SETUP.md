# PostgreSQL Setup Guide for Flowerchi

This guide covers all methods to set up PostgreSQL for the Flowerchi project.

## Table of Contents
- [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
- [Option 2: Local PostgreSQL Installation](#option-2-local-postgresql-installation)
- [Option 3: PostgreSQL Cloud Services](#option-3-postgresql-cloud-services)
- [Verification & Testing](#verification--testing)
- [Troubleshooting](#troubleshooting)

---

## Option 1: Docker Compose (Recommended)

**Best for:** Development, testing, and production deployment. Database runs in a container alongside your app.

### Prerequisites
- Docker and Docker Compose installed
- 2GB+ free disk space

### Setup Steps

#### 1. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set these values:

```env
DATABASE_URL=postgresql://flowerchi:change-this-db-password@db:5432/flowerchi
AUTH_SECRET=replace-with-at-least-32-random-characters
POSTGRES_PASSWORD=replace-with-a-long-random-password
ZARINPAL_MERCHANT_ID=your-merchant-id
DOMAIN=majazinos.ir
LETSENCRYPT_EMAIL=admin@majazinos.ir
NEXT_PUBLIC_APP_URL=https://majazinos.ir
APP_PORT=30003
```

**Important:** Generate strong passwords:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

#### 2. Start PostgreSQL and Application

```bash
# Start all services (app + db)
docker compose up -d --build

# View logs
docker compose logs -f db app

# Check status
docker compose ps
```

#### 3. Verify Installation

```bash
# Connect to PostgreSQL container
docker compose exec db psql -U flowerchi -d flowerchi

# Inside psql, run:
SELECT * FROM pg_tables WHERE schemaname = 'public';
\dt

# Exit with \q
```

### Database Persistence

- Data is stored in Docker volume: `postgres_data`
- Survives container restarts
- To backup: `docker compose exec db pg_dump -U flowerchi flowerchi > backup.sql`
- To restore: `docker compose exec -T db psql -U flowerchi flowerchi < backup.sql`

### Stop/Restart

```bash
# Stop all services
docker compose down

# Stop but keep data
docker compose stop

# Restart
docker compose start

# Remove everything including data
docker compose down -v
```

---

## Option 2: Local PostgreSQL Installation

**Best for:** Development without Docker, or advanced configurations.

### Windows

#### Using PostgreSQL Installer

1. Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run installer, choose version 16+ 
3. Note the password you set for `postgres` superuser
4. Accept default port 5432
5. Installation includes pgAdmin (optional graphical tool)

#### Using Chocolatey (Windows Package Manager)

```powershell
choco install postgresql
```

#### Using WSL2 (Windows Subsystem for Linux)

```bash
# Inside WSL terminal
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo service postgresql start

# Check status
sudo service postgresql status
```

### macOS

#### Using Homebrew

```bash
# Install
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Check status
brew services list
```

#### Using PostgreSQL Installer

Download from [postgresql.org/download/macosx](https://www.postgresql.org/download/macosx/)

### Linux (Ubuntu/Debian)

```bash
# Install
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
systemctl status postgresql
```

### Creating Flowerchi Database Locally

Once PostgreSQL is installed and running:

```bash
# Connect as superuser
psql -U postgres

# Inside psql:
```

```sql
-- Create user
CREATE USER flowerchi WITH PASSWORD 'change-this-db-password';

-- Create database
CREATE DATABASE flowerchi OWNER flowerchi;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE flowerchi TO flowerchi;

-- Connect to database
\c flowerchi

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO flowerchi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO flowerchi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO flowerchi;

-- Exit
\q
```

### Initialize Schema

```bash
# Run the initialization script
psql -U flowerchi -d flowerchi -f database/init.sql

# Or if using WSL/Linux with sudo
sudo -u postgres psql -U flowerchi -d flowerchi -f database/init.sql
```

### Configure Application

Update `.env`:

```env
DATABASE_URL=postgresql://flowerchi:change-this-db-password@localhost:5432/flowerchi
AUTH_SECRET=replace-with-at-least-32-random-characters
```

### Install Node.js Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or build and run production
npm run build
npm start
```

---

## Option 3: PostgreSQL Cloud Services

**Best for:** Production hosting, managed backups, and scalability.

### Heroku PostgreSQL

```bash
# Create Heroku app (requires Heroku CLI)
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:essential-0

# Get connection string
heroku config:get DATABASE_URL

# Update .env
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### Railway (easiest, free tier available)

1. Sign up at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL plugin
4. Copy connection string
5. Update `.env` with the provided URL

### AWS RDS

```bash
# Create RDS instance via AWS CLI
aws rds create-db-instance \
  --db-instance-identifier flowerchi-db \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username flowerchi \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20

# Get endpoint
aws rds describe-db-instances --query 'DBInstances[0].Endpoint.Address'

# Update CONNECTION STRING
DATABASE_URL=postgresql://flowerchi:password@your-rds-endpoint:5432/flowerchi
```

### DigitalOcean Managed Database

1. Log in to DigitalOcean
2. Create → Databases → PostgreSQL 16
3. Copy connection string
4. Update `.env`

### Azure Database for PostgreSQL

1. Create via Azure Portal
2. Configure firewall rules
3. Get connection string from Connection Strings section
4. Update `.env`

---

## Verification & Testing

### Check Database Connection

```bash
# Using psql directly
psql postgresql://flowerchi:password@localhost:5432/flowerchi

# Or Docker
docker compose exec db psql -U flowerchi -d flowerchi
```

### Verify Tables Created

```sql
-- List all tables
\dt

-- Expected output:
-- Schema |      Name      | Type  |  Owner
-- --------+----------------+-------+----------
--  public | app_settings   | table | flowerchi
--  public | audit_logs     | table | flowerchi
--  public | categories     | table | flowerchi
--  public | orders         | table | flowerchi
--  public | payments       | table | flowerchi
--  public | platforms      | table | flowerchi
--  public | services       | table | flowerchi
--  public | users          | table | flowerchi
```

### Check Sample Data

```sql
-- View platforms
SELECT * FROM platforms;

-- View app settings
SELECT key, value FROM app_settings;

-- Count records
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'platforms', COUNT(*) FROM platforms
UNION ALL
SELECT 'services', COUNT(*) FROM services;
```

### Test API Connection

```bash
# After app is running, test the health endpoint
curl http://localhost:3000/api/health

# Or test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## Troubleshooting

### "Connection refused" / "Cannot connect to database"

**Docker:**
```bash
# Ensure db service is running
docker compose ps

# Check logs
docker compose logs db

# Restart
docker compose restart db
```

**Local:**
```bash
# Check if PostgreSQL service is running
# Windows: Services app → PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Restart service
sudo systemctl restart postgresql  # Linux
brew services restart postgresql@16  # Mac
```

### "FATAL: password authentication failed for user 'flowerchi'"

```bash
# Reset password
sudo -u postgres psql

# In psql:
ALTER USER flowerchi WITH PASSWORD 'new-password';

# Update .env with new password
```

### "database 'flowerchi' does not exist"

```bash
# Recreate database
psql -U postgres

# In psql:
CREATE DATABASE flowerchi OWNER flowerchi;
```

### "relation 'users' does not exist"

```bash
# Run schema initialization
psql -U flowerchi -d flowerchi -f database/init.sql
```

### Port Already in Use (5432)

```bash
# Find process using port 5432
# Windows
netstat -ano | findstr :5432

# Linux/Mac
lsof -i :5432

# Change port in .env if needed
DATABASE_URL=postgresql://flowerchi:password@localhost:5433/flowerchi

# Docker Compose can also use different port:
# In compose.yaml change ports to: "5433:5432"
```

### Backup and Restore

```bash
# Backup
pg_dump -U flowerchi -d flowerchi -f backup.sql

# Restore
psql -U flowerchi -d flowerchi < backup.sql

# Or with Docker
docker compose exec db pg_dump -U flowerchi flowerchi > backup.sql
docker compose exec -T db psql -U flowerchi flowerchi < backup.sql
```

### Connection Pool Issues

If seeing "too many connections" errors:

1. Check `.env` configuration
2. Ensure previous connections are closed
3. Increase connection pool in `src/lib/db.ts`:

```typescript
// Currently set to 10, increase to 20-30
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 30,  // Increase this value
});
```

---

## Quick Reference

| Aspect | Value |
|--------|-------|
| Default Port | 5432 |
| Default Username | flowerchi |
| Database Name | flowerchi |
| Version Required | 13+ (recommended 16) |
| Init Script | `database/init.sql` |

## Next Steps

1. Choose your setup option (Docker, Local, or Cloud)
2. Follow the setup steps for your choice
3. Run verification queries to confirm
4. Update `.env` with correct connection string
5. Start the application: `npm run dev` (local) or `docker compose up -d` (Docker)
6. Visit admin setup page at `/setup` to create first administrator
