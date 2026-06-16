# The Jurisdictional Exposure Audit

> Where your money, rights, records, Bitcoin, family, and obligations actually sit.

A living, interactive research product for Bitcoin Sovereign Academy / The Sovereign Academy. It helps individuals, families, advisors, business owners, and internationally mobile people see where their life is legally, financially, operationally, and jurisdictionally exposed, and then routes them toward the correct research, the right professional questions, and the BSA/TSA resource or service that fits.

**This is not legal, tax, investment, or financial advice.** It educates, identifies exposure areas, organizes questions, and points toward professional review.

Status: **Foundation pack** (architecture + framework + USA exemplar profile). Built 2026-06-16. Country profiles beyond the USA exemplar are scaffolded as structured research tasks, not yet researched.

---

## What is here

### Product content (this folder)
- [`deep-dive.md`](deep-dive.md) — the public long-form deep dive (Deliverable 7), 12 modules, brand voice, no advice.
- [`data/profiles/_TEMPLATE.md`](data/profiles/_TEMPLATE.md) — the country profile template (Deliverable 6).
- [`data/profiles/united-states.md`](data/profiles/united-states.md) — fully researched USA exemplar profile with Tier-1 sources and per-section confidence.
- [`data/profiles/*.research-task.md`](data/profiles/) — research-task stubs for Colombia, Panama, El Salvador, Australia, Switzerland.
- [`data/questionnaire.json`](data/questionnaire.json) — the audit questionnaire (Deliverable 4), grouped, non-sensitive.
- [`data/schema/`](data/schema/) — JSON Schemas for profiles, questions, responses, risk outputs, routing, and the two integrity ledgers (Deliverables 3 + 8).
- [`data/jurisdiction-claim-ledger.json`](data/jurisdiction-claim-ledger.json) — seeded with USA claims (Deliverable 11).
- [`data/jurisdiction-source-ledger.json`](data/jurisdiction-source-ledger.json) — seeded with USA sources (Deliverable 11).

### Design + spec docs (`docs/superpowers/specs/`)
- `2026-06-16-jea-product-brief-and-ia.md` — Product brief + Information architecture (Deliverables 1 + 2).
- `2026-06-16-jea-classification-routing.md` — Classification + product routing model (Deliverable 5).
- `2026-06-16-jea-research-integrity-system.md` — Research Integrity & Hallucination Audit System (Deliverable 11).
- `2026-06-16-jea-implementation-plan.md` — Implementation plan, subagent task list, MVP checklist, risks (Deliverables 9, 10, 12).

---

## Deliverable map

| # | Deliverable | File |
|---|---|---|
| 1 | Product brief | `specs/…-product-brief-and-ia.md` |
| 2 | Information architecture | `specs/…-product-brief-and-ia.md` |
| 3 | Research database schema | `data/schema/jurisdiction-profile.schema.json` + siblings |
| 4 | Audit questionnaire | `data/questionnaire.json` |
| 5 | Classification + routing model | `specs/…-classification-routing.md` |
| 6 | Country profile template + USA exemplar | `data/profiles/_TEMPLATE.md`, `united-states.md` |
| 7 | Public deep dive draft | `deep-dive.md` |
| 8 | Prototype data model | `data/schema/` (all schemas) |
| 9 | Implementation plan | `specs/…-implementation-plan.md` |
| 10 | Subagent task list + workflow | `specs/…-implementation-plan.md` |
| 11 | Research Integrity & Hallucination Audit System | `specs/…-research-integrity-system.md` + ledgers |
| 12 | MVP checklist, risks, gaps, open questions | `specs/…-implementation-plan.md` |

## First-cohort jurisdictions
United States (researched exemplar), Colombia, Panama, El Salvador, Australia, Switzerland.

## Conventions inherited
Voice: `docs/marketing/voice-spec.md` (canonical). Monetization: `MONETIZATION_MAP.md` (never invent prices). Footer: `Created by Dalia · bitcoinsovereign.academy`. Tokens: `css/brand.css`. No third-party trackers. WCAG 2.1 AA.
