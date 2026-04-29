# Distribution Engine — Phase 1 design — **PLAN B (alternative)**

**Date:** 2026-04-28
**Status:** **PHASE 2 CANDIDATE** (2026-04-28). Originally written as an A/B alternative to Plan A. After the brand-direction conversation, both Plan A and Plan B were reclassified as Phase 2 candidates; the active Phase 1 spec is now `2026-04-28-phase-1-identity-convergence.md` (Identity Convergence + Asset Surfacing). Plan B remains a valid Phase 2 option (English professional track). See Phase 1 spec §15 for disposition rationale.
**Purpose:** pressure-test the assumptions baked into Plan A by structuring the same goal from a meaningfully different angle. (Original purpose preserved here — Plan B may be revived as Phase 2 after Phase 1 audit completes.)

---

## TL;DR

**Plan A bets on consumer-track-first, Spanish-primary, captures-driven funnel.**
**Plan B bets on professional-track-first, English-primary, relationship-driven funnel.**

Same goal: ≥1 paid TBA engagement attributable to the funnel by week 8.
Same brand-voice axes (composability + first-principles + epistemic stance).
Same infrastructure stack (Resend, Supabase, Vercel cron, Pandoc).

What differs: **who we capture, how we capture them, what asset we deliver, and whether the lead magnet exists at all in Phase 1.**

---

## 1. Why Plan B exists

Plan A makes six assumptions worth pressure-testing:

| # | Plan A assumes | What if it's wrong? |
|---|---|---|
| A1 | Spanish-Substack conversion rate (60 subs from recent Spanish writing) generalizes and continues to scale | Capture-form flow on a 190-session/month site delivers near-zero leads |
| A2 | Consumer ICP exists in meaningful numbers at $200–$1,500 / engagement | Volume is too low to compound — 1 close/month doesn't build a practice |
| A3 | Lead-magnet → drip → reply funnel works for HNW LATAM | HNW skip lead magnets entirely; only respond to warm intros |
| A4 | MPB + native-Colombian + Spanish-speaker positioning is enough differentiation | The market for this niche is smaller than estimated; saturated by existing voices |
| A5 | The user has 10–15 hours of focused Spanish writing for the 9-chapter PDF | Writing slips, ship date drifts, Phase 1 stalls |
| A6 | The 21-article English custody+inheritance series can run *in parallel* without Plan A absorbing the bandwidth | Spanish writing pulls focus, English series stalls, the user's only converting list (Substack 60) loses momentum |

Plan B inverts the bets. It assumes the professional track (family offices, law firms, tax firms) is the higher-leverage entry point because:

1. **Engagement value** is 5–10× higher per close ($1k–$5k vs $200–$1.5k).
2. **Network effects** — one professional contact who refers can yield 5+ HNW clients over time.
3. **Warm contacts already exist** — the user has named-relationships in family offices, law firms, tax firms. Plan A starts from cold capture.
4. **English asset is in flight** — the 21-article custody+inheritance series is being written. Plan B leverages that work; Plan A asks the user to context-switch to writing 9 new Spanish chapters.
5. **Buying cycle in B2B is slower but more predictable** — replies from peers come on a more consistent timeline than cold consumer leads.

Plan B's own assumptions (B1–B6) are listed in §15 below. Each is an alternative bet, not a "better" bet. The point of writing Plan B is to make both sets of assumptions visible so the user can pick.

---

## 2. Strategic frame — Plan B

### 2.1 Goal of Phase 1 (Plan B)

Convert the user's existing English content effort + warm professional contacts into a structured Adviser lead-funnel where:
- Family offices, law firms, and tax firms get a clear path from "I know Dalia somehow" → "Dalia is the Bitcoin-custody/inheritance person I trust" → "I refer my HNW clients to TBA via Dalia OR I personally engage TBA."
- The 21-article custody+inheritance Substack series is the credibility substrate; warm-contact playbook is the primary funnel; English briefing PDF is the eventual lead magnet.
- Spanish consumer track is **deferred to Phase 2** — the MPB + native-Colombian niche doesn't expire; it can be built when the higher-leverage B2B funnel is yielding.

