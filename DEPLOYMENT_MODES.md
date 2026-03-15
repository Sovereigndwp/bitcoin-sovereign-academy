# Bitcoin Sovereign Academy - Deployment Modes

This document explains how to configure different deployment modes using feature flags.

## Overview

The Bitcoin Sovereign Academy now uses a single-branch, configuration-based system for managing content access across different environments. No more maintaining separate branches for production, development, or preview deployments.

## Quick Start

### Production (Default)
- All content gated
- Monetization enabled
- Only Stage 1, Module 1 free per path
- URL: `https://bitcoinsovereign.academy`

### Development/Testing Mode
Add to URL: `?mode=development` or `?unlock=true`
- Client-side locks disabled
- Interactive demos and browser-gated pages stay open
- Server-protected premium curriculum still requires a trusted cookie
- On localhost, use `/api/dev/unlock-all?next=/paths/...` to set the trusted premium cookie
- Debug logging enabled
- Example: `https://bitcoinsovereign.academy?mode=development`

### Preview/Demo Mode
Add to URL: `?mode=preview`
- Limited preview access
- 2 free demos
- Module gating active
- Ideal for investor demos
- Example: `https://bitcoinsovereign.academy?mode=preview`

### Fully Unlocked Mode
Add to URL: `?mode=unlocked`
- Client-side locks disabled
- Server-protected premium curriculum still requires a trusted cookie
- For content review and testing
- Example: `https://bitcoinsovereign.academy?mode=unlocked`

## Configuration File

The configuration is managed in `/js/config.js`. This file:

1. Detects the environment automatically (localhost, preview domains, dev domains)
2. Applies appropriate default settings based on environment
3. Allows URL parameter overrides
4. Supports manual localStorage overrides for testing

### Automatic Environment Detection

```javascript
// Localhost automatically enables development mode for browser-side gates
localhost → FULL_ACCESS = true

// Domains with "preview" or "demo" → preview mode
preview.bitcoinsovereign.academy → ENABLE_PREVIEW_MODE = true

// Domains with \"dev\" or \"staging\" → development mode for browser-side gates
dev.bitcoinsovereign.academy → FULL_ACCESS = true

// All other domains → production mode (default)
bitcoinsovereign.academy → ENABLE_MODULE_GATING = true
```

## Configuration Options

Edit `js/config.js` to change default behavior:

```javascript
{
    // Core feature flags
    ENABLE_MODULE_GATING: true,      // Lock modules behind paywall
    ENABLE_DEMO_LOCKS: true,         // Lock interactive demos
    ENABLE_PREVIEW_MODE: false,      // Allow limited preview access
    FULL_ACCESS: false,              // Bypass client-side locks (dev/testing)

    // Access limits
    FREE_MODULES_LIMIT: 1,           // How many modules free per path
    PREVIEW_DEMOS_LIMIT: 2,          // How many demos in preview mode

    // Environment
    ENVIRONMENT: 'production',       // Current mode
    DEBUG: false                     // Enable console logging
}
```

## Deployment Strategies

### Vercel Deployment

1. **Production Domain** (`bitcoinsovereign.academy`)
   - No special configuration needed
   - Uses default production settings

2. **Development Subdomain** (`dev.bitcoinsovereign.academy`)
   - Automatically detects "dev" in hostname
   - Enables browser-side full access mode

3. **Preview Deployments** (Vercel preview URLs)
   - Users can add `?mode=preview` to URL
   - Or use `?unlock=true` for browser-side full access

### URL Parameter Overrides

URL parameters always take highest priority:

```
?mode=production     → Force production settings
?mode=development    → Force development settings
?mode=preview        → Force preview settings
?mode=unlocked       → Force unlocked settings
?unlock=true         → Quick browser-side unlock (FULL_ACCESS=true)
?unlock=1            → Same as unlock=true
```

Examples:
```
https://bitcoinsovereign.academy/paths/curious/stage-1/module-2.html?mode=development
https://bitcoinsovereign.academy/interactive-demos/mining-simulator/?unlock=true
```

## Trusted Premium Route Unlock

Protected curriculum routes are now enforced before HTML is served. That means `FULL_ACCESS`, `?mode=development`, and `?unlock=true` only affect browser-side gating, not the server guard for premium curriculum.

For localhost development, use:

```javascript
http://localhost:3000/api/dev/unlock-all?next=/paths/curious/stage-1/module-2.html
```

That endpoint is localhost-only and sets the trusted `bsa_premium_route` cookie with the explicit `developer` tier.

## Manual Override (Testing)

