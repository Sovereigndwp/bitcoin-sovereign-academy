/**
 * Simple Bitcoin Data Fetcher
 * Fetches and displays live Bitcoin data in the header bar
 */

(function() {
    'use strict';

    // Simple update function
    async function updateBitcoinData() {
        console.log('[BitcoinData] Fetching data...');

        try {
            // Fetch price
            const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const priceData = await priceResponse.json();
            const price = Math.round(priceData.bitcoin.usd);

            const priceEl = document.getElementById('bar-btc-price');
            if (priceEl) {
                priceEl.textContent = `$${price.toLocaleString()}`;
                console.log('[BitcoinData] Price updated:', price);
            }
        } catch (error) {
            console.error('[BitcoinData] Price fetch failed:', error);
        }

        try {
            // Fetch block height
            const blockResponse = await fetch('https://mempool.space/api/blocks/tip/height');
            const blockHeight = parseInt(await blockResponse.text(), 10);

            const blockEl = document.getElementById('bar-block-height');
            if (blockEl) {
                blockEl.textContent = blockHeight.toLocaleString();
                console.log('[BitcoinData] Block height updated:', blockHeight);
            }
        } catch (error) {
            console.error('[BitcoinData] Block height fetch failed:', error);
        }

        try {
            // Fetch mempool
            const mempoolResponse = await fetch('https://mempool.space/api/mempool');
            const mempoolData = await mempoolResponse.json();

            const mempoolEl = document.getElementById('bar-mempool-count');
            if (mempoolEl) {
                mempoolEl.textContent = `${mempoolData.count.toLocaleString()} tx`;
                console.log('[BitcoinData] Mempool updated:', mempoolData.count);
            }
        } catch (error) {
            console.error('[BitcoinData] Mempool fetch failed:', error);
        }

        try {
            // Fetch fees
            const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended');
            const feesData = await feesResponse.json();

            const feesEl = document.getElementById('bar-fee-estimate');
            if (feesEl) {
                feesEl.textContent = `${feesData.fastestFee} sat/vB`;
                console.log('[BitcoinData] Fees updated:', feesData.fastestFee);
            }
        } catch (error) {
            console.error('[BitcoinData] Fees fetch failed:', error);
        }

        try {
            // Fetch difficulty
            const difficultyResponse = await fetch('https://mempool.space/api/v1/difficulty-adjustment');
            const difficultyData = await difficultyResponse.json();
            const difficultyT = (difficultyData.difficulty / 1e12).toFixed(2);

            const difficultyEl = document.getElementById('bar-difficulty');
            if (difficultyEl) {
                difficultyEl.textContent = `${difficultyT}T`;
                console.log('[BitcoinData] Difficulty updated:', difficultyT);
            }
        } catch (error) {
            console.error('[BitcoinData] Difficulty fetch failed:', error);
        }

        console.log('[BitcoinData] Update complete');
    }

    // Initialize
    function init() {
        console.log('[BitcoinData] Initializing...');

        // Update immediately
        updateBitcoinData();

        // Update every 60 seconds
        setInterval(updateBitcoinData, 60000);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
