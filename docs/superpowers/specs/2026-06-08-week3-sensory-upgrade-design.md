# Week 3 Upgrade — Ownership First, Motion Second

_Date: 2026-06-08 · Status: revised after educational review, pre-implementation · Page: `youth-families/week-03/index.html` · Engine: `js/youth-engine.js` + `css/youth-engine.css`_

## North star (read this first)

**Optimize for personal ownership, not visual engagement.** Motion makes a moment prettier; *caring* comes from "my goal, my money, my decision, my mistake, my plan." The audit found learner-generated **artifacts (1.50)** are the platform's weakest, most differentiated dimension — so the priority order is:

> **Decision & artifact > reflection > animation > haptics.**

**Rule when trading off effort:** if the choice is between another animation and another learner-generated artifact, **build the artifact.**

## Problem

Week 3 (the validated flagship) teaches the loop but feedback is "a bit boring." The first-draft fix leaned on motion. The deeper fix: the two highest-payload beats (the prediction *gap* and the savings *consequence*) are currently passive — read, or watched. Make them **chosen** and **owned**.

## Goals (in priority order)

1. **Agency:** the consequence beat is a *decision the learner makes that changes the outcome*, not an animation they watch.
2. **Durable mental model over statistic:** teach *purchasing-power erosion as a concept* via a learner-controlled low/med/high future — never "inflation is 3%."
3. **Metacognition:** the learner reflects on *their own judgment* (the prediction-about-the-prediction).
4. **A 6-month memory artifact** captured in Week 3 and *designed to resurface in Week 10*.
5. **Motion in service of the above** — the reveal-gap and race→melt visuals stay, but subordinate to the learner's own numbers and choices.

## Non-goals (YAGNI)

- No audio (cut — reads cheap, adds no understanding).
- No badges / streaks / % / completion (unbounded mode — locked).
- No Bitcoin/asset introduction in Week 3; **no return/yield claims** of any kind.
- No replication to other weeks here (T2–T5 stay gated on re-validation). **Exception:** the Week-10 surfacing hook for the memory artifact is *designed* now (see §"Week 10 dependency") so T2 can consume it without a retrofit.
- No new libraries or asset files; pure CSS/JS, dependency-free.
- No polish budget on haptics.

## The beats (revised)

### Beat 1 — Predict → Reveal → Judge yourself

The existing goal builder + prediction stays (their goal, their money, their guess). On reveal:
- The real number counts up; guess vs. real shown on a slim track with the gap shaded and named in words ("8 weeks longer than you thought"). Reduced-motion → final state + caption, instantly.
- **New — metacognition step:** immediately after reveal, ask *"Was your guess too optimistic, about right, or too pessimistic?"* (three buttons). The engine already computes closeness; this asks the learner to **own the judgment** rather than be told. The choice is **stored** (`yf-w3-judgment`) and folded into the savings-goal artifact.

### Beat 2 — Decide what to do (agency) + explore the future (concept)

Replaces the passive "where do you park $1,000" with a real decision over the learner's **own** goal amount (fallback $1,000):

