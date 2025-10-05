#!/usr/bin/env node
/**
 * Report Publisher
 *
 * Aggregates all agent reports and generates a unified summary with:
 * - Executive summary
 * - Key findings by agent
 * - Action items
 * - Metrics dashboard
 *
 * Usage:
 *   node publish-reports.js --format=markdown --output=./summary.md
 *   node publish-reports.js --format=json --output=./summary.json
 *   node publish-reports.js --format=html --output=./summary.html
 *
 * Options:
 *   --format      Output format: markdown, json, html (default: markdown)
 *   --output      Output file path (optional, prints to stdout if not specified)
 *   --since       Only include reports since timestamp (ISO 8601)
 *   --agents      Comma-separated list of agents to include (default: all)
 */

import { promises as fs } from 'fs';
import { join } from 'path';

const REPORTS_DIR = join(process.cwd(), 'mcp-integration', 'reports');

function parseArgs() {
  const args = {};

  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    args[key] = value;
  });

  return {
    format: args.format || 'markdown',
    output: args.output,
    since: args.since ? new Date(args.since) : null,
    agents: args.agents?.split(',')
  };
}

async function collectReports(config) {
  const reports = [];

  try {
    const agentDirs = await fs.readdir(REPORTS_DIR, { withFileTypes: true });

    for (const agentDir of agentDirs) {
      if (!agentDir.isDirectory()) continue;

      // Filter by agent if specified
      if (config.agents && !config.agents.includes(agentDir.name)) continue;

      const agentPath = join(REPORTS_DIR, agentDir.name);
      const files = await fs.readdir(agentPath);

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = join(agentPath, file);
        const stat = await fs.stat(filePath);

        // Filter by timestamp if specified
        if (config.since && stat.mtime < config.since) continue;

        const data = await fs.readFile(filePath, 'utf8');
        const report = JSON.parse(data);

        reports.push({
          agent: agentDir.name,
          file,
          timestamp: stat.mtime,
          data: report
        });
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not collect reports:', error.message);
  }

  // Sort by timestamp descending
  reports.sort((a, b) => b.timestamp - a.timestamp);

  return reports;
}

function generateSummary(reports) {
  const summary = {
    generated: new Date().toISOString(),
    totalReports: reports.length,
    agents: {},
    keyFindings: [],
    actionItems: [],
    metrics: {}
  };

  reports.forEach(report => {
    const { agent, data } = report;

    if (!summary.agents[agent]) {
      summary.agents[agent] = {
        count: 0,
        latest: null,
        status: 'ok'
      };
    }

    summary.agents[agent].count++;
    if (!summary.agents[agent].latest || report.timestamp > new Date(summary.agents[agent].latest)) {
      summary.agents[agent].latest = report.timestamp.toISOString();
    }

    // Extract findings based on agent type
    if (agent === 'perf-seo' && data.summary) {
      if (data.summary.median?.performance < 90) {
        summary.keyFindings.push({
          agent,
          severity: 'high',
          finding: `Performance score: ${data.summary.median.performance}/100`,
          metric: 'performance'
        });
        summary.actionItems.push({
          agent,
          action: 'Optimize Core Web Vitals',
          priority: 'high'
        });
      }
      summary.metrics.performance = data.summary.median?.performance;
      summary.metrics.lcp = data.summary.metrics?.lcp;
      summary.metrics.cls = data.summary.metrics?.cls;
    }

    if (agent === 'a11y' && data.summary) {
      if (data.summary.byImpact?.critical > 0) {
        summary.keyFindings.push({
          agent,
          severity: 'critical',
          finding: `${data.summary.byImpact.critical} critical accessibility violations`,
          metric: 'accessibility'
        });
        summary.actionItems.push({
          agent,
          action: 'Fix critical accessibility violations',
          priority: 'critical'
        });
      }
      summary.metrics.accessibility = data.summary.score;
      summary.metrics.a11yViolations = data.summary.totalViolations;
    }

    if (agent === 'content' && data.analysis) {
      const gradeLevel = data.analysis.scores?.fleschKincaidGrade;
      if (gradeLevel > data.targetGrade) {
        summary.keyFindings.push({
          agent,
          severity: 'medium',
          finding: `Content grade level (${gradeLevel}) exceeds target (${data.targetGrade})`,
          metric: 'readability'
        });
        summary.actionItems.push({
          agent,
          action: 'Simplify content to target reading level',
          priority: 'medium'
        });
      }
      summary.metrics.readability = gradeLevel;
    }

    if (agent === 'security' && data.findings) {
      const criticalFindings = data.findings.filter(f => f.severity === 'critical');
      if (criticalFindings.length > 0) {
        summary.keyFindings.push({
          agent,
          severity: 'critical',
          finding: `${criticalFindings.length} critical security issues`,
          metric: 'security'
        });
        summary.actionItems.push({
          agent,
          action: 'Address critical security vulnerabilities',
          priority: 'critical'
        });
      }
    }
  });

  // Sort findings by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  summary.keyFindings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  summary.actionItems.sort((a, b) => severityOrder[a.priority] - severityOrder[b.priority]);

  return summary;
}

function formatMarkdown(summary) {
  let md = `# MCP Agent Reports Summary\n\n`;
  md += `**Generated:** ${new Date(summary.generated).toLocaleString()}\n`;
  md += `**Total Reports:** ${summary.totalReports}\n\n`;

  md += `## 📊 Metrics Dashboard\n\n`;
  md += `| Metric | Value | Status |\n`;
  md += `|--------|-------|--------|\n`;

  const metrics = summary.metrics;
  if (metrics.performance !== undefined) {
    const status = metrics.performance >= 90 ? '🟢 Good' : metrics.performance >= 50 ? '🟡 Needs Work' : '🔴 Poor';
    md += `| Performance | ${metrics.performance}/100 | ${status} |\n`;
  }
  if (metrics.accessibility !== undefined) {
    const status = metrics.accessibility >= 90 ? '🟢 Good' : metrics.accessibility >= 70 ? '🟡 Needs Work' : '🔴 Poor';
    md += `| Accessibility | ${metrics.accessibility}/100 | ${status} |\n`;
  }
  if (metrics.lcp !== undefined) {
    const lcpSec = (metrics.lcp / 1000).toFixed(2);
    const status = lcpSec <= 2.5 ? '🟢 Good' : lcpSec <= 4.0 ? '🟡 Needs Work' : '🔴 Poor';
    md += `| LCP | ${lcpSec}s | ${status} |\n`;
  }
  if (metrics.readability !== undefined) {
    md += `| Readability | Grade ${metrics.readability.toFixed(1)} | - |\n`;
  }
  if (metrics.a11yViolations !== undefined) {
    const status = metrics.a11yViolations === 0 ? '🟢 None' : metrics.a11yViolations < 5 ? '🟡 Few' : '🔴 Many';
    md += `| A11y Violations | ${metrics.a11yViolations} | ${status} |\n`;
  }

  md += `\n## 🚨 Key Findings\n\n`;
  if (summary.keyFindings.length === 0) {
    md += `✅ No major issues found\n\n`;
  } else {
    summary.keyFindings.forEach((finding, i) => {
      const emoji = finding.severity === 'critical' ? '🔴' :
                    finding.severity === 'high' ? '🟠' :
                    finding.severity === 'medium' ? '🟡' : '🔵';
      md += `${i + 1}. ${emoji} **[${finding.agent}]** ${finding.finding}\n`;
    });
  }

  md += `\n## ✅ Action Items\n\n`;
  if (summary.actionItems.length === 0) {
    md += `No action items\n\n`;
  } else {
    summary.actionItems.forEach((item, i) => {
      const emoji = item.priority === 'critical' ? '🔴' :
                    item.priority === 'high' ? '🟠' :
                    item.priority === 'medium' ? '🟡' : '🔵';
      md += `${i + 1}. ${emoji} **[${item.agent}]** ${item.action}\n`;
    });
  }

  md += `\n## 📋 Agent Activity\n\n`;
  Object.entries(summary.agents).forEach(([agent, info]) => {
    md += `- **${agent}**: ${info.count} report(s), latest: ${new Date(info.latest).toLocaleString()}\n`;
  });

  return md;
}

function formatHTML(summary) {
  const markdown = formatMarkdown(summary);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP Agent Reports Summary</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    h1 { color: #1a1a1a; border-bottom: 3px solid #f7931a; padding-bottom: 0.5rem; }
    h2 { color: #333; margin-top: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 0.3rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
    .metric-good { color: #10b981; }
    .metric-warning { color: #f59e0b; }
    .metric-poor { color: #ef4444; }
  </style>
</head>
<body>
  <div>${markdown.replace(/\n/g, '<br>')}</div>
  <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; color: #666; font-size: 0.9em;">
    Generated by MCP Agent Kit • ${new Date(summary.generated).toLocaleString()}
  </footer>
</body>
</html>`;
}

async function saveOutput(content, outputPath) {
  if (!outputPath) {
    console.log(content);
    return;
  }

  await fs.writeFile(outputPath, content);
  console.log(`\n✅ Report published to ${outputPath}`);
}

async function main() {
  try {
    const config = parseArgs();

    console.log('📊 Collecting agent reports...\n');

    const reports = await collectReports(config);

    if (reports.length === 0) {
      console.log('⚠️  No reports found');
      process.exit(0);
    }

    console.log(`Found ${reports.length} report(s)\n`);

    const summary = generateSummary(reports);

    let output = '';
    if (config.format === 'json') {
      output = JSON.stringify(summary, null, 2);
    } else if (config.format === 'html') {
      output = formatHTML(summary);
    } else {
      output = formatMarkdown(summary);
    }

    await saveOutput(output, config.output);

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
