# Tools Split Plan

## Purpose

Split the current `tools/` folder into clearer categories before moving anything.

## Likely categories

### Internal dev and ops tools
Examples:
- domain config
- domain monitor
- deploy automation
- SEO optimizer
- content validator
- test scripts
- maintenance scripts

### User facing tools
Examples:
- tools index
- recovery binder
- future calculators or decision tools

## Migration rule

Do not move the whole `tools/` folder at once.

Instead:
1. identify internal-only files
2. identify user-facing files
3. identify test/validation files
4. move only one subcategory at a time later

## Likely future locations

### Internal dev and ops tools
- keep under `tools/`
- or move selected items into `scripts/` or `packages/shared-testing/`

### User facing tools
- BSA-specific tools stay with BSA
- FSA-specific tools stay with FSA
- truly shared tools may later go to `packages/shared-calculators` or a shared tools package
