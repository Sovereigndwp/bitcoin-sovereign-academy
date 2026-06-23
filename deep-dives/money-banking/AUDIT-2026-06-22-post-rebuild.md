# Money & Banking Deep Dive — Systematic Audit (post-rebuild)

**Date:** 2026-06-22 · **Auditor pass:** first-principles, against the Deep Dive Standard
**Scope:** the 7 live pages of the rebuilt arc (hub + 6 sections). Baseline for comparison: `AUDIT-and-REDESIGN-PLAN.md` (original state).

---

## First-principles verdict in one paragraph

The dive now **explains** and **compares** at a real deep-dive level — the arc is coherent end-to-end, claims are sourced and reconciled to 2026, tone is investigative, and the Bitcoin conclusion is earned rather than asserted. But the **"test the claim yourself"** pillar of the success test is unfulfilled on **three of six sections**. History gives the learner an accordion to *read*, Cantillon gives an animation to *watch*, and the closing Bitcoin section gives them nothing to *do*. The Deep Dive Standard is explicit: a reveal box or animation is not an interactive. The sharp irony: the five interactives that would fix exactly these gaps **already exist in this folder** and are linked from **zero** pages. The single highest-leverage action is wiring, not building.

---

## The component matrix (measured, not recalled)

| Section | Meaningful interactive? | Chart/visual | Comparison | Steelman | Misconception | Reflection |
|---|---|---|---|---|---|---|
| 1 · History | ❌ accordion reveal only | ✅ purchasing-power | ⚠️ property tags | ⚠️ implicit | ✅ | ❌ no reflect-widget |
| 2 · How Money Created | ✅ fountain + rate sliders | ⚠️ diagram, no data chart | ⚠️ 2-layer boxes | n/a | ✅ loans-create-deposits | ✅ |
| 3 · Credit Banking | ✅ chain + bank-run | ⚠️ demo, no data chart | ✅ flexibility/fragility | ✅ | ✅ Fed-not-all-money | ✅ |
| 4 · Central Banking | ✅ control room | ✅ balance sheet + timeline | ❌ removed | ⚠️ weak pointer | ❌ none | ❌ no reflect-widget |
| 5 · Cantillon | ❌ scripted animation | ✅ equity ownership | ⚠️ none table | ✅ | ✅ | ❌ no reflect-widget |
| 6 · Bitcoin rules vs discretion | ❌ none | ✅ issuance curve | ✅ removes/costs | ✅ against BTC | ✅✅ | ✅ |

**Parked, built, linked from 0 pages:** `cantillon-position-simulator`, `bitcoin-issuance-explorer`, `fed-trilemma-challenge`, `money-properties-scorecard`, `asset-vs-wage-chart`.

---

## 1. Current teaching purpose

A seven-part investigation of monetary power: *who creates money, who receives it first, and what happens when that power is discretionary instead of rule-bound.* The arc moves History (pattern) → How Money Created (mechanism) → Credit Banking (tradeoff) → Central Banking (control room) → Cantillon (distribution) → Bitcoin (rules vs discretion → earned choice). This is a genuine deep-dive purpose, distributed correctly across pages.

## 2. Missing depth

- **Interactivity fails the standard on §1, §5, §6.** History = reveal; Cantillon = animation; Bitcoin = none. These are the three weakest sections by the "make the learner reason" test.
- **Socratic reflection absent on §1, §4, §5** (the three original pages never had a reflect-widget; the three new pages do). A required component is simply missing on half the dive.
- **§4 Central Banking has no misconception repair** and only an implicit steelman — the page most in need of "the case for the system" doesn't make it (the lender-of-last-resort steelman lives one page earlier, in §3).
- **§1 History's steelman is unlabeled** — the "why each step made sense / convenience creates a control point" reframe is excellent but isn't framed as the explicit other-side it is.

## 3. Unsupported or weak claims

Largely resolved. `CLAIM-LEDGER.md` was reconciled to dated 2026 primary sources (BLS CPI, FRED M2SL/WALCL, IIF, Fed DFA) and the live pages updated to match. Residual, low-severity:
- §4 keeps "$100 in 1913 ≈ $3,200" — defensible (BLS CPI) but a recomputed point estimate; date it or drop to the % only.
- `asset-vs-wage-chart` (parked) still ends at 2024 — must move to 2025 (or be labelled "through 2024") **before** it is wired in.
- §1 gold-standard wording softened ✅; §6 mined-supply "~95% but issuance continues to ~2140" ✅.

## 4. Needed current-system comparisons

Present where it matters (§3 flexibility/fragility, §6 discretion/rules). Thin spots: §1 has era property-tags but no single side-by-side "what each money form traded away" table; §4 lost its tools comparison when the duplicate Bitcoin cards were (correctly) removed — a **Fed-tools comparison** (rates vs QE vs reserve policy: what each moves, who it helps/hurts) would restore a real comparison without re-arguing Bitcoin.

## 5. Needed charts or visuals

