/**
 * Monetary Systems Micro-Modules
 * Detailed information for each digital money system
 */

const MonetarySystems = {
    cbdc: {
        name: "Central Bank Digital Currencies (CBDCs)",
        icon: "🏛️",
        tagline: "Government-issued digital currency",
        color: "#3b82f6", // Blue

        overview: {
            definition: "A CBDC is a digital form of a country's fiat currency, issued and controlled by the central bank, built on government-controlled infrastructure.",

            keyCharacteristics: [
                "Issued by central bank or government",
                "Legal tender status",
                "Programmable features",
                "Full transaction monitoring",
                "Can be designed as direct (retail) or indirect (wholesale)"
            ]
        },

        howItWorks: {
            issuance: "Central bank creates digital currency units and distributes through banking system or directly to citizens",
            transactions: "Processed through centralized government infrastructure with real-time monitoring",
            storage: "Held in digital wallets (government-issued or approved third-party)",
            verification: "Know Your Customer (KYC) and identity verification required for all users"
        },

        realWorldExamples: [
            {
                country: "China",
                name: "Digital Yuan (e-CNY)",
                status: "Active pilot with 260+ million users",
                features: [
                    "Offline payments capability",
                    "Integrated with Alipay and WeChat Pay",
                    "Government transaction tracking",
                    "Programmable with restrictions"
                ]
            },
            {
                country: "Bahamas",
                name: "Sand Dollar",
                status: "First live retail CBDC (2020)",
                features: [
                    "Digital wallet system",
                    "KYC requirements for all users",
                    "Transaction limits based on verification level"
                ]
            },
            {
                country: "Nigeria",
                name: "eNaira",
                status: "Launched 2021, low adoption",
                features: [
                    "Mobile-first design for unbanked",
                    "QR code payments",
                    "Limited success despite government push"
                ]
            }
        ],

        tradeoffs: {
            benefits: [
                "Instant government payments and benefits distribution",
                "Reduced cash handling costs",
                "Enhanced monetary policy transmission",
                "Financial inclusion for unbanked (in theory)",
                "Automatic tax collection and compliance"
            ],
            concerns: [
                "Complete loss of financial privacy",
                "Programmable restrictions on spending",
                "Government can freeze accounts instantly",
                "Technical failures freeze economic activity",
                "Potential for political weaponization"
            ]
        },

        whoControls: {
            issuance: "Central bank/Government",
            supply: "Unlimited (at discretion of monetary authority)",
            rules: "Can be changed by government at any time",
            access: "Granted by government, can be revoked",
            dataAccess: "Government has complete visibility"
        }
    },

    stablecoins: {
        name: "Stablecoins",
        icon: "💵",
        tagline: "Pegged private tokens",
        color: "#10b981", // Green

        overview: {
            definition: "Digital tokens issued by private companies, typically pegged 1:1 to fiat currencies like the US Dollar, backed by reserves.",

            keyCharacteristics: [
                "Issued by private companies (Tether, Circle, etc.)",
                "Pegged to fiat currency (usually USD)",
                "Backed by reserves (dollars, bonds, etc.)",
                "Operate on public blockchains",
                "Subject to regulatory oversight"
            ]
        },

        howItWorks: {
            issuance: "Company holds reserves (dollars/bonds) and issues equivalent digital tokens",
            transactions: "Processed on public blockchains (Ethereum, Tron, etc.) with lower fees than traditional finance",
            storage: "Held in crypto wallets (custodial or non-custodial)",
            verification: "KYC required for on/off ramps, but blockchain transactions can be pseudonymous"
        },

        realWorldExamples: [
            {
                name: "USDT (Tether)",
                issuer: "Tether Limited",
                marketCap: "$95+ billion",
                features: [
                    "Most widely used stablecoin",
                    "Available on 10+ blockchains",
                    "Controversial reserve transparency",
                    "High trading volume"
                ]
            },
            {
                name: "USDC (USD Coin)",
                issuer: "Circle",
                marketCap: "$25+ billion",
                features: [
                    "Regular attestations of reserves",
                    "Strong regulatory compliance",
                    "Used in DeFi applications",
                    "Can freeze accounts"
                ]
            },
            {
                name: "DAI",
                issuer: "MakerDAO (decentralized)",
                marketCap: "$5+ billion",
                features: [
                    "Collateralized by crypto assets",
                    "Algorithmically stabilized",
                    "More decentralized governance",
                    "Complex stability mechanisms"
                ]
            }
        ],

        tradeoffs: {
            benefits: [
                "Price stability (pegged to dollar)",
                "Faster than traditional banking",
                "Global accessibility 24/7",
                "Lower fees than wire transfers",
                "Bridge between crypto and fiat"
            ],
            concerns: [
                "Trust in company reserves required",
                "Can freeze/blacklist addresses",
                "Regulatory uncertainty",
                "Inherits fiat inflation",
                "Centralized points of failure"
            ]
        },

        whoControls: {
            issuance: "Private company (regulated)",
            supply: "Unlimited (backed by reserves)",
            rules: "Set by issuing company + regulators",
            access: "Permissioned (can blacklist addresses)",
            dataAccess: "Company sees on-chain activity, government can request data"
        }
    },

    corporate: {
        name: "Corporate Coins",
        icon: "🏢",
        tagline: "Platform-based value systems",
        color: "#8b5cf6", // Purple

        overview: {
            definition: "Digital currencies or point systems created by tech platforms and corporations for use within their ecosystems.",

            keyCharacteristics: [
                "Issued by tech companies/platforms",
                "Closed-loop or semi-open systems",
                "Often tied to platform services",
                "Loyalty programs on steroids",
                "Subject to platform terms of service"
            ]
        },

        howItWorks: {
            issuance: "Company creates tokens/points and distributes through rewards, purchases, or promotions",
            transactions: "Processed on proprietary platform infrastructure",
            storage: "Held in platform accounts (not portable)",
            verification: "Platform account required, subject to ToS"
        },

        realWorldExamples: [
            {
                name: "Facebook/Meta Diem (defunct)",
                status: "Cancelled 2022",
                concept: [
                    "Planned global currency for 2.7B users",
                    "Basket-backed stablecoin",
                    "Regulatory pushback killed project",
                    "Would have been largest closed system"
                ]
            },
            {
                name: "Amazon Coins",
                status: "Active (limited)",
                features: [
                    "Used for app/game purchases",
                    "Discount incentive for users",
                    "Closed Amazon ecosystem",
                    "Cannot be cashed out"
                ]
            },
            {
                name: "Airline Miles / Credit Card Points",
                status: "Traditional corporate currency",
                features: [
                    "Earned through spending",
                    "Complex redemption rules",
                    "Can be devalued at any time",
                    "Limited transferability"
                ]
            }
        ],

        tradeoffs: {
            benefits: [
                "Easy integration with platform services",
                "Rewards for platform loyalty",
                "Often come with discounts/benefits",
                "Familiar user experience",
                "Customer service available"
            ],
            concerns: [
                "Platform controls everything",
                "Can't use outside ecosystem",
                "Terms can change anytime",
                "Account can be banned",
                "No portability or sovereignty",
                "Value determined by company"
            ]
        },

        whoControls: {
            issuance: "Tech platform/corporation",
            supply: "Unlimited (company discretion)",
            rules: "Platform Terms of Service",
            access: "Requires platform account (can be revoked)",
            dataAccess: "Company sees all activity, uses for targeting"
        }
    },

    bitcoin: {
        name: "Bitcoin",
        icon: "₿",
        tagline: "Open, decentralized protocol",
        color: "#f7931a", // Orange

        overview: {
            definition: "A decentralized digital currency operating on a public blockchain, with no central issuer and fixed supply cap of 21 million coins.",

            keyCharacteristics: [
                "No single issuer or controller",
                "Fixed supply (21 million maximum)",
                "Public, transparent blockchain",
                "Permissionless access",
                "Censorship-resistant"
            ]
        },

        howItWorks: {
            issuance: "New bitcoin created through mining (proof-of-work), decreasing over time, ending around 2140",
            transactions: "Validated by distributed network of nodes, secured by proof-of-work mining",
            storage: "Self-custody in wallets controlled by private keys (or custodial services)",
            verification: "No identity required for on-chain transactions (pseudonymous addresses)"
        },

        realWorldExamples: [
            {
                location: "El Salvador",
                status: "Legal tender since 2021",
                implementation: [
                    "First country to adopt Bitcoin as legal tender",
                    "Government Bitcoin wallet (Chivo)",
                    "Merchants required to accept Bitcoin",
                    "Mixed adoption and results"
                ]
            },
            {
                location: "Lightning Network",
                status: "Growing adoption",
                features: [
                    "Layer 2 for instant payments",
                    "Lower fees than on-chain",
                    "Used by millions globally",
                    "Enables micro-transactions"
                ]
            },
            {
                location: "Global Remittances",
                status: "Active use case",
                features: [
                    "Bypasses expensive wire transfers",
                    "Used in high-remittance corridors",
                    "No banking infrastructure required",
                    "24/7 availability"
                ]
            }
        ],

        tradeoffs: {
            benefits: [
                "True ownership (self-custody possible)",
                "Censorship resistant",
                "Fixed supply protects from inflation",
                "Permissionless global access",
                "Transparent and auditable",
                "No single point of failure"
            ],
            concerns: [
                "Price volatility affects purchasing power",
                "Technical complexity for self-custody",
                "Irreversible transactions",
                "Slower than centralized systems",
                "Energy consumption debates",
                "Regulatory uncertainty in some regions"
            ]
        },

        whoControls: {
            issuance: "Mathematical protocol (no one)",
            supply: "Fixed at 21 million coins",
            rules: "Changed only by network-wide consensus",
            access: "Permissionless (anyone can participate)",
            dataAccess: "Public blockchain (pseudonymous, not anonymous)"
        }
    }
};

