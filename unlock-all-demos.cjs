#!/usr/bin/env node
/**
 * Unlock ALL interactive demos by removing PREVIEW MODE LOCK scripts
 * This creates a fully open version for development/testing
 */

const fs = require('fs');
const path = require('path');

const LOCK_PATTERN = /<script>\s*\/\/ 🔒 PREVIEW MODE LOCK[\s\S]*?<\/script>/gi;

function unlockDemo(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if locked
  if (!content.includes('PREVIEW MODE LOCK')) {
    console.log(`⏭️  Already unlocked: ${filePath}`);
    return false;
  }

  // Remove lock script
  const unlockedContent = content.replace(LOCK_PATTERN, '');

  if (unlockedContent === content) {
    console.log(`⚠️  Could not find lock pattern in: ${filePath}`);
    return false;
  }

  fs.writeFileSync(filePath, unlockedContent, 'utf8');
  console.log(`🔓 Unlocked: ${filePath}`);
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
  console.log('🔓 Bitcoin Sovereign Academy - Demo UNLOCKING Script\n');
  console.log('This will remove ALL preview mode locks from interactive demos.\n');

  const allDemos = getAllDemoFiles();

  console.log(`🔓 Unlocking ${allDemos.length} demos:\n`);

  let unlocked = 0;
  let skipped = 0;
  let errors = 0;

  for (const demo of allDemos) {
    try {
      if (unlockDemo(demo.path)) {
        unlocked++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`❌ Error unlocking ${demo.path}:`, err.message);
      errors++;
    }
  }

  console.log('');
  console.log('─'.repeat(50));
  console.log(`✅ Summary:`);
  console.log(`   🔓 Unlocked: ${unlocked}`);
  console.log(`   ⏭️  Skipped (already unlocked): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total demos: ${allDemos.length}`);
  console.log('─'.repeat(50));

  if (errors > 0) {
    process.exit(1);
  }
}

main();
