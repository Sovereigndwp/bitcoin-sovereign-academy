#!/usr/bin/env node
/**
 * Simple Asset Bundler
 * Combines and minifies JS/CSS files for production
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Minification functions (basic)
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around delimiters
    .replace(/;}/g, '}') // Remove last semicolon
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}();,=:])\s*/g, '$1') // Remove space around operators
    .trim();
}

async function bundleCSS() {
  console.log('📦 Bundling CSS files...');

  const cssFiles = [
    'frontend/public/css/style-enhanced.css',
    'frontend/public/css/ai-agents.css'
  ];

  let bundledCSS = '/* Bitcoin Sovereign Academy - Bundled Styles */\n';

  for (const file of cssFiles) {
    try {
      const filePath = join(ROOT, file);
      const content = await fs.readFile(filePath, 'utf8');
      bundledCSS += `\n/* ${file} */\n${content}\n`;
    } catch (error) {
      console.warn(`⚠️  Could not read ${file}:`, error.message);
    }
  }

  // Minify
  const minified = minifyCSS(bundledCSS);

  // Save bundles
  const bundleDir = join(ROOT, 'frontend/public/dist');
  await fs.mkdir(bundleDir, { recursive: true });

  await fs.writeFile(join(bundleDir, 'styles.bundle.css'), bundledCSS);
  await fs.writeFile(join(bundleDir, 'styles.bundle.min.css'), minified);

  const originalSize = Buffer.byteLength(bundledCSS);
  const minifiedSize = Buffer.byteLength(minified);
  const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

  console.log(`✅ CSS bundled: ${originalSize} bytes → ${minifiedSize} bytes (${savings}% savings)`);
}

async function bundleJS() {
  console.log('📦 Bundling JS files...');

  const jsFiles = [
    'frontend/public/js/app.js',
    'frontend/public/js/mcp-client.js',
    'frontend/public/js/ui-components.js',
    'frontend/public/js/ui-state.js',
    'frontend/public/js/journey.js',
    'frontend/public/js/bitcoin-agents.js'
  ];

  let bundledJS = '/* Bitcoin Sovereign Academy - Bundled Scripts */\n';
  bundledJS += '(function() {\n"use strict";\n';

  for (const file of jsFiles) {
    try {
      const filePath = join(ROOT, file);
      const content = await fs.readFile(filePath, 'utf8');
      bundledJS += `\n/* ${file} */\n${content}\n`;
    } catch (error) {
      console.warn(`⚠️  Could not read ${file}:`, error.message);
    }
  }

  bundledJS += '\n})();';

  // Minify (basic)
  const minified = minifyJS(bundledJS);

  // Save bundles
  const bundleDir = join(ROOT, 'frontend/public/dist');
  await fs.mkdir(bundleDir, { recursive: true });

  await fs.writeFile(join(bundleDir, 'app.bundle.js'), bundledJS);
  await fs.writeFile(join(bundleDir, 'app.bundle.min.js'), minified);

  const originalSize = Buffer.byteLength(bundledJS);
  const minifiedSize = Buffer.byteLength(minified);
  const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

  console.log(`✅ JS bundled: ${originalSize} bytes → ${minifiedSize} bytes (${savings}% savings)`);
}

async function generateReport() {
  console.log('\n📊 Bundle Report:\n');

  const files = [
    'frontend/public/dist/styles.bundle.min.css',
    'frontend/public/dist/app.bundle.min.js'
  ];

  let totalSize = 0;

  for (const file of files) {
    try {
      const filePath = join(ROOT, file);
      const stats = await fs.stat(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      console.log(`  ${file.split('/').pop()}: ${sizeKB} KB`);
    } catch (error) {
      // File doesn't exist yet
    }
  }

  console.log(`\n  Total bundle size: ${(totalSize / 1024).toFixed(2)} KB\n`);
}

async function main() {
  console.log('🚀 Asset Bundler for Bitcoin Sovereign Academy\n');

  try {
    await bundleCSS();
    await bundleJS();
    await generateReport();

    console.log('✨ Bundling complete!\n');
    console.log('Next steps:');
    console.log('  1. Update index.html to use bundle files:');
    console.log('     <link rel="stylesheet" href="dist/styles.bundle.min.css">');
    console.log('     <script src="dist/app.bundle.min.js"></script>');
    console.log('  2. Test the bundled version');
    console.log('  3. Deploy to production\n');

  } catch (error) {
    console.error('❌ Bundling failed:', error);
    process.exit(1);
  }
}

main();
