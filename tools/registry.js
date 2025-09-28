/**
 * Content Registry - Deduplication System
 * Fingerprints lessons and prevents duplicate content
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Generate SHA-256 fingerprint of text content
 */
export function fingerprint(text) {
  // Normalize text for comparison
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
  
  return crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex');
}

/**
 * Extract meaningful content from markdown
 */
export function extractContent(markdown) {
  // Remove frontmatter
  const content = markdown.replace(/^---[\s\S]*?---\n/, '');
  
  // Remove code blocks for comparison (keep structure)
  const noCode = content.replace(/```[\s\S]*?```/g, '[CODE_BLOCK]');
  
  // Remove links but keep text
  const noLinks = noCode.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  return noLinks;
}

/**
 * Build registry of unique content
 */
export function buildRegistry(globs) {
  const files = [];
  
  // Collect all markdown files
  for (const glob of globs) {
    if (fs.existsSync(glob)) {
      if (fs.statSync(glob).isDirectory()) {
        const dirFiles = fs.readdirSync(glob, { recursive: true })
          .filter(f => f.endsWith('.md'))
          .map(f => path.join(glob, f));
        files.push(...dirFiles);
      } else {
        files.push(glob);
      }
    }
  }
  
  const registry = new Map();
  const duplicates = [];
  const keep = [];
  
  for (const filepath of files) {
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const extracted = extractContent(content);
      const hash = fingerprint(extracted);
      
      if (registry.has(hash)) {
        // Found duplicate
        duplicates.push({
          file: filepath,
          original: registry.get(hash),
          hash
        });
      } else {
        // First occurrence
        registry.set(hash, filepath);
        keep.push({
          file: filepath,
          hash,
          size: content.length
        });
      }
    } catch (err) {
      console.warn(`Could not process ${filepath}:`, err.message);
    }
  }
  
  return {
    keep,
    duplicates,
    stats: {
      total: files.length,
      unique: keep.length,
      duplicated: duplicates.length,
      savings: duplicates.length > 0 
        ? `${((duplicates.length / files.length) * 100).toFixed(1)}%`
        : '0%'
    }
  };
}

/**
 * Check for near-duplicates (similar but not identical)
 */
export function findSimilar(files, threshold = 0.8) {
  const similar = [];
  const contents = new Map();
  
  // Load all contents
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      contents.set(file, extractContent(content));
    } catch (err) {
      // Skip unreadable files
    }
  }
  
  // Compare pairs (naive O(n²) - could optimize with LSH)
  const fileList = Array.from(contents.keys());
  for (let i = 0; i < fileList.length; i++) {
    for (let j = i + 1; j < fileList.length; j++) {
      const sim = similarity(
        contents.get(fileList[i]),
        contents.get(fileList[j])
      );
      
      if (sim >= threshold) {
        similar.push({
          file1: fileList[i],
          file2: fileList[j],
          similarity: (sim * 100).toFixed(1) + '%'
        });
      }
    }
  }
  
  return similar;
}

/**
 * Calculate Jaccard similarity between two texts
 */
function similarity(text1, text2) {
  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Generate deduplication report
 */
export function generateReport(registry) {
  const report = [];
  
  report.push('# Content Deduplication Report');
  report.push(`Generated: ${new Date().toISOString()}\n`);
  
  report.push('## Summary');
  report.push(`- Total files scanned: ${registry.stats.total}`);
  report.push(`- Unique content: ${registry.stats.unique}`);
  report.push(`- Duplicates found: ${registry.stats.duplicated}`);
  report.push(`- Space savings potential: ${registry.stats.savings}\n`);
  
  if (registry.duplicates.length > 0) {
    report.push('## Duplicates Found');
    for (const dup of registry.duplicates) {
      report.push(`\n### ${path.basename(dup.file)}`);
      report.push(`- **File**: \`${dup.file}\``);
      report.push(`- **Duplicate of**: \`${dup.original}\``);
      report.push(`- **Hash**: \`${dup.hash.slice(0, 8)}...\``);
    }
  }
  
  return report.join('\n');
}

// Export for use in scripts
export default {
  fingerprint,
  extractContent,
  buildRegistry,
  findSimilar,
  generateReport
};