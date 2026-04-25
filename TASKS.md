# Bitcoin Sovereign Academy — Tasks

> Shared roadmap + task list. Check this file at the start of every session.
> See `CLAUDE.md` for values and voice. See `weekly/index.html` for shipped-changelog.

Last updated: 2026-04-25 (post-Tier-1 cleanup)

---

## 🔥 Active / in-progress

| ID | Task | Owner | Status | Notes |
|---|---|---|---|---|
| A1 | Run first tutor eval baseline | — | **needs API key** | `npm run tutor:evals` locally. Writes `reports/tutor-evals-2026-04-24.md`. Establishes baseline for every future SYSTEM_PROMPT change. |
| A2 | Consolidate demo-truthfulness audit | — | **✅ done** | See [`reports/demo-audit-2026-04-24.md`](reports/demo-audit-2026-04-24.md). 135 findings across 52 demos (41 🔴 / 59 🟡 / 35 🟢). Top-10 action list inside. |
| A3 | Tutor live in production? | — | **needs verification** | Test `/api/tutor` from production domain (see "Smoke test" in this file). Ensure `ANTHROPIC_API_KEY` set in Vercel prod env. |

---

## 🎯 Next high-leverage bets (pick one)

Ranked by leverage × feasibility. Pull from the top.

### B1. Act on demo-truthfulness findings 🔴🟡🟢

**Status:** audit complete — [`reports/demo-audit-2026-04-24.md`](reports/demo-audit-2026-04-24.md). **Tier 1 done.** Tier 2 next.

**B1 / Tier 1 (🔴 factual errors teaching wrong things) ✅ done:**
- [x] B1.1 `sat-stacking-calculator` rewired to real historical BTC prices (`20ce1c44`)
- [x] B1.2 Reorg/security math fixed across 3 demos (`86d13f31`)
- [x] B1.3 `mining-simulator` `16^3 = 4,096` (`17a15c59`)
- [x] B1.4 `bitcoin-unit-converter` mBTC = 100,000 sats (`17a15c59`)
- [x] B1.5 `bitcoin-layers-map` dropped invented `OP_WITHDRAWPROOFVERIFY` opcode (`c31993ba`)
- [x] B1.6 Custody cluster refreshed — Samourai/Wasabi shutdowns + hardware inventory (`d07753be`)
- [x] B1.7 `bitcoin-ira-decision-tool` 2025 Roth phase-out updated (`c31993ba`)

**B1 / Tier 2 (🟡 architectural):**
- [x] B1.T2a (price + block-height pass) — wired `mining-economics-demo` (live BTC price replaces 2 hardcoded $100K), `time-chain-explorer` (real chain tip replaces stale 820000), `consensus-game` (real chain tip replaces stale 685000); updated fallback values in `fee-master-tool` and `bitcoin-dca-time-machine`. Verified in preview with live data flowing.
- [ ] B1.T2a-cont **Hashrate / supply extension** — `bitcoin-data-reliable.js` doesn't expose hashrate or circulating supply yet. `mining-economics-demo` still hardcodes `networkHashrate = 700 EH/s`. Add `getHashrate()` (mempool.space `/api/v1/mining/hashrate/3d`) and `getSupply()` (derive from block height or use blockchain.info `/q/totalbc`).
- [ ] B1.T2b **Defunct-services lint** — ship `docs/SERVICE_STATUS.md` + grep-based CI check that flags demos referencing retired names (FTX, Celsius, Samourai, Wasabi-coord, Paxful, Caravan, etc.)

**B1 / Tier 3 (🟢 sharpening):** pick up during normal content passes.

**Why this matters:** CLAUDE.md's #1 rule is "always verify truth of content in platform." Pre-audit, ~80% of demos had unverified claims. This was the first systematic verification pass.

### B2. Tiered reflection system (3-depth ladder)

**What:** extend `reflect-widget.js` so each topic has 3 tiers of questions (surface / conceptual / philosophical). Learner self-selects depth OR the widget escalates based on response quality.
**Why:** CLAUDE.md promises an "engaging, tiered reflection system that adapts to depth of engagement while maintaining educational rigor." Currently we have 3 fixed seeds per topic — no tier structure.
**Depends on:** A1 (want to know baseline tutor quality before we ship a new prompt interaction pattern).

### B3. Spanish localization — Curious Stage-1 modules 2 & 3 ✅ done (`ca3e42db`)

**Shipped:** `paths/curious/stage-1/es/module-2.html` and `module-3.html`. Both ported 1:1 from English with Colombian-neutral register, `lang="es"`, hreflang alternates (en/es/x-default), translated canonical/og/JSON-LD, breadcrumb language switcher to EN. Retrofit applied to `module-1.html` (EN + ES) for hreflang parity, and to EN `module-2/3.html` for the 🇨🇴 Español switcher. `module-2-5.html` next-link in ES files points to `../module-2-5.html` (English) until that intermediate is translated.

**Follow-ups:** translate `module-2-5.html` to Spanish; localize `paths/curious/stage-2/` modules; expand to other paths (Builder, Sovereign).

### B4. Learning-outcomes instrumentation (minimal)

**What:** add 3 privacy-respecting events — `module_started`, `module_completed`, `lab_completed`. localStorage + optional Plausible event. Aggregate into a weekly view in `/weekly/`.
**Why:** you can't optimize what you don't measure. Every other roadmap item becomes data-driven once this exists.
**Risk:** requires thoughtful event design to avoid privacy drift.