**Decision (changes the outcome):**
- **Keep it as cash** (drawer)
- **Savings account** (small interest)
- **Spend it now** (it's gone — and so is the goal)
- **Put it toward a skill or tool that earns** (concrete, claim-free: "a tool that helps you earn" / "a skill worth more later" — no markets, no guaranteed numbers)

**Future control (teaches the concept, not the number):**
- A **low / medium / high** "how much do prices rise?" control. Framing: *"Nobody knows next year's number. Try a calm decade, a normal one, and a rough one."* The takeaway is the **direction and the idea of erosion**, not a fixed %.

**Outcome:** the race time-lapse + melt freeze play out *for the chosen decision under the chosen future*, ending in plain-words purchasing power ("same dollars · now buys ~$X of what it used to"). The "spend it now" path is its own honest outcome (goal gone, nothing eroded because nothing saved — a different lesson).

### Beat 2b — Make it personal (what changes tomorrow)

After the outcome, one decision the learner actually makes:
> *"Wait the full N weeks for this goal — or change the goal?"*

Either choice **updates their savings-goal artifact** (keep target / set a new one). The simulation becomes a personal commitment, not a demo.

### Beat 3 — Keep (enriched artifact)

The existing `yf-w3-goal` artifact now carries: goal, cost, weekly save, weeks-to-goal, **their self-judgment**, **their decision**, and **their wait-or-change choice**. Printable keepsake, unchanged mechanics.

### Beat 4 — 6-month memory (new artifact, the big add)

Before the week ends:
> *"Imagine you come back in six months. What is the one thing you hope you'll remember from today?"*

A short free-text input, stored as `yf-w3-remember`. Designed to be **surfaced in Week 10** ("Six months ago you wrote…"). This is the strongest, most differentiated moment in the week and the spec's top priority after the decision beat.

### Beat 5 — Share (unchanged)

Existing family prompt stays.

## Architecture & file boundaries

| Unit | Change | Why here |
|---|---|---|
| `js/youth-engine.js` | (a) reveal() renders the gap viz; (b) new `yf-judgment` micro-primitive (3-choice self-assessment, stored); (c) new `YouthTimelapse` primitive: decision buttons + low/med/high control + race→melt, reads learner amount; (d) extend `YouthArtifact` to merge judgment/decision fields; (e) new `yf-memory` free-text artifact primitive | Engine is the single source of loop behavior; only consumer today is week-03, so safe to extend and reuse for T5. |
| `css/youth-engine.css` | Styles for gap viz, judgment buttons, timelapse decision/future controls, memory input | Shared engine stylesheet. |
| `youth-families/week-03/index.html` | Replace Step-2 text scenario with `.yf-timelapse`; add `.yf-judgment` after reveal; add Beat-2b decision; add `.yf-memory` before share | Page stays declarative — no page-local animation JS. |
| `tests/youth-engine.test.mjs` | Cover: gap render; judgment stores; timelapse reads amount + applies low/med/high; memory artifact persists; reduced-motion produces final state | Keep suite green (currently 9/9). |

**Clean interfaces:** the page only adds declarative markup; behavior + storage live in the engine and are independently testable. New primitives depend only on `YouthLoop.Store` and the money/num helpers.

## Week 10 dependency (design-for, don't retrofit)

The `yf-w3-remember` and enriched `yf-w3-goal` artifacts use the existing `yf-w<N>-<slug>` localStorage convention so the Week-10 `.yf-plan` aggregator (T2) can collect them unmodified. T2 will add the "six months ago you wrote…" surfacing. **No T2 code in this work** — only the stable key + shape so T2 is a clean read.

## Accessibility (hard floors)

- `prefers-reduced-motion: reduce` → no count-ups/slides/race; final states + identical text captions render instantly.
- Meaning never by motion/color alone — every state has a text caption.
- Free-text memory input: labeled, keyboard-accessible, sanitized before any DOM echo (`escHtml`).
- Haptics: `navigator.vibrate` guarded, progressive-enhancement only, never load-bearing.
- WCAG AA contrast preserved (existing tokens).

## Analytics (first-party, guarded; `analytics.js` already linked on week-03)

- Existing `yf_predict_revealed` retained.
- New: `yf_judgment` `{ value }`, `yf_timelapse_played` `{ decision, future }`, `yf_goal_committed` `{ kept|changed }`, `yf_memory_saved`.
- All via the engine's no-op-guarded `track()`.

## Testing & verification

1. **Unit:** `node --test tests/youth-engine.test.mjs` — all green incl. new units.
2. **In-browser (preview):** full loop; reveal gap renders; judgment stores; each decision × each future produces a coherent outcome from the learner's own amount; "spend now" path is honest; memory text persists and re-reads; enriched artifact prints; no console errors.
3. **Reduced-motion:** emulate; final states + captions, no animation.
4. **Mobile ~390px** layout holds.

## Validation gate (process)

The week's interaction model changed materially, so the teen/educator checklist **re-runs on the upgraded Week 3 before any T2–T5 work.** Add one observation: *did the learner make real choices (decision, future, wait-or-change) and write a memory they'd actually want to see again?* This is still flagship-validation-before-replication.

## Rollout

Single commit (engine + page + tests) → `main` (Vercel auto-deploy) → verify live `200` + console-clean. `_engine-playground.html` stays local/uncommitted.

## Risks

- **Shared-engine edit** — blast radius is one page (week-03 is the only engine consumer today); tests guard regressions.
- **More on-screen** — mitigated by sequencing (decide → future → play → commit, one at a time) and reduced-motion fallback.
- **Scope creep toward the animation** — guard with the north-star rule: artifact/reflection before polish.
