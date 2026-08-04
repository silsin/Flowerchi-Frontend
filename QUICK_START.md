# Flowerchi - Quick Start Guide

Automated setup scripts to get Flowerchi running in seconds.

## One-Command Setup

Choose your operating system:

### **Windows Users**

#### Option 1: PowerShell (Recommended)
```powershell
# Run in PowerShell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

#### Option 2: Command Prompt
```cmd
# Run in Command Prompt (cmd.exe)
setup.bat
```

#### Option 3: Manual PowerShell
```powershell
# If you get execution policy errors, run as Administrator first:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
.\setup.ps1
```

### **macOS Users**

```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### **Linux Users**

```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

---

## What The Setup Script Does

The automated setup script performs these steps:

1. ✅ **Creates `.env` file** from template
2. ✅ **Generates strong passwords** for database and secrets
3. ✅ **Updates `.env`** with generated values
4. ✅ **Checks Docker** is installed and running
5. ✅ **Stops existing containers** (if any)
6. ✅ **Builds and starts services** using Docker Compose
7. ✅ **Waits for PostgreSQL** to initialize
8. ✅ **Verifies database schema** was created
9. ✅ **Waits for application** to start
10. ✅ **Displays success summary** with next steps

**Total time:** ~3-5 minutes (first run), ~1-2 minutes (subsequent runs)

---

## After Setup Completes

### ✅ Everything is running automatically:

- **Web Application:** http://localhost:3000
- **Database:** PostgreSQL running in Docker
- **API:** Ready to accept requests
- **Admin Panel:** Ready for first setup

### 📋 Create First Administrator

1. Open browser to: **http://localhost:3000/setup**
2. Fill in administrator details:
   - Full Name
   - Email
   - Password
3. Click "Create Administrator"
4. You're logged in and ready to go!

### 🔐 Your Setup Created:

- **Secure database** with auto-generated passwords
- **Running PostgreSQL** with initialized schema
- **Web application** listening on port 3000
- **API endpoints** ready for use
- **Docker containers** for easy management

---

## Useful Commands After Setup

### View Application Status
```bash
# Check if containers are running
docker-compose ps

# View real-time application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f db
```

### Manage Services
```bash
# Stop all services (keeps data)
docker-compose stop

# Start services again
docker-compose start

# Restart services
docker-compose restart

# View service status
docker-compose ps
```

### Database Management
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U flowerchi -d flowerchi

# Inside psql, useful commands:
\dt              # List all tables
SELECT * FROM users;  # View users
SELECT * FROM platforms;  # View platforms
\q              # Exit

# Backup database
docker-compose exec db pg_dump -U flowerchi flowerchi > backup.sql

# Restore database
docker-compose exec -T db psql -U flowerchi flowerchi < backup.sql
```

### View Application Files
```bash
# View .env (contains passwords)
cat .env

# View .env variables in use
docker-compose config

# Check application API
curl http://localhost:3000/api/health
```

### Complete Cleanup
```bash
# Stop and remove everything (⚠️ DELETES ALL DATA)
docker-compose down -v

# To set up again
./setup.sh  (or setup.bat on Windows)
```

---

## Configuration

Your setup is configured via `.env` file. Key settings:

```env
# Database
DATABASE_URL=postgresql://flowerchi:password@db:5432/flowerchi
POSTGRES_PASSWORD=auto-generated-password

# Security
AUTH_SECRET=auto-generated-secret

# Payment (optional)
ZARINPAL_MERCHANT_ID=your-merchant-id

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_PORT=30003
```

**Note:** Passwords are auto-generated during setup. Change them if needed.

---

## Accessing the Application

### Admin Dashboard
- **URL:** http://localhost:3000
- **Path:** Admin panel for managing services, orders, payments
- **Login:** Use credentials from `/setup` page

### API Documentation
- **URL:** http://localhost:3000/docs
- **Type:** Swagger/OpenAPI interactive documentation
- **Access:** Public

### OpenAPI Spec
- **URL:** http://localhost:3000/api/openapi.json
- **Type:** Machine-readable API specification

