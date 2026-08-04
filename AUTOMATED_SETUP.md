# 🚀 Flowerchi - Automated Setup Guide

Complete automation for getting Flowerchi running with PostgreSQL and all services in one command.

---

## ⚡ Quick Start (Choose Your OS)

### Windows (PowerShell) - Recommended
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### Windows (Command Prompt)
```cmd
setup.bat
```

### macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

**That's it!** The script handles everything. ✨

---

## 🎯 What Gets Automated

The setup script completely automates all of this:

| Step | What Happens | Why |
|------|-------------|-----|
| 1. Create `.env` | Copies template & generates passwords | Security & configuration |
| 2. Generate secrets | Creates strong 32-char passwords | Database & auth security |
| 3. Validate Docker | Checks Docker & Compose are installed | Prerequisite check |
| 4. Stop old containers | Cleans up any previous services | Prevents conflicts |
| 5. Build images | Creates Docker images for app & DB | Fresh setup |
| 6. Start services | Launches PostgreSQL & Next.js app | Services running |
| 7. Wait for database | Ensures PostgreSQL is initialized | Database ready |
| 8. Verify schema | Confirms tables were created | Schema validated |
| 9. Wait for app | Ensures application started | App responding |
| 10. Display summary | Shows credentials & next steps | Ready to use |

**Total time:** 3-5 minutes (first run) | 1-2 minutes (subsequent)

---

## 📋 What The Script Creates

After running the setup, you get:

### ✅ Files Created
- `.env` - Configuration with auto-generated passwords (secure)
- `.next/` - Next.js build artifacts
- `docker-compose.override.yml` - Local overrides (if needed)

### ✅ Docker Infrastructure
- **PostgreSQL Container** - Database running and initialized
- **Application Container** - Next.js app with API
- **Network** - Isolated Docker network for containers
- **Volumes** - `postgres_data` for persistent storage

### ✅ Database & Schema
- **Database:** `flowerchi`
- **User:** `flowerchi` (auto-generated password)
- **Tables:** users, platforms, categories, services, orders, payments, app_settings, audit_logs
- **Indexes:** Performance optimized
- **Sample Data:** Instagram, Telegram, TikTok platforms

### ✅ Running Services
- **Web App:** http://localhost:3000
- **Database:** PostgreSQL on 5432
- **API:** Ready for requests
- **Admin Panel:** Ready for first setup

---

## 🔑 Generated Security

The script generates:

1. **PostgreSQL Password** - 32 bytes base64 encoded (random)
2. **AUTH_SECRET** - 32 bytes base64 encoded (random, minimum required)
3. **Session Token Encryption** - Uses HMAC-SHA256
4. **Password Hashing** - Uses Scrypt algorithm

**All values stored in `.env` (in `.gitignore`)**

---

## 📱 After Setup Is Complete

### Step 1: Create First Administrator (2 minutes)

```
1. Open http://localhost:3000 in browser
2. You're automatically redirected to /setup
3. Fill in administrator details:
   - Full Name: Your Name
   - Email: admin@example.com
   - Password: Choose a strong password
4. Click "Create Administrator"
5. ✓ You're logged in to admin dashboard
```

### Step 2: Configure Your Platform

```
1. Go to Admin Dashboard
2. Create Platforms (Instagram, Telegram, TikTok, etc.)
3. Add Categories for each platform
4. Add Services with pricing
5. Set your Zarinpal merchant ID (payments)
```

### Step 3: Start Using

```
- Admin: http://localhost:3000 (manage everything)
- API Docs: http://localhost:3000/docs (interactive)
- Mobile App: Connect to http://localhost:3000/api/v1
```

---

## 🛠️ Management Commands

After setup, use these commands:

### View Status
```bash
make health          # Quick health check
make info            # Detailed environment info
docker-compose ps    # Container status
```

### View Logs
```bash
make logs            # All logs
make logs-app        # Application only
make logs-db         # Database only
```

