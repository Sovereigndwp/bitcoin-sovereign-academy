/**
 * CheckOnChain Comprehensive Metrics Integration
 * Complete suite of advanced on-chain analytics for Bitcoin Sovereign Academy
 * Based on charts.checkonchain.com metrics
 */

class CheckOnChainMetrics {
    constructor() {
        this.name = 'CheckOnChain Analytics Suite';
        this.description = 'Complete on-chain intelligence from CheckOnChain';
        this.lastUpdate = null;
        this.cache = new Map();
        this.refreshInterval = 60000; // 1 minute
        
        this.initializeMetrics();
    }

    initializeMetrics() {
        // Start real-time data fetching
        this.startDataSync();
        
        // Initialize all metric categories
        this.metrics = {
            pricingModels: new PricingModels(),
            profitLoss: new ProfitLossMetrics(),
            networkStats: new NetworkStats(),
            supplyDynamics: new SupplyDynamics(),
            miningMetrics: new MiningMetrics(),
            technicalIndicators: new TechnicalIndicators(),
            cointimeEconomics: new CointimeEconomics(),
            derivatives: new DerivativesMetrics(),
            capitalFlows: new CapitalFlows(),
            marketStructure: new MarketStructure()
        };
    }

    async startDataSync() {
        // Initial fetch
        await this.fetchAllMetrics();
        
        // Set up periodic updates
        setInterval(() => this.fetchAllMetrics(), this.refreshInterval);
    }

    async fetchAllMetrics() {
        console.log('Fetching comprehensive CheckOnChain metrics...');
        
        try {
            const metrics = await Promise.all([
                this.fetchPricingModels(),
                this.fetchProfitLossMetrics(),
                this.fetchNetworkStats(),
                this.fetchSupplyDynamics(),
                this.fetchMiningMetrics(),
                this.fetchTechnicalIndicators(),
                this.fetchCointimeEconomics(),
                this.fetchDerivatives(),
                this.fetchCapitalFlows(),
                this.fetchMarketStructure()
            ]);
            
            this.lastUpdate = new Date().toISOString();
            this.updateCache(metrics);
            
            return this.formatMetricsResponse(metrics);
        } catch (error) {
            console.error('Error fetching CheckOnChain metrics:', error);
            return this.getCachedMetrics();
        }
    }

    updateCache(metrics) {
        metrics.forEach((metricSet, index) => {
            const key = Object.keys(this.metrics)[index];
            this.cache.set(key, {
                data: metricSet,
                timestamp: Date.now()
            });
        });
    }

    getCachedMetrics() {
        const cached = {};
        this.cache.forEach((value, key) => {
            cached[key] = value.data;
        });
        return cached;
    }

    formatMetricsResponse(metrics) {
        return {
            timestamp: this.lastUpdate,
            status: 'success',
            data: {
                pricingModels: metrics[0],
                profitLoss: metrics[1],
                networkStats: metrics[2],
                supplyDynamics: metrics[3],
                miningMetrics: metrics[4],
                technicalIndicators: metrics[5],
                cointimeEconomics: metrics[6],
                derivatives: metrics[7],
                capitalFlows: metrics[8],
                marketStructure: metrics[9]
            },
            summary: this.generateSummary(metrics)
        };
    }

    generateSummary(metrics) {
        // Generate executive summary from all metrics
        return {
            marketPhase: this.determineMarketPhase(metrics),
            riskLevel: this.calculateRiskLevel(metrics),
            opportunities: this.identifyOpportunities(metrics),
            warnings: this.generateWarnings(metrics),
            recommendations: this.generateRecommendations(metrics)
        };
    }

    // ============================================================================
    // PRICING MODELS
    // ============================================================================

    async fetchPricingModels() {
        // Simulate fetching real data - in production, connect to actual APIs
        return {
            realizedPrice: {
                value: 23456,
                change24h: 2.3,
                trend: 'ascending'
            },
            mvrv: {
                ratio: 2.15,
                zscore: 0.8,
                percentile: 73,
                momentum: {
                    sth: 1.45,
                    lth: 2.89
                }
            },
            mayerMultiple: {
                value: 1.23,
                ma200: 38500,
                threshold: {
                    oversold: 0.8,
                    overbought: 2.4
                }
            },
            nvtPrice: {
                model: 45600,
                signal: 'neutral',
                ratio: 89,
                adjusted: 92
            },
            piCycle: {
                top111dma: 42000,
                top350dma: 38000,
                crossed: false,
                daysUntilCross: 'N/A'
            },
            investorTool: {
                lower: 28000,
                upper: 95000,
                position: 0.42
            }
        };
    }