Four solid, sourced charts exist (purchasing power, Fed balance sheet, equity ownership, issuance). Gap: **§2 How Money Created has no data chart** — the obvious add is a base-vs-broad-money composition visual (~10% base / ~90% credit, BoE/Fed), which would also reinforce its core claim. Note: no semantic `<table>` exists anywhere — comparisons are div-grids; acceptable, but a real `<table>` would improve accessibility.

## 6. Needed interactives (highest leverage)

Wire the parked builds into their matching sections — each one converts a reveal/animation/blank into a tradeoff the learner operates:

| Parked file | Wire into | Replaces | Tradeoff it teaches |
|---|---|---|---|
| `money-properties-scorecard` | §1 History | passive era accordion | judging money on 6 properties before the reveal |
| `cantillon-position-simulator` | §5 Cantillon | the scripted waterfall | your real purchasing power by position in line |
| `bitcoin-issuance-explorer` | §6 Bitcoin | nothing (static only) | fixed-rule supply vs discretion, front-loading, fee transition |
| `fed-trilemma-challenge` | §4 Central Banking | extends the control room | you can't hit all three goals at once |
| `asset-vs-wage-chart` | §5 Cantillon | the retired ticker (TODO slot is already marked) | assets vs wages in real terms (fix endpoint first) |

## 7. Needed objections

§3, §5, §6 have explicit steelman boxes ✅. Add: **§4 Central Banking** — a labelled steelman ("a discretionary lender of last resort stopped 2008/2020 becoming depressions; rules-based money has no such circuit-breaker") and **§1 History** — relabel the convenience-creates-control reframe as the steelman it already is.

## 8. Misconceptions repaired

Live: loans-create-deposits (§2), Fed-doesn't-create-all-money (§3), inflation-isn't-uniform (§5), fixed-supply≠stable-price + gold-standard≠no-inflation (§6). **Gap: §4 Central Banking repairs none** — natural candidates: "the Fed is a private company," or "the Fed directly sets the mortgage/credit-card rates you pay."

## 9. Graph edges to add

**Unwired across all 7 pages.** The TSA ontology repo isn't connected, so no `content.json` edges exist. Each page needs: `content_type: deep_dive`, `strategic_role`, `teaches`, `repairs`, `supports_decision`, `bridges_to`, `blocked_by_boundary`. Proposed `supports_decision` for the dive: *"Do I trust discretionary monetary policy or rule-based money?"* `bridges_to`: beginner money lessons, FSA money tools, BSA issuance/mining/custody education. This stays blocked until `the-sovereign-academy/` is mounted.

## 10. Boundary risks

**Clean.** Verified: no `membership-gate`, `email-capture`, `tip-cta`, or TBA routing on any of the 7 live pages (removed from the hub; never present on the section pages). No FSA→TBA path. No high-intent custody/inheritance funnel. This fully satisfies the boundary standard — keep it this way; the parked simulators must inherit the same when wired (they already carry no monetization).

## 11. Upgrade priority & classification

| Section | Classification | Top fix |
|---|---|---|
| Hub | index/hub — **strong as-is** | — |
| §3 Credit Banking | **strong as-is** (best page) | optional data chart |
| §2 How Money Created | **needs light upgrade** | add base-vs-credit data chart |
| §1 History | **needs light upgrade** | wire scorecard + add reflect-widget + label steelman |
| §4 Central Banking | **needs light upgrade** | add reflect + misconception + steelman; wire fed-trilemma |
| §5 Cantillon | **needs light upgrade** | wire position simulator + asset-vs-wage chart + reflect |
| §6 Bitcoin | **needs light upgrade** | wire issuance explorer |
| **Whole dive** | **needs light upgrade** (was *major* at baseline — large progress) | wire the 5 parked interactives |

## 12. Recommended implementation order

1. ~~Fix structural errors, outdated facts, unsupported claims~~ — **done** (rebuild + 2026 ledger).
2. ~~Current-system comparisons / tradeoffs / steelman~~ — **mostly done**; finish §4 (steelman + misconception) and label §1's steelman.
3. **Wire the 5 parked interactives** into §1/§4/§5/§6 — *the single highest-leverage step; it's what turns "explained" into "deep dive."* (Move the asset-vs-wage endpoint to 2025 first.)
4. **Add reflect-widgets** to §1, §4, §5.
5. Add the one missing data chart (§2 base-vs-credit); optionally a Fed-tools comparison table (§4).
6. **Wire graph edges** — blocked until the TSA ontology repo is connected.
7. Boundary validation — already clean; re-confirm after wiring.

---

### Success-test check (where the learner lands today)

- *"I understand the problem better"* — ✅ yes, strongly.
- *"I can compare systems"* — ✅ on §3/§6, partial on §1/§4.
- *"I can see the tradeoffs"* — ✅ stated; ⚠️ but on §1/§5/§6 the learner can't yet *operate* them.
- *"I can test the claim myself"* — ❌ **fails on §1, §5, §6** — the exact sections whose interactives are built and parked.
- *"I understand why Bitcoin's design matters, even with open questions"* — ✅ the earned closing delivers this.

**Bottom line:** four of five success criteria are met; the fifth is one wiring pass away.
