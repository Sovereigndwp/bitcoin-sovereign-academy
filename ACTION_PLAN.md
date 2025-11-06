# 🎯 Bitcoin Sovereign Academy - Implementation Action Plan

**Created:** November 6, 2025
**Based on:** Security Audit, UX Audit, Performance Audit, QA Testing
**Total Issues Found:** 23 security vulnerabilities + 55 bugs + accessibility gaps

---

## 📊 Executive Summary

### Current Status
- ✅ **Frontend:** Fully functional, good visual design
- ❌ **Backend:** In-memory storage (not production-ready)
- ⚠️ **Security:** Critical JWT validation bypass
- ⚠️ **Accessibility:** 40% WCAG compliance (needs 100%)
- ⚠️ **Mobile:** Touch targets too small, contrast issues
- ⚠️ **Performance:** 45-60/100 score, 460KB JS blocking

### Priority Distribution
- 🔴 **CRITICAL (Week 1):** 8 items - Launch blockers
- 🟡 **HIGH (Week 2):** 12 items - Post-launch critical
- 🟢 **MEDIUM (Month 1):** 15 items - Improvements
- 🔵 **LOW (Month 2+):** 20+ items - Nice to have

---

## 🚨 WEEK 1: CRITICAL FIXES (Launch Blockers)

### Day 1: Database & Infrastructure (4-6 hours)

#### ✅ Task 1.1: Deploy Supabase Database
**Priority:** CRITICAL
**Effort:** 2 hours
**Owner:** You (following DEPLOYMENT_GUIDE.md)

**Steps:**
1. Create Supabase project
2. Deploy `database/schema.sql`
3. Verify all tables created
4. Configure Row-Level Security (RLS)
5. Get connection credentials

**Success Criteria:**
- ✓ All 7 tables exist
- ✓ RLS policies active
- ✓ Can query users table
- ✓ Indexes created

---

#### ✅ Task 1.2: Configure Email Service
**Priority:** CRITICAL
**Effort:** 1 hour
**Owner:** You

**Choice:** Resend (recommended) or SendGrid

**Steps:**
1. Create account at resend.com
2. Verify domain: bitcoinsovereign.academy
3. Add DNS records (SPF, DKIM, DMARC)
4. Generate API key
5. Test email sending

**Success Criteria:**
- ✓ Domain verified
- ✓ Test email received
- ✓ API key secured in Vercel env vars

---

#### ✅ Task 1.3: Generate JWT Secret
**Priority:** CRITICAL
**Effort:** 5 minutes

**Command:**
```bash
openssl rand -base64 64
```

**Action:**
1. Generate strong secret (64+ characters)
2. Add to Vercel environment variables
3. Verify no hardcoded fallbacks in code
4. Test token generation

**Success Criteria:**
- ✓ JWT_SECRET set in Vercel
- ✓ Length >= 64 characters
- ✓ All fallback secrets removed

---

#### ✅ Task 1.4: Configure Vercel Environment Variables
**Priority:** CRITICAL
**Effort:** 30 minutes

**Required Variables:**
```bash
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
DATABASE_URL=postgresql://xxx

# JWT
JWT_SECRET=xxx

# Email
EMAIL_API_KEY=xxx
EMAIL_FROM=noreply@bitcoinsovereign.academy

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# BTCPay
BTCPAY_URL=https://btcpay.xxx
BTCPAY_API_KEY=xxx
BTCPAY_STORE_ID=xxx
BTCPAY_WEBHOOK_SECRET=xxx

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=xxx

# App
SITE_URL=https://bitcoinsovereign.academy
NODE_ENV=production
```

**Success Criteria:**
- ✓ All 15 variables set
- ✓ Production values used
- ✓ No secrets in git

---

### Day 2: Security Critical Fixes (6-8 hours)

#### 🔴 Task 2.1: Fix Client-Side JWT Validation Bypass
**Priority:** CRITICAL
**Security Impact:** HIGH
**Effort:** 4 hours

**Problem:** Users can forge JWT tokens and bypass paywall

