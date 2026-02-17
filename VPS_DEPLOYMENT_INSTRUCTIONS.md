# Manual VPS Deployment Steps for User Information Updates

## Summary
The user information fields (edit and listing) changes have been:
- ✅ Committed and pushed to the **QA branch** (Branch: qa)
- ⏳ Need to be deployed to the **VPS (Hostinger)**

## Files Changed
1. `backend/src/controllers/user.controller.ts`
2. `frontend/src/components/UserModal.tsx`
3. `frontend/src/pages/admin/Users.tsx`
4. `frontend/src/services/user.service.ts`

## Deployment Options

### Option 1: Using the Automated Script
Run the PowerShell script we created:
```powershell
cd "d:\Sanskriti PRoject"
powershell -ExecutionPolicy Bypass -File deploy-to-vps.ps1
```

### Option 2: Manual SSH Deployment
1. SSH into your VPS:
```bash
ssh sanskriti@YOUR_VPS_IP
```

2. Navigate to the project directory:
```bash
cd ~/projects/sanskriti-admin-customer-panel
```

3. Pull latest changes from QA branch:
```bash
git fetch origin
git checkout qa
git pull origin qa
```

4. Update and restart Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart sanskriti-backend
```

5. Update Frontend:
```bash
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

6. Verify deployment:
```bash
pm2 status
pm2 logs sanskriti-backend --lines 20
```

## Verification
After deployment, verify the changes by:
1. Visit your website: `https://yourdomain.com`
2. Log in as admin
3. Go to the Users page
4. Check that the user information fields are showing correctly in the listing
5. Click Edit on a user and verify all fields are editable

## Troubleshooting
If you encounter issues:
- Check backend logs: `pm2 logs sanskriti-backend`
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify PM2 status: `pm2 status`
- Restart backend if needed: `pm2 restart sanskriti-backend`
