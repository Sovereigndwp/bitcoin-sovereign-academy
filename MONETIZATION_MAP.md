# MONETIZATION_MAP.md

Single source of truth for what is free, what is paid, where each offer should and should not appear, and the current gaps. Built from the repo on 2026-06-13. **Do not invent prices or offers — every price below is quoted from a live product page.**

## Canonical free-vs-paid line (use verbatim where the question arises)

> Most core education on Bitcoin Sovereign Academy is free to read. Some tools, templates, advisor materials, and guided support options may be paid.

Rationale: core lessons, demos, and learning paths are free; the paid layer is **kits, templates, advisor materials, and consults** — not the education itself. Avoid absolute claims ("free forever", "everything is free", "no paywall") because they contradict the paid layer.

## Offers with established prices (verified in repo)

| Offer | Price (source) | Audience | Should appear on | Should NOT appear on | CTA / link status | Disclosure? |
|---|---|---|---|---|---|---|
| Self-Custody Starter Kit | **$49 one-time** (`products/self-custody-starter-kit/index.html:78`, `data-usd="49"`) | Beginner / new holder | Seed-phrase & wallet lessons; emergency-kit; starter funnel | Pure glossary/answers pages (soft footer only) | Card checkout on page; cross-links to Family kit | Carries TBA disclosure ✓ |
| Family Bitcoin Recovery Kit | **$149 one-time** (`products/family-bitcoin-recovery-kit/index.html:82`, `data-usd="149"`); $49 Starter credited toward it | Family / inheritance | Inheritance & recovery lessons; Sovereign Vault demo; emergency-kit | Beginner "what is Bitcoin" pages | Card checkout on page | Carries TBA disclosure ✓ |
| Advisor Bitcoin Client Kit | **$499** (one advisor, unlimited clients) (`products/advisor-bitcoin-client-kit/index.html:80`, `data-usd="499"`) | Financial advisors | Advisor lessons; `institutional/wealth-advisors/` | Consumer/beginner paths | Card checkout; links to white-label tier | On wealth-advisors ✓ |

## Offers WITHOUT an established price (do not invent — confirm before publishing)

| Offer | Status | Where referenced | Gap |
|---|---|---|---|
| BSA for Advisors / "Advisor Bitcoin Readiness Package" (white-label tier) | Price **not stated** in repo | `products/advisor-bitcoin-client-kit/index.html`, `institutional/wealth-advisors/` | Decide and publish a canonical price or "contact for pricing". |
| Custody consult / "Family Custody Review" | Price **not stated**; funnel just wired via the family-custody lead magnets (PR #58) | `interactive-demos/sovereign-vault/*`, `emergency-kit.html` | Define what the consult is, who delivers it, and whether it routes to TBA (disclosure required). |

## Contradictory / stale monetization surfaces — NEEDS A DECISION (not auto-fixed)

| Surface | What it says | Conflict | Recommended decision |
|---|---|---|---|
| `pricing.html` | Sells **learning paths** as tiers: Free $0 / $19 / $39 / $79 / $149 (with sats) | Contradicts `contact.html` ("all learning paths are completely free") and the kits-based spine recommended in `reports/repo-audit-2026-06-08.md` | Decide: are paths free (kits = paid) or are paths paid? If paths are free, retire/repoint `pricing.html`. **Owner decision — do not auto-edit.** |
| `membership.html` | "Apprentice" earn/deposit tier + "Sovereign Lifetime $399"; live Stripe buy links (`:216`, `:267`); "Earn While You Learn" badge | Earn-back was **parked 2026-06-11** (`earn-back-terms.html`); membership "demoted from buyer path" (`index.html:4137`) | Decide membership's fate; strip earn-back framing once decided. **Owner decision.** |
| `transparency.html:191` | "Lightning deposits, Stripe checkout" | Lightning-deposit/earn-back parked | Update payment-method language if Lightning deposits are off. |

## Funnel map (free → paid, no hard sell)

| Page type | Monetization action | Hard sell? |
|---|---|---|
| Seed-phrase / wallet lesson | Link to free red-flag checklist → Self-Custody Starter Kit ($49) | No |
| Inheritance lesson | Link to Family Bitcoin Recovery Kit ($149) | No |
| Advisor lesson | Link to Advisor Client Kit ($499) / BSA for Advisors | No |
| Multisig demo | Disclose options first, then custody decision framework | No |
| Sovereign Vault / emergency-kit | Email capture (shipped) → Family Custody offer | No |
| Glossary / answers | Soft footer CTA only | Never |

## Gaps to close
1. Resolve `pricing.html` vs "paths are free" contradiction (decision).
2. Strip residual earn-back framing from `membership.html` once its fate is decided.
3. Publish or mark "contact for pricing" for the white-label advisor tier and the custody consult.
4. Verify the two live Stripe links in `membership.html` still resolve (the check script flags them; link liveness needs a human/CI HTTP check).

---
*Maintained alongside `DISCLOSURE_POLICY.md` and enforced by `scripts/check-operating-risk.js`. Update when an offer or price changes.*