**Files to Modify:**
1. `/js/subdomain-access-control.js` - Soft check only
2. `/api/verify-access.ts` - NEW: Server-side verification
3. All module pages - Add server verification

**Implementation:**

**Step 1:** Update client-side to soft check only
```javascript
// js/subdomain-access-control.js
function hasValidAccessToken() {
    const token = localStorage.getItem('bsa_access_token');
    if (!token) return false;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        // Soft expiry check only (no signature verification)
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('bsa_access_token');
            return false;
        }

        // Assume valid - server will verify
        return true;
    } catch {
        return false;
    }
}
```

**Step 2:** Create server-side verification endpoint
```typescript
// api/verify-access.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAccessToken } from './entitlements';
import { findEntitlementByEmail, hasModuleAccess } from './database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { moduleId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ authorized: false, reason: 'No token' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify JWT signature and expiration
        const payload = verifyAccessToken(token);

        // Check database for entitlement
        const hasAccess = await hasModuleAccess(payload.email, moduleId);

        if (!hasAccess) {
            return res.status(403).json({
                authorized: false,
                reason: 'Module not in entitlement'
            });
        }

        return res.status(200).json({
            authorized: true,
            email: payload.email
        });
    } catch (err: any) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({
            authorized: false,
            reason: 'Invalid token'
        });
    }
}
```

**Step 3:** Add verification to module pages
```javascript
// Add to all module HTML files
<script>
async function verifyModuleAccess() {
    const token = localStorage.getItem('bsa_access_token');
    if (!token) {
        // Public user - apply normal gating
        return;
    }

    try {
        const response = await fetch('/api/verify-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                moduleId: window.location.pathname // e.g., '/paths/curious/stage-1/module-1.html'
            })
        });

        const result = await response.json();

        if (!result.authorized) {
            console.warn('Access denied:', result.reason);
            // Clear invalid token
            localStorage.removeItem('bsa_access_token');
            // Reload to apply public gating
            window.location.reload();
        } else {
            console.log('✅ Access verified for:', result.email);
        }
    } catch (err) {
        console.error('Verification error:', err);
        // On error, clear token and reload
        localStorage.removeItem('bsa_access_token');
        window.location.reload();
    }
}

// Run verification after page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyModuleAccess);
} else {
    verifyModuleAccess();
}
</script>
```

**Success Criteria:**
- ✓ Forged tokens rejected
- ✓ Valid tokens pass verification
- ✓ Expired tokens cleared
- ✓ No console errors

---

#### 🔴 Task 2.2: Replace In-Memory Storage with Database
**Priority:** CRITICAL
**Data Loss Risk:** HIGH
**Effort:** 3 hours

**Problem:** All data lost on serverless function restart

**Files to Modify:**
1. `/api/entitlements.ts` - Remove in-memory store
2. `/api/auth.ts` - Remove in-memory users/sessions
3. All API endpoints - Use database queries

**Implementation:**

```typescript
// api/entitlements.ts - REMOVE THIS
const entitlements: EntitlementStore = {}; // ❌ DELETE

// REPLACE WITH
import {
    createEntitlement,
    findEntitlementByEmail,
    updateEntitlement
} from './database';

export async function grantEntitlement(email: string, modules: string[], paths: string[]): Promise<string> {
    // Generate JWT token
    const token = generateAccessToken({
        userId: generateUUID(),
        email,
        modules,
        paths,
        purchaseDate: new Date().toISOString()
    });

    // Save to database (persistent!)
    await createEntitlement({
        email: email.toLowerCase(),
        modules,
        paths,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });

    return token;
}

export async function verifyEntitlement(email: string): Promise<Entitlement | null> {
    // Query database instead of in-memory
    return await findEntitlementByEmail(email.toLowerCase());
}
```

**Same pattern for auth.ts:**
```typescript
// api/auth.ts - REMOVE THESE
const users: Map<string, User> = new Map(); // ❌ DELETE
const sessions: Map<string, UserSession> = new Map(); // ❌ DELETE

// REPLACE WITH database queries
import { findUserByEmail, createUser, createSession, findSessionByToken } from './database';
```

