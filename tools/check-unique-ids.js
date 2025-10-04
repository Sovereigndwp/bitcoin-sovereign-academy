import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Recursively collect .html files from repo root (excluding node_modules/.git)
function listHtmlFiles(dir, acc = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const d of entries) {
    if (d.name === 'node_modules' || d.name === '.git' || d.name.startsWith('.')) continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) listHtmlFiles(p, acc);
    else if (d.isFile() && d.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const root = process.cwd();
const files = listHtmlFiles(root);
let bad = [];
for (const f of files) {
  let html = '';
  try { html = readFileSync(f, 'utf8'); } catch { continue; }
  const ids = [...html.matchAll(/id=\"([^\"]+)\"/g)].map(m => m[1]);
  const seen = new Set();
  const dups = new Set();
  for (const id of ids) {
    if (seen.has(id)) dups.add(id);
    else seen.add(id);
  }
  if (dups.size) bad.push({ file: f, dups: [...dups] });
}

if (bad.length) {
  console.error('Duplicate IDs found:');
  for (const b of bad) console.error(`- ${b.file}: ${b.dups.join(', ')}`);
  process.exit(1);
} else {
  console.log('No duplicate IDs found.');
}
