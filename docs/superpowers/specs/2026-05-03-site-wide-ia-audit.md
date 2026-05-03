# Site-Wide Information Architecture Audit + Plan

**Date:** 2026-05-03
**Status:** Draft (awaiting sign-off)
**Scope:** Full BSA repo (~315 HTML pages). Decides what to keep / kill / merge / move BEFORE the visual cascade ships.
**Companion spec:** `2026-05-03-component-library-plan.md` (the visual vocabulary)
**Builds on:** `2026-04-28-phase-1-identity-convergence.md` (identity + 4-door hub at `/dalia/`), `2026-05-02-homepage-minimalism-spec.md` (homepage section verdicts), `voice-spec.md` (T3a thesis)

---

## 1. Why this exists

The shipped homepage cream-paper system (commit `021dc680`) needs to cascade to ~315 other pages. **Doing the visual migration before deciding what stays is wasteful** — we'd restyle pages that should be killed, merged, or moved.

Per the locked Phase 1 thesis:

> *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."*

Every page must be assessable against: **does this serve the locked audience? If yes, what's its job? If no, kill or demote.**

This spec audits the inventory, makes keep/kill/merge/move recommendations, proposes a top-level sitemap, and drafts journey maps for the highest-priority audience segments.

## 2. Inventory snapshot (2026-05-03)

| Category | Page count | Status |
|---|---|---|
| Top-level / strategic | 17 | Mixed — some legit, some orphaned |
| Path landings | 8 | Skeptic underdeveloped (0 modules) |
| Path modules | ~110 | 7 paths × 3-5 stages × 3-4 modules |
| Interactive demos | 44 | Mostly healthy; some duplicates |
| Deep dives | 22 | 5 categories, 4 subpages each |
| Spanish localization | ~17 | `programa-colombia/semana-N/`, plus `paths/curious/stage-1/es/` |
| Institutional programs | ~40 | Heavy duplication (advisor day-1/2/3 vs modules/) |
| Tools & guides | ~10 | Underused |
| Community / dashboards | ~8 | UX dashboards (account, my-learning, analytics) — quality varies |
| AI agents | 6 | Story-navigator + visual-synthesizer (early-stage) |
| Youth-families | 11 | Hub + 10 weeks |
| FAQ / answers | 15 | SEO landing pages |
| Certificates | 5 | Mostly templates |
| Personal / dev | 8 | dalia/, admin/, .superpowers/ |
| Verification stubs | 3 | Google site verification (duplicated) |

**Total: ~315 pages.** Sources of duplication identified by inventory: advisor certification (day-N vs modules/), Google verification (3 instances), Spanish corporate redirect (placeholder).

## 3. Audit method

Each page evaluated on three axes:

1. **Does it serve a locked audience segment?** (curious learner / family / advisor / institutional / spanish-learner / observer / hurried)
2. **What is its IA job?** (entry point / educational content / utility tool / legal/admin / orphan)
3. **Is its current location optimal?** (top-level / nested / should-be-elsewhere)

Verdicts use 4 categories:

| Verdict | Action |
|---|---|
| **KEEP** | Stays as-is, gets visual migration |
| **MERGE** | Content folds into another page; URL redirects |
| **MOVE** | Stays alive but at a new URL (with redirect) |
| **KILL** | Page deleted; URL returns 410 or redirects to nearest match |

## 4. Audit by category

### 4.1 Top-level strategic pages

