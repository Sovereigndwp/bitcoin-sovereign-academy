# Payment Token Flow Documentation

## Overview

This document describes how JWT access tokens are generated and delivered to users after successful payment.

## Architecture

### Flow Diagram

```
User → Checkout → Payment Gateway → Webhook → Token Generation → Email + Redirect → User Access
```

## Detailed Flow

### 1. User Initiates Checkout

**Frontend**: `checkout.html`

```javascript
const checkoutData = {
  items: cartItems,
  provider: 'stripe', // or 'btcpay'
  email: 'user@example.com',
  successUrl: 'https://bitcoinsovereign.academy/checkout.html?success=true',
  cancelUrl: 'https://bitcoinsovereign.academy/checkout.html?canceled=true'
};

const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(checkoutData)
});

const { url } = await response.json();
window.location.href = url; // Redirect to payment gateway
```

### 2. Payment Session Created

**Backend**: `api/stripe.ts` or `api/btcpay.ts`

The checkout endpoint modifies the success URL to include the session/invoice ID:

**Stripe**:
```
successUrl: checkout.html?success=true&session_id={CHECKOUT_SESSION_ID}
```

**BTCPay**:
```
successUrl: checkout.html?success=true&provider=btcpay&invoice_id={invoiceId}
```

This allows the frontend to retrieve the token after successful payment.

### 3. User Completes Payment

User is redirected to payment gateway (Stripe or BTCPay) and completes payment.

### 4. Payment Gateway Sends Webhook

**Stripe**: Sends `checkout.session.completed` event
**BTCPay**: Sends `InvoiceSettled` event

### 5. Backend Processes Webhook

**File**: `api/index.ts` - `webhookStripe()` or `webhookBTCPay()`

```typescript
// Extract email and items from webhook
const { email, items } = await handlePaymentSuccess(session);

// Grant entitlement
const entitlement = grantEntitlement(email, items);

// Generate JWT token
const token = generateAccessToken(entitlement);

// Send email with token
await sendAccessTokenEmail({
  email,
  token,
  modules: entitlement.modules,
  paths: entitlement.paths,
  totalPaid: amount
});
```

The token is stored in memory (or database in production) and associated with the user's email.

### 6. User Redirected to Success Page

User is redirected to:
```
checkout.html?success=true&session_id=cs_xxx123
```

### 7. Frontend Retrieves Token

**Frontend**: `checkout.html` JavaScript

```javascript
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');
const provider = urlParams.get('provider') || 'stripe';

if (sessionId) {
  // Fetch token from API
  const response = await fetch(
    `/api/get-token?session_id=${sessionId}&provider=${provider}`
  );

  const data = await response.json();

  if (data.success) {
    // Display token to user
    displayToken(data.token);

    // Store in localStorage
    localStorage.setItem('accessToken', data.token);

    // Redirect to member area
    window.location.href = `/?token=${encodeURIComponent(data.token)}`;
  }
}
```

### 8. Token Delivered via Email

**File**: `api/email.ts` - `sendAccessTokenEmail()`

Email contains:
1. **Direct access link**: `https://bitcoinsovereign.academy?token=JWT_TOKEN`
2. **Token display**: Full JWT token visible in email
3. **Instructions**: How to manually enter token if needed

Email HTML template:
```html
<a href="https://bitcoinsovereign.academy?token=JWT_TOKEN">
  🚀 Access Your Content
</a>

<p>Your Access Token:</p>
<code>JWT_TOKEN_HERE</code>
```

### 9. User Accesses Content

User can access content by:

**Option A**: Clicking email link (auto-login)
```
https://bitcoinsovereign.academy?token=JWT_TOKEN
```

**Option B**: Clicking redirect link after checkout
```
https://bitcoinsovereign.academy?token=JWT_TOKEN
```

**Option C**: Manually entering token on site

Frontend reads token from URL or localStorage and sends it with API requests:

```javascript
const token = getTokenFromURLOrStorage();

fetch('/api/verify', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## API Endpoints

### GET /api/get-token

Retrieve JWT token after successful payment.

**Parameters**:
- `session_id` (Stripe) - Checkout session ID
- `invoice_id` (BTCPay) - Invoice ID
- `provider` - Payment provider ('stripe' or 'btcpay')

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "modules": ["curious-what-is-money", "curious-bitcoin-basics"],
  "paths": ["curious"],
  "purchaseDate": "2024-11-04T12:00:00.000Z"
}
```

### POST /api/verify

Verify user's access token and check permissions.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters** (optional):
- `module` - Check access to specific module
- `path` - Check access to specific path

