# Youth Pedagogy Differentiation — Spec (for sign-off)

**Date:** 2026-06-08 · **Status:** awaiting Dalia's sign-off · **Then:** prototype one flagship week, validate, replicate.
**Builds on:** `reports/pedagogy-youth-audit-2026-06-06.md` (Phase 4 audit) + a 3-lens research pass (Brilliant/learning-science mechanics · existing-demo reuse · per-week doing-gap specs).
**Scope:** the 10 youth-families week lessons + educator. Static site, vanilla JS, `localStorage`, no backend.

> Sign off on the **signature loop** + the **flagship-first** plan, then I build ONE week end-to-end as the reference implementation. Nothing else is touched until you approve the prototype.

---

## 1. The problem (from the audit, one line)

> BSA's youth funnel **teaches well but rarely makes the learner *do*.** Its three *moat* criteria are its *weakest*: **real-artifact output 1.50, family-conversation 1.90, learner-derived discovery 2.11.** Scaffolding & reading-level are strong. 12–14 is under-served.

## 2. The differentiation thesis — the competitive edge

Most effective edtech (Brilliant, Duolingo) is brilliant at **delivery**: elegant explanations, interactive reveals, mastery ramps. None of them do three things — and those three are exactly BSA's brand:

1. **Verify, don't trust** (epistemology) — the learner checks the claim against **live reality**, instead of being told.
2. **Keep what you make** (effectiveness / constructionism) — every lesson outputs a **real artifact the learner owns**.
3. **Activate the family** (the locked identity) — a deliberate **parent↔teen hand-off** is part of the lesson, not a footnote.

### The signature learning loop — **Predict → Verify → Keep → Share**

Every lesson runs the same four-beat loop (the thing "not seen before"):

| Beat | What the learner does | Lifts (weak criterion) | Axis |
|---|---|---|---|
| **PREDICT** | Commits a guess *before* any reveal (prediction-before-reveal / productive failure). | Discovery 2.11, Capability 2.26 | First-principles, Epistemology |
| **VERIFY** | Tests the answer against **live data or their own numbers** — "don't take our word, check." | Discovery, Simulation depth 1.96 | Epistemology, Interactivity |
| **KEEP** | Generates a **named, saved/printable artifact** they own (`localStorage` + Print). | **Real-artifact 1.50** | Effectiveness |
| **SHARE** | A **pass-the-phone** beat sends a real question/result to a parent. | **Family-conversation 1.90** | Effectiveness, Relational |

Brilliant gives us PREDICT (mechanics B1–B6 below). **VERIFY, KEEP, SHARE are the differentiators** — none of the competitors combine them. This loop is the product.

## 3. Mechanics toolkit (borrowed + signature)

**Borrowed from Brilliant/learning-science (for PREDICT/VERIFY) — all CHEAP, vanilla JS:**
- B1 Prediction-before-reveal · B2 Interactive manipulatives (play till it clicks) · B3 one-concept ramp (preserves our scaffolding strength, serves 12–14) · B4 answer-specific feedback (not red X) · B5 intuition-then-formalize · B6 faded hints.
- O3 branching consequence scenario · O4 explorable explanation · O6 productive failure (let them *invent* money before we teach Bitcoin).

**Signature (the moat) — what competitors don't do:**
- **S1 "Keep-What-You-Make" artifact engine** — inputs → JS composes an HTML/SVG one-pager → Download/Print. Fixes Real-artifact 1.50. CHEAP.
- **S2 "Don't Trust, Verify" challenge cards** — hand the learner the live source (`bitcoin-data-reliable.js` / mempool.space already in repo) and make them audit our claim. Turns the brand thesis into the interaction. CHEAP–MOD.
- **S3 "Pass-the-Phone" family protocol** — a hand-off beat that won't advance until both parent & teen act; outputs a shared keepsake. Fixes Family-conversation 1.90. CHEAP (turn-state in JS).

## 4. The one reusable pattern (cheap, high-leverage)

The calculators/games already exist on most weeks. The high-gain move is to **wrap each** with: **(a) predict-first prompt → (b) save/print personal artifact (`yf-w<N>-*`) → (c) family hand-off**, then **Week 10 auto-assembles all 9 artifacts into one "My Sovereign Money Plan" dashboard.** That single pattern raises real-artifact + discovery + family-catalyst *simultaneously*, with no new framework.

## 5. Reuse plan (don't reinvent)

