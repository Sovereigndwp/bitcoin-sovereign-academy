# Bitcoin Sovereign Academy - API Documentation

Payment processing and entitlement management system for Bitcoin Sovereign Academy.

## Overview

This API provides:
- **Pricing calculation** with volume discounts
- **Payment processing** via Stripe and BTCPay Server
- **Webhook handling** for payment confirmations
- **JWT-based access control** for purchased content

## Architecture

```
/api
├── types.ts          - TypeScript type definitions
├── pricing.ts        - Product catalog and pricing logic
├── stripe.ts         - Stripe payment integration
├── btcpay.ts         - BTCPay Server integration
├── entitlements.ts   - Access control and JWT management
└── index.ts          - Main API router (Vercel serverless functions)
```

## Endpoints

### `POST /api/cart/price`
Calculate cart pricing with discounts.

**Request:**
```json
{
  "items": [
    {
      "type": "module",
      "id": "curious-s1m1",
      "title": "What is Money?",
      "priceUSD": 9
    }
  ]
}
```

**Response:**
```json
{
  "items": [...],
  "subtotal": 27,
  "discount": 0,
  "total": 27,
  "currency": "USD"
}
```

### `POST /api/checkout`
Create a payment session (Stripe or BTCPay).

**Request:**
```json
{
  "items": [...],
  "provider": "stripe",
  "email": "user@example.com",
  "successUrl": "https://bitcoinsovereign.academy/success",
  "cancelUrl": "https://bitcoinsovereign.academy/cart"
}
```

**Response (Stripe):**
```json
{
  "provider": "stripe",
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Response (BTCPay):**
```json
{
  "provider": "btcpay",
  "invoiceId": "ABC123",
  "url": "https://btcpay.yourdomain.com/invoice/ABC123"
}
```

### `POST /api/webhooks/stripe`
Handle Stripe payment webhooks (internal use).

### `POST /api/webhooks/btcpay`
Handle BTCPay payment webhooks (internal use).

### `GET /api/verify`
Verify user access token.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query params:**
- `module` - Module ID to check access for
- `path` - Path ID to check access for

**Response:**
```json
{
  "authorized": true,
  "entitlement": {
    "userId": "abc123",
    "email": "user@example.com",
    "modules": ["curious-s1m1"],
    "paths": ["curious"],
    "purchaseDate": "2025-01-15T12:00:00Z"
  }
}
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Stripe
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# BTCPay Server
BTCPAY_URL=https://btcpay.yourdomain.com
BTCPAY_API_KEY=...
BTCPAY_STORE_ID=...
BTCPAY_WEBHOOK_SECRET=...

# JWT
JWT_SECRET=$(openssl rand -base64 32)
```

### 3. Deploy to Vercel

```bash
vercel --prod
```

Vercel will automatically:
- Detect TypeScript files in `/api`
- Create serverless functions for each endpoint
- Set up environment variables from your dashboard

### 4. Configure Webhooks

**Stripe:**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

**BTCPay Server:**
1. Access your BTCPay store settings
2. Go to Webhooks → Create Webhook
3. URL: `https://yourdomain.com/api/webhooks/btcpay`
4. Events: `InvoiceSettled`, `InvoiceExpired`, `InvoiceInvalid`
5. Secret: Use the value from `BTCPAY_WEBHOOK_SECRET`

## Payment Flow

### Stripe Flow

1. User adds items to cart
2. Frontend calls `POST /api/checkout` with `provider: "stripe"`
3. API creates Stripe checkout session
4. User completes payment on Stripe
5. Stripe sends webhook to `/api/webhooks/stripe`
6. API grants entitlement and generates JWT token
7. Email sent to user with access token

### BTCPay Flow

1. User adds items to cart
2. Frontend calls `POST /api/checkout` with `provider: "btcpay"`
3. API creates BTCPay invoice
4. User pays with Bitcoin
5. BTCPay sends webhook to `/api/webhooks/btcpay` when confirmed
6. API grants entitlement and generates JWT token
7. Email sent to user with access token

## Security

- **Environment Variables**: Never commit `.env.local` to version control
- **Webhook Verification**: All webhooks are cryptographically verified
- **JWT Tokens**: Signed with HS256, expire after 1 year
- **CORS**: Restricted to production domain only
- **Input Validation**: All cart items validated against catalog

## Testing

### Test Stripe Integration

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test BTCPay Integration

Use BTCPay's test mode or regtest network.

### Test Pricing

```bash
curl -X POST https://yourdomain.com/api/cart/price \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"type": "module", "id": "curious-s1m1", "title": "What is Money?", "priceUSD": 9}
    ]
  }'
```

## Product Catalog

Edit the catalog in `api/pricing.ts`:

```typescript
export const CATALOG = {
  paths: {
    curious: {
      id: 'curious',
      name: 'Curious Path',
      bundlePriceUSD: 49,
      modules: [...]
    }
  }
}
```

## Entitlements Storage

**Current**: In-memory storage (resets on deploy)

**Production**: Replace with a database:
- PostgreSQL (recommended)
- Supabase
- MongoDB
- Firebase

Update `api/entitlements.ts` to persist to your database.

## Email Notifications

TODO: Add email integration for sending access tokens.

Recommended services:
- SendGrid
- Mailgun
- AWS SES
- Resend

## Monitoring

Add logging to track:
- Payment attempts
- Failed transactions
- Webhook errors
- Access token generation

Recommended tools:
- Sentry (error tracking)
- LogRocket (session replay)
- Vercel Analytics

## Future Enhancements

- [ ] Subscription-based access
- [ ] Promo codes and coupons
- [ ] Affiliate system
- [ ] Gift cards
- [ ] Team/organization licenses
- [ ] Email automation
- [ ] Database persistence
- [ ] Admin dashboard

## Support

For questions or issues:
- GitHub Issues: https://github.com/your-org/bitcoin-sovereign-academy/issues
- Email: support@bitcoinsovereign.academy

## License

MIT License - see LICENSE file for details.
