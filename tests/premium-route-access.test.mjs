import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_PREMIUM_PATH_IDS,
  buildPremiumRouteClaims,
  getPremiumRouteTierAccess
} from '../lib/premium-route-access.js';

test('apprentice tier expands to all premium curriculum routes', () => {
  const claims = buildPremiumRouteClaims({ tier: 'apprentice' });
  assert.equal(claims.tier, 'apprentice');
  assert.equal(claims.allPremium, true);
  assert.equal(claims.deepDives, true);
  assert.deepEqual(claims.pathIds, [...ALL_PREMIUM_PATH_IDS]);
});

test('sovereign tier keeps explicit sovereign identity with full curriculum access', () => {
  const claims = buildPremiumRouteClaims({ tier: 'sovereign' });
  assert.equal(claims.tier, 'sovereign');
  assert.equal(claims.allPremium, true);
  assert.equal(claims.deepDives, true);
  assert.deepEqual(claims.pathIds, [...ALL_PREMIUM_PATH_IDS]);
});

test('path tier remains path-scoped and does not unlock deep dives by default', () => {
  const claims = buildPremiumRouteClaims({ tier: 'path', pathIds: ['curious', 'builder'] });
  assert.equal(claims.tier, 'path');
  assert.equal(claims.allPremium, false);
  assert.equal(claims.deepDives, false);
  assert.deepEqual(claims.pathIds, ['curious', 'builder']);
});

test('developer tier maps to full premium access', () => {
  const access = getPremiumRouteTierAccess('developer');
  assert.equal(access.allPremium, true);
  assert.equal(access.deepDives, true);
  assert.deepEqual(access.pathIds, [...ALL_PREMIUM_PATH_IDS]);
});
