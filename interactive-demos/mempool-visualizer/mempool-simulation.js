/**
 * MEMPOOL SIMULATION ENGINE
 * Simulates Bitcoin mempool behavior with realistic transaction dynamics
 */

class MempoolSimulation {
    constructor() {
        this.transactions = [];
        this.nextTxId = 1;
        this.blockTimer = 600; // 10 minutes in seconds
        this.blockInterval = null;
        this.scenarioType = 'low'; // low, medium, high, congested
        this.blockCapacity = 4000000; // 4MB in bytes
        this.currentBlockFill = 0;
    }

    /**
     * Generate a random transaction
     */
    generateTransaction(feeRate = null) {
        const txSize = Math.floor(Math.random() * 500) + 200; // 200-700 bytes

        // Fee rate based on scenario if not specified
        if (feeRate === null) {
            feeRate = this.generateFeeRate();
        }

        const totalFee = Math.floor(txSize * feeRate);

        const tx = {
            id: `tx${this.nextTxId++}`,
            size: txSize,
            feeRate: feeRate,
            totalFee: totalFee,
            timestamp: Date.now(),
            priority: this.getPriority(feeRate)
        };

        this.transactions.push(tx);
        return tx;
    }

    /**
     * Generate fee rate based on current scenario
     */
    generateFeeRate() {
        let min, max, distribution;

        switch(this.scenarioType) {
            case 'low':
                // Low demand: mostly 1-5 sat/vB
                min = 1;
                max = 10;
                distribution = 0.3; // Skew toward lower fees
                break;
            case 'medium':
                // Medium demand: 5-30 sat/vB
                min = 5;
                max = 50;
                distribution = 0.5;
                break;
            case 'high':
                // High demand: 20-80 sat/vB
                min = 20;
                max = 100;
                distribution = 0.7;
                break;
            case 'congested':
                // Congested: 50-200 sat/vB
                min = 50;
                max = 200;
                distribution = 0.8;
                break;
            default:
                min = 1;
                max = 50;
                distribution = 0.5;
        }

        // Generate with exponential distribution (more txs at lower fees)
        const random = Math.pow(Math.random(), 1 / distribution);
        const feeRate = Math.floor(min + (max - min) * random);

        return feeRate;
    }

    /**
     * Get priority category from fee rate
     */
    getPriority(feeRate) {
        if (feeRate >= 50) return 'high';
        if (feeRate >= 10) return 'medium';
        return 'low';
    }

    /**
     * Sort transactions by fee rate (highest first)
     */
    sortByFeeRate() {
        return [...this.transactions].sort((a, b) => b.feeRate - a.feeRate);
    }

    /**
     * Simulate mining a block
     */
    mineBlock() {
        const sorted = this.sortByFeeRate();
        const includedTxs = [];
        let blockSize = 0;

        // Fill block with highest-paying transactions
        for (const tx of sorted) {
            if (blockSize + tx.size <= this.blockCapacity) {
                includedTxs.push(tx);
                blockSize += tx.size;

                // Remove from mempool
                const index = this.transactions.findIndex(t => t.id === tx.id);
                if (index > -1) {
                    this.transactions.splice(index, 1);
                }
            }
        }

        const totalFees = includedTxs.reduce((sum, tx) => sum + tx.totalFee, 0);
        const blockReward = 312500000; // 3.125 BTC in sats

        return {
            transactions: includedTxs,
            blockSize: blockSize,
            totalFees: totalFees,
            blockReward: blockReward,
            totalRevenue: blockReward + totalFees,
            fillPercentage: (blockSize / this.blockCapacity * 100).toFixed(1)
        };
    }

    /**
     * Get fee distribution histogram data
     */
    getFeeDistribution() {
        const bins = [
            { min: 0, max: 5, count: 0, label: '0-5' },
            { min: 5, max: 10, count: 0, label: '5-10' },
            { min: 10, max: 20, count: 0, label: '10-20' },
            { min: 20, max: 50, count: 0, label: '20-50' },
            { min: 50, max: 100, count: 0, label: '50-100' },
            { min: 100, max: 1000, count: 0, label: '100+' }
        ];

        this.transactions.forEach(tx => {
            for (const bin of bins) {
                if (tx.feeRate >= bin.min && tx.feeRate < bin.max) {
                    bin.count++;
                    break;
                }
            }
        });

        return bins;
    }

