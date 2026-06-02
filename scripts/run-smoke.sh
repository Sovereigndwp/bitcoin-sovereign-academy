#!/usr/bin/env bash
# driver.sh — smoke-driver for Bitcoin Sovereign Academy.
#
# Bitcoin Sovereign Academy is a static site (no build step) + Express dev
# server (server-local.js) + a set of Node CLIs under scripts/nostr and
# scripts/social. This driver covers both surfaces from a clean Linux
# container, in order:
#
#   1. Validate the social-draft pipeline (no network, no server).
#   2. Start the Express dev server in the background, capture logs.
#   3. Probe /api/health and every key route the site is supposed to serve.
#   4. Verify .well-known/nostr.json structure (real pubkey + CORS).
#   5. Confirm the /nostr/ landing page has the real npub + Alby address.
#   6. Smoke-test the Nostr CLI in DRY-RUN signer mode (no keys touched).
#   7. Save a text "snapshot" of the homepage (h1 + CTA chain) under
#      .run-artifacts/. This is the closest to a screenshot in a headless
#      container without chromium installed.
#   8. Stop the server cleanly. Exit non-zero on any failure.
#
# Usage:
#   bash .claude/skills/run-bitcoin-sovereign-academy/driver.sh
#   bash .claude/skills/run-bitcoin-sovereign-academy/driver.sh --port 3001
#   bash .claude/skills/run-bitcoin-sovereign-academy/driver.sh --keep      (don't stop server)
#
# Exit codes:
#   0 — all checks passed
#   1 — at least one check failed
#   2 — server did not come up

set -u
PORT="${PORT:-3000}"
KEEP=0
for arg in "$@"; do
  case "$arg" in
    --port) shift; PORT="$1"; shift ;;
    --port=*) PORT="${arg#--port=}" ;;
    --keep) KEEP=1 ;;
  esac
done

# Find repo root by walking up until we hit package.json — works regardless
# of where this script is invoked from.
ROOT="$(cd "$(dirname "$0")" && pwd)"
while [ "$ROOT" != "/" ] && [ ! -f "$ROOT/package.json" ]; do
  ROOT="$(dirname "$ROOT")"
done
if [ ! -f "$ROOT/package.json" ]; then
  echo "could not locate repo root (no package.json on path up from $0)"; exit 2
fi
cd "$ROOT" || { echo "could not cd to $ROOT"; exit 2; }

ART="$ROOT/.run-artifacts"
mkdir -p "$ART"
SERVER_LOG="$ART/server.log"
SERVER_PID_FILE="$ART/server.pid"
HOME_HTML="$ART/home.html"
NOSTR_HTML="$ART/nostr.html"
SNAPSHOT="$ART/homepage-snapshot.txt"

fail=0
pass() { echo "  [ok]   $1"; }
warn() { echo "  [warn] $1"; }
fail() { echo "  [FAIL] $1"; fail=$((fail+1)); }
hr()   { echo; echo "── $1 ──"; }

cleanup() {
  if [ "$KEEP" -ne 1 ] && [ -f "$SERVER_PID_FILE" ]; then
    local pid; pid="$(cat "$SERVER_PID_FILE" 2>/dev/null || true)"
    if [ -n "${pid:-}" ] && ps -p "$pid" >/dev/null 2>&1; then
      kill "$pid" 2>/dev/null || true
      sleep 1
      ps -p "$pid" >/dev/null 2>&1 && kill -9 "$pid" 2>/dev/null || true
      echo
      echo "── shutdown ── stopped server PID $pid"
    fi
    rm -f "$SERVER_PID_FILE"
  fi
}
trap cleanup EXIT

# Sanity: required tools
hr "preflight"
for t in node npm curl jq; do
  command -v "$t" >/dev/null || fail "$t not installed"
done
[ -d node_modules ] || warn "node_modules missing — run: npm install"
[ $fail -gt 0 ] && exit 1
pass "node $(node -v), npm $(npm -v), curl + jq present"

# 1. Social validation (deterministic, no network)
hr "1. social validate"
if out="$(node scripts/social/validate-social-drafts.mjs 2>&1)"; then
  drafts="$(echo "$out" | grep -Eo 'Checked [0-9]+ draft' | head -1)"
  errors="$(echo "$out" | grep -Eo '[0-9]+ error\(s\)' | head -1)"
  pass "$drafts, $errors"
else
  echo "$out" | tail -20
  fail "scripts/social/validate-social-drafts.mjs returned $?"
fi

# 2. Launch server
hr "2. launch server on :$PORT"
: > "$SERVER_LOG"
PORT="$PORT" nohup node server-local.js >> "$SERVER_LOG" 2>&1 &
echo $! > "$SERVER_PID_FILE"
# Wait up to 6s for /api/health to answer
for i in 1 2 3 4 5 6; do
  sleep 1
  if curl -sf -m 2 "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
    pass "server up (PID $(cat "$SERVER_PID_FILE"), ${i}s)"
    break
  fi
  [ "$i" = 6 ] && { echo "--- server.log tail ---"; tail -30 "$SERVER_LOG"; fail "server did not respond on :$PORT"; exit 2; }
