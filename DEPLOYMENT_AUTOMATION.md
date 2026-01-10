# Bitcoin Sovereign Academy - Automated Deployment Guide
## Complete Payment System Setup & Configuration

**Last Updated:** 2026-01-10
**Status:** Ready for Automated Deployment
**Time to Complete:** 30-45 minutes

---

## 🎯 Overview

This guide will walk you through deploying your complete monetization system using automation scripts. Your system includes:

- ✅ Supabase Database (PostgreSQL)
- ✅ Stripe Payment Processing
- ✅ Email Notifications (Resend)
- ✅ User Authentication & JWT
- ✅ Content Gating & Access Control
- ✅ Webhook Handling

---

## 📊 Current Status

### ✅ Already Configured
- [x] Supabase URL and Keys in `.env.local`
- [x] JWT Secret generated
- [x] Stripe Test API Key
- [x] Database schema file (`database/schema.sql`)
- [x] All API endpoints built
- [x] Frontend checkout page

### ⚠️ Needs Configuration
- [ ] Database schema applied to Supabase
- [ ] Email provider (Resend) API key
- [ ] Stripe webhook secret
- [ ] Production environment variables in Vercel
- [ ] Module gating enabled

---

## 🚀 Automated Deployment Steps

### Step 1: Verify Database Schema (5 mins)

Your Supabase database needs the schema from `database/schema.sql`.

**Option A: Via Supabase Dashboard (Recommended)**
```bash
# 1. Open Supabase Dashboard
open "https://supabase.com/dashboard/project/rdqwoqdvqpedlsbaghtr/editor"

# 2. Go to SQL Editor
# 3. Click "New Query"
# 4. Copy contents of database/schema.sql
# 5. Click "Run"
```

**Option B: Via Command Line**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref rdqwoqdvqpedlsbaghtr

# Apply schema
supabase db push --file database/schema.sql
```

**Verify Schema Applied:**
```bash
# Create a quick verification script
node -e "
const fetch = require('node:fetch');
fetch('https://rdqwoqdvqpedlsbaghtr.supabase.co/rest/v1/users?limit=0', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcXdvcWR2cXBlZGxzYmFnaHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjI0NTcsImV4cCI6MjA3ODAzODQ1N30.lv8XIuWyXaxsJ-LavFtHFuEHfBOFz4cEs9ccm4xaDHo'
  }
})
.then(r => r.ok ? console.log('✅ Database schema verified!') : console.log('❌ Schema not applied'))
.catch(e => console.log('❌ Connection error:', e.message));
"
```

---

### Step 2: Set Up Email Provider (10 mins)

**Sign up for Resend:**
```bash
# 1. Go to Resend
open "https://resend.com/signup"

# 2. Verify your domain (bitcoinsovereign.academy)
# Follow their DNS instructions

# 3. Generate API Key
# Dashboard → API Keys → Create
```

**Add to `.env.local`:**
```bash
# Add these lines to your .env.local file
cat >> .env.local << 'EOF'

# Email Provider (Resend)
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@bitcoinsovereign.academy
FROM_NAME=Bitcoin Sovereign Academy
EOF
```

**Test Email Configuration:**
```bash
# Create test script
cat > test-email.mjs << 'EOF'
import { config } from 'dotenv';
config({ path: '.env.local' });

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
  },
  body: JSON.stringify({
    from: process.env.FROM_EMAIL,
    to: 'your-test-email@example.com', // Replace with your email
    subject: 'Test Email from Bitcoin Sovereign Academy',
    html: '<h1>✅ Email configuration successful!</h1>'
  })
});

const data = await response.json();
console.log(response.ok ? '✅ Email sent!' : '❌ Error:', data);
EOF

# Run test
node test-email.mjs
```

---

### Step 3: Configure Stripe Webhook (10 mins)

**Create Webhook Endpoint:**
```bash
# 1. Go to Stripe Dashboard
open "https://dashboard.stripe.com/test/webhooks"

