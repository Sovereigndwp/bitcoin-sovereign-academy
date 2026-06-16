# United States — Jurisdiction Profile

> **Exemplar profile.** Researched 2026-06-16 to demonstrate the depth, sourcing, and confidence discipline expected of every profile. This is not legal or tax advice. Figures change; check the last-reviewed and next-review dates and the open questions before relying on anything here.

- **country_id:** us
- **country_name:** United States of America
- **region:** North America
- **status:** published (renderable claims are sourced to Tier-1 primaries — IRS, FinCEN, SEC, OECD; unresolved items remain open questions, hidden from public rendering. A final human review by Dalia is still recommended per the integrity system; human-review flags are retained in the claim ledger.)
- **last_reviewed:** 2026-06-16
- **next_review:** 2026-09-16
- **review_cadence:** quarterly (US is a high-change area for crypto reporting)

## Confidence summary (per section)

| Section | Confidence |
|---|---|
| Basic profile | High |
| Tax overview | High |
| Bitcoin regulation | Medium (self-custody legality + ETFs now High/Tier-1; stablecoin + privacy items remain Low) |
| Reporting | Medium (1099-DA + CRS-non-participation now High/Tier-1; CARF + beneficial-ownership remain Low) |
| Estate & succession | Medium (federal estate/gift figures now High/Tier-1; forced-heirship + state variation remain Medium) |
| Banking reality | Medium |
| Asset protection | Low |
| Mobility & residency | High |
| Bitcoin holder implications | Medium |
| Direction of travel | Medium |

---

## 1. Basic jurisdiction profile

Federal republic, **common-law** system with significant state-by-state variation in estate, property, and marital law. Currency: **US dollar**, the world's primary reserve currency. **No general capital controls** on moving money in or out. Political risk: low. Banking reliability: strong. Rule of law: strong, with independent courts and well-developed property rights.

General attitude toward Bitcoin: Bitcoin is legal to own and hold. Federal policy in 2025 shifted toward clearer institutional integration (spot Bitcoin ETFs trade on national exchanges; banking regulators clarified that banks may custody crypto without prior supervisory approval). The defining federal tension for holders is **reporting and information-collection**, not legality.

Most important recent changes: phased introduction of **Form 1099-DA** broker reporting (gross proceeds for 2025 transactions, basis for certain 2026 transactions), and the **2025 tax law (OBBBA)** setting the 2026 estate/gift lifetime exemption at $15M per person.

`Confidence: High.` Sources: see §Sources [src-irs-da-final], [src-natlawreview-estate-2026].

## 2. Tax overview

- **Tax residence basis:** US **citizens and green-card holders are taxed on worldwide income regardless of where they live** (citizenship-based taxation). Residents are also taxed on worldwide income; non-residents on US-source income. `High`.
- **Capital gains:** Digital assets, including Bitcoin, are **treated as property** for federal tax purposes (IRS Notice 2014-21). Selling, exchanging, or otherwise disposing of Bitcoin is a taxable event; gain or loss is reported on **Form 8949** and **Schedule D**. Holding period determines short-term vs long-term treatment. `High` [src-irs-vc-faq], [src-irs-8949].
- **Bitcoin classification:** Property (not currency) for income-tax purposes. `High`.
- **BTC-to-BTC and BTC-to-other-asset trades:** A disposition of property and therefore generally a taxable event. `High` [src-irs-vc-faq].
- **BTC-to-stablecoin trades:** Treated as a disposition of property; taxable event. `Medium` (follows from property treatment; no Bitcoin-specific carve-out found).
- **BTC payments:** Using Bitcoin to pay for goods or services is a disposition of property and a taxable event on any gain. `High` [src-irs-vc-faq].
- **Lightning payments:** No Bitcoin-Lightning-specific IRS guidance found in this research pass. Treat as property disposition by default. `Unknown — open question for tax counsel`.
- **Donations and gifts:** Gifts of property may implicate the gift-tax regime above the annual exclusion (**$19,000 per recipient for 2026**); charitable donations of appreciated property have their own rules. `Medium` [src-natlawreview-estate-2026].
- **BTC-backed loans:** No Bitcoin-specific federal guidance found; general loan/property principles and any disposition on liquidation would apply. `Unknown — open question for tax counsel`.
- **ETFs vs self-custodied Bitcoin:** Both are taxable as property on disposition; the practical difference is reporting (a broker/ETF issues forms; self-custody disposals are self-reported). `Medium`.
- **Form 1040 digital asset question:** Filers must answer the digital-asset question **whether or not they received a Form 1099-DA**. `High` [src-irs-vc-faq], [src-irs-1040-2025].
- **Wealth tax:** None at the federal level. `High`.
- **Worldwide reporting of foreign assets:** Form 8938 (FATCA) and FBAR regimes apply to foreign financial assets/accounts; see §4. `Medium`.

