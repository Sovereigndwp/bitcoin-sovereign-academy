# Phase 4 — Pedagogy & Youth-Readiness Audit — Design

**Date:** 2026-06-06
**Status:** Design under review
**Relationship to Phase 3:** Deliberately separate. Phase 3 audits *accuracy* (objective, source-verifiable, auto-fixable). Phase 4 audits *educational effectiveness + youth-readiness* (subjective, comparative, judgment-based, never auto-fixed). Running them together would dilute both.

---

## Goal

Answer a strategic question, not just a quality one: **does BSA have a realistic chance of becoming the platform that schools, parents, and students actually adopt?** Score the youth acquisition funnel against BSA's own engagement model and surface a prioritized "redesign for youth" shortlist.

## Why this audience

Most Bitcoin education targets adults / investors / engineers. Under-served: **ages 11–18, homeschool families, private schools, economics teachers, STEM clubs** — groups that are often more open-minded and have more time. This is on-identity: BSA's locked identity is *"Bitcoin custody and inheritance for families and advisors,"* and the platform already ships a `/youth-families/` track (weeks 01–10 + an educator guide) plus free intro modules — so this is sharpening an existing track, not a pivot.

---

## Scope — the youth acquisition funnel (~27 pages)

- **`/youth-families/`** — 12 pages: index, `educator/`, weeks 01–10.
- **Free intro modules** — 7: `stage-1/module-1.html` for builder, curious, curious/es, hurried, pragmatist, principled, sovereign.
- **Path entry pages** — 8: each path's landing `index.html` (first touchpoint for a parent/teacher).

**Out of scope:** premium stage-2+ content (Phase 3's set), demos, deep-dives. Rationale: the funnel — what a prospective school/parent/student first encounters for free — determines adoption. Premium effectiveness is a later, separate question.

---

## Rubric — BSA's own engagement model

Each page scored **1–5 per criterion**, each with a concrete *behavioral* test (not a subjective vibe):

| Criterion | Behavioral test (what earns a high score) |
|---|---|
| **Discovery** | The key idea is *derived by the learner*, not stated upfront then explained. |
| **Curiosity** | Opens a genuine question/tension *before* resolving it. |
| **Interactivity** | Requires an active decision/manipulation; not read-only. |
| **Real-artifact output** | Learner produces something real (a plan, a decision, a simulated tx), per unbounded-mode. |
| **Socratic reflection** | The reflect-widget is present *and* prompts reasoning, not recall. |
| **Progression / scaffolding** | Each step builds on the last at an appropriate cognitive load. |
| **Intrinsic motivation** | Relevance tied to the learner's real life, not extrinsic rewards. |
| **Age-fit** | Reading level + concept load + example relatability — scored **per band: 12–14 / 15–17 / adult**. |

**Comparators as reference bars (not score sources):** Brilliant and Khan Academy for the Discovery, Progression, and rigor criteria — "would this clear the bar Brilliant sets for active derivation?"

**Gamification line (locked decision):** We do **not** import Duolingo/Minecraft-style badge, streak, point, or completion-percentage mechanics. They conflict with the canonical voice spec (§11, unbounded mode: "actual artifacts… not points, badges, or completion percentages"). Motivation is scored on *intrinsic relevance + real artifacts*, not extrinsic reward loops.

---

## Deliverable

**`reports/pedagogy-youth-audit-2026-06-06.md`:**
- Per-page scorecard (8 criteria × 1–5, plus the three age-band readiness flags).
- Headline: average scores by criterion and by content-type; weakest criteria platform-wide.
- **Age-band readiness matrix** — for each page: "Could a bright 12-year-old understand this independently? A 15-year-old complete it solo? Would a 17-year-old be prepared for university-level econ/CS?"
- **Prioritized "redesign for youth" shortlist** — highest-leverage pages to rework, with the specific criterion each fails.

**No auto-fixes.** Every recommendation here is editorial judgment for Dalia's review. (This is the key difference from Phase 3.)

---

## Execution

Multi-agent workflow, same shape as Phase 3 but single-stage (no auto-fix → no adversarial-verify-before-edit needed):
- One scorer agent per page → structured scorecard (8 criteria + 3 age bands + rationale per score).
- A synthesis pass computes headline averages, the age-band matrix, and the redesign shortlist.
- Optionally, a second "calibration" agent re-scores a random 15% sample to check scorer consistency (flag criteria where variance is high → rubric needs tightening).

## Success criteria

- All ~27 funnel pages scored across all 8 criteria + 3 age bands, each score justified by the behavioral test.
- Report includes the age-band readiness matrix and a prioritized redesign shortlist.
- No badge/streak/point criteria used (gamification line held).
- Output is recommendations only — no content edited.

## Open questions / deferred

- Whether to extend to premium content (Phase 4b) after the funnel pass.
- Whether any 12–14 findings justify revisiting unbounded-mode for the youngest band (a locked-spec change — Dalia's call, explicitly deferred).
- Defining the exact 1–5 anchor descriptions per criterion before the workflow runs (calibration aid).
