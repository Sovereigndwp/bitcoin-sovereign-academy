# PRICING_MEMBERSHIP_DECISION.md

**Status: DECISION MEMO — no pages edited. Awaiting Dalia's choice of model.**
Built from the repo on 2026-06-13. Do not act on this until a model is approved.

## The conflict (what currently coexists and contradicts)

1. **Free core education** — site copy and the now-canonical line say core lessons, paths, and demos are free to read (`contact.html`, `start-simple.html`, fixed this batch).
2. **Paid learning paths** — `pricing.html` sells paths as tiers: Free $0 / $19 / $39 / $79 / $149 (with sats), e.g. "Curious Path $19", "Builder Path $39", with upgrade-by-difference language. This directly contradicts #1.
3. **Membership** — `membership.html` advertises an "Apprentice" deposit/earn tier + "Sovereign Lifetime $399" with two live Stripe links and an "Earn While You Learn" badge — but `index.html:4137` says membership was "demoted from buyer path."
4. **Parked earn-back / Lightning deposit** — the sats earn-back program was parked 2026-06-11 (`earn-back-terms.html` redirects), yet earn-back framing still lives in `membership.html` and `transparency.html`.
5. **Paid kits + advisor materials** — real, priced, live: Self-Custody Starter $49, Family Bitcoin Recovery $149, Advisor Bitcoin Client Kit $499, plus a white-label advisor tier (price not stated). `reports/repo-audit-2026-06-08.md` recommends making kits + advisor consults the spine and demoting earn-back/membership.

**Net:** three different monetization stories (paid paths, membership tiers, one-time kits) are live at once, plus a parked program still showing. A visitor can be told paths are free on one page and see them priced on another. This is a trust and refund risk and an operational maintenance tax.

## Three models

### Model A — Free core education + paid kits/templates/advisor materials only
- **Stays free:** all learning paths, demos, lessons, answers, glossary.
- **Becomes/stays paid:** the three kits ($49/$149/$499), advisor materials, optional consults.
- **Pages that must change:** retire or repoint `pricing.html` (no per-path pricing); strip earn-back framing and resolve `membership.html` (likely retire or convert to a simple account page); update `transparency.html` payment-method line.
- **Trust risk:** **Lowest.** "Education free, tools/advisor materials paid" is clean and matches the canonical line already shipped.
- **Operational burden:** **Lowest.** One spine (kits + consults). No tier matrix, no earn-back accounting.
- **Monetization upside:** Moderate, but high-intent (buyers of $49–$499 kits are committed). Caps per-learner revenue at kit price.
- **Best for:** a solo operator who needs fewer moving parts.

### Model B — Free samples + paid learning paths
- **Stays free:** intro/sample modules per path, demos as marketing.
- **Becomes paid:** full learning paths (the `pricing.html` tier model becomes the spine).
- **Pages that must change:** rewrite "all paths are free" claims everywhere (reverses this batch's fix); gate path modules behind purchase/entitlement; align `pricing.html` as canonical; reconcile kits as add-ons.
- **Trust risk:** **High.** Contradicts the long-standing free-education brand and the mission language; reversing "free" claims erodes trust and SEO.
- **Operational burden:** **High.** Per-module gating, entitlements, refunds, "which modules are free" upkeep across 110+ path pages.
- **Monetization upside:** Higher per-learner if conversion holds — but conversion is unproven and traffic is ~190 sessions/mo, so gating may suppress the top of funnel.
- **Best for:** a content business with real traffic and a team to maintain gating.

### Model C — Membership with clear paid tiers
- **Stays free:** a free tier (preview modules).
- **Becomes paid:** recurring/lifetime membership tiers (revive `membership.html`: e.g., Free / paid / Sovereign Lifetime $399).
- **Pages that must change:** rebuild `membership.html` cleanly (strip earn-back, set tiers/benefits), wire entitlements, reconcile with kits and `pricing.html`, add a benefits matrix.
- **Trust risk:** **Medium–High.** Memberships imply ongoing value delivery (a solo operator must keep shipping member benefits) and recurring-billing support.
- **Operational burden:** **Highest.** Subscriptions, churn, dunning, member-only content cadence, support.
- **Monetization upside:** Highest ceiling (recurring revenue) — but the heaviest commitment and the worst fit for one person with low traffic.
- **Best for:** later, once traffic and a content cadence justify recurring value.

## Recommendation

**Model A.** It matches the canonical free-vs-paid line already shipped this batch, uses the kits/prices that already exist ($49/$149/$499), aligns with the `repo-audit-2026-06-08` recommendation, and imposes the least operational burden on a solo operator with a demand (not supply) bottleneck. Models B and C only make sense after traffic and conversion are proven.

**If A is approved, the follow-up (separate, reviewed) work would be:**
1. Retire/repoint `pricing.html` (remove per-path pricing).
2. Resolve `membership.html` (retire or convert to a simple account page) and strip earn-back framing.
3. Fix `transparency.html` payment-method line.
4. Publish or mark "contact for pricing" for the white-label advisor tier + consult.

**Do not proceed until Dalia approves a model.** This memo changes no pages.