    // ============================================================================
    // PROFIT/LOSS METRICS
    // ============================================================================

    async fetchProfitLossMetrics() {
        return {
            netRealizedProfitLoss: {
                usd: {
                    daily: 1250000000,
                    weekly: 8750000000,
                    monthly: 37500000000
                },
                btc: {
                    daily: 31250,
                    weekly: 218750,
                    monthly: 937500
                },
                ratio: 0.15
            },
            sopr: {
                value: 1.04,
                adjusted: 1.02,
                sthSopr: 0.98,
                lthSopr: 1.15,
                trend: 'recovering'
            },
            nupl: {
                network: 0.45,
                byEntity: {
                    sth: 0.12,
                    lth: 0.67,
                    miners: 0.89
                }
            },
            sellSideRisk: {
                ratio: 0.00023,
                percentile: 45,
                risk: 'moderate'
            },
            realizedLiquidity: {
                cycle: 'mid',
                phase: 'accumulation',
                strength: 0.67
            }
        };
    }

    // ============================================================================
    // NETWORK STATISTICS
    // ============================================================================

    async fetchNetworkStats() {
        return {
            activeAddresses: {
                count: 950000,
                momentum: 1.12,
                ma30: 920000,
                growth: '3.2%'
            },
            transactionCount: {
                daily: 350000,
                momentum: 1.08,
                avgSize: 450,
                avgFee: 15
            },
            exchangeFlow: {
                inflow: {
                    btc: 12500,
                    usd: 500000000,
                    momentum: 0.95
                },
                outflow: {
                    btc: 15800,
                    usd: 632000000,
                    momentum: 1.15
                },
                netFlow: -3300,
                signal: 'accumulation'
            },
            coindaysDestroyed: {
                value: 125000000,
                momentum: 0.87,
                dormancy: 450,
                significance: 'moderate'
            },
            addressCohorts: {
                shrimp: 2500000,
                crab: 500000,
                octopus: 150000,
                fish: 50000,
                dolphin: 15000,
                shark: 3500,
                whale: 2100,
                humpback: 350
            },
            feeRevenue: {
                btc: {
                    daily: 45,
                    weekly: 315,
                    monthly: 1350
                },
                usd: {
                    daily: 1800000,
                    weekly: 12600000,
                    monthly: 54000000
                },
                zscore: 0.45,
                ribbon: 'neutral'
            },
            transferVolume: {
                btc: {
                    daily: 450000,
                    weekly: 3150000,
                    monthly: 13500000
                },
                usd: {
                    daily: 18000000000,
                    weekly: 126000000000,
                    monthly: 540000000000
                }
            }
        };
    }

    // ============================================================================
    // SUPPLY DYNAMICS
    // ============================================================================

    async fetchSupplyDynamics() {
        return {
            circulatingSupply: {
                total: 19750000,
                liquid: 2500000,
                illiquid: 14500000,
                lost: 2750000,
                issuanceRate: 900
            },
            supplyAge: {
                older1yr: {
                    amount: 13500000,
                    percentage: 68.35
                },
                older2yr: {
                    amount: 11200000,
                    percentage: 56.71
                },
                older5yr: {
                    amount: 7800000,
                    percentage: 39.49
                }
            },
            hodlWaves: {
                '1d': 1.2,
                '1w': 2.8,
                '1m': 5.6,
                '3m': 9.2,
                '6m': 15.4,
                '1y': 25.6,
                '2y': 18.9,
                '3y': 12.3,
                '5y': 8.7,
                '7y': 5.8,
                '10y': 4.3
            },
            walletDistribution: {
                '0-0.001': 750000,
                '0.001-0.01': 500000,
                '0.01-0.1': 350000,
                '0.1-1': 250000,
                '1-10': 150000,
                '10-100': 85000,
                '100-1000': 15000,
                '1000-10000': 2100,
                '10000+': 100
            },
            lthSupply: {
                total: 13800000,
                percentage: 69.87,
                netChange30d: 125000,
                netChange365d: 1850000,
                accumulating: true
            },
            sthSupply: {
                total: 5950000,
                percentage: 30.13,
                netChange30d: -125000,
                netChange365d: -1850000
            },
            absorptionRate: {
                '30day': {
                    btc: 45000,
                    usdEquivalent: 1800000000,
                    percentOfIssuance: 166.7
                },
                '365day': {
                    btc: 550000,
                    usdEquivalent: 22000000000,
                    percentOfIssuance: 169.2
                }
            }
        };
    }

