/* Bitcoin Sovereign Academy - Bundled Scripts */
(function() {
"use strict";

/* frontend/public/js/mcp-client.js */
/**
 * Bitcoin MCP Agent Kit Client
 * Connects website to production-ready Bitcoin MCP agents
 */

class BitcoinMCPClient {
    constructor() {
        // Prefer env override if provided via ?mcp=http://host:port or window.__MCP_BASE__
        const urlParam = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('mcp') : null;
        this.baseURL = (window && window.__MCP_BASE__) || urlParam || 'http://localhost:3000'; // Default to MCP web server
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.isConnected = false;
        this.eventListeners = new Map();
        
        this.initialize();
    }

    async initialize() {
        console.log('Initializing Bitcoin MCP Client...');
        await this.testConnection();
        this.setupHeartbeat();
    }

    /**
     * Test connection to MCP Agent Kit
     */
    async testConnection() {
        try {
            const response = await this.makeRequest('/api/health', 'GET');
            if (response && (response.status === 'ok' || response.status === 'healthy' || response.success)) {
                this.isConnected = true;
                console.log('✅ Connected to Bitcoin MCP Agent Kit at', this.baseURL);
                this.emit('connected');
            }
        } catch (error) {
            console.warn('⚠️ MCP Agent Kit not available, using fallback mode');
            this.isConnected = false;
            this.emit('disconnected');
        }
    }

    /**
     * Setup heartbeat to monitor connection
     */
    setupHeartbeat() {
        setInterval(async () => {
            if (!this.isConnected) {
                await this.testConnection();
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Make HTTP request with retry logic and caching
     */
    async makeRequest(endpoint, method = 'GET', data = null, skipCache = false) {
        const cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;
        
        // Check cache first
        if (!skipCache && method === 'GET' && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const requestOptions = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };

                if (data && method !== 'GET') {
                    requestOptions.body = JSON.stringify(data);
                }

                const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                
                // Cache successful GET requests
                if (method === 'GET') {
                    this.cache.set(cacheKey, {
                        data: result,
                        timestamp: Date.now()
                    });
                }

                return result;
                
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt}/${this.retryAttempts} failed:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }

        throw lastError;
    }

    /**
     * Get live Bitcoin network data
     */
    async getBitcoinNetworkData() {
        try {
            const data = await this.makeRequest('/api/bitcoin/network-status');
            return {
                blockHeight: data.blockHeight || 'N/A',
                mempoolSize: data.mempoolSize || 'N/A',
                feeEstimate: data.feeEstimate || 'N/A',
                difficulty: data.difficulty || 'N/A',
                price: data.price || 'N/A'
            };
        } catch (error) {
            console.error('Failed to get network data:', error);
            return this.getFallbackNetworkData();
        }
    }

    /**
     * Get Bitcoin price data
     */
    async getBitcoinPrice() {
        try {
            const res = await this.makeRequest('/api/bitcoin/price');
            // Support both {success,data:{price_usd}} and coingecko-style shapes
            const data = res?.data || res || {};
            const usd = data.price_usd ?? data.usd ?? data.price ?? data.bitcoin?.usd;
            const change24h = data.usd_24h_change ?? data.change24h ?? 0;
            return { usd: usd ?? 'N/A', change24h };
        } catch (error) {
            console.error('Failed to get price data:', error);
            return { usd: 'N/A', change24h: 0 };
        }
    }

    /**
     * Get mempool fee estimates
     */
    async getFeeEstimates() {
        try {
            const res = await this.makeRequest('/api/bitcoin/fees');
            const data = res?.data || res || {};
            const est = data.estimates || data;
            return {
                fastest: est.fastestFee ?? est.fastest ?? 'N/A',
                fast: est.halfHourFee ?? est.fast ?? 'N/A',
                medium: est.hourFee ?? est.medium ?? 'N/A',
                slow: est.economyFee ?? est.slow ?? 'N/A',
                congestion: data.congestion ?? undefined
            };
        } catch (error) {
            console.error('Failed to get fee estimates:', error);
            return { fastest: 'N/A', fast: 'N/A', medium: 'N/A', slow: 'N/A' };
        }
    }

    /**
     * Generate Socratic course using MCP agents
     */
    async generateCourse(options) {
        try {
            const payload = {
                topic: options.topic,
                audience: options.level || 'beginner',
                duration: options.duration || 3,
                style: 'socratic',
                includeSimulations: true,
                includeAssessments: true
            };

            const course = await this.makeRequest('/api/course/generate', 'POST', payload, true);
            return this.formatCourseData(course);
        } catch (error) {
            console.error('Failed to generate course:', error);
            return this.getFallbackCourse(options);
        }
    }

    /**
     * Get Bitcoin intelligence summary
     */
    async getIntelligenceSummary() {
        try {
            // Prefer dedicated endpoint if present; otherwise synthesize from news
            const res = await this.makeRequest('/api/intelligence/summary');
            const data = res?.data || res || {};
            return {
                totalAlerts: data.total_alerts || 0,
                criticalAlerts: data.critical_alerts || [],
                educationalOpportunities: data.educational_opportunities || [],
                marketIntelligence: data.market_intelligence || [],
                lastUpdated: data.generated_at || new Date().toISOString()
            };
        } catch (_) {
            try {
                const news = await this.getNews('bitcoin', 20);
                return {
                    totalAlerts: news.headlines?.length || 0,
                    criticalAlerts: [],
                    educationalOpportunities: [],
                    marketIntelligence: [{ title: 'News sentiment', sentiment: news.sentiment?.overall }],
                    lastUpdated: new Date().toISOString()
                };
            } catch (error) {
                console.error('Failed to get intelligence:', error);
                return this.getFallbackIntelligence();
            }
        }
    }

    /**
     * Validate Bitcoin address
     */
    async validateAddress(address) {
        try {
            const data = await this.makeRequest(`/api/tools/validate-address?address=${encodeURIComponent(address)}`);
            return {
                isValid: data.isValid || false,
                type: data.type || 'Unknown',
                network: data.network || 'Unknown',
                details: data.details || {}
            };
        } catch (error) {
            console.error('Failed to validate address:', error);
            return { isValid: false, type: 'Error', network: 'Unknown', details: {} };
        }
    }

    /**
     * Convert Bitcoin units
     */
    convertUnits(amount, fromUnit, toUnit) {
        const satoshisPerBTC = 100000000;
        const conversions = {
            'btc': {
                'sats': amount * satoshisPerBTC,
                'mbtc': amount * 1000,
                'btc': amount
            },
            'sats': {
                'btc': amount / satoshisPerBTC,
                'mbtc': amount / 100000,
                'sats': amount
            },
            'mbtc': {
                'btc': amount / 1000,
                'sats': amount * 100000,
                'mbtc': amount
            }
        };

        return conversions[fromUnit]?.[toUnit] || 0;
    }

    /**
     * Explore Bitcoin transaction
     */
    async getNews(query = 'bitcoin', limit = 10) {
        const res = await this.makeRequest(`/api/news?query=${encodeURIComponent(query)}&limit=${limit}`);
        return res?.data || res || {};
    }

    async exploreTransaction(txid) {
        try {
            const data = await this.makeRequest(`/api/tools/transaction?txid=${encodeURIComponent(txid)}`);
            return {
                txid: data.txid || txid,
                blockHeight: data.block_height || 'Unconfirmed',
                fee: data.fee || 'N/A',
                size: data.size || 'N/A',
                inputs: data.inputs || [],
                outputs: data.outputs || [],
                confirmations: data.confirmations || 0
            };
        } catch (error) {
            console.error('Failed to explore transaction:', error);
            return { error: 'Failed to load transaction data' };
        }
    }

    /**
     * Load simulation data
     */
    async loadSimulation(type) {
        try {
            const data = await this.makeRequest(`/api/simulations/${type}`, 'GET', null, true);
            return data;
        } catch (error) {
            console.error(`Failed to load ${type} simulation:`, error);
            return this.getFallbackSimulation(type);
        }
    }

    /**
     * Get Socratic learning module
     */
    async getSocraticModule(moduleName) {
        try {
            const data = await this.makeRequest(`/api/learning/module/${moduleName}`);
            return {
                title: data.title || moduleName,
                questions: data.socratic_questions || [],
                activities: data.hands_on_activities || [],
                assessments: data.assessments || [],
                resources: data.additional_resources || []
            };
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            return this.getFallbackModule(moduleName);
        }
    }

    // === FALLBACK METHODS ===

    getFallbackNetworkData() {
        return {
            blockHeight: '800,000+',
            mempoolSize: '~1,500',
            feeEstimate: '15-25',
            difficulty: 'High',
            price: '$40,000+'
        };
    }

    getFallbackCourse(options) {
        const topics = {
            lightning: {
                title: 'Lightning Network Fundamentals',
                description: 'Learn Bitcoin\'s payment layer',
                modules: ['Lightning Basics', 'Channel Management', 'Routing'],
                duration: '4 hours'
            },
            mining: {
                title: 'Bitcoin Mining Deep Dive', 
                description: 'Understand Bitcoin\'s security model',
                modules: ['Hash Functions', 'Proof of Work', 'Mining Economics'],
                duration: '5 hours'
            }
        };

        return topics[options.topic] || {
            title: 'Bitcoin Fundamentals',
            description: 'Master Bitcoin basics',
            modules: ['What is Bitcoin', 'Digital Scarcity', 'Network Security'],
            duration: '3 hours'
        };
    }

    getFallbackIntelligence() {
        return {
            totalAlerts: 0,
            criticalAlerts: [],
            educationalOpportunities: [
                { title: 'Interactive Transaction Visualizer', source: 'Learn Me A Bitcoin' }
            ],
            marketIntelligence: [
                { title: 'Bitcoin Adoption Growing', sentiment: 'positive' }
            ],
            lastUpdated: new Date().toISOString()
        };
    }

    getFallbackSimulation(type) {
        const simulations = {
            transaction: {
                title: 'Transaction Builder',
                description: 'Build Bitcoin transactions step by step',
                interface: 'interactive'
            },
            fees: {
                title: 'Fee Calculator',
                description: 'Calculate optimal transaction fees',
                interface: 'calculator'
            },
            security: {
                title: 'Security Trainer',
                description: 'Practice Bitcoin security scenarios',
                interface: 'guided'
            }
        };

        return simulations[type] || { title: 'Simulation', description: 'Learning simulation' };
    }

    getFallbackModule(moduleName) {
        const modules = {
            fundamentals: {
                title: 'Bitcoin Fundamentals',
                questions: [
                    'What problem does Bitcoin solve?',
                    'How does Bitcoin create digital scarcity?',
                    'Why is Bitcoin often called "digital gold"?'
                ],
                activities: [
                    'Explore a Bitcoin block explorer',
                    'Calculate Bitcoin\'s total supply',
                    'Compare Bitcoin to traditional money'
                ]
            },
            transactions: {
                title: 'Transaction Mechanics',
                questions: [
                    'What is a UTXO?',
                    'How do transaction fees work?',
                    'What happens when you send Bitcoin?'
                ],
                activities: [
                    'Analyze a real Bitcoin transaction',
                    'Calculate transaction fees',
                    'Understand different address types'
                ]
            },
            security: {
                title: 'Security & Custody',
                questions: [
                    'What is a private key?',
                    'How do seed phrases work?',
                    'What are the risks of poor security?'
                ],
                activities: [
                    'Generate a test wallet',
                    'Practice seed phrase security',
                    'Identify security threats'
                ]
            }
        };

        return modules[moduleName] || modules.fundamentals;
    }

    // === UTILITY METHODS ===

    formatCourseData(course) {
        return {
            id: course.course_id || Date.now(),
            title: course.title || 'Bitcoin Course',
            description: course.description || 'Learn Bitcoin concepts',
            modules: course.modules || [],
            duration: course.estimated_duration || '3 hours',
            difficulty: course.difficulty || 'beginner',
            createdAt: new Date().toISOString()
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // === EVENT SYSTEM ===

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event listener error for ${event}:`, error);
                }
            });
        }
    }

    // === CLEANUP ===

    clearCache() {
        this.cache.clear();
        console.log('MCP Client cache cleared');
    }
}

// Initialize global MCP client
window.mcpClient = new BitcoinMCPClient();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitcoinMCPClient;
}

/* frontend/public/js/journey.js */
class JourneyManager {
  constructor(mcpClient) {
    this.mcp = mcpClient;

    this.stageOrder = ['foundation', 'basics', 'deeper', 'custody', 'advanced'];
    this.stageMeta = this.buildStageMeta();
    this.personas = this.buildPersonaCatalog();
    this.personaStages = this.buildPersonaStages();
    this.dynamicStages = {};

    this.heroPersonaEl = document.getElementById('journey-persona');
    this.nextActionBtn = document.getElementById('journey-next-action');
    this.ctaStartBtn = document.getElementById('cta-start-journey');
    this.ctaDemosBtn = document.getElementById('cta-browse-demos');

    this.progressFill = document.getElementById('journey-progress-fill');
    this.progressText = document.getElementById('journey-progress-text');
    this.progressStage = document.getElementById('journey-stage');
    this.progressNextBtn = document.getElementById('journey-progress-button');

    this.guidePane = document.getElementById('journey-guide');
    this.guideTitle = document.getElementById('journey-guide-title');
    this.guideDescription = document.getElementById('journey-guide-description');
    this.guideStartBtn = document.getElementById('journey-guide-start');
    this.guideSkipBtn = document.getElementById('journey-guide-skip');

    this.mapGrid = document.getElementById('journey-map-grid');
    this.mapIntro = document.getElementById('journey-map-intro');

    this.modal = document.getElementById('persona-modal');
    this.modalGrid = document.getElementById('persona-grid');
    this.modalContinue = document.getElementById('persona-continue');
    this.modalSkip = document.getElementById('persona-skip');
    this.modalClose = document.getElementById('persona-close');

    this.stageModal = document.getElementById('journey-stage-modal');
    this.stageModalBadge = document.getElementById('journey-stage-badge');
    this.stageModalTitle = document.getElementById('journey-stage-title');
    this.stageModalDescription = document.getElementById('journey-stage-description');
    this.stageModalList = document.getElementById('journey-stage-list');
    this.stageModalStart = document.getElementById('journey-stage-start');
    this.stageModalComplete = document.getElementById('journey-stage-complete');
    this.stageModalClose = document.getElementById('journey-stage-close');

    this.selectedPersona = null;
    this.currentStageForModal = null;
    this.currentCardForModal = null;

    this.state = this.loadState();

    this.renderPersonaOptions();
    this.bindEvents();
    this.applyStateToUI();

    if (this.state.personaId) {
      this.fetchPersonaRecommendations(this.state.personaId);
    }

    this.autoLaunchIfNeeded();
  }

  trackAnalytics(eventName, metadata = {}) {
    try {
      if (typeof window !== 'undefined' && window.eventTracker && typeof window.eventTracker.track === 'function') {
        window.eventTracker.track(eventName, metadata);
      }
    } catch (error) {
      console.warn('JourneyManager analytics error', error);
    }
  }

  getLearnerName() {
    if (typeof window === 'undefined') return 'Bitcoin Learner';
    const storageKey = 'journey-learner-name';
    let name = window.localStorage.getItem(storageKey);
    if (!name) {
      name = window.prompt('What name should appear on your certificate?', 'Bitcoin Learner') || 'Bitcoin Learner';
      window.localStorage.setItem(storageKey, name);
    }
    return name;
  }

  getCertificationLevel() {
    switch (this.state.personaId) {
      case 'builder':
        return 'advanced';
      case 'sovereign':
        return 'advanced';
      case 'investor':
        return 'intermediate';
      default:
        return 'beginner';
    }
  }

  issueCompletionCertificate() {
    if (typeof window === 'undefined' || !window.certificationEngine) {
      return;
    }

    const storageKey = 'journey-certificate-record';
    let certificate;

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        certificate = JSON.parse(stored);
        this.trackAnalytics('Journey_Certificate_Viewed', {
          certificate_id: certificate.id,
          persona_id: this.state.personaId || 'unknown'
        });
      } else {
        const name = this.getLearnerName();
        certificate = window.certificationEngine.issueCertificate({
          recipientName: name,
          recipientEmail: '',
          type: 'course-completion',
          title: 'Bitcoin Sovereign Journey',
          description: 'Awarded for completing the Bitcoin Sovereign guided journey and mastering self-sovereignty fundamentals.',
          achievement: {
            courseId: 'sovereign-journey',
            courseName: 'Bitcoin Sovereign Journey',
            level: this.getCertificationLevel(),
            skills: ['Bitcoin fundamentals', 'Self-custody', 'Risk management', 'Lightning basics'],
            assessments: [],
            totalHours: 6,
            finalScore: 100
          },
          expiresInDays: 365
        });

        window.localStorage.setItem(storageKey, JSON.stringify(certificate));
        this.trackAnalytics('Journey_Certificate_Issued', {
          certificate_id: certificate.id,
          persona_id: this.state.personaId || 'unknown'
        });
      }

      if (certificate) {
        const html = window.certificationEngine.generateCertificateHTML(certificate);
        const certificateWindow = window.open('', '_blank');
        if (certificateWindow) {
          certificateWindow.document.write(html);
          certificateWindow.document.close();
        }
      }
    } catch (error) {
      console.error('JourneyManager: Unable to issue certificate', error);
    }
  }

  buildPersonaCatalog() {
    return [
      {
        id: 'curious',
        label: 'Bitcoin Curious',
        description: 'New to Bitcoin. Looking for plain-language explanations and first steps.'
      },
      {
        id: 'investor',
        label: 'Traditional Investor',
        description: 'Understands markets and wants to evaluate Bitcoin as an asset.'
      },
      {
        id: 'builder',
        label: 'Builder / Developer',
        description: 'Comfortable with technology, interested in Lightning, multisig, and building on Bitcoin.'
      },
      {
        id: 'sovereign',
        label: 'Sovereignty Seeker',
        description: 'Focused on self-custody, security practices, and geopolitical resilience.'
      }
    ];
  }

  buildStageMeta() {
    return {
      foundation: { label: 'Foundation', subtitle: 'Understand the why' },
      basics: { label: 'Step 1', subtitle: 'Bitcoin basics' },
      deeper: { label: 'Step 2', subtitle: 'Going deeper' },
      custody: { label: 'Step 3', subtitle: 'Self-custody' },
      advanced: { label: 'Step 4', subtitle: 'Advanced topics' }
    };
  }

  buildPersonaStages() {
    const fallback = {
      foundation: [
        {
          title: 'Understand the Why',
          description: 'Review the foundation card and study why Bitcoin emerged as a response to failing monetary systems.',
          tag: 'Learn',
          anchor: '#foundation-intro',
          guidance: [
            'Scroll to the “Your Path to Sovereignty” section and read the Foundation card carefully.',
            'Open the “Why Bitcoin” section below and capture the key problems Bitcoin is solving.'
          ]
        }
      ],
      basics: [
        {
          title: 'Bitcoin Basics',
          description: 'Learn wallets, keys, addresses, and practice sending a transaction safely.',
          tag: 'Practice',
          anchor: '#foundation-basics',
          guidance: [
            'Complete the Bitcoin Basics card steps and spin up a test wallet.',
            'Use the Story agent to retell what you learned in your own words.'
          ]
        }
      ],
      deeper: [
        {
          title: 'Going Deeper',
          description: 'Explore UTXOs, mining, and consensus to understand what makes Bitcoin unstoppable.',
          tag: 'Explore',
          anchor: '#foundation-deeper',
          guidance: [
            'Scroll to “Going Deeper” and study the callouts inside the section.',
            'Run at least one simulation (Transaction Builder or Mining) to reinforce the concept.'
          ]
        }
      ],
      custody: [
        {
          title: 'Self-Custody Mastery',
          description: 'Design your personal custody plan with hardware wallets, backups, and risk drills.',
          tag: 'Secure',
          anchor: '#foundation-custody',
          guidance: [
            'Read the Self-Custody card and jot down what hardware or multisig setup you plan to use.',
            'Visit the security trainer simulation and practice a recovery drill.'
          ]
        }
      ],
      advanced: [
        {
          title: 'Advanced Topics',
          description: 'Bring nodes, Lightning, and privacy techniques together to operate independently.',
          tag: 'Build',
          anchor: '#foundation-advanced',
          guidance: [
            'Review the Advanced Topics card and identify one advanced capability to try this week.',
            'Use the AI advisors to outline your next experiment (Lightning channel, privacy hardening, or node setup).'
          ]
        }
      ]
    };

    return {
      fallback,
      curious: fallback,
      investor: fallback,
      builder: fallback,
      sovereign: fallback
    };
  }

  loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem('journey-state-v1')) || null;
      if (stored) {
        return this.normalizeState(stored);
      }
    } catch (error) {
      console.warn('JourneyManager: Unable to read stored state', error);
    }

    const initial = {
      personaId: null,
      progress: 0,
      stage: this.stageOrder[0],
      started: {},
      completed: {},
      updatedAt: Date.now()
    };

    return this.normalizeState(initial);
  }

  normalizeState(state) {
    state.started = state.started || {};
    state.completed = state.completed || {};
    this.stageOrder.forEach((stage) => {
      state.started[stage] = Boolean(state.started[stage]);
      state.completed[stage] = Boolean(state.completed[stage]);
    });

    if (!this.stageOrder.includes(state.stage)) {
      state.stage = this.stageOrder.find((stage) => !state.completed[stage]) || this.stageOrder[this.stageOrder.length - 1];
    }

    return state;
  }

  saveState() {
    try {
      localStorage.setItem('journey-state-v1', JSON.stringify(this.state));
    } catch (error) {
      console.warn('JourneyManager: Unable to persist state', error);
    }
  }

  bindEvents() {
    if (this.ctaStartBtn) {
      this.ctaStartBtn.addEventListener('click', () => this.openPersonaModal());
    }

    if (this.ctaDemosBtn) {
      if (this.ctaDemosBtn.tagName === 'BUTTON') {
        this.ctaDemosBtn.addEventListener('click', () => this.scrollTo('#foundation-deeper'));
      } else {
        this.ctaDemosBtn.addEventListener('click', (event) => {
          const href = this.ctaDemosBtn.getAttribute('href');
          if (href) {
            event.preventDefault();
            window.location.assign(href);
          }
        });
      }
    }

    this.nextActionBtn?.addEventListener('click', () => this.handleNextAction());
    this.progressNextBtn?.addEventListener('click', () => this.handleNextAction());

    this.modalContinue?.addEventListener('click', () => this.commitPersonaSelection());
    this.modalSkip?.addEventListener('click', () => {
      this.closePersonaModal();
      this.updateGuidePanel();
    });
    this.modalClose?.addEventListener('click', () => this.closePersonaModal());

    this.stageModalStart?.addEventListener('click', () => {
      if (this.currentCardForModal?.anchor) {
        this.scrollTo(this.currentCardForModal.anchor);
      }
      this.closeStageModal();
    });

    this.stageModalComplete?.addEventListener('click', () => {
      if (this.currentStageForModal) {
        this.markStageComplete(this.currentStageForModal);
      }
    });

    this.stageModalClose?.addEventListener('click', () => this.closeStageModal());

    this.stageModal?.addEventListener('click', (event) => {
      if (event.target === this.stageModal) {
        this.closeStageModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closePersonaModal();
        this.closeStageModal();
      }
    });
  }

  renderPersonaOptions() {
    if (!this.modalGrid) return;
    this.modalGrid.innerHTML = '';
    this.personas.forEach((persona) => {
      const card = document.createElement('button');
      card.className = 'persona-card';
      card.type = 'button';
      card.dataset.personaId = persona.id;
      card.innerHTML = `
        <span class="persona-card__label">${persona.label}</span>
        <span class="persona-card__desc">${persona.description}</span>
      `;
      card.addEventListener('click', () => this.selectPersona(persona.id));
      this.modalGrid.appendChild(card);
    });
  }

  selectPersona(personaId) {
    this.selectedPersona = this.personas.find((p) => p.id === personaId) || null;
    if (!this.selectedPersona) return;

    this.modalGrid?.querySelectorAll('.persona-card').forEach((card) => {
      card.classList.toggle('persona-card--active', card.dataset.personaId === personaId);
    });

    if (this.modalContinue) {
      this.modalContinue.disabled = false;
      this.modalContinue.textContent = `Continue as ${this.selectedPersona.label}`;
    }

    this.trackAnalytics('Journey_Persona_Previewed', {
      persona_id: this.selectedPersona.id,
      persona_label: this.selectedPersona.label
    });
  }

  commitPersonaSelection() {
    if (!this.selectedPersona) {
      this.openPersonaModal();
      return;
    }

    this.state.personaId = this.selectedPersona.id;
    this.state.stage = this.stageOrder[0];
    this.state.progress = 0;
    this.state.started = {};
    this.state.completed = {};
    this.stageOrder.forEach((stage) => {
      this.state.started[stage] = false;
      this.state.completed[stage] = false;
    });
    this.state.updatedAt = Date.now();
    this.saveState();

    this.closePersonaModal();
    this.applyStateToUI();
    this.fetchPersonaRecommendations(this.state.personaId);

    this.trackAnalytics('Journey_Persona_Selected', {
      persona_id: this.state.personaId,
      persona_label: this.selectedPersona.label
    });
  }

  getPersona() {
    return this.state.personaId
      ? this.personas.find((p) => p.id === this.state.personaId)
      : null;
  }

  getPersonaContent(personaId) {
    if (!personaId) return this.personaStages.fallback;
    return this.dynamicStages[personaId] || this.personaStages[personaId] || this.personaStages.fallback;
  }

  cloneStageContent(content) {
    return JSON.parse(JSON.stringify(content));
  }

  async fetchPersonaRecommendations(personaId) {
    if (!personaId || !this.mcp || typeof this.mcp.generateCourse !== 'function') return;

    const topicMap = {
      curious: 'fundamentals',
      investor: 'economics',
      builder: 'development',
      sovereign: 'security'
    };

    try {
      const course = await this.mcp.generateCourse({
        topic: topicMap[personaId] || 'fundamentals',
        level: personaId === 'builder' ? 'intermediate' : 'beginner',
        duration: 4
      });

      if (!course || !Array.isArray(course.modules) || course.modules.length === 0) return;

      const base = this.personaStages[personaId] || this.personaStages.fallback;
      const cloned = this.cloneStageContent(base);
      const [moduleOne, moduleTwo, moduleThree] = course.modules;

      if (moduleOne && cloned.basics?.[0]) {
        cloned.basics[0].title = moduleOne.title || cloned.basics[0].title;
        cloned.basics[0].description = moduleOne.description || cloned.basics[0].description;
        cloned.basics[0].guidance = [
          `Work through the generated module “${moduleOne.title}”.`,
          'Summarize three insights and save them to your learning journal.'
        ];
      }

      if (moduleTwo && cloned.deeper?.[0]) {
        cloned.deeper[0].title = moduleTwo.title || cloned.deeper[0].title;
        cloned.deeper[0].description = moduleTwo.description || cloned.deeper[0].description;
        cloned.deeper[0].guidance = [
          `Complete the advanced exercises in “${moduleTwo.title}”.`,
          'Use at least one interactive simulation to validate what you learned.'
        ];
      }

      if (moduleThree && cloned.advanced?.[0]) {
        cloned.advanced[0].title = moduleThree.title || cloned.advanced[0].title;
        cloned.advanced[0].description = moduleThree.description || cloned.advanced[0].description;
        cloned.advanced[0].guidance = [
          `Apply “${moduleThree.title}” by outlining your own implementation plan.`,
          'Book a follow-up session with the AI advisor to stress-test your plan.'
        ];
      }

      this.dynamicStages[personaId] = cloned;
      this.applyStateToUI();

      this.trackAnalytics('Journey_Personalized', {
        persona_id: personaId,
        modules: course.modules.length
      });
    } catch (error) {
      console.warn('JourneyManager: Unable to fetch persona recommendations', error);
    }
  }

  applyStateToUI() {
    const hasPersona = Boolean(this.state.personaId);
    document.body.classList.toggle('journey-active', hasPersona);

    this.updateJourneyMessaging();
    this.updateGuidePanel();
    this.updateProgressUI();
    this.renderStages();
  }

  updateJourneyMessaging() {
    const persona = this.getPersona();
    if (this.heroPersonaEl) {
      this.heroPersonaEl.textContent = persona ? persona.label : 'Select a persona to begin';
    }

    if (this.ctaStartBtn) {
      this.ctaStartBtn.textContent = persona ? 'Change persona' : 'Start My Guided Path';
    }

    if (this.mapIntro) {
      this.mapIntro.textContent = persona
        ? `Your path as ${persona.label}: follow each stage from top to bottom.`
        : 'Pick a persona to unlock a curated flow.';
    }
  }

  updateGuidePanel() {
    if (!this.guideTitle || !this.guideStartBtn || !this.guideDescription) return;

    const persona = this.getPersona();
    const nextCard = persona ? this.getNextActionCard(persona.id) : null;

    if (!persona) {
      this.guideTitle.textContent = 'Select a persona to begin';
      this.guideDescription.textContent = 'Choose a learner profile so we can recommend the first step.';
      this.guideStartBtn.textContent = 'Choose persona';
      this.guideStartBtn.disabled = false;
      this.guideStartBtn.onclick = () => this.openPersonaModal();
      this.guideSkipBtn && (this.guideSkipBtn.onclick = () => this.scrollTo('#journey-map'));
      return;
    }

    if (!nextCard) {
      this.guideTitle.textContent = 'Journey complete!';
      this.guideDescription.textContent = 'Review your journey map or revisit any stage to go even deeper.';
      this.guideStartBtn.textContent = 'Review journey map';
      this.guideStartBtn.disabled = false;
      this.guideStartBtn.onclick = () => this.scrollTo('#journey-map');
      this.guideSkipBtn && (this.guideSkipBtn.onclick = () => this.scrollTo('#foundation'));
      return;
    }

    const meta = this.stageMeta[nextCard.stage] || { label: 'Next', subtitle: '' };
    this.guideTitle.textContent = `Next: ${nextCard.title}`;
    this.guideDescription.textContent = nextCard.guidance?.[0] || nextCard.description || 'Let’s move to your next milestone.';
    this.guideStartBtn.textContent = `Start ${meta.label}`;
    this.guideStartBtn.disabled = false;
    this.guideStartBtn.onclick = () => this.launchStage(nextCard.stage, nextCard.anchor, nextCard);
    this.guideSkipBtn && (this.guideSkipBtn.onclick = () => this.scrollTo('#journey-map'));
  }

  updateProgressUI() {
    const progress = this.progressFromCompleted();
    this.state.progress = progress;

    if (this.progressFill) {
      this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    if (this.progressText) {
      this.progressText.textContent = `${Math.min(progress, 100)}% complete`;
    }

    if (this.progressStage) {
      const stageMeta = this.stageMeta[this.state.stage];
      this.progressStage.textContent = stageMeta ? `Stage: ${stageMeta.label}` : 'Stage: Foundation';
    }
  }

  progressFromCompleted() {
    let progress = 0;
    this.stageOrder.forEach((stage) => {
      if (this.state.completed[stage]) {
        progress = Math.max(progress, this.progressForStage(stage));
      }
    });
    return progress;
  }

  renderStages() {
    if (!this.mapGrid) return;

    const persona = this.getPersona();
    const content = this.getPersonaContent(persona?.id);

    this.mapGrid.innerHTML = '';

    this.stageOrder.forEach((stageId) => {
      const meta = this.stageMeta[stageId];
      const cards = content[stageId] || [];

      const isCompleted = Boolean(this.state.completed[stageId]);
      const isStarted = Boolean(this.state.started[stageId]);
      const isCurrent = this.state.stage === stageId && !isCompleted;

      const stageEl = document.createElement('section');
      stageEl.className = `journey-stage journey-stage--${stageId}`;
      if (isCompleted) stageEl.classList.add('journey-stage--completed');
      if (isCurrent) stageEl.classList.add('journey-stage--current');

      stageEl.innerHTML = `
        <header class="journey-stage__header">
          <span class="journey-stage__badge">${meta.label}</span>
          <h3>${meta.subtitle}</h3>
        </header>
        <div class="journey-stage__cards"></div>
      `;

      const cardsContainer = stageEl.querySelector('.journey-stage__cards');

      cards.forEach((card) => {
        const buttonLabel = isCompleted
          ? 'Review stage'
          : isStarted
            ? 'Continue stage'
            : 'Start stage';
        const cardEl = document.createElement('article');
        cardEl.className = 'journey-card';
        cardEl.innerHTML = `
          <span class="journey-card__tag">${card.tag}</span>
          <h4>${card.title}</h4>
          <p>${card.description}</p>
          <button class="journey-card__action" type="button">${buttonLabel}</button>
        `;
        const button = cardEl.querySelector('.journey-card__action');
        button.addEventListener('click', () => this.launchStage(stageId, card.anchor, card));
        cardsContainer.appendChild(cardEl);
      });

      this.mapGrid.appendChild(stageEl);
    });
  }

  getNextActionCard(personaId) {
    const content = this.getPersonaContent(personaId);
    for (const stageId of this.stageOrder) {
      if (!this.state.completed[stageId]) {
        const card = content[stageId]?.[0];
        if (card) {
          return { ...card, stage: stageId };
        }
      }
    }
    return null;
  }

  handleNextAction() {
    const persona = this.getPersona();
    if (!persona) {
      this.openPersonaModal();
      return;
    }

    const nextCard = this.getNextActionCard(persona.id);
    if (nextCard) {
      this.trackAnalytics('Journey_Next_Action', {
        persona_id: persona.id,
        stage: nextCard.stage,
        title: nextCard.title
      });
      this.launchStage(nextCard.stage, nextCard.anchor, nextCard);
    } else {
      this.scrollTo('#journey-map');
    }
  }

  launchStage(stageId, anchor, card) {
    const persona = this.getPersona();
    if (!persona) {
      this.openPersonaModal();
      return;
    }

    const content = this.getPersonaContent(persona.id);
    const stageCard = card || content[stageId]?.[0];
    if (!stageCard) return;

    this.state.stage = stageId;
    this.state.started[stageId] = true;
    this.state.updatedAt = Date.now();
    this.saveState();

    this.applyStateToUI();
    this.trackAnalytics('Journey_Stage_Launched', {
      persona_id: persona?.id || 'unknown',
      stage: stageId,
      title: stageCard.title
    });
    this.openStageModal(stageId, stageCard);

    if (anchor) {
      this.highlightStage(stageId);
    }
  }

  openStageModal(stageId, card) {
    if (!this.stageModal || !card) {
      if (card?.anchor) {
        this.scrollTo(card.anchor);
      }
      return;
    }

    const meta = this.stageMeta[stageId] || { label: 'Stage', subtitle: '' };

    this.currentStageForModal = stageId;
    this.currentCardForModal = card;

    if (this.stageModalBadge) this.stageModalBadge.textContent = meta.label;
    if (this.stageModalTitle) this.stageModalTitle.textContent = card.title;
    if (this.stageModalDescription) this.stageModalDescription.textContent = card.description;

    if (this.stageModalList) {
      this.stageModalList.innerHTML = '';
      const guidance = card.guidance && card.guidance.length ? card.guidance : ['Scroll to the recommended section and capture your takeaways.'];
      guidance.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        this.stageModalList.appendChild(li);
      });
    }

    this.stageModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  closeStageModal() {
    if (!this.stageModal) return;
    this.stageModal.classList.add('hidden');
    if (!this.modal || this.modal.classList.contains('hidden')) {
      document.body.classList.remove('no-scroll');
    }
  }

  markStageComplete(stageId) {
    if (!this.stageOrder.includes(stageId)) return;

    this.state.completed[stageId] = true;
    this.state.started[stageId] = true;
    this.state.progress = Math.max(this.state.progress, this.progressForStage(stageId));

    const nextStage = this.stageOrder.find((stage) => !this.state.completed[stage]);
    this.state.stage = nextStage || stageId;
    this.state.updatedAt = Date.now();

    this.saveState();
    this.closeStageModal();
    this.applyStateToUI();

    this.trackAnalytics('Journey_Stage_Completed', {
      persona_id: this.state.personaId || 'unknown',
      stage: stageId,
      next_stage: nextStage || null
    });

    if (!nextStage) {
      this.trackAnalytics('Journey_Completed', {
        persona_id: this.state.personaId || 'unknown'
      });
      this.issueCompletionCertificate();
    }
  }

  highlightStage(stageId) {
    if (!this.mapGrid) return;
    const stageEl = this.mapGrid.querySelector(`.journey-stage--${stageId}`);
    if (!stageEl) return;
    stageEl.classList.add('journey-stage--highlight');
    setTimeout(() => stageEl.classList.remove('journey-stage--highlight'), 1600);
  }

  progressForStage(stageId) {
    switch (stageId) {
      case 'foundation':
        return 20;
      case 'basics':
        return 40;
      case 'deeper':
        return 60;
      case 'custody':
        return 80;
      case 'advanced':
        return 100;
      default:
        return 0;
    }
  }

  scrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openPersonaModal() {
    if (!this.modal) return;

    if (this.state.personaId) {
      this.selectPersona(this.state.personaId);
    } else if (this.modalContinue) {
      this.modalContinue.disabled = true;
      this.modalContinue.textContent = 'Continue with this path';
      this.modalGrid?.querySelectorAll('.persona-card').forEach((card) => card.classList.remove('persona-card--active'));
    }

    this.modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  closePersonaModal() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    if (!this.stageModal || this.stageModal.classList.contains('hidden')) {
      document.body.classList.remove('no-scroll');
    }
  }

  autoLaunchIfNeeded() {
    if (!this.state.personaId) {
      setTimeout(() => this.openPersonaModal(), 600);
    }
  }
}

(function initJourney() {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cta-start-journey')) {
      window.journeyManager = new JourneyManager(window.mcpClient);
    }
  });
})();


})();