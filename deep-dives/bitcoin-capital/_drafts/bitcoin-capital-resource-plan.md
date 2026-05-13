# Bitcoin Capital Deep-Dive Resource — Master Plan

*Treating "Bitcoin Capital" as a multi-piece resource, not a single deep dive. Mortgage is shipped; Loans is next. Plan for ongoing build, verification, and maintenance.*

---

## The differentiation strategy

The BTC loan market has plenty of vendor pages, shallow listicles, and SEO roundups. None of them are honest, structural, and verifiable at the same time. The opportunity is to build the **canonical reference** that a sophisticated Bitcoiner sends to a friend. Five differentiators, each operationalized:

| Quality | What it means | How we operationalize it |
|---|---|---|
| **Unique** | Not another listicle. A first-principles framework readers can use to evaluate any new product, not just the ones we cover. | Two-axis taxonomy (denominator × custody), structural-not-promotional language, original hedge analysis, options strategy comparison |
| **Objective** | LMC (TBA's product) gets the same scrutiny as competitors. Affiliations disclosed. Trade-offs presented in both directions. | Visible TBA disclosure banner, "wrong fit when..." sections for every product, explicit cost/risk math for LMC's 5% upfront vs. competitor APRs |
| **Impactful** | The reader can make a real decision after reading, not just learn vocabulary. | Comparative calculator with provider ranking; plain-language decision flowchart; one-click handoff to each provider's signup |
| **Usable** | A reader landing on the page in five minutes leaves with a recommendation. A reader spending 30 minutes leaves with a verified decision. | Layered structure: TL;DR + decision tool at top, deep mechanics below; bookmark-friendly section anchors |
| **Verifiable** | Every claim sourced, every number dated, every link checked. | "Last verified: [date]" tag on every provider card; source URL for every numeric claim; published verification log |
| **Applicable** | Bridges from theory to "here's what to do today." | Worked examples per scenario; decision flowchart; direct links to provider calculators with the user's inputs pre-loaded where feasible |

---

## Resource architecture — multiple pieces, shared infrastructure

The Bitcoin Capital section is a series, not a one-off. Architecting for that now saves rework later.

```
/deep-dives/bitcoin-capital/
├── index.html                                    [shipped, evolves]
├── bitcoin-backed-mortgages.html                 [shipped]
├── bitcoin-backed-mortgages-deep-dive.md         [shipped]
├── bitcoin-backed-loans.html                     [next — this plan]
├── bitcoin-backed-loans-deep-dive.md             [next]
├── self-custody-multisig-mortgages.html          [future]
├── btc-treasury-structure.html                   [future]
├── btc-inheritance-planning.html                 [future]
├── chart.umd.js                                  [shared, in place]
├── data/
│   ├── providers.json                            [NEW — shared provider data]
│   └── verification-log.json                     [NEW — dated source tracking]
├── _components/
│   ├── provider-card.html                        [NEW — reusable]
│   ├── decision-flowchart.html                   [NEW — reusable]
│   └── disclosure-banner.html                    [NEW — reusable]
└── _drafts/
    ├── btc-for-btc-loans-spec.md                 [v2 — supersedes by this plan]
    └── bitcoin-capital-resource-plan.md          [this file]
```

**`/data/providers.json`** — single source of truth for provider terms. Every deep dive references it. Update one place, all pages reflect new data. Includes `lastVerified` timestamp per provider.

**`/data/verification-log.json`** — append-only log of when each claim was verified and against what source URL. This is what makes "verifiable" real, not aspirational.

**Reusable components** — provider cards, decision flowcharts, and the disclosure banner are templated once and reused across pieces. Keeps the resource visually consistent without copy-paste drift.

---

## Provider tiering for the Loans deep dive

The expanded landscape (9 BTC-backed lenders + DeFi alternatives) needs structure. Three tiers based on archetype distinctiveness, not promotional preference:

### Tier 1 — Deep coverage (own sub-section, ~500 words each)

These four cover the four distinct structural archetypes. Every other provider in the market is a variant of one of these.

| Provider | Archetype represented |
|---|---|
| **Loan My Coins (LMC)** | BTC-for-BTC, collaborative multisig, fixed upfront fee |
| **Ledn** | BTC-for-fiat, qualified custodian, regulated mainstream |
| **Unchained Capital** | BTC-for-fiat, collaborative multisig, sovereignty-leaning centralized |
| **Lava** | BTC-for-fiat, self-custody multisig (DLC-based), newest model |

### Tier 2 — Comparison matrix coverage (one row each)

Covered in the master comparison table but not in their own sub-section. Reader can see them, click out for details.

| Provider | Why matrix-only |
|---|---|
| **Coinbase / Morpho** | Re-entrant, structurally similar to Ledn but with $100K USDC cap; institutional pivot |
| **SALT Lending** | Multi-asset historically; BTC included but not BTC-only; 70% LTV is competitive |
| **Arch Lending** | 60% LTV at 7.25% — competitive rate; newer player, less track record |
| **Bitfinex Borrow** | Exchange-based, highest LTV (80%), but exchange-counterparty risk |
| **Debifi** | Non-custodial P2P, still in rollout — preview-only, monitor for v2 |

### Tier 3 — Mentioned and excluded with reason

| Excluded | Why |
|---|---|
| **Nexo, Binance Loans** | Multi-asset crypto — dilutes Bitcoin focus, scope creep |
| **Sovryn Zero** | DeFi / on-chain — separate deep dive eventually |
| **Strike** | Primarily payments; credit products experimental |
| **TrueFi, Maple, Clearpool, Goldfinch** | Institutional undercollateralized credit — not retail-relevant |
| **Flash loans** | DeFi same-transaction; not consumer borrowing |

### Non-collateralized — brief reference section

Brief explainer (~200 words) covering flash loans and undercollateralized institutional credit, with a clear "not for individual hodlers" framing. Closes the loop for readers who Google "crypto loans without collateral" and need to understand why it's not what they're looking for.

---

## The phased build plan

Six phases. Each ends with a verifiable deliverable. Not all need to ship sequentially — some are parallelizable.

### Phase 0 — Provider verification (1–2 days of focused work)

Goal: every Tier-1 and Tier-2 provider's 2026 terms verified, dated, and sourced.

For each provider:
1. Visit official site, capture: LTV, APR/fee, term, minimum, custody arrangement, jurisdictions, current product mix
2. Cross-reference with their most recent blog post or news coverage to confirm "currently operational"
3. Log in `verification-log.json` with date + source URL
4. Note any "verified-rate caveat" — these change quarterly

**Deliverable:** `providers.json` populated for 9 providers with full terms and `lastVerified` timestamps.

### Phase 1 — Outline + math lock (0.5 days)

Goal: lock the analytical content before any prose is written.

1. Decide calculator math: comparative cost across providers for a given input
2. Lock the options-strategy comparison math (put cost, put spread, collar)
3. Lock the hedge-misconception scenario numbers (the drop/flat/moon analysis)
4. Lock the decision-flowchart logic

**Deliverable:** A math worksheet (Python) with all the numbers that will appear in the deep dive, verified.

### Phase 2 — Markdown prose (2–3 days)

Goal: complete written content, ready for HTML implementation.

Write in sections from the v2 spec, refined by this plan:
1. Ontology (Part I)
2. Two-axis taxonomy (Part II)
3. Provider landscape intro (Part III)
4. Four Tier-1 provider sub-sections (Part IV) — heaviest part
5. Why-denominator-matters first principles (Part V)
6. Custody architectures (Part VI)
7. Calculator placeholder (Part VII — populated in Phase 3)
8. Hedge misconception full treatment (Part VIII)
9. Options strategy comparison (Part IX)
10. Tax considerations (Part X)
11. Risk decomposition (Part XI)
12. Decision framework (Part XII)
13. Non-collateralized brief (Part XIII — new from this plan)
14. Open questions (Part XIV)

**Deliverable:** `bitcoin-backed-loans-deep-dive.md` complete.

### Phase 3 — HTML + comparative calculator (2 days)

Goal: shippable page.

1. HTML scaffolding matching mortgage deep-dive conventions
2. Embed prose, generate provider cards from `providers.json`
3. Build comparative calculator with 4-provider ranking + options overlay
4. Build decision flowchart (interactive or static SVG)
5. TBA disclosure banner sticky at top

**Deliverable:** `bitcoin-backed-loans.html` rendered, calculator math verified.

### Phase 4 — Verification & QA (0.5 days)

Goal: no claim ships unverified.

1. Re-run provider data verification (anything changed since Phase 0?)
2. Math validation via Python script
3. Link check (every external URL)
4. Brand alignment (matches mortgage deep-dive conventions)
5. Accessibility audit (skip link, contrast, keyboard nav)
6. Render test in headless browser (charts, calculator, mobile)

**Deliverable:** QA log committed showing all checks passed.

### Phase 5 — Cross-linking & launch (0.5 days)

Goal: integrated into the resource.

1. Add cross-links from mortgage deep dive (taxonomy + Open Questions)
2. Update category index — promote loans deep dive alongside mortgages
3. Update BSA navigation if applicable
4. Update memory: `memory/context/bitcoin-adviser.md` to note LMC has its own home
5. Update glossary with any new vocabulary

**Deliverable:** Cross-linking verified, both deep dives stand alone but feed each other.

### Phase 6 — Maintenance protocol (ongoing)

Goal: the resource stays accurate.

1. **Quarterly provider verification** — re-check all rates/terms, update `providers.json`, increment `lastVerified`
2. **Event-triggered updates** — provider failure, major regulatory change, new entrant
3. **Annual structural refresh** — full content review against the latest market state
4. **Verification log review** — flag any source URL that's gone stale

**Deliverable:** Scheduled cadence in BSA's `TASKS.md` recurring section.

---

## Quality gates (no skip-through)

Before any phase advances:

- **Phase 0 → 1:** Every provider has a verified source URL and `lastVerified` timestamp. No exceptions.
- **Phase 2 → 3:** Prose has no unsourced numeric claims. Every "12%" or "60% LTV" links to a source.
- **Phase 3 → 4:** Calculator math reconciles with the Phase-1 worksheet. Off by more than 1%? Stop.
- **Phase 4 → 5:** Zero broken links. Zero unverified claims. Zero accessibility regressions vs. the mortgage page.
- **Phase 5 → live:** Mortgage deep dive still works (cross-links don't break it).

---

## Estimated total scope

- **6–8 days of focused work** to ship Phase 0–5
- **~1 hour per quarter** ongoing for Phase 6
- **One refresh of the master plan** every 12 months as the resource grows

---

## What's distinctive about this resource vs. existing coverage

A sober scan of existing 2026 BTC-loan content:

| Source | What they offer | What we offer differently |
|---|---|---|
| Ledn blog roundup | Vendor-affiliated, lists 8 platforms with rates | First-principles taxonomy + custody-axis analysis + options comparison |
| Bitcoin Magazine guides | SEO-optimized, broad coverage, surface-level | Structural depth: why denominator drives margin call dynamics |
| crypto.news, Token Tax | Up-to-date listings | Math-verifiable, dated, sourced; calculator instead of static table |
| Vendor sites (LMC, Ledn, etc.) | Marketing | Compare across vendors honestly with disclosure |
| Academic / Bitcoin OG content | Theory-heavy | Theory + practice + decision tool in one |

The unique seat: **a resource that's both rigorous enough for a sophisticated Bitcoiner and practical enough that they can act on it**, with the analytical work (hedge math, options comparison, custody decomposition) that no vendor will publish honestly.

---

## Open decisions to lock before Phase 0

1. **Should Tier 2 providers each get a small card on the page, or are they only in the matrix?** Tradeoff: card = more visual real estate, more thorough; matrix-only = page stays focused.
2. **Calculator complexity ceiling.** A 4-provider comparative calculator with options overlay is ambitious. Do we ship a simpler v1 (cost-comparison only) and iterate, or aim for full v1?
3. **TBA disclosure banner — exact language.** Should I draft a few options for you to pick?
4. **Verification scope on Tier 2 providers.** Equal rigor (full `lastVerified` cycle) or "best-effort with monthly re-check"?
5. **Should the resource have its own simple landing page upgrade?** The current `/deep-dives/bitcoin-capital/index.html` lists pieces. As the resource grows, it could become a structured hub (with a "Start here" flowchart pointing readers to the right piece).

---

## Ready to proceed?

If approved, I'll start Phase 0 immediately: provider verification across all 9 BTC-backed lenders. That generates `providers.json` plus the initial verification log, which becomes the foundation for everything downstream.

Tell me your calls on the 5 open decisions and I'll begin.
