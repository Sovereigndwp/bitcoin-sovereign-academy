---
name: bsa-brand-steward
description: >
  Gated-automation brand-consistency workflow for Bitcoin Sovereign Academy
  (portable to FSA). Automates detection, risk classification, zone grouping,
  Scoper reports, proposed unified diffs, diff-integrity checks, and screenshot
  QA. Stops at human gates only where judgment, rendered UI, shared CSS, or
  irreversible repo changes are involved. Use when auditing or normalizing brand
  orange/gold and canonical-token usage, or scoping/reviewing a brand-cleanup PR.
  Triggers: "audit BSA brand", "brand consistency", "canonicalize orange",
  "scope a brand PR", "run the brand pipeline".
autonomy: gated-automation
---

# Brand Steward (BSA)

**Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or
irreversible repo changes are involved.**

The Steward automates the repeatable parts of brand cleanup and stops only at the
points where a wrong assumption could damage the site. It is not manual-only and it
is not auto-merge. It runs the full detect → classify → scope → propose → verify
pipeline by itself, then waits for approval before anything is written, before shared
CSS or high-risk zones are touched, and before any commit or merge.

**Source of truth:** `brand-protect-list.json` (next to this file). Read it first
every run — it defines canonical tokens, drift values, semantic colors to protect,
`data-*` signals, no-touch/high-risk zones, exclusions, transforms, the pipeline, and
the gates. Rules live there, not in prose.

## Canonical facts (BSA)
- Brand orange is **`#FF7A00`** (`--color-brand`). BSA orange is the brand — **never neutralize it**; only canonicalize the hex.
- Token sources: `css/brand.css` (primary), `css/tokens.css`, `css/design-tokens.css`. Active overlay: `css/brand-consistency.css`.
- Drift to canonicalize (right intent, wrong hex): `#f7931a`, `#F2A900`, `#FFD400`, `#FFB800` → `var(--color-brand)`.
- **Absolute CSS paths only** (BSA rule): any added link is `/css/brand.css`, never relative.

## What is AUTOMATED (no checkpoint needed — all read-only or proposal-only)
1. **Run the audit** — `scripts/audit-bsa-brand.sh` (atomic write).
2. **Classify files by risk** — safe / shared-CSS / high-risk / data-injected, from the protect-list.
3. **Group candidates by zone.**
4. **Detect missing canonical token sources.**
5. **Detect hardcoded orange/gold drift.**
6. **Detect semantic color risk** (quiz/state colors to protect).
7. **Detect `data-*` injected pages** (flag for screenshot QA).
8. **Produce a Scoper report** for the chosen zone.
9. **Produce a proposed unified diff** (`.patch`) — written to `reports/`, source untouched.
10. **Run diff-integrity checks** (only intended lines change; hrefs/JSON-LD/scripts/`data-*` intact).
11. **Run screenshot QA** where the zone contains `data-*` pages.
12. **Produce a final Verifier report.**

These stages emit reports and a proposed patch into `reports/`. They never modify a
source HTML/CSS/JS file.

## Where the GATES are (human checkpoint required)
1. **Before applying a proposed diff** to source files.
2. **Before touching shared CSS** (`brand.css`, `tokens.css`, `design-tokens.css`, `brand-consistency.css`, `quiz.css`, `status-indicators.css`, `safety-assessment.css`).
3. **Before touching high-risk zones** — `paths/`, `deep-dives/`, `interactive-demos/`, quizzes, `ai-tutors/`, `ai-agents/`, `certificates/`, and any `data-*`-injected page.
4. **Before commit or merge.**

Outside these four points, the Steward proceeds on its own.

## Pipeline (one zone at a time)
```
scripts/brand-pipeline.sh <zone>        # automated stages 1-12, proposal-only, STOPS at the apply gate
scripts/brand-pipeline.sh <zone> --apply   # GATED: applies the approved patch to source (run only after approval)
```
Outputs per zone, under `reports/zones/<zone>/`:
- `scoped-report.md` — files in scope, what changes, what stays, risks, QA checklist, no-touch list.
- `proposed.patch` — the unified diff (apply with `git apply` after approval).
- `verifier-report.md` — diff-integrity result + screenshot-QA status.

The pipeline auto-detects when a zone is high-risk, shared-CSS, or `data-*`-injected and
**refuses to auto-apply** — it produces the proposal and stops at the gate regardless of flags.

## Roles
- **Auditor** (auto, read-only) — runs the detector, reads results.
- **Scoper** (auto, read-only) — emits the zone report + grouping.
- **Editor** (auto proposal / gated apply) — generates the patch automatically; applying it is gated.
- **Verifier** (auto) — diff-integrity + screenshots; reports pass/fail. Commit stays gated.

## Recommended PR sequence (from the audit)
1. Keep the Auditor as the standing read-only audit.
2. **Safest zone first: `answers/`** (link-only canonical add; not `data-*`; zero drift) — the first pipeline.
3. Scoped report: reconcile multiple `--color-brand`/orange token definitions + `!important` hardcodes in `brand.css` (shared CSS → gated).
4. Verify + propose archival of brand-fix CSS linked by 0 pages.
5. One scoped pipeline per high-risk zone: `answers/` → static `institutional/` → `deep-dives/` → `paths/` → `interactive-demos/` → quizzes/AI (each gated).
6. Separate scoped review of `brand-consistency.css`.

## Portability to FSA
Swap the ruleset in `brand-protect-list.json` (`portability.FSA`). FSA's transform is the
opposite shape: neutralize broad dark-green surfaces to neutral tokens via a `:root` bridge
(not canonicalization), keeping emerald/mint accents and semantic colors. Same pipeline, same gates.

## Definition of done (per zone)
Pipeline runs stages 1-12 automatically → human approves the patch → (gated) apply →
Verifier passes → human commits/merges. **No source file is written, no shared CSS or
high-risk zone is touched, and nothing is committed without the relevant gate.**
