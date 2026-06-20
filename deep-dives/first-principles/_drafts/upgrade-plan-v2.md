# First Principles, Significant Upgrade Plan (v2)

**Status:** awaiting sign-off. No code until approved.
**Goal:** take the whole area from "passable deep dives" to genuinely strong, on-brand research
labs across four axes you selected: (1) rebuild flagship interactives, (2) more/better
interactives per dive, (3) deepen content/research, (4) canonical visual system.

Grounded in: `css/brand.css` (locked tokens) + `docs/superpowers/specs/2026-05-03-component-library-plan.md`.

---

## Axis 4, Canonical visual system (do this first; it frames everything)

Today all four pages use the legacy **dark + orange `#FF7A00` gradient** skin. Per the locked
spec, **orange in typography is a regression**, the system is gold `#C8922A` / gold-light
`#E8B84B`, Playfair Display headings, Crimson Pro body, JetBrains Mono labels, 2px corners.
The spec also says learning surfaces (deep dives) **stay dark** but adopt the editorial patterns.

**Plan:**
- Create **`css/deep-dive-editorial.css`**, a small stylesheet that *consumes existing
  `brand.css` tokens only* (no new tokens) and defines the dark-surface editorial treatment:
  `.dd-eyebrow`, `.dd-section-tag` (◆), `.dd-title` (Playfair + gold `em`), body in Crimson Pro,
  mono labels, 2px radii, semantic accent colors (gold for emphasis; red/amber kept only for
  failure/warning, not headings).
- Migrate all 4 pages to link `/css/brand.css` + `/css/deep-dive-editorial.css`, drop the
  inline orange styling, and stop relying on `deep-dive-brand.css`'s orange-gradient heading rule.
- Result: one consistent, on-brand look; reusable for the rest of the deep-dive cascade later.

**Decision needed (D1):** the component spec *defers* learning-surface migration to "a separate
Phase 2 spec." You've asked for it now, I'll pull it forward for this area only. OK? And OK to
add `css/deep-dive-editorial.css` (consumes existing tokens, adds no new ones)?

---

## Axis 1 + 3, Flagship rebuild (`original-question-everything.html`)

This is the bulk of the work. Per-principle audit + rebuild:

| Principle | Today | Rebuild to |
|---|---|---|
| 0 · Money properties | `selectMoney()` star ratings (decorative) | **Scored comparison matrix**, properties × monies, weighted, sourced; outputs a real ranking and a "what you weighted" readout |
| 1 · Double-spend | `attemptDoubleSpend()` reveal | **Real UTXO mini-ledger** (the page already has a `utxoSet`), broadcast the same coin twice, watch nodes reject the second |
| 3–4 · Proof of work | `tryPuzzle()` **hardcoded fake hashes** | **Real PoW miner**, actually SHA-256 `(data+nonce)` in-browser, increment nonce to N leading zeros, show attempts + time + difficulty tradeoff |
| 6 · Digital signatures | `generateKeyPair()` **static hardcoded keys** | **Real keygen/sign/verify** via WebCrypto (P-256, labeled "demo curve, Bitcoin uses secp256k1"), sign a message, flip a character, watch verify fail |
| 7 · Economic incentives | `calculateProfitability()` **stale $43k + wrong subsidy 3.275** | **Honest miner-economics calc**, live price + correct 3.125 subsidy from the worksheet, explicit assumptions, "illustrative" label |
| 8 · Network effects | `simulateGrowth()` Metcalfe | Keep, **add the honest caveat** (Metcalfe over-counts; value ≠ n²) |
| New · 51% attack |, | **Attack-cost calculator** (hashrate to rent × time × cost), honest about what it can/can't do |

Plus a full **claims audit of the flagship's ~2,700 lines** (I only deep-audited the small dives):
fix stale subsidy/price everywhere, relabel any rigged demo as illustrative, add per-principle
primary sources (whitepaper §, BIPs), and extend `data/first-principles-facts.json` with the
flagship's claims + status flags.

**Decision needed (D2):** real crypto in the signature demo via **WebCrypto P-256** (built-in, no
dependency) with a clear "Bitcoin actually uses secp256k1" note, acceptable? Alternative is
bundling a small secp256k1 lib (heavier). I recommend P-256 + the note.

---

## Axis 2, Second interactive per dive

- **why-money-fails:** add a **Roman-denarius debasement lab**, drag silver content / years,
  see real purchasing-power erosion (data already in the worksheet's `roman_denarius` series).
- **digital-scarcity:** add a **security-budget explorer**, step the subsidy→fee transition
  toward 2140 and see miner revenue composition; this directly dramatizes the steelman's one
  genuinely unresolved objection (will fees alone secure the chain?). Optionally a lost-coins /
  effective-supply slider too.

Both reconcile with `_drafts/first-principles-worksheet.py` (extended) → `data/*.json`.

---

## Sequencing (build in waves once approved)

1. **Wave 1, Visual foundation:** `css/deep-dive-editorial.css` + migrate the 2 small dives + hub. Low risk, sets the look. *(~½ session)*
2. **Wave 2, Flagship:** claims audit + rebuild PoW, signatures, money-matrix, miner-economics; visual migration. *(~1–1.5 sessions, the big one)*
3. **Wave 3, Second interactives:** denarius lab + security-budget explorer. *(~½ session)*
4. **Wave 4, Verify + package:** extend `render-test.mjs` (assert real PoW finds a hash, sign/verify round-trips, matrix scores reconcile), re-run worksheet, refresh handoff + split script.

## Verification standard (unchanged, extended)
Math reconciles within $100; **real** interactives proven in jsdom (PoW returns a qualifying hash;
WebCrypto sign→verify true, tamper→false; matrix weights sum correctly); zero JS console errors;
tag balance; 375px mobile; zero `#C4501A`/`#FF7A00` in computed typography; skip-link + reflect intact.

## Honest scope note
This is a multi-wave effort (realistically 2–3 working sessions), because "real interactives +
visual migration + full flagship claims audit" is a lot more than the status-flip pass. That's the
right call given the flagship was shipping faked demos. I'll do it in the waves above so you can
review after each.

---

### Decisions to confirm before I build
- **D1:** Pull learning-surface visual migration forward for this area + add `css/deep-dive-editorial.css` (existing tokens only)?
- **D2:** WebCrypto P-256 for the signature demo (with secp256k1 note)?
- **D3:** Wave order OK, or do you want the flagship first?
