# Zaprite Payment Integration Architecture
## Bitcoin Sovereign Academy - Premium Content Unlocking

---

## Executive Summary

This document outlines the architecture for integrating Zaprite payment processing into Bitcoin Sovereign Academy to enable premium content unlocking via Bitcoin and Lightning Network payments.

**Recommendation**: Start with **Zaprite API** (simpler, hosted) with option to migrate to **L402/LSAT** protocol (advanced, privacy-focused) in future.

---

## 1. Integration Options Comparison

### Option A: Zaprite API (Recommended for Phase 1)

**Pros:**
- ✅ Hosted solution - no server infrastructure needed
- ✅ Accepts Bitcoin (on-chain), Lightning, AND fiat (card payments)
- ✅ Simple webhook-based payment verification
- ✅ $25/month flat fee (no transaction fees)
- ✅ Professional invoicing and checkout UX
- ✅ 30-day free trial to test integration

**Cons:**
- ❌ Requires API key management
- ❌ User must have email (less anonymous than L402)
- ❌ Centralized service (though non-custodial)

**Best For:**
- Course bundles and path subscriptions
- Professional payment experience
- Users comfortable with traditional checkout flows

---

### Option B: L402/LSAT Protocol (Future Phase)

**Pros:**
- ✅ **True pseudonymous access** - no email, no account, no user data
- ✅ Built into HTTP 402 status code (elegant architecture)
- ✅ Pay-per-API-call model (perfect for individual demo unlocking)
- ✅ Cryptographically verifiable bearer credentials (macaroons)
- ✅ Open standard (Lightning Labs)

**Cons:**
- ❌ Requires Lightning node infrastructure
- ❌ More complex implementation (reverse proxy setup)
- ❌ Lightning-only (no fiat option for beginners)
- ❌ Less familiar UX for non-technical users

**Best For:**
- Individual demo unlocking (micro-payments)
- Privacy-conscious users
- Developer/power user audience

