# Premium Routes Live Swap Plan

## Purpose

Plan the first safe live import swap candidate.

## Current live file
- lib/premium-routes.js

## Shared candidate
- packages/shared-access/src/premium-routes.ts

## Why this is the safest first live swap target

- pure route classification logic
- no direct database access
- no direct checkout logic
- no webhook logic
- no payment provider dependencies

## Preconditions already completed

- shared copy created
- comparison note added
- diff reviewed
- behavior appears equivalent aside from TypeScript typing additions

## Important rule

Do not swap imports yet.

Before any live swap:
1. decide where the live JS runtime can import the shared file from
2. confirm module format compatibility
3. choose one small caller to test first
4. document rollback steps

## Likely first callers to review

- lib/premium-route-access.js
- api/lib/premium-route-access.ts

## Rollback rule

If a live swap is attempted later, it must be done in one small commit with a clear rollback path.
