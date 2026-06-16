/* jea-routing.js — maps exposure to free resources and at most one paid pathway.
   Enforces the price guard: a numeric price appears ONLY for offers with an
   established price in MONETIZATION_MAP.md. Everything else uses learn_more/contact.
   Works in the browser (window.JEARouting) and Node (module.exports). */
(function (root) {
  'use strict';

  // Established prices, each with the repo source proving them (MONETIZATION_MAP.md).
  var PRICED = {
    self_custody_starter_kit: { label: 'Self-Custody Starter Kit', price_usd: 49, price_source: 'products/self-custody-starter-kit/index.html', url: '/products/self-custody-starter-kit/' },
    family_bitcoin_recovery_kit: { label: 'Family Bitcoin Recovery Kit', price_usd: 149, price_source: 'products/family-bitcoin-recovery-kit/index.html', url: '/products/family-bitcoin-recovery-kit/' },
    advisor_bitcoin_client_kit: { label: 'Advisor Bitcoin Client Kit', price_usd: 499, price_source: 'products/advisor-bitcoin-client-kit/index.html', url: '/products/advisor-bitcoin-client-kit/' }
  };
  // Offers with no established price — never invent a number.
  var UNPRICED = {
    bitcoin_continuity_operational_package: { label: 'Bitcoin Continuity Operational Package', cta_style: 'contact' },
    advisor_readiness_training: { label: 'Advisor Bitcoin Readiness Training', cta_style: 'learn_more' },
    business_treasury_review: { label: 'Business / Treasury Jurisdiction Review', cta_style: 'contact' },
    tsa_sovereignty_planning: { label: 'TSA Sovereignty Planning', cta_style: 'learn_more', url: '/' }
  };

  var MOD = '/deep-dives/jurisdictional-exposure-audit/';
  function res(title, url, kind) { return { title: title, url: url, kind: kind || 'deep-dive-module' }; }

  function pathway(productId, rationale) {
    if (productId === 'none') return { product_id: 'none', label: null, cta_style: 'learn_more', rationale: rationale || '' };
    if (PRICED[productId]) {
      var p = PRICED[productId];
      return { product_id: productId, label: p.label, url: p.url, price_usd: p.price_usd, price_source: p.price_source, cta_style: 'priced', rationale: rationale };
    }
    var u = UNPRICED[productId] || { label: productId, cta_style: 'learn_more' };
    return { product_id: productId, label: u.label, url: u.url || null, price_usd: null, cta_style: u.cta_style, rationale: rationale };
  }

  // Guards prevent routing to a product the evidence does not support.
  function familyEvidence(out) {
    var f = out._flags || [];
    return f.some(function (x) { return x.indexOf('family.') === 0 || x.indexOf('estate.') === 0; });
  }
  function businessEvidence(out) { return (out._flags || []).some(function (x) { return x.indexOf('business.') === 0; }); }
  function isAdvisor(resp) { return (resp.user_type || []).indexOf('advisor') !== -1; }
  function individual(resp) { return (resp.user_type || []).indexOf('individual_holder') !== -1; }

  function route(out, resp) {
    var primary = out.primary_exposure_type;
    var amount = resp.amount_band;
    var freeResources = [];
    var pw;

    // Advisor short-circuit: if the user is an advisor, route to advisor materials.
    if (isAdvisor(resp)) {
      freeResources.push(res('Module 9 — Business and family-office exposure', MOD + '#module-9'));
      pw = pathway('advisor_bitcoin_client_kit', 'This may help if you want client-ready intake scripts, red-flag questions, and a custody classification guide.');
      return finalize(out, freeResources, pw);
    }

    switch (primary) {
      case 'documentation_leak':
        freeResources.push(res('Your documentation classifier result', MOD + 'audit/#docs', 'checklist'));
        freeResources.push(res('Module 7 — Self-custody and legal authority', MOD + '#module-7'));
        pw = familyEvidence(out)
          ? pathway('family_bitcoin_recovery_kit', 'This may help if the leak sits in family or recovery instructions.')
          : pathway('self_custody_starter_kit', 'This may help if you want safe backup and records discipline.');
        break;
      case 'custody_concentration':
        freeResources.push(res('Module 7 — Self-custody and legal authority', MOD + '#module-7'));
        pw = (individual(resp) && ['less_than_life_changing', 'meaningful_savings'].indexOf(amount) !== -1)
          ? pathway('self_custody_starter_kit', 'This may help if you are organizing basic custody and backups.')
          : pathway('family_bitcoin_recovery_kit', 'This may help if recovery currently depends on one person.');
        break;
      case 'estate_mismatch':
        freeResources.push(res('Module 5 — Estate, inheritance, and forced heirship', MOD + '#module-5'));
        pw = pathway('family_bitcoin_recovery_kit', 'This may help if legal authority and key access are not aligned.');
        break;
      case 'cross_border_family_gap':
        freeResources.push(res('Module 8 — Cross-border families', MOD + '#module-8'));
        freeResources.push(res('Country research library', MOD + 'library/', 'library-country'));
        pw = (amount === 'life_changing' || amount === 'family_wealth')
          ? pathway('bitcoin_continuity_operational_package', 'This may help if multiple parties and countries need coordinating.')
          : pathway('family_bitcoin_recovery_kit', 'This may help if heirs, documents, and keys sit in different countries.');
        break;
      case 'banking_fragility':
        freeResources.push(res('Module 6 — Banking, liquidity, and de-risking', MOD + '#module-6'));
        pw = pathway('tsa_sovereignty_planning', 'This may help if your money movement depends on one fragile rail.');
        break;
      case 'jurisdictional_concentration':
        freeResources.push(res('Module 1 — What jurisdiction really means', MOD + '#module-1'));
        freeResources.push(res('Country research library', MOD + 'library/', 'library-country'));
        pw = pathway('tsa_sovereignty_planning', 'This may help if you are weighing a move or diversification.');
        break;
      case 'advisor_coordination_gap':
        freeResources.push(res('Module 12 — Next steps and professional review', MOD + '#module-12'));
        pw = pathway('bitcoin_continuity_operational_package', 'This may help if your advisors each hold one piece and no one sees the whole.');
        break;
      case 'business_governance_gap':
        freeResources.push(res('Module 9 — Business and family-office exposure', MOD + '#module-9'));
        pw = businessEvidence(out)
          ? pathway('business_treasury_review', 'This may help if signer authority and treasury policy are informal.')
          : pathway('none');
        break;
      case 'tax_visibility_issue':
        freeResources.push(res('Module 4 — Tax visibility and reporting', MOD + '#module-4'));
        pw = pathway('none', 'Records discipline and a tax professional are the honest next step here. No product resolves a tax exposure.');
        break;
      default: // unknown_missing_information
        freeResources.push(res('Finish the audit sections you skipped', MOD + 'audit/'));
        pw = pathway('none', 'Answer the remaining sections for a clearer map.');
    }
    return finalize(out, freeResources, pw);
  }

  function finalize(out, freeResources, pw) {
    out.recommended_resources = freeResources;
    out.recommended_pathway = pw;
    return out;
  }

  var api = { route: route, pathway: pathway, PRICED: PRICED, UNPRICED: UNPRICED };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.JEARouting = api;
})(typeof window !== 'undefined' ? window : globalThis);
