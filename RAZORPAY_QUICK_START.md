# 🚀 Quick Start: Add Your Razorpay Keys

## Backend Configuration

**File:** `backend/.env`

Add these lines (replace with your actual keys):

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID_HERE"
RAZORPAY_KEY_SECRET="YOUR_SECRET_KEY_HERE"
RAZORPAY_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
```

## Frontend Configuration

**File:** `frontend/.env`

Add this line (same Key ID as backend):

```env
VITE_RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID_HERE"
```

---

## Where to Find Your Keys?

1. Go to: https://dashboard.razorpay.com/
2. Switch to **Test Mode** (toggle on top-right)
3. Navigate to: **Settings** → **API Keys**
4. Click **Generate Test Keys** (if not already generated)
5. Copy:
   - **Key ID** → Use in both backend and frontend
   - **Key Secret** → Use ONLY in backend

---

## ⚠️ Important Notes

- ✅ **Key ID** can be public (used in frontend)
- ❌ **Key Secret** must NEVER be exposed (backend only)
- 🔒 Never commit `.env` files to Git
- 📝 Webhook secret can be found in: **Settings** → **Webhooks** (after creating webhook)

---

## Test it!

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend (in new terminal)
cd frontend
npm run dev

# 3. Login and try adding balance!
```

---

**Read `RAZORPAY_SETUP.md` for complete setup instructions including webhook configuration.**