**Implementation Tools:**
- [Aperture](https://github.com/lightninglabs/aperture) - L402 reverse proxy
- [Boltwall](https://github.com/Tierion/boltwall) - Node.js L402 middleware

---

## 2. Zaprite API Architecture (Phase 1)

### Authentication

```javascript
// API Key stored securely (environment variable or secure backend)
const ZAPRITE_API_KEY = process.env.ZAPRITE_API_KEY;

// API Request Header
headers: {
  'Authorization': ZAPRITE_API_KEY,
  'Content-Type': 'application/json'
}
```

### Core Endpoints (Based on Research)

#### 1. Create Order
```
POST https://api.zaprite.com/v1/orders
```

**Request Body** (inferred from Python client):
```json
{
  "amount": 50000,  // Amount in smallest unit (sats or cents)
  "currency": "USD", // or "BTC", "sats"
  "external_uniq_id": "bsa_curious_path_user123",
  "redirect_url": "https://bitcoinsovereign.academy/payment/success",
  "label": "Bitcoin Sovereign Academy - Curious Path",
  "metadata": {
    "user_id": "user123",
    "product": "curious_path_full",
    "tier": "premium"
  }
}
```

**Response** (expected):
```json
{
  "id": "order_abc123",
  "checkout_url": "https://checkout.zaprite.com/order_abc123",
  "status": "pending",
  "amount": 50000,
  "currency": "USD",
  "created_at": "2025-01-15T10:30:00Z"
}
```

#### 2. Check Payment Status
```
GET https://api.zaprite.com/v1/orders/{order_id}
```

**Response** (expected):
```json
{
  "id": "order_abc123",
  "status": "paid", // or "pending", "expired", "cancelled"
  "paid_at": "2025-01-15T10:35:22Z",
  "payment_method": "lightning",
  "transaction_id": "ln_invoice_xyz789"
}
```

---

### Webhook Integration

#### Webhook Event: `order.paid`

**Zaprite sends to your webhook URL:**
```
POST https://yourdomain.com/api/webhooks/zaprite
```

**Payload** (expected structure):
```json
{
  "event": "order.paid",
  "order_id": "order_abc123",
  "external_uniq_id": "bsa_curious_path_user123",
  "amount": 50000,
  "currency": "USD",
  "paid_at": "2025-01-15T10:35:22Z",
  "payment_method": "lightning",
  "metadata": {
    "user_id": "user123",
    "product": "curious_path_full",
    "tier": "premium"
  },
  "signature": "sha256_webhook_signature_for_verification"
}
```

**Webhook Verification** (security):
```javascript
// Verify webhook signature to prevent spoofing
function verifyZapriteWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const computedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
  return computedSignature === signature;
}
```

---

## 3. Content Unlocking Architecture

### Pricing Tiers (Suggested)

| Tier | Price | What's Unlocked | Target Audience |
|------|-------|-----------------|-----------------|
| **Free** | $0 | 6 featured demos + all public content | Everyone |
| **Curious Path** | $19 (50,000 sats) | All beginner demos + Curious path modules | New learners |
| **Builder Path** | $39 (100,000 sats) | All intermediate demos + Builder path | Technical users |
| **Sovereign Path** | $79 (200,000 sats) | All advanced demos + Sovereign path | Security-focused |
| **Full Academy** | $149 (400,000 sats) | Everything unlocked forever | Serious students |
| **Single Demo** | $2-5 (5,000-15,000 sats) | Individual demo access (micro-payment) | Casual browsers |

### Database Schema (Client-Side Storage)

Since Bitcoin Sovereign Academy is **static/client-side only**, use **localStorage** with cryptographic proof:

```javascript
// Storage structure
const userAccess = {
  purchases: [
    {
      orderId: "order_abc123",
      product: "curious_path_full",
      paidAt: "2025-01-15T10:35:22Z",
      proof: "zaprite_signature_xyz", // Cryptographic proof from Zaprite
      expiresAt: null // null = lifetime access
    }
  ],
  unlockedDemos: [
    "hash-puzzle-game",
    "signature-demo",
    "blockchain-game",
    // ... all unlocked demo IDs
  ]
};

// Store encrypted in localStorage
localStorage.setItem('bsa_access', JSON.stringify(userAccess));
```

### Payment Flow (User Journey)

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Unlock Curious Path" button on locked demo    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend JavaScript calls Zaprite API to create order       │
│ (via serverless function or direct API call if allowed)     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ User redirected to Zaprite checkout page                    │
│ - Choose Bitcoin (on-chain)                                 │
│ - Choose Lightning Network (instant)                        │
│ - Choose Credit Card (fiat option)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ User completes payment                                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Zaprite webhook fires: POST /api/webhooks/zaprite           │
│ Payload: { event: "order.paid", order_id: "..." }          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend/serverless function:                                │
│ 1. Verify webhook signature                                 │
│ 2. Check order status via Zaprite API                       │
│ 3. Generate access token (JWT or signed payload)            │
│ 4. Return to user's browser                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend stores access token in localStorage                │
│ User redirected back to unlocked content                    │
│ All locked demos now show "Unlocked ✓" badges               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Plan

### Phase 1: Basic Zaprite Integration (Week 1-2)

**Goal**: Accept payments and manually unlock content

1. **Setup Zaprite Account**
   - Sign up at app.zaprite.com
   - Generate API key (Settings > API)
   - Configure webhook URL

2. **Create Payment UI**
   - Add "Unlock Premium" buttons to locked demos
   - Design pricing page with tier options
   - Create checkout flow mockups

3. **Build Serverless Backend** (Vercel Functions)
   ```javascript
   // /api/create-order.js
   export default async function handler(req, res) {
     const { product, userId } = req.body;

     // Create Zaprite order
     const order = await fetch('https://api.zaprite.com/v1/orders', {
       method: 'POST',
       headers: {
         'Authorization': process.env.ZAPRITE_API_KEY,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         amount: getProductPrice(product),
         currency: 'USD',
         external_uniq_id: `${product}_${userId}`,
         redirect_url: `${process.env.BASE_URL}/payment/success`,
         label: getProductLabel(product)
       })
     });

     const data = await order.json();
     res.json({ checkoutUrl: data.checkout_url, orderId: data.id });
   }
   ```

4. **Webhook Handler**
   ```javascript
   // /api/webhooks/zaprite.js
   export default async function handler(req, res) {
     const { event, order_id, external_uniq_id, signature } = req.body;

     // Verify signature
     if (!verifyWebhook(req.body, signature)) {
       return res.status(401).json({ error: 'Invalid signature' });
     }

     // Confirm payment via API
     const orderStatus = await checkOrderStatus(order_id);

     if (event === 'order.paid' && orderStatus === 'paid') {
       // Generate access token
       const accessToken = generateAccessToken(external_uniq_id);

       // Return access token (user's browser will receive this via redirect)
       return res.json({ success: true, accessToken });
     }

     res.json({ success: false });
   }
   ```

5. **Client-Side Access Control**
   ```javascript
   // /js/access-control.js
   function checkAccess(demoId) {
     const userAccess = JSON.parse(localStorage.getItem('bsa_access') || '{}');

     // Check if demo is unlocked
     if (userAccess.unlockedDemos?.includes(demoId)) {
       return true;
     }

     // Check if user has active subscription
     if (userAccess.purchases) {
       for (const purchase of userAccess.purchases) {
         if (productIncludes(purchase.product, demoId)) {
           // Verify proof signature
           if (verifyProof(purchase.proof, purchase.orderId)) {
             return true;
           }
         }
       }
     }

     return false;
   }

   // Lock/unlock demos on page load
   document.addEventListener('DOMContentLoaded', () => {
     document.querySelectorAll('[data-demo-id]').forEach(demo => {
       const demoId = demo.dataset.demoId;
       if (!checkAccess(demoId)) {
         lockDemo(demo);
       } else {
         unlockDemo(demo);
       }
     });
   });
   ```

---

### Phase 2: Enhanced UX (Week 3-4)

1. **Payment Success Flow**
   - Animated unlock celebration (confetti, Bitcoin animation)
   - Automatic content reveal
   - "Share your achievement" social buttons

2. **Access Management Dashboard**
   - Show purchase history
   - Display unlocked content
   - Download payment receipts (Zaprite provides this)

3. **Promotional Features**
   - Trial period: "Try first demo free"
   - Bundle discounts: "Buy Curious + Builder, save 20%"
   - Referral system: "Invite a friend, both get 10% off"

---

### Phase 3: L402 Migration (Future)

**When to migrate:**
- User base is more technical
- Privacy concerns grow
- Micro-payments become primary model

**Migration path:**
1. Set up Lightning node (Voltage, Umbrel, or self-hosted LND)
2. Deploy Aperture reverse proxy
3. Implement L402 token handling in frontend
4. Offer L402 as "Advanced Payment Option" alongside Zaprite

**L402 Flow:**
```
User requests locked demo
  ↓
Server returns HTTP 402 + Lightning invoice
  ↓
User pays invoice via Lightning wallet
  ↓
Server returns L402 token (macaroon + preimage proof)
  ↓
User browser stores token, sends with future requests
  ↓
Content unlocked automatically
```

---

## 5. Security Considerations

### 1. Webhook Security
```javascript
// Always verify webhook signatures
const crypto = require('crypto');

function verifyWebhook(payload, signature) {
  const secret = process.env.ZAPRITE_WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  const computedSig = hmac.update(JSON.stringify(payload)).digest('hex');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSig)
  );
}
```

### 2. Access Token Verification
```javascript
// Generate JWT with short expiry for webhook responses
const jwt = require('jsonwebtoken');

function generateAccessToken(userId, product) {
  return jwt.sign(
    { userId, product, iat: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '10m' } // Short-lived for initial unlock
  );
}

// Then user exchanges JWT for permanent access credential
```

### 3. Prevent Token Sharing
```javascript
// Fingerprint browser to prevent token sharing
function generateFingerprint() {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset()
  ];

  return btoa(components.join('|'));
}

// Store fingerprint with access token
const accessData = {
  token: userToken,
  fingerprint: generateFingerprint(),
  verifiedAt: Date.now()
};
```

---

## 6. Cost Analysis

### Zaprite Costs
- **Base Fee**: $25/month flat (no transaction fees)
- **Lightning fees**: ~1 sat per transaction (negligible)
- **On-chain Bitcoin**: Network fees (user pays)
- **Credit card processing**: ~2.9% + $0.30 (if enabled)

### Expected Revenue (Example)

**Scenario**: 100 paid users/month

| Tier | Price | Users | Revenue |
|------|-------|-------|---------|
| Curious Path | $19 | 40 | $760 |
| Builder Path | $39 | 30 | $1,170 |
| Sovereign Path | $79 | 20 | $1,580 |
| Full Academy | $149 | 10 | $1,490 |
| **Total** | | **100** | **$5,000** |

**Net Revenue**: $5,000 - $25 (Zaprite) = **$4,975/month**

---

## 7. Testing Strategy

### Test Scenarios

1. **Happy Path**
   - User purchases Curious Path
   - Completes Lightning payment
   - Receives instant access
   - Content unlocks correctly

2. **Edge Cases**
   - Payment expires before completion
   - Webhook fails to deliver
   - User closes browser mid-payment
   - Multiple concurrent purchases

3. **Security Tests**
   - Attempt to forge webhook signature
   - Try to reuse expired access tokens
   - Attempt to share tokens across devices

### Test Mode

```javascript
// Use Zaprite test API keys (if provided)
const ZAPRITE_API_KEY = process.env.NODE_ENV === 'production'
  ? process.env.ZAPRITE_API_KEY_LIVE
  : process.env.ZAPRITE_API_KEY_TEST;

// Create test orders with $0.01 amounts
```

---

## 8. Analytics & Tracking

### Key Metrics to Track

1. **Conversion Funnel**
   - Visitors who click "Unlock Premium"
   - Users who reach checkout
   - Completed payments
   - Conversion rate by tier

2. **Revenue Metrics**
   - Total revenue by tier
   - Average transaction value
   - Lightning vs on-chain vs fiat ratio
   - Refund/chargeback rate

3. **User Behavior**
   - Most popular unlocked demos
   - Time between purchase and first content access
   - Repeat purchase rate (upgrading tiers)

### Privacy-Friendly Analytics

```javascript
// Use Plausible Analytics (already in platform)
// Track payment events without PII

plausible('Payment Started', {
  props: {
    tier: 'curious_path',
    method: 'lightning'
  }
});

plausible('Payment Completed', {
  props: {
    tier: 'curious_path',
    method: 'lightning',
    value: 50000 // sats
  }
});
```

---

## 9. Roadmap

### Q1 2025: Foundation
- ✅ Complete Zaprite API research
- 🔄 Set up Zaprite account and test environment
- 🔄 Design payment UI/UX
- ⏳ Implement basic checkout flow

### Q2 2025: Launch
- ⏳ Deploy serverless backend (Vercel Functions)
- ⏳ Integrate webhook handlers
- ⏳ Launch with 3 pricing tiers
- ⏳ Beta test with 20 users

### Q3 2025: Optimization
- ⏳ A/B test pricing tiers
- ⏳ Add promotional features
- ⏳ Implement referral system
- ⏳ Optimize conversion funnel

### Q4 2025: Advanced Features
- ⏳ Research L402 integration
- ⏳ Build demo-level micro-payments
- ⏳ Add subscription options
- ⏳ Implement Lightning Address tips

---

## 10. Next Steps

### Immediate Actions (This Week)

1. **✅ DONE**: Research Zaprite API capabilities
2. **TODO**: Create Zaprite account at app.zaprite.com
3. **TODO**: Generate API keys and test credentials
4. **TODO**: Design pricing page mockup
5. **TODO**: Decide on initial pricing tiers

### Development Tasks (Next 2 Weeks)

1. Create `/api/create-order.js` serverless function
2. Create `/api/webhooks/zaprite.js` webhook handler
3. Build payment UI components
4. Implement localStorage access control
5. Test end-to-end payment flow

### Documentation Needed

1. User guide: "How to Purchase with Bitcoin"
2. FAQ: "What payment methods are accepted?"
3. Privacy policy update: "We don't store your payment info"
4. Terms of service: "Lifetime access to purchased content"

---

## Resources

### Official Documentation
- Zaprite API: https://api.zaprite.com
- Zaprite Developers: https://zaprite.com/developers
- Zaprite Help: https://help.zaprite.com

### L402 Protocol (Future)
- L402 Spec: https://github.com/lightninglabs/L402
- Aperture Proxy: https://github.com/lightninglabs/aperture
- Boltwall Middleware: https://github.com/Tierion/boltwall
- Lightning Labs Guide: https://docs.lightning.engineering/the-lightning-network/l402

### Community Examples
- Python Zaprite Client: https://github.com/proofofjogi/zaprite-client
- WooCommerce Plugin: https://github.com/ZapriteApp/zaprite-for-woocommerce

---

**Last Updated**: 2025-01-15
**Author**: Claude Code
**Status**: Planning Phase
**Next Review**: After Zaprite account setup