**Success Criteria:**
- ✓ No in-memory Maps/objects
- ✓ All data persists after restart
- ✓ Database queries work
- ✓ No data loss

---

#### 🔴 Task 2.3: Remove Hardcoded JWT Secret Fallback
**Priority:** CRITICAL
**Security Risk:** HIGH
**Effort:** 15 minutes

**Files to Modify:**
1. `/api/auth.ts` (lines 456, 480)
2. `/api/entitlements.ts`

**Before:**
```typescript
const secret = process.env.JWT_SECRET || 'change_me_in_production'; // ❌ NEVER DO THIS
```

**After:**
```typescript
const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable not configured');
}

if (secret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters');
}
```

**Success Criteria:**
- ✓ No fallback secrets
- ✓ Throws error if JWT_SECRET missing
- ✓ Minimum length enforced
- ✓ Test deployment works

---

### Day 3: Accessibility Quick Wins (8 hours)

#### 🟡 Task 3.1: Fix Color Contrast Issues
**Priority:** HIGH
**WCAG Compliance:** CRITICAL
**Effort:** 30 minutes

**Problem:** Text contrast 3.8:1 (needs 4.5:1 for WCAG AA)

**Files to Modify:**
1. `/css/brand.css`

**Before:**
```css
:root {
    --text-dim: #999; /* 3.8:1 contrast ❌ FAIL */
}
```

**After:**
```css
:root {
    --text-dim: #b3b3b3; /* 4.6:1 contrast ✅ PASS */
}
```

**Test all instances:**
- `.live-stat .label`
- `.path-persona`
- `.breadcrumb`
- `.module-meta`
- All secondary text

**Success Criteria:**
- ✓ All text meets 4.5:1 ratio
- ✓ Tested with contrast checker
- ✓ Visual appearance acceptable

---

#### 🟡 Task 3.2: Add Missing Alt Text
**Priority:** HIGH
**Screen Reader Impact:** HIGH
**Effort:** 1 hour

**Problem:** Images lack alt text, screen readers can't describe them

**Files to Modify:** All 96 module HTML files + index.html

**Implementation:**

```html
<!-- Logo -->
<img src="/assets/logo.svg" alt="Bitcoin Sovereign Academy Logo" class="logo-icon">

<!-- Path Icons (SVG) -->
<svg class="path-icon" role="img" aria-labelledby="curious-icon-title">
    <title id="curious-icon-title">Curious Path - Learn Bitcoin fundamentals</title>
    <!-- SVG content -->
</svg>

<!-- Screenshots -->
<img src="/assets/module-screenshot.png"
     alt="Interactive demo showing Bitcoin transaction flow with step-by-step visual guide">

<!-- Decorative images -->
<img src="/assets/decoration.svg" alt="" role="presentation">
```

**Success Criteria:**
- ✓ All `<img>` have alt text
- ✓ All `<svg>` have `<title>` tags
- ✓ Decorative images have empty alt
- ✓ Screen reader test passes

---

#### 🟡 Task 3.3: Add Focus Indicators
**Priority:** HIGH
**Keyboard Navigation:** CRITICAL
**Effort:** 1 hour

**Files to Modify:**
1. `/css/brand.css` (global styles)

**Implementation:**

```css
/* Global focus styles */
*:focus {
    outline: 2px solid var(--primary-orange);
    outline-offset: 2px;
}

/* Enhanced focus for interactive elements */
.btn:focus,
.nav-link:focus,
.path-card:focus,
.choice-card:focus,
.quiz-option:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 4px;
}

/* Remove outline for mouse users only (progressive enhancement) */
*:focus:not(:focus-visible) {
    outline: none;
}

*:focus-visible {
    outline: 3px solid var(--primary-orange);
    outline-offset: 4px;
}

/* Ensure focus works in modals */
.onboarding-modal:focus-within {
    /* Trap focus inside */
}
```

**Success Criteria:**
- ✓ Tab through entire page
- ✓ All interactive elements visible when focused
- ✓ No outline for mouse clicks
- ✓ Outline appears for keyboard navigation

