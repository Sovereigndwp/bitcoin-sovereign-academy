# JEA — Product Brief + Information Architecture

> The Jurisdictional Exposure Audit. Deliverables 1 and 2.
> Created 2026-06-16. Owner: Dalia. Status: foundation pack.
> Voice authority: `docs/marketing/voice-spec.md`. Pricing authority: `MONETIZATION_MAP.md`.

---

# Part 1 — Product brief (Deliverable 1)

## Purpose

Most people know where they live. Few know where their life is legally, financially, operationally, and jurisdictionally exposed. Bitcoin gives a person control over keys. It does not give them control over tax exposure, estate complexity, banking access, reporting obligations, family continuity, or cross-border risk.

The Jurisdictional Exposure Audit (JEA) helps a person or an advisor build a map of where money, rights, records, Bitcoin, legal obligations, family access, and institutional dependencies actually sit. It then organizes the right next questions and routes the user toward professional review and the BSA/TSA resource or service that fits their situation.

The product converts a vague sense of unease ("I think my setup might have a gap") into a structured, calm, specific map ("the gap is between legal authority and technical access, and it depends on one person").

## Audience

Five segments, each with a different center of gravity.

1. **Individual Bitcoin holders with meaningful savings.** Want to know where they are exposed, what changes if they move, what records they need, how estate issues work, and whether their custody setup matches their life.
2. **Cross-border families.** Members, heirs, assets, documents, advisors, or Bitcoin access points in different countries. The problem is usually coordination, not the wallet.
3. **Advisors.** Financial advisors, estate attorneys, CPAs, family-office staff, insurance planners. Need a safe way to ask better client questions without requesting dangerous information.
4. **Business owners and family offices.** Corporate ownership, treasury policy, signer governance, tax/accounting treatment, banking rails, legal authority, board approval, succession, key-person risk.
5. **Expats and internationally mobile people.** Residency, citizenship, tax residence, exit taxes, banking access, exchange access, device travel, cross-border family access, legal recognition.

## Why this matters

The biggest risk for a Bitcoin holder with cross-border life facts is rarely the wallet. It is the mismatch between countries, documents, people, and forms of control. A setup can be technically excellent and still fail at a border, in a probate court, in a tax filing, or when one person becomes unavailable. The global system is also moving toward more reporting and legibility (CRS, CARF, broker reporting, beneficial-ownership registries), which changes planning even when it changes nothing about legality. People need a way to see the whole system at once, in plain language, before they move, sell, gift, borrow, disclose, add a co-signer, or die.

## What makes it different

- **It maps fit and mismatch, not rankings.** No "best country for Bitcoin." A jurisdiction can be attractive for one reason and fragile for another. The output is conditional on the user's facts.
- **It separates control types.** Legal ownership is not technical control. Executor authority is not key access. Awareness is not skill. The audit treats these as different axes.
- **It is bilingual and LATAM-fluent.** Composes with the brand identity (Pair 1: custody architecture × LATAM civil-law inheritance practice).
- **It is honest about uncertainty.** Every jurisdictional claim carries a confidence level and a source. Unknowns are marked, not guessed. This is enforced by the Research Integrity & Hallucination Audit System (Deliverable 11).
- **It does not sell.** The conversion path is clarity. The paid product is the natural next step once the user sees what is missing.

## Free vs paid boundaries

Aligned with `MONETIZATION_MAP.md` ("Most core education is free to read. Some tools, templates, advisor materials, and guided support options may be paid.").

**Free**
- The public deep dive (educational, 12 modules).
- The basic interactive audit and its personalized exposure map (generic exposure categories).
- Country library summaries.
- General questions to ask professionals.
- Basic product routing.

**Paid** (written, personalized, human-reviewed deliverables)
- Personal Jurisdictional Exposure Report.
- Cross-Border Bitcoin Family Report.
- Advisor Jurisdiction Intake Kit.
- Business / Treasury Jurisdiction Review.
- Country comparison report, detailed document checklist, custom professional question list, continuity workflow, family role map, implementation templates.

The free audit must be genuinely useful on its own. The paid layer adds personalization, written analysis, human review, and implementation templates, not access to the basic map.

## Product routing logic (summary; full model in the classification-routing spec)

| Primary exposure detected | Likely fit |
|---|---|
| New holder, basic exposure, no family complexity | Self-Custody Starter Kit ($49) |
| Spouse/heir/executor/recovery/inheritance gap | Family Bitcoin Recovery Kit ($149) |
| Meaningful wealth + cross-border + multiple parties / governance | Bitcoin Continuity Operational Package (price TBD — do not invent) |
| User is an advisor/attorney/CPA/family office | Advisor Bitcoin Client Kit ($499) / Advisor Readiness Training |
| Business treasury, corporate ownership, signer governance | Business / Treasury / Family Office Review (price TBD) |
| Exposure broader than Bitcoin (banking, residency, documents, mobility) | TSA Sovereignty Planning |

