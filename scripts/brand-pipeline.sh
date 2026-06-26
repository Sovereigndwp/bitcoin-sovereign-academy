#!/usr/bin/env bash
# =============================================================================
# brand-pipeline.sh  —  Brand Steward gated-automation pipeline (BSA)
#
# "Automated where deterministic. Gated where judgment, rendered UI, shared CSS,
#  or irreversible repo changes are involved."
#
# Runs the automated stages for ONE zone and STOPS at the apply gate:
#   1 audit  2 classify  3 group  4 missing-canonical  5 drift  6 semantic
#   7 data-*  8 scoper report  9 proposed patch  10 diff-integrity
#   11 screenshot-QA status  12 verifier report
#
# Default mode is PROPOSAL-ONLY: it never modifies a source file; it only writes
# under reports/zones/<zone>/. Applying the patch is gated (--apply) and is
# auto-refused for shared CSS, high-risk zones, and data-* pages.
#
# Rules come from skills/bsa-brand-steward/brand-protect-list.json (source of truth).
#
# Usage:
#   scripts/brand-pipeline.sh <zone>            # automated stages, stop at gate
#   scripts/brand-pipeline.sh <zone> --apply    # GATED apply (after human approval)
# =============================================================================
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROTECT="$ROOT/skills/bsa-brand-steward/brand-protect-list.json"
AUDIT="$ROOT/scripts/audit-bsa-brand.sh"
TAGLINE="Automated where deterministic. Gated where judgment, rendered UI, shared CSS, or irreversible repo changes are involved."

ZONE="${1:-}"; MODE="${2:-propose}"
[ -n "$ZONE" ] || { echo "usage: brand-pipeline.sh <zone> [--apply]"; exit 2; }
ZONE="${ZONE%/}"
ZONE_DIR="$ROOT/$ZONE"
[ -d "$ZONE_DIR" ] || { echo "zone not found: $ZONE"; exit 2; }
[ -f "$PROTECT" ] || { echo "protect-list missing: $PROTECT"; exit 2; }

OUT="$ROOT/reports/zones/$ZONE"
mkdir -p "$OUT"
SCOPED="$OUT/scoped-report.md"
PATCH="$OUT/proposed.patch"
VERIFY="$OUT/verifier-report.md"

g() { grep "$@" 2>/dev/null || true; }
jqr() { jq -r "$1" "$PROTECT" 2>/dev/null; }

# --- rules from the protect-list (source of truth) ---------------------------
CANON_RE='brand\.css|tokens\.css|design-tokens\.css'
DRIFT_RE="$(jqr '.drift_values_to_canonicalize.values | map(ltrimstr("#")) | join("|")')"; DRIFT_RE="#(${DRIFT_RE})"
DATA_RE="$(jqr '.auto_injection_signals.attributes | join("=|")')="
mapfile -t HIRISK < <(jqr '.high_risk_dirs[]')
ADD_LINK='<link rel="stylesheet" href="/css/brand.css">'   # absolute path per BSA rule

is_hirisk() { local d; for d in "${HIRISK[@]}"; do [ "$ZONE" = "$d" ] && return 0; done; return 1; }

# --- Stage 1: audit (read-only) ----------------------------------------------
echo "[1/12] audit"; [ -x "$AUDIT" ] && "$AUDIT" >/dev/null 2>&1 || true

