# Subdomain-Based Access Control Migration

## Overview

This migration updates the Bitcoin Sovereign Academy platform to use subdomain-based access control instead of URL parameter-based authentication. This provides a more secure, user-friendly, and scalable access control system.

## Changes Made

### 1. Module Pages (61 files updated)

All module HTML files in `/paths/` have been updated to:

- **Remove** old `module-gate.js` script
- **Add** subdomain access control scripts in `<head>`:
  ```html
  <script src="/js/subdomain-access-control.js"></script>
  <script src="/js/module-gate-subdomain.js"></script>
  ```

**Paths affected:**
- `/paths/curious/` (12 modules)
- `/paths/builder/` (12 modules)
- `/paths/sovereign/` (12 modules)
- `/paths/pragmatist/` (6 modules)
- `/paths/principled/` (15 modules)
- `/paths/observer/` (1 module)

### 2. Interactive Demos (37 files updated)

All demo pages in `/interactive-demos/` have been updated to:

- **Add** locking scripts in `<body>`:
  ```html
  <script src="/js/demo-lock-subdomain.js"></script>
  <script src="/js/subdomain-access-control.js"></script>
  ```

**Demos updated:** All 37 interactive demos now have proper subdomain-based access control

### 3. Access Control Scripts (Already exist)

Three core JavaScript files provide the functionality:

1. **`/js/subdomain-access-control.js`** - Core access detection and control
2. **`/js/module-gate-subdomain.js`** - Module-specific gating logic
3. **`/js/demo-lock-subdomain.js`** - Demo-specific locking logic

## Access Levels

The new system supports three access levels:

| Subdomain | Access Level | Description |
|-----------|-------------|-------------|
| `bitcoinsovereign.academy` | **PUBLIC** | Gated content (2 sections free, then locked) |
| `learn.bitcoinsovereign.academy` | **MEMBER** | Full access to all content (paid members) |
| `preview.bitcoinsovereign.academy` | **PREVIEW** | Demo access for investors/reviewers |
| `localhost` / `*.vercel.app` | **DEV** | Development mode (full access) |

## How It Works

### For Module Pages:

1. `subdomain-access-control.js` detects the subdomain
2. `module-gate-subdomain.js` checks access level
3. If public access → applies content gating after 2 sections
4. If member/preview/dev → bypasses gating entirely

### For Demo Pages:

1. `subdomain-access-control.js` detects the subdomain
2. `demo-lock-subdomain.js` checks if demo should be unlocked
3. If public access → shows lock screen for premium demos
4. If member/preview/dev → unlocks all demos
5. Free demos are always unlocked regardless of subdomain

### Free Demos (Always Unlocked):

- `account-freeze-locked-out`
- `building-the-chain-demo`
- `double-spending-demo`
- `money-properties-comparison`
- `network-consensus-demo`

## Backwards Compatibility

The system maintains backwards compatibility with legacy URL parameters:

- `?unlock=true` - Still works for development
- `?preview=demo2024` - Still works for preview access
- Old access tokens stored in localStorage are respected

## Verification

After migration, the following was verified:

✅ **61 modules** with subdomain scripts
✅ **37 demos** with subdomain scripts
✅ **0 modules** with old module-gate.js

## Testing Checklist

- [ ] Test public access on `bitcoinsovereign.academy` (should gate after 2 sections)
- [ ] Test member access on `learn.bitcoinsovereign.academy` (should unlock all)
- [ ] Test preview access on `preview.bitcoinsovereign.academy` (should unlock all)
- [ ] Test localhost development (should unlock all)
- [ ] Verify free demos unlock on public site
- [ ] Verify premium demos lock on public site
- [ ] Verify premium demos unlock on member/preview sites

## Benefits

1. **Security** - No sensitive access tokens in URLs
2. **UX** - Clean URLs, automatic access based on subdomain
3. **Scalability** - Easy to add new access levels or tiers
4. **SEO** - Separate subdomains for public vs. member content
5. **Analytics** - Track usage by subdomain
6. **Sharing** - Members can share member links, public users see gated version

## Migration Script

The migration was performed using `update-subdomain-scripts.py`:

```bash
python3 update-subdomain-scripts.py
```

This script:
- Scanned all module and demo HTML files
- Removed old access control scripts
- Added new subdomain-based scripts
- Verified all changes

## Support & Troubleshooting

### If modules aren't unlocking on member site:

1. Check that you're on `learn.bitcoinsovereign.academy`
2. Clear browser cache and reload
3. Check browser console for access level detection

### If demos aren't locking on public site:

1. Verify scripts are loaded in `<body>`
2. Check browser console for lock script messages
3. Ensure demo name matches free demo list

### Developer Access:

For local development, all content is automatically unlocked on:
- `localhost`
- `*.vercel.app` preview deployments

---

**Date:** 2025-11-01
**Author:** Bitcoin Sovereign Academy Development Team
**Files Modified:** 99 (61 modules + 37 demos + 1 script)