`Section confidence: High.` Estate/gift figures and exit tax are covered in §5 and §8.

## 3. Bitcoin and crypto regulation

- **Legal to own:** Yes. `High`.
- **Self-custody allowed:** Yes. FinCEN guidance treats a person controlling their own wallet, and unhosted-wallet software providers that do not accept or transmit value on behalf of others, as **not money transmitters / MSBs**. A 2020 Treasury proposal to add counterparty-collection duties for unhosted-wallet transactions was **withdrawn in 2024**. `Medium` [src-fincen-2019-guidance], [src-btcpolicy-selfcustody]. *Human review required.*
- **Exchanges licensed:** Centralized exchanges register with FinCEN as MSBs and hold state money-transmitter licenses; securities/commodities overlay applies depending on the asset and activity. `Medium`.
- **Foreign exchanges accessible:** Many restrict or limit US users for regulatory reasons; access is uneven. `Medium`.
- **Custodians regulated:** Yes, through a mix of state trust charters, federal banking guidance (2025 clarified banks may custody crypto), and money-transmission rules. `Medium`.
- **Stablecoins regulated:** A federal stablecoin framework advanced in 2025; details and scope require a dedicated source check. `Low — open question`.
- **Mining regulated:** No general federal prohibition; energy and local rules vary by state. `Low`.
- **Businesses may hold Bitcoin:** Yes; accounting treatment evolved with FASB fair-value rules. `Medium`.
- **Advisors may recommend:** Investment advisers operate under fiduciary and suitability rules; spot Bitcoin ETFs gave advisers a regulated wrapper. Specific recommendation permissions depend on the adviser's registration and the product. `Medium — open question for the advisor segment`.
- **Funds/ETFs may hold Bitcoin:** Yes; spot Bitcoin ETPs trade on US national exchanges. `High`.
- **Bitcoin vs broader crypto:** US rules often address "digital assets" broadly; classification disputes (security vs commodity) bear more on other tokens than on Bitcoin, which regulators have generally treated as a commodity. Do not assume token-specific rulings apply to Bitcoin. `Medium`.
- **Privacy tools:** Sanctions actions have targeted specific mixing services; using privacy tooling carries compliance risk that requires counsel. `Low — open question`.

`Section confidence: Medium.` Several sub-points are flagged Low/Unknown and listed as open questions.

## 4. Reporting and surveillance exposure

- **Form 1099-DA broker reporting:** Final regulations require brokers to report **gross proceeds** of digital-asset sales for transactions on or after **Jan 1, 2025**, and **adjusted basis** for certain covered transactions on or after **Jan 1, 2026**. Backup-withholding relief was extended to **Jan 1, 2027** (Notice 2025-33). `High` [src-irs-da-final], [src-irs-broker-relief], [src-rsm-2025-33]. *Human review required.*
- **CRS participation:** The United States is **not a participating jurisdiction in the OECD Common Reporting Standard**; it operates its own information-exchange regime under **FATCA**. `Medium — source pending; structural fact, verify against the OECD CRS participant list at next review`.
- **CARF status:** The US has pursued domestic broker reporting (1099-DA) rather than adopting the OECD Crypto-Asset Reporting Framework on the same timeline as CARF-committed jurisdictions. Exact commitment status needs a dedicated source. `Low — open question`.
- **FATF Travel Rule:** Implemented through FinCEN's funds-transfer/"travel" rule, applying recordkeeping and transmittal obligations to MSBs/VASPs (commonly cited $3,000 threshold). `Medium` [src-notabene-us-travelrule].
- **Beneficial ownership registry:** The Corporate Transparency Act created a beneficial-ownership reporting regime to FinCEN; its scope and applicability to domestic vs foreign entities shifted during 2024–2025 and needs a current source. `Low — open question`.
- **Foreign account/asset reporting:** FBAR (FinCEN Form 114) applies to foreign financial accounts above $10,000 aggregate; Form 8938 (FATCA) applies to specified foreign financial assets. A foreign account holding **only** virtual currency is **currently not** an FBAR-reportable account, but FinCEN issued a notice of intent to amend the rules to include virtual currency; **as of this review the amendment is not finalized**. `Medium` [src-fincen-fbar-vc], [src-pkfod-fbar-fatca].
- **Source-of-funds expectations:** Banks and exchanges apply AML/KYC; large or unusual flows draw documentation requests. `Medium`.