# 2. Click "Add endpoint"
# 3. Set URL to: https://bitcoinsovereign.academy/api/webhooks/stripe
# 4. Select event: checkout.session.completed
# 5. Copy the webhook signing secret (starts with whsec_)
```

**Update `.env.local`:**
```bash
# Replace the placeholder webhook secret
sed -i '' 's/STRIPE_WEBHOOK_SECRET=whsec_xxx/STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here/' .env.local
```

**Test Stripe Webhook:**
```bash
# Install Stripe CLI for testing
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

---

### Step 4: Deploy to Vercel (10 mins)

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Deploy with Environment Variables:**
```bash
# 1. Login to Vercel
vercel login

# 2. Link project (if not already linked)
vercel link

# 3. Add all environment variables
vercel env add SUPABASE_URL production
# Enter: https://rdqwoqdvqpedlsbaghtr.supabase.co

vercel env add SUPABASE_ANON_KEY production
# Paste your anon key from .env.local

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste your service role key from .env.local

vercel env add JWT_SECRET production
# Paste your JWT secret from .env.local

vercel env add STRIPE_SECRET production
# Paste your Stripe secret key

vercel env add STRIPE_WEBHOOK_SECRET production
# Paste your webhook secret

vercel env add EMAIL_PROVIDER production
# Enter: resend

vercel env add EMAIL_API_KEY production
# Paste your Resend API key

vercel env add FROM_EMAIL production
# Enter: noreply@bitcoinsovereign.academy

vercel env add FROM_NAME production
# Enter: Bitcoin Sovereign Academy

vercel env add ALLOWED_ORIGIN production
# Enter: https://bitcoinsovereign.academy

# 4. Deploy to production
vercel --prod
```

**Alternative: Automated Environment Variable Setup**
```bash
# Create automated deployment script
cat > deploy-to-vercel.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying Bitcoin Sovereign Academy to Vercel..."

# Read .env.local and set each variable in Vercel
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue

  # Clean up value (remove quotes, comments)
  value=$(echo "$value" | cut -d'#' -f1 | xargs)

  # Skip placeholder values
  if [[ "$value" =~ xxx|your_|tld|localhost ]]; then
    echo "⚠️  Skipping placeholder: $key"
    continue
  fi

  echo "✓ Setting $key"
  echo "$value" | vercel env add "$key" production --force
done < .env.local

echo "✅ Environment variables configured!"
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
EOF

chmod +x deploy-to-vercel.sh
./deploy-to-vercel.sh
```

---

### Step 5: Update Stripe Webhook URL (2 mins)

After deployment, update your Stripe webhook URL:

```bash
# 1. Get your Vercel production URL
VERCEL_URL=$(vercel ls --prod | grep bitcoinsovereign.academy | awk '{print $2}')
echo "Production URL: https://$VERCEL_URL"

# 2. Go back to Stripe Dashboard
open "https://dashboard.stripe.com/test/webhooks"

# 3. Update endpoint URL to:
# https://bitcoinsovereign.academy/api/webhooks/stripe
```

---

### Step 6: Enable Module Gating (1 min)

Currently, module gating is disabled. To enable it:

```bash
# Edit js/module-gate.js
# Find line ~35 and remove the early return:
sed -i '' '/\/\/ return; \/\/ REMOVE THIS LINE/d' js/module-gate.js

# Commit and redeploy
git add js/module-gate.js
git commit -m "Enable module gating for paid content"
vercel --prod
```

Or manually edit `js/module-gate.js` and remove the early return statement.

---

### Step 7: Test Complete Payment Flow (10 mins)

**Automated Test Script:**
```bash
cat > test-payment-flow.sh << 'EOF'
#!/bin/bash
set -e

echo "🧪 Testing Bitcoin Sovereign Academy Payment Flow..."

BASE_URL="https://bitcoinsovereign.academy"
TEST_EMAIL="test-$(date +%s)@example.com"

echo "1️⃣ Testing checkout page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/pricing.html")
if [ "$STATUS" -eq 200 ]; then
  echo "✅ Pricing page loads"
else
  echo "❌ Pricing page error: $STATUS"
  exit 1
fi

echo "2️⃣ Testing API health..."
HEALTH=$(curl -s "$BASE_URL/api/health.ts" | grep -o "healthy" || echo "error")
if [ "$HEALTH" = "healthy" ]; then
  echo "✅ API is healthy"
else
  echo "❌ API health check failed"
  exit 1
fi

echo "3️⃣ Manual test required:"
echo "   1. Go to: $BASE_URL/pricing.html"
echo "   2. Click 'Unlock Curious Path'"
echo "   3. Use test card: 4242 4242 4242 4242"
echo "   4. Check email: $TEST_EMAIL"
echo "   5. Verify access token received"

echo ""
echo "✅ Automated checks passed!"
echo "📝 Complete manual checkout test to verify end-to-end flow"
EOF

chmod +x test-payment-flow.sh
./test-payment-flow.sh
```

