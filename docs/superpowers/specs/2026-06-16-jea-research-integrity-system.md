# JEA — Research Integrity & Hallucination Audit System

> The Jurisdictional Exposure Audit. Deliverable 11.
> Created 2026-06-16. Owner: Dalia. Status: foundation pack.
> This system governs every jurisdictional claim in the product. It is not optional polish; it is the reason the product can be trusted.

**Core rule.** No legal, tax, estate, regulatory, or jurisdictional claim appears as a confident statement unless a reliable source supports it. Every non-obvious claim is classified, sourced, dated, and given a confidence level. A smaller profile with verified sources beats a large profile full of confident but unsupported claims. A cautious conclusion beats a false one.

Machine-readable schemas live at `deep-dives/jurisdictional-exposure-audit/data/schema/jurisdiction-claim-ledger.schema.json` and `jurisdiction-source-ledger.schema.json`. Seeded instances (USA) live alongside them.

---

## 1. Claim classification model

Every non-obvious claim is one of:

- **A. Directly sourced** — clearly supported by an official or high-quality source.
- **B. Interpreted** — based on reading one or more reliable sources, requiring interpretation.
- **C. Comparative** — compares two or more jurisdictions.
- **D. Direction-of-travel** — about where a country or the global system seems to be moving.
- **E. Practical implication** — what the law may mean for holders, families, advisors, or businesses.
- **F. Unknown or unresolved** — sources are missing, conflicting, outdated, or unclear.

Each non-obvious claim records: claim text, jurisdiction, topic category, source IDs, source title, source type, source date (if available), date accessed, confidence level, claim type, last verified date, reviewer note, and whether local counsel is required. These fields are enforced by the claim-ledger schema.

## 2. Source hierarchy

- **Tier 1.** Official tax authority, financial regulator, securities/commodities regulator, central bank, legislation/legal code, court decision, OECD, FATF, EU official source, official treaty/reporting-framework source.
- **Tier 2.** Major accounting firms, reputable law firms, recognized policy institutions, academic legal/tax research, established professional associations.
- **Tier 3.** Exchange documentation, custodian documentation, industry reports, reputable media, specialist Bitcoin/crypto policy analysis.
- **Tier 4.** Blogs, Reddit, forums, unverified newsletters, social media, marketing pages.

**Tier 4 sources may not support a legal or tax conclusion by themselves.** They may only identify questions worth researching. A claim whose only support is Tier 4 must be classed F and marked `public_safe: false`.

## 3. Confidence levels

- **High** — official source, recent, clear, directly supports the claim.
- **Medium** — reliable sources exist, but the issue requires interpretation or sources are not perfectly aligned.
- **Low** — sources are indirect, outdated, incomplete, or mostly secondary.
- **Unknown** — no reliable source found, or sources conflict.

Every country profile carries a confidence summary by section (basic, tax, bitcoin regulation, reporting, estate, banking, asset protection, mobility, holder implications, direction of travel).

## 4. The hallucination detection checklist

Run before any profile, public page, tool output, or paid report is marked ready:

- Does every legal/tax/estate/regulatory claim have a source?
- Is the source official or high quality?
- Is the source recent enough?
- Is the claim stronger than the source allows?
- Is a secondary source being treated like primary law?
- Are different crypto assets incorrectly grouped with Bitcoin?
- Is Bitcoin treated as identical to securities, stablecoins, or tokenized assets where the jurisdiction separates them?
- Is a US rule accidentally generalized to other countries?
- Is residency confused with citizenship?
- Is legal residence confused with tax residence?
- Is tax treatment confused with banking access?
- Is Bitcoin legality confused with self-custody protection?
- Is estate law confused with technical recovery?
- Is an advisor implication stated as law?
- Is a direction-of-travel claim supported by actual policy movement?
- Are uncertain areas clearly marked as requiring local counsel?
- Are there stale claims that need re-checking?
- Are we making a recommendation that should be framed as a question?
- Are we using scary language where neutral language is more accurate?
- Are we implying tax avoidance instead of compliance and planning?
- Are we collecting or asking for sensitive user data we should not collect?

