# 🔓 Preview Mode - Investor & Demo Access

## Quick Start

To unlock ALL content across the entire platform, add `?preview=demo2024` to any URL.

### Example URLs:

**For Investor/Demo:**
```
https://yoursite.com/?preview=demo2024
https://yoursite.com/paths/curious/stage-1/module-1.html?preview=demo2024
https://yoursite.com/paths/builder/stage-2/module-3.html?preview=demo2024
```

**Normal Users (with gating):**
```
https://yoursite.com/
https://yoursite.com/paths/curious/stage-1/module-1.html
```

---

## How It Works

1. **Activate Preview Mode:** Add `?preview=demo2024` to any module URL
2. **Session Persists:** Once activated, preview mode stays active for the entire browser session (even when navigating between pages)
3. **Visual Indicator:** A banner appears at the top showing "Preview Mode Active"
4. **Exit Preview:** Click "Exit Preview" button or close the browser tab

---

## Features

✅ **Bypasses all content gates** - Shows complete modules without blur/locks
✅ **Works across all pages** - Navigate freely once activated
✅ **Session-based** - No permanent changes to user's browser
✅ **Visual indicator** - Clear banner shows when preview is active
✅ **Easy to exit** - One-click to return to normal gated experience

---

## Security

- **Secret Key:** The preview key is `demo2024` (defined in `js/module-gate.js` line 7)
- **Change the key:** Edit line 7 in `js/module-gate.js` to use your own secret:
  ```javascript
  const previewKey = 'your-secret-key-here';
  ```
- **Not stored permanently:** Uses `sessionStorage`, so it clears when browser closes
- **Only you control the URL:** Share the preview link only with trusted parties

---

## Use Cases

### 🎯 For Investors
Share: `yoursite.com/?preview=demo2024`
They can explore the entire platform without restrictions.

### 👥 For Demo/Testing
Send the preview link to testers who need to see all content.

### 📧 For Content Review
Share with reviewers, editors, or collaborators who need full access.

---

## Resetting Preview Mode

**Via URL:**
```
yoursite.com/?preview=reset
```

**Via Browser Console:**
```javascript
sessionStorage.removeItem('bsa_preview_mode');
location.reload();
```

**Via Banner:**
Click the "Exit Preview" button in the top banner.

---

## Technical Details

- **File:** `js/module-gate.js`
- **Storage:** `sessionStorage` (key: `bsa_preview_mode`)
- **Preview Key:** `demo2024` (customizable)
- **Activation:** URL parameter `?preview=demo2024`
- **Deactivation:** URL parameter `?preview=reset` or close browser

---

## Changing the Preview Key

For better security, change the default key:

1. Open `js/module-gate.js`
2. Find line 7: `const previewKey = 'demo2024';`
3. Change to your own secret: `const previewKey = 'investor-xyz-2024';`
4. Save and commit
5. Share new URL: `yoursite.com/?preview=investor-xyz-2024`

---

**Last Updated:** 2025-10-11
**Version:** 1.0
