# Reorg Map

## Goal

Turn this repo into a clean monorepo without breaking the live site.

## Future app areas

### apps/bsa
Bitcoin Sovereign Academy specific pages, paths, demos, tools, and Bitcoin-first learning experiences.

### apps/fsa
Financially Sovereign Academy specific pages, assets, JS, CSS, bridge content, and FSA learning flows.

### apps/institutional
Institutional programs including wealth advisors, corporations, education, correctional, municipalities, and country-specific institutional paths.

## Future shared packages

### packages/shared-ui
Reusable UI components only after they are confirmed to be shared and safe to extract.

### packages/shared-calculators
Reusable calculators and tools that can power multiple programs.

### packages/shared-demos
Reusable demo engines or interaction patterns that can be adapted by app.

### packages/shared-payments
Shared payment and checkout related logic once there is more than a single success page.

### packages/shared-access
Locking, unlocking, entitlement checks, preview gates, and monetization access rules.

### packages/shared-content
Shared schemas, manifests, metadata, and content relationships.

### packages/shared-testing
Shared tests, smoke checks, and validation helpers.

## Current folder classification

### Keep in place for now
- components
- payment
- paths
- demos
- tools
- interactive-demos

Reason:
These are either still live, too small, or not yet clearly separated enough to move safely.

### Likely first app migrations
- fsa
- institutional

Reason:
These already look like app-specific surfaces with their own pages and assets.

## Migration order

1. Create and confirm the monorepo structure
2. Map the current repo clearly
3. Migrate FSA into apps/fsa carefully
4. Migrate Institutional into apps/institutional carefully
5. Audit what remains for BSA-specific content
6. Extract shared logic only after real duplication is confirmed
7. Standardize monetization and access control in shared packages
8. Add stronger tests before pushing larger moves

## Non breakage rule

Before each move:
- move only one slice
- run build and tests
- inspect affected pages manually
- commit only that slice
