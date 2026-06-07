# Phase 4 — Pedagogy, Youth-Readiness & Effectiveness Audit — Scorecard

**Date:** 2026-06-06 (run 2026-06-07)
**Spec:** `docs/superpowers/specs/2026-06-06-phase-4-pedagogy-youth-readiness-audit-design.md`
**Plan:** `docs/superpowers/plans/2026-06-06-phase-4-pedagogy-youth-readiness-audit-plan.md`
**Method:** Background multi-agent workflow (run `wf_75d4e9dc-5a2`). One scorer agent per page read the full file (including auto-injected widgets/scripts) and scored all 15 criteria 1–5 against fixed anchors, expanding criterion 14 into three age-band sub-scores and answering the capability-gain sentence. A calibration pass re-scored every 7th page (4 pages, ~15%) with fresh agents. 31 agents total, ~1.0M tokens.
**Output:** Recommendations only — **no content was edited** (the defining difference from Phase 3's accuracy audit).

---

## 0. The one-line finding

> **BSA's youth funnel teaches well but rarely makes the learner *do*.** The three criteria that are supposed to be BSA's moat — **real-artifact output (1.50), family-conversation catalyst (1.90), and learner-derived discovery (2.11)** — are the *weakest* on the platform, while reading-level fit for older teens (4.00) and scaffolding (3.58) are the strongest. The funnel is a competent set of explainers; it is not yet the "after this you can *do* X" experience the identity promises. That gap is the redesign target — and most of it is cheap to close.

---

## 1. Calibration & confidence

Calibration re-scored 4 pages (`youth-families/index`, `youth-families/week-06`, `paths/curious/stage-1/es/module-1`, `paths/curious/index`) with independent agents.

- **Mean absolute inter-rater delta: 0.52** across 62 paired comparisons — tight agreement.
- **No criterion is flagged low-confidence.** The flag threshold was "|Δ| ≥ 2 on ≥ 2 sampled pages"; *no* criterion hit it. Only **four isolated single-page disagreements** appeared, all on subjective/contextual criteria:

| Criterion | Page | Scorer vs calib | Δ |
|---|---|---|---|
| 10 Real-artifact output | yf/week-06 | 2 vs 4 | 2 |
| 11 Sovereignty alignment | yf/week-06 | 4 vs 2 | 2 |
| 14 Age-fit (adult) | yf/week-06 | 2 vs 4 | 2 |
| 14 Age-fit (15–17) | p/curious | 5 vs 3 | 2 |

**Interpretation:** the numbers are trustworthy at the aggregate and ranking level. The only soft spot is **week-06 specifically**, where two raters disagreed on three axes (it sits near a scoring boundary). Treat week-06's individual scores as ±1; the platform-wide averages and the redesign ranking are unaffected. No anchor tightening required before acting.

---

## 2. Headline — platform-wide averages by criterion

Sorted weakest → strongest (n = pages scored, N/A = conditional skips).

| Criterion | Platform avg (1–5) | n | N/A |
|------|------|---|----|
| 10. Real-artifact output | **1.50** | 26 | 1 |
| 12. Family conversation catalyst* | **1.90** | 20 | 7 |
| 8. Narrative | **1.93** | 27 | 0 |
| 7. Simulation depth | **1.96** | 23 | 4 |
| 1. Discovery | **2.11** | 27 | 0 |
| 5. Capability gain | **2.26** | 27 | 0 |
| 15. Educator usability* | **2.45** | 20 | 7 |
| 4. Retention | **2.54** | 26 | 1 |
| 13. Socratic reflection | **2.59** | 27 | 0 |
| 2. Curiosity | **2.78** | 27 | 0 |
| 14. Age-fit (12–14) | **2.80** | 25 | 2 |
| 6. Interactivity | **3.04** | 27 | 0 |
| 9. Intrinsic motivation | **3.15** | 27 | 0 |
| 11. Sovereignty alignment | **3.22** | 27 | 0 |
| 14. Age-fit (adult) | **3.48** | 27 | 0 |
| 3. Progression / scaffolding | **3.58** | 26 | 1 |
| 14. Age-fit (15–17) | **4.00** | 26 | 1 |

**What the shape says:**

1. **The moat is the soft spot.** Real-artifact output (1.50), family-conversation catalyst (1.90), and discovery (2.11) are the three criteria the spec calls BSA-specific — and they're at the bottom. The platform *describes* sovereignty (alignment 3.22, the messaging is present) far better than it makes learners *practice* it (artifact 1.50). Closing that "tell → do" gap is the single highest-value move.
2. **Family brand vs. family pedagogy.** The locked identity is *"custody and inheritance for families,"* yet the youth-families track barely prompts a parent–child conversation (1.90). Only `week-02`, `week-10`, and `sovereign/module-1` score ≥4 here. This is brand-aligned, high-leverage, and nearly free to fix (one discussion prompt per lesson).
3. **Reflection is under-deployed.** Socratic reflection averages 2.59, and most youth-families weeks score **1** — strong evidence the reflect-widget is **not present (or is recall-only) on the youth-families pages**, even though it ships on the path modules. A scripted absence the content-grep would miss; the agents read the full files, so a 1 means genuinely missing.
4. **Age skew toward older teens.** Content lands for 15–17 (4.00) and adults (3.48) but under-serves 12–14 (2.80). The youth track is nominally "ages 13–25" but reads for the top of that range.
5. **Scaffolding and reading-level are real strengths** — keep them; they're the foundation the doing-layer can be built on.

\* Conditional criteria — averaged only over pages where applicable.

---

## 3. Age-band readiness matrix

Per page: could a bright **12-year-old** work it solo? A **15-year-old** solo? Is a **17-year-old** left prepared for university econ/CS? (✅ ≥4 · 🟡 =3 · ❌ ≤2; "—" = not learner-facing. The 17-yo column combines adult age-fit with capability-gain depth.)

| Page | 12-yo solo? | 15-yo solo? | 17-yo → univ econ/CS? |
|------|------|------|------|
| yf | ❌ No | ✅ Yes | 🟡 Partial |
| yf/educator | — | — | 🟡 Partial |
| yf/week-01 | ✅ Yes | ❌ No | ❌ No |
| yf/week-02 | ✅ Yes | 🟡 Partial | ❌ No |
| yf/week-03 | ✅ Yes | 🟡 Partial | ❌ No |
| yf/week-04 | 🟡 Partial | ✅ Yes | 🟡 Partial |
| yf/week-05 | ❌ No | ✅ Yes | ❌ No |
| yf/week-06 | ✅ Yes | ✅ Yes | ❌ No |
| yf/week-07 | 🟡 Partial | ✅ Yes | ❌ No |
| yf/week-08 | ❌ No | ✅ Yes | 🟡 Partial |
| yf/week-09 | 🟡 Partial | ✅ Yes | ❌ No |
| yf/week-10 | ❌ No | ✅ Yes | 🟡 Partial |
| p/builder/s1·m1 | ❌ No | ✅ Yes | ✅ Yes |
| p/curious/s1·m1 | ✅ Yes | ✅ Yes | ❌ No |
| p/curious/s1·m1·es | — | ✅ Yes | 🟡 Partial |
| p/hurried/s1·m1 | ❌ No | ✅ Yes | ✅ Yes |
| p/pragmatist/s1·m1 | 🟡 Partial | ✅ Yes | 🟡 Partial |
| p/principled/s1·m1 | ❌ No | ✅ Yes | 🟡 Partial |
| p/sovereign/s1·m1 | ❌ No | 🟡 Partial | ✅ Yes |
| paths | 🟡 Partial | ✅ Yes | 🟡 Partial |
| p/builder | ❌ No | 🟡 Partial | 🟡 Partial |
| p/curious | ✅ Yes | ✅ Yes | 🟡 Partial |
| p/hurried | ❌ No | ✅ Yes | 🟡 Partial |
| p/pragmatist | ✅ Yes | ✅ Yes | 🟡 Partial |
| p/principled | ❌ No | ✅ Yes | 🟡 Partial |
| p/skeptic | 🟡 Partial | ✅ Yes | 🟡 Partial |
| p/sovereign | ❌ No | 🟡 Partial | 🟡 Partial |

**Reading the matrix:**
- **15-year-olds are well served almost everywhere** (the 4.00 average shows up as a near-solid ✅ column).
- **12-year-olds can solo only ~6 pages** — and tellingly, the pages that work for them (`week-01/02/03`, `pragmatist`, `curious`) are the *gentler* ones, while the deeper modules lock them out. If 12–14 is a real target band, the youngest learners currently fall off after the early weeks.
- **University-prep (17-yo) is strongest where there's real *doing*:** `builder/s1·m1` (UTXO construction), `hurried/s1·m1` (actually buys Bitcoin), `sovereign/s1·m1` (wallet + inheritance plan) are the only clean ✅s. Everywhere else the 17-yo leaves able to *explain* but not *do* — which is exactly the capability-gain gap from §2.

---

## 4. Per-page scorecard (all 15 criteria)

Scores 1–5; N/A = conditional skip. Columns 14a/14b/14c = age-fit for 12–14 / 15–17 / adult.

| Page | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14a | 14b | 14c | 15 |
|------|---|---|---|---|---|---|---|---|---|----|----|----|----|-----|-----|-----|----|
| yf | 1 | 1 | 3 | 1 | 1 | 2 | 1 | 1 | 2 | 1 | 2 | 1 | 1 | 2 | 4 | 4 | 2 |
| yf/educator | 2 | 1 | 4 | 1 | 2 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 1 | N/A | N/A | 4 | 2 |
| yf/week-01 | 2 | 2 | 2 | 2 | 2 | 4 | 3 | 1 | 2 | 1 | 1 | 1 | 2 | 4 | 2 | 1 | 2 |
| yf/week-02 | 2 | 1 | 4 | 2 | 2 | 1 | 1 | 1 | 2 | 1 | 2 | 4 | 1 | 5 | 3 | 1 | 3 |
| yf/week-03 | 2 | 2 | 3 | 2 | 2 | 1 | 1 | 1 | 3 | 1 | 2 | 2 | 1 | 4 | 3 | 2 | 3 |
| yf/week-04 | 2 | 2 | 3 | 2 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 1 | 3 | 4 | 3 | 2 |
| yf/week-05 | 2 | 4 | 5 | 3 | 3 | 4 | 3 | 2 | 5 | 1 | 2 | 1 | 1 | 2 | 5 | 2 | 2 |
| yf/week-06 | 2 | 4 | 4 | 4 | 4 | 5 | 4 | 2 | 5 | 2 | 4 | 2 | 1 | 5 | 5 | 2 | 2 |
| yf/week-07 | 2 | 3 | 4 | 2 | 3 | 4 | 1 | 2 | 4 | 1 | 2 | 1 | 1 | 3 | 4 | 2 | 1 |
| yf/week-08 | 3 | 4 | 4 | 4 | 4 | 4 | 3 | 2 | 4 | 2 | 3 | 2 | 1 | 1 | 4 | 3 | 2 |
| yf/week-09 | 2 | 3 | 3 | 4 | 5 | 5 | 4 | 1 | 4 | 2 | 4 | 1 | 1 | 3 | 5 | 2 | 2 |
| yf/week-10 | 1 | 3 | 3 | 1 | 2 | 4 | 1 | 1 | 4 | 2 | 2 | 5 | 2 | 2 | 5 | 3 | 4 |
| p/builder/s1·m1 | 3 | 3 | 3 | 4 | 4 | 5 | 3 | 2 | 3 | 2 | 4 | N/A | 4 | 1 | 5 | 5 | N/A |
| p/curious/s1·m1 | 4 | 4 | 4 | 4 | 3 | 5 | 3 | 4 | 3 | 1 | 4 | 1 | 4 | 4 | 4 | 2 | 3 |
| p/curious/s1·m1·es | 4 | 5 | 4 | 4 | 3 | 4 | 3 | 4 | 4 | 2 | 4 | 2 | 4 | N/A | 4 | 3 | 4 |
| p/hurried/s1·m1 | 2 | 2 | 2 | 3 | 3 | 4 | 1 | 1 | 3 | 4 | 2 | 1 | 4 | 2 | 4 | 5 | 3 |
| p/pragmatist/s1·m1 | 2 | 4 | 4 | 3 | 2 | 3 | 1 | 2 | 3 | 1 | 4 | N/A | 3 | 3 | 4 | 4 | N/A |
| p/principled/s1·m1 | 3 | 4 | 4 | 4 | 2 | 5 | 4 | 3 | 4 | 2 | 5 | 1 | 5 | 2 | 4 | 5 | 3 |
| p/sovereign/s1·m1 | 3 | 4 | 4 | 4 | 4 | 3 | 2 | 3 | 4 | 4 | 5 | 4 | 4 | 2 | 3 | 5 | 3 |
| paths | 1 | 2 | N/A | N/A | 1 | 2 | N/A | 3 | 4 | 1 | 3 | N/A | 1 | 3 | 4 | 4 | N/A |
| p/builder | 2 | 2 | 3 | 1 | 1 | 3 | 1 | 2 | 1 | 1† | 2 | N/A | 5 | 2 | 3 | 4 | N/A |
| p/curious | 2 | 3 | 4 | 2 | 1 | 2 | 1 | 2 | 3 | 1 | 4 | N/A | 3 | 4 | 5 | 5 | N/A |
| p/hurried | 2 | 2 | 4 | 4 | 2 | 2 | 1 | 1 | 4 | 1 | 5 | N/A | 4 | 2 | 4 | 5 | N/A |
| p/pragmatist | 1 | 1 | 4 | 1 | 1 | 2 | N/A | 1 | 2 | 1 | 4 | 2 | 4 | 5 | 5 | 4 | N/A |
| p/principled | 2 | 3 | 4 | 1 | 1 | 1 | N/A | 4 | 3 | 1 | 5 | 3 | 2 | 2 | 4 | 5 | 2 |
| p/skeptic | 2 | 4 | 4 | 2 | 1 | 2 | 1 | 3 | 3 | 1 | 5 | 1 | 5 | 3 | 4 | 4 | 2 |
| p/sovereign | 1 | 2 | 3 | 1 | 1 | 2 | N/A | 1 | 2 | N/A | 5 | N/A | 4 | 1 | 3 | 5 | 2 |

† `p/builder` index returned `0` for criterion 10 (out of the 1–5 range); recorded as a floor `1`.

---

## 5. Exemplars — the quality bar to clone

These pages already do what the rest should aspire to. Use them as internal reference designs.

| Page | Mean | Why it's the bar |
|---|---|---|
| **paths/curious/stage-1/module-1 (ES)** | 3.63 | Best discovery+narrative+curiosity combo (4/5/4); learner *derives* the properties of money. The Spanish module out-scores its English twin — port the improvements back to EN. |
| **paths/sovereign/stage-1/module-1** | 3.59 | The strongest *doing* page: real-artifact 4 (wallet setup + inheritance plan), sovereignty 5, family-catalyst 4, capability-gain 4. This is BSA's identity executed correctly. |
| **paths/principled/stage-1/module-1** | 3.53 | Reflection 5, interactivity 5, simulation 4, sovereignty 5 — the model for Socratic + consequence-bearing depth. |
| **paths/builder/stage-1/module-1** | 3.40 | UTXO *construction* (interactivity 5, capability 4) — learners build, not read. University-CS-ready. |
| **youth-families/week-06** (lifestyle inflation) | 3.35 | Best youth-families *lesson*: interactivity 5, curiosity 4, retention 4, simulation 4, age-fit 5/5 for both teen bands. The template every other week should match. |
| **youth-families/week-09** (independent-living budget) | 3.00 | Capability-gain 5 — the learner builds a real, testable budget. Proof the youth track *can* hit the doing-bar. |

---

## 6. Prioritized "redesign for adoption" shortlist

Ranked by **leverage = (5 − core-learning mean) × funnel weight** — i.e. how weak × how much traffic it gates. For each: the criterion(s) it fails and the benchmark approach to borrow *without* importing reward-loop mechanics.

### Tier 1 — front doors that don't teach (highest leverage)

1. **`youth-families/index.html`** — leverage 17.9 (core 1.43, weight 5)
   *Fails:* discovery 1, retention 1, capability-gain 1, real-artifact 1. It's a directory; the learner leaves knowing only that weeks exist.
   *Borrow:* **Code.org's beginner onboarding** + **Brilliant's curiosity hook** — open with one 60-second interactive question ("here's $20/week for 4 weeks — what happens to your savings if you skip one habit?") so the hub *itself* delivers a micro-win before routing. The front door should teach one thing.

2. **`youth-families/educator/index.html`** — leverage 16.4 (core 1.71, weight 5)
   *Fails:* educator-usability 2, and most resources are literally "Coming Soon" — a facilitator can't run a class from it.
   *Borrow:* **Mi Primer Bitcoin's facilitator simplicity** (you authored it) — ship one fully ready, scripted lesson with a facilitator guide a non-expert can run cold. One real lesson beats ten placeholders.

3. **`paths/index.html`** — leverage 15.0 (core 2.00, weight 5)
   *Fails:* discovery 1, capability-gain 1 (it's the whole-site router).
   *Borrow:* lower-urgency — routers *can* be lean — but a single Brilliant-style "which of these is money?" micro-interaction would convert the router into a first lesson.

### Tier 2 — lessons that explain but don't make you do

4. **`youth-families/week-01.html`** — leverage 12.3 (core 1.93, weight 4)
   *Fails:* narrative 1, real-artifact 1, sovereignty 1 — has a budget *game* (interactivity 4) but the result evaporates.
   *Borrow:* **Minecraft Education's consequence loop** — persist the budget choices into a saved artifact the learner carries into week-02; let bad choices visibly compound. Turn the game into a kept output.

5. **`youth-families/week-04.html`** (emergency funds) — leverage 10.5 (core 1.50, weight 3)
   *Fails:* capability-gain 1 — learner can *restate* the four stages but can't compute their own target.
   *Borrow:* **Khan Academy scaffolding** — replace the static stages with a calculator that outputs *the learner's own* emergency-fund number = an artifact they keep. This is the lowest-core-score lesson on the platform; biggest per-page jump available.

6. **`paths/curious/index.html`** — leverage 10.7 (core 2.33, weight 4)
   *Fails:* discovery 1, capability-gain 1 — front of the highest-traffic path, directory-only. Same fix as `paths/index` but higher payoff given traffic.

7. **`paths/hurried/stage-1/module-1`** — leverage 10.0 (core 2.50, weight 4)
   *Note:* already one of the better *doing* pages (it actually walks a real exchange purchase, real-artifact 4). High weight inflates its rank; smaller lift needed — mainly add a sovereignty nudge (self-custody next-step) since it scores 2 there.

---

## 7. Cross-cutting cheap wins (apply platform-wide)

These aren't single-page redesigns — they're patterns the data exposes that are fixable in bulk:

- **A. Add the reflect-widget to the youth-families track.** Socratic reflection scores 1 on almost every `week-*` page → the widget is missing there (it ships on path modules). Adding `<div class="reflect-widget" ...>` per the established pattern lifts criterion 13 across ~11 pages at near-zero cost.
- **B. One family-conversation prompt per youth lesson.** Family-catalyst averages 1.90 on a *family* brand. A single "talk to a parent/guardian about ___" prompt per week aligns content with the locked identity and is pure copy.
- **C. Convert restate-pages into compute-pages.** The capability-gain 2.26 average is driven by lessons that end in a definition. Wherever a week presents numbers (emergency fund, paycheck, college cost, rent), end with a calculator that emits *the learner's own* figure — every such change raises capability-gain AND real-artifact together. (`week-05`, `week-08`, `week-09` already do this; `week-04`, `week-02`, `week-03` don't.)
- **D. Serve the 12–14 band deliberately.** Age-fit 12–14 (2.80) trails 15–17 (4.00). Pick the 3–4 highest-traffic youth pages and add a "younger learner" reading-level pass or toggle. (Open question from the spec: whether any 12–14 finding justifies revisiting unbounded-mode for the youngest band — that's a locked-spec call for you, not this audit.)
- **E. Port ES → EN on curious/module-1.** The Spanish module (3.63) out-scores the English (3.35) on curiosity and family-catalyst. Backport.

**Engagement-mechanics check (per spec):** no page was found relying on streaks/XP/% progress bars; the real-accomplishment markers that exist (artifact-completion language) are spec-compliant. Recommendations C and the redesigns deliberately add *artifact* outputs, not reward loops.

---

## 8. Method limits & honesty notes (no silent caps)

- **Subjective rubric.** These are judgment scores against fixed anchors, not measured learning outcomes. Treat them as a prioritization lens, not ground truth. Calibration (§1) shows the lens is internally consistent (mean Δ 0.52).
- **Single sticky point:** `youth-families/week-06` individual scores are ±1 (two raters disagreed on 3 axes). Its rank is unaffected; its exemplar status is robust on the criteria where both raters agreed (interactivity, curiosity, retention).
- **Scope is the free funnel only** (27 pages). Premium stage-2+ content, demos, and deep-dives were deliberately excluded → **Phase 4b** if/when you want them scored on the same rubric.
- **One out-of-range datum:** `p/builder` index criterion-10 came back `0`; floored to 1. Negligible impact.
- **No content was changed.** Every item above is editorial judgment for Dalia's decision.

---

## Appendix — capability-gain sentence per page

The honest answer to *"after this, the learner can now ___"* for every page (the truest single test of unbounded mode):

- **youth-families/index** — browse and navigate to weeks; gains no new knowledge, capability, or sticky model.
- **youth-families/educator** — identify which educator resources exist, schedule training, request support; cannot yet implement curriculum (most materials "Coming Soon").
- **youth-families/week-01** — make trade-offs in a constrained budget *game*; cannot yet build a real household budget.
- **youth-families/week-02** — define income/expense categories with examples; cannot yet build a complete working budget.
- **youth-families/week-03** — restate three saving tips and bucket goals; cannot yet plan/execute a personal savings goal.
- **youth-families/week-04** — restate emergency-fund stages and example costs; cannot calculate a personal target or build a plan.
- **youth-families/week-05** — input wage/hours into a paycheck calculator to predict net pay; cannot yet make job decisions on net income.
- **youth-families/week-06** — audit subscriptions, apply a 24-hour rule, spot marketing manipulation, estimate lifestyle-inflation compounding. *(doing-page)*
- **youth-families/week-07** — restate checking vs savings, name four scams, self-check security habits; cannot open/secure a real account.
- **youth-families/week-08** — estimate total college costs, identify FAFSA + scholarships, apply the 2+2 transfer strategy. *(doing-page)*
- **youth-families/week-09** — build a realistic independent-living budget, test cost-of-living scenarios, apply the 30% rent rule. *(doing-page, capability 5)*
- **youth-families/week-10** — write family financial goals and discuss emergency scenarios; applies prior weeks, no new skill.
- **paths/builder/stage-1/module-1** — visualize and construct a UTXO transaction (select inputs/outputs, calculate fees); explain why UTXO vs accounts. *(doing-page)*
- **paths/curious/stage-1/module-1** — explain why barter fails; apply the 6 properties of money to evaluate any currency; trace monetary evolution.
- **paths/curious/stage-1/module-1 (ES)** — distinguish the 6 properties of money and explain why some monies historically outperformed; categorize historical money systems.
- **paths/hurried/stage-1/module-1** — execute a Bitcoin purchase on a regulated exchange and understand exchange-held BTC isn't self-custody. *(doing-page, artifact 4)*
- **paths/pragmatist/stage-1/module-1** — frame Bitcoin as neutral monetary infrastructure, recall the 21M cap, restate five advantages over banks; cannot yet secure a wallet.
- **paths/principled/stage-1/module-1** — state the Law of Conservation of Value, calculate purchasing power, identify Cantillon winners/losers; cannot yet act.
- **paths/sovereign/stage-1/module-1** — select a hardware wallet, run a 12-step setup with seed backup + restore test, understand air-gapped signing, draft an inheritance plan. *(doing-page, the BSA ideal)*
- **paths/index** — identify which path matches their intent and click through.
- **paths/builder** — restate how 6 prior innovations combine into Bitcoin; demo each via simulators; builds nothing original.
- **paths/curious** — restate path structure (4 stages/13 modules), name stage topics, navigate to Stage 1.
- **paths/hurried** — articulate the 7-step sovereignty path and navigate to the first module; real gains live in the modules.
- **paths/pragmatist** — navigate to Stage 1 and restate path structure; no concrete new action.
- **paths/principled** — restate the five-stage path and physics→civilization progression; no concrete action.
- **paths/skeptic** — restate the names of 11 objections and the two-stage structure; no new actionable capability.
- **paths/sovereign** — navigate to stage lessons and understand the sequence; no concrete custody/privacy action from this page alone.
