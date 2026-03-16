# Copied Workspaces Summary

## Purpose

Summarize the current state of the copied app workspaces before any live wiring or import migration begins.

## BSA copied workspace

### Runtime content
- apps/bsa/source-current/paths
- apps/bsa/source-current/interactive-demos

### Support content
- apps/bsa/source-current/paths-support/docs
- apps/bsa/source-current/interactive-demos-support/docs
- apps/bsa/source-current/interactive-demos-support/meta
- apps/bsa/source-current/interactive-demos-support/backups

### Status
- copied safely
- support files separated from runtime content
- still not wired to live routing

## FSA copied workspace

### Runtime content
- apps/fsa/source-current

### Support content
- apps/fsa/source-current/fsa-support/docs
- apps/fsa/source-current/fsa-support/backups

### Status
- copied safely
- support files separated from runtime content
- still not wired to live routing

## Institutional copied workspace

### Runtime content
- apps/institutional/source-current

### Support content
- no obvious markdown or backup support files found in the first scan

### Status
- copied safely
- treated as primarily runtime content for now
- still not wired to live routing

## Shared package groundwork

### Shared access
- packages/shared-access/src

### Shared payments
- packages/shared-payments/src

### Status
- foundation created
- comparison and migration notes added
- live imports not switched yet

## Rule for next phase

Do not change live folders or runtime imports until a specific migration target is chosen and documented.

## Next likely migration targets

- shared premium route logic
- shared product catalog logic
- later, live import swaps in small controlled steps
