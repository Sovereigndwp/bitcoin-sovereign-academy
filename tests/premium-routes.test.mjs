import test from 'node:test';
import assert from 'node:assert/strict';
import { getProtectedRouteDetails, isProtectedPremiumRoute, normalizePathname } from '../lib/premium-routes.js';

test('normalizes clean URLs and removes trailing slashes', () => {
  assert.equal(normalizePathname('/paths/curious/stage-2/module-1/'), '/paths/curious/stage-2/module-1');
  assert.equal(normalizePathname('deep-dives/'), '/deep-dives');
});

test('treats stage-1 module-1 as free preview content', () => {
  const details = getProtectedRouteDetails('/paths/curious/stage-1/module-1');
  assert.equal(details.protected, false);
  assert.equal(details.reason, 'stage-1-preview');
});

test('protects stage-1 follow-up modules including special module names', () => {
  assert.equal(isProtectedPremiumRoute('/paths/curious/stage-1/module-2'), true);
  assert.equal(isProtectedPremiumRoute('/paths/curious/stage-1/module-2-5.html'), true);
});

test('protects stage-2 and later path routes', () => {
  const details = getProtectedRouteDetails('/paths/builder/stage-3');
  assert.equal(details.protected, true);
  assert.equal(details.pathId, 'builder');
  assert.equal(details.reason, 'stage-2-plus');
});

test('protects explicit path outliers included in phase 1', () => {
  assert.equal(isProtectedPremiumRoute('/paths/curious/stage-1/deep-dives/fractional-reserve.html'), true);
  assert.equal(isProtectedPremiumRoute('/paths/principled/capstone/index.html'), true);
});

test('protects the deep-dives area', () => {
  assert.equal(isProtectedPremiumRoute('/deep-dives'), true);
  assert.equal(isProtectedPremiumRoute('/deep-dives/sovereign-tools/running-a-node.html'), true);
});
