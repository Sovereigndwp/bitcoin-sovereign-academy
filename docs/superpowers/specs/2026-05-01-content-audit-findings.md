# Content audit — findings

**Status:** Audit complete (Phase 1). Awaiting decisions on open questions before Phase 2 cleanup spec.
**Date:** 2026-05-01
**Sub-project:** #2.5 of 8 (foundation for the makeover arc)
**Scope:** Read-only inventory across all 3 repos — `bitcoin-sovereign-academy` (BSA), `financially-sovereign-academy` (FSA), `sovereign-academy-hub` (hub / thesovereign.academy).
**Method:** 3 parallel Explore-agent passes, one per repo, with a shared 5-category checklist (footers, taglines, identity/value-prop, Spanish/EN mismatches, page metadata).
**References:** [`docs/marketing/voice-spec.md`](docs/marketing/voice-spec.md), [`docs/superpowers/specs/2026-05-01-footer-convention.md`](docs/superpowers/specs/2026-05-01-footer-convention.md), [`docs/superpowers/specs/2026-05-01-visual-brand-system-design.md`](docs/superpowers/specs/2026-05-01-visual-brand-system-design.md).

---

## 1. Why this audit exists

Sub-projects #3–6 redesign the homepages and cascade visual changes across 387 files. Before that work begins, the content baseline needs to converge. Today the 3 repos contain footer variants, tagline divergences, audience-positioning drift, and metadata gaps that would either:

- Be re-baked into the new templates if not cleaned first, or
- Get accidentally "fixed" mid-cascade, mixing visual changes with content edits and making rollback hard.

This audit is the inventory. The cleanup itself is gated on decisions in §6 below.

## 2. Cross-repo patterns (the big stuff)

### 2.1 Footer divergence is the #1 issue

Per `2026-05-01-footer-convention.md`, the locked closing line is:
- EN: `Created by Dalia · bitcoinsovereign.academy` (or the corresponding domain per repo)
- ES: `Creado por Dalia · bitcoinsovereign.academy`

**Reality across all 3 repos:**

| Repo | Compliant | Non-compliant variants | No footer at all |
|---|---|---|---|
| BSA | small minority (path modules, deep dives) | 12 files (institutional × 5, youth-families, wealth-advisors/index, programa-colombia × 2, fsa/, certificates × 1 client-branded) | partial pages (logo-explorations) |
| FSA | 0 fully-compliant footers found | 2 files (homepage uses "Sovereign Academy Network", programa-colombia/index uses ES copyright without Dalia attribution) | **22 strategic pages** — all 14 modules, 7 calculators, my-journey |
| Hub | 0 | 3 files (index, institutional/index, directory had no footer entirely) | bitcoin-first-principles.html (status unknown — likely missing) |

**Pattern:** The footer convention spec exists but has never been rolled out. Sub-project #7 (footer rollout) was deferred until after the makeover; this audit confirms the rollout is required as a *prerequisite* to the cascade rather than a follow-up. (Or the cleanup pass itself accomplishes the rollout — see §6.)

### 2.2 Entity-name confusion across the system

A surprise finding. "The Sovereign Academy" appears as the copyright entity in places it shouldn't:

- **BSA institutional pages × 5** say `© 2026 The Sovereign Academy` (should be `Bitcoin Sovereign Academy` or per locked convention drop the entity entirely).
- **FSA articles + answers** schema and bylines say `Dalia Platt | The Sovereign Academy` (should be `Financially Sovereign Academy`).
- **FSA homepage** says `© 2026 Sovereign Academy Network` (a third variant).
- **Hub** correctly says `The Sovereign Academy` because the hub *is* The Sovereign Academy.

Implies an unstated rule needs locking: **the umbrella entity is `The Sovereign Academy` (the hub, thesovereign.academy). Each sub-site uses its own entity (`Bitcoin Sovereign Academy`, `Financially Sovereign Academy`) within its own domain.** The locked footer convention *avoids* the entity-name question by using domain attribution; if any page does include a copyright entity, it must match the site it lives on.

### 2.3 BSA hero tagline drift

Locked tagline (per CLAUDE.md): `Don't Trust, Verify.`

