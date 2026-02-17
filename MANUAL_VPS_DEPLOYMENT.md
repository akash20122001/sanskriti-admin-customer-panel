# Manual VPS Deployment - Step by Step Guide

## What We're Deploying
User information fields for editing and listing have been pushed to the **QA branch**.

**Files changed:**
- `backend/src/controllers/user.controller.ts`
- `frontend/src/components/UserModal.tsx`
- `frontend/src/pages/admin/Users.tsx`
- `frontend/src/services/user.service.ts`

---

## Step-by-Step Deployment Instructions

### Step 1: Connect to Your VPS via SSH

Open PowerShell or Command Prompt and connect to your VPS:

```bash
ssh sanskriti@YOUR_VPS_IP_ADDRESS
```

Replace `YOUR_VPS_IP_ADDRESS` with your actual VPS IP.

Enter your password when prompted.

---

### Step 2: Navigate to Your Project Directory

```bash
cd ~/projects/sanskriti-admin-customer-panel
```

---

### Step 3: Check Current Branch and Pull Latest Changes

```bash
# Check which branch you're on
git branch

# Fetch all branches from remote
git fetch origin

# Switch to qa branch
git checkout qa

# Pull the latest changes
git pull origin qa
```

You should see the changes being pulled, including the 4 user-related files.

---

### Step 4: Update and Rebuild Backend

```bash
# Navigate to backend directory
cd backend

# Install any new dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (if any)
npx prisma migrate deploy

# Build the backend
npm run build
```

Wait for the build to complete. This may take 1-2 minutes.

---

### Step 5: Restart Backend Service with PM2

```bash
# Restart the backend service
pm2 restart sanskriti-backend

# Check the status
pm2 status

# View logs to ensure it started correctly
pm2 logs sanskriti-backend --lines 30
```

**Important:** Check the logs for any errors. The backend should show "Server running on port 5000" or similar.

Press `Ctrl+C` to stop viewing logs.

---

### Step 6: Update and Rebuild Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install any new dependencies
npm install

# Build the frontend
npm run build
```

Wait for the build to complete. This may take 2-3 minutes.

---

### Step 7: Reload Nginx to Serve New Frontend

```bash
# Reload Nginx configuration
sudo systemctl reload nginx

# Check Nginx status (optional)
sudo systemctl status nginx
```

Press `q` to exit the status view.

---

### Step 8: Verify Deployment

```bash
# Check PM2 status one more time
pm2 status

# View recent backend logs
pm2 logs sanskriti-backend --lines 20
```

Press `Ctrl+C` to exit log view.

---

### Step 9: Test on Your Website

1. Open your browser and go to your website: `https://yourdomain.com`
2. Login as admin
3. Navigate to **Users** page (Admin → Users)
4. **Check the listing:** Verify all user information fields are displayed
5. **Click "Edit"** on any user
6. **Verify:** All user information fields should be editable
7. **Make a test change** and save to ensure backend is working

---

## Quick Command Summary (Copy-Paste Friendly)

If you want to run all commands at once, copy and paste this:

```bash
# Connect to VPS first: ssh sanskriti@YOUR_VPS_IP

cd ~/projects/sanskriti-admin-customer-panel
git fetch origin
git checkout qa
git pull origin qa

cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart sanskriti-backend

cd ../frontend
npm install
npm run build
sudo systemctl reload nginx

pm2 status
pm2 logs sanskriti-backend --lines 20
```

---

## Troubleshooting

### If Backend Fails to Start:

```bash
# Check detailed error logs
pm2 logs sanskriti-backend --err

# Delete and recreate the PM2 process
pm2 delete sanskriti-backend
cd ~/projects/sanskriti-admin-customer-panel/backend
pm2 start npm --name "sanskriti-backend" -- run start:migrate
pm2 save
```

### If Frontend Doesn't Update:

```bash
# Hard refresh your browser (Ctrl+Shift+R)
# Or clear browser cache

# Verify the build was created
ls -la ~/projects/sanskriti-admin-customer-panel/frontend/dist

# If needed, rebuild
cd ~/projects/sanskriti-admin-customer-panel/frontend
rm -rf dist
npm run build
sudo systemctl reload nginx
```

### If You See Database Errors:

```bash
cd ~/projects/sanskriti-admin-customer-panel/backend
npx prisma db push
pm2 restart sanskriti-backend
```

### Check if Services are Running:

```bash
# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql
```

---

## Important Notes

- **Branch:** We're deploying from the `qa` branch (which has all the latest changes)
- **Backup:** Before any deployment, it's good practice to backup your database
- **Logs:** Always check PM2 logs after restarting to catch any errors early
- **Cache:** You might need to clear your browser cache to see frontend changes

---

## Exit VPS

When you're done:

```bash
exit
```

This will disconnect you from the VPS.

---

**Deployment Date:** 2026-02-15
**Changes:** User information fields in edit and listing