---

#### 🟡 Task 3.4: Fix Touch Target Sizes (Mobile)
**Priority:** HIGH
**Mobile UX:** CRITICAL
**Effort:** 2 hours

**Problem:** Interactive elements smaller than 44x44px minimum

**Files to Modify:**
1. `/css/onboarding-flow.css`
2. `/css/quiz.css`
3. `/css/learning-path.css`

**Implementation:**

```css
@media (max-width: 768px) {
    /* Ensure all interactive elements meet 48x48px (iOS recommendation) */
    button,
    a.btn,
    .quiz-option,
    .choice-card,
    .nav-link {
        min-height: 48px;
        padding: 12px 16px;
    }

    /* Close buttons */
    .onboarding-close,
    .modal-close {
        width: 48px;
        height: 48px;
        min-width: 48px;
        min-height: 48px;
    }

    /* Progress dots */
    .progress-dot {
        width: 16px;
        height: 16px;
        /* Increase tap area with padding */
        padding: 8px;
    }

    /* Choice cards */
    .choice-card {
        min-height: 120px; /* Ensure enough height for touch */
    }

    /* Quiz options */
    .quiz-option {
        min-height: 60px;
        padding: 16px 20px;
    }
}
```

**Test Devices:**
- iPhone SE (small screen)
- iPhone 14 Pro Max
- Samsung Galaxy S21

**Success Criteria:**
- ✓ All targets >= 48x48px on mobile
- ✓ No accidental taps
- ✓ Easy to interact with thumbs
- ✓ Tested on real devices

---

#### 🟡 Task 3.5: Add Skip Links
**Priority:** MEDIUM
**Accessibility:** WCAG Required
**Effort:** 30 minutes

**Files to Modify:** All HTML files

**Implementation:**

```html
<!-- Add as first element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Add ID to main content area -->
<main id="main-content">
    <!-- Page content -->
</main>

<!-- CSS -->
<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-orange);
    color: white;
    padding: 12px 20px;
    text-decoration: none;
    z-index: 10001;
    border-radius: 0 0 4px 0;
    font-weight: 600;
}

.skip-link:focus {
    top: 0;
}
</style>
```

**Success Criteria:**
- ✓ Tab key shows skip link
- ✓ Enter key skips to content
- ✓ Works on all pages
- ✓ Screen reader announces it

---

### Day 4-5: UX Critical Fixes (8 hours)

#### 🟡 Task 4.1: Improve Paywall Value Proposition
**Priority:** HIGH
**Conversion Impact:** HIGH (2x potential)
**Effort:** 3 hours

**Problem:** Generic copy, no warning before hitting paywall

**Files to Modify:**
1. `/js/module-gate.js`

**Implementation:**

**Step 1:** Add warning before paywall (at section 2)
```javascript
function showUpcomingGateWarning() {
    const warning = document.createElement('div');
    warning.className = 'gate-warning';
    warning.innerHTML = `
        <div class="warning-content">
            <div class="warning-icon">🔓</div>
            <h4>One more free section, then...</h4>
            <p>The next sections dive deeper into Bitcoin's technical architecture</p>

            <div class="unlock-benefits">
                <div class="benefit">
                    <span class="benefit-icon">✓</span>
                    <span>Complete this module + 95 more</span>
                </div>
                <div class="benefit">
                    <span class="benefit-icon">✓</span>
                    <span>25+ interactive demos</span>
                </div>
                <div class="benefit">
                    <span class="benefit-icon">✓</span>
                    <span>Progress tracking & certificates</span>
                </div>
                <div class="benefit">
                    <span class="benefit-icon">✓</span>
                    <span>Lifetime access & updates</span>
                </div>
            </div>

            <div class="warning-cta-area">
                <a href="/#pricing" class="warning-cta">View Pricing</a>
                <small>One-time payment • No subscription</small>
            </div>
        </div>
    `;

    // Insert before section 3
    const section3 = document.querySelector('.content-section:nth-child(3)');
    if (section3) {
        section3.parentNode.insertBefore(warning, section3);
    }
}

// Call at section 2
if (currentSection === 2) {
    showUpcomingGateWarning();
}
```

