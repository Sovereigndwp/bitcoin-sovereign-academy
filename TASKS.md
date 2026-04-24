# Bitcoin Sovereign Academy — Tasks

> Shared roadmap + task list. Check this file at the start of every session.
> See `CLAUDE.md` for values and voice. See `weekly/index.html` for shipped-changelog.

Last updated: 2026-04-24

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

**Status:** audit complete — [`reports/demo-audit-2026-04-24.md`](reports/demo-audit-2026-04-24.md) has a prioritized TOP-10 action list.

**B1 / Tier 1 (🔴 factual errors teaching wrong things — ship this week):**
- [ ] B1.1 `sat-stacking-calculator` L463-485: "historical backtesting" actually generates random prices. Rename or rewire to real data.
- [ ] B1.2 Reorg/security math cluster — single PR fixing 3 files:
  - `network-consensus-demo` L320: drop bogus `2^n difficulty` reorg-cost formula
  - `consensus-game` Q4: recalculate 40%/6-conf reorg probability (~17.7% not 0.09%)
  - `double-spending-demo` L583: `0.5^n` is not a general formula
- [ ] B1.3 `mining-simulator` L633: `16^3 = 4096` not `256^3 = 16.7M` (off by 4,000×)
- [ ] B1.4 `bitcoin-unit-converter` L662: mBTC = 100,000 sats (not "1 thousand")
- [ ] B1.5 `bitcoin-layers-map` L1150: drop invented `OP_WITHDRAWPROOFVERIFY` opcode
- [ ] B1.6 Custody cluster — single PR:
  - Remove/update Samourai/Whirlpool references (DOJ takedown April 2024)
  - Fix Wasabi zkSNACKs coordinator shutdown (June 2024)
  - Refresh hardware-wallet inventory (Coldcard Q not Mk4, Trezor Safe 3/5 not Model T)
- [ ] B1.7 `bitcoin-ira-decision-tool`: update 2025 Roth IRA phase-out to $150K/$236K

**B1 / Tier 2 (🟡 architectural — next sprint, two PRs resolve ~60 findings):**
- [ ] B1.T2a **Live-data pipeline adoption** — wire all demos with hardcoded BTC price/hashrate/supply/difficulty to `js/bitcoin-data-reliable.js`
- [ ] B1.T2b **Defunct-services lint** — ship `docs/SERVICE_STATUS.md` + grep-based CI check that flags demos referencing retired names (FTX, Celsius, Samourai, Wasabi-coord, Paxful, Caravan, etc.)

**B1 / Tier 3 (🟢 sharpening):** pick up during normal content passes.

**Why this matters:** CLAUDE.md's #1 rule is "always verify truth of content in platform." Pre-audit, ~80% of demos had unverified claims. This was the first systematic verification pass.

### B2. Tiered reflection system (3-depth ladder)

**What:** extend `reflect-widget.js` so each topic has 3 tiers of questions (surface / conceptual / philosophical). Learner self-selects depth OR the widget escalates based on response quality.
**Why:** CLAUDE.md promises an "engaging, tiered reflection system that adapts to depth of engagement while maintaining educational rigor." Currently we have 3 fixed seeds per topic — no tier structure.
**Depends on:** A1 (want to know baseline tutor quality before we ship a new prompt interaction pattern).

### B3. Spanish localization — Curious Stage-1 modules 2 & 3

**What:** translate `/paths/curious/stage-1/module-2.html` and `module-3.html` to Spanish under `/paths/curious/stage-1/es/`. Colombian register. Include `lang="es"` + `hreflang` SEO.
**Why:** Colombia is your named focus market; you have only 1 Spanish module shipped. Bitcoin adoption is high in LatAm; content barrier is language, not quality.
**Dependencies:** none. Could ship in 2-3 hours.

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
curl -sS -X POST https://learn.bitcoinsovereign.academy/api/tutor \
  -H "Content-Type: application/json" \
  -H "Origin: https://learn.bitcoinsovereign.academy" \
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
