# 🔧 Security Fixes - Quick Implementation Guide

**For:** Bitcoin Sovereign Academy Development Team
**Priority:** CRITICAL - Implement before processing any real payments

---

## ⚡ Critical Fix #1: Server-Side JWT Verification

### Problem
JWT tokens are only validated client-side, allowing anyone to forge tokens and access paid content.

### Solution

**Step 1:** Add server-side verification endpoint

Create `/api/verify-content.ts`:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAccessToken, hasModuleAccess } from './entitlements';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    const moduleId = req.query.module as string;

    if (!token) {
        return res.status(401).json({ authorized: false, error: 'No token provided' });
    }

    if (!moduleId) {
        return res.status(400).json({ authorized: false, error: 'Module ID required' });
    }

    try {
        const entitlement = verifyAccessToken(token);
        const hasAccess = hasModuleAccess(entitlement.email, moduleId);

        if (!hasAccess) {
            return res.status(403).json({
                authorized: false,
                error: 'Access denied for this module'
            });
        }

        return res.status(200).json({
            authorized: true,
            modules: entitlement.modules,
            paths: entitlement.paths
        });
    } catch (err) {
        return res.status(401).json({
            authorized: false,
            error: 'Invalid or expired token'
        });
    }
}
```

**Step 2:** Update all module pages

Add to each module HTML file (e.g., `/paths/curious-s1m1/index.html`):

```html
<script>
async function verifyAccessBeforeLoad() {
    const token = localStorage.getItem('bsa_access_token');
    const moduleId = 'curious-s1m1'; // Change per module

    if (!token) {
        window.location.href = '/checkout.html?module=' + moduleId;
        return false;
    }

    try {
        const response = await fetch(`/api/verify-content?module=${moduleId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.authorized) {
            console.error('Access denied:', data.error);
            window.location.href = '/checkout.html?module=' + moduleId;
            return false;
        }

        console.log('✅ Access verified for module:', moduleId);
        return true;
    } catch (error) {
        console.error('Verification failed:', error);
        window.location.href = '/checkout.html?module=' + moduleId;
        return false;
    }
}

// Run before showing content
document.addEventListener('DOMContentLoaded', async () => {
    const hasAccess = await verifyAccessBeforeLoad();
    if (!hasAccess) {
        document.body.style.display = 'none';
    } else {
        document.body.style.display = 'block';
    }
});
</script>
```

---

## ⚡ Critical Fix #2: Deploy Database (Replace In-Memory Storage)

### Problem
All user data and entitlements are lost when serverless functions restart.

### Solution

**Step 1:** Deploy database schema

```bash
# Go to Supabase dashboard
# SQL Editor → New query → Paste contents of database/schema.sql → Run

# Or use CLI:
supabase db push
```

**Step 2:** Add environment variables

```bash
# Add to Vercel project settings:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
JWT_SECRET=$(openssl rand -base64 64)
```

**Step 3:** Update `api/entitlements.ts`

Replace lines 13-63 with:

```typescript
import {
    createEntitlement,
    findEntitlementByEmail,
    addModulesToEntitlement,
    addPathsToEntitlement
} from './database';

/**
 * Create or update entitlement for a user after successful payment
 */
export async function grantEntitlement(email: string, purchasedItems: CartItem[]): Promise<Entitlement> {
    // Get existing entitlement
    const existing = await findEntitlementByEmail(email);

    const modules = new Set(existing?.modules || []);
    const paths = new Set(existing?.paths || []);

    // Process purchased items
    for (const item of purchasedItems) {
        if (item.type === 'module') {
            modules.add(item.id);
        } else if (item.type === 'path') {
            paths.add(item.id);
            const pathModules = getModulesForPath(item.id);
            pathModules.forEach(moduleId => modules.add(moduleId));
        } else if (item.type === 'bundle') {
            if (item.id === 'all-paths') {
                paths.add('curious');
                paths.add('builder');
                paths.add('sovereign');
                paths.add('principled');
            }
        }
    }

    const entitlement: Entitlement = {
        userId: existing?.userId || generateUserId(email),
        email,
        modules: Array.from(modules),
        paths: Array.from(paths),
        purchaseDate: existing?.purchaseDate || new Date().toISOString(),
    };

    // Save to database
    if (existing) {
        await updateEntitlement(entitlement.userId, entitlement.modules, entitlement.paths);
    } else {
        await createEntitlement({
            userId: entitlement.userId,
            modules: entitlement.modules,
            paths: entitlement.paths
        });
    }

    return entitlement;
}

/**
 * Get entitlement for a user
 */
export async function getEntitlement(email: string): Promise<Entitlement | null> {
    return await findEntitlementByEmail(email);
}
```

**Step 4:** Test database connection

```bash
# Add health check endpoint
curl https://your-domain.com/api/health

# Should return:
# { "status": "healthy", "checks": { "database": true } }
```

---

## ⚡ Critical Fix #3: Fix JWT Secret

### Problem
Hardcoded fallback JWT secret allows anyone to forge tokens.

### Solution

**Step 1:** Generate strong secret

```bash
# Generate 64-character secret
openssl rand -base64 64

# Output example:
# s7K9mN2pQ4vR8tW6xY1zA3bC5dE7fG9hJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0e
```

**Step 2:** Add to Vercel environment

```bash
# Via CLI:
vercel env add JWT_SECRET production
# Paste the generated secret when prompted

# Or via dashboard:
# Vercel Project → Settings → Environment Variables
# Add: JWT_SECRET = [your generated secret]
```

**Step 3:** Update `api/auth.ts`

Replace lines 455-469:

```typescript
export function generateJWTToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET;

    // CRITICAL: Never allow fallback secrets
    if (!secret) {
        throw new Error('FATAL: JWT_SECRET not configured. Cannot generate tokens.');
    }

    if (secret.length < 32) {
        throw new Error('FATAL: JWT_SECRET must be at least 32 characters.');
    }

    return jwt.sign(
        {
            userId,
            email,
            type: 'access',
            iat: Math.floor(Date.now() / 1000)
        },
        secret,
        {
            expiresIn: '30d',
            algorithm: 'HS256'
        }
    );
}

export function verifyJWTToken(token: string): {
    valid: boolean;
    userId?: string;
    email?: string;
} {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('FATAL: JWT_SECRET not configured. Cannot verify tokens.');
    }

    try {
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256']
        }) as any;

        return {
            valid: true,
            userId: decoded.userId,
            email: decoded.email
        };
    } catch (error) {
        console.error('JWT verification failed:', error);
        return { valid: false };
    }
}
```

**Step 4:** Add startup validation

Add to top of `api/index.ts`:

```typescript
// Validate critical environment variables on startup
function validateEnvironment() {
    const required = ['JWT_SECRET', 'STRIPE_SECRET', 'SUPABASE_URL'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`FATAL: Missing environment variables: ${missing.join(', ')}`);
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        throw new Error('FATAL: JWT_SECRET must be at least 32 characters');
    }

    console.log('✅ Environment validation passed');
}

// Run on cold start
validateEnvironment();
```

---

## ⚡ High Priority Fix #4: Webhook Signature Verification

### Problem
Webhook signatures aren't properly verified, allowing fake payment confirmations.

### Solution

**Step 1:** Install required package

```bash
npm install micro
```

**Step 2:** Update `api/webhooks/stripe.ts`

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'micro';
import { verifyStripeWebhook, handleStripePaymentSuccess } from '../stripe';
import { grantEntitlement, generateAccessToken } from '../entitlements';
import { sendAccessTokenEmail } from '../email';

export const config = {
    api: {
        bodyParser: false, // CRITICAL: Disable body parsing for webhook verification
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get raw body buffer
        const buf = await buffer(req);
        const rawBody = buf.toString('utf8');

        // Get signature from header
        const signature = req.headers['stripe-signature'];

        if (!signature || typeof signature !== 'string') {
            console.error('Missing Stripe signature header');
            return res.status(400).json({ error: 'Missing signature' });
        }

        // Verify signature
        let event;
        try {
            event = verifyStripeWebhook(rawBody, signature);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        console.log('✅ Webhook verified:', event.type, event.id);

        // Handle checkout completion
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { email, items } = await handleStripePaymentSuccess(session);

            // Grant entitlement
            const entitlement = grantEntitlement(email, items);
            const token = generateAccessToken(entitlement);

            // Send email
            await sendAccessTokenEmail({
                email,
                token,
                modules: entitlement.modules,
                paths: entitlement.paths,
                totalPaid: session.amount_total ? session.amount_total / 100 : 0
            });

            console.log(`✅ Access granted to ${email}`);
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error('Webhook handler error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

**Step 3:** Update `api/webhooks/btcpay.ts` similarly

```typescript
import { buffer } from 'micro';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const buf = await buffer(req);
        const rawBody = buf.toString('utf8');
        const signature = req.headers['btcpay-sig'];

        if (!signature || typeof signature !== 'string') {
            return res.status(400).json({ error: 'Missing signature' });
        }

        const verification = verifyBTCPayWebhook(rawBody, signature);

        if (!verification.valid) {
            console.error('BTCPay webhook signature verification failed');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // ... rest of handler
    } catch (err: any) {
        console.error('Webhook handler error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

---

## ⚡ High Priority Fix #5: Rate Limiting

### Problem
No rate limiting allows brute force attacks and DoS.

### Solution

**Step 1:** Install rate limiter

```bash
npm install express-rate-limit
```

**Step 2:** Create `api/middleware/rate-limit.ts`

```typescript
import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many login attempts, please try again later',
    skipSuccessfulRequests: true,
});

export const webhookRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Webhook rate limit exceeded',
});
```

**Step 3:** Apply to endpoints

```typescript
// In api/verify-content.ts
import { apiRateLimiter } from './middleware/rate-limit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    await apiRateLimiter(req, res);
    // ... rest of handler
}
```

---

## 🧪 Testing Your Fixes

### Test 1: JWT Verification

```bash
# Valid token should work
curl -H "Authorization: Bearer YOUR_VALID_TOKEN" \
  https://your-domain.com/api/verify-content?module=curious-s1m1

# Expected: {"authorized":true}

# Fake token should fail
curl -H "Authorization: Bearer fake.token.here" \
  https://your-domain.com/api/verify-content?module=curious-s1m1

# Expected: {"authorized":false,"error":"Invalid or expired token"}
```

### Test 2: Database Connection

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Expected: {"status":"healthy","checks":{"database":true}}
```

### Test 3: Webhook Signature

```bash
# Use Stripe CLI to test
stripe listen --forward-to https://your-domain.com/api/webhooks/stripe

# Trigger test payment
stripe trigger checkout.session.completed

# Check logs for "✅ Webhook verified"
```

### Test 4: Rate Limiting

```bash
# Send 10 requests rapidly
for i in {1..10}; do
  curl https://your-domain.com/api/verify-content?module=test
done

# Requests 6-10 should return 429 Too Many Requests
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Database schema deployed to Supabase
- [ ] All environment variables set in Vercel
- [ ] JWT_SECRET is 64+ characters
- [ ] Server-side verification endpoint deployed
- [ ] All module pages updated with verification script
- [ ] Webhook signature verification implemented
- [ ] Rate limiting configured
- [ ] Health check endpoint working
- [ ] Test payment processed successfully
- [ ] Email delivery confirmed
- [ ] Monitor for errors in first 24 hours

---

## 🆘 Emergency Rollback

If issues occur after deployment:

```bash
# Revert to previous deployment
vercel rollback

# Check deployment list
vercel list

# Roll back to specific deployment
vercel rollback [deployment-url]
```

---

## 📞 Need Help?

- Slack: #security-team
- Email: security@bitcoinsovereign.academy
- Emergency: Call dev lead immediately

---

**Document Version:** 1.0
**Last Updated:** November 4, 2025
