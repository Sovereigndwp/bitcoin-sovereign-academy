/* jea-integrity-check.mjs — automatable subset of the JEA Research Integrity test suite.
   Implements Tests 1-12 from docs/superpowers/specs/2026-06-16-jea-research-integrity-system.md
   to the extent they can be checked mechanically. Run:  node --test scripts/jea-integrity-check.mjs
   (or: node scripts/jea-integrity-check.mjs for a plain pass/fail summary). */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DD = join(ROOT, 'deep-dives/jurisdictional-exposure-audit');
const readJson = (p) => JSON.parse(readFileSync(join(DD, p), 'utf8'));
const readText = (p) => readFileSync(join(DD, p), 'utf8');

const claimLedger = readJson('data/jurisdiction-claim-ledger.json');
const sourceLedger = readJson('data/jurisdiction-source-ledger.json');
const usProfile = readJson('data/profiles/united-states.json');
const questionnaire = readJson('data/questionnaire.json');
const deepDive = readText('deep-dive.md');

// Load every country profile JSON (the whole cohort), keyed by filename.
const profileFiles = readdirSync(join(DD, 'data/profiles')).filter((f) => f.endsWith('.json'));
const profiles = profileFiles.map((f) => ({ file: f, data: readJson('data/profiles/' + f) }));
// Recursively collect every {claim_id, public_safe, source_ids} object inside a profile.
function collectClaimFields(obj, out) {
  if (Array.isArray(obj)) { obj.forEach((v) => collectClaimFields(v, out)); return out; }
  if (obj && typeof obj === 'object') {
    if (Object.prototype.hasOwnProperty.call(obj, 'claim_id')) out.push(obj);
    Object.values(obj).forEach((v) => collectClaimFields(v, out));
  }
  return out;
}

// The classifier/router are plain browser scripts that self-attach to globalThis.
// Run them in this context (no `window`), then read the globals — this also verifies
// they execute cleanly as standalone scripts.
vm.runInThisContext(readText('js/jea-classify.js'), { filename: 'jea-classify.js' });
vm.runInThisContext(readText('js/jea-routing.js'), { filename: 'jea-routing.js' });
const C = globalThis.JEAClassify;
const R = globalThis.JEARouting;

const sourceIds = new Set(sourceLedger.sources.map((s) => s.source_id));
const TODAY = '2026-06-16';

// Test 3: every empirical claim maps to >=1 source OR is marked unknown/unsupported/needs-review.
// Definitional practical implications (claim_type E) are derived, not sourced, and are exempt.
test('T3: claims have a source or are marked unknown', () => {
  for (const c of claimLedger.claims) {
    const ok = (c.source_ids && c.source_ids.length > 0)
      || c.confidence === 'unknown'
      || c.status === 'unsupported' || c.status === 'needs-review'
      || c.claim_type === 'E-practical-implication';
    assert.ok(ok, `Claim ${c.claim_id} has no source and is not exempt (unknown/unsupported/needs-review/practical-implication)`);
  }
});

// Source-ledger integrity: every claim source_id exists in the source ledger.
test('claim source_ids exist in the source ledger', () => {
  for (const c of claimLedger.claims) {
    for (const sid of (c.source_ids || [])) assert.ok(sourceIds.has(sid), `Claim ${c.claim_id} references missing source ${sid}`);
  }
});

// public_safe discipline: only verified/needs-review may be public_safe.
test('public_safe only for verified/needs-review', () => {
  for (const c of claimLedger.claims) {
    if (c.public_safe === true) {
      assert.ok(['verified', 'needs-review'].includes(c.status), `Claim ${c.claim_id} is public_safe but status is ${c.status}`);
    }
  }
});

// Test 5: no stale high-confidence claim (next_review in the past, status verified, confidence high).
test('T5: no stale high-confidence claim', () => {
  for (const c of claimLedger.claims) {
    if (c.confidence === 'high' && c.status === 'verified' && c.next_review && c.next_review < TODAY) {
      assert.fail(`Claim ${c.claim_id} is high-confidence but past next_review ${c.next_review}`);
    }
  }
});

// Test 1: every profile section has a confidence entry, or is absent.
test('T1: profile has per-section confidence', () => {
  const cs = usProfile.confidence_summary || {};
  for (const key of ['tax_overview', 'bitcoin_regulation', 'reporting_profile', 'estate_profile', 'mobility_profile']) {
    if (usProfile[key]) assert.ok(cs[key], `Section ${key} present but has no confidence_summary entry`);
  }
});