    // ============================================================================
    // MINING METRICS
    // ============================================================================

    async fetchMiningMetrics() {
        return {
            difficulty: {
                current: 65000000000000,
                adjustment: {
                    next: '+3.2%',
                    blocksRemaining: 850,
                    estimatedTime: '5d 21h'
                },
                ribbon: {
                    ma30: 63000000000000,
                    ma60: 61000000000000,
                    compression: 0.85
                }
            },
            hashrate: {
                current: 450,
                unit: 'EH/s',
                ma7: 445,
                ma30: 440,
                growth30d: '2.3%'
            },
            hashprice: {
                usdPerTH: 0.065,
                btcPerTH: 0.00000163,
                profitability: 'marginal',
                breakeven: 0.08
            },
            hashRibbons: {
                ma30: 445,
                ma60: 435,
                capitulation: false,
                recovery: true,
                buySignal: false
            },
            miningPulse: {
                value: 1.05,
                trend: 'stable',
                minerRevenue: {
                    daily: 28000000,
                    costBasis: 26000000,
                    margin: '7.1%'
                }
            },
            puellMultiple: {
                value: 0.78,
                ma365: 0.92,
                zone: 'neutral',
                oversold: 0.5,
                overbought: 3.0
            },
            difficultyRegression: {
                price: 42500,
                model: 41800,
                deviation: '1.7%'
            },
            profitableDays: {
                percentage: 94.5,
                streak: 45,
                lastUnprofitable: '2023-11-15'
            }
        };
    }

    // ============================================================================
    // TECHNICAL INDICATORS
    // ============================================================================

    async fetchTechnicalIndicators() {
        return {
            rsi: {
                '14day': 58.5,
                '30day': 62.3,
                zone: 'neutral',
                divergence: 'none'
            },
            macd: {
                macd: 1250,
                signal: 1180,
                histogram: 70,
                trend: 'bullish',
                crossover: false
            },
            stochastic: {
                k: 72.5,
                d: 68.3,
                zone: 'overbought',
                signal: 'hold'
            },
            bollingerBands: {
                upper: 44500,
                middle: 41000,
                lower: 37500,
                width: 7000,
                position: 0.65
            },
            volatility: {
                realized: {
                    '7day': 42.5,
                    '30day': 48.2,
                    '90day': 52.8,
                    '365day': 64.5
                },
                implied: {
                    '7day': 45.0,
                    '30day': 51.5
                },
                premium: 1.07
            },
            priceRange: {
                '7day': {
                    high: 42800,
                    low: 39500,
                    range: 8.35
                },
                '30day': {
                    high: 44200,
                    low: 36800,
                    range: 20.1
                },
                '90day': {
                    high: 48500,
                    low: 34200,
                    range: 41.8
                }
            },
            drawdown: {
                fromATH: -42.3,
                currentDD: -8.5,
                maxDD: -77.8,
                recoveryDays: 125
            },
            performance: {
                daily: 2.3,
                weekly: 5.8,
                monthly: 12.4,
                quarterly: 28.6,
                yearly: 156.8,
                ytd: 89.5
            }
        };
    }

    // ============================================================================
    // COINTIME ECONOMICS
    // ============================================================================

    async fetchCointimeEconomics() {
        return {
            coinblocks: {
                cumulative: 125000000000,
                dailyCreated: 450000,
                dailyDestroyed: 380000,
                net: 70000
            },
            liveliness: {
                value: 0.625,
                trend: 'increasing',
                interpretation: 'accumulation'
            },
            vaultedness: {
                value: 0.375,
                trend: 'decreasing',
                interpretation: 'distribution'
            },
            cointimeMVRV: {
                value: 1.85,
                adjusted: 1.72,
                zone: 'neutral'
            },
            cointimeNUPL: {
                value: 0.42,
                adjusted: 0.38,
                byAge: {
                    '1m': 0.15,
                    '3m': 0.28,
                    '6m': 0.35,
                    '1y': 0.52,
                    '2y': 0.68
                }
            },
            vaultingRate: {
                daily: 12500,
                weekly: 87500,
                monthly: 375000,
                percentage: 1.9
            },
            monetaryVelocity: {
                value: 1.45,
                ma90: 1.52,
                trend: 'slowing'
            },
            activeSupply: {
                mvrv: 1.32,
                percentage: 35.6,
                btc: 7026000
            },
            vaultedSupply: {
                mvrv: 2.15,
                percentage: 64.4,
                btc: 12724000
            },
            avivRatio: {
                value: 0.614,
                interpretation: 'balanced'
            }
        };
    }

