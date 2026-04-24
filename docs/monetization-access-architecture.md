# Monetization and Access Architecture

## Purpose

Standardize monetization, locking, unlocking, and entitlement logic across BSA, FSA, and Institutional before moving more code.

## Apps

- bsa
- fsa
- institutional

## Core idea

Do not let each app invent its own access logic.

Use one shared conceptual model for:
- products
- tiers
- entitlements
- gated routes
- gated modules
- gated tools
- checkout and purchase records

## Current scattered logic

### Frontend access and gating
- js/membership-gate.js
- js/payment-access-control.js
- js/subdomain-access-control.js
- js/module-gate.js
- js/module-gate-subdomain.js

### API entitlements and checkout
- api/entitlements.ts
- api/entitlements/check.ts
- api/entitlements/grant.ts
- api/account/entitlements.ts
- api/account/purchases.ts
- api/payments/checkout.ts
- api/config/products.ts

### Premium route logic
- lib/premium-route-access.js
- lib/premium-routes.js

## Future target packages

### packages/shared-access
Should eventually contain:
- app IDs
- access tiers
- entitlement types
- route gate rules
- module gate rules
- helper functions for checking access
- preview rules
- lock state logic

### packages/shared-payments
Should eventually contain:
- product catalog
- mapping from products to entitlements
- checkout helpers
- payment provider adapters
- purchase normalization

## Standard concepts

### App IDs
- bsa
- fsa
- institutional

### Access tiers
Examples:
- free
- starter
- pro
- advisor
- school
- enterprise

### Entitlement keys
Examples:
- bsa.paths.pro
- bsa.tools.pro
- fsa.modules.pro
- fsa.tools.pro
- institutional.advisor.program
- institutional.corporate.colombia
- institutional.education.core

## Rules

1. Access decisions should not be hardcoded in many places
2. Product to entitlement mapping should be centralized
3. Frontend checks should improve UX, but sensitive access should also be validated by API logic
4. Preview content should be consistent across products
5. BSA, FSA, and Institutional should use the same entitlement model even if the products differ

## Migration rule

Do not rewrite runtime access code yet.

First:
1. define the target model
2. map current files to the target model
3. identify duplicates
4. decide what will later move into shared packages
