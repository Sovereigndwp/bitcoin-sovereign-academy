# Phase D — Loans Comparative Calculator Build · Handoff Brief

*Self-contained spec for a fresh session to pick up Phase D. Read this first; you can build without rereading the full prior conversation if you follow this brief carefully.*

---

## 1. Mission

Replace the placeholder block at `Part VII` of `bitcoin-backed-loans.html` (between `<!-- PART VII — CALCULATOR PLACEHOLDER -->` and its closing `</section>`) with a working **comparative calculator** that ranks the 9 covered BTC-backed lenders for a given borrower's situation and surfaces an **options-hedge overlay** as a comparative alternative. The calculator must inherit the same audit discipline established by the mortgages calculator and the prior 9-phase upgrade plan (A–F) already shipped.

When Phase D ships:
- Both Bitcoin Capital deep dives reach `strong as-is` by the deep-dive-design-and-upgrade framework
- The `bsa:upgrade_status` field in the loans page's JSON-LD graph metadata flips from `needs_major_upgrade_pending_calculator` to `strong_as_is`
- The Bitcoin Capital hub's `hasPart` entry for loans flips `shipped_calculator_pending` → `shipped`

---

## 2. Where the spec already lives

There is a **detailed developer-facing TODO comment** in the loans HTML file at the calculator placeholder (search for `PHASE 3 TODO — comparative calculator implementation discipline`). It enumerates five non-negotiable disciplines you must honor:

1. **LIQUIDATION TIMING** — fiat-denominated products are path-dependent. Smooth CAGR hides intra-term drawdowns. Calculator output must signal *"did the path ever cross the threshold,"* not *"did the end-of-term CAGR end below the threshold."*
2. **COLLATERAL CALLS** — cure windows differ by lender. Surface them as explicit inputs; show both "borrower cures" and "lender liquidates" branches.
3. **LENDER DISCRETION** — published thresholds ≠ operational reality. Treat thresholds as inputs, not as automatic-liquidation gospel.
4. **TAXABLE DISPOSITION TIMING** — forced liquidation creates a *disposition*, which may be a gain *or* a loss depending on basis and holding period. Do not output "owes LTCG."
5. **CUSTODY AND LEGAL RISK** — do NOT model qualified-custodian-with-rehypothecation, exchange, or wrapped products as if collateral is bankruptcy-remote. Surface recovery paths for multisig and self-custody DLC but do not assert legal bankruptcy-remoteness.

That TODO comment is the contract. Implementing the calculator without satisfying all five disciplines is failure mode #1 — and will be visible to readers because the prose around the placeholder explicitly tells them what to expect.

---

## 3. Source materials — read these in order

| Order | File | Purpose |
|---|---|---|
| 1 | `bitcoin-backed-loans.html` lines ~890–930 (Part VII placeholder) | The TODO comment + current placeholder structure |
| 2 | `bitcoin-backed-mortgages.html` (the calculator section, search for `What this calculator models — and what it doesn't`) | **The reference pattern.** The mortgages calculator is the discipline benchmark — match its scope-warning treatment, brand styling, and chart conventions |
| 3 | `data/providers.json` | Canonical source-of-truth for all 9 providers (terms, custody analysis, best/wrong fit, rehypothecation policy) |
| 4 | `data/loans-math-output.json` | All locked numbers — comparative costs, hedge scenarios, options strategies, LMC outperform scenarios, break-evens |
| 5 | `_drafts/loans-math-worksheet.py` | Reproducible math behind the JSON output. If you need to add scenarios, modify here and regenerate |
| 6 | `data/verification-log.json` | Per-provider verification dates and source URLs (for any quote-time tooltips you add) |
| 7 | `_drafts/loans-math-worksheet.py` | Python source for all the math |
| 8 | `chart.umd.js` (local bundle) | Chart.js v4.4.0, already in the directory. Use this, not a CDN |

---

## 4. Architecture — recommended approach

**Single-file vanilla JS + Chart.js.** Match the mortgages calculator's pattern. Do not introduce React, Vue, or build steps. The page must continue to work as static HTML served from Vercel without any compilation.

**File structure:**
- All new code goes inside `bitcoin-backed-loans.html`
- Calculator UI replaces the existing Part VII placeholder
- New JS module added at the bottom of the existing `<script>` block (after the existing footer-date and disclosure-dismiss handlers)
- Reads `data/providers.json` and `data/loans-math-output.json` via `fetch()` — these are static JSON files served alongside the HTML