done

# 3. Route probes
hr "3. route probes"
declare -a routes=( "/api/health:200" "/:200" "/nostr/:200" "/.well-known/nostr.json:200" "/start/:200" "/interactive-demos/:200" "/paths/curious/:200" "/glossary.html:200" )
for r in "${routes[@]}"; do
  path="${r%:*}"; want="${r##*:}"
  code="$(curl -s -m 5 -o /dev/null -w '%{http_code}' "http://localhost:$PORT$path")"
  if [ "$code" = "$want" ]; then pass "HTTP $code  $path"
  else fail "HTTP $code  $path  (expected $want)"
  fi
done

# 4. NIP-05 structure
hr "4. NIP-05 (/.well-known/nostr.json)"
curl -s -m 5 "http://localhost:$PORT/.well-known/nostr.json" -o "$ART/nostr.json"
if jq -e '.names | keys | length >= 1' "$ART/nostr.json" >/dev/null 2>&1; then
  names="$(jq -r '.names | keys | join(",")' "$ART/nostr.json")"
  pubkey="$(jq -r '(.names._ // (.names | to_entries[0].value))' "$ART/nostr.json")"
  if [[ "$pubkey" =~ ^[0-9a-f]{64}$ ]]; then
    pass "names: $names  pubkey: ${pubkey:0:12}…"
  else
    fail "pubkey not lowercase 64-char hex: $pubkey"
  fi
  jq -e '.relays' "$ART/nostr.json" >/dev/null && pass "relays block present"
else
  fail "names block missing/invalid"
fi

# 5. /nostr/ page content (real npub + Alby address present)
hr "5. /nostr/ landing page"
curl -s -m 5 "http://localhost:$PORT/nostr/" -o "$NOSTR_HTML"
if grep -q "npub1fn3afycdlus5u495ge45ajvzrwm2mxt2sxc07yckme5al3kvs97qag2y5c" "$NOSTR_HTML"; then
  pass "real BSA npub present"
else
  fail "BSA npub not found on /nostr/"
fi
if grep -q "sovereigndwp@getalby.com" "$NOSTR_HTML"; then
  pass "Lightning address (sovereigndwp@getalby.com) present"
else
  fail "Alby Lightning address not on /nostr/"
fi
for bad in "bsa@coinos.io" "dulcetsurf67367@getalby.com" "creambulldog12@primal.net"; do
  if grep -q "$bad" "$NOSTR_HTML"; then fail "deprecated address still on /nostr/: $bad"; fi
done

# 6. Nostr CLI dry-runs (no keys needed)
hr "6. Nostr CLI dry-run smoke"
if NOSTR_SIGNER_MODE=dry-run node scripts/nostr/set-profile.mjs --dry-run >/dev/null 2>&1; then
  pass "set-profile --dry-run (kind 0 metadata builds without keys)"
else
  fail "set-profile --dry-run failed"
fi
if NOSTR_SIGNER_MODE=dry-run NOSTR_USE_TEST=1 node scripts/nostr/publish-approved.mjs --dry-run >/dev/null 2>&1; then
  pass "publish-approved --dry-run (handles empty approved/ gracefully)"
else
  fail "publish-approved --dry-run failed"
fi

# 7. Homepage snapshot (text — no chromium in this container)
hr "7. homepage snapshot → $SNAPSHOT"
curl -s -m 5 "http://localhost:$PORT/" -o "$HOME_HTML"
{
  echo "BSA homepage snapshot — $(date -u +%FT%TZ)"
  echo "Bytes: $(wc -c < "$HOME_HTML")"
  echo
  echo "── <title> ──"; grep -oE '<title>[^<]*' "$HOME_HTML" | sed 's|<title>||' | head -1
  echo
  echo "── first 5 <h1>/<h2> ──"; grep -oE '<h[12][^>]*>[^<]*' "$HOME_HTML" | sed -E 's/<[^>]+>//g' | head -5
  echo
  echo "── footer 'Created by Dalia' present? ──"; grep -c "Created by Dalia" "$HOME_HTML"
  echo
  echo "── /nostr/ link in footer? ──"; grep -c 'href="/nostr/"' "$HOME_HTML"
} > "$SNAPSHOT"
pass "wrote $SNAPSHOT ($(wc -l < "$SNAPSHOT") lines)"
echo
echo "── snapshot contents ──"
cat "$SNAPSHOT"

# Summary
hr "summary"
if [ $fail -eq 0 ]; then
  echo "  PASS — all checks green."
  exit 0
else
  echo "  FAIL — $fail check(s) failed. See output above + $SERVER_LOG."
  exit 1
fi
