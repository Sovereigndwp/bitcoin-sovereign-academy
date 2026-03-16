# Premium Route Access Migration Notes

## Purpose

Document the duplicated premium route access logic before attempting any live migration.

## Duplicate files found

### JavaScript runtime version
- lib/premium-route-access.js

### TypeScript API version
- api/lib/premium-route-access.ts

## Related route definition file
- lib/premium-routes.js

## Shared responsibilities observed

Both implementations include logic for:
- premium route cookie naming
- premium route tiers
- premium path IDs
- claims building
- token signing
- cookie serialization
- access inference from tier and path IDs

## Risk

These files appear to implement overlapping access logic in different layers.

Changing one without understanding the other could break:
- premium path access
- deep dive protection
- cookie handling
- token verification
- route gating behavior

## Safe migration rule

Do not replace either file yet.

First:
1. compare both implementations carefully
2. identify which logic is identical
3. identify which logic is runtime specific
4. identify what should eventually move into packages/shared-access
5. only then plan a small non-breaking extraction