| Page | Verdict | Reasoning |
|---|---|---|
| `/index.html` | **KEEP** | ✅ Just shipped (commit `021dc680`) |
| `/about.html` | **MERGE → `/dalia/`** | Per Phase 1 identity hub spec, `/dalia/` is the canonical "about" surface. `/about` becomes a redirect. **OR keep `/about` as the company/mission page distinct from `/dalia` as the person page.** Open question §11. |
| `/dalia/index.html` | **KEEP** | Identity hub — ships next per Phase 1 |
| `/dalia/icon-explorations.html` | **MOVE** to `/design/` or **KILL** | Internal exploration page — shouldn't live on the production hub URL |
| `/dalia/logo-explorations.html` | **MOVE** to `/design/` or **KILL** | Same as above |
| `/start/` (start/index.html) | **KEEP** + restructure | Path-discovery entry. Per homepage spec, the welcome modal moves here. Needs its own visual migration. |
| `/start-simple.html` | **KILL** (404 → /start/) | Duplicate of /start/. Inventory flagged it as empty h1. |
| `/weekly/index.html` | **KEEP** | Changelog/digest. Visual migration. |
| `/contact.html` | **KEEP** | Required transactional page. Visual migration. |
| `/privacy.html` | **KEEP** | Legal. Visual migration (light). |
| `/terms.html` | **KEEP** | Legal. Visual migration (light). |
| `/transparency.html` | **KEEP** | Aligns with "Don't Trust, Verify" tagline. Visual migration. |
| `/licensing.html` | **KEEP** | Educator-facing. Visual migration (advisor surface). |
| `/sponsor.html` | **EVALUATE** | Per Phase 1 §11, "Sponsor pipeline" is out-of-scope until Phase 2. Page may be premature. Either KEEP as static stub or KILL until Phase 2 confirms direction. |
| `/glossary.html` | **KEEP** | Reference. Should be linked from header. |
| `/emergency-kit.html` | **KEEP** | Per homepage spec, emergency banner demoted but page itself stays. Visual migration. |
| `/account.html` / `/my-learning/` | **EVALUATE** | If membership is active and these surfaces work, KEEP. If inactive (post-pricing-redirect, see below), kill or hide behind auth. |
| `/membership.html` / `/membership-success.html` | **EVALUATE** | `/pricing.html` redirects (per inventory) — what's the current monetization state? If membership is paused, these pages should redirect or 410 too. Open question §11. |
| `/pricing.html` | **MERGE** (already redirecting per inventory) | Document where it redirects to. Keep redirect; kill the file. |
| `/earn-back-terms.html` | **EVALUATE** | If "earn-back" program is active, KEEP. Otherwise KILL. |
| `/checkout.html` | **EVALUATE** | Same as membership cluster — depends on monetization state. |
| `/404.html` | **KEEP** | Required. Visual migration. |

### 4.2 Path landings + modules

| Group | Verdict | Reasoning |
|---|---|---|
| `/paths/index.html` | **KEEP** + restructure | Hub of all paths. Should adopt audience-segment framing (per homepage spec View C variant). |
| `/paths/curious/` (16 modules) | **KEEP** | Largest path. Spanish localization stage-1 already exists. |
| `/paths/builder/` (13 modules) | **KEEP** | Technical audience. |
| `/paths/sovereign/` (12 modules) | **KEEP** | **Primary path for the locked "family + advisor" audience.** Highest-leverage migration target. |
| `/paths/principled/` (15 modules) | **KEEP** | Philosophy/economics. |
| `/paths/pragmatist/` (9 modules) | **KEEP** | Action-oriented. |
| `/paths/hurried/` (7 modules) | **KEEP** | Time-constrained. Smallest path — could merge into pragmatist as a "fast track" stage. **Open question §11.** |
| `/paths/skeptic/` (0-2 modules, WIP) | **KEEP placeholder** OR **defer publish** | Per inventory, this path is empty. Either populate (separate effort) or hide from path quiz until ready. **Don't migrate visually until populated.** |
| `/paths/observer/` | **EVALUATE** | Inventory mentions observer audience but path may not exist as a distinct journey. If implicit, fold into curious/principled. |
| Path module pages (~110) | **DEFER** to learning-surface phase | These are dark surfaces (per visual brand system spec §3.6). They get a separate component library extension and migration plan. **Not in scope for the cream cascade.** |

### 4.3 Interactive demos (~44)

**Verdict at category level: KEEP all that work, MIGRATE visual chrome (header/footer/labels), do not touch demo logic.**

Per `2026-05-01-visual-brand-system-design.md` §10: **functionality preservation is non-negotiable.** Each demo's algorithm, state, math, network calls, storage all stay.

Cascade approach:
- Demo content (interactive canvas/UI inside the demo) → DARK surface, keep current treatment, just update tokens
- Demo page chrome (page header, breadcrumb, footer, nav back to /interactive-demos/) → adopt new component library

