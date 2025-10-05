#!/usr/bin/env node
/**
 * Planner Agent
 * Reads recent reports, GitHub issues, deduplicates findings, and emits task contracts.
 *
 * Usage:
 *   node run.js --mode=plan --dry-run
 *   node run.js --mode=plan --since=2025-10-01
 */
import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CONTRACTS_DIR = join(process.cwd(), 'mcp-integration', 'contracts');
const REPORTS_DIR = join(process.cwd(), 'mcp-integration', 'reports');
const DIGEST_DIR = join(REPORTS_DIR, 'planner');

function parseArgs() {
  const args = {
    mode: 'plan',
    dryRun: false,
    since: null
  };

  process.argv.slice(2).forEach(arg => {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--mode=')) args.mode = arg.split('=')[1];
    else if (arg.startsWith('--since=')) args.since = new Date(arg.split('=')[1]);
  });

  return args;
}

async function ensureDirs() {
  await fs.mkdir(CONTRACTS_DIR, { recursive: true });
  await fs.mkdir(DIGEST_DIR, { recursive: true });
}

async function collectFindings(sinceDate) {
  const findings = [];

  try {
    const agentDirs = await fs.readdir(REPORTS_DIR, { withFileTypes: true });

    for (const agentDir of agentDirs) {
      if (!agentDir.isDirectory() || agentDir.name === 'planner') continue;

      const agentPath = join(REPORTS_DIR, agentDir.name);
      const files = await fs.readdir(agentPath);

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = join(agentPath, file);
        const stat = await fs.stat(filePath);

        if (sinceDate && stat.mtime < sinceDate) continue;

        const data = await fs.readFile(filePath, 'utf8');
        const report = JSON.parse(data);

        findings.push({
          agent: agentDir.name,
          timestamp: stat.mtime,
          data: report
        });
      }
    }
  } catch (error) {
    console.warn('[planner] Could not collect findings:', error.message);
  }

  return findings;
}

async function getOpenIssues() {
  try {
    const result = execSync('gh issue list --json number,title,labels,state --limit 50', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    return JSON.parse(result);
  } catch (error) {
    console.warn('[planner] Could not fetch GitHub issues (gh CLI may not be available)');
    return [];
  }
}

async function getExistingTasks() {
  const tasks = [];

  try {
    const files = await fs.readdir(CONTRACTS_DIR);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const data = await fs.readFile(join(CONTRACTS_DIR, file), 'utf8');
      tasks.push(JSON.parse(data));
    }
  } catch (error) {
    console.warn('[planner] Could not load existing tasks:', error.message);
  }

  return tasks;
}

function generateTaskId() {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const sequence = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `TASK-${date}-${sequence}`;
}

function createTask(id, title, owner, priority, inputs, acceptance) {
  const now = new Date().toISOString();
  return {
    id,
    title,
    priority,
    owner,
    status: 'open',
    inputs,
    acceptance,
    created_at: now,
    updated_at: now
  };
}

function deduplicateTasks(newTasks, existingTasks) {
  return newTasks.filter(newTask => {
    // Check if similar task already exists
    return !existingTasks.some(existing => {
      // Same owner and similar title
      const sameOwner = existing.owner === newTask.owner;
      const similarTitle = existing.title.toLowerCase().includes(newTask.title.toLowerCase().split(' ')[0]);
      const notCompleted = existing.status !== 'completed' && existing.status !== 'cancelled';

      return sameOwner && similarTitle && notCompleted;
    });
  });
}