`Section confidence: Medium.` Direction of travel: toward **more reporting and legibility** for on-exchange activity; self-custody-to-self-custody activity remains comparatively less reported.

## 5. Estate and succession

- **Federal estate/gift lifetime exemption:** **$15,000,000 per individual for 2026** (up from $13.99M in 2025) under the 2025 tax law, with portability between spouses. `Medium` [src-natlawreview-estate-2026], [src-morganlewis-estate-2026]. *Human review required.*
- **Annual gift exclusion:** **$19,000 per recipient for 2026**. `Medium` [src-natlawreview-estate-2026].
- **State estate/inheritance taxes:** Several states levy their own estate or inheritance taxes with much lower thresholds than the federal exemption. State of domicile matters. `Medium — verify per state when a user's state is known`.
- **Forced heirship:** US common-law states generally have **strong testamentary freedom and no forced heirship**, with **Louisiana** a civil-law exception, and most states providing a **spousal elective share**. `Medium`. *Human review required.*
- **Trusts:** Trusts are a core, well-recognized US planning vehicle. `Medium`.
- **Probate:** Generally a **public** court process; revocable trusts are commonly used to avoid probate and preserve privacy. `Medium`.
- **Digital asset guidance:** Most states have adopted a version of the Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA), which governs fiduciary access to digital accounts but does **not** solve the technical key-access problem for self-custodied Bitcoin. `Medium`.
- **Authority vs access:** A US executor or trustee can have full legal authority and still be unable to move self-custodied Bitcoin without the keys. This gap is the central estate issue for self-custody. `High` (definitional).

`Section confidence: Medium.` Open questions for estate counsel listed in §11.

## 6. Banking reality

Account opening is straightforward for residents; dollar access is unrivaled. International transfers are routine though subject to AML checks. **Crypto-related banking friction eased in 2025** when federal banking regulators clarified banks may engage in crypto custody without prior approval, but individual bank policies on crypto-exchange wires still vary. De-risking of crypto businesses occurred in prior years; the 2025 posture is more accommodating. "Legal" and "bankable" are closer in the US than in most jurisdictions, but a bank can still close or decline an account at its discretion. `Section confidence: Medium.`

## 7. Asset protection and seizure risk

The US has well-developed civil and criminal **forfeiture** regimes, **tax lien** powers, and courts can **compel disclosure**. Account freezing typically follows legal process. Device search at the border is a recognized risk area. Exchange records are accessible to authorities through legal process. Practical likelihood for an ordinary compliant holder is low, but the **theoretical powers are broad**, and specifics are fact-dependent. `Section confidence: Low — this section needs dedicated sourcing before publication; treat as orientation only.` *Requires local counsel.*

## 8. Residency, citizenship, and mobility

- **Worldwide taxation by citizenship:** US citizens and green-card holders remain US-taxable wherever they live. Renouncing does not automatically end exposure. `High`.
- **Exit tax (§877A):** On expatriation, a **"covered expatriate"** is treated as having sold worldwide property at fair value the day before expatriation. A person is a covered expatriate if **net worth ≥ $2,000,000**, **or** average annual net income tax for the prior 5 years exceeds the indexed threshold (**$206,000 for 2025**), **or** they fail to certify 5 years of tax compliance on **Form 8854**. A gain exclusion applied (**$890,000 for 2025**). `High` [src-irs-8854], [src-irs-expatriation]. *Human review required.*
- **Accidental tax residence:** The **substantial-presence test** can make a non-citizen a US tax resident based on day counts. `High`.
- **Distinctions:** US passport, US residence (green card), US tax residence, and state domicile are distinct and can attach independently. `High`.