## 5. Contradiction and consistency review

Compare claims across all profiles and flag contradictions such as:

- Summary says "self-custody allowed" but the regulation section says "unclear."
- Tax overview says "no capital gains tax" but holder implications mention taxable gains.
- Estate says "trusts recognized" but open questions say recognition unknown.
- Direction of travel says "Bitcoin-friendly" but banking says crypto banking is highly restricted.
- Product routing suggests a family kit but family complexity was not indicated.
- Tool output says "high confidence" but section confidence is low.
- A claim has no source but appears in public content.
- A claim is copied across countries without jurisdiction-specific evidence.
- A profile has no "last reviewed" date.

When a contradiction is found, the process is fixed and non-negotiable:

1. Flag the contradiction.
2. Identify the exact fields or text that conflict.
3. Lower the confidence level until resolved.
4. Add an open research task.
5. Replace any public-facing conclusion with cautious language.
6. Never silently keep the stronger claim.

## 6. Stale-claim detection

Every claim carries `next_review`. Cadence:

- **Monthly/quarterly (high-change):** crypto tax reporting, broker reporting, exchange regulation, CARF implementation, FATF Travel Rule implementation, stablecoin regulation, new legislation, ETF/fund rules.
- **Quarterly/semiannual (medium-change):** general Bitcoin tax treatment, exchange licensing, banking access, residency rules, corporate holding rules.
- **Annual (lower-change):** general legal system, broad estate-law structure, forced-heirship framework, trust recognition, basic citizenship framework.

If a claim is past `next_review`, it is marked `stale` and must not appear as a high-confidence conclusion until re-verified.

## 7. Direction-of-travel audit

