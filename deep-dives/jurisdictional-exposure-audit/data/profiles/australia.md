# Australia — Jurisdiction Profile

> Companion to `australia.json`. Researched 2026-06-16. Not legal or tax advice. Strong Tier-1 (ATO/AUSTRAC/Parliament/CFR) coverage across most sections.

- **country_id:** au
- **region:** Oceania
- **status:** published (renderable claims sourced to Tier-1 primaries; final human review recommended)
- **last_reviewed:** 2026-06-16 · **next_review:** 2026-09-16 · **review_cadence:** quarterly

## Confidence summary (per section)

| Section | Confidence |
|---|---|
| Basic profile | High |
| Tax overview | High |
| Bitcoin regulation | High |
| Reporting | High |
| Estate & succession | Medium |
| Banking reality | High |
| Asset protection | Low |
| Mobility & residency | High |
| Bitcoin holder implications | High |
| Direction of travel | High |

## 1. Basic jurisdiction profile

Common-law, federal (Commonwealth + states/territories). **Estate/probate is state-based; tax is federal.** Currency: Australian dollar (AUD). No general capital/exchange controls. Bitcoin is legal to own/trade and treated as property; not legal tender; regulators are building a licensing regime. `Basic: High` [src-au-ato-cgt-crypto]

## 2. Tax overview

- **Residence:** four statutory tests (resides, domicile, 183-day, Commonwealth superannuation); guidance TR 2023/1. `High` [src-au-ato-residency]
- **Capital gains:** Bitcoin is a **CGT asset (property)**; disposal (sell, gift, trade, spend) is a CGT event. `High` [src-au-ato-cgt-crypto]
- **CGT discount:** individuals may apply a **50% discount** on gains where the asset is held **≥ 12 months**. `High` [src-au-ato-cgt-crypto]
- **Personal-use-asset exception (narrow):** a capital gain is disregarded only if acquisition cost **≤ AUD 10,000** and the asset is mainly for personal use; investment holdings do not qualify; losses on personal-use assets are always disregarded. `High` [src-au-ato-personaluse]

## 3. Bitcoin and crypto regulation

Digital-currency exchanges must **register with AUSTRAC** (being rebranded VASPs). The **Digital Assets Framework** (Corporations Amendment) became law (Royal Assent April 2026), creating Digital Asset Platform and Tokenised Custody Platform products under the AFSL/ASIC regime; substantive licensing obligations **commence April 2027**. The regime regulates intermediaries holding assets for customers; individual self-custody is not licensed or prohibited and remains lawful. `Bitcoin regulation: High` [src-au-austrac-dce, src-au-aph-dap]

## 4. Reporting and surveillance exposure

CRS participant since 2015; committed to the **OECD CARF** with first crypto data exchange expected ~2028; the FATF **travel rule** for virtual-asset transfers applies from **1 July 2026**. The ATO runs a long-standing **crypto data-matching program** collecting data on hundreds of thousands to over a million accounts per year. A public beneficial-ownership register is in progress. `Reporting: High` [src-au-ato-carf]

## 5. Estate and succession

Testamentary freedom exists but is qualified by **family-provision legislation** in each state/territory (an eligible person may apply to the Supreme Court for provision). **Superannuation does not automatically form part of the estate**: a valid Binding Death Benefit Nomination directs the trustee — paid to a dependant it can bypass the estate; routed to the legal personal representative it enters the estate and can face family-provision claims. State variation exists (e.g. WA). `Estate: Medium` [src-au-ato-smsf]

## 6. Banking reality

Crypto-business **de-banking** is a recognised, documented problem; the Council of Financial Regulators published policy responses (2022); the licensing regime is partly intended to reduce it. `Banking: High` [src-au-cfr-debanking]

## 7. Asset protection and seizure risk

Not separately sourced this pass. `Low — orientation only; requires local counsel.`

## 8. Residency, citizenship, and mobility

The **183-day** and **domicile** tests can create residency by presence or keep an Australian-domiciled person resident while abroad; becoming a resident triggers worldwide CGT on Bitcoin. **Leaving Australia is itself a tax event:** ceasing tax residency triggers **CGT event I1** (s104-160 ITAA 1997) — a deemed disposal of non-taxable-Australian-property assets, including cryptocurrency, at market value, taxed at marginal rates (up to ~47% incl. Medicare levy) with the 50% discount if eligible, unless the holder elects to keep the assets in the Australian CGT net. `Mobility: High` [src-au-ato-residency, src-au-ato-changing-residency]

## 9. Bitcoin holder implications

- **SMSF:** Bitcoin may be held via a Self-Managed Super Fund only if the deed/strategy permit and super rules are met: **sole-purpose test, separation of assets, a wallet in the fund's name, annual independent audit, and no acquisition from a related party** (so in-specie contribution of personal BTC is generally not permitted). `High` [src-au-ato-smsf]
- **Inheritance:** SMSF-held Bitcoin interacts with super death-benefit nominations, not just the will; the nomination structure determines whether it enters the estate and is exposed to family-provision claims. `Medium`

## 10. Direction of travel

- **institution-friendly** (High, for ETFs/businesses/family offices): AFSL-based licensing regime now law (commencing 2027). Counterevidence: obligations don't bite until 2027; small-platform exemptions favor scaled operators.
- **reporting-heavy** (High): ATO data-matching, CRS since 2015, CARF (~2028), travel rule from July 2026, public UBO register in progress.
- **self-custody-friendly** (High, for self-custody users): self-custody remains lawful and unlicensed; SMSF crypto expressly permitted with custody safeguards. Counterevidence: persistent crypto-business debanking; rising individual reporting.

## 11. Open questions

Foreign-will recognition per state (and the UNIDROIT international-wills regime); CGT event I2 on *commencing* residency and the precise I1 election mechanics/timing; family-provision and probate rules per state (only NSW reviewed; WA treats super differently); SMSF Bitcoin in-specie/valuation/custody evidentiary standards.

## Note on confidence vs favorability

The "High" confidence labels on this profile measure how well-sourced it is (strong Tier-1 ATO/AUSTRAC/Parliament guidance), **not** how favorable Australia is for a Bitcoin holder. On the substance, Australia pairs a comparatively high-friction environment — top marginal CGT near 47%, a deemed-disposal departure tax on leaving (CGT event I1), persistent crypto-business de-banking, and a fast-tightening reporting regime — with the fact that self-custody itself remains lawful. Fit depends on the holder's facts; this profile does not rank Australia against any other jurisdiction.

## Sources
See `../jurisdiction-source-ledger.json`: src-au-ato-cgt-crypto, src-au-ato-residency, src-au-ato-personaluse, src-au-ato-smsf, src-au-austrac-dce, src-au-aph-dap, src-au-ato-carf, src-au-cfr-debanking.

## Change log
| Date | Change | Reviewer |
|---|---|---|
| 2026-06-16 | Initial profile from parallel research pass; high Tier-1 (ATO/AUSTRAC/Parliament/CFR) coverage. Estate sections rest partly on Tier-2 summaries of state statutes; exit-tax mechanics flagged Low. | (pending) |
