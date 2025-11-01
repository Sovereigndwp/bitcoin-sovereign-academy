# 🌐 Subdomain-Based Content Access System

## Overview

This system uses **subdomains** to control content access instead of URL parameters or complex authentication. Users access different versions of your site based on the subdomain they visit.

### Access Levels

| Subdomain | Access Level | Description | Use Case |
|-----------|-------------|-------------|----------|
| `bitcoinsovereign.academy` | **Public** | Limited content, gating enabled | Free users, visitors |
| `learn.bitcoinsovereign.academy` | **Member** | Full access, no gating | Paid members |
| `preview.bitcoinsovereign.academy` | **Preview** | Full access, demo mode | Investors, reviewers |
| `localhost` / `*.vercel.app` | **Dev** | Full access, unrestricted | Development |

---

## How It Works

### 1. User Journey

**Free User (Public):**
```
Visits: bitcoinsovereign.academy
↓
Sees: First 2 sections of each module + 5 free demos
↓
Clicks: "Unlock Full Access"
↓
Redirects to: Payment/signup page
```

**Paid Member:**
```
Visits: learn.bitcoinsovereign.academy
↓
Sees: All content unlocked (green banner at top)
↓
Can switch back to: bitcoinsovereign.academy (public view)
```

**Investor/Reviewer:**
```
Receives link: preview.bitcoinsovereign.academy
↓
Sees: All content unlocked (orange banner at top)
↓
Can explore entire platform
```

### 2. Technical Flow

```javascript
1. Page loads
2. subdomain-access-control.js detects hostname
3. Determines access level (public/member/preview/dev)
4. Stores access level in localStorage/sessionStorage
5. module-gate-subdomain.js checks access
6. If public → apply content gating
7. If member/preview/dev → bypass gating
```

---

## Setup Instructions

### Step 1: DNS Configuration

Add these DNS records at your domain registrar (Namecheap, Cloudflare, etc.):

```
Type     Name      Value                          TTL
────────────────────────────────────────────────────────
A        @         76.76.21.21 (Vercel IP)        Auto
CNAME    learn     cname.vercel-dns.com          Auto
CNAME    preview   cname.vercel-dns.com          Auto
CNAME    www       bitcoinsovereign.academy      Auto
```

**Note:** Vercel's actual IP may differ. Use Vercel's recommended DNS settings.

### Step 2: Vercel Project Configuration

1. **Add Domains to Vercel:**
   ```
   Go to: Vercel Dashboard → Your Project → Settings → Domains

   Add these domains:
   - bitcoinsovereign.academy (production)
   - learn.bitcoinsovereign.academy
   - preview.bitcoinsovereign.academy
   ```

2. **Verify Domain Ownership:**
   - Vercel will provide TXT records for verification
   - Add them to your DNS settings
   - Wait for verification (usually instant)

3. **SSL Certificates:**
   - Vercel automatically provisions SSL for all subdomains
   - Usually ready within minutes

### Step 3: Update Your HTML Files

#### For Module Pages (All Learning Path Modules)

Add these scripts to the `<head>` section **in this order**:

```html
<!-- Subdomain Access Control (must load first) -->
<script src="/js/subdomain-access-control.js"></script>

<!-- Module Gating with Subdomain Integration -->
<script src="/js/module-gate-subdomain.js"></script>
```

**Example:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module Title</title>

    <!-- Add these two scripts -->
    <script src="/js/subdomain-access-control.js"></script>
    <script src="/js/module-gate-subdomain.js"></script>

    <!-- Other scripts and styles -->
</head>
<body>
    <!-- Your module content -->
</body>
</html>
```

#### For Interactive Demos (Locked Demos)

For demos you want to lock for public users, add this script right after `<body>`:

```html
<body>
    <!-- Demo Lock Script (load before subdomain-access-control) -->
    <script src="/js/demo-lock-subdomain.js"></script>

    <!-- Subdomain Access Control -->
    <script src="/js/subdomain-access-control.js"></script>

    <!-- Your demo content -->
</body>
```

**Free Demos (Never Locked):**
- account-freeze-locked-out
- building-the-chain-demo
- double-spending-demo
- money-properties-comparison
- network-consensus-demo

These demos don't need the lock script.

### Step 4: Deploy to Vercel

```bash
# Option 1: Deploy from CLI
vercel --prod