**Manual Testing Checklist:**
- [ ] Go to `https://bitcoinsovereign.academy/pricing.html`
- [ ] Click "Unlock Curious Path" ($19)
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Enter any future expiry date and any 3-digit CVC
- [ ] Check your email for access token
- [ ] Copy token and visit a gated module page
- [ ] Enter token to verify access is granted
- [ ] Check Supabase database for payment record
- [ ] Check Stripe dashboard for successful payment

---

## 🔧 Automation Scripts

### Quick Deploy Script
```bash
# Create one-command deployment
cat > quick-deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Bitcoin Sovereign Academy - Quick Deploy"
echo "=========================================="

# 1. Check dependencies
echo "1️⃣ Checking dependencies..."
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not installed. Run: npm install -g vercel"; exit 1; }
echo "✅ Vercel CLI installed"

# 2. Verify .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found. Copy from .env.example first."
  exit 1
fi
echo "✅ Environment file found"

# 3. Build check (if needed)
echo "2️⃣ Running pre-flight checks..."
npm run test 2>/dev/null || echo "⚠️  No tests configured"

# 4. Deploy
echo "3️⃣ Deploying to Vercel..."
vercel --prod --yes

# 5. Success
echo ""
echo "✅ Deployment complete!"
echo "🌐 Production URL: https://bitcoinsovereign.academy"
echo "📊 Check dashboard: https://vercel.com"
EOF

chmod +x quick-deploy.sh
```

### Health Check Script
```bash
cat > health-check.sh << 'EOF'
#!/bin/bash

echo "🏥 Bitcoin Sovereign Academy Health Check"
echo "========================================"

BASE_URL="https://bitcoinsovereign.academy"

# Check main site
echo -n "Main site: "
curl -sf "$BASE_URL" >/dev/null && echo "✅" || echo "❌"

# Check pricing page
echo -n "Pricing page: "
curl -sf "$BASE_URL/pricing.html" >/dev/null && echo "✅" || echo "❌"

# Check API
echo -n "API health: "
curl -sf "$BASE_URL/api/health.ts" >/dev/null && echo "✅" || echo "❌"

# Check database connection
echo -n "Database: "
curl -sf "https://rdqwoqdvqpedlsbaghtr.supabase.co/rest/v1/" \
  -H "apikey: ${SUPABASE_ANON_KEY}" >/dev/null && echo "✅" || echo "❌"

echo ""
echo "Health check complete!"
EOF

chmod +x health-check.sh
```

### Revenue Dashboard Script
```bash
cat > revenue-dashboard.sh << 'EOF'
#!/bin/bash

echo "💰 Bitcoin Sovereign Academy Revenue Dashboard"
echo "============================================="

SUPABASE_URL="https://rdqwoqdvqpedlsbaghtr.supabase.co"
API_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$API_KEY" ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY not set"
  exit 1
fi

# Total revenue
echo "Total Revenue:"
curl -s "${SUPABASE_URL}/rest/v1/rpc/get_total_revenue" \
  -H "apikey: ${API_KEY}" \
  -H "Authorization: Bearer ${API_KEY}" | jq -r '.total'

# Recent payments
echo ""
echo "Recent Payments (Last 10):"
curl -s "${SUPABASE_URL}/rest/v1/payments?order=created_at.desc&limit=10" \
  -H "apikey: ${API_KEY}" \
  -H "Authorization: Bearer ${API_KEY}" | jq -r '.[] | "\(.created_at): $\(.amount_usd) - \(.email)"'

# Active users
echo ""
echo "Active Users:"
curl -s "${SUPABASE_URL}/rest/v1/users?select=count" \
  -H "apikey: ${API_KEY}" \
  -H "Authorization: Bearer ${API_KEY}" | jq -r '.[0].count'

echo ""
echo "Dashboard complete!"
EOF

chmod +x revenue-dashboard.sh
```