### Control Services
```bash
make stop            # Pause services
make start           # Resume services
make restart         # Restart all services
make clean           # Remove containers (keep data)
make clean-all       # ⚠️ Delete everything
```

### Database Commands
```bash
make db-connect      # Connect to PostgreSQL shell
make db-backup       # Create backup.sql
make db-restore      # Restore from backup.sql
make db-init         # Reset database
```

---

## 🔍 Verifying Everything Works

### Method 1: Visit Application
Open http://localhost:3000 in browser → Should redirect to `/setup`

### Method 2: Check Containers
```bash
docker-compose ps

# Should show:
# NAME        STATUS
# db          Up (healthy)
# app         Up
```

### Method 3: Test Database
```bash
make db-connect
# Inside psql:
SELECT * FROM platforms;
\dt
```

### Method 4: Test API
```bash
curl http://localhost:3000/docs
# Should show Swagger UI

curl http://localhost:3000/api/health
# Should return JSON response
```

---

## ⚠️ Common Issues & Solutions

### ❌ "Port 3000 already in use"
```bash
# Find what's using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Either:
# 1. Kill the other process
# 2. Change port in compose.yaml: ports: ["3001:3000"]
```

### ❌ "Docker daemon is not running"
- **Windows/Mac:** Open Docker Desktop application
- **Linux:** `sudo systemctl start docker`

### ❌ "Docker is not installed"
Visit https://www.docker.com/products/docker-desktop and install

### ❌ "PostgreSQL did not start"
```bash
make logs-db  # View database logs

# If schema didn't initialize:
docker-compose exec db psql -U flowerchi -d flowerchi -f /docker-entrypoint-initdb.d/01-init.sql
```

### ❌ "Cannot connect to database from application"
```bash
# Ensure database is ready
make db-connect

# Restart application
docker-compose restart app

# Check logs
make logs-app
```

### ❌ PowerShell execution policy error
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
.\setup.ps1
```

### ❌ ".env already exists, skipping"
Script won't overwrite existing `.env`. To regenerate:
```bash
rm .env  # or: del .env (Windows)
./setup.ps1  # or setup.sh / setup.bat
```

---

## 📁 Project Structure After Setup

```
Flowerchi-Frontend/
├── setup.sh                 # Linux/Mac setup script
├── setup.bat                # Windows batch script
├── setup.ps1                # Windows PowerShell script
├── Makefile                 # Make commands (Linux/Mac)
├── .env                     # Generated config (SECRET - don't share)
├── .env.example             # Template (safe to share)
├── compose.yaml             # Docker Compose definition
├── Dockerfile               # Application Docker image
│
├── src/                     # Next.js application
│   ├── app/                 # App Router
│   ├── lib/                 # Utilities
│   │   ├── db.ts           # Database connection pool
│   │   ├── auth.ts         # Authentication
│   │   └── http.ts         # HTTP utilities
│   └── middleware.ts        # Request middleware
│
├── database/
│   └── init.sql             # Schema (auto-applied to PostgreSQL)
│
├── docker/                  # Docker configuration
│   ├── nginx.conf.template
│   ├── nginx.Dockerfile
│   └── nginx-entrypoint.sh
│
├── mobile/                  # Flutter mobile app
│   ├── lib/
│   ├── android/
│   └── ios/
│
└── Documentation/
    ├── QUICK_START.md       # This file simplified
    ├── POSTGRESQL_SETUP.md  # Detailed database guide
    ├── DEPLOYMENT.md        # Production deployment
    └── AUTOMATED_SETUP.md   # This comprehensive guide
