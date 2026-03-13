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
        preloadAccessToken = false,
        verifyAccessToken = preloadAccessToken,
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

    if (preloadAccessToken) {
        const payload = Buffer.from(JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + 3600
        })).toString('base64url');
        dom.window.localStorage.setItem('bsa_access_token', `header.${payload}.signature`);
    }
    dom.window.fetch = async () => ({
        ok: verifyAccessToken,
        status: verifyAccessToken ? 200 : 401,
        json: async () => verifyAccessToken
            ? { authorized: true }
            : { authorized: false, reason: 'Invalid or expired token' }
    });

    dom.window.BSA_CONFIG = { ENABLE_MODULE_GATING: true };
    dom.window.eval(moduleGateSource);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
    await new Promise(resolve => dom.window.setTimeout(resolve, 0));

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

test('does not accept the legacy unlock query parameter', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html', { unlockParam: 'true' });
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    assert.ok(overlay, 'Legacy unlock parameter should not bypass gating');
});

test('does not accept the legacy stored full-access flag', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html', { preloadFullAccess: true });
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    assert.ok(overlay, 'Legacy full-access storage should not bypass gating');
    assert.equal(dom.window.localStorage.getItem('bsa_full_access'), null, 'Legacy full-access storage is cleared');
});

test('respects a valid access token', async () => {
    const dom = await createDom('paths/curious/stage-1/module-2.html', { preloadAccessToken: true });
    const overlay = dom.window.document.querySelector('.module-lock-overlay');
    assert.equal(overlay, null, 'A valid access token should bypass gating');
});

test('exposes helper API without restoring insecure unlocks', async () => {
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

        dom.window.localStorage.setItem('bsa_full_access', 'yes');

        try {
            dom.window.BSAModuleGate.reset();
        } catch (error) {
            if (!String(error?.message).includes('Not implemented')) {
                throw error;
            }
        }
        assert.equal(dom.window.localStorage.getItem('bsa_full_access'), null, 'Reset helper clears flag');
        assert.equal(typeof dom.window.BSAModuleGate.getStatus, 'function', 'Helper API exposes status inspection');
    } finally {
        console.error = originalConsoleError;
    }
});
