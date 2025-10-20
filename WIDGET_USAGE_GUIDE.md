# Bitcoin Widget Components - Usage Guide

## Overview

This guide explains how to use the extracted, reusable Bitcoin data widgets across the platform.

## Quick Start

### 1. Include Dependencies

```html
<!-- Widget Styles -->
<link rel="stylesheet" href="/css/widgets.css">

<!-- Core API Handler -->
<script src="/js/widgets/api-handler.js"></script>

<!-- Specific Widget (example: Live Market Data) -->
<script src="/js/widgets/live-market-data.js"></script>
```

### 2. Add Container Element

```html
<div id="live-market-data"></div>
```

### 3. Initialize Widget

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    const marketWidget = new LiveMarketData({
        container: '#live-market-data',
        view: 'full',
        refreshInterval: 60000
    });
});
</script>
```

---

## Live Market Data Widget

### Purpose
Display real-time Bitcoin price, market cap, 24h volume, and price changes.

### Features
- Three view modes: minimal, compact, full
- Auto-refresh at configurable intervals
- Animated price changes
- Fallback data handling
- Responsive design

### Installation

```html
<div id="bitcoin-price"></div>

<script src="/js/widgets/api-handler.js"></script>
<script src="/js/widgets/live-market-data.js"></script>
<link rel="stylesheet" href="/css/widgets.css">

<script>
const widget = new LiveMarketData({
    container: '#bitcoin-price',
    view: 'full'
});
</script>
```

### Configuration Options

```javascript
{
    container: '#live-market-data',    // CSS selector for container
    view: 'full',                      // 'minimal' | 'compact' | 'full'
    refreshInterval: 60000,            // Refresh rate in milliseconds
    showChange: true,                  // Show 24h price change
    showVolume: true,                  // Show 24h trading volume
    showMarketCap: true,               // Show market capitalization
    showDominance: true,               // Show Bitcoin dominance
    animateChanges: true,              // Animate price updates
    onUpdate: function(data) {},       // Callback on data update
    onError: function(error) {},       // Callback on error
    apiHandler: null,                  // Custom API handler instance
    enableLogging: false               // Enable console logging
}
```

### View Modes

#### Minimal View
Compact display with just price and change percentage.

```javascript
new LiveMarketData({
    container: '#price-minimal',
    view: 'minimal',
    showChange: true
});
```

**Example Output:**
```
$97,850 +2.3%
```

#### Compact View
Price with basic statistics in a compact layout.

```javascript
new LiveMarketData({
    container: '#price-compact',
    view: 'compact',
    showChange: true
});
```

**Example Output:**
```
BTC/USD
$97,850
+2.3%
```

#### Full View
Complete market statistics with all available data.

```javascript
new LiveMarketData({
    container: '#price-full',
    view: 'full',
    showChange: true,
    showMarketCap: true,
    showVolume: true,
    showDominance: true
});
```

**Example Output:**
```
Bitcoin Price
$97,850
▲ +2.34% (24h)

Market Cap: $1.94T
24h Volume: $28.5B
BTC Dominance: 54.2%

Last updated: 2:45:30 PM
```

### Methods

```javascript
// Manual refresh
widget.refresh();

// Stop auto-refresh
widget.stopAutoRefresh();

// Start auto-refresh
widget.startAutoRefresh();

// Update configuration
widget.updateConfig({
    refreshInterval: 30000,
    view: 'compact'
});

// Get current data
const data = widget.getData();

// Destroy widget
widget.destroy();
```

### Events

```javascript
new LiveMarketData({
    container: '#price',
    onUpdate: function(data) {
        console.log('Price updated:', data.price);
        console.log('24h change:', data.change24h);
        console.log('Market cap:', data.marketCap);
    },
    onError: function(error) {
        console.error('Failed to fetch data:', error);
        // Handle error (show notification, etc.)
    }
});
```

---

## API Handler

### Purpose
Centralized Bitcoin API management with caching, rate limiting, and fallback data.

### Features
- Automatic rate limiting
- Request caching
- Retry logic
- Fallback data
- Multiple API endpoint support
- Graceful error handling

### Usage

```javascript
// Create API handler instance
const api = new BitcoinAPIHandler({
    cacheTimeout: 60000,         // Cache duration in ms
    requestTimeout: 10000,       // Request timeout in ms
    maxRetries: 2,               // Number of retry attempts
    rateLimitWindow: 60000,      // Rate limit window in ms
    maxRequestsPerWindow: 30,    // Max requests per window
    enableLogging: true          // Enable console logging
});

// Fetch Bitcoin price
const priceData = await api.getBitcoinPrice();
console.log(priceData.price);          // 97850
console.log(priceData.change24h);      // 2.34
console.log(priceData.marketCap);      // 1940000000000

// Fetch mempool stats
const mempoolData = await api.getMempoolStats();
console.log(mempoolData.count);        // 15432
console.log(mempoolData.totalFee);     // 125000000

// Fetch fee recommendations
const fees = await api.getFeeRecommendations();
console.log(fees.fastest);             // 28 sat/vB
console.log(fees.hour);                // 15 sat/vB
console.log(fees.economy);             // 8 sat/vB

// Fetch block height
const blockData = await api.getBlockHeight();
console.log(blockData.height);         // 870543

// Fetch hash rate
const hashRateData = await api.getHashRate();
console.log(hashRateData.current);     // 450000000000000000000

// Fetch all data at once
const allData = await api.getAllData();
console.log(allData.price);
console.log(allData.mempool);
console.log(allData.fees);
console.log(allData.blockHeight);
console.log(allData.hashRate);
console.log(allData.difficulty);
console.log(allData.fearGreed);
console.log(allData.global);
```

### Cache Management

```javascript
// Clear all cached data
api.clearCache();

