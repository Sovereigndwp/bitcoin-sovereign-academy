// Configuration for scripts/check-defunct-services.mjs
//
// Source of truth for the human-readable catalog: docs/SERVICE_STATUS.md
// Keep this file and SERVICE_STATUS.md in sync — if you retire/restore a service,
// update both in the same commit.

// Each rule flags references to a retired service when no historical-context phrase
// appears within ±CONTEXT_WINDOW chars of the match (see check-defunct-services.mjs).
//
// `pattern` MUST be /g (global) and SHOULD be /gi (case-insensitive).
// `name` is the human-readable label shown in error output.
// `reason` is the short status statement; keep under ~120 chars.

export const RULES = [
  {
    name: 'Samourai Wallet',
    pattern: /\bsamourai\b/gi,
    reason: 'US DOJ seized servers and indicted founders, 2024-04-24. App and Whirlpool coordinator are not operating.',
  },
  {
    name: 'Whirlpool (Samourai CoinJoin)',
    pattern: /\bwhirlpool\b/gi,
    reason: 'Coordinator went dark with the Samourai DOJ seizure on 2024-04-24. Sparrow 1.9.0 removed integration the same evening.',
  },
  {
    name: 'zkSNACKs (Wasabi coordinator)',
    pattern: /\bzksnacks\b/gi,
    reason: 'zkSNACKs Ltd shut down the Wasabi coordinator on 2024-06-01 citing sanctions-compliance risk.',
  },
  {
    name: 'Caravan (Unchained)',
    pattern: /\bcaravan\b/gi,
    reason: 'Archived by Unchained Capital. Use Sparrow / Specter / Electrum / Nunchuk for new multisig setups.',
  },
  {
    name: 'Paxful',
    pattern: /\bpaxful\b/gi,
    reason: 'Original Paxful Inc. shut down 2023-04. Successor under new ownership; treat brand cautiously.',
  },
  {
    name: 'FTX',
    pattern: /\bftx\b/gi,
    reason: 'Filed Chapter 11 in 2022-11. Founders convicted of fraud. Historical-only.',
  },
  {
    name: 'Celsius',
    pattern: /\bcelsius\b/gi,
    reason: 'Filed Chapter 11 in 2022-07. Wind-down ongoing. Historical-only.',
  },
  {
    name: 'Voyager',
    pattern: /\bvoyager\b/gi,
    reason: 'Filed Chapter 11 in 2022-07; assets liquidated. Historical-only.',
  },
  {
    name: 'BlockFi',
    pattern: /\bblockfi\b/gi,
    reason: 'Filed Chapter 11 in 2022-11 in the FTX contagion. Historical-only.',
  },
  {
    name: 'Mt. Gox',
    pattern: /\bmt\.?\s*gox\b|\bmtgox\b/gi,
    reason: 'Collapsed 2014-02. Trustee distribution still ongoing. Historical-only.',
  },
  {
    name: 'QuadrigaCX',
    pattern: /\bquadriga(cx)?\b/gi,
    reason: 'Collapsed 2019-01; ~$190M CAD unrecoverable. Historical-only.',
  },
];