Prices are quoted only where `MONETIZATION_MAP.md` has an established price. Where no price exists, the UI says "learn more" / "contact," never an invented number.

## Research standards

Source hierarchy (Tier 1 official → Tier 4 unverified), confidence levels (High / Medium / Low / Unknown), per-section confidence summaries, source links, date accessed, last reviewed, next review, open questions, and areas requiring local counsel. Full detail in the Research Integrity & Hallucination Audit System spec. Tier 4 sources may only identify questions worth researching; they never support a legal or tax conclusion alone.

## Risks and disclaimers

- **Not advice.** Every result page and report carries plain-English language: "This is not legal, tax, investment, or financial advice." Outputs are preparation documents for a conversation with a professional.
- **Accuracy risk.** Jurisdictional law changes. Mitigated by the integrity system, last-reviewed dates, stale-claim detection, and cautious public wording.
- **Overreach risk.** The audit could be read as telling someone what to do. Mitigated by framing outputs as flags and questions, never instructions.
- **Privacy risk.** The audit must never collect seeds, keys, addresses, exact balances, passwords, PINs, full legal names, passport/tax IDs, bank numbers, or exact addresses. Categories and ranges only.
- **Liability framing.** The product identifies exposure and routes to professionals. It does not opine on any individual's legal position.

## MVP scope

- Public deep dive page.
- Interactive questionnaire (non-sensitive).
- Personalized exposure output (classification, not score).
- Five-to-six initial jurisdiction profiles (USA researched; others as they clear the integrity gate).
- Product routing.
- Research source table + last-reviewed dates.
- Clear disclaimers.
- Upgrade path to paid reports.

## Future version scope

- Full first cohort + recommended next jurisdictions (Canada, Mexico, Argentina, UAE, Spain, Israel, UK, Singapore, Hong Kong, Germany).
- Saved maps (only with reviewed privacy/security design and explicit user opt-in).
- Visual outputs (heatmaps, role maps, comparison tables).
- Spanish localization of the deep dive and tool.
- Advisor workspace (multi-client intake) gated to the Advisor tier.
- Quarterly research-update cadence operationalized via the subagent workflow.

---

# Part 2 — Information architecture (Deliverable 2)

Three layers, consistent with the original spec.

## Layer 1 — Public deep dive

Route: `/deep-dives/jurisdictional-exposure-audit/` (folder + `index.html`, matching the `foundational-layer-thesis` pattern).

Page structure (sections map to the 12 modules in `deep-dive.md`):

1. Hero: title, subtitle, one-line thesis, "Start the audit" + "Read the modules" actions, disclaimer line.
2. Module 1 — What jurisdiction really means.
3. Module 2 — The 10 layers of exposure.
4. Module 3 — Bitcoin-specific jurisdiction risks.
5. Module 4 — Tax visibility and reporting.
6. Module 5 — Estate, inheritance, forced heirship.
7. Module 6 — Banking, liquidity, de-risking.
8. Module 7 — Self-custody, collaborative security, legal authority.
9. Module 8 — Cross-border families.
10. Module 9 — Business and family-office exposure.
11. Module 10 — How to build your own exposure map.
12. Module 11 — Country research library (entry point to Layer 1.5).
13. Module 12 — Next steps and professional review (routing).
14. Footer: `Created by Dalia · bitcoinsovereign.academy`, last-reviewed date, disclaimer.

Sticky in-page nav (anchor list). Reflect widget (`data-topic="jurisdiction"`) per repo convention. Live context bar optional.

## Layer 1.5 — Country research library

Route: `/deep-dives/jurisdictional-exposure-audit/library/` (index) and `/library/<country>/` per country.

- **Library index**: card grid, one card per jurisdiction. Each card shows country, region, per-section confidence chips (Tax / Bitcoin reg / Reporting / Estate / Banking / Direction), last-reviewed date, and a small "direction of travel" tag set. No overall ranking, no "score."
- **Country page**: renders a jurisdiction profile from JSON. Sections follow the 11-part template. Each non-obvious claim links to its source. A confidence summary sits at the top. A "requires local counsel" panel lists open questions. A "what this means for a Bitcoin holder" block translates law into planning implications without advising.
- Profiles that have not cleared the integrity gate show a "research in progress" state and do not display unverified claims.