### 2.2 ICPs (inverted from Plan A)

**Primary — professional track (English):** Family offices, law firms (estate planning, civil-law inheritance specialists), tax firms. The user already has warm contacts in this segment. Both direct clients (principals personally hold BTC) AND referral channels (their HNW clients need TBA). $1k–$5k / engagement, recurring possible. **Phase 1 is built around this ICP.**

**Secondary — consumer track (Spanish):** LATAM upper-middle-class business owners — the same ICP that's primary in Plan A. **Plan B addresses this in Phase 2 only**, after the professional funnel has proven (or disproven) itself.

### 2.3 Wedge / thesis (English, professional register)

Plan A's wedge (W3, Spanish): *"Tu Bitcoin es tuyo cuando lo reconocen tu notario, tu código, y el riesgo jurisdiccional al mismo tiempo."*

Plan B's wedge (English, professional, first-principles + composable + invitational):

**W3-EN candidate 1:** *"Bitcoin custody is an inheritance instrument waiting to be designed properly. Most isn't."* — bridges legal × technical × estate planning.

**W3-EN candidate 2:** *"For HNW clients, Bitcoin self-custody is not a security choice — it's a legal-recognition choice, a counterparty-risk choice, and a jurisdictional-resilience choice. Each lens implies a different architecture."* — more verbose, but more obviously composable on first reading. Better for an opening line in a briefing.

**W3-EN candidate 3:** *"What does it mean for a client to 'own' Bitcoin? Three answers — legal, cryptographic, jurisdictional — and they don't always agree."* — most invitational, most professional register.

Recommended: **candidate 3** for use in the briefing intro and warm-contact templates; **candidate 1** as the punchier social-channel hook.

### 2.4 Brand asset stack (reordered for English/professional audience)

