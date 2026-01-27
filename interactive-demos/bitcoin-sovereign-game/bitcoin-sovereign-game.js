/**
 * Bitcoin SOVEREIGN Journey (2005-2025)
 * Interactive historical simulation with Socratic learning
 * Integrates CheckOnChain metrics for real-world context
 * Part of Bitcoin Sovereign Academy
 */

class BitcoinSovereignGame {
    constructor() {
        this.name = 'Bitcoin SOVEREIGN: Your Journey to Financial Sovereignty';
        this.description = 'Experience 20 years of economic history and Bitcoin evolution';
        this.currentYear = 2005;
        this.endYear = 2025;
        
        // Player state
        this.player = {
            name: '',
            portfolio: {
                fiat: 10000,
                bitcoin: 0,
                bitcoinOnExchange: 0, // Tracks Bitcoin kept on exchanges (vulnerable to Mt. Gox)
                bitcoinLostMtGox: 0,  // Tracks lost Bitcoin from Mt. Gox
                gold: 0,
                stocks: 0,
                realestate: 0
            },
            knowledge: {
                economic: 0,
                bitcoin: 0,
                sovereignty: 0,
                technical: 0
            },
            decisions: [],
            achievements: [],
            riskTolerance: 'moderate',
            inSelfCustody: false  // Tracks custody status
        };
        
        // Historical accuracy from CheckOnChain
        this.historicalMetrics = {};

        // Initialize game components (lazy loaded to avoid class definition order issues)
        this.timeline = null;
        this.socraticTutor = null;
        this.simulator = null;
        this.assessor = null;

        // Connect to CheckOnChain for real metrics
        this.checkOnChain = window.CheckOnChainMetrics ? new window.CheckOnChainMetrics() : null;
    }

    // Lazy initialize helper classes
    initializeHelpers() {
        if (!this.timeline) {
            try {
                console.log('Initializing helper classes...');
                this.timeline = new TimelineEvents();
                console.log('TimelineEvents initialized');
                this.socraticTutor = new SocraticTutor();
                console.log('SocraticTutor initialized');
                this.simulator = new EconomicSimulator();
                console.log('EconomicSimulator initialized');
                this.assessor = new ProgressAssessor();
                console.log('ProgressAssessor initialized');
                console.log('All helper classes initialized successfully');
            } catch (error) {
                console.error('Error initializing helper classes:', error);
                throw new Error('Failed to initialize game components: ' + error.message);
            }
        }
    }

    // ============================================================================
    // GAME INITIALIZATION
    // ============================================================================

    async initializeGame(playerName) {
        try {
            console.log('Starting game initialization for player:', playerName);

            // Initialize helper classes first
            this.initializeHelpers();

            this.player.name = playerName;

            // Load historical data if available
            if (this.checkOnChain) {
                await this.loadHistoricalMetrics();
            }

            // Set initial economic conditions
            this.setInitialConditions();

            console.log('Game initialization complete, starting year 2005');
            // Start first year
            return this.startYear(2005);
        } catch (error) {
            console.error('Game initialization failed:', error);
            throw error;
        }
    }

    async loadHistoricalMetrics() {
        // Load actual historical Bitcoin metrics where available
        try {
            const metrics = await this.checkOnChain.fetchAllMetrics();
            this.historicalMetrics = this.processHistoricalData(metrics);
        } catch (error) {
            console.log('Using simulated historical data');
            this.historicalMetrics = this.timeline.getSimulatedMetrics();
        }
    }

    setInitialConditions() {
        this.globalEconomy = {
            interestRate: 5.25,
            inflation: 2.5,
            gdpGrowth: 3.1,
            unemploymentRate: 5.0,
            stockMarketIndex: 100,
            housingIndex: 100,
            goldPrice: 445,
            m2Supply: 7000000000000, // $7 trillion
            debtToGDP: 64
        };
        
        this.bitcoinNetwork = {
            exists: false,
            price: 0,
            marketCap: 0,
            hashrate: 0,
            difficulty: 0,
            nodesCount: 0,
            adoption: 0,
            halvings: 0
        };
    }

    // ============================================================================
    // TIMELINE EVENTS
    // ============================================================================

    startYear(year) {
        this.currentYear = year;
        const event = this.timeline.getEvent(year);

        // MT. GOX COLLAPSE - February 2014
        // Players who didn't move to self-custody lose their exchange Bitcoin
        if (year === 2014 && this.player.portfolio.bitcoinOnExchange > 0) {
            this.player.portfolio.bitcoinLostMtGox = this.player.portfolio.bitcoinOnExchange;
            this.player.portfolio.bitcoinOnExchange = 0;

            // Add special Mt. Gox event notification
            event.mtgoxCollapse = true;
            event.lostBTC = this.player.portfolio.bitcoinLostMtGox;
        }

        return {
            year,
            event,
            economicState: this.getEconomicState(year),
            bitcoinState: this.getBitcoinState(year),
            playerOptions: this.generateOptions(year, event),
            socraticQuestion: this.socraticTutor.getQuestion(year, event),
            newsHeadlines: this.generateNewsHeadlines(year),
            metrics: this.getYearMetrics(year)
        };
    }

