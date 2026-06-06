# Phase 4 — Pedagogy, Youth-Readiness & Effectiveness Audit — Implementation Plan

> **For agentic workers:** This is a multi-agent *audit* workflow, not a code feature — there is no TDD cycle. The deliverable is a scorecard report (no content edits). Steps are checkboxed for tracking.

**Goal:** Score the ~27-page youth acquisition funnel against BSA's 15-criterion engagement model (3 age bands), with a calibration pass, and produce a scorecard + age-band readiness matrix + prioritized "redesign for adoption" shortlist.

**Architecture:** Background `Workflow` — one scorer agent per page → structured scorecard; a calibration agent re-scores a ~15% sample to surface high-variance criteria; main session synthesizes the report. No auto-fixes.

**Spec:** `docs/superpowers/specs/2026-06-06-phase-4-pedagogy-youth-readiness-audit-design.md`

---

## Scoring anchors (1–5) — the calibration backbone

Every scorer agent receives these. "1" and "5" are defined; 2–4 interpolate. Score **N/A** for conditional criteria (12, 15) when the page type makes them inapplicable.

| # | Criterion | Score 1 (weak) | Score 5 (strong) |
|---|---|---|---|
| 1 | Discovery | Idea stated as fact, no derivation | Learner derives the idea through guided steps before it's named |
| 2 | Curiosity | Answers questions never asked | Opens a vivid tension/puzzle the learner wants resolved, *then* resolves it |
| 3 | Progression | Jumps in difficulty; assumes unstated prior knowledge | Each step builds on the last; load rises smoothly; prerequisites met in-page |
| 4 | Retention | Dense facts, nothing memorable; gone in days | One sticky mental model/analogy a learner recalls at 30 days unprompted |
| 5 | Capability gain | Learner can only restate information | Learner can perform a concrete new action (build a budget, secure a wallet, evaluate custody) |
| 6 | Interactivity | Pure read | Multiple meaningful active decisions/inputs required to progress |
| 7 | Simulation depth | Consequences described in prose | Learner makes decisions and experiences their consequences over a simulated arc |
| 8 | Narrative | Documentation/definitions only | A character faces a conflict/decision whose stakes carry the concept |
| 9 | Intrinsic motivation | Relevance abstract/unclear | Ties directly to the learner's real life and agency |
| 10 | Real-artifact output | Nothing produced | Learner ends with a durable, usable artifact (plan, secured wallet, recovery-drill result) |
| 11 | Sovereignty alignment | Frames Bitcoin as passive investment / trust in third parties | Reinforces self-verification, ownership, responsibility, resilience |
| 12 | Family conversation catalyst *(cond.)* | No discussion hook | Explicitly prompts a parent–child conversation/activity about money, values, or inheritance |
| 13 | Socratic reflection | No reflection, or recall-only prompts | Reflect-widget present with prompts requiring reasoning/justification |
| 14 | Age-fit *(per band 12–14 / 15–17 / adult)* | Mismatched (too advanced or too childish) for the band | Reading level, concept load, and examples all land for that band |
| 15 | Educator usability *(cond.)* | Requires deep Bitcoin expertise to teach | A non-expert teacher/club leader could facilitate with the provided guidance |

**Capability-gain sentence (required per page):** "After this, the learner can now ___." If the honest answer is "restate a definition," that's a capability-gain score of 1–2.

---

## File structure

- **Create (by the workflow run):** `reports/pedagogy-youth-audit-2026-06-06.md` — the synthesized report (written by the main session after the workflow returns).
- **Persisted automatically:** the workflow script under the session `workflows/scripts/` dir (returned by the Workflow tool).
- **No source files are modified.** This is an audit.

---

## Task 1: Freeze the page list

**Files:** none (data assembled into the workflow script).

- [ ] **Step 1: Enumerate the 27 funnel pages** (absolute paths), three groups:

```bash
cd /Users/dalia/projects/bitcoin-sovereign-academy
{ find youth-families -name "*.html";
  find paths -type f -name "module-1.html" -path "*stage-1*";
  find paths -maxdepth 2 -name "index.html"; } | sort
```
Expected: 12 youth-families + 7 free intro modules + 8 path entry `index.html` + `paths/index.html` (decide whether to include the top-level `/paths/` hub — include it; 28 total is fine).

- [ ] **Step 2: Embed the list as a `const pages = [...]` literal in the workflow script** (do NOT rely on the `args` global — it did not bind in the Phase 3 run; embed directly).

---

## Task 2: Author the Phase 4 workflow script

**Files:** Create inline via the `Workflow` tool `script` param (auto-persisted).