**Audit flags:**
- `multisig-setup-wizard` — per current memory, "coming soon" was changed to redirect. Verify state.
- Several demos have similar names (`security-dojo` vs `security-dojo-enhanced`, `utxo-visualizer` vs `utxo-visualizer-enhanced`) — **consolidate to single canonical demos. Open question §11.**

### 4.4 Deep dives (~22)

**Verdict: KEEP all 5 categories, migrate visually.** Deep dives serve the principled/builder audiences and are differentiator content.

Categories:
- Austrian Economics (5) — KEEP
- First Principles (4) — KEEP
- Money & Banking (4) — KEEP
- Philosophy & Economics (4) — KEEP
- Sovereign Tools (4) — KEEP

**Audit flag:** Sovereign Tools deep dive should cross-link tightly to `/paths/sovereign/` — they cover the same ground at different depths. Consider whether this is duplication or healthy layered learning. Likely the latter.

### 4.5 Spanish localization

| Group | Verdict |
|---|---|
| `/programa-colombia/index.html` | **KEEP** — primary Spanish marketing surface |
| `/programa-colombia/semana-1..10/` | **KEEP** — 10-week curriculum |
| `/paths/curious/stage-1/es/` | **KEEP** — Spanish path module variant |
| `/institutional/corporations/colombia/ruta-estabilidad-crecimiento/` | **KILL** (per inventory: redirect placeholder) |

**Strategic note:** Per Phase 1 spec §7.3, Spanish content has equal-or-higher leverage than English (60 Substack subs from Spanish vs 0 list growth from 5 yrs English social). The Spanish surfaces deserve **equal visual cascade priority**, not "Phase 2."

### 4.6 Institutional programs

**Major audit flag from inventory:** advisor certification has duplicate structure (`day-1/2/3/` vs `modules/` folder). One is canonical, one is leftover. **Pick one and kill the other.** Open question §11.

| Group | Verdict |
|---|---|
| `/institutional/index.html` | **KEEP** + restructure as audience-segment landing |
| `/institutional/wealth-advisors/` | **KEEP** — primary advisor surface (anchor audience) |
| `/institutional/wealth-advisors/bitcoin-advisor-certification/` | **KEEP** + de-duplicate (resolve day-N vs modules/) |
| `/institutional/wealth-advisors/bitcoin-advisor-certification/day-1..3/` | **KEEP or KILL** depending on de-dup decision |
| `/institutional/wealth-advisors/bitcoin-advisor-certification/modules/` | **KEEP or KILL** depending on de-dup decision |
| `/institutional/cities.html` | **EVALUATE** — is the cities program actively pursued? If yes KEEP; if speculative MOVE to `/programs-roadmap/` |
| `/institutional/corporations.html` | **KEEP** if active |
| `/institutional/education.html` | **KEEP** if active |
| `/institutional/correctional.html` | **EVALUATE** — niche; may be aspirational |

**Recommendation:** Kill or hide vertical programs that aren't actively being sold. They dilute the core "family + advisor" identity.

### 4.7 Tools & guides

| Page | Verdict |
|---|---|
| `/tools/index.html` | **KEEP** + better surface in main nav |
| `/tools/bitcoin-recovery-binder.html` | **KEEP** — high-utility for sovereign audience |
| `/tools/domain-dashboard.html` | **EVALUATE** — internal-feeling; may belong in `/admin/` |
| `/guides/advisor-pre-discovery/` | **KEEP** — advisor-targeted, good leverage |
| `/guides/disclosure-audit/` | **KEEP** |
| `/guides/inheritance-privacy/` | **KEEP** |
| `/guides/sparrow-utxo-map/` | **KEEP** — technical sovereign content |
| `/resources/seed-phrase-security-checklist.html` | **MERGE** into `/tools/bitcoin-recovery-binder.html` OR move to `/guides/` for consistency |

### 4.8 Community / dashboards

| Page | Verdict |
|---|---|
| `/my-learning/` | **EVALUATE** — depends on membership state |
| `/community/` | **EVALUATE** — is community active? If empty/abandoned, KILL |
| `/analytics/` | **EVALUATE** — internal vs user-facing |
| `/challenges/` | **EVALUATE** — gamification surface; per voice-spec is "unbounded mode" (no badges/completion %), this may conflict with the locked operating frame |
| `/demos/` | **MERGE** with `/interactive-demos/` — only one demo hub should exist |
| `/ai-tutors/` | **KEEP** as a presentational landing for the embedded reflect-widget; per spec §3.6 it's a "marketing" surface |

