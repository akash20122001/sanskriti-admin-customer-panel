# Hostinger VPS Deployment Guide

Complete step-by-step guide to deploy Sanskriti Admin & Customer Panel on Hostinger VPS with your custom domain.

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Hostinger VPS plan purchased
- [ ] Domain name registered
- [ ] SSH access credentials to your VPS
- [ ] Local project code ready to deploy

---

## 🚀 Phase 1: Initial VPS Setup

### Step 1: Access Your VPS

1. **Get VPS credentials from Hostinger:**
   - Login to Hostinger panel
   - Go to VPS section
   - Note down: IP address, SSH username, SSH password/key

2. **Connect to VPS via SSH:**
   ```bash
   # From Windows PowerShell or using PuTTY
   ssh root@your-vps-ip-address
   # Enter password when prompted
   ```

### Step 2: Update System Packages

```bash
# Update package list
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

### Step 3: Create a Non-Root User (Security Best Practice)

```bash
# Create new user
adduser sanskriti

# Add to sudo group
usermod -aG sudo sanskriti

# Switch to new user
su - sanskriti
```

---

## 🔐 Phase 2: Security Setup

### Step 4: Configure Firewall

```bash
# Install UFW if not present
sudo apt install -y ufw

# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 5: Secure SSH (Optional but Recommended)

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change these settings:
# PermitRootLogin no
# PasswordAuthentication yes (or no if using SSH keys)

# Restart SSH
sudo systemctl restart sshd
```

---

## 📦 Phase 3: Install Required Software

### Step 6: Install Node.js 20 LTS

```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### Step 7: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### Step 8: Configure PostgreSQL Database

```bash
# Switch to postgres user
sudo -i -u postgres

# Create database
createdb sanskriti_db

# Create database user
psql -c "CREATE USER sanskriti_user WITH PASSWORD 'your_secure_password_here';"

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE sanskriti_db TO sanskriti_user;"

# Exit postgres user
exit
```

> [!IMPORTANT]
> Replace `your_secure_password_here` with a strong, unique password. Save it for later use in environment variables.

### Step 9: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 10: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

---

## 🌐 Phase 4: Domain Configuration

### Step 11: Point Domain to VPS

1. **Login to your domain registrar (or Hostinger DNS management)**
2. **Add/Update DNS records:**
   - **A Record**: `@` → Your VPS IP address
   - **A Record**: `www` → Your VPS IP address
   - **A Record**: `api` → Your VPS IP address (for backend subdomain)

3. **Wait for DNS propagation (can take 5 minutes to 48 hours)**
   - Check with: `nslookup yourdomain.com`

### Step 12: Verify Domain Resolution

```bash
# Test domain resolution
ping yourdomain.com
ping www.yourdomain.com
ping api.yourdomain.com
```

---

## 📂 Phase 5: Deploy Application Code

### Step 13: Clone Repository to VPS

```bash
# Navigate to home directory
cd ~

# Create projects directory
mkdir -p projects
cd projects

# Clone your repository (if using GitHub)
git clone https://github.com/yourusername/sanskriti-admin-customer-panel.git

# Or upload code via SCP/SFTP from local machine
# From your local machine:
# scp -r "d:\Sanskriti PRoject" sanskriti@your-vps-ip:~/projects/sanskriti-admin-customer-panel
```

### Step 14: Setup Backend

```bash
# Navigate to backend directory
cd ~/projects/sanskriti-admin-customer-panel/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Add the following to `.env`:**
```env
# Database
DATABASE_URL="postgresql://sanskriti_user:your_secure_password_here@localhost:5432/sanskriti_db"

