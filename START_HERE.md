# 🚀 START HERE - What to Do Next

**Last Updated:** January 2026

## ✅ What's Been Done

1. ✅ **Security Fixes Applied** - Critical vulnerabilities fixed
2. ✅ **Payment System Ready** - Zaprite integration configured
3. ✅ **Environment Variables Guide** - Complete setup instructions created

---

## 🎯 Your Next Steps (In Order)

### STEP 1: Set Up Environment Variables (15 minutes) ⚠️ CRITICAL

**Your payment system won't work without this!**

1. **Get JWT_SECRET:**
   ```bash
   openssl rand -base64 64
   ```
   Copy the output.

2. **Set Up Zaprite:**
   - Go to: https://zaprite.com
   - Get API Key: Settings → API Keys → Create API Key
   - Set Up Webhook: Settings → Webhooks → Create Webhook
     - URL: `https://bitcoinsovereign.academy/api/webhooks/zaprite`
     - Events: `order.paid`, `order.expired`, `order.cancelled`
     - Copy webhook secret

3. **Add to Vercel:**
   - Go to: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/settings/environment-variables
   - Add these 3 variables:
     - `JWT_SECRET` = (from step 1)
     - `ZAPRITE_API_KEY` = (from Zaprite)
     - `ZAPRITE_WEBHOOK_SECRET` = (from Zaprite)
   - Select all environments (Production, Preview, Development)

**📖 Full Guide:** See `VERCEL_ENV_SETUP_COMPLETE.md`

---

### STEP 2: Test Payment Flow (10 minutes)

1. **Deploy:**
   ```bash
   git commit --allow-empty -m "Configure environment variables"
   git push origin main
   ```

2. **Test:**
   - Go to: https://bitcoinsovereign.academy/pricing.html
   - Click "Unlock Curious Path" ($19)
   - Should redirect to Zaprite checkout
   - Complete test payment
   - Should redirect to success page

3. **Check Logs:**
   - Vercel Dashboard → Functions → Check for errors
   - Verify webhook processes payment

**📖 Full Guide:** See `PAYMENT_TESTING_GUIDE.md`

---

### STEP 3: Set Up Database (Optional - 15 minutes)

**Recommended for storing user entitlements and payments.**

1. **Set Up Supabase:**
   - Go to: https://supabase.com
   - Create project
   - Get credentials: Settings → API
   - Copy: Project URL, anon key, service_role key

2. **Add to Vercel:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Set Up Schema:**
   - Run database schema (if exists in `/database/` folder)
   - Or create tables for: users, entitlements, payments

**📖 Full Guide:** See `VERCEL_ENV_SETUP_COMPLETE.md` (Step 3)

---

### STEP 4: Configure Monetization (30 minutes)

**Your current pricing:**
- Curious Path: $19
- Builder Path: $39
- Sovereign Path: $79
- Full Academy: $149

**To add individual modules/demos:**

1. **Edit `pricing.html`:**
   - Add new product to `products` object (line ~615)
   - Add pricing card to HTML
   - Add "Unlock" button with `createOrder('product_id')`

2. **Update `api/create-order.js`:**
   - Add product ID to `validProducts` array (line 27)

3. **Update `js/security-utils.js`:**
   - Add product ID to `validProducts` array (line ~140)

**Example:**
```javascript
// In pricing.html
const products = {
    // ... existing products
    individual_demo: {
        name: 'Individual Demo',
        price: 5,
        sats: 15000,
        currency: 'USD'
    }
};
```

---

### STEP 5: Set Up Email (Optional - 5 minutes)

**Only if you want to email access tokens to users.**

1. **Set Up Resend:**
   - Go to: https://resend.com
   - Create account
   - Get API key

2. **Add to Vercel:**
   - `EMAIL_API_KEY` = (from Resend)
   - `EMAIL_PROVIDER` = `resend`
   - `FROM_EMAIL` = `noreply@bitcoinsovereign.academy`
   - `FROM_NAME` = `Bitcoin Sovereign Academy`

**Note:** Tokens can also be provided via URL, so email is optional.

---

## 📚 Documentation Reference

### Essential Guides:
- **`VERCEL_ENV_SETUP_COMPLETE.md`** - Complete environment variable setup
- **`PAYMENT_TESTING_GUIDE.md`** - How to test payment flow
- **`OPTIMIZED_SECRET_ROTATION.md`** - How to rotate secrets (for future)

### Security Documentation:
- **`SECURITY_AUDIT_REPORT.md`** - Original comprehensive audit
- **`SECURITY_FIXES_2025.md`** - Detailed security fixes applied
- **`SECURITY_IMPLEMENTATION_GUIDE.md`** - Testing & troubleshooting

---

## 🎯 Quick Priority Checklist

### Today (Must Do):
- [ ] Set up Zaprite account
- [ ] Generate JWT_SECRET
- [ ] Add 3 required variables to Vercel
- [ ] Test payment flow

### This Week:
- [ ] Set up Supabase database (recommended)
- [ ] Test webhook processing
- [ ] Configure individual module pricing (if needed)
- [ ] Set up email (optional)

### This Month:
- [ ] Monitor payment processing
- [ ] Review security logs
- [ ] Plan secret rotation (every 90 days)

---

## 🚨 If Something Breaks

### Payment Not Working?
1. Check Vercel environment variables are set
2. Check browser console for errors
3. Check Vercel function logs
4. Verify Zaprite webhook URL is correct

### Webhook Not Processing?
1. Verify `ZAPRITE_WEBHOOK_SECRET` matches in Vercel
2. Check webhook URL in Zaprite dashboard
3. Test webhook manually in Zaprite
4. Check Vercel logs for webhook endpoint

### Access Tokens Not Generated?
1. Verify `JWT_SECRET` is set (must be 32+ characters)
2. Check webhook is processing successfully
3. Check Vercel logs for token generation errors

**📖 Troubleshooting:** See `SECURITY_IMPLEMENTATION_GUIDE.md`

---

## ✅ Success Criteria

You'll know everything is working when:

- ✅ Payment flow completes end-to-end
- ✅ Webhooks process successfully
- ✅ Access tokens are generated
- ✅ No errors in Vercel logs
- ✅ Users can access paid content

---

## 🎉 You're Ready!

Start with **STEP 1** (Environment Variables) - that's the most critical.

Once that's done, your payment system will work and you can start monetizing!

**Questions?** Check the documentation files listed above.

---

**Next Review:** After completing STEP 1-2

---

## 📋 Quick Reference: Existing Variables

**If you already have environment variables in Vercel, see:** `EXISTING_ENV_VARIABLES_GUIDE.md`

**Quick answer:**
- ✅ **Keep NODE_ENV** (Vercel sets it automatically, but keeping it is fine)
- ✅ **Keep BASE_URL** (useful for payment redirects)
- ✅ **Keep ALLOWED_ORIGIN** (useful for CORS)
- ⚠️ **Add JWT_SECRET** (required - doesn't exist yet)
- ⚠️ **Add ZAPRITE_API_KEY** (required - doesn't exist yet)
- ⚠️ **Add ZAPRITE_WEBHOOK_SECRET** (required - doesn't exist yet)