BSA already has 50+ demos; many are iframe-embeddable (SAMEORIGIN) into youth weeks:
- **W3** ← `savings-disappear-scenario` (replaces the "coming soon" stub) + `inflation-impact-calculator`
- **W4** ← `emergency-fifty-scenario` (near purpose-built) + `account-freeze-locked-out`
- **W2/W6/W10** ← `time-preference-explorer` (spend-now-vs-later consequence engine)
- **W7** ← `bitcoin-vs-banking` + `account-freeze-locked-out` + `double-spending-demo`
- **W1** ← `money-properties-comparison` / `energy-bucket`
- Extract a shared **`youth-scenario.js`** from `emergency-fifty-scenario`'s proven `renderScene/choice/outcome` engine for the calculator-heavy weeks (W3/4/7/9/10).
- `reflect-widget` already ships on all 10 — deepen `data-topic` seeds, don't double-add.
- **Gotchas:** absolute CSS paths; iframe (not inline-lift) the heavy demos to avoid global `.btn`/`.card` CSS leakage; verify embedded demos aren't lock-gated for the free audience.

## 6. Prioritized rollout

**Phase A — flagship prototype (prove the loop on ONE week):** build the full Predict→Verify→Keep→Share loop on **Week 3 (Saving Strategies)** — it's currently a "coming soon" stub (lowest score, all gain), the Savings-Goal artifact is reused by W10, and it exercises every beat. Validate in-browser + with you, lock the pattern.

**Phase B — Top-4 (highest gap-to-effort):** W3 (done in A), **W10** (the dashboard that retroactively makes all weeks "add up"), **W6** (persist the broken 24-hr wishlist + predict-before-reveal), **W5** (guess-your-take-home + saved paycheck plan).

**Phase C — remaining weeks** (W1/2/4/7/8/9): apply the same wrap + embed the mapped demos. W8 college flow is the only substantial net-new.

**Cross-cutting:** ship `youth-scenario.js` + an artifact/print helper once in Phase B so Phase C is fast.

## 6b. Explicitly REJECTED mechanics (on-brand guardrail)

The research surfaced compulsion-loop mechanics that we deliberately **do not** use:
- **Streaks / loss-aversion / badges / completion %** (Duolingo-style). These violate the locked **unbounded mode** ("no quizzes, no badges, no completion percentages") and risk the **overjustification effect** — extrinsic rewards eroding the intrinsic, sovereignty-aligned motivation this brand is built on. Engagement comes from *deriving*, *verifying*, and *keeping real things*, not from a streak counter. (The engine ships none of these.)

## 6c. Measurement — make "effectiveness" a live number, not an audit score

The engine emits **first-party** events (`js/analytics.js` `track()`) on every beat: `yf_predict_locked`, `yf_predict_revealed` (+ `close`), `yf_verified`, `yf_artifact_saved`, `yf_shared`, `yf_scenario_outcome`, `yf_plan_viewed`, `yf_artifact_email` / `yf_plan_export`. This converts the audit's static moat scores into a live funnel:
- **Real-artifact** = `yf_artifact_saved` rate · **Family-conversation** = `yf_shared` rate · **Discovery** = `yf_predict_locked → revealed` completion.
- The aggregate **predict-vs-actual** data (`close`) is also a distribution asset: e.g. *"83% of teens overestimate their take-home pay"* — credible, shareable, a byproduct of the verify beat.

## 6d. Distribution is built in, not bolted on

The two moat mechanics double as a **growth loop** (the real bottleneck is reach, ~190 sessions/mo): artifacts carry provenance + an **email/share** export, the **pass-the-phone** beat propagates teen→parent, and a **backup-code** export makes artifacts survive a device switch (so the Week-10 dashboard isn't silently empty when a teen moves school↔home). Each act of learning is also an act of sharing.

## 7. Effort ledger
- CHEAP (ship first): predict-first prompts, S1 artifact/print, S2 verify-cards (reuse live data), S3 pass-the-phone, persisting existing tools, embedding existing demos.
- MODERATE: `youth-scenario.js` branching engine; W8 net-new college flow; the W10 aggregator.
- EXPENSIVE (defer): cross-device sync, networked 2-device family play, AI-graded open responses (reflect-widget/`api/tutor.ts` could host later).

## 8. Sign-off checklist
- [ ] Differentiation thesis + **Predict→Verify→Keep→Share** loop is the right north star?
- [ ] Flagship-first (build Week 3 end-to-end, validate, then replicate) — agreed?
- [ ] `localStorage` artifact convention (`yf-w<N>-*`) + Week-10 aggregator dashboard — agreed?
- [ ] Reuse-by-iframe of existing demos (vs net-new) — agreed?
- [ ] Any week you want as the flagship instead of Week 3?