    // ============================================================================
    // DERIVATIVES METRICS
    // ============================================================================

    async fetchDerivatives() {
        return {
            fundingRates: {
                perpetual: 0.0085,
                annualized: 9.3,
                weighted: 0.0072,
                exchanges: {
                    binance: 0.0082,
                    bybit: 0.0088,
                    okx: 0.0079,
                    deribit: 0.0091
                }
            },
            openInterest: {
                usd: {
                    total: 15800000000,
                    perpetual: 11200000000,
                    futures: 4600000000
                },
                btc: {
                    total: 395000,
                    perpetual: 280000,
                    futures: 115000
                },
                ratio: 0.02
            },
            futuresVolume: {
                daily: 45000000000,
                weekly: 315000000000,
                dominance: 78.5
            },
            termStructure: {
                spot: 40000,
                '1week': 40050,
                '1month': 40200,
                '3month': 40600,
                '6month': 41200,
                premium: {
                    '1month': 0.5,
                    '3month': 1.5,
                    '6month': 3.0
                }
            },
            liquidations: {
                '24h': {
                    total: 125000000,
                    longs: 75000000,
                    shorts: 50000000
                },
                longDominance: 60,
                cumulative30d: 2850000000,
                largestSingle: 12500000
            },
            optionsMetrics: {
                volume: 850000000,
                openInterest: 6200000000,
                putCallRatio: 0.68,
                maxPain: 38000,
                impliedVolatility: {
                    '1week': 45,
                    '1month': 52,
                    '3month': 58
                }
            }
        };
    }

    // ============================================================================
    // CAPITAL FLOWS
    // ============================================================================

    async fetchCapitalFlows() {
        return {
            realizedCap: {
                value: 456000000000,
                change30d: 12500000000,
                changePercentage: 2.8,
                momentum: 'positive'
            },
            capitalRotation: {
                btcToStables: -2500000000,
                stablesToBtc: 3200000000,
                netFlow: 700000000,
                rotationIndex: 1.28
            },
            liquidityChange: {
                modelA: {
                    capital: 850000000,
                    impact: 1.35
                },
                modelB: {
                    capital: 920000000,
                    impact: 1.42
                },
                modelC: {
                    capital: 780000000,
                    impact: 1.28
                }
            },
            marketCapGained: {
                perDollar: 3.85,
                multiplier: {
                    current: 3.85,
                    '2015avg': 2.1,
                    '2020avg': 3.2,
                    'ftxCrash': 1.8,
                    '2024avg': 4.1
                }
            },
            demandEstimation: {
                daily: 1250000000,
                weekly: 8750000000,
                monthly: 37500000000,
                velocity: 1.45
            }
        };
    }

    // ============================================================================
    // MARKET STRUCTURE
    // ============================================================================

    async fetchMarketStructure() {
        return {
            sellerExhaustion: {
                constant: 0.78,
                threshold: 0.85,
                consecutiveDays: 12,
                signal: 'approaching',
                volatility: 48.5,
                profitSupply: 78.5
            },
            trendingMarket: {
                mvrv: {
                    duration: 145,
                    strength: 'moderate'
                },
                sthMVRV: {
                    duration: 45,
                    strength: 'weak'
                },
                sopr: {
                    duration: 78,
                    strength: 'moderate'
                },
                sthSOPR: {
                    duration: 23,
                    strength: 'weak'
                }
            },
            cyclePosition: {
                phase: 'mid-cycle',
                percentComplete: 48,
                daysInCycle: 850,
                estimatedTop: {
                    days: 920,
                    price: 125000,
                    confidence: 'low'
                }
            },
            extremeOscillators: {
                mvrv: {
                    percentile: 73,
                    extreme: false
                },
                nupl: {
                    percentile: 68,
                    extreme: false
                },
                sopr: {
                    percentile: 45,
                    extreme: false
                }
            },
            correlations: {
                stockMarket: 0.45,
                gold: 0.12,
                dxy: -0.38,
                bonds: -0.25
            }
        };
    }

