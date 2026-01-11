# 🚀 Complete Vercel Environment Variables Setup Guide

**Starting from scratch?** This guide will help you set up everything needed to monetize your platform.

## 🎯 Your Monetization Goals

- ✅ Small chunks (individual modules) - reasonable costs
- ✅ Larger chunks (full paths) - appropriate pricing
- ✅ Individual demos - per-demo pricing
- ✅ Payment processing via Zaprite (Bitcoin/Lightning)

---

## 📋 Environment Variables Checklist

### 🔴 REQUIRED - Must Have (Payment System Won't Work Without These)

| Variable | Purpose | How to Get |
|----------|---------|------------|
| **JWT_SECRET** | Generates access tokens for paid content | Generate locally |
| **ZAPRITE_API_KEY** | Creates payment orders | Zaprite dashboard |
| **ZAPRITE_WEBHOOK_SECRET** | Verifies payment confirmations | Zaprite dashboard |

### 🟡 REQUIRED (If Using Database) - Recommended

| Variable | Purpose | How to Get |
|----------|---------|------------|
| **SUPABASE_URL** | Database connection URL | Supabase dashboard |
| **SUPABASE_ANON_KEY** | Public database key | Supabase dashboard |
| **SUPABASE_SERVICE_ROLE_KEY** | Full database access | Supabase dashboard |

### 🟢 OPTIONAL - Nice to Have

| Variable | Purpose | How to Get |
|----------|---------|------------|
| **EMAIL_API_KEY** | Send access tokens via email | Resend/SendGrid |
| **EMAIL_PROVIDER** | Email service (resend/sendgrid) | Set to "resend" |
| **FROM_EMAIL** | Sender email address | Your domain email |
| **FROM_NAME** | Sender name | "Bitcoin Sovereign Academy" |
| **BASE_URL** | Your site URL | "https://bitcoinsovereign.academy" |
| **ALLOWED_ORIGIN** | CORS allowed origin | "https://bitcoinsovereign.academy" |

### 🟦 AUTOMATIC - Set by Vercel (Don't Set Manually)

| Variable | Purpose | Notes |
|----------|---------|-------|
| **NODE_ENV** | Environment type | Automatically set by Vercel (development/preview/production) |
| **VERCEL_URL** | Deployment URL | Automatically set by Vercel for each deployment |

**⚠️ Don't set these manually** - Vercel sets them automatically based on the deployment environment.

---

### 🔵 OPTIONAL - Alternative Payment Methods

| Variable | Purpose | How to Get |
|----------|---------|------------|
| **STRIPE_SECRET_KEY** | Stripe payments (credit cards) | Stripe dashboard |
| **STRIPE_WEBHOOK_SECRET** | Stripe webhook verification | Stripe dashboard |
| **BTCPAY_API_KEY** | BTCPay payments | BTCPay server |
| **BTCPAY_WEBHOOK_SECRET** | BTCPay webhook verification | BTCPay server |
| **BTCPAY_URL** | BTCPay server URL | Your BTCPay server |
| **BTCPAY_STORE_ID** | BTCPay store ID | BTCPay server |

---

## 🚀 Step-by-Step Setup

### STEP 1: Generate JWT_SECRET (2 minutes)

**This is CRITICAL - do this first!**

```bash
# Open terminal and run:
openssl rand -base64 64

# Copy the output - you'll need this!
# Example: xK9mP2qR7vT4wY8zA1bC3dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5zA6bC7dE8f
```

**Save this securely** - you'll add it to Vercel in Step 4.

---

### STEP 2: Set Up Zaprite Account (10 minutes)

**Zaprite is your PRIMARY payment provider for Bitcoin/Lightning payments.**

1. **Sign up for Zaprite:**
   - Go to: https://zaprite.com
   - Create account or sign in

2. **Get API Key:**
   - Go to: **Settings** → **API Keys** (or **API** → **API Keys**)
   - Click **"Create API Key"** or **"Generate New Key"**
   - Name it: `bitcoin-sovereign-academy-production`
   - **Copy the API key** - save it securely

3. **Set Up Webhook:**
   - Go to: **Settings** → **Webhooks** (or **API** → **Webhooks**)
   - Click **"Create Webhook"** or **"Add Webhook"**
   - **Webhook URL:** `https://bitcoinsovereign.academy/api/webhooks/zaprite`
   - **Events:** Select `order.paid`, `order.expired`, `order.cancelled`
   - **Copy the webhook secret** - save it securely

