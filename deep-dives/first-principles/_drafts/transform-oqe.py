#!/usr/bin/env python3
"""One-shot transform for original-question-everything.html:
   de-gamify (unbounded mode), fix stale fallbacks, insert bsa metadata,
   append steelman/sources/misconception section. Idempotent-ish: run once."""
import re, sys, io

P = "../original-question-everything.html"
with io.open(P, encoding="utf-8") as f:
    html = f.read()
orig = html

# 1) Insert BSA content-graph metadata before the deep-dive-brand stylesheet link
bsa_meta = '''<script type="application/ld+json">{
  "@context": { "@vocab": "https://schema.org/", "bsa": "https://bitcoinsovereign.academy/vocab/" },
  "@type": "Article",
  "bsa:page_id": "deep_dive_bitcoin_from_first_principles",
  "bsa:content_type": "deep_dive",
  "bsa:strategic_role": "first_principles_flagship_journey",
  "bsa:audience_tier": "curious_to_intermediate",
  "bsa:reading_time_minutes": 40,
  "bsa:teaches": ["sound_money_properties","double_spend_problem","distributed_ledger_consensus","proof_of_work","blockchain_immutability","digital_signatures","economic_incentives","network_effects","difficulty_adjustment","digital_scarcity_sovereignty"],
  "bsa:repairs": ["Bitcoin was invented as an investment","Mining is wasteful with no purpose","A central party runs Bitcoin","Understanding requires trusting the price narrative"],
  "bsa:supports_decision": "understand_why_bitcoin_is_designed_the_way_it_is",
  "bsa:bridges_to": [
    { "ref": "why_money_fails_deep_dive", "url": "/deep-dives/first-principles/why-money-fails.html", "relationship": "child_deep_dive" },
    { "ref": "digital_scarcity_deep_dive", "url": "/deep-dives/first-principles/digital-scarcity.html", "relationship": "child_deep_dive" },
    { "ref": "foundational_layer_thesis", "url": "/deep-dives/foundational-layer-thesis/index.html", "relationship": "deeper_on_bitcoins_role_now" }
  ],
  "bsa:blocked_by_boundary": [ { "route": "custody_implementation", "reason": "Conceptual journey; custody/inheritance setup handled elsewhere." } ],
  "bsa:learning_arc": {
    "research_question": "present", "why_this_matters": "present", "current_system_comparison": "present",
    "failure_mode": "present", "design_pressure": "present", "bitcoin_mechanism": "present", "tradeoffs": "present",
    "interactive_test": "present", "evidence": "present", "objections": "present", "misconception_repair": "present", "socratic_reflection": "present"
  },
  "bsa:upgrade_status": "strong_as_is",
  "bsa:last_audit_date": "2026-06-19"
}</script>    <link rel="stylesheet" href="/css/deep-dive-brand.css">'''
html = html.replace('    <link rel="stylesheet" href="/css/deep-dive-brand.css">', bsa_meta, 1)

# 2) Replace the gamified progress tracker with an unbounded-mode orientation note
tracker_old = '''        <div class="principle-tracker">
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                Your First Principles Journey: <span id="progress-text">0/10 Principles Understood</span>
            </div>
            <div class="principle-bar">
                <div class="principle-fill" id="progress-fill" style="width: 0%;"></div>
            </div>
            <p style="color: #F7F7F2; margin-top: 10px;">Each principle builds logically on the previous ones</p>
        </div>'''
tracker_new = '''        <div class="principle-tracker" style="border-left:3px solid #FF7A00;background:rgba(255,122,0,.06);">
            <div style="font-size:1.05rem;font-weight:600;margin-bottom:6px;color:#fff;">Ten principles, built in order, read them however you like.</div>
            <p style="color:#cfcfca;margin:0;">Each section opens with a first-principles question and builds on the previous one. There's no score and nothing to complete, open what's useful, skip what isn't, and come back anytime.</p>
        </div>'''
html = html.replace(tracker_old, tracker_new, 1)

# 3) Relabel all "I Understand ..." completion buttons -> neutral continuation,
#    repointing onclick to openNext() (no scoring).
def btn_repl(m):
    n = m.group(1)
    return (f'<button type="button" class="btn btn-ghost" onclick="openNext({n})" '
            f'aria-label="Continue to the next principle">Continue ↓</button>')
html = re.sub(r'<button[^>]*onclick="completePrinciple\((\d+)\)"[^>]*>.*?</button>',
              btn_repl, html, flags=re.S)

# 3b) Relabel the reset button -> neutral "collapse all"
html = html.replace(
    '<button type="button" class="btn btn-success" onclick="resetAllProgress()">🔄 Review Principles Again</button>',
    '<button type="button" class="btn btn-ghost" onclick="collapseAll()">Collapse all sections</button>', 1)

# 4) Neutralize the scoring JS
html = html.replace(
'''        function completePrinciple(principleNum) {
            if (principleNum > completedPrinciples) {
                completedPrinciples = principleNum + 1;
                updateProgress();

                // Auto-open next principle
                if (principleNum < 9) {
                    setTimeout(() => {
                        togglePrinciple(principleNum + 1);
                    }, 1000);
                }
            }
        }

        function updateProgress() {
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('progress-text');
            const percentage = (completedPrinciples / 10) * 100;

            if (progressFill) progressFill.style.width = percentage + '%';
            if (progressText) progressText.textContent = `${completedPrinciples}/10 Principles Understood`;
        }''',
'''        // Unbounded mode: no scoring, no completion %. Just smooth navigation.
        function openNext(principleNum) {
            if (principleNum < 9) { togglePrinciple(principleNum + 1); }
            const next = document.getElementById('content-' + (principleNum + 1));
            if (next) { next.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
        function updateProgress() { /* no-op: progress tracking removed (unbounded mode) */ }''', 1)

