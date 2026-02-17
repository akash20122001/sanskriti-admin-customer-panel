# Force VPS Deployment - Quick Fix

## The Issue
The changes ARE in the QA branch (verified locally), but they're not showing on your VPS website.

## Most Likely Cause
The VPS either:
1. Didn't pull the changes correctly
2. Didn't rebuild the frontend
3. Browser cache is showing old version

## Quick Fix - Run These Commands

### Step 1: SSH to VPS
```bash
ssh sanskriti@YOUR_VPS_IP
```

### Step 2: Force Reset and Pull from QA Branch
```bash
cd ~/projects/sanskriti-admin-customer-panel

# Show current branch and status
echo "=== Current Status ==="
git branch
git log --oneline -3

# Force reset to remote QA branch (discard any local changes)
echo "=== Pulling from remote QA ==="
git fetch origin
git reset --hard origin/qa

# Verify the changes are now there
echo "=== Verifying changes ==="
git log --oneline -3
grep -n "email" frontend/src/components/UserModal.tsx | head -5
```

You should see "email" appear multiple times in the output.

### Step 3: Force Rebuild Frontend (Clean Build)
```bash
cd ~/projects/sanskriti-admin-customer-panel/frontend

# Remove old build
echo "=== Cleaning old build ==="
rm -rf dist

# Rebuild
echo "=== Building frontend ==="
npm run build

# Verify build was created
echo "=== Verifying build ==="
ls -la dist/
```

### Step 4: Rebuild Backend
```bash
cd ~/projects/sanskriti-admin-customer-panel/backend

echo "=== Building backend ==="
npm run build

# Restart PM2
echo "=== Restarting backend ==="
pm2 restart sanskriti-backend
```

### Step 5: Reload Nginx
```bash
echo "=== Reloading Nginx ==="
sudo systemctl reload nginx

# Check PM2 status
echo "=== PM2 Status ==="
pm2 status
pm2 logs sanskriti-backend --lines 15
```

Press `Ctrl+C` to exit logs.

### Step 6: Clear Browser Cache
1. Open your website in browser
2. Open DevTools: Press `F12`
3. Right-click on the refresh button → "Empty Cache and Hard Reload"
4. OR press `Ctrl + Shift + R` for hard refresh
5. OR go to Settings → Clear browsing data → Cached images and files

---

## Single Command Version (Copy-Paste All at Once)

After SSH'ing to your VPS, you can run all commands at once:

```bash
cd ~/projects/sanskriti-admin-customer-panel && \
git fetch origin && \
git reset --hard origin/qa && \
git log --oneline -3 && \
cd frontend && \
rm -rf dist && \
npm run build && \
cd ../backend && \
npm run build && \
pm2 restart sanskriti-backend && \
sudo systemctl reload nginx && \
pm2 status
```

---

## Verify the Fix

1. **Hard refresh your browser** (Ctrl+Shift+R)
2. Login to your website
3. Go to Users page
4. Click "Edit" on any user
5. You should now see:
   - User ID *
   - Full Name *
   - Password
   - **Company Details (Optional)** section with:
     - Company Name
     - Email
     - Phone
     - GST Number
     - Company Address
     - State
     - PIN Code
   - Active Account checkbox

---

## If It STILL Doesn't Work

### Check if the file actually has the changes on VPS:
```bash
cd ~/projects/sanskriti-admin-customer-panel
cat frontend/src/components/UserModal.tsx | grep -A 5 "email"
```

You should see multiple occurrences of "email" field.

### Check the built files:
```bash
cd ~/projects/sanskriti-admin-customer-panel/frontend
ls -lh dist/assets/*.js | head -5
stat dist/index.html
```

The files should have today's timestamp.

### Check Nginx is serving the right directory:
```bash
sudo nginx -T | grep "root"
```

Should show: `/home/sanskriti/projects/sanskriti-admin-customer-panel/frontend/dist`

---

## Expected Result

After these steps AND hard refreshing your browser, the Edit User modal should show all the company details fields including email, phone, GST, address, etc.

If it STILL doesn't work after:
1. ✅ Force pulling from origin/qa
2. ✅ Clean rebuild of frontend
3. ✅ Restarting PM2 backend
4. ✅ Reloading Nginx
5. ✅ Hard refreshing browser (Ctrl+Shift+R)

Then there might be a deeper issue. Let me know what error you see!