- [ ] **Step 1: Define the scorecard schema** (forces structured output):

```js
const SCORECARD_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    page: { type: 'string' },
    capabilityGain: { type: 'string' }, // "After this, the learner can now ___"
    scores: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          criterion: { type: 'integer' },        // 1..15
          score: { type: ['integer','null'] },    // 1..5 or null for N/A
          ageBand: { type: ['string','null'], enum: ['12-14','15-17','adult', null] }, // only for #14
          rationale: { type: 'string' }
        },
        required: ['criterion','score','ageBand','rationale']
      }
    }
  },
  required: ['page','capabilityGain','scores']
};
```
Note: criterion 14 produces three entries (one per ageBand); all others one entry with ageBand null.

- [ ] **Step 2: Write the scorer prompt** — embeds the full anchor table above, the capability-gain instruction, and the benchmark matrix as reference bars. Instruct: read the file in full, score every applicable criterion 1–5 (N/A for conditional 12/15 where inapplicable), three age-band sub-scores for #14, one-line rationale each, and the capability-gain sentence. Score honestly; do not inflate.

- [ ] **Step 3: Write the pipeline** — score every page, then a calibration stage:

```js
phase('Score')
const scored = await parallel(pages.map(p => () =>
  agent(scorerPrompt(p), { label: 'score:' + short(p.path), phase: 'Score', schema: SCORECARD_SCHEMA })
))
// Calibration: re-score a deterministic ~15% sample (every 7th page) with a fresh agent
phase('Calibrate')
const sample = pages.filter((_, i) => i % 7 === 0)
const recheck = await parallel(sample.map(p => () =>
  agent(scorerPrompt(p), { label: 'calib:' + short(p.path), phase: 'Calibrate', schema: SCORECARD_SCHEMA })
))
return { scored: scored.filter(Boolean), calibration: recheck.filter(Boolean) }
```

- [ ] **Step 4: Launch in background** via `Workflow({ script })`. Confirm it is NOT a no-op: after ~60s, check the transcript dir has >20 `agent-*.jsonl` files (the Phase 3 first-run no-op'd silently — verify work is happening).

---

## Task 3: Synthesize the report (main session, after workflow returns)

**Files:** Create `reports/pedagogy-youth-audit-2026-06-06.md`.

- [ ] **Step 1: Compute calibration variance** — for each sampled page, diff the scorer vs calibration score per criterion. Flag criteria where |Δ| ≥ 2 on ≥2 sample pages as "low-confidence — tighten anchors." Report these explicitly (no silent caps).

- [ ] **Step 2: Build the per-page scorecard table** (15 criteria × 1–5, N/A where applicable, 3 age-band flags, capability-gain sentence).

- [ ] **Step 3: Headline section** — average by criterion, weakest criteria platform-wide, strongest exemplar pages (the quality bar).

- [ ] **Step 4: Age-band readiness matrix** — per page: bright 12-year-old solo? 15-year-old solo? 17-year-old prepared for university econ/CS? (derive from #14 sub-scores + capability-gain).

- [ ] **Step 5: Prioritized "redesign for adoption" shortlist** — rank pages by (low score × funnel importance); for each, name the failing criterion and the benchmark approach to borrow (e.g. "weak Simulation depth → borrow Minecraft Education's consequence-loop, no badges").

- [ ] **Step 6: Commit the report** on a Phase 4 branch:

```bash
git checkout -b feat/phase-4-youth-audit origin/main
git add reports/pedagogy-youth-audit-2026-06-06.md docs/superpowers/specs/2026-06-06-phase-4-*.md docs/superpowers/plans/2026-06-06-phase-4-*.md
git commit -m "audit(phase-4): pedagogy & youth-readiness scorecard"
git push -u origin feat/phase-4-youth-audit
```

---

## Sequencing gate

**Do not launch Task 2's workflow until the Phase 3 accuracy report is delivered and Dalia has reviewed it** (per her sequencing decision — one report at a time, avoid two concurrent large workflows).

## Self-review

- **Spec coverage:** scope (Task 1), all 15 criteria + anchors (Task 2 Step 2 + anchor table), age bands (#14, matrix in Task 3 Step 4), calibration (Task 2 Step 3 + Task 3 Step 1), benchmark-borrow (Task 3 Step 5), capability-gain (schema + Task 3), no-auto-fix (file structure note), mechanics principle (scored via criteria 9/10/11, not badges). ✓
- **Placeholder scan:** none — anchors and schema are concrete.
- **Consistency:** `SCORECARD_SCHEMA`, `scorerPrompt`, `short()`, `pages` used consistently; criterion numbering matches the spec's 15.