# Option 2: Push to GitHub (auto-deploy)
git add .
git commit -m "Add subdomain-based access control"
git push origin main
```

### Step 5: Test Your Subdomains

```bash
# Test public access (should be gated)
curl -I https://bitcoinsovereign.academy

# Test member access (should bypass gating)
curl -I https://learn.bitcoinsovereign.academy

# Test preview access (should bypass gating)
curl -I https://preview.bitcoinsovereign.academy
```

**Manual Testing:**

1. Visit `bitcoinsovereign.academy/paths/curious/stage-1/module-2.html`
   - ✅ Should see blur/gate after 2 sections

2. Visit `learn.bitcoinsovereign.academy/paths/curious/stage-1/module-2.html`
   - ✅ Should see green "Member Access" banner
   - ✅ All content visible, no gating

3. Visit `preview.bitcoinsovereign.academy/paths/curious/stage-1/module-2.html`
   - ✅ Should see orange "Preview Mode" banner
   - ✅ All content visible, no gating

---

## Implementation Files

### Created Files

| File | Purpose |
|------|---------|
| `js/subdomain-access-control.js` | Core subdomain detection and access management |
| `js/module-gate-subdomain.js` | Module content gating with subdomain integration |
| `js/demo-lock-subdomain.js` | Interactive demo locking with subdomain support |
| `vercel-subdomain.json` | Vercel configuration (backup) |
| `SUBDOMAIN_ACCESS_GUIDE.md` | This guide |

### Modified Files

None yet! The new system works alongside your existing files.

---

## Migration Strategy

### Option A: Gradual Migration (Recommended)

1. **Phase 1: Test on a single module**
   ```bash
   # Update just one module file
   # Test thoroughly on all subdomains
   ```

2. **Phase 2: Migrate all modules**
   ```bash
   # Use find/replace to add scripts to all module pages
   find paths/ -name "*.html" -type f
   ```

3. **Phase 3: Migrate interactive demos**
   ```bash
   # Add demo lock script to locked demos
   find interactive-demos/ -name "index.html" -type f
   ```

### Option B: Full Migration Script

Create a migration script to automatically update all files:

```bash
#!/bin/bash

# Migrate all module pages
for file in paths/**/*.html; do
    # Add subdomain scripts if not already present
    if ! grep -q "subdomain-access-control.js" "$file"; then
        # Insert scripts after <head> tag
        sed -i '' '/<head>/a\
    <script src="/js/subdomain-access-control.js"></script>\
    <script src="/js/module-gate-subdomain.js"></script>
' "$file"
    fi
done

echo "Migration complete!"
```

---

## Advantages of Subdomain Approach

### ✅ Benefits

1. **Clean URLs**
   - `learn.bitcoinsovereign.academy` vs `bitcoinsovereign.academy?preview=demo2024`
   - Easier to remember and share

2. **Better SEO**
   - Search engines treat subdomains as separate sites
   - Can optimize `bitcoinsovereign.academy` for discovery
   - Keep `learn.bitcoinsovereign.academy` members-only

3. **Professional Appearance**
   - Looks more established and trustworthy
   - Standard practice for SaaS platforms

4. **Simpler Access Control**
   - No need to remember preview keys
   - URL itself grants access
   - Easy to revoke (just change DNS)

5. **Analytics Separation**
   - Track public vs member behavior separately
   - Better insights into conversion funnels

6. **Caching & Performance**
   - Can configure different caching rules per subdomain
   - CDN optimizations for each audience

### ⚠️ Considerations

1. **DNS Setup Required**
   - One-time configuration at domain registrar
   - Usually 5-10 minutes of work

2. **SSL Certificates**
   - Vercel handles automatically
   - No extra cost or configuration

3. **Cookie Sharing**
   - Subdomains can share cookies with parent domain
   - Useful for maintaining login state

---

## Advanced Configuration

### Custom Access Levels

Want to add more access levels? Edit `js/subdomain-access-control.js`:

```javascript
const CONFIG = {
    domains: {
        public: 'bitcoinsovereign.academy',
        members: 'learn.bitcoinsovereign.academy',
        preview: 'preview.bitcoinsovereign.academy',
        // Add your custom subdomain
        enterprise: 'enterprise.bitcoinsovereign.academy'
    },
    accessLevels: {
        PUBLIC: 'public',
        MEMBER: 'member',
        PREVIEW: 'preview',
        ENTERPRISE: 'enterprise', // Add custom level
        DEV: 'dev'
    }
};
```

### White-Label Support

Each subdomain can have custom branding:

```javascript
// In subdomain-access-control.js
if (hostname === 'partner.bitcoinsovereign.academy') {
    document.documentElement.style.setProperty('--color-brand', '#YOUR_COLOR');
    document.title = 'Partner Academy - ' + document.title;
}
```

### Analytics Integration

Track subdomain usage:

```javascript
// In subdomain-access-control.js init()
if (typeof window.plausible !== 'undefined') {
    window.plausible('pageview', {
        props: {
            subdomain: getSubdomain() || 'main',
            accessLevel: accessLevel
        }
    });
}
```

---

## Troubleshooting

### DNS Not Propagating

```bash
# Check DNS status
dig learn.bitcoinsovereign.academy

