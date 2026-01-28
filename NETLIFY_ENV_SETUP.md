# Netlify Environment Variable Setup

Since `netlify.toml` isn't working reliably, you need to set the environment variable directly in Netlify's UI.

## Steps:

1. **Log in to Netlify:** https://app.netlify.com
2. **Select your site** (probably named "qa-sanskriti" or similar)
3. **Go to:** Site configuration → Environment variables
4. **Add a new environment variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://sanskriti-admin-customer-panel-production.up.railway.app/api`
   - **Scopes:** Select "All scopes" or at least production/deploy-preview
5. **Save**
6. **Trigger a redeploy:**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

## Why this is needed:

Vite requires environment variables to be available at **build time**. While `netlify.toml` should work, setting variables directly in Netlify's UI is the most reliable method and is Netlify's recommended approach.

## After Setting:

Once the new deploy finishes (2-3 minutes), your frontend will use the Railway backend URL and the 404 errors should be gone.