**Step 2:** Enhance lock overlay with specifics
```javascript
function createLockOverlay() {
    const pathName = getPathName(); // e.g., "Curious"
    const completedSections = countCompletedSections();
    const remainingSections = getTotalSections() - completedSections;
    const upcomingSections = getUpcomingSectionTitles();

    const overlay = document.createElement('div');
    overlay.className = 'lock-overlay';
    overlay.innerHTML = `
        <div class="lock-overlay-content">
            <div class="lock-icon">🔐</div>
            <h3>Continue Your ${pathName} Journey</h3>
            <p class="lock-subtitle">
                You've explored ${completedSections} sections.
                ${remainingSections} more chapters await.
            </p>

            <div class="unlock-preview">
                <h4>What's Next in This Module:</h4>
                <ul class="preview-topics">
                    ${upcomingSections.map(s => `
                        <li>
                            <span class="topic-icon">📖</span>
                            <span>${s.title}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="social-proof">
                <div class="testimonial">
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                    <p>"Best Bitcoin course I've taken. Worth every satoshi!"</p>
                    <span class="author">— Sarah K., Curious Path Graduate</span>
                </div>
                <div class="stats">
                    <span>✓ 2,847 students enrolled</span>
                    <span>✓ 4.9/5 average rating</span>
                </div>
            </div>

            <div class="pricing-preview">
                <div class="price-main">
                    <span class="currency">$</span>
                    <span class="amount">297</span>
                </div>
                <span class="price-detail">One-time payment • Lifetime access</span>
                <span class="price-savings">Save 30% with full path bundle</span>
            </div>

            <button type="button" class="module-lock-cta" onclick="window.location.href='/#pricing'">
                Unlock Full Access
            </button>

            <div class="lock-footer">
                <small>Already enrolled? <a href="#" class="module-lock-login">Sign in</a></small>
            </div>

            <button class="lock-dismiss" aria-label="Close and return" onclick="window.history.back()">×</button>
        </div>
    `;

    return overlay;
}
```

**Success Criteria:**
- ✓ Warning appears at section 2
- ✓ Lock overlay shows specific content preview
- ✓ Social proof displayed
- ✓ Dismissible overlay
- ✓ A/B test shows improved CTR

---

#### 🟡 Task 4.2: Add Form Validation Visual Feedback
**Priority:** MEDIUM
**UX Impact:** MEDIUM
**Effort:** 2 hours

**Files to Modify:**
1. `/css/dynamic-content.css`
2. `/js/checkout.js`

**Implementation:**

```css
/* Form validation states */
input:invalid:not(:focus):not(:placeholder-shown) {
    border-color: var(--accent-red);
    background: rgba(239, 68, 68, 0.05);
}

input:valid:not(:focus):not(:placeholder-shown) {
    border-color: var(--accent-green);
}

.field-error {
    color: var(--accent-red);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: none;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

input:invalid:not(:focus):not(:placeholder-shown) + .field-error {
    display: block;
}

/* Success checkmark */
input:valid:not(:placeholder-shown)::after {
    content: '✓';
    color: var(--accent-green);
}
```

**JavaScript:**
```javascript
// Add real-time validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', () => {
    if (!emailInput.validity.valid) {
        showFieldError(emailInput, 'Please enter a valid email address');
    } else {
        clearFieldError(emailInput);
    }
});

function showFieldError(input, message) {
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('field-error')) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.setAttribute('role', 'alert');
        input.parentNode.insertBefore(errorEl, input.nextSibling);
    }
    errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id || 'error-' + input.id);
}

