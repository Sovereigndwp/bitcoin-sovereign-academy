# Product Catalog Migration Notes

## Purpose

Compare the current live product catalog with the future shared payments structure.

## Current live source

- api/config/products.ts

## Future shared source

- packages/shared-payments/src/types.ts
- packages/shared-payments/src/products.ts

## Important finding

The original shared payments starter model was too simple.

The live product system currently includes:
- price
- description
- recurring status
- duration
- entitlement type
- item ID
- features
- provider fields like Stripe and BTCPay

The shared model must support those fields before live migration is attempted.

## Migration rule

Do not replace the live API catalog yet.

First:
1. make the shared structure rich enough
2. compare each live product to a future shared equivalent
3. add missing product categories
4. only then consider switching live imports
