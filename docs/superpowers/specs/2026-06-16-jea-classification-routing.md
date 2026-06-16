# JEA — Classification + Product Routing Model

> The Jurisdictional Exposure Audit. Deliverable 5.
> Created 2026-06-16. Owner: Dalia. Status: foundation pack.
> Pricing authority: `MONETIZATION_MAP.md` (never invent a price).

This is a deterministic, rules-based classifier. It is **not a score**. It reads the flags set by the questionnaire (see `data/questionnaire.json`, where each option carries `flags`) and produces one primary exposure type, optional secondary types, per-category state labels, professional questions, free resources, and at most one paid pathway.

The model never says "you are high risk." It uses the plain labels: Stable, Fragile, Concentrated, Unclear, Needs review, Missing, Documented, Overexposed, Mismatch.

---

## 1. Flag vocabulary

Flags are namespaced by category. The questionnaire emits these:

- **custody.**`single_point`, `counterparty`, `fragile_recovery`, `unclear`
- **estate.**`no_plan`, `document_gap`, `access_gap`, `authority_access_mismatch`, `single_person`, `unclear`
- **tax.**`multi_jurisdiction`, `records_thin`, `records_missing`, `taxable_events`, `gifts`, `loans`, `donations`, `payments`, `heavy_regime`, `unclear`
- **banking.**`single_point`, `fragile`, `unclear`
- **device.**`single_point`, `weak_protection`, `unclear`
- **doc.**`partial`, `missing`, `unclear`, plus per-item leak/gap flags from the classifier (below)
- **family.**`cross_border`, `awareness_gap`, `scam_risk`
- **advisor.**`partial_coverage`, `gap`
- **business.**`key_person`, `governance_gap`, `structure_complex`, `unclear`
- **mobility.**`unchecked`
- **jurisdiction.**`concentration`, `dispersion` (derived, see §3)

---

## 2. Documentation classifier (the highest-value free interaction)

For each item in `dp.items`, the user's current handling is compared against a recommended handling class. The recommended classes per item:

| Item | Recommended handling | Leak flag if currently… | Gap flag if currently… |
|---|---|---|---|
| Seed phrase | Do not digitize; never share; keep offline | in_password_manager, in_cloud, written_in_one_place, with_a_person | — |
| PIN | Keep separate from device and backup | in_cloud, with_a_person | — |
| Passphrase | Do not digitize; keep separate from seed | in_password_manager, in_cloud, written_in_one_place | only_in_my_head (recovery risk) |
| Device location | Keep private; share role not location | in_cloud | not_handled |
| Metal backup location | Keep private; tell at most a trusted helper the existence, not the contents | in_cloud, written_in_one_place | only_in_my_head |
| Wallet type | Document clearly | — | not_handled |
| Exchange names | Document clearly | — | not_handled |
| Custody provider name | Document clearly | — | not_handled |
| Xpub | Keep separate; do not publish (privacy) | in_cloud | — |
| Multisig quorum | Document partially; discuss with custody specialist | — | not_handled |
| Co-signer names | Document partially; keep contact path, not keys | — | not_handled |
| Emergency contact | Document clearly | — | not_handled |
| Tax records | Document clearly; discuss with tax advisor | — | not_handled, only_in_my_head |
| Purchase history | Document clearly | — | not_handled |
| Beneficiary instructions | Discuss with attorney; keep separate from secrets | written_in_one_place (with secrets) | not_handled |
| Will or trust reference | Discuss with attorney | — | not_handled |
| Recovery sequence | Document the sequence, never the secrets, in one safe place | written_in_one_place (with secrets) | only_in_my_head, not_handled |
| Trusted helper role | Document the role; brief the person | — | not_handled |
| Advisor contact | Document clearly | — | not_handled |

A **documentation leak** is recorded when secrets-class items (seed, passphrase, PIN, recovery sequence, beneficiary instructions stored with secrets) are concentrated in one digital or physical place, or stored in cloud / password manager. A **documentation gap** is recorded when map-class items (wallet type, exchange names, recovery sequence, instructions) are `not_handled` or `only_in_my_head`.

This single screen alone usually produces either `documentation_leak` or a documentation gap that feeds `estate_mismatch`.

---

## 3. Derived flags

- `jurisdiction.concentration`: all roles in `jm.roles` resolve to a single country **and** amount_band is meaningful_savings or higher → also the basis for the "peaceful assumption" output if combined with any `single_point`.
- `jurisdiction.dispersion`: roles spread across 3+ countries → raises likelihood of `cross_border_family_gap` or `advisor_coordination_gap`.
- A **legal-vs-operational split** is derived when `jurisdiction.dispersion` is true **and** any of `custody.single_point`, `device.single_point`, `banking.single_point` is set. This is the signature of output type 1 ("legally diversified but operationally concentrated").

---

## 4. Primary exposure classification

The classifier evaluates rules top to bottom and assigns the **first** matching primary type. Remaining matched types become secondary. If too many sections were skipped (more than one core section empty), primary becomes `unknown_missing_information` and the result confidence is `partial` or `insufficient_information`.

Order and trigger conditions:

