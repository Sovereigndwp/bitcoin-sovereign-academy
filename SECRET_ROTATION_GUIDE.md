# 🔐 Secret Rotation Guide - Which Secrets to Regenerate

Based on the security audit and best practices, here's which secrets you should **definitely rotate** and which are **optional but recommended**.

## 🚨 CRITICAL - Rotate Immediately

### 1. **JWT_SECRET** ⚠️ HIGHEST PRIORITY
**Why Rotate:**
- Had hardcoded fallback (`'change_me_in_production'`) in old code
- If this was ever missing, tokens could be forged
- Used for all access token generation
- Compromise = complete authentication bypass

**Impact if Compromised:**
- Attackers can generate valid access tokens
- Unauthorized access to all paid content
- User impersonation

**How to Rotate:**
```bash
# Generate new secure secret (64 characters)
openssl rand -base64 64

# In Vercel Dashboard:
# 1. Delete old JWT_SECRET
# 2. Add new JWT_SECRET with generated value
# 3. Deploy immediately

# ⚠️ WARNING: This will invalidate ALL existing access tokens
# Users will need to re-authenticate or receive new tokens
```

**When to Rotate:**
- ✅ Immediately (if old code had fallback)
- ✅ If you suspect it was exposed
- ✅ Every 90 days (best practice)

---

### 2. **ZAPRITE_WEBHOOK_SECRET** ⚠️ HIGH PRIORITY
**Why Rotate:**
- Used to verify webhook signatures
- If compromised, attackers can send fake payment confirmations
- Critical for payment security

**Impact if Compromised:**
- Fake payment confirmations
- Unauthorized access granted
- Revenue loss

**How to Rotate:**
1. Go to Zaprite Dashboard → Settings → Webhooks
2. Generate new webhook secret
3. Update in Vercel environment variables
4. Test webhook immediately

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 180 days (best practice)
- ✅ After any security incident

---

### 3. **STRIPE_WEBHOOK_SECRET** ⚠️ HIGH PRIORITY
**Why Rotate:**
- Used to verify Stripe webhook signatures
- If compromised, fake payment events possible

**Impact if Compromised:**
- Fake Stripe payment confirmations
- Unauthorized access

**How to Rotate:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Create new webhook endpoint (or regenerate secret)
3. Update in Vercel
4. Test immediately

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 180 days
- ✅ After security incident

---

## ⚠️ RECOMMENDED - Rotate Soon

### 4. **ZAPRITE_API_KEY**
**Why Rotate:**
- Used for creating orders and verifying payments
- If exposed, attackers could create orders or verify fake payments

**Impact if Compromised:**
- Unauthorized order creation
- Payment verification bypass

**How to Rotate:**
1. Go to Zaprite Dashboard → API Keys
2. Generate new API key
3. Update in Vercel
4. Delete old key after confirming new one works

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 180 days
- ✅ If key was shared or logged

---

### 5. **STRIPE_SECRET_KEY** (if using Stripe)
**Why Rotate:**
- Used for creating checkout sessions
- If exposed, attackers could create payment sessions

**Impact if Compromised:**
- Unauthorized checkout session creation
- Potential payment fraud

**How to Rotate:**
1. Go to Stripe Dashboard → Developers → API Keys
2. Create new secret key
3. Update in Vercel
4. Revoke old key

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 180 days
- ✅ If key was logged or shared

---

### 6. **BTCPAY_API_KEY** (if using BTCPay)
**Why Rotate:**
- Used for creating invoices
- If exposed, unauthorized invoice creation

**Impact if Compromised:**
- Unauthorized invoice creation
- Payment processing issues

**How to Rotate:**
1. Go to BTCPay Server → Account → API Keys
2. Generate new API key
3. Update in Vercel
4. Delete old key

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 180 days

---

## ✅ OPTIONAL - Rotate Periodically

### 7. **SUPABASE_SERVICE_ROLE_KEY**
**Why Rotate:**
- Full database access
- If exposed, complete database compromise

**Impact if Compromised:**
- Complete database access
- Data breach
- User data exposure

**How to Rotate:**
1. Go to Supabase Dashboard → Settings → API
2. Generate new service role key
3. Update in Vercel
4. Update any other services using it

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 90 days (best practice)
- ✅ After any database security incident

**⚠️ Note:** This will require updating all services that use it.

---

### 8. **EMAIL_API_KEY** (if using email service)
**Why Rotate:**
- Used for sending access tokens
- If exposed, email service abuse

**Impact if Compromised:**
- Email service abuse
- Spam sending
- Service account compromise

**How to Rotate:**
- Depends on email provider (SendGrid, Mailgun, etc.)
- Generate new API key in provider dashboard
- Update in Vercel

