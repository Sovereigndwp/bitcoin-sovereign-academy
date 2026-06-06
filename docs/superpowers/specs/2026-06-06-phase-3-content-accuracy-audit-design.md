# Phase 3 — Content-Accuracy Audit (Premium Catalog) — Design

**Date:** 2026-06-06
**Status:** Approved (design); spec under review
**Predecessor:** `docs/superpowers/specs/2026-06-04-demo-cleanup-shared-access-design.md` (Phases 1+2 — shipped in PR #46). Phase 3 was explicitly deferred there and "runs as its own spec/workflow immediately after this ships, because accuracy matters before a buyer evaluates."
**Prior art:** `reports/demo-audit-2026-04-24.md` (A2 — 52 interactive demos, 135 findings) and `SOURCES.md` (claim-traceability policy).

---

## Goal

Ensure the accuracy of the content a buyer evaluates through the preview-key flow (PR #46), **before** they evaluate it. The preview key unlocks the premium catalog; this audit checks that catalog for content that is wrong, stale, dead, or unsourced.

## Why now

A buyer can now unlock the entire premium catalog via a single link (`/api/preview-access?key=…`). The interactive demos were truth-audited in April 2026 (A2), but the **deep-dives and path modules have never been audited for accuracy**. They are long-form, claim-dense, and exactly what a serious evaluator reads. Accuracy is CLAUDE.md's #1 rule ("always verify truth of content in platform").

---

## Scope

**In scope — 92 buyer-facing premium pages:**
- **7 deep-dives:** `austrian-economics`, `bitcoin-capital`, `first-principles`, `foundational-layer-thesis`, `money-banking`, `philosophy-economics`, `sovereign-tools`
- **85 path modules:** 70 stage-2+ modules + 15 stage-1 module-2+ modules (premium per the gate config in `js/membership-gate.js` / `module-gate.js`)

**Out of scope:**
- Interactive demos — already audited in A2 (`reports/demo-audit-2026-04-24.md`); their fixes are tracked there, not re-litigated here.
- Free content (stage-1 module-1 of each path; homepage; marketing pages).
- Visual/IA redesign (separate B6 cascade thread).

---

## Dimensions (what counts as a finding)

Severity model inherited from A2: **🔴 wrong** (teaches incorrect facts) / **🟡 misleading or stale** / **🟢 could be sharper**.

1. **Factual / conceptual errors** — statements that teach something incorrect about Bitcoin, economics, custody, or protocol.
2. **Stale data & dates** — hardcoded price / hashrate / block height / supply; "as of 2024" framing presented as current; outdated IRS / tax / regulatory figures.
3. **Dead links & defunct services** — broken external URLs; references to shut-down tools presented as live (Samourai/Whirlpool [DOJ takedown Apr 2024], Wasabi/zkSNACKs coordinator [shutdown Jun 2024], Caravan, Paxful, and any others surfaced by `npm run lint:services`).
4. **Unsourced quantitative claims** — numeric claims with no traceable source in `SOURCES.md` → flagged `[SOURCE NEEDED]` per content policy.

**Ground truth for every auditing agent:** `SOURCES.md`, the defunct-services list (`lint:services` + CLAUDE.md), and live web verification (WebSearch/WebFetch) for current figures and contested facts.

---

## Deliverable

**`reports/content-audit-premium-2026-06-06.md`** — modeled on the A2 report:
- Headline numbers (findings by severity × dimension × content-type).
- Per-page findings: severity-tagged, line-numbered, with `claim`, `issue`, `proposedFix`, `fixType`, and `sourceRef`.
- Top-N priority fix list (🔴 first).
- Cross-cutting patterns (e.g. "N modules share the same stale halving date").

**Plus committed 🔴-mechanical fixes** (see Auto-fix policy).

---

## Auto-fix policy (strict)

Only **unambiguous, mechanical 🔴 fixes** are auto-applied:
- Dead link → correct live URL or archived (web.archive.org) equivalent.
- Defunct service → "no longer operating" note and/or current alternative.
- Clearly-wrong number/fact with a single correct value → corrected value **with `SOURCES.md` citation**.

**Never auto-applied (→ tagged `🔴 needs-decision`, report-only):**
- Anything requiring a rewrite of an explanation, or where more than one valid fix exists.
- All 🟡 and 🟢 findings (report-only).

**Hard guardrail — `foundational-layer-thesis` is report-only, no auto-fix of any severity.** It is v4-canonical/locked per CLAUDE.md (v3 archived, do not edit; v4 changes are definitional/clarifying and need Dalia's editorial call). Findings are reported for manual review only.

---

## Execution — multi-agent Workflow

The user has explicitly opted into multi-agent orchestration for this audit.

**Structure (pipeline, ~16 concurrent):**
1. **Stage 1 — Audit.** One agent per page. Input: page path + the four dimensions + ground-truth references. Output: structured findings via schema:
   ```
   {
     page: string,
     findings: [{
       dimension: 'factual' | 'stale-data' | 'dead-link' | 'unsourced',
       severity: 'red' | 'yellow' | 'green',
       line: number | null,
       claim: string,
       issue: string,
       proposedFix: string,
       fixType: 'mechanical' | 'needs-decision',
       sourceRef: string | null
     }]
   }
   ```
2. **Stage 2 — Adversarial verify.** Every `severity: red` + `fixType: mechanical` finding gets an independent skeptic agent prompted to **refute** it: is the claim actually wrong? is the proposed fix correct and sourced? Default to "not auto-fixable" when uncertain. Only survivors become auto-fix-eligible. This kills false-positive 🔴 edits before they touch files.

**Synthesis + apply (main session, not parallel):**
- I aggregate all findings into the report.
- I apply only verified, unambiguous 🔴-mechanical fixes — **serially**, so no concurrent file mutation — excluding `foundational-layer-thesis`.
- 🔴-needs-decision, 🟡, 🟢 → report only.

**Why this shape:** audit and verify are independent per-page work (pipeline, no barrier). File mutation is centralized in the main session to keep edits controlled and reviewable. Adversarial verification before any auto-fix protects against the workflow confidently "correcting" something that was actually right.

---

## Success criteria

- All 92 pages audited across all four dimensions.
- Report produced with headline numbers, per-page line-numbered findings, and a top-N list.
- Every 🔴-mechanical finding adversarially verified before any edit.
- Auto-fixes limited to verified mechanical 🔴s; `foundational-layer-thesis` untouched.
- New/changed quantitative claims trace to `SOURCES.md` (added there if missing).
- Branch pushed; changes reviewable as a PR before merge.

## Out of scope / deferred

- Fixing 🟡 / 🟢 findings (separate pass after Dalia reviews the report).
- `foundational-layer-thesis` edits (manual editorial pass).
- Re-auditing interactive demos (A2 already covers them).
- Path module-1 (free) and marketing/homepage content.
