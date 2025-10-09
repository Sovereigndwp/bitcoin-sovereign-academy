/**
 * Improved Bitcoin Data Fetching with Multiple Fallbacks
 * Provides robust price and block height fetching with automatic failover
 */

(function() {
    'use strict';

    // Bitcoin Data Fetching with Multiple Fallbacks
    async function fetchBitcoinData() {
        await Promise.all([
            fetchBitcoinPrice(),
            fetchBlockHeight(),
            fetchMempoolData(),
            fetchFeeEstimate()
        ]);
    }

    // Price fetching with multiple API fallbacks
    async function fetchBitcoinPrice() {
        const priceAPIs = [
            {
                name: 'Coinbase',
                url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
                parse: (data) => parseFloat(data?.data?.amount)
            },
            {
                name: 'Blockchain.info',
                url: 'https://blockchain.info/ticker',
                parse: (data) => parseFloat(data?.USD?.last)
            },
            {
                name: 'CoinGecko',
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
                parse: (data) => parseFloat(data?.bitcoin?.usd)
            },
            {
                name: 'Kraken',
                url: 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD',
                parse: (data) => parseFloat(data?.result?.XXBTZUSD?.c?.[0])
            }
        ];

        for (const api of priceAPIs) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(api.url, {
                    cache: 'no-store',
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    const price = api.parse(data);

                    if (!isNaN(price) && price > 0) {
                        updateElement('btc-price', '$' + price.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }));
                        console.log(`✓ Price fetched from ${api.name}: $${price.toLocaleString()}`);
                        return;
                    }
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.warn(`${api.name} failed:`, error.message);
                continue;
            }
        }

        console.error('All price APIs failed');
        updateElement('btc-price', 'Unavailable');
    }

    // Block height fetching with multiple API fallbacks
    async function fetchBlockHeight() {
        const blockAPIs = [
            {
                name: 'Mempool.space',
                url: 'https://mempool.space/api/blocks/tip/height',
                parse: (text) => parseInt(text, 10)
            },
            {
                name: 'Blockchain.info',
                url: 'https://blockchain.info/q/getblockcount',
                parse: (text) => parseInt(text, 10)
            },
            {
                name: 'Blockstream',
                url: 'https://blockstream.info/api/blocks/tip/height',
                parse: (text) => parseInt(text, 10)
            }
        ];

        for (const api of blockAPIs) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(api.url, {
                    cache: 'no-store',
                    headers: { 'Accept': 'text/plain' },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const text = await response.text();
                    const blockHeight = api.parse(text);

                    if (!isNaN(blockHeight) && blockHeight > 0) {
                        const formatted = blockHeight.toLocaleString();
                        updateElement('block-height', formatted);
                        updateElement('bar-block-height', formatted);
                        console.log(`✓ Block height fetched from ${api.name}: ${formatted}`);
                        return;
                    }
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.warn(`${api.name} failed:`, error.message);
                continue;
            }
        }

        console.error('All block height APIs failed');
        updateElement('block-height', 'Unavailable');
        updateElement('bar-block-height', 'Unavailable');
    }

    // Mempool data fetching
    async function fetchMempoolData() {
        const mempoolAPIs = [
            {
                name: 'Mempool.space',
                url: 'https://mempool.space/api/mempool',
                parse: (data) => parseInt(data?.count || 0, 10)
            },
            {
                name: 'Blockchain.info',
                url: 'https://blockchain.info/q/unconfirmedcount',
                parse: (text) => parseInt(text, 10)
            }
        ];

        for (const api of mempoolAPIs) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(api.url, {
                    cache: 'no-store',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const text = await response.text();
                    let size;

                    try {
                        const data = JSON.parse(text);
                        size = api.parse(data);
                    } catch {
                        size = api.parse(text);
                    }

                    if (!isNaN(size) && size >= 0) {
                        updateElement('mempool-size', size.toLocaleString());
                        console.log(`✓ Mempool size fetched from ${api.name}: ${size.toLocaleString()}`);
                        return;
                    }
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.warn(`${api.name} mempool failed:`, error.message);
                continue;
            }
        }

        console.error('All mempool APIs failed');
        updateElement('mempool-size', 'Unavailable');
    }

    // Fee estimate fetching
    async function fetchFeeEstimate() {
        const feeAPIs = [
            {
                name: 'Mempool.space',
                url: 'https://mempool.space/api/v1/fees/recommended',
                parse: (data) => parseInt(data?.fastestFee || data?.halfHourFee || 0, 10)
            },
            {
                name: 'Blockstream',
                url: 'https://blockstream.info/api/fee-estimates',
                parse: (data) => Math.round(parseFloat(data?.['2'] || data?.['3'] || 0))
            }
        ];

        for (const api of feeAPIs) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(api.url, {
                    cache: 'no-store',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    const fee = api.parse(data);

                    if (!isNaN(fee) && fee > 0) {
                        updateElement('fee-estimate', `${fee} sat/vB`);
                        console.log(`✓ Fee estimate fetched from ${api.name}: ${fee} sat/vB`);
                        return;
                    }
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.warn(`${api.name} fee failed:`, error.message);
                continue;
            }
        }

        console.error('All fee estimate APIs failed');
        updateElement('fee-estimate', 'Unavailable');
    }

    // Helper function to update multiple elements with the same ID pattern
    function updateElement(id, value) {
        const elements = document.querySelectorAll(`#${id}, [id="${id}"]`);
        elements.forEach(el => {
            if (el) {
                el.textContent = value;
                el.classList.remove('is-loading');
            }
        });
    }

    // Set initial loading state
    function setLoadingState() {
        const ids = ['btc-price', 'block-height', 'bar-block-height', 'mempool-size', 'fee-estimate'];
        ids.forEach(id => updateElement(id, 'Loading...'));
    }

    // Initialize on page load
    function initializeBitcoinData() {
        setLoadingState();
        fetchBitcoinData();

        // Refresh every 60 seconds
        setInterval(fetchBitcoinData, 60000);

        console.log('✓ Bitcoin data fallback initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBitcoinData);
    } else {
        initializeBitcoinData();
    }

    // Expose API for manual refresh if needed
    window.refreshBitcoinData = fetchBitcoinData;

})();
