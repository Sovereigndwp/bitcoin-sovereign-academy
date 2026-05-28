# Glossary — Bitcoin Sovereign Academy

> Decoder ring for acronyms, internal terms, codenames, and shorthand used across BSA tasks, specs, and conversations. Keep flat — one row per term. Add anything that took longer than 5 seconds to remember.

## Project acronyms

| Term | Meaning |
|------|---------|
| **BSA** | Bitcoin Sovereign Academy (this repo). Primary at bitcoinsovereign.academy. |
| **FSA** | Financially Sovereign Academy — sister project (financiallysovereign.academy). Underbanked-focused, not monetized. |
| **The Bitcoin Adviser** | External advisory partner; collaborative 1-of-3 multisig service. Dalia advises there. |
| **Mi Primer Bitcoin** | Spanish-language Bitcoin curriculum source; Dalia authored The Bitcoin Diploma curriculum for them. |

## Task taxonomy (TASKS.md)

| Term | Meaning |
|------|---------|
| **A1–A3** | Active / in-progress task IDs (all currently ✅ done as of 2026-04-27). |
| **B1–B6** | "Next high-leverage bets" — ranked by leverage × feasibility. Pull from the top. |
| **C1–C5** | Accessibility Phase 1 audit IDs (all ✅ done in `621bf2f2`). |
| **M1–M4** | Recurring / maintenance tasks. |
| **B1 Tier 1/2/3** | 🔴 factual errors / 🟡 architectural / 🟢 sharpening, from `reports/demo-audit-2026-04-24.md`. |
| **B6.1–B6.4** | Visual-system cascade sub-steps: component extraction → P1 strategic pages → P2 prerequisites → P2 cascade. |
| **Phase 1+2 / Phase 3+4** | (B5 context) CORS + rate-limit hardening rollout; Phases 3+4 deliberately won't ship. |

## Audience + path system

| Term | Meaning |
|------|---------|
| **7 audience segments** | curious, builder, sovereign, principled, hurried, pragmatist, observer. Drive path routing on homepage. |
| **Find Your Path widget** | Homepage component that routes visitors to one of the 7 paths. |
| **Path** | A learning track — 4 stages × multiple modules each. Lives at `/paths/<name>/`. |
| **Stage** | Top-level grouping inside a path (`stage-1/` … `stage-4/`). |
| **Module** | Individual lesson page inside a stage (`module-N.html`). |
| **Lab** | Interactive guided exercise. 16 labs total. Tracked via `bsa_lab_completions` localStorage key (FSA uses `fsa_lab_completions`). |
| **Demo** | Standalone interactive at `/interactive-demos/`. 50+ of them. Audited in `reports/demo-audit-2026-04-24.md`. |
| **Deep dive** | Long-form explainer at `/deep-dives/`. |

## Tutor + content

| Term | Meaning |
|------|---------|
| **Tutor** | Socratic AI tutor (Claude-backed) reachable via `/api/tutor`. Streams SSE. Persona-aware (1 per audience segment). |
| **Reflect widget** | Socratic micro-prompt component (`js/reflect-widget.js`). Auto-mounts on demos / deep dives / path modules. |
| **SYSTEM_PROMPT** | Tutor's system prompt. Any change requires `npm run tutor:evals` (rule M1). |
| **MECHANISM-EXPLANATION rule** | A tutor SYSTEM_PROMPT rule shipped 2026-04-26; eval shift after this rule went 12/12 pass. |
| **Tutor evals** | `scripts/tutor-evals.mjs` regression suite — 12 scenarios, dimension averages, pass/marginal/fail. |
| **Lab guide system** | `css/lab-guide.css` + `js/lab-guide.js`. Cards with `data-lab="<id>"` open a modal. |
| **Live context bar** | Sticky bar showing block height, fees, mempool, halving countdown. `js/bitcoin-context.js`. 90s refresh. |
| **Reflect topic** | A topic key tagged on a `.reflect-widget` placeholder div; drives which Socratic seeds appear. |

## Bitcoin / domain shorthand

| Term | Meaning |
|------|---------|
| **Don't Trust, Verify** | BSA tagline. |
| **SoV / MoE / UoA** | Store of Value / Medium of Exchange / Unit of Account. |
| **L0** | "Layer 0" — the Bitcoin base chain as **monetary asset / final settlement** in the foundational-layer thesis taxonomy. (Not the same as the colloquial "L1/L2" usage.) |
| **DCA** | Dollar-cost averaging. |
| **Hashrate units** | EH/s = exahash/s. TH/s = terahash/s. |
| **Multisig** | Multi-signature wallet scheme. The Bitcoin Adviser does 1-of-3 collaborative custody. |
| **WoS** | Wallet of Satoshi (mainstream Lightning custodial wallet). Context: "WoS Nov 2024 correction", "WoS-Spark custody contested" in v4 audit fixes. |
| **Spark** | Off-chain Bitcoin scaling protocol; WoS-Spark integration's custody model was contested in the v4 audit. |
| **RGB** | Bitcoin smart-contracts / asset-issuance layer. Tether RGB: announced, not live. |
| **Taproot Assets** | Lightning Labs' asset-issuance protocol on Bitcoin. |
| **Liquid** | Blockstream's federated Bitcoin sidechain. |
| **Fedimint / Cashu** | Federated-mint and ecash-mint Bitcoin custody primitives. |
| **Stablecoins (USDT, USDC)** | Treated as EMTs under MiCA. USDT-Lightning: Jan-2025 announce / Mar-2026 production. |