// Modal system for displaying detailed information
class MonetarySystemsModal {
    constructor() {
        this.currentSystem = null;
        this.init();
    }

    init() {
        this.createModalElement();
        this.attachEventListeners();
    }

    createModalElement() {
        const modal = document.createElement('div');
        modal.id = 'system-detail-modal';
        modal.className = 'modal-overlay hidden';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 1rem;
                overflow-y: auto;
            }

            .modal-overlay.hidden {
                display: none;
            }

            .modal-content {
                background: var(--secondary-dark, #1a1a1a);
                border: 2px solid var(--primary-orange, #f7931a);
                border-radius: 16px;
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                padding: 2rem;
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--primary-orange, #f7931a);
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;
                padding: 0.5rem;
                transition: transform 0.2s ease;
            }

            .modal-close:hover {
                transform: scale(1.2);
            }

            .modal-body {
                color: var(--text-primary, #e0e0e0);
            }

            .modal-body h2 {
                color: var(--primary-orange, #f7931a);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .modal-body h3 {
                color: var(--primary-orange, #f7931a);
                margin-top: 2rem;
                margin-bottom: 1rem;
                border-bottom: 2px solid rgba(247, 147, 26, 0.2);
                padding-bottom: 0.5rem;
            }

            .modal-body ul {
                margin: 1rem 0;
                padding-left: 1.5rem;
            }

            .modal-body li {
                margin-bottom: 0.5rem;
                line-height: 1.6;
            }

            .example-card {
                background: rgba(247, 147, 26, 0.05);
                border-left: 3px solid var(--primary-orange, #f7931a);
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 4px;
            }

            .example-card h4 {
                color: var(--primary-orange, #f7931a);
                margin: 0 0 0.5rem 0;
            }

            .tradeoff-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
                margin: 1rem 0;
            }

            .tradeoff-section {
                background: rgba(0, 0, 0, 0.3);
                padding: 1rem;
                border-radius: 8px;
            }

            .tradeoff-section h4 {
                margin: 0 0 1rem 0;
            }

            .tradeoff-section.benefits h4 {
                color: #10b981;
            }

            .tradeoff-section.concerns h4 {
                color: #ef4444;
            }

            @media (max-width: 768px) {
                .modal-content {
                    padding: 1.5rem;
                }

                .tradeoff-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEventListeners() {
        const modal = document.getElementById('system-detail-modal');
        const closeBtn = modal.querySelector('.modal-close');

        closeBtn.addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(systemKey) {
        const system = MonetarySystems[systemKey];
        if (!system) return;

        this.currentSystem = systemKey;
        const modal = document.getElementById('system-detail-modal');
        const body = modal.querySelector('.modal-body');

        body.innerHTML = this.renderSystemDetails(system);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        const modal = document.getElementById('system-detail-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    renderSystemDetails(system) {
        return `
            <h2><span style="font-size: 2rem;">${system.icon}</span> ${system.name}</h2>
            <p style="font-size: 1.1rem; color: var(--text-dim); margin-bottom: 2rem;">${system.tagline}</p>

            <h3>📖 Overview</h3>
            <p>${system.overview.definition}</p>
            <ul>
                ${system.overview.keyCharacteristics.map(char => `<li>${char}</li>`).join('')}
            </ul>

            <h3>⚙️ How It Works</h3>
            <p><strong>Issuance:</strong> ${system.howItWorks.issuance}</p>
            <p><strong>Transactions:</strong> ${system.howItWorks.transactions}</p>
            <p><strong>Storage:</strong> ${system.howItWorks.storage}</p>
            <p><strong>Verification:</strong> ${system.howItWorks.verification}</p>

            <h3>🌍 Real-World Examples</h3>
            ${system.realWorldExamples.map(example => `
                <div class="example-card">
                    <h4>${example.name || example.location || example.country}</h4>
                    ${example.status ? `<p><em>${example.status}</em></p>` : ''}
                    <ul>
                        ${(example.features || example.implementation || example.concept).map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}

            <h3>⚖️ Trade-offs</h3>
            <div class="tradeoff-grid">
                <div class="tradeoff-section benefits">
                    <h4>✅ Benefits</h4>
                    <ul>
                        ${system.tradeoffs.benefits.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
                <div class="tradeoff-section concerns">
                    <h4>⚠️ Concerns</h4>
                    <ul>
                        ${system.tradeoffs.concerns.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <h3>👑 Who Controls It?</h3>
            <p><strong>Issuance:</strong> ${system.whoControls.issuance}</p>
            <p><strong>Supply:</strong> ${system.whoControls.supply}</p>
            <p><strong>Rules:</strong> ${system.whoControls.rules}</p>
            <p><strong>Access:</strong> ${system.whoControls.access}</p>
            <p><strong>Data Access:</strong> ${system.whoControls.dataAccess}</p>
        `;
    }
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.MonetarySystems = MonetarySystems;
    window.monetarySystemsModal = new MonetarySystemsModal();
}
