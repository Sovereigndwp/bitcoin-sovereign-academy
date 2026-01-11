# BTCPay Server Setup Guide

## Overview
BTCPay Server is a free, open-source Bitcoin payment processor. This guide will help you set up BTCPay Server for Bitcoin Sovereign Academy.

## Step 1: Choose Your Hosting Option

### Option A: LunaNode (Recommended - Easiest)
**Cost:** ~$10-15/month
**Setup Time:** 10-15 minutes

1. Go to https://launchbtcpay.lunanode.com/
2. Sign up for a LunaNode account
3. Click "Launch BTCPay Server"
4. Follow the automated setup wizard
5. Your BTCPay instance will be ready in ~10 minutes

### Option B: Voltage (Good Alternative)
**Cost:** ~$20/month
**Setup Time:** 5 minutes

1. Go to https://voltage.cloud/
2. Create an account
3. Deploy a BTCPay Server node
4. Access your BTCPay dashboard

### Option C: Self-Hosted (Advanced)
**Cost:** Server costs only
**Setup Time:** 1-2 hours

Follow: https://docs.btcpayserver.org/Deployment/

## Step 2: Initial BTCPay Server Configuration

Once your BTCPay Server is running:

### 1. Create Your Account
- Navigate to your BTCPay Server URL
- Click "Register" and create an admin account
- **Save your credentials securely**

### 2. Create a Store
- Click "Stores" → "Create a new store"
- Store Name: **Bitcoin Sovereign Academy**
- Default Currency: **USD**
- Click "Create"

### 3. Connect a Bitcoin Wallet

#### Option A: Use BTCPay's Internal Wallet (Easiest)
1. Go to **Stores** → **Your Store** → **Settings** → **Wallet**
2. Click **"Set up a wallet"**
3. Choose **"Create a new wallet"**
4. Select **"Hot wallet"** (for testing) or **"Watch-only"** (for production with hardware wallet)
5. Click **Generate** and **save your seed phrase securely**
6. Confirm your wallet is connected

#### Option B: Connect Existing Wallet
1. Use your hardware wallet or Bitcoin Core node
2. Export your xpub (extended public key)
3. Import into BTCPay Server

## Step 3: Get Your API Credentials

### 1. Generate API Key
1. Go to **Account** → **API Keys**
2. Click **"Generate Key"**
3. Label: **Bitcoin Sovereign Academy Production**
4. Permissions: Select:
   - ✅ **View invoices**
   - ✅ **Create invoice**
   - ✅ **Modify invoices**
   - ✅ **Modify stores webhooks**
   - ✅ **View your stores**
5. Click **"Generate"**
6. **COPY AND SAVE THIS KEY IMMEDIATELY** (you won't see it again)

### 2. Get Your Store ID
1. Go to **Stores** → **Your Store** → **Settings** → **General**
2. Look for **"Store ID"** at the top
3. Copy this value (format: `ABC123...`)

### 3. Note Your BTCPay URL
- Example: `https://your-domain.lndyn.com` (LunaNode)
- Example: `https://your-node.m.voltageapp.io` (Voltage)

## Step 4: Configure Webhook

### 1. Generate Webhook Secret
Run this locally to generate a strong secret:
```bash
openssl rand -base64 32
```
Save this value - you'll need it for both BTCPay and Vercel.

### 2. Create Webhook in BTCPay
1. Go to **Stores** → **Your Store** → **Settings** → **Webhooks**
2. Click **"Create Webhook"**
3. **Payload URL:** `https://bitcoinsovereign.academy/api/webhooks/btcpay`
4. **Secret:** Paste the secret you generated above
5. **Automatic redelivery:** ✅ Enable
6. **Events:** Select:
   - ✅ **Invoice settled**
   - ✅ **Invoice expired**
   - ✅ **Invoice invalid**
7. Click **"Create"**

## Step 5: Add Environment Variables to Vercel

You'll need these four values:

```bash
BTCPAY_URL=https://your-btcpay-url.com
BTCPAY_API_KEY=your_generated_api_key_here
BTCPAY_STORE_ID=your_store_id_here
BTCPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Add to Vercel:
```bash
# From your project directory
echo "https://your-btcpay-url.com" | vercel env add BTCPAY_URL production
echo "https://your-btcpay-url.com" | vercel env add BTCPAY_URL preview  
echo "https://your-btcpay-url.com" | vercel env add BTCPAY_URL development

echo "your_api_key" | vercel env add BTCPAY_API_KEY production
echo "your_api_key" | vercel env add BTCPAY_API_KEY preview
echo "your_api_key" | vercel env add BTCPAY_API_KEY development

echo "your_store_id" | vercel env add BTCPAY_STORE_ID production
echo "your_store_id" | vercel env add BTCPAY_STORE_ID preview
echo "your_store_id" | vercel env add BTCPAY_STORE_ID development

echo "your_webhook_secret" | vercel env add BTCPAY_WEBHOOK_SECRET production
echo "your_webhook_secret" | vercel env add BTCPAY_WEBHOOK_SECRET preview
echo "your_webhook_secret" | vercel env add BTCPAY_WEBHOOK_SECRET development
```

## Step 6: Test the Integration

### 1. Test Invoice Creation
```bash
curl -X POST https://bitcoinsovereign.academy/api/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "demo_single",
    "email": "test@example.com"
  }'