### Customer API
- **Base URL:** http://localhost:3000/api/v1
- **Authentication:** Bearer token from login
- **Endpoints:**
  - `POST /api/v1/auth/login` - Customer login
  - `GET /api/v1/catalog` - Service catalog
  - `GET /api/v1/me` - User profile
  - `GET /api/v1/orders` - Order history

---

## Troubleshooting

### ❌ "Docker is not installed"
**Solution:** Install Docker Desktop from https://www.docker.com/products/docker-desktop

### ❌ "Docker daemon is not running"
**Solution:** 
- Windows/Mac: Start Docker Desktop application
- Linux: `sudo systemctl start docker`

### ❌ "Port 3000 already in use"
**Solution:** 
```bash
# Find what's using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000

# Kill the process or change port in compose.yaml
```

### ❌ "PostgreSQL did not start"
**Solution:**
```bash
# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### ❌ "Application not responding"
**Solution:**
```bash
# Wait a bit longer (first startup takes 30+ seconds)
# View logs to see what's happening
docker-compose logs -f app

# Restart application
docker-compose restart app
```

### ❌ Script execution not allowed (Windows PowerShell)
**Solution:**
```powershell
# Run as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
```

### ❌ "ECONNREFUSED - Cannot connect to database"
**Solution:**
```bash
# Ensure all services are running
docker-compose ps

# Should show:
# db       postgres:16-alpine    Up
# app      Next.js app           Up

# If not, restart
docker-compose restart
```

---

## What Gets Created

After successful setup:

```
Flowerchi-Frontend/
├── .env                 # Generated environment config (keep safe!)
├── .next/               # Next.js build artifacts
├── compose.yaml         # Docker Compose configuration
├── database/
│   └── init.sql         # Database schema (auto-applied)
├── src/                 # Next.js application source
├── mobile/              # Flutter mobile app
└── docker/              # Docker configuration files

Docker Volumes:
├── postgres_data        # PostgreSQL data (persistent)
└── certbot_www          # Let's Encrypt files (HTTPS)

Database Tables:
├── users
├── platforms
├── categories
├── services
├── orders
├── payments
├── app_settings
└── audit_logs
```

---

## Next Steps

1. ✅ **Run setup script** (already done!)
2. ✅ **Create admin account** at `/setup`
3. ✅ **Log in** to dashboard
4. 📱 **Set up platforms** (Instagram, Telegram, TikTok)
5. 📦 **Add services** under platforms
6. 💳 **Configure payment gateway** (Zarinpal)
7. 🚀 **Deploy or continue development**

---

## Getting Help

### View Logs
```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f db

# All logs
docker-compose logs -f
```

### Check Status
```bash
# Container status
docker-compose ps

# Docker resource usage
docker stats
```

### Manual Verification
```bash
# Check if app is responding
curl http://localhost:3000

# Check if database is running
docker-compose exec db pg_isready

# Connect to database
docker-compose exec db psql -U flowerchi -d flowerchi
```

---

## Security Notes

- ✅ Passwords are **auto-generated** using strong cryptography
- ✅ Database runs in **isolated Docker network**
- ✅ Secrets stored in `.env` (in `.gitignore`)
- ✅ Session tokens are **HTTP-only cookies**
- ✅ Passwords are **scrypt-hashed**
- ⚠️ Save `.env` file in a safe place
- ⚠️ Don't commit `.env` to version control
- ⚠️ Use HTTPS in production

---

## Performance Tips

- First run takes 3-5 minutes (downloads Docker images)
- Subsequent runs take 1-2 minutes (uses cached images)
- Database initialization is one-time only
- Docker Compose keeps services running in background

---

## Production Deployment

For production, see [DEPLOYMENT.md](DEPLOYMENT.md) which covers:
- Nginx reverse proxy configuration
- HTTPS/Let's Encrypt setup
- Domain configuration
- Payment gateway setup
- Advanced security settings

---

## Questions?

Check these files for more information:
- `POSTGRESQL_SETUP.md` - Detailed database setup options
- `DEPLOYMENT.md` - Production deployment guide
- `mobile/SETUP.md` - Mobile app setup
- `.env.example` - All available configuration options

Enjoy using Flowerchi! 🚀
