/**
 * FEE CALCULATOR
 * Calculate and compare transaction fees across different address formats
 */

class FeeCalculator {
    constructor() {
        // Transaction sizes in vBytes for different address formats
        this.txSizes = {
            legacy: 230,      // P2PKH input + P2PKH output
            p2sh: 170,        // P2SH-P2WPKH input + output (nested SegWit)
            segwit: 141,      // Native SegWit P2WPKH
            taproot: 110      // Taproot key path spend (most efficient)
        };

        // Fee savings percentages compared to Legacy
        this.savings = {
            legacy: 0,
            p2sh: 26,
            segwit: 39,
            taproot: 52
        };
    }

    /**
     * Calculate fee for a single transaction
     * @param {string} format - Address format (legacy, p2sh, segwit, taproot)
     * @param {number} feeRate - Fee rate in sats/vByte
     * @returns {number} Total fee in satoshis
     */
    calculateSingleTxFee(format, feeRate) {
        const txSize = this.txSizes[format];
        return Math.floor(txSize * feeRate);
    }

    /**
     * Calculate annual fees for multiple transactions
     * @param {string} format - Address format
     * @param {number} feeRate - Fee rate in sats/vByte
     * @param {number} txCount - Number of transactions per year
     * @returns {number} Total annual fees in satoshis
     */
    calculateAnnualFees(format, feeRate, txCount) {
        const singleTxFee = this.calculateSingleTxFee(format, feeRate);
        return singleTxFee * txCount;
    }

    /**
     * Convert satoshis to USD
     * @param {number} sats - Amount in satoshis
     * @param {number} btcPrice - Bitcoin price in USD
     * @returns {number} Amount in USD
     */
    satsToUSD(sats, btcPrice) {
        const btc = sats / 100000000;
        return btc * btcPrice;
    }

    /**
     * Calculate fee comparison for all formats
     * @param {number} feeRate - Fee rate in sats/vByte
     * @param {number} txCount - Number of transactions
     * @param {number} btcPrice - Bitcoin price in USD
     * @returns {Object} Comparison data for all formats
     */
    calculateComparison(feeRate, txCount, btcPrice) {
        const results = {};

        for (const format of ['legacy', 'p2sh', 'segwit', 'taproot']) {
            const annualSats = this.calculateAnnualFees(format, feeRate, txCount);
            const annualUSD = this.satsToUSD(annualSats, btcPrice);

            const legacySats = this.calculateAnnualFees('legacy', feeRate, txCount);
            const legacyUSD = this.satsToUSD(legacySats, btcPrice);

            const savingsSats = legacySats - annualSats;
            const savingsUSD = legacyUSD - annualUSD;
            const savingsPercent = ((savingsSats / legacySats) * 100).toFixed(0);

            results[format] = {
                feeSats: annualSats,
                feeUSD: annualUSD,
                savingsSats: savingsSats,
                savingsUSD: savingsUSD,
                savingsPercent: savingsPercent,
                txSize: this.txSizes[format]
            };
        }

        return results;
    }

    /**
     * Format satoshis with commas
     */
    formatSats(sats) {
        return Math.floor(sats).toLocaleString();
    }

    /**
     * Format USD with $ and commas
     */
    formatUSD(usd) {
        return '$' + Math.floor(usd).toLocaleString();
    }

    /**
     * Get transaction size for format
     */
    getTxSize(format) {
        return this.txSizes[format];
    }

    /**
     * Calculate savings percentage vs legacy
     */
    getSavingsPercent(format) {
        return this.savings[format];
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeeCalculator;
}
