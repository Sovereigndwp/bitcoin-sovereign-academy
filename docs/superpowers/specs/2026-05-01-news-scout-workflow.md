# News Scout Workflow — Spec

**Date:** 2026-05-01
**Status:** Draft. Awaiting sign-off on §3 (sources), §4 (themes), §6 (cadence), §7 (output destination).
**Memory ref:** `project_claude_as_production_layer.md`

---

## 1. Goal

A recurring scout that surfaces verifiable, under-covered news items that — when run through Dalia's voice-spec lens — produce posts that are *composable, unique, valuable, epistemic, and first-principles-based*. The niche this enables is **the analyst who connects obscure-but-verifiable news to durable Bitcoin custody / sovereignty primitives**, faster than any other voice in the space.

Not a generic news aggregator. A specialized scout filtered through Dalia's brand thesis (*"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*).

## 2. Why this works as the niche

- **Most Bitcoin commentary** is reactive to mainstream price/regulation news. Saturated, undifferentiated.
- **Most "obscure" Bitcoin news** is shilling or technical-only, not connected to financial-sovereignty implications.
- **The gap:** synthesizing obscure-but-verifiable items into first-principles takes that even mainstream readers can act on. Dalia is one of the few voices with the curriculum + advisory background to make that synthesis credible.
- **Defensibility:** the moat is the *combination* of source breadth + voice-spec discipline. Easy to copy a source list; hard to copy 6 years of accumulated framing + LATAM fluency.

## 3. Source list (propose — trim/extend before sign-off)

**Tier 1 — Verifying primary sources (always cite when relevant):**
- SEC.gov press releases
- CFTC press releases
- FATF / FSB publications
- Federal Reserve speeches/papers
- ECB publications
- LATAM central banks (Banrep CO, BCRP PE, Banxico MX, BCRA AR — public statements)
- BIS quarterly reports
- IRS / tax-authority crypto guidance updates

**Tier 2 — Trusted specialist outlets:**
- Bitcoin Magazine (research/analysis pieces, not press-release reprints)
- CoinDesk Research desk
- The Block research
- Decrypt (EN + ES editions)
- Bloomberg Crypto / Bloomberg Línea
- Reuters Crypto
- Financial Times — capital flows, surveillance pieces

**Tier 3 — Adjacent-discipline signal sources:**
- EFF (Electronic Frontier Foundation) — surveillance, privacy law
- Access Now — digital rights, internet shutdowns
- Privacy International
- Center for Democracy & Technology
- Inter-American Commission on Human Rights — LATAM censorship/privacy
- Open Rights Group

**Tier 4 — Practitioner / under-covered:**
- Stacker News top weekly
- BitMEX Research blog
- Casa, Unchained, Sparrow, Foundation, Coinkite — vendor blogs (custody-relevant only)
- Individual researcher posts (Andreas Antonopoulos, Lyn Alden, Allen Farrington, Pierre Rochard, Nic Carter) — selectively
- Local LATAM publications: Bloomberg Línea, La Política Online (AR), Semana (CO), El Mercurio (CL), Folha de São Paulo (BR)

**Tier 5 — Court rulings + legal news (high-signal, low-volume):**
- CourtListener (US federal cases involving crypto custody / inheritance)
- Stanford CIS (Center for Internet and Society)
- LATAM court rulings on FX/capital controls (judicial-system RSS where available)

Total: ~25 sources across 5 tiers. Scout doesn't poll all every run — uses tier-weighted sampling.

## 4. Theme schema (locked from voice-spec)

Each scouted item is tagged 0–N of these themes. Items with 2+ themes are higher-priority (composability win):

| # | Theme | Voice-spec named pair |
|---|---|---|
| T1 | Custody failure / theft / exchange collapse | MPB pedagogy × HNW client psychology |
| T2 | Surveillance / financial control / CBDC rollout | Cypherpunk ethics × consumer-grade understanding |
| T3 | Inheritance + estate disputes (incl. crypto) | Practical-advisor × first-principles-derivation |
| T4 | LATAM economic event (devaluation, capital flight, dollarization) | LATAM-fluent × English-professional |
| T5 | Regulation shifting custodial vs self-custody risk | All five pairs touch this |
| T6 | Wallet/vendor change (closure, KYC, vulnerability, governance) | MPB pedagogy × cypherpunk ethics |
| T7 | Cross-generational / family-Bitcoin story | Practical-advisor × HNW client psychology |
| T8 | Court ruling on crypto custody / privacy / inheritance | Practical-advisor × cypherpunk ethics |

