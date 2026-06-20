# Deep-Dive Audit & Upgrade — Reusable Playbook

*Repeat the Bitcoin Capital audit on every other deep dive. One area (or one page) per session. Copy the commands; paste the kickoff prompt.*

---

## 0. The remaining deep dives (audit one area per session)

Suggested order (foundational + highest-traffic first — reprioritize freely):

| # | Area | Pages | Path |
|---|---|---|---|
| 1 | First Principles | 4 | `deep-dives/first-principles/` |
| 2 | Money & Banking | 4 | `deep-dives/money-banking/` |
| 3 | Austrian Economics | 5 | `deep-dives/austrian-economics/` |
| 4 | Philosophy & Economics | 4 | `deep-dives/philosophy-economics/` |
| 5 | Sovereign Tools | 4 | `deep-dives/sovereign-tools/` |
| 6 | Foundational-Layer Thesis | 4 | `deep-dives/foundational-layer-thesis/` (already v4 — likely light) |
| 7 | Jurisdictional Exposure Audit | 1 | `deep-dives/jurisdictional-exposure-audit/` |

Done = every page in the area has `bsa:upgrade_status: strong_as_is` and the hub reflects it.

---

## 1. Start-of-session git setup (run in your terminal)

```bash
cd ~/projects/bitcoin-sovereign-academy

# clear any stale git locks (the recurring gotcha) — no git GUI/IDE running
find .git -name '*.lock' -delete

# sync and start a CLEAN audit branch off the latest main
git fetch origin
git checkout -B audit/<area>-<short-topic> origin/main
#   examples:
#   git checkout -B audit/first-principles-upgrade origin/main
#   git checkout -B audit/money-banking-fractional-reserve origin/main
```

Work happens on this branch. Keep one branch = one area (or one page) so each PR stays reviewable.

---

## 2. Kickoff prompt — paste this to Claude (Cowork), filling the placeholders

```
Audit and upgrade the <AREA NAME> deep dive(s) at deep-dives/<area>/ to "strong as-is"
by the deep-dive-design-and-upgrade framework — the same process we used on the
Bitcoin Capital loans deep dive.

Do it in this order:

1. RESEARCH/PROFILE FIRST. Use the education-intelligence skills:
   - /explore-corpus on deep-dives/<area>/ to profile structure, quality, gaps,
     orphan/duplicate/weak/stale pages, missing sources/interactives/CTAs.
   - /analyze-content for which pages teach which concepts, repair which
     misconceptions, and route too early to TBA.
   - /audit-claims on every page: extract claims, classify, check sources, flag
     stale data (block subsidy, BTC price, dated stats), mark each
     verified / needs-source / needs-revision / unsupported / remove. Search the
     web to verify present-day facts; do not trust priors.

2. APPLY THE FRAMEWORK to each page (read the deep-dive-design-and-upgrade skill):
   research question up front, first-principles build, honest system comparison,
   an interactive test where the math is worth playing with, evidence, steelman
   objections, misconception repair, Socratic reflection, and scope discipline
   (warn rather than silently project; surface tradeoffs, not conclusions).

3. BUILD INTERACTIVES where a learner should make a choice and see a consequence
   (/build-interactive). Match the Bitcoin Capital pattern: single-file vanilla JS
   + local chart.umd.js (no CDN in the primary path), data in a /data/*.json
   source of truth + a reproducible Python worksheet, a persistent scope strip,
   illustrative-labeled estimates, and a "not advice — verify" disclaimer.

4. VERIFY before shipping: math reconciles with the worksheet/JSON within $100 on
   3 random spot-checks; jsdom/headless run with zero JS errors; tag-balance check;
   mobile at 375px; skip link + any disclosure banner still work; no regression in
   existing features.

5. FLIP METADATA: set bsa:upgrade_status -> strong_as_is and
   bsa:learning_arc.interactive_test -> present in each page's JSON-LD; update the
   hub (deep-dives/<area>/index.html if present, and deep-dives/index.html) status
   and "comparison at a glance" rows.

6. Write a short handoff brief + decisions file in deep-dives/<area>/_drafts/ and a
   per-area split script (like split-feature-branch.sh) that branches each change
   off origin/main, commits, and pushes for a PR. Do NOT push yourself — package
   the commands for me to run. Confirm what's tracked vs scratch before any add.

Constraints: Bitcoin-focused, do not blur Bitcoin with crypto. First-principles,
inform-not-convince, composable (voice-spec.md). Use the existing CSS tokens; never
add new design tokens. Absolute CSS paths only.
```

---

## 3. Ship it (run in your terminal after Claude finishes)

```bash
# review what changed for THIS area only
git status
git diff --stat

# stage ONLY this area's files (never `git add -A` — junk stays untracked)
git add deep-dives/<area>/ <any shared assets it introduced, e.g. css/ js/ data/>

git commit -m "audit(<area>): upgrade to strong_as_is — <one-line what changed>"

# push + open a PR -> main (safe overwrite if the branch name was reused)
git push -u --force-with-lease origin audit/<area>-<short-topic>
#   then open the PR on GitHub and MERGE after the Vercel preview checks out
#   (open each upgraded page, confirm interactives render, no console errors)

# OR, if main has no branch protection, fast-forward directly:
git push origin audit/<area>-<short-topic>:main
```

---

## 4. Per-page quality gates (the commit-blockers)

- [ ] Research question stated up front; first-principles build; honest comparison
- [ ] Interactive test present where math is worth playing with (or justified absent)
- [ ] Every numeric/legal/historical claim sourced & dated; no stale figures
- [ ] Scope discipline visible (warn, don't silently project); tradeoffs not conclusions
- [ ] Steelman + misconception repair + Socratic reflection present
- [ ] Interactives: math reconciles with worksheet/JSON within $100 (3 spot-checks)
- [ ] Chart.js from local `chart.umd.js`; no JS console errors; mobile at 375px
- [ ] Skip link + disclosure banner still functional; no regressions
- [ ] `bsa:upgrade_status` -> `strong_as_is`; `interactive_test` -> `present`
- [ ] Hub status row(s) updated
- [ ] Tag-balance check (section/div/svg/figure open == close)

---

## 5. Recurring lock gotcha (read once)

If git says `Unable to create '.git/index.lock'` or `HEAD.lock`: no git process is
usually running — they're stale leftovers (often from git's background maintenance
or leftover worktrees). Fix: quit any git GUI / IDE Git integration, then
`find .git -name '*.lock' -delete`. If it recurs, `git maintenance unregister` and
`git worktree prune`.

---

*Pattern source: `deep-dives/bitcoin-capital/_drafts/phase-d-handoff-brief.md` +
`phase-d-decisions.md` + `split-feature-branch.sh`. Skills: deep-dive-design-and-upgrade,
education-intelligence (explore-corpus / analyze-content / audit-claims /
build-interactive / create-education-viz / insight-brief).*
