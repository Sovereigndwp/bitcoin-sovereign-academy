# Quick Start Guide - Bitcoin Widgets

## 30-Second Setup

### 1. Copy these 3 files to any HTML page:

```html
<link rel="stylesheet" href="/css/widgets.css">
<script src="/js/widgets/api-handler.js"></script>
<script src="/js/widgets/live-market-data.js"></script>
```

### 2. Add a container:

```html
<div id="bitcoin-price"></div>
```

### 3. Initialize:

```html
<script>
    new LiveMarketData({
        container: '#bitcoin-price',
        view: 'full'
    });
</script>
```

**Done!** You now have live Bitcoin price displaying on your page.

---

## Common Use Cases

### Navigation Bar
```html
<nav>
    <div class="logo">Your Site</div>
    <div id="nav-price"></div>
</nav>

<script>
    new LiveMarketData({
        container: '#nav-price',
        view: 'minimal'
    });
</script>
```

### Sidebar Widget
```html
<aside>
    <h3>Market Stats</h3>
    <div id="sidebar-stats"></div>
</aside>

<script>
    new LiveMarketData({
        container: '#sidebar-stats',
        view: 'compact'
    });
</script>
```

### Dashboard
```html
<section class="dashboard">
    <div id="main-stats"></div>
</section>

<script>
    new LiveMarketData({
        container: '#main-stats',
        view: 'full',
        showChange: true,
        showMarketCap: true,
        showVolume: true,
        showDominance: true
    });
</script>
```

---

## View Modes

**Minimal** - Just price and change
```javascript
view: 'minimal'  // $97,850 +2.3%
```

**Compact** - Price with label
```javascript
view: 'compact'  // BTC/USD  $97,850  +2.3%
```

**Full** - Complete statistics
```javascript
view: 'full'     // Price + Market Cap + Volume + Dominance
```

---

## Configuration

```javascript
new LiveMarketData({
    // Required
    container: '#my-widget',

    // Optional
    view: 'full',              // minimal | compact | full
    refreshInterval: 60000,    // milliseconds (1 min)
    showChange: true,          // show 24h price change
    showMarketCap: true,       // show market capitalization
    showVolume: true,          // show 24h volume
    showDominance: true,       // show BTC dominance %

    // Callbacks
    onUpdate: function(data) {
        console.log('Price:', data.price);
    },
    onError: function(error) {
        console.error('Error:', error);
    }
});
```

---

## Methods

```javascript
const widget = new LiveMarketData({...});

widget.refresh();              // Manual refresh
widget.stopAutoRefresh();      // Stop auto-updates
widget.startAutoRefresh();     // Resume auto-updates
widget.getData();              // Get current data
widget.destroy();              // Remove widget
```

---

## Troubleshooting

**Widget not showing?**
1. Check browser console for errors
2. Verify container element exists
3. Ensure scripts loaded in correct order

**API errors?**
- Widgets automatically use fallback data
- Check internet connection
- Enable logging: `enableLogging: true`

**Slow loading?**
- Increase `refreshInterval`
- Use `view: 'minimal'` for better performance
- Share API handler across widgets

---

## Examples

### Share API Handler (Better Performance)
```javascript
const api = new BitcoinAPIHandler();

new LiveMarketData({
    container: '#widget1',
    apiHandler: api
});

new LiveMarketData({
    container: '#widget2',
    apiHandler: api
});
```

### Event Handling
```javascript
new LiveMarketData({
    container: '#price',
    onUpdate: function(data) {
        if (data.price > 100000) {
            alert('Bitcoin over $100k!');
        }
    }
});
```

### Custom Styling
```css
.live-market-data-widget {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
}

.live-market-data-widget .price {
    color: #ffffff;
    font-size: 3rem;
}
```

---

## Files Needed

**Minimum:**
- `/css/widgets.css`
- `/js/widgets/api-handler.js`
- `/js/widgets/live-market-data.js`

**For Testing:**
- `/widget-demo.html` - See all features in action

**Documentation:**
- `/WIDGET_USAGE_GUIDE.md` - Complete reference
- `/RESTRUCTURING_PLAN.md` - Implementation details
- `/RESTRUCTURING_SUMMARY.md` - Project overview

---

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

Requires:
- ES6 support
- Fetch API
- Promises

---

## Next Steps

1. ✅ Try the demo: Open `/widget-demo.html`
2. ✅ Read full docs: `/WIDGET_USAGE_GUIDE.md`
3. ✅ Integrate into your path
4. ✅ Customize styling
5. ✅ Add to more pages

---

## Support

- Full Documentation: `WIDGET_USAGE_GUIDE.md`
- Project Overview: `RESTRUCTURING_SUMMARY.md`
- Implementation Plan: `RESTRUCTURING_PLAN.md`
- Live Demo: `widget-demo.html`

---

**Need Help?**
Enable logging to debug:
```javascript
new LiveMarketData({
    container: '#price',
    enableLogging: true  // See console logs
});
```

---

Happy coding! 🚀₿
