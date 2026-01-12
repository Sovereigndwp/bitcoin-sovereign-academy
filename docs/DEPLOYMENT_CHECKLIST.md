# Deployment Checklist

## Pre-Deployment Setup

### 1. Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Choose region closest to your users

2. **Run Database Schema**
   ```bash
   # Connect to Supabase SQL Editor and run:
   # Contents of database/schema.sql
   ```

3. **Get Connection String**
   - Go to Settings → Database
   - Copy connection string (pooler mode recommended)
   - Replace `[YOUR-PASSWORD]` with your database password

### 2. Environment Variables (Vercel)

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase connection string | `postgres://...` |
| `JWT_SECRET` | 256-bit secret for JWT signing | `openssl rand -base64 32` |
| `BASE_URL` | Your production URL | `https://bitcoinsovereign.academy` |
| `NODE_ENV` | Environment | `production` |

**BTCPay Server (for Bitcoin payments):**

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `BTCPAY_URL` | Your BTCPay server URL | Your BTCPay instance |
| `BTCPAY_API_KEY` | API key with invoice permissions | BTCPay → Account → API Keys |
| `BTCPAY_STORE_ID` | Store ID | BTCPay → Stores → Store ID |
| `BTCPAY_WEBHOOK_SECRET` | Webhook secret | BTCPay → Store → Webhooks |

**Stripe (for card payments):**

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `STRIPE_SECRET` | Secret key | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe → Webhooks → Signing secret |

**Email Service (choose one):**

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key (https://resend.com) |
| `SENDGRID_API_KEY` | SendGrid API key |
| `EMAIL_FROM` | From address (e.g., `hello@yourdomain.com`) |

### 3. BTCPay Server Setup

1. **Create Webhook**
   - Go to your BTCPay Store → Settings → Webhooks
   - Add webhook:
     - URL: `https://yourdomain.com/api/webhooks/btcpay`
     - Events: `InvoiceSettled`, `InvoiceExpired`, `InvoiceInvalid`
     - Secret: Copy this for `BTCPAY_WEBHOOK_SECRET`

2. **Test Connection**
   ```bash
   curl -X GET "https://your-btcpay-server/api/v1/health"
   ```

### 4. Stripe Setup

1. **Create Webhook**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint:
     - URL: `https://yourdomain.com/api/webhooks/stripe`
     - Events to listen for:
       - `checkout.session.completed`
       - `customer.subscription.created`
       - `customer.subscription.updated`
       - `customer.subscription.deleted`
       - `invoice.payment_succeeded`
       - `invoice.payment_failed`
   - Copy signing secret for `STRIPE_WEBHOOK_SECRET`

2. **Create Products (for subscriptions)**
   - Create products in Stripe Dashboard
   - Copy price IDs to `api/config/products.ts`

---

## Deployment Steps

### 1. Deploy to Vercel

```bash
# Make sure all changes are committed
git status

# Push to trigger deployment
git push origin main

# Or deploy manually
vercel --prod
```

### 2. Verify Environment Variables

Go to Vercel → Project → Settings → Environment Variables

Check all required variables are set for Production.

### 3. Verify Database Connection

Check Vercel function logs for any database connection errors.

---

## Post-Deployment Testing

### Test 1: Health Check

```bash
curl https://yourdomain.com/api/health
# Should return: {"status": "ok"}
```

### Test 2: Magic Link Auth

1. Go to `/pricing-new.html`
2. Click purchase, enter email
3. Check email arrives
4. Click magic link
5. Verify redirect and session

### Test 3: BTCPay Payment (Sandbox)

1. Go to `/pricing-new.html`
2. Select a product
3. Choose Bitcoin payment
4. Complete payment on BTCPay
5. Verify:
   - Webhook received (check Vercel logs)
   - Purchase recorded in database
   - Entitlement granted
   - Receipt email sent

### Test 4: Stripe Payment (Test Mode)

1. Use Stripe test card: `4242 4242 4242 4242`
2. Complete checkout
3. Verify:
   - Webhook received
   - Purchase recorded
   - Entitlement granted
   - Receipt email sent

### Test 5: Account Dashboard

1. Sign in
2. Go to `/account.html`
3. Verify:
   - Subscriptions tab shows data
   - Purchases tab shows history
   - Content Access shows entitlements

### Test 6: Content Lock

1. Navigate to a protected demo
2. Verify paywall appears
3. Purchase access
4. Verify content unlocks

---

## Monitoring

### Vercel Logs

```bash
vercel logs --prod
```

Or check in Vercel Dashboard → Project → Deployments → Functions.

### Key Things to Monitor

1. **Webhook Errors**: Check `webhook_events` table for failures
2. **Security Events**: Check `security_events` table for suspicious activity
3. **Rate Limits**: Monitor 429 responses
4. **Payment Mismatches**: Alert on `PAYMENT_MISMATCH` events

### Database Queries for Monitoring

```sql
-- Recent webhook events
SELECT * FROM webhook_events 
ORDER BY created_at DESC LIMIT 20;

-- Failed webhooks
SELECT * FROM webhook_events 
WHERE processed = false 
ORDER BY created_at DESC;

-- Security events
SELECT * FROM security_events 
WHERE severity IN ('HIGH', 'CRITICAL')
ORDER BY created_at DESC;

-- Recent purchases
SELECT * FROM purchases 
ORDER BY created_at DESC LIMIT 20;

-- Active subscriptions
SELECT * FROM subscriptions 
WHERE status = 'active';
```

---

## Troubleshooting

### Common Issues

**1. "Database connection failed"**
- Check `DATABASE_URL` is correct
- Verify Supabase project is running
- Check IP allowlist if applicable

**2. "Webhook signature verification failed"**
- Verify webhook secret matches
- Check payload is not modified (use raw body)
- Ensure correct header name (`btcpay-sig` or `stripe-signature`)

**3. "JWT_SECRET not set"**
- Add JWT_SECRET to Vercel environment variables
- Redeploy after adding

**4. "Email not sending"**
- Check RESEND_API_KEY or SENDGRID_API_KEY is set
- Verify from address domain is verified
- Check email service logs

**5. "Payment processed but no entitlement"**
- Check webhook logs for errors
- Verify user exists in database
- Check entitlement granting logic

---

## Rollback Plan

If issues occur:

1. **Revert to Previous Deployment**
   - Vercel → Deployments → Select previous → Promote to Production

2. **Disable Webhooks Temporarily**
   - BTCPay/Stripe → Disable webhook
   - Investigate and fix
   - Re-enable

3. **Database Rollback**
   - Supabase has point-in-time recovery
   - Contact support if needed

---

## Go-Live Checklist

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] BTCPay webhook configured
- [ ] Stripe webhook configured (if using)
- [ ] Email service configured
- [ ] Test payment completed successfully
- [ ] Test email received
- [ ] Account dashboard working
- [ ] Content lock working
- [ ] Error monitoring in place
- [ ] SSL certificate valid
- [ ] Domain configured

**Ready to accept payments! 🚀**