    getEconomicState(year) {
        // Simulate economic conditions based on historical events
        const states = {
            2005: { condition: 'bubble', description: 'Housing bubble inflating, easy credit everywhere' },
            2006: { condition: 'peak', description: 'Markets at all-time highs, risk ignored' },
            2007: { condition: 'cracks', description: 'Subprime mortgages failing, Bear Stearns hedge funds collapse' },
            2008: { condition: 'crisis', description: 'Global financial meltdown, banks failing' },
            2009: { condition: 'recovery', description: 'Quantitative easing begins, slow recovery' },
            2010: { condition: 'uncertainty', description: 'European debt crisis, flash crash' },
            2011: { condition: 'volatility', description: 'US debt downgrade, market swings' },
            2012: { condition: 'stabilization', description: 'Central bank intervention continues' },
            2013: { condition: 'growth', description: 'Markets recovering, tech boom starting' },
            2014: { condition: 'divergence', description: 'US recovery, global slowdown' },
            2015: { condition: 'turbulence', description: 'China slowdown, oil collapse' },
            2016: { condition: 'political', description: 'Brexit, Trump election, uncertainty' },
            2017: { condition: 'euphoria', description: 'Everything bubble, crypto mania' },
            2018: { condition: 'correction', description: 'Trade wars, rate hikes, volatility' },
            2019: { condition: 'late-cycle', description: 'Yield curve inverts, repo crisis' },
            2020: { condition: 'pandemic', description: 'COVID crash, unprecedented stimulus' },
            2021: { condition: 'inflation', description: 'Money printer go brrr, everything pumps' },
            2022: { condition: 'tightening', description: 'Rate hikes, inflation fight, crashes' },
            2023: { condition: 'banking-crisis', description: 'Regional banks fail, credit crunch' },
            2024: { condition: 'transition', description: 'New monetary paradigm emerging' },
            2025: { condition: 'new-era', description: 'Digital money dominance, CBDC vs Bitcoin' }
        };
        
        return states[year] || { condition: 'normal', description: 'Economic activity continues' };
    }

    getBitcoinState(year) {
        const states = {
            2005: { exists: false, price: 0, event: 'Pre-Bitcoin world' },
            2006: { exists: false, price: 0, event: 'Cypherpunks discussing digital cash' },
            2007: { exists: false, price: 0, event: 'Financial system showing cracks' },
            2008: { exists: false, price: 0, event: 'Satoshi publishes whitepaper (October 31)' },
            2009: { exists: true, price: 0, event: 'Genesis block mined (January 3)' },
            2010: { exists: true, price: 0.08, event: '10,000 BTC pizza transaction' },
            2011: { exists: true, price: 1, event: 'Bitcoin reaches parity with USD' },
            2012: { exists: true, price: 13, event: 'First halving occurs' },
            2013: { exists: true, price: 1000, event: 'First major bubble, Mt. Gox collapse' },
            2014: { exists: true, price: 300, event: 'Bear market, building continues' },
            2015: { exists: true, price: 430, event: 'Ethereum launches, ecosystem expands' },
            2016: { exists: true, price: 960, event: 'Second halving, slow recovery' },
            2017: { exists: true, price: 19800, event: 'Mainstream FOMO, ICO bubble' },
            2018: { exists: true, price: 3700, event: 'Crypto winter begins' },
            2019: { exists: true, price: 7200, event: 'Institutional interest growing' },
            2020: { exists: true, price: 28900, event: 'Corporate treasury adoption begins' },
            2021: { exists: true, price: 69000, event: 'El Salvador adoption, ATH' },
            2022: { exists: true, price: 16500, event: 'FTX collapse, contagion' },
            2023: { exists: true, price: 42000, event: 'Banking crisis drives adoption' },
            2024: { exists: true, price: 65000, event: 'ETF approval, halving' },
            2025: { exists: true, price: 150000, event: 'Hyperbitcoinization accelerates' }
        };
        
        return states[year];
    }

    // ============================================================================
    // PLAYER OPTIONS & DECISIONS
    // ============================================================================

    generateOptions(year, event) {
        const options = [];
        const bitcoinState = this.getBitcoinState(year);
        
        // Pre-Bitcoin era (2005-2008)
        if (year <= 2008) {
            options.push(
                { id: 'save_fiat', label: 'Keep money in savings account', risk: 'low' },
                { id: 'buy_stocks', label: 'Invest in stock market', risk: 'medium' },
                { id: 'buy_house', label: 'Buy real estate', risk: 'high' },
                { id: 'buy_gold', label: 'Buy physical gold', risk: 'low' }
            );
            
            if (year === 2008 && event.whitepaper) {
                options.push({
                    id: 'read_whitepaper',
                    label: 'Read mysterious "Bitcoin" whitepaper',
                    risk: 'unknown',
                    special: true
                });
            }
        }
        
        // Bitcoin exists
        if (bitcoinState.exists && year >= 2009) {
            // Basic Bitcoin options
            options.push(
                { id: 'buy_bitcoin', label: `Buy Bitcoin ($${bitcoinState.price})`, risk: 'very high' },
                { id: 'hold', label: 'Hold current portfolio', risk: 'low' }
            );
            
            // Mining option (early years)
            if (year <= 2012) {
                options.push({
                    id: 'mine_bitcoin',
                    label: 'Mine Bitcoin on laptop',
                    risk: 'medium',
                    special: true
                });
            }
            
            // Custody options (2013 - Mt. Gox warning signs appear)
            if (year === 2013 && this.player.portfolio.bitcoin > 0 && !this.player.inSelfCustody) {
                options.push({
                    id: 'self_custody',
                    label: 'Move Bitcoin to self-custody (Mt. Gox having issues)',
                    risk: 'low',
                    knowledge: 'technical',
                    special: true
                });
                options.push({
                    id: 'keep_on_exchange',
                    label: 'Keep Bitcoin on Mt. Gox (convenient)',
                    risk: 'medium',
                    warning: true
                });
            }

            // Post-Mt. Gox custody options
            if (year >= 2014 && this.player.portfolio.bitcoin > 0 && !this.player.inSelfCustody) {
                options.push({
                    id: 'self_custody',
                    label: 'Move Bitcoin to self-custody',
                    risk: 'low',
                    knowledge: 'technical'
                });
            }
            
            // DCA option
            if (year >= 2015) {
                options.push({
                    id: 'dca_bitcoin',
                    label: 'Start Dollar Cost Averaging into Bitcoin',
                    risk: 'medium'
                });
            }
            
            // Take profits option
            if (this.player.portfolio.bitcoin > 0 && bitcoinState.price > 10000) {
                options.push({
                    id: 'take_profits',
                    label: 'Take some profits',
                    risk: 'low'
                });
            }
            
            // Shitcoin/ICO options (2017)
            if (year === 2017) {
                options.push({
                    id: 'buy_icos',
                    label: 'Chase ICO gains',
                    risk: 'extreme',
                    warning: true
                });
            }
            
            // Leverage option (2019+)
            if (year >= 2019) {
                options.push({
                    id: 'leverage_trade',
                    label: 'Trade Bitcoin with leverage',
                    risk: 'extreme',
                    warning: true
                });
            }
            
            // Lightning Network (2021+)
            if (year >= 2021) {
                options.push({
                    id: 'lightning_node',
                    label: 'Run Lightning node',
                    risk: 'medium',
                    knowledge: 'technical'
                });
            }
            
            // Mt. Gox recovery (2024-2025) - Creditors receive some Bitcoin back
            if ((year === 2024 || year === 2025) && this.player.portfolio.bitcoinLostMtGox > 0) {
                options.push({
                    id: 'mtgox_recovery',
                    label: `Claim Mt. Gox recovery (${(this.player.portfolio.bitcoinLostMtGox * 0.15).toFixed(4)} BTC available)`,
                    risk: 'none',
                    special: true
                });
            }

            // CBDC vs Bitcoin choice (2025)
            if (year === 2025) {
                options.push(
                    { id: 'choose_cbdc', label: 'Use government CBDC', risk: 'low', sovereignty: -10 },
                    { id: 'choose_bitcoin', label: 'Choose Bitcoin sovereignty', risk: 'medium', sovereignty: 10 },
                    { id: 'hybrid', label: 'Use both systems', risk: 'medium', sovereignty: 0 }
                );
            }
        }
        
        // Education options (context-aware)
        if (year <= 2007) {
            options.push(
                { id: 'educate', label: 'Study economics and monetary history', risk: 'none', knowledge: true }
            );
        } else if (year === 2008) {
            options.push(
                { id: 'educate', label: 'Study the financial crisis causes', risk: 'none', knowledge: true },
                { id: 'research_digital_money', label: 'Research digital money concepts', risk: 'none', knowledge: true }
            );
        } else if (year >= 2009) {
            options.push(
                { id: 'educate', label: 'Study economics and Bitcoin', risk: 'none', knowledge: true }
            );
        }
        
        return options;
    }

