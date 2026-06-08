# Content Monetization — Audit + Phase 1 Implementation (2026-06-08)

## What this is
An end-to-end pass: audit all BSA content for monetization potential, then ship the highest-leverage, TBA-safe monetization layer. Generated autonomously; landed on a branch for review.

## The audit
- **Scope:** 208 pages — `paths/` (110), `interactive-demos/` (53), `deep-dives/` (29), `youth-families/` (13), `products/` (3).
- **Deliverable:** [`reports/bsa-content-inventory-2026-06-08.xlsx`](bsa-content-inventory-2026-06-08.xlsx) — 17-column monetization map + Summary + Top-10 Promotions + Top-10 Cuts/Merges. Conditional formatting on Quality/Business-Value/Priority.
- **Quality distribution:** Q5=18, Q4=101, Q3=79, Q2=8, Q1=2 (evidence-based, caps cited per row).
- **Recommended actions:** Keep 123, Reposition 40, Rewrite 18, Promote to Paid 8, Promote to Lead Magnet 7, Merge 6, Cut 2, Localize ES 1.

## The core finding
Of 208 content pages, **exactly 1 linked to a paid kit or pricing.** The platform educates deeply (DIY self-custody, wallets, UTXOs, fees, nodes, multisig, security drills) but routed almost nothing to its 3 paid kits. **~106 pages carry a Self-Study / Full-Access offer in the audit but had no on-page route to one.** That gap is the leverage.

## TBA boundary (hard constraint, enforced)
The Bitcoin Adviser (collaborative multisig, TBA holds a key) **includes free**: inheritance, family education/custody, docs, support. Paid offers attach **only** to DIY single-sig and own-key multisig content. No paid CTA was placed on any inheritance/family/collaborative page; the `family-bitcoin-recovery-kit` is flagged in the audit to add a "TBA clients already get this free" line near its buy box.

## Phase 1 — shipped (this branch)
A **kit-routing CTA layer** using the existing `demo-cta-footer` component (audience tracks + first-party analytics via `bsaAnalytics.track('demo_cta_click')`). Added to **19 DIY self-custody pages**, each with one paid track → `/products/self-custody-starter-kit/` ($49) and one free next-step track. Verified in-browser: renders, AA contrast (orange #FF7A00 on #1F2024 ≈ 5.7:1), no console errors, brand-consistent.

Pages: fee-master-tool, multisig-setup-wizard, node-setup-sandbox, transaction-builder, utxo-visualizer-enhanced, bitcoin-key-generator-visual, testnet-practice-guide, security-risk-simulator, wallet-security-workshop, security-dojo-enhanced, wallet-workshop (11 demos); sovereign/stage-1/module-1, sovereign/stage-2/module-3, sovereign/stage-3/module-1, curious/stage-4/module-2, hurried/stage-1/module-3, pragmatist/stage-2/module-5-security (6 modules); sovereign-tools/running-a-node, sovereign-tools/multisig-guide (2 deep-dives).

## Phase 2 — recommended next (not in this PR; larger/riskier, benefit from Phase 1 merging first)
1. **Lead-magnet email captures** (7 rows, `Promote to Lead Magnet`): gate downloadable checklists/PDFs behind `js/email-capture.js` (→ `/api/subscribe`) on: curious/stage-1/module-1, sovereign proofs-not-promises + scam-defense, bitcoin-dca-time-machine, onramp-chooser, austrian time-preference-fundamentals, first-principles index. Keep ≤15% of pages gated.
2. **Stale-data rewrites** capping quality (P0/P1): foundational-layer-thesis set still says "v3" (v4 is canonical); CoinJoin/PayNym modules center defunct Samourai/Wasabi → re-center on JoinMarket/PayJoin with the old tools as historical; `data-btc-live` bindings for hardcoded prices/heights/hashrates.
3. **ES localization** (curious Stage-1 EN→ES gaps; module-2-5 missing) and EN↔ES toggles where all siblings are localized.
4. **Cuts/merges:** key-generator backup/fragment dupes; near-duplicate first-principles + time-preference pages.

Full per-page next-steps are in the xlsx.