    // ============================================================================
    // ANALYSIS METHODS
    // ============================================================================

    determineMarketPhase(metrics) {
        const mvrv = metrics[0].mvrv.ratio;
        const nupl = metrics[1].nupl.network;
        const lthSupply = metrics[3].lthSupply.percentage;
        
        if (mvrv < 1 && nupl < 0) return 'capitulation';
        if (mvrv < 1.5 && nupl < 0.25) return 'accumulation';
        if (mvrv < 2.5 && nupl < 0.5) return 'early_bull';
        if (mvrv < 3.5 && nupl < 0.75) return 'bull_market';
        if (mvrv > 3.5 || nupl > 0.75) return 'euphoria';
        
        return 'transitional';
    }

    calculateRiskLevel(metrics) {
        let riskScore = 0;
        const factors = [];
        
        // MVRV Risk
        const mvrv = metrics[0].mvrv.ratio;
        if (mvrv > 3) {
            riskScore += 30;
            factors.push('High MVRV ratio');
        } else if (mvrv > 2.5) {
            riskScore += 20;
            factors.push('Elevated MVRV');
        }
        
        // Exchange Flow Risk
        const netFlow = metrics[2].exchangeFlow.netFlow;
        if (netFlow > 5000) {
            riskScore += 25;
            factors.push('High exchange inflows');
        }
        
        // Funding Rate Risk
        const funding = metrics[7].fundingRates.perpetual;
        if (Math.abs(funding) > 0.02) {
            riskScore += 15;
            factors.push('Extreme funding rates');
        }
        
        // Leverage Risk
        const oiRatio = metrics[7].openInterest.ratio;
        if (oiRatio > 0.03) {
            riskScore += 20;
            factors.push('High leverage in system');
        }
        
        // Mining Risk
        const hashRibbon = metrics[4].hashRibbons.capitulation;
        if (hashRibbon) {
            riskScore += 10;
            factors.push('Miner capitulation');
        }
        
        return {
            score: riskScore,
            level: riskScore > 70 ? 'extreme' : 
                   riskScore > 50 ? 'high' :
                   riskScore > 30 ? 'moderate' : 'low',
            factors
        };
    }

    identifyOpportunities(metrics) {
        const opportunities = [];
        
        // MVRV Opportunity
        if (metrics[0].mvrv.ratio < 1.2) {
            opportunities.push({
                type: 'accumulation',
                signal: 'MVRV below 1.2',
                confidence: 'high'
            });
        }
        
        // Hash Ribbon Buy
        if (metrics[4].hashRibbons.buySignal) {
            opportunities.push({
                type: 'miner_recovery',
                signal: 'Hash Ribbon buy signal',
                confidence: 'high'
            });
        }
        
        // Exchange Outflow
        if (metrics[2].exchangeFlow.netFlow < -5000) {
            opportunities.push({
                type: 'supply_shock',
                signal: 'Large exchange outflows',
                confidence: 'medium'
            });
        }
        
        // Seller Exhaustion
        if (metrics[9].sellerExhaustion.constant > 0.85) {
            opportunities.push({
                type: 'seller_exhaustion',
                signal: 'Sellers exhausted',
                confidence: 'medium'
            });
        }
        
        return opportunities;
    }

    generateWarnings(metrics) {
        const warnings = [];
        
        // Overheated Market
        if (metrics[0].mvrv.ratio > 3) {
            warnings.push({
                level: 'high',
                message: 'MVRV indicates overheated market',
                action: 'Consider taking profits'
            });
        }
        
        // High Leverage
        if (metrics[7].openInterest.ratio > 0.03) {
            warnings.push({
                level: 'medium',
                message: 'Excessive leverage in derivatives',
                action: 'Expect increased volatility'
            });
        }
        
        // Miner Stress
        if (metrics[4].miningPulse.minerRevenue.margin < '5%') {
            warnings.push({
                level: 'medium',
                message: 'Miners under profitability stress',
                action: 'Monitor for selling pressure'
            });
        }
        
        return warnings;
    }

