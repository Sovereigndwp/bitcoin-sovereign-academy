# 🎯 Optimized Secret Rotation Plan - Minimal & Essential

Based on codebase analysis, here's the **streamlined plan** focusing only on what's **actually used** and **critical for security**.

## 📊 Current Payment Flow Analysis

### Primary Payment Flow (Used by Most Users)
- **Zaprite** - Main payment provider via `/pricing.html`
  - Used by: Direct "Unlock" buttons on pricing page
  - Flow: `pricing.html` → `/api/create-order` → Zaprite checkout → Webhook → Access token

### Secondary Payment Flow (Optional/Alternative)
- **Stripe** - Available via `/checkout` page (if users choose)
- **BTCPay** - Available via `/checkout` page (if users choose)

---

## ✅ ESSENTIAL Secrets to Rotate (Do These First)

### 🔴 CRITICAL - Rotate Immediately

#### 1. **JWT_SECRET** ⚠️ HIGHEST PRIORITY
**Why:** 
- Had hardcoded fallback in old code
- Used for ALL access token generation
- Compromise = complete authentication bypass

**Impact:** 
- **ALL users affected** - Every access token uses this
- **Critical for security** - Without this, platform is insecure

**Action:** ✅ **ROTATE NOW**

---

#### 2. **ZAPRITE_WEBHOOK_SECRET** ⚠️ CRITICAL
**Why:**
- Verifies payment confirmations from Zaprite
- Primary payment provider for most users
- If compromised: Fake payments = free access

**Impact:**
- **All Zaprite payments affected** (primary payment method)
- **Revenue loss** if compromised

**Action:** ✅ **ROTATE NOW**

---

#### 3. **ZAPRITE_API_KEY** ⚠️ HIGH PRIORITY
**Why:**
- Creates payment orders
- Primary payment provider
- Used by main pricing page

**Impact:**
- **All Zaprite payments affected**
- **Payment flow breaks** if compromised

**Action:** ✅ **ROTATE THIS WEEK**

---

## ⚠️ CONDITIONAL Secrets (Only If Actually Used)

### Check Your Vercel Environment Variables First!

Before rotating these, **check if they exist** in your Vercel dashboard:

#### 4. **STRIPE_SECRET_KEY** & **STRIPE_WEBHOOK_SECRET**
**Rotate Only If:**
- ✅ You see `STRIPE_SECRET_KEY` in Vercel environment variables
- ✅ You actively use Stripe for payments
- ✅ You have Stripe checkout enabled

**Skip If:**
- ❌ No Stripe keys in Vercel
- ❌ Stripe is not configured
- ❌ You only use Zaprite

**How to Check:**
1. Go to Vercel → Environment Variables
2. Search for "STRIPE"
3. If found → Rotate
4. If not found → Skip

---

#### 5. **BTCPAY_API_KEY** & **BTCPAY_WEBHOOK_SECRET**
**Rotate Only If:**
- ✅ You see `BTCPAY_API_KEY` in Vercel environment variables
- ✅ You have a BTCPay server set up
- ✅ You actively use BTCPay

**Skip If:**
- ❌ No BTCPay keys in Vercel
- ❌ BTCPay is not configured
- ❌ You only use Zaprite

**How to Check:**
1. Go to Vercel → Environment Variables
2. Search for "BTCPAY"
3. If found → Rotate
4. If not found → Skip

---

#### 6. **EMAIL_API_KEY**
**Rotate Only If:**
- ✅ You see `EMAIL_API_KEY` in Vercel environment variables
- ✅ You send access tokens via email
- ✅ Email is critical for user onboarding

**Skip If:**
- ❌ No email key in Vercel
- ❌ Tokens are only provided via URL (not email)
- ❌ Email is optional/nice-to-have

**How to Check:**
1. Go to Vercel → Environment Variables
2. Search for "EMAIL"
3. If found → Rotate
4. If not found → Skip

**Note:** If email is optional, you can defer this. Tokens can be provided via URL parameters.