# Check from different locations
# Visit: https://www.whatsmydns.net/
```

**Solution:** Wait 24-48 hours or flush DNS cache:
```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Subdomain Not Detected

**Check browser console:**
```javascript
// Should see these logs
🌐 Subdomain Access Control Initialized
   Hostname: learn.bitcoinsovereign.academy
   Subdomain: learn
   Access Level: member
```

**If not working:**
1. Verify script is loading: Check Network tab
2. Check script order: subdomain-access-control.js must load first
3. Verify hostname: `console.log(window.location.hostname)`

### Gating Still Applied on Member Subdomain

**Debug steps:**
1. Open browser console
2. Check: `window.BSASubdomainAccess.getAccessLevel()`
3. Should return `'member'` not `'public'`

**If showing wrong access:**
```javascript
// Clear storage and reload
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### SSL Certificate Issues

- Vercel auto-provisions SSL
- Usually ready in < 5 minutes
- If delayed, check Vercel dashboard for errors

---

## Backwards Compatibility

### Legacy URL Parameters Still Work

The system maintains backwards compatibility:

```
✅ bitcoinsovereign.academy?preview=demo2024
✅ bitcoinsovereign.academy?unlock=true
✅ localStorage.setItem('bsa_full_access', 'yes')
```

These will continue working alongside subdomain access.

### Gradual Migration

You can migrate gradually:
- Some pages use subdomain detection
- Some pages use old URL parameter system
- Both systems work together seamlessly

---

## Production Checklist

Before going live with subdomain access:

- [ ] DNS records configured (A, CNAME)
- [ ] Domains added to Vercel project
- [ ] SSL certificates provisioned
- [ ] Scripts added to module pages
- [ ] Demo lock scripts added to locked demos
- [ ] Tested all three subdomains manually
- [ ] Tested on mobile devices
- [ ] Analytics configured (if using)
- [ ] Updated any documentation/help pages
- [ ] Notified existing members of new URL

---

## Support & Maintenance

### Monitoring

Set up uptime monitoring for all subdomains:
- **UptimeRobot:** https://uptimerobot.com (free)
- Monitor: bitcoinsovereign.academy, learn.*, preview.*

### Updates

When updating the access control logic:
1. Test on `*.vercel.app` deployment preview first
2. Deploy to `preview.` subdomain
3. Test thoroughly
4. Deploy to production subdomains

### Member Communication

When launching member subdomain:
```
Subject: New Member Portal - learn.bitcoinsovereign.academy

We've launched a dedicated member portal!

Access all your content at:
🔗 https://learn.bitcoinsovereign.academy

Benefits:
✅ No more login hassles
✅ Bookmark-friendly URLs
✅ Faster access to all content
✅ Same great content, better experience

Your existing account credentials still work.
```

---

## Next Steps

1. **Configure DNS** (15 minutes)
   - Add CNAME records for learn.* and preview.*

2. **Add Domains to Vercel** (5 minutes)
   - Vercel dashboard → Domains → Add

3. **Update One Module Page** (2 minutes)
   - Add the two script tags
   - Test on all subdomains

4. **Migrate Remaining Pages** (30-60 minutes)
   - Use find/replace or migration script
   - Or do gradually over time

5. **Launch Member Subdomain** 🚀
   - Email members with new URL
   - Update any documentation
   - Celebrate! 🎉

---

**Version:** 1.0
**Last Updated:** 2025-10-31
**Status:** ✅ Ready for production

