# Week 6 — Replace survey facts with a personal predict→measure loop

**Date:** 2026-06-08
**Page:** `youth-families/week-06/index.html`
**Status:** Proposed — awaiting sign-off before code
**Origin:** First-principles learning review (this session). Cheap text fixes already shipped (`63affbbf`). This spec covers the three changes that require JS work.

## Problem

The page opens by *telling* the learner a survey number ($5,400/yr — 2018, US, single commissioned poll) when its own tools could make the learner **discover their own number**. The subscription audit hardcodes six US streaming prices that go stale within months. The lifestyle sim hardcodes an unrealistic $2,000/mo starting income. Prefer learner-generated insight over survey-generated insight.

## Scope (three changes)

### ① Predict→measure hook (intro box)
Replace the hedged "$5,400" "Did You Know?" box with a **prediction** the page later resolves:
- Box becomes: *"Before you start — guess: how much do you spend in a month on impulse buys + subscriptions? Lock in your number."* + one number input + "Lock it in" button.
- Store the guess in JS state (and optionally `localStorage` key `yf-w6-guess`).
- The subscription audit (②) computes the learner's **real** monthly total. When both exist, show a reveal line: *"You guessed $X/mo. Your subscriptions alone are $Y/mo."*
- **No survey number anywhere.** The surprise is the learner's own prediction error.

### ⑤ Bring-your-own subscription audit (highest-leverage)
Convert the fixed six-row list into the same add-your-own pattern the 24-hour tracker already uses:
- Remove the six hardcoded rows ($10.99 / $15.49 / $14.99 / $2.99 / $9.99 / $12.99).
- Inputs: name + monthly cost + "Add subscription" button → renders a row with the Review→Keep→Cancel verdict cycle (reuse existing `cycleVerdict` logic).
- One greyed **example** row ("e.g. Music streaming — $10.99"), clearly labeled "example — replace with yours," excluded from totals until edited/replaced.
- Totals recompute from learner rows: monthly, ×12 annual, and "you'd cancel $N/yr." Feeds the ① reveal.
- Result: never stale, geography-neutral, personally relevant, jaw-drop number is *theirs*.

### ⑥ Lifestyle sim — own income + ratio takeaway
- Make starting income an input (default kept reasonable for the audience, e.g. a teen-plausible figure or "set your own / expected income").
- Add a generated takeaway sentence from the learner's slider settings, framed as a **ratio** so the absolute start matters less: *"At 80% lifestyle inflation, every $100 raise leaves you only $20 ahead."*

## Out of scope
- The "0/6 traps found" counter + `markWeekCompleted()` completion mechanic (sits at odds with unbounded mode — flagged separately).
- Trap-card predict-before-reveal upgrade (nice-to-have, not blocking).

## Acceptance
- No externally-sourced/datable statistic remains on the page.
- Subscription audit and intro both run on **learner-entered** data; empty state is graceful.
- Existing patterns reused (24-hour tracker render loop, `cycleVerdict`); no new design tokens.
- Verified in browser: add/edit/cancel rows, totals update, ①↔⑤ reveal fires, sim takeaway updates live, mobile layout intact, contrast AA.

## Verification plan
preview snapshot of empty + populated states; add two subscriptions, cancel one, confirm totals + reveal; drag both sliders, confirm takeaway sentence; `preview_resize` mobile; `preview_inspect` contrast on the reveal/takeaway text.
