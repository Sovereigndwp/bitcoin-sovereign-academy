# MCP Self-Improvement System

This directory contains the autonomous quality and content management system for Bitcoin Sovereign Academy.

## Architecture

The MCP (Model Context Protocol) system runs automated audits, proposes improvements, and maintains platform quality through gated PRs.

### Components

#### 1. Auditors (`/auditors/`)

Specialized bots that detect issues and propose fixes:

- **`ux-auditor.js`** - Runs Lighthouse, monitors Core Web Vitals, flags layout shifts
- **`design-auditor.js`** - Enforces design tokens, detects inconsistent spacing/shadows
- **`accessibility-auditor.js`** - Runs axe checks, fixes contrast and keyboard navigation
- **`seo-auditor.js`** - Checks meta tags, generates AB test copy variants
- **`link-health-auditor.js`** - Crawls site, validates demo routes, checks console errors
- **`bitcoin-scout.js`** - Monitors Bitcoin ecosystem for curriculum updates
- **`bug-triage.js`** - Converts errors and feedback into actionable issues
- **`content-generator.js`** - Autonomously identifies content gaps and generates high-value educational modules

#### 2. Scripts (`/scripts/`)

Automation workflows:

- **`daily-audit.js`** - Runs all auditors daily, generates reports
- **`content-updater.js`** - Pulls Bitcoin updates, creates patch proposals
- **`pr-generator.js`** - Creates PRs with test results and screenshots
- **`analytics-reporter.js`** - Analyzes tracked events, suggests experiments

#### 3. Config (`/config/`)

Configuration files:

- **`sources.json`** - Bitcoin news/update sources to monitor
- **`quality-thresholds.json`** - Minimum scores for Lighthouse, accessibility, etc.
- **`design-rules.json`** - Design token enforcement rules

## Workflow

### Daily Quality Check

```bash
node mcp/scripts/daily-audit.js
```

1. Runs all auditors
2. Generates findings report
3. If issues found → creates PR with fixes
4. Runs quality gate checks
5. If passes → ready for merge

### Content Update Pipeline

```bash
node mcp/scripts/content-updater.js
```

1. Checks configured Bitcoin sources
2. Extracts relevant changes
3. Generates curriculum patch notes
4. Creates PR with updated modules
5. Runs link checks and tests

### Analytics-Driven Experiments

```bash
node mcp/scripts/analytics-reporter.js
```

1. Queries tracked events from localStorage/analytics
2. Calculates conversion funnels
3. Identifies friction points
4. Proposes one experiment (A/B test)
5. Creates feature flag PR

## Integration with Existing Code

The MCP system connects to:

- **`/api/mcp`** - Backend endpoint returning personalized content
- **`js/mcp-service.js`** - Client service that listens for `mcpContentRefresh` events
- **`css/design-tokens.css`** - Single source of truth for design values
- **`.github/workflows/quality-gate.yml`** - Automated PR quality checks

## Key Principles

### 1. Never Push Directly to Production
All changes go through PRs with:
- Automated tests
- Screenshot comparisons
- Lighthouse score checks
- Accessibility audits

### 2. One Change at a Time
Each PR addresses a single concern:
- Fix one accessibility issue
- Update one module
- Propose one experiment

### 3. Always Explain Why
Every PR includes:
- What changed
- Why it changed
- Evidence (metrics, standards, errors)
- How to verify

### 4. Preserve User Intent
- Never silently rewrite content
- Always propose, never force
- Include rollback instructions

## Usage Examples

### Running a UX Audit

```bash
node mcp/auditors/ux-auditor.js
```

Output:
```
🔍 Running UX Audit...
📊 Lighthouse Scores:
   Performance: 92 ✅
   Accessibility: 88 ⚠️
   Best Practices: 95 ✅
   SEO: 100 ✅

⚠️  Issues Found:
   - Layout shift detected in hero section (CLS: 0.15)
   - Slow LCP on /paths/curious/ (3.2s)

💡 Proposed Fixes:
   1. Add aspect-ratio to hero images
   2. Preload critical fonts
   
Creating PR: fix/ux-improvements-2026-01-11
```

### Checking Design Token Compliance

```bash
node mcp/auditors/design-auditor.js
```

Output:
```
🎨 Design Token Audit
✅ All colors use design tokens
⚠️  Found 3 inline shadow values
⚠️  Inconsistent spacing in index.html (lines 245-260)

Generating fix PR...
```

### Monitoring Bitcoin Updates

```bash
node mcp/auditors/bitcoin-scout.js
```

Output:
```
🔍 Checking Bitcoin ecosystem updates...
📰 Sources: Bitcoin Optech, Bitcoin Magazine, GitHub releases

🆕 Relevant Updates Found:
1. BIP-??? Taproot Asset Protocol - affects Module 8
2. Common wallet phishing pattern - update security warnings

📝 Generating patch notes...
Creating content update PR...
```

### Generating New Educational Content

```bash
node mcp/auditors/content-generator.js
```

Output:
```
🎨 Content Generator MCP - Starting...

📊 Step 1: Analyzing content gaps...
   Found 18 content gaps across 5 categories

🎯 Step 2: Prioritizing by impact...
   Top 10 priorities:
   1. [CRITICAL] Backup & Recovery Procedures (practical_skills)
   2. [HIGH] Inflation vs Deflation (financial_literacy)
   3. [HIGH] Digital Privacy Fundamentals (sovereignty_concepts)
   4. [HIGH] Receiving Salary in Bitcoin (real_world_scenarios)
   5. [HIGH] Mining Difficulty Adjustment Simulator (interactive_demos)
   ...

📝 Step 3: Generating content templates...
   Generated 3 content templates

✅ Content generation report saved
   Location: mcp/reports/content-generation-report.json

📋 Summary:
   • 18 total content gaps identified
   • 10 prioritized for development
   • 3 templates generated
   • Next: Use AI to generate full modules from templates
```

The Content Generator identifies gaps in:
- **Financial Literacy** - inflation, purchasing power, time preference
- **Sovereignty Concepts** - privacy, censorship resistance, self-custody
- **Practical Skills** - backup procedures, fee estimation, signature verification  
- **Real-World Scenarios** - salary in Bitcoin, remittances, estate planning
- **Interactive Demos** - difficulty adjustment, UTXO management, Lightning channels

Each gap includes:
- Priority level (critical/high/medium)
- Target learning paths
- Suggested format (simulator, calculator, decision-tree, etc.)
- AI generation prompt for creating full content
- Quality standards checklist

## Future Enhancements

- [ ] Real-time error monitoring integration
- [ ] A/B test result automation
- [ ] Visual regression testing
- [ ] Performance budget enforcement
- [ ] Automated translation updates
- [ ] User feedback classification

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure sources:
   ```bash
   cp mcp/config/sources.example.json mcp/config/sources.json
   # Edit sources.json with your monitoring preferences
   ```

3. Run first audit:
   ```bash
   node mcp/scripts/daily-audit.js
   ```

4. Review generated PR and merge if quality checks pass

## Contributing to MCP

To add a new auditor:

1. Create `/mcp/auditors/your-auditor.js`
2. Follow the interface:
   ```javascript
   module.exports = {
     name: 'Your Auditor',
     async run() {
       // Detect issues
       // Generate fixes
       // Return report
     }
   }
   ```
3. Add to `/mcp/scripts/daily-audit.js`
4. Document in this README

---

**Status**: Active development - Core auditors implemented, content pipeline in progress
**Last Updated**: 2026-01-11