function extractTasksFromFindings(findings) {
  const tasks = [];

  findings.forEach(({ agent, data }) => {
    // Performance findings
    if (agent === 'perf-seo' && data.summary?.median?.performance < 90) {
      tasks.push(createTask(
        generateTaskId(),
        'Improve homepage performance score',
        'perf-seo',
        'high',
        {
          url: data.url || 'https://bitcoinsovereign.academy',
          repo: '.',
          thresholds: { performance: 90, lcp_ms: 2500 }
        },
        [
          'Performance score >= 90',
          'LCP < 2.5s',
          'No CLS regressions',
          'Quality Gates pass'
        ]
      ));
    }

    // Accessibility findings
    if (agent === 'a11y' && data.summary?.byImpact?.critical > 0) {
      tasks.push(createTask(
        generateTaskId(),
        `Fix ${data.summary.byImpact.critical} critical accessibility violations`,
        'a11y',
        'critical',
        {
          url: data.url || 'https://bitcoinsovereign.academy',
          repo: '.'
        },
        [
          'Zero critical accessibility violations',
          'Axe audit passes',
          'Quality Gates pass'
        ]
      ));
    }

    // Readability findings
    if (agent === 'content' && data.analysis?.scores?.fleschKincaidGrade > data.targetGrade) {
      tasks.push(createTask(
        generateTaskId(),
        'Simplify content to target reading level',
        'content',
        'medium',
        {
          source: data.source,
          targetGrade: data.targetGrade,
          currentGrade: data.analysis.scores.fleschKincaidGrade
        },
        [
          `Flesch-Kincaid grade <= ${data.targetGrade}`,
          'Maintain technical accuracy',
          'Quality Gates pass'
        ]
      ));
    }
  });

  return tasks;
}

async function main() {
  const config = parseArgs();

  if (config.mode !== 'plan') {
    console.log(`[planner] Mode '${config.mode}' not implemented, skipping`);
    return;
  }

  console.log(`\n📋 Planner Agent ${config.dryRun ? '(DRY RUN)' : ''}\n`);

  await ensureDirs();

  // Collect data
  console.log('Collecting findings from agent reports...');
  const findings = await collectFindings(config.since);
  console.log(`Found ${findings.length} report(s)\n`);

  console.log('Checking GitHub issues...');
  const issues = await getOpenIssues();
  console.log(`Found ${issues.length} open issue(s)\n`);

  // Load existing tasks
  const existingTasks = await getExistingTasks();
  console.log(`${existingTasks.length} existing task(s) in contracts/\n`);

  // Generate tasks from findings
  const potentialTasks = extractTasksFromFindings(findings);
  console.log(`Generated ${potentialTasks.length} potential task(s) from findings`);

  // Deduplicate
  const newTasks = deduplicateTasks(potentialTasks, existingTasks);
  console.log(`${newTasks.length} unique task(s) after deduplication\n`);

  // Create digest
  const digest = {
    agent: 'planner',
    ranAt: new Date().toISOString(),
    mode: config.mode,
    dryRun: config.dryRun,
    stats: {
      findingsProcessed: findings.length,
      issuesChecked: issues.length,
      existingTasks: existingTasks.length,
      potentialTasks: potentialTasks.length,
      newTasks: newTasks.length
    },
    newTasks: newTasks.map(t => t.id),
    notes: []
  };

  // Save tasks (unless dry run)
  if (!config.dryRun) {
    for (const task of newTasks) {
      const taskPath = join(CONTRACTS_DIR, `${task.id}.json`);
      await fs.writeFile(taskPath, JSON.stringify(task, null, 2));
      console.log(`✅ Created task: ${task.id} - ${task.title}`);
    }
  } else {
    newTasks.forEach(task => {
      console.log(`[DRY RUN] Would create: ${task.id} - ${task.title}`);
    });
  }

  // Save digest
  const digestPath = join(DIGEST_DIR, `planner-${Date.now()}.json`);
  await fs.writeFile(digestPath, JSON.stringify(digest, null, 2));
  console.log(`\n📊 Digest saved to ${digestPath}`);

  if (newTasks.length === 0) {
    console.log('\n✨ No new tasks needed - all findings already covered!');
  }
}

main().catch((error) => {
  console.error('[planner] Fatal error:', error);
  process.exitCode = 1;
});