**Response**:
```json
{
  "authorized": true,
  "entitlement": {
    "userId": "abc123",
    "email": "user@example.com",
    "modules": ["module-1", "module-2"],
    "paths": ["curious"],
    "purchaseDate": "2024-11-04T12:00:00.000Z"
  }
}
```

## JWT Token Structure

### Payload

```json
{
  "userId": "hash-of-email",
  "email": "user@example.com",
  "modules": ["curious-what-is-money", "curious-bitcoin-basics"],
  "paths": ["curious"],
  "purchaseDate": "2024-11-04T12:00:00.000Z",
  "iat": 1699104000,
  "exp": 1730640000
}
```

### Signature

- Algorithm: HS256
- Secret: `JWT_SECRET` environment variable
- Expiry: 1 year (365 days)

## Token Security

### Generation
- Uses `jsonwebtoken` library
- Signed with HMAC-SHA256
- Includes expiration timestamp
- Cannot be forged without secret key

### Verification
- Server verifies signature before granting access
- Checks expiration date
- Validates payload structure

### Storage
- **Client**: localStorage (optional) or URL parameter
- **Server**: In-memory (development) or database (production)

## Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-256-bit-secret-key

# Email Service
EMAIL_PROVIDER=resend
EMAIL_API_KEY=your-email-api-key
FROM_EMAIL=noreply@bitcoinsovereign.academy
FROM_NAME=Bitcoin Sovereign Academy

# Payment Providers
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

BTCPAY_URL=https://btcpay.example.com
BTCPAY_API_KEY=your-api-key
BTCPAY_STORE_ID=your-store-id
BTCPAY_WEBHOOK_SECRET=your-webhook-secret

# CORS
ALLOWED_ORIGIN=https://bitcoinsovereign.academy
```

## Testing the Flow

### 1. Test Stripe Webhook Locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test payment
stripe trigger checkout.session.completed
```

### 2. Test Token Generation

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "stripe",
    "email": "test@example.com",
    "items": [{"type": "path", "id": "curious", "title": "Curious Path", "priceUSD": 29}],
    "successUrl": "http://localhost:3000/checkout.html?success=true",
    "cancelUrl": "http://localhost:3000/checkout.html?canceled=true"
  }'
```

### 3. Test Token Retrieval

```bash
curl "http://localhost:3000/api/get-token?session_id=cs_test_xxx&provider=stripe"
```

### 4. Test Token Verification

```bash
curl http://localhost:3000/api/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## Troubleshooting

### Token Not Generated

**Problem**: User completes payment but doesn't receive token

**Solutions**:
1. Check webhook delivery in Stripe/BTCPay dashboard
2. Review webhook logs: `console.log` in webhook handler
3. Verify `JWT_SECRET` is set
4. Check email service configuration

### Token Invalid

**Problem**: Token verification fails

**Solutions**:
1. Check token hasn't expired (1 year limit)
2. Verify `JWT_SECRET` matches between generation and verification
3. Ensure token is being passed correctly in Authorization header
4. Check for typos in token string

### Email Not Sent

**Problem**: Token generated but email not delivered

**Solutions**:
1. Verify `EMAIL_API_KEY` is correct
2. Check email provider status (Resend/SendGrid)
3. Review email service logs
4. Check spam folder
5. Verify `FROM_EMAIL` domain is authenticated

### Redirect Loop

**Problem**: User stuck in redirect after payment

**Solutions**:
1. Check success URL format in checkout session
2. Verify session_id is being appended correctly
3. Check JavaScript in checkout.html for errors
4. Ensure `/api/get-token` endpoint is accessible

## Production Checklist

- [ ] Set strong `JWT_SECRET` (256-bit random string)
- [ ] Configure email service with API keys
- [ ] Set up Stripe/BTCPay webhooks
- [ ] Test full payment flow end-to-end
- [ ] Verify email delivery
- [ ] Test token verification on all content pages
- [ ] Set up monitoring for failed webhooks
- [ ] Configure proper CORS origins
- [ ] Test token expiration handling
- [ ] Document token refresh process (if needed)

## Future Enhancements

### Database Integration
Currently uses in-memory storage. Production should use:
- PostgreSQL/Supabase for entitlements
- Redis for session caching
- Persistent token storage

### Token Refresh
Implement refresh tokens for long-term access:
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (1 year)
- Automatic token refresh on expiry

### Multi-Device Support
Allow users to access from multiple devices:
- Device fingerprinting
- Session management
- Logout from other devices

### Analytics
Track token usage:
- Login frequency
- Content access patterns
- Device types
- Geographic distribution