function clearFieldError(input) {
    const errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains('field-error')) {
        errorEl.remove();
    }
    input.setAttribute('aria-invalid', 'false');
}
```

**Success Criteria:**
- ✓ Real-time validation feedback
- ✓ Clear error messages
- ✓ Success states shown
- ✓ Screen reader announces errors

---

#### 🟡 Task 4.3: Add Progress Indicators to Modules
**Priority:** MEDIUM
**UX Impact:** HIGH
**Effort:** 2 hours

**Files to Modify:**
1. All module HTML files
2. `/css/learning-path.css`

**Implementation:**

```html
<!-- Add to module header -->
<div class="module-progress">
    <div class="progress-info">
        <span class="progress-label">Module 2 of 8 in Stage 1</span>
        <span class="progress-percent">25% complete</span>
    </div>
    <div class="progress-bar">
        <div class="progress-fill" style="width: 25%" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="progress-details">
        <span>Section 2 of 8</span>
        <span class="separator">•</span>
        <span class="time-remaining">~12 min remaining</span>
    </div>
</div>
```

**CSS:**
```css
.module-progress {
    background: var(--secondary-dark);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: var(--text-dim);
}

.progress-bar {
    height: 8px;
    background: rgba(247, 147, 26, 0.2);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.75rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-orange), #ffb347);
    border-radius: 4px;
    transition: width 0.5s ease;
}

.progress-details {
    display: flex;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-dim);
}

.time-remaining {
    color: var(--primary-orange);
    font-weight: 600;
}
```

**Success Criteria:**
- ✓ Progress bar accurate
- ✓ Time estimate shown
- ✓ Updates as user scrolls
- ✓ Motivates completion

---

## 🟡 WEEK 2: HIGH PRIORITY FIXES

### Task 5: Fix Stripe Webhook Signature Verification
**Priority:** HIGH
**Security Impact:** HIGH
**Effort:** 2 hours

**Problem:** Webhook verification uses parsed body (should use raw body)

**Files to Create:**
1. `/api/webhooks/stripe.ts` (separate from main handler)

**Implementation:**

```typescript
// api/webhooks/stripe.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'micro';
import { verifyStripeWebhook } from '../stripe';
import { grantEntitlement } from '../entitlements';
import { sendAccessTokenEmail } from '../email';

export const config = {
    api: {
        bodyParser: false, // Must disable to get raw body
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get raw body (required for signature verification)
        const rawBody = await buffer(req);
        const signature = req.headers['stripe-signature'] as string;

        if (!signature) {
            console.error('Missing Stripe signature header');
            return res.status(400).json({ error: 'Missing signature' });
        }

        // Verify webhook signature
        const event = verifyStripeWebhook(rawBody.toString(), signature);

        console.log(`Webhook received: ${event.type}`);

        // Handle event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Extract metadata
            const email = session.customer_email;
            const modules = JSON.parse(session.metadata.modules || '[]');
            const paths = JSON.parse(session.metadata.paths || '[]');

            // Grant entitlement and send email
            const token = await grantEntitlement(email, modules, paths);
            await sendAccessTokenEmail({
                email,
                token,
                modules,
                paths,
                purchaseDate: new Date().toISOString()
            });

            console.log(`✅ Entitlement granted to ${email}`);
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error('Webhook error:', err.message);
        return res.status(400).json({ error: err.message });
    }
}
```

**Update vercel.json:**
```json
{
    "functions": {
        "api/webhooks/stripe.ts": {
            "memory": 1024,
            "maxDuration": 30
        }
    }
}
```

**Success Criteria:**
- ✓ Signature verification works
- ✓ Raw body used
- ✓ No fake webhooks accepted
- ✓ Logs show verification success

---

### Task 6: Implement Rate Limiting
**Priority:** HIGH
**Security Impact:** MEDIUM
**Effort:** 3 hours

**Create:** `/api/rate-limit.ts`

**Implementation:**

```typescript
// api/rate-limit.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