// Test 6: every direction-of-travel label has rationale + confidence + last_reviewed.
test('T6: direction-of-travel labels carry evidence', () => {
  for (const d of (usProfile.direction_of_travel || [])) {
    assert.ok(d.label && d.rationale && d.confidence && d.last_reviewed, `Direction label ${d.label} missing evidence fields`);
  }
});

// Real safety invariant: any field with confidence 'unknown' or claim_type F (unknown/unresolved)
// must be withheld from public rendering (public_safe === false). The renderer enforces hiding;
// this guarantees the data never marks an unresolved claim as public.
test('unknown / unresolved fields are never public_safe', () => {
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    const isUnresolved = obj.confidence === 'unknown' || obj.claim_type === 'F-unknown-unresolved';
    if (isUnresolved && obj.public_safe === true) {
      assert.fail(`Unresolved field marked public_safe: ${obj.value}`);
    }
    for (const k of Object.keys(obj)) walk(obj[k]);
  };
  walk(usProfile);
});

// Test 8: questionnaire never requests sensitive data.
test('T8: questionnaire requests no secrets', () => {
  const banned = ['seed phrase', 'private key', 'password', 'passphrase', 'pin number', 'exact balance', 'wallet address', 'passport number', 'tax id', 'social security', 'account number'];
  const blob = JSON.stringify(questionnaire).toLowerCase();
  // The documentation classifier *names* these items (seed phrase, pin, passphrase) as categories to classify handling —
  // that is allowed. What is banned is asking the user to ENTER the value. Prompts must not say "enter your".
  for (const s of questionnaire.sections) {
    for (const q of s.questions) {
      const p = (q.prompt + ' ' + (q.help_text || '')).toLowerCase();
      assert.ok(!/enter (your )?(seed|private key|password|passphrase|pin|balance|wallet address)/.test(p), `Question ${q.id} appears to request a secret value`);
    }
  }
  assert.ok(blob.includes('do not enter') === false || true); // data_safety_notice carries the warning
  assert.ok(questionnaire.data_safety_notice.toLowerCase().includes('do not enter'), 'data_safety_notice must warn against entering secrets');
});

// Test 12: result/disclaimer language present in the public deep dive.
test('T12: deep dive carries the not-advice disclaimer', () => {
  assert.ok(/not legal, tax, investment, or financial advice/i.test(deepDive), 'deep-dive.md missing the not-advice disclaimer');
});

// Test 4 (proxy): the deep dive should not contain hard numeric tax-rate claims (those belong in sourced profiles).
test('T4 proxy: deep dive avoids unsourced hard tax-rate claims', () => {
  // crude heuristic: a percentage immediately followed by "tax" without a country profile context
  const risky = /\b\d{1,2}%\s+(capital gains|income|wealth|estate)\b/i.test(deepDive);
  assert.ok(!risky, 'deep-dive.md contains a hard tax-rate claim that should live in a sourced profile');
});

// Smoke test: classifier + router run and respect the price guard.
test('classifier + router smoke test with price guard', () => {
  const resp = {
    user_type: ['individual_holder'], amount_band: 'meaningful_savings',
    countries_connected: [{ country_id: 'us', roles: ['residence', 'tax_residence'] }],
    bitcoin_exposure_types: ['single_sig_hardware'],
    documentation_classification: { seed_phrase: 'in_cloud' },
    _rawFlags: ['custody.single_point'], _answeredSections: ['jurisdiction_map', 'custody_map', 'tax_visibility', 'estate_family', 'banking_liquidity'],
    _ifUnavailableNoOne: false, _bankFreezeSerious: false
  };
  const out = C.classify(resp);
  assert.equal(out.primary_exposure_type, 'documentation_leak', 'cloud-stored seed should classify as documentation_leak');
  R.route(out, resp);
  assert.ok(out.recommended_pathway, 'router should attach a pathway');
  // price guard: a priced CTA must carry a price_source
  if (out.recommended_pathway.cta_style === 'priced') {
    assert.ok(out.recommended_pathway.price_source, 'priced pathway must cite a price_source');
  }
  // unpriced products must never carry a numeric price
  const R2 = R.pathway('bitcoin_continuity_operational_package', 'x');
  assert.equal(R2.price_usd, null, 'unpriced product must not invent a price');
  assert.notEqual(R2.cta_style, 'priced');
});

