# Paths Migration Notes

## Current status

The `paths/` folder contains BSA learning path content and staged modules.

## Important coupling discovered

Current runtime logic still references `/paths/` directly.

Examples:
- js/module-gate.js
- js/module-gate-subdomain.js
- js/learning-path-navigator.js
- js/site-nav.js
- js/onboarding-flow.js
- js/navigation-context.js

## Important risk

The folder should not be moved yet because current live runtime logic still depends on `/paths/`.

## Safe migration approach

1. Keep `/paths/` in place for now
2. Document all runtime dependencies
3. Create a future BSA copy later if needed
4. Only migrate after route and gate logic is stabilized
