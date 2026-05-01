#!/bin/bash
# Sync tokens.css from canonical hub source.
#
# Usage: scripts/sync-tokens.sh [path-to-hub-repo]
# Default: assumes hub at ../sovereign-academy-hub
#
# Source of truth: sovereign-academy-hub/css/tokens.css
# Spec: docs/superpowers/specs/2026-05-01-tokens-migration.md
#
# IMPORTANT: never edit css/tokens.css directly in this repo.
# Edit the hub canonical, then re-run this script in each consuming repo.
set -euo pipefail

HUB_PATH="${1:-../sovereign-academy-hub}"
SRC="$HUB_PATH/css/tokens.css"
DEST="css/tokens.css"

if [ ! -f "$SRC" ]; then
  echo "✗ Hub canonical not found at $SRC"
  echo "  Pass the hub repo path as the first argument, or run from a sibling repo."
  exit 1
fi

if cmp --silent "$SRC" "$DEST" 2>/dev/null; then
  echo "= $DEST already in sync with $SRC"
  exit 0
fi

cp "$SRC" "$DEST"
echo "✓ $DEST synced from $SRC"
echo "  Bytes: $(wc -c < "$DEST")"
