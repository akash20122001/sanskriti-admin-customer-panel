# Razorpay Integration Setup Guide

## 🔐 Overview
This guide will help you set up Razorpay for secure payment processing in the Sanskriti application.

## 📋 Prerequisites
- Razorpay account (already created)
- Access to Razorpay Dashboard
- Your Razorpay API keys

## 🔑 Step 1: Get Your Razorpay Keys

### For Development/Testing:
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Switch to **Test Mode** (toggle on top right)
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Keys** (if not already generated)
5. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click "Download Key Details" or copy directly)

### For Production:
1. Complete KYC verification in Razorpay Dashboard
2. Switch to **Live Mode**
3. Go to **Settings** → **API Keys**
4. Generate Live Mode keys
5. Copy:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

## ⚙️ Step 2: Configure Backend

1. Navigate to `backend` folder
2. Open `.env` file
3. Add the following lines:

```env
# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID="your_razorpay_key_id_here"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret_here"
```

**Example (Test Mode):**
```env
RAZORPAY_KEY_ID="rzp_test_1234567890ABCD"
RAZORPAY_KEY_SECRET="XyZ1234567890AbCdEfGh"
RAZORPAY_WEBHOOK_SECRET="whsec_1234567890ABCDEFGHIJ"
```

⚠️ **IMPORTANT:** Never commit these keys to Git!

## 🌐 Step 3: Configure Frontend

1. Navigate to `frontend` folder
2. Create/open `.env` file
3. Add:

```env
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id_here"
```

**Example:**
```env
VITE_RAZORPAY_KEY_ID="rzp_test_1234567890ABCD"
```

Note: Only add the **Key ID** (public key), never the secret!

## 🔔 Step 4: Configure Webhooks (Important!)

Webhooks ensure payment status is always captured, even if the user closes the browser window.

### Local Testing (Using ngrok):
1. Install ngrok: `npm install -g ngrok`
2. Start your backend server (port 5000)
3. In another terminal: `ngrok http 5000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Configure in Razorpay:
1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Click **Create New Webhook**
3. Enter Webhook URL:
   - **Local (ngrok):** `https://abc123.ngrok.io/api/payment/webhook`
   - **Production:** `https://yourdomain.com/api/payment/webhook`
4. Select events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `order.paid`
5. Set Alert Email (optional)
6. Click **Create Webhook**
7. Copy the **Webhook Secret** (starts with `whsec_`)
8. Add to backend `.env` as `RAZORPAY_WEBHOOK_SECRET`

## 🧪 Step 5: Test the Integration

### 1. Start the servers:
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

### 2. Test Payment Flow:
1. Log in as a customer
2. Navigate to **Dashboard** → **Add Balance**
3. Enter an amount (₹100 - ₹50,000)
4. Click **Add Balance Now**
5. **Test Mode Cards** (Use these for testing):
   - **Successful Payment:**
     - Card Number: `4111 1111 1111 1111`
     - CVV: Any 3 digits
     - Expiry: Any future date
     - Name: Any name
   
   - **Failed Payment:**
     - Card Number: `4000 0000 0000 0002`
   
   - **UPI:** Use `success@razorpay` or `failure@razorpay`

6. Complete the payment
7. Verify:
   - ✅ Transaction appears in Transactions list
   - ✅ Wallet balance updated
   - ✅ Backend logs show payment verification

## 📊 Step 6: Monitor Transactions

### In Razorpay Dashboard:
- **Transactions** → View all payments
- **Orders** → View created orders
- **Settlements** → View settlement details (Live mode only)

### In Your Application:
- Admin can view all transactions in **Transactions** page
- Customers can see their own transactions

## 🚀 Step 7: Going Live

1. **Complete KYC** in Razorpay Dashboard
2. **Switch to Live Mode** in Razorpay
3. **Generate Live Keys**
4. **Update `.env` files** with live keys:
   ```env
   RAZORPAY_KEY_ID="rzp_live_..."
   RAZORPAY_KEY_SECRET="..."
   ```
5. **Update webhook URL** to production URL
6. **Test with small amount** first
7. **Monitor** first few transactions closely

## 🔒 Security Checklist

- ✅ API Secret never exposed to frontend
- ✅ All payments verified on backend
- ✅ Webhook signature validated
- ✅ HTTPS enabled in production
- ✅ Keys stored in environment variables (not hardcoded)
- ✅ `.env` file in `.gitignore`
- ✅ Different keys for test and production

## 🐛 Troubleshooting

### Payment fails immediately:
- Check if Razorpay keys are correct
- Verify backend server is running
- Check browser console for errors

### Payment succeeds but balance not updated:
- Check webhook configuration
- Verify webhook secret is correct
- Check backend logs for errors
- Ensure transaction wasn't already processed

### "Failed to create payment order":
- Verify API keys are correct
- Check if amount is within limits (₹100 - ₹50,000)
- Check backend logs for detailed error

### Webhook not working:
- Verify webhook URL is accessible
- Check webhook signature validation
- Test webhook using Razorpay Dashboard → Webhooks → Test
- For local testing, ensure ngrok is running

## 📞 Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **Integration Docs:** https://razorpay.com/docs/payments/payment-gateway/

## 📝 Notes

- Test mode has no limits on amount
- Live mode may have limits based on KYC status
- Settlements happen daily (Live mode)
- Keep webhook secret secure
- Rotate keys if compromised

---

**Last Updated:** February 2026
