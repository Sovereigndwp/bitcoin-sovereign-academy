# Runtime Folder Classification

## Purpose

Classify the remaining high risk folders before moving anything else.

## Folders under review

- js
- api
- lib
- public

## Decision rules

Do not move these folders until:
1. route coupling is understood
2. shared runtime behavior is identified
3. live asset expectations are known
4. backend or deployment impact is understood
5. a compatibility plan exists

## Expected categories

### Leave in place for now
Folders that still power the current live site directly.

### Shared runtime later
Folders or files that may eventually become shared runtime packages.

### App-specific later
Files that may eventually move into BSA, FSA, or Institutional app areas after routing is stabilized.
