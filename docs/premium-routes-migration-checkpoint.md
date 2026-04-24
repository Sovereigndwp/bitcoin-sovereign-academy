# Premium Routes Migration Checkpoint

## Purpose

Record the current status of the premium routes migration before attempting any deeper access-layer changes.

## Shared premium routes copies

### TypeScript candidate
- packages/shared-access/src/premium-routes.ts

### JS runtime-compatible candidate
- packages/shared-access/src/premium-routes.js

## Live callers already switched successfully

- tests/premium-routes.test.mjs
- middleware.js
- server-local.js

## Live callers not switched yet

- lib/premium-route-access.js

## Why the remaining caller is more sensitive

`lib/premium-route-access.js` is not just pure route classification.
It also includes:
- cookie logic
- JWT signing and verification
- session handling
- DB access
- route access resolution

That makes it a riskier next step than the earlier import swaps.

## Rule

Do not switch `lib/premium-route-access.js` until:
1. the current checkpoint is documented
2. rollback remains easy
3. the shared route import path is confirmed stable
4. the access-layer dependency chain is reviewed
