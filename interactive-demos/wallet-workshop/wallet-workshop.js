/**
 * Wallet Workshop - Interactive Bitcoin Wallet Education
 * Step-by-step journey: Entropy → Seed → Private Keys → Public Keys → Addresses
 * Inspired by learnmeabitcoin.com methodology
 */

class WalletWorkshop {
  constructor() {
    console.log('  → Creating WalletWorkshop instance...');
    this.currentStep = 0;
    this.entropy = '';
    this.seedPhrase = [];
    this.masterKey = '';
    this.privateKeys = [];
    this.publicKeys = [];
    this.addresses = [];

    // Difficulty settings
    this.difficulty = 'guided'; // guided, interactive, challenge, expert
    console.log('  → Properties initialized');

    // BIP39 wordlist (simplified for demo - in production use full 2048 words)
    this.wordlist = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
      'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
      'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
      'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
      'hello', 'fortune', 'garden', 'gauge', 'general', 'immune', 'invest', 'jungle'
    ];

    this.steps = [
      { id: 'entropy', title: 'Generate Entropy', icon: '🎲' },
      { id: 'seed', title: 'Create Seed Phrase', icon: '🌱' },
      { id: 'private', title: 'Derive Private Keys', icon: '🔐' },
      { id: 'public', title: 'Generate Public Keys', icon: '🔓' },
      { id: 'address', title: 'Create Addresses', icon: '📬' }
    ];

