# ⚡ Lightning Payments with Alby Hub

Your Bitcoin Sovereign Academy now has a fully integrated Lightning payment system connected to your personal Alby Hub node.

## 🎯 What's Been Set Up

✅ **API Endpoint**: `/api/lightning/create-invoice` - Creates invoices via your Alby Hub  
✅ **Webhook Handler**: `/api/webhooks/alby` - Processes payment confirmations  
✅ **Frontend Integration**: Updated `lightning-payment.js` to use the new backend API  
✅ **Environment Configuration**: Added Alby Hub credentials to `.env` files  
✅ **Test Script**: `test-lightning.js` for testing the integration

## 🔧 Configuration Required

### 1. Get Your Alby Hub Credentials

1. **Access your Alby Hub** (your personal Lightning node)
2. Navigate to **Settings → API**
3. Create a new API key with permissions:
   - `invoices:read`
   - `invoices:write`
   - `payments:read` (optional, for future features)
4. Copy your **API Key** and **Hub URL**

### 2. Update Environment Variables

Edit `.env.local` and replace the placeholders:

```bash
# Alby Hub (Lightning)
ALBY_HUB_URL=https://your-actual-hub-url.com
ALBY_API_KEY=your_actual_api_key_here
ALBY_WEBHOOK_SECRET=generate_a_random_secret_here
```

### 3. Configure Webhooks (Recommended)

In your Alby Hub dashboard:
1. Go to **Settings → Webhooks**
2. Add webhook:
   - **URL**: `https://bitcoinsovereign.academy/api/webhooks/alby`
   - **Secret**: Use the same value as `ALBY_WEBHOOK_SECRET`
   - **Events**: Select `invoice.settled` and `invoice.expired`

## 🧪 Testing the Setup

### Local Testing
```bash
# Start your development server
npm run dev

# In another terminal, test the Lightning API
node test-lightning.js
```

### Manual Testing
1. Visit your site's membership page
2. Select "Apprentice" tier (50,000 sats deposit)
3. Click the Lightning payment option
4. The system will generate an invoice via your Alby Hub
5. Pay the invoice with any Lightning wallet
6. Payment confirmation will be processed automatically

## 🔄 Payment Flow

```
User clicks "Pay with Lightning"
        ↓
Frontend calls /api/lightning/create-invoice
        ↓
Backend creates invoice via Alby Hub API
        ↓
User pays invoice with Lightning wallet
        ↓
Alby Hub sends webhook to /api/webhooks/alby
        ↓
System updates user's membership status
```

## 💡 Your Lightning Address

Your Lightning address `dulcetsurf67367@getalby.com` is already configured in the frontend for receiving tips and smaller payments.

## 🛠 Troubleshooting

**Invoice creation fails:**
- Check that `ALBY_HUB_URL` and `ALBY_API_KEY` are set correctly
- Ensure your Alby Hub is online and accessible
- Verify API key has correct permissions

**Payments not confirmed:**
- Check webhook configuration in Alby Hub
- Verify `ALBY_WEBHOOK_SECRET` matches between Hub and your app
- Check server logs for webhook errors

**Testing locally:**
- Use `http://localhost:3000` instead of production URL for webhooks during development
- Use ngrok or similar to expose local webhooks to your Alby Hub

## 🚀 Production Deployment

When deploying to production:
1. Add all environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Update webhook URLs in Alby Hub to use production domain
3. Test the complete flow on production

## 📚 API Documentation

### Create Invoice
```http
POST /api/lightning/create-invoice
Content-Type: application/json

{
  "amount": 50000,
  "description": "BSA Apprentice Deposit",
  "expirySeconds": 3600
}
```

### Webhook Events
```http
POST /api/webhooks/alby
X-Alby-Signature: sha256=...

{
  "type": "invoice.settled",
  "data": {
    "payment_hash": "...",
    "amount": 50000,
    "settled_at": "2025-01-15T12:00:00Z"
  }
}
```

---

Your Lightning payment system is now ready! 🎉

Need help? Check the console logs for detailed error messages or refer to the Alby Hub documentation.