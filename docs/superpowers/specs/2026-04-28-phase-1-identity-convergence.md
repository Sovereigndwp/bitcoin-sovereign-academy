# Phase 1 — Identity Convergence + Asset Surfacing

**Date:** 2026-04-28
**Status:** design — supersedes prior funnel-first Phase 1 (Plan A — `2026-04-28-distribution-engine-phase-1-design.md`) and Plan B candidate (`2026-04-28-distribution-engine-phase-1-design-plan-b.md`). Both are reclassified as Phase 2 candidates, to be revisited after this Phase 1 ships.

---

## TL;DR

Six years of 8-hour-days produced a body of work, scattered across six platforms with five different naming conventions. Plans A and B treated this scattered output as a *starting point* and proposed building a funnel on top of it. **The honest move is to organize what exists before adding more.**

Phase 1 is **Identity Convergence + Asset Surfacing.** It crystallizes the brand thesis, builds a single identity hub strangers can find in 10 seconds, audits 6 years of scattered content, and surfaces 20 hidden pieces into the new hub. Ships in **2–3 weeks**. Costs ~**10–15 hours focused work**. Produces the substrate every Phase 2 funnel decision will rely on.

Plans A, B, and the hybrid are not abandoned. They become Phase 2 candidates. Phase 1's audit results will tell us which Phase 2 is right — or whether a fourth option (Family Bitcoin OS as the leveraged product) emerges as the better path.

---

## 1. Why Phase 1 is identity, not funnel

The Plan A → Plan B → hybrid trajectory we explored optimized for one question: *"how do we capture leads for The Bitcoin Adviser?"*

That's the wrong question to start with. The right question is: *"how does anyone encountering one piece of Dalia's work find the rest of it within 10 seconds?"* Until that's solved, every funnel built on top leaks at the brand-discovery layer.

**Three concrete reasons the identity-first reframe is correct:**

1. **Six platforms, five naming conventions, no through-line.** Twitter `dalia_platt`, LinkedIn `layer-d`, Substack `sovereigndwp`, BSA, FSA, TBA. A reader who finds one cannot find the others without already knowing they exist. This is a brand-discovery break, not a content problem.
2. **The body of work is large but unsurfaced.** Six years × ~8h/day ≈ 12,000+ hours of content already exists across platforms, drafts, slides, comments, threads. New funnels built on top *don't compound that work*. Surfacing it does.
3. **TBA is immediate-revenue, not leveraged-revenue.** TBA scales with Dalia's hours; the brand should be optimized for paths that scale with audience (paid Substack, infographic library, Family Bitcoin OS, sponsorships, FSA Employer Programs). Building a TBA-only funnel optimizes for the path that *doesn't* compound. Phase 1 builds the leveraged substrate; Phase 2 attaches commercial paths to it.

---

## 2. Goal of Phase 1

By the end of Phase 1 (target: 3 weeks from start):

