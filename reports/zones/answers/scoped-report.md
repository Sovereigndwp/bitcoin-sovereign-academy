# Scoper report — zone: `answers/`

_Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved._

Generated 2026-06-25 16:55 UTC. Proposal-only: no source files modified.

## Classification
- HTML files in zone: 14
- Eligible (missing canonical, not data-*): **14**
- Skipped — already on canonical CSS: 0
- Skipped — data-* injected (gated, needs screenshot QA): 0
- Pages with drift orange (future canonicalize PR): 0
- Pages with semantic state classes (protect): 0
- Zone is high-risk: no

## Proposed change
Insert the canonical stylesheet link (absolute path, BSA rule) before `</head>` on the 14 eligible pages:

```html
<link rel="stylesheet" href="/css/brand.css">
```
No other change. Orange is preserved; no drift hex is touched in this zone-PR.

## Eligible files
- answers/how-does-she-eat-during-those-29-days-when-nobody-needs-her.html
- answers/how-much-do-you-need.html
- answers/what-happens-to-my-choices-when-an-emergency-hits-and-i-have.html
- answers/what-is-bitcoin-self-custody.html
- answers/what-saved-the-funds-2of3-multisig-configuration-one-key-at.html
- answers/what-separates-sound-money-from-failed-experiments.html
- answers/what-went-wrong-automated-cosigning-without-verification-tru.html
- answers/what-went-wrong-single-signature-control-ceo-only-no-success.html
- answers/what-worked-simple-and-direct-when-wants-align-no-middleman.html
- answers/what-worked-useful-beyond-being-money-eat-the-grain-use-the.html
- answers/when-money-is-stable-prices-convey-accurate-information-abou.html
- answers/when-states-control-money-they-print-to-fund-wars-expand-pow.html
- answers/when-you-have-self-custody-of-your-bitcoin-you-have-complete-control-over-your-funds-and-dont-need-permission-from-anyone-to-send-or-receive-transactions.html
- answers/why-emergency-funds-matter-the-problem-nobody-talks-about-yo.html

## What stays untouched
Content, copy, routes, JSON-LD, scripts, localStorage keys, semantic state colors, and brand orange itself.

## QA checklist
- Page still renders; canonical link present once in `<head>`.
- No visual change expected (inline orange already canonical).
- Screenshot QA: NOT REQUIRED (no data-* pages in scope; static link-only change)
- `git status` shows only the eligible files after apply.
