# Payment System Security Architecture

## Security Principles

### 1. Defense in Depth
Multiple layers of security at every level - never rely on a single control.

### 2. Least Privilege
Every component gets only the minimum permissions needed.

### 3. Zero Trust
Never trust input. Verify everything, always.

### 4. Fail Secure
When something goes wrong, default to denying access.

### 5. Audit Everything
Log all security-relevant events for forensics.

## Threat Model

### Threats We're Protecting Against

1. **Payment Manipulation**
   - Attacker tries to get content without paying
   - Attacker modifies payment amount
   - Attacker reuses old payment confirmations

2. **Account Takeover**
   - Email interception during magic link flow
   - Session hijacking
   - Token theft

3. **Content Theft**
   - Direct access to premium content URLs
   - Sharing access tokens
   - Screen scraping / automation

4. **Denial of Service**
   - API flooding
   - Webhook spam
   - Database overload

5. **Data Breaches**
   - SQL injection
   - API key exposure
   - PII leakage

6. **Business Logic Attacks**
   - Promo code abuse
   - Refund fraud
   - Device limit bypass

## Security Controls by Layer

### Layer 1: Network & Infrastructure

#### Rate Limiting
```typescript
// Apply to ALL endpoints
- Authentication: 5 attempts / 15 minutes per IP
- Payment APIs: 10 requests / minute per IP
- Webhook endpoints: 100 requests / minute per provider
- Content APIs: 100 requests / minute per user
```

#### DDoS Protection
- Vercel's built-in DDoS protection
- Cloudflare (optional additional layer)
- Webhook signature verification (drops invalid requests immediately)

#### CORS Policy
```typescript
// Strict CORS - only allow your domain
{
  origin: ['https://bitcoinsovereign.academy'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

#### HTTPS Only
- All traffic encrypted with TLS 1.3
- HSTS headers enforced
- No mixed content allowed

### Layer 2: Authentication & Authorization

#### Magic Link Security
```typescript
// Token Generation
- Cryptographically random tokens (crypto.randomBytes(32))
- One-time use only
- 15-minute expiration
- Tied to specific email + IP address
- Invalidated after use

// Email Security
- Rate limit: 3 emails per hour per address
- Validate email format with strict regex
- Check disposable email domains blocklist
- Log all magic link requests

// Verification
- Constant-time comparison to prevent timing attacks
- Check expiration before validation
- Revoke token immediately after use
- Create session only after full validation
```

#### Session Management
```typescript
// Session Tokens
- 256-bit random tokens
- Stored as httpOnly, secure, sameSite cookies
- 7-day expiration with sliding window
- Tied to device fingerprint
- Invalidated on logout or suspicious activity

// Session Storage
- Sessions stored in database (not client-side)
- Include IP address, user agent, device ID
- Automatic cleanup of expired sessions
- Max 1 active session per device (configurable)
```

#### JWT for API Access
```typescript
// Structure
{
  user_id: uuid,
  device_id: uuid,
  entitlements: ['path_curious', 'demo_xyz'],
  exp: timestamp,
  iat: timestamp,
  jti: unique_token_id
}

// Security
- HS256 algorithm with 256-bit secret
- Short expiration (1 hour for content access)
- Refresh tokens for long-term access
- Signature verification on every request
- Token revocation list for compromised tokens
```

### Layer 3: Payment Security

#### Payment Flow Security
```typescript
// 1. Checkout Request Validation
- Verify product_id exists in catalog
- Validate price matches product
- Check user isn't already subscribed
- Rate limit: 10 checkouts / hour per user

// 2. Payment Provider Communication
- All API calls over HTTPS only
- API keys stored in environment variables
- Never log full API keys
- Verify SSL certificates
- Timeout after 30 seconds

// 3. Webhook Verification
BTCPay:
  - HMAC-SHA256 signature verification
  - Constant-time comparison
  - Verify payload structure
  - Check invoice hasn't been processed before
  - Confirm amounts match

Stripe:
  - Use official Stripe SDK
  - Verify webhook signature with Stripe's library
  - Check event hasn't been processed
  - Validate amounts and currency