**Component pattern:**
```
calculator-section
├── scope strip (sticky, always visible — model warning)
├── input panel (left column on desktop)
│   ├── BTC quantity / price / cost basis
│   ├── Loan need (USD)
│   ├── Horizon (months)
│   ├── Risk tolerance (sovereignty / convenience / cost)
│   ├── BTC price scenario (4 paths: bear / flat / base / bull)
│   ├── Mode toggle (Simple cost-comparison ↔ Full ranking)
│   └── Options overlay toggle (on/off)
└── results panel (right column on desktop)
    ├── Ranked provider recommendation (top 3)
    ├── Side-by-side cost/risk/custody comparison table
    ├── Interactive cost curve chart (Chart.js, multi-provider lines)
    ├── Options overlay (if toggled): put cost vs. loan cost
    └── Decision summary (plain-language reasoning for the ranking)
```

**Mobile:** Stack vertically. Input panel first, results below. Use the same responsive breakpoints as the mortgages calculator.

---

## 5. Inputs — user-facing controls

| Input | Type | Default | Range | Notes |
|---|---|---|---|---|
| BTC quantity owned | number | 5 | 0.1–1000 | Validates against minimum for each provider |
| Current BTC price (USD) | number | 100000 | 10000–500000 | Affects USD-equivalent costs for BTC-denominated products (LMC) |
| Cost basis per BTC (USD) | number | 20000 | 0–current price | Used for LTCG calculations in baseline comparison |
| Loan need (USD) | number | 250000 | 1000–10000000 | Drives provider applicability (some have minimums) |
| Horizon (months) | number | 24 | 1–60 | Drives rollover and renewal scenarios |
| Risk tolerance | radio | sovereignty | sovereignty / convenience / cost | Influences ranking weights |
| BTC scenario | radio | base | bear (−5%) / flat (0%) / base (+5%) / bull (+15%) | Annual CAGR for path projection |
| Mode | toggle | simple | simple / full | Simple = cost-only matrix; full = ranking + overlay |
| Options overlay | toggle | off | off / on | Adds put cost / collar cost as comparison columns |

**Defaults must produce a sensible first render** so a reader can immediately see how the calculator works without changing anything.

---

## 6. Outputs — user-facing results

### A. Ranked provider list (Full mode)

Top 3 providers, scored on a weighted combination of:
- Direct cost over horizon
- Margin call risk under the selected scenario
- Custody alignment with stated risk tolerance
- Applicability (minimum loan size, jurisdiction, denominator preference)

Each card shows: provider name, total cost over horizon, primary risk, custody model, "fits because..." plain-language reason, "watch out for..." plain-language caveat.

### B. Side-by-side comparison table

Same 9-provider table as the existing Part VII placeholder, but live-recalculated for the inputs. Columns: provider, BTC pledged, total cost, margin call status under scenario, custody, applicability badge (`fits` / `minimum-binding` / `not-applicable`).

### C. Cost curve chart (Chart.js)

Multi-line chart showing cumulative borrower cost over the horizon for the providers that pass applicability. X-axis = months. Y-axis = cumulative cost (USD). Each provider gets a colored line. Mortgages calculator's chart styling is the reference.

### D. Options overlay (when toggled)

Adds two horizontal reference bands:
- "Cost of a long put at 35% OTM" (illustrative BS estimate)
- "Cost of a put spread 50/25" (illustrative BS estimate)

Bands let the reader see: *"For this much cost, I could buy options protection instead of taking on the lender's structural risk."*

### E. Decision summary (plain language)

Three sentences max. Example: *"Based on $250K over 24 months with a sovereignty-first preference and base-case BTC, Ledn Custodied is the safe default. Unchained is cheaper if you qualify for the $1M+ tier. LMC is materially cheaper but creates implicit forward-short exposure — read Part IV before choosing it."*

### F. Scope strip (always visible at top of results)

Persistent banner showing which structural model the active inputs apply to. Example: *"Inputs applicable to: fiat-denominated products (8 of 9). LMC is BTC-denominated — see Part IV section for separate evaluation."*

---

## 7. Math foundations — already locked

