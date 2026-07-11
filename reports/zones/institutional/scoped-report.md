# Scoper report — zone: `institutional/`

_Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved._

Generated 2026-06-25 21:34 UTC. Proposal-only: no source files modified.

## Classification
- HTML files in zone: 52
- Eligible (missing canonical, not data-*): **26**
- Skipped — already on canonical CSS: 11
- Skipped — data-* injected (gated, needs screenshot QA): 13
- Pages with drift orange (future canonicalize PR): 1
- Pages with semantic state classes (protect): 7
- Human-frozen pages excluded: 2
- Zone is high-risk: no

## Proposed change
Insert the canonical stylesheet link (absolute path, BSA rule) before `</head>` on the 26 eligible pages:

```html
<link rel="stylesheet" href="/css/brand.css">
```
No other change. Orange is preserved; no drift hex is touched in this zone-PR.

## Eligible files
- institutional/cities.html
- institutional/corporations.html
- institutional/correctional.html
- institutional/education.html
- institutional/index.html
- institutional/real-estate-developers/calculator/index.html
- institutional/real-estate-developers/index.html
- institutional/wealth-advisors/bitcoin-advisor-certification/advisor-toolkit.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-1/module-01-problem-bitcoin-solves.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-1/module-02-bitcoin-monetary-economics.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-1/module-03-bitcoin-as-portfolio-asset.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-1/module-04-portfolio-allocation-strategies.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-2/module-05-understanding-bitcoin-custody.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-2/module-06-exchange-and-etf-custody.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-2/module-07-self-custody-hardware-wallets.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-2/module-08-collaborative-custody-multisig.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-3/module-09-bitcoin-tax-treatment.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-3/module-10-estate-inheritance-planning.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-3/module-11-client-education-communication.html
- institutional/wealth-advisors/bitcoin-advisor-certification/day-3/module-12-building-advisory-practice.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-13-working-with-bitcoin-specialists.html
- institutional/wealth-advisors/bitcoin-advisor-certification/resources/advisor-simulation-exercise.html
- institutional/wealth-advisors/bitcoin-advisor-certification/resources/client-risk-assessment-tool.html
- institutional/wealth-advisors/bitcoin-advisor-certification/resources/custody-decision-tree.html
- institutional/wealth-advisors/bitcoin-advisor-certification/resources/slide-deck.html
- institutional/wealth-advisors/index.html

## Deferred (data-* — separate gated pass)
- institutional/wealth-advisors/bitcoin-advisor-certification/index.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-01-why-advisors-cannot-ignore-bitcoin.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-02-bitcoin-explained-professionals.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-03-bitcoin-as-asset-class.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-04-allocation-frameworks.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-05-bitcoin-investment-vehicles.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-06-custody-and-security.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-07-bitcoin-taxation.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-08-estate-and-inheritance-planning.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-09-compliance-and-fiduciary-duty.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-10-client-communication-mastery.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-11-case-studies-common-scenarios.html
- institutional/wealth-advisors/bitcoin-advisor-certification/modules/module-12-building-advisory-practice.html

## Drift-orange pages (future canonicalize PR, not this one)
- institutional/real-estate-developers/index.html

## Human-frozen (excluded by human freeze; requires dedicated approval; no action)
- institutional/corporations/colombia/index.html
- institutional/corporations/colombia/ruta-estabilidad-crecimiento/index.html

## What stays untouched
Content, copy, routes, JSON-LD, scripts, localStorage keys, semantic state colors, and brand orange itself.

## QA checklist
- Page still renders; canonical link present once in `<head>`.
- No visual change expected (inline orange already canonical).
- Screenshot QA: REQUIRED (zone has data-* or is high-risk) — run before any apply
- `git status` shows only the eligible files after apply.
