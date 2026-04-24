# Tools Split Plan

## Purpose

Split the current `tools/` folder into clearer categories before moving anything.

## Current classification

### Internal developer and ops tools
- tools/bundle-assets.js
- tools/check-unique-ids.js
- tools/content-validator.js
- tools/deploy-automation.js
- tools/domain-config.js
- tools/domain-monitor.js
- tools/domain-test-suite.js
- tools/registry.js
- tools/security-headers.js
- tools/seo-optimizer.js
- tools/site-enhancer.js
- tools/test-domain.sh
- tools/test-tenants.js
- tools/vercel-weekly-maintenance.sh

### User facing tool pages
- tools/index.html
- tools/bitcoin-recovery-binder.html

### Needs further classification
- tools/domain-dashboard.html

## Migration rule

Do not move the whole `tools/` folder at once.

Instead:
1. keep internal tools in place for now
2. identify which HTML tools are user facing
3. decide whether each user facing tool belongs to BSA, FSA, Institutional, or shared
4. move only one subcategory at a time later

## Likely future destinations

### Internal tools
- tools/
- scripts/
- ops/
- packages/shared-testing/

### User facing BSA tools
- apps/bsa/tools/

### Truly shared calculators or decision tools
- packages/shared-calculators/
