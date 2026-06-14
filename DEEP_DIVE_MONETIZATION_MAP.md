# DEEP_DIVE_MONETIZATION_MAP.md

Companion to `MONETIZATION_MAP.md`. Read-only audit + proposed map for `deep-dives/**/*.html`. Built 2026-06-13. **No CTAs added. No product pages created. No prices invented. No placeholder links.**

## Rule (non-negotiable)

**Deep dives remain free to read.** Monetization comes only from *optional* application tools — worksheets, calculators, templates, checklists, advisor materials, family packets, or guided support. The article explains the idea for free; the paid layer helps the reader apply it. No paywall. No selling access to the article itself.

## Implementation Hold

No CTA should be added until the Model A cleanup is merged and the destination offer exists. A missing worksheet or checklist should be listed as a product/content gap, not linked.

## Levels

- **none (trust-only):** no paid CTA; an optional soft footer to a free path is the most it should carry.
- **soft:** may point gently to a relevant free checklist or an existing paid kit.
- **direct:** reader is evaluating a real money decision; may carry a stronger contextual CTA to a worksheet/kit/advisor material/consult — once that destination exists.

Summary: none = 18 · soft = 6 · direct = 4.

## Map

| File | Topic | Reader intent | Level | Related offer (exists) | Missing paid asset | Disclosure | CTA copy recommendation |
|---|---|---|---|---|---|---|---|
| `austrian-economics/index.html` | Austrian econ hub | Browse theory | none | — | — | no | optional soft footer → free path |
| `austrian-economics/economic-calculation-problem.html` | Calculation problem | Understand concept | none | — | — | no | none |
| `austrian-economics/praxeology-human-action.html` | Praxeology | Understand concept | none | — | — | no | none |
| `austrian-economics/sound-money-theory.html` | Sound money | Understand concept | none | — | — | no | none |
| `austrian-economics/time-preference-fundamentals.html` | Time preference | Understand concept | none | — | — | no | none |
| `first-principles/index.html` | Bitcoin MVP | Learn fundamentals | none | — | — | no | optional soft footer → Curious path |
| `first-principles/digital-scarcity.html` | 21M / scarcity | Learn fundamentals | none | — | — | no | none |
| `first-principles/original-question-everything.html` | First principles guide | Learn fundamentals | none | — | — | no | none |
| `first-principles/why-money-fails.html` | Money-failure history | Learn fundamentals | none | — | — | no | none |
| `foundational-layer-thesis/index.html` | Thesis (labeled v3) | Authority / trust | none | — | — | no | none — keep pristine; fix v3→v4 label |
| `foundational-layer-thesis/executive-tldr.html` | Thesis TL;DR | Authority / trust | none | — | — | no | none |
| `foundational-layer-thesis/dashboard.html` | Falsification dashboard | Authority / trust | none | — | — | no | none |
| `foundational-layer-thesis/newcomer-onepager.html` | Newcomer intro | Onboard newcomer | none | — | — | no | optional soft footer → Curious path |
| `philosophy-economics/index.html` | Philosophy hub | Browse | none | — | — | no | none |
| `philosophy-economics/property-rights.html` | Property rights | Conceptual | none | — | — | no | none |
| `philosophy-economics/time-preference.html` | Time preference | Conceptual | none | — | — | no | none |
| `philosophy-economics/voluntaryism-bitcoin.html` | Voluntaryism | Conceptual | none | — | — | no | none |
| `money-banking/index.html` | Money & banking hub | Browse | none | — | — | no | none |
| `money-banking/cantillon-effect.html` | Cantillon effect | Understand inflation | none | — | — | no | none |
| `money-banking/central-banking-explained.html` | Central banking | Understand the Fed | none | — | — | no | none |
| `money-banking/history-of-money.html` | History of money | Context | soft | — | — | no | soft footer → free "Start Simple" path |
| `deep-dives/index.html` | Deep-dives hub | Navigate | soft | — | — | no | soft footer → relevant free path |
| `sovereign-tools/index.html` | Tools hub | Find a tool | soft | Starter Kit $49 | — | no | calm footer: printable version is in the kits |
| `sovereign-tools/privacy-best-practices.html` | Privacy how-to | Apply privacy | soft | — | Free privacy/red-flag checklist | no | "Get the free privacy checklist to apply this." |
| `sovereign-tools/running-a-node.html` | Run a node | Set up a node | soft | Starter Kit $49 (tangential) | Free node-setup checklist | no | "Follow the free node-setup checklist." |
| `sovereign-tools/multisig-guide.html` | Multisig security | Set up custody | direct | Family Recovery Kit $149; custody consult | Custody decision worksheet | **required now (missing)** | "Applying this for your family? The Family Bitcoin Recovery Kit ($149) walks the setup step by step." |
| `bitcoin-capital/index.html` | Capital series hub | Evaluate borrowing | direct | Consult (TBA / Loan My Coins) | Loan/mortgage readiness worksheet | **required now (satisfied)** | "Run your numbers with the worksheet, or book a readiness call." |
| `bitcoin-capital/bitcoin-backed-loans.html` | BTC-backed loans | Decide on a loan | direct | Consult (TBA / Loan My Coins) | Loan-terms comparison worksheet | **required now (satisfied)** | "Compare real offers with the loan worksheet before you pledge." |
| `bitcoin-capital/bitcoin-backed-mortgages.html` | BTC-backed mortgages | Decide on a mortgage | direct | — | Mortgage/collateral readiness worksheet | **required later** | "Model your deal with the mortgage readiness worksheet." |

## Disclosure status

- **Required now (page already names TBA / Loan My Coins or routes to a consult):**
  - `bitcoin-capital/bitcoin-backed-loans.html` — satisfied (disclosure present).
  - `bitcoin-capital/index.html` — satisfied (disclosure present).
  - `sovereign-tools/multisig-guide.html` — **MISSING**: routes to a custody consult/advisor; needs the approved disclosure line. (Fold into the Model A / disclosure branch.)
- **Required later (a future CTA will route to TBA / Loan My Coins / guided advisory support):**
  - `bitcoin-capital/bitcoin-backed-mortgages.html` — add disclosure when a mortgage worksheet/consult CTA is wired to LMC/TBA.
  - Any `soft`/`direct` page above if its eventual CTA points to guided advisory support.

## Candidate Assets to Build

These are product/content gaps. They are **listed, not linked** — do not create placeholder links until the asset exists.

1. **Privacy checklist** — likely free lead magnet.
2. **Node setup checklist** — likely free lead magnet.
3. **Loan-terms comparison worksheet** — paid or included with a kit; decision needed.
4. **Mortgage/collateral readiness worksheet** — paid or included with a kit; decision needed.
5. **Custody decision worksheet** — possibly included in the Family Recovery Kit or offered as a free preview; decision needed.

## Notes
- "direct" ≠ paywall: every article stays fully free; the CTA is an *optional* application tool.
- Reader intent is inferred from topic/title/body, not analytics; a few soft-vs-none calls could shift with engagement data.
- Two disclosure items here (`multisig-guide` now, `bitcoin-backed-mortgages` later) intersect the Model A disclosure work.

---
*Companion to `MONETIZATION_MAP.md` and `DISCLOSURE_POLICY.md`. Enforced by `scripts/check-operating-risk.js`. No deep-dive pages were edited to produce this map.*
