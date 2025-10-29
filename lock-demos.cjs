#!/usr/bin/env node
/**
 * Lock all interactive demos except the specified unlocked list
 */

const fs = require('fs');
const path = require('path');

const UNLOCKED_DEMOS = [
  'account-freeze-locked-out',
  'building-the-chain-demo',
  'double-spending-demo',
  'money-properties-comparison',
  'network-consensus-demo'
];

const LOCK_SCRIPT = `
<script>
// 🔒 PREVIEW MODE LOCK
(function() {
  const isDev = new URLSearchParams(window.location.search).get('unlock') === 'all' ||
                localStorage.getItem('devUnlockAll') === 'true';
  if (!isDev) {
    document.body.innerHTML = \`
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#000;color:#fff;text-align:center;font-family:system-ui;padding:20px;">
        <div style="max-width:500px;">
          <h1 style="font-size:3rem;margin:0 0 16px;">🔒</h1>
          <h2 style="margin:0 0 12px;font-size:1.8rem;">This Demo is Locked</h2>
          <p style="color:#aaa;font-size:1.1rem;line-height:1.6;">Available in the full release of Bitcoin Sovereign Academy</p>
          <a href="/" style="display:inline-block;margin-top:24px;color:#f7931a;text-decoration:none;font-weight:600;font-size:1.1rem;padding:12px 24px;border:2px solid #f7931a;border-radius:8px;transition:all 0.2s;">← Back to Home</a>
        </div>
      </div>
    \`;
    document.title = '🔒 Demo Locked';
  }
})();
</script>
`;

function lockDemo(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if already locked
  if (content.includes('PREVIEW MODE LOCK')) {
    console.log(`⏭️  Already locked: ${filePath}`);
    return false;
  }

  // Insert lock script right after <body> tag
  const bodyTagRegex = /(<body[^>]*>)/i;

  if (!bodyTagRegex.test(content)) {
    console.log(`⚠️  No <body> tag found in: ${filePath}`);
    return false;
  }

  const lockedContent = content.replace(bodyTagRegex, `$1\n${LOCK_SCRIPT}`);
  fs.writeFileSync(filePath, lockedContent, 'utf8');
  console.log(`🔒 Locked: ${filePath}`);
  return true;
}

function getAllDemoFiles() {
  const demosDir = path.join(__dirname, 'interactive-demos');
  const demos = [];

  // Get all subdirectories
  const entries = fs.readdirSync(demosDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(demosDir, entry.name, 'index.html');
      if (fs.existsSync(indexPath)) {
        demos.push({ name: entry.name, path: indexPath });
      }
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const demoName = entry.name.replace('.html', '');
      demos.push({ name: demoName, path: path.join(demosDir, entry.name) });
    }
  }

  return demos;
}

function main() {
  console.log('🔐 Bitcoin Sovereign Academy - Demo Locking Script\n');
  console.log(`✅ Unlocked demos (${UNLOCKED_DEMOS.length}):`);
  UNLOCKED_DEMOS.forEach(demo => console.log(`   - ${demo}`));
  console.log('');

  const allDemos = getAllDemoFiles();
  const demosToLock = allDemos.filter(demo => !UNLOCKED_DEMOS.includes(demo.name));

  console.log(`🔒 Locking ${demosToLock.length} demos:\n`);

  let locked = 0;
  let skipped = 0;
  let errors = 0;

  for (const demo of demosToLock) {
    try {
      if (lockDemo(demo.path)) {
        locked++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`❌ Error locking ${demo.path}:`, err.message);
      errors++;
    }
  }

  console.log('');
  console.log('─'.repeat(50));
  console.log(`✅ Summary:`);
  console.log(`   🔒 Locked: ${locked}`);
  console.log(`   ⏭️  Skipped (already locked): ${skipped}`);
  console.log(`   ✅ Unlocked (by choice): ${UNLOCKED_DEMOS.length}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total demos: ${allDemos.length}`);
  console.log('─'.repeat(50));

  if (errors > 0) {
    process.exit(1);
  }
}

main();
