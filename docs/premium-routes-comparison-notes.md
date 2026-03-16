# Premium Routes Comparison Notes

## Purpose

Confirm that the shared premium route classification file matches the live route classification logic closely enough for future extraction.

## Live file
- lib/premium-routes.js

## Shared candidate
- packages/shared-access/src/premium-routes.ts

## Expected differences

Acceptable differences include:
- TypeScript type annotations
- exported interface definitions
- small syntax differences required by TypeScript

## Important rule

Behavior should remain equivalent.

Do not switch live imports until:
1. the logic is confirmed equivalent
2. any edge cases are reviewed
3. a safe import swap plan is documented
