# Asset Audit — Six Years of Dalia's Bitcoin Content

> **Phase 1 deliverable.** Hard cap: 4 focused hours. Target: ≥100 items catalogued.
> Schema per `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` §6.3.
> Decisions on what to surface (top 20) happen in Task 6 of the Phase 1 implementation plan.

## Operating frame — read first

This audit is **unbounded-mode** work (per `docs/marketing/voice-spec.md` §11): we are surfacing the **real artifacts** of six years × 8-hour days, not building a fake content inventory.

Each row in the table below represents a real artifact that has either yielded a real outcome (a reader who took a real action) or is *capable* of yielding one once surfaced. The audit's job is to find those artifacts and route them to where readers will encounter them.

**What the audit is not:**
- A complete catalog (4-hour hard cap forbids it)
- A judgment of past work's quality (silver and needs-work entries are still valuable references)
- A rewriting exercise (no editing during audit; just cataloging)

**What the audit is:**
- A surfacing exercise — finding hidden golds
- A routing input for the identity hub (Task 7 of the plan picks 20 to surface)
- A grounding input for Phase 2 spec drafting (Task 15 — the audit results decide the funnel direction)

---

## Status

- Audit started: <YYYY-MM-DD>
- Audit closed: <YYYY-MM-DD>
- Items catalogued: <N>
- Items marked `surface_to_hub=yes`: <N>
- Items marked `quality=gold`: <N>
- Format choice: **markdown** (Phase 1 default — git-tracked, no vendor lock-in)

---

## Audit table

> Add rows below. Recommended sweep order (highest signal first, per plan Task 5 Step 2):
> 1. Substack (`sovereigndwp`) — every published post
> 2. BSA published modules and demos — every ≥silver
> 3. FSA published content — every ≥silver
> 4. LinkedIn (`layer-d`) — your authored posts (not reshares)
> 5. X / Twitter (`dalia_platt`) — original threads
> 6. Drafts folder / unpublished work
> 7. Slides / talks

| title | platform | url | topic | audience | language | format | status | quality | surface_to_hub | notes |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |

(Add rows as you sweep each platform. Don't be precious — fill in what's visible at first glance, refine later if needed.)

---

## Schema reference

| Column | Allowed values |
|---|---|
| `title` | Piece title (or short identifier if untitled) |
| `platform` | `X` / `LinkedIn` / `Substack` / `BSA` / `FSA` / `drafts-folder` / `slides` / `talks` / `comments` / `other` |
| `url` | Direct link if published; relative path or note if local |
| `topic` | `custody` / `inheritance` / `privacy` / `biometrics` / `stablecoins` / `family-planning` / `Bitcoin-fundamentals` / `regulation` / `sovereignty` / `digital-id` / `CBDCs` / `other` |
| `audience` | `beginner` / `intermediate` / `advanced` / `family` / `advisor` / `professional` / `mixed` |
| `language` | `EN` / `ES` / `bilingual` |
| `format` | `essay` / `infographic` / `video` / `deck` / `thread` / `comment-reply` / `draft` |
| `status` | `published` / `draft` / `never-published` |
| `quality` | `gold` / `silver` / `needs-work` |
| `surface_to_hub` | `yes` / `no` / `maybe` |
| `notes` | One-line context — what makes it gold, where it lives if hidden, what would need editing if surfaced |

---

## Quality classification — what "gold" means

Per the plan Task 5 Step 2:

- **`gold`** = you would be **proud to surface this on the identity hub today, no edits required**.
- **`silver`** = strong content but needs minor edits or context wrap before surfacing.
- **`needs-work`** = good idea but the execution isn't there yet. Keep in audit as reference; don't surface in Phase 1.

Be ruthless. If you hesitate on `gold`, it's `silver`.

---

## After the audit

1. **Task 6 of the plan:** filter to top 30 (`quality=gold` AND `surface_to_hub=yes`). From those, pick top 20 with door coverage and language balance (≥5 per door, ≥5 Spanish total).
2. **Task 7 of the plan:** ensure each of the 20 has a permanent URL on BSA / FSA / Substack; apply footer convention; cross-link.
3. **Task 8 of the plan:** populate the identity hub's 4 doors with the 20 surfaced pieces.
4. **Task 15 of the plan:** use the audit findings (which clusters dominate, which audience is most served, which language has the most golds) to decide the Phase 2 funnel direction.

---

## Source

Phase 1 spec §6: `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md`
Phase 1 plan Task 5: `docs/superpowers/plans/2026-04-28-phase-1-identity-convergence-plan.md`
Voice spec (operating frame): `docs/marketing/voice-spec.md`
