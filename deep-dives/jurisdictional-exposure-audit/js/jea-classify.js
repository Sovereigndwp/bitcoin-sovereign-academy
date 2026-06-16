/* jea-classify.js — deterministic exposure classifier.
   Implements docs/superpowers/specs/2026-06-16-jea-classification-routing.md.
   No score. Reads flags + answers, returns a risk-output object.
   Works in the browser (window.JEAClassify) and in Node (module.exports). */
(function (root) {
  'use strict';

  // Recommended handling per documentation item, with the conditions that mark a leak or a gap.
  var DOC_RULES = {
    seed_phrase:            { secret: true,  leakIf: ['in_password_manager', 'in_cloud', 'written_in_one_place', 'with_a_person'], rec: 'Do not digitize; never share; keep offline.' },
    pin:                    { secret: true,  leakIf: ['in_cloud', 'with_a_person'], rec: 'Keep separate from device and backup.' },
    passphrase:             { secret: true,  leakIf: ['in_password_manager', 'in_cloud', 'written_in_one_place'], gapIf: ['only_in_my_head'], rec: 'Do not digitize; keep separate from the seed.' },
    device_location:        { leakIf: ['in_cloud'], gapIf: ['not_handled'], rec: 'Keep private; share the role, not the location.' },
    metal_backup_location:  { leakIf: ['in_cloud', 'written_in_one_place'], gapIf: ['only_in_my_head'], rec: 'Keep private; a trusted helper may know it exists, not its contents.' },
    wallet_type:            { gapIf: ['not_handled'], rec: 'Document clearly.' },
    exchange_names:         { gapIf: ['not_handled'], rec: 'Document clearly.' },
    custody_provider_name:  { gapIf: ['not_handled'], rec: 'Document clearly.' },
    xpub:                   { leakIf: ['in_cloud'], rec: 'Keep separate; do not publish (privacy).' },
    multisig_quorum:        { gapIf: ['not_handled'], rec: 'Document partially; discuss with a custody specialist.' },
    cosigner_names:         { gapIf: ['not_handled'], rec: 'Document partially; keep the contact path, not keys.' },
    emergency_contact:      { gapIf: ['not_handled'], rec: 'Document clearly.' },
    tax_records:            { gapIf: ['not_handled', 'only_in_my_head'], rec: 'Document clearly; discuss with a tax advisor.' },
    purchase_history:       { gapIf: ['not_handled'], rec: 'Document clearly.' },
    beneficiary_instructions:{ secret: false, leakIf: ['written_in_one_place'], gapIf: ['not_handled'], rec: 'Discuss with an attorney; keep separate from secrets.' },
    will_trust_reference:   { gapIf: ['not_handled'], rec: 'Discuss with an attorney.' },
    recovery_sequence:      { leakIf: ['written_in_one_place'], gapIf: ['only_in_my_head', 'not_handled'], rec: 'Document the sequence, never the secrets, in one safe place.' },
    trusted_helper_role:    { gapIf: ['not_handled'], rec: 'Document the role; brief the person.' },
    advisor_contact:        { gapIf: ['not_handled'], rec: 'Document clearly.' }
  };

  var CORE_SECTIONS = ['jurisdiction_map', 'custody_map', 'tax_visibility', 'estate_family', 'banking_liquidity'];

  function collectFlags(resp) {
    var flags = {};
    (resp._rawFlags || []).forEach(function (f) { flags[f] = true; });
    return flags;
  }

  // Documentation classifier: returns { leaks:[], gaps:[], items:[{item, current, rec, status}] }
  function classifyDocs(docMap) {
    var leaks = [], gaps = [], items = [];
    if (!docMap) return { leaks: leaks, gaps: gaps, items: items };
    Object.keys(docMap).forEach(function (item) {
      var current = docMap[item];
      var rule = DOC_RULES[item];
      if (!rule) return;
      var status = 'ok';
      if (rule.leakIf && rule.leakIf.indexOf(current) !== -1) { leaks.push(item); status = 'leak'; }
      else if (rule.gapIf && rule.gapIf.indexOf(current) !== -1) { gaps.push(item); status = 'gap'; }
      items.push({ item: item, current: current, rec: rule.rec, status: status });
    });
    return { leaks: leaks, gaps: gaps, items: items };
  }

  function deriveFlags(resp, flags) {
    var countries = resp.countries_connected || [];
    var roleCountrySet = {};
    countries.forEach(function (c) { (c.roles || []).forEach(function (r) { roleCountrySet[c.country_id] = true; }); });
    var countryCount = Object.keys(roleCountrySet).length || countries.length;
    var meaningful = ['meaningful_savings', 'life_changing', 'business_treasury', 'family_wealth'].indexOf(resp.amount_band) !== -1;

    if (countryCount >= 3) flags['jurisdiction.dispersion'] = true;
    if (countryCount <= 1 && meaningful) flags['jurisdiction.concentration'] = true;

    var anySinglePoint = flags['custody.single_point'] || flags['device.single_point'] || flags['banking.single_point'];
    if (flags['jurisdiction.dispersion'] && anySinglePoint) flags['derived.legal_operational_split'] = true;
    return flags;
  }

  function answeredSections(resp) {
    // crude completeness: which core sections have at least one recorded answer
    var seen = {};
    (resp._answeredSections || []).forEach(function (s) { seen[s] = true; });
    return seen;
  }

  function classify(resp) {
    var flags = collectFlags(resp);
    var docResult = classifyDocs(resp.documentation_classification);
    docResult.leaks.forEach(function () { flags['doc.leak'] = true; });
    flags = deriveFlags(resp, flags);

    var seen = answeredSections(resp);
    var missingCore = CORE_SECTIONS.filter(function (s) { return !seen[s]; });
    var resultConfidence = missingCore.length === 0 ? 'clear' : (missingCore.length === 1 ? 'partial' : 'insufficient_information');

    var matched = [];
    function rule(type, cond) { if (cond) matched.push(type); }

    rule('documentation_leak', !!flags['doc.leak']);
    rule('custody_concentration', flags['custody.single_point'] && (resp._ifUnavailableNoOne || flags['estate.access_gap']));
    rule('estate_mismatch', flags['estate.authority_access_mismatch'] || flags['estate.no_plan'] || flags['estate.document_gap'] || flags['estate.single_person']);
    rule('cross_border_family_gap', flags['family.cross_border'] && (flags['estate.document_gap'] || flags['family.awareness_gap'] || flags['estate.access_gap']));
    rule('banking_fragility', flags['banking.fragile'] || (flags['banking.single_point'] && resp._bankFreezeSerious));
    rule('jurisdictional_concentration', flags['jurisdiction.concentration']);
    rule('advisor_coordination_gap', flags['advisor.gap'] || (flags['advisor.partial_coverage'] && flags['jurisdiction.dispersion']));
    rule('business_governance_gap', flags['business.key_person'] || flags['business.governance_gap'] || flags['business.structure_complex']);
    rule('tax_visibility_issue', flags['tax.records_missing'] || (flags['tax.taxable_events'] && flags['tax.records_thin']) || (flags['tax.heavy_regime'] && flags['tax.multi_jurisdiction']));

    var primary, secondary;
    if (missingCore.length >= 2 && matched.length === 0) {
      primary = 'unknown_missing_information';
      secondary = [];
    } else if (matched.length === 0) {
      primary = 'unknown_missing_information';
      secondary = [];
    } else {
      primary = matched[0];
      secondary = matched.slice(1);
    }

    return {
      primary_exposure_type: primary,
      secondary_exposure_types: secondary,
      countries_involved: (resp.countries_connected || []).map(function (c) { return c.country_id; }),
      bitcoin_exposure_type: resp.bitcoin_exposure_types || [],
      documentation: docResult,
      _flags: Object.keys(flags),
      result_confidence: resultConfidence,
      disclaimer: 'This is not legal, tax, investment, or financial advice. It is a preparation document for a conversation with a qualified professional.'
    };
  }

  var api = { classify: classify, classifyDocs: classifyDocs, DOC_RULES: DOC_RULES, CORE_SECTIONS: CORE_SECTIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.JEAClassify = api;
})(typeof window !== 'undefined' ? window : globalThis);