---

#### 7. **SUPABASE_SERVICE_ROLE_KEY**
**Rotate Only If:**
- ✅ You see `SUPABASE_SERVICE_ROLE_KEY` in Vercel
- ✅ You use Supabase for storing user data/entitlements
- ✅ Database is critical for payment processing

**Skip If:**
- ❌ No Supabase keys in Vercel
- ❌ You use in-memory storage (not recommended but possible)
- ❌ Database is optional

**How to Check:**
1. Go to Vercel → Environment Variables
2. Search for "SUPABASE"
3. If found → Rotate
4. If not found → Skip

**Note:** Based on security audit, you should be using a database. If you're not, that's a bigger issue to address.

---

## 🎯 Optimized Action Plan

### Phase 1: Critical Secrets (Do Today - 15 minutes)

**These are ESSENTIAL and affect ALL users:**

1. ✅ **JWT_SECRET** - Generate new 64-char secret
2. ✅ **ZAPRITE_WEBHOOK_SECRET** - Generate in Zaprite dashboard
3. ✅ **ZAPRITE_API_KEY** - Generate in Zaprite dashboard

**Time:** ~15 minutes
**Impact:** Secures entire platform, all payment flows

---

### Phase 2: Check & Rotate Conditional Secrets (Do This Week - 30 minutes)

**Only rotate what exists in your Vercel dashboard:**

1. **Check Vercel Environment Variables:**
   - Go to: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/settings/environment-variables
   - Make a list of what exists

2. **Rotate Only What Exists:**
   - If `STRIPE_SECRET_KEY` exists → Rotate
   - If `STRIPE_WEBHOOK_SECRET` exists → Rotate
   - If `BTCPAY_API_KEY` exists → Rotate
   - If `BTCPAY_WEBHOOK_SECRET` exists → Rotate
   - If `EMAIL_API_KEY` exists → Rotate (if email is critical)
   - If `SUPABASE_SERVICE_ROLE_KEY` exists → Rotate

3. **Skip What Doesn't Exist:**
   - Don't create new secrets for services you don't use
   - Focus on what's actually configured

**Time:** ~30 minutes (only if you have these configured)
**Impact:** Secures optional/alternative payment methods

---

## 📋 Quick Decision Matrix

| Secret | Check Vercel? | Rotate If... | Skip If... |
|--------|---------------|--------------|------------|
| **JWT_SECRET** | ❌ No | Always | Never |
| **ZAPRITE_WEBHOOK_SECRET** | ❌ No | Always | Never |
| **ZAPRITE_API_KEY** | ❌ No | Always | Never |
| **STRIPE_SECRET_KEY** | ✅ Yes | Found in Vercel | Not found |
| **STRIPE_WEBHOOK_SECRET** | ✅ Yes | Found in Vercel | Not found |
| **BTCPAY_API_KEY** | ✅ Yes | Found in Vercel | Not found |
| **BTCPAY_WEBHOOK_SECRET** | ✅ Yes | Found in Vercel | Not found |
| **EMAIL_API_KEY** | ✅ Yes | Found + Email critical | Not found or optional |
| **SUPABASE_SERVICE_ROLE_KEY** | ✅ Yes | Found + Using DB | Not found or in-memory |

---

## 🚀 Streamlined Step-by-Step Process

### Step 1: Generate Critical Secrets (5 minutes)

```bash
# 1. Generate JWT_SECRET
openssl rand -base64 64
# Copy this - you'll need it!

# 2. Go to Zaprite Dashboard
# - Generate new webhook secret
# - Generate new API key
# Copy both - you'll need them!
```

---

### Step 2: Check Vercel Environment Variables (2 minutes)

