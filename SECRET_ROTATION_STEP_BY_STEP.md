# 🔐 Complete Secret Rotation Guide - Step by Step

This guide will walk you through **safely rotating all secrets** without breaking your platform.

## ⚠️ Pre-Rotation Checklist

Before starting, ensure you have:
- [ ] Access to Vercel dashboard
- [ ] Access to Zaprite dashboard
- [ ] Access to Stripe dashboard (if using)
- [ ] Access to BTCPay dashboard (if using)
- [ ] Access to Supabase dashboard (if using)
- [ ] Backup of current environment variables (screenshot or export)
- [ ] Low-traffic window scheduled (for JWT_SECRET rotation)

---

## 📋 Step-by-Step Rotation Process

### PHASE 1: Prepare New Secrets (Do This First)

#### Step 1.1: Generate New JWT_SECRET
```bash
# Open terminal and run:
openssl rand -base64 64

# Copy the output - you'll need this later
# Example output: xK9mP2qR7vT4wY8zA1bC3dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5zA6bC7dE8f
```

**Save this securely** - you'll add it to Vercel in Phase 2.

---

#### Step 1.2: Generate New Zaprite Webhook Secret
1. Go to: https://zaprite.com/dashboard (or your Zaprite dashboard)
2. Navigate to: **Settings** → **Webhooks** (or **API** → **Webhooks**)
3. Find your existing webhook endpoint
4. Click **"Regenerate Secret"** or **"Create New Webhook"**
5. **Copy the new webhook secret** - save it securely

**Note:** If you create a new webhook, you'll need to update the webhook URL in Zaprite to point to:
```
https://bitcoinsovereign.academy/api/webhooks/zaprite
```

---

#### Step 1.3: Generate New Zaprite API Key
1. In Zaprite dashboard: **Settings** → **API Keys** (or **API** → **API Keys**)
2. Click **"Create New API Key"** or **"Generate New Key"**
3. Give it a name: `bitcoin-sovereign-academy-2025`
4. **Copy the new API key** - save it securely
5. **Don't delete the old key yet** - we'll do that after testing

---

#### Step 1.4: Generate New Stripe Secrets (If Using Stripe)
1. Go to: https://dashboard.stripe.com
2. Navigate to: **Developers** → **API Keys**
3. **Create New Secret Key:**
   - Click **"Create secret key"**
   - Name it: `bitcoin-sovereign-academy-2025`
   - **Copy the new secret key** - save it securely
4. **Generate New Webhook Secret:**
   - Go to: **Developers** → **Webhooks**
   - Click on your webhook endpoint
   - Click **"Reveal"** next to "Signing secret"
   - Or create new webhook endpoint
   - **Copy the new signing secret** - save it securely

---

#### Step 1.5: Generate New BTCPay Secrets (If Using BTCPay)
1. Go to your BTCPay Server dashboard
2. Navigate to: **Account** → **API Keys**
3. Click **"Create New API Key"**
4. Give it permissions: `btcpay.store.canmodifyinvoices`, `btcpay.store.webhooks.canmodifywebhooks`
5. **Copy the new API key** - save it securely
6. **Generate New Webhook Secret:**
   - Go to: **Store** → **Webhooks**
   - Create new webhook or edit existing
   - **Copy the webhook secret** - save it securely

---

#### Step 1.6: Generate New Supabase Service Role Key (If Using)
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **API**
4. Scroll to **"Service Role"** section
5. Click **"Reset Service Role Key"** or **"Reveal"** → **"Reset"**
6. **Copy the new service role key** - save it securely
7. **⚠️ WARNING:** This will invalidate the old key immediately

---

#### Step 1.7: Generate New Email API Key (If Using Email Service)
**For Resend:**
1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name it: `bitcoin-sovereign-academy-2025`
4. **Copy the new API key** - save it securely

**For SendGrid:**
1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **"Create API Key"**
3. Name it: `bitcoin-sovereign-academy-2025`
4. **Copy the new API key** - save it securely

---

### PHASE 2: Update Vercel Environment Variables

#### Step 2.1: Access Vercel Environment Variables
1. Go to: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/settings/environment-variables
2. You should see all your environment variables listed

---

#### Step 2.2: Rotate JWT_SECRET (CRITICAL - Do This First)

**⚠️ IMPORTANT:** This will invalidate all existing access tokens. Plan accordingly.

1. **Find `JWT_SECRET` in the list**
2. **Click the three dots (⋯) next to it** → **"Delete"**
   - Or click **"Edit"** and replace the value
3. **Click "Add New"** (if you deleted it)
4. **Enter:**
   - **Key:** `JWT_SECRET`
   - **Value:** Paste the new secret you generated in Step 1.1
   - **Environment:** Select **Production**, **Preview**, and **Development**
5. **Click "Save"**

**⚠️ After this step, all existing access tokens will be invalid.**
- Users will need new tokens
- Test payments will need to be completed again
- This is expected and secure

---

#### Step 2.3: Rotate ZAPRITE_WEBHOOK_SECRET