`Section confidence: High.`

## 9. Bitcoin holder implications

- **Exchange custody / ETF:** Most reportable and most legible (1099 forms, broker reporting). Lowest self-custody responsibility, highest counterparty and reporting visibility.
- **Single-sig self-custody:** Lowest counterparty risk, highest personal responsibility for records and estate access. Disposals are self-reported.
- **DIY multisig (one holder):** Strong security, but if one person holds all keys the **estate/continuity risk is concentrated**.
- **Collaborative custody:** Spreads key control and can ease continuity, at the cost of a service relationship.
- **IRA/retirement:** Bitcoin can be held in certain retirement structures; rules are specific and custodian-dependent. `Open question for the IRA case`.
- **Inheritance:** Legal authority (executor/trustee) does not equal key access; this is the dominant planning gap.
- **Moving residence:** Citizenship-based taxation and the exit tax mean leaving the US is a tax event to plan, not a clean exit.
- **Borrowing / payments / gifting:** Each can be a taxable disposition or implicate gift rules; records matter.

`Section confidence: Medium.`

## 10. Direction of travel

- **reporting-heavy** (for on-exchange activity). Evidence: 1099-DA phase-in. Counterevidence: self-custody activity remains comparatively unreported; the 2020 unhosted-wallet proposal was withdrawn. Confidence: Medium. [src-irs-da-final]
- **institution-friendly** (for ETFs, banks, custodians). Evidence: spot ETFs; 2025 banking clarifications. Confidence: Medium.
- **self-custody-friendly** (for self-custody users, in the narrow sense that self-custody is legal and the unhosted-wallet proposal was withdrawn). Counterevidence: travel-rule and reporting pressure on the on-ramp/off-ramp. Confidence: Medium. *Friendly for whom: self-custody users and institutions, on different dimensions.*

`Section confidence: Medium.` No "best jurisdiction" or ranking claim is made.

## 11. Open questions

- Stablecoin framework scope and effective dates — **tax counsel / corporate counsel**.
- CARF commitment status and any US adoption timeline — **tax counsel**.
- Corporate Transparency Act beneficial-ownership applicability after 2024–2025 changes — **corporate counsel**.
- Lightning and BTC-backed-loan tax treatment — **tax counsel / accountant**.
- Privacy-tool compliance risk — **counsel**.
- State estate/inheritance tax and forced-heirship specifics (esp. Louisiana, community-property states) — **estate attorney**.
- IRA/retirement Bitcoin specifics — **accountant / custody specialist**.
- Asset-protection/seizure section needs dedicated Tier-1 sourcing before publication — **counsel**.
- Advisor recommendation permissions by registration type — **corporate counsel / compliance**.

## Sources

See `../jurisdiction-source-ledger.json` for full records. Key IDs used here: `src-irs-vc-faq`, `src-irs-8949`, `src-irs-1040-2025`, `src-irs-da-final`, `src-irs-broker-relief`, `src-rsm-2025-33`, `src-fincen-fbar-vc`, `src-pkfod-fbar-fatca`, `src-fincen-2019-guidance`, `src-btcpolicy-selfcustody`, `src-notabene-us-travelrule`, `src-irs-8854`, `src-irs-expatriation`, `src-natlawreview-estate-2026`, `src-morganlewis-estate-2026`.

## Change log

| Date | Change | Reviewer |
|---|---|---|
| 2026-06-16 | Initial exemplar profile created from Tier-1 IRS/FinCEN sources plus Tier-2 firm explainers for 2026 figures. Several sections flagged Low/Unknown with open research tasks. Status set to human-review-pending. | (pending) |
| 2026-06-16 | Sourcing upgrade. Added Tier-1 primaries: IRS Rev. Proc. 2025-32 (estate/gift figures), FinCEN FIN-2019-G001 (self-custody), SEC spot-ETP approval, OECD CRS portal (US non-participation). Promoted us-est-002/003, us-btc-002/003, us-rep-002 to verified/High. Status set to published; residual unknowns (Lightning, BTC-loans, CARF, stablecoin, CTA, asset-protection) remain open questions. Final human review still recommended. | (pending) |
