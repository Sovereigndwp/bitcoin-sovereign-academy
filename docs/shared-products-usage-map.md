# Shared Products Usage Map

## Purpose

Map current product catalog consumers before attempting any live shared product adoption.

## Current live source of truth
- api/config/products.ts

## Current consumer groups

### High risk API consumers
- api/payments/checkout.ts
- api/entitlements/grant.ts
- api/entitlements/check.ts
- api/lib/validation.ts
- api/account/entitlements.ts
- api/webhooks/btcpay.ts
- api/webhooks/stripe.ts

### Separate frontend product catalogs or product mirrors
- js/payment-access-control.js
- payment/success.html

## Important finding

The API consumers rely on helper exports from `api/config/products.ts`, not just raw product data.

Examples include:
- getProduct
- supportsBTCPay
- isRecurring
- getPrice
- calculateExpiration
- isFreeDemo
- FREE_DEMOS
- isValidProductId

## Rule

Do not switch any live consumer to `packages/shared-payments/src/products.ts` yet.

First:
1. inspect the current exports in `api/config/products.ts`
2. design shared helper equivalents
3. decide whether to build a compatibility adapter
4. only then migrate one low-risk consumer
