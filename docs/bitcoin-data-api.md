# Bitcoin Data API Integration

## Overview

The Bitcoin Sovereign Academy uses a robust, multi-fallback system for fetching live Bitcoin network data. This ensures that users always see current information even if individual APIs are unavailable.

## Architecture

### Files

- **`js/bitcoin-data-fallback.js`** - Standalone fallback system with multiple API sources
- **`frontend/public/js/bitcoin-data.js`** - MCP-integrated data controller (primary)
- **`frontend/public/js/bitcoin-data-fallback.js`** - Copy of fallback for frontend

### Data Points

1. **Bitcoin Price** - Current BTC/USD exchange rate
2. **Block Height** - Current blockchain height
3. **Mempool Size** - Number of unconfirmed transactions
4. **Fee Estimates** - Recommended transaction fees (sat/vB)

## API Fallback Chain

### Price APIs (in order)
1. **Coinbase** - `api.coinbase.com/v2/prices/BTC-USD/spot`
2. **Blockchain.info** - `blockchain.info/ticker`
3. **CoinGecko** - `api.coingecko.com/api/v3/simple/price`
4. **Kraken** - `api.kraken.com/0/public/Ticker?pair=XBTUSD`

### Block Height APIs (in order)
1. **Mempool.space** - `mempool.space/api/blocks/tip/height`
2. **Blockchain.info** - `blockchain.info/q/getblockcount`
3. **Blockstream** - `blockstream.info/api/blocks/tip/height`

### Mempool APIs (in order)
1. **Mempool.space** - `mempool.space/api/mempool`
2. **Blockchain.info** - `blockchain.info/q/unconfirmedcount`

### Fee Estimate APIs (in order)
1. **Mempool.space** - `mempool.space/api/v1/fees/recommended`
2. **Blockstream** - `blockstream.info/api/fee-estimates`

## Features

### Automatic Failover
- Each data point tries multiple APIs in sequence
- Moves to next API if request fails or times out
- 5-second timeout per API call
- Graceful degradation to "Unavailable" if all APIs fail

### Performance Optimization
- Parallel fetching of all data points using `Promise.all()`
- AbortController for timeout management
- No-cache headers for fresh data
- Efficient error handling

### User Experience
- Loading states during data fetch
- Formatted numbers with proper locale formatting
- Automatic refresh every 60 seconds
- Console logging for debugging

## HTML Elements

The system updates the following DOM elements:

```html
<!-- Price -->
<span id="btc-price">Loading...</span>

<!-- Block Height -->
<span id="block-height">Loading...</span>
<span id="bar-block-height">Loading...</span>

<!-- Mempool -->
<span id="mempool-size">Loading...</span>

<!-- Fees -->
<span id="fee-estimate">Loading...</span>
```

## Usage

### Basic Integration

```html
<script src="js/bitcoin-data-fallback.js"></script>
```

### Manual Refresh

```javascript
// Refresh data programmatically
window.refreshBitcoinData();
```

### Initialization

The script auto-initializes on DOM ready and sets up:
- Initial data fetch
- 60-second refresh interval
- Loading states

## Error Handling

### Network Failures
- Automatically tries next API in chain
- Logs warnings for each failed attempt
- Shows "Unavailable" only after all APIs fail

### Timeout Protection
- 5-second timeout per API request
- AbortController cleans up hanging requests
- No memory leaks from stale connections

### Parse Errors
- Validates data before displaying
- Checks for NaN and negative values
- Falls back to next API on invalid data

## Monitoring

### Console Logging

```javascript
✓ Price fetched from Coinbase: $62,500
✓ Block height fetched from Mempool.space: 868,542
✓ Mempool size fetched from Mempool.space: 2,100
✓ Fee estimate fetched from Mempool.space: 8 sat/vB
```

### Error Messages

```javascript
Coinbase failed: NetworkError
Blockchain.info failed: Timeout
All price APIs failed
```

## Best Practices

### API Selection
- Primary APIs are most reliable and fast
- Fallbacks provide redundancy
- Mix of different providers ensures availability

### Rate Limiting
- 60-second refresh interval respects API limits
- Sequential API calls (not parallel) per data point
- Graceful fallback prevents hammering failed APIs

### Maintenance
- Monitor console for API failures
- Update fallback order based on reliability
- Add new APIs as needed

## Future Improvements

1. **Caching** - Store last successful values in localStorage
2. **Smart Fallback** - Remember which APIs work best
3. **User Preferences** - Allow users to select preferred APIs
4. **WebSocket** - Real-time updates for supported APIs
5. **Difficulty** - Add mining difficulty metric
6. **Hash Rate** - Display network hash rate

## Testing

### Manual Testing

```javascript
// Test individual functions
fetchBitcoinPrice();
fetchBlockHeight();
fetchMempoolData();
fetchFeeEstimate();

// Test full refresh
window.refreshBitcoinData();
```

### Simulating Failures

Use browser DevTools Network tab to:
- Block specific domains
- Simulate slow 3G
- Test timeout behavior

## Contributing

When adding new APIs:

1. Add to appropriate array with name, url, and parse function
2. Test parse function with actual API response
3. Ensure proper error handling
4. Update this documentation
5. Consider rate limits and reliability

## License

Part of Bitcoin Sovereign Academy - Educational use only.
