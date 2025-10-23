# Bitcoin Data API Migration Guide

## Overview

The platform now uses a robust, multi-source Bitcoin data fetching system with automatic fallbacks and intelligent caching.

## New System: `bitcoin-data-reliable.js`

### Features

1. **Multiple API Sources with Fallbacks**
   - Price: CoinGecko → Coinbase → CoinDesk → Blockchain.info
   - Block Height: mempool.space → Blockstream → Blockchain.info
   - Mempool: mempool.space → Blockchain.info
   - Fees: mempool.space (primary)
   - Difficulty: mempool.space (primary)

2. **Smart Caching**
   - Price: 30 seconds
   - Block Height: 5 minutes
   - Mempool: 1 minute
   - Fees: 1 minute
   - Difficulty: 10 minutes
   - ATH: 1 hour
   - Historical Data: 24 hours

3. **Graceful Degradation**
   - Automatic fallback to next API source
   - Known fallback values for critical data
   - No "undefined" or "NaN" displayed to users

4. **Rate Limit Protection**
   - Timeout protection (10 seconds)
   - Cached responses prevent excessive API calls
   - Parallel fetching where appropriate

## API Sources

### Primary APIs

#### 1. CoinGecko (Price & Historical Data)
```javascript
// Current Price
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true

// All-Time High
https://api.coingecko.com/api/v3/coins/bitcoin

// Historical Price (DD-MM-YYYY format)
https://api.coingecko.com/api/v3/coins/bitcoin/history?date=09-02-2011
```

**Rate Limits:** 10-50 calls/minute (free tier)  
**Reliability:** ⭐⭐⭐⭐⭐

#### 2. mempool.space (Blockchain Data)
```javascript
// Block Height
https://mempool.space/api/blocks/tip/height

// Mempool Stats
https://mempool.space/api/mempool

// Recommended Fees
https://mempool.space/api/v1/fees/recommended

// Difficulty Adjustment
https://mempool.space/api/v1/difficulty-adjustment
```

**Rate Limits:** Generous (no published limit)  
**Reliability:** ⭐⭐⭐⭐⭐

#### 3. Coinbase (Price Backup)
```javascript
https://api.coinbase.com/v2/prices/BTC-USD/spot
```

**Rate Limits:** 10,000 calls/hour  
**Reliability:** ⭐⭐⭐⭐⭐

#### 4. CoinDesk (Price Backup)
```javascript
https://api.coindesk.com/v1/bpi/currentprice/BTC.json
```

**Rate Limits:** No published limit  
**Reliability:** ⭐⭐⭐⭐

### Backup APIs

#### Blockchain.info
```javascript
// Price
https://blockchain.info/ticker

// Block Height
https://blockchain.info/q/getblockcount

// Mempool Count
https://blockchain.info/q/unconfirmedcount
```

**Rate Limits:** None specified  
**Reliability:** ⭐⭐⭐

#### Blockstream
```javascript
// Block Height
https://blockstream.info/api/blocks/tip/height
```

**Rate Limits:** Generous  
**Reliability:** ⭐⭐⭐⭐

## Data Points Fetched

| Data Point | Primary Source | Fallbacks | Update Frequency |
|------------|----------------|-----------|------------------|
| Current Price | CoinGecko | Coinbase, CoinDesk, Blockchain.info | 30s |
| 24h Price Change | CoinGecko | N/A | 30s |
| All-Time High | CoinGecko | Hardcoded fallback | 1h |
| Block Height | mempool.space | Blockstream, Blockchain.info | 5m |
| Halvings Completed | Calculated from block height | N/A | 5m |
| Days Since Genesis | Calculated locally | N/A | 60s |
| Mempool Count | mempool.space | Blockchain.info | 1m |
| Mempool Size (vsize) | mempool.space | N/A | 1m |
| Fee Estimates | mempool.space | N/A | 1m |
| Difficulty | mempool.space | N/A | 10m |

## Usage

### Auto-Initialization

The service auto-initializes when the page loads:

```html
<script src="js/bitcoin-data-reliable.js"></script>
```

### Manual Access

