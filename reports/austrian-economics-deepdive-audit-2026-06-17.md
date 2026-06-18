# Austrian Economics Deep-Dive Cluster — Phase 1 Audit (read-only)

**Date:** 2026-06-17
**Branch:** `feat/austrian-deepdive-rebuild` (worktree off `origin/main` @ `cb7b3f4c`)
**Scope:** `/deep-dives/austrian-economics/` — index + 4 explainers
**Status:** Read-only audit. No content rebuilt. Awaiting owner sign-off on direction + sequence.

Pages audited (origin/main is current; PR #125 already did the coherence/de-green/overclaim-trim pass, so this is the *pedagogical-depth* layer, not a re-do):
- `economic-calculation-problem.html` (841 lines)
- `praxeology-human-action.html` (862 lines)
- `sound-money-theory.html` (773 lines)
- `time-preference-fundamentals.html` (855 lines)
- `index.html` (198 lines) — hub card grid, fine structurally

---

## Deliverable 1 — Page-by-page audit (headline findings)

All four pages share the **same four defects**, in descending severity:

### A. Epistemic: they *convince*, they don't *inform* (the big one)
Every page presents a **methodologically contested school** (a priori praxeology, ABCT, the gold standard) **and a partisan Bitcoin thesis as settled fact**, with **zero steelman** of the strongest opposing view, then closes in explicit advocacy. This is the direct opposite of the locked "inform, not convince" voice. Worst offenders, verbatim:
- *"Bitcoin makes sense only through the lens of praxeology. Mainstream economics cannot explain why Bitcoin works."* (praxeology)
- *"every sat you save in Bitcoin is a vote for sound money and a better future."* (sound-money)
- *"By fixing the money, Bitcoin fixes the incentives... it fixes society."* + *"This is why you matter..."* (time-preference)
- *"Bitcoin is Hayek's knowledge problem, solved with math."* (calculation)

### B. Sourcing is essentially absent — and two "quotes" are fabricated
Across ~100 hard claims, almost none carry an inline citation. Two blockquotes presented as verbatim **Mises** quotations appear to be **paraphrases dressed as quotes** (praxeology page; sound-money page). The pundit quotes (Krugman/Roubini/Rogoff) are real but unlinked and one is likely misworded (Roubini: "mother of all *bubbles*" vs "scams" — needs verification).

### C. Empirical claims that are stale or wrong
- **"Dollar lost 97% since 1971"** (sound-money) — the ~96-97% figure is measured from **1913**, not 1971. From 1971 the loss is ~87% (FRED CPIAUCSL). **Base-year error.**
- **"$1M of gold ≈ 28 kg"** (sound-money) — **~2x stale**; at current spot it's ~15-16 kg.
- **Stock-to-flow "60 years to double"** (sound-money) — definitional error; S2F ≈ 60 means ~60 years to *reproduce the whole stock*, not double it. Contradicts the page's own formula box.
- **"National debt above $30 trillion"** (calculation) / **"$36T"** (sound-money) — datable, already drifting (>$36T now).
- **"Your bitcoin maintains (or increases) purchasing power"** (time-preference) — false as stated; BTC has had multi-year drawdowns (2018, 2022).

### D. No interactivity + leading Socratic questions
All four are 100% static prose + CSS cards. The only dynamic affordance is the auto-injected Reflect widget (and on every page its `data-topic` is the generic `"money"`, not the page's actual topic). Each page has a 6-question "Socratic" block, but the questions are **rhetorical and pre-answered** (they presuppose the Austrian conclusion) rather than genuinely open. No predict→measure loop anywhere.

Plus hygiene: **~17-20 em dashes per page** (violates the no-em-dash rule); red/green moral coloring on comparison cards (time-preference) conflicts with "color carries meaning."

---

## Deliverable 2 — Master claim ledger (priority flags)

Full per-page ledgers (~100 rows total) live in the agent audit transcripts. The load-bearing items the rebuild MUST resolve:

| Page | Claim | Problem | Resolution |
|---|---|---|---|
| sound-money | "dollar lost 97% since 1971" | wrong base year (that's 1913) | recompute live from FRED CPIAUCSL; state base year |
| sound-money | "$1M gold ≈ 28 kg" | ~2x stale | compute from live spot (LBMA/COMEX) |
| sound-money | S2F "60 years to double" | definitional error | fix to "reproduce existing stock"; cite |
| sound-money | Mises "sound money..." blockquote | paraphrase as quote | relabel as paraphrase or find verbatim + cite (Mises 1912) |
| sound-money | six properties "following Menger" | misattribution | the 6-checklist is a later synthesis (Ammous 2018), not Menger; reattribute |
| praxeology | Mises "science of purposeful..." blockquote | not verbatim | verify against Human Action ch. I-II or relabel |
| praxeology | "derived... through pure logic, no data" | contested method stated as fact | label a priori method as contested; add Caplan steelman |
| praxeology | "mainstream cannot explain Bitcoin" | overclaim/convince | cut or qualify |
| praxeology | Knightian risk vs uncertainty | credited to praxeology | credit Knight 1921 |
| time-pref | "money directly shapes society's time preference" | contested thesis (Ammous) as fact | frame as hypothesis + steelman |
| time-pref | "bitcoin maintains/increases purchasing power" | false (volatility) | cut/qualify |
| time-pref | high/low TP societal-trait lists | unfalsifiable generalizations | cut or mark as illustrative |
| time-pref | Japan miracle "Yen stable re gold" | inaccurate (Bretton Woods USD peg) | correct |
| calculation | "rent control: shortages in *every* city" | universal overclaim | cite Diamond et al. 2019; soften |
| calculation | Venezuela "price controls → starvation" | causal overreach, unsourced | cite ENCOVI; soften |
| calculation | crisis "every 7-10 years like clockwork" | false precision | cite NBER; remove "clockwork" |

Cross-cutting: **every** "Bitcoin fixes/solves/proves" line, and all moralizing ("HODL = delayed gratification in its purest form"), gets cut or reframed to scoped, sourced design facts.

---

## Deliverable 3 — Proposed structure (shared pattern + per page)

**Shared rebuild pattern for all four** (keeps them deep-dives, not paths):
1. *What the idea actually claims (and doesn't)* — define precisely, name it as one school's position, source it.
2. *One interactive* — a predict→measure / learn-by-doing beat (see Deliverable 5).
3. *The evidence you can check yourself* — replace asserted history/empirics with sourced, dated, learner-verifiable data.
4. *The strongest objection (steelman)* — present the best opposing case **honestly, before any rebuttal**. This is the new required section every page lacks.
5. *Where Bitcoin fits — and where it's still contested* — scoped design facts, no cheerleading; surface intra-Austrian disagreement where it exists (e.g. regression-theorem debate on whether Bitcoin even qualifies as money).
6. *Reflect* — genuinely open questions (keep one that argues the other side); retopic the widget to the page's subject.

Per-page steelman targets (the sharpest version of "discover, not convince"):
- **calculation** → Lange-Lerner market socialism; Cockshott-Cottrell "big-data planning"; Walmart/Amazon as vast successful internal planners; Cybersyn.
- **praxeology** → positivist/Popper unfalsifiability critique; Bryan Caplan, "Why I Am Not an Austrian Economist."
- **sound-money** → mainstream case for ~2% inflation target; debt-deflation/Fisher 1933; the near-unanimous IGM economist poll against a gold standard; gold-era panics (1893, 1907).
- **time-preference** → hyperbolic discounting/present-bias (Laibson, Thaler); Mullainathan & Shafir *Scarcity* (high discount rates track scarcity, not character — defuses the "poverty = bad character" overclaim).

---

## Deliverable 4 — Data sources & primary citations

**Primary texts (for inline citation):** Mises, *Economic Calculation in the Socialist Commonwealth* (1920); *The Theory of Money and Credit* (1912, regression theorem); *Human Action* (1949). Hayek, "The Use of Knowledge in Society" (1945); *Prices and Production* (1931); *The Fatal Conceit* (1988). Menger, "On the Origins of Money" (1892); *Principles of Economics* (1871). Böhm-Bawerk, *Capital and Interest* (1884). Rothbard, *What Has Government Done to Our Money?* (1963); "Praxeology" (1976). Knight, *Risk, Uncertainty and Profit* (1921). Counter-sources: Caplan, "Why I Am Not an Austrian Economist"; Fisher (1933); Mullainathan & Shafir, *Scarcity* (2013); Diamond et al. (2019); Fergusson, *When Money Dies* (1975).

**Live/empirical data (FRED unless noted):** CPIAUCSL (CPI/purchasing power), M2SL (money supply), GFDEBTN (federal debt), PSAVERT (personal saving rate); Case-Shiller / Census (home-price-to-income); World Gold Council + USGS (gold/silver stock & flow); Bitcoin protocol + mempool.space (supply, halving, S2F); measuringworth.com (long-run price index); IGM Booth poll (economist consensus on gold standard); OECD/BOJ (Japan saving rate).

Site already has `js/bitcoin-data-reliable.js` (`data-btc-live`) for BTC values; FRED/CPI would be a **new** live-data source to add (or compute-once-and-date-stamp if we avoid a new fetch dependency — a decision flagged below).

---

## Deliverable 5 — Interactive opportunities (one per page minimum)

- **calculation → "Plan an economy without prices"**: allocate fixed steel/labor across goods with hidden, shifting demand; reveal how far you miss vs a price-guided run. (Steelman baked in: give the learner "big data" and show tacit/dynamic knowledge still defeats it.)
- **praxeology → "Try to deny that humans act"**: a form whose very submission is a purposeful action — teaches the a priori claim by performative contradiction. Plus a diamond-water marginal-utility slider.
- **sound-money → live purchasing-power + debasement widgets**: "$1 in 1971 buys ___ today" (predict, then reveal from CPI); "$1M of gold weighs ___ kg" (live spot); M2-vs-CPI indexed-to-1971 chart. These directly replace the three stale/wrong hardcoded figures.
- **time-preference → discount-rate sandbox**: learner sets their *own* discount rate, sees present value of a future sum — discovers they already have a time preference; resolves the opening hook with a measured number. Plus a "scarcity vs character" framing toggle (the steelman as interaction).

These reuse existing patterns (the site already has a `/interactive-demos/stock-to-flow/` and `/interactive-demos/time-preference-explorer/` we can port from rather than build cold).

---

## Deliverable 6 — Recommended implementation order

Sequenced by impact and by getting the pattern right once before replicating:

1. **`sound-money-theory.html` first (pilot).** Highest density of *factually wrong/stale* claims (base-year error, gold weight, S2F error) → highest correctness payoff, and its interactives (live CPI/gold/M2) are the most concrete. Proving the shared 6-part pattern + sourcing + one live interactive + steelman here sets the template.
2. **`time-preference-fundamentals.html`** — most cheerleading/moralizing to defuse; the scarcity-vs-character steelman is the most valuable single addition on the site.
3. **`economic-calculation-problem.html`** — strongest, most teachable interactive ("plan without prices"); steelman is genuinely interesting (computational planning).
4. **`praxeology-human-action.html`** — most abstract; benefits from going last once the pattern is proven.
5. **`index.html`** — light pass: update card blurbs to match the rebuilt, less-triumphalist tone; no structural change.

Each page ships as its **own small PR** off this branch (or sequential commits), verified in-browser (contrast AA, interactive works, no em dashes, Reflect retopiced) before the next. Em-dash sweep + Reflect-retopic happen inline per page.

---

## Open decisions for owner (need a call before code)

1. **Editorial shift — confirm:** the rebuild makes these pages genuinely *two-sided* (a real steelman of mainstream economics / the case against the gold standard, presented fairly). This is faithful to "inform, not convince" / "discover, not convince," but it means the pages will no longer read as advocacy. Confirm that's the intent.
2. **Live FRED data vs dated-and-sourced static:** do we add a live CPI/M2 fetch (new data dependency, always-current, more build) or compute-once and stamp "as of <date>, source FRED" (simpler, no new runtime dependency, but goes stale)? Recommend **live for BTC** (already wired) + **dated-and-sourced for FRED** in v1, upgrade to live FRED later.
3. **Sequence/scope:** approve the 4-page order above, or pilot **sound-money only**, review, then decide on the rest.