### B5. Harden remaining API endpoints (CORS + rate-limit)

**What:** apply the tutor hardening pattern (commit `ec01fa8c`) to other `api/*.ts` endpoints that currently have wildcard CORS.
**Candidates to audit:** `api/subscribe.ts`, `api/pay.ts`, `api/btcpay.ts`, `api/stripe.ts`, `api/checkout.ts`, `api/auth.ts`, `api/create-order.js`.
**Why:** tutor is now solid; the same risks exist elsewhere. Payment endpoints especially matter.

---

## 📋 Accessibility (Phase 1 completion)

Original plan had 7 shared-component audits. Completed 2 of 7; remaining 5 have diminishing returns but close out the pass.

| ID | Target | Pages affected | Effort | Notes |
|---|---|---|---|---|
| C1 | Bitcoin context bar (`js/bitcoin-context.js`) | All modules | ~20 min | Same live-region consolidation pattern used on homepage. Single file. |
| C2 | Claude AI tutor UI (`js/gemini-tutor-ui.js`) | AI-tutor pages | ~45 min | SSE streaming response needs debounced aria-live; textarea label; conversation landmark. |
| C3 | Membership / module gate modals (`js/membership-gate.js`, `js/module-gate-subdomain.js`) | Gated modules | ~30 min | Upgrade modal needs focus trap + aria-labelledby. |
| C4 | Safety banner / assessment (`js/safety-assessment.js`, `js/safety-banner.js`) | Homepage + modules | ~20 min | Form labels, banner dismissibility, focus management. |
| C5 | Progress manager (`js/progress-manager.js`) | Modules | ~15 min | Progress announcements via `aria-valuenow`, completion toast. |

---

## 🔁 Recurring / maintenance

| ID | Task | Cadence | Notes |
|---|---|---|---|
| M1 | Run `npm run tutor:evals` after any SYSTEM_PROMPT change | per change | Compare to baseline. Regressions warrant rollback. |
| M2 | Update `weekly/index.html` changelog | weekly | Tag each shipped PR with category + link. |
| M3 | `git status` check for untracked `.cursor/`, `frontend/`, etc. | occasional | Untracked items keep appearing — decide which belong in repo vs .gitignore. |
| M4 | Verify `ANTHROPIC_API_KEY` quota in Anthropic Console | monthly | Rate-limit now caps at 20/min/IP but check aggregate spend. |

---

## 📦 Shipped this session (2026-04-23 → 04-24)

Chronological. See `git log main --oneline` for full list.

| Commit | Summary |
|---|---|
| `b59a8274` | WCAG 2.1 AA accessibility fixes on homepage (22 fixes) |
| `05d16e05` | SOURCES.md — verifiable references for content claims |
| `cb322bb7` | Reflect-widget accessibility (15 fixes, 171 pages) |
| `1d7952c4` | Lab-guide modal + cards accessibility (17 fixes, 70+ pages) |
| `7d37cdb7` | Tutor SYSTEM_PROMPT rewrite — 7 paths, stuck-learner escalation, depth calibration, language matching, module objectives, citations |
| `ec01fa8c` | Tutor hardening — allow-listed CORS, 20 req/min rate limit, input size caps, persona whitelist |
| (pending) | Tutor eval harness (`scripts/tutor-evals.mjs`, `npm run tutor:evals`) |

---

## 🧪 Smoke test — tutor live?

```bash
# From production domain (CORS will reject other origins)
curl -sS -X POST https://bitcoinsovereign.academy/api/tutor \
  -H "Content-Type: application/json" \
  -H "Origin: https://bitcoinsovereign.academy" \
  -d '{"message":"ping","persona":"curious"}' \
  --max-time 15 | head -c 500
```

Expected: a stream of `data: {"type":"text",...}` chunks.
- `{"error":"ANTHROPIC_API_KEY not configured"}` → set env var in Vercel prod.
- `{"error":"Claude API error 401"}` → key invalid/revoked.
- `{"error":"Claude API error 429"}` → Anthropic rate limit or billing issue.
- Connection refused → not deployed.

---

## 📐 Process notes

- **Every non-trivial change** lands in a single focused commit. Squash locally before pushing.
- **PR body must include** test-plan checklist (at minimum: "manual smoke tested" or "ran `npm run tutor:evals`").
- **Security-relevant changes** require before/after contrast/flow documented in the commit body.
- **Reorg-style monorepo changes** stay on feature branches until build tooling is ready. Do not merge to main without first cherry-picking a minimal slice.
- **Untracked files** (`.cursor/`, `frontend/`, single `.html` drafts at repo root) are NOT committed by default — review before `git add`.

---

## 🗂 How to use this file

**Starting a session:**
1. Read this file.
2. Check "Active / in-progress" — finish anything pending before starting new work.
3. Pick from "Next high-leverage bets" (B1-B5) OR from accessibility (C1-C5).
4. Update status columns as you go.

**Ending a session:**
1. Move completed items to "Shipped this session."
2. Add any new follow-ups you discovered.
3. Commit this file if it changed.

**When stuck on "what next?":**
- Run the tutor evals (A1) if it hasn't been baselined.
- Read the latest demo-audit report (A2) and pick the top 3 🔴 Wrong findings.
- If instrumentation (B4) is still pending, ship it — data unlocks all other decisions.
