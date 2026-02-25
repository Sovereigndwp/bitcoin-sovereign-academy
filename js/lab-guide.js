/* ==========================================================
   Lab Guide System — Universal Practical Exercise Engine
   Bitcoin Sovereign Academy

   Usage:
     Include /css/lab-guide.css and /js/lab-guide.js on any page.
     Call openLab('lab-id') to open a lab.
     Use <div class="lab-card" onclick="openLab('lab-id')"> for inline triggers.
   ========================================================== */

(function (global) {
    'use strict';

    // ── Lab Content Library ──────────────────────────────────

    const LABS = {

        'first-address': {
            id: 'first-address',
            icon: '🔑',
            title: 'Generate Your First Bitcoin Address',
            subtitle: 'Create a real address on the signet practice network',
            duration: '10 min',
            difficulty: 'beginner',
            network: 'signet',
            tools: ['Sparrow Wallet', 'Blue Wallet'],
            steps: [
                {
                    title: 'Install Sparrow Wallet (Desktop)',
                    content: 'Sparrow Wallet is the best tool for learning Bitcoin. It shows you everything — UTXOs, scripts, derivation paths, fees. Open source. No custodian.',
                    links: [
                        { label: 'Download Sparrow Wallet (sparrowwallet.com)', url: 'https://sparrowwallet.com/download/' }
                    ],
                    info: 'Sparrow runs on macOS, Windows, and Linux. The download page includes SHA256 hashes to verify your download — always verify before installing.',
                    alternative: 'On mobile? Use <strong>Blue Wallet</strong> — go to Settings → Network → Testnet.',
                    verify: 'Sparrow Wallet is open on my screen'
                },
                {
                    title: 'Connect to a Public Signet Server',
                    content: 'Sparrow needs a server to see the blockchain. For signet practice, use a free public Electrum server.',
                    instructions: [
                        'In Sparrow, go to File → Preferences → Server (macOS: Sparrow → Preferences)',
                        'Select "Public Server" in the server type',
                        'Click "Test Connection" — it should say Connected'
                    ],
                    info: 'You can also self-host Bitcoin Core + Electrum Server for full privacy. For now, the public server is fine for signet practice.',
                    verify: 'Sparrow shows a connected server in the bottom right'
                },
                {
                    title: 'Switch to Signet Network',
                    content: 'Signet is Bitcoin\'s official test network — same protocol, free coins that have no real value.',
                    instructions: [
                        'In Sparrow, go to File → Preferences → Server',
                        'From the "Network" dropdown, select "Testnet" (signet support is within testnet settings)',
                        'Alternatively: Hold Ctrl (or Cmd on Mac) and click the colored dot at the bottom right to cycle networks'
                    ],
                    tip: 'Signet blocks are mined every ~10 minutes, just like mainnet. Transactions are structured identically. Your learning transfers directly to mainnet.',
                    verify: 'I see "Testnet" or "Signet" in the Sparrow status bar'
                },
                {
                    title: 'Create a New Wallet',
                    content: 'You\'ll create a Native SegWit wallet — the modern standard that produces bc1q... addresses.',
                    instructions: [
                        'Go to File → New Wallet',
                        'Name it "Learning Wallet" and click Create Wallet',
                        'Select "New or Imported Software Wallet" → click New Wallet',
                        'Keep "Native Segwit (P2WPKH)" selected — this is the recommended type',
                        'Click "Generate New" to create a seed phrase',
                        'WRITE DOWN all 12 words in order — this is your private key'
                    ],
                    warn: 'On signet, the coins are worthless — but practice treating your seed phrase with the same care you would on mainnet. Build the habit now.',
                    verify: 'I see my wallet in Sparrow with a receive address starting with tb1q...'
                },
                {
                    title: 'Get Free Signet Coins',
                    content: 'Signet faucets give you free test coins. You\'ll use these to practice real transactions.',
                    instructions: [
                        'In Sparrow, click "Receive" to see your address',
                        'Copy the tb1q... address',
                        'Open the signet faucet (link below)',
                        'Paste your address and request coins',
                        'Wait ~1 block (about 10 minutes) for confirmation'
                    ],
                    links: [
                        { label: 'Signet Faucet — bitcoinfaucet.uo1.net', url: 'https://bitcoinfaucet.uo1.net/?to=signet' },
                        { label: 'Alternative — alt.signet.bublina.eu.org', url: 'https://alt.signet.bublina.eu.org/' }
                    ],
                    verify: 'I see an incoming transaction in Sparrow\'s Transaction tab'
                },
                {
                    title: 'Explore Your Transaction on a Block Explorer',
                    content: 'Every Bitcoin transaction is permanently public. Let\'s verify yours on mempool.space.',
                    instructions: [
                        'In Sparrow, click on your incoming transaction to see its details',
                        'Find the Transaction ID (TXID) — it\'s a 64-character string',
                        'Open mempool.space/signet (link below)',
                        'Paste your TXID in the search bar and press Enter'
                    ],
                    links: [
                        { label: 'Signet Explorer — mempool.space/signet', url: 'https://mempool.space/signet' }
                    ],
                    tip: 'Look at the "Output" section. You\'ll see your address, the exact amount, and the fee. This is the transparent ledger that makes Bitcoin trustless.',
                    verify: 'I found my transaction on mempool.space and can see the input, output, and fee'
                }
            ],
            reflection: 'You just created a real Bitcoin address, received funds, and verified a transaction on a public block explorer — using the exact same protocol as mainnet Bitcoin. The only difference: signet coins are free. Every step you just did works identically on mainnet.'
        },

        'sparrow-utxo': {
            id: 'sparrow-utxo',
            icon: '🔬',
            title: 'Inspect UTXOs and Build a Transaction',
            subtitle: 'Understand inputs, outputs, and coin control in Sparrow',
            duration: '20 min',
            difficulty: 'intermediate',
            network: 'signet',
            tools: ['Sparrow Wallet'],
            steps: [
                {
                    title: 'Open the UTXOs Tab',
                    content: 'UTXO stands for Unspent Transaction Output. Each UTXO is a discrete "coin" in your wallet — not an account balance.',
                    instructions: [
                        'In Sparrow, open your signet wallet',
                        'Click the "UTXOs" tab (left sidebar)',
                        'You should see one or more UTXOs from the faucet'
                    ],
                    info: 'Bitcoin has no "balance" like a bank. Your balance is the sum of all UTXOs you control. Each UTXO is independently spendable and has its own history.',
                    verify: 'I can see at least one UTXO in the Sparrow UTXOs tab'
                },
                {
                    title: 'Inspect a UTXO',
                    content: 'Click on a UTXO to see its full details — the transaction that created it, the amount, and the address it\'s locked to.',
                    instructions: [
                        'Right-click on a UTXO → "Show Transaction"',
                        'Sparrow opens the transaction that created this UTXO',
                        'Notice: the transaction has inputs (where coins came from) and outputs (where they went)',
                        'Your UTXO is one of the outputs'
                    ],
                    tip: 'Every UTXO in existence traces back to a coinbase transaction — a block reward. This is the unbroken chain of custody Bitcoin maintainers talk about.',
                    verify: 'I can see the transaction that created my UTXO'
                },
                {
                    title: 'Generate a Second Receive Address',
                    content: 'Good wallet hygiene means using a new address for every receipt. Sparrow makes this easy.',
                    instructions: [
                        'Click "Receive" in Sparrow',
                        'Notice the address has incremented (m/84\'/1\'/0\'/0/1 instead of /0)',
                        'Copy this new address to your clipboard'
                    ],
                    info: 'HD wallets (BIP32/BIP44) generate a new address from the same seed each time. They all belong to you — they share the same extended private key.',
                    verify: 'I have a second, different tb1q... address copied'
                },
                {
                    title: 'Send a Transaction with Coin Control',
                    content: 'Instead of letting the wallet pick which UTXO to spend, you\'ll select one manually. This is coin control.',
                    instructions: [
                        'In the UTXOs tab, check the box next to a UTXO you want to spend',
                        'Click "Send Selected" (or go to Send tab — the selected UTXO is pre-loaded)',
                        'Paste your second address as the recipient',
                        'Set amount to about half your UTXO value',
                        'Set fee rate to 1 sat/vbyte (signet has no congestion)',
                        'Click "Create Transaction"'
                    ],
                    tip: 'Notice the fee estimate in the bottom panel. On signet, fees are trivial. On mainnet during high congestion, choosing UTXOs wisely saves real money.',
                    verify: 'I see a transaction preview with inputs and outputs clearly labeled'
                },
                {
                    title: 'Broadcast and Verify',
                    content: 'Sign and broadcast your transaction. Then watch it confirm.',
                    instructions: [
                        'Click "Sign" — Sparrow signs with your wallet\'s private key',
                        'Click "Broadcast Transaction"',
                        'Note your TXID (shown after broadcast)',
                        'Open mempool.space/signet and paste your TXID'
                    ],
                    links: [
                        { label: 'Signet Mempool — mempool.space/signet', url: 'https://mempool.space/signet' }
                    ],
                    info: 'In Sparrow\'s Transactions tab, watch the status change from "Unconfirmed" → "1 confirmation" → "6 confirmations". After 6 confirmations, your transaction is considered final by most wallets.',
                    verify: 'My transaction appears on mempool.space with at least 1 confirmation'
                }
            ],
            reflection: 'You manually selected which UTXO to spend, set a fee rate, signed the transaction, and watched it confirm on a real block explorer. On mainnet this process is identical — except the coins are real. This is coin control: privacy-preserving and fee-efficient self-custody.'
        },

        'sparrow-multisig': {
            id: 'sparrow-multisig',
            icon: '🏛️',
            title: 'Create a 2-of-3 Multisig Wallet',
            subtitle: 'Eliminate single points of failure with multiple keys',
            duration: '35 min',
            difficulty: 'advanced',
            network: 'signet',
            tools: ['Sparrow Wallet'],
            steps: [
                {
                    title: 'Understand What You\'re Building',
                    content: 'A 2-of-3 multisig wallet has 3 independent keys. Any 2 of the 3 must co-sign a transaction. Lose 1 key — you\'re fine. An attacker needs 2 of your 3 keys — much harder.',
                    info: 'We\'ll simulate 3 signers using 3 separate Sparrow wallets on the same computer. In practice, these would be 3 different hardware devices in 3 locations.',
                    tip: 'Real setup: Coldcard (home) + Trezor (office) + Jade (trusted family member). The coordinator (Sparrow) only sees public keys — it cannot spend funds alone.',
                    verify: 'I understand the 2-of-3 concept and I\'m ready to create 3 seed phrases'
                },
                {
                    title: 'Create Three Signer Wallets',
                    content: 'Create 3 separate software wallets — these simulate your 3 hardware signers.',
                    instructions: [
                        'File → New Wallet → name it "Signer 1 (Coldcard)" → New Software Wallet → Generate New seed → write down 12 words',
                        'Repeat: "Signer 2 (Trezor)" → Generate New seed → write down 12 words',
                        'Repeat: "Signer 3 (Jade)" → Generate New seed → write down 12 words'
                    ],
                    warn: 'In a real setup, each signer would be a different device. Here, all 3 are on one computer for simulation. On mainnet: NEVER have all 3 keys on the same machine.',
                    verify: 'I have 3 separate wallets open in Sparrow, each with a different seed phrase'
                },
                {
                    title: 'Export Public Keys (xpubs) from Each Signer',
                    content: 'The multisig coordinator needs each signer\'s public key — not the private key. You share the xpub, not the seed.',
                    instructions: [
                        'Open Signer 1 → Settings → Export Wallet → Export as "Output Descriptor"',
                        'Copy the xpub or the full descriptor string',
                        'Repeat for Signer 2 and Signer 3',
                        'Save all three in a text file temporarily'
                    ],
                    info: 'An xpub (extended public key) lets the coordinator generate all receive addresses without being able to spend. This is watch-only surveillance — safe to share with a coordinator.',
                    verify: 'I have 3 xpub strings (they start with xpub... or tpub... on testnet)'
                },
                {
                    title: 'Create the Multisig Coordinator Wallet',
                    content: 'The coordinator wallet watches all addresses and creates unsigned transactions. It does NOT hold private keys.',
                    instructions: [
                        'File → New Wallet → name it "2-of-3 Vault"',
                        'Select "Multi Signature" → Policy: 2 of 3',
                        'In the "Keystores" section, click each "Import" button',
                        'For each keystore: paste the xpub from your signer wallets',
                        'Click "Apply" to create the multisig wallet'
                    ],
                    tip: 'Sparrow shows you the derived multisig address format (p2wsh: bc1q... but longer). Notice how the address encodes all 3 public keys.',
                    verify: 'I have a "2-of-3 Vault" wallet with addresses starting with tb1q (longer than single-sig)'
                },
                {
                    title: 'Receive and Then Send',
                    content: 'Send signet coins to your multisig vault, then try to spend them — requiring 2-of-3 signatures.',
                    instructions: [
                        'In the Vault wallet, click Receive — copy the multisig address',
                        'Send some signet coins from your single-sig wallet to this address',
                        'Wait for confirmation, then go to the Send tab in the Vault',
                        'Create a transaction — notice it creates a PSBT (Partially Signed Bitcoin Transaction)',
                        'Export the PSBT, then open Signer 1 → import the PSBT → Sign → export',
                        'Open Signer 2 → import the same PSBT → Sign → you now have 2 of 3 → Broadcast'
                    ],
                    links: [
                        { label: 'Signet Explorer — mempool.space/signet', url: 'https://mempool.space/signet' }
                    ],
                    info: 'PSBT (BIP174) is the standard for passing partially-signed transactions between signers. Each signer adds their signature without exposing private keys.',
                    verify: 'My multisig transaction confirms on the signet explorer'
                },
                {
                    title: 'Export and Save the Wallet Descriptor',
                    content: 'The output descriptor is essential for recovering a multisig wallet. Without it, even all 3 seeds together may not be enough.',
                    instructions: [
                        'In the Vault wallet: File → Export Wallet → select "Output Descriptor"',
                        'Save the descriptor file in a separate location from any seed phrases',
                        'Open the descriptor — notice it contains all 3 xpubs and the 2-of-3 policy'
                    ],
                    warn: 'For mainnet multisig: store descriptor copies with each of your 3 seed backups. Losing the descriptor means losing the ability to derive the correct addresses — even with all seeds.',
                    verify: 'I have saved the wallet descriptor and understand what it contains'
                }
            ],
            reflection: 'You just built a real 2-of-3 multisig vault, funded it, and spent from it using PSBT co-signing. This is the gold standard of Bitcoin self-custody. On mainnet, replace the software signers with hardware devices in separate physical locations.'
        },

        'explore-mempool': {
            id: 'explore-mempool',
            icon: '🔭',
            title: 'Navigate the Mempool',
            subtitle: 'Read real-time Bitcoin network data like a professional',
            duration: '15 min',
            difficulty: 'beginner',
            network: 'mainnet',
            tools: ['mempool.space'],
            steps: [
                {
                    title: 'Open mempool.space',
                    content: 'mempool.space is an open-source Bitcoin block explorer and mempool visualizer. It\'s one of the most important tools for understanding Bitcoin\'s real-time state.',
                    links: [
                        { label: 'Open mempool.space', url: 'https://mempool.space' }
                    ],
                    info: 'mempool.space is fully open source. You can run your own instance connected to your own node — maximum privacy.',
                    verify: 'I have mempool.space open and can see the fee histogram'
                },
                {
                    title: 'Understand the Fee Rate Histogram',
                    content: 'The fee histogram shows transactions waiting to be confirmed, grouped by fee rate (sat/vbyte).',
                    instructions: [
                        'Look at the colored blocks in the mempool visualization',
                        'Each color represents a different fee rate tier',
                        'Transactions offering higher fees (green) get confirmed faster',
                        'Transactions with lower fees (red/purple) wait longer — or may never confirm if too low'
                    ],
                    tip: 'If the mempool is nearly empty (few pending transactions), even 1 sat/vbyte will confirm in the next block. If congested during a bull market, you might need 50+ sat/vbyte for quick confirmation.',
                    verify: 'I can read the approximate "next block fee" from the histogram'
                },
                {
                    title: 'Find the Latest Block',
                    content: 'Scroll to the top of mempool.space and click on the most recently mined block.',
                    instructions: [
                        'Click on the latest block in the block visualization',
                        'Note the block height (e.g. 882,000+)',
                        'Note the number of transactions in the block',
                        'Note the total fees collected by the miner',
                        'Click on any transaction in the block to inspect it'
                    ],
                    info: 'On average, a new block is mined every 10 minutes. The difficulty adjustment (every 2016 blocks, ~2 weeks) maintains this rate regardless of total hash rate.',
                    verify: 'I can find the block height, transaction count, and total fees for the latest block'
                },
                {
                    title: 'Decode a Real Transaction',
                    content: 'Find a transaction and read its structure — inputs, outputs, fee, and size.',
                    instructions: [
                        'From the latest block, click on any transaction',
                        'Find the "Inputs" section — these are UTXOs being spent',
                        'Find the "Outputs" section — these are new UTXOs being created',
                        'Note the fee (inputs total - outputs total = fee)',
                        'Note the transaction size in vbytes and the sat/vbyte fee rate'
                    ],
                    tip: 'A native SegWit (p2wpkh) transaction with 1 input and 2 outputs is typically 141-148 vbytes. At 20 sat/vbyte, that\'s about 2,800-3,000 sats in fees.',
                    verify: 'I can identify inputs, outputs, and calculate the fee for a real transaction'
                },
                {
                    title: 'Check the Difficulty and Hash Rate',
                    content: 'The Bitcoin network\'s security comes from proof-of-work. Let\'s look at the current state.',
                    instructions: [
                        'Navigate to mempool.space → Statistics → Mining',
                        'Note the current hash rate (exahash per second)',
                        'Find the last difficulty adjustment percentage',
                        'Note when the next adjustment is expected'
                    ],
                    links: [
                        { label: 'Mining Statistics — mempool.space/mining', url: 'https://mempool.space/mining' }
                    ],
                    tip: 'If hash rate grows faster than expected, the next difficulty adjustment goes up. If miners turn off machines, it goes down. This self-regulating mechanism keeps block times near 10 minutes.',
                    verify: 'I know the current hash rate and when the next difficulty adjustment is'
                }
            ],
            reflection: 'mempool.space is your window into Bitcoin\'s live state — fees, blocks, transactions, hash rate, difficulty. Professional Bitcoin users check this before every transaction. Bookmark it.'
        },

        'lightning-first-payment': {
            id: 'lightning-first-payment',
            icon: '⚡',
            title: 'Make Your First Lightning Payment',
            subtitle: 'Instant, near-zero-fee Bitcoin payments in the browser',
            duration: '15 min',
            difficulty: 'beginner',
            network: 'testnet',
            tools: ['Mutiny Wallet (web)', 'Phoenix Wallet (mobile)'],
            steps: [
                {
                    title: 'Open Mutiny Wallet in Your Browser',
                    content: 'Mutiny is a Lightning Network wallet that runs entirely in your browser — no install needed. It supports signet for free practice.',
                    links: [
                        { label: 'Mutiny Wallet (browser) — app.mutinywallet.com', url: 'https://app.mutinywallet.com' }
                    ],
                    info: 'Mutiny is open source and non-custodial. It uses WebAssembly to run a real Lightning node in your browser. This is cutting-edge Bitcoin technology.',
                    alternative: 'On mobile: <strong>Phoenix Wallet</strong> (iOS/Android) is the easiest Lightning wallet for mainnet. It auto-manages channels.',
                    verify: 'Mutiny Wallet is open and I can see my wallet interface'
                },
                {
                    title: 'Switch to Signet',
                    content: 'Mutiny supports signet — Bitcoin\'s test network. Practice with zero cost.',
                    instructions: [
                        'In Mutiny, go to Settings (gear icon)',
                        'Find "Network" settings',
                        'Select "Signet"',
                        'The wallet will restart with testnet mode'
                    ],
                    verify: 'Mutiny shows "Signet" in the interface'
                },
                {
                    title: 'Get a Lightning Invoice',
                    content: 'A Lightning invoice is a payment request. Unlike Bitcoin addresses, invoices are single-use and expire.',
                    instructions: [
                        'In Mutiny, click "Receive"',
                        'Select "Lightning" as the receive method',
                        'Set an amount (e.g. 1000 sats)',
                        'Copy the invoice — it starts with "lnbtc1..." or "lntbs1..." on signet'
                    ],
                    tip: 'BOLT11 invoices encode: the amount, recipient node pubkey, payment hash, expiry time, and routing hints. Each one is one-time use.',
                    links: [
                        { label: 'Decode a Lightning invoice — bolt11.org', url: 'https://www.bolt11.org/' }
                    ],
                    verify: 'I have a Lightning invoice copied (starts with ln...)'
                },
                {
                    title: 'Pay a Lightning Invoice',
                    content: 'Now pay the invoice from a different wallet or use the signet faucet that supports Lightning.',
                    instructions: [
                        'Try the Lightning signet faucet (link below)',
                        'Paste your invoice to receive signet sats',
                        'Alternatively: open a second browser window with another Mutiny wallet and pay from there'
                    ],
                    links: [
                        { label: 'Mutiny Signet Faucet', url: 'https://faucet.mutinynet.com/' }
                    ],
                    info: 'Lightning payments settle in milliseconds. There\'s no waiting for block confirmations — the payment happens through a pre-funded channel network.',
                    verify: 'I received sats via Lightning — the payment settled instantly'
                },
                {
                    title: 'Decode Your Lightning Invoice',
                    content: 'A Lightning invoice is more complex than a Bitcoin address. Let\'s see what\'s inside.',
                    instructions: [
                        'Copy the invoice you created in step 3',
                        'Open the BOLT11 decoder (link below)',
                        'Paste the invoice — you\'ll see: amount in millisats, timestamp, expiry, node pubkey, payment hash'
                    ],
                    links: [
                        { label: 'BOLT11 Decoder', url: 'https://www.bolt11.org/' },
                        { label: 'Our In-App Decoder', url: '/interactive-demos/bolt11-decoder/' }
                    ],
                    verify: 'I can read the payment hash and amount from the decoded invoice'
                }
            ],
            reflection: 'Lightning payments are instant, cheap, and private. Channels open on-chain (one Bitcoin transaction), then route thousands of payments off-chain. Perfect for small, frequent payments. For large value storage: on-chain, self-custodied Bitcoin.'
        },

        'sparrow-watch-only': {
            id: 'sparrow-watch-only',
            icon: '👁️',
            title: 'Set Up a Watch-Only Wallet',
            subtitle: 'Monitor your hardware wallet balance without exposing private keys',
            duration: '20 min',
            difficulty: 'intermediate',
            network: 'mainnet',
            tools: ['Sparrow Wallet', 'Coldcard / Trezor / Jade'],
            steps: [
                {
                    title: 'What Is a Watch-Only Wallet?',
                    content: 'A watch-only wallet imports your public key (xpub) — not your seed or private key. It can see all your addresses and balances, but cannot sign transactions.',
                    info: 'Use case: Monitor your cold storage holdings on a connected computer safely. The xpub reveals your addresses (some privacy tradeoff) but not your spending ability.',
                    warn: 'Sharing your xpub reveals your full transaction history and all future receiving addresses. Only share with your own Sparrow instance or a trusted coordinator.',
                    verify: 'I understand the privacy tradeoff and want to proceed'
                },
                {
                    title: 'Export Your xpub from a Hardware Wallet',
                    content: 'Each hardware wallet exports its xpub differently. Choose your device:',
                    instructions: [
                        '🟠 Coldcard: Advanced → Export Wallet → Sparrow Wallet',
                        '🟣 Trezor: Connect to Suite → Accounts → Show XPub (or use Sparrow → Add New Wallet → Hardware)',
                        '🟢 Jade: Connect to Sparrow via USB → Sparrow will auto-import via the hardware wallet workflow',
                        '🔵 Ledger: Connect to Sparrow → Add New Wallet → Ledger → follow the on-screen pairing'
                    ],
                    tip: 'The easiest path: in Sparrow, go to File → New Wallet → Add Hardware Wallet. Sparrow will walk you through connecting your device directly.',
                    verify: 'I have my xpub or I\'ve connected my hardware wallet to Sparrow'
                },
                {
                    title: 'Create a Watch-Only Wallet in Sparrow',
                    content: 'Import the xpub into Sparrow to create a watch-only wallet.',
                    instructions: [
                        'File → New Wallet → name it "[Device Name] Watch-Only"',
                        'Select "New or Imported Software Wallet"',
                        'Choose "xPub / Watch Only Wallet"',
                        'Paste your xpub or use the hardware wallet import path',
                        'Click Apply → the wallet loads with all your historical transactions'
                    ],
                    verify: 'I see my transaction history and current balance in Sparrow'
                },
                {
                    title: 'Verify Addresses Match Your Hardware Device',
                    content: 'CRITICAL: Always verify receive addresses on the hardware device screen — not just in Sparrow.',
                    instructions: [
                        'In Sparrow, click "Receive" to generate an address',
                        'On your hardware wallet, navigate to the receive address verification screen',
                        'Compare the address shown in Sparrow vs. on the device — they must match exactly',
                        'Never trust an address shown only on a computer screen'
                    ],
                    warn: 'Address verification on the hardware device is not optional. A compromised computer could show a different address in Sparrow while your device shows the correct one.',
                    verify: 'The Sparrow address exactly matches what my hardware wallet shows on its screen'
                }
            ],
            reflection: 'Your hardware wallet private keys never touched a networked computer. Sparrow can generate addresses and create unsigned transactions — the device signs offline. This air-gap is what makes hardware wallets secure.'
        },

        'fee-estimation': {
            id: 'fee-estimation',
            icon: '💰',
            title: 'Fee Estimation and Timing',
            subtitle: 'Choose the right fee for your urgency and save money',
            duration: '15 min',
            difficulty: 'intermediate',
            network: 'mainnet',
            tools: ['mempool.space', 'Sparrow Wallet'],
            steps: [
                {
                    title: 'Check the Current Mempool State',
                    content: 'Before sending any transaction, check what fees are currently required for your desired confirmation time.',
                    links: [
                        { label: 'Live Fee Estimates — mempool.space', url: 'https://mempool.space' }
                    ],
                    instructions: [
                        'Open mempool.space and look at the fee box on the right side',
                        'Note the fee rates for: "High Priority" (next 1-2 blocks), "Medium" (3-6 blocks), "Low" (7+ blocks)',
                        'Note the current mempool size in MB'
                    ],
                    info: 'mempool.space updates in real time. If you\'re not in a hurry, waiting until Sunday evening (US time) often gives lower fees — historically the quietest period.',
                    verify: 'I know the current fee rate for "next block" confirmation'
                },
                {
                    title: 'Calculate Your Transaction\'s Expected Size',
                    content: 'Transaction size (in vbytes) determines your total fee. Larger transactions (more inputs/outputs) cost more.',
                    instructions: [
                        'A basic transaction: 1 input (p2wpkh) + 2 outputs = ~141 vbytes',
                        'With 2 inputs: ~226 vbytes',
                        'With a change output: adds ~31 vbytes',
                        'Multiply your vbyte estimate by the sat/vbyte rate'
                    ],
                    info: 'In Sparrow: when creating a transaction, the fee and vbyte size are shown in real time as you add inputs and outputs. You can adjust the fee rate with a slider.',
                    tip: 'Consolidating many small UTXOs (many inputs) into one large UTXO is cheapest when fees are low — it saves money on future high-fee transactions.',
                    verify: 'I can estimate the fee for a 1-input 2-output transaction at the current fee rate'
                },
                {
                    title: 'Set a Custom Fee Rate in Sparrow',
                    content: 'Sparrow lets you set any fee rate, enable Replace-by-Fee (RBF), and adjust before signing.',
                    instructions: [
                        'In Sparrow, go to Send tab',
                        'Set your recipient and amount',
                        'At the bottom: look for the fee rate selector',
                        'Click "Custom" and type your desired sat/vbyte rate',
                        'Enable "RBF" (Replace-by-Fee) — this lets you bump the fee later if needed',
                        'Confirm the total fee shown is acceptable before signing'
                    ],
                    tip: 'Always enable RBF. If the mempool clears slower than expected, you can create a replacement transaction with a higher fee.',
                    verify: 'I can set a custom fee rate and see the estimated total fee in Sparrow'
                },
                {
                    title: 'Use Fee Bumping (RBF) if Stuck',
                    content: 'If a transaction gets stuck with too low a fee, RBF lets you replace it with a higher-fee version.',
                    instructions: [
                        'In Sparrow, right-click on an unconfirmed transaction',
                        'Select "Increase Fee" — Sparrow creates a new transaction that spends the same inputs',
                        'The new transaction replaces the old one in the mempool',
                        'Set a higher fee rate and re-sign'
                    ],
                    warn: 'RBF only works if the original transaction had RBF enabled (signaled in the sequence field). Always enable RBF when sending.',
                    info: 'An alternative to RBF: Child-Pays-for-Parent (CPFP) — create a new transaction spending the unconfirmed output with a very high fee. Miners must confirm the parent to collect the child\'s fee.',
                    verify: 'I understand how to bump fees on a stuck transaction'
                }
            ],
            reflection: 'Fee management is a core skill for Bitcoin self-custody. Always check the mempool before sending. Enable RBF. Use Sparrow\'s custom fee selector. Batch transactions when possible. Consolidate UTXOs during low-fee periods.'
        },

        'address-types': {
            id: 'address-types',
            icon: '🏷️',
            title: 'Compare Bitcoin Address Types',
            subtitle: 'See the practical difference between p2pkh, p2sh, p2wpkh, and p2tr',
            duration: '15 min',
            difficulty: 'intermediate',
            network: 'signet',
            tools: ['Sparrow Wallet'],
            steps: [
                {
                    title: 'The Four Address Types',
                    content: 'Bitcoin has evolved through four address formats. Each offers different tradeoffs in fees, compatibility, and features.',
                    info: '🔵 Legacy (p2pkh): 1... addresses. Highest fees, maximum compatibility.\n🟣 Wrapped SegWit (p2sh-p2wpkh): 3... addresses. SegWit benefits in a compatible wrapper.\n🟠 Native SegWit (p2wpkh): bc1q... addresses. Lowest fees for single-sig. Current standard.\n⚡ Taproot (p2tr): bc1p... addresses. Privacy, scripting power, future-proof.',
                    verify: 'I understand the four types and their address prefixes'
                },
                {
                    title: 'Create a Legacy Wallet',
                    content: 'Create a wallet using the oldest Bitcoin address format to compare.',
                    instructions: [
                        'In Sparrow: File → New Wallet → name it "Legacy Test"',
                        'Script type: "Legacy (P2PKH)"',
                        'Generate a new seed → click Apply',
                        'Note the receive address format: starts with 1... (mainnet) or m/n (testnet)'
                    ],
                    tip: 'Legacy addresses are fully valid today. Many exchanges still use them. But they cost ~40% more in fees than Native SegWit because they include the full public key in the transaction.',
                    verify: 'I have a wallet with an address starting with "m" or "n" (testnet Legacy)'
                },
                {
                    title: 'Create a Native SegWit Wallet',
                    content: 'This is the recommended format for single-signature wallets today.',
                    instructions: [
                        'File → New Wallet → name it "Native SegWit Test"',
                        'Script type: "Native Segwit (P2WPKH)"',
                        'Generate a new seed → Apply',
                        'Note the address: starts with tb1q... (testnet)'
                    ],
                    info: 'Native SegWit transactions are about 60-70 vbytes for the input (vs 148 vbytes for legacy). This directly translates to lower fees.',
                    verify: 'I have a wallet with an address starting with tb1q...'
                },
                {
                    title: 'Create a Taproot Wallet',
                    content: 'Taproot is Bitcoin\'s newest address format. Activated in November 2021.',
                    instructions: [
                        'File → New Wallet → name it "Taproot Test"',
                        'Script type: "Taproot (P2TR)"',
                        'Generate a new seed → Apply',
                        'Note the address: starts with tb1p... (testnet)'
                    ],
                    tip: 'Taproot addresses look the same for single-sig and multisig — enhanced privacy. Taproot also enables complex scripts (time locks, hash locks, multi-party signing protocols) that all look like regular payments on-chain.',
                    verify: 'I have a wallet with an address starting with tb1p...'
                },
                {
                    title: 'Compare Fee Costs on the Explorer',
                    content: 'Get signet coins for each wallet and send a transaction from each. Compare the sizes.',
                    instructions: [
                        'Fund each wallet from the faucet',
                        'Send small amounts from each wallet type',
                        'On mempool.space/signet, compare the vbyte sizes of each transaction type',
                        'Legacy input: ~148 vbytes, Native SegWit: ~68 vbytes, Taproot: ~57.5 vbytes'
                    ],
                    links: [
                        { label: 'Signet Explorer', url: 'https://mempool.space/signet' },
                        { label: 'Signet Faucet', url: 'https://bitcoinfaucet.uo1.net/?to=signet' }
                    ],
                    verify: 'I can see the different transaction sizes for different address types on the explorer'
                }
            ],
            reflection: 'Address type choice affects fees, privacy, and compatibility. Use Native SegWit (p2wpkh) for wallets you\'re setting up today. Use Taproot (p2tr) if your wallet and counterparties support it. Avoid Legacy unless forced to for exchange compatibility.'
        },

        'passphrase-wallet': {
            id: 'passphrase-wallet',
            icon: '🔐',
            title: 'Create a Passphrase-Protected Wallet',
            subtitle: 'The 25th word: a hidden wallet within your wallet',
            duration: '20 min',
            difficulty: 'intermediate',
            network: 'signet',
            tools: ['Sparrow Wallet', 'Blue Wallet'],
            steps: [
                {
                    title: 'How the 25th Word Works',
                    content: 'Your 12 or 24 seed words generate your wallet. Adding a BIP39 passphrase creates a completely different wallet from the same seed — as if you had an entirely new seed.',
                    info: 'Seed words alone → Wallet A\nSame seed + passphrase "correct-horse-Battery" → Wallet B\nSame seed + passphrase "myOtherWallet99" → Wallet C',
                    warn: 'There is no "wrong" passphrase — any passphrase (including empty string "") generates a valid wallet. This means: forget the passphrase → you see different (empty) addresses. The coins appear lost but are safe if you remember it.',
                    verify: 'I understand that the passphrase creates a mathematically different wallet'
                },
                {
                    title: 'Set Up a Base Wallet (No Passphrase)',
                    content: 'Create a wallet on signet with NO passphrase first. This becomes your decoy wallet.',
                    instructions: [
                        'In Sparrow: File → New Wallet → "Decoy Wallet (Signet)"',
                        'Native SegWit → New Software Wallet → Generate Seed',
                        'Write down the 12 words. Leave passphrase field EMPTY',
                        'Apply → note the first receive address'
                    ],
                    tip: 'In a real setup, keep a small amount in the no-passphrase wallet. If ever coerced, you can reveal this seed — the attacker finds a small but real balance.',
                    verify: 'I have a wallet address without passphrase (write it down)'
                },
                {
                    title: 'Create the Same Wallet WITH a Passphrase',
                    content: 'Import the same 12 words, but this time add a passphrase. The resulting addresses will be completely different.',
                    instructions: [
                        'File → New Wallet → "Main Vault (Signet)"',
                        'Native SegWit → Import Software Wallet → Enter Mnemonic Words',
                        'Enter the SAME 12 words as before',
                        'In the "Passphrase" field: type a strong passphrase (e.g. "Bitcoin-is-sound-money-1984!")',
                        'Apply → compare the receive address with your decoy wallet'
                    ],
                    verify: 'I see a DIFFERENT address than my decoy wallet — proving the passphrase creates a separate wallet'
                },
                {
                    title: 'Fund and Verify Both Wallets',
                    content: 'Get signet coins for both wallets to confirm they operate independently.',
                    instructions: [
                        'Get signet coins for both addresses from the faucet',
                        'Confirm both receive transactions on mempool.space/signet',
                        'Close the main vault wallet, then reopen with seed + passphrase — verify balance appears'
                    ],
                    links: [
                        { label: 'Signet Faucet', url: 'https://bitcoinfaucet.uo1.net/?to=signet' },
                        { label: 'Signet Explorer', url: 'https://mempool.space/signet' }
                    ],
                    warn: 'Practice restoring with the passphrase NOW, while coins are worthless. The process on mainnet is identical. Muscle memory matters.',
                    verify: 'Both wallets receive funds independently. Same seed, different passphrase → different wallet.'
                }
            ],
            reflection: 'The passphrase adds a layer of deniability and security that the seed phrase alone cannot provide. Real Bitcoin holders often use: Wallet 1 (seed only) → small decoy amount. Wallet 2 (seed + passphrase) → main savings. The seed is useless without the passphrase.'
        },

        'decode-transaction': {
            id: 'decode-transaction',
            icon: '🧬',
            title: 'Decode a Raw Bitcoin Transaction',
            subtitle: 'Read the actual bytes of a Bitcoin transaction',
            duration: '20 min',
            difficulty: 'advanced',
            network: 'mainnet',
            tools: ['Sparrow Wallet', 'learnmeabitcoin.com'],
            steps: [
                {
                    title: 'What Is a Raw Transaction?',
                    content: 'Every Bitcoin transaction is a sequence of bytes — a serialized data structure. Block explorers decode and display it in human-readable form.',
                    info: 'A raw transaction contains: version, inputs (outpoint + scriptSig + sequence), outputs (value + scriptPubKey), locktime, and (for SegWit) witness data.',
                    verify: 'I\'m ready to decode a real Bitcoin transaction'
                },
                {
                    title: 'Get a Raw Transaction',
                    content: 'Find any transaction on mempool.space and extract its raw hex.',
                    instructions: [
                        'Go to mempool.space and click on any recent transaction',
                        'Scroll down and find "Raw Hex" or click the "Details" tab',
                        'Copy the raw transaction hex (long string of hex characters: 0-9, a-f)'
                    ],
                    links: [
                        { label: 'Open mempool.space', url: 'https://mempool.space' }
                    ],
                    tip: 'On mempool.space, click the "<>" icon or "Transaction Details" to see the raw hex. Alternatively: on the API, /api/tx/{txid}/hex returns the raw transaction.',
                    verify: 'I have a raw transaction hex string copied'
                },
                {
                    title: 'Decode It on learnmeabitcoin.com',
                    content: 'learnmeabitcoin.com has an excellent interactive decoder that shows you each field with explanations.',
                    links: [
                        { label: 'Transaction Decoder — learnmeabitcoin.com', url: 'https://learnmeabitcoin.com/tools/transaction-decoder' }
                    ],
                    instructions: [
                        'Open the decoder',
                        'Paste your raw transaction hex',
                        'Hover over each field to see its explanation',
                        'Identify: version (4 bytes), number of inputs, each input\'s outpoint (txid + vout), the witness data'
                    ],
                    verify: 'I can identify the version, inputs, outputs, and witness data in the decoded transaction'
                },
                {
                    title: 'Decode in Sparrow',
                    content: 'Sparrow can decode any raw transaction. This is useful when reviewing a transaction before signing.',
                    instructions: [
                        'In Sparrow: Tools → Show Transaction',
                        'Paste the raw transaction hex',
                        'Sparrow shows it visually: inputs on the left, outputs on the right',
                        'Click each input/output to see the script type and amount'
                    ],
                    tip: 'This is how you verify a PSBT before signing. A hardware wallet shows you the amounts and addresses, but Sparrow\'s visual decoder lets you verify the full structure.',
                    verify: 'I can decode a raw transaction in Sparrow and identify all components'
                }
            ],
            reflection: 'Every Bitcoin transaction follows the same serialization format. Understanding the raw bytes demystifies the protocol — blocks are just collections of these serialized transactions. The scripting language (Script) in each output defines exactly what conditions must be met to spend it.'
        },

        'sparrow-sparrow-import': {
            id: 'sparrow-sparrow-import',
            icon: '🦜',
            title: 'Full Sparrow Wallet Setup for Beginners',
            subtitle: 'From download to first transaction — complete walkthrough',
            duration: '30 min',
            difficulty: 'beginner',
            network: 'signet',
            tools: ['Sparrow Wallet'],
            steps: [
                {
                    title: 'Download and Verify Sparrow',
                    content: 'Always verify your Sparrow Wallet download. The signature check ensures you downloaded the real software, not a tampered copy.',
                    links: [
                        { label: 'Download Sparrow Wallet', url: 'https://sparrowwallet.com/download/' }
                    ],
                    instructions: [
                        'Go to sparrowwallet.com/download',
                        'Download the installer for your OS',
                        'Download the manifest file and signature (also on the same page)',
                        'Follow the verification instructions — this takes 5 minutes and is worth it'
                    ],
                    warn: 'Never download Bitcoin wallet software from a Google search result. Always go directly to the official URL. Bookmark sparrowwallet.com.',
                    verify: 'Sparrow Wallet is installed and verified'
                },
                {
                    title: 'First Launch — Choose a Server',
                    content: 'Sparrow needs to connect to the Bitcoin network to see transactions. Choose "Public Server" for the simplest start.',
                    instructions: [
                        'On first launch, Sparrow asks how to connect to the network',
                        'Select "Public Server" (uses Blockstream\'s Electrum server)',
                        'Click "Test Connection" — wait for the green check',
                        'Click "Done"'
                    ],
                    info: 'For maximum privacy, run Bitcoin Core + Electrum Server and point Sparrow to your own node. But for learning, the public server is fine.',
                    tip: 'Bottom right corner: colored dot indicates connection status. Orange = connecting. Green = connected.',
                    verify: 'Sparrow shows a green connection indicator at the bottom right'
                },
                {
                    title: 'Create Your First Wallet',
                    content: 'Create a Native SegWit software wallet with a freshly generated seed phrase.',
                    instructions: [
                        'File → New Wallet → type a name → "Create Wallet"',
                        'Script type: "Native Segwit (P2WPKH)" — keep this default',
                        'Click "New or Imported Software Wallet"',
                        'Click "New Wallet" to generate a fresh seed',
                        'Click "Generate New" → 12 words appear',
                        'Write every word in order on paper — never digital',
                        'Confirm your seed by re-entering the words → click "Create Keystore"',
                        'Click "Apply" to create the wallet'
                    ],
                    warn: 'Your 12 seed words ARE your Bitcoin. If your computer is destroyed, you restore your wallet using only these words. Keep them offline, physically secured.',
                    verify: 'I see my wallet in Sparrow with a "Receive" address starting with bc1q'
                },
                {
                    title: 'Switch to Signet for Practice',
                    content: 'Switch Sparrow to Signet so you can practice with free coins before using real Bitcoin.',
                    instructions: [
                        'Go to File → Preferences → Server',
                        'In the "Network" dropdown: select "Testnet"',
                        'Click "Test Connection" → wait for confirmation',
                        'Your wallet addresses now show "tb1q..." (testnet Native SegWit)'
                    ],
                    tip: 'Alternatively: hold Cmd/Ctrl and click the colored dot at the bottom right to cycle networks.',
                    verify: 'Sparrow shows "Testnet" and addresses start with tb1q...'
                },
                {
                    title: 'Fund with Signet Coins and Send',
                    content: 'Get free testnet coins and practice your first send.',
                    instructions: [
                        'Click "Receive" → copy your tb1q... address',
                        'Visit the faucet, paste your address, request coins',
                        'Wait for 1 confirmation (click Transactions tab to monitor)',
                        'Create a new receive address (click Receive again — it auto-increments)',
                        'Click Send → paste your new address as recipient → set amount → fee 1 sat/vbyte → Create Transaction → Sign → Broadcast'
                    ],
                    links: [
                        { label: 'Signet Faucet', url: 'https://bitcoinfaucet.uo1.net/?to=signet' },
                        { label: 'Signet Explorer', url: 'https://mempool.space/signet' }
                    ],
                    verify: 'I sent my first signet transaction and verified it on mempool.space/signet'
                }
            ],
            reflection: 'You have a working Sparrow setup verified against the official download, connected to the network, with a backed-up seed phrase, and have completed your first send and receive on a test network. Switch to mainnet (File → Preferences → Server → Mainnet) when you\'re ready to use real Bitcoin.'
        },

        'verify-download': {
            id: 'verify-download',
            icon: '🔏',
            title: 'Verify a Bitcoin Software Download',
            subtitle: 'Confirm authenticity using GPG signatures and SHA256 hashes',
            duration: '15 min',
            difficulty: 'beginner',
            network: 'mainnet',
            tools: ['Terminal / Command Prompt', 'GPG'],
            steps: [
                {
                    title: 'Download Sparrow Wallet + signature files',
                    content: 'Every serious Bitcoin software release includes a SHA256 checksum and a GPG signature. You should verify both before running anything.',
                    instructions: [
                        'Go to sparrowwallet.com/download',
                        'Download the installer for your OS',
                        'Also download the SHA256 manifest file (e.g. sparrow-2.x.x-manifest.txt)',
                        'Download the manifest signature file (.asc extension)'
                    ],
                    links: [
                        { label: 'Sparrow Wallet Downloads', url: 'https://sparrowwallet.com/download/' }
                    ],
                    verify: 'I have three files: the installer, manifest.txt, and manifest.txt.asc'
                },
                {
                    title: 'Verify the SHA256 checksum',
                    content: 'The checksum proves the file was not corrupted or tampered with during download.',
                    instructions: [
                        'Open Terminal (macOS/Linux) or PowerShell (Windows)',
                        'macOS/Linux: <code>sha256sum Sparrow-2.x.x.dmg</code>',
                        'Windows: <code>Get-FileHash Sparrow-2.x.x.exe -Algorithm SHA256</code>',
                        'Compare the output to the matching line in manifest.txt — they must match exactly'
                    ],
                    warn: 'If the hashes don\'t match, the file was corrupted or tampered with. Delete it and download again.',
                    verify: 'The SHA256 hash in my terminal matches the manifest exactly'
                },
                {
                    title: 'Import the developer\'s GPG key',
                    content: 'GPG signatures prove the manifest was signed by Craig Raw (Sparrow\'s developer) — not just anyone who got hold of the file.',
                    instructions: [
                        'Install GPG if needed: gpg4win.org (Windows) or brew install gnupg (macOS)',
                        'Import Craig\'s key: <code>gpg --keyserver keyserver.ubuntu.com --recv-keys D4D0D3202FC06849A257B38DE94618334C674B40</code>',
                        'You should see: "key D4D...imported"'
                    ],
                    links: [
                        { label: 'GPG4Win (Windows)', url: 'https://www.gpg4win.org/' }
                    ],
                    verify: 'gpg --list-keys shows Craig Raw\'s key'
                },
                {
                    title: 'Verify the manifest signature',
                    content: 'Now verify the manifest was actually signed by the real developer.',
                    instructions: [
                        'Run: <code>gpg --verify sparrow-2.x.x-manifest.txt.asc sparrow-2.x.x-manifest.txt</code>',
                        'Look for: "Good signature from Craig Raw"',
                        'Ignore "WARNING: This key is not certified" — this is normal unless you have personally signed their key'
                    ],
                    warn: 'If you see "BAD signature" — do not install the software. Download fresh copies.',
                    verify: 'I see "Good signature from Craig Raw" in the GPG output'
                }
            ],
            reflection: 'You now know how to verify any signed Bitcoin software release. This skill protects you from supply chain attacks where malware is injected into software distributions. Always verify before running Bitcoin software with real funds.'
        },

        'cold-storage-setup': {
            id: 'cold-storage-setup',
            icon: '🧊',
            title: 'Set Up Cold Storage with Sparrow',
            subtitle: 'Create an air-gapped signing wallet and a watch-only companion',
            duration: '30 min',
            difficulty: 'intermediate',
            network: 'signet',
            tools: ['Sparrow Wallet', 'Second computer or phone (optional)'],
            steps: [
                {
                    title: 'Understand the cold storage model',
                    content: 'Cold storage separates your private keys from any internet-connected device. The "cold" wallet signs transactions offline. The "watch-only" wallet sees your balance and builds transactions — but never touches keys.',
                    info: 'You need two Sparrow installs: one connected (watch-only), one air-gapped (signing). For this lab, we simulate both on the same machine.',
                    verify: 'I understand: watch-only wallet cannot spend, signing wallet never goes online'
                },
                {
                    title: 'Create the signing wallet (simulate air-gap)',
                    content: 'In real cold storage, this step happens on an offline computer that never connects to the internet.',
                    instructions: [
                        'In Sparrow, go to File → New Wallet',
                        'Name it "Cold Storage - Signing"',
                        'Choose "New or Imported Software Wallet"',
                        'Generate a new 12-word or 24-word seed phrase',
                        'Write it down on paper — do NOT save it digitally'
                    ],
                    warn: 'In a real setup, you would disconnect internet before this step and never reconnect that machine.',
                    verify: 'I have a new wallet with a backed-up seed phrase'
                },
                {
                    title: 'Export the xpub (extended public key)',
                    content: 'The xpub lets you create a watch-only wallet without exposing any private keys.',
                    instructions: [
                        'In your signing wallet, go to Settings',
                        'Find the "Master Public Key (xpub/zpub)" section',
                        'Copy the zpub (or xpub) — this is NOT sensitive, it only reveals addresses',
                        'Note the derivation path shown (e.g. m/84\'/0\'/0\')'
                    ],
                    info: 'The xpub lets anyone derive all your receiving addresses — so treat it as semi-private. It cannot spend funds.',
                    verify: 'I have copied my zpub and noted the derivation path'
                },
                {
                    title: 'Create the watch-only wallet',
                    content: 'This wallet lives on your internet-connected machine and monitors the blockchain.',
                    instructions: [
                        'Go to File → New Wallet',
                        'Name it "Cold Storage - Watch Only"',
                        'Choose "Watch Only Wallet"',
                        'Paste your zpub from the previous step',
                        'Match the script type to your derivation path (m/84\' = Native SegWit / bc1q)'
                    ],
                    verify: 'Watch-only wallet shows my addresses and is connected to signet'
                },
                {
                    title: 'Simulate a PSBT signing round trip',
                    content: 'To spend from cold storage, you build a PSBT on the watch-only wallet and sign it on the cold wallet.',
                    instructions: [
                        'In watch-only wallet: go to Send, enter a signet address, set amount',
                        'Click Create Transaction — this creates a PSBT (unsigned)',
                        'Save the PSBT file (File → Save Transaction)',
                        'Open the signing wallet, go to File → Open Transaction',
                        'Load the PSBT, review the outputs, click Sign',
                        'Save the signed PSBT, bring it back to the watch-only wallet',
                        'In watch-only wallet: load signed PSBT → Broadcast'
                    ],
                    tip: 'In real cold storage, you transfer the PSBT via SD card or QR code — never via internet.',
                    verify: 'I successfully completed a PSBT round trip and broadcast the transaction on signet'
                }
            ],
            reflection: 'You have simulated professional cold storage — the same model used to secure millions in Bitcoin. The key insight: private keys never touch the internet. Every spend requires a deliberate, physical signing step.'
        },

        'coin-control': {
            id: 'coin-control',
            icon: '🎛️',
            title: 'Master Coin Control for Privacy',
            subtitle: 'Select which UTXOs to spend and avoid leaking your transaction history',
            duration: '20 min',
            difficulty: 'intermediate',
            network: 'signet',
            tools: ['Sparrow Wallet'],
            steps: [
                {
                    title: 'Why coin control matters for privacy',
                    content: 'Every Bitcoin transaction reveals which UTXOs you combined. If you mix a "known" UTXO (e.g. from a KYC exchange) with an anonymous one, you reveal they belong to the same wallet.',
                    info: 'Chain analysis firms like Chainalysis build graphs of UTXO ownership. Coin control lets you avoid accidentally merging unrelated transaction histories.',
                    verify: 'I understand why combining UTXOs leaks privacy'
                },
                {
                    title: 'Fund your signet wallet with multiple UTXOs',
                    content: 'Get a few transactions so you have multiple UTXOs to work with.',
                    instructions: [
                        'Generate 3 different receiving addresses in Sparrow (each click on "Get Next Address")',
                        'Send signet coins to each address from the faucet',
                        'Wait for confirmations — you now have 3 separate UTXOs'
                    ],
                    links: [
                        { label: 'Signet Faucet (bitcoinfaucet.uo1.net)', url: 'https://bitcoinfaucet.uo1.net/' }
                    ],
                    verify: 'I have at least 3 UTXOs shown in the UTXOs tab'
                },
                {
                    title: 'Enable coin control and select specific UTXOs',
                    content: 'Instead of letting Sparrow automatically select inputs, you choose exactly which coins to spend.',
                    instructions: [
                        'Go to the Send tab',
                        'Enter a destination address and amount',
                        'Click "Coin Control" (top of Send tab, or in the UTXO selector)',
                        'Manually check only ONE specific UTXO to use as input',
                        'Proceed to build the transaction'
                    ],
                    tip: 'The "privacy" indicator in Sparrow will show you a score based on your UTXO selection.',
                    verify: 'Transaction preview shows only the UTXOs I selected as inputs'
                },
                {
                    title: 'Inspect the transaction graph on mempool.space',
                    content: 'After broadcasting, use the block explorer to see exactly what information is visible to observers.',
                    instructions: [
                        'Broadcast the transaction on signet',
                        'Copy the TXID',
                        'Open mempool.space/signet and paste the TXID',
                        'Click "Show inputs and outputs graph"',
                        'Note: observers can see all your input UTXOs and their prior history'
                    ],
                    links: [
                        { label: 'Mempool.space Signet Explorer', url: 'https://mempool.space/signet' }
                    ],
                    verify: 'I can trace where my input UTXOs came from in the explorer'
                }
            ],
            reflection: 'Coin control is one of the most underused privacy tools available to Bitcoin users. In high-stakes situations (protecting business revenue, inheritance planning, avoiding surveillance), knowing which coins to combine — and which to keep separate — is essential.'
        },

        'lightning-routing': {
            id: 'lightning-routing',
            icon: '🔀',
            title: 'Understand Lightning Routing',
            subtitle: 'See how payments hop across nodes on the Lightning Network',
            duration: '15 min',
            difficulty: 'intermediate',
            network: 'mainnet',
            tools: ['amboss.space (browser)', 'mempool.space/lightning (browser)'],
            steps: [
                {
                    title: 'Open the Lightning Network graph',
                    content: 'The Lightning Network is a graph of payment channels. Payments route through multiple hops between nodes.',
                    instructions: [
                        'Open amboss.space in your browser',
                        'You\'ll see a map of Lightning nodes and channels',
                        'Look for well-connected hub nodes — these route most traffic'
                    ],
                    links: [
                        { label: 'Amboss Lightning Explorer', url: 'https://amboss.space' },
                        { label: 'Mempool Lightning Graph', url: 'https://mempool.space/lightning' }
                    ],
                    verify: 'I can see the Lightning Network graph with nodes and channels'
                },
                {
                    title: 'Find a specific node and its channels',
                    content: 'Each node has a public key, alias, and capacity. Large routing nodes have many channels and high liquidity.',
                    instructions: [
                        'Search for "ACINQ" on amboss.space — this is the company behind Phoenix Wallet',
                        'Click the node to see its channels, capacity, and fees',
                        'Note: capacity is public, but payment direction is private'
                    ],
                    info: 'Lightning privacy: the routing path is onion-encrypted. Intermediate nodes only know the previous and next hop, not the full payment path.',
                    verify: 'I found a major routing node and can see its channel count and total capacity'
                },
                {
                    title: 'Simulate a route manually',
                    content: 'Try to trace a payment path from node A to node B through intermediaries.',
                    instructions: [
                        'Pick two nodes that are not directly connected',
                        'Try to find a path between them (by following channel connections)',
                        'Count the hops — shorter = lower fees and faster',
                        'Note: the protocol finds routes automatically using Dijkstra-style algorithms'
                    ],
                    tip: 'Most consumer payments are 3–5 hops. Phoenix and Mutiny handle routing automatically.',
                    verify: 'I traced a multi-hop path between two nodes on the graph'
                },
                {
                    title: 'Check channel fees and liquidity',
                    content: 'Each channel has a fee policy: base fee (sat) + proportional fee (ppm = parts per million). Liquidity direction determines which way payments can flow.',
                    instructions: [
                        'On amboss.space, open a channel between two nodes',
                        'Check both nodes\' fee policies',
                        'Note the capacity vs. the estimated local/remote balance',
                        'Inbound liquidity = others can pay you through this channel'
                    ],
                    verify: 'I can explain the difference between inbound and outbound liquidity for a channel'
                }
            ],
            reflection: 'Lightning\'s routing is elegant: trust-minimized, onion-encrypted, and economically incentivized. Node operators earn routing fees for providing liquidity. Understanding this helps you choose better Lightning wallets and make informed decisions about opening channels.'
        },

        'inheritance-drill': {
            id: 'inheritance-drill',
            icon: '📜',
            title: 'Bitcoin Inheritance Drill',
            subtitle: 'Test whether someone else could recover your bitcoin using only your documentation',
            duration: '25 min',
            difficulty: 'advanced',
            network: 'signet',
            tools: ['Sparrow Wallet', 'Paper and pen'],
            steps: [
                {
                    title: 'Create a test inheritance package',
                    content: 'Imagine you can no longer access your own wallet. Would someone else be able to recover your bitcoin from your documentation alone?',
                    instructions: [
                        'Set up a small signet wallet in Sparrow (12-word seed)',
                        'Write down: seed phrase, script type (e.g. Native SegWit), derivation path (e.g. m/84\'/0\'/0\')',
                        'Write down: the first receiving address (to verify recovery is correct)',
                        'Optional: add a BIP39 passphrase — write it separately from the seed'
                    ],
                    info: 'Real inheritance packages should be split across trusted individuals: seed phrase with one person, passphrase with another, recovery instructions with a third.',
                    verify: 'I have a paper document with seed phrase, script type, derivation path, and verification address'
                },
                {
                    title: 'Close the wallet completely',
                    content: 'To simulate inheritance recovery, remove access to the original wallet.',
                    instructions: [
                        'In Sparrow, go to File → Delete Wallet',
                        'Confirm deletion',
                        'The wallet file is now gone — you can only recover from paper'
                    ],
                    warn: 'Only do this with your signet test wallet — never delete a mainnet wallet without a tested backup.',
                    verify: 'The test wallet no longer appears in Sparrow'
                },
                {
                    title: 'Recover the wallet from paper only',
                    content: 'Now recover the wallet using only the written documentation — exactly as an heir would.',
                    instructions: [
                        'In Sparrow: File → New Wallet → New or Imported Software Wallet',
                        'Choose "Mnemonic Words (BIP39)"',
                        'Enter the 12 words from your paper',
                        'Enter the passphrase if you used one',
                        'Set the script type to match your notes',
                        'Verify the derivation path matches'
                    ],
                    tip: 'If you made an error in your documentation, now is when you\'d find out — on signet, not with real funds.',
                    verify: 'The recovered wallet shows the same first address I wrote down'
                },
                {
                    title: 'Send funds back to yourself',
                    content: 'Confirm the recovery is complete by spending from the recovered wallet.',
                    instructions: [
                        'In the recovered wallet, go to the Receive tab',
                        'Confirm the address matches your notes',
                        'Send a small amount to a new address in the same wallet',
                        'This proves you control the keys'
                    ],
                    verify: 'I successfully sent from the recovered wallet — inheritance drill complete'
                }
            ],
            reflection: 'Most Bitcoin inheritance failures happen not because the backup was lost, but because the documentation was incomplete or ambiguous. The script type and derivation path are as critical as the seed phrase. If your documentation didn\'t include them, your heir would recover the right keys but look at the wrong addresses.'
        }

    };

    // ── State ──────────────────────────────────────────────────

    let currentLabId = null;
    let currentStep  = 0;
    let totalSteps   = 0;

    const STORAGE_KEY = 'bsa_lab_completions';

    function getCompletions() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch (e) { return {}; }
    }

    function markComplete(labId) {
        const c = getCompletions();
        c[labId] = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
        // Update any lab cards on the page
        document.querySelectorAll('[data-lab="' + labId + '"]').forEach(function (el) {
            el.classList.add('completed');
        });
    }

    function isComplete(labId) {
        return !!getCompletions()[labId];
    }

    // ── Overlay lifecycle ────────────────────────────────────

    function openLab(labId) {
        const lab = LABS[labId];
        if (!lab) { console.warn('Lab not found:', labId); return; }
        currentLabId = labId;
        currentStep  = 0;
        totalSteps   = lab.steps.length;
        ensureOverlay();
        renderLab(lab);
        document.getElementById('labOverlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLab() {
        const overlay = document.getElementById('labOverlay');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
        currentLabId = null;
    }

    function ensureOverlay() {
        if (document.getElementById('labOverlay')) return;
        const html = `
<div class="lab-overlay" id="labOverlay">
  <div class="lab-panel" id="labPanel">
    <div class="lab-header" id="labHeader"></div>
    <div class="lab-progress-row">
      <div class="lab-step-dots" id="labDots"></div>
      <span class="lab-progress-label" id="labProgressLabel"></span>
    </div>
    <div class="lab-body" id="labBody"></div>
    <div class="lab-footer">
      <button class="lab-btn lab-btn-secondary" id="labPrevBtn" onclick="LabGuide.prevStep()">← Back</button>
      <button class="lab-btn lab-btn-primary" id="labNextBtn" onclick="LabGuide.nextStep()">Next Step →</button>
    </div>
  </div>
</div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('labOverlay').addEventListener('click', function (e) {
            if (e.target === document.getElementById('labOverlay')) closeLab();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLab();
        });
    }

    // ── Rendering ────────────────────────────────────────────

    function renderLab(lab) {
        // Header
        const badges = [
            '<span class="lab-badge network">' + lab.network + '</span>',
            '<span class="lab-badge duration">⏱ ' + lab.duration + '</span>',
            '<span class="lab-badge difficulty-' + lab.difficulty + '">' + lab.difficulty + '</span>'
        ].join('');

        const tools = lab.tools && lab.tools.length
            ? '<span class="lab-badge" style="background:rgba(255,255,255,0.07);color:#9ca3af;border:1px solid rgba(255,255,255,0.1);">🛠 ' + lab.tools.join(' · ') + '</span>'
            : '';

        document.getElementById('labHeader').innerHTML = `
<div class="lab-header-icon">${lab.icon}</div>
<div class="lab-header-text">
  <h2>${lab.title}</h2>
  <p>${lab.subtitle}</p>
  <div class="lab-meta">${badges}${tools}</div>
</div>
<button class="lab-close-btn" onclick="LabGuide.closeLab()" aria-label="Close lab">×</button>`;

        renderStep(lab, currentStep);
    }

    function renderStep(lab, stepIndex) {
        // Dots
        let dots = '';
        for (let i = 0; i < totalSteps; i++) {
            const cls = i < stepIndex ? 'done' : i === stepIndex ? 'current' : '';
            dots += '<div class="lab-step-dot ' + cls + '"></div>';
        }
        document.getElementById('labDots').innerHTML = dots;
        document.getElementById('labProgressLabel').textContent = 'Step ' + (stepIndex + 1) + ' of ' + totalSteps;

        // Step content
        const isLast = stepIndex === totalSteps - 1;
        const step = lab.steps[stepIndex];
        let html = '';

        html += '<h3 class="lab-step-title">' + escHtml(step.title) + '</h3>';
        html += '<p class="lab-step-content">' + step.content + '</p>';

        if (step.info)        html += '<div class="lab-info-box">ℹ ' + step.info + '</div>';
        if (step.warn)        html += '<div class="lab-warn-box">⚠ ' + step.warn + '</div>';
        if (step.alternative) html += '<div class="lab-info-box">📱 <em>Alternative:</em> ' + step.alternative + '</div>';

        if (step.instructions && step.instructions.length) {
            html += '<ul class="lab-instruction-list">';
            step.instructions.forEach(function (ins, i) {
                html += '<li><span class="step-num">' + (i + 1) + '</span><span>' + ins + '</span></li>';
            });
            html += '</ul>';
        }

        if (step.tip)         html += '<div class="lab-tip-box">💡 ' + step.tip + '</div>';

        if (step.links && step.links.length) {
            html += '<div class="lab-links">';
            step.links.forEach(function (link) {
                html += '<a href="' + escHtml(link.url) + '" target="_blank" rel="noopener noreferrer" class="lab-ext-link">' + escHtml(link.label) + '</a>';
            });
            html += '</div>';
        }

        if (step.code) html += '<code class="lab-code">' + escHtml(step.code) + '</code>';

        if (step.verify) {
            html += `<div class="lab-verify">
<span class="lab-verify-icon">✓</span>
<div class="lab-verify-text"><strong>Checkpoint:</strong> ${step.verify}</div>
</div>`;
        }

        // Reflection on last step
        if (isLast && lab.reflection) {
            html += `<div class="lab-reflection">
<h4>🧠 Reflection</h4>
<p>${lab.reflection}</p>
</div>`;
        }

        document.getElementById('labBody').innerHTML = html;
        document.getElementById('labBody').scrollTop = 0;

        // Buttons
        const prevBtn = document.getElementById('labPrevBtn');
        const nextBtn = document.getElementById('labNextBtn');
        prevBtn.disabled = stepIndex === 0;
        if (isLast) {
            nextBtn.textContent = isComplete(currentLabId) ? '✓ Completed' : 'Mark Complete ✓';
            nextBtn.style.background = isComplete(currentLabId) ? '#4caf50' : '#f7931a';
            nextBtn.disabled = isComplete(currentLabId);
        } else {
            nextBtn.textContent = 'Next Step →';
            nextBtn.style.background = '#f7931a';
            nextBtn.disabled = false;
        }
    }

    function nextStep() {
        const lab = LABS[currentLabId];
        if (!lab) return;
        if (currentStep < totalSteps - 1) {
            currentStep++;
            renderStep(lab, currentStep);
        } else {
            // Mark complete
            markComplete(currentLabId);
            const nextBtn = document.getElementById('labNextBtn');
            nextBtn.textContent = '✓ Completed';
            nextBtn.style.background = '#4caf50';
            nextBtn.disabled = true;
            // Briefly show completion
            const body = document.getElementById('labBody');
            const banner = document.createElement('div');
            banner.className = 'lab-tip-box';
            banner.style.cssText = 'text-align:center;font-size:1rem;padding:1.25rem;margin-top:1rem;';
            banner.innerHTML = '🎉 Lab complete! Your progress is saved. Close the panel or try another lab.';
            body.insertAdjacentElement('afterbegin', banner);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            renderStep(LABS[currentLabId], currentStep);
        }
    }

    // ── Helpers ──────────────────────────────────────────────

    function escHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // Mark completed lab cards on page load
    function initLabCards() {
        const completions = getCompletions();
        Object.keys(completions).forEach(function (labId) {
            document.querySelectorAll('[data-lab="' + labId + '"]').forEach(function (el) {
                el.classList.add('completed');
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLabCards);
    } else {
        initLabCards();
    }

    // ── Public API ────────────────────────────────────────────

    global.LabGuide = { openLab, closeLab, nextStep, prevStep, isComplete, LABS };
    global.openLab  = openLab;   // shorthand

})(window);
