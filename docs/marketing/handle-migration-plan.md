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
| F1   | Foundation #1                          | matches                                    | N                  | none                                   | Y                    |
| F3   | Foundation #3 (original)               | matches                                    | N                  | none                                   | Y                    |
| F3v2 | Foundation #3v2                        | matches                                    | N                  | none                                   | Y                    |
| F4   | Foundation #4                          | matches                                    | N                  | none                                   | Y                    |
| F5   | Foundation #5                          | matches                                    | N                  | none                                   | Y                    |
| F2   | Foundation #2 (EN portrait, REFERENCE) | matches                                    | Y                  | none                                   | Y                    |

**User report 2026-04-30 (revised 2026-05-01):** all 5 siblings already carry the locked footer text and are visually consistent with F#2. Only gap: the BSA logo is missing from the footer area on every sibling. F#2 is the only piece in the series that has the logo (because it shipped after the logo was locked).

**Series visual identity:** intact. The 1–5 series reads as one body of work in everything except logo presence.

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

| # | Post slug | Date | Lang | Closing line? | Actual final sentence |
|---|---|---|---|---|---|
| 1 | tres-llaves-tres-jurisdicciones-una | Apr 29 | ES | N | "Y la intención no firma transacciones." |
| 2 | your-family-does-not-inherit-your | Apr 24 | EN | N | "Next to each one, add two short lines: what it is, and what it is not." |
| 3 | the-law-can-tell-you-who-should-receive | Apr 21 | EN | N | "That may be the gap worth fixing first." |
| 4 | the-theft-often-begins-before-the | Apr 19 | EN | N | "They follow the person." |
| 5 | owning-bitcoin-and-owning-bitcoin | Apr 16 | EN | N | "…until the differences are the only thing that matter." |
| 6 | this-was-never-just-about-the-wallet | Apr 13 | EN | N | "…what it actually means to hold bitcoin in a way that can endure pressure, complexity, and time." |
| 7 | what-becomes-visible-becomes-vulnerable | Apr 10 | EN | N | "A visible one can turn into an invitation." |
| 8 | your-phone-can-hold-your-life-without | Apr 8 | EN | N | "…more of your financial life than you ever meant to give it." |
| 9 | the-easiest-way-to-lose-bitcoin-is | Apr 6 | EN | N | "…without letting speed, irritation, or confidence take over." |
| 10 | complexity-can-become-its-own-risk | Apr 3 | EN | N | "And once you lose the thread, trust follows quickly behind." |

**Result: 0/10 carry the closing line. Audited 2026-04-30 by fetching each post.**

**Pattern observation:** every post ends with an essay-style punchline that does editorial work — these are *good* closings, voice-spec compliant (inform, not convince). The §5.3 convention asks for a separate one-line sign-off appended *after* the essay closes, like a signature block. That signature block is currently missing on all 10.

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

Format: `[surface] — [gap] — [tier] — [resolution]`

**Revised 2026-05-01** — Form A findings corrected. Original report flagged all 3 checks as failing; actual finding is footer text + visual consistency PASS, only logo missing.

- ~~F1, F3, F3v2, F4, F5 — footer text drift~~ — **NO GAP** (text matches across all 5).
- **F1, F3, F3v2, F4, F5 — logo missing in footer area** — medium tier (5 separate design-tool sessions to add logo + re-export) — *resolution: drop locked logo into footer area of each sibling, re-export. Target: when next opening each file for any other reason.*
- ~~F1, F3, F3v2, F4, F5 — visual drift vs F#2~~ — **NO GAP** (series visual identity intact).
- **Substack last 10 posts — closing line missing on all 10** — pattern observation, not necessarily a gap — *requires editorial decision (A/B/C below).*

### §8 — Strategic decision (revised 2026-05-01)

**Original premise (2026-04-30):** all 5 siblings failed all 3 checks → decision (a) chosen, full Path B v2 migration scheduled.

**Revised premise (2026-05-01):** Form A findings were incorrect. Siblings already pass footer text + visual consistency. Only logo is missing.

This collapses the strategic decision. The migration is no longer urgent — it'd be over-engineering for a single missing element. The actual remaining work:

**Resolution path: logo-only retrofit.** Open each of F1, F3v2, F4, F5 in source design tool, drop the locked logo (`assets/dalia/logo.svg`) into the footer area at the same scale/position used on F#2, re-export. ~10–15 min per sibling (logo file is ready, no design decisions needed). Total: ~50–75 min.

If F3 (original) is fully superseded by F3v2, skip it (4 siblings instead of 5).

**Decision (a) — Path B v2 migration — is no longer triggered by this audit.** The migration remains a "nice to have" for future-proofing (multi-ratio rendering, ES variants without re-design, future Foundations) but it is not justified by the gaps recorded here. It can be revisited when:
- The first sibling needs an ES variant (would otherwise require new design work)
- A new Foundation #6+ is planned
- The series gets bundled as a lead magnet (PDF) and per-page consistency matters

For Phase 1: just add the logo. Cheap, fast, done.

### Substack closing-line decision

The §5.3 convention asks for a one-line sign-off after each post: *"I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy."* (EN) or its ES equivalent.

Audit found **0/10** recent posts carry it. Every post instead ends with an essay-style punchline that does editorial work — these are *not violations of voice*, but they are missing the explicit attribution.

**Three resolution options:**

- (A) **Retrofit + forward** — edit the last 10 posts to append the closing line as a separate paragraph after the editorial ending; commit forward-cadence to applying it on every new post. Cost: ~30 min for retrofit (Substack inline edit), ongoing 30-second add per post going forward.
- (B) **Forward-only** — accept retrofit as out of scope; apply the convention starting with the next post. Cost: 30s per new post. Loses 10 posts of attribution, but no rework.
- (C) **Revise the convention** — the audit revealed that essay-style endings are doing real editorial work; the §5.3 convention may have been spec'd without seeing actual cadence. Option: amend voice-spec §6.1 to make the closing line *optional* on Substack (mandatory on infographics, recommended for advisor-audience long-form, optional for essay-style narrative posts).

**My read:** (B) is the right default — past posts stay as published, going forward the convention applies. (C) is a reasonable amendment if you find on reflection that you don't want to dilute essay endings; in that case, the closing line stays a *visual artifact* convention only.

(A) is over-engineering: ten retrofitted posts won't move any meaningful needle, and editing live Substack posts can re-trigger email sends in some configurations.

### Task 14 close (revised 2026-05-01)

- **Visual artifacts** (Form A): 5/5 carry correct footer text + consistent visual treatment. 5/5 missing logo. → Logo-only retrofit (medium tier, ~50–75 min, single batch).
- **Substack** (Form B): 0/10 carry the closing line. → Editorial decision (A/B/C above) pending.
- **Identity hub** (Form C): ✅ appropriate per spec §4.5.
- Phase 1 verification §12 row #14: **conditional pass** — once siblings get the logo retrofit, Task 14 closes clean. Substack convention is a separate editorial call.

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
