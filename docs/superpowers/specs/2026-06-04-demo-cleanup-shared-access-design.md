# Design — Shareable Catalog + Demo Cleanup (Phases 1+2)

- **Date:** 2026-06-04
- **Status:** Approved (design); pending spec review
- **Scope:** Phases 1 + 2 only. Phase 3 (content-accuracy audit) and the Paths/Institutional index redesigns are explicitly deferred.
- **Driver:** Prepare a clean, buyer-shareable version of the platform. The buyer may purchase "all or portions," so the site is framed as a **menu of separately-buyable units** across four catalogs: Demos · Deep Dives · Paths · Institutional.

## Background

The site already has an unlocked clone in two forms: the `test` branch (1-file diff — gate disabled) and `origin/fully-unlocked-version` (40+ file divergence). The divergence in the latter is the source of the "config/UX/UI changed" problem. Decision: **do not maintain a diverged fork.** Instead, bring a `?preview=<key>` unlock onto `main` so one codebase serves both gated (public) and key-unlocked (buyer) visitors, and the shared view inherits all future brand/content updates automatically.

A read-only audit of the 49 interactive demos/tools found: no broken stubs, no orphans; only **2 genuine overlap clusters** plus 1 redundant entry point; **3 fragmented index pages**; and back-to-home links missing on 42 of 46 folder demos.

## Goals

1. One codebase serves gated public + key-unlocked buyer (no fork, no drift).
2. A clean, on-brand **product catalog** for Demos and Deep Dives — smaller neutral cards, no flashy gradients, homepage look.
3. Duplicate demos consolidated by **feature-merge → archive** (improve the keeper, preserve the loser as sellable inventory).
4. Every demo + deep-dive has working, context-aware navigation back to its origin and to home.
5. Every demo verified to load.

## Non-Goals (deferred)

- **Phase 3 — content-accuracy audit** (claims/data/external-link currency). Runs as its own spec/workflow immediately after this ships, because accuracy matters before a buyer evaluates — but it does not block the catalog cleanup.
- **Paths and Institutional index redesigns** — same treatment, later pass.
- Building a literal e-commerce/"buy" mechanism. Sales happen via conversation with the buyer; YAGNI.
- Editing path modules to pass `?from=` (optional polish in Phase 2c; not required).

## The four-catalog menu

Each catalog already has an `index.html`. This pass redesigns two of them; the others are deferred but the framing is shared:

| Catalog | Index | This pass? |
|---|---|---|
| Demos | `interactive-demos/index.html` (+ `demos/`, `tools/` reconciled into it) | ✅ redesign |
| Deep Dives | `deep-dives/index.html` (7 topics) | ✅ redesign |
| Paths | `paths/index.html` (8 paths) | ⏸ deferred |
| Institutional | `institutional/index.html` (6 segments) | ⏸ deferred |

## Phase 1 — Shared access (preview-key on main)

**Active gate finding:** `membership-gate.js` is loaded by **171** HTML files — the universal active gate. `module-gate.js` is loaded by only **1** file (this is where the fork mistakenly added the preview-key, explaining inconsistent unlock). `module-gate-subdomain.js` (65) and `demo-lock-subdomain.js` (35) are subdomain-era leftovers (the `learn.` subdomain was deprecated 2026-04-24); `membership-btcpay.js` (0).

