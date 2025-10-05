#!/usr/bin/env node
/**
 * Reusable Axe Accessibility Runner
 *
 * Usage:
 *   node run-axe.js --url=https://example.com --output=./report.json
 *
 * Options:
 *   --url         Target URL to audit (required)
 *   --output      JSON output path (optional)
 *   --tags        Comma-separated tags: wcag2a,wcag2aa,wcag21aa,best-practice (default: wcag2aa,wcag21aa)
 *   --rules       Comma-separated rule IDs to run (default: all)
 *   --disable     Comma-separated rule IDs to disable
 */

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { promises as fs } from 'fs';
import { dirname } from 'path';

function parseArgs() {
  const args = {};

  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    args[key] = value;
  });

  if (!args.url) {
    console.error('❌ Error: --url is required');
    process.exit(1);
  }

  return {
    url: args.url,
    output: args.output,
    tags: args.tags?.split(',') || ['wcag2aa', 'wcag21aa'],
    rules: args.rules?.split(','),
    disable: args.disable?.split(',') || []
  };
}

function categorizeViolations(violations) {
  const byImpact = {
    critical: [],
    serious: [],
    moderate: [],
    minor: []
  };

  violations.forEach(violation => {
    const impact = violation.impact || 'minor';
    byImpact[impact].push(violation);
  });

  return byImpact;
}

function generateSummary(results) {
  const { violations, passes, incomplete } = results;
  const byImpact = categorizeViolations(violations);

  return {
    totalViolations: violations.length,
    byImpact: {
      critical: byImpact.critical.length,
      serious: byImpact.serious.length,
      moderate: byImpact.moderate.length,
      minor: byImpact.minor.length
    },
    totalPasses: passes.length,
    incomplete: incomplete.length,
    score: calculateAccessibilityScore(violations.length, passes.length)
  };
}

function calculateAccessibilityScore(violationCount, passCount) {
  const total = violationCount + passCount;
  if (total === 0) return 100;

  const score = Math.round((passCount / total) * 100);
  return Math.max(0, Math.min(100, score));
}

async function runAxeAudit(config) {
  console.log(`\n♿ Running Axe accessibility audit for ${config.url}...\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(config.url, { waitUntil: 'networkidle', timeout: 30000 });

    let axeBuilder = new AxeBuilder({ page });

    // Apply tags filter
    if (config.tags.length) {
      axeBuilder = axeBuilder.withTags(config.tags);
    }

    // Apply specific rules if provided
    if (config.rules?.length) {
      axeBuilder = axeBuilder.withRules(config.rules);
    }

    // Disable specific rules
    if (config.disable.length) {
      axeBuilder = axeBuilder.disableRules(config.disable);
    }

    const results = await axeBuilder.analyze();

    await browser.close();

    return {
      success: true,
      url: config.url,
      timestamp: new Date().toISOString(),
      ...results,
      summary: generateSummary(results)
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function saveOutput(results, outputPath) {
  if (!outputPath) return;

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Results saved to ${outputPath}`);
}

function printSummary(results) {
  const { summary, violations } = results;

  console.log('\n📊 Accessibility Summary:');
  console.log(`  Score: ${summary.score}/100`);
  console.log(`  Total violations: ${summary.totalViolations}`);
  console.log(`  Passed checks: ${summary.totalPasses}`);

  console.log('\n🚨 Violations by impact:');
  Object.entries(summary.byImpact).forEach(([impact, count]) => {
    if (count > 0) {
      const emoji = impact === 'critical' ? '🔴' :
                    impact === 'serious' ? '🟠' :
                    impact === 'moderate' ? '🟡' : '🔵';
      console.log(`  ${emoji} ${impact}: ${count}`);
    }
  });

  // Show top 5 violations
  if (violations.length > 0) {
    console.log('\n⚠️  Top violations:');
    violations.slice(0, 5).forEach((v, i) => {
      console.log(`  ${i + 1}. [${v.impact}] ${v.id}: ${v.description}`);
      console.log(`     → ${v.nodes.length} instance(s)`);
    });

    if (violations.length > 5) {
      console.log(`  ... and ${violations.length - 5} more`);
    }
  }
}

async function main() {
  try {
    const config = parseArgs();

    const results = await runAxeAudit(config);

    if (config.output) {
      await saveOutput(results, config.output);
    }

    printSummary(results);

    // Exit with error if critical violations found
    const criticalCount = results.summary.byImpact.critical;
    if (criticalCount > 0) {
      console.log(`\n❌ Found ${criticalCount} critical accessibility violations`);
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
