// Bitcoin On-Ramp Decision Tree Data (December 2025)
// Updated quarterly with current fees and methods

const QUESTIONS = [
    {
        id: 'country',
        number: 1,
        title: 'Where do you live?',
        subtitle: 'Legal requirements and best methods vary by region',
        type: 'single',
        options: [
            { value: 'us', icon: '🇺🇸', label: 'United States / Canada', detail: 'Regulated markets, most options' },
            { value: 'eu', icon: '🇪🇺', label: 'Europe (EU/UK/Switzerland)', detail: 'SEPA transfers, strong regulation' },
            { value: 'latam', icon: '🌎', label: 'Latin America', detail: 'Growing adoption, varied regulation' },
            { value: 'oceania', icon: '🦘', label: 'Australia / New Zealand', detail: 'Well-regulated, good infrastructure' },
            { value: 'asia', icon: '🌏', label: 'Asia (regulated markets)', detail: 'Japan, Singapore, South Korea, etc.' },
            { value: 'other', icon: '🌍', label: 'Rest of world / Privacy-first', detail: 'P2P and decentralized options' }
        ]
    },
    {
        id: 'amount',
        number: 2,
        title: 'How much are you buying today?',
        subtitle: 'Different KYC thresholds apply at different amounts',
        type: 'single',
        options: [
            { value: '<200', icon: '💵', label: 'Under $200', detail: 'Small amounts, often no-KYC possible' },
            { value: '200-1000', icon: '💰', label: '$200 – $1,000', detail: 'Most common first purchase' },
            { value: '1000-10000', icon: '💎', label: '$1,000 – $10,000', detail: 'Serious allocation, KYC usually required' },
            { value: '>10000', icon: '🏦', label: 'Over $10,000', detail: 'Large purchase, full KYC mandatory' }
        ]
    },
    {
        id: 'kyc',
        number: 3,
        title: 'Are you comfortable with identity verification (KYC)?',
        subtitle: 'Most regulated platforms require ID, but alternatives exist',
        type: 'single',
        options: [
            { value: 'yes', icon: '✅', label: 'Yes, I can provide ID', detail: 'Opens most options, faster process' },
            { value: 'prefer-no', icon: '🔒', label: 'Prefer to avoid KYC if possible', detail: 'Privacy-focused, limited to P2P/decentralized' }
        ]
    },
    {
        id: 'speed',
        number: 4,
        title: 'How quickly do you need your Bitcoin?',
        subtitle: 'Speed vs. cost trade-off',
        type: 'single',
        options: [
            { value: 'instant', icon: '⚡', label: 'Today / Tomorrow', detail: 'Fastest methods, slightly higher fees' },
            { value: 'week', icon: '📅', label: 'Within a week is fine', detail: 'Balanced speed and cost' },
            { value: 'cheapest', icon: '💡', label: 'No rush (cheapest is best)', detail: 'Lowest fees, may take longer' }
        ]
    },
    {
        id: 'payment',
        number: 5,
        title: 'What payment methods do you have available?',
        subtitle: 'Select all that apply',
        type: 'multiple',
        options: [
            { value: 'bank', icon: '🏦', label: 'Bank transfer / SEPA', detail: 'Usually lowest fees' },
            { value: 'card', icon: '💳', label: 'Credit / Debit card', detail: 'Fast but higher fees' },
            { value: 'mobile-pay', icon: '📱', label: 'Apple Pay / Google Pay', detail: 'Instant, some platforms' },
            { value: 'cash', icon: '💵', label: 'Cash (in person or ATM)', detail: 'Privacy-focused option' },
            { value: 'paypal', icon: '🔵', label: 'PayPal / Venmo / Cash App', detail: 'Convenient but limited' },
            { value: 'gift-cards', icon: '🎁', label: 'Gift cards', detail: 'Alternative payment path' }
        ]
    }
];

