# Deployment Guide: Hostinger VPS with MySQL

This guide will walk you through deploying the Sanskriti Admin & Customer Panel application to your Hostinger VPS with a MySQL database.

## Prerequisites

- Hostinger VPS access (SSH credentials)
- Domain name configured to point to your VPS IP
- Basic knowledge of terminal/command line

---

## Part 1: VPS Setup & Dependencies

### Step 1: Connect to Your VPS via SSH

```bash
ssh root@your-vps-ip-address
```

Enter your password when prompted.

### Step 2: Update System Packages

```bash
apt update && apt upgrade -y
```

### Step 3: Install Node.js (v20 LTS)

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 4: Install MySQL Server

```bash
# Install MySQL
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation
```

Follow the prompts:
- Set root password (remember this!)
- Remove anonymous users: **Yes**
- Disallow root login remotely: **Yes**
- Remove test database: **Yes**
- Reload privilege tables: **Yes**

### Step 5: Install Nginx (Web Server)

```bash
apt install -y nginx
```

### Step 6: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### Step 7: Install Git

```bash
apt install -y git
```

---

## Part 2: Database Configuration

### Step 1: Login to MySQL

```bash
mysql -u root -p
```

Enter the root password you set earlier.

### Step 2: Create Database and User

```sql
-- Create database
CREATE DATABASE sanskriti_db;

-- Create user for the application
CREATE USER 'sanskriti_user'@'localhost' IDENTIFIED BY 'your-strong-password-here';

-- Grant privileges
GRANT ALL PRIVILEGES ON sanskriti_db.* TO 'sanskriti_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

> [!IMPORTANT]
> Replace `your-strong-password-here` with a strong password. Save this password!

---

## Part 3: Backend Deployment

### Step 1: Create Application Directory

```bash
mkdir -p /var/www/sanskriti
cd /var/www/sanskriti
```

### Step 2: Clone or Upload Your Code

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/your-username/your-repo.git .
```

**Option B: Upload via SFTP**
- Use FileZilla or WinSCP to upload your project files to `/var/www/sanskriti`

### Step 3: Configure Backend Environment

```bash
cd /var/www/sanskriti/backend
cp .env.example .env
nano .env
```

Update the `.env` file with your production values:

```env
# Database
DATABASE_URL="mysql://sanskriti_user:your-strong-password-here@localhost:3306/sanskriti_db"

# JWT Secrets (Generate strong random strings!)
JWT_SECRET="generate-a-very-long-random-string-here"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="another-very-long-random-string-here"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Server
PORT=5000
NODE_ENV="production"

# CORS
FRONTEND_URL="https://yourdomain.com"
```

> [!CAUTION]
> **Security**: Generate strong random secrets using:
> ```bash
> openssl rand -base64 32
> ```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 4: Install Backend Dependencies

```bash
npm install
```

### Step 5: Setup Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Create an admin user via Prisma Studio or SQL
npx prisma studio
# Access at http://your-vps-ip:5555
```

**OR manually create admin user via MySQL:**
```bash
mysql -u sanskriti_user -p sanskriti_db
```

```sql
-- Hash the password first using bcrypt (you'll need to do this in Node.js)
-- For now, we'll create a script
```

Create a seed script: `/var/www/sanskriti/backend/seed-admin.js`
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      userId: 'admin',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      walletBalance: 0,
      isActive: true
    }
  });
  
  console.log('Admin created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:
```bash
node seed-admin.js
```

### Step 6: Build & Start Backend with PM2

```bash
# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/app.js --name sanskriti-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### Step 7: Verify Backend is Running

```bash
pm2 status
pm2 logs sanskriti-backend
```

Test the API:
```bash
curl http://localhost:5000/api/health
```

---

## Part 4: Frontend Deployment

### Step 1: Update Frontend Environment

```bash
cd /var/www/sanskriti/frontend
nano .env
```

Update for production:
```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Sanskriti
VITE_APP_VERSION=1.0.0
```

### Step 2: Install Dependencies & Build

```bash
npm install
npm run build
```

This creates a `dist` folder with your production-ready frontend.

---

## Part 5: Nginx Configuration

### Step 1: Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/sanskriti
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    root /var/www/sanskriti/frontend/dist;
    index index.html;

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

> [!IMPORTANT]
> Replace `yourdomain.com` with your actual domain name!

### Step 2: Enable the Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/sanskriti /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 3: Configure Firewall

```bash
# Allow HTTP and HTTPS
ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
ufw allow OpenSSH

# Enable firewall
ufw enable
```

---

## Part 6: SSL Certificate (HTTPS)

### Step 1: Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### Step 2: Obtain SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter email address
- Agree to terms
- Choose to redirect HTTP to HTTPS: **Yes**

Certbot will automatically configure Nginx for HTTPS!

### Step 3: Test Auto-Renewal

```bash
certbot renew --dry-run
```

---

## Part 7: Verification

### Step 1: Check All Services

```bash
# Check Nginx
systemctl status nginx

# Check MySQL
systemctl status mysql

# Check Backend
pm2 status
```

### Step 2: Test Your Application

1. Open your browser and visit: `https://yourdomain.com`
2. Try logging in with the admin credentials
3. Check browser console for any errors
4. Test customer login as well

---

## Maintenance Commands

### View Backend Logs
```bash
pm2 logs sanskriti-backend
```

### Restart Backend
```bash
pm2 restart sanskriti-backend
```

### Update Code (Git)
```bash
cd /var/www/sanskriti
git pull
cd backend
npm install
npm run build
pm2 restart sanskriti-backend
cd ../frontend
npm install
npm run build
```

### Database Backup
```bash
mysqldump -u sanskriti_user -p sanskriti_db > backup-$(date +%Y%m%d).sql
```

### Monitor Server Resources
```bash
htop  # Install with: apt install htop
```

---

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs sanskriti-backend

# Check if port 5000 is in use
lsof -i :5000

# Restart PM2
pm2 restart all
```

### Database Connection Error
```bash
# Check MySQL is running
systemctl status mysql

# Test database connection
mysql -u sanskriti_user -p sanskriti_db
```

### Nginx 502 Bad Gateway
```bash
# Check backend is running
pm2 status

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### SSL Issues
```bash
# Renew certificate manually
certbot renew

# Check certificate status
certbot certificates
```

---

## Security Best Practices

1. **Regular Updates**: `apt update && apt upgrade -y`
2. **Strong Passwords**: Use complex passwords for MySQL and JWT secrets
3. **Firewall**: Only allow necessary ports (80, 443, 22)
4. **SSH Keys**: Use SSH key authentication instead of passwords
5. **Backup**: Regular database and file backups
6. **Monitoring**: Set up monitoring for server health

---

## Next Steps

- Set up automated backups
- Configure monitoring (e.g., UptimeRobot)
- Set up staging environment
- Configure email notifications
- Add rate limiting to API

---

Need help? Check the logs first, then reach out with specific error messages!
