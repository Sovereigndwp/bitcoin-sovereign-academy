/**
 * Reflect Widget — Bitcoin Sovereign Academy
 *
 * Self-contained embeddable Socratic reflection widget.
 * Drop into any module or demo page with a single element:
 *
 *   <div class="reflect-widget"
 *        data-topic="private-key"
 *        data-path="sovereign"
 *        data-title="Reflect: Private Keys">
 *   </div>
 *
 * Attributes:
 *   data-topic   — topic key for seeded questions (see SEED_QUESTIONS map)
 *   data-path    — learner path context (curious | builder | sovereign | principled)
 *   data-title   — optional heading override
 *
 * The widget uses /api/tutor for all AI responses. It prefers window.claudeTutor
 * if available, else calls the API directly.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // Seed questions per topic — tiered ladder
  //
  // Each topic supports up to three depth tiers:
  //   surface       — what & how (concrete, factual, recognition)
  //   conceptual    — why & trade-offs (mental models, second-order)
  //   philosophical — what it means for sovereignty / society / values
  //
  // A topic may provide any subset of tiers. A flat array (legacy form) is
  // treated as { conceptual: [...] }. Tiers with no questions hide their tab.
  //
  // All 15 topics now ship with full 3-tier coverage. Surface questions
  // are concrete and factual (good entry points). Philosophical questions
  // pull on the user's "risks people don't see" frame — sovereignty,
  // inheritance, governance, the ethics of immutability and privacy.
  // ─────────────────────────────────────────────────────────────────────────

  const TIERS = ['surface', 'conceptual', 'philosophical'];
  const TIER_LABELS = {
    surface:       { label: 'Quick',     hint: 'What & how',                  emoji: '🌱' },
    conceptual:    { label: 'Deeper',    hint: 'Why & trade-offs',            emoji: '🧭' },
    philosophical: { label: 'Why it matters', hint: 'Implications for sovereignty', emoji: '⭐' },
  };

  const SEED_QUESTIONS = {
    // ── PILOT TOPICS (full 3-tier coverage) ────────────────────────────────

    'private-key': {
      surface: [
        'In one sentence, what is a private key?',
        'What does a private key look like — a word, a number, a file?',
        'Where does your wallet actually store your private key?',
      ],
      conceptual: [
        'What do you think makes a private key "private"?',
        'If you lost your private key, what would happen to your Bitcoin?',
        'How is a private key fundamentally different from a password?',
      ],
      philosophical: [
        'If owning Bitcoin equals knowing a number, what does ownership really mean?',
        'A private key has no government, no court, no appeal. Is that a feature or a flaw?',
        'Should the right to hold a private key be considered a basic human right?',
      ],
    },

    'custody': {
      surface: [
        'Who holds the keys when your Bitcoin sits on an exchange?',
        'What is the difference between an exchange wallet and a hardware wallet?',
        'What does "self-custody" mean in plain English?',
      ],
      conceptual: [
        'What does it mean to truly "own" your Bitcoin?',
        'What are the trade-offs between keeping Bitcoin on an exchange vs. self-custody?',
        'How would you think about securing Bitcoin you don\'t plan to touch for 10 years?',
      ],
      philosophical: [
        'If self-custody requires constant vigilance, who is sovereignty actually for?',
        'What does inheritance look like when "the password is the asset"?',
        'Is convenience the price of trusting a custodian — or is it the trap?',
      ],
    },

    'money': {
      surface: [
        'Name three things that have been used as money in the last 5,000 years.',
        'What is the difference between cash and a bank balance?',
        'Roughly, how much new money does the U.S. create each year?',
      ],
      conceptual: [
        'What properties do you think ideal money should have?',
        'How does Bitcoin\'s supply schedule differ from how fiat currency is issued?',
        'What is inflation, and how does it affect your savings over time?',
      ],
      philosophical: [
        'If money is information about who is owed what, who should control that information?',
        'What does it say about a society when its money loses 50% of its value in 20 years?',
        'Is "neutral money" possible — and would humans want it if it were?',
      ],
    },

    'cryptography': {
      surface: [
        'What does "encryption" do in one sentence?',
        'Name two things on the internet you use every day that depend on cryptography.',
        'What is the difference between a hash and an encryption?',
      ],
      conceptual: [
        'Why do you think cryptography is essential for a trustless financial system?',
        'What makes a mathematical function "one-way"?',
        'How does a digital signature prove you authorized a transaction without revealing your key?',
      ],
      philosophical: [
        'If math can replace trust in institutions, what should institutions do instead?',
        'Cryptography lets individuals defend things from any government. Is that good for democracy?',
        'When code becomes the final arbiter, who is responsible for outcomes?',
      ],
    },

    'mining': {
      surface: [
        'What is a Bitcoin miner — a person, a machine, or both?',
        'Roughly how often does a new Bitcoin block get added?',
        'Where does the energy that miners use come from?',
      ],
      conceptual: [
        'Why do you think "work" is required to add transactions to Bitcoin\'s chain?',
        'What would happen to Bitcoin if mining stopped entirely?',
        'How does difficulty adjustment keep blocks coming every ~10 minutes?',
      ],
      philosophical: [
        'Bitcoin mining converts energy into security. Should energy ever be "wasted" on this?',
        'If mining migrates to where energy is cheapest, what does that imply about energy markets?',
        'Is proof-of-work a defense of human time itself — or just a clever lock?',
      ],
    },

    // ── REMAINING TOPICS (full 3-tier coverage) ───────────────────────────

    'public-key': {
      surface: [
        'In one sentence, what is a public key?',
        'What\'s the relationship between a public key and a Bitcoin address — are they the same?',
        'Where would you actually use or share a public key?',
      ],
      conceptual: [
        'Why do you think Bitcoin uses two keys — public and private?',
        'Is it safe to share your public key with anyone? Why or why not?',
        'How can someone verify you own Bitcoin without you revealing your private key?',
      ],
      philosophical: [
        'If a public key proves who can spend, what does identity even mean here?',
        'Broadcasting a public key makes you traceable forever. Is that a fair trade for being verifiable?',
        'Could a society function on public-key identity instead of government IDs?',
      ],
    },

    'bitcoin-address': {
      surface: [
        'How does a Bitcoin address typically look — letters, numbers, both?',
        'Where can you find your address: in your wallet app, on the blockchain, both?',
        'What\'s the safest way to share an address with someone paying you?',
      ],
      conceptual: [
        'What do you think a Bitcoin address actually represents?',
        'Why might you want to use a different address for each transaction?',
        'How does an address prove ownership without exposing your private key?',
      ],
      philosophical: [
        'An address is a one-way invitation to receive value. Why does that asymmetry matter?',
        'If addresses are public, can you really hide wealth — or only delay being seen?',
        'Should addresses be human-readable like usernames, or is the friction the point?',
      ],
    },

    'transactions': {
      surface: [
        'Roughly how long until a Bitcoin transaction is "final"?',
        'What fee do you typically pay to send a Bitcoin transaction?',
        'Once broadcast, can you cancel a Bitcoin transaction?',
      ],
      conceptual: [
        'What do you think happens to a transaction before it gets confirmed?',
        'Why do you think Bitcoin requires fees — what problem do they solve?',
        'If transactions are public, how can users maintain any financial privacy?',
      ],
      philosophical: [
        'Transactions are public forever. Is permanent visibility a feature or a curse?',
        'A Bitcoin payment can\'t be reversed — even by mistake. Is that maturity or cruelty?',
        'Who actually wins when a payment can\'t be undone — the sender, the receiver, or society?',
      ],
    },

    'blockchain': {
      surface: [
        'Roughly how often does a new block get added to Bitcoin\'s chain?',
        'What gets stored in a block — transactions, balances, both?',
        'About how many copies of the Bitcoin blockchain exist worldwide?',
      ],
      conceptual: [
        'What do you think makes a chain of blocks harder to change than a single record?',
        'Why does Bitcoin need thousands of nodes all holding the same copy?',
        'If someone wanted to rewrite old transactions, what would they need to do?',
      ],
      philosophical: [
        'A blockchain replaces a single source of truth with thousands. Is that more honest, or just harder to corrupt?',
        'If history can\'t be rewritten, what does that change about how we record other things — contracts, votes, identity?',
        'Does an immutable ledger serve memory, or punish change?',
      ],
    },

    'lightning-network': {
      surface: [
        'Is a Lightning payment recorded on the Bitcoin blockchain?',
        'Roughly how fast is a Lightning payment compared to an on-chain one?',
        'What happens when you "open" a Lightning channel?',
      ],
      conceptual: [
        'What problem do you think the Lightning Network solves that Bitcoin\'s base layer can\'t?',
        'How does a payment channel relate to an ordinary Bitcoin transaction?',
        'What happens to the money in a Lightning channel if someone goes offline forever?',
      ],
      philosophical: [
        'Lightning trades some of Bitcoin\'s auditability for speed. Is that the right trade?',
        'If most payments move off-chain, what is the base layer actually for?',
        'Does a payment network need to be visible to be trusted?',
      ],
    },

    'wallets': {
      surface: [
        'What does a Bitcoin wallet need from you to send a payment?',
        'Is your wallet\'s balance stored in the wallet, or on the blockchain?',
        'What\'s the difference between a wallet you control and an exchange account?',
      ],
      conceptual: [
        'What do you think a Bitcoin wallet actually stores?',
        'What\'s the real security difference between a hot wallet and a cold wallet?',
        'Why might one seed phrase be able to generate thousands of different addresses?',
      ],
      philosophical: [
        'A wallet is just a key — everything else is an interface. Why do most apps obscure that?',
        'If your wallet UI is helpful enough, do you ever really learn Bitcoin?',
        'Should "easy" wallets exist when convenience hides what\'s actually at stake?',
      ],
    },

    'seed-phrase': {
      surface: [
        'How many words is a typical Bitcoin seed phrase?',
        'Do you need your seed phrase every time you send Bitcoin?',
        'Could two different people generate the same seed phrase by accident?',
      ],
      conceptual: [
        'Why do you think Bitcoin uses 12 or 24 words instead of a password?',
        'What is the risk of storing your seed phrase digitally?',
        'How does one seed phrase generate all of your wallet\'s keys?',
      ],
      philosophical: [
        'Twelve words = your bank, your vault, your inheritance. What does that change about how you treat words?',
        'If forgetting your phrase costs you everything, what does Bitcoin demand of human memory?',
        'Should writing a seed phrase down feel sacred, or routine?',
      ],
    },

    'privacy': {
      surface: [
        'Are Bitcoin transactions visible to anyone who looks?',
        'What information about you can a Bitcoin address reveal on its own?',
        'Are addresses linked to your real name by default?',
      ],
      conceptual: [
        'Are Bitcoin transactions private, public, or something in between?',
        'How could someone potentially link your Bitcoin addresses to your real identity?',
        'What steps could you take to improve your financial privacy with Bitcoin?',
      ],
      philosophical: [
        'If financial privacy must be earned and maintained, who actually gets to have it?',
        'A surveillance-capable Bitcoin and a privacy-respecting Bitcoin are the same code. What does that say about technology and intent?',
        'Should the right to transact privately exist for everyone — or only those who can afford the tools?',
      ],
    },

    'models': {
      surface: [
        'Name a model that worked great in one decade and broke in the next.',
        'If a model fits past data perfectly but predicts nothing future, what was it actually doing?',
        'Why might a model that explains price with one variable be missing something?',
      ],
      conceptual: [
        'A model can be a useful way to think and a bad way to predict. How would you tell which a given model is?',
        'PlanB\'s S2F price model fit Bitcoin through 2020 and broke after. What\'s a fair test of "did it work"?',
        'If markets price in known information (like a halving schedule), what\'s left for the halving event itself to do to price?',
      ],
      philosophical: [
        'When a model you wanted to believe stops working, what changes — your beliefs, or your interpretation of the data?',
        'Is a broken model still useful as a way to think? When?',
        'If someone shows you a chart of in-sample fit, what\'s the question you should ask before being convinced?',
      ],
    },

    'dca': {
      surface: [
        'If you DCA into an asset that ends up worth less than when you started, what happened?',
        'Name one thing this calculator doesn\'t account for that would change your real returns.',
        'Why might a chart of "stack value over time" look very different from a chart of "price over time"?',
      ],
      conceptual: [
        'DCA is supposed to reduce timing risk. What kind of risk does it not reduce?',
        'You picked a year Bitcoin was around for. What does that selection alone do to the returns you see?',
        'If lump-summing at the start beat DCA in your scenario, what does that tell you about DCA\'s actual job?',
      ],
      philosophical: [
        'Looking at the worst drawdown in your simulation: be honest — would you have kept buying through it, or stopped?',
        'A backtest tells you what would have happened. Why is that different from what will happen?',
        'If "time in the market beats timing the market" is true, why does it feel so hard to act on?',
      ],
    },

    'bitcoin-key-generator-visual': {
      surface: [
        'What inputs go into generating a Bitcoin key?',
        'Roughly how big is the number that becomes a private key?',
        'Does the same seed always generate the same key?',
      ],
      conceptual: [
        'How many possible private keys exist — and what does that number actually mean?',
        'Why is entropy (randomness) so critical in the first step of key generation?',
        'Changing one bit in your entropy changed all downstream values — what does that tell you?',
      ],
      philosophical: [
        'A private key is just a really big number. Why does that feel disturbing — or freeing?',
        'If anyone could theoretically guess your key, why does the universe-sized search space make Bitcoin safe?',
        'Does math-based security feel different from rule-based security? Should it?',
      ],
    },

    'default': {
      surface: [
        'What\'s one thing you\'d want to know about Bitcoin in the next 60 seconds?',
        'If you had to teach someone Bitcoin in five minutes, where would you start?',
        'What\'s the simplest Bitcoin question that nobody seems to answer well?',
      ],
      conceptual: [
        'What brought you to Bitcoin Sovereign Academy today?',
        'What\'s one thing about Bitcoin that still feels unclear to you?',
        'If you could understand one Bitcoin concept deeply, which would it be?',
      ],
      philosophical: [
        'If Bitcoin is the answer, what\'s the question you\'re really asking?',
        'Why do people who understand Bitcoin often struggle to explain it?',
        'What would learning Bitcoin teach you that wasn\'t about Bitcoin?',
      ],
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CSS (injected once)
  // ─────────────────────────────────────────────────────────────────────────

  const CSS = `
.reflect-widget-inner {
  background: #1e1e2e;
  border: 1px solid rgba(247, 147, 26, 0.45); /* WCAG 1.4.11: raised from 0.25 → 0.45 (~3.1:1) */
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin: 2rem 0;
  font-family: inherit;
  color: #e0e0e0;
}
.reflect-widget-inner h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f7931a;
  letter-spacing: 0.02em;
}
.reflect-widget-inner .rw-subtitle {
  margin: 0 0 1.25rem;
  font-size: 0.85rem;
  color: #a0a0a0; /* WCAG 1.4.3: was #888 (4.63:1 marginal) → #a0a0a0 (~6:1) */
}
.reflect-widget-tiers {
  display: flex;
  gap: 0.5rem;
  margin: 0 0 1rem;
  flex-wrap: wrap;
}
.reflect-widget-tier-btn {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(247, 147, 26, 0.35);
  color: #c0c0c0;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;
}
.reflect-widget-tier-btn:hover {
  background: rgba(247, 147, 26, 0.1);
  border-color: rgba(247, 147, 26, 0.55);
  color: #fff;
}
.reflect-widget-tier-btn:focus-visible {
  outline: 3px solid #f7931a;
  outline-offset: 2px;
}
.reflect-widget-tier-btn[aria-pressed="true"] {
  background: rgba(247, 147, 26, 0.18);
  border-color: #f7931a;
  color: #fff;
}
.reflect-widget-tier-btn .rw-tier-hint {
  font-weight: 400;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-left: 0.15rem;
}
.reflect-widget-tier-btn[aria-pressed="true"] .rw-tier-hint {
  color: #d4a060;
}
.reflect-widget-seeds {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
}
.reflect-widget-seeds li { display: contents; }
.reflect-widget-seed-btn {
  text-align: left;
  background: rgba(247, 147, 26, 0.06);
  border: 1px solid rgba(247, 147, 26, 0.5); /* WCAG 1.4.11: was 0.2 (~1.5:1) → 0.5 (~3:1) */
  border-radius: 10px;
  padding: 0.8rem 1rem;
  color: #d4d4d4;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, transform 0.12s;
  line-height: 1.45;
  min-height: 44px; /* WCAG 2.5.5 touch target */
}
.reflect-widget-seed-btn:hover {
  background: rgba(247, 147, 26, 0.12);
  border-color: rgba(247, 147, 26, 0.7);
  transform: translateX(3px);
  color: #fff;
}
.reflect-widget-seed-btn:active { transform: translateX(1px); }
.reflect-widget-seed-btn:focus-visible {
  outline: 3px solid #f7931a;
  outline-offset: 2px;
}
.reflect-widget-seed-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.reflect-widget-input-row {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.reflect-widget-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.35); /* WCAG 1.4.11: was 0.12 (~2:1) → 0.35 (~3.1:1) */
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #e0e0e0;
  font-size: 0.95rem;
  transition: border-color 0.18s, box-shadow 0.18s;
  font-family: inherit;
  min-height: 44px;
}
.reflect-widget-input::placeholder { color: #9ca3af; } /* was #666 (2.47:1) → #9ca3af (~5.2:1) */
.reflect-widget-input:focus-visible {
  outline: none;
  border-color: #f7931a;
  box-shadow: 0 0 0 3px rgba(247, 147, 26, 0.35);
}
.reflect-widget-send-btn {
  background: #f7931a;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.2rem;
  color: #1a1a1a; /* WCAG 1.4.3: white (2.30:1) → #1a1a1a (~9:1) */
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s;
  white-space: nowrap;
  min-height: 44px;
}
.reflect-widget-send-btn:hover { background: #ffa733; transform: translateY(-1px); }
.reflect-widget-send-btn:focus-visible {
  outline: 3px solid #1a1a1a;
  outline-offset: 2px;
}
.reflect-widget-send-btn:disabled {
  background: #555;
  color: #e0e0e0; /* adequate contrast on dark gray */
  cursor: not-allowed;
  transform: none;
}
.reflect-widget-response {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  min-height: 48px;
  font-size: 0.92rem;
  line-height: 1.65;
  color: #e0e0e0;
  display: none;
  white-space: pre-wrap;
  word-break: break-word;
}
.reflect-widget-response.visible { display: block; }
.reflect-widget-response .rw-question {
  color: #f7931a;
  font-style: italic;
  margin-bottom: 0.75rem;
  font-size: 0.88rem;
  display: block;
}
.reflect-widget-response .rw-answer { color: #e0e0e0; }
/* Streaming cursor — non-text so SR ignores it (was content: '▌' which SR reads) */
.reflect-widget-response.rw-streaming .rw-answer::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 1em;
  vertical-align: -2px;
  margin-left: 3px;
  background: #f7931a;
  animation: rw-blink 0.7s step-end infinite;
}
@keyframes rw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
@media (prefers-reduced-motion: reduce) {
  .reflect-widget-response.rw-streaming .rw-answer::after { animation: none; opacity: 1; }
  .reflect-widget-seed-btn:hover { transform: none; }
  .reflect-widget-send-btn:hover { transform: none; }
}
.reflect-widget-error {
  color: #ff8a8a; /* was #ff6b6b; slight lift for comfort on dark bg */
  font-size: 0.9rem;
  padding: 0.5rem 0;
  display: none;
}
.reflect-widget-error.visible { display: block; }
.reflect-widget-clear-btn {
  background: none;
  border: none;
  color: #9ca3af; /* WCAG 1.4.3: was #666 (2.85:1) → #9ca3af (~5.2:1) */
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  text-decoration: underline;
  transition: color 0.15s;
  min-height: 44px;
}
.reflect-widget-clear-btn:hover { color: #e0e0e0; }
.reflect-widget-clear-btn:focus-visible {
  outline: 2px solid #f7931a;
  outline-offset: 2px;
  border-radius: 4px;
}
/* Screen-reader-only helper */
.rw-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
`;

  function injectStyles() {
    if (document.getElementById('reflect-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'reflect-widget-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Widget renderer
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Resolve a topic's tier map.
   * Handles legacy flat-array form by wrapping it as { conceptual: [...] }.
   * Always returns an object with at least one tier populated.
   */
  function getTierMap(topic) {
    const normalized = (topic || '').toLowerCase().replace(/\s+/g, '-');
    const entry = SEED_QUESTIONS[normalized] || SEED_QUESTIONS['default'];
    if (Array.isArray(entry)) return { conceptual: entry };
    return entry;
  }

  /** Which tiers actually have questions for a topic, in canonical order. */
  function availableTiers(topic) {
    const map = getTierMap(topic);
    return TIERS.filter((t) => Array.isArray(map[t]) && map[t].length > 0);
  }

  function getQuestions(topic, tier) {
    const map = getTierMap(topic);
    if (tier && Array.isArray(map[tier])) return map[tier];
    // Pick first available tier
    for (const t of TIERS) if (Array.isArray(map[t]) && map[t].length > 0) return map[t];
    return SEED_QUESTIONS['default'].conceptual;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Render a minimal markdown subset to safe HTML.
   * Escapes input BEFORE applying markdown transformations so tutor responses
   * cannot inject arbitrary HTML even though the API is trusted (defense-in-depth).
   */
  function renderMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.88em">$1</code>');
  }

  // Unique id counter so multiple widgets on one page get distinct ARIA ids
  let widgetSeq = 0;

  function buildWidget(container) {
    const topic = container.dataset.topic || 'default';
    const learnerPath = container.dataset.path || 'curious';
    const title = container.dataset.title || 'Reflect';
    const tiers = availableTiers(topic);              // e.g., ['surface','conceptual','philosophical']
    let currentTier = tiers[0];                        // start at the lightest available
    const uid = `rw-${++widgetSeq}`;
    const titleId = `${uid}-title`;
    const statusId = `${uid}-status`;
    const inputId = `${uid}-input`;

    const inner = document.createElement('section');
    inner.className = 'reflect-widget-inner';
    inner.setAttribute('role', 'region');
    inner.setAttribute('aria-labelledby', titleId);
    // Build tier-tab markup only when a topic actually has multiple tiers
    const tierTabsHtml = tiers.length > 1
      ? `<div class="reflect-widget-tiers" role="group" aria-label="Reflection depth">
           ${tiers.map((t) => {
             const meta = TIER_LABELS[t];
             return `<button type="button" class="reflect-widget-tier-btn"
                             data-tier="${t}"
                             aria-pressed="${t === currentTier ? 'true' : 'false'}"
                             title="${escapeHtml(meta.hint)}">
                       <span aria-hidden="true">${meta.emoji}</span>${escapeHtml(meta.label)}
                       <span class="rw-tier-hint">— ${escapeHtml(meta.hint)}</span>
                     </button>`;
           }).join('')}
         </div>`
      : '';
    inner.innerHTML = `
      <h3 id="${titleId}">${escapeHtml(title)}</h3>
      <p class="rw-subtitle">Choose a question to explore — or ask your own.</p>
      ${tierTabsHtml}
      <ul class="reflect-widget-seeds" aria-label="Suggested reflection questions"></ul>
      <div class="reflect-widget-input-row">
        <label for="${inputId}" class="rw-sr-only">Ask your own reflection question</label>
        <input id="${inputId}" class="reflect-widget-input" type="text"
               placeholder="Ask your own question…"
               maxlength="500" autocomplete="off" />
        <button type="button" class="reflect-widget-send-btn">Ask →</button>
      </div>
      <div class="reflect-widget-error" role="alert"></div>
      <div class="reflect-widget-response" aria-busy="false">
        <span class="rw-question"></span>
        <span class="rw-answer"></span>
      </div>
      <div id="${statusId}" class="rw-sr-only" role="status" aria-live="polite"></div>
      <button type="button" class="reflect-widget-clear-btn" style="display:none">Start over</button>
    `;

    const seedsContainer = inner.querySelector('.reflect-widget-seeds');

    function renderSeeds() {
      seedsContainer.innerHTML = '';
      const questions = getQuestions(topic, currentTier);
      questions.forEach((q) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'reflect-widget-seed-btn';
        btn.textContent = q;
        btn.addEventListener('click', () => sendQuestion(q));
        li.appendChild(btn);
        seedsContainer.appendChild(li);
      });
    }
    renderSeeds();

    // Tier tab handlers
    inner.querySelectorAll('.reflect-widget-tier-btn').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const newTier = tabBtn.dataset.tier;
        if (newTier === currentTier) return;
        currentTier = newTier;
        inner.querySelectorAll('.reflect-widget-tier-btn').forEach((b) => {
          b.setAttribute('aria-pressed', b === tabBtn ? 'true' : 'false');
        });
        renderSeeds();
        // Optional analytics — no-op if bsaAnalytics isn't loaded
        if (window.bsaAnalytics && typeof window.bsaAnalytics.track === 'function') {
          window.bsaAnalytics.track('reflect_tier_selected', { topic, tier: currentTier, learnerPath });
        }
      });
    });

    container.appendChild(inner);

    const inputEl = inner.querySelector('.reflect-widget-input');
    const sendBtn = inner.querySelector('.reflect-widget-send-btn');
    const responseEl = inner.querySelector('.reflect-widget-response');
    const questionSpan = inner.querySelector('.rw-question');
    const answerSpan = inner.querySelector('.rw-answer');
    const errorEl = inner.querySelector('.reflect-widget-error');
    const clearBtn = inner.querySelector('.reflect-widget-clear-btn');
    const statusEl = inner.querySelector(`#${statusId}`);

    // Widget-local conversation history (separate from global tutor history)
    let widgetHistory = [];

    function announce(msg) {
      // Clear then set so SR re-reads even if text is identical
      statusEl.textContent = '';
      setTimeout(() => { statusEl.textContent = msg; }, 50);
    }

    function setError(msg) {
      // role="alert" on errorEl makes this announce automatically
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
    function clearError() {
      errorEl.classList.remove('visible');
      errorEl.textContent = '';
    }

    function setLoading(loading) {
      sendBtn.disabled = loading;
      sendBtn.textContent = loading ? '…' : 'Ask →';
      sendBtn.setAttribute('aria-label', loading ? 'Sending question, please wait' : 'Send question');
      responseEl.setAttribute('aria-busy', String(loading));
      inner.querySelectorAll('.reflect-widget-seed-btn').forEach((b) => {
        b.disabled = loading;
      });
    }

    async function sendQuestion(question) {
      if (!question.trim()) return;
      clearError();
      setLoading(true);
      announce('Tutor is thinking…');

      // Track which tier the learner is actually engaging at — feeds B4 metrics.
      if (window.bsaAnalytics && typeof window.bsaAnalytics.track === 'function') {
        window.bsaAnalytics.track('reflect_question_asked', {
          topic, tier: currentTier, learnerPath,
          questionLen: question.length,
          // Was this one of our seed questions, or did the learner type their own?
          fromSeed: getQuestions(topic, currentTier).includes(question),
        });
      }

      // Show the question being asked
      questionSpan.textContent = question;
      answerSpan.innerHTML = '';
      responseEl.className = 'reflect-widget-response visible rw-streaming';
      responseEl.setAttribute('aria-busy', 'true');
      clearBtn.style.display = 'block';

      // Collapse seed buttons while responding
      seedsContainer.style.display = 'none';

      // Build context from widget attributes + page URL
      const pageCtx = {
        type: topic === 'default' ? 'general' : 'demo',
        topic: topic,
        demo: topic,
        learningPath: learnerPath,
      };

      let fullAnswer = '';

      try {
        // Prefer global claudeTutor streaming; fall back to direct fetch
        if (window.claudeTutor && typeof window.claudeTutor._callAPI === 'function') {
          // Use the shared service's internal streaming but with widget's own history
          // We call the endpoint directly to keep history isolated
          fullAnswer = await streamFromAPI(question, pageCtx, widgetHistory, (chunk) => {
            fullAnswer += chunk;
            answerSpan.innerHTML = renderMarkdown(fullAnswer);
          });
        } else {
          fullAnswer = await streamFromAPI(question, pageCtx, widgetHistory, (chunk) => {
            fullAnswer += chunk;
            answerSpan.innerHTML = renderMarkdown(fullAnswer);
          });
        }

        // Save to widget-local history
        widgetHistory.push({ role: 'user', content: question });
        widgetHistory.push({ role: 'assistant', content: fullAnswer });
        // Keep only last 6 exchanges (12 messages) in widget
        if (widgetHistory.length > 12) widgetHistory = widgetHistory.slice(-12);

        responseEl.classList.remove('rw-streaming');
        responseEl.setAttribute('aria-busy', 'false');
        answerSpan.innerHTML = renderMarkdown(fullAnswer);

        // Announce completion with a short preview (SR will read this)
        const preview = fullAnswer.replace(/\s+/g, ' ').trim().slice(0, 160);
        announce(`Response ready. ${preview}${fullAnswer.length > 160 ? '…' : ''}`);

      } catch (err) {
        responseEl.classList.remove('rw-streaming');
        responseEl.setAttribute('aria-busy', 'false');
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
        seedsContainer.style.display = '';
      }
    }

    // Input send handlers
    sendBtn.addEventListener('click', () => sendQuestion(inputEl.value.trim()));
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendQuestion(inputEl.value.trim());
        inputEl.value = '';
      }
    });

    // Clear
    clearBtn.addEventListener('click', () => {
      widgetHistory = [];
      questionSpan.textContent = '';
      answerSpan.innerHTML = '';
      responseEl.className = 'reflect-widget-response';
      responseEl.setAttribute('aria-busy', 'false');
      clearBtn.style.display = 'none';
      clearError();
      announce('Conversation cleared. Choose a new question.');
      // Return focus to the first seed button so SR users know where they are
      const firstSeed = inner.querySelector('.reflect-widget-seed-btn');
      if (firstSeed) firstSeed.focus();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Direct API call (used by widget — keeps widget history isolated)
  // ─────────────────────────────────────────────────────────────────────────

  async function streamFromAPI(message, context, history, onChunk) {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.slice(-12),
        context,
        persona: loadPersona(),
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Tutor unavailable (${response.status}): ${text.slice(0, 120)}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          try {
            const event = JSON.parse(jsonStr);
            if (event.type === 'text' && event.content) {
              fullText += event.content;
              onChunk(event.content);
            } else if (event.type === 'error') {
              throw new Error(event.message || 'API error');
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } finally {
      reader.cancel().catch(() => {});
    }

    return fullText;
  }

  function loadPersona() {
    try {
      return (
        localStorage.getItem('bsa_persona') ||
        localStorage.getItem('userPersona') ||
        localStorage.getItem('persona') ||
        'curious'
      );
    } catch {
      return 'curious';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Auto-initialize all .reflect-widget elements
  // ─────────────────────────────────────────────────────────────────────────

  function initAll() {
    injectStyles();
    document.querySelectorAll('.reflect-widget').forEach((el) => {
      if (el.dataset.rwInitialized) return;
      el.dataset.rwInitialized = 'true';
      buildWidget(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Support dynamic insertion (MutationObserver)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.classList.contains('reflect-widget') && !node.dataset.rwInitialized) {
          node.dataset.rwInitialized = 'true';
          buildWidget(node);
        }
        node.querySelectorAll('.reflect-widget:not([data-rw-initialized])').forEach((el) => {
          el.dataset.rwInitialized = 'true';
          buildWidget(el);
        });
      }
    }
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  // Expose for manual re-init if needed
  window.ReflectWidget = { init: initAll };
})();