1. **Find `ZAPRITE_WEBHOOK_SECRET` in the list**
2. **Click "Edit"** (or delete and recreate)
3. **Replace the value** with the new webhook secret from Step 1.2
4. **Ensure all environments are selected**
5. **Click "Save"**

---

#### Step 2.4: Rotate ZAPRITE_API_KEY

1. **Find `ZAPRITE_API_KEY` in the list**
2. **Click "Edit"**
3. **Replace the value** with the new API key from Step 1.3
4. **Ensure all environments are selected**
5. **Click "Save"**

**⚠️ Don't delete the old key in Zaprite yet** - we'll test first, then delete it.

---

#### Step 2.5: Rotate Stripe Secrets (If Using Stripe)

**STRIPE_SECRET_KEY:**
1. **Find `STRIPE_SECRET_KEY` in the list**
2. **Click "Edit"**
3. **Replace** with new secret key from Step 1.4
4. **Save**

**STRIPE_WEBHOOK_SECRET:**
1. **Find `STRIPE_WEBHOOK_SECRET` in the list**
2. **Click "Edit"**
3. **Replace** with new webhook secret from Step 1.4
4. **Save**

---

#### Step 2.6: Rotate BTCPay Secrets (If Using BTCPay)

**BTCPAY_API_KEY:**
1. **Find `BTCPAY_API_KEY` in the list**
2. **Click "Edit"**
3. **Replace** with new API key from Step 1.5
4. **Save**

**BTCPAY_WEBHOOK_SECRET:**
1. **Find `BTCPAY_WEBHOOK_SECRET` in the list**
2. **Click "Edit"**
3. **Replace** with new webhook secret from Step 1.5
4. **Save**

---

#### Step 2.7: Rotate Supabase Service Role Key (If Using)

1. **Find `SUPABASE_SERVICE_ROLE_KEY` in the list**
2. **Click "Edit"**
3. **Replace** with new service role key from Step 1.6
4. **Save**

**⚠️ Note:** The old key is already invalid in Supabase, so this must work immediately.

---

#### Step 2.8: Rotate Email API Key (If Using)

1. **Find `EMAIL_API_KEY` in the list**
2. **Click "Edit"**
3. **Replace** with new API key from Step 1.7
4. **Save**

---

### PHASE 3: Redeploy and Test

#### Step 3.1: Trigger Redeployment

**Option A: Via Git (Recommended)**
```bash
# In your terminal:
cd /Users/dalia/projects/bitcoin-sovereign-academy
git commit --allow-empty -m "Rotate secrets - security update"
git push origin main
```

**Option B: Via Vercel Dashboard**
1. Go to: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/deployments
2. Click **"Redeploy"** on the latest deployment
3. Select **"Use existing Build Cache"** = No (to ensure fresh build)
4. Click **"Redeploy"**

---

#### Step 3.2: Wait for Deployment

1. Monitor deployment in Vercel dashboard
2. Wait for **"Ready"** status (usually 1-3 minutes)
3. Check for any build errors

---

#### Step 3.3: Test Payment Flow (CRITICAL)

**Test Zaprite Payment:**
1. Go to: https://bitcoinsovereign.academy/pricing.html
2. Click **"Unlock Curious Path"** ($19)
3. **Expected:** Should redirect to Zaprite checkout
4. **If it fails:** Check browser console for errors
5. **Complete a test payment** (use Zaprite test mode)
6. **Expected:** Should redirect to success page
7. **Check:** Success page shows product info

**Test Stripe Payment (If Using):**
1. Go to checkout page
2. Select Stripe as payment method
3. Complete test payment (card: 4242 4242 4242 4242)
4. **Expected:** Should redirect to success page

---

#### Step 3.4: Test Webhook Endpoints

**Test Zaprite Webhook:**
1. In Zaprite dashboard, go to webhook settings
2. Click **"Test Webhook"** or **"Send Test Event"**
3. **Expected:** Should receive 200 OK response
4. **Check Vercel logs:**
   - Go to: Vercel Dashboard → Your Project → Functions → `/api/webhooks/zaprite`
   - Check for successful webhook processing
   - Look for: "Payment verified" or "Access token email sent"

**Test Stripe Webhook (If Using):**
1. In Stripe dashboard → Webhooks
2. Click **"Send test webhook"**
3. Select event: `checkout.session.completed`
4. **Expected:** Should receive 200 OK
5. **Check Vercel logs** for successful processing

---

#### Step 3.5: Test Access Token Generation

1. Complete a test payment
2. **Check email** for access token (if email is configured)
3. **Or check Vercel logs** for token generation
4. **Verify token format:**
   - Should be a JWT (3 parts separated by dots)
   - Should be stored in localStorage after payment success

---

#### Step 3.6: Test Database Access (If Using Supabase)

1. Go to a page that uses database
2. **Check browser console** for errors
3. **Check Vercel logs** for database connection errors
4. **Expected:** No errors, data loads correctly

---

### PHASE 4: Clean Up Old Secrets

**⚠️ Only do this after confirming everything works!**

#### Step 4.1: Delete Old Zaprite API Key
1. Go to Zaprite dashboard → API Keys
2. Find the **old API key** (the one you replaced)
3. Click **"Delete"** or **"Revoke"**
4. **Confirm deletion**