```

You should receive a checkout URL in response.

### 2. Test Payment Flow
1. Visit your pricing page
2. Click "Unlock this demo"
3. Complete payment with testnet Bitcoin (or real Bitcoin if you're ready)
4. Verify webhook receives payment notification
5. Confirm entitlement is granted

## Step 7: Security Best Practices

### 🔒 Production Checklist
- [ ] Use a dedicated email for BTCPay notifications
- [ ] Enable 2FA on BTCPay Server account
- [ ] Backup your seed phrase securely (offline, multiple locations)
- [ ] Use watch-only wallet for large amounts
- [ ] Set up automatic withdrawal to cold storage for large balances
- [ ] Monitor webhook deliveries regularly
- [ ] Keep BTCPay Server updated
- [ ] Use environment variables (never hardcode keys)

### 🚨 Never Do This
- ❌ Share your API key publicly
- ❌ Commit API keys to git
- ❌ Use the same webhook secret for multiple environments
- ❌ Store seed phrase digitally (except encrypted backups)
- ❌ Skip seed phrase backup

## Step 8: Going Live

### Pre-Launch Checklist
- [ ] BTCPay Server is running and accessible
- [ ] Store is configured with correct currency (USD)
- [ ] Bitcoin wallet is connected and receiving payments
- [ ] API key has correct permissions
- [ ] Webhook is configured and secret matches
- [ ] All environment variables are set in Vercel (production)
- [ ] Test payment completed successfully
- [ ] Webhook delivery confirmed
- [ ] Entitlement granted correctly
- [ ] User can access purchased content

### Monitoring
1. **BTCPay Dashboard:** Check daily for payments
2. **Webhook Logs:** Monitor in BTCPay Settings → Webhooks
3. **Supabase:** Query purchases table for completed payments
4. **Email Notifications:** Enable in BTCPay for new payments

## Troubleshooting

### Issue: Webhook not receiving events
- Verify webhook URL is correct and publicly accessible
- Check webhook secret matches in both BTCPay and Vercel
- Look at webhook delivery attempts in BTCPay dashboard
- Check Vercel function logs for errors

### Issue: Invoice creation fails
- Verify API key has "Create invoice" permission
- Check store ID is correct
- Ensure wallet is connected to store
- Review BTCPay Server logs

### Issue: Payments not detected
- Confirm Bitcoin wallet is properly synced
- Check if invoice expired before payment
- Verify payment was sent to correct address
- Check BTCPay transaction logs

## Support Resources

- **BTCPay Docs:** https://docs.btcpayserver.org/
- **Community Chat:** https://chat.btcpayserver.org/
- **GitHub Issues:** https://github.com/btcpayserver/btcpayserver/issues

## Next Steps

After BTCPay is configured:
1. Set up Stripe for card payments (if desired)
2. Test full payment flow end-to-end
3. Configure pricing tiers in your application
4. Update frontend to use new checkout flow
5. Deploy to production

---

**Questions?** Open an issue or check the BTCPay community chat.