1. Go to: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/settings/environment-variables
2. **List what exists:**
   - [ ] JWT_SECRET (should exist)
   - [ ] ZAPRITE_WEBHOOK_SECRET (should exist)
   - [ ] ZAPRITE_API_KEY (should exist)
   - [ ] STRIPE_SECRET_KEY (check if exists)
   - [ ] STRIPE_WEBHOOK_SECRET (check if exists)
   - [ ] BTCPAY_API_KEY (check if exists)
   - [ ] BTCPAY_WEBHOOK_SECRET (check if exists)
   - [ ] EMAIL_API_KEY (check if exists)
   - [ ] SUPABASE_SERVICE_ROLE_KEY (check if exists)

---

### Step 3: Generate Conditional Secrets (Only If Needed - 10 minutes)

**Only generate secrets for services that exist in Vercel:**

- If Stripe keys exist → Generate new Stripe secrets
- If BTCPay keys exist → Generate new BTCPay secrets
- If Email key exists → Generate new email API key (if critical)
- If Supabase key exists → Generate new Supabase key

**Skip services that don't exist in Vercel.**

---

### Step 4: Update Vercel (5 minutes)

1. **Update Critical Secrets (Always):**
   - JWT_SECRET → Replace with new value
   - ZAPRITE_WEBHOOK_SECRET → Replace with new value
   - ZAPRITE_API_KEY → Replace with new value

2. **Update Conditional Secrets (Only If They Exist):**
   - Update only the secrets that exist in Vercel
   - Don't create new ones for unused services

---

### Step 5: Test & Deploy (10 minutes)

1. **Redeploy:**
   ```bash
   git commit --allow-empty -m "Rotate critical secrets"
   git push origin main
   ```

2. **Test Primary Payment Flow:**
   - Go to pricing page
   - Click "Unlock" button
   - Should redirect to Zaprite
   - Complete test payment
   - Verify success page works

3. **Test Conditional Flows (Only If Configured):**
   - If Stripe configured → Test Stripe checkout
   - If BTCPay configured → Test BTCPay checkout

---

## 💰 Cost-Benefit Analysis

### Minimum Viable Rotation (Secures 100% of Users)
**Time:** 15 minutes
**Secrets:** 3 (JWT_SECRET, ZAPRITE_WEBHOOK_SECRET, ZAPRITE_API_KEY)
**Coverage:** All primary payment flows secured

### Full Rotation (Secures All Payment Methods)
**Time:** 45 minutes
**Secrets:** 3-9 (depending on what's configured)
**Coverage:** All payment methods + optional services

### Recommendation
**Start with Minimum Viable (3 secrets)** - This secures your primary payment flow and all users.

**Then check Vercel** and rotate only what exists. Don't create secrets for services you don't use.

---

## ✅ Final Checklist

### Must Do (Critical)
- [ ] Rotate JWT_SECRET
- [ ] Rotate ZAPRITE_WEBHOOK_SECRET
- [ ] Rotate ZAPRITE_API_KEY
- [ ] Test Zaprite payment flow
- [ ] Verify webhook processing

### Conditional (Only If Configured)
- [ ] Check Vercel for Stripe keys → Rotate if found
- [ ] Check Vercel for BTCPay keys → Rotate if found
- [ ] Check Vercel for Email key → Rotate if found and critical
- [ ] Check Vercel for Supabase key → Rotate if found

### Skip (Not Configured)
- [ ] Don't create Stripe secrets if not using Stripe
- [ ] Don't create BTCPay secrets if not using BTCPay
- [ ] Don't create Email secrets if email is optional
- [ ] Don't create Supabase secrets if not using database

---

## 🎯 Summary

**Minimum Required (15 minutes):**
1. JWT_SECRET
2. ZAPRITE_WEBHOOK_SECRET
3. ZAPRITE_API_KEY

**Check Vercel First, Then Rotate:**
- Only rotate secrets that exist in your Vercel dashboard
- Don't create secrets for unused services
- Focus on what's actually configured and used

**This approach:**
- ✅ Secures your primary payment flow (Zaprite)
- ✅ Secures all user access tokens (JWT_SECRET)
- ✅ Saves time by skipping unused services
- ✅ Focuses on what matters for your users

---

**Last Updated:** January 2025
