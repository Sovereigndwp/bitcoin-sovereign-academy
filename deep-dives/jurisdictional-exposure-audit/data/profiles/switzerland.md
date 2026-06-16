# Switzerland — Jurisdiction Profile

> Companion to `switzerland.json`. Researched 2026-06-16. Not legal or tax advice. **Federal/cantonal split:** wealth tax and inheritance/gift tax are cantonal — there is no single "Swiss" answer, and every cantonal claim is flagged as varying by canton.

- **country_id:** ch
- **region:** Europe (non-EU)
- **status:** published (strong Tier-1 coverage; cantonal items flagged as varying; final human review recommended)
- **last_reviewed:** 2026-06-16 · **next_review:** 2026-12-16 · **review_cadence:** semiannual (federal) / annual (cantonal structure)

## Confidence summary (per section)

| Section | Confidence |
|---|---|
| Basic profile | High |
| Tax overview | Medium |
| Bitcoin regulation | High |
| Reporting | High |
| Estate & succession | Medium |
| Banking reality | Medium |
| Asset protection | Low |
| Mobility & residency | Medium |
| Bitcoin holder implications | Medium |
| Direction of travel | High |

## 1. Basic jurisdiction profile

Civil-law, federal state of 26 cantons. Income tax has **federal + cantonal + communal** layers; **wealth tax and inheritance/gift tax are cantonal**. Currency: Swiss franc (CHF). No capital controls; stable, AAA-rated, mature private-banking sector. Bitcoin is a taxable asset (not legal tender), folded into existing law via the DLT Act. `Basic: High` [src-ch-estv-crypto]

## 2. Tax overview

- **Residence:** unlimited (worldwide) liability via domicile/centre of life, **≥30 days' presence with gainful activity**, or **≥90 days without**. `High` [src-ch-oecd-residency]
- **Capital gains (key Swiss distinction):** gains on **private movable assets (incl. Bitcoin) are income-tax EXEMPT** at all three levels (DBG art. 16(3)) — the core reason private Swiss crypto sales are effectively 0% income-taxed. `High` [src-ch-estv-crypto]
- **Professional-trader reclassification:** the exemption is **lost** if the taxpayer is deemed a professional/commercial securities trader (FTA Circular 36 safe-harbour criteria); then gains are ordinary income plus social contributions. Exact criteria Tier-2 corroborated, definitionally stable. `Medium` [src-ch-estv-crypto]
- **Wealth tax:** privately held Bitcoin is included in taxable net wealth at the FTA year-end rate; **cantonal/communal** (no federal wealth tax), progressive, generally well under ~1%, varying by canton. `Medium` [src-ch-estv-crypto]

## 3. Bitcoin and crypto regulation

No standalone crypto statute; crypto folded into existing law via the **DLT Act** (in force Aug 2021), creating ledger-based securities and the **FINMA DLT trading-facility license** (first granted March 2025). New FINMA crypto-institution categories are expected from ~2027. Holding your own keys is not a regulated activity; **private self-custody is permitted**; custody for third parties is regulated. `Bitcoin regulation: High` [src-ch-finma-dlt]

## 4. Reporting and surveillance exposure

Switzerland participates in **CRS** (in force 2017; first exchange 2018; 100+ partners). It approved adopting the **OECD CARF**; the crypto information exchange was **postponed to 2027 at the earliest**. A 2026 AML reform introduces a central UBO register; FATF's 5th-round evaluation is scheduled 2026–2027. `Reporting: High` [src-ch-sif-aeoi, src-ch-step-carf]

## 5. Estate and succession

Forced heirship (**Pflichtteil / réserve**) under the Civil Code. The **2023 reform** (in force 1 Jan 2023) reduced descendants' reserved portion from **3/4 to 1/2** of the intestate share, **abolished parents' compulsory portion**, and left the spouse's 1/2 unchanged — enlarging the freely disposable quota. **No federal inheritance/gift tax**; cantonal: spouses/registered partners exempt in **all** cantons, direct descendants exempt in **most but not all** (e.g. taxed in Appenzell Innerrhoden, Neuchâtel, Vaud per these sources — confirm per canton). Foreign trusts recognized via the **Hague Trust Convention** (in force in CH from 1 July 2007), but recognition can be overridden under art. 15 by mandatory Swiss law, notably forced heirship. `Estate: Medium` [src-ch-baerkarrer-succession, src-ch-chch-inheritance, src-ch-admin-hague-trust]

## 6. Banking reality

Deep private-banking market; crypto-banking exists but is selective (regulated crypto banks hold FINMA licenses; many traditional banks remain cautious). Ledger-based securities carry statutory insolvency segregation. `Banking: Medium` [src-ch-finma-dlt]

## 7. Asset protection and seizure risk

Not separately sourced this pass. `Low — orientation only; requires local counsel.`

## 8. Residency, citizenship, and mobility

**Lump-sum (expenditure-based) taxation** is available to qualifying foreigners without Swiss gainful activity, but it is a **cantonal option abolished in ~5 cantons** (Zurich, Schaffhausen, Appenzell Ausserrhoden, Basel-Landschaft, Basel-Stadt). Tax-residence triggers: domicile, ≥30 days with gainful activity, or ≥90 days without. `Mobility: Medium` [src-ch-efd-lumpsum, src-ch-oecd-residency]

## 9. Bitcoin holder implications

Private long-term holders benefit from the capital-gains exemption on movable assets; high-frequency trading risks professional-trader reclassification and loss of the exemption. The 2023 reform enlarges the freely disposable quota (useful for directing Bitcoin to chosen heirs/structures), but forced heirship still constrains foreign trusts via Hague art. 15. `Medium`

## 10. Direction of travel

- **self-custody-friendly** (High, for self-custody users/individuals/family offices): private-investor capital-gains exemption and asset treatment are long-settled; low cantonal wealth tax. Counterevidence: professional-trader reclassification; CARF + 2026 AML/UBO reform end reporting opacity.
- **institution-friendly** (High, for banks/ETFs/businesses): DLT Act + new FINMA crypto-institution categories formalize custodians/VASPs (activity-based vs EU MiCA).
- **reporting-heavy** (High): CRS since 2017, CARF (~2027), strict travel rule, 2026 AML/UBO register reform.

## 11. Open questions

Exact FTA Circular 36 safe-harbour criteria and professional-trader practice for high-frequency BTC trading (cantonal variation); per-canton inheritance/gift treatment of descendants and per-canton wealth-tax rates; ICTax year-end valuation method; 2026 AML/UBO register scope for self-custodians/trusts; Hague art. 15 forced-heirship override for Swiss-resident settlors holding Bitcoin in foreign trusts; lump-sum minimum thresholds and which cantons retain the regime.

## Sources
See `../jurisdiction-source-ledger.json`: src-ch-estv-crypto, src-ch-oecd-residency, src-ch-chch-inheritance, src-ch-finma-dlt, src-ch-sif-aeoi, src-ch-step-carf, src-ch-baerkarrer-succession, src-ch-admin-hague-trust, src-ch-efd-lumpsum.

## Change log
| Date | Change | Reviewer |
|---|---|---|
| 2026-06-16 | Initial profile from parallel research pass. Strong Tier-1 (FTA/FINMA/SIF/admin.ch/EFD/OECD) coverage; cantonal items flagged as varying by canton; Circular 36 exact criteria flagged for primary confirmation. | (pending) |