    async makeDecision(optionId, amount = null) {
        const year = this.currentYear;
        const option = this.findOption(optionId);
        const bitcoinPrice = this.getBitcoinState(year).price;
        
        // Record decision
        this.player.decisions.push({
            year,
            option: optionId,
            amount,
            price: bitcoinPrice,
            timestamp: new Date().toISOString()
        });
        
        // Process the decision
        const result = await this.processDecision(option, amount);
        
        // Update knowledge if educational
        if (option.knowledge) {
            this.updateKnowledge(option);
        }
        
        // Check for achievements
        this.checkAchievements();
        
        // Generate outcome narrative
        const narrative = this.generateNarrative(option, result);
        
        // Get Socratic reflection
        const reflection = this.socraticTutor.getReflection(option, result, this.player);
        
        return {
            result,
            narrative,
            reflection,
            portfolio: this.player.portfolio,
            knowledge: this.player.knowledge,
            nextYear: this.currentYear < this.endYear
        };
    }

    async processDecision(option, amount) {
        const results = {
            success: false,
            impact: {},
            lesson: ''
        };
        
        switch(option.id) {
            case 'buy_bitcoin':
                results.impact = this.buyBitcoin(amount);
                results.success = true;
                results.lesson = 'You took the orange pill';
                break;
                
            case 'mine_bitcoin':
                results.impact = this.mineBitcoin();
                results.success = true;
                results.lesson = 'Early mining was accessible to anyone';
                break;
                
            case 'self_custody':
                results.impact = this.selfCustody();
                results.success = true;
                results.lesson = 'Get your Bitcoin off exchanges';
                break;

            case 'keep_on_exchange':
                results.impact = this.keepOnExchange();
                results.success = true;
                results.lesson = 'Convenience has hidden costs...';
                break;

            case 'mtgox_recovery':
                results.impact = this.mtgoxRecovery();
                results.success = true;
                results.lesson = '10 years later, some Bitcoin returns';
                break;
                
            case 'buy_stocks':
                results.impact = this.buyStocks(amount);
                results.success = true;
                results.lesson = 'Traditional markets have their place';
                break;
                
            case 'buy_gold':
                results.impact = this.buyGold(amount);
                results.success = true;
                results.lesson = 'Gold: 5000 years of monetary history';
                break;
                
            case 'buy_house':
                results.impact = this.buyRealEstate(amount);
                results.success = true;
                results.lesson = 'Real estate: the traditional wealth builder';
                break;
                
            case 'buy_icos':
                results.impact = this.buyICOs(amount);
                results.success = false;
                results.lesson = '99% of ICOs went to zero';
                break;
                
            case 'leverage_trade':
                results.impact = this.leverageTrade(amount);
                results.success = Math.random() > 0.8; // 80% lose
                results.lesson = 'Leverage is a double-edged sword';
                break;
                
            case 'educate':
                results.impact = this.educate();
                results.success = true;
                results.lesson = 'Knowledge is the best investment';
                break;
                
            case 'research_digital_money':
                results.impact = this.researchDigitalMoney();
                results.success = true;
                results.lesson = 'Preparing for the future of money';
                break;
                
            case 'read_whitepaper':
                results.impact = this.readWhitepaper();
                results.success = true;
                results.lesson = 'You discovered something revolutionary';
                break;
                
            case 'choose_bitcoin':
                results.impact = this.chooseBitcoin();
                results.success = true;
                results.lesson = 'Sovereignty has a price worth paying';
                break;
                
            case 'choose_cbdc':
                results.impact = this.chooseCBDC();
                results.success = true;
                results.lesson = 'Convenience at the cost of freedom';
                break;
                
            default:
                results.impact = { change: 0 };
                results.success = true;
                results.lesson = 'Sometimes doing nothing is the best action';
        }
        
        return results;
    }

