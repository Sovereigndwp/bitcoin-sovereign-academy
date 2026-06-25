# Scoper report — zone: `answers/`

_Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved._

Generated 2026-06-25 18:08 UTC. Proposal-only: no source files modified.

## Classification
- HTML files in zone: 14
- Eligible (missing canonical, not data-*): **0**
- Skipped — already on canonical CSS: 14
- Skipped — data-* injected (gated, needs screenshot QA): 0
- Pages with drift orange (future canonicalize PR): 0
- Pages with semantic state classes (protect): 0
- Human-frozen pages excluded: 0
- Zone is high-risk: no

## Proposed change
Insert the canonical stylesheet link (absolute path, BSA rule) before `</head>` on the 0 eligible pages:

```html
<link rel="stylesheet" href="/css/brand.css">
```
No other change. Orange is preserved; no drift hex is touched in this zone-PR.

## Eligible files
- 

## What stays untouched
Content, copy, routes, JSON-LD, scripts, localStorage keys, semantic state colors, and brand orange itself.

## QA checklist
- Page still renders; canonical link present once in `<head>`.
- No visual change expected (inline orange already canonical).
- Screenshot QA: NOT REQUIRED (no data-* pages in scope; static link-only change)
- `git status` shows only the eligible files after apply.
