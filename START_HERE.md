# 🚀 START HERE - Flowerchi Automated Setup

Welcome! Your Flowerchi application can be set up automatically in just one command.

---

## ⚡ Choose Your Operating System

### 💻 **Windows Users**

#### Option A: PowerShell (Recommended - Easiest)
Copy and paste this command into PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

#### Option B: Command Prompt
Just run:
```cmd
setup.bat
```

#### Troubleshooting PowerShell?
If you get an execution policy error, first run as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
.\setup.ps1
```

---

### 🍎 **macOS Users**

Copy and paste this command into Terminal:
```bash
chmod +x setup.sh && ./setup.sh
```

Or run separately:
```bash
chmod +x setup.sh
./setup.sh
```

---

### 🐧 **Linux Users**

Copy and paste this command into Terminal:
```bash
chmod +x setup.sh && ./setup.sh
```

Or run separately:
```bash
chmod +x setup.sh
./setup.sh
```

---

## ⏳ What Happens Next

The script will automatically:

1. ✅ Check if Docker is installed
2. ✅ Create a `.env` file with auto-generated passwords
3. ✅ Start PostgreSQL database
4. ✅ Start the web application
5. ✅ Initialize the database schema
6. ✅ Verify everything works
7. ✅ Show you a success message

**Time:** 3-5 minutes (first run) | 1-2 minutes (after)

---

## 🎯 After Setup Completes

### Step 1: Create Your First Administrator
```
1. Open http://localhost:3000 in your browser
2. Fill in your details (Name, Email, Password)
3. Click "Create Administrator"
4. You're now logged in! ✅
```

### Step 2: Start Using Flowerchi
```
Admin Dashboard: http://localhost:3000
API Documentation: http://localhost:3000/docs
Database: Connected automatically
```

---

## 📚 Need More Help?

### Quick Questions?
- **What does the setup do?** → See `AUTOMATION_SUMMARY.txt`
- **Step-by-step guide?** → See `QUICK_START.md`
- **Visual flowcharts?** → See `SETUP_OVERVIEW.md`

### Detailed Information
- **Complete guide** → See `AUTOMATED_SETUP.md`
- **Database options** → See `POSTGRESQL_SETUP.md`
- **Production setup** → See `DEPLOYMENT.md`

### Useful Commands After Setup
```bash
# View running services
docker-compose ps

# Watch application logs
docker-compose logs -f app

# Connect to database
docker-compose exec db psql -U flowerchi -d flowerchi

# Stop services
docker-compose stop

# Start services again
docker-compose start
```

---

## 🆘 Troubleshooting

### ❌ "Docker is not installed"
**Install Docker:**
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: Use your package manager or follow Docker docs

### ❌ "Port 3000 already in use"
```bash
# Find what's using it
lsof -i :3000        # Mac/Linux
netstat -ano | findstr :3000  # Windows
# Kill the process or wait for setup to complete
```

### ❌ "Docker daemon is not running"
- **Windows/Mac:** Open Docker Desktop application
- **Linux:** Run `sudo systemctl start docker`

### ❌ "PowerShell execution error"
Run this first (as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
```

### ❌ Application not responding
- Wait 2-3 minutes (first startup is slow)
- Check logs: `docker-compose logs -f app`
- View database logs: `docker-compose logs -f db`

---

## 🔒 Important Security Notes

✅ The setup script automatically generates:
- Strong database password (32 bytes, random)
- Strong encryption key (32 bytes, random)
- Secure session cookies

⚠️ Keep in mind:
- `.env` file contains secrets - don't share it
- `.env` is in `.gitignore` - won't be committed to Git
- Change passwords if you share the setup
- Use HTTPS in production

---

## 📱 What You Get

After setup completes, you have:

| Component | What You Can Do |
|-----------|-----------------|
| **Admin Dashboard** | Manage services, orders, payments |
| **PostgreSQL Database** | Persistent data storage |
| **REST API** | Mobile app integration |
| **API Documentation** | Interactive Swagger UI |
| **User Authentication** | Secure login system |
| **Payment Processing** | Zarinpal integration ready |

---

## ✨ Ready to Begin?

1. **Copy the appropriate command** for your OS above
2. **Open terminal/PowerShell/command prompt**
3. **Navigate to this folder** (if not already there)
4. **Paste the command** and press Enter
5. **Wait 3-5 minutes** for setup to complete
6. **Open http://localhost:3000** when done
7. **Create your admin account** and you're ready!

---

## 🎓 Quick Reference

**First Time Setup:**
```bash
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File setup.ps1

# macOS/Linux
chmod +x setup.sh && ./setup.sh
```

**Common Commands After Setup:**
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Restart everything
docker-compose restart

# Connect to database
docker-compose exec db psql -U flowerchi -d flowerchi
```

---

## 📖 Documentation Overview

| File | Purpose | Read Time |
|------|---------|-----------|
| `START_HERE.md` | This file - getting started | 5 min |
| `AUTOMATION_SUMMARY.txt` | Quick overview of everything | 5 min |
| `QUICK_START.md` | Step-by-step guide | 10 min |
| `README_AUTOMATED.md` | Setup results and options | 5 min |
| `SETUP_OVERVIEW.md` | Visual diagrams and flowcharts | 15 min |
| `AUTOMATED_SETUP.md` | Complete comprehensive guide | 30 min |
| `POSTGRESQL_SETUP.md` | Database configuration options | 30 min |
| `DEPLOYMENT.md` | Production deployment guide | 20 min |

---

## 🎉 That's It!

Everything is automated for you. Just run the appropriate command for your OS and the setup script will handle everything else.

**Choose your OS and run the command now!** ⬆️

---

### Questions While Setup Runs?

- **What's happening?** Check the output messages
- **Want to see logs?** They're displayed in real-time
- **How long does it take?** 3-5 minutes first time
- **Can I stop it?** Yes, Ctrl+C (containers will stop)

### After Setup Is Complete

- Application URL: **http://localhost:3000**
- API Docs: **http://localhost:3000/docs**
- Database: **localhost:5432**

---

**Enjoy using Flowerchi!** 🚀
