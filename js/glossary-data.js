window.GLOSSARY_TERMS = [
  {
    "term": "Seed phrase",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "custody",
      "recovery",
      "family"
    ],
    "simple": "A set of words that can restore access to a Bitcoin wallet.",
    "advanced": "It is recovery access. If someone can use it, they may be able to move the Bitcoin.",
    "engine": true,
    "misconception": "It is just a password.",
    "reality": "It is recovery access. If someone can use it, they may be able to move the Bitcoin.",
    "why": "Treating it like a normal password leads people to photograph it, email it, store it in the cloud, or hide it so well no one can recover it.",
    "failure": "A parent writes the words down safely, but nobody knows what they mean or who to call in an emergency.",
    "proof": "Can you explain why a seed phrase is not like a bank password without revealing your own?",
    "next": "Create a first-page emergency instruction that says what not to do, who to call, and where the next step lives. Do not include the seed phrase there."
  },
  {
    "term": "Private key",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "keys",
      "cryptography",
      "custody"
    ],
    "simple": "A secret number used to prove the right to spend Bitcoin from a related address or script.",
    "advanced": "The app or hardware device protects and uses the key, but the key is the actual signing power.",
    "engine": true,
    "misconception": "It is a file inside the wallet app.",
    "reality": "The app or hardware device protects and uses the key, but the key is the actual signing power.",
    "why": "People may protect the device while exposing the backup that can recreate the keys.",
    "failure": "Someone keeps a hardware wallet in a safe but stores the seed phrase in a photo folder.",
    "proof": "Can you explain the difference between a device, a wallet app, a seed phrase, and a private key?",
    "next": "Map where signing power exists and where recovery power exists. They are related but not the same."
  },
  {
    "term": "Wallet",
    "category": "Bitcoin basics",
    "categorySlug": "bitcoin-basics",
    "level": "Beginner",
    "tags": [
      "wallet",
      "custody"
    ],
    "simple": "Software or hardware that helps create, manage, and sign Bitcoin transactions.",
    "advanced": "Bitcoin lives on the ledger. The wallet manages keys and builds transactions.",
    "engine": true,
    "misconception": "A wallet stores Bitcoin the way a leather wallet stores cash.",
    "reality": "Bitcoin lives on the ledger. The wallet manages keys and builds transactions.",
    "why": "This mistake makes people think losing a device always means losing Bitcoin, or that having a device always means being safe.",
    "failure": "A person panics after losing a hardware wallet, not realizing the seed phrase can restore access.",
    "proof": "Can you explain where the Bitcoin is and what the wallet actually controls?",
    "next": "Teach the wallet/device/seed phrase distinction before any self-custody setup."
  },
  {
    "term": "Self-custody",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "custody",
      "sovereignty"
    ],
    "simple": "Holding Bitcoin in a way where you control the keys rather than relying only on a custodian.",
    "advanced": "Self-custody removes one kind of counterparty risk but creates operational responsibility.",
    "engine": true,
    "misconception": "Self-custody means no trust, no process, and no help.",
    "reality": "Self-custody removes one kind of counterparty risk but creates operational responsibility.",
    "why": "People can become careless because they think the phrase itself makes them sovereign.",
    "failure": "Someone moves Bitcoin off an exchange but never tests recovery or explains anything to family.",
    "proof": "Can you name the risk you removed and the new risk you accepted?",
    "next": "Run a small recovery test and write a safe emergency instruction."
  },
  {
    "term": "Multisig",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "custody",
      "family",
      "advisor"
    ],
    "simple": "A setup that requires more than one key or signer to authorize spending.",
    "advanced": "Good multisig can reduce single-point failure. Bad multisig can create confusion, dead ends, or false confidence.",
    "engine": true,
    "misconception": "Multisig automatically makes Bitcoin safe.",
    "reality": "Good multisig can reduce single-point failure. Bad multisig can create confusion, dead ends, or false confidence.",
    "why": "People may focus on the number of keys and ignore storage, recovery, coordination, and documentation.",
    "failure": "A family uses 2-of-3 multisig but stores all keys in one house.",
    "proof": "Can you explain what happens if one key is lost, one signer is unavailable, or the coordinator disappears?",
    "next": "Document key locations, signer roles, recovery steps, and emergency contacts without placing all secrets together."
  },
  {
    "term": "Custodian",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "exchange",
      "counterparty",
      "custody"
    ],
    "simple": "A person or company that holds or controls Bitcoin on someone else’s behalf.",
    "advanced": "A custodian controls the keys. A self-custody wallet lets you control the keys.",
    "engine": true,
    "misconception": "A custodian is the same as a wallet.",
    "reality": "A custodian controls the keys. A self-custody wallet lets you control the keys.",
    "why": "This confusion hides counterparty risk.",
    "failure": "A learner says they own Bitcoin but only has an exchange login.",
    "proof": "Can you answer: who can move the Bitcoin without asking me?",
    "next": "Use the question “Who can sign?” to classify every setup."
  },
  {
    "term": "Recovery",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "recovery",
      "family",
      "continuity"
    ],
    "simple": "The process for restoring access to Bitcoin after loss, device failure, death, travel, or emergency.",
    "advanced": "Recovery means the right person can follow a safe process without exposing everything at once.",
    "engine": true,
    "misconception": "Recovery means knowing where the seed phrase is.",
    "reality": "Recovery means the right person can follow a safe process without exposing everything at once.",
    "why": "A seed phrase without instructions can be dangerous or useless.",
    "failure": "An executor finds words but does not know whether to type them into a website.",
    "proof": "Could a trusted helper begin the recovery process without you and without stealing funds?",
    "next": "Create a separated recovery map: first instruction, trusted contact, device info, and sensitive material kept apart."
  },
  {
    "term": "Inheritance",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family",
      "estate",
      "recovery"
    ],
    "simple": "The process for passing Bitcoin access and knowledge after death or incapacity.",
    "advanced": "Legal ownership and technical access are different problems.",
    "engine": true,
    "misconception": "Putting Bitcoin in a will is enough.",
    "reality": "Legal ownership and technical access are different problems.",
    "why": "A will may identify heirs, but it may not give them safe access to keys.",
    "failure": "The heir owns the asset legally but cannot recover it technically.",
    "proof": "Can you separate legal instruction, technical access, and privacy protection?",
    "next": "Create a plan that coordinates estate documents, custody setup, trusted contacts, and emergency instructions."
  },
  {
    "term": "Bitcoin address",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Beginner",
    "tags": [
      "transactions",
      "privacy"
    ],
    "simple": "A destination that can receive Bitcoin, usually derived from a public key or script.",
    "advanced": "Addresses should usually be treated as single-use destinations for privacy and safety.",
    "engine": true,
    "misconception": "It is like an account number you reuse forever.",
    "reality": "Addresses should usually be treated as single-use destinations for privacy and safety.",
    "why": "Reuse can link payments and reveal balances or habits.",
    "failure": "A business reuses one donation address and exposes its full incoming payment history.",
    "proof": "Can you explain why a fresh address improves privacy?",
    "next": "Use wallets that generate a new receiving address for each payment."
  },
  {
    "term": "UTXO",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Intermediate",
    "tags": [
      "privacy",
      "fees",
      "transactions"
    ],
    "simple": "An unspent transaction output. It is a chunk of Bitcoin that can be spent in a future transaction.",
    "advanced": "A wallet shows one balance, but underneath it may control many separate UTXOs.",
    "engine": true,
    "misconception": "Bitcoin works like one account balance.",
    "reality": "A wallet shows one balance, but underneath it may control many separate UTXOs.",
    "why": "UTXOs affect fees, privacy, and coin control.",
    "failure": "A user combines private and public UTXOs and links separate parts of their life.",
    "proof": "Can you explain why two wallets with the same balance can have different fee and privacy risks?",
    "next": "Learn coin control before large consolidations or privacy-sensitive spending."
  },
  {
    "term": "Lightning Network",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Intermediate",
    "tags": [
      "payments",
      "lightning"
    ],
    "simple": "A payment network built on Bitcoin that uses channels to make fast, low-cost payments.",
    "advanced": "Lightning uses Bitcoin as its base, but it has different tradeoffs around liquidity, channels, routing, and uptime.",
    "engine": true,
    "misconception": "Lightning replaces Bitcoin settlement.",
    "reality": "Lightning uses Bitcoin as its base, but it has different tradeoffs around liquidity, channels, routing, and uptime.",
    "why": "People may use Lightning for the wrong job or misunderstand custody in Lightning apps.",
    "failure": "A learner uses a custodial Lightning wallet and thinks it is the same as self-custody.",
    "proof": "Can you explain the difference between on-chain Bitcoin, a Lightning channel, and a custodial Lightning balance?",
    "next": "Classify each Lightning tool by who controls keys and who controls liquidity."
  },
  {
    "term": "Final settlement",
    "category": "Money and settlement",
    "categorySlug": "money-and-settlement",
    "level": "Intermediate",
    "tags": [
      "payments",
      "settlement",
      "money"
    ],
    "simple": "The point where a payment is no longer just a promise and is considered settled under the system’s rules.",
    "advanced": "Many payments are reversible, delayed, or dependent on intermediaries. Bitcoin settlement follows different rules.",
    "engine": true,
    "misconception": "A payment notification means final settlement.",
    "reality": "Many payments are reversible, delayed, or dependent on intermediaries. Bitcoin settlement follows different rules.",
    "why": "Confusing authorization with settlement hides risk.",
    "failure": "A merchant ships goods after a payment appears pending but later reverses.",
    "proof": "Can you identify who can reverse, block, or delay each payment method?",
    "next": "Compare card, bank transfer, Lightning, and on-chain Bitcoin settlement in one chart."
  },
  {
    "term": "Inflation",
    "category": "Economics",
    "categorySlug": "economics",
    "level": "Beginner",
    "tags": [
      "money",
      "prices"
    ],
    "simple": "A rise in the general price level or a loss of purchasing power, often connected to money supply and demand conditions.",
    "advanced": "Prices can rise for many reasons, but monetary inflation changes the measuring stick itself.",
    "engine": true,
    "misconception": "Inflation only means companies raise prices.",
    "reality": "Prices can rise for many reasons, but monetary inflation changes the measuring stick itself.",
    "why": "People blame only stores and miss the deeper money problem.",
    "failure": "A saver thinks they are staying safe in cash while purchasing power falls.",
    "proof": "Can you explain the difference between one product becoming expensive and the currency losing value broadly?",
    "next": "Use a before/after purchasing power example instead of only a CPI chart."
  },
  {
    "term": "Purchasing power",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "savings",
      "inflation"
    ],
    "simple": "How much real goods and services a unit of money can buy.",
    "advanced": "The number can stay the same while what it buys declines.",
    "engine": true,
    "misconception": "If the number in my account is the same, my savings are unchanged.",
    "reality": "The number can stay the same while what it buys declines.",
    "why": "People measure savings in nominal terms instead of real terms.",
    "failure": "A family saves pesos or dollars but ignores how costs moved around them.",
    "proof": "Can you compare money amount and what that amount buys?",
    "next": "Add examples that show grocery, rent, transport, and education costs over time."
  },
  {
    "term": "Fiat money",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "money",
      "state"
    ],
    "simple": "Money whose value depends on government decree, legal tender rules, institutional trust, and market acceptance rather than a fixed commodity backing.",
    "advanced": "Fiat can function, but its supply and rules are controlled by institutions.",
    "engine": true,
    "misconception": "Fiat money is worthless because it is not backed by gold.",
    "reality": "Fiat can function, but its supply and rules are controlled by institutions.",
    "why": "The key issue is not that it has no use. The issue is who can change supply and access rules.",
    "failure": "A student dismisses fiat as fake and fails to understand why people still use it.",
    "proof": "Can you explain both why fiat works day to day and why it can fail savers?",
    "next": "Teach fiat through tradeoffs: convenience, acceptance, control, inflation, access."
  },
  {
    "term": "Hard money",
    "category": "Money",
    "categorySlug": "money",
    "level": "Intermediate",
    "tags": [
      "sound money",
      "scarcity"
    ],
    "simple": "Money that is difficult to create more of, especially compared with demand for it.",
    "advanced": "Hard money can be volatile in market price while still being hard to inflate in supply.",
    "engine": true,
    "misconception": "Hard money means the price never falls.",
    "reality": "Hard money can be volatile in market price while still being hard to inflate in supply.",
    "why": "Students confuse price stability with supply discipline.",
    "failure": "A learner sells because Bitcoin’s price dropped, thinking scarcity failed.",
    "proof": "Can you separate supply rule from market price?",
    "next": "Compare issuance schedule, market demand, and purchasing power over time."
  },
  {
    "term": "Central bank",
    "category": "Fiscal and monetary systems",
    "categorySlug": "fiscal-and-monetary-systems",
    "level": "Beginner",
    "tags": [
      "banking",
      "policy"
    ],
    "simple": "An institution that manages monetary policy, reserves, and sometimes banking stability for a currency area.",
    "advanced": "It influences interest rates, liquidity, bank reserves, and currency conditions.",
    "engine": true,
    "misconception": "A central bank simply stores a country’s money.",
    "reality": "It influences interest rates, liquidity, bank reserves, and currency conditions.",
    "why": "Without this, students cannot understand inflation, bailouts, or currency pressure.",
    "failure": "A student sees interest rates as random instead of policy tools.",
    "proof": "Can you name two ways a central bank changes financial conditions?",
    "next": "Use a simple diagram: government, central bank, commercial banks, households."
  },
  {
    "term": "Bank run",
    "category": "Banking",
    "categorySlug": "banking",
    "level": "Beginner",
    "tags": [
      "banking",
      "fragility"
    ],
    "simple": "A rush to withdraw money when depositors fear a bank cannot meet demands.",
    "advanced": "Panic matters, but fractional reserves, duration mismatch, trust, and liquidity matter too.",
    "engine": true,
    "misconception": "A bank run only happens because people panic.",
    "reality": "Panic matters, but fractional reserves, duration mismatch, trust, and liquidity matter too.",
    "why": "Students may miss why confidence is part of the system.",
    "failure": "A bank looks solvent on paper but cannot meet sudden withdrawals.",
    "proof": "Can you explain why a bank can be solvent and still have liquidity stress?",
    "next": "Connect to custody: access risk is different from price risk."
  },
  {
    "term": "4x1000",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Beginner",
    "tags": [
      "Colombia",
      "tax",
      "banking"
    ],
    "simple": "A Colombian financial transaction tax applied to certain movements of money through the banking system.",
    "advanced": "Small friction repeated across payments can shape behavior and trust in the banking system.",
    "engine": true,
    "misconception": "It is too small to matter.",
    "reality": "Small friction repeated across payments can shape behavior and trust in the banking system.",
    "why": "It helps Colombian learners feel that monetary friction is not theoretical.",
    "failure": "A person ignores transaction frictions until they stack up across payroll, transfers, and savings moves.",
    "proof": "Can you show how a small transaction tax changes behavior when money moves often?",
    "next": "Use it as a local example in lessons about friction, banking, and alternative settlement."
  },
  {
    "term": "UVT",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Beginner",
    "tags": [
      "Colombia",
      "tax"
    ],
    "simple": "A Colombian tax value unit used to express thresholds, penalties, and tax figures.",
    "advanced": "It is a unit that changes over time, so thresholds tied to it can move.",
    "engine": true,
    "misconception": "It is a normal currency amount.",
    "reality": "It is a unit that changes over time, so thresholds tied to it can move.",
    "why": "Students need to know why legal and tax thresholds do not always stay fixed in pesos.",
    "failure": "A learner compares old and new rules without adjusting for UVT changes.",
    "proof": "Can you explain why a tax rule might use UVT instead of a fixed peso amount?",
    "next": "Use UVT in fiscal literacy modules, not as Bitcoin advice."
  },
  {
    "term": "Hash function",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "cryptography",
      "mining",
      "dev"
    ],
    "simple": "A one-way function that turns data into a fixed-size output that changes unpredictably when input changes.",
    "advanced": "Encryption is meant to be reversed with a key. Hashing is not.",
    "engine": true,
    "misconception": "Hashing is encryption.",
    "reality": "Encryption is meant to be reversed with a key. Hashing is not.",
    "why": "This mistake confuses mining, addresses, signatures, and password storage.",
    "failure": "A student says miners decrypt blocks, which is wrong.",
    "proof": "Can you explain why a hash can prove data changed without revealing a secret?",
    "next": "Use visual demos for SHA-256 input changes and outputs."
  },
  {
    "term": "Digital signature",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "keys",
      "transactions"
    ],
    "simple": "A cryptographic proof that a holder of a private key authorized a message or transaction.",
    "advanced": "It is mathematical proof tied to a private key and message.",
    "engine": true,
    "misconception": "A signature is a scanned name or approval note.",
    "reality": "It is mathematical proof tied to a private key and message.",
    "why": "Students must understand that Bitcoin spending is based on valid signatures, not account permission.",
    "failure": "A learner thinks a miner approves who owns Bitcoin.",
    "proof": "Can you explain what a signature proves and what it does not prove?",
    "next": "Connect signatures to private keys, public keys, and transaction validation."
  },
  {
    "term": "Node",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Intermediate",
    "tags": [
      "node",
      "validation",
      "sovereignty"
    ],
    "simple": "Software that checks Bitcoin rules and communicates with the network.",
    "advanced": "A node validates rules. Mining is a separate function.",
    "engine": true,
    "misconception": "A node mines Bitcoin.",
    "reality": "A node validates rules. Mining is a separate function.",
    "why": "This matters because validation is how users avoid trusting someone else’s version of Bitcoin.",
    "failure": "A student thinks only miners enforce the rules.",
    "proof": "Can you explain the difference between mining a block and validating a block?",
    "next": "Show how a wallet connected to your own node changes trust assumptions."
  },
  {
    "term": "Mining",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Beginner",
    "tags": [
      "mining",
      "proof-of-work"
    ],
    "simple": "The process of using energy and computation to propose blocks and secure Bitcoin’s ordering of transactions.",
    "advanced": "Mining follows Bitcoin’s issuance rules and competes to add valid blocks.",
    "engine": true,
    "misconception": "Mining creates Bitcoin out of nothing.",
    "reality": "Mining follows Bitcoin’s issuance rules and competes to add valid blocks.",
    "why": "Students miss the difference between arbitrary creation and rule-bound issuance.",
    "failure": "Someone says miners can create as much Bitcoin as they want.",
    "proof": "Can you explain why miners cannot change the 21 million limit by themselves?",
    "next": "Connect mining to nodes, difficulty adjustment, and issuance."
  },
  {
    "term": "Difficulty adjustment",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Advanced",
    "tags": [
      "mining",
      "protocol"
    ],
    "simple": "Bitcoin’s automatic adjustment that keeps blocks averaging about 10 minutes as mining power changes.",
    "advanced": "More hashpower can temporarily speed blocks, then difficulty adjusts.",
    "engine": true,
    "misconception": "More miners make Bitcoin issue faster forever.",
    "reality": "More hashpower can temporarily speed blocks, then difficulty adjusts.",
    "why": "This is central to understanding Bitcoin’s supply schedule.",
    "failure": "A learner thinks mining growth breaks scarcity.",
    "proof": "Can you explain what happens if hashpower doubles?",
    "next": "Use a simple time-chain demo with faster blocks and adjustment."
  },
  {
    "term": "Full node",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Advanced",
    "tags": [
      "node",
      "validation"
    ],
    "simple": "A node that independently verifies Bitcoin’s rules and maintains its own view of the chain.",
    "advanced": "A full node gives validation sovereignty, not mining rewards.",
    "engine": true,
    "misconception": "Running a node earns Bitcoin.",
    "reality": "A full node gives validation sovereignty, not mining rewards.",
    "why": "People may undervalue nodes because they do not pay income.",
    "failure": "A user relies only on a third-party explorer and trusts its version of balances.",
    "proof": "Can you explain what trust is reduced by using your own node?",
    "next": "Connect full nodes to privacy, rule validation, and wallet verification."
  },
  {
    "term": "PSBT",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Advanced",
    "tags": [
      "multisig",
      "hardware wallet",
      "dev"
    ],
    "simple": "Partially Signed Bitcoin Transaction, a format for passing a transaction between wallets or signers before broadcast.",
    "advanced": "It is a transaction package that may still need signatures or broadcast.",
    "engine": true,
    "misconception": "A PSBT is already a sent transaction.",
    "reality": "It is a transaction package that may still need signatures or broadcast.",
    "why": "This matters in multisig, airgapped signing, and advisor-assisted workflows.",
    "failure": "A signer thinks sharing a PSBT means funds moved, when nothing was broadcast.",
    "proof": "Can you explain the stages: create, sign, combine, broadcast?",
    "next": "Use PSBTs in multisig lessons and continuity packets."
  },
  {
    "term": "API key",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops",
      "security"
    ],
    "simple": "A credential used by software to authenticate with a service or API.",
    "advanced": "It can grant access, usage, billing, or data privileges.",
    "engine": true,
    "misconception": "It is harmless configuration text.",
    "reality": "It can grant access, usage, billing, or data privileges.",
    "why": "Leaked API keys can compromise systems or create costs.",
    "failure": "A developer commits an API key to GitHub and triggers secret scanning.",
    "proof": "Can you explain why `.env.local` should not be committed?",
    "next": "Add secret scanning, `.gitignore`, and key rotation instructions to dev workflows."
  },
  {
    "term": "Environment variable",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops",
      "deployment"
    ],
    "simple": "A configuration value provided to software outside the source code.",
    "advanced": "They reduce hardcoding but still need access control, rotation, and careful logging.",
    "engine": true,
    "misconception": "Environment variables are automatically secure.",
    "reality": "They reduce hardcoding but still need access control, rotation, and careful logging.",
    "why": "Students building tools need to know that configuration is part of security.",
    "failure": "A server logs sensitive env values during debugging.",
    "proof": "Can you name where env vars are set locally, in CI, and in production?",
    "next": "Document which variables are local, preview, production, and secret."
  },
  {
    "term": "CI",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "github",
      "testing",
      "deployment"
    ],
    "simple": "Continuous integration, a process that runs checks when code changes.",
    "advanced": "CI only checks what it is configured to check.",
    "engine": true,
    "misconception": "CI means the site is correct.",
    "reality": "CI only checks what it is configured to check.",
    "why": "A green build can still ship bad content or bad UX.",
    "failure": "A page passes build but contains a broken educational claim or missing CTA.",
    "proof": "Can you name one technical check and one content check CI should run?",
    "next": "Add link checks, accessibility checks, secret scans, and claim freshness checks."
  },
  {
    "term": "Money",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "money"
    ],
    "simple": "A tool used to store value, measure prices, and exchange goods or services.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Medium of exchange",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "money"
    ],
    "simple": "Something people accept to trade for goods and services.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Store of value",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "money"
    ],
    "simple": "Something people hold because they expect it to preserve usefulness or purchasing power over time.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Unit of account",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "money"
    ],
    "simple": "The measuring unit people use to quote prices and compare value.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Sound money",
    "category": "Money",
    "categorySlug": "money",
    "level": "Intermediate",
    "tags": [
      "sound money"
    ],
    "simple": "Money that is hard to debase and reliable across time.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Soft money",
    "category": "Money",
    "categorySlug": "money",
    "level": "Intermediate",
    "tags": [
      "money"
    ],
    "simple": "Money that can be expanded or debased more easily.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Scarcity",
    "category": "Economics",
    "categorySlug": "economics",
    "level": "Beginner",
    "tags": [
      "economics"
    ],
    "simple": "Limited availability compared with demand.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Absolute scarcity",
    "category": "Bitcoin economics",
    "categorySlug": "bitcoin-economics",
    "level": "Intermediate",
    "tags": [
      "bitcoin",
      "scarcity"
    ],
    "simple": "A supply limit that cannot be exceeded under the system’s rules without rejecting those rules.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Opportunity cost",
    "category": "Economics",
    "categorySlug": "economics",
    "level": "Beginner",
    "tags": [
      "economics"
    ],
    "simple": "The value of what you give up when you choose one option over another.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Time preference",
    "category": "Economics",
    "categorySlug": "economics",
    "level": "Intermediate",
    "tags": [
      "economics"
    ],
    "simple": "How much a person values present consumption compared with future consumption.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Capital",
    "category": "Economics",
    "categorySlug": "economics",
    "level": "Beginner",
    "tags": [
      "economics"
    ],
    "simple": "Resources used to produce more goods, services, or income.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Savings",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Money or value not spent now so it can be used later.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Debt",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "An obligation to repay borrowed value.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Credit",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "The ability to borrow based on trust, collateral, income, or reputation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Interest",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "The cost of borrowing or the return paid for lending.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Interest rate",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "The percentage charged or earned over time on borrowed or lent money.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Compound interest",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Growth where returns are added to principal and then earn returns too.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Nominal value",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "The number amount stated in currency units before adjusting for inflation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Real value",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "The value after adjusting for purchasing power or inflation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Cash flow",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Money moving in and out over time.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Balance sheet",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Intermediate",
    "tags": [
      "business"
    ],
    "simple": "A snapshot of assets, liabilities, and equity.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Asset",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Something owned that has value or usefulness.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Liability",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Something owed to someone else.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Equity",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Intermediate",
    "tags": [
      "business"
    ],
    "simple": "Ownership value after subtracting liabilities from assets.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Liquidity",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Intermediate",
    "tags": [
      "financial literacy"
    ],
    "simple": "How easily something can be turned into spendable money without large loss or delay.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Solvency",
    "category": "Banking",
    "categorySlug": "banking",
    "level": "Intermediate",
    "tags": [
      "banking"
    ],
    "simple": "Having assets sufficient to cover liabilities over time.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Counterparty risk",
    "category": "Financial risk",
    "categorySlug": "financial-risk",
    "level": "Intermediate",
    "tags": [
      "risk"
    ],
    "simple": "The risk that the person or institution you depend on fails to do what they owe.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Custody risk",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "custody"
    ],
    "simple": "The risk that access or control fails because of who holds the keys or process.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Price risk",
    "category": "Financial risk",
    "categorySlug": "financial-risk",
    "level": "Beginner",
    "tags": [
      "risk"
    ],
    "simple": "The risk that market price moves against you.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Access risk",
    "category": "Financial risk",
    "categorySlug": "financial-risk",
    "level": "Beginner",
    "tags": [
      "risk"
    ],
    "simple": "The risk that you cannot use or move your money when needed.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Reinvestment risk",
    "category": "Financial risk",
    "categorySlug": "financial-risk",
    "level": "Advanced",
    "tags": [
      "risk"
    ],
    "simple": "The risk that proceeds must be reinvested at worse terms.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Collateral",
    "category": "Credit",
    "categorySlug": "credit",
    "level": "Intermediate",
    "tags": [
      "credit"
    ],
    "simple": "Value pledged to secure a loan.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Loan-to-value",
    "category": "Credit",
    "categorySlug": "credit",
    "level": "Intermediate",
    "tags": [
      "credit"
    ],
    "simple": "A ratio comparing loan size to collateral value.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Margin call",
    "category": "Credit",
    "categorySlug": "credit",
    "level": "Intermediate",
    "tags": [
      "credit"
    ],
    "simple": "A demand for more collateral or repayment when collateral value falls.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "No margin call loan",
    "category": "Bitcoin credit",
    "categorySlug": "bitcoin-credit",
    "level": "Advanced",
    "tags": [
      "credit",
      "bitcoin"
    ],
    "simple": "A loan structure designed not to force collateral sale from short-term price movement, subject to contract terms.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Principal",
    "category": "Credit",
    "categorySlug": "credit",
    "level": "Beginner",
    "tags": [
      "credit"
    ],
    "simple": "The original amount borrowed or invested.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Default",
    "category": "Credit",
    "categorySlug": "credit",
    "level": "Intermediate",
    "tags": [
      "credit"
    ],
    "simple": "Failure to meet the terms of a debt obligation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Collateralized loan",
    "category": "Credit",
    "categorySlug": "credit",
    "level": "Intermediate",
    "tags": [
      "credit"
    ],
    "simple": "A loan backed by pledged assets.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Treasury policy",
    "category": "Corporate Bitcoin",
    "categorySlug": "corporate-bitcoin",
    "level": "Advanced",
    "tags": [
      "business",
      "bitcoin"
    ],
    "simple": "A written rule set for how an organization holds, moves, approves, and reports treasury assets.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Corporate treasury",
    "category": "Corporate Bitcoin",
    "categorySlug": "corporate-bitcoin",
    "level": "Advanced",
    "tags": [
      "business"
    ],
    "simple": "The cash and reserve assets managed by a company.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Signatory",
    "category": "Governance",
    "categorySlug": "governance",
    "level": "Intermediate",
    "tags": [
      "business"
    ],
    "simple": "A person authorized to approve or sign a transaction or document.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Quorum",
    "category": "Governance",
    "categorySlug": "governance",
    "level": "Intermediate",
    "tags": [
      "governance"
    ],
    "simple": "The minimum number of approvals needed for a decision or action.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Audit trail",
    "category": "Governance",
    "categorySlug": "governance",
    "level": "Intermediate",
    "tags": [
      "governance"
    ],
    "simple": "Records showing what happened, when, and who approved it.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Policy exception",
    "category": "Governance",
    "categorySlug": "governance",
    "level": "Advanced",
    "tags": [
      "governance"
    ],
    "simple": "A documented departure from normal rules.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "AML",
    "category": "Regulation",
    "categorySlug": "regulation",
    "level": "Intermediate",
    "tags": [
      "regulation"
    ],
    "simple": "Anti-money-laundering rules and processes meant to detect or prevent illicit finance.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "KYC",
    "category": "Regulation",
    "categorySlug": "regulation",
    "level": "Beginner",
    "tags": [
      "regulation"
    ],
    "simple": "Know-your-customer identity checks used by financial institutions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Sanctions screening",
    "category": "Regulation",
    "categorySlug": "regulation",
    "level": "Advanced",
    "tags": [
      "regulation"
    ],
    "simple": "Checking names, addresses, or transactions against restricted-party lists.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Taxable event",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "tax"
    ],
    "simple": "An action or event that may create a tax obligation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Capital gains",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "tax"
    ],
    "simple": "Profit from selling an asset for more than its cost basis.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Cost basis",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "tax"
    ],
    "simple": "The reference value used to calculate gain or loss.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Wealth tax",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "tax"
    ],
    "simple": "A tax based on net wealth or assets rather than only income or transactions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Withholding tax",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "tax"
    ],
    "simple": "Tax taken at the source before money reaches the recipient.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Fiscal policy",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "fiscal"
    ],
    "simple": "Government decisions about spending, taxes, borrowing, and deficits.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Monetary policy",
    "category": "Fiscal and monetary systems",
    "categorySlug": "fiscal-and-monetary-systems",
    "level": "Intermediate",
    "tags": [
      "policy"
    ],
    "simple": "Central bank decisions that affect money supply, rates, credit, and liquidity.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Deficit",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Beginner",
    "tags": [
      "fiscal"
    ],
    "simple": "When spending exceeds revenue over a period.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Public debt",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Intermediate",
    "tags": [
      "fiscal"
    ],
    "simple": "Debt owed by a government.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Sovereign debt",
    "category": "Fiscal",
    "categorySlug": "fiscal",
    "level": "Advanced",
    "tags": [
      "fiscal"
    ],
    "simple": "Debt issued or owed by a national government.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Legal tender",
    "category": "Money",
    "categorySlug": "money",
    "level": "Intermediate",
    "tags": [
      "money",
      "law"
    ],
    "simple": "Money that law recognizes for settling debts or payments.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Capital controls",
    "category": "Fiscal and monetary systems",
    "categorySlug": "fiscal-and-monetary-systems",
    "level": "Advanced",
    "tags": [
      "policy"
    ],
    "simple": "Rules that limit movement of money across borders or currencies.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Exchange rate",
    "category": "Money",
    "categorySlug": "money",
    "level": "Beginner",
    "tags": [
      "money"
    ],
    "simple": "The price of one currency in terms of another.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Devaluation",
    "category": "Money",
    "categorySlug": "money",
    "level": "Intermediate",
    "tags": [
      "money"
    ],
    "simple": "A fall in a currency’s value compared with other currencies or goods.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Dollarization",
    "category": "Money",
    "categorySlug": "money",
    "level": "Intermediate",
    "tags": [
      "money"
    ],
    "simple": "Use of the U.S. dollar in place of, or alongside, local currency.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Stablecoin",
    "category": "Bitcoin context",
    "categorySlug": "bitcoin-context",
    "level": "Intermediate",
    "tags": [
      "contrast"
    ],
    "simple": "A token designed to track another asset, often the U.S. dollar. Not Bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Altcoin",
    "category": "Bitcoin context",
    "categorySlug": "bitcoin-context",
    "level": "Beginner",
    "tags": [
      "contrast"
    ],
    "simple": "Any cryptocurrency other than Bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Crypto",
    "category": "Bitcoin context",
    "categorySlug": "bitcoin-context",
    "level": "Beginner",
    "tags": [
      "contrast"
    ],
    "simple": "A broad term for digital tokens and systems. BSA should use it carefully and distinguish Bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Block",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "A batch of Bitcoin transactions linked into the timechain.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Blockchain",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "A chain of blocks containing the transaction history under Bitcoin’s rules.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Timechain",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Intermediate",
    "tags": [
      "bitcoin"
    ],
    "simple": "A Bitcoin-native way to describe the ordered chain of blocks over time.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Block height",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "The number of blocks before a given block in the chain.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Mempool",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Intermediate",
    "tags": [
      "bitcoin"
    ],
    "simple": "A node’s waiting area for valid transactions not yet confirmed in a block.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Confirmation",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Beginner",
    "tags": [
      "transactions"
    ],
    "simple": "A transaction’s inclusion in a block, plus more blocks after it as settlement confidence grows.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Transaction fee",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Beginner",
    "tags": [
      "transactions"
    ],
    "simple": "The fee paid to miners to include a transaction in a block.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Fee rate",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Intermediate",
    "tags": [
      "fees"
    ],
    "simple": "The fee paid per unit of transaction weight, often shown as sats/vB.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Sats",
    "category": "Bitcoin basics",
    "categorySlug": "bitcoin-basics",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "Short for satoshis, the smallest standard unit of Bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Satoshi",
    "category": "Bitcoin basics",
    "categorySlug": "bitcoin-basics",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "One hundred-millionth of one bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Bitcoin supply cap",
    "category": "Bitcoin economics",
    "categorySlug": "bitcoin-economics",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "Bitcoin’s rule that limits total issuance to 21 million bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Halving",
    "category": "Bitcoin economics",
    "categorySlug": "bitcoin-economics",
    "level": "Intermediate",
    "tags": [
      "bitcoin"
    ],
    "simple": "The programmed event that cuts the new bitcoin subsidy per block roughly every 210,000 blocks.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Block subsidy",
    "category": "Bitcoin economics",
    "categorySlug": "bitcoin-economics",
    "level": "Intermediate",
    "tags": [
      "mining"
    ],
    "simple": "New bitcoin issued to miners in a valid block, separate from transaction fees.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Coinbase transaction",
    "category": "Bitcoin mining",
    "categorySlug": "bitcoin-mining",
    "level": "Advanced",
    "tags": [
      "mining"
    ],
    "simple": "The special transaction in a block that pays the miner subsidy and fees.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Proof of work",
    "category": "Bitcoin mining",
    "categorySlug": "bitcoin-mining",
    "level": "Intermediate",
    "tags": [
      "mining"
    ],
    "simple": "A system where miners prove costly computation to propose blocks.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Hashrate",
    "category": "Bitcoin mining",
    "categorySlug": "bitcoin-mining",
    "level": "Intermediate",
    "tags": [
      "mining"
    ],
    "simple": "The total estimated computing power securing Bitcoin mining.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Nonce",
    "category": "Bitcoin mining",
    "categorySlug": "bitcoin-mining",
    "level": "Advanced",
    "tags": [
      "mining"
    ],
    "simple": "A number miners change while searching for a valid block hash.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Merkle tree",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A tree of hashes that summarizes transactions efficiently.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Merkle root",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "The hash at the top of a Merkle tree included in a block header.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Block header",
    "category": "Bitcoin mining",
    "categorySlug": "bitcoin-mining",
    "level": "Advanced",
    "tags": [
      "mining"
    ],
    "simple": "The compact block data miners hash when doing proof of work.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Consensus rules",
    "category": "Bitcoin network",
    "categorySlug": "bitcoin-network",
    "level": "Advanced",
    "tags": [
      "validation"
    ],
    "simple": "Rules that nodes enforce to decide what blocks and transactions are valid.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Soft fork",
    "category": "Bitcoin protocol",
    "categorySlug": "bitcoin-protocol",
    "level": "Advanced",
    "tags": [
      "protocol"
    ],
    "simple": "A backward-compatible tightening of consensus rules.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Hard fork",
    "category": "Bitcoin protocol",
    "categorySlug": "bitcoin-protocol",
    "level": "Advanced",
    "tags": [
      "protocol"
    ],
    "simple": "A rule change that can split compatibility if not universally adopted.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "BIP",
    "category": "Bitcoin protocol",
    "categorySlug": "bitcoin-protocol",
    "level": "Advanced",
    "tags": [
      "protocol"
    ],
    "simple": "Bitcoin Improvement Proposal, a document proposing or describing changes or standards.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Taproot",
    "category": "Bitcoin protocol",
    "categorySlug": "bitcoin-protocol",
    "level": "Advanced",
    "tags": [
      "protocol"
    ],
    "simple": "A Bitcoin upgrade improving scripting flexibility, privacy, and efficiency for certain spending conditions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "SegWit",
    "category": "Bitcoin protocol",
    "categorySlug": "bitcoin-protocol",
    "level": "Advanced",
    "tags": [
      "protocol"
    ],
    "simple": "A Bitcoin upgrade that changed transaction structure and helped fix malleability while increasing effective capacity.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Script",
    "category": "Bitcoin protocol",
    "categorySlug": "bitcoin-protocol",
    "level": "Advanced",
    "tags": [
      "protocol"
    ],
    "simple": "Bitcoin’s spending condition language.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Miniscript",
    "category": "Bitcoin development",
    "categorySlug": "bitcoin-development",
    "level": "Advanced",
    "tags": [
      "dev"
    ],
    "simple": "A structured way to write and analyze Bitcoin scripts.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Descriptor",
    "category": "Bitcoin development",
    "categorySlug": "bitcoin-development",
    "level": "Advanced",
    "tags": [
      "dev"
    ],
    "simple": "A machine-readable description of how wallet addresses and scripts are derived.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "xpub",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "privacy"
    ],
    "simple": "An extended public key that can derive many public addresses without spending funds.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Derivation path",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "keys"
    ],
    "simple": "A standard path for deriving keys from a seed.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "BIP39",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "keys"
    ],
    "simple": "A common standard for mnemonic seed phrases.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "BIP32",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "keys"
    ],
    "simple": "A standard for hierarchical deterministic wallets.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "BIP84",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "keys"
    ],
    "simple": "A derivation standard for native SegWit single-signature wallets.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Passphrase",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "custody"
    ],
    "simple": "An extra secret sometimes added to a seed phrase to create different wallet access.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Hardware wallet",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "custody"
    ],
    "simple": "A device designed to protect private keys and sign transactions safely.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Airgapped signing",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "custody"
    ],
    "simple": "Signing transactions on a device that does not directly connect to the internet.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Cold storage",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "custody"
    ],
    "simple": "Keeping signing keys offline or separated from internet-connected systems.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Hot wallet",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "custody"
    ],
    "simple": "A wallet connected to the internet or used for frequent spending.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Watch-only wallet",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "custody"
    ],
    "simple": "A wallet that can view balances and create receiving addresses but cannot sign transactions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Collaborative custody",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "custody"
    ],
    "simple": "A custody setup where the owner keeps control while a service helps with backup, recovery, or coordination.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "2-of-3",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "multisig"
    ],
    "simple": "A multisig policy where any two of three keys can spend.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Single point of failure",
    "category": "Risk",
    "categorySlug": "risk",
    "level": "Beginner",
    "tags": [
      "risk"
    ],
    "simple": "One thing whose failure can break the whole system.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Key rotation",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Advanced",
    "tags": [
      "custody"
    ],
    "simple": "Replacing keys or signers in a controlled way.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Test transaction",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Beginner",
    "tags": [
      "custody"
    ],
    "simple": "A small transaction used to verify that a setup works before moving larger funds.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Recovery drill",
    "category": "Bitcoin custody",
    "categorySlug": "bitcoin-custody",
    "level": "Intermediate",
    "tags": [
      "custody"
    ],
    "simple": "A practice run to confirm people and tools can recover access safely.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Emergency access document",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family"
    ],
    "simple": "A document that tells trusted people the first safe steps in an emergency without exposing all secrets.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Executor",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family"
    ],
    "simple": "A person responsible for carrying out estate instructions after death.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Trusted contact",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Beginner",
    "tags": [
      "family"
    ],
    "simple": "Someone designated to help in an emergency or recovery process.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Family custody review",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family"
    ],
    "simple": "A review of whether family members can safely understand and execute the custody plan. Usually performed with a qualified Bitcoin custody adviser. BSA explains the concept but does not provide this service.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Operational continuity",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Advanced",
    "tags": [
      "family"
    ],
    "simple": "The ability of a system or family process to keep working when a key person is unavailable.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Lightning channel",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Intermediate",
    "tags": [
      "lightning"
    ],
    "simple": "A funding setup between participants that enables many Lightning payments before final settlement on-chain.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Channel liquidity",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "lightning"
    ],
    "simple": "The ability to send or receive over Lightning based on available channel balances.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Inbound liquidity",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "lightning"
    ],
    "simple": "Lightning capacity that lets you receive payments.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Outbound liquidity",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "lightning"
    ],
    "simple": "Lightning capacity that lets you send payments.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Routing node",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "lightning"
    ],
    "simple": "A Lightning node that forwards payments between channels.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "HTLC",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "lightning"
    ],
    "simple": "Hashed Timelock Contract, a conditional payment mechanism used in Lightning routing.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Invoice",
    "category": "Bitcoin payments",
    "categorySlug": "bitcoin-payments",
    "level": "Beginner",
    "tags": [
      "payments"
    ],
    "simple": "A payment request, often used in Lightning or merchant flows.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "On-chain",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Beginner",
    "tags": [
      "transactions"
    ],
    "simple": "A transaction recorded directly in Bitcoin blocks.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Off-chain",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Intermediate",
    "tags": [
      "layers"
    ],
    "simple": "Activity that does not immediately settle directly in the base chain.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Layer 2",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Intermediate",
    "tags": [
      "layers"
    ],
    "simple": "A system built above Bitcoin’s base layer to add payment or application capabilities with different tradeoffs.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Liquid",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "A federated Bitcoin sidechain used for faster settlement and issued assets, with different trust assumptions than Bitcoin base layer.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Sidechain",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "A separate chain connected to Bitcoin in some way, usually with additional trust or federation assumptions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Federation",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "A group of parties that jointly operate or secure a system.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Fedimint",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "A federated e-cash system that can use Bitcoin or Lightning while adding community custody tradeoffs.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "E-cash",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "Digital bearer-style claims, often privacy-focused, issued by a mint or federation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "RGB",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "A client-side validated smart contract and asset protocol connected to Bitcoin concepts.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Taproot Assets",
    "category": "Bitcoin layers",
    "categorySlug": "bitcoin-layers",
    "level": "Advanced",
    "tags": [
      "layers"
    ],
    "simple": "A protocol for issuing assets using Taproot-related structures, often discussed with Lightning.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Privacy",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Beginner",
    "tags": [
      "privacy"
    ],
    "simple": "Control over what others can learn about your identity, balances, and transactions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Pseudonymity",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Intermediate",
    "tags": [
      "privacy"
    ],
    "simple": "Using identifiers that are not directly names but can still be linked through behavior or data.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Coin control",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Intermediate",
    "tags": [
      "privacy"
    ],
    "simple": "Choosing which UTXOs to spend to manage fees and privacy.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Address reuse",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Beginner",
    "tags": [
      "privacy"
    ],
    "simple": "Using the same Bitcoin address more than once, which can damage privacy.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Change output",
    "category": "Bitcoin transactions",
    "categorySlug": "bitcoin-transactions",
    "level": "Intermediate",
    "tags": [
      "transactions"
    ],
    "simple": "The part of a transaction that returns unspent value back to the sender’s wallet.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "CoinJoin",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Advanced",
    "tags": [
      "privacy"
    ],
    "simple": "A collaborative transaction technique that can make ownership links harder to trace, with tool-specific and legal-context tradeoffs.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Chain surveillance",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Advanced",
    "tags": [
      "privacy"
    ],
    "simple": "Analysis of public blockchain data to infer identity, behavior, or relationships.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "KYC trail",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Intermediate",
    "tags": [
      "privacy"
    ],
    "simple": "The identity record created when buying or using Bitcoin through regulated services.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Whirlpool",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Advanced",
    "tags": [
      "privacy"
    ],
    "simple": "A privacy tool formerly associated with Samourai Wallet; references should be framed historically and carefully.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Wasabi",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Advanced",
    "tags": [
      "privacy"
    ],
    "simple": "A Bitcoin wallet known for CoinJoin privacy features; references need current context and caution.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Samourai Wallet",
    "category": "Bitcoin privacy",
    "categorySlug": "bitcoin-privacy",
    "level": "Advanced",
    "tags": [
      "privacy"
    ],
    "simple": "A Bitcoin wallet project associated with privacy tooling; references should be framed historically and legally carefully.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Encryption",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "cryptography"
    ],
    "simple": "A method of transforming data so it can only be read with the right key.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Public key",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "cryptography"
    ],
    "simple": "A key that can be shared and used to verify signatures or derive addresses.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Elliptic curve cryptography",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A cryptographic method based on elliptic curve math used in Bitcoin signatures.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "ECDSA",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A digital signature algorithm used in legacy Bitcoin signatures.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Schnorr signature",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A signature scheme used in Taproot that supports efficiency and new construction patterns.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "SHA-256",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A cryptographic hash function used in Bitcoin mining and data commitments.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "RIPEMD-160",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A hash function used in some Bitcoin address constructions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "HMAC",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A keyed hash method used in some wallet/key derivation contexts.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Entropy",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "cryptography"
    ],
    "simple": "Randomness used to make secrets hard to guess.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Random number generator",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "cryptography"
    ],
    "simple": "A system that creates unpredictable values used for keys or security.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Checksum",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Intermediate",
    "tags": [
      "cryptography"
    ],
    "simple": "Extra data used to detect mistakes or corruption.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Commitment",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A cryptographic way to lock in data while revealing it later or proving consistency.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Zero-knowledge proof",
    "category": "Cryptography",
    "categorySlug": "cryptography",
    "level": "Advanced",
    "tags": [
      "cryptography"
    ],
    "simple": "A proof that shows something is true without revealing the underlying secret.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "DevOps",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops"
    ],
    "simple": "The practice of building, deploying, monitoring, and maintaining software systems reliably.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Repository",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "A storage place for code and project history.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Git",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "A version-control system that tracks changes to files.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Commit",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "A saved set of file changes in Git.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Branch",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "A separate line of work in Git.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Pull request",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "A proposed set of code changes for review and merge.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Merge conflict",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops"
    ],
    "simple": "A conflict when different changes affect the same part of a file.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Rollback",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops"
    ],
    "simple": "Returning a system or codebase to an earlier safe state.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Deployment",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "Publishing software or a site so users can access it.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Preview deploy",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops"
    ],
    "simple": "A temporary deployment used to review changes before production.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Production",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "The live environment users actually visit.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Secret scanning",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "security"
    ],
    "simple": "Automatic checking for leaked keys, tokens, or credentials.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Index lock",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "git"
    ],
    "simple": "A Git lock file that prevents simultaneous changes to the index; stale locks may need safe removal.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Dependency",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Intermediate",
    "tags": [
      "devops"
    ],
    "simple": "External code or packages a project relies on.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Security advisory",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Advanced",
    "tags": [
      "security"
    ],
    "simple": "A notice about a vulnerability in software or dependencies.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Static site",
    "category": "DevOps",
    "categorySlug": "devops",
    "level": "Beginner",
    "tags": [
      "devops"
    ],
    "simple": "A site served mostly as HTML, CSS, and JavaScript without a server app per page.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Accessibility",
    "category": "Web",
    "categorySlug": "web",
    "level": "Beginner",
    "tags": [
      "web"
    ],
    "simple": "Designing content so people with different abilities and tools can use it.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Skip link",
    "category": "Web",
    "categorySlug": "web",
    "level": "Beginner",
    "tags": [
      "web"
    ],
    "simple": "A link that lets keyboard or screen-reader users jump directly to main content.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "ARIA",
    "category": "Web",
    "categorySlug": "web",
    "level": "Advanced",
    "tags": [
      "web"
    ],
    "simple": "Attributes that help assistive technologies understand web interfaces.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Canonical URL",
    "category": "Web",
    "categorySlug": "web",
    "level": "Intermediate",
    "tags": [
      "web"
    ],
    "simple": "The preferred URL for a page, used to avoid duplication confusion.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Hreflang",
    "category": "Web",
    "categorySlug": "web",
    "level": "Advanced",
    "tags": [
      "web"
    ],
    "simple": "Markup that tells search engines about language or regional versions of a page.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "CTA",
    "category": "Content strategy",
    "categorySlug": "content-strategy",
    "level": "Beginner",
    "tags": [
      "content"
    ],
    "simple": "Call to action, the next step a page asks the reader to take.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Lead magnet",
    "category": "Content strategy",
    "categorySlug": "content-strategy",
    "level": "Intermediate",
    "tags": [
      "marketing"
    ],
    "simple": "A useful free resource offered in exchange for a next step such as email capture.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Funnel",
    "category": "Content strategy",
    "categorySlug": "content-strategy",
    "level": "Intermediate",
    "tags": [
      "marketing"
    ],
    "simple": "A path that moves someone from awareness to trust, action, or purchase.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Conversion",
    "category": "Content strategy",
    "categorySlug": "content-strategy",
    "level": "Intermediate",
    "tags": [
      "marketing"
    ],
    "simple": "A user taking the desired action, such as signing up, downloading, or buying.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Email capture",
    "category": "Content strategy",
    "categorySlug": "content-strategy",
    "level": "Beginner",
    "tags": [
      "marketing"
    ],
    "simple": "Collecting an email address in exchange for value or updates.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Misunderstanding Engine",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A glossary pattern that teaches terms by exposing the mistake people usually make and how it fails in real life.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Proof of Understanding",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A checkpoint that asks learners to apply an idea rather than repeat a definition.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Family Table Mode",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A learning mode that turns a lesson into safe family discussion prompts.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Colombia Reality Check",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A local context block that shows how a global money principle appears in Colombia.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "What Would You Do scenario",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A scenario prompt that forces a learner to choose, see consequences, and reflect.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Anti-lesson",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A lesson that teaches by showing the wrong path clearly.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Receipt box",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A small claim-support block that explains what kind of evidence grounds a strong claim.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "One-page field guide",
    "category": "BSA product layer",
    "categorySlug": "bsa-product-layer",
    "level": "Intermediate",
    "tags": [
      "bsa"
    ],
    "simple": "A compact action guide that turns a lesson into next steps.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Sovereign Vault",
    "category": "BSA product",
    "categorySlug": "bsa-product",
    "level": "Intermediate",
    "tags": [
      "bsa",
      "product"
    ],
    "simple": "A BSA custody management experience focused on operational readiness and family continuity.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Self-Custody Starter Kit",
    "category": "BSA product",
    "categorySlug": "bsa-product",
    "level": "Beginner",
    "tags": [
      "bsa",
      "product"
    ],
    "simple": "A BSA product for people beginning to move from exchange dependence toward responsible custody.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Family Bitcoin Recovery Kit",
    "category": "BSA product",
    "categorySlug": "bsa-product",
    "level": "Beginner",
    "tags": [
      "bsa",
      "product"
    ],
    "simple": "A BSA product for helping families understand and prepare safe Bitcoin recovery steps.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Bitcoin Continuity Operational Packet",
    "category": "BSA product",
    "categorySlug": "bsa-product",
    "level": "Advanced",
    "tags": [
      "bsa",
      "product"
    ],
    "simple": "A BSA product for advisors, families, or businesses that need documented operational continuity.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Institutional Program",
    "category": "BSA product",
    "categorySlug": "bsa-product",
    "level": "Advanced",
    "tags": [
      "bsa",
      "product"
    ],
    "simple": "A BSA offering for businesses or institutions learning treasury, custody, and governance.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Natillera",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Beginner",
    "tags": [
      "Colombia"
    ],
    "simple": "A Colombian savings pool or informal group savings practice often used for goals or year-end needs.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Peso devaluation",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Beginner",
    "tags": [
      "Colombia"
    ],
    "simple": "A decline in the Colombian peso’s purchasing power or exchange value.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Bancolombia",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Beginner",
    "tags": [
      "Colombia"
    ],
    "simple": "A major Colombian bank often relevant in local banking examples.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Wenia",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Intermediate",
    "tags": [
      "Colombia"
    ],
    "simple": "A Colombia-linked digital asset platform contextually relevant to onramp discussions.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "COPW",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Intermediate",
    "tags": [
      "Colombia"
    ],
    "simple": "A peso-linked digital asset used in some Colombian digital money contexts; not Bitcoin.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Formal employment cost",
    "category": "Colombia reality layer",
    "categorySlug": "colombia-reality-layer",
    "level": "Intermediate",
    "tags": [
      "Colombia"
    ],
    "simple": "The full cost to employ someone, including salary plus required benefits, contributions, and taxes.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Payroll deduction",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Money taken out of gross pay before the worker receives net pay.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Gross income",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Income before deductions and taxes.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Net income",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Income after deductions and taxes.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Budget",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "A plan for how money will be received, spent, saved, or invested.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Emergency fund",
    "category": "Financial literacy",
    "categorySlug": "financial-literacy",
    "level": "Beginner",
    "tags": [
      "financial literacy"
    ],
    "simple": "Savings set aside for unexpected needs before long-term investing.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "DCA",
    "category": "Bitcoin strategy",
    "categorySlug": "bitcoin-strategy",
    "level": "Beginner",
    "tags": [
      "bitcoin"
    ],
    "simple": "Dollar-cost averaging, buying a fixed amount over time rather than all at once.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Volatility",
    "category": "Financial risk",
    "categorySlug": "financial-risk",
    "level": "Beginner",
    "tags": [
      "risk"
    ],
    "simple": "How much and how quickly a price moves up and down.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Drawdown",
    "category": "Financial risk",
    "categorySlug": "financial-risk",
    "level": "Intermediate",
    "tags": [
      "risk"
    ],
    "simple": "A decline from a prior peak value.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Risk tolerance",
    "category": "Financial planning",
    "categorySlug": "financial-planning",
    "level": "Beginner",
    "tags": [
      "planning"
    ],
    "simple": "How much uncertainty or loss a person can emotionally and financially handle.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Time horizon",
    "category": "Financial planning",
    "categorySlug": "financial-planning",
    "level": "Beginner",
    "tags": [
      "planning"
    ],
    "simple": "How long money can remain invested before it is needed.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Estate plan",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family"
    ],
    "simple": "A legal and practical plan for what happens to assets and responsibilities after death or incapacity.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Beneficiary",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Beginner",
    "tags": [
      "family"
    ],
    "simple": "A person or entity designated to receive an asset or benefit.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Power of attorney",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family"
    ],
    "simple": "Legal authority given to someone to act on another person’s behalf.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Trust",
    "category": "Family continuity",
    "categorySlug": "family-continuity",
    "level": "Intermediate",
    "tags": [
      "family"
    ],
    "simple": "A legal arrangement where assets are managed for beneficiaries under stated rules.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Fiduciary",
    "category": "Advisor",
    "categorySlug": "advisor",
    "level": "Intermediate",
    "tags": [
      "advisor"
    ],
    "simple": "A person required to act in another party’s best interest under applicable duties.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Suitability",
    "category": "Advisor",
    "categorySlug": "advisor",
    "level": "Intermediate",
    "tags": [
      "advisor"
    ],
    "simple": "A standard asking whether a recommendation fits a person’s situation.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Disclosure",
    "category": "Advisor",
    "categorySlug": "advisor",
    "level": "Intermediate",
    "tags": [
      "advisor"
    ],
    "simple": "Clear communication of risks, conflicts, terms, or important facts.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Verification date",
    "category": "Content governance",
    "categorySlug": "content-governance",
    "level": "Intermediate",
    "tags": [
      "content"
    ],
    "simple": "The date a claim or source was last checked.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Source tier",
    "category": "Content governance",
    "categorySlug": "content-governance",
    "level": "Intermediate",
    "tags": [
      "content"
    ],
    "simple": "A ranking of evidence quality, such as primary source, official documentation, reputable reporting, or internal analysis.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Stale claim",
    "category": "Content governance",
    "categorySlug": "content-governance",
    "level": "Intermediate",
    "tags": [
      "content"
    ],
    "simple": "A claim that may be outdated and needs review.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Hardcoded price",
    "category": "Content governance",
    "categorySlug": "content-governance",
    "level": "Intermediate",
    "tags": [
      "content"
    ],
    "simple": "A fixed number in content that may become stale if it represents changing market data.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  },
  {
    "term": "Live data binder",
    "category": "Content governance",
    "categorySlug": "content-governance",
    "level": "Advanced",
    "tags": [
      "content"
    ],
    "simple": "A page mechanism that replaces stale fixed data with current or updateable values.",
    "advanced": "",
    "engine": false,
    "misconception": "",
    "reality": "",
    "why": "",
    "failure": "",
    "proof": "",
    "next": ""
  }
];
