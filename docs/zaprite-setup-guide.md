# Zaprite Integration Setup Guide
## Bitcoin Sovereign Academy - Step-by-Step Implementation

---

## 📋 Checklist: What We've Built

### ✅ Completed
- [x] Pricing page with 4 tiers (`/pricing.html`)
- [x] Serverless API for order creation (`/api/create-order.js`)
- [x] Webhook handler for payment verification (`/api/webhooks/zaprite.js`)
- [x] Client-side access control system (`/js/payment-access-control.js`)
- [x] Payment success celebration page (`/payment/success.html`)
- [x] Complete architecture documentation (`/docs/zaprite-integration-architecture.md`)

### 🔄 Next Steps
- [ ] Set up Zaprite account
- [ ] Configure environment variables
- [ ] Test with Zaprite sandbox/test keys
- [ ] Deploy to Vercel
- [ ] Add payment buttons to locked demos
- [ ] Beta test with real users

---

## 🚀 Quick Start: Get Running in 30 Minutes

### Step 1: Create Zaprite Account (5 min)

1. Go to [app.zaprite.com](https://app.zaprite.com)
2. Sign up for a free 30-day trial
3. Complete account setup
4. Connect your Bitcoin/Lightning wallet (or use Zaprite's hosted option)

### Step 2: Get API Credentials (3 min)

1. In Zaprite dashboard, go to **Settings → API**
2. Click "**Request API Access**" (it's in beta, should be approved quickly)
3. Once approved, generate your **API Key**
4. Copy and save it securely

### Step 3: Configure Webhook (3 min)

1. Still in **Settings → API**
2. Add webhook URL: `https://bitcoinsovereign.academy/api/webhooks/zaprite`
3. Copy the **Webhook Secret** that Zaprite generates
4. Select events to listen for:
   - [x] `order.paid`
   - [x] `order.expired`
   - [x] `order.cancelled`

### Step 4: Set Environment Variables in Vercel (5 min)

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:

```bash
ZAPRITE_API_KEY=zap_live_xxxxxxxxxxxxx
ZAPRITE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
JWT_SECRET=generate_random_string_here
BASE_URL=https://bitcoinsovereign.academy
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
# Run this command to generate a secure random secret:
openssl rand -base64 32
```

### Step 5: Deploy to Vercel (2 min)

```bash
cd /Users/dalia/projects/bitcoin-sovereign-academy

# Make sure all files are committed
git add .
git commit -m "Add Zaprite payment integration"
git push origin main

# Vercel will auto-deploy
```

### Step 6: Test the Integration (10 min)

1. Visit `https://bitcoinsovereign.academy/pricing`
2. Click "**Unlock Curious Path**" button
3. Should redirect to Zaprite checkout
4. Use test payment method (if Zaprite provides test mode)
5. After payment, should redirect to `/payment/success`
6. Check that content is unlocked

---

## 🔧 Development Workflow

### Local Testing (Optional)

If you want to test locally before deploying:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create local environment file:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Run local development server:**
   ```bash
   vercel dev
   ```

4. **Access locally:**
   - Pricing page: `http://localhost:3000/pricing`
   - Test order creation: `http://localhost:3000/api/create-order`

### Testing Webhooks Locally

Zaprite can only send webhooks to public URLs. To test locally:

1. **Use ngrok to expose local server:**
   ```bash
   ngrok http 3000
   ```

2. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

3. **Update Zaprite webhook URL temporarily:**
   - Go to Zaprite Settings → API
   - Change webhook URL to: `https://abc123.ngrok.io/api/webhooks/zaprite`

4. **Test payment and watch console**

---

## 📱 Adding Payment Buttons to Locked Demos

### Option A: Add to Individual Demo Pages

Add this to any locked demo HTML file:

```html
<!-- At the top of the page, before content -->
<div id="premium-gate" style="display: none;">
  <div style="
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  ">
    <div style="text-align: center; padding: 3rem; background: #1a1a1a; border-radius: 20px; max-width: 500px;">
      <h2 style="font-size: 2rem; color: #f7931a; margin-bottom: 1rem;">🔒 Premium Demo</h2>
      <p style="color: #b3b3b3; margin-bottom: 2rem;">
        This demo is part of the Curious Path tier.
      </p>
      <a href="/pricing" style="
        background: linear-gradient(135deg, #f7931a, #ff8c00);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
        display: inline-block;
      ">
        View Pricing & Unlock
      </a>
    </div>
  </div>
</div>

<!-- Include access control script -->
<script src="/js/payment-access-control.js"></script>
<script>
  // Check if user has access to this demo
  const demoId = 'your-demo-id-here'; // e.g., 'hash-puzzle-game'

  if (!AccessControl.hasAccess(demoId)) {
    document.getElementById('premium-gate').style.display = 'flex';
  }
</script>
```

### Option B: Use data-premium Attribute

Simpler approach - just add the attribute:

```html
<!-- Wrap your demo content -->
<div data-premium="your-demo-id-here">
  <!-- Your demo content here -->
  <h1>Premium Demo</h1>
  <p>This content will be locked/unlocked automatically</p>
</div>

<!-- Include access control script -->
<script src="/js/payment-access-control.js"></script>
```

The access control script will automatically:
- Check if user has access
- Show lock overlay if they don't
- Unlock content if they do

---

## 🧪 Testing Checklist

### Before Launch

- [ ] Test all 4 pricing tier buttons
- [ ] Verify order creation API works
- [ ] Test successful payment flow
- [ ] Verify webhook receives payment notifications
- [ ] Confirm content unlocks after payment
- [ ] Test payment success page displays correctly
- [ ] Verify localStorage stores access tokens
- [ ] Test access control on locked demos
- [ ] Check mobile responsiveness
- [ ] Test with different browsers

### After Launch

- [ ] Monitor Vercel function logs
- [ ] Check Zaprite dashboard for orders
- [ ] Verify webhook delivery success rate
- [ ] Track conversion rates by tier
- [ ] Gather user feedback

---

## 🐛 Troubleshooting

### Problem: "Payment system not configured" error

**Solution:**
- Check that `ZAPRITE_API_KEY` is set in Vercel environment variables
- Ensure you're using the live API key, not test key
- Redeploy after adding environment variables

### Problem: Webhooks not being received

**Solution:**
- Verify webhook URL in Zaprite dashboard is correct
- Check Zaprite webhook delivery logs
- Ensure `/api/webhooks/zaprite.js` file is deployed
- Test webhook manually using curl:

```bash
curl -X POST https://bitcoinsovereign.academy/api/webhooks/zaprite \
  -H "Content-Type: application/json" \
  -H "x-zaprite-signature: test" \
  -d '{"event":"order.paid","order_id":"test123"}'
```

### Problem: Content not unlocking after payment

**Solution:**
- Open browser console and check for errors
- Verify access token is stored in localStorage:
  ```javascript
  console.log(localStorage.getItem('bsa_access'));
  ```
- Check that demo ID matches product tier configuration
- Clear localStorage and try again:
  ```javascript
  localStorage.clear();
  ```

### Problem: Redirect after payment doesn't work

**Solution:**
- Verify `BASE_URL` environment variable is correct
- Check that success URL in order creation includes `{orderId}` placeholder
- Ensure `/payment/success.html` file exists and is accessible

---

## 💰 Pricing Strategy Tips

### Recommended Starting Prices

Based on market research and competitor analysis:

| Tier | Suggested Price | Rationale |
|------|----------------|-----------|
| Curious Path | $19 (50k sats) | Low barrier to entry, beginner-friendly |
| Builder Path | $39 (100k sats) | 2x value, serious learners |
| Sovereign Path | $79 (200k sats) | Premium tier, advanced users |
| Full Academy | $149 (400k sats) | Best value, committed students |

### A/B Testing Ideas

1. **Test price points:**
   - Curious: $19 vs $29
   - Full Academy: $149 vs $199

2. **Test messaging:**
   - "Lifetime Access" vs "Pay Once, Own Forever"
   - "Unlock Premium" vs "Start Learning"

3. **Test CTAs:**
   - Lightning bolt emoji vs lock emoji
   - "Get Access" vs "Unlock Now"

---

## 📊 Analytics & Metrics

### Key Metrics to Track

1. **Conversion Rate:**
   - Visits to pricing page → Clicks on pricing tier
   - Clicks → Successful payments

2. **Revenue Metrics:**
   - Total revenue by tier
   - Average transaction value
   - Revenue per visitor

3. **User Behavior:**
   - Time from visit to purchase
   - Most popular tier
   - Upgrade rate (Curious → Builder → Sovereign)

### Plausible Analytics Events

Already configured in platform. Track these custom events:

```javascript
// On pricing page view
plausible('Pricing Page View');

// On tier button click
plausible('Pricing Tier Click', { props: { tier: 'curious_path' } });

// On successful payment
plausible('Payment Success', {
  props: {
    tier: 'curious_path',
    amount: 19,
    method: 'lightning'
  }
});
```

---

## 🔐 Security Best Practices

### ✅ Implemented

- [x] Webhook signature verification (HMAC SHA256)
- [x] Environment variables for secrets (not in code)
- [x] HTTPS-only communication
- [x] Payment status double-check with Zaprite API
- [x] Timing-safe signature comparison

### 🔄 Consider Adding

- [ ] Rate limiting on API endpoints
- [ ] IP allowlisting for webhooks
- [ ] Browser fingerprinting to prevent token sharing
- [ ] Access token expiry (currently lifetime)
- [ ] Database for audit trail (currently localStorage only)

---

## 📚 Additional Resources

### Zaprite Documentation
- API Docs: https://api.zaprite.com
- Help Center: https://help.zaprite.com
- Blog: https://blog.zaprite.com

### Bitcoin/Lightning
- Learn Lightning: https://lightning.network
- Lightning Wallets: https://www.walletofsatoshi.com, https://phoenix.acinq.co

### Vercel Deployment
- Serverless Functions: https://vercel.com/docs/concepts/functions/serverless-functions
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables

---

## 🎉 Launch Day Checklist

### 1 Week Before
- [ ] Complete all testing
- [ ] Set up production Zaprite account
- [ ] Configure production environment variables
- [ ] Deploy final version to Vercel
- [ ] Test with real small payment ($1 test)

### 1 Day Before
- [ ] Announce launch on social media
- [ ] Prepare launch email (if you have list)
- [ ] Have support ready for questions
- [ ] Monitor systems are ready

### Launch Day
- [ ] Push pricing page live
- [ ] Monitor Vercel logs
- [ ] Watch Zaprite dashboard
- [ ] Respond to user feedback quickly
- [ ] Celebrate first payment! 🎉

### Week 1 Post-Launch
- [ ] Analyze conversion rates
- [ ] Gather user feedback
- [ ] Fix any issues
- [ ] Optimize pricing if needed
- [ ] Plan marketing strategy

---

## 📞 Support & Questions

If you run into issues:

1. **Check Vercel logs:** `vercel logs --follow`
2. **Check Zaprite delivery logs:** Settings → API → Webhooks
3. **Test API manually:** Use Postman or curl
4. **Review this guide:** Many common issues are covered

---

**You're ready to launch! 🚀**

Remember: Start with test payments, monitor closely, and iterate based on user feedback.