    /**
     * Estimate confirmation time based on fee rate
     */
    estimateConfirmation(feeRate, txSize) {
        const sorted = this.sortByFeeRate();
        const targetTx = { feeRate, size: txSize };

        // Find position in mempool
        let position = 0;
        let bytesAhead = 0;

        for (const tx of sorted) {
            if (tx.feeRate > feeRate) {
                position++;
                bytesAhead += tx.size;
            } else {
                break;
            }
        }

        // Estimate blocks until confirmation
        const blocksUntilConfirmation = Math.ceil(bytesAhead / this.blockCapacity) + 1;
        const minutesEstimate = blocksUntilConfirmation * 10;

        return {
            position,
            bytesAhead,
            blocksUntilConfirmation,
            minutesEstimate,
            percentile: this.transactions.length > 0
                ? ((this.transactions.length - position) / this.transactions.length * 100).toFixed(0)
                : 100
        };
    }

    /**
     * Get recommended fee rates for different urgencies
     */
    getRecommendedFees() {
        if (this.transactions.length === 0) {
            return {
                nextBlock: 1,
                within6Blocks: 1,
                within24Hours: 1
            };
        }

        const sorted = this.sortByFeeRate();

        // Next block: Top 25% of mempool
        const nextBlockIndex = Math.floor(sorted.length * 0.25);
        const nextBlockFee = sorted[nextBlockIndex]?.feeRate || 1;

        // 6 blocks: Top 50%
        const sixBlocksIndex = Math.floor(sorted.length * 0.5);
        const sixBlocksFee = sorted[sixBlocksIndex]?.feeRate || 1;

        // 24 hours: Top 75%
        const twentyFourHoursIndex = Math.floor(sorted.length * 0.75);
        const twentyFourHoursFee = sorted[twentyFourHoursIndex]?.feeRate || 1;

        return {
            nextBlock: Math.max(nextBlockFee, 1),
            within6Blocks: Math.max(sixBlocksFee, 1),
            within24Hours: Math.max(twentyFourHoursFee, 1)
        };
    }

    /**
     * Change network scenario
     */
    setScenario(scenario) {
        this.scenarioType = scenario;

        // Adjust mempool size based on scenario
        const targetSize = {
            'low': 20,
            'medium': 50,
            'high': 100,
            'congested': 200
        }[scenario] || 50;

        // Clear and regenerate mempool
        this.transactions = [];
        for (let i = 0; i < targetSize; i++) {
            this.generateTransaction();
        }
    }

    /**
     * Start block timer
     */
    startBlockTimer(callback) {
        if (this.blockInterval) {
            clearInterval(this.blockInterval);
        }

        this.blockTimer = 600;
        this.blockInterval = setInterval(() => {
            this.blockTimer--;

            if (this.blockTimer <= 0) {
                // Auto-mine block
                const block = this.mineBlock();
                if (callback) callback(block);

                // Add new transactions to mempool
                const newTxCount = Math.floor(Math.random() * 10) + 5;
                for (let i = 0; i < newTxCount; i++) {
                    this.generateTransaction();
                }

                this.blockTimer = 600;
            }

            // Update timer display
            const minutes = Math.floor(this.blockTimer / 60);
            const seconds = this.blockTimer % 60;
            const timerDisplays = document.querySelectorAll('[id^="block-timer"]');
            timerDisplays.forEach(display => {
                display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            });
        }, 1000);
    }

    /**
     * Stop block timer
     */
    stopBlockTimer() {
        if (this.blockInterval) {
            clearInterval(this.blockInterval);
            this.blockInterval = null;
        }
    }

    /**
     * Get mempool statistics
     */
    getStats() {
        return {
            totalTransactions: this.transactions.length,
            totalSize: this.transactions.reduce((sum, tx) => sum + tx.size, 0),
            totalFees: this.transactions.reduce((sum, tx) => sum + tx.totalFee, 0),
            averageFeeRate: this.transactions.length > 0
                ? (this.transactions.reduce((sum, tx) => sum + tx.feeRate, 0) / this.transactions.length).toFixed(2)
                : 0,
            highPriority: this.transactions.filter(tx => tx.priority === 'high').length,
            mediumPriority: this.transactions.filter(tx => tx.priority === 'medium').length,
            lowPriority: this.transactions.filter(tx => tx.priority === 'low').length
        };
    }

    /**
     * Format sats to BTC string
     */
    static formatSats(sats) {
        return (sats / 100000000).toFixed(8) + ' BTC';
    }

    /**
     * Format sats with commas
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MempoolSimulation;
}
