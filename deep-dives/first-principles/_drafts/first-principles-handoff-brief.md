# First Principles, audit & upgrade handoff brief (2026-06-19)

Area: `deep-dives/first-principles/` · Branch: `audit/first-principles-upgrade`
Outcome: 3 deep dives at `strong_as_is` + a lean hub, all rebuilt onto the canonical
deep-dive system with real, sourced interactives.

## What shipped

| File | After |
|---|---|
| `index.html` | Lean hub: orientation, 3 dive cards, comparison-at-a-glance, scope note; keeps reflect/email/tip/analytics wiring. No longer a duplicate of the flagship journey. |
| `original-question-everything.html` | Flagship rebuilt: ten principles with REAL interactives, a live SHA-256 proof-of-work miner, real WebCrypto P-256 sign/verify, mining-economics + 51%-attack calculators, money-properties matrix, steelman + misconception widgets. De-gamified, full claims audit, metadata strong_as_is. |
| `why-money-fails.html` | Honest deep dive: research question, per-failure tradeoffs, purchasing-power calculator, hyperinflation timeline, comparison matrix, steelman, claim-checker. Bridges to (does not overlap) the Foundational-Layer Thesis. |
| `digital-scarcity.html` | Honest deep dive: issuance/stock-to-flow explorer, S2F scarcity matrix, fixed-cap steelman, claim-checker. The falsified S2F PRICE model is removed; S2F kept only as a scarcity descriptor + divergence evidence. |
| `deep-dives/index.html` | Parent hub card reframed from "Bitcoin's M.V.P." to "First Principles". |

## Visual system (important)
All four pages now use the canonical deep-dive system, matching the bitcoin-capital benchmark:
- Fonts: Source Serif 4 (headings) + Inter (body) + JetBrains Mono (labels), loaded via Google Fonts.
- Tokens: consume `/css/tokens.css` (the consolidated source of truth). No new tokens introduced.
- Interactives: reuse the existing `.ddlab` component library (`/css/deep-dive-lab.css` + `/js/deep-dive-lab.js`), config-driven, with two custom calculator formulas registered per page where needed.
- The live proof-of-work and signature widgets are custom (they need real crypto), styled to match `.ddlab`.
- Brand: orange #FF7A00 + yellow #FFD400 workhorse (current `brand.css`/`tokens.css`); gradient-border buttons per the supplied treatment. 2px corners.
- NOTE: my interim `css/deep-dive-editorial.css` (Playfair/Crimson) was RETIRED. It is untracked and must NOT be committed. The split script does not stage it.
- NOTE: I could not open `~/.claude/.../project_token_consolidation.md` (app-internal path, outside the mounted folder). The system above was reconstructed from `tokens.css` + `deep-dive-lab.css` + the loans benchmark. If that memory has specific mandates, re-check against it.

## Real interactives (not simulations)
- Flagship proof-of-work: real synchronous SHA-256 (FIPS 180-4) grinding nonces until N leading hex zeros. Verified against NIST test vectors: SHA-256("abc") and SHA-256("") both exact.
- Flagship signatures: real WebCrypto ECDSA P-256 generateKey/sign/verify; tampering one character fails verification (Bitcoin uses secp256k1; noted on-page).
- Calculators reconcile with `data/first-principles-math.json` (issuance, S2F, purchasing power) and use the correct 3.125 BTC subsidy. The old flagship demos (rigged hashes, static keys, wrong 3.275 subsidy, stale $43k price) are gone.

## Verification (all passing)
`node _drafts/ddlab-render-test.mjs` (jsdom, real ddlab engine injected, node webcrypto):
- All ddlab widgets mount on every page; custom formulas register and reconcile (pp_real 30.8% at 4%/30y; issuance epoch-4 S2F 120 / 3.125 BTC / 0.83%; miner_econ + attack_cost render).
- SHA-256 NIST vectors exact; live miner finds a qualifying hash; WebCrypto round-trip valid + tamper-fail invalid.
- Zero JS console errors; tag balance clean on all four; no em dashes anywhere.
- Worksheet reproducible: `python3 _drafts/first-principles-worksheet.py` regenerates `data/first-principles-math.json` (terminal supply 20,999,999.9769 BTC).

## Files in this area
- Pages: the 4 HTML above.
- Data: `data/first-principles-math.json` (derived), `data/first-principles-facts.json` (sourced claim ledger).
- Drafts: `first-principles-worksheet.py`, `ddlab-render-test.mjs`, `render-test.mjs` (older), `transform-oqe.py` (historical), `upgrade-plan-v2.md`, decisions + this brief, `split-first-principles.sh`.
- `chart.umd.js` is present but now UNUSED (the ddlab pages have no charts). The split script does not stage it; it can be deleted.

## To ship (you run; I did NOT push)
Review and run `_drafts/split-first-principles.sh`. It clears the stale `.git/index.lock`,
stages only this area (excluding the unused `chart.umd.js`) plus the parent hub, commits, and
pushes `audit/first-principles-upgrade` for a PR. On the Vercel preview, open each page and:
load the proof-of-work miner (watch it grind), run the signature steps, move the calculators,
and confirm a clean console.

## Follow-ups (post-audit, this session)
Four backlog items from the design/standards audits, now built and verified:
1. Shared chrome extracted to `/css/deep-dive-page.css` (consumes tokens.css, no new tokens); all 4 pages now link it and their inline `<style>` chrome is removed. Cascade-ready for other deep-dive areas.
2. a11y: `role="status" aria-live="polite"` on the flagship's PoW + signature result regions, `aria-busy` toggled on the miner while running.
3. New interactives: flagship Principle 1 UTXO mini-ledger (double-spend rejection, real txid via SHA-256); digital-scarcity inline SVG supply curve (no chart library).
4. Inbound bridge edges: "Go deeper" links from 5 path modules (Curious S1M1, S2M1, S2M2; Principled S1M1, S3M1) into the flagship P4/P6 labs and the two dives, closing the content-graph discovery gap.
New/edited files beyond the area: `css/deep-dive-page.css` + the 5 path modules (the split script now stages these). Verified: render test all-pass (incl. UTXO confirm/reject, supply SVG drawn, aria-live present), tag balance clean, no em dashes in new files.

## Wave 3 (done)
Each small dive now has a second interactive:
- why-money-fails: Roman-denarius debasement lab (ddlab calculator, `denarius` formula) stepping
  Augustus -> Aurelian; shows silver content and "coins to match one Augustan denarius" (~48 by Aurelian).
- digital-scarcity: subsidy-to-fee security-budget explorer (ddlab calculator, `security_budget`
  formula); advance epochs + set fee revenue, watch the subsidy collapse and fee-share rise.
Both reconcile with the worksheet/schedule and are covered by `ddlab-render-test.mjs` (all passing).
why-money-fails now has 6 ddlab widgets, digital-scarcity 5.