**Design:**
- Port the `?preview=<key>` unlock into **`membership-gate.js`** (the universal gate), at the top of `init()` before any gating logic runs.
- Mechanism (same shape as fork commit `6fcc210a`): read `?preview=<key>` from the URL → if key is valid and not expired, write `bsa_preview_unlock` + `bsa_preview_expires` to localStorage and bypass all gating; on subsequent pages, a stored unexpired key bypasses gating; expired keys are cleared.
- **Key + expiry are set by Dalia** (not the fork's `dalia-beta-2026`). A single buyer key with an explicit expiry date.
- Confirm the `-subdomain` gate scripts are inert post-deprecation; if they still gate, either remove them from the loaded pages or mirror the bypass. **Resolve during implementation** (first task of Phase 1).
- Free-vs-gated definition stays as today (`membership-gate.js` CONFIG); no change to what's public.

**Verification:** With no key → public sees the normal gate. With `?preview=<key>` → buyer unlocks everything for the session/until expiry. Run `npm run test:modules` (gating tests).

## Phase 2a — Catalog redesign (Demos + Deep Dives)

**Consolidation:** Make `interactive-demos/index.html` the single canonical Demos catalog. Reconcile the public-facing parts of `demos/` and `tools/` so there is one menu, not three (redirect or thin pointer — decided during implementation; `tools/` internal ops scripts/dashboards are not part of the public catalog).

**Visual direction (homepage look, de-flashed):**
- Remove the radial orange glow (`body::before`) and the `linear-gradient` fills on cards and buttons.
- Neutral `--color-surface` card backgrounds, 1px `--color-border`; restrained gold (`--color-brand`/accent) reserved only for category tag / primary CTA (honors "color carries meaning").
- Smaller cards, tighter grid. Each card reads as a sellable unit: **title · one-line description · time estimate · category tag.**
- Align type/spacing to homepage `design-tokens.css` + `brand.css`.

**First checkpoint:** Present **A–D card mockups** against real catalog content; Dalia picks before anything goes live (honors the A–D-format convention).

**Deep Dives:** Apply the same card system to `deep-dives/index.html`.

## Phase 2b — Dedup via feature-merge → archive

For each item: compare the pair, **port any valuable feature the loser has that the keeper lacks** (the survivor gets better), then move the loser to `archive/` (in-repo, still sellable). **Dalia approves each winner + ported features before archiving** (checkpoint ②).

| Cluster | Likely keeper (confirm on inspection) | Action |
|---|---|---|
| `fee-master-tool` vs `mempool-visualizer` | mempool-visualizer (broader/visual) | port fee-calc features → keeper; archive loser |
| `security-dojo-enhanced` vs `security-risk-simulator.html` | security-dojo-enhanced (115KB hands-on lab) | port unique scenarios → keeper; archive loser |
| `wallet-workshop/interactive.html` | `wallet-workshop/index.html` | archive redundant entry point |

Keeper choices are provisional; confirmed by direct comparison at implementation time.

## Phase 2c — Context-aware navigation + load sweep

**Shared nav helper** (new small script, e.g. `/js/demo-nav.js`, or fold into existing demo CSS/JS), mounted on every demo + deep-dive page. Two links:
- **"← Back" (contextual):** if `?from=<url>` is present (set by a linking page) use it; else fall back to `document.referrer` when it is an internal `/paths/` or `/deep-dives/` page → returns to that exact page.
- **"Home" (persistent):** always present (absolute `/`), so a casual browser can always reach the homepage/catalog.

Absolute paths only (iframe/embedding safe). Zero edits to path modules required (referrer fallback). Optional later polish: have path→demo links append `?from=`.

**Load sweep:** confirm each of the ~49 demos loads without console errors via the preview server.

## Orchestration

Split by judgment vs. mechanism:

- **High-judgment (me, with checkpoints):** Phase 1 gate wiring; Phase 2a catalog redesign + A–D mockups; Phase 2b feature-merge/archive decisions; the shared nav helper + de-flash CSS rules.
- **Parallel workflow (Phase 2c):** a `pipeline` over the ~49 demos — **audit** (`Explore`: loads? home link? flashy?) → **edit** (`general-purpose`: insert nav-helper mount) → **verify** (`ca-verifier` + preview tools: loads + links work). Fanned out, ~10–14 concurrent, background, reports back.

**Checkpoints (per "checkpoint per phase"):** ① card A–D mockups → ② archive decisions → ③ index goes live → ④ final review.

## Verification

- Preview server (`npm run dev`, :3000) + preview tools: page loads, nav links, gated vs. unlocked flows.
- `npm run test:modules` (gating), `npm run audit:html` (html-validate) as guardrails.
- Buyer flow manually exercised with the real `?preview=<key>` link before handoff.

## Risks

- **Subdomain gate leftovers** may still gate independently of `membership-gate.js`. Mitigation: confirm inert / handle in Phase 1.
- **`demos/`/`tools/` reconciliation** could break inbound links. Mitigation: redirect rather than delete; keep paths stable.
- **Per-demo inline styles** vary; the de-flash is scoped to catalog/index surfaces + a shared nav component, not a per-demo internal restyle (that would be Phase 2 Approach B, out of scope).
- **Archiving** must preserve inventory: move to `archive/`, never delete; keep files runnable.

## Open items (resolve during implementation)

1. Confirm `-subdomain` gate scripts are inert; decide remove vs. mirror-bypass.
2. `demos/` and `tools/` reconciliation method (redirect vs. thin pointer).
3. Final keeper confirmation for each dedup cluster after direct comparison.
4. The buyer preview key string + expiry date (Dalia to provide).