// Get cache statistics
const stats = api.getCacheStats();
console.log('Cached items:', stats.cacheSize);
console.log('Rate limits:', stats.rateLimits);
```

### Fallback Data

The API handler automatically falls back to cached or simulated data when:
- API requests fail
- Rate limits are exceeded
- Network is unavailable
- Request times out

All fallback data is marked with `isFallback: true` in the response.

---

## Integration Examples

### Example 1: Add Price to Navigation Bar

```html
<!-- In your navigation/header -->
<nav>
    <div class="logo">Bitcoin Sovereign Academy</div>
    <div id="nav-price"></div>
</nav>

<script src="/js/widgets/api-handler.js"></script>
<script src="/js/widgets/live-market-data.js"></script>
<link rel="stylesheet" href="/css/widgets.css">

<script>
new LiveMarketData({
    container: '#nav-price',
    view: 'minimal',
    refreshInterval: 30000
});
</script>
```

### Example 2: Add Market Dashboard to Sidebar

```html
<aside class="sidebar">
    <h3>Market Overview</h3>
    <div id="market-dashboard"></div>
</aside>

<script>
new LiveMarketData({
    container: '#market-dashboard',
    view: 'full',
    showChange: true,
    showMarketCap: true,
    showVolume: true,
    showDominance: true,
    refreshInterval: 60000
});
</script>
```

### Example 3: Multiple Widgets with Shared API Handler

```html
<div id="header-price"></div>
<div id="footer-stats"></div>

<script>
// Create single API handler instance
const sharedAPI = new BitcoinAPIHandler({
    enableLogging: false
});

// Use same instance for multiple widgets
new LiveMarketData({
    container: '#header-price',
    view: 'minimal',
    apiHandler: sharedAPI
});

new LiveMarketData({
    container: '#footer-stats',
    view: 'compact',
    apiHandler: sharedAPI
});
</script>
```

### Example 4: Custom Styling

```html
<div id="custom-price" class="my-custom-widget"></div>

<style>
.my-custom-widget .live-market-data-widget {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.my-custom-widget .price {
    color: #ffffff;
    font-size: 3rem;
}

.my-custom-widget .change.positive {
    background: rgba(255, 255, 255, 0.2);
    color: #a7f3d0;
}
</style>

<script>
new LiveMarketData({
    container: '#custom-price',
    view: 'compact'
});
</script>
```

### Example 5: React Component Integration

```jsx
import { useEffect, useRef } from 'react';

function BitcoinPrice() {
    const containerRef = useRef(null);
    const widgetRef = useRef(null);

    useEffect(() => {
        // Initialize widget
        widgetRef.current = new LiveMarketData({
            container: containerRef.current,
            view: 'full',
            onUpdate: (data) => {
                console.log('Price updated:', data.price);
            }
        });

        // Cleanup on unmount
        return () => {
            if (widgetRef.current) {
                widgetRef.current.destroy();
            }
        };
    }, []);

    return <div ref={containerRef}></div>;
}
```

---

## Performance Optimization

### 1. Share API Handler Instance

Create one API handler and share it across all widgets to minimize API calls:

```javascript
const globalAPI = new BitcoinAPIHandler();

new LiveMarketData({
    container: '#widget1',
    apiHandler: globalAPI
});

new LiveMarketData({
    container: '#widget2',
    apiHandler: globalAPI
});
```

### 2. Adjust Refresh Intervals

Increase refresh intervals for less critical data:

```javascript
// Critical data (header): refresh every 30 seconds
new LiveMarketData({
    container: '#header',
    refreshInterval: 30000
});

// Secondary data (footer): refresh every 5 minutes
new LiveMarketData({
    container: '#footer',
    refreshInterval: 300000
});
```

### 3. Use Appropriate View Modes

Use minimal/compact views for better performance:

```javascript
// Minimal view for navigation
new LiveMarketData({
    container: '#nav',
    view: 'minimal'
});

// Full view only where needed
new LiveMarketData({
    container: '#dashboard',
    view: 'full'
});
```

### 4. Lazy Loading

Load widgets only when visible:

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            new LiveMarketData({
                container: entry.target,
                view: 'full'
            });
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.querySelector('#market-widget'));
```

---

## Troubleshooting

### Widget Not Displaying

1. Check console for errors
2. Verify container element exists
3. Ensure scripts are loaded in correct order
4. Check CSS is included

```javascript
// Debug mode
new LiveMarketData({
    container: '#price',
    enableLogging: true  // Enable console logging
});
```

### API Errors

The widgets automatically handle API failures with fallback data. Check `isFallback` flag:

```javascript
new LiveMarketData({
    container: '#price',
    onUpdate: (data) => {
        if (data.isFallback) {
            console.warn('Using fallback data');
            // Optionally show warning to user
        }
    }
});
```

### Rate Limiting

If you encounter rate limiting:

1. Increase refresh intervals
2. Share API handler instances
3. Enable caching with longer timeouts

```javascript
const api = new BitcoinAPIHandler({
    cacheTimeout: 120000,        // 2 minutes
    maxRequestsPerWindow: 20     // Reduce requests
});
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- ES6 support
- Fetch API
- Promises

---

## License

MIT License - Free to use in all Bitcoin Sovereign Academy projects.

---

## Support

For issues or questions:
1. Check this guide
2. Review console errors (enable logging)
3. Check network tab for API failures
4. Test with fallback data

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Maintainer**: Bitcoin Sovereign Academy Development Team
