# Week 3 Sensory Upgrade — Design Spec

_Date: 2026-06-08 · Status: approved direction, pre-implementation · Page: `youth-families/week-03/index.html` · Engine: `js/youth-engine.js` + `css/youth-engine.css`_

## Problem

Week 3 (the validated flagship) teaches the right loop but feedback is: "a bit boring — more visuals, more senses, more surprise." The page is text-and-input heavy; the two moments with the most pedagogical payload (the prediction *gap* and the inflation *consequence*) are currently static prose. This spec makes those two beats **felt**, not just read.

## Goals

1. Make the **predict→reveal** moment land the gap between intuition and reality with motion.
2. Make the **savings consequence** visceral: dollars hold their number but lose buying power.
3. Stay on-brand and inside locked constraints (unbounded mode, restraint, accessibility).
4. Build the treatments as **reusable engine primitives** (not page-local one-offs) so T5 weeks can adopt them later — but **wire them only on Week 3 for now**, pending re-validation.

## Non-goals (YAGNI)

- No audio. (Generated tones read cheap and add no understanding; explicitly cut per owner.)
- No badges / streaks / % / completion mechanics (unbounded mode — locked).
- No replication to other weeks in this work (T2–T5 stay on hold).
- No new third-party libraries or asset files. Pure CSS/JS, dependency-free (matches engine).
- No changes to the Verify (21M live-supply) step, the artifact, the share beat, or analytics wiring already shipped.

## Decisions locked

- **Race/melt uses the learner's own numbers.** Reads `yf-w3-goal` from the saved artifact (their cost). Falls back to the $1,000 example if no goal saved yet. (Owner-approved; matches "learner-generated over hardcoded" principle.)
- **Inflation assumption unchanged:** ~3%/yr long-run average; savings account 0.5%. No asset price claims anywhere in the animation — the live fixed-supply check remains its own separate step.
- **Two distinct beats**, sequenced: D (race) flows into C (melt freeze) as one interaction.

## The two treatments

### Beat 1 — Reveal Gap (enhances existing `YouthLoop.reveal`)

When the learner reveals the math, instead of only printing the result note:
- The real number **counts up** to its value.
- A slim horizontal track shows the learner's **guess marker** and the **real marker**; the real marker slides to its true position.
- The span between them **shades** and a caption states the gap in plain words ("8 weeks longer than you thought").
- A short **haptic buzz** fires on landing (mobile only).

This is an enhancement to the engine's existing reveal rendering, so it benefits every future week's prediction step. It degrades to the current text note under reduced-motion.

### Beat 2 — Race → Melt (new engine primitive `yf-timelapse`)

A new declarative primitive replacing Step 2's text scenario:
- Markup: `<div class="yf-timelapse" data-amount-key="yf-w3-goal" data-fallback="1000" data-years="10">`
- Two choice buttons (drawer / savings account). On choice:
  1. **Race:** a 10-year time-lapse — a "prices (~3%/yr)" bar pulls ahead of a "your money" bar; year counter ticks.
  2. **Melt freeze:** the race resolves into a freeze-frame — the saved amount visibly shrinks in scale/saturation while the price grows past it, with a plain caption: "same dollars · now buys ~$X of what it used to."
- `data-amount-key` pulls the learner's real goal cost; `data-fallback` is the clean example.

## Architecture & file boundaries

| Unit | Change | Why here |
|---|---|---|
| `css/youth-engine.css` | Add `.yf-reveal-gap` styles + `.yf-timelapse` styles | Shared engine stylesheet; only consumer today is week-03, so safe to extend now and reuse for T5. |
| `js/youth-engine.js` | Enhance `reveal()` to render the gap viz; add `YouthTimelapse` primitive with auto-init by `.yf-timelapse[data-*]` | Keep the engine the single source of loop behavior. New primitive follows the existing auto-init-by-data-attribute pattern. |
| `youth-families/week-03/index.html` | Replace the Step-2 text scenario block with the `.yf-timelapse` element; keep everything else | Page consumes primitives declaratively, no page-local animation JS. |
| `tests/youth-engine.test.mjs` | Extend: reveal-gap renders given a guess+actual; timelapse reads amount key with fallback; reduced-motion path produces final state without animation | Engine has a test suite (currently 9/9); keep it green and cover new units. |

**Interfaces stay clean:** the page only adds declarative markup; all behavior lives in the engine and is independently testable. `YouthTimelapse` depends only on `YouthLoop.Store` (to read the saved amount) and `YouthLoop.money`/`num` helpers — no new coupling.

## Accessibility (hard floors)

- **`prefers-reduced-motion: reduce`** → no count-ups, no sliding, no racing. Final states render instantly with the same text captions. (Both treatments specify the reduced-motion branch.)
- **Meaning never conveyed by motion or color alone** — every animated state has a text caption stating the same fact.
- **Haptics are progressive enhancement** — `navigator.vibrate` guarded; absent on iOS Safari, which is fine (never load-bearing).
- WCAG AA contrast preserved (reuse existing tokens: orange `#FF7A00`, yellow `#FFD400`, muted `#9ca3af` on `#0a0b0d`/`#101010`).

## Analytics (first-party, guarded — matches shipped pattern)

- Reuse existing `yf_predict_revealed` (already fires); add `close` magnitude already present.
- New: `yf_timelapse_played` `{ choice: 'cash'|'bank', week: 3 }` via the engine's existing `track()` no-op-guarded helper. `analytics.js` is already linked on week-03 (shipped last session), so events fire.

## Testing & verification

1. **Unit:** extend `tests/youth-engine.test.mjs`; run `node --test tests/youth-engine.test.mjs` — all green.
2. **In-browser (preview):** run the full loop; confirm reveal gap renders, both timelapse choices animate→freeze with correct buying-power numbers from the learner's own goal, no console errors.
3. **Reduced-motion:** emulate `prefers-reduced-motion: reduce`; confirm final states + captions appear with no animation.
4. **Mobile width:** confirm layout holds at ~390px.

## Validation gate (process)

The page's *look and interaction* changed materially, so the teen/educator checklist (from this session) **re-runs on the upgraded Week 3 before any T2–T5 work**. Pass criteria unchanged. This is still flagship-validation-before-replication.

## Rollout

- Single commit (engine + page + tests), pushed to `main` (Vercel auto-deploy). Verify live `200` + console-clean.
- `_engine-playground.html` stays local/uncommitted (owner-confirmed).

## Risks

- **Shared-engine edit** could in theory affect other consumers — but week-03 is the only page loading the engine today, so blast radius is one page. Tests guard regressions.
- **Busier Step 2** — mitigated by sequencing (race then freeze, not simultaneous) and reduced-motion fallback.