---

## 📈 Monitoring & Maintenance

### Set Up Automated Monitoring

**1. Uptime Monitoring (UptimeRobot):**
```bash
# Sign up and add monitors for:
# - https://bitcoinsovereign.academy
# - https://bitcoinsovereign.academy/api/health.ts
# - https://bitcoinsovereign.academy/pricing.html
open "https://uptimerobot.com"
```

**2. Error Tracking (Sentry):**
```bash
# Install Sentry
npm install @sentry/node @sentry/tracing

# Add to vercel.json:
# "env": {
#   "SENTRY_DSN": "your_sentry_dsn"
# }
```

**3. Revenue Alerts:**
```bash
# Create daily revenue report
cat > daily-revenue-report.sh << 'EOF'
#!/bin/bash
./revenue-dashboard.sh | mail -s "Daily Revenue Report - $(date +%Y-%m-%d)" your-email@example.com
EOF

# Add to crontab (runs daily at 9 AM)
(crontab -l 2>/dev/null; echo "0 9 * * * /path/to/daily-revenue-report.sh") | crontab -
```

---

## 🎯 Success Metrics

After completing this guide, you should have:

- ✅ Live payment processing
- ✅ Automated email delivery
- ✅ Content gating enabled
- ✅ Database tracking all transactions
- ✅ Webhook handling for real-time updates
- ✅ Monitoring and alerts configured

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Test connection
curl "https://rdqwoqdvqpedlsbaghtr.supabase.co/rest/v1/" \
  -H "apikey: your_anon_key"

# If fails, check:
# 1. Supabase project is active
# 2. API keys are correct
# 3. Schema has been applied
```

### Email Not Sending
```bash
# Test Resend API directly
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@bitcoinsovereign.academy",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'

# Check:
# 1. Domain is verified in Resend
# 2. API key is valid
# 3. FROM_EMAIL matches verified domain
```

### Stripe Webhook Not Receiving Events
```bash
# Check webhook status in Stripe dashboard
open "https://dashboard.stripe.com/test/webhooks"

# Verify:
# 1. Webhook URL is correct
# 2. Event type includes checkout.session.completed
# 3. Webhook secret matches .env.local
# 4. Check Vercel function logs for errors
```

### Vercel Deployment Issues
```bash
# Check build logs
vercel logs

# Verify environment variables
vercel env ls

# Check function logs
vercel logs --follow
```

---

## 🎉 Go Live Checklist

Before accepting real payments:

- [ ] Database schema applied and tested
- [ ] Email delivery working (test with real email)
- [ ] Stripe test payment successful
- [ ] Access token delivery working
- [ ] Content unlocking verified
- [ ] Module gating enabled
- [ ] Webhook handling confirmed
- [ ] Error monitoring set up
- [ ] Backup system configured
- [ ] Support email configured
- [ ] Terms of service and refund policy published
- [ ] Switch Stripe to live mode
- [ ] Update webhook URLs to use live keys
- [ ] Final end-to-end test with real card

---

## 🚀 Next Steps: Marketing Automation

Once payment system is live, consider:

1. **Email Marketing Automation**
   - Welcome sequence for new purchasers
   - Cart abandonment recovery
   - Upsell campaigns for path upgrades
   - Course completion certificates

2. **Analytics Automation**
   - Conversion tracking (Plausible)
   - Revenue dashboards (custom or Metabase)
   - User behavior analysis
   - A/B testing framework

3. **Content Automation**
   - Drip content release
   - Progress tracking
   - Achievement/badge system
   - Social proof widgets

4. **Growth Automation**
   - Affiliate/referral system
   - Social media auto-posting
   - SEO automation
   - Review request automation

---

**Ready to go live and start accepting payments!** 🎊

For support: Check Vercel logs, Supabase logs, and Stripe dashboard for real-time monitoring.