**Strategic flag:** Several community/dashboard pages may be remnants of an earlier monetization/gamification direction that conflicts with the current locked identity. **Ruthless audit recommended.**

### 4.9 AI agents

| Page | Verdict |
|---|---|
| `/ai-agents/index.html` | **EVALUATE** — newish surface, may be premature |
| `/ai-agents/story-navigator/` | **EVALUATE** — interesting concept but unclear if production-ready |
| `/ai-agents/visual-synthesizer/` | **EVALUATE** |

**Recommendation:** Audit each AI-agent page for activity level. If experimental, move to `.superpowers/brainstorm/` or hide from nav. If production, KEEP and migrate visually.

### 4.10 Youth & families

| Group | Verdict |
|---|---|
| `/youth-families/index.html` | **KEEP** — aligns with "family" half of locked identity |
| `/youth-families/week-1..10/` | **KEEP** — 10-week curriculum |
| `/youth-families/educator/` | **KEEP** — educator portal |

**Strategic note:** The "family" audience served here may be different from the "high-net-worth family with Bitcoin" audience in the locked identity (which is more inheritance/custody focused). Worth clarifying — these may be two distinct family-segment journeys.

### 4.11 FAQ / answers (~15)

**Verdict: KEEP all** — they're SEO landing pages that capture long-tail search traffic. Visual migration is straightforward (each page is short).

### 4.12 Certificates (~5)

| Page | Verdict |
|---|---|
| `/certificates/certificate.html` | **EVALUATE** — depends on whether certificates are awarded |
| `/certificates/branded_certificate_page.html` | **KEEP** — Oakwood High partnership artifact, excluded from visual brand system per §3.6 |
| `/certificates/verify_certificate.html` | **KEEP** if certificates exist; **KILL** otherwise |
| `/certificates/persona_selector.html` | **EVALUATE** — unclear current use |
| `/certificates/multi_persona_dashboard.html` | **EVALUATE** |

### 4.13 Personal / dev

| Page | Verdict |
|---|---|
| `/admin/` | **MOVE** to staging or hide behind auth — should not be at production root |
| `/.superpowers/brainstorm/` | **KEEP as-is** — design exploration, not user-facing (per CLAUDE.md "Untracked items policy") |
| `/tests/widget-demo.html` | **MOVE** to `.tests/` or KILL |
| `/articles/bitcoin-complete-guide.html` | **EVALUATE** — orphan article, may belong in deep dives |
| `/modules/cbdc-vs-bitcoin.html` | **MOVE** into a path or deep dive — orphan module |
| `/multisig-security-demo.html` | **MOVE** to `/interactive-demos/multisig-security-demo/` for consistency |
| `/payment/success.html` | **EVALUATE** — depends on monetization |

### 4.14 Verification stubs

| Page | Verdict |
|---|---|
| `/google7871d0191861be24.html` | **KEEP** — Google domain verification |
| `/public/google7871d0191861be24.html` | **KILL** — duplicate |
| `/public/googlef428bf16c468c155.html` | **KEEP** — different verification token, separate property |

## 5. Proposed top-level sitemap

After the audit's recommended actions, the simplified site looks like:

```
/                                      ← homepage (cream paper, Combo 4)
/dalia/                                ← identity hub (4 doors)
/about.html                            ← either redirect to /dalia/ OR company-mission page
/start/                                ← path-discovery quiz + welcome flow
/paths/                                ← all 7 (or 8) paths
  curious/  builder/  sovereign/  principled/  pragmatist/  hurried/  skeptic/
  curious/stage-1/es/                  ← Spanish modules
/programa-colombia/                    ← Spanish marketing + 10-week curriculum
/interactive-demos/                    ← 44 demos (de-duped)
/deep-dives/                           ← 5 categories
/tools/                                ← practical utilities
/guides/                               ← long-form how-tos
/youth-families/                       ← educator + 10-week family curriculum
/institutional/
  wealth-advisors/                     ← primary B2B surface (anchor audience)
    bitcoin-advisor-certification/     ← single canonical certification (de-duped)
  [other vertical programs that survive audit]
/glossary.html
/emergency-kit.html
/weekly/                               ← changelog/digest
/contact.html /privacy.html /terms.html /transparency.html
/licensing.html /sponsor.html (if surviving)
/404.html
```

