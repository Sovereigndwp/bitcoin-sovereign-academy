# Product Catalog Comparison Notes

## Purpose

Track the differences between the live product catalog and the shared payments candidate.

## Live file
- api/config/products.ts

## Shared candidate
- packages/shared-payments/src/products.ts

## Expected current state

The shared version is not yet a full replacement for the live version.

It is currently a foundation that captures the target shape more accurately than the earlier starter version, but it does not yet contain every live product.

## Important rule

Do not switch live imports yet.

Before any live switch:
1. compare product coverage
2. identify missing product entries
3. identify missing fields or behaviors
4. confirm naming consistency
5. document the migration path from live catalog to shared catalog
