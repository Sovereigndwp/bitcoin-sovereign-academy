// Shared validation for cross-platform social drafts.
// Pure functions, no I/O. Used by validate-social-drafts.mjs and the generator.
//
// Two layers:
//   validateDraft(draft)        — per-post errors (block) + warnings
//   validateBatch(drafts)       — set-level checks (CTA frequency, repeated CTAs)

export const PLATFORMS = new Set(['nostr', 'linkedin', 'substack', 'x']);

export const PILLARS = new Set([
  'beginner', 'custody-mistake', 'money', 'inheritance', 'sovereignty',
  'rail-clarity', 'advisors', 'families', 'bsa-distribution', 'zap-soft', 'spanish',
]);

export const AUDIENCES = new Set(['all', 'beginner', 'advisors', 'families', 'builders', 'spanish']);

export const POST_TYPES = new Set([
  'one-idea', 'mistake', 'checklist', 'question', 'thread',
  'lesson-link', 'zap-worthy', 'advisor', 'family', 'spanish',
]);

export const CTA_TYPES = new Set([
  'none', 'soft-site', 'soft-demo', 'lesson-link', 'meeting', 'zap-soft', 'support',
]);

// Char limits per platform. ideal = warn outside, hard = error above.
export const LIMITS = {
  nostr: { idealMax: 800, hard: 2000 },
  linkedin: { idealMin: 900, idealMax: 1500, hard: 3000 },
  substack: { idealMin: 400, idealMax: 1000, hard: 1500 },
  x: { hard: 280 }, // unless post_type === 'thread'
};

// Banned phrases — from the BSA brief plus the established voice spec.
// NOTE: bare "crypto" is intentionally NOT banned here so drafts can make the
// "Bitcoin is not crypto" category distinction. The generic-category misuse is
// caught by "crypto revolution" / "crypto as an asset class" style phrases.
export const BANNED = [
  /\bfew understand\b/i,
  /\bwake up\b/i,
  /\borange[- ]?pill(ed|ing)?\b/i,
  /\bhave fun staying poor\b/i,
  /\bhfsp\b/i,
  /\bweb ?3\b/i,
  /\bbitcoin fixes (this|everything|that)\b/i,
  /(^|\s)gm(\s|$|!|,)/i,
  /\bto the moon\b/i,
  /\bnumber go up\b/i,
  /\bngu\b/i,
  /\bcrypto revolution\b/i,
  /\bfinancial revolution\b/i,
  /\bfuture of finance\b/i,
  /\bgame[- ]?changer\b/i,
  /\brevolutionary\b/i,
  /\bdon'?t miss out\b/i,
  /\bfollow (for|to get) more\b/i,
  /\blike and (share|follow|subscribe)\b/i,
];

// Phrases that could trick users into exposing secrets. Hard error.
export const KEY_DANGER = [
  /\b(send|share|paste|dm|enter|type|post|upload)\b[^.\n]{0,30}\b(seed|seed phrase|nsec|private key|recovery phrase|mnemonic)\b/i,
  /\b(seed|nsec|private key|recovery phrase)\b[^.\n]{0,30}\b(here|below|to us|to me|in the (comments|replies|chat))\b/i,
];

// Price-prediction / guaranteed-return / advice patterns. Hard error.
export const FINANCIAL_CLAIMS = [
  /\bguaranteed (returns?|profit|gains?|income)\b/i,
  /\bprice target\b/i,
  /\bwill (hit|reach|moon|explode|pump)\b/i,
  /\b\$\s?\d[\d,]*\s?k?\b[^.\n]{0,20}\b(by|target|soon|incoming)\b/i,
  /\b\d+x\b[^.\n]{0,15}\b(return|gain|profit)\b/i,
  /\b(investment|financial) advice\b/i,
  /\bcan'?t lose\b/i,
  /\brisk[- ]?free\b/i,
];