# --- Stages 2-7: classify the zone -------------------------------------------
echo "[2-7/12] classify zone: $ZONE"
mapfile -t FILES < <(find "$ZONE_DIR" -type f -name '*.html' | sort)
ELIGIBLE=(); SKIP_DATA=(); SKIP_HASCANON=(); DRIFT_PAGES=(); SEMANTIC_PAGES=()
for f in "${FILES[@]}"; do
  rel="${f#$ROOT/}"
  has_canon=$(g -lE "$CANON_RE" "$f"); is_data=$(g -lE "$DATA_RE" "$f")
  [ -n "$(g -liE "$DRIFT_RE" "$f")" ] && DRIFT_PAGES+=("$rel")
  [ -n "$(g -liE 'class="[^"]*(correct|incorrect|success|warning|error|danger|risk-)' "$f")" ] && SEMANTIC_PAGES+=("$rel")
  if [ -n "$has_canon" ]; then SKIP_HASCANON+=("$rel"); continue; fi
  if [ -n "$is_data" ]; then SKIP_DATA+=("$rel"); continue; fi
  ELIGIBLE+=("$rel")            # missing canonical, not data-injected -> link-only candidate
done

ZONE_HIRISK="no"; is_hirisk && ZONE_HIRISK="yes"
DATA_IN_ZONE="${#SKIP_DATA[@]}"

# --- Stage 9 (build first, referenced by report): proposed patch -------------
echo "[9/12] proposed patch (proposal-only; source untouched)"
: > "$PATCH"
TMP="$(mktemp)"
for rel in "${ELIGIBLE[@]}"; do
  # insert the canonical link immediately before the first </head> in a TEMP copy
  awk -v ins="        $ADD_LINK" '
    BEGIN{done=0}
    /<\/head>/ && !done { print ins; done=1 }
    { print }
  ' "$ROOT/$rel" > "$TMP"
  if ! diff -q "$ROOT/$rel" "$TMP" >/dev/null 2>&1; then
    diff -u "$ROOT/$rel" "$TMP" \
      | sed -e "1s|^--- .*|--- a/$rel|" -e "2s|^+++ .*|+++ b/$rel|" >> "$PATCH"
  fi
done
rm -f "$TMP"
PATCH_FILES=$(g -c '^+++ ' "$PATCH"); PATCH_FILES=${PATCH_FILES:-0}

# --- Stage 10: diff-integrity ------------------------------------------------
# Compare NET changes (a line removed and re-added identically cancels — e.g. the
# benign no-trailing-newline artifact). The only net addition allowed is the link.
echo "[10/12] diff-integrity"
trim() { sed 's/^[[:space:]]*//; s/[[:space:]]*$//'; }
ADDED=$(g -E '^\+' "$PATCH" | g -vE '^\+\+\+' | sed 's/^.//' | trim || true)
REMOVED=$(g -E '^-' "$PATCH" | g -vE '^---' | sed 's/^.//' | trim || true)
NET_ADD=$(comm -23 <(printf '%s\n' "$ADDED" | sort) <(printf '%s\n' "$REMOVED" | sort))
NET_DEL=$(comm -13 <(printf '%s\n' "$ADDED" | sort) <(printf '%s\n' "$REMOVED" | sort))
LINKTRIM=$(printf '%s' "$ADD_LINK" | trim)
BAD_ADDS=$(printf '%s\n' "$NET_ADD" | sed '/^$/d' | g -vF "$LINKTRIM" || true)
INTEGRITY="PASS"
[ -n "$(printf '%s\n' "$NET_DEL" | sed '/^$/d')" ] && INTEGRITY="FAIL (net removed content)"
[ -n "$BAD_ADDS" ] && INTEGRITY="FAIL (net additions beyond the canonical link)"

# --- Stage 11: screenshot QA status ------------------------------------------
echo "[11/12] screenshot-QA status"
if [ "$DATA_IN_ZONE" -gt 0 ] || [ "$ZONE_HIRISK" = "yes" ]; then
  SCREENSHOT="REQUIRED (zone has data-* or is high-risk) — run before any apply"
else
  SCREENSHOT="NOT REQUIRED (no data-* pages in scope; static link-only change)"
fi

# --- Gate decision -----------------------------------------------------------
GATE_APPLY_ALLOWED="yes"; GATE_REASON=""
if [ "$ZONE_HIRISK" = "yes" ]; then GATE_APPLY_ALLOWED="no"; GATE_REASON="high-risk zone"; fi
if [ "$DATA_IN_ZONE" -gt 0 ]; then GATE_APPLY_ALLOWED="no"; GATE_REASON="${GATE_REASON:+$GATE_REASON; }contains data-* pages"; fi
if [ "$INTEGRITY" != "PASS" ]; then GATE_APPLY_ALLOWED="no"; GATE_REASON="${GATE_REASON:+$GATE_REASON; }diff-integrity not PASS"; fi

# --- Stage 8: Scoper report --------------------------------------------------
echo "[8/12] scoper report"
{
echo "# Scoper report — zone: \`$ZONE/\`"
echo
echo "_${TAGLINE}_"
echo
echo "Generated $(date '+%Y-%m-%d %H:%M %Z'). Proposal-only: no source files modified."
echo
echo "## Classification"
echo "- HTML files in zone: ${#FILES[@]}"
echo "- Eligible (missing canonical, not data-*): **${#ELIGIBLE[@]}**"
echo "- Skipped — already on canonical CSS: ${#SKIP_HASCANON[@]}"
echo "- Skipped — data-* injected (gated, needs screenshot QA): ${#SKIP_DATA[@]}"
echo "- Pages with drift orange (future canonicalize PR): ${#DRIFT_PAGES[@]}"
echo "- Pages with semantic state classes (protect): ${#SEMANTIC_PAGES[@]}"
echo "- Zone is high-risk: $ZONE_HIRISK"
echo
echo "## Proposed change"
echo "Insert the canonical stylesheet link (absolute path, BSA rule) before \`</head>\` on the ${#ELIGIBLE[@]} eligible pages:"
echo
echo '```html'
echo "$ADD_LINK"
echo '```'
echo "No other change. Orange is preserved; no drift hex is touched in this zone-PR."
echo
echo "## Eligible files"
printf '%s\n' "${ELIGIBLE[@]}" | sed 's/^/- /'
[ "${#SKIP_DATA[@]}" -gt 0 ] && { echo; echo "## Deferred (data-* — separate gated pass)"; printf '%s\n' "${SKIP_DATA[@]}" | sed 's/^/- /'; }
[ "${#DRIFT_PAGES[@]}" -gt 0 ] && { echo; echo "## Drift-orange pages (future canonicalize PR, not this one)"; printf '%s\n' "${DRIFT_PAGES[@]}" | sed 's/^/- /'; }
echo
echo "## What stays untouched"
echo "Content, copy, routes, JSON-LD, scripts, localStorage keys, semantic state colors, and brand orange itself."
echo
echo "## QA checklist"
echo "- Page still renders; canonical link present once in \`<head>\`."
echo "- No visual change expected (inline orange already canonical)."
echo "- Screenshot QA: $SCREENSHOT"
echo "- \`git status\` shows only the eligible files after apply."
} > "$SCOPED"

# --- Stage 12: Verifier report -----------------------------------------------
echo "[12/12] verifier report"
{
echo "# Verifier report — zone: \`$ZONE/\`"
echo
echo "_${TAGLINE}_"
echo
echo "- Proposed patch: \`reports/zones/$ZONE/proposed.patch\`"
echo "- Files in patch: $PATCH_FILES"
echo "- Diff-integrity: **$INTEGRITY** (only added line allowed: the canonical link; no removed lines)"
echo "- Screenshot QA: $SCREENSHOT"
echo "- Apply gate: **$([ "$GATE_APPLY_ALLOWED" = yes ] && echo 'OPEN — eligible for gated apply after human approval' || echo "BLOCKED — $GATE_REASON")**"
echo
echo "## Gates (human checkpoints)"
echo "1. Approve this patch before it is applied."
echo "2. Approval required before any shared-CSS change (not in this zone)."
echo "3. Approval required for high-risk/data-* pages (deferred above)."
echo "4. Approval required before commit/merge."
echo
echo "## Next step"
if [ "$GATE_APPLY_ALLOWED" = "yes" ]; then
  echo "Review the patch, then apply (gated):"
  echo '```'
  echo "git apply reports/zones/$ZONE/proposed.patch   # run after approval, in your terminal"
  echo "# or: scripts/brand-pipeline.sh $ZONE --apply"
  echo '```'
else
  echo "Apply is blocked ($GATE_REASON). Produce a dedicated scoped report for the gated items first."
fi
} > "$VERIFY"

# --- Optional gated apply ----------------------------------------------------
APPLIED="no"
if [ "$MODE" = "--apply" ]; then
  if [ "$GATE_APPLY_ALLOWED" != "yes" ]; then
    echo "GATE: refusing --apply ($GATE_REASON). Proposal written; apply blocked."
  else
    echo "GATE: --apply requested. Applying patch to source (irreversible without git)..."
    if git -C "$ROOT" apply "$PATCH" 2>/dev/null; then APPLIED="yes"; echo "Applied. Review 'git diff' and commit manually."
    else echo "git apply failed here (sandbox/git restriction). Run in your terminal: git apply reports/zones/$ZONE/proposed.patch"; fi
  fi
fi

# --- Summary -----------------------------------------------------------------
echo
echo "Zone: $ZONE | eligible: ${#ELIGIBLE[@]} | patch files: $PATCH_FILES | integrity: $INTEGRITY | apply-gate: $GATE_APPLY_ALLOWED | applied: $APPLIED"
echo "Reports: $SCOPED ; $PATCH ; $VERIFY"
echo "$TAGLINE"
echo "Proposal-only by default. No source files were modified unless --apply passed the gate."