---

#### Step 4.2: Delete Old Stripe Secret Key (If Using)
1. Go to Stripe dashboard → API Keys
2. Find the **old secret key**
3. Click **"Reveal"** → **"Revoke"**
4. **Confirm revocation**

---

#### Step 4.3: Delete Old BTCPay API Key (If Using)
1. Go to BTCPay dashboard → API Keys
2. Find the **old API key**
3. Click **"Delete"**
4. **Confirm deletion**

---

#### Step 4.4: Delete Old Email API Key (If Using)
**For Resend:**
1. Go to Resend dashboard → API Keys
2. Find the **old API key**
3. Click **"Delete"**
4. **Confirm deletion**

**For SendGrid:**
1. Go to SendGrid dashboard → API Keys
2. Find the **old API key**
3. Click **"Delete"**
4. **Confirm deletion**

---

### PHASE 5: Final Verification

#### Step 5.1: Complete End-to-End Test

1. **Test Full Payment Flow:**
   - [ ] Visit pricing page
   - [ ] Click "Unlock" button
   - [ ] Redirects to payment provider
   - [ ] Complete test payment
   - [ ] Redirects to success page
   - [ ] Success page displays correctly
   - [ ] Access token generated (check logs)
   - [ ] Email sent (if configured)

2. **Test Webhook Processing:**
   - [ ] Webhook receives payment confirmation
   - [ ] Webhook processes successfully
   - [ ] Access token generated
   - [ ] No errors in logs

3. **Test Access Control:**
   - [ ] Access token stored in localStorage
   - [ ] Paid content accessible
   - [ ] Unpaid content still gated

---

#### Step 5.2: Check Vercel Logs

1. Go to: Vercel Dashboard → Your Project → **Logs**
2. **Look for:**
   - ✅ "Order created" messages
   - ✅ "Payment verified" messages
   - ✅ "Access token email sent" messages
   - ❌ No authentication errors
   - ❌ No webhook signature errors
   - ❌ No API key errors

---

#### Step 5.3: Security Verification

1. **Verify JWT_SECRET is set:**
   ```bash
   # Check Vercel environment variables
   # JWT_SECRET should be 64+ characters
   # Should NOT be "change_me_in_production"
   ```

2. **Verify Webhook Secrets are set:**
   - ZAPRITE_WEBHOOK_SECRET should be set
   - STRIPE_WEBHOOK_SECRET should be set (if using)
   - BTCPAY_WEBHOOK_SECRET should be set (if using)

3. **Verify API Keys are set:**
   - ZAPRITE_API_KEY should be set
   - STRIPE_SECRET_KEY should be set (if using)
   - BTCPAY_API_KEY should be set (if using)

---

## 🚨 Troubleshooting

### Issue: Payment Redirect Fails
**Symptoms:** Button doesn't redirect, console shows error

**Fix:**
1. Check browser console for specific error
2. Verify ZAPRITE_API_KEY is correct in Vercel
3. Check Vercel function logs for `/api/create-order`
4. Verify Zaprite API key has correct permissions

---

### Issue: Webhook Not Receiving Events
**Symptoms:** Payment completes but webhook doesn't fire

**Fix:**
1. Verify webhook URL in Zaprite: `https://bitcoinsovereign.academy/api/webhooks/zaprite`
2. Check webhook secret matches in Vercel
3. Test webhook manually in Zaprite dashboard
4. Check Vercel logs for webhook endpoint

---

### Issue: Access Token Not Generated
**Symptoms:** Payment succeeds but no token

**Fix:**
1. Check JWT_SECRET is set correctly
2. Check Vercel logs for token generation errors
3. Verify JWT_SECRET is at least 32 characters
4. Check webhook is processing successfully

---

### Issue: Database Connection Fails
**Symptoms:** Database queries fail, errors in logs

**Fix:**
1. Verify SUPABASE_SERVICE_ROLE_KEY is correct
2. Check Supabase dashboard for key status
3. Verify SUPABASE_URL is correct
4. Check network connectivity

---

## ✅ Success Criteria

You'll know everything is working when:

- ✅ Payment flow completes end-to-end
- ✅ Webhooks process successfully
- ✅ Access tokens are generated
- ✅ No errors in Vercel logs
- ✅ No errors in browser console
- ✅ Old secrets are deleted from provider dashboards
- ✅ New secrets are active in Vercel

---

## 📝 Post-Rotation Checklist

- [ ] All new secrets added to Vercel
- [ ] Deployment successful
- [ ] Payment flow tested and working
- [ ] Webhooks tested and working
- [ ] Access tokens generating correctly
- [ ] Old secrets deleted from provider dashboards
- [ ] No errors in logs
- [ ] Documentation updated with rotation date

---

## 🔒 Security Best Practices Going Forward

1. **Rotate JWT_SECRET every 90 days**
2. **Rotate webhook secrets every 180 days**
3. **Rotate API keys every 180 days**
4. **Monitor for unauthorized access**
5. **Never commit secrets to git**
6. **Use different secrets for dev/staging/production**
7. **Document rotation dates**

---

**Last Updated:** January 2025
