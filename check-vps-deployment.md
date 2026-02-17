# Troubleshooting VPS Deployment

## Issue
The user information changes are not visible on the VPS website, even after running the deployment commands.

## Let's Check What Happened

### Step 1: Verify the Changes Were Pulled

SSH into your VPS and check:

```bash
ssh sanskriti@YOUR_VPS_IP

cd ~/projects/sanskriti-admin-customer-panel

# Check which branch you're on
git branch

# Check the last commit
git log --oneline -5

# Check if the user files have the new changes
cat frontend/src/components/UserModal.tsx | head -50
```

**What to look for:**
- You should be on the `qa` branch
- The latest commit should be: `feat: Add user information fields to edit and listing`
- The UserModal.tsx file should contain the new fields

---

### Step 2: If Git Pulled Correctly, Check Frontend Build

```bash
cd ~/projects/sanskriti-admin-customer-panel/frontend

# Check when dist was last built
ls -la dist/

# The dist folder should have been updated recently (today's date/time)
```

---

### Step 3: Force Rebuild Everything

If the above checks show issues, let's do a complete rebuild:

```bash
cd ~/projects/sanskriti-admin-customer-panel

# Ensure we're on qa branch
git checkout qa

# Force pull from remote (discard any local changes)
git fetch origin
git reset --hard origin/qa

# Show the latest commits to confirm
git log --oneline -5

# Clean and rebuild frontend
cd frontend
rm -rf node_modules
rm -rf dist
npm install
npm run build

# Verify dist was created
ls -la dist/

# Clean and rebuild backend
cd ../backend
rm -rf node_modules
rm -rf dist
npm install
npx prisma generate
npm run build

# Restart backend
pm2 restart sanskriti-backend

# Reload nginx
sudo systemctl reload nginx

# Check status
pm2 logs sanskriti-backend --lines 30
```

---

### Step 4: Clear Browser Cache

After rebuilding, you MUST clear your browser cache:

1. Open your website
2. Press `Ctrl + Shift + R` (hard refresh)
3. Or go to DevTools (F12) → Network tab → Check "Disable cache"
4. Or clear all browser cache for your domain

---

## Quick Fix Commands (Copy-Paste)

```bash
ssh sanskriti@YOUR_VPS_IP

cd ~/projects/sanskriti-admin-customer-panel
git checkout qa
git fetch origin
git reset --hard origin/qa
git log --oneline -3

cd frontend
rm -rf dist
npm run build
ls -la dist/

cd ../backend
npm run build
pm2 restart sanskriti-backend

sudo systemctl reload nginx
pm2 logs sanskriti-backend --lines 20
```

Then hard refresh your browser: `Ctrl + Shift + R`

---

## Verify the Fix

1. After running the commands above
2. Clear your browser cache or hard refresh
3. Login and go to Users page
4. Click Edit on a user
5. You should now see additional fields like:
   - Email
   - Phone
   - Business Name
   - Address
   - City
   - State
   - PIN Code
   - GST Number

---

## If Still Not Working

### Check if you're actually pulling from qa branch:

```bash
cd ~/projects/sanskriti-admin-customer-panel
git remote -v
git branch -a
git log origin/qa --oneline -3
```

Compare the commit hash with GitHub to ensure they match.

### Check the actual file content:

```bash
cd ~/projects/sanskriti-admin-customer-panel
grep -n "email" frontend/src/components/UserModal.tsx
grep -n "phone" frontend/src/components/UserModal.tsx
```

If these don't show anything, the files weren't pulled correctly.

---

## Most Likely Causes

1. ❌ **Browser cache** - Most common! Browser is showing old cached version
2. ❌ **Frontend not rebuilt** - The dist folder has old files
3. ❌ **Wrong branch** - Still on main/master instead of qa
4. ❌ **Git didn't pull** - Local files are outdated

Try the Quick Fix Commands above and hard refresh your browser!