Reality:
- **BSA homepage h1** (`index.html:3179`): `Master Bitcoin. Leave the Confusion Behind.`
- **BSA about.html hero** (`about.html:162`): `Master Bitcoin through experience, not just theory.`
- **~60+ pages share an og:description** that uses `Master Bitcoin through interactive experiences…` instead of the locked tagline or the locked identity line.
- **Locked tagline appears in only ~11 files**, mostly inside `paths/sovereign/` and `deep-dives/`.

**This needs a decision** (§6.A) — `Don't Trust, Verify.` may be the *brand line* (used in footer / meta / hero subline) rather than the *page h1*. The current state isn't a direct violation if h1s are page-specific value props; it's a violation if the tagline is supposed to be the homepage hero.

### 2.4 Identity-line erosion (audience positioning conflict)

Locked identity line: `Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.`

Conflicts found:
- `BSA about.html:199` — `Free education for everyone, everywhere`
- `BSA index.html:138` (schema.org) — `Complete Bitcoin education for beginners starting from scratch`
- `BSA index.html:3997` — `Perfect for beginners who want structure and guidance`
- `Hub index.html:592` — BSA card describes BSA without "families and advisors" or "inheritance" anywhere
- `Hub institutional/index.html:112` — BSA institutional positioning is "treasury allocation, employee benefits…" (corporate, not family-advisor)
- `Hub directory.html:195` — BSA = "complete beginner to technical sovereignty" (audience-blank)

**This needs a decision** (§6.B) — either the locked identity is the source of truth and these need to converge (lossy migration — drops the "for everyone" and "beginners" content), or the locked identity is the *advisor-anchor* and other pages legitimately serve adjacent audiences. The current state is incoherent because the lock claims primacy but the surfaces don't reflect it.

### 2.5 FSA tagline + audience are unlocked

FSA's locked positioning (per CLAUDE.md): mission-driven, underbanked focus, explicitly not monetized.

Reality:
- **No locked tagline.** Homepage h1: `Take Control of Your Financial Future`. Hero subtitle leans advisor-fee-savings: `Learn what financial advisors charge 1-2% annually to know. Keep the fees. Gain the knowledge.` (Strong copy, but not locked anywhere.)
- **No locked audience line.** Homepage frames as `the 10 fundamentals everyone needs` (universal), hub frames it the same way. Underbanked positioning isn't surfaced anywhere except internal docs.
- **Programa Colombia** frames as `evitar errores costosos / estabilidad financiera` — closer to underbanked literacy, but still not explicit.

**This needs a decision** (§6.C) — lock an FSA tagline + audience line, or accept FSA stays homepage-driven without a locked brand line.

### 2.6 Metadata gaps concentrated in FSA + hub

| Repo | Pages missing OG tags | Pages missing canonical | Notes |
|---|---|---|---|
| BSA | most demos use templated copy (acceptable; not a defect) | clean | 1 typo: `about.html` og:description says "about about" |
| FSA | ~22 pages (all 14 modules, all 7 calculators, my-journey, some articles, institutional) | same ~22 pages | strategic SEO gap |
| Hub | directory.html, institutional/index.html, bitcoin-first-principles.html | bitcoin-first-principles.html | `bitcoin-first-principles.html` has zero metadata |

### 2.7 Spanish coverage asymmetry

- **BSA Spanish** (`paths/curious/stage-1/es/`, `programa-colombia/`): clean — 0 user-facing English strings in Spanish pages. ✓
- **FSA Spanish**: only `programa-colombia/` exists. Core academy (modules, calculators, articles, answers, my-journey) is English-only.

This isn't a *defect* — it's a known asymmetric architecture (Colombia program is intentionally separate). Flagging so the makeover doesn't accidentally promise bilingual parity it can't deliver.

## 3. Per-repo findings

### 3.1 BSA (`/Users/dalia/projects/bitcoin-sovereign-academy`)