All numerical claims in the calculator must reconcile with `data/loans-math-output.json`. If you need new scenarios (e.g., a `+10%` BTC path that wasn't in the original worksheet), modify `_drafts/loans-math-worksheet.py`, re-run with `python3 _drafts/loans-math-worksheet.py`, and the JSON regenerates.

**Reproducibility test:** before shipping, pick three input combinations at random, compute by hand or in the Python worksheet, and verify the calculator's output matches within $100. If it doesn't, the calculator is wrong, not the worksheet.

**Headline numbers already locked** (these must appear when inputs match the default scenario at $250K / 24 months):

- LMC: 2.63 BTC pledged, ~$26K direct cost
- Coinbase/Morpho: 3.33 BTC pledged, ~$40K
- Lava: 4.17 BTC pledged, ~$49K
- Unchained (Commercial): 5 BTC pledged, ~$80K
- Bitfinex: 2.78 BTC, ~$50K
- SALT: 5 BTC, ~$60K
- Ledn Standard: 5 BTC, ~$62K
- Arch: 4.17 BTC, ~$66K
- Ledn Custodied: 5 BTC, ~$70K
- Debifi: N/A under $500K loan size (display "minimum binding")

---

## 8. Discipline requirements (non-negotiable from audit)

These are not "nice to haves." They are commit-blockers if missing:

1. **Path-dependency warning visible on every render.** The scope strip must include language equivalent to *"This projects smooth CAGR paths, which is a path-independent simplification. Real BTC paths cross thresholds intra-term in ways CAGR does not capture."*
2. **Options pricing labeled illustrative.** Any put or collar cost shown must be labeled with the BS assumptions (80% IV, 4.5% risk-free, 12-month tenor) and a *"verify with live quote"* note.
3. **No "triggers LTCG" language anywhere.** Use "taxable disposition (may realize gain or loss depending on basis and holding period)."
4. **Each provider tier change explicitly noted.** When the inputs cross a tier threshold (e.g., Ledn $1M+ tier), show it.
5. **Rehypothecation status visible per provider.** SALT and Ledn Standard must show a small "rehypo allowed" indicator in the ranking output.
6. **Custody-architecture name visible per provider.** Match the labels from Figure 4 in Part VI (Self-custody DLC, 2-of-3 multisig, etc.)
7. **Disclaimer footer present at bottom of calculator section.** Same pattern as mortgages: *"Educational only — not advice. Verify with originating lender."*

---

## 9. Phase D internal stages

Break Phase D into 3 sub-phases. Each sub-phase has a verifiable deliverable.

### D1 — Data loading + scope strip (~3 hours)
- `fetch()` providers.json and loans-math-output.json
- Build the scope strip with model-applicability logic
- No interactive computation yet — just the static scaffolding rendering
- **Verification:** scope strip renders, providers list loads, no JS errors

### D2 — Inputs + comparison table (~6 hours)
- All input controls live and validated
- Comparison table live-recalculates on input change
- Applicability badges drive which rows show
- Mode toggle (simple ↔ full) works
- **Verification:** changing inputs updates the table; defaults match the locked headline numbers within $100

### D3 — Charts + options overlay + decision summary (~6 hours)
- Cost curve Chart.js renders
- Options overlay toggle adds put / put-spread reference bands
- Decision summary text generates from ranking output
- Scope strip updates as inputs change
- **Verification:** all features render; outputs match `loans-math-output.json` scenarios; mobile responsive; no Chart.js errors

**Total estimate:** ~15 hours of focused work — about 2 working days.

---

## 10. Quality gates (must pass before considering Phase D done)

- [ ] All 9 providers rendered and live-recalculate on input change
- [ ] Defaults render correctly with locked headline numbers
- [ ] Scope strip visible at all times, updates on input change
- [ ] All 5 audit disciplines (TODO comment) visibly satisfied
- [ ] Math reconciles with `loans-math-output.json` within $100 on 3 random spot-checks
- [ ] Chart.js loads from local `chart.umd.js` (no CDN dependency in primary path)
- [ ] No JS errors in browser console
- [ ] Mobile responsive (test at 375px viewport)
- [ ] Skip link still works for keyboard nav
- [ ] Disclosure banner still functional (Dismiss button still works, localStorage persistence intact)
- [ ] Footer back-link to Bitcoin Capital hub still present
- [ ] `bsa:upgrade_status` in the JSON-LD graph metadata updated to `strong_as_is`
- [ ] `bsa:learning_arc.interactive_test` updated from `planned_phase_3` to `present`
- [ ] Hub `index.html` `bsa:hasPart` entry for loans updated to `shipped`
- [ ] No regression in existing audit features (steelman, reflection, Phase C SVGs, baseline panel)
- [ ] Tag balance check (all `<section>`, `<div>`, `<svg>`, `<figure>` open/close counts match)

---

## 11. Decision points — answer these BEFORE writing code

1. **Single-file or split JS?** The mortgages calculator embeds everything in the HTML file. The loans HTML is already ~1,800 lines. Decision: embed inline, OR pull the calculator JS into `_drafts/loans-calculator.js` and reference it. Recommendation: **embed inline** to match the mortgages pattern and keep deployment simple. Split only if the JS exceeds 500 lines after D2.

2. **Provider weighting in the ranking — what's the algorithm?** Suggested approach:
   - `cost_score` = (cheapest provider's cost) / (this provider's cost), in [0, 1]
   - `risk_score` = 1 for no margin call, 0.5 for has margin call with no rehypo, 0 for has margin call with rehypo
   - `custody_score` = 1 for multisig with borrower key, 0.7 for self-custody DLC, 0.5 for qualified custodian no rehypo, 0.3 for qualified custodian rehypo, 0 for exchange / pooled
   - `tolerance_weights` = {sovereignty: [0.2, 0.3, 0.5], convenience: [0.3, 0.4, 0.3], cost: [0.6, 0.2, 0.2]}
   - `total_score` = Σ(weight × score)
   - Need to confirm or adjust before D2.

3. **Options overlay — illustrative numbers or live API?** No live API. Use the locked BS estimates from `loans-math-output.json`. Label clearly as illustrative.

4. **Path-dependency modeling — smooth CAGR or path simulation?** Smooth CAGR with a prominent warning is acceptable (matches mortgages calculator scope). Path simulation (with stochastic vol) is overkill for Phase D and would require statistical model defense. Defer to a possible Phase G.

5. **Should the calculator surface the steelman from Part XII½ when "selling outright" outperforms all loan options?** Probably yes — if the cheapest loan option costs more than the LTCG tax on the equivalent sell, the decision summary should explicitly recommend reading the steelman section. Implement as a "consider this" callout in the decision summary, not an automatic dismissal.

---

## 12. First action — what to do in the first 30 minutes of the new session

1. **Read** the TODO comment in `bitcoin-backed-loans.html` Part VII placeholder. Read `bitcoin-backed-mortgages.html`'s calculator section for the reference pattern. Read `data/providers.json` for the provider data.
2. **Open** `_drafts/loans-math-worksheet.py` and `data/loans-math-output.json`. Pick three random input combinations and verify the worksheet math computes the same numbers as the JSON output.
3. **Decide** the 5 questions in Section 11 above. Write decisions into a `phase-d-decisions.md` file in `_drafts/`.
4. **Build D1** — data loading + scope strip. Test that it renders. Commit.
5. **Build D2** — inputs + comparison table. Test the locked headline numbers. Commit.
6. **Build D3** — charts + overlay + decision summary. Verify quality gates. Commit.

**Estimated total clock time:** 2 focused working days, broken across 2–3 sessions if needed.

---

## 13. After Phase D ships

Update the audit metadata in three places:

1. `bitcoin-backed-loans.html` JSON-LD: flip `bsa:upgrade_status` to `strong_as_is`, flip `bsa:learning_arc.interactive_test` to `present`
2. `index.html` (hub) JSON-LD: flip the loans `hasPart` entry's `status` from `shipped_calculator_pending` to `shipped`
3. Update the hub's visible "Comparison at a glance" matrix row for loans — change the calculator column from placeholder text to "Yes — 9-provider ranking + options overlay"

After those three updates, **both Bitcoin Capital deep dives reach `strong as-is` by the deep-dive-design-and-upgrade framework, and the master upgrade plan is complete.**

---

## 14. Reference URLs (for the new session to bookmark)

- Live mortgages calculator (the discipline benchmark): `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/bitcoin-backed-mortgages.html#calculator`
- Loans placeholder (replacement target): `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/bitcoin-backed-loans.html#calculator-placeholder`
- Provider data: `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/data/providers.json`
- Locked math: `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/data/loans-math-output.json`
- Math worksheet: `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/_drafts/loans-math-worksheet.py`
- Master upgrade plan (this whole project's context): `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/_drafts/bitcoin-capital-resource-plan.md`
- This handoff brief: `/Users/dalia/projects/bitcoin-sovereign-academy/deep-dives/bitcoin-capital/_drafts/phase-d-handoff-brief.md`

---

*Document version: 1.0 · Authored at the conclusion of Phases A/B/C/E/F · 2026-05-13*