1. **`documentation_leak`** — any documentation leak recorded in §2. Rationale: a leak is the most acute and the most fixable; surface it first.
2. **`custody_concentration`** — `custody.single_point` AND (`cm.if_unavailable` = no_one_could OR `estate.access_gap`).
3. **`estate_mismatch`** — `estate.authority_access_mismatch` OR `estate.no_plan` OR (`estate.document_gap` AND heirs present) OR `estate.single_person`.
4. **`cross_border_family_gap`** — `family.cross_border` AND (`estate.document_gap` OR `family.awareness_gap` OR `estate.access_gap`).
5. **`banking_fragility`** — `banking.fragile` OR (`banking.single_point` AND `ss.bank_freeze` = serious).
6. **`jurisdictional_concentration`** — `jurisdiction.concentration` AND amount_band ≥ meaningful_savings AND no other higher rule matched.
7. **`advisor_coordination_gap`** — `advisor.gap` OR (`advisor.partial_coverage` AND `jurisdiction.dispersion`).
8. **`business_governance_gap`** — any `business.*` flag.
9. **`tax_visibility_issue`** — `tax.records_missing` OR (`tax.taxable_events` AND `tax.records_thin`) OR (`tax.heavy_regime` AND `tax.multi_jurisdiction`).
10. **`unknown_missing_information`** — fallback.

The order encodes a judgment: fix leaks first, then single points of failure that lose money, then the people-and-paper problems, then the slower tax and coordination problems. Reviewers may reorder, but the order must be explicit and documented, never implicit.

Because most real users match several rules, the **secondary types matter as much as the primary**. The result page leads with the primary, then lists secondaries as "also worth reviewing."

---

## 5. The ten output narratives

Each primary/secondary type maps to one of the ten canonical output narratives. Each narrative renders five fields: what this means, why it matters, what not to do, what to document next, what professional to ask. Stored as content, not code.

| Output narrative | Triggered primarily by |
|---|---|
| Legally diversified but operationally concentrated | legal-vs-operational split (§3) |
| Tax exposed in more places than you think | tax_visibility_issue + tax.multi_jurisdiction |
| Technically secure but legally undefined | estate_mismatch with strong custody |
| Family plan breaks at the border | cross_border_family_gap |
| Privacy weaker than custody | documentation_leak + exchange/bank record exposure |
| Jurisdiction becoming more legible | direction-of-travel reporting flags on involved countries |
| Setup depends on a peaceful assumption | any single_point + concentration |
| Documents create a security leak | documentation_leak |
| Advisors not coordinated | advisor_coordination_gap |
| Biggest risk is the mismatch, not one country | jurisdiction.dispersion + any mismatch flag |

---

## 6. Product routing rules

Routing is a separate pass that runs after classification. It is governed by `data/schema/product-routing.schema.json`. Two hard rules:

1. **Guarded routing.** A pathway only fires if its guard condition holds. The family kit requires `family.*` or `estate.*` evidence. The business review requires `business.*` evidence. This directly prevents the contradiction "routes to family recovery kit but family complexity was not indicated."
2. **Priced vs non-priced CTAs.** A `priced` CTA is shown only when `MONETIZATION_MAP.md` records an established price with a repo source. Established prices: Self-Custody Starter Kit $49, Family Bitcoin Recovery Kit $149, Advisor Bitcoin Client Kit $499. Everything else (Bitcoin Continuity Operational Package, Business/Treasury Review, Advisor Readiness Training, TSA Sovereignty Planning) uses `learn_more` or `contact`, never an invented number.

Routing table:

| Primary exposure | User-type guard | Free resources | Paid pathway | CTA |
|---|---|---|---|---|
| custody_concentration | individual_holder, amount ≤ meaningful | Self-custody module, seed-backup lesson | Self-Custody Starter Kit | priced $49 |
| documentation_leak | any | Documentation classifier result, self-custody module | Self-Custody Starter Kit (if individual) or Family Recovery Kit (if family evidence) | priced |
| estate_mismatch | individual/family | Estate module, inheritance lesson | Family Bitcoin Recovery Kit | priced $149 |
| cross_border_family_gap | cross_border_family | Cross-border families module, library pages | Family Bitcoin Recovery Kit; escalate to Continuity Package if amount ≥ life_changing | priced / learn_more |
| banking_fragility | any | Banking module, library banking sections | TSA Sovereignty Planning | learn_more |
| jurisdictional_concentration | considering_relocation/individual | What-jurisdiction module, library | TSA Sovereignty Planning | learn_more |
| advisor_coordination_gap | individual/family | Next-steps module | Bitcoin Continuity Operational Package | contact |
| business_governance_gap | business_family_office | Business module | Business / Treasury Jurisdiction Review | contact |
| tax_visibility_issue | any | Tax module, professional-question list | (no product; route to professional + records discipline) | none |
| advisor (user is the advisor) | advisor | Advisor module | Advisor Bitcoin Client Kit; Advisor Readiness Training | priced $499 / learn_more |
| unknown_missing_information | any | Invite to complete skipped sections | none | none |

The result page shows **one** pathway. If two are plausible, the higher-evidence one wins; the other is mentioned only as "you may also want to look at…".

---

## 7. Non-salesy framing rules

- Lead with the map, not the product. The pathway appears after the flags and the professional questions.
- Pathway copy uses "this may help if…" not "you need…".
- If primary is `tax_visibility_issue` or `unknown_missing_information`, show no paid pathway at all. Records discipline and professional review are the honest answer.
- Never imply that buying a kit resolves a legal or tax exposure. Kits help organize and document; professionals resolve.

---

## 8. Result confidence

- `clear`: all core sections answered.
- `partial`: one core section skipped; result page says which and what it would change.
- `insufficient_information`: two or more core sections skipped; primary forced to `unknown_missing_information`.

A `partial` or `insufficient_information` result must never be paired with confident output language. This mirrors the integrity-system rule that tool output confidence cannot exceed the evidence behind it.
