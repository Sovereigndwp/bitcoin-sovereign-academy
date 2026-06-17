# Cut Salvage Audit — 2026-06-11 (READ-ONLY)

> Every file marked "Cut" (or Top-10 Cut/Merge) in `BSA-Content-Inventory-2026-06-09-REAUDIT.xlsx`, opened and read in full context. **Nothing has been deleted, moved, rewritten, or archived.** No action until Dalia approves.
>
> Method: each file opened and read; content value judged separately from technical quality; cross-checked against TASKS.md, docs/NEXT-SESSION.md, memory/, sitemap.xml, git history, and the current `index.html` versions where duplication was claimed.

## Headline findings

1. **Two "Cut" files contain unreleased, unique content** — `enhancements.html` (6 interactive features absent from the live demo) and `index-backup.html` (12 beginner explainer sections absent from the live demo). Blind deletion loses real pedagogy.
2. **The inventory is already stale on 8 of 12 items**: 6 files already have `noindex` (the inventory's own "next step"), `monetary-alternatives.html` is already a live redirect on main, and `wealth-advisors.html` was already deleted (`685bb5dd`).
3. **`_engine-playground.html` must not be deleted now** — NEXT-SESSION.md's T5 instructions explicitly say to re-open it as the engine API reference. Inventory "Cut" directly conflicts with the active plan.
4. **Sitemap contradicts noindex** on 3 pages (`multi_persona_dashboard`, `persona_selector`, `ai-agents`) — they are noindexed *and* submitted to search engines. Cheap, safe fix.

---

## Per-file audit

| # | File | Inventory reason for Cut | Actual content (after opening) | Unique value | Risk if kept public | Recommended | Salvage destination | Confidence | Dalia decides? |
|---|------|--------------------------|--------------------------------|--------------|---------------------|-------------|---------------------|------------|----------------|
| 1 | `paths/sovereign/stage-3/monetary-alternatives.html` | Duplicate of alternatives-to-bitcoin (Q1/V5) | **Already a 16-line noindex redirect stub on main** (`fc37bb89`) — meta-refresh + JS replace + canonical to the surviving module | Preserves inbound links/bookmarks to the old URL | None — noindexed, redirects instantly | **Keep** (as redirect; the Cut already happened correctly) | n/a | High | No |
| 2 | `certificates/multi_persona_dashboard.html` | Generic licensing-template demo, non-BSA brand | Confirmed: 8 generic persona cards (student/parent/policymaker/educator/entrepreneur/investor/developer/journalist) + "4 example tenants" white-label pitch framing. Already noindexed. **Still in sitemap.xml** | The 8-persona taxonomy with per-persona level/time/format preferences — possible raw material for a licensing pitch, but superseded by the locked 7-segment system | Low (noindexed) but sitemap inclusion is contradictory; off-brand purple if anyone lands on it | **Archive** (graveyard) after sitemap removal — unless the institutional licensing pitch is alive, in which case rebuild branded | `_graveyard/` (monorepo) or delete after Q below | Med | **Yes** — is the white-label/licensing pitch still a live ambition? |
| 3 | `certificates/persona_selector.html` | Same template family, wrong canonical | Confirmed: same 8 personas with 3 learning goals each; placeholder buttons. Already noindexed. **Still in sitemap.xml** | Per-persona learning-goal lists are marginally richer than #2; nothing the 7-segment Find-Your-Path doesn't cover | Same as #2 | **Archive** with #2 (same decision) | Same as #2 | Med | **Yes** — same question as #2 |
| 4 | `ai-agents/index.html` | Internal dev tool, not public | Confirmed: BETA dashboard with buttons driving the real MCP audit-agent stack (`mcp-client.js`, `orchestrator.js`, `advanced-agents.js`) — the nightly audit loop in CLAUDE.md. Already noindexed. **Still in sitemap.xml** | It is a *working UI to live infrastructure*, not dead content | Low (noindexed); confusing if discovered; reveals internal tooling surface | **Keep Reference** — remove from sitemap; optionally move under an admin-gated path later. Do not delete a working ops tool | stays put (or `tools/`-style internal area) | High | **Yes** — keep public-but-noindexed, or restrict access? |
| 5 | `dalia/icon-explorations.html` | Internal design review artifact | Confirmed: Phase-1 icon review (sub-project #2.7), round-2 candidates for about.html title slot + 4 Core Values cards, citing locked spec §7.4, with explicit "no icon at all" reasoning. Already noindexed | **Design-decision rationale** — documents *why* icon choices were made/rejected; review round may not be extracted anywhere else | None (noindexed, unlinked) | **Salvage then Archive** — verify the picks were implemented on about.html; extract the decision + rationale to design docs/memory, then graveyard | decision summary → `docs/superpowers/specs/` design-history note or `memory/`; file → `_graveyard/` | Med-High | **Yes** — confirm icon round-2 decisions were finalized |
| 6 | `dalia/logo-explorations.html` | Internal design review artifact | Confirmed: the **Diamond System v2 rationale** — diamond=BSA / stroke=Dalia, what was kept from the source motif, why the system works solo and combined. Already noindexed | **The only place the locked logo convention's *reasoning* is written down.** CLAUDE.md/memory state the lock, not the why | None (noindexed, unlinked) | **Salvage then Archive** — extract rationale (≈10 lines) into `memory/` or a design-history doc, then graveyard | rationale → `memory/context/` or docs design-history; file → `_graveyard/` | High | No (salvage is unambiguous; final resting place is yours) |
| 7 | `tools/domain-dashboard.html` | Internal admin tool, no educational content | Confirmed: domain-health dashboard shell; stat cards show "–", "Last updated: Never" — appears never wired to real data. Already noindexed, NOT in sitemap | None found — no educational content, no working data feed | None (noindexed, not in sitemap, unlinked) | **Delete** (the only near-unconditional one) — after a grep confirms no tooling/scripts reference it | n/a | Med-High | Light approval |
| 8 | `interactive-demos/bitcoin-key-generator-visual/enhancements.html` | Dev fragment "ENHANCED FEATURES TO ADD TO MAIN FILE" | Confirmed dev fragment — **but contains 6 functions absent from the live index.html**: live SHA-256 "hash your name" playground, hash-prediction challenge, copy-to-clipboard, quiz, plus a "Bitcoin keys = house" analogy block | **Unreleased interactive features.** The hashing playground + house analogy are genuinely good beginner pedagogy. ⚠️ The quiz must NOT be merged — violates unbounded mode (no quizzes) | **INDEXABLE** (no noindex) — a broken-looking fragment is publicly crawlable | **Salvage/Merge** — port hashing playground + analogy into `index.html`, skip the quiz, then delete | `interactive-demos/bitcoin-key-generator-visual/index.html` | High | **Yes** — approve which features merge (recommend: playground + analogy; not quiz) |
| 9 | `interactive-demos/bitcoin-key-generator-visual/index-backup.html` | "Backup duplicate confirmed in prior audit" | **NOT a pure duplicate.** The current index.html is a different, more technical rewrite (BIP39/32/44/84 flow). The backup holds 12 explainer sections absent from current: What is a Private Key, ECC explainer + curve drawing, why words instead of numbers, hashing as one-way function, key-security principles, "What You'll Learn" framing | Beginner-level conceptual explainers that the technical rewrite dropped | **INDEXABLE** — duplicate-content SEO risk + stale version publicly crawlable | **Salvage/Merge** — review the 12 sections, port keepers into index.html (or a beginner intro section), then delete + add `*-backup.html` to .gitignore | `index.html` (same demo) or a deep-dive | High | **Yes** — approve which explainers survive |
| 10 | `youth-families/_engine-playground.html` | "Dev scratch, 0 real content → Cut ok" | 59-line harness exercising **every** engine primitive (Predict/Verify/Keep/Share/Scenario/Plan) with a clean branching demo story + live mempool.space verify. Untracked (local only) | **The only one-page demonstration of the full youth-engine API.** NEXT-SESSION.md T5 instructions: "re-open the local harness … to see the engine API in action" | None — untracked, never deployed | **Keep Reference** until T5+T6 ship. Then either commit as `docs/`-adjacent engine reference (with noindex) or delete once weeks 1–9 serve as live examples | stays local; eventual home = your call post-T5 | High | **Yes** — eventual home, but *after* T5/T6 |
| 11 | `answers/what-is-bitcoin-self-custody.html` (Top-10 **Merge**) | Compare/merge with sovereign content | Thin programmatic-SEO page. "Quick Answer" doesn't answer the question (describes Bitcoin generally, not self-custody). Related-question links → **3 nonexistent pages**; CTA → `/bitcoin-security-review/` which **doesn't exist**. FAQPage schema present. The `answers/` dir has 13 siblings of the same generation, sitemap carries 12 `answers/` URLs | The URL/intent (high-value search query) and the FAQPage schema pattern — not the prose | **Live, indexed, broken-funnel page**: dead links + dead CTA on a custody query — credibility risk for the exact audience BSA targets | **Rebuild** (don't merge as-is): rewrite the answer in voice-spec register, point CTA at a real offer (e.g. emergency-kit or calendar-first), fix/remove dead links. Audit the 13 siblings the same way | rebuild in place | High | **Yes** — rebuild vs. cut the whole `answers/` generation |
| 12 | `institutional/wealth-advisors.html` (Top-10 **Merge**) | URL conflict with `wealth-advisors/` dir | **File already deleted** in `685bb5dd` (canonical conflict resolved). Sitemap still lists the slash-less URL | n/a | Stale sitemap entry only | **Done** — just remove the stale sitemap entry | n/a | High | No |

---

## 1 · Do Not Delete Yet

| File | Why |
|------|-----|
| `youth-families/_engine-playground.html` | Active dev dependency — NEXT-SESSION T5 says to use it; only full engine API demo |
| `…/bitcoin-key-generator-visual/enhancements.html` | 6 unreleased features; salvage hashing playground + analogy first |
| `…/bitcoin-key-generator-visual/index-backup.html` | 12 explainer sections absent from current demo; salvage first |
| `dalia/logo-explorations.html` | Only written rationale for the locked Diamond System; extract first |
| `dalia/icon-explorations.html` | Decision record possibly not extracted; verify about.html implementation first |
| `paths/sovereign/stage-3/monetary-alternatives.html` | It IS the redirect — deleting breaks inbound links |
| `ai-agents/index.html` | Working UI to live MCP audit infrastructure |
| `certificates/multi_persona_dashboard.html` + `persona_selector.html` | Pending licensing-pitch decision |
| `answers/what-is-bitcoin-self-custody.html` | Indexed page on a target query; rebuild beats delete |

## 2 · Safe to Delete (no unique content value)

| File | Condition |
|------|-----------|
| `tools/domain-dashboard.html` | Only after `grep -r domain-dashboard` confirms no script/tool references it. Never wired to data, noindexed, not in sitemap, no educational content |

(That's the whole list. Everything else has salvage value, an open decision, or is already correctly handled.)

## 3 · Salvage Queue (ranked by value)

1. **`index-backup.html` explainer sections** → current key-generator demo. Beginner ECC/private-key/hashing explainers; directly improves a live P-audience demo.
2. **`enhancements.html` hashing playground + house analogy** → same demo. Interactive predict-style beat; on-pedagogy. (Exclude the quiz — unbounded mode.)
3. **`logo-explorations.html` Diamond System rationale** → `memory/` or design-history doc. Small effort, preserves locked-convention reasoning.
4. **`icon-explorations.html` round-2 decisions** → design-history note, after confirming about.html implementation.
5. **`persona_selector.html` per-persona learning goals** → only if licensing pitch revived; otherwise skip.

## 4 · Conflicts to Reconcile

1. **`_engine-playground.html`:** Inventory says Cut · NEXT-SESSION.md says "re-open the local harness" for T5 · TASKS.md C1 carries "decide playground fate" · inventory's own incubator-quarantine rule is overridden by its "dev scratch exception" — on false premises ("0 real content" is wrong; it demonstrates the entire API). **Resolution proposed: Keep Reference until T5/T6, then decide.**
2. **noindex already done (6 files):** Inventory next-steps demand noindex for certificates ×2, ai-agents, icon/logo explorations, domain-dashboard — all already have it. Inventory is stale; re-audit agent likely saw an older tree.
3. **Sitemap vs noindex (3 files):** `multi_persona_dashboard`, `persona_selector`, `ai-agents` are noindexed yet listed in sitemap.xml. Contradictory signals to crawlers.
4. **`monetary-alternatives.html`:** Inventory "Cut / merge the PR" — PR already merged (`fc37bb89`); file is now the redirect and must be kept.
5. **`wealth-advisors.html`:** Inventory "Merge / resolve conflict" — already resolved + deleted (`685bb5dd`); stale slash-less sitemap entry remains.
6. **Quiz in `enhancements.html` vs unbounded mode:** the inventory's "merge features then delete" must exclude the quiz (CLAUDE.md: no quizzes).
7. **`answers/` generation:** sitemap carries 12 `answers/` URLs; the audited one has dead links + dead CTA; 13 siblings unaudited. Inventory only flagged one for Merge.
8. **TASKS.md C3 note (this week):** flagged the playground reconciliation — superseded by this audit's resolution proposal.

## 5 · Proposed next batch (read-only / archive-only — awaiting approval)

No deletions. In order:

1. **Sitemap hygiene (edit, no content change):** remove `multi_persona_dashboard`, `persona_selector`, `ai-agents`, and stale `wealth-advisors` (slash-less) entries from sitemap.xml.
2. **Add noindex to the 2 indexable fragments** (`enhancements.html`, `index-backup.html`) so stale content stops being crawlable *while* salvage is pending.
3. **Salvage extraction (new files only):** Diamond System rationale → memory/design-history; icon round-2 decision note (after about.html verification).
4. **Salvage merge proposals as branches** (not merged without review): key-generator explainers + hashing playground.
5. **Archive moves to `_graveyard/`** — only after items 3–4 land and you approve each file individually.
6. **Decide-with-Dalia queue:** licensing pitch (certificates ×2) · ai-agents access model · `answers/` rebuild-vs-cut · index-backup section picks.

---
*Audit was read-only. No file was deleted, moved, rewritten, archived, or noindexed during this audit.*