Direction-of-travel claims are valuable and dangerous, because they can become opinion disguised as research. Every direction label must carry evidence, source, rationale, confidence, counterevidence, and last-reviewed date (enforced by the profile schema's `direction_of_travel` array).

Never label a country "Bitcoin-friendly" without stating friendly **for whom**: individuals, businesses, miners, exchanges, banks, ETFs, self-custody users, foreign residents, family offices, or estate planning. A country can be institution-friendly and self-custody-ambiguous at the same time.

## 8. Human-review-required flags

These claim types must be flagged `human_review_required: true` and may be drafted by Claude but not published without human sign-off unless strongly supported by official sources:

tax rates; taxable events; inheritance or forced heirship; trusts or foundations; exit tax; reporting obligations; criminal penalties; account freezing or seizure; self-custody legality; advisor permissions; country rankings; "best jurisdiction" conclusions.

## 9. The "no-source, no-confidence" rule

If a legal, tax, estate, regulatory, or reporting claim cannot be verified, do not invent or assume it. Use one of:

- "This requires local counsel."
- "Reliable public guidance was not found in this research pass."
- "The available sources do not support a confident conclusion."
- "This should be treated as an open question."
- "This may vary by facts, residency, entity type, or transaction history."
- "This should not be used as legal or tax advice."

## 9b. Source Verification Rule (mandatory — added 2026-06-16)

**Standing rule: all information in the product must be verifiable and true.** A claim is not "verified" because a research pass or an agent reported a source. It is verified only when a reviewer has actually opened a resolvable source that *directly supports the claim text*, at the tier the claim's confidence implies.

Operationally:

- A claim may be `status: verified`, `confidence: high`, and `public_safe: true` **only** if a reviewer opened a primary (Tier 1) or strong corroborated secondary (Tier 2) source confirming it. Record the verification date.
- A claim sourced only from an unopened URL, an agent summary, or a single Tier‑3 source is **`needs-review` at most**, and public-facing wording must be cautious.
- When sources **conflict** (e.g. the Colombia wealth-tax threshold), the claim is downgraded to `low`/`needs-review`, the conflict is stated in the claim text, and no single figure is asserted.
- Verification is **re-run on the review cadence** (a source that resolved last quarter may have moved or changed).
- Every verification pass is logged in `deep-dives/jurisdictional-exposure-audit/data/VERIFICATION-LOG.md` with the date, the claims checked, the query/source, and the outcome (confirmed / downgraded / corrected).

This rule applies to every profile, the deep dive, the audit result narratives, and the paid reports. "A cautious conclusion is better than a false one" is not aspirational here; it is the gate.

## 10. Self-correction workflow

When the audit finds an unsupported, contradicted, stale, or overconfident claim, do exactly one of: (A) correct it if reliable sources support a correction; (B) downgrade it if evidence is weak; (C) rewrite it as an open question; (D) remove it from public content; (E) add a research task for specialist review. Record the correction in this format:

```
Original claim: [claim]
Problem: [unsupported / contradicted / stale / overconfident / wrong jurisdiction / weak source]
Evidence: [source or lack of source]
Correction: [new claim or removal]
Confidence: [high / medium / low / unknown]
Public wording: [plain-language version safe for users]
Research task: [what still needs to be checked]
```

## 11. Claim lifecycle (status)

`verified` → public-safe. `needs-review` → public-safe only with cautious wording. `contradicted`, `stale`, `unsupported`, `replaced`, `removed` → not public-facing except framed as open questions. Public-facing content may only use claims with status `verified` or `needs-review`.

## 12. Automated / semi-automated test suite

A validator script (`scripts/jea-integrity-check.mjs`, **built**; run `npm run jea:check` — 19 tests, all passing as of 2026-06-16) runs these tests against the ledgers, profiles, deep dive, and questionnaire. Each maps to a pass/fail.

- **Test 1.** Every profile has at least one source per major section, or marks that section unknown.
- **Test 2.** Every public-facing claim maps to a claim ID.
- **Test 3.** Every claim ID maps to at least one source, or is marked unknown.
- **Test 4.** No unsupported claim appears in the public deep dive.
- **Test 5.** No stale high-confidence claim appears in outputs.
- **Test 6.** No country has a direction-of-travel label without evidence.
- **Test 7.** No product-routing claim uses legal or tax certainty unless sourced.
- **Test 8.** No output asks for seed phrases, private keys, exact balances, passwords, PINs, wallet addresses, or personal ID numbers.
- **Test 9.** No profile uses another country's law by analogy (manual + reviewer attestation; flagged for any cross-country copied claim text).
- **Test 10.** No Bitcoin claim is generalized from broader crypto rules unless the source does so and the limitation is stated.
- **Test 11.** All "requires local counsel" flags appear in user-facing language where appropriate.
- **Test 12.** Every result page includes plain-English "not legal, tax, investment, or financial advice" language.

### Cohort-wide cross-checks (added 2026-06-16, automated)
These were previously run by hand during the country-research pass and are now part of the suite:

- **CC1.** Every `source_id` referenced by any profile resolves in the source ledger.
- **CC2.** Every `source_id` referenced by any ledger claim resolves in the source ledger.
- **CC3.** No duplicate `claim_id` in the ledger.
- **CC4.** Profile and ledger agree on `public_safe` for any shared `claim_id` (the cross-artifact contradiction guard).
- **CC5.** Every profile has `last_reviewed`, `next_review`, and a `confidence_summary`; every present section has a confidence entry.
- **CC6.** No profile field with `confidence: unknown` or `claim_type: F-unknown-unresolved` is `public_safe` (unresolved claims render as open questions, never as statements). *This caught the Panama CARF conflict and moved it to open questions.*
- **CC7.** No `public_safe` ledger claim is supported solely by Tier-4 sources.

## 13. Worked examples

### 13a. Corrected claim
```
Original claim: "In the US, foreign accounts holding Bitcoin must be reported on the FBAR."
Problem: overconfident / partly wrong jurisdiction-of-rule reading.
Evidence: FinCEN Notice 2020-2 [src-fincen-fbar-vc] — an account holding only virtual currency is not currently FBAR-reportable; FinCEN noticed intent to amend.
Correction: "A foreign account holding only virtual currency is currently not FBAR-reportable, but FinCEN has noticed intent to amend; mixed accounts can be reportable."
Confidence: medium
Public wording: "US FBAR treatment of crypto-only foreign accounts is in transition; confirm with a tax professional."
Research task: re-verify amendment status each quarter (next review 2026-09-16).
```

### 13b. Downgraded claim
```
Original claim (High): "The US is not a CRS participant." [no source captured]
Problem: unsupported in this pass (well-known but uncited).
Evidence: none captured 2026-06-16.
Correction: keep claim, downgrade to Medium, status needs-review, public_safe false until OECD CRS participant-list URL is added.
Confidence: medium
Public wording: withhold from public content until sourced.
Research task: add OECD CRS participant-list source; then raise to verified.
```
(This is exactly how claim `us-rep-002` is recorded in the seeded ledger.)

### 13c. Open question (instead of a guess)
```
Topic: US tax treatment of Lightning payments.
Finding: no Lightning-specific IRS guidance found this pass.
Output: "No Lightning-specific IRS guidance was found. Treat as a property disposition by default and confirm with tax counsel." Status: unsupported, public_safe false, surfaced only as an open question.
```
(Recorded as `us-tax-007`.)

### 13d. Contradiction report
```
Contradiction ID: ctr-2026-06-16-001 (hypothetical, for illustration)
Profiles involved: country X
Conflict: basic_profile.general_attitude_bitcoin says "self-custody friendly" while bitcoin_regulation.self_custody_allowed is "unclear".
Fields: basic_profile.general_attitude_bitcoin (claim x-basic-002) vs bitcoin_regulation.self_custody_allowed (claim x-btc-002).
Action: lowered both to Low; replaced public summary with "self-custody legality is unclear pending a primary source"; opened research task; status set needs-review on both; stronger claim NOT kept.
```

## 14. Research Integrity Check (required before any final output)

Before presenting any architecture, profile, public draft, data model, or implementation plan, produce a short "Research Integrity Check" section listing: what was verified, what remains uncertain, what was downgraded, what needs human review, what sources are missing, and what should not yet be published as a confident claim. The check for this foundation pack is in `2026-06-16-jea-implementation-plan.md` §MVP and was also delivered in the session summary.

## 15. The verification rule (STANDING RULE — verifiable-or-it-doesn't-ship)

> Added 2026-06-16 at the owner's instruction. This rule is binding on every profile, page, and report, now and in future updates.

**All information must be verifiable and true.** Nothing ships as a confident, public-facing claim unless a reviewer has personally opened a reliable source that directly supports it. "A research agent reported it," "it's widely known," or "a secondary source says so" is **not** verification.

### 15.1 The bar for each confidence level
- **High / `verified` + `public_safe: true`** — requires that a **Tier-1 primary source has been opened and personally confirmed** to support the exact claim, OR that two independent Tier-2 sources agree AND the claim is not a human-review topic (§8). Record the verification in the claim's `last_verified` date and a reviewer note.
- **Medium** — reliable sources exist and were read, but rest on Tier-2/3 or require interpretation, or a single source not yet cross-checked. Permitted in public content with cautious wording.
- **Low / Unknown** — indirect, conflicting, outdated, or agent-reported-but-unconfirmed. **Not** `public_safe` unless framed as an open question.

### 15.2 Provenance must be honest
A claim sourced from an automated research pass but not yet personally confirmed against its primary source is **"agent-sourced, unconfirmed"** and is capped at **Medium / `needs-review`** until a reviewer opens the source. It may never be presented as High/verified on agent output alone. Use the reviewer note field to state which sources were actually opened.

### 15.3 The verification pass (run on every profile before "published", and on any claim upgraded to High)
1. Open each cited source URL and confirm it resolves and says what the claim says.
2. Confirm the claim is not stronger than the source allows (§4).
3. Confirm the source tier matches the confidence (Tier-4 can never support a legal/tax conclusion).
4. If the source can't be opened or doesn't support the claim: downgrade to Medium/Low/Unknown, set `needs-review`, and add a research task. Never leave it High.
5. Record the date and what was confirmed.

### 15.4 Conflicts beat confidence
If two reliable sources give different figures (e.g. a tax threshold), the claim is **Low** with a note naming the conflict — never split the difference, never pick the convenient number. (Worked example: Colombia's wealth-tax threshold, 72,000 UVT vs a reported ~40,000 UVT — recorded Low with a conflict note rather than asserting either.)

### 15.5 Verification log (2026-06-16 pass)
- **Primary-confirmed this pass:** USA (IRS property treatment, 1099-DA/Notice 2025-33, FBAR-crypto status, §877A, estate figures via Rev. Proc. 2025-32, FinCEN FIN-2019-G001, SEC spot-ETP, OECD CRS non-participation); Australia (ATO CGT/discount/personal-use, SMSF rules, AUSTRAC, Digital Assets Framework, CARF/CRS, CFR debanking, **CGT event I1 departure deemed-disposal**); El Salvador (legal-tender repeal 30 Jan 2025); Panama (crypto law unconstitutional July 2023; no inheritance/estate/gift tax since 2002); Switzerland (private-investor CGT exemption + professional-trader criteria; 2023 reserved-portion reform 3/4→1/2).
- **Also primary-confirmed in the second batch:** Colombia (DIAN Oficio 30470/2019 intangible-asset classification; Form 160 foreign-asset threshold 2,000 UVT); Panama (FATF grey-list removal 27 Oct 2023); Switzerland (DLT Act in force 1 Aug 2021, ledger-based securities, FINMA first DLT trading facility).
- **Corrected by this rule:** Colombia wealth-tax threshold High→Low (source conflict); **Panama CARF status High→Low** (one source says not committed, a 2025 source lists Panama as committed for 2027/2028/2029 — conflict, not resolved); Switzerland CARF date High→Medium (Tier-2 only, global dates in flux); El Salvador CARF status Medium→Low (committed list is moving; re-verify).
- **Cleared in the third batch:** Panama (territorial-tax foreign-source-income exemption corroborated; Qualified Investor Visa threshold US$300k until 15 Oct 2026 then US$500k — pa-mob-001 upgraded Low->Medium); Switzerland (CRS first exchange autumn 2018; lump-sum abolished in ZH/SH/AR/BL/BS; Circular 36 five safe-harbour criteria confirmed).
- **Cleared in the fourth (estate/statute) batch:** Colombia forced heirship **corrected** to the post-Ley 1934/2018 regime (legítima half + freely-disposable half; old 50/25/25 was pre-2018) and verified; Panama testamentary freedom vs intestate equal-share reconciled and verified; Switzerland descendant-taxing cantons (AI/NE/VD) and thresholds verified; Australia family-provision verified (NSW Succession Act 2006 s57/s60 + per-state Acts). Added pa-est-001 and au-est-001 to the ledger.
- **Still open / capped (need the actual local statute or are unresolved):** El Salvador testate forced-heirship reserve (legítima) fraction — intestate equal-share confirmed, the testate reserve is NOT (kept Low/needs-review); marital-property regimes across the cohort; Panama foreign-will recognition mechanics; Colombia foreign-trust recognition; per-canton Swiss wealth-tax rates; the Panama CARF conflict (open question). Professional-judgment items (Swiss professional-trader reclassification, Panama territorial-source edge cases) stay Medium by nature even with the rule text confirmed.