**Estimated page count after audit: ~250 (down from ~315) if all "EVALUATE" pages get hard decisions. ~280 if we err on the side of KEEP.**

## 6. Audience-segment journey maps

Three primary journeys to design end-to-end. Other 4-5 segments inherit from these.

### 6.1 Family with Bitcoin (anchor audience #1)

Goal: protect Bitcoin against loss/inheritance failure.

**Journey:**
1. **Entry:** `/` hero → "Bitcoin custody and inheritance, made plain" → matches their problem
2. **Routing:** `/start/` quiz → recommends `/paths/sovereign/`
3. **Or direct:** `/dalia/` → "For Families" door → `/paths/sovereign/`
4. **Foundation:** `/paths/curious/stage-1/` → "What is money?" → "What is a wallet?" → "What is a seed?"
5. **Sovereign track:** `/paths/sovereign/stage-1/` → cold storage → backup strategies
6. **Stage 4:** estate planning, inheritance drills (the highest-leverage modules for this segment)
7. **Tools:** `/tools/bitcoin-recovery-binder.html`, `/guides/inheritance-privacy/`
8. **Deep dive:** `/deep-dives/sovereign-tools/multisig-guide.html`
9. **Conversion (Phase 2):** referral to The Bitcoin Adviser collaborative custody (`thebitcoinadviser.com`)

**Audit implications:**
- `/paths/sovereign/` is the highest-leverage migration target after the homepage
- `/tools/bitcoin-recovery-binder.html` deserves prominent surfacing
- The estate-planning modules in sovereign Stage 4 should be cross-linked from the family door on `/dalia/`

### 6.2 Advisor (anchor audience #2)

Goal: serve clients with Bitcoin without becoming a custodian.

**Journey:**
1. **Entry:** `/` or direct to `/institutional/wealth-advisors/`
2. **Discovery:** `/guides/advisor-pre-discovery/`
3. **Certification:** `/institutional/wealth-advisors/bitcoin-advisor-certification/`
4. **Practical tools:** `/guides/disclosure-audit/`, `/guides/inheritance-privacy/`
5. **Reference:** `/glossary.html`, `/deep-dives/sovereign-tools/`
6. **Connection:** `thebitcoinadviser.com` for collaborative custody partnership

