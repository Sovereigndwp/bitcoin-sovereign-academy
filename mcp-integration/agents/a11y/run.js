#!/usr/bin/env node
/**
 * Accessibility (A11y) Agent
 * Runs accessibility audits using Axe
 *
 * Usage:
 *   node run.js --dry-run
 *   node run.js --url=https://bitcoinsovereign.academy
 */
import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const CONTRACTS_DIR = join(process.cwd(), 'mcp-integration', 'contracts');
const REPORTS_DIR = join(process.cwd(), 'mcp-integration', 'reports', 'a11y');
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

      if (task.owner === agentName && task.status === 'open') {
        tasks.push(task);
      }
    }
  } catch (error) {
    console.warn('[a11y] Could not load tasks:', error.message);
  }

  return tasks;
}

async function runAxeTool(url, outputPath) {
  const toolPath = join(TOOLS_DIR, 'run-axe.js');

  return new Promise((resolve, reject) => {
    const args = [
      toolPath,
      `--url=${url}`,
      `--output=${outputPath}`
    ];

    const proc = spawn('node', args, {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      resolve({ success: code === 0, exitCode: code });
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to run Axe tool: ${err.message}`));
    });
  });
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
        author: 'a11y-agent',
        message: notes
      });
    }

    await fs.writeFile(taskPath, JSON.stringify(task, null, 2));
  } catch (error) {
    console.warn(`[a11y] Could not update task ${taskId}:`, error.message);
  }
}

async function main() {
  const config = parseArgs();

  console.log(`\n♿ Accessibility Agent ${config.dryRun ? '(DRY RUN)' : ''}\n`);

  await ensureDirs();

  const tasks = config.url
    ? [{
        id: 'adhoc-' + Date.now(),
        inputs: { url: config.url },
        acceptance: ['Accessibility audit completed']
      }]
    : await getAssignedTasks('a11y');

  if (tasks.length === 0) {
    console.log('✨ No tasks assigned to a11y agent');
    return;
  }

  console.log(`Found ${tasks.length} task(s) to process\n`);

  const report = {
    agent: 'a11y',
    executedAt: new Date().toISOString(),
    dryRun: config.dryRun,
    tasks: [],
    summary: null
  };

  for (const task of tasks) {
    const url = task.inputs?.url || 'https://bitcoinsovereign.academy';
    console.log(`♿ Processing task ${task.id}: ${url}`);

    if (config.dryRun) {
      console.log('[DRY RUN] Would run Axe accessibility audit');
      report.tasks.push({
        id: task.id,
        url,
        status: 'skipped-dry-run'
      });
      continue;
    }

    try {
      await updateTaskStatus(task.id, 'in-progress', 'Started Axe accessibility audit');

      const axeOutputPath = join(REPORTS_DIR, `axe-${task.id}-${Date.now()}.json`);
      const axeResult = await runAxeTool(url, axeOutputPath);

      let axeData = null;
      try {
        const resultData = await fs.readFile(axeOutputPath, 'utf8');
        axeData = JSON.parse(resultData);
      } catch (err) {
        console.warn('Could not read Axe results:', err.message);
      }

      const criticalViolations = axeData?.summary?.byImpact?.critical || 0;
      const totalViolations = axeData?.summary?.totalViolations || 0;

      report.tasks.push({
        id: task.id,
        url,
        axe: axeData?.summary || { note: 'Results not available' },
        criticalViolations,
        totalViolations
      });

      if (criticalViolations === 0) {
        await updateTaskStatus(task.id, 'completed', `No critical violations found. Total: ${totalViolations}`);
        console.log(`✅ Task ${task.id} completed - ${totalViolations} total violations`);
      } else {
        await updateTaskStatus(
          task.id,
          'ready-for-review',
          `${criticalViolations} critical violations found. Manual fixes needed.`
        );
        console.log(`⚠️  Task ${task.id} needs manual review - ${criticalViolations} critical violations`);
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

  const reportPath = join(REPORTS_DIR, `a11y-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Report saved to ${reportPath}\n`);
}

main().catch((error) => {
  console.error('[a11y] Fatal error:', error);
  process.exitCode = 1;
});
