# Product ID Mapping Notes

## Purpose

Map current live product IDs to future shared product IDs.

## Current live source
- api/config/products.ts

## Future shared source
- packages/shared-payments/src/products.ts

## Shared products already modeled
- bsa-demo-single
- bsa-path-monthly-curious
- fsa-pro-monthly
- institutional-advisor

## Mapping approach

For each live product, decide:
1. keep same concept with a new shared ID
2. merge into a broader shared product family
3. defer because it is not yet represented
4. mark as app-specific if it should not become shared

## Categories to track
- BSA micro unlocks
- BSA path products
- BSA all-access products
- FSA premium products
- Institutional program products

## Important rule

Do not rename live product IDs yet.

First:
1. list current live IDs
2. map them to future shared equivalents
3. identify missing shared entries
4. only later decide whether live IDs should stay or migrate
