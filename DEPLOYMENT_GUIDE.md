# 🚀 Bitcoin Sovereign Academy - Production Deployment Guide

**Last Updated:** November 4, 2025
**Status:** Week 1 Critical Fixes
**Estimated Time:** 2-4 hours

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

Before starting, ensure you have:
- [ ] Supabase account (https://supabase.com - free tier works)
- [ ] Email service account (Resend or SendGrid)
- [ ] Stripe account (test mode for now)
- [ ] BTCPay Server (optional for Bitcoin payments)
- [ ] Vercel account (where site is deployed)
- [ ] Access to GitHub repository

---

## 🗄️ **STEP 1: DEPLOY DATABASE (30-45 minutes)**

### **1.1 Create Supabase Project**

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose:
   - **Organization:** Your organization
   - **Name:** bitcoin-sovereign-academy
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to your users
   - **Plan:** Free (sufficient for start)

4. Wait 2-3 minutes for project creation

### **1.2 Deploy Database Schema**

**Option A: Via Supabase Dashboard (Easiest)**

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `/database/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. Wait for completion (should see "Success" message)

**Option B: Via CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### **1.3 Verify Database Deployment**

In Supabase Dashboard:
1. Go to **Table Editor**
2. Verify these tables exist:
   - ✅ `users`
   - ✅ `sessions`
   - ✅ `entitlements`
   - ✅ `payments`
   - ✅ `webhook_events`
   - ✅ `promo_codes`
   - ✅ `promo_code_usage`

3. Click on `users` table
4. Verify columns exist: `id`, `email`, `password_hash`, etc.

### **1.4 Get Database Credentials**

1. In Supabase Dashboard, go to **Project Settings** → **API**
2. Copy these values (you'll need them later):
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
   ```

3. Go to **Project Settings** → **Database**
4. Copy the connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

✅ **Database deployed successfully!**

---

## 📧 **STEP 2: CONFIGURE EMAIL SERVICE (15-30 minutes)**

### **Option A: Resend (Recommended - Easier)**

**2.1 Create Resend Account**

1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Verify your email

**2.2 Add Domain**

1. Go to **Domains** → **Add Domain**
2. Enter: `bitcoinsovereign.academy`
3. Add these DNS records to your domain registrar:

   ```
   Type: TXT
   Name: @
   Value: [Resend verification value]

   Type: MX
   Name: @
   Priority: 10
   Value: feedback-smtp.us-east-1.amazonses.com

   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@bitcoinsovereign.academy
   ```

4. Wait for verification (5-60 minutes)

**2.3 Generate API Key**

1. Go to **API Keys** → **Create API Key**
2. Name: `bitcoin-sovereign-academy-production`
3. Copy the API key (starts with `re_...`)
4. Save it securely (can't view again)

**2.4 Test Email Sending**

In Resend Dashboard:
1. Go to **Emails** → **Send Test Email**
2. To: your email
3. From: `noreply@bitcoinsovereign.academy`
4. Click **Send**
5. Check your inbox (may be in spam first time)

---

### **Option B: SendGrid (Alternative)**

**2.1 Create SendGrid Account**

1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Complete verification

**2.2 Create API Key**

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `bitcoin-sovereign-academy`
4. Permissions: **Full Access**
5. Copy the API key (starts with `SG.`)
6. Save securely

**2.3 Verify Domain**

1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow DNS setup instructions

✅ **Email service configured!**

---

## 🔐 **STEP 3: GENERATE JWT_SECRET (5 minutes)**

### **3.1 Generate Strong Secret**

**Option A: Using OpenSSL (Mac/Linux)**
```bash
openssl rand -base64 64
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

**Option C: Online Generator**
Visit: https://www.random.org/strings/
- Length: 64
- Characters: Alphanumeric
- Click "Get Strings"

**Example output:**
```
kL9mN2pQ7rS4tU6vW8xY0zA1bC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE
```

### **3.2 Save the Secret**

Copy your generated secret and save it temporarily (you'll add it to Vercel in next step).

**IMPORTANT:**
- Never commit this to Git
- Never share it publicly
- Keep it at least 64 characters long

✅ **JWT_SECRET generated!**

---

## ⚙️ **STEP 4: CONFIGURE VERCEL ENVIRONMENT VARIABLES (15 minutes)**

### **4.1 Access Vercel Dashboard**

1. Go to https://vercel.com
2. Find your `bitcoin-sovereign-academy` project
3. Click on the project
4. Go to **Settings** → **Environment Variables**

### **4.2 Add All Environment Variables**

Add these one by one, setting **Production**, **Preview**, and **Development**:

#### **Database Variables**
```
Name: SUPABASE_URL
Value: https://xxxxx.supabase.co

Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: DATABASE_URL (optional - for direct connection)
Value: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### **JWT Secret**
```
Name: JWT_SECRET
Value: [Your 64-character secret from Step 3]
```

#### **Email Configuration**

**If using Resend:**
```
Name: EMAIL_PROVIDER
Value: resend

Name: EMAIL_API_KEY
Value: re_...

Name: FROM_EMAIL
Value: noreply@bitcoinsovereign.academy

Name: FROM_NAME
Value: Bitcoin Sovereign Academy
```

**If using SendGrid:**
```
Name: EMAIL_PROVIDER
Value: sendgrid

Name: EMAIL_API_KEY
Value: SG...

Name: FROM_EMAIL
Value: noreply@bitcoinsovereign.academy

Name: FROM_NAME
Value: Bitcoin Sovereign Academy
```

#### **Stripe Configuration**

**For Testing:**
```
Name: STRIPE_SECRET
Value: sk_test_...

Name: STRIPE_WEBHOOK_SECRET
Value: whsec_test_...

Name: STRIPE_PUBLISHABLE_KEY (optional - for frontend)
Value: pk_test_...
```

**For Production (later):**
```
Replace with: sk_live_..., whsec_live_..., pk_live_...
```

#### **BTCPay Configuration (Optional)**
```
Name: BTCPAY_URL
Value: https://btcpay.yourdomain.com

Name: BTCPAY_API_KEY
Value: [Your BTCPay API key]

Name: BTCPAY_STORE_ID
Value: [Your store ID]

Name: BTCPAY_WEBHOOK_SECRET
Value: [Create a random 32-char string]
```

#### **Admin Dashboard**
```
Name: ADMIN_PASSWORD
Value: [Create a strong password for admin access]
```

#### **CORS Configuration**
```
Name: ALLOWED_ORIGIN
Value: https://bitcoinsovereign.academy
```

#### **Site URL**
```
Name: SITE_URL
Value: https://bitcoinsovereign.academy
```

### **4.3 Verify Variables**

1. Go back to Environment Variables page
2. You should see ~15 variables listed
3. Each should show "Production, Preview, Development"

✅ **Vercel configured!**

---

## 🧪 **STEP 5: TEST PAYMENT FLOW (30-60 minutes)**

### **5.1 Redeploy Site**

After adding environment variables, redeploy:

```bash
# From your local repo
git pull origin main  # Get latest changes
vercel --prod
```

Or in Vercel Dashboard:
1. Go to **Deployments**
2. Click **Redeploy** on latest deployment
3. Check "Use existing build cache"
4. Click **Redeploy**
5. Wait 2-3 minutes

### **5.2 Configure Stripe Webhook**

**Important:** Must do this for payments to work!

1. Go to https://dashboard.stripe.com
2. Go to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Endpoint URL: `https://bitcoinsovereign.academy/api/webhooks/stripe`
5. Events to send:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Update `STRIPE_WEBHOOK_SECRET` in Vercel

### **5.3 Test Checkout Flow**

**5.3.1 Create Test Purchase**

1. Visit: `https://bitcoinsovereign.academy`
2. Click a learning path
3. Click "Unlock This Path"
4. Should redirect to checkout page
5. Verify cart shows correct items and prices

**5.3.2 Complete Test Payment**

1. Enter test email: `test@example.com`
2. Select "Pay with Card"
3. Click "Proceed to Payment"
4. Use Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Exp: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 12345)
   ```
5. Click "Pay"
6. Should redirect to success page

**5.3.3 Verify Email Delivery**

1. Check your email (`test@example.com`)
2. Should receive email with:
   - Welcome message
   - Access token
   - Link to courses
3. Email should arrive within 30 seconds

**5.3.4 Verify Database Record**

In Supabase Dashboard:
1. Go to **Table Editor** → **payments**
2. Should see new payment record with:
   - `email`: test@example.com
   - `provider`: stripe
   - `status`: completed
   - `amount_usd`: correct amount
3. Go to **Table Editor** → **entitlements**
4. Should see entitlement record with modules/paths

**5.3.5 Test Content Access**

1. Copy the JWT token from email
2. Open browser console on homepage
3. Run: `BSASubdomainAccess.setAccessToken('YOUR_TOKEN_HERE')`
4. Visit a locked module page
5. Content should be unlocked
6. No paywall should appear

### **5.4 Test Error Scenarios**

**5.4.1 Invalid Email**
1. Try checkout with invalid email: `notanemail`
2. Should show validation error

**5.4.2 Payment Failure**
1. Use declined card: `4000 0000 0000 0002`
2. Should show payment failed message
3. No email should be sent
4. No database record created

**5.4.3 Webhook Failure**
1. In Stripe Dashboard, go to **Webhooks**
2. Find your webhook
3. Should show "No recent errors"
4. If errors, check logs in Vercel

---

## ⚡ **STEP 6: IMPLEMENT QUICK PERFORMANCE WINS (2-4 hours)**

### **6.1 Add Defer to Scripts**

**File:** `/index.html`

Find all script tags (around lines 2979-2995):

**Before:**
```html
<script src="/js/bitcoin-data-fallback.js"></script>
<script src="/js/hero-cta.js"></script>
```

**After:**
```html
<script src="/js/bitcoin-data-fallback.js" defer></script>
<script src="/js/hero-cta.js" defer></script>
```

Apply to ALL script tags in `index.html`.

### **6.2 Add Resource Hints**

**File:** `/index.html`

Add in `<head>` section after meta tags:

```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://api.coinbase.com">
<link rel="dns-prefetch" href="https://blockchain.info">
<link rel="dns-prefetch" href="https://mempool.space">
<link rel="dns-prefetch" href="https://api.coingecko.com">

<!-- Preconnect -->
<link rel="preconnect" href="https://api.coinbase.com" crossorigin>
```

### **6.3 Implement Bitcoin Data Caching**

**File:** `/js/bitcoin-data-fallback.js`

Find the `fetchBitcoinPrice()` function and add caching:

```javascript
async function fetchBitcoinPrice() {
  // Check cache first
  try {
    const cached = localStorage.getItem('btc_price_cache');
    if (cached) {
      const { price, timestamp } = JSON.parse(cached);
      const age = Math.floor((Date.now() - timestamp) / 1000);

      if (age < 60) {  // Use cache if < 60 seconds old
        updateElement('btc-price', price);
        updateElement('bar-btc-price', price);
        console.log('✓ Using cached price');
        return;
      }
    }
  } catch (e) {
    console.error('Cache error:', e);
  }

  // ... existing fetch logic ...

  // After successful fetch, add:
  localStorage.setItem('btc_price_cache', JSON.stringify({
    price: formattedPrice,
    timestamp: Date.now()
  }));
}
```

### **6.4 Commit and Deploy**

```bash
git add index.html js/bitcoin-data-fallback.js
git commit -m "Add performance optimizations: defer scripts, resource hints, Bitcoin data caching"
git push origin main
```

Vercel will auto-deploy.

---

## ✅ **VERIFICATION CHECKLIST**

After completing all steps, verify:

### **Database**
- [ ] Supabase project created
- [ ] Schema deployed successfully
- [ ] All 7 tables exist
- [ ] Can query tables without errors

### **Email**
- [ ] Email service account created
- [ ] Domain verified
- [ ] API key generated
- [ ] Test email received

### **Environment Variables**
- [ ] All 15+ variables added to Vercel
- [ ] JWT_SECRET is 64+ characters
- [ ] Database credentials correct
- [ ] Email API key correct

### **Payment Flow**
- [ ] Stripe webhook configured
- [ ] Test payment completes
- [ ] Email received with token
- [ ] Database records created
- [ ] JWT token unlocks content

### **Performance**
- [ ] Scripts have `defer` attribute
- [ ] Resource hints added
- [ ] Bitcoin data caching works
- [ ] Page loads faster

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Database connection fails**

**Error:** `Connection to database failed`

**Solutions:**
1. Check `SUPABASE_URL` is correct (no trailing slash)
2. Check `SUPABASE_ANON_KEY` is the anon key (not service_role)
3. Verify Supabase project is not paused (free tier auto-pauses after 7 days inactivity)
4. Check Row Level Security (RLS) policies are correct

### **Issue: Emails not sending**

**Error:** `Email delivery failed`

**Solutions:**
1. Check `EMAIL_API_KEY` is correct
2. Verify `EMAIL_PROVIDER` is set to `resend` or `sendgrid`
3. Check domain is verified in email service
4. Look in email service dashboard for error logs
5. Check `FROM_EMAIL` domain matches verified domain

### **Issue: JWT tokens don't work**

**Error:** `Invalid token` in console

**Solutions:**
1. Check `JWT_SECRET` is set in Vercel
2. Verify JWT_SECRET is same in all environments
3. Clear localStorage and try again: `localStorage.clear()`
4. Check token isn't expired
5. Verify token format (3 parts separated by dots)

### **Issue: Webhook not receiving events**

**Error:** No payment records created

**Solutions:**
1. Check webhook URL is correct in Stripe dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe
3. Check Vercel function logs for errors
4. Test webhook in Stripe dashboard → Webhooks → Send test webhook
5. Verify webhook endpoint returns 200 status

### **Issue: Performance not improved**

**Solutions:**
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Clear browser cache
3. Check scripts have `defer` attribute in production build
4. Verify CDN is serving latest files
5. Test in incognito mode

---

## 📊 **MONITORING**

### **After Deployment, Monitor:**

**Vercel Dashboard:**
- Check **Functions** → Look for errors
- Check **Analytics** → Monitor page views
- Check **Logs** → Real-time function logs

**Supabase Dashboard:**
- Check **Table Editor** → Verify data is being created
- Check **Logs** → Database query logs
- Check **API** → Monitor API usage

**Stripe Dashboard:**
- Check **Payments** → Successful transactions
- Check **Webhooks** → Delivery status
- Check **Logs** → Error messages

**Email Service Dashboard:**
- Check delivery rate
- Check spam reports
- Monitor bounce rate

---

## 🎉 **SUCCESS CRITERIA**

You've successfully deployed when:

✅ Test payment completes
✅ Email received with access token
✅ Token unlocks content
✅ Database records created
✅ Site loads 2-3x faster
✅ No errors in Vercel logs
✅ Webhook delivering successfully

---

## 📞 **NEXT STEPS**

After successful deployment:

1. **Week 2:** Implement high-priority security fixes
2. **Week 3:** Deploy admin dashboard
3. **Week 4:** Launch to real users with marketing

**Questions?** Check the audit reports in `/docs/` for detailed guides.

---

**Deployment Guide Version:** 1.0
**Last Updated:** November 4, 2025
**Estimated Total Time:** 2-4 hours
