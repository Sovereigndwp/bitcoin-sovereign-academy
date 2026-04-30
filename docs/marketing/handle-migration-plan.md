# Handle Migration + Footer Audit — Tracking Doc

> Phase 1 deliverable. Tracks platform handle migrations (Tasks 11, 12) and the
> footer convention audit (Task 14). Created 2026-04-30 as a stub when Task 14
> began; Tasks 11 + 12 will fill their sections later.

## Status

- Created: 2026-04-30
- Footer audit started: 2026-04-30
- Footer audit closed: <YYYY-MM-DD>

---

## Footer audit (Task 14)

**Canonical reference:** `docs/marketing/voice-spec.md` §6.1
**Spec:** `docs/superpowers/specs/2026-04-30-foundation-footer-audit.md`
**Scope:** 5 sibling Foundations + 10 Substack posts + 1 hub HTML.
**Hard cap:** 90 minutes.

### Audit table

| # | Surface | Type | Footer text correct? | Logo present? | Notes |
|---|---|---|---|---|---|
| 1 | Foundation #1 | infographic-EN | ? | ? | Open in design tool. Check footer text matches `Created by Dalia · bitcoinsovereign.academy` exactly. |
| 2 | Foundation #2 (EN portrait) | infographic-EN | ✅ reference | ✅ reference | Shipped 2026-04-30 with locked text + logo. `assets/foundations/foundation-2-en-portrait.png`. |
| 3 | Foundation #2 (ES portrait) | infographic-ES | ✅ reference | ✅ reference | `assets/foundations/foundation-2-es-portrait.png`. |
| 4 | Foundation #3 (original) | infographic-EN | ? | ? | If superseded by 3v2, mark as deprecated; do not audit. |
| 5 | Foundation #3v2 | infographic-EN | ? | ? | Per content brief, this is the "polished template" sibling. |
| 6 | Foundation #4 | infographic-EN | ? | ? | "From Seed Phrase to Address" per brief. |
| 7 | Foundation #5 | infographic-EN | ? | ? | Final in 1–5 series. |
| 8 | Substack post 1 (most recent) | written | ? | N/A | Closing line: *"I write about Bitcoin, custody…"* (EN) or *"Escribo sobre Bitcoin…"* (ES). |
| 9 | Substack post 2 | written | ? | N/A | |
| 10 | Substack post 3 | written | ? | N/A | |
| 11 | Substack post 4 | written | ? | N/A | |
| 12 | Substack post 5 | written | ? | N/A | |
| 13 | Substack post 6 | written | ? | N/A | |
| 14 | Substack post 7 | written | ? | N/A | |
| 15 | Substack post 8 | written | ? | N/A | |
| 16 | Substack post 9 | written | ? | N/A | |
| 17 | Substack post 10 | written | ? | N/A | |
| 18 | `dalia/index.html` (identity hub) | hub | ✅ appropriate | N/A | Uses thesis-line variant per spec §4.5 (bio + thesis, not Substack closing line). Lines 118–121. |

### Findings (filled in as audit progresses)

#### In-repo surfaces (auto-audited 2026-04-30)

- **Foundation #2 EN/ES (all ratios)** — `footer` field in both content JSONs equals canonical text exactly. Logo (`assets/dalia/logo.svg`) inlined via render pipeline at ~20 px. ✅ Pass, set as reference.
- **`dalia/index.html`** — hub footer at lines 118–121 carries the BSA · FSA · TBA brand line + thesis subtext. Per spec §4.5, hubs use a different variant from artifacts/posts. ✅ Pass.

#### External surfaces (pending user audit)

- 5 sibling Foundations — *open in your design tool, report findings below.*
- Last 10 Substack posts — *open https://sovereigndwp.substack.com/, scroll homepage, report findings below.*

### Gap log

(Filled as gaps are found. Format: `[surface] — [gap] — [tier: cheap/medium/expensive] — [target date or "out of scope"]`)

- *(none yet)*

---

## Handle migrations (Tasks 11 + 12)

Stub. Filled when Tasks 11/12 execute.

### LinkedIn (Task 11)

- Old URL: `linkedin.com/in/layer-d`
- New URL: <pending>
- Migration date: <pending>
- Notes: <pending>

### Substack (Task 12)

- Old URL: `sovereigndwp.substack.com`
- New URL: <pending or DEFERRED-TO-PHASE-2>
- Migration date: <pending>
- Subscribers at migration: 60 (per Phase 1 spec §13)
- Subscribers after notification: <pending>
- Notes: <pending>

---

## Phase 1 close

(Filled in Task 16 once verification §12 completes.)
