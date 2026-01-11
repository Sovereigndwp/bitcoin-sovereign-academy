# 💳 Payment Flow Testing Guide

## 📋 Pricing Overview

### Products Available

| Product | Price | Sats (approx) | Product ID |
|---------|-------|---------------|------------|
| **Free Explorer** | $0 | 0 sats | N/A (free) |
| **Curious Path** | $19 | ~50,000 sats | `curious_path` |
| **Builder Path** | $39 | ~100,000 sats | `builder_path` |
| **Sovereign Path** | $79 | ~200,000 sats | `sovereign_path` |
| **Full Academy** | $149 | ~400,000 sats | `full_academy` |

### Where Pricing is Defined

1. **Frontend Display**: `pricing.html` (lines 430-510)
   - Visual pricing cards
   - Product features
   - "Unlock" buttons

2. **Product Configuration**: `pricing.html` (lines 615-640)
   ```javascript
   const products = {
       curious_path: {
           name: 'Curious Path',
           price: 19,
           sats: 50000,
           currency: 'USD'
       },
       // ... other products
   };
   ```

3. **Backend API**: `/api/pricing.ts` (if exists)
   - Server-side price validation
   - Cart calculation

## 🔄 Payment Flow

### Step 1: User Clicks "Unlock" Button
**Location**: `pricing.html` (lines 457, 478, 499, 520)

**What Happens**:
```javascript
onclick="createOrder('curious_path')"  // or builder_path, sovereign_path, full_academy
```

### Step 2: Create Order Function
**Location**: `pricing.html` (lines 643-695)

**Process**:
1. Gets product configuration
2. Generates unique user ID (if not exists)
3. Calls `/api/create-order` endpoint
4. Stores order ID in localStorage
5. Redirects to Zaprite checkout URL

**API Call**:
```javascript
POST /api/create-order
Body: {
    product: 'curious_path',
    userId: 'user_xxxxx',
    amount: 19,
    currency: 'USD',
    label: 'Bitcoin Sovereign Academy - Curious Path'
}
```

### Step 3: Payment Processing
**Payment Providers**:
- **Zaprite** (primary) - Bitcoin/Lightning payments
- **Stripe** (via checkout.js) - Credit card payments
- **BTCPay** (via checkout.js) - Bitcoin payments

**Where Payments Are Made**:
- **Zaprite**: External redirect to `zaprite.com` checkout
- **Stripe**: External redirect to `checkout.stripe.com`
- **BTCPay**: External redirect to your BTCPay server

### Step 4: Payment Success
**Location**: `payment/success.html`

**URL Parameters**:
- `?order=ORDER_ID` - Order ID from Zaprite
- `?product=curious_path` - Product purchased
- `?token=JWT_TOKEN` - Access token (if from email link)

**What Happens**:
1. Validates URL parameters
2. Displays success message
3. Shows product information
4. Stores access token (if provided)

## 🧪 Testing the Payment Flow

### Test 1: Visit Pricing Page
```
URL: https://bitcoinsovereign.academy/pricing.html
```

**What to Check**:
- [ ] All 5 pricing tiers display correctly
- [ ] Prices show: $0, $19, $39, $79, $149
- [ ] "Unlock" buttons are clickable
- [ ] Payment methods section shows (Bitcoin, Lightning, Card)

### Test 2: Click "Unlock" Button
**Action**: Click any "Unlock" button (e.g., "Unlock Curious Path")

**What Should Happen**:
1. Button shows loading state
2. Browser console shows API call to `/api/create-order`
3. Redirects to Zaprite checkout page

**If It Fails**:
- Check browser console for errors
- Verify `/api/create-order` endpoint exists
- Check network tab for API response

### Test 3: Complete Payment (Test Mode)
**For Zaprite**:
1. Use Zaprite test mode
2. Complete test payment
3. Should redirect back to `payment/success.html?order=ORDER_ID&product=curious_path`

**For Stripe**:
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any CVC
4. Complete payment
5. Should redirect to success page

### Test 4: Verify Success Page
**URL**: `https://bitcoinsovereign.academy/payment/success.html?product=curious_path&order=test123`

**What to Check**:
- [ ] Success message displays
- [ ] Product name shows correctly
- [ ] Confetti animation plays
- [ ] No console errors
- [ ] Access token stored (if provided)

## 🔍 API Endpoints to Check

### 1. Create Order Endpoint
```
POST /api/create-order
```

**Expected Response**:
```json
{
    "orderId": "order_xxxxx",
    "checkoutUrl": "https://zaprite.com/checkout/xxxxx"
}
```

**Location**: Check if this endpoint exists in:
- `/api/index.ts`
- `/api/pricing.ts`
- Or needs to be created

### 2. Checkout Endpoint
```
POST /api/checkout
```

**Used by**: `js/checkout.js` (line 101)

**Expected Response**:
```json
{
    "url": "https://checkout.stripe.com/pay/xxxxx",
    "sessionId": "cs_xxxxx"
}
```

**Location**: Check `/api/index.ts` or `/api/stripe.ts`

### 3. Webhook Endpoints
- `/api/webhooks/stripe` - Stripe payment confirmations
- `/api/webhooks/zaprite` - Zaprite payment confirmations (if exists)
- `/api/webhooks/btcpay` - BTCPay payment confirmations (if exists)

