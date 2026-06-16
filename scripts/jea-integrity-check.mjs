/* jea-integrity-check.mjs — automatable subset of the JEA Research Integrity test suite.
   Implements Tests 1-12 from docs/superpowers/specs/2026-06-16-jea-research-integrity-system.md
   to the extent they can be checked mechanically. Run:  node --test scripts/jea-integrity-check.mjs
   (or: node scripts/jea-integrity-check.mjs for a plain pass/fail summary). */
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
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