function countHashtags(s) {
  const m = s.match(/(^|\s)#[\p{L}\p{N}_]+/gu);
  return m ? m.length : 0;
}

function isNonEmptyString(s) { return typeof s === 'string' && s.trim().length > 0; }

/** Validate one draft. Returns { ok, errors:[], warnings:[] }. */
export function validateDraft(d) {
  const errors = [];
  const warnings = [];
  if (!d || typeof d !== 'object') return { ok: false, errors: ['draft is not an object'], warnings };

  if (d.version !== 1) errors.push('version must be 1');
  if (!isNonEmptyString(d.slug)) errors.push('slug is required');
  if (!isNonEmptyString(d.body)) errors.push('body is required');
  if (!PLATFORMS.has(d.platform)) errors.push(`platform must be one of ${[...PLATFORMS].join(', ')}`);
  if (!PILLARS.has(d.pillar)) errors.push(`pillar must be one of ${[...PILLARS].join(', ')}`);
  if (!AUDIENCES.has(d.audience)) errors.push(`audience must be one of ${[...AUDIENCES].join(', ')}`);
  if (!POST_TYPES.has(d.post_type)) errors.push(`post_type must be one of ${[...POST_TYPES].join(', ')}`);
  if (!CTA_TYPES.has(d.cta_type)) errors.push(`cta_type must be one of ${[...CTA_TYPES].join(', ')}`);
  if (d.language !== 'en' && d.language !== 'es') errors.push('language must be en or es');
  if (typeof d.zap_ok !== 'boolean') errors.push('zap_ok must be boolean');
  if (typeof d.meeting_ok !== 'boolean') errors.push('meeting_ok must be boolean');

  if (!isNonEmptyString(d.body)) return { ok: errors.length === 0, errors, warnings };

  const body = d.body;

  // Banned phrases
  for (const re of BANNED) {
    if (re.test(body)) errors.push(`banned phrase: ${re}`);
  }
  // Secret-exposure danger
  for (const re of KEY_DANGER) {
    if (re.test(body)) errors.push(`possible key-exposure language: ${re}`);
  }
  // Financial claims
  for (const re of FINANCIAL_CLAIMS) {
    if (re.test(body)) errors.push(`financial-claim / price language: ${re}`);
  }

  // Hashtags
  if (countHashtags(body) > 2) errors.push(`more than 2 hashtags (${countHashtags(body)})`);

  // Links
  const links = Array.isArray(d.links) ? d.links : [];
  if (links.length > 2) errors.push(`more than 2 links (${links.length})`);
  for (const l of links) {
    if (typeof l !== 'string' || !/^https?:\/\//i.test(l)) errors.push(`bad link: ${l}`);
  }
  // Links present in body but not declared (best-effort consistency check)
  const urlsInBody = body.match(/https?:\/\/[^\s)]+/gi) || [];
  if (urlsInBody.length > 2) errors.push(`more than 2 URLs in body (${urlsInBody.length})`);

  // CTA / metadata consistency
  if (d.cta_type === 'meeting' && d.meeting_ok !== true) {
    warnings.push('cta_type=meeting but meeting_ok is false');
  }
  if (d.cta_type === 'zap-soft' && d.zap_ok !== true) {
    warnings.push('cta_type=zap-soft but zap_ok is false');
  }

  // Platform char limits
  const lim = LIMITS[d.platform];
  if (lim) {
    const len = body.length;
    if (d.platform === 'x') {
      if (d.post_type !== 'thread' && len > lim.hard) {
        errors.push(`X post ${len} chars exceeds 280 (use post_type=thread for longer)`);
      }
    } else {
      if (lim.hard && len > lim.hard) errors.push(`${d.platform} body ${len} chars exceeds hard max ${lim.hard}`);
      if (lim.idealMax && len > lim.idealMax) warnings.push(`${d.platform} body ${len} chars over ideal ${lim.idealMax}`);
      if (lim.idealMin && len < lim.idealMin) warnings.push(`${d.platform} body ${len} chars under ideal ${lim.idealMin}`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

/**
 * Set-level checks across a batch (e.g. one platform's queue or the approved set).
 * Returns { warnings:[], errors:[] }.
 *   - meeting CTA: max 1 per 7 posts
 *   - zap CTA: max 2 per 7 posts
 *   - identical CTA lines repeated across posts
 */
export function validateBatch(drafts) {
  const warnings = [];
  const errors = [];
  const n = drafts.length;
  if (n === 0) return { warnings, errors };

  const meetingCount = drafts.filter((d) => d.cta_type === 'meeting' || d.meeting_ok).length;
  const zapCount = drafts.filter((d) => d.cta_type === 'zap-soft' || d.zap_ok).length;

  const meetingAllowed = Math.max(1, Math.floor(n / 7) || 1);
  const zapAllowed = Math.max(2, Math.floor((n / 7) * 2) || 2);

  if (meetingCount > meetingAllowed) {
    warnings.push(`meeting CTA used ${meetingCount}× across ${n} posts (guideline: ≤${meetingAllowed} per 7)`);
  }
  if (zapCount > zapAllowed) {
    warnings.push(`zap CTA used ${zapCount}× across ${n} posts (guideline: ≤${zapAllowed} per 7)`);
  }

  // Repeated identical CTA / closing lines
  const lastLines = {};
  for (const d of drafts) {
    const lines = (d.body || '').trim().split('\n').map((l) => l.trim()).filter(Boolean);
    const last = lines[lines.length - 1] || '';
    if (/^https?:\/\//.test(last) || /zap|value for value|meeting|book|learn|practice/i.test(last)) {
      lastLines[last] = (lastLines[last] || 0) + 1;
    }
  }
  for (const [line, count] of Object.entries(lastLines)) {
    if (count > 2) warnings.push(`identical closing/CTA line repeated ${count}×: "${line.slice(0, 60)}"`);
  }

  return { warnings, errors };
}