1. The Dalia brand has a one-breath thesis used everywhere.
2. A single identity hub at `bitcoinsovereign.academy/dalia` (or `dalia.bitcoinsovereign.academy`) routes strangers to the right surface in ≤10 seconds.
3. Bio, visual mark, and footer convention are consistent across all owned platforms.
4. Six years of scattered content is catalogued (≥100 items) and the top 20 pieces are surfaced into the four-door hub.
5. The Foundations 1–5 infographic series is complete (Foundation #2 ships).
6. A documented decision is made about which Phase 2 funnel direction the surfaced asset library actually justifies.

---

## 3. Brand thesis — crystallization

The brand thesis is *"convenience traded for sovereignty without understanding the cost"* — already articulated in long form. Phase 1 picks a **one-breath version** that fits in a bio, an X profile line, the bottom of an email.

**Locked (2026-04-28): primary one-breath thesis is T3a:**

> *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*

**Why T3a (selection rationale):** passes the stranger-test (*"does this person now know what you do?"*), tight enough for an X bio, **inclusive of non-LATAM clients** (Miami big-law firms, US family offices) by treating *"LATAM-fluent"* as a **capability descriptor**, not an audience boundary. Composes pair #1 (Bitcoin custody architecture × LATAM civil-law/notarial inheritance practice).

**Secondary atmospheric brand lines** (used in essay closings, speaker bios, X threads where T3a already appears as the bio):
- **T1.** *"I help people see the cost of convenience before they pay it."*
- **T2.** *"Sovereignty is something you design, not something you buy."*

**Candidates considered and rejected:**
- **T3** (predecessor of T3a): *"Bitcoin custody and family planning for people who live in the real Latin America."* — rejected because *"who live in"* gates audience by geography rather than capability, excluding Miami / US family offices that are valuable referral channels.
- **T4** (bilingual hybrid line): too long for one-line slots; useful only as a Substack/website header — deferred.
- **T5 / T6 / T9** (more action-verb / philosophy-bridged variants): considered, looser stranger-test or more wordy; T3a wins on tightness.

**Decision rule applied** *(retained for future re-evaluation)*: the thesis must (a) fit on one line of an X profile, (b) pass the stranger-test, (c) compose ≥1 of the 5 named domain pairs. Run T3a for 6 months before re-evaluating.

---

## 4. The identity hub

### 4.1 Location — locked

**`bitcoinsovereign.academy/dalia`** (locked 2026-04-28). Single domain — leverages existing BSA SEO + SSL, no DNS work required. Subdomain alternative (`dalia.bitcoinsovereign.academy`) considered and deferred — could be revived in Phase 2+ if URL strategy changes.

### 4.2 Page structure

Single static HTML page (no CMS, no JS framework). Four-section design:

```
[ Header — name, photo, one-breath thesis, social links ]

[ Bio — 3-sentence professional summary, ending in:
  "Founder of Bitcoin Sovereign Academy and Financially Sovereign Academy.
   Adviser at The Bitcoin Adviser." ]

[ Four doors — visual cards, primary door visually larger ]
   ┌─────────────────────────┐
   │ [PRIMARY DOOR]          │
   │ Start Learning Bitcoin  │ → /paths/curious/ (BSA)
   │ "Begin from first       │
   │  principles."           │
   └─────────────────────────┘

   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │ For Families │ │ For Advisors │ │ Read Latest  │
   │ with Bitcoin │ │ & Institutns │ │ Writing      │
   │              │ │              │ │              │
   │ → custody +  │ │ → FSA        │ │ → Substack   │
   │   inheritance│ │              │ │              │
   │   tools (BSA │ │              │ │              │
   │   + TBA link)│ │              │ │              │
   └──────────────┘ └──────────────┘ └──────────────┘

[ Footer — same bio line as everywhere; links to all owned platforms ]
```

The "primary door" choice (Start Learning Bitcoin → BSA) reflects the empirical reality: most strangers encountering Dalia for the first time are at the *learning* stage, not the *advisory* stage. The other three doors serve people who already know what they need.

### 4.3 Why four doors and not one

A single CTA optimizes for funnel conversion. **Phase 1 is not a funnel.** The hub's job is *routing*, not capture. A stranger should leave the hub with a clear next click — *not* with their email surrendered. Capture forms come back in Phase 2 once we know what to attach them to.

---

## 5. Bio + visual mark + footer convergence

### 5.1 The shared bio (deployed everywhere)

> *Dalia — Bitcoin custody education, financial sovereignty, and practical inheritance planning for families, advisors, and Spanish-speaking communities. Wrote the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin). Founder of Bitcoin Sovereign Academy and Financially Sovereign Academy. Adviser at The Bitcoin Adviser.*

This goes in: Twitter bio, LinkedIn About, Substack About, BSA `/about`, FSA `/about`, the identity hub, and the byline on every Substack post.

### 5.2 Visual mark

One profile photo. Same image on every platform. Picked once during Phase 1, locked for 12 months minimum. (Choosing it is a 30-min decision; I am not designing it.)

### 5.3 Footer convention (every artifact)

Every infographic: `Dalia | bitcoinsovereign.academy`
Every Substack post (closing line): *"I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy."*
Every LinkedIn post (when relevant): same closing line.

### 5.4 Handle migration

| Platform | Current handle | Target | Action in Phase 1 |
|---|---|---|---|
| Twitter / X | `dalia_platt` | (keep — already aligned) | No change |
| LinkedIn | `layer-d` | Vanity URL change → `dalia-platt` (or similar with "dalia") | Change vanity URL via LinkedIn settings |
| Substack | `sovereigndwp` | URL change → `dalia` or `daliaplatt` | Substack supports publication URL change once; carefully |
| BSA | bitcoinsovereign.academy | (keep — institution) | No change |
| FSA | financiallysovereign.academy | (keep — institution) | No change |
| TBA | thebitcoinadviser.com | (keep — third-party brand) | No change; link from identity hub |

