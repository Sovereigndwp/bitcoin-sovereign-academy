#!/usr/bin/env node
/**
 * Flesch-Kincaid Readability Calculator
 *
 * Usage:
 *   node run-fk.js --url=https://example.com --output=./report.json
 *   node run-fk.js --text="Your content here" --output=./report.json
 *   node run-fk.js --file=./content.md --output=./report.json
 *
 * Options:
 *   --url         Target URL to analyze (fetches text content)
 *   --text        Direct text to analyze
 *   --file        Path to file containing text
 *   --output      JSON output path (optional)
 *   --selector    CSS selector for content (when using --url, default: body)
 *   --target      Target grade level (default: 8)
 */

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { dirname } from 'path';

function parseArgs() {
  const args = {};

  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    args[key] = value;
  });

  if (!args.url && !args.text && !args.file) {
    console.error('❌ Error: One of --url, --text, or --file is required');
    process.exit(1);
  }

  return {
    url: args.url,
    text: args.text,
    file: args.file,
    output: args.output,
    selector: args.selector || 'body',
    target: parseInt(args.target || '8', 10)
  };
}

async function fetchTextFromURL(url, selector) {
  console.log(`\n📄 Fetching content from ${url}...\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    const text = await page.locator(selector).innerText();

    await browser.close();
    return text;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function fetchTextFromFile(filePath) {
  console.log(`\n📄 Reading content from ${filePath}...\n`);
  return await fs.readFile(filePath, 'utf8');
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  // Count vowel groups
  const vowels = word.match(/[aeiouy]+/g);
  let syllables = vowels ? vowels.length : 1;

  // Adjust for silent e
  if (word.endsWith('e')) syllables--;

  // Minimum 1 syllable
  return Math.max(1, syllables);
}

function analyzeReadability(text) {
  // Clean text
  const cleanText = text
    .replace(/<[^>]*>/g, ' ') // Remove HTML
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();

  // Count sentences (approximation)
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;

  // Count words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Count syllables
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Calculate metrics
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;

  // Flesch Reading Ease: 206.835 - 1.015 × (total words / total sentences) - 84.6 × (total syllables / total words)
  const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  // Flesch-Kincaid Grade Level: 0.39 × (total words / total sentences) + 11.8 × (total syllables / total words) - 15.59
  const fleschKincaidGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;

  // Gunning Fog Index: 0.4 × [(words/sentences) + 100 × (complex words/words)]
  const complexWords = words.filter(w => countSyllables(w) >= 3).length;
  const gunningFog = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount));

  return {
    stats: {
      characters: cleanText.length,
      words: wordCount,
      sentences: sentenceCount,
      syllables: totalSyllables,
      complexWords,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100
    },
    scores: {
      fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
      fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
      gunningFog: Math.round(gunningFog * 10) / 10
    },
    interpretation: interpretScores(fleschReadingEase, fleschKincaidGrade)
  };
}

function interpretScores(ease, grade) {
  let easeLevel = '';
  if (ease >= 90) easeLevel = 'Very Easy (5th grade)';
  else if (ease >= 80) easeLevel = 'Easy (6th grade)';
  else if (ease >= 70) easeLevel = 'Fairly Easy (7th grade)';
  else if (ease >= 60) easeLevel = 'Standard (8th-9th grade)';
  else if (ease >= 50) easeLevel = 'Fairly Difficult (10th-12th grade)';
  else if (ease >= 30) easeLevel = 'Difficult (College)';
  else easeLevel = 'Very Difficult (College graduate)';

  let gradeLevel = '';
  if (grade <= 6) gradeLevel = 'Elementary';
  else if (grade <= 8) gradeLevel = 'Middle School';
  else if (grade <= 12) gradeLevel = 'High School';
  else if (grade <= 16) gradeLevel = 'College';
  else gradeLevel = 'Graduate';

  return {
    readingEase: easeLevel,
    gradeLevel: `${gradeLevel} (Grade ${Math.round(grade)})`
  };
}

async function saveOutput(results, outputPath) {
  if (!outputPath) return;

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Results saved to ${outputPath}`);
}

function printSummary(results, targetGrade) {
  const { stats, scores, interpretation } = results;

  console.log('\n📊 Readability Analysis:');
  console.log(`  Words: ${stats.words}`);
  console.log(`  Sentences: ${stats.sentences}`);
  console.log(`  Avg words/sentence: ${stats.avgWordsPerSentence}`);
  console.log(`  Complex words: ${stats.complexWords} (${Math.round(stats.complexWords / stats.words * 100)}%)`);

  console.log('\n📈 Scores:');
  console.log(`  Flesch Reading Ease: ${scores.fleschReadingEase}/100`);
  console.log(`    → ${interpretation.readingEase}`);
  console.log(`  Flesch-Kincaid Grade: ${scores.fleschKincaidGrade}`);
  console.log(`    → ${interpretation.gradeLevel}`);
  console.log(`  Gunning Fog Index: ${scores.gunningFog}`);

  // Check against target
  const meetsTarget = scores.fleschKincaidGrade <= targetGrade;
  const emoji = meetsTarget ? '✅' : '⚠️';
  console.log(`\n${emoji} Target: Grade ${targetGrade} or below`);
  if (!meetsTarget) {
    const diff = Math.round((scores.fleschKincaidGrade - targetGrade) * 10) / 10;
    console.log(`  Current content is ${diff} grade levels above target`);
  }
}

async function main() {
  try {
    const config = parseArgs();

    let text = '';

    if (config.url) {
      text = await fetchTextFromURL(config.url, config.selector);
    } else if (config.file) {
      text = await fetchTextFromFile(config.file);
    } else {
      text = config.text;
    }

    const results = {
      success: true,
      source: config.url || config.file || 'direct-input',
      timestamp: new Date().toISOString(),
      analysis: analyzeReadability(text),
      targetGrade: config.target,
      meetsTarget: analyzeReadability(text).scores.fleschKincaidGrade <= config.target
    };

    if (config.output) {
      await saveOutput(results, config.output);
    }

    printSummary(results.analysis, config.target);

    // Exit with error if target not met
    if (!results.meetsTarget) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