    // ============================================================================
    // PORTFOLIO MANAGEMENT
    // ============================================================================

    buyBitcoin(amount) {
        const price = this.getBitcoinState(this.currentYear).price;
        if (price === 0) price = 0.001; // Early days pricing

        const maxAmount = Math.min(amount || this.player.portfolio.fiat * 0.1, this.player.portfolio.fiat);
        const btcAmount = maxAmount / price;

        this.player.portfolio.fiat -= maxAmount;

        // Before 2014, Bitcoin typically stays on exchanges (Mt. Gox era)
        if (this.currentYear <= 2013 && !this.player.inSelfCustody) {
            this.player.portfolio.bitcoinOnExchange += btcAmount;
        } else {
            this.player.portfolio.bitcoin += btcAmount;
        }

        return {
            spent: maxAmount,
            acquired: btcAmount,
            price: price
        };
    }

    mineBitcoin() {
        // Early mining simulation
        let minedBTC = 0;
        
        if (this.currentYear === 2009) minedBTC = 50; // Full block reward!
        else if (this.currentYear === 2010) minedBTC = 10;
        else if (this.currentYear === 2011) minedBTC = 2;
        else if (this.currentYear === 2012) minedBTC = 0.5;
        
        this.player.portfolio.bitcoin += minedBTC;
        
        return {
            mined: minedBTC,
            difficulty: this.currentYear - 2008
        };
    }

    selfCustody() {
        // Move Bitcoin from exchange to self-custody
        const totalBTC = this.player.portfolio.bitcoin + this.player.portfolio.bitcoinOnExchange;

        this.player.portfolio.bitcoin = totalBTC;
        this.player.portfolio.bitcoinOnExchange = 0;
        this.player.inSelfCustody = true;

        // Protects from exchange hacks
        this.player.achievements.push('Self Sovereign');
        this.player.knowledge.sovereignty += 10;

        return {
            protected: totalBTC,
            security: 'maximum'
        };
    }

    keepOnExchange() {
        // Player chooses convenience over security
        // Bitcoin stays on bitcoinOnExchange
        return {
            onExchange: this.player.portfolio.bitcoinOnExchange,
            warning: 'Trusting third parties with your Bitcoin...'
        };
    }

    mtgoxRecovery() {
        // Mt. Gox creditors received approximately 15% back in 2024
        const recoveredBTC = this.player.portfolio.bitcoinLostMtGox * 0.15;

        this.player.portfolio.bitcoin += recoveredBTC;
        this.player.portfolio.bitcoinLostMtGox -= recoveredBTC;

        return {
            recovered: recoveredBTC,
            stillLost: this.player.portfolio.bitcoinLostMtGox,
            message: 'After 10 years, you received 15% of your lost Bitcoin back'
        };
    }

    buyStocks(amount) {
        const maxAmount = Math.min(amount || this.player.portfolio.fiat * 0.2, this.player.portfolio.fiat);
        
        this.player.portfolio.fiat -= maxAmount;
        this.player.portfolio.stocks += maxAmount;
        
        // Apply market conditions
        const economicState = this.getEconomicState(this.currentYear);
        if (economicState.condition === 'crisis') {
            this.player.portfolio.stocks *= 0.5; // 50% crash
        } else if (economicState.condition === 'euphoria') {
            this.player.portfolio.stocks *= 1.3; // 30% gain
        }
        
        return {
            invested: maxAmount,
            value: this.player.portfolio.stocks
        };
    }

    buyGold(amount) {
        const maxAmount = Math.min(amount || this.player.portfolio.fiat * 0.15, this.player.portfolio.fiat);
        const goldPrice = this.globalEconomy.goldPrice || 1800;
        const ounces = maxAmount / goldPrice;
        
        this.player.portfolio.fiat -= maxAmount;
        this.player.portfolio.gold += ounces;
        
        return {
            spent: maxAmount,
            ounces: ounces,
            price: goldPrice
        };
    }

    buyRealEstate(amount) {
        const maxAmount = Math.min(amount || this.player.portfolio.fiat * 0.5, this.player.portfolio.fiat);
        
        // Check if it's the housing bubble
        if (this.currentYear >= 2005 && this.currentYear <= 2007) {
            // Bubble prices
            this.player.portfolio.realestate += maxAmount * 1.5;
        } else if (this.currentYear === 2008 || this.currentYear === 2009) {
            // Crash
            this.player.portfolio.realestate *= 0.6;
        } else {
            this.player.portfolio.realestate += maxAmount;
        }
        
        this.player.portfolio.fiat -= maxAmount;
        
        return {
            invested: maxAmount,
            value: this.player.portfolio.realestate
        };
    }

    buyICOs(amount) {
        const maxAmount = Math.min(amount || this.player.portfolio.fiat * 0.05, this.player.portfolio.fiat);
        
        this.player.portfolio.fiat -= maxAmount;
        // 95% chance of total loss
        if (Math.random() > 0.95) {
            this.player.portfolio.fiat += maxAmount * 10; // Lucky 10x
        }
        // Otherwise money is gone
        
        return {
            gambled: maxAmount,
            result: 'probably rekt'
        };
    }

    leverageTrade(amount) {
        const maxAmount = Math.min(amount || this.player.portfolio.bitcoin * 0.1, this.player.portfolio.bitcoin);
        
        if (Math.random() > 0.8) {
            // Win
            this.player.portfolio.bitcoin += maxAmount;
            return { result: 'profit', gained: maxAmount };
        } else {
            // Liquidated
            this.player.portfolio.bitcoin -= maxAmount;
            return { result: 'liquidated', lost: maxAmount };
        }
    }

