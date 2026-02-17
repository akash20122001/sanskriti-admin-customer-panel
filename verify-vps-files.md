# Verify VPS Has Latest Code

## Check File Content on VPS

Run these commands on your VPS to verify if the files actually have the changes:

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Navigate to project
cd ~/sanskriti-admin-customer-panel

# Check the UserModal.tsx file for the new fields
cat frontend/src/components/UserModal.tsx | grep -n "email" | head -10

# This should show multiple lines with "email" in them
# If it shows nothing, the file doesn't have the changes
```

## Expected Output

You should see output like:
```
32:    email: z.string().email('Invalid email').optional().or(z.literal('')),
48:    email: z.string().email('Invalid email').optional().or(z.literal('')),
77:            email: '',
94:            email: '',
115:            email: user.email || '',
129:            email: '',
174:            email: editData.email || null,
199:            email: createData.email || undefined,
342:            name="email"
347:                <Input type="email" placeholder="company@example.com" {...field}
```

## If You See Email Fields

The code IS on VPS. The issue might be:
1. **Nginx is serving wrong directory** - Check nginx config
2. **Old build in dist folder** - Need to rebuild frontend

Run:
```bash
cd ~/sanskriti-admin-customer-panel/frontend

# Check when dist folder was last updated
ls -lht dist/ | head -10

# Check if the JavaScript bundle is recent (should be today's date)
stat dist/assets/*.js

# Force rebuild
rm -rf dist
npm run build

# Reload nginx
sudo systemctl reload nginx
```

## If You DON'T See Email Fields

The git pull didn't work correctly. Clone fresh:

```bash
# Backup current directory
cd ~
mv sanskriti-admin-customer-panel sanskriti-admin-customer-panel.backup

# Clone fresh from GitHub
git clone https://github.com/akash20122001/sanskriti-admin-customer-panel.git
cd sanskriti-admin-customer-panel

# Checkout qa branch
git checkout qa
git pull origin qa

# Verify the changes are there
cat frontend/src/components/UserModal.tsx | grep "email" | head -5

# Setup backend
cd backend
npm install
npx prisma generate
npm run build

# Setup frontend  
cd ../frontend
npm install
npm run build

# Restart services
pm2 restart sanskriti-backend
sudo systemctl reload nginx
```

## Quick Verification Command

Run this single command to check everything:

```bash
cd ~/sanskriti-admin-customer-panel && \
echo "=== Git Status ===" && \
git log --oneline -1 && \
echo -e "\n=== Checking UserModal.tsx for email field ===" && \
grep -c "email" frontend/src/components/UserModal.tsx && \
echo -e "\n=== Frontend dist folder modified time ===" && \
stat -c "%y" frontend/dist/index.html 2>/dev/null || echo "No dist folder!" && \
echo -e "\n=== Nginx root directory ===" && \
sudo nginx -T 2>/dev/null | grep "root.*sanskriti-admin-customer-panel"
```

This will show you:
1. Current git commit
2. Number of times "email" appears in UserModal.tsx (should be ~30+)
3. When the dist folder was last built
4. What directory Nginx is serving

Send me the output and I'll tell you exactly what the issue is!