**Footer variants — 12 files:**
- `institutional/corporations.html:266`, `institutional/wealth-advisors.html:241`, `institutional/cities.html:236`, `institutional/education.html:236`, `institutional/correctional.html:236` — all: `© 2026 The Sovereign Academy · Educational content only · Not financial advice` (entity name wrong)
- `youth-families/index.html:677` — same string with bullet (`•`) instead of middle dot (`·`)
- `institutional/wealth-advisors/index.html:1090` — `© 2026 Bitcoin Sovereign Academy · Professional Bitcoin education for financial advisors · Not investment advice` (right entity, wrong message)
- `programa-colombia/index.html:550` — `© 2026 Financially Sovereign Academy · Contenido educativo únicamente · No es consejo financiero` (cross-domain entity)
- `institutional/corporations/colombia/index.html:372` — same as above (cross-domain entity)
- `fsa/index.html:382` — `© 2026 Financially Sovereign Academy. All rights reserved.` (cross-domain + wrong format)
- `dalia/logo-explorations.html` — uses `Created by Dalia | bitcoinsovereign.academy` (close to locked, but pipe instead of middle dot)
- `certificates/branded_certificate_page.html:143` — Oakwood-branded; per spec §3.6 excluded.

**Tagline conflicts:**
- `index.html:3179` (h1): `Master Bitcoin. Leave the Confusion Behind.`
- `about.html:162` (hero): `Master Bitcoin through experience, not just theory.`
- ~60+ pages share `Master Bitcoin…` og:description.

**Identity / audience conflicts:**
- `about.html:199` (Core Values): "Free education for everyone, everywhere"
- `about.html:167` ("🎯 Our Mission"): custom mission section, no "families and advisors"
- `index.html:138` (schema.org): "for beginners starting from scratch"
- `index.html:3997`: "Perfect for beginners who want structure and guidance"

