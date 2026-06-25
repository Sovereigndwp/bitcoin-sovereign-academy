# Scoper report — zone: `deep-dives/`

_Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved._

Generated 2026-06-25 18:08 UTC. Proposal-only: no source files modified.

## Classification
- HTML files in zone: 54
- Eligible (missing canonical, not data-*): **11**
- Skipped — already on canonical CSS: 37
- Skipped — data-* injected (gated, needs screenshot QA): 1
- Pages with drift orange (future canonicalize PR): 14
- Pages with semantic state classes (protect): 4
- Human-frozen pages excluded: 5
- Zone is high-risk: yes

## Proposed change
Insert the canonical stylesheet link (absolute path, BSA rule) before `</head>` on the 11 eligible pages:

```html
<link rel="stylesheet" href="/css/brand.css">
```
No other change. Orange is preserved; no drift hex is touched in this zone-PR.

## Eligible files
- deep-dives/bitcoin-capital/bitcoin-backed-loans.html
- deep-dives/bitcoin-capital/bitcoin-backed-mortgages.html
- deep-dives/bitcoin-capital/index.html
- deep-dives/jurisdictional-exposure-audit/audit/index.html
- deep-dives/jurisdictional-exposure-audit/library/australia/index.html
- deep-dives/jurisdictional-exposure-audit/library/colombia/index.html
- deep-dives/jurisdictional-exposure-audit/library/el-salvador/index.html
- deep-dives/jurisdictional-exposure-audit/library/index.html
- deep-dives/jurisdictional-exposure-audit/library/panama/index.html
- deep-dives/jurisdictional-exposure-audit/library/switzerland/index.html
- deep-dives/jurisdictional-exposure-audit/library/united-states/index.html

## Deferred (data-* — separate gated pass)
- deep-dives/jurisdictional-exposure-audit/index.html

## Drift-orange pages (future canonicalize PR, not this one)
- deep-dives/bitcoin-capital/bitcoin-backed-loans.html
- deep-dives/first-principles/digital-scarcity.html
- deep-dives/money-banking/asset-vs-wage-chart.html
- deep-dives/money-banking/bitcoin-issuance-explorer.html
- deep-dives/money-banking/bitcoin-rules-vs-discretion.html
- deep-dives/money-banking/cantillon-effect.html
- deep-dives/money-banking/cantillon-position-simulator.html
- deep-dives/money-banking/central-banking-explained.html
- deep-dives/money-banking/fed-trilemma-challenge.html
- deep-dives/money-banking/fractional-reserve-banking.html
- deep-dives/money-banking/history-of-money.html
- deep-dives/money-banking/how-money-is-created.html
- deep-dives/money-banking/index.html
- deep-dives/money-banking/money-properties-scorecard.html

## Human-frozen (excluded by human freeze; requires dedicated approval; no action)
- deep-dives/foundational-layer-thesis/dashboard.html
- deep-dives/foundational-layer-thesis/executive-tldr.html
- deep-dives/foundational-layer-thesis/index.html
- deep-dives/foundational-layer-thesis/newcomer-onepager.html
- deep-dives/foundational-layer-thesis/reader.html

## What stays untouched
Content, copy, routes, JSON-LD, scripts, localStorage keys, semantic state colors, and brand orange itself.

## QA checklist
- Page still renders; canonical link present once in `<head>`.
- No visual change expected (inline orange already canonical).
- Screenshot QA: REQUIRED (zone has data-* or is high-risk) — run before any apply
- `git status` shows only the eligible files after apply.