// Decision rules and results (80+ combinations)
const ONRAMP_RULES = [
    // ===== UNITED STATES / CANADA =====
    {
        id: 'us-instant-kyc-bank',
        conditions: {
            country: ['us'],
            amount: ['200-1000', '1000-10000', '>10000'],
            kyc: 'yes',
            speed: 'instant',
            payment: ['bank', 'card']
        },
        results: [
            {
                name: 'Strike',
                fee: '0.3–0.8%',
                time: '2–30 minutes',
                bestFor: 'Fastest & cheapest for Americans',
                link: 'https://strike.me',
                badge: 'Recommended',
                kyc: 'Required',
                notes: 'Lightning integration, instant transfers'
            },
            {
                name: 'Cash App',
                fee: '1.76% spread',
                time: '5–15 minutes',
                bestFor: 'Simplest interface, already have the app',
                link: 'https://cash.app',
                kyc: 'Required',
                notes: 'Good for beginners, intuitive'
            },
            {
                name: 'Coinbase',
                fee: '1.49% + spread',
                time: '10–30 minutes',
                bestFor: 'Most established, insurance on custodial holdings',
                link: 'https://coinbase.com',
                kyc: 'Required',
                notes: 'Higher fees but trusted brand'
            }
        ]
    },
    {
        id: 'us-dca-kyc',
        conditions: {
            country: ['us'],
            amount: ['200-1000', '1000-10000'],
            kyc: 'yes',
            speed: 'week',
            payment: ['bank']
        },
        results: [
            {
                name: 'Swan Bitcoin',
                fee: '0.99%',
                time: '1–3 days',
                bestFor: 'Best for automatic weekly/monthly buying (DCA)',
                link: 'https://swanbitcoin.com',
                badge: 'Best for DCA',
                kyc: 'Required',
                notes: 'Set and forget, auto-withdrawal to cold storage'
            },
            {
                name: 'River Financial',
                fee: '1.0%',
                time: '1–3 days',
                bestFor: 'Clean interface, excellent education',
                link: 'https://river.com',
                kyc: 'Required',
                notes: 'Great for learning while buying'
            },
            {
                name: 'Strike',
                fee: '0.3–0.8%',
                time: '2–30 minutes',
                bestFor: 'Lowest fees, one-time or recurring',
                link: 'https://strike.me',
                kyc: 'Required',
                notes: 'Most flexible, Lightning support'
            }
        ]
    },
    {
        id: 'us-small-no-kyc',
        conditions: {
            country: ['us'],
            amount: ['<200'],
            kyc: 'prefer-no',
            speed: ['instant', 'week'],
            payment: ['cash', 'gift-cards']
        },
        results: [
            {
                name: 'RoboSats',
                fee: '0.2–1.0%',
                time: '30 min – 2 hours',
                bestFor: 'True peer-to-peer, no KYC, Lightning',
                link: 'https://learn.robosats.com',
                badge: 'Privacy-focused',
                kyc: 'None',
                notes: 'Requires Lightning wallet, learning curve'
            },
            {
                name: 'Bitcoin ATM (local)',
                fee: '7–20% spread',
                time: '5 minutes',
                bestFor: 'Emergency cash → BTC only when necessary',
                link: 'https://coinatmradar.com',
                kyc: 'Varies (often required)',
                notes: '⚠️ Very high spreads! Many now require KYC/ID scan. Non-KYC limits vary by operator and country.'
            },
            {
                name: 'Bisq',
                fee: '0.5–1.5%',
                time: '1–48 hours',
                bestFor: 'Fully decentralized, many payment methods',
                link: 'https://bisq.network',
                kyc: 'None',
                notes: 'Desktop app, requires security deposit'
            }
        ]
    },

    // ===== EUROPE (EU/UK/Switzerland) =====
    {
        id: 'eu-instant-kyc-sepa',
        conditions: {
            country: ['eu'],
            amount: ['200-1000', '1000-10000'],
            kyc: 'yes',
            speed: 'instant',
            payment: ['bank', 'card']
        },
        results: [
            {
                name: 'Relai',
                fee: '1–2%',
                time: '1–3 days (SEPA)',
                bestFor: 'Non-custodial, minimal KYC, auto-DCA',
                link: 'https://relai.app',
                badge: 'Recommended',
                kyc: 'Light (depends on amount)',
                notes: 'Switzerland-based, strong privacy'
            },
            {
                name: 'Bitpanda',
                fee: '1.49%',
                time: '10–30 minutes',
                bestFor: 'European leader, regulated, SEPA instant',
                link: 'https://bitpanda.com',
                kyc: 'Required',
                notes: 'Austria-based, full EU compliance'
            },
            {
                name: 'Kraken',
                fee: '0.16–0.26% (limit orders)',
                time: '1–3 days (SEPA)',
                bestFor: 'Lowest fees for larger amounts',
                link: 'https://kraken.com',
                kyc: 'Required',
                notes: 'Advanced traders, pro features'
            }
        ]
    },
    {
        id: 'eu-small-no-kyc',
        conditions: {
            country: ['eu'],
            amount: ['<200', '200-1000'],
            kyc: 'prefer-no',
            speed: ['instant', 'week'],
            payment: ['bank', 'cash']
        },
        results: [
            {
                name: 'Peach Bitcoin',
                fee: '2–3%',
                time: '30 min – 4 hours',
                bestFor: 'Mobile P2P, no KYC, SEPA friendly',
                link: 'https://peachbitcoin.com',
                badge: 'Privacy-focused',
                kyc: 'None',
                notes: 'Easy mobile app, growing liquidity'
            },
            {
                name: 'RoboSats',
                fee: '0.2–1.0%',
                time: '30 min – 2 hours',
                bestFor: 'Lightning P2P, fully private',
                link: 'https://learn.robosats.com',
                kyc: 'None',
                notes: 'Requires Lightning wallet'
            },
            {
                name: 'Bitcoin ATM (local)',
                fee: '7–20% spread',
                time: '5 minutes',
                bestFor: 'Emergency only - avoid if possible',
                link: 'https://coinatmradar.com',
                kyc: 'Often required in EU',
                notes: '⚠️ Very high spreads! Most EU ATMs now require ID scan. Use as last resort only.'
            }
        ]
    },

    // ===== LATIN AMERICA =====
    {
        id: 'latam-instant-kyc',
        conditions: {
            country: ['latam'],
            amount: ['<200', '200-1000', '1000-10000'],
            kyc: 'yes',
            speed: 'instant',
            payment: ['bank', 'card', 'mobile-pay']
        },
        results: [
            {
                name: 'Belo (Argentina/Brazil)',
                fee: '1.5–2.5%',
                time: '5–15 minutes',
                bestFor: 'Local fiat rails, Lightning support',
                link: 'https://belo.app',
                badge: 'Regional leader',
                kyc: 'Light',
                notes: 'Works in high-inflation zones'
            },
            {
                name: 'Bitso (Mexico)',
                fee: '1–3%',
                time: '10–30 minutes',
                bestFor: 'Largest in Mexico, peso liquidity',
                link: 'https://bitso.com',
                kyc: 'Required',
                notes: 'Established, regulated'
            },
            {
                name: 'Binance P2P',
                fee: '0% (spread in price)',
                time: '15 min – 2 hours',
                bestFor: 'Wide coverage, local payment methods',
                link: 'https://p2p.binance.com',
                kyc: 'Required',
                notes: 'Large liquidity, many countries'
            }
        ]
    },
    {
        id: 'latam-no-kyc',
        conditions: {
            country: ['latam'],
            amount: ['<200', '200-1000'],
            kyc: 'prefer-no',
            speed: ['instant', 'week'],
            payment: ['cash', 'bank']
        },
        results: [
            {
                name: 'RoboSats',
                fee: '0.2–1.0%',
                time: '30 min – 2 hours',
                bestFor: 'Lightning P2P, no KYC, local currency',
                link: 'https://learn.robosats.com',
                badge: 'Privacy-focused',
                kyc: 'None',
                notes: 'Growing LATAM community'
            },
            {
                name: 'Bitcoin ATM (local)',
                fee: '10–25% spread',
                time: '5 minutes',
                bestFor: 'Emergency only - very expensive',
                link: 'https://coinatmradar.com',
                kyc: 'Varies widely',
                notes: '⚠️ Extremely high spreads in LATAM! KYC requirements vary by country and amount. Use P2P instead.'
            },
            {
                name: 'HodlHodl',
                fee: '0.5–1%',
                time: '1–24 hours',
                bestFor: 'Escrow-based P2P, many payment methods',
                link: 'https://hodlhodl.com',
                kyc: 'None',
                notes: 'Latin America liquidity'
            }
        ]
    },

    // ===== AUSTRALIA / NEW ZEALAND =====
    {
        id: 'oceania-kyc',
        conditions: {
            country: ['oceania'],
            amount: ['200-1000', '1000-10000'],
            kyc: 'yes',
            speed: ['instant', 'week'],
            payment: ['bank', 'card']
        },
        results: [
            {
                name: 'Amber App',
                fee: '1.5%',
                time: '1–3 days',
                bestFor: 'Auto-DCA from spare change, Australia-focused',
                link: 'https://amber.app',
                badge: 'Recommended',
                kyc: 'Required',
                notes: 'Roundup savings feature'
            },
            {
                name: 'Easy Crypto',
                fee: '0.5–1.5%',
                time: '10–30 minutes',
                bestFor: 'NZ & AU, simple interface',
                link: 'https://easycrypto.com',
                kyc: 'Required',
                notes: 'Bank transfer, fast'
            },
            {
                name: 'Independent Reserve',
                fee: '0.5% (limit orders)',
                time: '1–2 days',
                bestFor: 'Advanced trading, lowest fees',
                link: 'https://independentreserve.com',
                kyc: 'Required',
                notes: 'Pro features, audited'
            }
        ]
    },

    // ===== ASIA (Regulated) =====
    {
        id: 'asia-kyc',
        conditions: {
            country: ['asia'],
            amount: ['200-1000', '1000-10000'],
            kyc: 'yes',
            speed: ['instant', 'week'],
            payment: ['bank', 'card']
        },
        results: [
            {
                name: 'BitFlyer (Japan)',
                fee: '0.01–0.15%',
                time: '10–30 minutes',
                bestFor: 'Fully licensed, JPY',
                link: 'https://bitflyer.com',
                badge: 'Japan',
                kyc: 'Required',
                notes: 'Regulated, insurance'
            },
            {
                name: 'Coinhako (Singapore)',
                fee: '0.8–1.5%',
                time: '15 min – 1 day',
                bestFor: 'Southeast Asia, SGD/MYR',
                link: 'https://coinhako.com',
                badge: 'Singapore',
                kyc: 'Required',
                notes: 'Regional hub'
            },
            {
                name: 'Binance',
                fee: '0.1% (spot)',
                time: '10–30 minutes',
                bestFor: 'Largest liquidity, many countries',
                link: 'https://binance.com',
                kyc: 'Required',
                notes: 'Advanced features, caution on custody'
            }
        ]
    },

    // ===== REST OF WORLD / PRIVACY-FIRST =====
    {
        id: 'other-no-kyc',
        conditions: {
            country: ['other'],
            amount: ['<200', '200-1000'],
            kyc: 'prefer-no',
            speed: ['instant', 'week', 'cheapest'],
            payment: ['cash', 'bank', 'gift-cards']
        },
        results: [
            {
                name: 'RoboSats',
                fee: '0.2–1.0%',
                time: '30 min – 2 hours',
                bestFor: 'Global Lightning P2P, no KYC',
                link: 'https://learn.robosats.com',
                badge: 'Recommended',
                kyc: 'None',
                notes: 'Works worldwide, Tor-friendly'
            },
            {
                name: 'Bisq',
                fee: '0.5–1.5%',
                time: '1–48 hours',
                bestFor: 'Fully decentralized, desktop app',
                link: 'https://bisq.network',
                kyc: 'None',
                notes: 'Global liquidity, many currencies'
            },
            {
                name: 'Bitcoin ATM (if available)',
                fee: '8–25% spread',
                time: '5 minutes',
                bestFor: 'Emergency only when other options unavailable',
                link: 'https://coinatmradar.com',
                kyc: 'Usually required',
                notes: '⚠️ Extreme spreads! Most countries now require ID/phone verification. Check local regulations.'
            }
        ]
    },
    {
        id: 'other-kyc-large',
        conditions: {
            country: ['other'],
            amount: ['>10000'],
            kyc: 'yes',
            speed: ['week', 'cheapest'],
            payment: ['bank']
        },
        results: [
            {
                name: 'Kraken',
                fee: '0.16–0.26%',
                time: '1–5 days',
                bestFor: 'Large purchases, global access',
                link: 'https://kraken.com',
                badge: 'Pro traders',
                kyc: 'Required',
                notes: 'Established, secure'
            },
            {
                name: 'Bitstamp',
                fee: '0.5%',
                time: '1–3 days',
                bestFor: 'Oldest exchange, reliable',
                link: 'https://bitstamp.net',
                kyc: 'Required',
                notes: 'Since 2011, trusted'
            },
            {
                name: 'OTC Desk (local broker)',
                fee: 'Negotiable (0.5–2%)',
                time: '1–7 days',
                bestFor: 'White-glove service, large amounts',
                link: '#',
                kyc: 'Required',
                notes: 'Contact local Bitcoin broker'
            }
        ]
    },

    // ===== UNIVERSAL FALLBACKS =====
    {
        id: 'universal-gift-cards',
        conditions: {
            country: ['us', 'eu', 'other'],
            amount: ['<200', '200-1000'],
            kyc: ['yes', 'prefer-no'],
            speed: ['instant', 'week'],
            payment: ['gift-cards']
        },
        results: [
            {
                name: 'Bitrefill',
                fee: 'Premium (5–10% above face value)',
                time: '5–30 minutes',
                bestFor: 'Convert gift cards to Bitcoin',
                link: 'https://bitrefill.com',
                badge: 'Gift cards',
                kyc: 'None',
                notes: 'Many card types accepted'
            },
            {
                name: 'Paxful',
                fee: '0–5% (varies by seller)',
                time: '15 min – 2 hours',
                bestFor: 'P2P marketplace, gift cards accepted',
                link: 'https://paxful.com',
                kyc: 'Varies by amount',
                notes: 'Many payment methods'
            }
        ]
    }
];

// Fallback result for unmatched conditions
const FALLBACK_RESULTS = [
    {
        name: 'Bisq',
        fee: '0.5–1.5%',
        time: '1–48 hours',
        bestFor: 'Fully decentralized, works globally',
        link: 'https://bisq.network',
        badge: 'Universal',
        kyc: 'None',
        notes: 'Desktop app, requires security deposit'
    },
    {
        name: 'RoboSats',
        fee: '0.2–1.0%',
        time: '30 min – 2 hours',
        bestFor: 'Lightning P2P, no KYC, global',
        link: 'https://learn.robosats.com',
        kyc: 'None',
        notes: 'Requires Lightning wallet, Tor-friendly'
    },
    {
        name: 'Local Bitcoin Community',
        fee: 'Negotiable',
        time: 'Varies',
        bestFor: 'Face-to-face, local meetups',
        link: 'https://bitcoin-only.com/#meetups',
        kyc: 'None',
        notes: 'Search "[your city] Bitcoin meetup"'
    }
];