// 4. Idempotency
- Track processed webhook IDs
- Prevent duplicate processing
- Use database transactions
- Rollback on any error
```

#### Payment Amount Validation
```typescript
// Never trust client-side amounts
function validatePayment(webhookData) {
  // 1. Get expected price from server-side product catalog
  const expectedPrice = PRODUCTS[webhookData.product_id].price;
  
  // 2. Get amount from payment provider
  const paidAmount = webhookData.amount;
  
  // 3. Verify they match exactly
  if (paidAmount !== expectedPrice) {
    await logSecurityEvent('PRICE_MISMATCH', {
      expected: expectedPrice,
      received: paidAmount,
      invoice_id: webhookData.invoice_id
    });
    throw new Error('Payment amount mismatch');
  }
  
  // 4. Only then grant entitlement
  await grantEntitlement(webhookData.user_id, webhookData.product_id);
}
```

### Layer 4: Content Protection

#### API-Gated Content
```typescript
// Premium content is NEVER served as static files
// Instead:

// 1. Client requests content with access token
GET /api/content/demo/xyz
Authorization: Bearer <jwt_token>

// 2. Server validates token and entitlement
async function getContent(req) {
  // Verify JWT signature
  const payload = verifyJWT(req.headers.authorization);
  
  // Check user has access to this specific content
  const hasAccess = await checkEntitlement(
    payload.user_id,
    req.params.content_id
  );
  
  if (!hasAccess) {
    return 403; // Forbidden
  }
  
  // Check device is authorized
  const deviceValid = await verifyDevice(
    payload.device_id,
    req.headers['user-agent']
  );
  
  if (!deviceValid) {
    return 401; // Unauthorized
  }
  
  // Generate short-lived signed URL (5 minutes)
  const signedUrl = generateSignedURL(req.params.content_id, 300);
  
  return { url: signedUrl };
}

// 3. Client fetches from signed URL
// URL expires after 5 minutes and can't be shared
```

#### Signed URLs
```typescript
// For video/interactive content that can't be proxied
function generateSignedURL(contentId: string, expiresIn: number) {
  const expires = Date.now() + (expiresIn * 1000);
  const signature = crypto
    .createHmac('sha256', process.env.CONTENT_SIGNING_KEY)
    .update(`${contentId}:${expires}`)
    .digest('hex');
  
  return `https://content.bitcoinsovereign.academy/${contentId}?expires=${expires}&sig=${signature}`;
}

// Verification on content server
function verifySignedURL(req) {
  const { expires, sig } = req.query;
  
  // Check expiration
  if (Date.now() > parseInt(expires)) {
    return false;
  }
  
  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.CONTENT_SIGNING_KEY)
    .update(`${req.params.contentId}:${expires}`)
    .digest('hex');
  
  // Constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expectedSig)
  );
}
```

### Layer 5: Database Security

#### SQL Injection Prevention
```typescript
// ALWAYS use parameterized queries
// NEVER concatenate user input

// ❌ WRONG
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ CORRECT
const query = {
  text: 'SELECT * FROM users WHERE email = $1',
  values: [email]
};

// Use ORM or query builder that handles this automatically
```

#### Row Level Security (RLS)
```sql
-- Enable RLS on all user data tables
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- Users can only see their own entitlements
CREATE POLICY entitlements_select_own ON entitlements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users cannot modify entitlements (only server can)
CREATE POLICY entitlements_no_update ON entitlements
  FOR UPDATE
  USING (false);
```

#### Connection Security
```typescript
// Use connection pooling
// Encrypt connections
// Rotate credentials regularly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
```

### Layer 6: Input Validation

#### Strict Validation on ALL Inputs
```typescript
// Email
function validateEmail(email: string): boolean {
  // Length check
  if (email.length > 255) return false;
  
  // Format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Disposable email check
  if (isDisposableEmail(email)) return false;
  
  return true;
}

// Product ID
function validateProductId(productId: string): boolean {
  // Whitelist approach - only allow known products
  const validProducts = Object.keys(PRODUCTS);
  return validProducts.includes(productId);
}

// Content ID
function validateContentId(contentId: string): boolean {
  // Only alphanumeric and specific characters
  return /^[a-z0-9_-]+$/.test(contentId) && contentId.length <= 100;
}