// If any of these phrases appears within ±CONTEXT_WINDOW chars of a match (case-insensitive),
// the match is treated as historical/educational context and passes the lint.
//
// Keep the list narrow: phrases here should clearly signal "this service is retired or
// being discussed historically." Generic words ("exchange", "wallet") would let everything pass.
export const CONTEXT_PHRASES = [
  // status verbs
  'shut down', 'shutdown', 'shut-down',
  'seized', 'seizure',
  'archived', 'archive',
  'discontinued',
  'collapsed', 'collapse',
  'bankrupt',
  'closed down',
  'wind-down', 'wound down',
  'no longer',
  'historical',
  'historic',
  'retired',
  'defunct',
  'failed',
  // legal events
  'doj',
  'indict',
  'convicted',
  'arrested',
  'charges',
  'lawsuit',
  'chapter 11',
  // descriptive (only triggered alongside service name)
  'cautionary',
  'lessons from',
  'security flaws',
  'lost funds',
  'stolen funds',
  'pioneered',
  'was a',
  'were shut',
  'hack',
  'removed in',          // "Whirlpool integration was removed in Sparrow 1.9.0"
  'removed from',
  'counterparty risk',   // common educational framing for FTX-style failures
  'starkest example',    // "FTX being the starkest example"
  'horror stories',      // "Exchange horror stories (Mt. Gox, FTX)"
  'off exchanges',       // "Get your Bitcoin off exchanges"
  // year-anchored
  'shut down 2024',
  'shut down april 2024',
  'shut down june 2024',
  'shut down 2023',
  'shut down 2022',
  'collapse 2022',
  'collapse 2014',
  'collapse 2019',
  // explicit markers
  '(retired',
  '(historical',
  '(shut down',
  '(no longer',
  '(archived',
  '(bankrupt',
];

// Files entirely exempt from the lint.
// Use this for the catalog itself, audit reports, history modules where references are
// pervasive and intentional, and the lint's own files.
//
// Paths are POSIX-style relative to repo root.
export const FILE_ALLOWLIST = [
  // The catalog and the lint itself
  'docs/SERVICE_STATUS.md',
  'scripts/check-defunct-services.mjs',
  'scripts/check-defunct-services.config.mjs',
  // Audit reports — these legitimately discuss retired services in detail
  'reports/demo-audit-2026-04-24.md',
  'reports/demo-audit-custody.md',
  'reports/demo-audit-economics.md',
  'reports/demo-audit-protocol.md',
  'reports/tutor-evals-2026-04-24.md',
  // Roadmap files where the names appear as task labels
  'TASKS.md',
  // Canonical CoinJoin history module — references Samourai/Whirlpool throughout
  // with explicit "(shut down April 2024 — historical reference)" header at line 836.
  // The whole file is framed as a historical/educational deep-dive.
  'paths/sovereign/stage-2/module-2.html',
  // Bitcoin Sovereign Game — year-by-year historical simulation. Mt. Gox is part of
  // the game's 2013-2014 timeline; references are intentional and pedagogical.
  'interactive-demos/bitcoin-sovereign-game/index.html',
  'interactive-demos/bitcoin-sovereign-game/bitcoin-sovereign-game.js',
  // Multisig setup wizard "case studies" section — discusses historical exchange
  // failures (Mt. Gox, QuadrigaCX) as motivation for multisig.
  'interactive-demos/multisig-setup-wizard/index.html',
  // Bitcoin price timeline — literally a historical chart of price events including
  // the FTX collapse.
  'interactive-demos/bitcoin-price-timeline/index.html',
  // Standalone multisig security demo — case studies of historical exchange failures.
  'multisig-security-demo.html',
  // AI agent training data: year-keyed event lists (Mt. Gox launches, etc.) used to
  // populate historical visualizations.
  'ai-agents/ai-agents-extended.js',
  // Tutor eval rubric — includes "FTX, Mt Gox precedent" as part of accuracy criteria.
  'scripts/tutor-evals.mjs',
  // Hurried-path planning docs — list Mt. Gox/FTX/Celsius as "why self-custody" examples.
  'paths/hurried/ACTION_TEMPLATE.md',
  'paths/hurried/MODULE_STATUS.md',
];

// Globs / directory prefixes to skip entirely. Anything under these paths is not scanned.
export const SKIP_DIRS = [
  'node_modules',
  '.git',
  '.lighthouseci',
  '.vercel',
  'Bitcoin Sovereign Academy - Learn Bitcoin, Achieve Sovereignty_files',
];

// File extensions to scan.
export const INCLUDE_EXTENSIONS = ['.html', '.js', '.mjs', '.cjs', '.md'];

// Search window (in chars) on each side of a match for context phrases.
export const CONTEXT_WINDOW = 300;