4. **Test Mode (Optional):**
   - Enable test mode to test payments without real money
   - Use test mode for development

**You now have:**
- ✅ ZAPRITE_API_KEY
- ✅ ZAPRITE_WEBHOOK_SECRET

---

### STEP 3: Set Up Supabase (If Using Database) (15 minutes)

**Database is RECOMMENDED for storing user entitlements and payments.**

1. **Sign up for Supabase:**
   - Go to: https://supabase.com
   - Create account or sign in
   - Create new project

2. **Get Database Credentials:**
   - Go to: **Settings** → **API**
   - Find **"Project URL"** → **Copy** (this is SUPABASE_URL)
   - Find **"anon public"** key → **Copy** (this is SUPABASE_ANON_KEY)
   - Find **"service_role"** key → **Click "Reveal"** → **Copy** (this is SUPABASE_SERVICE_ROLE_KEY)

3. **Set Up Database Schema:**
   - Go to: **SQL Editor**
   - Run the schema from: `/database/schema.sql` (if exists)
   - Or create tables for: users, entitlements, payments

**You now have:**
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

---

### STEP 4: Set Up Email (Optional - 5 minutes)

**Email is OPTIONAL - tokens can be provided via URL instead.**

1. **Sign up for Resend (Recommended):**
   - Go to: https://resend.com
   - Create account
   - Go to: **API Keys**
   - Click **"Create API Key"**
   - Name it: `bitcoin-sovereign-academy`
   - **Copy the API key**

**You now have:**
- ✅ EMAIL_API_KEY
- Set EMAIL_PROVIDER = "resend"
- Set FROM_EMAIL = "noreply@bitcoinsovereign.academy" (or your domain)
- Set FROM_NAME = "Bitcoin Sovereign Academy"

---

### STEP 5: Add All Variables to Vercel (10 minutes)

1. **Go to Vercel Environment Variables:**
   - URL: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/settings/environment-variables
   - Or: Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Add Each Variable:**

   **Click "Add New" for each:**

   #### Required Variables:
   
   **JWT_SECRET:**
   - Key: `JWT_SECRET`
   - Value: Paste the secret from Step 1
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **ZAPRITE_API_KEY:**
   - Key: `ZAPRITE_API_KEY`
   - Value: Paste from Step 2
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **ZAPRITE_WEBHOOK_SECRET:**
   - Key: `ZAPRITE_WEBHOOK_SECRET`
   - Value: Paste from Step 2
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   #### Database Variables (If Using):
   
   **SUPABASE_URL:**
   - Key: `SUPABASE_URL`
   - Value: Paste from Step 3
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **SUPABASE_ANON_KEY:**
   - Key: `SUPABASE_ANON_KEY`
   - Value: Paste from Step 3
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **SUPABASE_SERVICE_ROLE_KEY:**
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Paste from Step 3
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   #### Optional Variables:
   
   **BASE_URL (Optional - Has Default):**
   - Key: `BASE_URL`
   - Value: `https://bitcoinsovereign.academy`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - **Note:** If you already have this set, keep it. If not, it defaults to `https://bitcoinsovereign.academy`
   - Click "Save"

   **ALLOWED_ORIGIN (Optional - Has Default):**
   - Key: `ALLOWED_ORIGIN`
   - Value: `https://bitcoinsovereign.academy`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - **Note:** If you already have this set, keep it. If not, it defaults to `https://bitcoinsovereign.academy`
   - Click "Save"

   **EMAIL_API_KEY (If Using Email):**
   - Key: `EMAIL_API_KEY`
   - Value: Paste from Step 4
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **EMAIL_PROVIDER (If Using Email):**
   - Key: `EMAIL_PROVIDER`
   - Value: `resend`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **FROM_EMAIL (If Using Email):**
   - Key: `FROM_EMAIL`
   - Value: `noreply@bitcoinsovereign.academy`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **FROM_NAME (If Using Email):**
   - Key: `FROM_NAME`
   - Value: `Bitcoin Sovereign Academy`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

---

### STEP 6: Verify Your Setup (5 minutes)

**Check that all required variables are set:**