## Foundational-Layer Thesis (project memory)

| Term | Meaning |
|------|---------|
| **v3 / v4** | Versions of the foundational-layer thesis. v4 (May 2026) is canonical; v3 archived in-place. |
| **F1–F17** | The 17 falsifiers in the falsification framework. |
| **F17** | Quantum-related falsifier; alone-sufficient for thesis rejection (unilateral-invalidation rule). |
| **F17(a)** | The BIP-360 activation. F17 input. |
| **F17(b)** | The BIP-361 freeze proposal. NOT an F17 input — separate proposal. |
| **BIP-360 (P2MR)** | Pay-to-Multi-Recipient — the quantum-resistant activation proposal that matters for F17(a). |
| **BIP-361** | Contested freeze proposal (separate from BIP-360; v4 reconciled these). |
| **Methodology-immutability** | Once a threshold/deadline/measurement source is committed in a quarterly update, it can only be tightened, never loosened. Preserved across v3 → v4. |
| **F17 unilateral-invalidation** | Any single F17 firing is sufficient for thesis rejection. Enforced in `dashboard.html` verdict logic. |
| **SST** | **Symbiotic Sovereignty Thesis** — Dalia's own thesis framing (Bitcoin-secured symbiosis with non-Bitcoin layers). One of the competing-theses cards. |
| **Block 1 / Block 2 / Block 3** | The v4 rollout sequence: Strategic Spine → Companion Doc Rewrites → Figures + Memory. All May 2026. |

## Regulatory shorthand (Foundational-Layer Thesis)

| Term | Meaning |
|------|---------|
| **MiCA** | EU Markets in Crypto-Assets regulation. Title III/IV in force June 30 2024; full CASP regime Dec 30 2024. |
| **CASP** | Crypto-Asset Service Provider — the licensed actor under MiCA. |
| **ART** | Asset-Referenced Token under MiCA. |
| **EMT** | E-Money Token under MiCA. USDT and USDC are EMTs (not ARTs — v4 correction). |
| **FATF gray-listing** | Financial Action Task Force jurisdictional risk listing. Softened in v4. |
| **Tornado Cash** | US OFAC sanctioning event; v4 treats it as a *multi-vector* enforcement (operators, frontends, devs, infra, LPs) — not just protocol-level. |

## Stack + ops

| Term | Meaning |
|------|---------|
| **Vercel** | Primary deployment. Auto-deploys from `main` within ~60s. |
| **GitHub Pages** | Secondary deployment. |
| **Supabase** | First-party analytics DB + auth backend. |
| **Resend** | Transactional email. Tracking (opens/clicks) explicitly **disabled**. |
| **Stripe / BTCPay / Zaprite** | Payment providers. Each does its own server-side verification. |
| **Upstash Redis** | Candidate replacement for the in-memory rate limiter (`api/rate-limiter.ts`) if B5 Phase 3+ ever revisited. |
| **mempool.space / CoinGecko / Blockchain.info / Kraken** | Live-data sources. Multi-source fallback in `js/bitcoin-data-reliable.js`. |
| **`data-btc-live="<key>"`** | Binder attribute — auto-populates on the 60s refresh tick. Keys include `getHashrate`, `getSupply`, price, height, difficulty. |
| **Lighthouse CI** | SEO audit (`npm run audit:seo`). |

## Voice + conventions

| Term | Meaning |
|------|---------|
| **Voice spec (canonical)** | `docs/marketing/voice-spec.md`. Supersedes all prior voice guidance. |
| **Three-part synthesis check** | composability + first-principles + epistemic. Pre-publish gate for every artifact. |
| **Unbounded mode** | Operating frame — no quizzes, no badges, no completion percentages. |
| **A–D format** | Default for visual/aesthetic decisions: 4-option side-by-side comparison with a recommendation. |
| **Logo system** | Diamond = BSA. Stroke = Dalia. Production SVGs at `assets/dalia/`. |
| **Identity (locked 2026-04-28)** | *"Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent."* |
| **Canonical design reference** | `os.thesovereign.academy` — editorial-asymmetric, Playfair Display + JetBrains Mono. |
| **Visual system (2026-05-03)** | Playfair Display + Crimson Pro + JetBrains Mono. Burnished gold `#C8922A`. Cream paper. Supersedes parts of 2026-05-01. |

## Commit conventions

| Term | Meaning |
|------|---------|
| **Short commit hash** | 8-char prefix — e.g. `43dc0d6f`, `5e6a6db5`, `e9ca8b1f`. Used everywhere as the citation. |
| **(pending)** | A change that's drafted/in-flight but not yet committed. |
| **Squash locally** | Required before pushing — every non-trivial change lands as one focused commit. |
