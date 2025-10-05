#!/usr/bin/env node
/**
 * Reusable Lighthouse CI Runner
 *
 * Usage:
 *   node run-lhci.js --url=https://example.com --runs=3 --output=./report.json
 *
 * Options:
 *   --url         Target URL to audit (required)
 *   --runs        Number of runs (default: 3)
 *   --output      JSON output path (optional)
 *   --preset      Lighthouse preset: desktop, mobile (default: mobile)
 *   --categories  Comma-separated categories: performance,accessibility,best-practices,seo (default: all)
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

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
    runs: parseInt(args.runs || '3', 10),
    output: args.output,
    preset: args.preset || 'mobile',
    categories: args.categories?.split(',') || ['performance', 'accessibility', 'best-practices', 'seo']
  };
}

async function runLighthouse(config) {
  const lhciArgs = [
    'autorun',
    `--collect.url=${config.url}`,
    `--collect.numberOfRuns=${config.runs}`,
    `--collect.settings.preset=${config.preset}`
  ];

  if (config.categories.length) {
    lhciArgs.push(`--collect.settings.onlyCategories=${config.categories.join(',')}`);
  }

  console.log(`\n🔍 Running Lighthouse CI for ${config.url} (${config.runs} runs, ${config.preset} preset)...\n`);

  return new Promise((resolve, reject) => {
    const lhci = spawn('lhci', lhciArgs, {
      stdio: 'inherit',
      shell: true
    });

    lhci.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, exitCode: code });
      } else {
        reject(new Error(`LHCI exited with code ${code}`));
      }
    });

    lhci.on('error', (err) => {
      reject(new Error(`Failed to spawn LHCI: ${err.message}`));
    });
  });
}

async function extractResults() {
  const lhciDir = join(process.cwd(), '.lighthouseci');

  try {
    const manifestPath = join(lhciDir, 'manifest.json');
    const manifestData = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestData);

    const reports = await Promise.all(
      manifest.map(async (entry) => {
        const reportPath = join(lhciDir, entry.jsonPath);
        const reportData = await fs.readFile(reportPath, 'utf8');
        return JSON.parse(reportData);
      })
    );

    return {
      success: true,
      runs: reports.length,
      reports,
      summary: calculateSummary(reports)
    };
  } catch (error) {
    console.warn('⚠️  Could not extract detailed results:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function calculateSummary(reports) {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const summary = {
    median: {},
    metrics: {}
  };

  categories.forEach(cat => {
    const scores = reports
      .map(r => r.categories?.[cat]?.score)
      .filter(s => s !== undefined)
      .map(s => Math.round(s * 100));

    if (scores.length) {
      scores.sort((a, b) => a - b);
      summary.median[cat] = scores[Math.floor(scores.length / 2)];
    }
  });

  // Extract key metrics from median run
  const medianReport = reports[Math.floor(reports.length / 2)];
  const audits = medianReport?.audits || {};

  summary.metrics = {
    fcp: audits['first-contentful-paint']?.numericValue,
    lcp: audits['largest-contentful-paint']?.numericValue,
    cls: audits['cumulative-layout-shift']?.numericValue,
    tbt: audits['total-blocking-time']?.numericValue,
    tti: audits['interactive']?.numericValue,
    si: audits['speed-index']?.numericValue
  };

  return summary;
}

async function saveOutput(results, outputPath) {
  if (!outputPath) return;

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Results saved to ${outputPath}`);
}

async function main() {
  try {
    const config = parseArgs();

    // Run Lighthouse
    await runLighthouse(config);

    // Extract and process results
    const results = await extractResults();

    // Save output if requested
    if (config.output) {
      await saveOutput(results, config.output);
    }

    // Print summary
    if (results.success && results.summary) {
      console.log('\n📊 Summary (median scores):');
      Object.entries(results.summary.median).forEach(([cat, score]) => {
        const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
        console.log(`  ${emoji} ${cat}: ${score}/100`);
      });

      console.log('\n⏱️  Core Web Vitals:');
      const { fcp, lcp, cls, tbt } = results.summary.metrics;
      if (fcp) console.log(`  FCP: ${Math.round(fcp)}ms`);
      if (lcp) console.log(`  LCP: ${Math.round(lcp)}ms`);
      if (cls !== undefined) console.log(`  CLS: ${cls.toFixed(3)}`);
      if (tbt) console.log(`  TBT: ${Math.round(tbt)}ms`);
    }

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
