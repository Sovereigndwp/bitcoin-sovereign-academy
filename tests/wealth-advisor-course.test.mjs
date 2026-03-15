import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const modulesDir = path.join(
  repoRoot,
  'institutional',
  'wealth-advisors',
  'bitcoin-advisor-certification',
  'modules'
);

function resolveRelativeModule(refFile, href) {
  if (!href || href.startsWith('http') || href.startsWith('/')) {
    return null;
  }
  return path.resolve(path.dirname(refFile), href);
}

async function createDom(filePath) {
  const html = await readFile(filePath, 'utf8');
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
  return { dom, html };
}

async function assertExistingRelativeLink(refFile, href, label) {
  const target = resolveRelativeModule(refFile, href);
  if (!target) return;
  const content = await readFile(target, 'utf8');
  assert.ok(content.includes('<!DOCTYPE html>'), `${label} target should exist: ${href}`);
}

function click(el, window) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

test('module files exist for the 13-module course', async () => {
  const files = (await readdir(modulesDir)).filter(name => name.endsWith('.html')).sort();
  assert.equal(files.length, 13);
});

const moduleFiles = (await readdir(modulesDir))
  .filter(name => name.endsWith('.html'))
  .sort();

for (const fileName of moduleFiles) {
  test(`module page: ${fileName}`, async () => {
    const filePath = path.join(modulesDir, fileName);
    const { dom, html } = await createDom(filePath);
    const { document, localStorage } = dom.window;

    assert.ok(document.querySelector('h1'), 'module should render a main heading');
    assert.ok(
      document.body.textContent.includes('Bitcoin in Wealth Advisory') ||
        document.body.textContent.includes('Bitcoin Advisor Certification'),
      'module should expose course branding'
    );

    const prevLink = document.querySelector('.nav-section a.nav-btn.secondary');
    if (prevLink) {
      await assertExistingRelativeLink(filePath, prevLink.getAttribute('href'), 'previous link');
    }

    if (typeof dom.window.moduleSmokeTest === 'function') {
      assert.equal(dom.window.moduleSmokeTest(), true, 'tool smoke test should pass');
    }

    const questionGroups = [...document.querySelectorAll('.options[data-question]')];
    const checkAnswers = document.getElementById('checkAnswers');

    if (questionGroups.length && checkAnswers) {
      for (const group of questionGroups) {
        const correctOption = group.querySelector('[data-correct="true"]');
        assert.ok(correctOption, 'assessment group should include a correct answer');
        click(correctOption, dom.window);
      }

      assert.equal(checkAnswers.disabled, false, 'answer button should enable after all questions are answered');
      click(checkAnswers, dom.window);

      const nextModule = document.getElementById('nextModule');
      if (nextModule) {
        if (nextModule.tagName === 'A') {
          assert.ok(!nextModule.classList.contains('disabled'), 'next link should unlock after passing assessment');
          await assertExistingRelativeLink(filePath, nextModule.getAttribute('href'), 'next link');
        } else if (nextModule.tagName === 'BUTTON') {
          assert.equal(nextModule.disabled, false, 'next button should unlock after passing assessment');
        }
      }

      const moduleNumber = Number(fileName.match(/module-(\d+)/)?.[1]);
      if (moduleNumber >= 1 && moduleNumber <= 12) {
        const progressState = JSON.parse(localStorage.getItem('bitcoinAdvisorProgress') || '{}');
        assert.equal(progressState.modules?.[moduleNumber]?.completed, true, 'module completion should persist');
      }
    } else if (fileName.includes('module-13-')) {
      assert.equal(typeof dom.window.completeProgram, 'function', 'module 13 should expose program completion handler');
      const nextHref = html.match(/module-12-building-advisory-practice\.html/);
      assert.ok(nextHref, 'module 13 should link back to module 12');
    }
  });
}
