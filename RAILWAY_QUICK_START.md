# Railway Deployment - Quick Reference

## 🚀 Quick Start (5 Minutes)

### 1. Push to GitHub
```powershell
.\setup-github.ps1
```
Or manually:
- Create repo at https://github.com/new
- Run: `git init && git add . && git commit -m "init" && git push`

### 2. Deploy to Railway
- Go to https://railway.app
- Sign in with GitHub
- New Project → Deploy from GitHub
- Select your repository
- Set root directory: `backend`

### 3. Add MySQL Database
- In Railway project: New → Database → MySQL

### 4. Configure Variables
Add these environment variables in Railway:
- `DATABASE_URL` - (use reference to MySQL)
- `JWT_SECRET` - (generate: `openssl rand -base64 32`)
- `REFRESH_TOKEN_SECRET` - (generate: `openssl rand -base64 32`)
- `JWT_EXPIRES_IN` - `7d`
- `REFRESH_TOKEN_EXPIRES_IN` - `30d`
- `PORT` - `5000`
- `NODE_ENV` - `production`
- `FRONTEND_URL` - `https://your-netlify-site.netlify.app`

### 5. Deploy Settings
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `node dist/app.js`

### 6. Seed Database
```powershell
npm install -g @railway/cli
railway login
railway link
railway run node seed.js
```

### 7. Get Backend URL
- Railway → Backend Service → Settings → Networking
- Generate Domain
- Copy URL (e.g., `yourapp.up.railway.app`)

### 8. Update Netlify Frontend
Update environment variable:
```
VITE_API_URL=https://yourapp.up.railway.app/api
```

---

## 📋 Environment Variables Checklist

| Variable | Source | Example |
|----------|--------|---------|
| DATABASE_URL | Railway MySQL Reference | Auto-filled |
| JWT_SECRET | `openssl rand -base64 32` | abc123xyz... |
| REFRESH_TOKEN_SECRET | `openssl rand -base64 32` | def456uvw... |
| JWT_EXPIRES_IN | Manual | 7d |
| REFRESH_TOKEN_EXPIRES_IN | Manual | 30d |
| PORT | Manual | 5000 |
| NODE_ENV | Manual | production |
| FRONTEND_URL | Your Netlify URL | https://... |

---

## ✅ Testing

```bash
# Health check
curl https://yourapp.up.railway.app/api/health

# Login test
curl -X POST https://yourapp.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"admin","password":"admin123"}'
```

---

## 🔧 Troubleshooting

**Build failed:**
- Check Railway logs
- Verify `backend` is root directory
- Check all dependencies in package.json

**Database error:**
- Ensure DATABASE_URL uses Reference
- Check MySQL service is running
- Verify migrations ran

**CORS error:**
- Update FRONTEND_URL variable
- Redeploy backend

---

For complete guide, see: [railway_deployment.md](file:///C:/Users/akash/.gemini/antigravity/brain/05d9495a-d09e-48a7-8b9c-06da140deb24/railway_deployment.md)