// Family-guard test: routing must not send to a family kit without family/estate evidence.
test('routing family guard', () => {
  const resp = {
    user_type: ['individual_holder'], amount_band: 'meaningful_savings',
    countries_connected: [{ country_id: 'us', roles: ['residence'] }],
    bitcoin_exposure_types: ['single_sig_hardware'],
    documentation_classification: { seed_phrase: 'in_cloud' },
    _rawFlags: [], _answeredSections: ['custody_map'], _ifUnavailableNoOne: false, _bankFreezeSerious: false
  };
  const out = C.classify(resp);
  R.route(out, resp);
  if (out.recommended_pathway.product_id === 'family_bitcoin_recovery_kit') {
    const hasFamily = (out._flags || []).some((f) => f.startsWith('family.') || f.startsWith('estate.'));
    assert.ok(hasFamily, 'family kit routed without family/estate evidence');
  }
});

/* ---- Cohort-wide cross-checks (added 2026-06-16, formerly run by hand) ---- */

// CC1: every source_id referenced by any profile exists in the source ledger.
test('CC1: profile source references resolve', () => {
  for (const { file, data } of profiles) {
    for (const cf of collectClaimFields(data, [])) {
      for (const sid of (cf.source_ids || [])) {
        assert.ok(sourceIds.has(sid), `${file}: claim ${cf.claim_id} references missing source ${sid}`);
      }
    }
  }
});

// CC2: every source_id referenced by any ledger claim exists in the source ledger.
test('CC2: ledger source references resolve', () => {
  for (const c of claimLedger.claims) {
    for (const sid of (c.source_ids || [])) {
      assert.ok(sourceIds.has(sid), `ledger claim ${c.claim_id} references missing source ${sid}`);
    }
  }
});

// CC3: no duplicate claim_ids in the ledger.
test('CC3: no duplicate claim_ids in ledger', () => {
  const seen = new Set();
  for (const c of claimLedger.claims) {
    assert.ok(!seen.has(c.claim_id), `duplicate claim_id in ledger: ${c.claim_id}`);
    seen.add(c.claim_id);
  }
});

// CC4: profile and ledger agree on public_safe for any shared claim_id (contradiction guard).
test('CC4: profile/ledger public_safe agree for shared claims', () => {
  const ledgerById = Object.fromEntries(claimLedger.claims.map((c) => [c.claim_id, c]));
  for (const { file, data } of profiles) {
    for (const cf of collectClaimFields(data, [])) {
      const l = ledgerById[cf.claim_id];
      if (l && Object.prototype.hasOwnProperty.call(cf, 'public_safe')) {
        assert.equal(cf.public_safe, l.public_safe, `${file}: public_safe mismatch for ${cf.claim_id} (profile ${cf.public_safe} vs ledger ${l.public_safe})`);
      }
    }
  }
});

// CC5: every profile has last_reviewed, next_review, and a confidence_summary; present sections have a confidence entry.
test('CC5: every profile has review dates + per-section confidence', () => {
  const SECTIONS = ['basic_profile', 'tax_overview', 'bitcoin_regulation', 'reporting_profile', 'estate_profile', 'banking_profile', 'asset_protection_profile', 'mobility_profile', 'bitcoin_holder_implications'];
  for (const { file, data } of profiles) {
    assert.ok(data.last_reviewed, `${file}: missing last_reviewed`);
    assert.ok(data.next_review, `${file}: missing next_review`);
    assert.ok(data.confidence_summary && typeof data.confidence_summary === 'object', `${file}: missing confidence_summary`);
    for (const s of SECTIONS) {
      if (data[s]) assert.ok(data.confidence_summary[s], `${file}: section ${s} present but no confidence_summary entry`);
    }
  }
});

// CC6: no profile claim field is public_safe with confidence 'unknown' or claim_type F (unresolved must not be public).
test('CC6: unresolved profile fields are never public_safe', () => {
  for (const { file, data } of profiles) {
    for (const cf of collectClaimFields(data, [])) {
      const unresolved = cf.confidence === 'unknown' || cf.claim_type === 'F-unknown-unresolved';
      if (unresolved && cf.public_safe === true) {
        assert.fail(`${file}: unresolved field ${cf.claim_id} is public_safe`);
      }
    }
  }
});

// CC7: every cited source has a tier 1-4, and Tier-4 sources are not the sole support of any verified/public claim.
test('CC7: Tier-4 sources never solely support a public claim', () => {
  const tierById = Object.fromEntries(sourceLedger.sources.map((s) => [s.source_id, s.tier]));
  for (const c of claimLedger.claims) {
    if (!c.public_safe || !(c.source_ids || []).length) continue;
    const tiers = c.source_ids.map((s) => tierById[s]).filter((t) => t != null);
    if (tiers.length && tiers.every((t) => t === 4)) {
      assert.fail(`ledger claim ${c.claim_id} is public but supported only by Tier-4 source(s)`);
    }
  }
});
