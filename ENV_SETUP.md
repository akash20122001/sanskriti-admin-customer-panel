# Environment Variables Setup

## How It Works

The project now uses Vite's automatic environment file loading:

### Files:
- **`.env`** - Production/QA environment (committed to git)
  - Used by Railway/Netlify deployments
  - Points to Railway backend: `https://sanskriti-admin-customer-panel-production.up.railway.app/api`

- **`.env.development.local`** - Local development (NOT committed)
  - Used when running `npm run dev` locally
  - Points to local backend: `http://localhost:5000/api`
  - This file is in `.gitignore`

### Vite Loading Priority (highest to lowest):
1. `.env.[mode].local` (e.g., `.env.development.local`)
2. `.env.[mode]` (e.g., `.env.production`)
3. `.env.local`
4. `.env`

### For Developers:

**First Time Setup:**
```bash
cd frontend
# The .env.development.local file is already created for you
# Just restart your dev server
npm run dev
```

**Workflow:**
1. **Local Development:** Just run `npm run dev` - uses `.env.development.local` automatically
2. **Push to QA:** Just `git push origin qa` - `.env` is used automatically on Netlify

**No more manual .env switching!** 🎉

### Modes:
- `npm run dev` → uses `development` mode → loads `.env.development.local`
- `npm run build` → uses `production` mode → loads `.env`
- Railway/Netlify → uses `production` mode → loads `.env`

## Current Configuration:

**Local (.env.development.local):**
```
VITE_API_URL=http://localhost:5000/api
```

**QA/Production (.env):**
```
VITE_API_URL=https://sanskriti-admin-customer-panel-production.up.railway.app/api
```

## Backend CORS

Backend is configured to accept all origins in development mode:
```typescript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : true, // Allow all origins in development
    credentials: true
}));
```

## Troubleshooting:

**CORS errors locally?**
1. Make sure `.env.development.local` exists with `VITE_API_URL=http://localhost:5000/api`
2. Restart the frontend dev server: `npm run dev`
3. Make sure backend is running on port 5000

**Still seeing Railway URL locally?**
- Kill the frontend dev server and restart it
- Vite only reads env files on startup
