# JEA — Implementation Plan, Subagent Workflow, MVP Checklist, Risks

> The Jurisdictional Exposure Audit. Deliverables 9, 10, and 12.
> Created 2026-06-16. Owner: Dalia. Status: foundation pack.

---

# Part 1 — Implementation plan (Deliverable 9)

## File structure (target)

```
deep-dives/jurisdictional-exposure-audit/
  index.html                      # public deep dive (renders deep-dive.md content)
  README.md                       # index (done)
  deep-dive.md                    # public long-form (done)
  audit/
    index.html                    # interactive tool shell
  library/
    index.html                    # country library index (card grid)
    united-states/index.html      # renders profiles/united-states.json
    <country>/index.html          # one per published profile
  data/
    questionnaire.json            # done
    jurisdiction-claim-ledger.json  # done (USA seed)
    jurisdiction-source-ledger.json # done (USA seed)
    schema/*.schema.json          # done (7 schemas)
    profiles/
      _TEMPLATE.md                # done
      united-states.md / .json    # done (exemplar)
      <country>.research-task.md  # done (5 stubs)
  assets/                         # diagrams (SVG), see §diagrams
  js/
    jea-audit.js                  # questionnaire engine + classifier
    jea-classify.js               # rules from classification-routing spec
    jea-routing.js                # product routing rules + price guard
    jea-library.js                # profile renderer
  css/
    jea.css                       # scoped styles, extends brand tokens
scripts/
  jea-integrity-check.mjs         # the Test 1-12 validator (node:test)
```

Routes follow the existing static-site + `index.html`-per-folder convention. The deep dive mirrors `deep-dives/foundational-layer-thesis/`.

## Components

- **Deep-dive page.** Static HTML, sticky anchor nav, the 12 module sections, Reflect widget (`data-topic="jurisdiction" data-path="jurisdictional-exposure-audit"`), footer convention, disclaimer line. Absolute CSS paths only (`/css/brand.css`, `/css/jea.css`).
- **Audit tool.** Client-side only in the MVP. A small state machine over `questionnaire.json`. Sections render conditionally via `applies_when`. No network calls except optional anonymized analytics events. Produces a `risk-output` object rendered as the exposure map.
- **Classifier + router.** Pure functions: `classify(userResponse) -> riskOutput` and `route(riskOutput, userResponse) -> pathway`. Deterministic, unit-tested. The router enforces the price guard (never emit a numeric price absent a `MONETIZATION_MAP.md`-sourced value).
- **Library index + country pages.** Render from JSON profiles. Country page shows the confidence summary, sourced claims (each linking to the source ledger entry), the "requires local counsel" panel, and the holder-implications block. Profiles with status other than `published` show a "research in progress" state and hide unverified claims.
- **Documentation classifier widget.** The highest-value free interaction; renders the per-item recommended-handling table from the classification spec and flags leaks/gaps.

## Data files

The JSON profiles and ledgers are the source of truth. HTML renders from them; nothing is hard-coded into markup. This keeps the integrity tests meaningful (a claim in the UI must exist in the ledger).

## JavaScript modules

Vanilla JS, no framework, consistent with the repo's no-build main site. Sanitize all rendered profile values with the existing `escHtml()` / `safeInt()` helpers before `innerHTML`. No `eval`. No user-controlled `innerHTML` except through the sanitizer.

## CSS