// Amount
function validateAmount(amount: number): boolean {
  // Must be positive
  if (amount <= 0) return false;
  
  // Must be reasonable (no billion dollar purchases)
  if (amount > 10000) return false;
  
  // Must have max 2 decimal places
  return (amount * 100) % 1 === 0;
}
```

### Layer 7: Secrets Management

#### Environment Variables
```bash
# NEVER commit secrets to git
# ALWAYS use environment variables
# ROTATE regularly

# Required secrets:
JWT_SECRET=<256-bit-random>
CONTENT_SIGNING_KEY=<256-bit-random>
DATABASE_URL=<encrypted-connection>
BTCPAY_API_KEY=<btcpay-secret>
BTCPAY_WEBHOOK_SECRET=<256-bit-random>
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
EMAIL_API_KEY=<email-provider-key>
```

#### Secret Rotation
```typescript
// Support multiple active secrets during rotation
const JWT_SECRETS = [
  process.env.JWT_SECRET_CURRENT,  // Primary
  process.env.JWT_SECRET_PREVIOUS  // Still valid during rotation
];

function verifyJWT(token: string) {
  // Try current secret first
  try {
    return jwt.verify(token, JWT_SECRETS[0]);
  } catch (err) {
    // Fall back to previous secret
    try {
      return jwt.verify(token, JWT_SECRETS[1]);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
```

### Layer 8: Device Management

#### Device Fingerprinting
```typescript
// Client-side (non-sensitive)
function generateDeviceFingerprint() {
  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    platform: navigator.platform
  };
  
  // Hash on client, send to server
  return await crypto.subtle.digest('SHA-256', JSON.stringify(data));
}

// Server-side validation
async function validateDevice(userId: string, deviceFingerprint: string, userAgent: string) {
  // Get active devices for user
  const activeDevices = await db.query(
    'SELECT * FROM devices WHERE user_id = $1 AND is_active = true',
    [userId]
  );
  
  // Enforce device limit
  if (activeDevices.length === 0) {
    // First device - allow and register
    await registerDevice(userId, deviceFingerprint, userAgent);
    return true;
  }
  
  // Check if this device is already registered
  const knownDevice = activeDevices.find(d => d.device_fingerprint === deviceFingerprint);
  
  if (knownDevice) {
    // Update last active timestamp
    await db.query(
      'UPDATE devices SET last_active_at = NOW() WHERE id = $1',
      [knownDevice.id]
    );
    return true;
  }
  
  // New device - deactivate old one
  if (activeDevices.length >= 1) {
    await db.query(
      'UPDATE devices SET is_active = false WHERE user_id = $1',
      [userId]
    );
    
    await registerDevice(userId, deviceFingerprint, userAgent);
    return true;
  }
  
  return false;
}
```

### Layer 9: Logging & Monitoring

#### Security Event Logging
```typescript
// Log all security-relevant events
interface SecurityEvent {
  event_type: 'AUTH_FAILURE' | 'PAYMENT_MISMATCH' | 'RATE_LIMIT_HIT' | 'SUSPICIOUS_ACTIVITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  user_id?: string;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

async function logSecurityEvent(event: SecurityEvent) {
  // Log to database
  await db.query(
    'INSERT INTO security_events (event_type, severity, user_id, ip_address, metadata) VALUES ($1, $2, $3, $4, $5)',
    [event.event_type, event.severity, event.user_id, event.ip_address, event.metadata]
  );
  
  // Alert on critical events
  if (event.severity === 'CRITICAL') {
    await sendAlert(event);
  }
}
```

#### What to Log
```typescript
// ✅ DO LOG:
- Authentication attempts (success and failure)
- Payment events (initiated, completed, failed)
- Entitlement grants and revocations
- Device registrations and switches
- API rate limit hits
- Webhook failures
- Database errors
- Unusual access patterns

// ❌ DON'T LOG:
- Full API keys or secrets
- Magic link tokens
- Session tokens
- Payment card numbers
- Passwords (we don't have any!)
```

### Layer 10: Code Security

#### Dependency Security
```bash
# Audit dependencies regularly
npm audit
npm audit fix

# Use specific versions (not ^)
# Review dependency changes
# Use Snyk or Dependabot for alerts
```

#### Type Safety
```typescript
// Use TypeScript for type safety
// This prevents entire classes of bugs

// ❌ JavaScript
function grantAccess(userId, contentId) {
  // What if userId is undefined?
  // What if contentId is wrong type?
}

// ✅ TypeScript
function grantAccess(userId: string, contentId: string): Promise<void> {
  // Compiler ensures correct types
  // IDE catches errors immediately
}
```

## Attack Scenarios & Mitigations

### Scenario 1: Attacker Tries to Access Premium Content Without Paying

**Attack:**
```bash
# Try to guess content URL
GET /api/content/premium-demo-xyz
```

**Defense:**
1. All premium content requires valid JWT
2. JWT contains user_id and entitlements
3. Server checks database for active entitlement
4. Content is served via short-lived signed URL
5. Direct access attempts logged as suspicious

### Scenario 2: Attacker Intercepts Magic Link

**Attack:**
- Intercepts email containing magic link
- Tries to use link to access account

**Defense:**
1. Magic link includes IP address check (optional warning if mismatch)
2. Link expires after 15 minutes
3. One-time use only (invalidated after click)
4. Email sent with plaintext warning about security
5. User receives email notification of new device login

### Scenario 3: Attacker Modifies Payment Amount

**Attack:**
```javascript
// Try to modify checkout request
fetch('/api/checkout', {
  body: JSON.stringify({
    product_id: 'all_access',
    amount: 0.01  // Try to pay 1 cent instead of $149
  })
})
```

**Defense:**
1. Server NEVER trusts client-provided amounts
2. Amount is looked up from server-side product catalog
3. Webhook verification checks amount matches expected price
4. Mismatches logged and flagged for review
5. Entitlement only granted if amounts match exactly

### Scenario 4: Attacker Replays Old Webhook

**Attack:**
```bash
# Capture old webhook payload
# Replay it to get another entitlement
POST /api/webhooks/btcpay
Body: <old_successful_payment>
```

**Defense:**
1. Webhook signature verification (prevents tampering)
2. Invoice ID tracked in database
3. Check if already processed
4. Reject duplicates immediately
5. Log replay attempts

### Scenario 5: Attacker Shares Access Token

**Attack:**
- User shares JWT with friend
- Both try to access content

**Defense:**
1. JWT tied to device fingerprint
2. Device fingerprint verified on each request
3. Device fingerprint mismatch triggers token revocation
4. Max 1 active device enforced
5. Suspicious activity logged

## Security Checklist

### Pre-Launch
- [ ] All secrets in environment variables
- [ ] No secrets in git history
- [ ] Rate limiting enabled on all endpoints
- [ ] CORS configured strictly
- [ ] HTTPS enforced everywhere
- [ ] Database RLS policies active
- [ ] All inputs validated
- [ ] SQL injection impossible (parameterized queries)
- [ ] XSS protection (Content-Security-Policy)
- [ ] CSRF protection (SameSite cookies)
- [ ] Webhook signatures verified
- [ ] Payment amounts verified server-side
- [ ] Content requires authentication
- [ ] Sessions expire appropriately
- [ ] Logging configured
- [ ] Error messages don't leak info
- [ ] Dependencies audited

### Ongoing
- [ ] Monitor security logs daily
- [ ] Rotate secrets quarterly
- [ ] Update dependencies monthly
- [ ] Review access patterns weekly
- [ ] Test auth flows monthly
- [ ] Audit database quarterly
- [ ] Review rate limits monthly
- [ ] Check for unusual payments daily

## Emergency Response

### If API Key is Compromised
1. Immediately revoke in BTCPay/Stripe dashboard
2. Generate new key
3. Update environment variables
4. Deploy immediately
5. Review logs for unauthorized usage
6. Invalidate all sessions if necessary

### If Database is Breached
1. Take site offline immediately
2. Assess scope of breach
3. Notify affected users within 72 hours (GDPR)
4. Reset all magic link tokens
5. Invalidate all sessions
6. Force re-authentication
7. Review and patch vulnerability
8. Conduct full security audit

### If Payment Fraud Detected
1. Flag user account
2. Suspend entitlements
3. Contact payment provider
4. Review similar transactions
5. Refund if necessary
6. Update fraud detection rules

---

**Remember:** Security is not a feature, it's a requirement. Every line of code must be written with security in mind.