## 5. Per-item output schema

For every item that makes the digest:

```
### [Headline]

**Source(s):** [primary URL] + [corroborating URL if Tier 1 not available]
**Date:** [publication date]
**Themes:** T2, T5  ← from §4
**Verifiability:** primary-source-citation / multi-outlet-corroboration / single-outlet-only
**Coverage:** under-covered / niche-only / mainstream
**Composability score (1-5):** N
  ← 5 = bridges 3+ named pairs, 1 = bridges 1 weakly

**Why it matters (1 sentence):**
[…]

**Suggested angle for Dalia's voice (2-3 sentences):**
[…what primitive does this derive from; what's the first-principles synthesis;
which existing Dalia content does this connect to (if known)]

**Action proposed:**
- Short Substack post (~600 words) / Infographic (single panel) / Carousel (5 panels) / Skip
- Estimated draft time if pursued: [minutes]
```

## 6. Cadence

Three options:

- (a) **Daily** — 7 AM each weekday. High volume, risk of fatigue/noise. ~25 runs/month.
- (b) **2x/week** — Monday + Thursday mornings. Catches midweek + weekend news. ~9 runs/month.
- (c) **Weekly** — Monday morning, covers prior 7 days. Slowest reaction time but lowest noise. ~4 runs/month.

**Recommend (b)** — matches Dalia's current Substack cadence (1/wk) with margin. Daily is overkill for the content output volume; weekly misses fast-moving stories.

## 7. Output destination

- **File:** `news-scout/YYYY-MM-DD.md` (gitignored or committed; decide).
- **Notification:** none in v1 (scout commits the file; Dalia checks when she opens the repo). v2 could add Slack/email push.
- **Content:** max 5 items per digest. Quality > quantity. If fewer than 3 worthy items found, scout reports "thin week" + dumps what it found at lower confidence.

## 8. Mechanism

- v1: **manual one-off run**, dispatched as a `general-purpose` subagent with the Tier 3+ source list + theme schema + output template baked into the prompt. Output committed to `news-scout/2026-05-01.md` (or whatever date) for review.
- v2 after v1 proves valuable: **scheduled task** via the `anthropic-skills:schedule` skill (cron-backed), running 2x/week per §6 option b.

The reason for v1-manual-first: token cost of a recurring scheduled scout is real, and the prompt design needs at least 2-3 iteration rounds before it's worth automating. Don't schedule something that doesn't work yet.

## 9. Connection to the broader workflow

This scout is the **upstream input** to the production layer (per `project_claude_as_production_layer.md`):

```
News scout digest  →  Dalia picks 1-2 items  →  Claude drafts post or infographic
                                              →  Dalia reviews + ships
                                              →  Closing line / footer applied automatically
```

The scout is *not* the content database (that's the Phase 1 Task 5 asset audit). The scout is the *event stream*; the asset audit is the *memory*. Eventually the two connect — the scout cross-references items against the audit to flag "this news connects to your existing post X." That's a v3 enhancement, not v1.

## 10. What this spec is not

- Not a news-summarization service (e.g., not "summarize today's Bitcoin news"). It's a *filter*, not a digest of everything.
- Not a replacement for Dalia's editorial judgment. The scout proposes; she selects.
- Not a publishing pipeline. Output stops at "draft proposal" — Dalia ships.
- Not the asset-audit / content database. That's Task 5.
- Not real-time. 2x/week cadence is the v2 target; daily-or-faster is unnecessary.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Source list rots (publications change, RSS breaks) | Quarterly source review; treat the source list as a living doc |
| Scout produces low-signal items, Dalia ignores → wasted runs | v1 manual proves value; only schedule if 3+ runs produce something Dalia would have shipped |
| Verifiability check is too lax → Dalia cites bad source → reputation damage | "Verifiability: single-outlet-only" tag is a hard rule; never recommend action on single-outlet items |
| Token cost balloons | Scheduled runs use focused prompt + targeted source list; no broad web crawling |
| News scout becomes the niche, not Dalia's voice | The scout is a tool. The voice is hers. Voice-spec compliance check on every drafted output prevents drift. |

## 12. Sign-off checklist

- [ ] §3 source list — approved, trimmed, or extended
- [ ] §4 theme schema — locked or amended
- [ ] §6 cadence — (a) / (b) / (c) selected
- [ ] §7 output destination — file path agreed; gitignored y/n
- [ ] Run v1 (manual one-off) before any scheduling

When all checked, run v1 and assess.
