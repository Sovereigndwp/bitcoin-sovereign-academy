# Phase 4 — Pedagogy, Youth-Readiness & Effectiveness Audit — Design

**Date:** 2026-06-06
**Status:** Design under review (rev 2 — incorporates retention/narrative/simulation/teacher/family/sovereignty criteria, benchmark matrix, gamification reframe, capability-gain lens)
**Relationship to Phase 3:** Deliberately separate. Phase 3 audits *accuracy* (objective, source-verifiable, auto-fixable). Phase 4 audits *educational effectiveness + youth-readiness* (subjective, comparative, judgment-based, never auto-fixed).

---

## Goal

**Can BSA become the most effective Bitcoin learning platform for students, families, educators, and self-directed learners — while preserving its sovereignty-first philosophy?**

Schools are only one channel, and probably not the largest. The bigger near-term opportunities are likely **homeschool families, private enrichment, after-school clubs, scouting groups, youth-entrepreneurship programs, and parents teaching their own kids.** These groups are more open-minded and have more time than the public-school procurement pipeline. The audit scores the youth funnel against BSA's own engagement model and surfaces a prioritized "redesign for adoption" shortlist.

On-identity: BSA's locked identity is *"Bitcoin custody and inheritance for families and advisors,"* and the platform already ships a `/youth-families/` track + free intro modules — so this sharpens an existing track, not a pivot.

---

## Scope — the youth acquisition funnel (~27 pages)

- **`/youth-families/`** — 12 pages: index, `educator/`, weeks 01–10.
- **Free intro modules** — 7: `stage-1/module-1.html` for builder, curious, curious/es, hurried, pragmatist, principled, sovereign.
- **Path entry pages** — 8: each path's landing `index.html`.