**Metadata:**
- `about.html:130` og:description typo: `Learn about about at Bitcoin Sovereign Academy…`
- `pricing.html` redirect — acceptable.
- Templated `Master Bitcoin…` og:description on ~60 demo/path pages (not a defect, but doesn't reinforce the lock).

**Spanish:** clean. ✓

### 3.2 FSA (`/Users/dalia/projects/financially-sovereign-academy`)

**Footer issues — 24 hits:**
- `index.html:1203`: `© 2026 Sovereign Academy Network. Educational content only.` (third entity name)
- `programa-colombia/index.html:550`: ES copyright without `Creado por Dalia` attribution.
- **22 pages with NO footer at all:** all 14 modules (`modules/*.html`), all 7 calculators (`calculators/*.html` including index), `my-journey.html`.

**Tagline / hero (no lock yet):**
- Homepage h1: `Take Control of Your Financial Future`
- Hero subtitle: `Learn what financial advisors charge 1-2% annually to know. Keep the fees. Gain the knowledge.`
- All 14 modules use generic `Module N: [Title]` pattern with no unifying tagline.

**Mission / value-prop:**
- `index.html:243` master definition: `…free, interactive online financial education platform. It teaches the 10 core money fundamentals everyone needs…`
- Value props: "Interactive, Not Lectures" / "Personalized Learning" / "Honest About Trade-offs" / "Real Scenarios". Strong.
- Underbanked / equity framing: not present in core copy. Programa Colombia frames as "estabilidad financiera" — closest existing approximation.

**Branding inconsistency:**
- `articles/*.html` byline (line ~42): `By Dalia Platt | The Sovereign Academy`
- `answers/*.html` schema (line ~13): `"name": "Dalia Platt"` under `The Sovereign Academy`
- Homepage + modules + institutional: `Financially Sovereign Academy`
- → Articles + answers say umbrella entity; rest say sub-site entity.

**Metadata:**
- ~22 pages missing OG tags (all modules, calculators, my-journey, some articles/answers/institutional).
- ~22 pages missing canonical.

**Spanish:** programa-colombia full coverage; core academy 0%. Architectural, not a defect.

### 3.3 Hub (`/Users/dalia/projects/sovereign-academy-hub`)

**Repo orientation:** 4-file static site, all styles inline (confirms spec §1's "ad-hoc inline styling"). Files: `index.html`, `directory.html`, `institutional/index.html`, `bitcoin-first-principles.html`.

**Footer:**
- `index.html:644`: `© 2026 Sovereign Academy. Educational content only. Not financial advice.` — missing `Created by Dalia` attribution.
- `institutional/index.html:136`: `© 2026 The Sovereign Academy · Educational content only · Not financial advice` — same.
- `directory.html`: no footer at all.
- `bitcoin-first-principles.html`: footer status unknown / likely missing.

**Tagline / hero:**
- `index.html` `<title>`: `The Sovereign Academy | Master Money. Master Bitcoin. Master Life.` (de-facto hub tagline, not yet documented as locked)
- `index.html` h1: `The Sovereign Academy`
- `index.html` hero subtitle: `Master your financial future. Choose your path.`

**BSA / FSA descriptions on hub:**
- `index.html:554` (FSA card): `Learn universal financial literacy. Budgeting, saving, investing, taxes, debt strategy, and building true wealth. For everyone.`
- `index.html:592` (BSA card): `Deep Bitcoin mastery. Technical fundamentals, self-custody, privacy, security, and becoming truly sovereign with Bitcoin.` — **strips the locked BSA identity line entirely.**
- `institutional/index.html:97` (FSA institutional): "for any institutional audience" — generic.
- `institutional/index.html:112` (BSA institutional): "treasury allocation, employee benefits, custody, policy literacy" — corporate frame, no families/advisors.
- `directory.html:151` (FSA): "Master the 10 fundamentals…" — universal.
- `directory.html:195` (BSA): "complete beginner to technical sovereignty" — audience-blank.

**Metadata:**
- `directory.html`: missing og:title, og:description.
- `institutional/index.html`: missing og:title, og:description.
- `bitcoin-first-principles.html`: missing description, og:title, og:description, twitter, canonical — full SEO orphan.

**Links:** clean, no `learn.bitcoinsovereign.academy` references, no localhost / placeholders.

## 4. What's NOT broken (reassuring)

- **BSA Spanish localization** is clean — no English bleed into ES pages.
- **All canonical URLs that exist** are correctly pointed (no domain confusion).
- **No localhost / placeholder / example.com URLs** anywhere.
- **No deprecated `learn.bitcoinsovereign.academy`** references.
- **CLAUDE.md memory was accurate** — "made with love by Dalia" doesn't actually exist anywhere as a literal string. The user's mental shorthand for "redundant attribution variants" was correct; the literal string was a strawman.
- **BSA path modules + deep dives** are a high-compliance baseline that the rest of the site can converge toward.

## 5. The "made with love by Dalia" question

User specifically referenced this string. **Search confirms: it does not exist verbatim in any of the 3 repos.** The cleanup target is *the pattern it represents* — divergent attribution lines — not the literal string. This audit catalogues 12+ such divergent strings in BSA, 24 in FSA, 3 in hub.

## 6. Decisions required before Phase 2 cleanup spec

These need user sign-off. Marking each with my recommendation per challenge-and-teach mode.

### A. Is `Don't Trust, Verify.` the BSA homepage h1, or a brand line used elsewhere?

- **A1.** `Don't Trust, Verify.` *is* the homepage h1. Replace `Master Bitcoin. Leave the Confusion Behind.` Update about.html to match.
- **A2.** `Don't Trust, Verify.` is the *brand line* — used in footer, meta tags, hero subline. The h1 is page-specific value-prop. Current homepage h1 stays; locked tagline gets surfaced in a sticky place (e.g., logo lockup, footer).
- **A3.** Both. h1 stays page-specific; tagline appears as the hero **eyebrow** above h1.

**Recommend A3.** A1 sacrifices a stronger value-prop hero for a cryptic-to-newcomers slogan. A2 hides the lock. A3 surfaces both: tagline establishes the philosophical frame; h1 sells the page. Cleanup adds the eyebrow site-wide on strategic pages.

### B. Does the locked identity line (`families and advisors. Bilingual. LATAM-fluent.`) override existing "for everyone / beginners" copy?

- **B1.** Yes, hard converge. Drop "for everyone, for beginners" everywhere. about.html mission rewritten. Hub BSA card uses locked identity verbatim.
- **B2.** Anchor + adjacent. Locked identity is the headline frame on strategic pages (homepage, dalia/, institutional/). Path modules and demos can address the broader "anyone learning Bitcoin" audience without conflict. about.html keeps "for everyone" but reframes as a *means* (free, accessible) not the *audience* (the audience is families+advisors+anyone-learning).
- **B3.** Soften the lock. Update CLAUDE.md to broaden the identity to include sovereignty-curious individuals.

**Recommend B2.** B1 is a content-rewrite project, not a cleanup pass — and removes load-bearing welcoming language. B3 weakens an already-decided lock without new information. B2 keeps the strategic pages aligned (where the cascade matters) and accepts the broader register on path/demo pages where audience expansion is actually true.

### C. Lock an FSA tagline + audience line, or leave FSA homepage-driven?

- **C1.** Lock an FSA tagline now. Candidate from current copy: `Take Control of Your Financial Future` (h1, broad) or `Keep the fees. Gain the knowledge.` (subtitle, sharper). Lock an audience line: `Practical financial literacy for the underbanked. Bilingual. LATAM-fluent.` — mirrors BSA's structure.
- **C2.** Defer. FSA stays homepage-driven; the locked positioning is the underbanked + not-monetized stance from CLAUDE.md but no explicit tagline.

**Recommend C1 with `Keep the fees. Gain the knowledge.` as tagline + the underbanked-bilingual audience line.** Reasons: (a) parity with BSA's locked structure; (b) the tagline is more memorable than the h1; (c) anchoring underbanked positioning publicly aligns the user-facing content with the internal mission. If C1 is too much, C2 is acceptable but means FSA stays harder to brand-cascade.

### D. Hub-level tagline + identity locks?

- **D1.** Lock `The Sovereign Academy | Master Money. Master Bitcoin. Master Life.` as the umbrella tagline (de-facto already, just document it).
- **D2.** Lock that hub-level descriptions of BSA and FSA quote the locked identity lines verbatim, not paraphrase them. This is a one-line rule with high payoff.

**Recommend both.** Both are documenting current/desired state and unblock cleanup.

### E. Entity-name rule

Lock: **the umbrella entity is `The Sovereign Academy` (hub only). Sub-sites use their own entity (`Bitcoin Sovereign Academy`, `Financially Sovereign Academy`) within their own domain.** Footer convention sidesteps this by attributing to domain, but any non-footer entity reference must follow this rule.

**Recommend lock as-is.** Resolves the institutional/* pages, FSA articles+answers schema, FSA homepage `Sovereign Academy Network`. One sentence in the brand spec; hits ~30 files in cleanup.

### F. FSA modules + calculators get a footer added (currently bare)

Adding a footer to 22 currently-footerless pages is a structural change, not a content edit. Decision: **add the locked footer convention to all 22 strategic FSA pages as part of cleanup.**

**Recommend yes.** No reason for these to be footerless.

## 7. Proposed cleanup scope (Phase 2, after sign-off on §6)

Pending §6 decisions, the cleanup phase tentatively groups:

**P0 — must ship before homepages get redesigned (#3/#4/#5):**
- Footer convergence across all 3 repos (~40 files: 12 BSA + 2 FSA + 22 footerless FSA + 3 hub).
- Entity-name fix (§6.E lock applied) — institutional/*, FSA articles+answers schema, FSA homepage.
- BSA `about.html` typo ("about about").
- Hub BSA card uses locked BSA identity verbatim (§6.D2).
- Hub `bitcoin-first-principles.html` SEO orphan (full metadata).

**P1 — strategic content alignment (gated on §6.A/B/C decisions):**
- BSA hero tagline + identity convergence (§6.A + §6.B applied) on homepage, about, dalia/.
- FSA tagline lock applied (§6.C) on homepage + module-level templated taglines.
- Hub tagline lock documented + applied (§6.D1).

**P2 — metadata polish, deferrable to cascade:**
- FSA OG tags + canonical added to ~22 pages.
- Hub directory.html + institutional/index.html OG tags.
- BSA templated og:descriptions can update to reference locked identity, but this isn't blocking.

## 8. Sign-off checklist

- [ ] §2 cross-repo patterns reviewed
- [ ] §3 per-repo findings spot-checked
- [ ] §6.A — `Don't Trust, Verify.` placement decision
- [ ] §6.B — locked identity line scope decision
- [ ] §6.C — FSA tagline lock decision
- [ ] §6.D — hub tagline + description rule decision
- [ ] §6.E — entity-name rule lock
- [ ] §6.F — add footers to 22 footerless FSA pages
- [ ] §7 P0/P1/P2 prioritization approved (or revised)

Once §6 is decided, I draft a tight Phase 2 cleanup plan (file-level diff list) for separate sign-off. No code lands until the plan is approved.
