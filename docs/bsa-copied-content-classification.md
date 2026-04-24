# BSA Copied Content Classification

## Purpose

Classify the copied BSA content in `apps/bsa/source-current/` before any deeper reorganization.

## Categories

- BSA only
- Potentially reusable later
- Leave live only for now

## Current copied areas
- apps/bsa/source-current/paths
- apps/bsa/source-current/interactive-demos

## Decision rules

### BSA only
Keep in the BSA app area if the content is:
- Bitcoin specific
- tied to BSA personas or path structure
- tightly coupled to current BSA learning flow

### Potentially reusable later
Mark for possible future extraction if the content is:
- a generic engine
- a reusable simulation shell
- a reusable UI or calculator pattern
- adaptable to multiple programs

### Leave live only for now
Do not reorganize yet if the content:
- still depends on current route assumptions
- has unclear asset coupling
- is still actively tied to current production URLs

## Rule

Do not move anything out of the copied BSA folders yet.
Classify first, then decide the safest future targets.