1. Go to: Vercel → Environment Variables
2. **Verify these exist:**
   - [ ] JWT_SECRET
   - [ ] ZAPRITE_API_KEY
   - [ ] ZAPRITE_WEBHOOK_SECRET
   - [ ] BASE_URL (or will use default)
   - [ ] ALLOWED_ORIGIN (or will use default)

3. **If using database, verify:**
   - [ ] SUPABASE_URL
   - [ ] SUPABASE_ANON_KEY
   - [ ] SUPABASE_SERVICE_ROLE_KEY

4. **If using email, verify:**
   - [ ] EMAIL_API_KEY
   - [ ] EMAIL_PROVIDER
   - [ ] FROM_EMAIL
   - [ ] FROM_NAME

---

### STEP 7: Deploy and Test (10 minutes)

1. **Trigger Redeployment:**
   ```bash
   git commit --allow-empty -m "Configure environment variables"
   git push origin main
   ```

   Or redeploy from Vercel dashboard.

2. **Test Payment Flow:**
   - Go to: https://bitcoinsovereign.academy/pricing.html
   - Click "Unlock Curious Path" ($19)
   - Should redirect to Zaprite checkout
   - Complete test payment (use Zaprite test mode)
   - Should redirect to success page

3. **Check Vercel Logs:**
   - Go to: Vercel Dashboard → Your Project → Functions
   - Check `/api/create-order` for errors
   - Check `/api/webhooks/zaprite` for webhook processing

---

## ✅ Minimum Viable Setup (Payment System Works)

**If you want to get started FAST, only set these 3:**

1. ✅ **JWT_SECRET** - Generate with `openssl rand -base64 64`
2. ✅ **ZAPRITE_API_KEY** - From Zaprite dashboard
3. ✅ **ZAPRITE_WEBHOOK_SECRET** - From Zaprite dashboard

**Everything else has defaults or is optional.**

---

## 🎯 Monetization Configuration

### Current Pricing (in `pricing.html`):

| Product | Price | Product ID |
|---------|-------|------------|
| Curious Path | $19 | `curious_path` |
| Builder Path | $39 | `builder_path` |
| Sovereign Path | $79 | `sovereign_path` |
| Full Academy | $149 | `full_academy` |

### To Add Individual Module/Demo Pricing:

1. **Update `pricing.html`:**
   - Add new product to `products` object
   - Add pricing card to HTML
   - Add "Unlock" button with `createOrder('product_id')`

2. **Update `api/create-order.js`:**
   - Add new product ID to `validProducts` array (line 27)

3. **Update `js/security-utils.js`:**
   - Add new product ID to `validProducts` array (line ~140)

---

## 🔍 Troubleshooting

### Issue: "Payment system not configured"
**Fix:** Verify `ZAPRITE_API_KEY` is set in Vercel

### Issue: "JWT_SECRET not configured"
**Fix:** Verify `JWT_SECRET` is set in Vercel (must be 32+ characters)

### Issue: Webhook not receiving events
**Fix:** 
1. Verify webhook URL in Zaprite: `https://bitcoinsovereign.academy/api/webhooks/zaprite`
2. Verify `ZAPRITE_WEBHOOK_SECRET` matches in Vercel

### Issue: Database connection fails
**Fix:** 
1. Verify Supabase credentials are correct
2. Check Supabase project is active
3. Verify database schema is set up

---

## 📊 Quick Reference: What You Need

### For Payment System (REQUIRED):
- ✅ JWT_SECRET
- ✅ ZAPRITE_API_KEY
- ✅ ZAPRITE_WEBHOOK_SECRET

### For Database (RECOMMENDED):
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

### For Email (OPTIONAL):
- ⚠️ EMAIL_API_KEY
- ⚠️ EMAIL_PROVIDER
- ⚠️ FROM_EMAIL
- ⚠️ FROM_NAME

### For Convenience (OPTIONAL):
- ⚠️ BASE_URL (defaults to bitcoinsovereign.academy)
- ⚠️ ALLOWED_ORIGIN (defaults to bitcoinsovereign.academy)

---

## 🎉 You're Done!

Once you've set up the required variables:
1. ✅ Payment system will work
2. ✅ Users can purchase paths/modules
3. ✅ Access tokens will be generated
4. ✅ Webhooks will process payments

**Next Steps:**
- Test payment flow end-to-end
- Configure pricing for individual modules/demos
- Set up email (optional) for token delivery
- Monitor payments in Zaprite dashboard

---

**Last Updated:** January 2026
