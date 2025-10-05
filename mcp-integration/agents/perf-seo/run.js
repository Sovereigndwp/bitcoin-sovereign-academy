#!/usr/bin/env node
/**
 * Perf/SEO Agent
 * Runs Lighthouse CI audits and analyzes performance metrics
 *
 * Usage:
 *   node run.js --dry-run
 *   node run.js --url=https://bitcoinsovereign.academy
 */
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTRACTS_DIR = join(process.cwd(), 'mcp-integration', 'contracts');
const REPORTS_DIR = join(process.cwd(), 'mcp-integration', 'reports', 'perf-seo');
const TOOLS_DIR = join(process.cwd(), 'mcp-integration', 'tools');

function parseArgs() {
  const args = {
    dryRun: false,
    url: null
  };

  process.argv.slice(2).forEach(arg => {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--url=')) args.url = arg.split('=')[1];
  });

  return args;
}

async function ensureDirs() {
  await fs.mkdir(REPORTS_DIR, { recursive: true });
}

async function getAssignedTasks(agentName) {
  const tasks = [];

  try {
    const files = await fs.readdir(CONTRACTS_DIR);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const data = await fs.readFile(join(CONTRACTS_DIR, file), 'utf8');
      const task = JSON.parse(data);

      // Only process tasks assigned to this agent with status 'open'
      if (task.owner === agentName && task.status === 'open') {
        tasks.push(task);
      }
    }
  } catch (error) {
    console.warn('[perf-seo] Could not load tasks:', error.message);
  }

  return tasks;
}

async function runLighthouseTool(url, outputPath) {
  const toolPath = join(TOOLS_DIR, 'run-lhci.js');

  return new Promise((resolve, reject) => {
    const args = [
      toolPath,
      `--url=${url}`,
      '--runs=3',
      `--output=${outputPath}`
    ];

    const proc = spawn('node', args, {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, exitCode: code });
      } else {
        // Non-zero exit means issues found, but we still got results
        resolve({ success: false, exitCode: code });
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to run Lighthouse tool: ${err.message}`));
    });
  });
}

async function analyzeBundleSize() {
  // Placeholder for bundle size analysis
  // Could integrate with webpack-bundle-analyzer or similar
  return {
    analyzed: false,
    note: 'Bundle size analysis not yet implemented'
  };
}

async function updateTaskStatus(taskId, status, notes = null) {
  const taskPath = join(CONTRACTS_DIR, `${taskId}.json`);

  try {
    const data = await fs.readFile(taskPath, 'utf8');
    const task = JSON.parse(data);

    task.status = status;
    task.updated_at = new Date().toISOString();

    if (notes) {
      if (!task.notes) task.notes = [];
      task.notes.push({
        timestamp: new Date().toISOString(),
        author: 'perf-seo-agent',
        message: notes
      });
    }

    await fs.writeFile(taskPath, JSON.stringify(task, null, 2));
  } catch (error) {
    console.warn(`[perf-seo] Could not update task ${taskId}:`, error.message);
  }
}

async function main() {
  const config = parseArgs();

  console.log(`\n⚡ Perf/SEO Agent ${config.dryRun ? '(DRY RUN)' : ''}\n`);

  await ensureDirs();

  // Get assigned tasks
  const tasks = config.url
    ? [{
        id: 'adhoc-' + Date.now(),
        inputs: { url: config.url },
        acceptance: ['Performance audit completed']
      }]
    : await getAssignedTasks('perf-seo');

  if (tasks.length === 0) {
    console.log('✨ No tasks assigned to perf-seo agent');
    return;
  }

  console.log(`Found ${tasks.length} task(s) to process\n`);

  const report = {
    agent: 'perf-seo',
    executedAt: new Date().toISOString(),
    dryRun: config.dryRun,
    tasks: [],
    summary: null
  };

  for (const task of tasks) {
    const url = task.inputs?.url || 'https://bitcoinsovereign.academy';
    console.log(`📊 Processing task ${task.id}: ${url}`);

    if (config.dryRun) {
      console.log('[DRY RUN] Would run Lighthouse audit');
      report.tasks.push({
        id: task.id,
        url,
        status: 'skipped-dry-run'
      });
      continue;
    }

    try {
      // Update task status to in-progress
      await updateTaskStatus(task.id, 'in-progress', 'Started Lighthouse audit');

      // Run Lighthouse using reusable tool
      const lhOutputPath = join(REPORTS_DIR, `lh-${task.id}-${Date.now()}.json`);
      const lhResult = await runLighthouseTool(url, lhOutputPath);

      // Read results
      let lhData = null;
      try {
        const resultData = await fs.readFile(lhOutputPath, 'utf8');
        lhData = JSON.parse(resultData);
      } catch (err) {
        console.warn('Could not read Lighthouse results:', err.message);
      }

      // Check acceptance criteria
      const performance = lhData?.summary?.median?.performance;
      const lcp = lhData?.summary?.metrics?.lcp;
      const meetsThreshold = performance >= (task.inputs?.thresholds?.performance || 90);

      report.tasks.push({
        id: task.id,
        url,
        lighthouse: lhData?.summary || { note: 'Results not available' },
        meetsThreshold
      });

      // Update task status
      if (meetsThreshold) {
        await updateTaskStatus(task.id, 'completed', `Performance score: ${performance}/100`);
        console.log(`✅ Task ${task.id} completed - performance: ${performance}/100`);
      } else {
        await updateTaskStatus(
          task.id,
          'ready-for-review',
          `Performance score ${performance}/100 below threshold. Manual optimization needed.`
        );
        console.log(`⚠️  Task ${task.id} needs manual review - performance: ${performance}/100`);
      }

    } catch (error) {
      console.error(`❌ Failed to process task ${task.id}:`, error.message);
      report.tasks.push({
        id: task.id,
        url,
        error: error.message
      });
      await updateTaskStatus(task.id, 'blocked', error.message);
    }

    console.log('');
  }

  // Bundle size analysis (future enhancement)
  const bundleAnalysis = await analyzeBundleSize();
  report.bundleSize = bundleAnalysis;

  // Calculate summary
  const completedTasks = report.tasks.filter(t => !t.error);
  if (completedTasks.length > 0) {
    const avgPerformance = completedTasks.reduce((sum, t) =>
      sum + (t.lighthouse?.median?.performance || 0), 0) / completedTasks.length;

    report.summary = {
      totalTasks: tasks.length,
      completed: completedTasks.length,
      failed: report.tasks.filter(t => t.error).length,
      avgPerformance: Math.round(avgPerformance)
    };
  }

  // Save report
  const reportPath = join(REPORTS_DIR, `perf-seo-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Report saved to ${reportPath}\n`);

  if (report.summary) {
    console.log('📊 Summary:');
    console.log(`  Completed: ${report.summary.completed}/${report.summary.totalTasks}`);
    console.log(`  Avg Performance: ${report.summary.avgPerformance}/100`);
  }
}

main().catch((error) => {
  console.error('[perf-seo] Fatal error:', error);
  process.exitCode = 1;
});