# JWT Secret (generate a random string)
JWT_SECRET="your_jwt_secret_here_use_long_random_string"

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS (your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Any other environment variables your app needs
```

> [!TIP]
> Generate a strong JWT secret using: `openssl rand -base64 32`

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the backend
npm run build

# Test the backend
npm run start
# Press Ctrl+C to stop after verifying it works
```

### Step 15: Setup Frontend

```bash
# Navigate to frontend directory
cd ~/projects/sanskriti-admin-customer-panel/frontend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Add the following to `.env`:**
```env
# API URL
VITE_API_URL=https://api.yourdomain.com
```

```bash
# Build the frontend
npm run build

# This creates a 'dist' folder with production files
```

---

## 🔧 Phase 6: Configure PM2 for Backend

### Step 16: Start Backend with PM2

```bash
# Navigate to backend directory
cd ~/projects/sanskriti-admin-customer-panel/backend

# Start backend with PM2
pm2 start npm --name "sanskriti-backend" -- run start:migrate

# Or if you prefer using the built file directly:
pm2 start dist/app.js --name "sanskriti-backend"

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs (copy and run it)

# Check status
pm2 status
pm2 logs sanskriti-backend
```

---

## 🌐 Phase 7: Configure Nginx

### Step 17: Create Nginx Configuration for Frontend

```bash
# Create nginx config file
sudo nano /etc/nginx/sites-available/sanskriti-frontend
```

**Add the following configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /home/sanskriti/projects/sanskriti-admin-customer-panel/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> [!IMPORTANT]
> Replace `yourdomain.com` with your actual domain name.

### Step 18: Create Nginx Configuration for Backend API

```bash
# Create nginx config for backend
sudo nano /etc/nginx/sites-available/sanskriti-backend
```

**Add the following configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 19: Enable Nginx Sites

```bash
# Create symbolic links to enable sites
sudo ln -s /etc/nginx/sites-available/sanskriti-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/sanskriti-backend /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 🔒 Phase 8: SSL Certificate Setup (HTTPS)

### Step 20: Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### Step 21: Obtain SSL Certificates

```bash
# Get SSL certificate for frontend domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Get SSL certificate for backend API domain
sudo certbot --nginx -d api.yourdomain.com
```

**Follow the prompts:**
- Enter email address
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

> [!TIP]
> Certbot will automatically configure Nginx to use HTTPS and set up auto-renewal.

### Step 22: Verify SSL Auto-Renewal

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

---

## ✅ Phase 9: Verification & Testing

### Step 23: Test Your Deployment

1. **Test Frontend:**
   - Open browser: `https://yourdomain.com`
   - Should load your frontend application

2. **Test Backend API:**
   - Test API endpoint: `https://api.yourdomain.com/health` (or any test endpoint)
   - Should return API response

3. **Test End-to-End:**
   - Try logging in
   - Test creating/viewing orders
   - Verify all features work

### Step 24: Monitor Application

```bash
# Check PM2 status
pm2 status

# View backend logs
pm2 logs sanskriti-backend

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check system resources
pm2 monit
```

---

## 🔄 Phase 10: Deployment Workflow (Future Updates)

### Step 25: Update Application

**For Backend Updates:**
```bash
# SSH into VPS
ssh sanskriti@your-vps-ip

# Navigate to project
cd ~/projects/sanskriti-admin-customer-panel

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
npx prisma migrate deploy
npm run build

# Restart PM2 process
pm2 restart sanskriti-backend

# Check logs
pm2 logs sanskriti-backend
```

**For Frontend Updates:**
```bash
# Navigate to frontend
cd ~/projects/sanskriti-admin-customer-panel/frontend

# Pull latest code (if not already done)
git pull origin main

# Install dependencies and rebuild
npm install
npm run build

# Nginx will automatically serve the new dist folder
# No restart needed, but you can clear nginx cache if needed
sudo systemctl reload nginx
```

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Issue 1: Backend not starting
```bash
# Check logs
pm2 logs sanskriti-backend

# Check if port is already in use
sudo lsof -i :5000

# Verify database connection
cd ~/projects/sanskriti-admin-customer-panel/backend
npx prisma db pull
```

#### Issue 2: Nginx 502 Bad Gateway
```bash
# Check if backend is running
pm2 status

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify backend is listening on correct port
sudo netstat -tlnp | grep :5000
```

#### Issue 3: SSL Certificate Issues
```bash
# Renew certificates manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

#### Issue 4: Database connection errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify database exists
sudo -u postgres psql -l

# Check DATABASE_URL in .env matches actual credentials
```

#### Issue 5: Frontend not loading
```bash
# Check nginx config
sudo nginx -t

# Verify dist folder exists
ls -la ~/projects/sanskriti-admin-customer-panel/frontend/dist

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Performance Optimization Tips

### 1. Enable Nginx Caching
```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 2. Configure PM2 Cluster Mode
```bash
# Stop current process
pm2 stop sanskriti-backend

# Start in cluster mode with 2 instances
pm2 start dist/app.js --name "sanskriti-backend" -i 2

# Save configuration
pm2 save
```

### 3. Setup Log Rotation
```bash
# PM2 log rotation
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🔐 Security Checklist

- [x] UFW firewall enabled
- [x] Non-root user created
- [x] SSH properly secured
- [x] SSL certificates installed
- [x] Database credentials secured in .env
- [x] JWT secret is strong and random
- [ ] Regular system updates scheduled
- [ ] Backup strategy implemented
- [ ] Monitoring and alerts configured

---

## 📝 Quick Reference Commands

### PM2 Commands
```bash
pm2 start <app>          # Start application
pm2 stop <app>           # Stop application
pm2 restart <app>        # Restart application
pm2 logs <app>           # View logs
pm2 monit                # Monitor resources
pm2 list                 # List all processes
pm2 delete <app>         # Remove from PM2
```

### Nginx Commands
```bash
sudo nginx -t                    # Test configuration
sudo systemctl start nginx       # Start nginx
sudo systemctl stop nginx        # Stop nginx
sudo systemctl reload nginx      # Reload configuration
sudo systemctl restart nginx     # Restart nginx
```

### Database Commands
```bash
sudo -u postgres psql                          # Access PostgreSQL
npx prisma studio                              # Open Prisma Studio
npx prisma migrate deploy                      # Run migrations
npx prisma db push                             # Push schema changes
```

---

## 🎉 Deployment Complete!

Your Sanskriti Admin & Customer Panel should now be live at:
- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://api.yourdomain.com`

> [!NOTE]
> Remember to:
> - Keep your VPS updated regularly
> - Monitor application logs
> - Set up automated backups for your database
> - Monitor SSL certificate expiration (auto-renews via Certbot)

---

**Need Help?** Check the troubleshooting section or review application logs using the commands provided above.
