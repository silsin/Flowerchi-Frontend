# Flowerchi - Automated Setup Summary

🚀 **One-command automatic setup for PostgreSQL + Application**

---

## ⚡ Get Started in 3 Steps

### Step 1: Choose Your OS and Run

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

**Windows (Command Prompt):**
```cmd
setup.bat
```

**macOS / Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

### Step 2: Wait for Completion
The script will:
- ✅ Generate secure passwords
- ✅ Create `.env` configuration
- ✅ Start PostgreSQL database
- ✅ Start web application
- ✅ Initialize database schema
- ✅ Verify everything works

**Time:** 3-5 minutes (first run) | 1-2 minutes (next runs)

### Step 3: Create Administrator
1. Open http://localhost:3000 in browser
2. Create your first admin account
3. Log in and start using the app!

---

## 🎯 What You Get

After setup completes:

| Component | Status | Access |
|-----------|--------|--------|
| **PostgreSQL Database** | ✅ Running | localhost:5432 |
| **Web Application** | ✅ Running | http://localhost:3000 |
| **Admin Dashboard** | ✅ Ready | http://localhost:3000 |
| **API Documentation** | ✅ Ready | http://localhost:3000/docs |
| **REST API** | ✅ Ready | http://localhost:3000/api/v1 |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START.md** | Simple quick start guide |
| **AUTOMATED_SETUP.md** | Comprehensive automation guide |
| **POSTGRESQL_SETUP.md** | Detailed database configuration |
| **DEPLOYMENT.md** | Production deployment |
| **Makefile** | Useful commands (Linux/Mac) |

---

## 💡 Common Commands

```bash
# After setup is complete:

# View status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose stop

# Start services
docker-compose start

# Connect to database
docker-compose exec db psql -U flowerchi -d flowerchi

# Backup database
docker-compose exec db pg_dump -U flowerchi flowerchi > backup.sql
```

Or use Makefile (Linux/Mac):
```bash
make health          # Quick health check
make logs            # View all logs
make stop            # Stop services
make db-connect      # Connect to database
```

---

## 🔍 Troubleshooting

**Port 3000 already in use?**
```bash
# Find and stop the other service
lsof -i :3000
```

**Docker not installed?**
Install from: https://www.docker.com/products/docker-desktop

**Docker daemon not running?**
- Windows/Mac: Open Docker Desktop
- Linux: `sudo systemctl start docker`

**Database connection error?**
```bash
docker-compose logs db
```

---

## 🔒 Generated Secrets

The script automatically generates and stores:

- **PostgreSQL Password** - Secure, random, 32 bytes
- **AUTH_SECRET** - For session encryption, 32 bytes
- **Location** - Stored in `.env` file (git-ignored)

Keep `.env` safe and don't share it!

---

## 📱 Mobile App Setup

After main setup, configure Flutter mobile app:

1. Open `mobile/` directory
2. See `mobile/SETUP.md` for instructions
3. Set API URL: `http://localhost:3000/api/v1`

---

## 🌐 Production Deployment

For production setup, see `DEPLOYMENT.md`:

- Nginx reverse proxy
- SSL/HTTPS with Let's Encrypt
- Domain configuration
- Advanced security

---

## ✅ Success Indicators

After setup, you should see:

```
✓ Setup Complete!

Database Configuration:
  Database: flowerchi
  User: flowerchi
  Port: 5432

Application URL:
  http://localhost:3000

Admin Setup:
  1. Visit http://localhost:3000/setup
  2. Create your first administrator account
  3. You'll be automatically logged in

✓ Ready to use!
```

---

## 📖 More Information

- Full guide: See `AUTOMATED_SETUP.md`
- Database options: See `POSTGRESQL_SETUP.md`
- Production: See `DEPLOYMENT.md`
- API docs: http://localhost:3000/docs (after setup)

---

**Enjoy using Flowerchi!** 🎉

For detailed help, check the documentation files or view logs:
```bash
docker-compose logs -f
```
