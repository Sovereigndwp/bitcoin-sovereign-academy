# Colombia — Jurisdiction Profile

> Companion to `colombia.json`. Researched 2026-06-16. Not legal or tax advice. Every non-obvious claim carries a confidence level and a source; unconfirmed items are open questions, not facts. LATAM-fluent priority profile.

- **country_id:** co
- **region:** South America
- **status:** published (renderable claims sourced; unresolved items are open questions, hidden from public rendering; final human review recommended)
- **last_reviewed:** 2026-06-16 · **next_review:** 2026-09-16 · **review_cadence:** quarterly

## Confidence summary (per section)

| Section | Confidence |
|---|---|
| Basic profile | High |
| Tax overview | Medium |
| Bitcoin regulation | High |
| Reporting | Medium |
| Estate & succession | Medium |
| Banking reality | Medium |
| Asset protection | Low |
| Mobility & residency | Medium |
| Bitcoin holder implications | Medium |
| Direction of travel | Medium |

## 1. Basic jurisdiction profile

Civil-law jurisdiction (Código Civil; tax law in the Estatuto Tributario). Currency: Colombian peso (COP). Colombia runs an **exchange-control regime** (régimen cambiario): crypto is not foreign currency and **cannot be channeled through the FX market**, so crypto-funded inflows are not registrable, which is a real friction point. Political risk: moderate. Banking reliability: adequate. Bitcoin is legal to own and trade, is not legal tender, and a comprehensive digital-assets law remains stalled in Congress. `Basic: High` [src-co-banrep-fx, src-co-sfc-crypto]

## 2. Tax overview

- **Residence:** resident if present **>183 days within any rolling 365-day window**; residents taxed on worldwide income and assets. `Medium` [src-co-pwc-residence]
- **Bitcoin classification:** DIAN treats cryptoassets as **intangible assets** forming part of patrimonio, declared at year-end value. `High` [src-co-dian-30470]
- **Capital gains:** asset held **>2 years → ganancia ocasional at 15%**; held <2 years or habitual trading → ordinary income at marginal rates (up to ~39%). `Medium` [src-co-dian-30470]
- **Wealth tax (impuesto al patrimonio):** permanent tax on liquid net worth **≥ 72,000 UVT** as of 1 Jan, graduated 0.5%–1.5%. A 2026 emergency-decree threshold (~40,000 UVT) was reported but may be under constitutional challenge. `Medium — open question` [src-co-ley2277]
- **Exit tax:** no deemed-disposal exit tax confirmed this pass. `Unknown — open question`

## 3. Bitcoin and crypto regulation

Legal to own/trade (not legal tender, not a regulated financial product). The **SFC does not regulate, supervise, or endorse crypto**; there is **no exchange licensing regime**, and supervised banks are not authorized to intermediate crypto. Individual self-custody is not prohibited, but no affirmative primary statement was located (treated as Low, withheld from public rendering pending counsel). `Bitcoin regulation: High` [src-co-sfc-crypto]

## 4. Reporting and surveillance exposure

CRS participant (first exchanges ~2017). Tax residents with foreign assets **> 2,000 UVT** must file the **Declaración de Activos en el Exterior (Form 160)**; foreign-held Bitcoin counts. **DIAN Resolución 000240/2025** requires crypto-asset service providers to report user/transaction data from TY2026 (CARF-aligned). `Reporting: Medium` [src-co-dian-form160, src-co-kpmg-carf]

## 5. Estate and succession

Forced heirship applies. **Since Ley 1934 of 2018** the estate splits in two: the **legítima rigurosa (half)** is reserved for forced heirs, and the **other half is freely disposable** (the former cuarta de mejoras and cuarta de libre disposición were merged into one freely-disposable quarter-mass). Older 50/25/25 descriptions are pre-2018. No separate estate tax; inheritances, legacies, and donations taxed as ganancia ocasional at 15% with UVT-based exemptions. Foreign common-law trust recognition for estate planning is not confirmed (Colombia uses the domestic fiducia mercantil). `Estate: Medium (forced-heirship structure: High, verified)` [src-co-ley1934, src-co-cc-asignaciones, src-co-ley2277]

## 6. Banking reality

Significant crypto-banking friction: banks have closed crypto-related accounts, the SFC stance discourages servicing crypto firms, and crypto-funded inflows cannot be channeled through the FX market. Converting crypto to bankable COP/USD and documenting source of funds is the practical chokepoint. `Banking: Medium` [src-co-banrep-fx]

## 7. Asset protection and seizure risk

Not separately sourced this pass. `Low — orientation only; requires local counsel.`

## 8. Residency, citizenship, and mobility

The >183-day rolling-window residence rule creates **accidental-residence risk** for long stays. Investor/residency visa routes exist; thresholds are SMMLV-denominated and change annually (treat secondary figures as approximate pending Cancillería confirmation). `Mobility: Medium` [src-co-pwc-residence]

## 9. Bitcoin holder implications

Long stays can trigger worldwide-income tax residence; crypto-funded inflows face FX-registration friction; document source of funds early. Forced heirship plus situs rules plus unconfirmed trust recognition make cross-border Bitcoin inheritance materially counsel-dependent. `Medium`

## 10. Direction of travel

- **reporting-heavy** (Medium): CARF-aligned crypto reporting from TY2026, CRS, Form 160, beneficial-ownership registry. Counterevidence: enforcement capacity unproven.
- **cross-border-fragile** (Medium, for individuals): forced heirship + situs + unconfirmed trust recognition + FX friction. Counterevidence: a pending digital-assets law could add clarity.

## 11. Open questions

Current-year wealth-tax threshold (72,000 vs reported 40,000 UVT) — tax counsel/accountant. Whether any exit tax applies — tax counsel. Self-custody status and any registration obligation — corporate counsel. Foreign-trust/foundation recognition under forced heirship — estate attorney. Bitcoin's situs for succession and Form 160 — estate attorney/tax counsel.

## Sources
See `../jurisdiction-source-ledger.json`: src-co-dian-30470, src-co-ley2277, src-co-banrep-fx, src-co-sfc-crypto, src-co-dian-form160, src-co-kpmg-carf, src-co-pwc-residence, src-co-notaria-legitima.

## Change log
| Date | Change | Reviewer |
|---|---|---|
| 2026-06-16 | Initial profile from parallel research pass. Tier-1 DIAN/Banco de la República/SFC + Tier-2 PwC/firm explainers; wealth-tax threshold and exit tax flagged as open questions. | (pending) |