The Substack URL change is the single highest-stakes migration: existing 60 subscribers and any external links pointing to `sovereigndwp.substack.com` will need to be redirected. Substack handles redirects natively, but verify before changing. **If risk is judged unacceptable, defer Substack rename to Phase 2 — but lock the bio + footer convention regardless.**

---

## 6. Asset audit

### 6.1 Goal

Catalog all content from the past 6 years across owned platforms and adjacent surfaces. Target: **≥100 items catalogued.** Realistically there are likely 200–500 — Phase 1 captures the meaningful ones, not the comprehensive set.

### 6.2 Format

A single tracking artifact, format = the user's preference:
- Markdown table at `docs/marketing/asset-audit.md` (git-tracked, no vendor lock-in) — **recommended default**
- Or Notion / Airtable / Google Sheets if the user prefers visual filtering

### 6.3 Schema (each row)

| Column | Values |
|---|---|
| `title` | piece title |
| `platform` | X / LinkedIn / Substack / BSA / FSA / drafts-folder / slides / etc. |
| `url` | direct link |
| `topic` | custody / inheritance / privacy / biometrics / stablecoins / family-planning / Bitcoin-fundamentals / regulation / sovereignty / digital-id / etc. |
| `audience` | beginner / intermediate / advanced / family / advisor / professional / mixed |
| `language` | EN / ES / bilingual |
| `format` | essay / infographic / video / deck / thread / comment-reply / draft |
| `status` | published / draft / never-published |
| `quality` | gold / silver / needs-work |
| `surface_to_hub` | yes / no / maybe |
| `notes` | one-line context |

### 6.4 Time budget

**Hard cap: 4 hours.** The audit is shallow on first pass — surface major pieces, skip low-value content. Completeness comes in iteration. Setting a cap prevents the "audit forever" failure mode.

### 6.5 Output

A ranked list of the top 30 pieces by `quality=gold` AND `surface_to_hub=yes`. From those 30, the top 20 ship in Phase 1's surfacing step (§7).

---

## 7. Asset surfacing

### 7.1 What "surfacing" means

For each of the top 20 pieces from §6.5:

1. **Permanent home.** If the piece lives only on Twitter or LinkedIn (rented platforms), it gets re-published to BSA or FSA at a permanent URL — with attribution to its original source if relevant.
2. **Tagged.** Each piece gets the audit's `topic`/`audience`/`language` tags applied to its page (used later for filtering on the identity hub).
3. **Linked from the relevant door.** The 4-door identity hub renders dynamic lists: e.g., "For Families with Bitcoin" pulls all pieces tagged `audience=family` and `quality=gold`.
4. **Footer convention applied.** The Dalia bio + closing line goes on each surfaced piece.
5. **Cross-linked.** Each surfaced piece links to ≥1 related piece in the library, building the internal-link graph.

### 7.2 Why 20 and not all of them

A "surface everything" plan never ships. **20 is a forcing function.** It's enough to populate each of the 4 doors with at least 5 high-quality pieces (a meaningful library, not a single example). The remaining catalogued-but-not-surfaced pieces stay in the audit doc and get pulled in during normal cadence post-Phase-1.

### 7.3 Spanish content priority

Spanish-language pieces are *not* second-class in the surfacing. Per the empirical evidence (60 Substack subs from Spanish content vs. 0 list growth from 5 years of English social), Spanish-published surfacing has equal or higher leverage per piece than English. The 20 surfaced pieces should include ≥5 Spanish if the audit produces that many golds.

---

## 8. Foundation #2 infographic

### 8.1 Status check

Existing Foundations infographics, per uploaded artifacts:
- **Foundation 1 of 5** — *"Your Wallet Is Not a Vault"* ✓
- **Foundation 2 of 5** — *(missing)*
- **Foundation 3 of 5** — *"Seed Phrase vs Private Keys"* ✓ (two versions)
- **Foundation 4 of 5** — *"From Seed Phrase to Address"* ✓
- **Foundation 5 of 5** — *"What Happens When You Send Bitcoin"* ✓