## ⚠️ Common Issues & Fixes

### Issue 1: "Unlock" Button Does Nothing
**Possible Causes**:
- JavaScript error in console
- `createOrder` function not defined
- API endpoint missing

**Fix**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `createOrder` function exists in `pricing.html`
4. Check if `/api/create-order` endpoint exists

### Issue 2: Redirect Blocked
**Error**: "Blocked redirect to untrusted domain"

**Fix**: Add payment provider domain to whitelist in:
- `pricing.html` (line ~690)
- `js/checkout.js` (line ~370)

```javascript
const trustedDomains = [
    'zaprite.com',
    'checkout.stripe.com',
    'pay.btcpay.server',
    'your-btcpay-domain.com'  // Add your BTCPay domain
];
```

### Issue 3: API Endpoint Not Found
**Error**: `404 Not Found` for `/api/create-order`

**Fix**: 
1. Check if endpoint exists in `/api/index.ts`
2. If using Vercel, ensure API route is in `/api/` folder
3. Check Vercel function logs for errors

### Issue 4: Payment Success Page Doesn't Show Product
**Possible Causes**:
- Invalid product ID in URL
- Product ID not in whitelist

**Fix**: Add product ID to whitelist in `js/security-utils.js`:
```javascript
const validProducts = [
    'curious_path',    // Note: uses underscore, not hyphen
    'builder_path',
    'sovereign_path',
    'full_academy'
];
```

## 📝 Testing Checklist

### Before Testing
- [ ] Verify site is deployed to live URL
- [ ] Check API endpoints are accessible
- [ ] Verify payment provider credentials are set
- [ ] Test mode enabled for payment providers

### During Testing
- [ ] Pricing page loads correctly
- [ ] All products display with correct prices
- [ ] "Unlock" buttons work
- [ ] Redirects to payment provider
- [ ] Payment can be completed (test mode)
- [ ] Success page displays correctly
- [ ] Access token stored (if applicable)
- [ ] No console errors

### After Testing
- [ ] Check payment provider dashboard for test payments
- [ ] Verify webhooks received (if applicable)
- [ ] Check access token grants correct permissions
- [ ] Test accessing paid content

## 🔗 Key Files to Review

1. **Pricing Page**: `pricing.html`
   - Product definitions (lines 615-640)
   - Create order function (lines 643-695)
   - Payment redirect logic (lines 686-710)

2. **Checkout Logic**: `js/checkout.js`
   - Payment provider selection
   - Checkout session creation
   - URL validation

3. **Success Page**: `payment/success.html`
   - URL parameter validation
   - Product display
   - Token storage

4. **API Endpoints**: `/api/index.ts`
   - Order creation
   - Checkout session creation
   - Webhook handlers

5. **Security Utils**: `js/security-utils.js`
   - URL validation
   - Product ID validation
   - Redirect URL sanitization

## 🎯 Quick Test Commands

### Test Pricing Page
```bash
# Open in browser
https://bitcoinsovereign.academy/pricing.html

# Or locally
http://localhost:8000/pricing.html
```

### Test Success Page (with valid product)
```bash
https://bitcoinsovereign.academy/payment/success.html?product=curious_path&order=test123
```

### Test Success Page (with invalid product - should safely ignore)
```bash
https://bitcoinsovereign.academy/payment/success.html?product=invalid_product&order=test123
```

## ✅ API Endpoints Status

### Confirmed Endpoints
- ✅ `/api/create-order` - Exists at `api/create-order.js` (Zaprite integration)
- ✅ `/api/checkout` - Exists at `api/checkout.ts` (Stripe/BTCPay integration)
- ✅ `/api/webhooks/stripe` - Exists at `api/webhooks/stripe.ts`
- ✅ `/api/webhooks/btcpay` - Exists at `api/webhooks/btcpay.ts`
- ✅ `/api/webhooks/zaprite` - Exists at `api/webhooks/zaprite.js`

### Payment Flow Options

**Option 1: Zaprite (Direct from Pricing Page)**
- Used by: `pricing.html` → `createOrder()` function
- Endpoint: `/api/create-order`
- Redirects to: `zaprite.com` checkout
- Returns: `{ orderId, checkoutUrl }`

**Option 2: Stripe/BTCPay (Via Checkout Page)**
- Used by: `js/checkout.js` → `createCheckoutSession()`
- Endpoint: `/api/checkout`
- Redirects to: `checkout.stripe.com` or BTCPay server
- Returns: `{ url, sessionId }`

## 📞 Next Steps

1. **Verify Payment Provider Configuration**
   - Check Zaprite API keys are set in environment variables
   - Check Stripe API keys are set (if using)
   - Check BTCPay server URL and API key (if using)

2. **Configure Payment Providers**
   - Set up Zaprite account and API keys
   - Set up Stripe account and API keys (if using)
   - Set up BTCPay server (if using)

3. **Test in Production**
   - Use test mode for all providers
   - Complete a test payment
   - Verify success flow works

4. **Monitor After Launch**
   - Check payment provider dashboards
   - Monitor webhook logs
   - Check for any console errors

---

**Last Updated**: January 2025
