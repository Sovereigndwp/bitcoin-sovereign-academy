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

### Form A — Sibling Foundations (visual artifacts)

**Reference text:** `Created by Dalia · bitcoinsovereign.academy` (EN) / `Creado por Dalia · …` (ES)

For each Foundation, open the source file in your design tool, look at the footer, fill the row.

| # | Surface | Footer text (verbatim, or "matches") | Logo present (Y/N) | Visual drift vs F#2 (none/minor/major) | Source located (Y/N) |
|---|---|---|---|---|---|
| F1  | Foundation #1                          |                                            |                    |                                        |                      |
| F3  | Foundation #3 (original)               |                                            |                    |                                        |                      |
| F3v2 | Foundation #3v2                       |                                            |                    |                                        |                      |
| F4  | Foundation #4                          |                                            |                    |                                        |                      |
| F5  | Foundation #5                          |                                            |                    |                                        |                      |
| F2  | Foundation #2 (EN portrait, REFERENCE) | matches                                    | Y                  | none                                   | Y                    |

**Filling tips:**
- "Footer text" — copy the exact characters. If it matches the reference verbatim, just write `matches`.
- "Logo present" — any BSA logo (old or new diamond+stroke) counts as Y. The audit only fails this if no logo is present at all.
- "Visual drift" — judgment call. `none` = looks like the same series. `minor` = font weight or accent color slightly off. `major` = clearly different design language.
- "Source located" — N if the source file is missing/lost. The "fix path" for source-not-located is to re-render through Path B v2 (separate task, out of scope here).

If F3 (original) is fully superseded by F3v2 and you don't use it anywhere, write `superseded` in the text column and skip the rest of the row.

### Form B — Substack closing line (last 10 posts)

**Reference EN:** *"I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy."*
**Reference ES:** *"Escribo sobre Bitcoin, custodia, privacidad y soberanía financiera en bitcoinsovereign.academy."*

Open `https://sovereigndwp.substack.com/`. For each of the 10 most recent posts (top of homepage), open the post, scroll to the bottom, and check whether the closing line is present.

| # | Post slug or date | Lang (EN/ES) | Closing line present (Y/N) | If N — what's there instead? |
|---|---|---|---|---|
| 1  |                   |              |                            |                              |
| 2  |                   |              |                            |                              |
| 3  |                   |              |                            |                              |
| 4  |                   |              |                            |                              |
| 5  |                   |              |                            |                              |
| 6  |                   |              |                            |                              |
| 7  |                   |              |                            |                              |
| 8  |                   |              |                            |                              |
| 9  |                   |              |                            |                              |
| 10 |                   |              |                            |                              |

**Filling tips:**
- "Post slug" — the URL fragment, e.g. `/p/the-recovery-binder` — or just the post date if easier.
- "Lang" — primary language of the post body (most are EN, some ES).
- "Closing line present" — Y if the canonical line is the LAST sentence of the post (or close to it). N if missing or different.
- If N — paste the actual closing sentence so we can decide whether to retrofit or accept.

### Form C — Identity hub footer (auto-audited)

| # | Surface | Footer text correct? | Logo present? | Notes |
|---|---|---|---|---|
| H1 | `dalia/index.html` (lines 118–121) | ✅ appropriate | N/A | Uses thesis-line variant per spec §4.5 (bio + thesis, not Substack closing line). |

### Findings (filled in as audit progresses)

#### In-repo surfaces (auto-audited 2026-04-30)

- **Foundation #2 EN/ES (all 6 outputs)** — `footer` field in both content JSONs equals canonical text exactly. Logo (`assets/dalia/logo.svg`) inlined via render pipeline at ~20 px. ✅ Pass, set as reference.
- **`dalia/index.html`** — hub footer at lines 118–121 uses the thesis-line variant. Per spec §4.5, hubs use a different convention from artifacts/posts. ✅ Pass (appropriate for surface type).

#### External surfaces (pending — fill Forms A + B above)

- Form A — 5 sibling Foundations
- Form B — 10 Substack posts

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
