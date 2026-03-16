# FSA Migration Notes

## Current status

FSA currently exists as a live folder at `/fsa/`.

It contains:
- index.html
- assets/css
- assets/js
- bridge pages
- docs and planning files

## Important coupling discovered

The current site and navigation still reference `/fsa/` directly.

Examples:
- js/site-nav.js checks for `/fsa/`
- bridge pages link back to `/fsa/`
- documentation references `/fsa/...`

## Important risk

FSA should not be moved out of `/fsa/` yet because current live paths still depend on it.

## Additional issue found

`fsa/index.html` references `assets/js/persona.js`, but that file was not present in the file listing during inspection.

This must be checked before a final migration.

## Safe migration approach

1. Keep `/fsa/` in place for now
2. Create a working copy under `apps/fsa/`
3. Use the copy for refactoring and future app structure
4. Only switch live paths after references are updated and tested
