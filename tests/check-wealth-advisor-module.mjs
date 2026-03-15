import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node tests/check-wealth-advisor-module.mjs <module-file>');
  process.exit(1);
}

const filePath = path.isAbsolute(inputPath) ? inputPath : path.resolve(repoRoot, inputPath);
const html = await readFile(filePath, 'utf8');

function resolveRelativeModule(href) {
  if (!href || href.startsWith('http') || href.startsWith('/')) return null;
  return path.resolve(path.dirname(filePath), href);
}

function click(el, window) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

const dom = new JSDOM(html, {
  url: `https://example.com/${path.relative(repoRoot, filePath).split(path.sep).join('/')}`,
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.alert = () => {};
    window.confirm = () => true;
    window.open = () => null;
  }
});

await new Promise(resolve => dom.window.setTimeout(resolve, 0));

const { document, localStorage } = dom.window;

assert.ok(document.querySelector('h1'), 'missing h1');

const prevLink = document.querySelector('.nav-section a.nav-btn.secondary');
if (prevLink) {
  const prevFile = resolveRelativeModule(prevLink.getAttribute('href'));
  if (prevFile) {
    const prevContent = await readFile(prevFile, 'utf8');
    assert.ok(prevContent.includes('<!DOCTYPE html>'), 'previous link target missing');
  }
}

if (typeof dom.window.moduleSmokeTest === 'function') {
  assert.equal(dom.window.moduleSmokeTest(), true, 'tool smoke test failed');
}

const questionGroups = [...document.querySelectorAll('.options[data-question]')];
const checkAnswers = document.getElementById('checkAnswers');

if (questionGroups.length && checkAnswers) {
  for (const group of questionGroups) {
    const correctOption = group.querySelector('[data-correct="true"]');
    assert.ok(correctOption, 'missing correct answer');
    click(correctOption, dom.window);
  }

  assert.equal(checkAnswers.disabled, false, 'check answers should enable after all questions are answered');
  click(checkAnswers, dom.window);

  const nextModule = document.getElementById('nextModule');
  if (nextModule) {
    if (nextModule.tagName === 'A') {
      assert.ok(!nextModule.classList.contains('disabled'), 'next link did not unlock');
      const nextFile = resolveRelativeModule(nextModule.getAttribute('href'));
      if (nextFile) {
        const nextContent = await readFile(nextFile, 'utf8');
        assert.ok(nextContent.includes('<!DOCTYPE html>'), 'next link target missing');
      }
    } else if (nextModule.tagName === 'BUTTON') {
      assert.equal(nextModule.disabled, false, 'next button did not unlock');
    }
  }

  const moduleNumber = Number(path.basename(filePath).match(/module-(\d+)/)?.[1]);
  if (moduleNumber >= 1 && moduleNumber <= 12) {
    const progressState = JSON.parse(localStorage.getItem('bitcoinAdvisorProgress') || '{}');
    assert.equal(progressState.modules?.[moduleNumber]?.completed, true, 'module completion did not persist');
  }
} else if (path.basename(filePath).includes('module-13-')) {
  assert.equal(typeof dom.window.completeProgram, 'function', 'missing completion handler');
}

console.log(`Validated ${path.relative(repoRoot, filePath)}`);