    educate() {
        const year = this.currentYear;
        
        if (year < 2009) {
            // Before Bitcoin exists, can't study Bitcoin
            this.player.knowledge.economic += 10;
            this.player.knowledge.sovereignty += 2;
            
            return {
                learned: 'Economic principles and monetary history',
                wisdom: '+10 Economics'
            };
        } else {
            // After Bitcoin exists
            this.player.knowledge.economic += 5;
            this.player.knowledge.bitcoin += 10;
            this.player.knowledge.technical += 3;
            
            return {
                learned: 'The nature of money and Bitcoin',
                wisdom: '+10 Bitcoin knowledge'
            };
        }
    }
    
    researchDigitalMoney() {
        // Special option for 2008 - preparing for Bitcoin
        this.player.knowledge.technical += 5;
        this.player.knowledge.sovereignty += 5;
        
        return {
            learned: 'Cryptography and digital cash concepts',
            wisdom: 'You are prepared for what comes next'
        };
    }
    
    readWhitepaper() {
        // Reading Satoshi's whitepaper in 2008
        this.player.knowledge.bitcoin += 15;
        this.player.knowledge.technical += 10;
        this.player.knowledge.sovereignty += 10;
        this.player.achievements.push('Whitepaper Reader');
        
        return {
            learned: 'A Peer-to-Peer Electronic Cash System',
            wisdom: 'You understand the revolution before it begins'
        };
    }

    chooseBitcoin() {
        this.player.knowledge.sovereignty = 100;
        this.player.achievements.push('Sovereign Individual');
        
        return {
            freedom: 'maximum',
            sovereignty: 'achieved'
        };
    }

    chooseCBDC() {
        this.player.knowledge.sovereignty = 0;
        
        return {
            convenience: 'maximum',
            privacy: 'none'
        };
    }

    // ============================================================================
    // KNOWLEDGE & ACHIEVEMENTS
    // ============================================================================

    updateKnowledge(option) {
        if (option.knowledge === true) {
            this.player.knowledge.economic += 5;
            this.player.knowledge.bitcoin += 5;
        } else if (option.knowledge === 'technical') {
            this.player.knowledge.technical += 10;
        }
    }

    checkAchievements() {
        const achievements = [];
        
        // Early adopter
        if (this.player.portfolio.bitcoin > 0 && this.currentYear <= 2012) {
            achievements.push('Early Adopter');
        }
        
        // Diamond hands
        if (this.player.decisions.filter(d => d.option === 'hold').length > 5) {
            achievements.push('Diamond Hands');
        }
        
        // Whole coiner
        if (this.player.portfolio.bitcoin >= 1) {
            achievements.push('Whole Coiner');
        }
        
        // Survivor (made it through multiple crashes)
        const crashes = [2008, 2013, 2018, 2022];
        if (crashes.filter(year => this.player.decisions.some(d => d.year === year)).length >= 3) {
            achievements.push('Crash Survivor');
        }
        
        // Sovereign
        if (this.player.knowledge.sovereignty >= 50) {
            achievements.push('Sovereign Thinker');
        }
        
        // Scholar
        if (this.player.knowledge.bitcoin >= 50 && this.player.knowledge.economic >= 50) {
            achievements.push('Bitcoin Scholar');
        }
        
        // Add new achievements
        achievements.forEach(a => {
            if (!this.player.achievements.includes(a)) {
                this.player.achievements.push(a);
            }
        });
    }

    // ============================================================================
    // NARRATIVE GENERATION
    // ============================================================================

    generateNarrative(option, result) {
        const year = this.currentYear;
        const narratives = {
            2008: "The financial system is collapsing around you. Banks are failing, people are losing their homes, and trust in institutions is evaporating. In this chaos, a mysterious figure named Satoshi Nakamoto publishes a whitepaper describing a peer-to-peer electronic cash system...",
            
            2009: "Bitcoin is born. The genesis block is mined with a message: 'Chancellor on brink of second bailout for banks.' While the world focuses on recovery, a small group of cypherpunks begins experimenting with this new form of money...",
            
            2010: "Laszlo Hanyecz buys two pizzas for 10,000 BTC. People laugh at the 'stupid' purchase. Those pizzas would be worth hundreds of millions in the future. This moment proves Bitcoin has value - someone accepted it for real goods...",
            
            2013: "Bitcoin reaches $1,000 for the first time! But Mt. Gox, handling 70% of all Bitcoin transactions, suddenly halts withdrawals. The exchange collapses, taking 850,000 BTC with it. The lesson is harsh: get your Bitcoin off exchanges...",
            
            2017: "Euphoria grips the market. Everyone's talking about Bitcoin at Thanksgiving dinner. ICOs promise to disrupt everything. Your taxi driver is giving crypto tips. The price touches $20,000. Is this adoption or mania?",
            
            2020: "March 12: Bitcoin crashes 50% in 24 hours as COVID panic grips the world. But then something unprecedented happens - central banks print more money in 3 months than in the previous decade. Corporations start buying Bitcoin as a treasury asset...",
            
            2021: "El Salvador makes Bitcoin legal tender. Tesla buys $1.5 billion. The price hits $69,000. Inflation is no longer 'transitory.' The money printer has consequences, and people are waking up...",
            
            2022: "Terra Luna collapses. Three Arrows Capital implodes. FTX - the 'responsible' exchange - turns out to be a fraud. Contagion spreads. But notice: Bitcoin the network never stops. Every 10 minutes, a new block...",
            
            2025: "The future has arrived. Central Bank Digital Currencies are here, offering convenience but demanding compliance. Bitcoin offers freedom but requires responsibility. The choice is yours: which money will you use?"
        };
        
        const defaultNarrative = `The year is ${year}. ${result.lesson}. Your decision shapes your future...`;
        
        return narratives[year] || defaultNarrative;
    }