## Layer 2 — Interactive audit tool

Route: `/deep-dives/jurisdictional-exposure-audit/audit/` (or an in-page modal launched from the deep dive). No login for the free version. No sensitive data collected. State held client-side; nothing persisted server-side in the MVP.

Flow:

1. **Entry / framing.** One screen: what this is, what it is not, and the data-safety promise ("Do not enter seed phrases, private keys, exact balances, passwords, or ID numbers"). Single "Begin" action.
2. **User type.** Choose one or more: I own Bitcoin personally / I advise clients / I have a cross-border family / I own a business or family office / I am considering changing countries / I am not sure, help me map my exposure. This selection tailors which later sections appear.
3. **Personal jurisdiction map.** Which countries connect to residence, citizenship, tax residence, domicile, employment, business, real estate, accounts, heirs, spouse, documents, advisors, exchanges, custody, device/backup locations, trusted helpers. (Countries as a multi-select; roles as checkboxes per country, kept lightweight.)
4. **Bitcoin ownership and custody map.** Forms of exposure and, per form, the control questions (who can move funds, who knows it exists, who has authority, who has skill, what happens if the primary person is unavailable, is it documented, is the documentation safe).
5. **Tax visibility map.** Non-sensitive: where bought, record availability, presence of sales/swaps/gifts/loans/payments, foreign accounts, connection to wealth/exit/inheritance/gift/worldwide-tax jurisdictions, advisors per country.
6. **Estate and family map.** Locations of holder/spouse/heirs/executor, document validity and language, family awareness, scam-vs-legitimate-recovery literacy, the four control mismatches (authority vs access, awareness vs skill).
7. **Banking and liquidity map.** Number of banks, countries, 30/60/90-day resilience, clean fiat movement, source-of-funds organization, single points of dependence, capital controls.
8. **Device, identity, platform map.** Which phone/email controls accounts, password manager, 2FA, hardware keys, cloud exposure, travel-device exposure, recovery tied to one phone network, heir access to records without secrets.
9. **Documentation paradox classifier.** For each sensitive item, the user picks how they currently handle it; the tool maps each to a recommended handling class (document clearly / keep separate / do not digitize / discuss with attorney, etc.). This is the highest-value free interaction.
10. **Business / family-office module.** Shown only if relevant: ownership, signer authority, treasury policy, banking rails, tax/accounting, board approval, continuity/key-person.
11. **Scenario stress test.** A short set of "what if" prompts (a bank freezes an account, the primary key-holder is unavailable for 60 days, a move triggers tax residence) to surface fragility the structured questions miss.
12. **Result: Your Jurisdictional Exposure Map.** Primary exposure type, countries involved, Bitcoin exposure type, flags by category, questions to ask professionals, recommended BSA/TSA resources, possible paid pathway. Plain-language, no score, disclaimer present.

UX rules: guided map not quiz; no badges/points/levels/percent-complete; plain labels (Stable / Fragile / Concentrated / Unclear / Needs review / Missing / Documented / Overexposed / Mismatch); no scary "high risk" language; works without animation; keyboard-navigable; mobile-first.

## Layer 3 — Paid research packets and reports

Route: gated, generated as written documents (not interactive). Each maps from the audit output.

1. **Personal Jurisdictional Exposure Report** — exposure map, country-by-country issue list, Bitcoin custody implications, estate questions, tax questions for CPA, legal questions for attorney, family continuity risks, next steps.
2. **Cross-Border Bitcoin Family Report** — family role map, executor risk map, language/document map, recovery workflow, what each person should and should not know, emergency access plan.
3. **Advisor Jurisdiction Intake Kit** — client questionnaire, jurisdiction checklist, Bitcoin custody classification guide, red-flag questions, what not to ask clients, referral triggers, model meeting script.
4. **Business / Treasury Jurisdiction Review** — corporate ownership map, signer authority map, treasury policy questions, banking rail exposure, tax/accounting questions, board approval checklist, continuity and key-person review.

Each paid deliverable is **human-reviewed before delivery** (see human-review flags in the integrity system) and carries the not-advice disclaimer.

## Navigation + cross-linking

- Deep dive → audit (primary CTA) and → library.
- Library country page → relevant deep-dive module + audit.
- Audit result → deep-dive modules, library pages, professional-question list, and the single best-fit paid pathway (soft CTA, never forced).
- Entry points from existing surfaces: `emergency-kit.html`, `interactive-demos/sovereign-vault/`, `institutional/wealth-advisors/`, and inheritance lessons, consistent with the existing funnel map.