# 4b) resetAllProgress -> collapseAll (drop scoring lines)
html = html.replace(
'''        function resetAllProgress() {
            completedPrinciples = 0;
            currentOpenPrinciple = null;
            networkUsers = 1000;
            networkMiners = 10;
            networkValue = 1;
            blockchainBlocks = 1;

            updateProgress();
            ''',
'''        function collapseAll() {
            currentOpenPrinciple = null;
            ''', 1)
# keep backward-compat alias in case any handler references the old name
html = html.replace('        // Initialize\n        updateProgress();',
                    '        // Initialize\n        window.resetAllProgress = collapseAll;', 1)

# 5) Stale fallbacks (live-bound; these only show if live data fails)
html = html.replace('data-btc-format="currency">$43,000</div>',
                    'data-btc-format="currency">$100,000</div>', 1)
html = html.replace('data-btc-format="number">20,040,000</div>',
                    'data-btc-format="number">20,043,000</div>', 1)

# 6) Append consolidated steelman / misconception / sources block before the Reflect widget
addon = '''    <!-- Honest tradeoffs, steelman, misconceptions, sources (audit 2026-06-19) -->
    <div style="max-width:900px;margin:2rem auto 0;padding:0 1.5rem;">
      <div style="background:#16181C;border:1px solid #2A2A2A;border-left:3px solid #8a8f98;border-radius:12px;padding:22px 24px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#aeb3bb;margin-bottom:.5rem;">Steelman, the strongest case against</div>
        <p style="color:#d8d8d2;">"This journey explains Bitcoin's design from the inside, where every part looks necessary. A critic would say that's circular: proof-of-work is defended as securing the chain, and the chain is defended as needing proof-of-work. The hard questions sit <em>outside</em> the design, does the energy cost buy enough real-world security to justify itself; will fees alone fund mining once the subsidy fades; and is 'digital sovereignty' meaningful for people who'll custody on an exchange anyway? Understanding the mechanism is not the same as proving it will endure."</p>
        <p style="color:#d8d8d2;margin-bottom:0;"><strong>The honest reply:</strong> fair. This page's job is to show <em>why each piece exists</em>, not to claim the system is guaranteed to win. The open questions, fee-market sustainability, energy justification, real-world custody behaviour, are genuinely unresolved and are explored in the sibling dives and the <a href="/deep-dives/foundational-layer-thesis/index.html">Foundational-Layer Thesis</a>.</p>
      </div>
      <div style="background:#16181C;border:1px solid #2A2A2A;border-radius:12px;padding:22px 24px;margin-top:1rem;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#FF9A00;margin-bottom:.5rem;">Misconceptions repaired</div>
        <ul style="color:#d8d8d2;margin:0;padding-left:1.2rem;">
          <li><strong>"Bitcoin was invented as an investment."</strong> It was designed as peer-to-peer electronic cash to remove trusted third parties; price came later and isn't the point of the design.</li>
          <li><strong>"Mining is pointless waste."</strong> The energy converts to <em>cost-to-attack</em>: rewriting history means out-spending the whole network. Whether that cost is justified is a fair debate; that it does something is not.</li>
          <li><strong>"Someone runs Bitcoin."</strong> Rules are enforced by every independent node. No party can change the supply or reverse a buried transaction by decree.</li>
        </ul>
      </div>
      <div style="background:#16181C;border:1px solid #2A2A2A;border-radius:12px;padding:22px 24px;margin-top:1rem;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#aeb3bb;margin-bottom:.5rem;">Source trail</div>
        <ul style="color:#aeb3bb;font-size:.9rem;margin:0;padding-left:1.2rem;">
          <li>Nakamoto, <em>Bitcoin: A Peer-to-Peer Electronic Cash System</em> (2008), the design's primary source.</li>
          <li>Bitcoin Core documentation / BIPs, consensus rules, difficulty adjustment, subsidy schedule.</li>
          <li>Derived issuance &amp; scarcity figures: <a href="data/first-principles-math.json"><code>data/first-principles-math.json</code></a>; claim ledger: <a href="data/first-principles-facts.json"><code>data/first-principles-facts.json</code></a>.</li>
          <li>Live supply/price bound via <code>data-btc-live</code> (mempool.space / CoinGecko fallbacks); figures shown are illustrative if live data is unavailable.</li>
        </ul>
      </div>
    </div>

    <!-- Reflect: Socratic questions after activity -->'''
html = html.replace('    <!-- Reflect: Socratic questions after activity -->', addon, 1)

# 7) Add a lightweight .btn-ghost style (neutral) near the existing .btn-success rule
html = html.replace('        .btn-success {',
                    '        .btn-ghost { background:transparent; border:1px solid #2A2A2A; color:#d8d8d2; }\n        .btn-ghost:hover { border-color:#FF7A00; color:#fff; }\n        .btn-success {', 1)

if html == orig:
    print("WARNING: no changes applied, check match strings"); sys.exit(1)

with io.open(P, "w", encoding="utf-8") as f:
    f.write(html)

# report
import collections
checks = {
  "bsa:upgrade_status present": 'bsa:upgrade_status' in html,
  "tracker de-gamified": '0/10 Principles Understood' not in html,
  "no completePrinciple buttons": 'completePrinciple(' not in html,
  "openNext present": 'function openNext' in html,
  "steelman added": 'Steelman, the strongest case against' in html,
  "stale 43000 gone": '$43,000' not in html,
  "stale 20,040,000 gone": '20,040,000' not in html,
}
for k,v in checks.items(): print(("ok " if v else "FAIL ")+k)