    findOption(optionId) {
        const options = this.generateOptions(this.currentYear, this.timeline.getEvent(this.currentYear));
        return options.find(o => o.id === optionId) || { id: optionId };
    }

    generateNewsHeadlines(year) {
        const headlines = {
            2005: ["Housing Prices Hit New Records", "Greenspan: 'Froth' in Housing Market", "Subprime Mortgages Booming"],
            2006: ["Home Prices Can Only Go Up", "New Financial Instruments Create Wealth", "Risk? What Risk?"],
            2007: ["Bear Stearns Funds Collapse", "Subprime Crisis Contained - Bernanke", "Northern Rock Bank Run"],
            2008: ["Lehman Brothers Bankrupt", "AIG Bailout: $85 Billion", "Bitcoin: A Peer-to-Peer Electronic Cash System Published"],
            2009: ["Quantitative Easing Begins", "Bitcoin Network Launches", "Unemployment Hits 10%"],
            2010: ["Flash Crash: Dow Drops 1000 Points in Minutes", "Greece Bailout", "Bitcoin Pizza Day: 10,000 BTC for 2 Pizzas"],
            2011: ["US Credit Rating Downgraded", "Occupy Wall Street Begins", "Bitcoin Reaches Dollar Parity"],
            2012: ["European Debt Crisis Deepens", "Facebook IPO Flops", "Bitcoin Halving: Reward Drops to 25 BTC"],
            2013: ["Cyprus Bank Bail-ins", "Bitcoin Hits $1,000", "Mt. Gox Halts Withdrawals"],
            2014: ["Mt. Gox Bankrupt: 850,000 BTC Lost", "Oil Prices Collapse", "Microsoft Accepts Bitcoin"],
            2015: ["Greek Capital Controls", "China Stock Market Crash", "Ethereum Launches"],
            2016: ["Brexit Vote Shocks Markets", "Trump Elected President", "Bitcoin Halving #2"],
            2017: ["Bitcoin Hits $20,000", "ICO Mania Grips Market", "CME Launches Bitcoin Futures"],
            2018: ["Crypto Winter Begins", "Bitcoin Falls to $3,200", "Hash War: BCH Splits"],
            2019: ["Repo Market Crisis", "Libra Announced", "Bitcoin Hash Rate ATH"],
            2020: ["COVID Crash: Bitcoin -50%", "Money Printer Go Brrrr", "MicroStrategy Buys Bitcoin"],
            2021: ["Tesla Buys Bitcoin", "El Salvador Bitcoin Legal Tender", "Bitcoin Hits $69,000"],
            2022: ["Luna Collapse: $60B Lost", "FTX Bankrupt", "Bitcoin Mining Difficulty ATH Despite Price"],
            2023: ["Silicon Valley Bank Collapses", "Credit Suisse Rescued", "Bitcoin ETF Applications Surge"],
            2024: ["Bitcoin ETF Approved", "Halving #4: 3.125 BTC Reward", "Nation States Accumulating"],
            2025: ["CBDCs Launch Globally", "Bitcoin Surpasses Gold Market Cap", "The Great Monetary Reset"]
        };
        
        return headlines[year] || ["History Continues to Unfold..."];
    }

    getYearMetrics(year) {
        // Connect to CheckOnChain metrics if available
        if (this.historicalMetrics[year]) {
            return this.historicalMetrics[year];
        }
        
        // Simulated metrics
        return {
            mvrv: this.calculateMVRV(year),
            nupl: this.calculateNUPL(year),
            hashrate: this.getHashrate(year),
            adoption: this.getAdoption(year)
        };
    }

    calculateMVRV(year) {
        const mvrv = {
            2009: 1.0, 2010: 1.2, 2011: 2.5, 2012: 1.8, 2013: 5.2,
            2014: 1.1, 2015: 1.3, 2016: 1.6, 2017: 4.8, 2018: 0.8,
            2019: 1.4, 2020: 1.9, 2021: 3.2, 2022: 0.9, 2023: 1.5,
            2024: 2.1, 2025: 2.8
        };
        return mvrv[year] || 1.0;
    }

    calculateNUPL(year) {
        const nupl = {
            2009: 0, 2010: 0.1, 2011: 0.4, 2012: 0.3, 2013: 0.8,
            2014: 0.1, 2015: 0.2, 2016: 0.35, 2017: 0.75, 2018: -0.2,
            2019: 0.25, 2020: 0.4, 2021: 0.65, 2022: -0.1, 2023: 0.3,
            2024: 0.5, 2025: 0.6
        };
        return nupl[year] || 0;
    }

    getHashrate(year) {
        const hashrate = {
            2009: '0.001 MH/s', 2010: '0.01 GH/s', 2011: '1 TH/s', 
            2012: '10 TH/s', 2013: '1 PH/s', 2014: '100 PH/s',
            2015: '300 PH/s', 2016: '1 EH/s', 2017: '5 EH/s',
            2018: '30 EH/s', 2019: '80 EH/s', 2020: '120 EH/s',
            2021: '180 EH/s', 2022: '250 EH/s', 2023: '400 EH/s',
            2024: '500 EH/s', 2025: '600 EH/s'
        };
        return hashrate[year] || 'Unknown';
    }

    getAdoption(year) {
        const adoption = {
            2009: '< 1,000 users', 2010: '~10,000 users', 2011: '~100,000 users',
            2012: '~500,000 users', 2013: '~2 million users', 2014: '~5 million users',
            2015: '~10 million users', 2016: '~20 million users', 2017: '~50 million users',
            2018: '~35 million users', 2019: '~60 million users', 2020: '~100 million users',
            2021: '~200 million users', 2022: '~300 million users', 2023: '~400 million users',
            2024: '~500 million users', 2025: '~1 billion users'
        };
        return adoption[year] || 'Growing';
    }

    // ============================================================================
    // GAME COMPLETION & ASSESSMENT
    // ============================================================================