1. *"Bitcoin Adviser, TheBitcoinAdviser.com — collaborative 1-of-3 multisig custody"* — **front and center for professional track** (Plan A had this as #2)
2. *"Wrote the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin)"* — credibility, but secondary in English contexts
3. **Bitcoin Sovereign Academy** — free curriculum (English modules are the relevant ones for this audience)
4. *"Native Colombian, only Spanish-speaking adviser at TBA"* — niche credential, useful in LATAM-adjacent professional conversations (Miami, NYC family offices with LATAM exposure)
5. **Financially Sovereign Academy + Mi Primer Bitcoin Diploma curriculum credit** — combined as evidence of "this person teaches because they understand, not because they sell"

### 2.5 Voice constraints — same as Plan A, enforced per-artifact

The three orthogonal axes (composability + first-principles + epistemic stance) and the three-part synthesis check apply identically in Plan B. The voice spec doc (`docs/marketing/voice-spec.md`) is shared between both plans — only the *application* differs (English/professional register instead of Spanish/consumer register).

The 5 named domain pairs are unchanged. Plan B shifts which pairs each artifact most often bridges:
- Plan A's lead magnet leans heavily on pair #5 (custodial/counterparty × LATAM jurisdictional) + pair #1 (custody × LATAM legal).
- Plan B's briefing leans on pair #1 (custody × civil-law inheritance — broader than just LATAM) + pair #4 (cypherpunk ethics × family-office discretion) + pair #3 (sovereignty × pragmatism).

**Per-artifact enforcement in Plan B:**

Every Plan B artifact passes the three-part synthesis check (Plan A §1.5) before publication. Concretely:

| Artifact | Composability check | First-principles check | Epistemic check |
|---|---|---|---|
| Substack EN article (21-series) | Bridges ≥1 of the 5 named pairs (mostly #1, #3, #4 for professional audience) | Defines primitives (legal structure, custody model, signature requirements) before any argument; derivations shown step-by-step | Includes "another perspective" / counter-argument; uses questions/frames in titles; cites sources |
| **Infographic (wallet series)** | Same — visual elements pair across domains | Each visual element grounded in a defined primitive — e.g., "private key" labeled and defined before any custody claim | Includes a "where this framing might be wrong" note in the caption or accompanying article |
| LinkedIn EN post / carousel | Same — bridges named pair in the hook | Lead with primitive definition or framing question; derivation visible in the post or carousel slides | Opens with a question, not a verdict; CTA is invitational *("Curious how you'd approach it")* |
| Warm-contact email | Specific composable bridge for the contact's role (tax-firm → pair #1; family-office → pair #4; etc.) | Reasons from the underlying mechanism, not from authority phrasing (no *"experts agree"*, no *"Saylor says"*) | *"Curious how you'd approach it"* — invitation, not pitch |
| Briefing PDF (Phase 1.5) | Each section bridges ≥1 named pair | Each chapter starts with *"The primitives"* — direct inheritance of Plan A §2.2 chapter structure | Mandatory *"another perspective"* + *"where I might be wrong"* sections per chapter |

Drafts that fail any check are flagged by the repurposer (§5) and rewritten before publishing. Failure here is a hard stop — voice consistency is non-negotiable in both plans.

### 2.6 Language tracks (Plan B)

| Channel | Language | Cadence | Role |
|---|---|---|---|
| Substack EN | English | 1/wk (continue + finish 21-article series) | **Primary asset — Plan B's foundation** |
| Substack ES | Spanish | none in Phase 1 (deferred) | Phase 2 |
| LinkedIn | English | 2/wk | Repurposed from Substack EN — primary B2B social channel |
| X | English | 1–2/wk | Credibility broadcast |
| WhatsApp warm group | — | none in Phase 1 | Phase 2 — re-activate when consumer track ships |
| Apollo outreach | — | none in Phase 1 | Phase 2 |

Note: Plan B reduces the *visible* surface area in Phase 1. The user's effort concentrates on (a) the 21-article series, (b) repurposing each piece into LinkedIn + X, (c) the warm-contact playbook. Spanish channels and the WhatsApp group do not require active work in Phase 1.

### 2.7 Funnel terminus — single CTA, professional register

Plan A had two CTAs by track. Plan B has only one in Phase 1 (consumer track is deferred):

**Professional CTA:** *"Reply if you'd like a 20-min peer call to compare notes. No agenda — I'm curious how you're thinking about [X-topic-from-the-piece]."*

This is the CTA in Substack pieces, LinkedIn posts, warm-contact emails, and (eventually) drip emails when the briefing PDF ships.

The literal "Book a Consult" button on TheBitcoinAdviser.com remains for self-qualifiers, never the primary CTA.

---

## 3. Phase 1 components — Plan B

Plan B has **three** components in Phase 1 (Plan A had four):

| # | Component | Status |
|---|---|---|
| 1 | **Voice spec doc** | Same as Plan A. Shared. `docs/marketing/voice-spec.md`. |
| 2 | **Repurposer script + LinkedIn-first cadence** | Same script as Plan A (`scripts/syndicate.mjs`), but English-source canonical and LinkedIn as the highest-priority output channel. |
| 3 | **Warm-contact playbook — PRIMARY funnel** | Expanded from Plan A's secondary role. More templates, higher cadence, explicit relationship-funnel structure. |

**Notably missing in Plan B Phase 1:**
- ❌ Spanish lead magnet PDF (deferred to Phase 2)
- ❌ Site-embedded capture form (no PDF means no capture-and-deliver flow)
- ❌ Resend + Supabase drip infrastructure (deferred — only needed when the briefing PDF ships)
- ❌ Vercel cron drip endpoint
- ❌ Substack opt-in migration post (60 Spanish subs stay on Substack-native; revisited in Phase 2)

This is **structurally smaller than Plan A**. Phase 1 is a doc + a script + a rhythm. The English briefing PDF is **Phase 1.5** — it ships when the 21-article series is substantially complete, at which point the capture-form + drip infrastructure gets built, mirroring Plan A's plumbing but for English/professional audience.

---

## 4. Component 1 — Voice spec doc

Same as Plan A §8. `docs/marketing/voice-spec.md`. Shared between both plans.

The L1 outline that Plan A spec referenced (the 9-chapter Spanish PDF) is **out of scope in Plan B Phase 1**. The voice spec doc still includes it, marked as "Phase 2 / Plan A artifact."

---

## 5. Component 2 — Repurposer script + cadence

### 5.1 Script

Same as Plan A §5. `scripts/syndicate.mjs`. No code differences.

### 5.2 Cadence (Plan B-specific)

For each new English Substack post in the 21-article series:

1. User publishes Substack EN piece (canonical source).
2. User runs `node scripts/syndicate.mjs --source <substack-url> --source-lang en`.
3. Outbox dir gets:
   - `linkedin-en.md` (priority — primary distribution channel for professional audience)
   - `x-thread.md` (credibility broadcast)
   - `nostr.md` (skip in Plan B — Plan A noted Nostr is sub-zero ROI; Plan B doesn't pretend otherwise)
   - `substack-es.md` — **generated but not published in Phase 1.** Saved for Phase 2 when consumer track ships.
4. User edits + publishes LinkedIn EN + X within 24h of Substack post.

### 5.3 LinkedIn as primary B2B channel

Plan A's LinkedIn was bilingual, alternating Spanish/English. Plan B's LinkedIn is **English-primary, professional-register**. Each post:
- Opens with a question (epistemic stance §1.7)
- Derives the argument from primitives (first-principles §1.6)
- Links to the corresponding Substack piece for depth
- Ends with the professional CTA (*"Curious how you're thinking about this — reply or DM."*)

Repurposer prompt is updated for Plan B to include a LinkedIn-specific instruction: *"Output should pass a 'would a tax-firm partner read this without rolling their eyes?' test. No emojis, no growth-hack hooks, no 'breakdown' threads."*

---

## 6. Component 3 — Warm-contact playbook — PRIMARY funnel

This is the heart of Plan B Phase 1.

### 6.1 Path

`docs/marketing/warm-contacts.md` (same path as Plan A, expanded scope)

### 6.2 Structure (expanded from Plan A §7)

```markdown
# Warm contacts — playbook (PRIMARY FUNNEL)

## Tracking table (extended)

| Name | Firm | Role | Lang | Last touch | Status | Hypothesis | Mutual? | Next step | Notes |
|---|---|---|---|---|---|---|---|---|---|

## Status taxonomy

- cold | warming | responding | meeting-scheduled | met | referred-client | personal-client | passed | nurture-only

## Email templates (12 total: 6 categories × {EN warm-intro / EN cold-with-mutual})

1. **Reconnect after long gap** — warm relationship, no recent touch
2. **Share the series** — "I've been writing X. Thought of you because Y. No ask."
3. **Follow up on a previous conversation** — references something the contact previously said
4. **Mutual-connection intro** — when a third party introduces you (or you mention them)
5. **Industry-event follow-up** — met at a conference / panel / dinner
6. **Direct value-offer** — "I noticed your firm mentions Bitcoin in [public artifact]. Here's how I think about [specific thing]. Curious if you've thought about [X]."

Each template has EN warm + EN cold-with-mutual versions = 12 templates.

## Cadence

**3–4 contacts/week** (vs Plan A's 2/week — because warm-contact outreach is the PRIMARY funnel, not secondary).
Quality over volume still applies — each email is custom-tailored using the template as a starting point, not a fill-in-the-blanks form.

## Tracking

Status updates manually each Friday. Commit changes weekly.

## What "yielding" looks like

- Week 4: ≥5 of the 30 known warm contacts touched, ≥3 replies, ≥1 meeting booked.
- Week 8: ≥15 contacts touched, ≥8 replies, ≥4 meetings, ≥1 paid TBA engagement attributable.

If week-8 outcome metric fails, Plan B Phase 1 is judged not working. Triggers:
either (a) revisit Plan A as Phase 1, or (b) redesign Plan B based on what week-8 data revealed.
```

### 6.3 Editorial constraints in templates

Same as Plan A §7.5. Templates offer perspective, not conclusions; reason from primitives, not authority; include explicit invitation to disagree or share a different view; avoid sales-language verbs and urgency manipulation.

Composability matters more in Plan B's templates than Plan A's, because professional readers detect generic outreach instantly. Each warm-contact email should reference a specific composable bridge (e.g., for a tax-firm contact: pair #1 (custody × inheritance practice) — *"Curious how your team handles the intersection of estate-tax filings and self-custody right now. I've been writing about this and would love your read."*).

### 6.4 No automation

Same as Plan A. Doc + rhythm, not a tool. The user runs the cadence weekly.

---

## 7. Privacy architecture

Same as Plan A §6. Even though Plan B Phase 1 doesn't ship the drip/capture infrastructure, the privacy stance is brand-wide. When briefing PDF + drip ship in Phase 1.5, all of Plan A §6 applies.

---

## 8. Data flow (Plan B Phase 1)

```
User publishes Substack EN piece (one of the 21-article series)
  → User runs scripts/syndicate.mjs
    → Outbox: linkedin-en.md (priority), x-thread.md, [substack-es.md saved for Phase 2]
  → User reviews + edits + publishes LinkedIn EN + X within 24h
    → LinkedIn impressions reach professional warm contacts organically

Each Friday: user opens docs/marketing/warm-contacts.md
  → Reviews tracking table, picks 3–4 contacts to touch this week
  → For each: picks template, customizes (specific composable bridge for that contact's role)
  → Sends from personal email client
  → Updates Last-touch + Status columns
  → Commits changes

Reply lands in user's inbox
  → Conversation → 20-min peer call → follow-up
  → Conversation either converts (referral or direct engagement)
    OR reaches "nurture-only" status (parked, periodic touch)
```

No automated capture/drip in Phase 1. The funnel is fully manual + relationship-driven.

---

## 9. Verification — Plan B success criteria

| Metric | Week 4 target | Week 8 target |
|---|---|---|
| Substack EN articles published in 21-series | ≥4 | ≥8 |
| LinkedIn EN posts published | ≥4 | ≥8 |
| Warm contacts touched | ≥5 | ≥15 |
| Replies | ≥3 | ≥8 |
| Meetings booked | ≥1 | ≥4 |
| Substack EN subs (organic from LinkedIn referral) | +5 | +20 |
| **Outcome:** paid TBA engagements OR referrals attributable to funnel | 0 acceptable | **≥1 required** |

If week-8 outcome metric fails, Plan B is judged not working.
**Decision rule:** if Plan B fails at week 8, do not silently switch to Plan A — explicitly choose between (a) reviving Plan A with the lessons learned, or (b) redesigning Plan B.

---

## 10. Risks — Plan B specific

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Warm contacts ghost or take 6+ months to respond | medium | high | Cadence rule: max 3-4/week; nurture-only category for non-responders; widen the warm list as a pre-Phase-1 task (target 30+ contacts before week 1) |
| 21-article series stalls; no fresh asset to anchor outreach | medium | high | Series writing is on the user's calendar weekly; series 1/wk is a non-negotiable Plan B precondition |
| Professional CTA ("20-min peer call") feels too transactional | low | medium | A/B test wording across the first 5 sends; iterate after observing replies |
| LinkedIn algorithm suppresses the user's posts; reach drops | medium | medium | Cross-post to X + Substack; LinkedIn is a channel not a dependency |
| Plan B succeeds at meetings but no TBA conversions by week 8 | low | high | The peer-call → engagement conversion is itself a learning signal; if 5+ meetings yield 0 engagements, the offer needs rework not the funnel |
| The user's existing warm-contact list is smaller than estimated | medium | medium | Audit list pre-Phase-1 (target: ≥30 named warm contacts); if <20, flag as a Plan B blocker |

---

## 11. Critical assumption — 21-article series timeline

This is the single biggest dependency in Plan B.

**Pre-flight check before committing to Plan B:**
- How many of the 21 articles are already published?
- How many are drafted but unpublished?
- What's the realistic per-week cadence for the remaining articles?

**Decision rule:**
- If ≥10/21 are published → Plan B is shippable, the briefing PDF is ~10 weeks out.
- If 5–9/21 are published → Plan B is viable but the briefing PDF lands beyond week 8; Phase 1 ships without a lead magnet, judged on warm-contact funnel alone.
- If <5/21 are published → Plan B is premature. The series must run for 2–3 months before Plan B has enough credibility substrate. Either delay Plan B or revisit Plan A.

This is the user's call. The number is private to the user.

---

## 12. Phase 1.5 — when the briefing PDF ships

Once the 21-article series is substantially complete (~15+ of 21 articles published), Plan B activates Phase 1.5:

1. Compile the series into a single English briefing PDF, ~30–40 pages, professional register.
2. Add executive summary, decision framework, technical appendix.
3. Ship the same capture/drip/Resend infrastructure Plan A specifies in §3-§4 — but English, professional drip subjects, longer cadence (Day 0/4/9/14/21 instead of 0/2/5/8/12).
4. Capture surfaces: BSA English module footers, dedicated landing `/briefing/`, LinkedIn article CTAs, warm-contact emails as an alternate-asset.

Phase 1.5 = Plan A's infrastructure, English, professional register. The infrastructure investment compounds because it can later support Phase 2 Spanish track without additional engineering.

---

## 13. Out of scope (Phase 2+)

Explicitly **not** in Plan B Phase 1, listed so they don't slip in:

- **The entire Plan A consumer track** — Spanish lead magnet PDF, Spanish drip, BSA Spanish-module capture forms, BSA Spanish-modal homepage, WhatsApp content engagement, Substack-migration post. All deferred to Phase 2.
- Apollo cold prospecting (deferred — same as Plan A).
- Programmatic SEO landing pages.
- FSA Spanish localization.
- FSA Employer Program funnel.
- Nostr (zero ROI — explicitly skipped, not deferred).

---

## 14. Open items requiring user action

1. **Pre-flight: count the 21-article series state.** How many published? How many drafted? See §11.
2. **Pre-flight: audit the warm-contact list.** Target ≥30 named, named-firm-and-role contacts. If <20, Plan B has a structural problem.
3. **Pick a wedge variant** — W3-EN candidate 1, 2, or 3 (see §2.3) for the briefing's eventual intro and the warm-contact templates.
4. **Verify `dalia@bitcoinsovereign.academy` works** — same Plan A item, but only blocking when Phase 1.5 ships, not Phase 1.

---

## 15. Plan B's own assumptions (for symmetry with §1)

For the user to make a fair A/B comparison, Plan B's bets should be as visible as Plan A's:

| # | Plan B assumes | What if it's wrong? |
|---|---|---|
| B1 | The user has ≥20 named warm contacts in family offices / law / tax firms | Funnel has insufficient input; ship is impossible |
| B2 | Warm contacts respond at ≥30% within 4 weeks of a thoughtful outreach | Funnel runs dry; ≥15 touches → ≥8 replies target misses |
| B3 | The 21-article series can run at 1/week without Plan B's other work absorbing focus | Series stalls, the credibility substrate doesn't grow |
| B4 | Family offices / law / tax firms read English Substack pieces and LinkedIn posts at meaningful rates | Distribution dies on arrival; warm-contact-only funnel becomes the entire bet |
| B5 | Professional buying cycles can produce ≥1 paid engagement within 8 weeks | Plan B fails on its own outcome metric, even if all leading indicators look healthy |
| B6 | Spanish consumer track really *can* wait — the niche doesn't erode while attention is elsewhere | Mi Primer Bitcoin / native-Colombian moat erodes faster than anticipated; Phase 2 starts from weaker ground |

---

## 16. Comparison table — Plan A vs Plan B (side-by-side)

| Dimension | Plan A | Plan B |
|---|---|---|
| **Primary ICP** | LATAM upper-middle-class business owners (consumer) | Family offices, law firms, tax firms (professional) |
| **Primary language** | Spanish | English |
| **Lead magnet in Phase 1** | "Tu Bitcoin no es tuyo aún" — 9-chapter Spanish PDF, ~10–12 pp | None in Phase 1; English briefing PDF in Phase 1.5 |
| **Capture mechanism** | Site-embedded form → Resend → Supabase → 5-email drip | Warm-contact replies → manual qualification |
| **Funnel shape** | Cold lead → drip → soft CTA → consult | Warm contact → conversation → 20-min peer call → engagement or referral |
| **CTA** | Two by track ("Responde…" ES, "Reply if you'd like…" EN) | One ("Reply if you'd like a 20-min peer call to compare notes.") |
| **New writing required** | 9-chapter Spanish PDF (10–15h) + 5 drip emails (~3h) | LinkedIn drafts + warm-contact emails (~5–8h, leverages existing series) |
| **Existing-asset leverage** | BSA Spanish modules + 60 Substack subs (small) | 21-article series + ~30 warm contacts + 1,000 LinkedIn followers + 800 X (large) |
| **Engineering build** | Capture form + /api/subscribe + Supabase migration + drip cron + Pandoc PDF build | Repurposer script (shared with Plan A) only |
| **Volume-of-leads philosophy** | Higher-volume / lower-touch — capture, drip, qualify | Lower-volume / higher-touch — warm intro, conversation, engagement |
| **Engagement size** | $200–$1,500 per | $1k–$5k per (+ recurring possible) |
| **Volume needed for ≥1 paid engagement** | ~10–40 captures × 5–10% drip-completion × 5–10% reply × small close rate | ~15 warm touches × 50% reply × 50% meeting × small close rate |
| **Time to first signal** | 4 weeks (drip cycles complete; first replies possible) | 2 weeks (first warm replies possible) |
| **Failure mode** | Capture rate too low; drip never gets enough volume | Warm contacts too few or too slow to respond |
| **Composability deployed where** | PDF chapters bridging pair #5 + secondary pairs | Briefing sections + LinkedIn posts + warm-contact emails bridging pairs #1, #3, #4 |
| **Upside if it works** | Repeatable consumer-funnel infrastructure that compounds | Network of professional referrers — a moat once built |
| **Risk profile** | Many small bets; needs volume to converge | Fewer larger bets; needs only a few wins to validate |

---

## 17. Recommendation framework — when to pick Plan A vs Plan B

This is **for the user to decide**, not the spec to dictate. The framework:

**Pick Plan A if:**
- The 21-article series is <10/21 published (Plan B's substrate isn't ready)
- The user prefers building infrastructure that compounds over a longer horizon
- The user's available focus time is in coherent multi-hour blocks (PDF writing requires deep work)
- The Spanish-Substack conversion rate is the user's strongest existing signal and it should be doubled-down on

**Pick Plan B if:**
- The 21-article series is ≥10/21 published (Plan B's substrate exists)
- The user has ≥20 named warm contacts in family offices / law / tax firms
- The user prefers shorter time-to-signal (warm replies in week 2 vs drip cycles completing week 4)
- The user is willing to accept a smaller, slower-cycling funnel in exchange for higher-value engagements

**Pick a hybrid if:**
- The user wants to keep the 21-article series running (Plan B's core) AND pre-build Plan A's PDF in parallel as a Phase 1.5 artifact.
- This is the "have your cake and eat it" version, but it requires more focus time. Honest constraint: Plan B + Plan A in parallel is not Phase 1; it's Phase 1 + Phase 1.5 stacked.

---

## 18. Self-review notes

This Plan B was written *after* Plan A was committed. It is a deliberate exercise in pressure-testing Plan A's assumptions, not an alternative I prefer over it. Both plans are internally consistent designs for the same goal. The user's correct move is to pick the one whose *assumptions* (§1 + §15) align with their actual situation (warm-contact list size, 21-article series state, available focus time, Spanish-vs-English audience truth).

A genuinely first-principles question worth flagging: **Phase 1 might not be either plan as written.** A more honest Phase 1 might be a 2-week pre-flight that gathers the data needed to choose between them — count the 21-article series, audit the warm-contact list, ask 3 warm contacts whether they'd read a briefing PDF — and *then* commit to A or B. That pre-flight is itself a small project (~3–5h) and could be valuable as an explicit Phase 0.

The user can ignore this note or treat it as Plan C.
