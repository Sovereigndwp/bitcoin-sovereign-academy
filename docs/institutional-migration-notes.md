# Institutional Migration Notes

## Current status

Institutional currently exists as a live folder at `/institutional/`.

It contains:
- main landing pages
- cities, corporations, education, correctional pages
- wealth advisors pages
- bitcoin advisor certification pages
- nested module and resource pages

## Important coupling discovered

The current site and routing still reference `/institutional/` directly.

Examples:
- homepage navigation links in `index.html`
- route rewrites in `vercel.json`
- internal links throughout institutional pages
- wealth advisor certification links nested under `/institutional/wealth-advisors/...`

## Important risk

Institutional should not be moved out of `/institutional/` yet because current live paths still depend on it.

## Safe migration approach

1. Keep `/institutional/` in place for now
2. Create a working copy under `apps/institutional/`
3. Use the copy for refactoring and future app structure
4. Only switch live paths after references and routes are updated and tested