For local testing and debugging, you can override configuration in the browser console:

### Enable Full Access
```javascript
localStorage.setItem('bsa_config_override', JSON.stringify({
    FULL_ACCESS: true,
    DEBUG: true
}));
location.reload();
```

### Enable Preview Mode
```javascript
localStorage.setItem('bsa_config_override', JSON.stringify({
    ENABLE_PREVIEW_MODE: true,
    PREVIEW_DEMOS_LIMIT: 5,
    DEBUG: true
}));
location.reload();
```

### Custom Configuration
```javascript
localStorage.setItem('bsa_config_override', JSON.stringify({
    ENABLE_MODULE_GATING: false,
    ENABLE_DEMO_LOCKS: false,
    FREE_MODULES_LIMIT: 10,
    DEBUG: true
}));
location.reload();
```

### Clear Override
```javascript
localStorage.removeItem('bsa_config_override');
location.reload();
```

## Checking Current Configuration

Open browser console and type:

```javascript
console.log(BSA_CONFIG);
```

You'll see:
```javascript
{
    ENABLE_MODULE_GATING: true,
    ENABLE_DEMO_LOCKS: true,
    ENABLE_PREVIEW_MODE: false,
    FULL_ACCESS: false,
    FREE_MODULES_LIMIT: 1,
    PREVIEW_DEMOS_LIMIT: 2,
    ENVIRONMENT: 'production',
    DEBUG: false
}
```

## Benefits of This System

### Single Codebase
- No branch maintenance
- No merge conflicts between production/preview branches
- All features in one place

### Easy Testing
- Just add URL parameter
- No deployment needed to test different modes
- Quick sharing of preview links

### Quick Deployment
- Change config, not code
- No code review needed for access changes
- Version controlled configuration

### Flexible Access Control
- Per-environment defaults
- URL override capability
- Manual testing overrides

## Integration Points

### Module Gating
File: `js/module-gate.js` and `js/module-gate-subdomain.js`

Checks:
1. `BSA_CONFIG.FULL_ACCESS` → bypass all gating
2. `BSA_CONFIG.ENABLE_MODULE_GATING` → apply locks

### Demo Locks
File: `js/demo-lock-subdomain.js`

Checks:
1. `BSA_CONFIG.FULL_ACCESS` → unlock all demos
2. `BSA_CONFIG.ENABLE_DEMO_LOCKS` → apply locks

### Preview Limits
Both module and demo locks respect:
- `BSA_CONFIG.FREE_MODULES_LIMIT`
- `BSA_CONFIG.PREVIEW_DEMOS_LIMIT`

## Troubleshooting

### Content is locked when it shouldn't be

1. Check your URL has the correct mode parameter
2. Check browser console for config:
   ```javascript
   console.log(BSA_CONFIG);
   ```
3. If the route is server-protected premium curriculum, issue a localhost dev unlock with `/api/dev/unlock-all`
4. Try manual override in console for browser-side gates
5. Clear browser cache and reload

### Configuration not loading

1. Verify `config.js` is loaded BEFORE gate scripts
2. Check browser console for errors
3. Ensure `config.js` exists at `/js/config.js`

### URL parameter not working

1. URL parameters must be exact: `?mode=development` (not `?mode=dev`)
2. Reload the page after adding parameter
3. Check console logs if DEBUG is enabled

## Best Practices

### For Development
- Use `localhost` or add `?mode=development` to URL
- Use `/api/dev/unlock-all?next=/protected-route` when you need server-protected premium routes locally
- Enable DEBUG to see configuration logs

### For Demos/Investors
- Share links with `?mode=preview` parameter
- Or use preview subdomain

### For Content Review
- Use `?mode=unlocked` for full access
- Or use manual localStorage override

### For Production
- No parameters needed
- Default configuration applies
- Monitor console for any issues

## Future Enhancements

Potential additions to the config system:

1. **API-based Access Control**
   - Check user authentication status
   - Sync access across devices

2. **Time-based Access**
   - Preview mode expires after X hours
   - Temporary unlock links

3. **Analytics Integration**
   - Track which modes are used
   - Monitor access patterns

4. **A/B Testing**
   - Different free module limits
   - Test conversion rates

## Support

If you encounter issues with the configuration system:

1. Check this documentation
2. Review browser console logs (with DEBUG enabled)
3. Test with manual localStorage override
4. Check that config.js is loaded in HTML

## Version History

- **v1.0** (2025-11-07): Initial configuration system
  - Four deployment modes
  - URL parameter overrides
  - Environment auto-detection
  - Manual localStorage overrides