The series is 4/5 visually but conceptually broken because #2 is missing — a stranger seeing 1, 3, 4, 5 will assume something is incomplete. **Closing the series in Phase 1 is high-leverage:** it converts an in-progress collection into a complete, shareable, brandable arc.

### 8.2 Foundation #2 — topic — locked

**Locked title (2026-04-28): *"Anatomy of a Bitcoin Wallet."*** Slots naturally between #1 (*Your Wallet Is Not a Vault* — conceptual: what a wallet IS) and #3 (*Seed Phrase vs Private Keys* — relational: the recovery-vs-signing distinction). Anatomy framing is **first-principles native** (define the parts → show how they combine → derive what the whole does). Composes pair #2 (MPB pedagogy × HNW client psychology) and pair #4 (cypherpunk ethics × consumer-grade understanding).

Same visual style as #1/#3/#4/#5. Same first-principles internal structure (*What it IS → What its parts DO → How the parts combine → Common misconceptions → Key takeaway*). Same footer convention (*Dalia | bitcoinsovereign.academy*).

### 8.3 What "completing the series" enables

The complete 5-piece series becomes:
- A standalone PDF download bundled as the first lead magnet (Phase 2 work, not now)
- The visual TOC of any future custody/inheritance long-form (e.g., the eventual Family Bitcoin OS)
- A LinkedIn carousel set (5 carousels, drop-able weekly into the cadence)
- A "Foundations" door on the identity hub (sub-route of "Start Learning Bitcoin")

---

## 9. Voice spec doc — carries forward unchanged

The voice spec doc (composability + first-principles + epistemic stance + 5 named domain pairs + 3-part synthesis check + 7+7 rules) carries forward from Plan A as the canonical brand-voice reference. **No changes in Phase 1.** Path: `docs/marketing/voice-spec.md` — to be created during Phase 1 implementation as the first deliverable (it didn't actually get created yet; Plan A specified it but it's still pending).

---

## 10. Phase 2 decision criteria

Phase 2 picks the funnel direction. The decision is made *after* Phase 1's audit completes, using these criteria:

| Question | If answer is X, lean toward... |
|---|---|
| Which content cluster has the most depth in the audit? | The cluster suggests the natural lead magnet topic |
| Which audience does the body of work actually serve most? | That audience becomes Phase 2's primary track |
| Which language has the most surfaceable goldens? | That language is Phase 2's primary publishing language |
| Did the audit reveal a "Family Bitcoin OS"-shaped cluster (custody + inheritance + family + practical)? | Phase 2 = build the FBOS workbook/course, *not* a TBA funnel |
| Did the audit reveal more institutional content than expected (FSA-aligned)? | Phase 2 = FSA Employer Program funnel (B2B), TBA secondary |
| Is the audit dominated by Spanish-language analytical pieces? | Phase 2 = Plan A revival (Spanish consumer track) |
| Is the audit dominated by English long-form professional pieces? | Phase 2 = Plan B revival (professional English track) |

The decision is made in writing in a short Phase 2 spec at the end of Phase 1. **Phase 1 does not commit to Phase 2's shape.**

---

## 11. Out of scope (Phase 2+)

Not in Phase 1. Listed so they don't slip in during implementation:

- Lead-magnet PDFs (Plan A's *"Tu Bitcoin no es tuyo aún"*, Plan B's professional briefing)
- Capture forms + email lists + drip sequences
- Repurposer script (`scripts/syndicate.mjs`)
- Resend + Supabase + Vercel cron infrastructure
- Apollo cold outreach
- Programmatic SEO landing pages
- Family Bitcoin OS workbook/course (deferred to Phase 2 or 3)
- New writing beyond Foundation #2 — *use the audit's surfacing instead*
- TBA-funnel-specific work
- Sponsor pipeline

Phase 1's discipline is: **organize what exists. Don't add more.**

---

## 12. Verification — falsifiable success criteria

Measured at Phase 1 close (target: 3 weeks from start):

