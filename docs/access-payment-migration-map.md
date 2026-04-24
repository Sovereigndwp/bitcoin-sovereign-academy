# Access and Payment Migration Map

## Purpose

Track the current scattered monetization and access files before migrating any live logic.

## Current frontend files
- js/checkout.js
- js/demo-lock-subdomain.js
- js/lightning-payment.js
- js/membership-gate.js
- js/module-gate-subdomain.js
- js/module-gate.js
- js/payment-access-control.js
- js/stripe-checkout.js
- js/subdomain-access-control.js

## Current API files
- api/account/entitlements.ts
- api/account/purchases.ts
- api/admin/payments.ts
- api/apprentice-checkout.ts
- api/btcpay.ts
- api/checkout.ts
- api/entitlements.ts
- api/entitlements/check.ts
- api/entitlements/grant.ts
- api/lib/premium-route-access.ts
- api/payments/checkout.ts
- api/premium-route-cookie.ts
- api/sovereign-checkout.ts
- api/stripe.ts
- api/subscriptions/manage.ts
- api/verify-access.ts
- api/verify-stripe-session.ts
- api/webhooks/btcpay.ts
- api/webhooks/stripe.ts

## Current lib files
- lib/premium-route-access.js
- lib/premium-routes.js

## Future package targets

### packages/shared-access
Target for:
- app IDs
- access tiers
- entitlement keys
- access helper logic
- route and module gate concepts

### packages/shared-payments
Target for:
- product catalog
- mapping products to entitlements
- checkout abstraction
- payment provider normalization

## Migration rule

Do not switch live imports yet.

First:
1. define the target structure
2. identify duplicates
3. classify responsibilities
4. migrate one small live file at a time later
