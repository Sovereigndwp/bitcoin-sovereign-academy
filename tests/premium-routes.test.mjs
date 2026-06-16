import test from 'node:test';
import assert from 'node:assert/strict';
import { getProtectedRouteDetails, isProtectedPremiumRoute, normalizePathname } from '../lib/premium-routes.js';

test('normalizes clean URLs and removes trailing slashes', () => {
  assert.equal(normalizePathname('/paths/curious/stage-2/module-1/'), '/paths/curious/stage-2/module-1');
  assert.equal(normalizePathname('deep-dives/'), '/deep-dives');
});

// Learning paths are free (education-first model, decided 2026-06-15) — revenue
// comes from kits + advisory, not from gating lessons. Every /paths/* route is open.
test('treats all learning-path content as free', () => {
  const free = [
    '/paths/curious/stage-1/module-1',
    '/paths/curious/stage-1/module-2',
    '/paths/curious/stage-1/module-2-5.html',
    '/paths/builder/stage-3',
    '/paths/principled/capstone/index.html',
    '/paths/curious/stage-1/deep-dives/fractional-reserve.html',
    '/paths/skeptic/stage-5/'
  ];
  for (const route of free) {
    const details = getProtectedRouteDetails(route);
    assert.equal(details.protected, false, `${route} should be free`);
    assert.equal(details.reason, 'paths-free', `${route} reason`);
  }
});

// The standalone deep-dives section remains the one premium content tier.
test('keeps the standalone deep-dives area premium', () => {
  assert.equal(isProtectedPremiumRoute('/deep-dives'), true);
  assert.equal(isProtectedPremiumRoute('/deep-dives/sovereign-tools/running-a-node.html'), true);
});
