# Interactive Demos Migration Notes

## Current status

The `interactive-demos/` folder contains BSA interactive demo experiences and related assets.

## Important coupling discovered

These demos are currently part of the live BSA structure and may be linked from paths, tools, or onboarding flows.

## Important risk

The folder should not be moved yet because current links, assets, and route expectations may still depend on `/interactive-demos/`.

## Safe migration approach

1. Keep `/interactive-demos/` in place for now
2. Classify demos by BSA only vs potentially reusable later
3. Extract shared demo engines only after duplication is confirmed
4. Only migrate live demo paths after careful testing
