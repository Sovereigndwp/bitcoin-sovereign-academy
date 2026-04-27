# BSA Interactive Demos — Orchestration-Lens Audit

Date: 2026-04-27
Scope: 50 demos in `/interactive-demos/`
Method: 7 parallel agents scoring each demo against the 12-dimension orchestration lens, 7 audience segments, and tone constraints.

## Verdict legend

- **KILL** — delete or replace; doesn't earn its slot
- **COPY_PASS** — content is solid, needs polish/CTA bridge only
- **UX_OVERHAUL** — significant UX/UI rework
- **RETARGET** — content is fine but aimed at the wrong audience
- **UPGRADE_DATA** — facts/data/links broken or stale; rewrite around current reality
- **KEEP_AS_IS** — works as-is for current scope

## Master findings table (50 demos)

| # | Demo | Verdict | Leverage | Top P0 issue |
|---|---|---|---:|---|
| 1 | coinjoin-simulator | UX_OVERHAUL | **9** | ⚠️ Tools defunct (Whirlpool/Wasabi shut Apr–Jun 2024) — embarrasses on review |
| 2 | mempool-visualizer | UX_OVERHAUL | **9** | "Live" mempool integration is placeholder; live quiz function undefined |
| 3 | emergency-fifty-scenario | UX_OVERHAUL+RETARGET | **9** | Strongest real-world resonance; zero product CTA, zero ES |
| 4 | multisig-setup-wizard | UPGRADE_DATA | **9** | Only 1 scenario; highest conversion intent unrealized |
| 5 | savings-disappear-scenario | COPY_PASS | **9** | Production-ready; missing 2025 retrospective |
| 6 | sovereign-vault | COPY_PASS | **9** | Production-ready; missing persona-driven framing |
| 7 | fee-master-tool | UX_OVERHAUL | 8 | API fallback returns stale defaults silently; no live-data badge |
| 8 | bitcoin-vs-banking | RETARGET | 8 | Generic comparison; missing political-risk frame for HNW/advisor |
| 9 | double-spending-demo | RETARGET | 8 | Strongest narrative; US-centric, zero Colombian frame |
| 10 | bitcoin-key-generator-visual | UX_OVERHAUL | 8 | Voice oscillates beginner↔PhD; security UX inverted |
| 11 | lightning-network-demo | UPGRADE_DATA | 8 | Mobile SVG overflow; missing liquidity teaching |
| 12 | testnet-practice-guide | UPGRADE_DATA | 8 | No ES; single faucet (single point of failure) |
| 13 | security-risk-simulator | UPGRADE_DATA | 8 | No ES; opaque scoring weights; no product CTA |
| 14 | wallet-security-workshop | UPGRADE_DATA | 8 | No ES; no bridge to real testnet/Sparrow |
| 15 | sat-stacking-calculator | COPY_PASS | 8 | Missing "why DCA works" context |
| 16 | node-setup-sandbox | RETARGET | 8 | Explanatory not actionable; needs wizard rebuild |
| 17 | bitcoin-dca-time-machine | KEEP_AS_IS | 7 | Broken `/start/` CTA link; data ends 2024 |
| 18 | bitcoin-sovereign-game | KEEP_AS_IS | 7 | Strong engagement; zero ES, no post-game custody CTA |
| 19 | consensus-game | RETARGET | 7 | Audience segmentation missing |
| 20 | energy-bucket | COPY_PASS | 7 | Frames auto-complete on view, kills agency |
| 21 | ledger-keeper-dilemma | KEEP_AS_IS | 7 | Solid; add diagnostic quiz |
| 22 | bitcoin-layers-map | RETARGET | 7 | No persona filter; no concrete next-action per layer |
| 23 | mining-simulator | COPY_PASS | 7 | Browser hash 1M× slower; needs framing |
| 24 | security-dojo-enhanced | RETARGET | 7 | Belt gamification off-tone; no ES |
| 25 | transaction-builder | UPGRADE_DATA | 7 | Builds tx → no testnet broadcast bridge |
| 26 | computational-puzzles-demo | KEEP_AS_IS | 6 | Strong; needs custody bridge |
| 27 | inflation-impact-calculator | KEEP_AS_IS | 6 | Solid; CTA generic |
| 28 | digital-signatures-demo | UPGRADE_DATA | 6 | Sterile mechanics; needs narrative wrapper |
| 29 | account-freeze-locked-out | KEEP_AS_IS | 6 | Fear-mongering header; no Bitcoin-purchase CTA |
| 30 | onramp-chooser | KEEP_AS_IS | 6 | No destination CTAs after results |
| 31 | bitcoin-price-timeline | COPY_PASS | 6 | Stale data; takeaways are platitudes |
| 32 | utxo-visualizer-enhanced | RETARGET | 6 | Sandbox without mission |
| 33 | stock-to-flow | KEEP_AS_IS | 6 | Strong learning; weak conversion bridge |
| 34 | bitcoin-supply-schedule | UX_OVERHAUL | 5 | No "why this matters" frame; mobile broken |
| 35 | money-properties-comparison | KEEP_AS_IS | 5 | Strong scaffold; no outbound link strategy |
| 36 | network-consensus-demo | KEEP_AS_IS | 5 | Effective; needs interlink to mining-economics |
| 37 | debt-crisis | UX_OVERHAUL | 5 | Pulsing-red fear-mongering tone; off-brand |
| 38 | address-format-explorer | COPY_PASS | 5 | Recommendation buried at bottom |
| 39 | kyc-best-practices | RETARGET | 5 | **Broken links** (references demos that don't exist) |
| 40 | time-preference-explorer | RETARGET | 5 | Generic econ jargon; no LatAm scenarios |
| 41 | bitcoin-unit-converter | COPY_PASS | 4 | "Beginner" badge patronizing; no privacy note |
| 42 | building-the-chain-demo | KEEP_AS_IS | 4 | Doesn't explain cost-of-attack |
| 43 | network-growth-demo | KEEP_AS_IS | 4 | Chart unlabeled; no risk note |
| 44 | time-chain-explorer | COPY_PASS | 4 | Variance teaching, no decision lever |
| 45 | difficulty-calculator | COPY_PASS | 3 | Specialist tool; alienates 5/7 segments |
| 46 | 30-day-money-plan | KILL | 2 | 19 screens, no save, Bitcoin tacked on, no exit CTA |
| 47 | bolt11-decoder | KILL | 2 | Stub implementation; "decoded hash" is fake |
| 48 | time-machine | KILL | 2 | Pure nostalgia; no decision lever |
| 49 | quiz-demo | KILL | 1 | Dev docs masquerading as demo |
| 50 | wallet-workshop | TBD | — | Audit truncated (file too large for batch) |

## Cross-cutting themes (apply to most demos)

1. **Zero ES localization across the entire demo set.** Audience segments 5 (Colombia employer) and 6 (Spanish-speaking employee) are unreachable today. Either commit to ES across the board or stop targeting these segments.
2. **CTA dead-ends.** Most demos teach a concept then end with a generic email-capture or no exit. The orchestration lens's *applicability test* fails: users learn but aren't moved toward a product/guide/consultation.
3. **No persona filtering.** Demos try to serve all audiences with one voice. Result: too jargon-y for beginners, too shallow for HNW/advisors.
4. **Data freshness rot.** Multiple demos cite 2024/2025 data presented as current; a few have broken external links (`/start/`, removed Whirlpool, missing demo refs in kyc-best-practices).
5. **Tone red flags in a small but visible cluster.** `debt-crisis`, `account-freeze-locked-out` use fear-mongering aesthetics ("CRISIS", pulsing red, "ACCOUNT ALERT") that contradict the project's "skeptical of fake simplicity, not fear-based" voice.