    async completeGame() {
        const finalAssessment = this.assessor.generateFinalReport(this.player, this.currentYear);
        
        // Calculate final portfolio value
        const bitcoinPrice = this.getBitcoinState(2025).price;
        const goldPrice = 2500; // 2025 gold price estimate
        
        const totalValue = 
            this.player.portfolio.fiat +
            (this.player.portfolio.bitcoin * bitcoinPrice) +
            (this.player.portfolio.gold * goldPrice) +
            this.player.portfolio.stocks +
            this.player.portfolio.realestate;
        
        // Generate performance metrics
        const performance = {
            totalReturn: ((totalValue - 10000) / 10000 * 100).toFixed(2) + '%',
            bitcoinAllocation: ((this.player.portfolio.bitcoin * bitcoinPrice) / totalValue * 100).toFixed(2) + '%',
            survivalScore: this.calculateSurvivalScore(),
            knowledgeScore: this.calculateKnowledgeScore(),
            sovereigntyScore: this.player.knowledge.sovereignty
        };
        
        // Historical comparison
        const comparison = {
            vsSP500: this.compareToSP500(totalValue),
            vsGold: this.compareToGold(totalValue),
            vsBitcoinMaxi: this.compareToBitcoinMaxi(),
            vsNoCoiner: totalValue / 10000
        };
        
        // Socratic final reflection
        const finalReflection = this.socraticTutor.getFinalReflection(
            this.player,
            performance,
            comparison
        );
        
        return {
            player: this.player,
            finalValue: totalValue,
            performance,
            comparison,
            achievements: this.player.achievements,
            decisions: this.player.decisions,
            reflection: finalReflection,
            grade: this.calculateGrade(totalValue, performance),
            certificate: this.generateCertificate()
        };
    }

    calculateSurvivalScore() {
        const crashes = [2008, 2013, 2018, 2022];
        const survived = crashes.filter(year => 
            this.player.decisions.some(d => 
                d.year === year && d.option !== 'panic_sell'
            )
        ).length;
        return (survived / crashes.length) * 100;
    }

    calculateKnowledgeScore() {
        const total = 
            this.player.knowledge.economic +
            this.player.knowledge.bitcoin +
            this.player.knowledge.technical +
            this.player.knowledge.sovereignty;
        return Math.min(100, total);
    }

    compareToSP500(finalValue) {
        // S&P 500 roughly 4x from 2005 to 2025
        const sp500Return = 10000 * 4;
        return ((finalValue / sp500Return - 1) * 100).toFixed(2) + '%';
    }

    compareToGold(finalValue) {
        // Gold roughly 3x from 2005 to 2025
        const goldReturn = 10000 * 3;
        return ((finalValue / goldReturn - 1) * 100).toFixed(2) + '%';
    }

    compareToBitcoinMaxi() {
        // If someone bought Bitcoin in 2009 and held
        const maxiValue = (10000 / 0.001) * 150000; // Bought at $0.001, sold at $150k
        return maxiValue;
    }

    calculateGrade(totalValue, performance) {
        let score = 0;
        
        // Wealth multiplier (40 points)
        if (totalValue > 1000000) score += 40;
        else if (totalValue > 100000) score += 30;
        else if (totalValue > 50000) score += 20;
        else if (totalValue > 20000) score += 10;
        
        // Knowledge (30 points)
        score += (performance.knowledgeScore / 100) * 30;
        
        // Sovereignty (20 points)
        score += (performance.sovereigntyScore / 100) * 20;
        
        // Survival (10 points)
        score += (performance.survivalScore / 100) * 10;
        
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }

    generateCertificate() {
        return {
            title: 'Bitcoin SOVEREIGN Journey Complete',
            player: this.player.name,
            startYear: 2005,
            endYear: 2025,
            achievements: this.player.achievements,
            grade: this.calculateGrade(),
            date: new Date().toISOString(),
            message: 'You have experienced 20 years of economic history and Bitcoin evolution.'
        };
    }
}

// ============================================================================
// SUPPORTING CLASSES
// ============================================================================

class TimelineEvents {
    constructor() {
        this.events = this.loadEvents();
    }
    
    loadEvents() {
        return {
            2005: { 
                title: "Housing Bubble Inflating",
                description: "Easy credit everywhere, home prices soaring",
                bitcoin: false
            },
            2006: {
                title: "Peak Euphoria",
                description: "Everyone's getting rich on paper",
                bitcoin: false
            },
            2007: {
                title: "Cracks Appearing",
                description: "Subprime mortgages failing, Bear Stearns funds collapse",
                bitcoin: false
            },
            2008: {
                title: "Global Financial Crisis",
                description: "Lehman collapses, banks bailed out",
                bitcoin: false,
                whitepaper: true,
                special: "Satoshi publishes Bitcoin whitepaper Oct 31"
            },
            2009: {
                title: "Bitcoin Genesis",
                description: "Genesis block mined January 3",
                bitcoin: true,
                special: "Chancellor on brink of second bailout for banks"
            },
            2010: {
                title: "Pizza Day",
                description: "10,000 BTC for two pizzas",
                bitcoin: true
            },
            2011: {
                title: "Dollar Parity",
                description: "Bitcoin reaches $1 USD",
                bitcoin: true
            },
            2012: {
                title: "First Halving",
                description: "Block reward drops to 25 BTC",
                bitcoin: true
            },
            2013: {
                title: "First Bubble & Mt. Gox",
                description: "BTC hits $1000, then Mt. Gox collapses",
                bitcoin: true,
                crash: true
            },
            2014: {
                title: "Bitcoin Winter",
                description: "Long bear market, building continues",
                bitcoin: true
            },
            2015: {
                title: "Ethereum & Innovation",
                description: "Smart contracts and new possibilities",
                bitcoin: true
            },
            2016: {
                title: "Second Halving",
                description: "Block reward drops to 12.5 BTC",
                bitcoin: true
            },
            2017: {
                title: "Mainstream FOMO",
                description: "Bitcoin hits $20,000, ICO mania",
                bitcoin: true,
                bubble: true
            },
            2018: {
                title: "Crypto Winter Returns",
                description: "Bitcoin falls to $3,200",
                bitcoin: true,
                crash: true
            },
            2019: {
                title: "Institutional Interest",
                description: "Slowly building momentum",
                bitcoin: true
            },
            2020: {
                title: "Money Printer Go Brrrr",
                description: "COVID crash, then unprecedented stimulus",
                bitcoin: true,
                special: "Corporate treasury adoption begins"
            },
            2021: {
                title: "Nation State Adoption",
                description: "El Salvador makes Bitcoin legal tender",
                bitcoin: true,
                ath: true
            },
            2022: {
                title: "Contagion & Collapse",
                description: "FTX fraud exposed, contagion spreads",
                bitcoin: true,
                crash: true
            },
            2023: {
                title: "Banking Crisis 2.0",
                description: "Regional banks fail, Bitcoin remains",
                bitcoin: true
            },
            2024: {
                title: "ETF Era & Fourth Halving",
                description: "Institutional floodgates open",
                bitcoin: true,
                halving: true
            },
            2025: {
                title: "The Choice",
                description: "CBDCs vs Bitcoin - choose your money",
                bitcoin: true,
                special: "The future of money is decided"
            }
        };
    }
    
