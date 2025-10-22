/**
 * Bitcoin Glossary Data
 *
 * Comprehensive Bitcoin terminology with simple and advanced explanations
 *
 * Categories: basics, technical, lightning, security, privacy
 */

const GLOSSARY_TERMS = [
    // ===== A =====
    {
        term: "Address",
        category: "basics",
        aka: ["Bitcoin Address", "Wallet Address"],
        simple: "A string of letters and numbers where you receive Bitcoin, like an email address for money. Each address is unique and can be shared publicly.",
        advanced: "A cryptographic hash of a public key that represents a destination for a Bitcoin payment. Modern addresses use formats like P2PKH (legacy, starts with '1'), P2SH (starts with '3'), or Bech32 (native SegWit, starts with 'bc1'). Addresses are derived from public keys using hash functions (SHA-256, RIPEMD-160) for security and brevity.",
        related: ["Public Key", "Private Key", "Wallet"]
    },
    {
        term: "Altcoin",
        category: "basics",
        aka: ["Alternative Coin", "Shitcoin"],
        simple: "Any cryptocurrency that isn't Bitcoin. Examples include Ethereum, Litecoin, and thousands of others.",
        advanced: "Cryptocurrencies created after Bitcoin, often as experiments with different consensus mechanisms, block times, or features. Most altcoins have failed to achieve Bitcoin's network effects, security, or decentralization. The term 'shitcoin' is used derogatorily for low-quality altcoins with questionable value propositions."
    },

    // ===== B =====
    {
        term: "Bitcoin",
        category: "basics",
        aka: ["BTC", "₿"],
        simple: "A decentralized digital currency that allows peer-to-peer transactions without banks or governments. Created in 2009 by Satoshi Nakamoto.",
        advanced: "A peer-to-peer electronic cash system combining cryptographic proof, proof-of-work consensus, and a distributed ledger to create censorship-resistant, permissionless digital money. Bitcoin's fixed supply of 21 million coins and programmatic monetary policy make it the world's first truly scarce digital asset. The network achieves Byzantine fault tolerance through Nakamoto Consensus.",
        related: ["Satoshi Nakamoto", "Blockchain", "Decentralization"]
    },
    {
        term: "Block",
        category: "technical",
        simple: "A collection of Bitcoin transactions bundled together and added to the blockchain approximately every 10 minutes. Each block references the previous one, creating a chain.",
        advanced: "A data structure containing a block header (previous block hash, merkle root, timestamp, nonce, difficulty target) and a list of transactions. Miners compete to find a valid nonce that produces a block hash below the difficulty target. The average block size is ~1-2 MB (4 MB weight limit with SegWit). Block reward halves every 210,000 blocks (~4 years).",
        related: ["Blockchain", "Mining", "Block Height", "Block Reward"]
    },
    {
        term: "Blockchain",
        category: "technical",
        aka: ["Distributed Ledger"],
        simple: "A public record of all Bitcoin transactions, organized in blocks and linked together in chronological order. Anyone can view it, but no one can change past entries.",
        advanced: "An append-only data structure where each block cryptographically commits to the previous block via SHA-256 hash, creating an immutable chain. The blockchain achieves consensus through proof-of-work and the longest valid chain rule. Bitcoin's blockchain is the most secure due to its accumulated proof-of-work (hashrate). Each full node independently validates the entire chain.",
        related: ["Block", "Node", "Proof-of-Work"]
    },
    {
        term: "Block Height",
        category: "technical",
        simple: "The number of blocks in the blockchain. The genesis block is height 0, the next is 1, and so on. Current height shows how many blocks have been mined.",
        advanced: "An integer representing a block's position in the blockchain. Used for timing events (halving at heights 210k, 420k, 630k, etc.), soft fork activation (BIP activation heights), and relative timelocks. Block height is not included in block headers but derived by counting from genesis.",
        related: ["Block", "Blockchain", "Halving"]
    },
    {
        term: "Block Reward",
        category: "technical",
        aka: ["Coinbase Reward", "Mining Reward"],
        simple: "New bitcoins created and given to miners for successfully mining a block. Started at 50 BTC per block in 2009, currently 3.125 BTC (as of 2024).",
        advanced: "The sum of the coinbase subsidy (newly minted coins) and transaction fees. The subsidy halves every 210,000 blocks, following the schedule: 50 → 25 → 12.5 → 6.25 → 3.125 BTC. By approximately 2140, subsidy will reach zero and miners will rely entirely on transaction fees. This predictable issuance creates Bitcoin's fixed supply of ~21 million coins.",
        related: ["Mining", "Halving", "Transaction Fee", "Coinbase Transaction"]
    },
    {
        term: "BIP",
        category: "technical",
        aka: ["Bitcoin Improvement Proposal"],
        simple: "A formal document proposing changes or improvements to Bitcoin. Anyone can submit a BIP, but implementation requires community consensus.",
        advanced: "A design document providing information to the Bitcoin community, describing new features, processes, or environments. BIPs follow a standardized format and review process. Notable BIPs include: BIP32 (HD wallets), BIP39 (mnemonic seeds), BIP141 (SegWit), BIP340-342 (Taproot). BIPs are categorized as Standards Track, Informational, or Process.",
        related: ["Soft Fork", "Hard Fork", "SegWit", "Taproot"]
    },

    // ===== C =====
    {
        term: "Cold Storage",
        category: "security",
        aka: ["Cold Wallet", "Offline Storage"],
        simple: "Storing Bitcoin private keys completely offline, away from internet-connected devices. The safest way to hold large amounts of Bitcoin long-term.",
        advanced: "Air-gapped private key storage using hardware wallets, paper wallets, or dedicated offline computers. Best practices include: multi-signature setups, metal backup storage (fire/water resistant), geographic distribution, and inheritance planning. Cold storage eliminates remote attack vectors but requires careful operational security for transaction signing.",
        related: ["Hot Wallet", "Hardware Wallet", "Multi-Sig", "Private Key"]
    },
    {
        term: "Coinbase Transaction",
        category: "technical",
        aka: ["Generation Transaction"],
        simple: "The first transaction in every block, which creates new bitcoins and pays them to the miner. It has no inputs, only an output.",
        advanced: "A special transaction with no inputs that creates the block reward (subsidy + fees). Contains arbitrary data field (witness reserved value) often used for mining pool identification or protocol messages. Must mature for 100 blocks before the newly minted coins can be spent. The term 'coinbase' predates the Coinbase exchange company.",
        related: ["Block Reward", "Mining", "Block"]
    },
    {
        term: "Confirmation",
        category: "basics",
        simple: "When your transaction is included in a block, it has 1 confirmation. Each new block added after that adds another confirmation. More confirmations = more secure.",
        advanced: "The number of blocks mined after the block containing a transaction. Each confirmation exponentially decreases the probability of a successful double-spend via chain reorganization. Standard security thresholds: 1 confirmation (~99.9% secure for small amounts), 3-6 confirmations (standard), 100 confirmations (coinbase maturity). Confirmation time follows Poisson distribution with 10-minute mean.",
        related: ["Block", "Double-Spend", "Mempool"]
    },
    {
        term: "Consensus",
        category: "technical",
        aka: ["Nakamoto Consensus"],
        simple: "How Bitcoin nodes agree on which version of the blockchain is correct without trusting any central authority. The longest valid chain wins.",
        advanced: "A decentralized agreement mechanism combining proof-of-work, longest chain rule, and economic incentives. Nodes independently validate all transactions and blocks against consensus rules (21M supply cap, valid signatures, no double-spends, etc.). In case of chain splits, miners follow the chain with the most accumulated difficulty. This achieves Byzantine fault tolerance without requiring identity or permission.",
        related: ["Proof-of-Work", "Node", "Mining", "Blockchain"]
    },

    // ===== D =====
    {
        term: "Decentralization",
        category: "basics",
        simple: "No single person, company, or government controls Bitcoin. Power is distributed across thousands of participants worldwide.",
        advanced: "The distribution of control across multiple dimensions: development (open-source, multiple implementations), mining (geographically distributed hashrate), nodes (anyone can validate), and governance (rough consensus). Bitcoin's decentralization provides censorship resistance, seizure resistance, and resilience against state-level attacks. Measured by Nakamoto coefficient and geographic distribution.",
        related: ["Node", "Mining", "Consensus"]
    },
    {
        term: "Difficulty",
        category: "technical",
        aka: ["Mining Difficulty", "Difficulty Target"],
        simple: "A measure of how hard it is to mine a new block. Bitcoin automatically adjusts difficulty every 2 weeks to keep block time around 10 minutes.",
        advanced: "A relative measure of how difficult it is to find a hash below a given target. Difficulty adjusts every 2,016 blocks based on actual time vs. expected time (2,016 blocks × 10 minutes = 2 weeks). Formula: new_difficulty = old_difficulty × (2 weeks / actual_time). This maintains consistent issuance regardless of hashrate changes. Current difficulty ~60 trillion.",
        related: ["Mining", "Hashrate", "Proof-of-Work", "Block"]
    },
    {
        term: "Double-Spend",
        category: "technical",
        simple: "Attempting to spend the same bitcoins twice. Bitcoin's blockchain prevents this by including only one version of a transaction.",
        advanced: "An attack where the same UTXO is spent in two conflicting transactions. Prevented by proof-of-work consensus and the longest chain rule. Pre-confirmation double-spends exploit zero-conf merchant acceptance. Post-confirmation double-spends require 51% attacks and chain reorganizations. The 10-minute block time and 6-confirmation standard make successful attacks economically irrational.",
        related: ["Confirmation", "Blockchain", "UTXO", "51% Attack"]
    },

    // ===== F =====
    {
        term: "Fork",
        category: "technical",
        simple: "A split in the blockchain, either temporary (competing blocks) or permanent (protocol changes). Can be accidental or intentional.",
        advanced: "A divergence in blockchain state. Types: (1) Chain split - temporary when two blocks are found simultaneously, resolved by longest chain rule; (2) Soft fork - backward-compatible protocol changes (SegWit, Taproot); (3) Hard fork - non-backward-compatible changes creating new cryptocurrencies (Bitcoin Cash). Soft forks tighten rules, hard forks loosen them.",
        related: ["Soft Fork", "Hard Fork", "Blockchain", "Consensus"]
    },
    {
        term: "Full Node",
        category: "technical",
        aka: ["Bitcoin Node", "Validating Node"],
        simple: "A computer that downloads and verifies the entire Bitcoin blockchain and enforces all consensus rules. Running a node gives you maximum security and privacy.",
        advanced: "Software (Bitcoin Core, btcd, etc.) that independently validates every block and transaction against consensus rules without trusting third parties. Stores complete blockchain (~500+ GB), validates signatures, enforces supply cap, rejects invalid blocks. Provides: trustless verification, privacy (no SPV servers), network resilience, and voting power on protocol changes. Requires ~500GB disk, ~5GB RAM.",
        related: ["Node", "SPV", "Blockchain", "Consensus"]
    },

    // ===== H =====
    {
        term: "Halving",
        category: "basics",
        aka: ["Halvening", "Block Reward Halving"],
        simple: "Every 210,000 blocks (~4 years), the amount of new Bitcoin created per block is cut in half. This makes Bitcoin increasingly scarce over time.",
        advanced: "Programmatic reduction of the coinbase subsidy by 50% every 210,000 blocks. Schedule: 50 BTC (2009-2012) → 25 (2012-2016) → 12.5 (2016-2020) → 6.25 (2020-2024) → 3.125 (2024-2028). Implements deflationary monetary policy, ensuring only ~21 million BTC ever exist. Next halving: ~2028. Final satoshi mined: ~2140.",
        related: ["Block Reward", "Supply Cap", "Mining", "Inflation"]
    },
    {
        term: "Hardware Wallet",
        category: "security",
        aka: ["Cold Wallet", "Signing Device"],
        simple: "A physical device designed specifically to store Bitcoin private keys securely. Examples: Ledger, Trezor, Coldcard. Much safer than keeping keys on your computer or phone.",
        advanced: "A dedicated hardware security module (HSM) that generates and stores private keys in tamper-resistant environment. Signs transactions offline, displaying transaction details on secure screen for verification before signing. Best practices: verify addresses on device screen, use PIN/passphrase, backup seed phrase on metal, consider multi-sig. Popular open-source options: Coldcard, Foundation, BitBox02.",
        related: ["Cold Storage", "Private Key", "Seed Phrase", "Multi-Sig"]
    },
    {
        term: "Hash",
        category: "technical",
        aka: ["Hash Function", "Cryptographic Hash"],
        simple: "A mathematical function that turns any data into a fixed-length string of characters. Bitcoin uses hashing for security - even tiny changes to input create completely different outputs.",
        advanced: "A one-way cryptographic function (SHA-256 in Bitcoin) that maps arbitrary input to fixed 256-bit output. Properties: deterministic, collision-resistant, preimage-resistant, avalanche effect. Uses: proof-of-work (block hashing), address derivation (HASH160 = RIPEMD160(SHA256(x))), merkle trees, commitment schemes. Computing hashes is easy; reversing is computationally infeasible.",
        related: ["SHA-256", "Mining", "Proof-of-Work", "Merkle Tree"]
    },
    {
        term: "Hashrate",
        category: "technical",
        aka: ["Hash Power", "Network Hashrate"],
        simple: "The total computational power being used to mine Bitcoin and secure the network. Measured in hashes per second (currently ~400 EH/s = 400 quintillion hashes/sec).",
        advanced: "The rate at which miners perform SHA-256 hash computations, measured in H/s, TH/s, or EH/s. Higher hashrate = greater network security and difficulty. Current network hashrate ~400-600 EH/s. Individual miner profitability depends on: hashrate, electricity cost, difficulty, Bitcoin price. Hashrate follows price with lag due to mining investment cycles.",
        related: ["Mining", "Difficulty", "Proof-of-Work", "SHA-256"]
    },
    {
        term: "Hot Wallet",
        category: "security",
        aka: ["Online Wallet", "Connected Wallet"],
        simple: "A Bitcoin wallet connected to the internet, like a mobile app or desktop software. Convenient for daily use but less secure than cold storage.",
        advanced: "An internet-connected wallet for everyday transactions. Trade-off: convenience vs. security. Types: mobile (BlueWallet, Phoenix), desktop (Sparrow, Electrum), web (not recommended). Best for small amounts only. Security measures: strong passwords, 2FA, regular updates, encrypted backups. Never store large amounts in hot wallets - use cold storage instead.",
        related: ["Cold Storage", "Wallet", "Private Key", "Security"]
    },

    // ===== L =====
    {
        term: "Lightning Network",
        category: "lightning",
        aka: ["LN", "Lightning", "Layer 2"],
        simple: "A fast payment network built on top of Bitcoin that allows instant, cheap transactions. You open a payment channel, make unlimited transactions, then close it and settle on the main blockchain.",
        advanced: "A Layer 2 payment channel network enabling instant, low-fee Bitcoin transactions through bidirectional payment channels and hash time-locked contracts (HTLCs). Channels use multi-sig addresses and commitment transactions. Payments route through multiple hops using onion routing. Scales Bitcoin to millions of TPS while maintaining self-custody. Trade-offs: online requirement, channel liquidity management, routing failures.",
        related: ["Payment Channel", "HTLC", "Layer 2", "Routing"]
    },

    // ===== M =====
    {
        term: "Mempool",
        category: "technical",
        aka: ["Memory Pool", "Transaction Pool"],
        simple: "A waiting room for unconfirmed transactions. Miners pick transactions from the mempool based on fees and include them in the next block.",
        advanced: "Each node's local cache of unconfirmed transactions waiting for inclusion in a block. Not consensus-critical - each node maintains its own mempool with potentially different contents. Transactions enter via broadcast, leave via block inclusion or expiry (~2 weeks default). Mempool fullness determines fee market. Size limits prevent DoS (default: 300 MB). mempool.space visualizes global mempool state.",
        related: ["Transaction Fee", "Block", "Confirmation", "RBF"]
    },
    {
        term: "Mining",
        category: "technical",
        aka: ["Bitcoin Mining", "Proof-of-Work Mining"],
        simple: "The process of using computer power to solve complex math problems that verify Bitcoin transactions and add new blocks to the blockchain. Miners earn new bitcoins as a reward.",
        advanced: "The process of finding a valid nonce such that SHA-256(SHA-256(block_header)) < difficulty_target. Miners collect transactions, construct candidate blocks, and perform trillions of hashes seeking valid proof-of-work. Winner receives block reward (subsidy + fees). Mining secures the network via economic cost, distributes new coins fairly, and achieves decentralized timestamp server. Uses specialized ASICs (~100 TH/s each).",
        related: ["Proof-of-Work", "Block Reward", "Hashrate", "Difficulty", "ASIC"]
    },
    {
        term: "Mnemonic",
        category: "security",
        aka: ["Seed Phrase", "Recovery Phrase", "12/24 Words"],
        simple: "A list of 12 or 24 words that represent your private key in human-readable form. Write these down and store them safely - they can recover your entire wallet.",
        advanced: "A BIP39-compliant word list encoding a 128-bit (12 words) or 256-bit (24 words) seed with checksum. Converts entropy into memorable phrase from standardized 2048-word dictionary. Seed derives master extended private key (xprv) via PBKDF2 with optional passphrase (25th word). Mnemonic enables deterministic key generation, easy backups, and wallet recovery. Never store digitally - use metal backups.",
        related: ["Private Key", "HD Wallet", "BIP39", "Seed Phrase"]
    },
    {
        term: "Multi-Sig",
        category: "security",
        aka: ["Multisignature", "Multi-Signature"],
        simple: "A wallet that requires multiple private keys to authorize a transaction (e.g., 2-of-3 means 2 out of 3 keys needed). Provides extra security and shared control.",
        advanced: "Pay-to-Script-Hash (P2SH) or Pay-to-Witness-Script-Hash (P2WSH) address requiring M-of-N signatures to spend. Common setups: 2-of-3 (personal backup, shared custody), 3-of-5 (corporate treasury). Benefits: no single point of failure, key compromise tolerance, geographic distribution. Implementations: native Bitcoin Script, Miniscript, or MuSig2 (Schnorr). Trade-offs: complexity, coordination overhead.",
        related: ["Private Key", "Cold Storage", "Security", "P2SH"]
    },

    // ===== N =====
    {
        term: "Node",
        category: "technical",
        aka: ["Bitcoin Node", "Network Node"],
        simple: "A computer running Bitcoin software that helps maintain the network. Nodes validate transactions, store the blockchain, and relay information to other nodes.",
        advanced: "Any device running Bitcoin software and participating in the peer-to-peer network. Types: (1) Full nodes - validate all rules, store full blockchain; (2) Pruned nodes - validate all but discard old blocks; (3) Archival nodes - full nodes serving historical data; (4) Lightning nodes - maintain payment channels. Nodes communicate via Bitcoin P2P protocol (port 8333). ~15,000+ reachable nodes globally.",
        related: ["Full Node", "SPV", "Blockchain", "Network"]
    },
    {
        term: "Nonce",
        category: "technical",
        aka: ["Number Used Once"],
        simple: "A random number miners change repeatedly when trying to mine a block. They keep trying different nonces until they find one that creates a valid block hash.",
        advanced: "A 32-bit field in the block header that miners increment to search for valid proof-of-work. With current difficulty, 2^32 nonce space is exhausted in milliseconds, so miners also vary timestamp, extra nonce in coinbase, or transaction order. Nonce is the primary variable in the mining puzzle: find nonce where SHA-256(SHA-256(header)) < target.",
        related: ["Mining", "Proof-of-Work", "Block", "Difficulty"]
    },

    // ===== P =====
    {
        term: "Private Key",
        category: "security",
        aka: ["Secret Key", "Signing Key"],
        simple: "A secret number that proves you own bitcoins at a specific address. Like a password, but impossible to reset if lost. Never share your private keys!",
        advanced: "A 256-bit random number from which public keys and addresses are derived. Used to create ECDSA/Schnorr signatures proving ownership of UTXOs. Must be cryptographically random and kept secret. Compromise = loss of funds. Modern wallets use HD derivation (BIP32) to generate multiple keys from single seed. Private key → Public key (one-way via elliptic curve multiplication) → Address (one-way via hashing).",
        related: ["Public Key", "Seed Phrase", "Address", "Wallet"]
    },
    {
        term: "Proof-of-Work",
        category: "technical",
        aka: ["PoW", "Hashcash"],
        simple: "A system requiring miners to solve difficult math problems (using lots of computing power) to add blocks. This work secures Bitcoin and makes attacks expensive.",
        advanced: "A consensus mechanism requiring computational work to propose blocks. Miners find nonces producing hashes below difficulty target, proving expended energy. PoW properties: (1) hard to produce (energy cost), (2) easy to verify (one hash), (3) progress-free (no advantage from previous attempts). Secures network via economic cost - attacking requires majority hashrate AND sustained energy expense. Bitcoin uses SHA-256-based PoW (Hashcash variant).",
        related: ["Mining", "Hashrate", "Difficulty", "Consensus"]
    },
    {
        term: "Public Key",
        category: "technical",
        aka: ["Pubkey"],
        simple: "A cryptographic key derived from your private key that can be safely shared. Others can use it to verify your signatures but cannot spend your bitcoins.",
        advanced: "A point on the secp256k1 elliptic curve derived from the private key via elliptic curve multiplication (pubkey = privkey × G, where G is generator point). Compressed pubkeys (33 bytes) include y-coordinate sign; uncompressed (65 bytes) include full coordinates. Used to: (1) derive addresses (hashed), (2) verify signatures, (3) create multi-sig scripts. Public keys can be safely shared - they cannot reverse to private keys.",
        related: ["Private Key", "Address", "Signature", "ECDSA"]
    },

    // ===== R =====
    {
        term: "RBF",
        category: "technical",
        aka: ["Replace-By-Fee", "BIP125"],
        simple: "A feature that lets you increase the fee on an unconfirmed transaction to make it confirm faster. Useful if you initially set the fee too low.",
        advanced: "BIP125 opt-in transaction replacement allowing users to broadcast a new version of an unconfirmed transaction with higher fees. Requires original transaction to signal replaceability (nSequence < 0xfffffffe). Replacement must: (1) pay higher absolute fee, (2) pay higher fee rate, (3) not replace >100 transactions. Prevents fee market deadlocks. Wallets supporting RBF: Electrum, Sparrow, Bitcoin Core.",
        related: ["Transaction Fee", "Mempool", "CPFP", "Confirmation"]
    },

    // ===== S =====
    {
        term: "Satoshi",
        category: "basics",
        aka: ["Sat", "Satoshis"],
        simple: "The smallest unit of Bitcoin. 1 Bitcoin = 100,000,000 satoshis. Named after Bitcoin's creator.",
        advanced: "The smallest indivisible unit of Bitcoin (0.00000001 BTC = 1 sat). Named after Satoshi Nakamoto. Allows microtransactions and precise fee calculations. With Bitcoin's price growth, many transactions are denominated in sats rather than BTC. Lightning Network operates primarily in sats. Some propose eventual transition to sat-denominated pricing (1 sat = 1 unit).",
        related: ["Bitcoin", "Satoshi Nakamoto"]
    },
    {
        term: "Satoshi Nakamoto",
        category: "basics",
        aka: ["Satoshi"],
        simple: "The pseudonymous creator of Bitcoin who published the whitepaper in 2008 and launched the network in 2009. True identity remains unknown.",
        advanced: "Pseudonymous individual or group that authored the Bitcoin whitepaper (October 31, 2008), implemented the original Bitcoin software (Bitcoin v0.1, January 3, 2009), and mined early blocks (~1 million BTC). Communicated via email/forum until mid-2010, then disappeared. Identity speculation includes Nick Szabo, Hal Finney, Adam Back, or groups of cypherpunks. Likely holds ~1M BTC (Patoshi coins), unmoved since 2010.",
        related: ["Bitcoin", "Genesis Block", "Whitepaper"]
    },
    {
        term: "SegWit",
        category: "technical",
        aka: ["Segregated Witness", "BIP141"],
        simple: "A 2017 upgrade that reorganized transaction data to fix bugs, enable Lightning Network, and increase block capacity without changing the block size limit.",
        advanced: "BIP141 soft fork (activated August 2017) separating signature data ('witness') from transaction data. Benefits: (1) fixes transaction malleability enabling Lightning, (2) increases effective block size to ~2-4MB via block weight units, (3) enables script versioning for future upgrades, (4) reduces fees for SegWit transactions. Native SegWit addresses start with 'bc1'. Adoption: ~90%+ of transactions.",
        related: ["Transaction Malleability", "Lightning Network", "Soft Fork", "Block Weight"]
    },
    {
        term: "Seed Phrase",
        category: "security",
        aka: ["Mnemonic", "Recovery Phrase", "Backup Phrase"],
        simple: "12 or 24 words that back up your entire Bitcoin wallet. Anyone with these words can access your funds, so keep them extremely safe and private.",
        advanced: "BIP39 mnemonic encoding a cryptographic seed for deterministic wallet derivation. Generated from 128-256 bits entropy + checksum, mapped to word list. Seed is hashed (PBKDF2 with 2048 rounds) with optional passphrase to create master private key (BIP32). From this, infinite hierarchical keys are derived (BIP44). Best practices: metal backups, geographic distribution, never digital storage, test recovery.",
        related: ["Mnemonic", "Private Key", "HD Wallet", "BIP39"]
    },
    {
        term: "SHA-256",
        category: "technical",
        aka: ["Secure Hash Algorithm"],
        simple: "The cryptographic hash function Bitcoin uses for mining and security. It creates a unique 'fingerprint' for any piece of data.",
        advanced: "A cryptographic hash function producing 256-bit outputs from arbitrary inputs. Part of SHA-2 family (NSA-designed, 2001). Bitcoin uses double-SHA-256 for mining (SHA-256(SHA-256(header)) < target) and HASH256 for transaction IDs. Properties: deterministic, avalanche effect, collision-resistant (~2^128 operations), preimage-resistant (~2^256 operations). Despite quantum computing advances, SHA-256 remains secure.",
        related: ["Hash", "Mining", "Proof-of-Work"]
    },
    {
        term: "Soft Fork",
        category: "technical",
        simple: "A backward-compatible upgrade to Bitcoin's rules. Old nodes still work, but new nodes enforce stricter rules. Examples: SegWit, Taproot.",
        advanced: "A protocol change that tightens consensus rules, making previously valid blocks/transactions invalid. Backward-compatible - upgraded nodes reject some blocks that old nodes accept, but never vice versa. Old nodes follow upgraded chain as long as majority hashrate enforces new rules. Activation methods: BIP9 (version bits), BIP8 (user-activated), BIP148 (UASF). Recent soft forks: SegWit (2017), Taproot (2021).",
        related: ["Hard Fork", "Fork", "BIP", "Taproot", "SegWit"]
    },

    // ===== T =====
    {
        term: "Taproot",
        category: "technical",
        aka: ["BIP340-342", "Schnorr"],
        simple: "A 2021 Bitcoin upgrade that improves privacy, reduces transaction sizes, and enables more complex smart contracts using Schnorr signatures.",
        advanced: "BIP340-342 soft fork (activated November 2021) implementing Schnorr signatures, MAST (Merkelized Alternative Script Trees), and Tapscript. Benefits: (1) signature aggregation (MuSig2), (2) smaller multi-sig transactions, (3) improved privacy (multi-sig looks like single-sig), (4) more efficient complex scripts. All outputs now pay to Taproot (P2TR, 'bc1p' addresses). Enables future innovations like covenant proposals.",
        related: ["Schnorr", "Soft Fork", "Multi-Sig", "Privacy"]
    },
    {
        term: "Transaction",
        category: "basics",
        aka: ["TX", "Bitcoin Transaction"],
        simple: "A transfer of Bitcoin from one address to another, recorded permanently on the blockchain. Includes sender, receiver, amount, and fee.",
        advanced: "A data structure consuming UTXOs (inputs) and creating new UTXOs (outputs), signed by private keys proving ownership. Contains: version, inputs (previous TX refs + signatures), outputs (amounts + locking scripts), locktime. Transaction ID (txid) is double-SHA-256 of serialized transaction. Size measured in bytes or vBytes (SegWit). No 'account balances' - wallet balance is sum of spendable UTXOs.",
        related: ["UTXO", "Input", "Output", "Transaction Fee"]
    },
    {
        term: "Transaction Fee",
        category: "basics",
        aka: ["Miner Fee", "Network Fee"],
        simple: "A small amount paid to miners for processing your transaction. Higher fees = faster confirmation. Measured in sats per byte.",
        advanced: "The difference between input and output values, claimed by the miner. Measured in sat/vB (satoshis per virtual byte). Fee market is dynamic - higher mempool congestion = higher fees needed. Typical ranges: 1-5 sat/vB (low priority), 10-50 sat/vB (normal), 100+ sat/vB (urgent). RBF and CPFP allow fee adjustment. Lightning Network bypasses on-chain fees for small transactions.",
        related: ["Mempool", "Mining", "Confirmation", "RBF", "Satoshi"]
    },

    // ===== U =====
    {
        term: "UTXO",
        category: "technical",
        aka: ["Unspent Transaction Output", "UTXO Set"],
        simple: "A chunk of Bitcoin that hasn't been spent yet, like a bill in your physical wallet. Your wallet balance is the sum of all your UTXOs.",
        advanced: "An unspent output from a previous transaction, representing spendable Bitcoin. The UTXO model (vs. account model) means there are no 'account balances' - only discrete outputs. Each UTXO has: amount, locking script (pubkey/address), and block height. The UTXO set (~100M entries, ~5GB) is the critical state all full nodes maintain. Spending a UTXO consumes it entirely; change is returned as new UTXO. Consolidation reduces UTXO count and future fees.",
        related: ["Transaction", "Input", "Output", "Wallet"]
    },

    // ===== W =====
    {
        term: "Wallet",
        category: "basics",
        aka: ["Bitcoin Wallet", "Digital Wallet"],
        simple: "Software or hardware that stores your private keys and lets you send/receive Bitcoin. Your wallet doesn't actually hold Bitcoin - it holds the keys to access Bitcoin on the blockchain.",
        advanced: "A collection of private keys and software for signing transactions. Types: (1) Hot wallets (mobile/desktop/web), (2) Cold wallets (hardware/paper), (3) Custodial (exchange-controlled), (4) Non-custodial (self-custody). Modern wallets use BIP32 HD derivation, BIP39 mnemonics, and BIP44 address discovery. Best practice: non-custodial hardware wallet with multi-sig for large amounts, hot wallet for spending money.",
        related: ["Private Key", "Seed Phrase", "Hot Wallet", "Cold Storage"]
    },
    {
        term: "Whitepaper",
        category: "basics",
        aka: ["Bitcoin Whitepaper"],
        simple: "The original 9-page document written by Satoshi Nakamoto in 2008 titled 'Bitcoin: A Peer-to-Peer Electronic Cash System' that introduced Bitcoin to the world.",
        advanced: "Satoshi Nakamoto's foundational document (October 31, 2008) describing Bitcoin's design: proof-of-work consensus, UTXO model, Merkle trees, SPV clients, and privacy model. Notably absent: hard-coded supply cap (in code but not paper), scripting capabilities, and many implementation details added later. PDF available at bitcoin.org/bitcoin.pdf. Essential reading for understanding Bitcoin's design philosophy and trade-offs.",
        related: ["Satoshi Nakamoto", "Bitcoin", "Proof-of-Work"]
    }
];

// Make available globally
if (typeof window !== 'undefined') {
    window.GLOSSARY_TERMS = GLOSSARY_TERMS;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GLOSSARY_TERMS };
}
