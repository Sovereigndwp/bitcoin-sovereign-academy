# Spec: Module 4 interactive upgrade - "Measure-Drift Simulator"

> Status: proposed (build-interactive spec). Replaces the reveal-only `broken-scoreboard`
> tool with a learner-driven model. No code shipped yet. EN/ES parity required.
> No em dashes in any shipped string. Illustrative model only (no financial advice,
> no real price data, no custody output).

## Why this upgrade

The current `broken-scoreboard` tool is pick-a-scenario then click "Adjust the
scoreboard" then read two precomputed columns. The gap between the reported number
and the truth is hardcoded per scenario. The learner controls nothing quantitative,
so the module's core claim ("if the measuring stick quietly changes length, good
decisions turn bad") is *told*, not *felt*. This upgrade gives the learner the lever
that distorts the measure and lets them watch the gap open and the decisions flip in
real time. That converts inflation from a fact into a mechanism.

It keeps the five scenarios as framings, keeps `BSAInteractive.mount()`, and stays a
single reusable tool that can also drop into FSA money modules and any
purchasing-power lesson.

---

## purpose
Let the learner discover, by moving the sliders themselves, that a measure which can be
pumped up at will drifts away from what is actually there, and that people reading the
drifting measure make worse and worse decisions the longer and harder it is pushed, even
though each individual reading is rational. The learner finds the mechanism; the tool does
not announce it.

Framing stays "measure drift", "the pumped-up scoreboard", and "the reported number vs
what is actually there". The word inflation is used only inside the printing, prices, and
savings scenarios, where it is the plain name for what the learner is seeing. This is an
illustrative model: no real price data, no financial advice, no custody output, no country
examples, no empirical claims.

## learner_question
"If the scoreboard can be quietly pumped up, how far can what it says drift from what is
actually there, and at what point do people start making bad decisions because of it?"

## inputs (what the learner controls)
- **Scenario** (select, 5 options - unchanged): referee / grades / prices / savings /
  printing. Selecting one only changes the *labels and the decision copy*, not the math,
  so the learner sees one mechanism behind five surfaces.
- **Distortion rate** `d` - slider, 0 to 15 percent per period. Default **7%**.
  Label: "How fast the scoreboard is pumped up."
- **Periods** `n` - slider, 0 to 25. Default **10**. Label adapts per scenario:
  "years" (savings, printing, prices), "innings" (referee), "rounds of grading"
  (grades).

Both sliders update outputs live (`input` event, debounced one frame). No "Adjust"
button gate; the learner is dragging, not clicking-to-reveal. `onComplete()` fires the
first time either slider is moved off its default (the learner has acted).

## outputs (the consequence, recomputed live)
A fixed real baseline of **100 units** ("what is actually there" - points, understanding,
goods, work). It never moves; that is the honest control.

1. **Reported number** = `100 × (1 + d/100)^n` - the scoreboard. Rises and compounds.
2. **True value** = `100`, flat - drawn as a reference line / second bar.
3. **The Gap** = `reported − true`, shown as a number and as the widening space between
   the two bars. Also **Gap %** = `reported/true − 1`.
4. **Purchasing-power mirror** (shown for savings / printing / prices scenarios):
   what a fixed saved number buys after the drift = `100 / (1 + d/100)^n`. Same lever,
   inverse felt result: the number can rise while what it buys falls.
5. **Decision readout** - a single sentence that *changes by band* as Gap % crosses
   thresholds (see scenario_logic). This is the behavior text, but now driven by the
   learner's lever instead of fixed per scenario.

## scenario_logic (the model, shown honestly)
```
reported(d, n) = 100 * (1 + d/100)^n        // compounding distortion
true           = 100                         // real goods/work/points unchanged
gap            = reported - true
gapPct         = reported / true - 1
purchasing(d,n)= 100 / (1 + d/100)^n         // what a fixed number buys after drift
```
- The only constant is the **base unit = 100**. It is a unit of account for the demo,
  not an empirical figure, so it carries no sourcing burden. The tool must label it
  "illustrative" on screen.
- The compounding form `(1 + d)^n` is the standard, honest way a steady percentage
  distortion accumulates. Show the formula in a small "How this is computed" disclosure
  so the math is not hidden.
- **Decision bands** (drive the readout; tuned, not claimed as empirical):
  - `gapPct < 5%` → "The scoreboard still roughly tells the truth. People plan normally."
  - `5% to 30%` → "People start trusting the number over what they can see. The ones
    who are quietly falling behind do not notice yet."
  - `30% to 150%` → "Decisions made on the number turn out wrong. Savers who felt
    richer can afford less; the team that 'won' did not earn it."
  - `> 150%` → "The measure has stopped meaning anything. People abandon it and scramble
    for something that holds its value."
  Per-scenario copy overrides the wording but keeps the same four bands, so the mechanism
  reads identically across all five surfaces.

## edge_cases (extremes that teach)
- **d = 0** (any n): reported = true, gap = 0. The control case - "a measure nobody pumps
  up keeps telling the truth." This is the quiet setup for Modules 5–6 (a rule nobody can
  change), so the zero case is pedagogically load-bearing, not a dead state.
