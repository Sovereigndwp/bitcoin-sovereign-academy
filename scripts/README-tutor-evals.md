# Tutor eval harness

Measures whether `api/tutor.ts` is producing the Socratic, persona-aware, technically-accurate, multi-lingual responses its SYSTEM_PROMPT claims to produce.

## Why it exists

Every change to the tutor's system prompt ships to every AI conversation on the platform. Without evals, we're optimizing blind — vibes instead of signal. This harness turns "did that prompt change help?" into a measurable question.

## What it does

1. **Extracts** the live `SYSTEM_PROMPT` from `api/tutor.ts` via regex (no refactor — the tutor endpoint stays the source of truth).
2. **Runs** 12 canonical test cases through `claude-sonnet-4-6` + the prompt:
   - Skeptic objection (wasted energy)
   - Hurried learner needing security NOW
   - Spanish-language query (language-match rule)
   - Stuck-learner 3-turn loop requesting direct answer (escalation rule)
   - Module-objective awareness (custodial vs self-custody)
   - Altcoin question — curious vs skeptic (different expected behaviors)
   - Truth-over-trust: current BTC supply (must defer to live data)
   - Expert BIP32 question (depth calibration)
   - Forbidden-opener check ("Great question!" etc.)
   - Emergency-kit context (direct mode, not pure Socratic)
   - Principled learner asking about BIP39 (citation behavior)
3. **Scores** each response using `claude-opus-4-7` with adaptive thinking against a per-test rubric:
   - Socratic adherence (0-10)
   - Technical accuracy (0-10)
   - Persona fit (0-10)
   - Length discipline (0-10)
   - Language match (true/false)
   - Overall verdict (pass / marginal / fail)
4. **Writes** a markdown report to `reports/tutor-evals-YYYY-MM-DD.md`.

## Running

```bash
ANTHROPIC_API_KEY=sk-ant-... npm run tutor:evals
```

Or directly:

```bash
ANTHROPIC_API_KEY=sk-ant-... node scripts/tutor-evals.mjs
```

## Cost

- 12 candidate calls (Sonnet 4.6 with cached 3.5K-token system prompt)
- 12 judge calls (Opus 4.7 with adaptive thinking)
- **~$0.05-0.10 per full run**

Safe to run in CI on every PR that touches `api/tutor.ts`.

## Interpreting the report

The per-case verdict has three states:

- **✅ pass** — the response met all dimensions. Ship it.
- **⚠️ marginal** — partial miss on one or two dimensions. Review, decide.
- **❌ fail** — missed a CRITICAL criterion (e.g. forbidden opener, didn't escalate from Socratic loop, language mismatch).

Dimension averages show where the prompt is structurally weak across the whole test set. If `socratic_adherence` averages 4/10 across 12 tests, the Socratic rules aren't landing — tighten them.

## Adding a test case

Append to `TEST_CASES` in `scripts/tutor-evals.mjs`. Each case needs:
- `id` (kebab-case unique identifier)
- `name` (human-readable)
- `persona` (one of the 7 paths + `curious` default)
- `contextNote` (the string that would appear in `[brackets]` at the start of the user message)
- `message` (the actual learner input for this turn)
- `history` (optional — prior turns as `{role, content}[]`)
- `rubric` (object with dimension names → prompt for the judge)

Mark a dimension as CRITICAL in the rubric text when a miss there should score 0-2 regardless of other dimensions.

## Not intended for

- Production monitoring (no always-on mode — run on demand or in CI)
- Load testing (hits real API, costs real money)
- End-to-end testing of the Vercel Edge handler (bypasses CORS/rate-limit — use `curl` against the deployed endpoint for that)

## Baselining workflow

1. Before changing the SYSTEM_PROMPT, run `npm run tutor:evals` → baseline report.
2. Make your change.
3. Run again → comparison report.
4. Diff the per-case verdicts and dimension averages. Regressions warrant rollback.