    getEvent(year) {
        return this.events[year] || { title: "Time passes...", description: "The world continues to turn" };
    }
    
    getSimulatedMetrics() {
        // Return simulated historical metrics if CheckOnChain not available
        return {};
    }
}

class SocraticTutor {
    getQuestion(year, event) {
        const questions = {
            2005: "If everyone believes house prices can only go up, what could possibly go wrong?",
            2006: "When everyone is getting rich, who's left to buy at higher prices?",
            2007: "If banks are so smart, why do they need to package and sell their loans?",
            2008: "Why do banks get rescued, but homeowners lose everything?",
            2009: "What if money didn't require trust in any institution?",
            2010: "If someone accepts Bitcoin for pizza, does that make it real money?",
            2011: "What gives something value - utility, scarcity, or belief?",
            2012: "If supply decreases while demand stays constant, what happens to price?",
            2013: "What's the difference between holding Bitcoin on an exchange vs holding cash in a bank?",
            2014: "Why do the best investments feel the worst to hold?",
            2015: "Is innovation always good, or can it distract from what works?",
            2016: "How does decreasing supply inflation affect long-term value?",
            2017: "How do you know when enthusiasm becomes euphoria?",
            2018: "If the price falls but the network grows stronger, which matters more?",
            2019: "Why might institutions be interested in 'magic internet money'?",
            2020: "When money supply expands rapidly, where does value flow?",
            2021: "What does it mean when a country adopts Bitcoin as legal tender?",
            2022: "If centralized exchanges can fail, what's the alternative?",
            2023: "When banks fail but Bitcoin continues, what does that tell you?",
            2024: "How do ETFs change Bitcoin from rebellion to allocation?",
            2025: "If you must choose between convenience and sovereignty, which matters more?"
        };
        
        return questions[year] || "What have you learned?";
    }
    
    getReflection(option, result, player) {
        const reflections = {
            buy_bitcoin: "You chose to exit the traditional system. Time will tell if you're early or wrong.",
            mine_bitcoin: "You saw opportunity where others saw worthless computation. The best investments often look like toys.",
            self_custody: "You learned the most important lesson: get your Bitcoin off exchanges.",
            buy_stocks: "Traditional markets have centuries of history. But is past performance indicative of future results?",
            buy_gold: "5000 years of monetary history. But can analog money survive in a digital world?",
            educate: "The best investment is in yourself. Knowledge compounds forever.",
            hold: "Sometimes the hardest thing to do is nothing. Patience is a superpower.",
            leverage_trade: "Leverage is picking up pennies in front of a steamroller. Was the risk worth it?"
        };
        
        return reflections[option.id] || "Every choice teaches us something about ourselves.";
    }
    
    getFinalReflection(player, performance, comparison) {
        let reflection = "Your journey through 20 years of economic history is complete.\n\n";
        
        if (performance.sovereigntyScore > 75) {
            reflection += "You achieved true sovereignty - the ability to transact without permission. ";
        } else if (performance.sovereigntyScore > 50) {
            reflection += "You learned the value of sovereignty, even if you didn't fully embrace it. ";
        } else {
            reflection += "You chose convenience over sovereignty. Every choice has trade-offs. ";
        }
        
        if (player.portfolio.bitcoin > 1) {
            reflection += "You became a whole coiner - a rare achievement that few will ever attain. ";
        }
        
        if (performance.survivalScore > 75) {
            reflection += "You survived multiple crashes without panic. Diamond hands are forged in fear. ";
        }
        
        reflection += "\n\nThe question isn't whether you got rich. ";
        reflection += "The question is: did you understand what was happening, and why Bitcoin exists? ";
        reflection += "\n\nIn the end, Bitcoin is not about number go up. ";
        reflection += "It's about freedom go up.";
        
        return reflection;
    }
}

class EconomicSimulator {
    simulateMarketConditions(year, economy) {
        // Simulate realistic market conditions based on historical events
        return economy;
    }
}

class ProgressAssessor {
    generateFinalReport(player, endYear) {
        return {
            timeline: `${2025 - 2005} years experienced`,
            decisions: player.decisions.length,
            knowledge: player.knowledge,
            achievements: player.achievements
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitcoinSovereignGame;
}

if (typeof window !== 'undefined') {
    window.BitcoinSovereignGame = BitcoinSovereignGame;
    // Keep backward compatibility temporarily
    window.BitcoinSTAXGame = BitcoinSovereignGame;
}