- **n = 0** (any d): gap = 0. Distortion needs time to compound; one push does little, a
  steady push for years does a lot.
- **n = 1, d high** (referee / grades): even a single adjustment opens a visible gap -
  covers the one-shot scenarios honestly.
- **d and n both max** (`15%`, `25`): reported ≈ 3290, purchasing ≈ 3 of the original 100.
  Hyperinflation feel without naming a country or citing data - the bars blow past the
  frame, purchasing power collapses to near zero.

## UI copy
- Tool intro (reuse module `instruction`): "Pick a scenario. Pump up the scoreboard and
  watch the gap open between what it says and what is actually there, and how people
  respond to the number instead of the truth."
- Slider labels: "How fast the scoreboard is pumped up" (`d`), "How long this goes on"
  (`n`, unit adapts per scenario).
- Output headers (reuse existing strings): "What the scoreboard says" / "What is actually
  happening" / "How people respond" / "Where it leads."
- Live readouts: "Scoreboard: {reported}", "Actually there: 100", "Gap: {gap}
  (+{gapPct}%)", and where shown "What your savings buys: {purchasing} of the original 100."
- Takeaway line (reuse `exit_takeaway`): "Money is a measuring stick for time, work, and
  plans. If the stick changes length, people misread reality and make decisions they would
  not otherwise make."
- A small note: "Illustrative model. The base of 100 is a unit for this demo, not a real
  price."

## source_notes
- No external or live data. Purely a mechanism model, so nothing to date or cite beyond
  the on-screen "illustrative" label. (Contrast: the M5/M6 tools and any figure-bearing
  demo still require dated sources; this one deliberately avoids empirical claims.)
- Current block subsidy reference, if ever added to copy, is 3.125 BTC - but this tool
  needs no Bitcoin figure; Bitcoin is named only in `bitcoin_connection`, unchanged.

## graph edges (wire-in)
Using the deep dive's local registry (concepts keyed by name, misconceptions M1–M8):
- `concepts_taught`: **Money** (as a measuring stick / unit of account), **Bad money**,
  **Monetary rule** (sets up "a rule nobody can quietly change").
- `misconceptions_repaired`: **M5 - "Printing money creates wealth."** (printing scenario
  + purchasing-power mirror directly falsifies this). Partial support for **M3 - "If
  something is free, it has no cost"** (the cost spreads quietly across holders).
- `decision_supported`: prepares the Module 5–6 question "what would a measure nobody
  could quietly change do?" Does **not** route to any custody/advice CTA.
- Canonical-format equivalents to register if the central graph uses CON-/MIS-/DEC-:
  `CON-money-unit-of-account`, `CON-bad-money`, `CON-monetary-rule`; `MIS-printing-creates-wealth`;
  `DEC-prefers-unchangeable-measure`.

---

## Implementation notes (when approved to build)
- **Where:** extend `js/interactive-tools/interactive-tools.js` - replace the body of
  `brokenScoreboard(root, spec, ctx)` (tool key `"broken-scoreboard"` stays, so no page,
  engine, or mount changes). Add styles under `.bsa-int` in `interactive-tools.css`.
- **Spec contract (unchanged call site):** engine still passes
  `{ scenarios: DATA.scoreboard_scenarios }`. Add two optional fields the engine can pass
  through without breaking existing callers: `base` (default 100) and `bands` (default the
  four above), so other lessons can reparameterize. Each scenario object gains optional
  `period_unit` and `decision_bands[]`; if absent, fall back to the shared defaults, so the
  current `scoreboard_scenarios` data keeps working and the new copy is additive.
- **New `t` strings (EN + ES, both required):** `pumpRate`, `periodsLabel`, `scoreboardNum`,
  `actuallyThere`, `gapLabel`, `buysLabel`, `illustrativeNote`, `howComputed`. Add beside the
  existing M4 strings in `UI.en` / `UI.es` in `rules-under-the-game.js`.
- **a11y:** sliders are native `<input type="range">` with `<label for>`, `aria-valuetext`
  giving the current reading in words; the live region (`aria-live="polite"`) announces the
  band sentence, throttled so dragging does not spam a screen reader. Bars get text
  equivalents. Respect `prefers-reduced-motion` (no bar-grow transition when set).
- **Sanitize:** all numbers through the existing `safeNum`/`esc` path before innerHTML; no
  user free-text; no `eval`.
- **Test:** extend the jsdom harness - assert the renderer mounts, that moving a slider
  recomputes `reported` and fires `onComplete` once, that `d=0` yields gap 0, and that
  EN/ES skeletons stay structurally identical.
- **Footer / brand:** inherits page chrome; gold `#f7931a` token already in scope; footer
  "Created by Dalia · bitcoinsovereign.academy" unchanged.

## Estimate
Self-contained: ~120–160 lines in the renderer + ~40 lines CSS + 8 string pairs + 1 test
block. No new files, no new dependencies, no engine/route/analytics/membership changes.
