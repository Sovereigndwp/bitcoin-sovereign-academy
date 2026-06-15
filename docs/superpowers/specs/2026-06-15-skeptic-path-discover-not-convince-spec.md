# Skeptic Path Rebuild — "Discover, not convince"

**Status:** DRAFT — awaiting Dalia's sign-off before any code.
**Date:** 2026-06-15
**Decided:** Paths audit (2026-06-15). Skeptic = rebuild, do NOT retire. See memory `project_skeptic_path_discover_not_convince` + `project_paths_audit_decisions_2026_06_15`.
**Author:** Claude (from Dalia's directive)

---

## 1. Why

The current Skeptic path is **convince-mode** and **incomplete**:
- Only 2 stages (`index` + `stage-1` "Debunking the Myths" + `stage-2` "Bitcoin's MVP"); other paths run 4–5 stages.
- Heavy courtroom/sales language: 89× "myth", 31× "rebuttal", plus "debunk", "preach", "Challenge My Beliefs", "Still Not Convinced?", "data-driven rebuttals". This directly violates the locked **inform-not-convince** voice spec.

This rebuild turns it into one of the strongest assets on the site by meeting intelligent doubt with **better questions, not sales language**.

## 2. Positioning — "Discover, not convince"

Sharper than "inform, not convince." The goal is **not** to rebut skeptics, debunk myths, or prove Bitcoin right. The goal is to guide a thoughtful skeptic through the money questions most people never slow down to ask. The learner should reach their **own** aha moments — *"I realized I never really understood how money works"* — never feel pushed to a conclusion. Calm, neutral, intellectually honest. The learner stays in control throughout.

## 3. Goals / Non-goals

**Goals**
- Reframe from debunking → first-principles discovery of money.
- Expand to match other paths' depth (build Stage 3 + 4 minimum, Stage 5 preferred).
- Respect the objection; help the learner notice what they hadn't noticed.
- Interactive where it deepens understanding.

**Non-goals**
- Not a persuasion funnel. No "Bitcoin fixes this," no triumphant rebuttals, no scoreboard of debunked myths.
- Not a gamified course (unbounded mode — no badges/points/quizzes/completion %/step-locking; consistent with PR #110).
- Not political/conspiratorial when discussing government money and debt.

## 4. Voice & terminology

Remove / heavily reduce: **myth, rebuttal, debunk, preach, convince, "data-driven rebuttals,"** and any courtroom-argument tone.

Replace with the discovery vocabulary:
- examine the claim · follow the incentive · test the assumption · compare the tradeoffs · look at the evidence · ask what has to be true · decide what you think

Specific swaps:
| From | To |
|---|---|
| "myths" | "questions" or "claims" |
| "rebuttals" | "investigations" |
| "debunk" | "examine" |
| "Bitcoin fixes this" | "Bitcoin proposes a different tradeoff" |
| "Challenge My Beliefs" / "Still Not Convinced?" | (replace per stage — see IA) |

## 5. Information architecture (5 stages)

### Stage 1 — Start With the Objection
Begin where skeptics are; respect the objection, don't correct it. Tone: the learner feels **seen, not attacked**.
Questions: *Isn't Bitcoin just speculation? · Why would digital money have value? · Isn't government money safer because it's backed by the state? · If Bitcoin is so good, why is it so volatile? · Why would anyone need Bitcoin if banks already work? · Isn't this just another tech bubble? · Can't governments simply ban it?*

### Stage 2 — Step Back and Ask What Money Is
Slow the conversation down; examine money itself before Bitcoin.
Questions: *What makes something money? · Is money valuable because the government says so, or because people accept it? · Why did people use shells, salt, cattle, gold, paper, bank deposits, now digital balances? · What problems does money solve? · What makes money fail? · Difference between price, value, and purchasing power? · If money is a measuring tool, what happens when the tool keeps changing?*
**Aha:** Most people argue about Bitcoin before asking what money is — like arguing over a map before asking what the map measures.

### Stage 3 — Follow the Promise *(NEW)*
Government money, debt, promises — **not** political/conspiratorial.
Questions: *What does it mean when a government promises pensions, benefits, bailouts, subsidies, guarantees, stimulus? · Where does the money come from when promises exceed tax revenue? · What happens when a country borrows to pay for past borrowing? · Who benefits first when new money enters? · Who pays later (higher prices, weaker savings, fewer options)? · Can a government keep every promise without changing the value of the money? · What happens to trust when the promise looks larger than the system can honor?*
**Aha:** A promise isn't magic — it's paid through taxes, debt, inflation, default, or repression.

### Stage 4 — Compare the Tradeoffs *(NEW)*
Introduce Bitcoin **only after** the problem is explored.
Questions: *What would money look like if no one could print more? · What's better / what's harder? · Why does a fixed supply matter? · self-custody? · decentralization? · verification? · Why prefer money governed by rules instead of discretion? · What risks does Bitcoin still have? · What questions remain fair to ask?*
**Aha:** Bitcoin is interesting not because it's digital (most money already is) but because it changes **who can create, freeze, dilute, censor, or verify** money.

### Stage 5 — You Decide *(NEW, preferred)*
End with reflection, **not a pitch**.
Prompts: *Which assumption changed for you? · Which objection still feels strong? · What would you need to understand better before trusting Bitcoin? · Where do you place your trust now — government, banks, markets, code, yourself, a mix? · What's the cost of trusting each? · What's the cost of not asking?*
**Closing tone:** *"You don't need to agree with Bitcoin today. But you should understand the system you're already trusting."*

## 6. Old → new mapping

| Current | Action |
|---|---|
| `index.html` ("The Skeptic Path", "Challenge Accepted", stage-locking, "Still Not Convinced?") | Rewrite: new title + discovery framing; remove stage-locking + convince CTAs; list 5 stages. |
| `stage-1/` "Debunking the Myths" / "Select Your Concerns" | Reframe → **Stage 1: Start With the Objection**. Keep the "pick your objection" interaction; drop debunk framing. |
| `stage-2/` "Bitcoin's MVP" | Reframe + relocate content → feeds **Stage 4: Compare the Tradeoffs** (Bitcoin introduced after the problem). |
| — | Build **Stage 2 (What Money Is)**, **Stage 3 (Follow the Promise)**, **Stage 5 (You Decide)** new. |

## 7. Interactivity

Make it interactive where it deepens learning (not as gamification): sliders, simple balance-sheet examples, **promise calculators**, **inflation / purchasing-power comparisons**, **custody-tradeoff cards**, reflection checkpoints. Reuse existing site primitives (reflect-widget with `data-path="skeptic"` + per-stage `data-topic`; calculators in the style of existing demos). Keep the learner in control — help them notice, don't tell them what to think.

## 8. Naming

Options (Dalia's): The Skeptic's Discovery Path · Question Money First · The Money Questions Most People Skip · Before You Dismiss Bitcoin · A Skeptic's Guide to Money.
**Recommendation: "Question Money First"** — action-oriented, captures "discover, not convince," reads well as a path label, and signals the Stage-2 pivot (money before Bitcoin). *Decision needed (see §11).*

## 9. Constraints (locked)

- **Unbounded mode**: no badges/points/quizzes/completion %/step-locking (mirror the PR #110 pattern; open learning map).
- **No green, no purple** (`project_homepage_canonical_design_language`). Neutral surfaces, orange accent sparingly.
- **Footer** on every page: `Created by Dalia · bitcoinsovereign.academy`.
- **Absolute CSS paths** (`/css/...`).
- `data-path="skeptic"` on reflect-widgets; per-stage `data-topic`.
- One `<main>` landmark per page (avoid the S8 double-`<main>` bug).
- Inform-not-convince throughout; reach learners' own conclusions.

## 10. Build plan (after sign-off)

Parallelizable as a workflow — one agent per stage (5 stages are independent once the spec + shared scaffolding/voice are fixed), plus an index rewrite + a consistency pass. Runs as its own track without blocking the audit (touches only `paths/skeptic/*`). Sequence: lock shared scaffolding (nav, theme, reflect-widget wiring) → fan out per-stage builds → index rewrite → cross-stage voice/consistency + in-browser verification → single PR (or stage-grouped PRs).

## 11. Open questions for sign-off

1. **Title** — go with "Question Money First", or pick another from §8?
2. **Stage count** — build all 5 (incl. Stage 5 "You Decide"), or 4 now + Stage 5 as a fast follow?
3. **Existing Stage-2 "Bitcoin's MVP" content** — reframe-and-absorb into new Stage 4, or rebuild Stage 4 fresh and retire the old content?
4. **Interactive depth** — how many custom interactive tools for v1 (e.g. a promise/inflation calculator per stage), vs. start with reflection prompts + reuse existing demos and add calculators later?
5. **Spanish** — EN only for v1 (consistent with the scoped bilingual claim), correct?
