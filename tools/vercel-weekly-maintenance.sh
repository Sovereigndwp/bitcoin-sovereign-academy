#!/bin/zsh
set -u

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

REPO_ROOT="/Users/dalia/projects/bitcoin-sovereign-academy"
LOG_DIR="$HOME/Library/Logs"
LOG_FILE="$LOG_DIR/vercel-weekly-maintenance.log"

mkdir -p "$LOG_DIR"

timestamp() {
  date '+%Y-%m-%d %H:%M:%S %Z'
}

log_line() {
  print -r -- "$1" >> "$LOG_FILE"
}

run_cmd() {
  local title="$1"
  shift
  log_line "--- ${title} ---"
  "$@" >> "$LOG_FILE" 2>&1
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    log_line "[WARN] Command failed with exit code ${exit_code}: ${title}"
  fi
  log_line ""
}

run_shell() {
  local title="$1"
  local script="$2"
  log_line "--- ${title} ---"
  /bin/zsh -lc "$script" >> "$LOG_FILE" 2>&1
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    log_line "[WARN] Shell check failed with exit code ${exit_code}: ${title}"
  fi
  log_line ""
}

log_line "=== [$(timestamp)] Weekly Vercel maintenance started ==="
log_line "Repository: ${REPO_ROOT}"
log_line ""

for bin in vercel curl jq dig; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    log_line "[ERROR] Missing required command: ${bin}"
    log_line "=== [$(timestamp)] Weekly Vercel maintenance ended (failed prerequisites) ==="
    log_line ""
    exit 1
  fi
done

run_cmd "Vercel project list" vercel project list
run_cmd "Vercel alias snapshot" vercel alias ls

AUTH_FILE="$HOME/Library/Application Support/com.vercel.cli/auth.json"
if [[ -f "$AUTH_FILE" ]]; then
  VERCEL_TOKEN="$(jq -r '.token // empty' "$AUTH_FILE")"
  if [[ -n "$VERCEL_TOKEN" ]]; then
    run_shell "Project linkage summary (repo + runtime)" "VERCEL_TOKEN='${VERCEL_TOKEN}' && \
      for id in prj_WHolnT2IrtQssmNZ4HEfnh0YQha6 prj_O6sGOxaLVmWolOGjqqC9iyYWwhcv prj_m70ialMYL5PP3iLmg4J51xIb73Cj; do \
        curl -s -H \"Authorization: Bearer \$VERCEL_TOKEN\" \"https://api.vercel.com/v9/projects/\$id\" | \
        jq '{name:.name,nodeVersion:.nodeVersion,gitOrg:.link.org,gitRepo:.link.repo,productionBranch:.link.productionBranch}'; \
      done"
  else
    log_line "[WARN] Could not read Vercel token from auth file."
    log_line ""
  fi
else
  log_line "[WARN] Vercel auth file not found at: ${AUTH_FILE}"
  log_line ""
fi

run_shell "Canonical custom domain aliases" "vercel alias ls | grep -E 'bitcoinsovereign\\.academy|financiallysovereign\\.academy|thesovereign\\.academy|send\\.bitcoinsovereign\\.academy|learn\\.bitcoinsovereign\\.academy|preview\\.bitcoinsovereign\\.academy'"

run_shell "DNS snapshot (apex + www)" "for host in \
  bitcoinsovereign.academy www.bitcoinsovereign.academy \
  financiallysovereign.academy www.financiallysovereign.academy \
  thesovereign.academy www.thesovereign.academy; do \
  echo \"== \$host ==\"; \
  dig +noall +answer \"\$host\" A; \
  dig +noall +answer \"\$host\" CNAME; \
  dig +noall +answer \"\$host\" TXT; \
  echo; \
done"

run_shell "Homepage title checks" "for url in https://bitcoinsovereign.academy https://financiallysovereign.academy https://thesovereign.academy; do \
  echo \"== \$url ==\"; \
  curl -s \"\$url\" | grep -i -m1 '<title>' || echo '[WARN] Title not found'; \
done"

run_cmd "Bitcoin API health endpoint" curl -s -w "\nHTTP_STATUS: %{http_code}\n" https://bitcoinsovereign.academy/api/health
run_cmd "Bitcoin checkout endpoint smoke (GET should be 405)" curl -s -w "\nHTTP_STATUS: %{http_code}\n" https://bitcoinsovereign.academy/api/checkout

log_line "=== [$(timestamp)] Weekly Vercel maintenance ended ==="
log_line ""