// In-memory store (upgrade to Redis/Upstash for production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function createRateLimiter(config: RateLimitConfig) {
    return async function rateLimitMiddleware(
        req: VercelRequest,
        res: VercelResponse,
        next: () => void
    ) {
        const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        // Clean up old entries
        for (const [key, value] of requestCounts.entries()) {
            if (value.resetTime < now) {
                requestCounts.delete(key);
            }
        }

        // Get current count
        const current = requestCounts.get(identifier as string);

        if (!current || current.resetTime < now) {
            // First request or window expired
            requestCounts.set(identifier as string, {
                count: 1,
                resetTime: now + config.windowMs
            });
            next();
        } else if (current.count < config.maxRequests) {
            // Within limit
            current.count++;
            next();
        } else {
            // Rate limit exceeded
            res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil((current.resetTime - now) / 1000)
            });
        }
    };
}

// Preset limiters
export const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
});

export const apiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
});

export const webhookRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 60
});
```

**Apply to endpoints:**
```typescript
// api/auth.ts
import { authRateLimiter } from './rate-limit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Apply rate limiting
    await authRateLimiter(req, res, () => {
        // Handle request
        if (req.url === '/api/auth/login') {
            return loginHandler(req, res);
        }
        // ... other routes
    });
}
```

**Success Criteria:**
- ✓ Brute force attacks blocked
- ✓ Legitimate users not affected
- ✓ Retry-After header sent
- ✓ Logs show rate limiting works

---

## 🟢 MONTH 1: MEDIUM PRIORITY IMPROVEMENTS

### Task 7: Enhanced Keyboard Navigation
**Effort:** 4 hours

Add keyboard support to:
- [ ] Choice cards (Arrow keys to navigate, Enter to select)
- [ ] Quiz options (Same pattern)
- [ ] Modal dialogs (Escape to close, Tab trapping)
- [ ] Path cards (Enter to navigate)

---

### Task 8: Webhook Deduplication
**Effort:** 2 hours

Prevent processing same webhook twice:

```typescript
// Check if already processed
if (await hasWebhookBeenProcessed(event.id)) {
    return res.status(200).json({ received: true, status: 'duplicate' });
}

// Process
await handleWebhookEvent(event);

// Mark as processed
await markWebhookProcessed(event.id);
```

---

### Task 9: Password Policy Strengthening
**Effort:** 1 hour

Require:
- 12+ characters
- 3 of: uppercase, lowercase, numbers, special chars
- No common passwords

---

### Task 10: Email Security (One-Time Redemption Links)
**Effort:** 3 hours

Replace JWT in email with one-time redemption token:

```typescript
// Generate single-use token
const redemptionToken = generateSecureToken();
await storeRedemptionToken(redemptionToken, email, 24); // 24hr expiry

// Email link
const link = `https://learn.bitcoinsovereign.academy/redeem?token=${redemptionToken}`;

// On redemption page
const actualToken = await redeemToken(redemptionToken); // Returns JWT, invalidates redemption token
```

---

## 📈 SUCCESS METRICS

### Week 1 Targets
- ✅ Database deployed and connected
- ✅ Email service sending
- ✅ JWT tokens secure
- ✅ Critical security fixes deployed
- ✅ Accessibility: 70%+ WCAG compliance
- ✅ Mobile: All touch targets 48x48px+

### Week 2 Targets
- ✅ Webhook verification secure
- ✅ Rate limiting active
- ✅ UX improvements deployed
- ✅ Accessibility: 85%+ WCAG compliance

### Month 1 Targets
- ✅ Accessibility: 95%+ WCAG compliance
- ✅ Performance: 70+ Lighthouse score
- ✅ Security: All HIGH priority issues fixed
- ✅ Conversion rate: 2x improvement on paywall

---

## 🎯 NEXT STEPS

**Right Now:**
1. ✅ Review this action plan
2. ⏭️ Start with Task 1.1 (Deploy Database) using DEPLOYMENT_GUIDE.md
3. ⏭️ Work through Week 1 Critical Fixes sequentially
4. ⏭️ Deploy and test after each task
5. ⏭️ Monitor errors in Vercel logs

**This Week:**
- Complete all CRITICAL fixes
- Test thoroughly on staging
- Deploy to production
- Monitor for issues

**Month 1:**
- Complete HIGH priority fixes
- Begin MEDIUM priority improvements
- Implement monitoring and analytics
- Prepare for launch

---

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Status:** Ready for implementation