**Out of scope:** premium stage-2+ content (Phase 3's set), demos, deep-dives — deferred to a possible Phase 4b. The free funnel determines adoption; score it first.

---

## Rubric — BSA's own engagement model

Each page scored **1–5 per criterion**, each with a concrete *behavioral* test. Criteria are grouped; a few are **conditional** (scored where the page type makes them applicable, else marked N/A) so we don't penalize an entry page for not being a simulation.

### A. Learning design (cognitive)
| # | Criterion | Behavioral test |
|---|---|---|
| 1 | **Discovery** | Key idea is *derived by the learner*, not stated then explained. |
| 2 | **Curiosity** | Opens a genuine question/tension *before* resolving it. |
| 3 | **Progression / scaffolding** | Each step builds on the last at the right cognitive load. |
| 4 | **Retention** | Would a learner likely remember the core lesson **30 days later without rereading**? What mental model survives? |
| 5 | **Capability gain** | After this lesson, the learner can *do* something they couldn't before (not just *explain* it). |

### B. Engagement / experience
| # | Criterion | Behavioral test |
|---|---|---|
| 6 | **Interactivity** | Requires *any* active decision/manipulation; not read-only. *(low bar)* |
| 7 | **Simulation depth** | Learner *experiences consequences* of decisions, not just reads about them. e.g. "survive 5 years as the currency loses value" vs "inflation reduces purchasing power." *(high bar — potential moat)* |
| 8 | **Narrative** | A person, conflict, decision, tradeoff, or consequence carries the lesson — not documentation. (A family escaping inflation > a definition of inflation.) |
| 9 | **Intrinsic motivation** | Relevance tied to the learner's real life, not extrinsic reward loops. |

### C. BSA-specific (the moat)
| # | Criterion | Behavioral test |
|---|---|---|
| 10 | **Real-artifact output** | Learner walks away with a real output they keep/use (a plan, a secured wallet, a recovery exercise). |
| 11 | **Sovereignty alignment** | Reinforces personal responsibility, verification, resilience, and ownership — *not passive trust*. (The most BSA-specific criterion.) |
| 12 | **Family conversation catalyst** | Naturally generates parent–child discussion. Unique to a custody/inheritance/continuity brand. *(conditional)* |
| 13 | **Socratic reflection** | The reflect-widget is present *and* prompts reasoning, not recall. |

### D. Audience fit
| # | Criterion | Behavioral test |
|---|---|---|
| 14 | **Age-fit** | Reading level + concept load + example relatability — scored **per band: 12–14 / 15–17 / adult**. |
| 15 | **Educator usability** | Could a teacher/club leader facilitate this with *minimal Bitcoin knowledge*? *(conditional — primary for `/youth-families/educator/` + facilitation pages)* |

**Non-overlap note:** #6 Interactivity (any active input) ⊂ #7 Simulation depth (consequence-bearing decisions) and #10 Real-artifact (durable output) are deliberately distinct — a page can be interactive without simulating consequences or producing an artifact.

**The one question behind all of it (synthesis lens):** *"After completing this lesson, what can the learner now do that they could not do before?"* A student who can *explain* inflation is different from one who can build a budget, secure a wallet, evaluate custody options, or discuss inheritance with a parent. The latter is lasting value, and it's the truest test of unbounded mode.

---

## Benchmark matrix

Reference bars per dimension — what each platform does best, and the question: **what can be borrowed without compromising the sovereignty-first philosophy?**

| Platform | What they do better |
|---|---|
| Brilliant | Discovery learning |
| Khan Academy | Scaffolding |
| Duolingo | Habit formation |
| Minecraft Education | Systems thinking |
| Code.org | Beginner onboarding |
| Mi Primer Bitcoin | Bitcoin simplicity *(Dalia authored this curriculum)* |
| **BSA** | **Sovereignty, custody, continuity** |

The report names, per weak criterion, which platform's approach to borrow and how to adapt it without importing reward-loop mechanics.

---

## Engagement-mechanics principle (reframed)

**BSA does not optimize for addictive reward loops.** Progress indicators are permitted *when they reflect genuine learning progress or a completed real artifact* — not artificial engagement metrics.

- **Permitted** (reflect real accomplishment): "Inheritance Plan Completed," "Node Connected," "Recovery Exercise Finished."
- **Rejected** (artificial): 97-day streaks, 400 XP, badge tiers.

The distinction is not "gamification yes/no" — it's *whether the reward reflects a real accomplishment.* **Caveat against voice-spec §11:** §11 specifically bans *completion percentages*; artifact-completion markers ("Plan Completed") are consistent with §11's "actual artifacts," but we must not reintroduce percentage/streak progress bars. The audit scores motivation on intrinsic relevance + real artifacts, and flags any reward mechanic for which of the two buckets it falls in.

---

## Deliverable

**`reports/pedagogy-youth-audit-2026-06-06.md`:**
- Per-page scorecard (15 criteria × 1–5 with N/A where conditional; the three age-band flags; a one-line rationale per score).
- For every page, the capability-gain answer: *"after this, the learner can now ___."*
- Headline: average scores by criterion, weakest criteria platform-wide, strongest exemplars to use as the quality bar.
- **Age-band readiness matrix** — per page: bright 12-year-old solo? 15-year-old solo? 17-year-old prepared for university econ/CS?
- **Prioritized "redesign for adoption" shortlist** — highest-leverage pages, the specific criterion each fails, and the benchmark approach to borrow.

**No auto-fixes.** Every recommendation is editorial judgment for Dalia. (Key difference from Phase 3.)

---

## Execution

Multi-agent workflow, single scoring stage + synthesis (no auto-fix → no adversarial-verify-before-edit needed):
- One scorer agent per page → structured scorecard (15 criteria + 3 age bands + capability-gain sentence + rationale).
- **Calibration pass:** a second agent re-scores a random ~15% sample; criteria with high inter-rater variance get flagged → rubric anchors tightened before trusting the numbers.
- Synthesis pass: headline averages, age-band matrix, redesign shortlist, benchmark-borrow recommendations.
- Before running: define **1–5 anchor descriptions per criterion** (what a 1 vs a 5 looks like) so scoring is consistent.

## Success criteria

- All ~27 funnel pages scored across all applicable criteria + 3 age bands, each score justified by its behavioral test.
- Every page answers: **"after completing this, what can the learner now do that they couldn't before?"**
- Report includes the age-band readiness matrix, the redesign shortlist, and per-criterion benchmark-borrow notes.
- Engagement-mechanics principle honored (real-accomplishment markers OK; streaks/XP/% out).
- Output is recommendations only — no content edited.

## Open questions / deferred

- Phase 4b: extend scoring to premium content after the funnel pass.
- Whether any 12–14 findings justify revisiting unbounded-mode for the youngest band (a locked-spec change — Dalia's call).
- Final 1–5 anchor descriptions per criterion (defined at plan stage, calibrated in the workflow).