**Audit implications:**
- De-dup the advisor certification (day-N vs modules/) — must be done before this journey can ship cleanly
- `/institutional/wealth-advisors/` lands needs a real visual treatment (currently inventory shows it as a generic landing)
- Guides should be visibly accessible (they're hidden today)

### 6.3 Spanish-speaking learner (anchor audience #3, per Phase 1 §7.3)

Goal: learn Bitcoin in their language, on their cultural terms.

**Journey:**
1. **Entry:** `/programa-colombia/` direct, OR `/` with language switch (currently absent)
2. **Curriculum:** `/programa-colombia/semana-1..10/`
3. **Path support:** `/paths/curious/stage-1/es/` (more modules to translate per CLAUDE.md TODO)
4. **Substack:** `sovereigndwp.substack.com` Spanish posts (60 subs from Spanish content per Phase 1 §1)

**Audit implications:**
- Add a language switch to the homepage and all strategic pages — currently missing
- Prioritize translating more BSA modules to Spanish (currently only Curious Stage 1 module 1)
- `/programa-colombia/` and Spanish modules get **equal cascade priority** — not deferred

### 6.4 Other segments (deferred to next iteration)

- Curious learner (general, not LATAM-specific)
- Builder/developer
- Principled/philosophy-focused
- Hurried/time-constrained
- Skeptic
- Observer (passive learner)
- Family-with-kids (vs HNW family — the youth-families curriculum)

Each gets a journey map in a follow-up sprint after the 3 primaries are validated.

## 7. Cascade priority order (after this spec signs off)

Updated 2026-05-03 to reflect resolved decisions in §11.1 (each dropdown menu item gets a real page, not a stub).

| Priority | Pages | Reasoning |
|---|---|---|
| **P0 — done** | homepage `/index.html` | Shipped commit `021dc680` |
| **P1 — strategic + dropdown landings** | `/dalia/`, `/about.html` (now distinct org page), `/start/`, `/weekly/`, `/paths/index.html`, `/tools/index.html`, `/institutional/index.html`, `/interactive-demos/index.html`, `/deep-dives/index.html`, `/ai-tutors/index.html` | 10 pages, ~5-6 hours with components; dropdown landings need real editorial treatment per resolved decision §11.1 |
| **P2 — primary audience anchors** | `/paths/sovereign/` (landing + 12 module visual chrome), `/institutional/wealth-advisors/` (after content audit + de-dup §11.1#5), `/programa-colombia/` | Direct anchor-audience journeys |
| **P3 — content depth** | `/deep-dives/` subpages, `/tools/` subpages, `/guides/`, `/glossary.html` | Differentiator content for principled/builder/sovereign |
| **P4 — other paths** | `/paths/curious|builder|principled|pragmatist|skeptic/` (landings + module chrome). **Hurried killed** per §11.1#2; modules merged into pragmatist as Fast-Track stage. Skeptic landing only — modules deferred until populated per §11.1#3. | All other paths |
| **P5 — long tail** | FAQ/answers, certificates, youth-families weeks, etc. | High volume, low individual stakes |
| **P6 — learning-surface refresh** | All path modules + interactive demos (dark surfaces) | Separate component spec required; deferred |
| **Pre-P2 prerequisite** | Demo de-dup (audit + canonical-pick or merge), advisor-cert content audit (day-N → modules/) | Must complete before P2 visual migration of those surfaces |

## 8. What this audit does NOT do

- **Does not write any code.** It produces decisions; the cascade plan implements them.
- **Does not commit to monetization decisions.** Pages that depend on membership/pricing/checkout state are flagged as EVALUATE pending user decision.
- **Does not redesign navigation/header.** Header changes have their own spec.
- **Does not touch FSA.** Sister project gets parallel audit (separate spec).
- **Does not handle redirects.** Each KILL/MOVE/MERGE decision becomes a redirect entry in `vercel.json` or `404.html` link list during cascade implementation.
- **Does not set deadlines.** This is a backlog of decisions, sequenced by priority. Pace is your call.

## 9. Estimated scope (with components)

| Phase | Pages | Time per page | Total |
|---|---|---|---|
| P1 strategic | 4 | 30-45 min | 2-3 hours |
| P2 anchor-audience | ~20 | 20-30 min | 7-10 hours |
| P3 content depth | ~30 | 15-20 min | 7-10 hours |
| P4 other paths | ~10 landings + ~80 module chrome | 15 min landing / 5 min chrome | ~10 hours |
| P5 long tail | ~50 | 5-10 min | 4-8 hours |
| P6 learning-surface refresh | ~150 | TBD per separate spec | TBD |
| **Total cream cascade (P1-P5)** | **~150** | **avg ~12 min** | **~30-35 hours** |
| Audit decisions | ~30 EVALUATE pages | varies | ~3-4 hours of user judgment |

**Realistic:** 8-10 working sessions to complete P1-P5. P6 is a separate project.

## 10. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| User signs off broadly without making the EVALUATE decisions, then we cascade pages that should have been killed | **high** | Force per-page decisions in §11 review; don't proceed to cascade until each EVALUATE is resolved |
| Visual cascade gets ahead of IA decisions and pages get restyled then killed | **medium** | Strict P1 → P2 → P3 sequencing; no out-of-order migrations |
| Spec divergence (`2026-05-01-visual-brand-system-design.md` vs current implementation) confuses future sessions | **medium** | Component library spec officially supersedes the older one; this audit cites only the current canonical system |
| Pages that should be merged sit half-migrated for weeks | **medium** | Kill/merge actions ship in same commit as visual migration of the surviving page |
| Spanish content stays second-class | **medium** | P2 priority on `/programa-colombia/`; explicit equal-cadence rule |
| Monetization-dependent pages cascade then become broken if monetization is paused/changed | **medium** | EVALUATE decisions in §4.1 force a monetization-state check before cascade |

## 11. Decisions — resolved + parked (updated 2026-05-03)

### 11.1 Resolved

1. **About vs Dalia.** ✅ **Two distinct pages.** `/about.html` = organization (BSA the institution, mission, values). `/dalia/` = founder identity hub. Each dropdown menu item (paths, tools, institutional, demos, deep-dives, ai-tutors) ALSO gets its own real editorial landing — not a stub.
2. **Hurried path.** ✅ **Merge into Pragmatist** as a "fast-track" stage. Kill `/paths/hurried/`. Migrate the 7 hurried modules into pragmatist as a Stage-0 or "Fast Track" sub-path. Update path quiz to drop hurried as separate option.
3. **Skeptic path.** ✅ **Populate** — separate content effort. Keep path live in quiz. **Don't visually migrate the empty stages until populated** (wasted work). Visual migration of skeptic landing only.
4. **Observer path.** Implicit only — folds into curious/principled. No standalone path needed.
5. **Advisor certification de-dup.** ✅ **`modules/` is canonical**, but **content audit FIRST** to see if `day-1/2/3/` content should merge/integrate into `modules/` before killing the day-N structure. Two-step: (a) content audit (separate session), (b) consolidate, (c) THEN visual migrate.
8. **Language switch on homepage.** ✅ **Defer to Phase 2.**
12. **Demo de-dup.** ✅ **De-dup is explicit P-anywhere task.** Audit each duplicate pair (`security-dojo` vs `enhanced`, `utxo-visualizer` vs `enhanced`, `wallet-workshop` vs `wallet-security-workshop`, plus any others surfaced) and **pick the most-value-add canonical OR merge best nuances of duplicates into one**. Differentiated nuances per pair must be preserved in the merge.
13. **Family audience clarity.** ✅ **Two distinct family segments**, document explicitly:
   - **Family-with-kids** → `/youth-families/` curriculum (financial literacy, age-appropriate Bitcoin intro)
   - **HNW-Family-with-Bitcoin** → custody + inheritance (the locked Phase 1 anchor audience). Likely served via `/paths/sovereign/` Stage 4 + `/dalia/` "For Families with Bitcoin" door + future Family Bitcoin OS deliverable.
   Update copy on `/dalia/` "For Families" door and `/paths/sovereign/` to make this distinction visible. Don't conflate them in nav/copy.

### 11.2 Parked (do not gate cascade)

6. **Vertical institutional programs** (cities, corporations, education, correctional) — defer KEEP/KILL decision. Default: KEEP all + visual migrate. Kill any in follow-up audit once user has signal on which are actively being sold.
7. **Membership cluster** (`/membership.html`, `/account.html`, `/checkout.html`, `/payment/success.html`, `/earn-back-terms.html`) — defer KEEP/KILL until monetization state confirmed. **Risk:** these get visually migrated then become stale if monetization paused.
9. **Sponsor page** — defer.
10. **Community / Challenges** — defer. May conflict with voice-spec "unbounded mode" (no badges/completion %).
11. **AI agents** (story-navigator, visual-synthesizer) — defer. Possibly move to `.superpowers/brainstorm/` if experimental.
14. **Pricing redirect** — defer documentation.

### 11.3 Backlog (future spec / future session, NOT cascade)

- **Embedded interactive components on homepage.** The path-recommender quiz becomes the canonical embed (enriched with new structure/style — separate spec when prioritized). Other candidates (live demo embed, inline AI tutor) parked.
- **Pop-up audit + style cascade.** ALL pop-ups across the site should match new style/structure OR be removed. Includes: any remaining onboarding modals, gating modals, safety modals, AI tutor launcher, reflect-widget, etc. Audit + decide per popup. **Park for now.**

## 12. Sign-off checklist

- [ ] §3 audit method acceptable
- [ ] §4 per-page verdicts reviewed (no major disagreements)
- [ ] §5 proposed sitemap reviewed
- [ ] §6 audience-segment journeys validated (do they match how you think about these audiences?)
- [ ] §7 cascade priority order acceptable
- [ ] §11 decisions either resolved or queued for explicit follow-up
- [ ] OK to officially mark `2026-05-01-visual-brand-system-design.md` superseded for §3.6 (surface assignment) by this spec's §4 + §7?

---

Once signed off, this audit + the component library spec drive the cascade. Each page migration cites both as its source of truth.
