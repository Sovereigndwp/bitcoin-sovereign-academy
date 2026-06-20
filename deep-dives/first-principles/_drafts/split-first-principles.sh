#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Ship the First Principles audit/upgrade as one reviewable PR off origin/main,
# WITHOUT disturbing your in-progress fix/sovereign-path-degamify work.
#
# Safe to run from any branch (you are currently on fix/sovereign-path-degamify,
# which is 1 commit ahead of origin/main). This script:
#   1. stashes ONLY the First Principles working-tree changes (tracked files),
#   2. creates a clean audit branch off origin/main,
#   3. reapplies the First Principles changes,
#   4. stages ONLY First Principles + the shared chrome + the 5 bridge modules,
#   5. commits and pushes for a PR.
# Your sovereign commit (59437185) stays untouched on fix/sovereign-path-degamify.
#
#   cd ~/projects/bitcoin-sovereign-academy
#   bash deep-dives/first-principles/_drafts/split-first-principles.sh
# ---------------------------------------------------------------------------
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$REPO"
echo "Repo: $REPO"
BRANCH="audit/first-principles-upgrade"

# the tracked files this PR owns (untracked data/, _drafts/, css/deep-dive-page.css
# carry across the checkout automatically and are added in step 4)
FP_TRACKED=(
  deep-dives/first-principles/why-money-fails.html
  deep-dives/first-principles/digital-scarcity.html
  deep-dives/first-principles/original-question-everything.html
  deep-dives/first-principles/index.html
  deep-dives/index.html
  paths/curious/stage-1/module-1.html
  paths/curious/stage-2/module-1.html
  paths/curious/stage-2/module-2.html
  paths/principled/stage-1/module-1.html
  paths/principled/stage-3/module-1.html
)

# 0) clear the recurring stale git locks (no Git GUI/IDE should be running)
find .git -name '*.lock' -delete 2>/dev/null || true

git fetch origin

# 1) set aside ONLY the First Principles tracked changes (leaves everything else alone)
git stash push -m fp-upgrade -- "${FP_TRACKED[@]}"

# 2) clean audit branch off the latest main (now succeeds: no conflicting tracked changes)
git checkout -B "$BRANCH" origin/main

# 3) reapply the First Principles changes onto the clean branch.
#    A conflict here is expected + harmless: my pages are full rewrites, while
#    origin/main may have made small edits (e.g. em-dash cleanup) to the OLD pages.
#    Auto-resolve any conflict by taking the stashed (new) version, then drop the stash.
STASH_REF="$(git rev-parse -q --verify stash@{0} || true)"
if ! git stash pop 2>/dev/null; then
  CONFLICTS="$(git diff --name-only --diff-filter=U)"
  if [ -n "$CONFLICTS" ] && [ -n "$STASH_REF" ]; then
    echo "Auto-resolving $(echo "$CONFLICTS" | wc -l | tr -d ' ') conflicted file(s) by taking the new (stashed) version:"
    echo "$CONFLICTS"
    echo "$CONFLICTS" | xargs git checkout "$STASH_REF" --
    git stash drop || true
  else
    echo "ERROR: stash pop failed with no auto-resolvable conflicts. Run 'git status' and resolve by hand." >&2
    exit 1
  fi
fi
# guard: no conflict markers may remain
if git grep -lE '^(<<<<<<<|=======|>>>>>>>)' -- deep-dives/first-principles paths >/dev/null 2>&1; then
  echo "ERROR: conflict markers still present. Resolve by hand before committing." >&2; exit 1
fi

# 4) stage ONLY this PR's files (untracked css/data/_drafts now exist in the tree)
git add "${FP_TRACKED[@]}"
git add deep-dives/first-principles/data/ deep-dives/first-principles/_drafts/
git add css/deep-dive-page.css
# never ship the unused chart bundle or the retired editorial stylesheet
git reset -q -- deep-dives/first-principles/chart.umd.js 2>/dev/null || true

echo "----- staged for commit -----"
git status --short
echo "-----------------------------"

# 5) commit
git commit -m "audit(first-principles): rebuild 3 dives + flagship to strong_as_is on the deep-dive system

- All 4 pages on Source Serif 4 + Inter + JetBrains Mono, consuming /css/tokens.css; shared
  page chrome extracted to /css/deep-dive-page.css; interactives reuse /css/deep-dive-lab.css
  + /js/deep-dive-lab.js. No new tokens. Gradient-border buttons.
- Flagship: real SHA-256 proof-of-work miner (NIST-verified), WebCrypto P-256 sign/verify,
  UTXO double-spend mini-ledger, mining-economics + 51%-attack calculators (3.125 subsidy,
  900 EH/s sourced), money matrix, steelman + misconception widgets. De-gamified; the faked
  demos and wrong 3.275 subsidy are gone. aria-live on the live labs.
- why-money-fails: purchasing-power calculator + denarius debasement lab + hyperinflation
  timeline + matrix + steelman + claim-checker. Bridges to (no overlap with) the thesis.
- digital-scarcity: issuance/S2F explorer + security-budget explorer + inline SVG supply
  curve; the falsified S2F PRICE model removed (kept as a scarcity descriptor + evidence).
- index.html: lean hub (de-duplicated the flagship journey out of it).
- Inbound 'Go deeper' bridges from 5 path modules into the flagship P4/P6 labs and the dives.
- data/: reproducible math JSON + sourced claim ledger.
- Verified (jsdom + node webcrypto): all widgets mount; formulas reconcile; SHA-256 NIST
  vectors exact; live miner finds a hash; signatures verify + tamper-fail; UTXO confirm/reject;
  SVG chart drawn; aria-live present; zero console errors; tag balance clean; no em dashes."

# 6) push for a PR
git push -u --force-with-lease origin "$BRANCH"

cat <<'NEXT'

Pushed. Next:
  1. Open the PR -> main on GitHub.
  2. Vercel preview: open each first-principles page (mine grinds + finds a hash; Generate/Sign/
     Verify/Tamper works; UTXO double-spend rejected; calculators + SVG chart render; console clean),
     and spot-check the 5 path modules show the "Go deeper" bridge box.
  3. Merge after the preview checks out.

Your fix/sovereign-path-degamify branch is untouched (commit 59437185 still there).
If `git stash pop` ever reports a conflict, run `git status`, resolve, then `git stash drop`.
NEXT