Extend `css/brand.css` tokens (`--color-brand`, `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, radius/space/shadow). Do not introduce new tokens. State labels (stable/fragile/concentrated/etc.) use neutral surfaces by default; reserve color for genuine semantic distinction, per the locked color convention. The visual system is Playfair Display + Crimson Pro + JetBrains Mono per the 2026-05-03 component-library plan.

## Accessibility (WCAG 2.1 AA)

Works without animation. Keyboard navigation throughout the audit. `:focus-visible` outlines. `prefers-reduced-motion` respected. ARIA roles on interactive components. Every visual map (heatmap, role map) has a text-equivalent table. No tiny text, no low contrast. Mobile-first layouts.

## Privacy

No login for the free version. No sensitive data ever collected (enforced by the questionnaire schema and Test 8). Audit state held client-side; not persisted server-side in the MVP. No third-party trackers, no ad pixels, consistent with the platform's first-party-only analytics. If saved maps are added later, they require a reviewed privacy/security design and explicit opt-in.

## Analytics events (non-sensitive only)

Via the canonical `js/analytics.js` → `/api/track`. Events: `jea_started`, `jea_user_type_selected` (type only), `jea_country_count` (count only, not which), `jea_section_completed` (section id), `jea_result_generated` (primary exposure type only), `jea_resource_clicked` (resource id), `jea_pathway_cta_clicked` (product id). Never log individual answers.

## Testing checklist

- Unit tests for `classify()` against fixtures for each of the 10 primary exposure types and the documentation classifier.
- Unit tests for `route()` confirming the price guard and the family/business guards.
- `scripts/jea-integrity-check.mjs` implementing integrity Tests 1-12.
- `npm run audit:html` on new pages; absolute CSS path check.
- Manual keyboard-only pass of the audit; screen-reader spot check.
- Before "shipped": confirm `git status -b --short` shows main not ahead of origin (Vercel deploys from origin).

---

# Part 2 — Subagent task list + research workflow (Deliverable 10)

Ten specialist agents. Each profile is produced by running the relevant agents, then the Source Quality and Content Voice agents, then a human review of the human-review-flagged claims.

For every agent: **Source standards** = Tier 1 preferred, Tier 2 acceptable with care, Tier 3 only as secondary context, Tier 4 only to identify questions. **Red flags** = any claim stronger than its source, any cross-country analogy, any Bitcoin/crypto conflation, any undated claim. **Completion criteria** = every claim has a ledger entry with source, confidence, claim type, and review dates; unknowns marked as open questions; section confidence assigned.

1. **Tax Research Agent.** Mission: classification, capital gains, wealth/exit/inheritance/gift tax, foreign-asset reporting, crypto-specific guidance. Inputs: jurisdiction, tax-authority sources. Outputs: `tax_overview` claims + open questions.
2. **Estate and Succession Agent.** Forced heirship, estate/inheritance tax, trust/foundation recognition, probate, executor powers, cross-border family issues. Outputs: `estate_profile` claims; always records the authority-vs-access implication.
3. **Bitcoin Regulation Agent.** Self-custody, exchanges, stablecoins, mining, payments, advisor rules, ETFs, custody regulation, and the Bitcoin-vs-broader-crypto distinction. Outputs: `bitcoin_regulation` claims.
4. **Banking Reality Agent.** Bank access, crypto de-risking, dollar access, wire friction, source-of-funds burden, capital controls, the legal-vs-bankable gap. Outputs: `banking_profile` claims.
5. **Reporting and Surveillance Agent.** CRS, CARF, FATF Travel Rule, beneficial-ownership registries, broker/exchange/bank reporting, tax-information exchange. Outputs: `reporting_profile` claims; flags direction of travel.
6. **Mobility and Residency Agent.** Tax residence, citizenship, domicile, residency programs, day counts, exit tax, accidental tax residence. Outputs: `mobility_profile` claims.
7. **Product Routing Agent.** Maps audit outputs to BSA/TSA resources and paid products without sounding salesy. Inputs: classification spec + `MONETIZATION_MAP.md`. Red flag: any invented price. Output: routing rules.
8. **UX and Interaction Agent.** Turns research into a guided experience, visual maps, decision trees, plain-language outputs. Red flag: gamification, scary language, score-like framing.
9. **Source Quality Agent.** Checks source quality, flags weak claims, verifies dates, assigns tiers and confidence, runs the hallucination checklist and the contradiction review. Gatekeeper for `verified` status.
10. **Content Voice Agent.** Rewrites output to sound human, precise, and clear, applying the voice spec (no em dashes, no AI tells, no hype, evenhanded, first-principles). Final pass before publication.

### Research update workflow

Each profile carries `last_reviewed`, `next_review`, `change_log`, source table, open questions, and watchlist. Review cadence: US monthly/quarterly; EU/Switzerland quarterly (federal) and annual (cantonal structure); Colombia/Panama/El Salvador quarterly or after major legal change; lower-priority countries semiannual. A scheduled task can run the stale-claim scan and open research tasks for anything past `next_review`. When laws change, the Source Quality Agent re-verifies, the relevant specialist updates the claim, and the Content Voice Agent re-renders public wording.

---

# Part 3 — MVP build checklist (Deliverable 12)

- [ ] Public deep dive page live at `/deep-dives/jurisdictional-exposure-audit/` (content done; `index.html` to build).
- [ ] Interactive questionnaire (engine over `questionnaire.json`).
- [ ] Personalized exposure output (classification, not score).
- [ ] Documentation classifier widget.
- [ ] Five-to-six initial profiles: USA published-after-human-review; the other five researched through the subagent workflow and passed through the integrity gate before display.
- [ ] Product routing with the price guard.
- [ ] Research source table + last-reviewed dates visible on each profile.
- [ ] Disclaimers on the deep dive, the audit result, and every paid report.
- [ ] Upgrade path to paid reports (soft CTA only).
- [ ] `scripts/jea-integrity-check.mjs` passing Tests 1-12.
- [ ] Accessibility pass (keyboard, contrast, text-equivalents, reduced motion).
- [ ] Analytics events wired through `js/analytics.js`, none logging answers.

## Important diagrams to create (assets/, SVG, each with a text-equivalent)

1. Legal owner vs technical controller.
2. Residence vs citizenship vs tax residence vs banking jurisdiction.
3. Awareness vs authority vs access vs skill.
4. Bitcoin custody model vs estate complexity.
5. Country friendliness vs reporting burden.
6. Low tax vs banking friction.
7. Self-custody freedom vs documentation responsibility.
8. Family map: holder, spouse, heirs, executor, advisor, technical helper, attorney.

---

# Part 4 — Risks, gaps, and open questions

## Product/legal risks
- **Unauthorized-practice and advice risk.** The product must stay on the "education + organize questions + route to professionals" side of the line. Mitigation: disclaimers on every output, framing as flags and questions, never instructions, human review of flagged claims.
- **Accuracy decay.** Jurisdiction law changes. Mitigation: the integrity system, stale-claim detection, per-section confidence, last-reviewed dates.
- **Overreach in routing.** Routing could feel salesy or push the wrong product. Mitigation: guards, single-pathway result, "this may help if…" framing, no pathway at all for tax-records and missing-information results.

## Content gaps (this foundation pack)
- Only the USA profile is researched, and it is `human-review-pending`, not `published`. Five profiles are scoped stubs only.
- Several USA claims are `needs-review`/`unsupported` pending sources (CRS non-participation, CARF status, stablecoin framework, CTA beneficial ownership, the asset-protection section, ETF primary source, the exact 2019 FinCEN CVC guidance citation).
- The `index.html`, audit engine, classifier/router code, library renderer, and integrity-check script are specified but not built.
- Diagrams are specified but not drawn.

## Open questions for the owner
- Confirm the Bitcoin Continuity Operational Package and Business/Treasury Review as named offers, and decide list-price vs "contact" (per `MONETIZATION_MAP.md`, do not invent).
- Confirm whether the audit lives as its own deep-dive route or also gets a homepage "Find Your Path" entry point.
- Confirm Spanish-localization priority for the deep dive and tool (LATAM-fluent positioning suggests early).
- Decide who performs the human review of human-review-flagged claims (Dalia, or a contracted professional per jurisdiction).

## Research Integrity Check (this foundation pack)

- **Verified (sourced this session):** USA Bitcoin = property and taxable on disposal [IRS]; Form 1099-DA phase-in and Notice 2025-33 relief [IRS + RSM]; FBAR crypto-only-account status and pending FinCEN amendment [FinCEN + PKF]; §877A covered-expatriate tests and 2025 thresholds [IRS]; citizenship-based taxation and substantial-presence test [IRS]; 2026 estate/gift exemption $15M and annual exclusion $19,000 [NatLawReview + Morgan Lewis, Tier 2]; self-custody legality and withdrawn 2020 unhosted-wallet proposal [FinCEN + Tier-3 context].
- **Downgraded:** US-not-a-CRS-participant (High → Medium, needs-review, withheld from public until OECD source added).
- **Open questions (not asserted):** US Lightning and BTC-loan tax treatment; CARF status; stablecoin framework specifics; CTA beneficial-ownership applicability; US asset-protection/seizure detail.
- **Needs human review:** all USA tax-rate, taxable-event, estate, exit-tax, reporting, and self-custody-legality claims (flagged in the ledger).
- **Missing sources:** OECD CRS participant list; SEC/exchange primary for spot ETFs; exact FinCEN 2019 CVC guidance document and the 2024 withdrawal citation; IRS Tier-1 revenue procedure for the 2026 estate/gift figures.
- **Not yet publishable as confident claims:** everything for Colombia, Panama, El Salvador, Australia, Switzerland (no claims researched); USA `needs-review`/`unsupported` items above.