    console.log('  → Calling init()...');
    this.init();
    console.log('  → WalletWorkshop constructor complete');
  }

  init() {
    console.log('  → init() started');
    this.renderWorkshop();
    console.log('  → renderWorkshop() complete');
    this.attachEventListeners();
    console.log('  → attachEventListeners() complete');
  }

  renderWorkshop() {
    console.log('  → renderWorkshop() called');
    const container = document.getElementById('wallet-workshop-container');
    if (!container) {
      console.error('  ❌ Container not found!');
      return;
    }
    console.log('  → Container found:', container);

    container.innerHTML = `
      <div class="wallet-workshop">
        <!-- Difficulty Selector -->
        <div class="difficulty-selector">
          <h3>Choose Your Learning Mode</h3>
          <div class="difficulty-buttons">
            <button class="difficulty-btn active" data-difficulty="guided">
              🎓 Guided
              <small>Step-by-step with explanations</small>
            </button>
            <button class="difficulty-btn" data-difficulty="interactive">
              🔧 Interactive
              <small>Hands-on with manual inputs</small>
            </button>
            <button class="difficulty-btn" data-difficulty="challenge">
              🏆 Challenge
              <small>Quiz questions between steps</small>
            </button>
            <button class="difficulty-btn" data-difficulty="expert">
              ⚡ Expert
              <small>Full control and customization</small>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-steps">
            ${this.steps.map((step, idx) => `
              <div class="progress-step ${idx === 0 ? 'active' : ''}" data-step="${idx}">
                <div class="step-icon">${step.icon}</div>
                <div class="step-title">${step.title}</div>
                <div class="step-number">${idx + 1}</div>
              </div>
            `).join('<div class="progress-connector"></div>')}
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content" id="step-content">
          ${this.renderStep(0)}
        </div>

        <!-- Navigation -->
        <div class="step-navigation">
          <button class="nav-btn" id="prev-btn" disabled>
            ← Previous
          </button>
          <button class="nav-btn primary" id="next-btn">
            Next Step →
          </button>
        </div>
      </div>
    `;

    this.addStyles();
  }

  renderStep(stepIndex) {
    const step = this.steps[stepIndex];

    switch(step.id) {
      case 'entropy':
        return this.renderEntropyStep();
      case 'seed':
        return this.renderSeedStep();
      case 'private':
        return this.renderPrivateKeyStep();
      case 'public':
        return this.renderPublicKeyStep();
      case 'address':
        return this.renderAddressStep();
      default:
        return '';
    }
  }

  renderEntropyStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🎲 Step 1: Generate Entropy (Randomness)</h2>
          <p class="step-subtitle">Everything starts with a random number. The more random, the more secure!</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 What is Entropy?</h3>
          <p>Entropy is randomness. Your wallet's security depends on generating a truly random number that nobody can guess.</p>

          <div class="security-comparison">
            <div class="security-bad">
              <strong>❌ Bad Entropy</strong>
              <div class="example">12345678 (predictable)</div>
              <small>Easy to guess = Insecure</small>
            </div>
            <div class="security-good">
              <strong>✅ Good Entropy</strong>
              <div class="example">8f3c2d9a... (random)</div>
              <small>Impossible to guess = Secure</small>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Generate Your Entropy</h3>
          <p>We need 256 bits (32 bytes) of randomness. Choose the path that matches how you’d like to experience it.</p>

          <div class="entropy-mode-toggle" role="tablist" aria-label="Entropy generation modes">
            <button class="toggle-btn active" data-mode="dice" role="tab" aria-selected="true">
              <span class="toggle-icon">🎲</span>
              <span>Roll Dice</span>
            </button>
            <button class="toggle-btn" data-mode="rng" role="tab" aria-selected="false">
              <span class="toggle-icon">⚡</span>
              <span>Visual RNG Demo</span>
            </button>
          </div>

          <div class="entropy-panels">
            <div class="entropy-panel" id="dice-panel" role="tabpanel" aria-hidden="false">
              <div class="entropy-generator">
                <div class="dice-roller">
                  <button class="dice-btn" id="roll-dice">
                    <div class="dice">🎲</div>
                    <div>Roll Dice</div>
                  </button>
                  <div class="roll-counter">
                    <div class="progress-bar">
                      <div class="progress-fill" id="entropy-progress" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">
                      <span id="entropy-bits">0</span> / 256 bits collected
                    </div>
                  </div>
                </div>

                <div class="entropy-display">
                  <h4>Binary Entropy</h4>
                  <div class="binary-output" id="binary-entropy">
                    Click dice to generate random bits...
                  </div>
                </div>

                <div class="entropy-hex" id="entropy-hex-display" style="display: none;">
                  <h4>Hexadecimal Representation</h4>
                  <code id="hex-entropy"></code>
                  <small>This 64-character hex string is your 256-bit entropy</small>
                </div>
              </div>
            </div>

            <div class="entropy-panel hidden" id="rng-panel" role="tabpanel" aria-hidden="true">
              <div class="entropy-rng">
                <p class="rng-tip">Click to generate a random 256-bit number faster.</p>
                <div class="iframe-wrapper">
                  <iframe
                    loading="lazy"
                    src="https://www.canva.com/design/DAG1HuFhFgQ/oJVTvLbrtgMiyXgXrMTbkA/view?embed"
                    allowfullscreen
                    allow="fullscreen"
                  ></iframe>
                </div>
                <p class="iframe-attrib">
                  <a
                    href="https://www.canva.com/design/DAG1HuFhFgQ/oJVTvLbrtgMiyXgXrMTbkA/view?utm_content=DAG1HuFhFgQ&amp;utm_campaign=designshare&amp;utm_medium=link2&amp;utm_source=sharebutton"
                    target="_blank"
                    rel="noopener"
                  >
                    Copy of Visualizing Bitcoin Private Seeds Data Generation
                  </a> by Dalia Platt
                </p>
                <p class="rng-tip">Explore the live demo to see another way hardware wallets gather unstoppable randomness.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>Why do we need 256 bits of randomness?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p>256 bits gives us 2^256 possible combinations - that's more than atoms in the observable universe!
            Even if every computer on Earth tried a billion combinations per second, it would take longer than
            the age of the universe to guess your key.</p>
            <p><strong>Security by numbers:</strong> The chance of someone guessing your key is approximately 1 in
            115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,936</p>
          </div>
        </div>
      </div>
    `;
  }

  renderSeedStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🌱 Step 2: Create Seed Phrase (BIP39)</h2>
          <p class="step-subtitle">Convert binary entropy into human-readable words</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 Why Use Words Instead of Numbers?</h3>
          <div class="comparison-grid">
            <div class="comparison-item">
              <strong>🔢 Raw Entropy</strong>
              <code style="font-size: 0.7rem; word-break: break-all;">
                ${this.entropy || '8f3c2d9a1b5e7c4f6a8d2e9b3c7f1a4d'}
              </code>
              <p>❌ Hard to write down<br>❌ Easy to make mistakes<br>❌ Not user-friendly</p>
            </div>
            <div class="comparison-item">
              <strong>📝 Seed Phrase</strong>
              <div style="margin: 0.5rem 0;">
                <span class="seed-word-chip">abandon</span>
                <span class="seed-word-chip">ability</span>
                <span class="seed-word-chip">able</span>
                <span class="seed-word-chip">about</span>
                ...
              </div>
              <p>✅ Easy to write down<br>✅ Has checksum<br>✅ Standard (BIP39)</p>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Your BIP39 Seed Phrase</h3>

          <div class="seed-conversion-visual">
            <div class="conversion-step">
              <div class="conv-label">Entropy (256 bits)</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">Add Checksum (8 bits)</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">Split into 11-bit chunks (24 chunks)</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">Map to BIP39 Wordlist</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">12 or 24 Words</div>
            </div>
          </div>

          <div class="seed-phrase-container">
            <div class="seed-options">
              <label>
                <input type="radio" name="seed-length" value="12" checked>
                12 words (128-bit entropy)
              </label>
              <label>
                <input type="radio" name="seed-length" value="24">
                24 words (256-bit entropy) - More secure
              </label>
            </div>

            <div class="seed-words-grid" id="seed-words-display">
              ${this.generateSeedWords(12).map((word, idx) => `
                <div class="seed-word-item">
                  <span class="word-number">${idx + 1}</span>
                  <span class="word-text">${word}</span>
                </div>
              `).join('')}
            </div>

            <div class="seed-actions">
              <button class="action-btn" id="regenerate-seed">
                🔄 Generate New Seed
              </button>
              <button class="action-btn" id="copy-seed">
                📋 Copy Seed Phrase
              </button>
            </div>
          </div>
        </div>

        <div class="warning-box">
          <h4>⚠️ Critical Security Warning</h4>
          <ul>
            <li>🔒 <strong>Never share</strong> your seed phrase with anyone</li>
            <li>📝 <strong>Write it down</strong> on paper, don't store digitally</li>
            <li>🏦 <strong>Store securely</strong> in a safe place (fireproof safe, safety deposit box)</li>
            <li>✅ <strong>Verify the order</strong> - word order matters!</li>
            <li>💀 <strong>Losing it = Losing Bitcoin</strong> - No recovery possible</li>
          </ul>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>What's the purpose of the checksum in BIP39?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p>The checksum helps detect errors when writing down or entering your seed phrase. If you make a mistake
            (like writing "abandon" instead of "ability"), the checksum will be invalid and wallets will reject it.</p>
            <p><strong>How it works:</strong> The last word of a 12-word seed phrase encodes both the final bits of
            entropy AND a checksum of all previous words. This makes it statistically impossible to accidentally create
            a valid but wrong seed phrase.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderPrivateKeyStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🔐 Step 3: Derive Private Keys (HD Wallets)</h2>
          <p class="step-subtitle">One seed → Infinite keys using hierarchical deterministic (HD) derivation</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 What is HD Key Derivation?</h3>
          <p>Your seed phrase can generate an unlimited number of private keys using a mathematical process called
          hierarchical deterministic (HD) derivation. This means you only need to backup ONE seed phrase!</p>
        </div>

        <div class="interactive-section">
          <h3>HD Derivation Tree</h3>

          <div class="derivation-tree">
            <div class="tree-level">
              <div class="tree-node master">
                <div class="node-icon">🌱</div>
                <div class="node-label">Seed Phrase</div>
                <div class="node-value">${this.seedPhrase.slice(0, 3).join(' ')}...</div>
              </div>
            </div>

            <div class="tree-arrow">↓ PBKDF2 + HMAC-SHA512</div>

            <div class="tree-level">
              <div class="tree-node">
                <div class="node-icon">🔑</div>
                <div class="node-label">Master Private Key</div>
                <div class="node-value">xprv9s21ZrQH...</div>
              </div>
            </div>

            <div class="tree-arrow">↓ Derivation Path: m/84'/0'/0'</div>

            <div class="tree-level multi">
              <div class="tree-node child">
                <div class="node-label">Account 0</div>
                <div class="node-path">m/84'/0'/0'/0/0</div>
              </div>
              <div class="tree-node child">
                <div class="node-label">Account 1</div>
                <div class="node-path">m/84'/0'/0'/0/1</div>
              </div>
              <div class="tree-node child">
                <div class="node-label">Account 2</div>
                <div class="node-path">m/84'/0'/0'/0/2</div>
              </div>
              <div class="tree-node child more">
                <div class="node-label">...</div>
                <div class="node-path">Infinite keys!</div>
              </div>
            </div>
          </div>

          <div class="derivation-path-selector">
            <h4>Choose Derivation Path</h4>
            <select id="derivation-standard" class="path-select">
              <option value="m/84'/0'/0'/0/0">m/84'/0'/0'/0/0 - Native SegWit (BIP84) ✅ Recommended</option>
              <option value="m/49'/0'/0'/0/0">m/49'/0'/0'/0/0 - Nested SegWit (BIP49)</option>
              <option value="m/44'/0'/0'/0/0">m/44'/0'/0'/0/0 - Legacy (BIP44)</option>
              <option value="custom">Custom Path (Expert Mode)</option>
            </select>

            <div class="path-explanation" id="path-explanation">
              <strong>Native SegWit (BIP84):</strong> Modern standard. Lowest fees, best privacy, full SegWit benefits.
              Creates addresses starting with "bc1q..."
            </div>
          </div>

          <div class="private-key-display">
            <h4>Your First Private Key</h4>
            <div class="key-container">
              <div class="key-format">
                <strong>Hex Format:</strong>
                <code id="private-key-hex">Loading...</code>
              </div>
              <div class="key-format">
                <strong>WIF Format:</strong>
                <code id="private-key-wif">Loading...</code>
              </div>
              <small>WIF = Wallet Import Format (includes network prefix and checksum)</small>
            </div>
          </div>
        </div>

        <div class="security-note">
          <h4>🛡️ Security Note</h4>
          <p>Your private key is like the password to your Bitcoin. Anyone with this key can spend your Bitcoin!</p>
          <ul>
            <li>✅ Generated mathematically from your seed</li>
            <li>✅ Never transmitted over the internet</li>
            <li>✅ Stays in your wallet software/hardware</li>
            <li>❌ Never share with anyone, ever!</li>
          </ul>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>Why use hierarchical derivation instead of generating random private keys?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p><strong>Backup simplicity:</strong> You only need to backup ONE seed phrase to recover ALL your private keys and addresses.</p>
            <p><strong>Deterministic:</strong> The same seed will always generate the same keys in the same order, making recovery reliable.</p>
            <p><strong>Privacy:</strong> You can generate a new address for every transaction while backing up only one seed.</p>
            <p><strong>Organization:</strong> You can create separate accounts for different purposes (savings, spending, business) all from one seed.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderPublicKeyStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🔓 Step 4: Generate Public Keys</h2>
          <p class="step-subtitle">One-way transformation: Private Key → Public Key using Elliptic Curve Cryptography</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 Elliptic Curve Magic</h3>
          <p>Bitcoin uses a special mathematical function that's easy to compute in one direction but impossible to reverse!</p>

          <div class="ecc-visual">
            <div class="ecc-equation">
              <div class="eq-part">
                <strong>Private Key</strong><br>
                <small>(256-bit number)</small>
              </div>
              <div class="eq-arrow">
                <span class="arrow-symbol">→</span>
                <small>Elliptic Curve<br>Multiplication</small>
              </div>
              <div class="eq-part">
                <strong>Public Key</strong><br>
                <small>(Point on curve)</small>
              </div>
            </div>

            <div class="one-way-demo">
              <div class="direction forward">
                <strong>✅ Easy</strong>
                <div>Private → Public</div>
                <small>Computationally simple</small>
              </div>
              <div class="direction backward">
                <strong>❌ Impossible</strong>
                <div>Public → Private</div>
                <small>Would take billions of years</small>
              </div>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Interactive Curve Visualization</h3>

          <div class="curve-container">
            <svg id="ecc-curve" width="100%" height="300" viewBox="0 0 500 300">
              <!-- Simplified elliptic curve visualization -->
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#f7931a;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#ff6b00;stop-opacity:1" />
                </linearGradient>
              </defs>

              <!-- Curve path -->
              <path d="M 50 250 Q 150 50, 250 150 T 450 250"
                    stroke="url(#curveGradient)"
                    stroke-width="3"
                    fill="none"/>

              <!-- Generator point G -->
              <circle cx="150" cy="100" r="6" fill="#4CAF50"/>
              <text x="150" y="85" text-anchor="middle" fill="#4CAF50" font-size="12">G (generator)</text>

              <!-- Public key point -->
              <circle cx="350" cy="200" r="6" fill="#2196F3" id="pubkey-point"/>
              <text x="350" y="220" text-anchor="middle" fill="#2196F3" font-size="12">Public Key</text>

              <!-- Equation -->
              <text x="250" y="280" text-anchor="middle" fill="#fff" font-size="14">
                Public Key = Private Key × G
              </text>
            </svg>

            <div class="curve-explanation">
              <p><strong>Bitcoin uses the secp256k1 curve</strong></p>
              <p>Your public key is a point on this curve, calculated by multiplying
              the generator point G by your private key.</p>
            </div>
          </div>

          <div class="pubkey-formats">
            <h4>Public Key Formats</h4>

            <div class="format-selector">
              <label>
                <input type="radio" name="pubkey-format" value="uncompressed">
                Uncompressed (65 bytes)
              </label>
              <label>
                <input type="radio" name="pubkey-format" value="compressed" checked>
                Compressed (33 bytes) ✅ Recommended
              </label>
            </div>

            <div class="pubkey-display">
              <div class="key-breakdown">
                <div class="breakdown-part">
                  <strong>Prefix:</strong>
                  <code>02</code>
                  <small>Even Y-coordinate</small>
                </div>
                <div class="breakdown-part full">
                  <strong>X-coordinate:</strong>
                  <code id="pubkey-x">a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1</code>
                </div>
              </div>

              <div class="format-comparison">
                <div class="format-option">
                  <strong>Uncompressed (04 + X + Y):</strong>
                  <small>04a3b5c7...X-coordinate...Y-coordinate... (130 hex chars)</small>
                  <p>❌ Larger, slower, not recommended</p>
                </div>
                <div class="format-option">
                  <strong>Compressed (02/03 + X):</strong>
                  <small>02a3b5c7...X-coordinate... (66 hex chars)</small>
                  <p>✅ Smaller, faster, modern standard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>Why can we drop the Y-coordinate in compressed format?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p>The elliptic curve equation is: y² = x³ + 7</p>
            <p>For any X-coordinate, there are only TWO possible Y-coordinates (one positive, one negative).
            We can indicate which one by using a prefix:</p>
            <ul>
              <li><strong>02:</strong> Even Y-coordinate</li>
              <li><strong>03:</strong> Odd Y-coordinate</li>
            </ul>
            <p>This saves 32 bytes while preserving all necessary information!</p>
          </div>
        </div>
      </div>
    `;
  }

  renderAddressStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>📬 Step 5: Create Bitcoin Addresses</h2>
          <p class="step-subtitle">Your public identity on the Bitcoin network - safe to share!</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 From Public Key to Address</h3>
          <p>Bitcoin addresses are derived from public keys through multiple hashing functions for security and error detection.</p>

          <div class="address-derivation-flow">
            <div class="flow-step">
              <div class="step-box">Public Key</div>
              <div class="step-arrow">↓ SHA-256</div>
            </div>
            <div class="flow-step">
              <div class="step-box">Hash</div>
              <div class="step-arrow">↓ RIPEMD-160</div>
            </div>
            <div class="flow-step">
              <div class="step-box">Hash160</div>
              <div class="step-arrow">↓ Add prefix</div>
            </div>
            <div class="flow-step">
              <div class="step-box">Versioned payload</div>
              <div class="step-arrow">↓ Checksum</div>
            </div>
            <div class="flow-step">
              <div class="step-box">With checksum</div>
              <div class="step-arrow">↓ Base58/Bech32</div>
            </div>
            <div class="flow-step">
              <div class="step-box final">Address ✅</div>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Choose Your Address Type</h3>

          <div class="address-types">
            <div class="address-type-card" data-type="segwit">
              <div class="card-header">
                <h4>Native SegWit (Bech32)</h4>
                <span class="recommended-badge">✅ Recommended</span>
              </div>
              <div class="card-body">
                <div class="address-example">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
                <ul class="benefits">
                  <li>✅ Lowest transaction fees (~40% cheaper)</li>
                  <li>✅ Enhanced error detection</li>
                  <li>✅ Case-insensitive (easier to type)</li>
                  <li>✅ Future-proof</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> bc1q<br>
                  <strong>Standard:</strong> BIP173<br>
                  <strong>Encoding:</strong> Bech32
                </div>
              </div>
            </div>

            <div class="address-type-card" data-type="taproot">
              <div class="card-header">
                <h4>Taproot (Bech32m)</h4>
                <span class="new-badge">🆕 Latest</span>
              </div>
              <div class="card-body">
                <div class="address-example">bc1pxwww0ct9ue7e8tdnlmug5m2tamfn7q06sahstg39ys4c9f3340qqxrdu9k</div>
                <ul class="benefits">
                  <li>✅ Maximum privacy</li>
                  <li>✅ Advanced scripting</li>
                  <li>✅ Schnorr signatures</li>
                  <li>✅ Multi-sig looks like single-sig</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> bc1p<br>
                  <strong>Standard:</strong> BIP341<br>
                  <strong>Encoding:</strong> Bech32m
                </div>
              </div>
            </div>

            <div class="address-type-card legacy" data-type="p2sh">
              <div class="card-header">
                <h4>P2SH (Nested SegWit)</h4>
                <span class="compatible-badge">Compatible</span>
              </div>
              <div class="card-body">
                <div class="address-example">3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy</div>
                <ul class="benefits">
                  <li>✅ Compatible with older wallets</li>
                  <li>✅ Multi-signature support</li>
                  <li>⚠️ Higher fees than native SegWit</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> 3<br>
                  <strong>Standard:</strong> BIP16<br>
                  <strong>Encoding:</strong> Base58Check
                </div>
              </div>
            </div>

            <div class="address-type-card legacy" data-type="legacy">
              <div class="card-header">
                <h4>Legacy (P2PKH)</h4>
                <span class="old-badge">⚠️ Legacy</span>
              </div>
              <div class="card-body">
                <div class="address-example">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</div>
                <ul class="benefits">
                  <li>✅ Maximum compatibility</li>
                  <li>❌ Highest fees</li>
                  <li>❌ No SegWit benefits</li>
                  <li>❌ Not recommended for new wallets</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> 1<br>
                  <strong>Standard:</strong> Original Bitcoin<br>
                  <strong>Encoding:</strong> Base58Check
                </div>
              </div>
            </div>
          </div>

          <div class="address-generator">
            <h4>Your Generated Address</h4>
            <select id="address-type-select" class="address-select">
              <option value="segwit" selected>Native SegWit (bc1q...) ✅</option>
              <option value="taproot">Taproot (bc1p...)</option>
              <option value="p2sh">P2SH (3...)</option>
              <option value="legacy">Legacy (1...)</option>
            </select>

            <div class="generated-address">
              <div class="address-output">
                <code id="final-address">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
              </div>
              <div class="address-actions">
                <button class="action-btn" id="copy-address">📋 Copy Address</button>
                <button class="action-btn" id="show-qr">📱 Show QR Code</button>
                <button class="action-btn" id="verify-address">✓ Verify Address</button>
              </div>
            </div>

            <div class="qr-container" id="qr-container" style="display: none;">
              <canvas id="address-qr"></canvas>
              <p>Scan this QR code to receive Bitcoin at this address</p>
            </div>
          </div>
        </div>

        <div class="success-summary">
          <h3>🎉 Congratulations! You've Created a Bitcoin Wallet!</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-icon">🎲</div>
              <div class="summary-label">Entropy</div>
              <div class="summary-value">256 bits of randomness</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">🌱</div>
              <div class="summary-label">Seed Phrase</div>
              <div class="summary-value">${this.seedPhrase.length} words</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">🔐</div>
              <div class="summary-label">Private Key</div>
              <div class="summary-value">Derived securely</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">🔓</div>
              <div class="summary-label">Public Key</div>
              <div class="summary-value">From elliptic curve</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">📬</div>
              <div class="summary-label">Address</div>
              <div class="summary-value">Ready to receive!</div>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h4>🎯 What You've Learned</h4>
          <ul class="learned-list">
            <li>✅ How random entropy becomes a secure wallet</li>
            <li>✅ Why seed phrases are the backup standard</li>
            <li>✅ How hierarchical deterministic derivation works</li>
            <li>✅ The mathematics behind public key cryptography</li>
            <li>✅ Different Bitcoin address formats and their tradeoffs</li>
          </ul>

          <h4>📚 Next Steps</h4>
          <ul class="next-list">
            <li>🔒 Practice securing your seed phrase (never online!)</li>
            <li>💸 Try the Transaction Builder to send Bitcoin</li>
            <li>🔗 Explore the UTXO Visualizer</li>
            <li>⚡ Learn about Lightning Network</li>
          </ul>
        </div>
      </div>
    `;
  }

  generateSeedWords(count) {
    // Simplified seed generation for demo
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(this.wordlist[Math.floor(Math.random() * this.wordlist.length)]);
    }
    this.seedPhrase = words;
    return words;
  }

  attachEventListeners() {
    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.difficulty = e.target.dataset.difficulty;
      });
    });

    // Navigation
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousStep());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    // Step-specific listeners
    this.attachStepListeners();
  }

  attachStepListeners() {
    // Entropy mode toggle
    const entropyModeButtons = document.querySelectorAll('.entropy-mode-toggle .toggle-btn');
    if (entropyModeButtons.length) {
      const panels = {
        dice: document.getElementById('dice-panel'),
        rng: document.getElementById('rng-panel')
      };

      entropyModeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          entropyModeButtons.forEach((control) => {
            const isActive = control === btn;
            control.classList.toggle('active', isActive);
            control.setAttribute('aria-selected', String(isActive));
          });

          Object.entries(panels).forEach(([key, panel]) => {
            if (!panel) return;
            const isVisible = key === mode;
            panel.classList.toggle('hidden', !isVisible);
            panel.setAttribute('aria-hidden', String(!isVisible));
          });
        });
      });
    }

    // Entropy generation
    const rollDice = document.getElementById('roll-dice');
    if (rollDice) {
      rollDice.addEventListener('click', () => this.rollDice());
    }

    // Seed regeneration
    const regenSeed = document.getElementById('regenerate-seed');
    if (regenSeed) {
      regenSeed.addEventListener('click', () => this.regenerateSeed());
    }

    // Address copying
    const copyAddress = document.getElementById('copy-address');
    if (copyAddress) {
      copyAddress.addEventListener('click', () => this.copyAddress());
    }
  }

  rollDice() {
    // Simulate rolling dice for entropy
    const bit = Math.random() > 0.5 ? '1' : '0';
    this.entropy += bit;

    const bitsCollected = this.entropy.length;
    const progress = (bitsCollected / 256) * 100;

    document.getElementById('entropy-bits').textContent = bitsCollected;
    document.getElementById('entropy-progress').style.width = `${progress}%`;

    const binaryDisplay = document.getElementById('binary-entropy');
    if (binaryDisplay) {
      binaryDisplay.textContent = this.entropy.match(/.{1,8}/g)?.join(' ') || this.entropy;
    }

    if (bitsCollected >= 256) {
      // Convert to hex
      const hex = parseInt(this.entropy, 2).toString(16).padStart(64, '0');
      document.getElementById('hex-entropy').textContent = hex;
      document.getElementById('entropy-hex-display').style.display = 'block';

      // Enable next button
      document.getElementById('next-btn').disabled = false;
    }
  }

  regenerateSeed() {
    const length = parseInt(document.querySelector('input[name="seed-length"]:checked').value);
    const words = this.generateSeedWords(length);

    const display = document.getElementById('seed-words-display');
    display.innerHTML = words.map((word, idx) => `
      <div class="seed-word-item">
        <span class="word-number">${idx + 1}</span>
        <span class="word-text">${word}</span>
      </div>
    `).join('');
  }

  copyAddress() {
    const address = document.getElementById('final-address').textContent;
    navigator.clipboard.writeText(address);

    const btn = document.getElementById('copy-address');
    btn.textContent = '✓ Copied!';
    setTimeout(() => {
      btn.textContent = '📋 Copy Address';
    }, 2000);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateStep();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateStep();
    }
  }

  updateStep() {
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, idx) => {
      step.classList.toggle('active', idx === this.currentStep);
      step.classList.toggle('completed', idx < this.currentStep);
    });

    // Update content
    document.getElementById('step-content').innerHTML = this.renderStep(this.currentStep);

    // Update navigation buttons
    document.getElementById('prev-btn').disabled = this.currentStep === 0;
    document.getElementById('next-btn').textContent =
      this.currentStep === this.steps.length - 1 ? 'Complete Workshop' : 'Next Step →';

    // Reattach listeners for new content
    this.attachStepListeners();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addStyles() {
    if (document.getElementById('wallet-workshop-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'wallet-workshop-styles';
    styles.textContent = `
      .wallet-workshop {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .difficulty-selector {
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(247, 147, 26, 0.2);
      }

      .difficulty-selector h3 {
        text-align: center;
        color: #f7931a;
        margin-bottom: 1.5rem;
      }

      .difficulty-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .difficulty-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(247, 147, 26, 0.3);
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #fff;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .difficulty-btn:hover {
        border-color: #f7931a;
        transform: translateY(-2px);
      }

      .difficulty-btn.active {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border-color: #f7931a;
      }

      .difficulty-btn small {
        font-size: 0.85rem;
        opacity: 0.8;
      }

      .progress-container {
        margin: 3rem 0;
      }

      .progress-steps {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .progress-step {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        z-index: 2;
      }

      .step-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        border: 3px solid rgba(247, 147, 26, 0.3);
        transition: all 0.3s ease;
      }

      .progress-step.active .step-icon {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border-color: #f7931a;
        box-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
      }

      .progress-step.completed .step-icon {
        background: #4CAF50;
        border-color: #4CAF50;
      }

      .step-title {
        font-size: 0.9rem;
        text-align: center;
        color: #999;
      }

      .progress-step.active .step-title {
        color: #f7931a;
        font-weight: 600;
      }

      .step-number {
        position: absolute;
        top: 0;
        right: 0;
        background: #f7931a;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .progress-connector {
        flex: 1;
        height: 3px;
        background: rgba(247, 147, 26, 0.2);
        margin: 0 -1rem;
        position: relative;
        top: -30px;
        z-index: 1;
      }

      .step-panel {
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border-radius: 12px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid rgba(247, 147, 26, 0.2);
      }

      .step-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .step-header h2 {
        color: #f7931a;
        margin-bottom: 0.5rem;
      }

      .step-subtitle {
        color: #999;
        font-size: 1.1rem;
      }

      .concept-explanation {
        background: rgba(33, 150, 243, 0.1);
        border-left: 4px solid #2196F3;
        padding: 1.5rem;
        margin: 2rem 0;
        border-radius: 8px;
      }

      .concept-explanation h3 {
        color: #2196F3;
        margin-bottom: 1rem;
      }

      .security-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
      }

      .security-bad, .security-good {
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
      }

      .security-bad {
        background: rgba(244, 67, 54, 0.1);
        border: 2px solid #F44336;
      }

      .security-good {
        background: rgba(76, 175, 80, 0.1);
        border: 2px solid #4CAF50;
      }

      .example {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 4px;
      }

      .interactive-section {
        margin: 2rem 0;
      }

      .interactive-section h3 {
        color: #f7931a;
        margin-bottom: 1rem;
      }

      .entropy-mode-toggle {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1.5rem;
      }

      .toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        border: 1px solid rgba(247, 147, 26, 0.4);
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .toggle-btn:hover {
        border-color: #f7931a;
        transform: translateY(-1px);
      }

      .toggle-btn.active {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        color: #1a1a1a;
        box-shadow: 0 10px 25px rgba(247, 147, 26, 0.35);
      }

      .toggle-icon {
        font-size: 1.4rem;
        line-height: 1;
      }

      .entropy-panels {
        display: grid;
        gap: 1.5rem;
      }

      .entropy-panel {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(247, 147, 26, 0.25);
        border-radius: 12px;
        padding: 1.5rem;
      }

      .entropy-panel .entropy-generator {
        background: rgba(0, 0, 0, 0.25);
        padding: 2rem;
        border-radius: 8px;
      }

      .hidden {
        display: none !important;
      }

      .entropy-rng {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .iframe-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(63, 69, 81, 0.16);
      }

      .iframe-wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
      }

      .iframe-attrib {
        text-align: center;
        font-size: 0.9rem;
        color: #bbb;
      }

      .iframe-attrib a {
        color: #f7931a;
        text-decoration: none;
      }

      .iframe-attrib a:hover {
        text-decoration: underline;
      }

      .rng-tip {
        text-align: center;
        font-size: 0.95rem;
        color: #999;
      }

      @media (min-width: 768px) {
        .iframe-wrapper {
          padding-top: 56.25%;
        }
      }

      .entropy-generator {
        background: rgba(0, 0, 0, 0.3);
        padding: 2rem;
        border-radius: 8px;
      }

      .dice-roller {
        text-align: center;
        margin-bottom: 2rem;
      }

      .dice-btn {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border: none;
        padding: 1.5rem 3rem;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1.2rem;
        color: white;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .dice-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(247, 147, 26, 0.4);
      }

      .dice {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }

      .roll-counter {
        margin-top: 1.5rem;
      }

      .progress-bar {
        width: 100%;
        height: 30px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        color: #f7931a;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .entropy-display, .entropy-hex {
        margin-top: 1.5rem;
      }

      .binary-output, #hex-entropy {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 8px;
        word-break: break-all;
        color: #4CAF50;
        font-size: 0.9rem;
      }

      .socratic-question {
        background: rgba(156, 39, 176, 0.1);
        border-left: 4px solid #9C27B0;
        padding: 1.5rem;
        margin: 2rem 0;
        border-radius: 8px;
      }

      .socratic-question h4 {
        color: #9C27B0;
        margin-bottom: 1rem;
      }

      .reveal-btn {
        background: #9C27B0;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 1rem;
        transition: all 0.3s ease;
      }

      .reveal-btn:hover {
        background: #7B1FA2;
        transform: translateY(-2px);
      }

      .answer {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(156, 39, 176, 0.05);
        border-radius: 8px;
      }

      .seed-words-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .seed-word-item {
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid #f7931a;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .word-number {
        background: #f7931a;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .word-text {
        color: #f7931a;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .warning-box {
        background: rgba(244, 67, 54, 0.1);
        border: 2px solid #F44336;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 2rem 0;
      }

      .warning-box h4 {
        color: #F44336;
        margin-bottom: 1rem;
      }

      .warning-box ul {
        list-style: none;
        padding: 0;
      }

      .warning-box li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(244, 67, 54, 0.2);
      }

      .warning-box li:last-child {
        border-bottom: none;
      }

      .step-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        gap: 1rem;
      }

      .nav-btn {
        padding: 1rem 2rem;
        border: 2px solid rgba(247, 147, 26, 0.3);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .nav-btn:hover:not(:disabled) {
        border-color: #f7931a;
        transform: translateY(-2px);
      }

      .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .nav-btn.primary {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border-color: #f7931a;
      }

      @media (max-width: 768px) {
        .difficulty-buttons {
          grid-template-columns: 1fr;
        }

        .progress-steps {
          flex-direction: column;
        }

        .progress-connector {
          display: none;
        }

        .security-comparison {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(styles);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Wallet Workshop: DOM ready, initializing...');
    try {
      const workshop = new WalletWorkshop();
      console.log('✅ Wallet Workshop: Initialized successfully');
      window.walletWorkshop = workshop; // Make it globally accessible for debugging
    } catch (error) {
      console.error('❌ Wallet Workshop: Initialization failed:', error);
      const container = document.getElementById('wallet-workshop-container');
      if (container) {
        container.innerHTML = `
          <div style="background: rgba(244, 67, 54, 0.2); border: 2px solid #f44336; padding: 2rem; border-radius: 10px; margin: 2rem 0;">
            <h2 style="color: #f44336; margin-bottom: 1rem;">⚠️ Wallet Workshop Failed to Load</h2>
            <p style="margin-bottom: 1rem;">There was an error initializing the wallet workshop:</p>
            <pre style="background: rgba(0, 0, 0, 0.5); padding: 1rem; border-radius: 6px; overflow-x: auto;">${error.message}\n\n${error.stack}</pre>
            <p style="margin-top: 1rem;">Please refresh the page or check the browser console for more details.</p>
          </div>
        `;
      }
    }
  });
} else {
  console.log('🔐 Wallet Workshop: DOM already ready, initializing...');
  try {
    const workshop = new WalletWorkshop();
    console.log('✅ Wallet Workshop: Initialized successfully');
    window.walletWorkshop = workshop; // Make it globally accessible for debugging
  } catch (error) {
    console.error('❌ Wallet Workshop: Initialization failed:', error);
    const container = document.getElementById('wallet-workshop-container');
    if (container) {
      container.innerHTML = `
        <div style="background: rgba(244, 67, 54, 0.2); border: 2px solid #f44336; padding: 2rem; border-radius: 10px; margin: 2rem 0;">
          <h2 style="color: #f44336; margin-bottom: 1rem;">⚠️ Wallet Workshop Failed to Load</h2>
          <p style="margin-bottom: 1rem;">There was an error initializing the wallet workshop:</p>
          <pre style="background: rgba(0, 0, 0, 0.5); padding: 1rem; border-radius: 6px; overflow-x: auto;">${error.message}\n\n${error.stack}</pre>
          <p style="margin-top: 1rem;">Please refresh the page or check the browser console for more details.</p>
        </div>
      `;
    }
  }
}