```

---

## 🐳 Docker Containers Explained

### Application Container (`app`)
- **Image:** Built from `Dockerfile`
- **Service:** Next.js application
- **Port:** 3000 (internal) → 30003 (host)
- **Depends on:** `db` service
- **Purpose:** Web app & REST API

### Database Container (`db`)
- **Image:** `postgres:16-alpine`
- **Service:** PostgreSQL 16
- **Port:** 5432 (internal)
- **Volume:** `postgres_data` (persistent)
- **Init:** `database/init.sql` (one-time)
- **Purpose:** Data storage & retrieval

### Network
- **Type:** Docker bridge network
- **Containers:** Connected automatically
- **Communication:** `app` talks to `db` via hostname `db`

### Volumes
- **`postgres_data`:** Database files (survives container restart)
- **`certbot_www`:** HTTPS certificates (optional)
- **`letsencrypt`:** Let's Encrypt config (optional)

---

## 🔐 Security Best Practices

✅ **What The Script Does:**
- Generates cryptographically secure passwords
- Uses base64 encoding for secrets
- Stores secrets in `.env` (added to `.gitignore`)
- Uses HTTPS in production configuration
- Implements password hashing (Scrypt)
- Uses HTTP-only cookies for sessions

⚠️ **What You Should Do:**
- Never commit `.env` to Git
- Keep `.env` file safe and backed up
- Use HTTPS in production (setup includes Let's Encrypt config)
- Change default passwords if shared
- Use strong admin password during setup
- Rotate secrets periodically in production

---

## 🚀 Production Deployment

For production, see [DEPLOYMENT.md](DEPLOYMENT.md):

```bash
# The setup script creates a production-ready Docker Compose file
# For production, additionally:

# 1. Set DOMAIN and LETSENCRYPT_EMAIL in .env
# 2. Run with docker-edge profile for Nginx + SSL:
docker-compose --profile docker-edge up -d --build

# 3. Script will automatically:
#    - Request SSL certificate from Let's Encrypt
#    - Set up Nginx reverse proxy
#    - Configure auto-renewal
```

---

## 📊 Performance Expectations

| Phase | Time | Details |
|-------|------|---------|
| Script start | 10s | Validation & checks |
| Docker build | 1-3m | Downloads & builds images |
| Service startup | 20s | Compose creates containers |
| Database init | 15s | Schema creation |
| App startup | 20s | Node.js initialization |
| **Total** | **3-5m** | First run only |
| **Restart** | **30-60s** | Uses cached images |

---

## 🆘 Getting Help

### View Detailed Logs
```bash
# Full application logs with timestamps
docker-compose logs --timestamps -f app

# Specific time window
docker-compose logs app --since 5m

# Search for errors
docker-compose logs app | grep -i error
```

### Check Configuration
```bash
# View what's actually being used
docker-compose config | less

# Check specific service
docker-compose config --services
```

### Test Connectivity
```bash
# From host to app
curl http://localhost:3000

# From app to database (inside container)
docker-compose exec app psql -h db -U flowerchi -d flowerchi -c "SELECT 1"

# Database readiness
docker-compose exec db pg_isready -U flowerchi -d flowerchi
```

---

## 📚 Related Documentation

- **[QUICK_START.md](QUICK_START.md)** - Simplified quick start
- **[POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)** - Detailed database options
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[.env.example](.env.example)** - All available configuration
- **[docker-compose.yaml](compose.yaml)** - Service definitions

---

## ✨ What's Next?

After successful setup:

1. ✅ **Setup is complete** - All services running
2. 🔑 **Create admin** - Visit `/setup` page
3. 🎨 **Configure platforms** - Add Instagram, Telegram, etc.
4. 💰 **Set up payment** - Configure Zarinpal merchant ID
5. 📱 **Connect mobile** - Configure Flutter app API URL
6. 🌐 **Deploy** - Use DEPLOYMENT.md for production

---

## 🎓 Learning Resources

### Understanding the Architecture
- Docker & Docker Compose basics
- Next.js application structure
- PostgreSQL relational database
- REST API design

### API Documentation
- Interactive Swagger at http://localhost:3000/docs
- OpenAPI spec at http://localhost:3000/api/openapi.json

### Source Code
- Application: `src/` directory
- Database: `database/init.sql`
- Docker configs: `docker/` directory
- Mobile: `mobile/` directory

---

Congratulations! 🎉 Your Flowerchi instance is now running automatically!

Need help? Check the logs or visit the documentation files listed above.