| Metric | Target |
|---|---|
| Identity hub live at `bitcoinsovereign.academy/dalia` (or subdomain), 4 doors functioning | yes / no |
| One-breath thesis chosen and deployed in ≥5 places (X bio, LinkedIn About, Substack About, BSA bio, identity hub header) | yes / no |
| Shared bio + visual mark deployed across ≥5 platforms | yes / no |
| Handle convergence: LinkedIn vanity URL changed (or documented why not); Substack URL change decision made (yes/no/deferred) | yes / no |
| Asset audit complete: ≥100 items catalogued with full schema | count |
| Top 20 surfaced pieces published or re-organized into the identity hub, with footer convention applied | count |
| Foundation #2 infographic shipped, completing 1–5 series | yes / no |
| Voice spec doc created and committed at `docs/marketing/voice-spec.md` | yes / no |
| Phase 2 spec drafted (≥1 page) selecting funnel direction based on audit findings | yes / no |

If ≥7 of 9 are met, Phase 1 is judged successful. If <7, identify the blocker and either extend Phase 1 by 1 week or redesign.

---

## 13. Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Audit balloons past 4-hour cap and stalls Phase 1 | high | high | Hard cap. Set a timer. Accept incompleteness. |
| Identity hub becomes a design rabbit-hole | medium | medium | Static HTML, no CMS, no design tools beyond existing BSA brand kit. ≤4h budget. |
| Substack URL migration breaks 60 subs' bookmarks | low | medium | Substack supports redirect; verify before changing. If unsure, defer to Phase 2. |
| LinkedIn vanity URL change rejected (e.g., taken) | low | low | Document as "tried, not possible" in Phase 1 close; brand can survive this. |
| 20-piece surfacing target feels arbitrary; user wants to surface 50 | medium | low | 20 is the forcing function; the rest stays in audit and surfaces during normal cadence |
| User defaults back to "more new writing" instead of surfacing | medium | high | The voice spec doc creation IS the only new writing in Phase 1 — anything else is out-of-scope per §11 |
| Phase 2 decision is forced before Phase 1 audit completes | medium | high | Phase 2 spec is part of Phase 1 verification (#9). It does not get drafted until audit is done. |

---

## 14. Open items requiring user action

**Locked 2026-04-28** (decisions made during user review):

1. ~~Pick the one-breath thesis~~ — **LOCKED: T3a** (*"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*) — see §3.
2. ~~Pick Foundation #2 topic~~ — **LOCKED: *"Anatomy of a Bitcoin Wallet"*** — see §8.2.
3. ~~Confirm hub URL preference~~ — **LOCKED: `bitcoinsovereign.academy/dalia`** — see §4.1.

**Still open** (will be addressed during implementation, can be carried into the implementation plan as plan steps):

4. **Audit format preference** — markdown at `docs/marketing/asset-audit.md` (recommended) vs Notion / Airtable / Google Sheets.
5. **Substack URL change** — proceed in Phase 1 (with redirect verification) OR defer to Phase 2. Your judgment on the risk to existing 60 subs.
6. **Visual mark** — pick one profile photo. Lock for 12 months. (30-min decision.)

---

## 15. Disposition of Plan A and Plan B

- **Plan A** (`2026-04-28-distribution-engine-phase-1-design.md`) — committed `b543c833`. Reclassified as **Phase 2 candidate** (Spanish consumer funnel). Kept as-is; status note added at the top of the doc to clarify.
- **Plan B** (`2026-04-28-distribution-engine-phase-1-design-plan-b.md`) — uncommitted draft. Reclassified as **Phase 2 candidate** (English professional track). Status note added; commit alongside this Phase 1 spec.
- The hybrid (Plan A + Plan B parallel) is also a Phase 2 option, but the audit may reveal a fourth option (Family Bitcoin OS) that beats all three.

Both plans are **informed by but not pre-committing to** Phase 2's direction. Phase 2's actual shape is decided post-audit per §10.

---

## 16. References

- Plan A spec: `docs/superpowers/specs/2026-04-28-distribution-engine-phase-1-design.md`
- Plan B candidate spec: `docs/superpowers/specs/2026-04-28-distribution-engine-phase-1-design-plan-b.md`
- Funnel diagnosis: `reports/funnel-diagnosis-2026-04-27.md` (the upstream context — 190 sessions/month, traffic-not-quality bottleneck)
- Voice spec doc (to be created): `docs/marketing/voice-spec.md`
- Brand articulation (verbatim from user, 2026-04-28): captured in commit messages and conversation history
