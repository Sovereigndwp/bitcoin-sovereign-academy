import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const moduleGateSource = await readFile(path.join(repoRoot, 'js', 'module-gate.js'), 'utf8');

async function createDom(moduleRelativePath, options = {}) {
    const {
        unlockParam = null,
        preloadFullAccess = false,
        stripScripts = true
    } = options;

    const filePath = path.join(repoRoot, moduleRelativePath);
    let html = await readFile(filePath, 'utf8');

    if (stripScripts) {
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    const pathname = '/' + moduleRelativePath.split(path.sep).join('/');
    const url = `https://example.com${pathname}${unlockParam ? `?unlock=${unlockParam}` : ''}`;

    const dom = new JSDOM(html, {
        url,
        runScripts: 'outside-only',
        pretendToBeVisual: true
    });

    if (preloadFullAccess) {
        dom.window.localStorage.setItem('bsa_full_access', 'yes');
    }

    dom.window.eval(moduleGateSource);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));

    return dom;
}

test('keeps flagship module fully open for preview', async () => {
    const dom = await createDom('paths/curious/stage-1/module-1.html');
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    assert.equal(overlay, null, 'No overlay should appear on the flagship preview module');
});

test('gates follow-up modules after preview limit', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html');
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    const lockedZone = dom.window.document.querySelector('.module-locked-zone');

    assert.ok(overlay, 'Overlay prompts the learner to unlock the module');
    assert.ok(lockedZone, 'Locked zone wraps gated content');
    assert.ok(
        lockedZone.querySelectorAll('.content-section').length >= 1,
        'Gated zone contains the remaining sections'
    );
});

test('respects unlock query parameter', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html', { unlockParam: 'true' });
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    assert.equal(overlay, null, 'Unlock parameter should bypass gating');
});

test('respects stored full-access flag', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html', { preloadFullAccess: true });
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    assert.equal(overlay, null, 'Existing access flag should disable gating');
});

test('exposes helper API for manual toggling', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html', { stripScripts: false });

    assert.ok(dom.window.BSAModuleGate, 'Helper API is available on window');

    const originalConsoleError = console.error;

    try {
        console.error = (message, ...rest) => {
            if (typeof message === 'string' && message.includes('Not implemented: navigation')) {
                return;
            }
            originalConsoleError(message, ...rest);
        };

        try {
            dom.window.BSAModuleGate.unlock();
        } catch (error) {
            if (!String(error?.message).includes('Not implemented')) {
                throw error;
            }
        }
        assert.equal(dom.window.localStorage.getItem('bsa_full_access'), 'yes', 'Unlock helper stores flag');

        try {
            dom.window.BSAModuleGate.reset();
        } catch (error) {
            if (!String(error?.message).includes('Not implemented')) {
                throw error;
            }
        }
        assert.equal(dom.window.localStorage.getItem('bsa_full_access'), null, 'Reset helper clears flag');
    } finally {
        console.error = originalConsoleError;
    }
});
