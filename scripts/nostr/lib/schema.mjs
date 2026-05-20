// Draft validator. Pure functions, no I/O.

const PILLARS = new Set([
  'beginner', 'custody-mistake', 'money', 'inheritance', 'sovereignty',
  'rail-clarity', 'advisors', 'bsa-distribution', 'zap-soft',
]);

const AUDIENCES = new Set(['all', 'beginner', 'advisors', 'families']);
const CTAS = new Set(['none', 'soft-site', 'soft-demo', 'meeting', 'zap-soft']);
const LANGS = new Set(['en', 'es']);
const KINDS = new Set([1, 30023]);

const BAD_PHRASES = [
  /\bfew understand\b/i,
  /\bhave fun staying poor\b/i,
  /\borange[- ]?pill(ed)?\b/i,
  /\bwake up\b/i,
  /\bgame[- ]?changer\b/i,
  /\brevolutionary\b/i,
  /\bcrypto\b/i,            // BSA voice: never lump Bitcoin with "crypto"
  /\bweb ?3\b/i,
  /\bbitcoin fixes (this|everything)\b/i,
];

/** Validate a draft. Returns { ok, errors[] }. */
export function validateDraft(d, { maxChars = 2000, maxLinks = 2 } = {}) {
  const errors = [];
  if (!d || typeof d !== 'object') return { ok: false, errors: ['draft is not an object'] };

  if (d.version !== 1) errors.push('version must be 1');
  if (!isNonEmptyString(d.slug)) errors.push('slug is required');
  if (!isNonEmptyString(d.body)) errors.push('body is required');
  if (d.kind == null) d.kind = 1;
  if (!KINDS.has(d.kind)) errors.push(`kind must be one of ${[...KINDS].join(', ')}`);
  if (!PILLARS.has(d.pillar)) errors.push(`pillar must be one of ${[...PILLARS].join(', ')}`);
  if (!AUDIENCES.has(d.audience || 'all')) errors.push(`audience must be one of ${[...AUDIENCES].join(', ')}`);
  if (!CTAS.has(d.cta || 'none')) errors.push(`cta must be one of ${[...CTAS].join(', ')}`);
  if (!LANGS.has(d.lang || 'en')) errors.push(`lang must be one of ${[...LANGS].join(', ')}`);
  if (typeof d.zap_ok !== 'boolean') errors.push('zap_ok must be boolean');

  if (isNonEmptyString(d.body) && d.body.length > maxChars) {
    errors.push(`body exceeds ${maxChars} chars (${d.body.length})`);
  }

  const links = Array.isArray(d.links) ? d.links : [];
  if (links.length > maxLinks) errors.push(`too many links (${links.length} > ${maxLinks})`);
  for (const l of links) {
    if (typeof l !== 'string' || !/^https?:\/\//i.test(l)) errors.push(`bad link: ${l}`);
  }

  // Soft voice check — refuses common banned phrases. Catches AI-style drafts.
  if (isNonEmptyString(d.body)) {
    for (const re of BAD_PHRASES) {
      if (re.test(d.body)) errors.push(`body contains banned phrase: ${re}`);
    }
    if (countHashtags(d.body) > 2) errors.push('body contains more than 2 hashtags');
  }

  // Kind 30023 long-form needs a slug tag and a title
  if (d.kind === 30023) {
    if (!isNonEmptyString(d.title)) errors.push('kind 30023 requires a title');
  }

  return { ok: errors.length === 0, errors };
}

function isNonEmptyString(s) { return typeof s === 'string' && s.trim().length > 0; }

function countHashtags(s) {
  const m = s.match(/(^|\s)#[\p{L}\p{N}_]+/gu);
  return m ? m.length : 0;
}
