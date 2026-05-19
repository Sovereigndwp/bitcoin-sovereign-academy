# Foundational-Layer Thesis — Project Memory

**Project:** "Bitcoin Is No Longer Just the Foundational Layer" — the symbiotic-sovereign thesis, falsification framework, companion documents, and figures.

**Location:** `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/foundational-layer-thesis/`

**Current canonical version:** **v4** (May 2026). v3 archived in-place.

---

## Current state — May 2026

| Document | v4 status | Notes |
|---|---|---|
| `thesis-v4.md` | **canonical** | Strategic spine: "activity moves to the fastest rail, trust moves to the hardest asset." Taxonomy table (Bitcoin-native / -secured / -adjacent / -branded). Privacy-is-not-one-thing section. Macro framing. |
| `executive-tldr.md` + `.html` | **canonical** | v4 rewrite. 10 of 9 honest-front split. References Falsification Framework v4. |
| `newcomer-onepager.md` + `.html` | **canonical** | Block-1 audit fixes applied (proof-of-work softening, self-custody recovery, stablecoin issuer risk, sovereignty softening). |
| `falsification-framework-v4.md` | **canonical (new in Block 2)** | 17 falsifiers with 12 definitional rewrites (F1 SoV denominator, F2 split, F3/F4 trust-tier reporting, F5 pause/recover, F6 operational escape hatch, F7 stablecoin universe, F8 six-test sovereign rubric, F9/F16 clean separation, F10 expanded jurisdiction set, F13 humility flag, F17 BIP-360/BIP-361 reconciliation) + new per-falsifier confidence rating. Thresholds and methodology-immutability rule unchanged from v3. |
| `dashboard.html` | **canonical (v4 in Block 2)** | STORAGE_KEY `bsa-falsifiers-v4`. Per-card confidence + last-reviewed + source-note. F17 source URL fixed to BIP-0360 BIPs repo. F17 unilateral-invalidation verdict logic preserved. |
| `field-guide.md` | **canonical (v4 in Block 2)** | Maturity-status labels (Research / Testnet / Mainnet-early / Production / Battle-tested), legal-pressure tags (Low / Moderate / Elevated / Acute), and stack-wide "what Bitcoin guarantees vs new trust added" table at top. 14 panel edits applied. |
| `regulatory-deep-dive.md` | **canonical (v4 in Block 2)** | MiCA timeline corrected (Title III/IV June 30 2024; full CASP Dec 30 2024). ART/EMT reframed (USDT + USDC are EMTs, not ART). 60%-reserves claim softened to threshold-triggered. Tornado-Cash multi-vector framing applied. FATF gray-listing claim softened. $2K Coinbase example removed. El Salvador rollback softening. WoS Nov 2024 correction. |
| `quantum-scenario.md` | **canonical (v4 in Block 2)** | BIP-360 (P2MR — the activation that matters for F17(a)) and BIP-361 (contested freeze proposal — not a F17 input) reconciled as separate proposals with separate roles. Primary BIP-360 source URL added. |
| `assets/three-patterns.svg` | **v4 (Block 1)** | 6 audit lines rewritten ("absorbs every monetary capability" → "can connect to other monetary functions"; "trust is math" → "trust is minimized differently at each layer"; etc.). |
| `assets/stack-ontology.svg` | **v4 (Block 3)** | "TRUST FLOWS DOWN TO L0 BITCOIN" → "FINAL SETTLEMENT FLOWS TO BITCOIN — WHERE EXIT RIGHTS ARE REAL". Asset-row trust-model footnote added. Doctrine band softened ("absorption, not exclusion" → "activity moves to fastest rail; trust moves to hardest asset"). L0 cell "★ The asset wins SoV outright" → "★ Dominant crypto-native SoV candidate". "Immutable consensus" → "fixed by protocol consensus". |
| `assets/three-functions.svg` | **v4 (Block 3)** | "WON" badge → "DOMINANT DIGITAL SoV CANDIDATE". "Immutable consensus" → "fixed by protocol consensus". Bottom thesis bar: "Bitcoin is taking it correctly" → "SoV → MoE → UoA is a strategy with strong historical precedent, not a universal law". |
| `assets/competing-theses-infographic.svg` | **v4 (Block 3)** | "v3 · May 2026" → "v4 · May 2026". Named critics (Antonopoulos, Saylor, Krugman, Roubini, Fama, Hasu, etc.) replaced with "REPRESENTATIVE VIEW" descriptions to avoid pinning living individuals to a synthesized position. SST card: "dollar utility without dollar dependency" → "dollar access, not dollar sovereignty"; "Connect, not absorb" → "Activity may route around Bitcoin". |
| `assets/correlated-failures-diagram.svg` | **v4 (Block 3)** | "v3 · May 2026" → "v4 · May 2026". Scenario 01: "BTC Price Crash 50%" → "BTC Crash + Unrecovered Adoption" with explanatory caveat (crashes alone aren't thesis failure). Scenario 03: "Atomic-Swap Crackdown" → "Privacy-Tool Enforcement Risk" with multi-vector Tornado-Cash template (operators, frontends, developers, infrastructure, liquidity providers). Bottom legend: F17 unilateral-invalidation rule called out. |
| `assets/hero-cover.svg` | unchanged | No audit fixes required. |
| `assets/milestones-timeline.svg` | unchanged | No audit fixes required. |
| `assets/quantum-timeline.svg` | unchanged | No audit fixes required. |
| `assets/quote-cards/*` | unchanged | No audit fixes required. |
| `index.html` | **v4 cross-links applied** | Doc grid now points to Falsification Framework v4, plus v4-update tags on Quantum and Regulatory cards. |
| `counter-map.md` | unchanged in Block 1–3 | No audit fixes required at this stage. |
| `competing-theses.md` | unchanged in Block 1–3 | The SVG was updated; the markdown companion was not flagged in the audit. |
| `disclosure-methodology.md` | unchanged in Block 1–3 | No audit fixes required at this stage. |
| `thesis-v3.md` | **archive — do not edit** | Preserved per methodology-immutability rule. |
| `falsification-framework-v3.md` | **archive — do not edit** | Preserved per methodology-immutability rule. |

---

## Audit-fix map (which v4 audit finding → which file/edit)

The v4 audit was a structured five-expert red-team: privacy maximalist, Ethereum/DeFi analyst, regulatory lawyer, Bitcoin mining operator, mainstream macro.

| Audit finding | Files where applied |
|---|---|
| "Bitcoin absorbs everything" framing collapsed distinct trust models | `thesis-v4.md` Part II taxonomy table; `field-guide.md` stack-wide table; `falsification-framework-v4.md` F3 trust-tier + F4 four-way taxonomy; `stack-ontology.svg` doctrine band; `competing-theses-infographic.svg` SST "other chains" |
| "Trust flows down to L0" oversold what most layers inherit | `thesis-v4.md` Part III Pattern 3; `stack-ontology.svg` arrow label + asset-row footnote |
| "Dollar utility without dollar dependency" — clever but wrong | `thesis-v4.md` Part III Pattern 2; `executive-tldr.md`; `assets/three-patterns.svg` (Block 1); `competing-theses-infographic.svg` SST |
| Privacy treated as feature, not axis | `thesis-v4.md` Part IV (new section); `field-guide.md` Fedimint + Cashu panels with "shifts trust, does not remove trust" |
| Macro framing missing | `thesis-v4.md` Part V (new); `executive-tldr.md` |
| Mining section overclaimed | `thesis-v4.md` L0 section + Part IX; `falsification-framework-v4.md` F9 (post-halving, INDETERMINATE-by-design) + F16 (trajectory, clean separation) |
| MiCA + Tornado Cash regulatory imprecision | `regulatory-deep-dive.md` MiCA timeline + ART/EMT + 60%-soften + multi-vector Tornado Cash; `falsification-framework-v4.md` F10 expanded jurisdiction set; `correlated-failures-diagram.svg` Scenario 03 rename |
| BIP-360 / BIP-361 conflation | `falsification-framework-v4.md` F17; `quantum-scenario.md` throughout; `dashboard.html` F17 source URL |
| Factual corrections (WoS Nov 2024; US Strategic Reserve ~200K from forfeiture / ~328K federal; Tether RGB announced not live; USDT-Lightning Jan-2025 announce / Mar-2026 production; WoS-Spark custody contested) | `thesis-v4.md`; `executive-tldr.md`; `newcomer-onepager.md/.html`; `field-guide.md` (Lightning, Liquid, Taproot Assets, RGB, Spark panels); `regulatory-deep-dive.md` |
| Prescriptive financial-advice overreach (specific BTC thresholds) | `thesis-v4.md` Part VIII reframed to "consequence of loss"; `newcomer-onepager.md` |
| F13 / Tron expected-to-fire — humility | `falsification-framework-v4.md` F13 humility flag; `executive-tldr.md` "honest fronts won/ceded" framing |
| Named-critic ad hominem framing | `competing-theses-infographic.svg` (named voices → "representative view") |

---

## Methodology rules (preserved across v3 → v4)

1. **Methodology-immutability.** Once a falsifier's threshold, deadline, or measurement source is committed in a quarterly update, it can only be tightened (more specific), never loosened to save the thesis. v4 definitional rewrites are tightenings; thresholds and deadlines are unchanged.
2. **Quarterly cadence.** March, June, September, December reviews. Annual deep review in January. Any single falsifier firing triggers an out-of-cycle post within 14 days.
3. **F17 unilateral-invalidation.** F17 firing alone is sufficient for thesis rejection, regardless of other falsifier status. Enforced by `dashboard.html` verdict logic and documented in `falsification-framework-v4.md`.
4. **Correlated vs independent fires.** Each quarterly review must distinguish in narrative interpretation. Verdict thresholds are the same; the explanation makes failure mode visible.
5. **Version retention.** Archived v3 documents (`thesis-v3.md`, `falsification-framework-v3.md`) are preserved in-place — do not edit. New versions get new filenames.

---

## Block sequence (the rollout for this v4 update)

- **Block 1 — Strategic Spine (May 2026):** wrote `thesis-v4.md` (~7,800 words). Updated `executive-tldr.md/.html`, `newcomer-onepager.md/.html`, `index.html`, `assets/three-patterns.svg`. v3 retained in archive.
- **Block 2 — Companion Doc Rewrites (May 2026):** wrote `falsification-framework-v4.md`. Upgraded `dashboard.html` to v4 (per-card confidence + last-reviewed + source-note; F17 unilateral-invalidation preserved; F17 source URL corrected to BIP-0360 BIPs repo). Overhauled `field-guide.md` (maturity-status + legal-pressure tags + stack-wide table + 14 panel edits). Applied 10 corrections to `regulatory-deep-dive.md`. Reconciled BIP-360 vs BIP-361 in `quantum-scenario.md`. Repointed v4 cross-refs in `thesis-v4.md`, `executive-tldr.md`, `index.html`.
- **Block 3 — Figures + Memory (May 2026):** updated `assets/stack-ontology.svg`, `assets/three-functions.svg`, `assets/competing-theses-infographic.svg`, `assets/correlated-failures-diagram.svg`. Updated `CLAUDE.md` Active Context. Created this memory file.

---

## Next quarterly review

**Date:** September 2026. F16 is load-bearing — if Q2–Q4 2026 public-miner BTC liquidation maintains Q1's pace, F16 fires (4 of 17 — still intact but on edge). F9 remains INDETERMINATE-by-design until April 2029.

---

*Created: May 2026 (Block 3). Maintainer: Dalia. Update at each quarterly review or when a v5 audit lands.*