```javascript
// Access the service
const dataService = window.bitcoinData;

// Get current price
const priceData = await dataService.getPrice();
console.log(priceData.price); // 97234
console.log(priceData.change24h); // 2.5

// Get block height
const height = await dataService.getBlockHeight();
console.log(height); // 870541

// Get mempool data
const mempool = await dataService.getMempoolData();
console.log(mempool.count); // 15234

// Get fee recommendations
const fees = await dataService.getFees();
console.log(fees.fastest); // 25 sat/vB

// Calculate halvings
const halvings = dataService.getHalvingsCompleted(870000);
console.log(halvings); // 4

// Days since genesis
const days = dataService.getDaysSinceGenesis();
console.log(days); // 5773
```

### DOM Updates

The service automatically updates these element IDs:

**Price:**
- `btc-price`
- `bar-btc-price`
- `btc-change` (with positive/negative class)

**Block Height:**
- `block-height`
- `bar-block-height`

**Halvings:**
- `halvings-completed`

**Days:**
- `days-since-genesis`

**Mempool:**
- `mempool-size`
- `bar-mempool-count`

**Fees:**
- `bar-fee-estimate`
- `fee-fastest`
- `fee-hour`
- `fee-economy`

**Difficulty:**
- `bar-difficulty`
- `difficulty`

**ATH:**
- `ath-price`
- `ath-date`

## Migration from Old System

### Before (bitcoin-data-fallback.js)

```javascript
// Manual fetch with try-catch
try {
    const r = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    if (r.ok) {
        const j = await r.json();
        const price = parseFloat(j?.data?.amount);
        document.getElementById('btc-price').textContent = `$${price.toLocaleString()}`;
    }
} catch(e) {
    console.error(e);
}
```

### After (bitcoin-data-reliable.js)

```javascript
// Automatic with multiple fallbacks
// Just include the script - it handles everything
<script src="js/bitcoin-data-reliable.js"></script>
```

## Error Handling

The service handles all errors gracefully:

1. **Timeout Protection**: 10-second timeout on all requests
2. **Automatic Fallback**: Tries next API source if one fails
3. **Cache Fallback**: Returns cached data if all APIs fail
4. **Known Fallbacks**: Uses hardcoded values for critical data (e.g., ATH)
5. **Null Safety**: Never displays undefined/NaN to users

## Console Logging

Monitor data fetching in the browser console:

```
[BitcoinData] BitcoinDataService initialized
[BitcoinData] Price fetched from CoinGecko: $97,234
[BitcoinData] Block height from mempool.space: 870,541
[BitcoinData] Mempool from mempool.space: 15,234 tx
[BitcoinData] Fees: 25 sat/vB (fastest)
[BitcoinData] Difficulty: 109.78T
[BitcoinData] Data update complete
```

## Performance

- **Initial Load**: ~2-3 seconds (parallel fetching)
- **Subsequent Updates**: Instant (cached)
- **Memory Usage**: < 1MB (cache management)
- **Network Traffic**: Minimal (smart caching)

## Troubleshooting

### Price Not Updating

1. Check browser console for errors
2. Verify network connection
3. Check if CoinGecko is accessible
4. Service will fallback to Coinbase/CoinDesk automatically

### Block Height Stuck

1. mempool.space may be down
2. Service will try Blockstream and Blockchain.info
3. Cache will show last known height (max 5 minutes old)

### All Data Showing "—"

1. All API sources may be unreachable
2. Check browser console for specific errors
3. Verify CORS is not blocking requests
4. Consider rate limit hit (unlikely with caching)

## Future Enhancements

- [ ] Add Coin Metrics Community API
- [ ] Implement WebSocket for real-time updates
- [ ] Add market cap data
- [ ] Add hashrate data
- [ ] Add Lightning Network capacity
- [ ] Implement retry backoff strategy
- [ ] Add API health status indicator

## References

- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [mempool.space API Docs](https://mempool.space/docs/api)
- [Coinbase API Docs](https://docs.cloud.coinbase.com/exchange/reference)
- [CoinDesk BPI](https://www.coindesk.com/coindesk-api)
- [Blockchain.info API](https://www.blockchain.com/explorer/api)
- [Blockstream Esplora API](https://github.com/Blockstream/esplora/blob/master/API.md)

## Support

For issues or questions about the Bitcoin data service:
1. Check console logs for error messages
2. Verify API endpoints are accessible
3. Review cache state: `window.bitcoinData.cache`
4. Force refresh: `window.bitcoinData.updateAllData()`

---

**Last Updated:** October 23, 2025  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
