#!/usr/bin/env node
/**
 * check-operating-risk.js — BSA pre-deploy operating-risk linter
 *
 * Catches the recurring operating risks identified in the 2026-06 bear-case audit
 * so they stop coming back. Runs read-only; prints a categorized report and exits
 * non-zero if any HARD violation is found (suitable for a pre-deploy gate / CI).
 *
 * Usage:
 *   node scripts/check-operating-risk.js            # full report
 *   node scripts/check-operating-risk.js --quiet    # only failures
 *   node scripts/check-operating-risk.js --json     # machine-readable
 *
 * Design notes (learned the hard way):
 *  - Context-aware, not blind grep. Each check has an allowlist of known-OK
 *    phrasings so we don't re-raise the false positives the manual audit cleared
 *    (Bitcoin's "open access", Lightning "earn sats by routing", defunct tools
 *    that ARE framed historically, $-values that are examples/historical/pricing).
 *  - HARD vs SOFT: HARD fails the build; SOFT is a warning for human review.
 *  - No network calls. No external deps. Node >= 18.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const QUIET = args.has('--quiet');
const JSON_OUT = args.has('--json');

// Directories/files never user-facing — excluded from content checks.
const EXCLUDE_DIR = /(^|\/)(node_modules|\.git|archive|_graveyard|tests?|mockups?|\.superpowers|reports|docs|coverage|dist|\.vercel|admin|embeds|public|payment)(\/|$)/;
const EXCLUDE_FILE = /(^_|\.min\.|-backup|_backup|\.test\.|\.spec\.)/;  // ^_ skips _mockup/_compare drafts

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const rel = path.relative(REPO, fp);
    if (EXCLUDE_DIR.test('/' + rel)) continue;
    let st; try { st = fs.statSync(fp); } catch { continue; }
    if (st.isDirectory()) walk(fp, out);
    else if (/\.html?$/.test(name) && !EXCLUDE_FILE.test(name)) out.push(fp);
  }
  return out;
}

const files = walk(REPO);
const findings = []; // {sev, check, file, line, msg}
const add = (sev, check, file, line, msg) =>
  findings.push({ sev, check, file: path.relative(REPO, file), line, msg });

// helper: line number of an index
const lineNo = (txt, idx) => txt.slice(0, idx).split('\n').length;
const around = (txt, idx, r = 70) => txt.slice(Math.max(0, idx - r), idx + r).replace(/\s+/g, ' ').trim();

// ---- patterns ----
const FRAME = /(shut down|shut-down|seized|seizure|indict|historical|archived|no longer|defunct|discontinued|wound down|202[0-9])/i;
const DEFUNCT = /\b(samourai|whirlpool|wasabi|caravan|paxful)\b/i;
const LIVECUE = /(current(ly)?|today|right now|live|trading at|now worth|spot price|price of bitcoin|bitcoin price|1\s*BTC\s*=)/i;
const ABSOLUTE_FREE = /\b(free forever|forever free|everything is free|all (educational )?content (and [^.]*)?(is|are) (completely |entirely )?free|entirely free|100% free|completely free|no paywall|always free)\b/i;
// "open access" / "earn sats by routing" are Bitcoin education — allowlisted below.
// High-signal blur only — bare "cryptocurrency" describing Bitcoin is not a violation,
// so we flag terms that actually conflate Bitcoin with the wider crypto/altcoin space.
const CRYPTO_BLUR = /\b(altcoins?|shitcoins?|other cryptocurrencies|crypto portfolio|buy crypto|best crypto|crypto investing|which crypto|crypto assets?)\b/i;
const EARNBACK = /(earn[\s-]?back|earn while you learn|apprentice (member|deposit)|sats deposit|lightning deposit|earned-sats|deposit sats)/i;

const ALLOW_FREE = /(open access:|open access<|open access\b[^.]{0,40}(verify|anyone can|bitcoin|network|24\/7))/i; // bitcoin property, not pricing
const ALLOW_EARN = /(earn sats by routing|routing others|routing revenue|node)/i; // lightning education
const ALLOW_CRYPTO = /(not (an? )?(altcoin|crypto)|unlike (other )?(crypto|altcoin)|isn'?t (an? )?(altcoin|crypto)|bitcoin, not crypto|vs\.? (crypto|altcoin))/i;

// canonical strings we expect to find where required
// Markup-tolerant: the disclosure's distinctive sentence (survives <strong>Disclosure:</strong> wrappers).
const DISCLOSURE_RE = /advis(e|es|er|or)\b[^.]{0,90}The Bitcoin Advise?r|When BSA refers to TBA/i;
const NAMES_TBA = /\b(the bitcoin advise?r|TBA)\b/i;
const ROUTES_CONSULT = /(custody consult|book a (call|consult)|advisor referral|family custody review|schedule a (call|consult))/i;

for (const f of files) {
  let txt; try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
  const rel = path.relative(REPO, f);

  // 1) HARD: absolute free claims that contradict paid products
  for (const m of txt.matchAll(new RegExp(ABSOLUTE_FREE, 'gi'))) {
    const ctx = around(txt, m.index);
    if (ALLOW_FREE.test(ctx)) continue;
    add('HARD', 'free-vs-paid', f, lineNo(txt, m.index),
      `Absolute "free" claim ("${m[0]}") — paid kits exist ($49/$149/$499). Use the canonical free-vs-paid line.`);
  }

  // 2) HARD: page VISIBLY names TBA but carries no disclosure (tags stripped so markup
  //    can't hide a real disclosure nor fake one via attributes like value="bitcoin_adviser").
  const visible = txt.replace(/<[^>]+>/g, ' ');
  if (NAMES_TBA.test(visible) && !DISCLOSURE_RE.test(visible)) {
    const at = txt.search(NAMES_TBA);
    add('HARD', 'tba-disclosure', f, lineNo(txt, at < 0 ? 0 : at),
      `Names "The Bitcoin Adviser"/TBA but no Disclosure line. See DISCLOSURE_POLICY.md.`);
  }
  // 2b) HARD: routes to a paid consult/referral but no disclosure
  if (ROUTES_CONSULT.test(txt) && NAMES_TBA.test(txt) === false && !DISCLOSURE_RE.test(txt)) {
    add('SOFT', 'tba-disclosure', f, lineNo(txt, txt.search(ROUTES_CONSULT)),
      `Routes to a consult/referral pathway without a disclosure line — review.`);
  }

  // 3) SOFT: residual earn-back / lightning-deposit framing (program parked 2026-06-11)
  for (const m of txt.matchAll(new RegExp(EARNBACK, 'gi'))) {
    const ctx = around(txt, m.index);
    if (ALLOW_EARN.test(ctx)) continue;
    add('SOFT', 'earn-back-residual', f, lineNo(txt, m.index),
      `Residual earn-back/deposit framing ("${m[0]}") — earn-back parked 2026-06-11. Confirm removal.`);
  }

  // 4) SOFT: Bitcoin/crypto blur (CLAUDE.md: do not blur Bitcoin with crypto)
  for (const m of txt.matchAll(new RegExp(CRYPTO_BLUR, 'gi'))) {
    const ctx = around(txt, m.index);
    if (ALLOW_CRYPTO.test(ctx)) continue;
    add('SOFT', 'bitcoin-crypto-blur', f, lineNo(txt, m.index),
      `"${m[0]}" — verify it isn't blurring Bitcoin with crypto/altcoins.`);
  }

  // 5) HARD: defunct privacy/custody tool with NO historical framing anywhere on page
  if (DEFUNCT.test(txt) && !FRAME.test(txt)) {
    add('HARD', 'defunct-tool-unframed', f, lineNo(txt, txt.search(DEFUNCT)),
      `Mentions a defunct tool (Samourai/Whirlpool/Wasabi/Caravan/Paxful) with no historical framing on the page.`);
  }

  // 6) SOFT: a $-value presented as the live/current BTC price without data-btc-live
  for (const m of txt.matchAll(/\$[0-9][0-9,\.]{2,}/g)) {
    const ctx = around(txt, m.index, 60);
    if (LIVECUE.test(ctx) && !/data-btc-live/.test(ctx)
        && !/all-time high|reaches|\/year|in 1960|bought|imagine|example|scenario|rent|in the bank|debt|trillion|P\(t\)|LTV/i.test(ctx)) {
      add('SOFT', 'stale-live-price', f, lineNo(txt, m.index),
        `"${m[0]}" looks like a live BTC price shown statically — bind to data-btc-live.`);
      break;
    }
  }

  // 7) SOFT: product page with no pricing language
  if (/^products\//.test(rel) && /index\.html?$/.test(rel)) {
    if (!/\$[0-9]|data-usd=|free|price/i.test(txt))
      add('SOFT', 'product-no-price', f, 1, `Product page has no pricing language — add canonical price.`);
  }

  // 8) SOFT: link to a parked flow (earn-back-terms redirects; flag direct deep links)
  for (const m of txt.matchAll(/href="[^"]*earn-back-terms[^"]*"/gi)) {
    add('SOFT', 'parked-flow-link', f, lineNo(txt, m.index),
      `Links to earn-back-terms (parked/redirects 2026-06-11) — point at the live destination instead.`);
  }
}

// ---- report ----
const hard = findings.filter(f => f.sev === 'HARD');
const soft = findings.filter(f => f.sev === 'SOFT');
const byCheck = findings.reduce((a, f) => ((a[f.check] = (a[f.check] || 0) + 1), a), {});

if (JSON_OUT) {
  console.log(JSON.stringify({ scanned: files.length, hard: hard.length, soft: soft.length, byCheck, findings }, null, 2));
} else {
  const print = (f) => console.log(`  [${f.sev}] ${f.check}  ${f.file}:${f.line}\n        ${f.msg}`);
  console.log(`\nBSA operating-risk check — scanned ${files.length} HTML pages\n`);
  console.log(`  HARD violations: ${hard.length}   SOFT warnings: ${soft.length}`);
  console.log('  by check:', JSON.stringify(byCheck));
  if (!QUIET || hard.length) {
    if (hard.length) { console.log('\nHARD (fails the gate):'); hard.forEach(print); }
    if (soft.length && !QUIET) { console.log('\nSOFT (human review):'); soft.slice(0, 80).forEach(print);
      if (soft.length > 80) console.log(`  …and ${soft.length - 80} more soft warnings`); }
  }
  console.log('');
}
process.exit(hard.length ? 1 : 0);