    generateRecommendations(metrics) {
        const recommendations = [];
        const phase = this.determineMarketPhase(metrics);
        
        switch(phase) {
            case 'accumulation':
                recommendations.push('Strategic accumulation zone');
                recommendations.push('DCA strategy recommended');
                break;
            case 'early_bull':
                recommendations.push('Hold positions');
                recommendations.push('Add on dips');
                break;
            case 'bull_market':
                recommendations.push('Trail stop losses');
                recommendations.push('Take partial profits');
                break;
            case 'euphoria':
                recommendations.push('Reduce exposure');
                recommendations.push('Secure profits');
                break;
            case 'capitulation':
                recommendations.push('Prepare dry powder');
                recommendations.push('Wait for exhaustion signals');
                break;
        }
        
        return recommendations;
    }

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    async getMetric(category, metric) {
        const data = this.cache.get(category);
        if (!data || Date.now() - data.timestamp > this.refreshInterval) {
            await this.fetchAllMetrics();
        }
        
        return data?.data[metric];
    }

    async getCustomChart(metrics, timeframe = '30d') {
        // Generate custom chart data based on selected metrics
        return {
            labels: this.generateTimeLabels(timeframe),
            datasets: metrics.map(metric => ({
                label: metric,
                data: this.generateChartData(metric, timeframe),
                borderColor: this.getMetricColor(metric),
                fill: false
            }))
        };
    }

    generateTimeLabels(timeframe) {
        const labels = [];
        const days = parseInt(timeframe);
        const now = new Date();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            labels.push(date.toISOString().split('T')[0]);
        }
        
        return labels;
    }

    generateChartData(metric, timeframe) {
        // In production, fetch historical data
        // For now, generate sample data
        const days = parseInt(timeframe);
        const data = [];
        
        for (let i = 0; i < days; i++) {
            data.push(Math.random() * 100);
        }
        
        return data;
    }

    getMetricColor(metric) {
        const colors = {
            mvrv: '#FF6384',
            nupl: '#36A2EB',
            sopr: '#FFCE56',
            realizedCap: '#4BC0C0',
            hashrate: '#9966FF',
            difficulty: '#FF9F40'
        };
        
        return colors[metric] || '#999999';
    }
}

// Individual Metric Classes

class PricingModels {
    constructor() {
        this.models = [
            'realizedPrice',
            'mvrv',
            'mayerMultiple',
            'nvtPrice',
            'piCycle',
            'investorTool'
        ];
    }
}

class ProfitLossMetrics {
    constructor() {
        this.metrics = [
            'netRealizedProfitLoss',
            'sopr',
            'nupl',
            'sellSideRisk',
            'realizedLiquidity'
        ];
    }
}

class NetworkStats {
    constructor() {
        this.stats = [
            'activeAddresses',
            'transactionCount',
            'exchangeFlow',
            'coindaysDestroyed',
            'addressCohorts',
            'feeRevenue',
            'transferVolume'
        ];
    }
}

class SupplyDynamics {
    constructor() {
        this.dynamics = [
            'circulatingSupply',
            'supplyAge',
            'hodlWaves',
            'walletDistribution',
            'lthSupply',
            'sthSupply',
            'absorptionRate'
        ];
    }
}

class MiningMetrics {
    constructor() {
        this.metrics = [
            'difficulty',
            'hashrate',
            'hashprice',
            'hashRibbons',
            'miningPulse',
            'puellMultiple',
            'difficultyRegression',
            'profitableDays'
        ];
    }
}

class TechnicalIndicators {
    constructor() {
        this.indicators = [
            'rsi',
            'macd',
            'stochastic',
            'bollingerBands',
            'volatility',
            'priceRange',
            'drawdown',
            'performance'
        ];
    }
}

class CointimeEconomics {
    constructor() {
        this.metrics = [
            'coinblocks',
            'liveliness',
            'vaultedness',
            'cointimeMVRV',
            'cointimeNUPL',
            'vaultingRate',
            'monetaryVelocity',
            'activeSupply',
            'vaultedSupply',
            'avivRatio'
        ];
    }
}

class DerivativesMetrics {
    constructor() {
        this.metrics = [
            'fundingRates',
            'openInterest',
            'futuresVolume',
            'termStructure',
            'liquidations',
            'optionsMetrics'
        ];
    }
}

class CapitalFlows {
    constructor() {
        this.flows = [
            'realizedCap',
            'capitalRotation',
            'liquidityChange',
            'marketCapGained',
            'demandEstimation'
        ];
    }
}

class MarketStructure {
    constructor() {
        this.structure = [
            'sellerExhaustion',
            'trendingMarket',
            'cyclePosition',
            'extremeOscillators',
            'correlations'
        ];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckOnChainMetrics;
}

if (typeof window !== 'undefined') {
    window.CheckOnChainMetrics = CheckOnChainMetrics;
}