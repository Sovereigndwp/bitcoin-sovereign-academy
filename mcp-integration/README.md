# MCP Agent Kit Automation

This directory houses the automated audit loop for bitcoinsovereign.academy. Agents scan the codebase and live site, write reports, and open PRs for human review. Nothing ships without your approval.

```
mcp-integration/
  agents/
    planner/
    perf-seo/
    content/
    a11y/
    security/
    dx/
    curriculum/
    analytics/
  contracts/
  reports/
  tools/
  workflows/
```

## Workflow overview

1. **Planner** collects findings (previous reports, open issues) and emits task definitions in `contracts/`.
2. **Specialist agents** (perf, content, a11y, etc.) read their tasks, run scanners, write reports to `reports/<agent>/`, and attach suggested fixes.
3. When a fix is safe, agents may open a branch/PR. All PRs/migrations still require Quality Gates and a human review.

## Task definition (`contracts/`)

Each task is a JSON document:

```json
{
  "id": "TASK-2025-001",
  "title": "Reduce LCP on homepage",
  "priority": "high",
  "owner": "perf-seo",
  "status": "open",
  "inputs": {
    "url": "https://bitcoinsovereign.academy",
    "repo": ".",
    "thresholds": { "lcp_ms": 2500 }
  },
  "acceptance": [
    "LCP < 2.5s mobile (LH median)",
    "No CLS regressions",
    "Quality Gates pass"
  ],
  "created_at": "2025-10-05T08:00:00Z",
  "updated_at": "2025-10-05T08:00:00Z"
}
```

## Agent responsibilities

| Agent        | Scope                                       | Tooling                          |
|--------------|----------------------------------------------|----------------------------------|
| planner      | Deduplicate findings, create tasks           | custom logic                     |
| perf-seo     | Lighthouse, bundle sizes, image audits       | `lhci`, custom reports           |
| content      | Readability (FK), link/404 checks            | FK calculator, link checker      |
| a11y         | Accessibility scans                          | `axe-core`, `pa11y`, `playwright`|
| security     | Headers, CSP, mixed-content                  | curl + security scanners         |
| dx           | Repo hygiene, config validation              | custom scripts                   |
| curriculum   | Tone, accuracy, Bitcoin voice                | bespoke checklists               |
| analytics    | Event coverage, PII enforcement              | plausible event diff             |

## Reports

Agents append results under `reports/<agent>/run-<timestamp>/...`. Each report includes:

* tasks addressed (IDs)
* metrics before/after
* suggested changes (+ branch/PR if applicable)
* TODOs and blockers

Example layout:
```
reports/
  perf-seo/
    run-2025-10-05/
      perf-summary.md
      perf-summary.json
```

## Tools

Reusable command-line utilities live in `tools/` (e.g. `run-lhci.js`, `run-axe.js`, `publish-reports.js`). Agents call these to keep logic DRY.

## Workflow automation

Use `.github/workflows/agents-audit.yml` (see below) to trigger nightly audits or run them on PRs.

```yaml
name: MCP Agents Audit
on:
  schedule: [{ cron: "0 8 * * *" }]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install audit tools
        run: |
          npm ci || npm install
          npm i -g @lhci/cli axe-core playwright http-server
      - name: Run MCP Planner
        run: node mcp-integration/agents/planner/run.js --mode=plan
      # Add individual agent steps here (perf, content, etc.)
      - name: Publish reports
        run: node mcp-integration/tools/publish-reports.js
```

## Policies & guardrails

- Agents never push to `main`. All changes are branched and reviewed.
- One concern per PR (< 500 LOC).
- Quality Gates (`.github/workflows/quality.yml`) must pass before merge.
- Reports should include evidence (screenshots, metrics tables) and a short risk note.

## Quick Start

### Running Agents Locally

```bash
# Run planner in dry-run mode to see what tasks would be created
node mcp-integration/agents/planner/run.js --mode=plan --dry-run

# Run planner for real (creates task contracts)
node mcp-integration/agents/planner/run.js --mode=plan

# Run Perf/SEO agent on assigned tasks
node mcp-integration/agents/perf-seo/run.js

# Run Perf/SEO agent in dry-run mode
node mcp-integration/agents/perf-seo/run.js --dry-run

# Run Accessibility agent
node mcp-integration/agents/a11y/run.js

# Run ad-hoc Lighthouse audit
node mcp-integration/tools/run-lhci.js --url=https://bitcoinsovereign.academy --runs=3

# Run ad-hoc accessibility audit
node mcp-integration/tools/run-axe.js --url=https://bitcoinsovereign.academy

# Run ad-hoc readability check
node mcp-integration/tools/run-fk.js --url=https://bitcoinsovereign.academy --target=8

# Publish consolidated report
node mcp-integration/tools/publish-reports.js --format=markdown --output=summary.md
```

### DRY_RUN Mode

All agents support `--dry-run` flag to preview actions without making changes:

```bash
node mcp-integration/agents/planner/run.js --dry-run
node mcp-integration/agents/perf-seo/run.js --dry-run
node mcp-integration/agents/a11y/run.js --dry-run
```

## Reusable Tools

The `tools/` directory contains standalone utilities that agents can call:

| Tool | Purpose | Usage |
|------|---------|-------|
| `run-lhci.js` | Lighthouse CI runner | `--url=<url> --runs=<n> --output=<path>` |
| `run-axe.js` | Axe accessibility scanner | `--url=<url> --output=<path>` |
| `run-fk.js` | Flesch-Kincaid readability | `--url=<url> --target=<grade>` |
| `publish-reports.js` | Report aggregator | `--format=<md\|json\|html> --output=<path>` |

## Task Contract Lifecycle

1. **Planner creates task** → Status: `open`
2. **Agent picks up task** → Status: `in-progress`
3. **Agent completes work** → Status: `completed` or `ready-for-review`
4. **If blocked** → Status: `blocked`

Agents never modify `main` branch directly. All changes go through PRs.

## Integration with CI/CD

Add to `.github/workflows/agents-audit.yml` for automated audits:

```yaml
name: MCP Agents Audit
on:
  schedule: [{ cron: "0 8 * * *" }]
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm i -g @lhci/cli playwright
      - run: node mcp-integration/agents/planner/run.js --mode=plan
      - run: node mcp-integration/agents/perf-seo/run.js
      - run: node mcp-integration/agents/a11y/run.js
      - run: node mcp-integration/tools/publish-reports.js --format=markdown --output=audit-summary.md
      - uses: actions/upload-artifact@v4
        with:
          name: audit-reports
          path: mcp-integration/reports/
```

## Next steps

1. ✅ ~~Finish the planner logic and ensure it writes valid task contracts~~
2. ✅ ~~Implement the Perf/SEO agent end-to-end with Lighthouse diffing~~
3. ✅ ~~Add reusable tool runners for DRY execution~~
4. ✅ ~~Add automated report publishing~~
5. ⏳ Expand content, curriculum, security agents with similar patterns
6. ⏳ Add branch/PR automation when tasks are completed
7. ⏳ Add npm scripts for common workflows (`npm run audit:perf`, etc.)