**When to Rotate:**
- ✅ If you suspect it was exposed
- ✅ Every 180 days

---

## 🔒 SAFE - No Rotation Needed

### 9. **SUPABASE_ANON_KEY**
**Why Safe:**
- Public key, designed to be exposed
- Limited permissions
- No rotation needed

### 10. **SUPABASE_URL**
**Why Safe:**
- Public URL, not a secret
- No rotation needed

### 11. **ALLOWED_ORIGIN**
**Why Safe:**
- Public domain, not a secret
- No rotation needed

### 12. **BASE_URL** / **VERCEL_URL**
**Why Safe:**
- Public URLs, not secrets
- No rotation needed

---

## 📋 Rotation Checklist

### Immediate (Do Now)
- [ ] **JWT_SECRET** - Generate new 64-character secret
- [ ] **ZAPRITE_WEBHOOK_SECRET** - Generate new in Zaprite
- [ ] **STRIPE_WEBHOOK_SECRET** - Generate new in Stripe (if using)

### This Week
- [ ] **ZAPRITE_API_KEY** - Generate new in Zaprite
- [ ] **STRIPE_SECRET_KEY** - Generate new in Stripe (if using)
- [ ] **BTCPAY_API_KEY** - Generate new in BTCPay (if using)

### This Month
- [ ] **SUPABASE_SERVICE_ROLE_KEY** - Generate new in Supabase
- [ ] **EMAIL_API_KEY** - Generate new in email provider

---

## 🚨 Critical Warnings

### ⚠️ JWT_SECRET Rotation Impact
**CRITICAL:** Rotating `JWT_SECRET` will **invalidate ALL existing access tokens**.

**Before Rotating:**
1. Notify users (if possible)
2. Have a plan to re-issue tokens
3. Consider gradual migration:
   - Add new secret as `JWT_SECRET_NEW`
   - Accept both old and new tokens temporarily
   - Migrate users gradually
   - Remove old secret after migration

**Or:**
- Rotate during low-traffic period
- Have customer support ready
- Provide easy token re-issuance process

---

## 🔧 How to Rotate in Vercel

### Step 1: Generate New Secret
```bash
# For JWT_SECRET (64 characters)
openssl rand -base64 64

# For other secrets, use provider dashboards
```

### Step 2: Update in Vercel
1. Go to: https://vercel.com/bitcoin-sovereign-academy/bitcoin-sovereign-academy/settings/environment-variables
2. Find the secret to rotate
3. Click "Edit" or delete and recreate
4. Paste new value
5. Select environments (Production, Preview, Development)
6. Save

### Step 3: Redeploy
```bash
# Trigger new deployment
git commit --allow-empty -m "Rotate secrets"
git push
```

Or redeploy from Vercel dashboard.

### Step 4: Verify
- Test payment flow
- Test webhook endpoints
- Check logs for errors
- Verify new secret is being used

---

## 📊 Priority Summary

| Secret | Priority | Rotate Now? | Impact if Compromised |
|--------|----------|-------------|----------------------|
| JWT_SECRET | 🔴 CRITICAL | ✅ YES | Complete auth bypass |
| ZAPRITE_WEBHOOK_SECRET | 🔴 CRITICAL | ✅ YES | Fake payments |
| STRIPE_WEBHOOK_SECRET | 🔴 CRITICAL | ✅ YES | Fake payments |
| ZAPRITE_API_KEY | 🟠 HIGH | ⚠️ SOON | Order manipulation |
| STRIPE_SECRET_KEY | 🟠 HIGH | ⚠️ SOON | Payment fraud |
| BTCPAY_API_KEY | 🟠 HIGH | ⚠️ SOON | Invoice manipulation |
| SUPABASE_SERVICE_ROLE_KEY | 🟡 MEDIUM | 📅 PERIODIC | Database breach |
| EMAIL_API_KEY | 🟡 MEDIUM | 📅 PERIODIC | Email abuse |

---

## 🔍 How to Check if Secrets Were Exposed

### Check These Places:
1. **Git History**
   ```bash
   git log --all --full-history -- "*secret*" "*key*" "*password*"
   ```

2. **Log Files**
   - Check Vercel function logs
   - Check any error logs
   - Check deployment logs

3. **Code Comments**
   - Search for commented-out secrets
   - Check backup files

4. **Environment Files**
   - Check if `.env` files were committed
   - Check if secrets in documentation

---

## ✅ After Rotation

1. **Test Everything**
   - Payment flow
   - Webhook endpoints
   - Access token generation
   - Database connections

2. **Monitor Logs**
   - Watch for authentication failures
   - Check for webhook errors
   - Monitor payment processing

3. **Document Rotation**
   - Note date of rotation
   - Document which secrets were rotated
   - Update security documentation

---

**Last Updated:** January 2025
