# DISCLOSURE_POLICY.md

How Bitcoin Sovereign Academy separates independent education from paid/affiliated pathways — specifically The Bitcoin Adviser (TBA), where the founder has an advisory relationship. Built from the repo on 2026-06-13.

## Why this exists

Dalia advises at The Bitcoin Adviser (`CLAUDE.md`). BSA education routes some readers toward collaborative-custody / consult pathways that can involve TBA. Without a clear, consistent disclosure, an "inform-don't-convince" education brand can read as an undisclosed lead-gen funnel — a trust and (potentially) regulatory risk. The fix is a short, non-defensive disclosure applied **consistently** wherever TBA is named or a paid advisory pathway is offered.

## Canonical disclosure line (use verbatim)

Consumer/education pages:

> **Disclosure:** I advise at The Bitcoin Adviser. I mention TBA here because it is one example of a collaborative security model, but it is not the only qualified option.

Advisor/professional pages (already used on `institutional/wealth-advisors/index.html:1091`):

> **Disclosure:** I advise at The Bitcoin Adviser. When BSA refers to TBA, it is referring to a firm where I have an advisory relationship. Advisors should still evaluate TBA against other qualified Bitcoin custody and collaborative security providers before making a client recommendation.

Keep it plain. Do not make it sound defensive or salesy. Place it near the first TBA mention or in the page's footer/aside.

## When disclosure IS required
- The page **names** "The Bitcoin Adviser" or "TBA".
- The page routes the reader to a **custody consult, advisor referral, or paid advisory** pathway.
- The page recommends a specific collaborative-custody provider the founder is affiliated with.

## When disclosure is NOT required
- Pure education that explains multisig / collaborative custody / "2-of-3" **as concepts**, without naming TBA or routing to a referral. (Most of the 71 pages that mention "2-of-3" or "collaborative security" are in this category — do not over-disclose; it dilutes the signal.)

## Current state (audited 2026-06-13)

**Has the disclosure already (✓):** `products/self-custody-starter-kit`, `products/family-bitcoin-recovery-kit`, `interactive-demos/security-dojo-enhanced`, `institutional/wealth-advisors/index.html`, `institutional/wealth-advisors/bitcoin-advisor-certification/advisor-toolkit.html`, `…/modules/module-13-working-with-bitcoin-specialists.html`, `multisig-security-demo.html`, `guides/advisor-pre-discovery/index.html`, `emergency-kit.html`.

**GAP — names TBA, no disclosure (Phase-1 targets):**
1. `interactive-demos/sovereign-vault/index.html` — **high**: just wired to the family-custody consult funnel (PR #58).
2. `paths/sovereign/index.html` — high: path landing.
3. `paths/sovereign/stage-3/collaborative-security.html` — high: the core education→TBA bridge.
4. `dalia/index.html` — high: founder identity page.
5. `tools/index.html`
6. `deep-dives/bitcoin-capital/bitcoin-backed-loans.html`
7. `deep-dives/bitcoin-capital/index.html`
8. `institutional/real-estate-developers/index.html` and `…/calculator/index.html`

(Internal dashboards under `reports/` also match but are not user-facing — out of scope.)

## Enforcement
`scripts/check-operating-risk.js` raises a **HARD** failure for any user-facing page that names TBA without the disclosure line, and a **SOFT** warning for pages that route to a consult/referral without one. Run before every deploy.

---
*Maintained alongside `MONETIZATION_MAP.md`. Update the gap list as pages are fixed; the script is the ongoing guard.*
