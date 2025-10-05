# Transaction Simulator - Enhanced User Guide

## Overview

The Transaction Simulator has been completely redesigned to provide a **beginner-friendly, educational experience** for learning how Bitcoin transactions work. Students can now easily select recipients from a dropdown menu, visualize transaction flow, and understand all transaction components.

## New Features

### 1. **Visual Transaction Flow Diagram**

An animated flow showing the complete transaction lifecycle:

```
👤 Your Wallet  →  📬 Alice (Friend)  →  ⛏️ Miners
0.5 BTC available    Native SegWit         Fee: 3,375 sats
```

This visual representation helps students understand:
- **Who is sending** (with balance information)
- **Who is receiving** (with address type)
- **Who processes** the transaction (miners and their fee)

### 2. **Sender Selection Dropdown**

Students can choose from multiple wallet sources:

| Wallet | Balance | Type |
|--------|---------|------|
| Your Wallet | 0.5 BTC | Main wallet |
| Savings | 2.5 BTC | Cold storage |
| Trading | 0.15 BTC | Hot wallet |

**Educational Value:**
- Shows different wallet types and use cases
- Displays available balances
- Demonstrates insufficient balance warnings

### 3. **Recipient Selection Dropdown**

Pre-populated with educational examples covering all Bitcoin address formats:

#### Alice (Friend)
- **Address**: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
- **Type**: Native SegWit (bc1...)
- **Description**: Modern, low-fee address format
- **Education**: Best for everyday transactions

#### Bob (Family)
- **Address**: `3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy`
- **Type**: P2SH (3...)
- **Description**: Common multi-sig address
- **Education**: Used for enhanced security

#### Charlie (Merchant)
- **Address**: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- **Type**: Legacy (1...)
- **Description**: Original Bitcoin address format
- **Education**: Still widely supported, higher fees

#### Diana (Exchange)
- **Address**: `bc1qeklep85ntjz4605drds6aww9u0qr46qzrv5xswd35uhjuj8ahfcqgf6hak`
- **Type**: Taproot (bc1p...)
- **Description**: Newest, most efficient format
- **Education**: Latest innovation in Bitcoin

#### Custom Address
- Allows manual entry of any Bitcoin address
- **Real-time validation**
- **Format detection** (SegWit, P2SH, Legacy, Taproot)
- **Instant feedback** (✅ Valid / ❌ Invalid)

### 4. **Address Information Panel**

Displays detailed information about the selected recipient:

```
Native SegWit (bc1...)
Your friend Alice - Modern, low-fee address

bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

**Educational Elements:**
- Address type classification
- Contextual description
- Full address display
- Copy-friendly formatting

### 5. **Custom Address Validation**

When students select "Custom Address", they get:

#### Real-time Format Detection
- **Native SegWit** (bc1q...): 42-62 characters
- **Taproot** (bc1p...): 62 characters
- **P2SH** (3... or 2...): 34-35 characters
- **Legacy** (1..., m..., n...): 26-35 characters

#### Visual Feedback
```
✅ Valid Native SegWit address
❌ Invalid P2SH format
❌ Unknown address format
```

### 6. **Quick Amount Buttons**

Pre-set amounts for common transactions:
- **0.001 BTC** - Small payment (~$65 at $65k/BTC)
- **0.01 BTC** - Medium payment (~$650)
- **0.1 BTC** - Large payment (~$6,500)

Students can click to instantly populate the amount field.

### 7. **Transaction Priority Selection**

User-friendly fee priority with clear time estimates:

| Priority | Fee Rate | Confirmation Time |
|----------|----------|-------------------|
| ⚡ High Priority | 25 sats/vB | ~10 minutes |
| 📦 Standard | 15 sats/vB | ~30 minutes |
| 💰 Low Priority | 8 sats/vB | ~1 hour |
| ⚙️ Custom | User-defined | Variable |

**Educational Value:**
- Shows fee/time tradeoff
- Explains sats/vByte concept
- Allows experimentation

### 8. **Enhanced Transaction Summary**

Comprehensive breakdown with color-coded results:

```
📊 Transaction Summary

Network Fee:      3,375 sats (0.000034 BTC)  [Orange - Cost]
Total to Send:    0.010034 BTC               [Black - Total]
Change Returned:  0.489966 BTC               [Green - Back to you]
Remaining Balance: 0.489966 BTC              [Blue - After tx]
```

**Smart Validation:**
- ⚠️ **Red warning** if insufficient balance
- Real-time calculation updates
- All values in both BTC and sats

### 9. **Educational Tooltips**

Every field includes contextual help:

```
💡 Choose which wallet to send from
💡 Select who to send Bitcoin to
💡 Quick amounts for common transactions
💡 Size depends on inputs/outputs. Typical: 225 vB
```

### 10. **Educational Tips Panel**

Key learning points displayed prominently:

```
💡 Educational Tips:
• Different address formats have different fee costs
• Native SegWit (bc1...) is cheapest
• Always verify addresses before sending!
```

## What Students Learn

### 1. **Transaction Components**
- **Inputs**: Where the Bitcoin comes from (sender's wallet)
- **Outputs**: Where the Bitcoin goes (recipient + change)
- **Fees**: Payment to miners for processing
- **Size**: Measured in vBytes (virtual bytes)

### 2. **Address Formats**
- **Native SegWit (bc1q...)**: Modern, efficient, low fees
- **Taproot (bc1p...)**: Latest innovation, enhanced privacy
- **P2SH (3...)**: Multi-signature, enhanced security
- **Legacy (1...)**: Original format, higher fees

### 3. **Fee Mechanics**
- Fee = Rate (sats/vB) × Size (vB)
- Higher fee = Faster confirmation
- Different address types = Different sizes
- SegWit addresses = Lower fees

### 4. **Transaction Lifecycle**
1. **Build** transaction with inputs and outputs
2. **Calculate** size based on inputs/outputs
3. **Set** fee rate based on priority
4. **Compute** total cost (amount + fee)
5. **Verify** sufficient balance
6. **Send** to network (in real Bitcoin)

### 5. **Best Practices**
- Always verify recipient address
- Choose appropriate fee for urgency
- Use SegWit for lower fees
- Keep small UTXOs for change
- Monitor mempool congestion

## How It Works

### Sender Selection
```javascript
senderSelect.addEventListener('change', () => {
  const sender = senders[senderIdx];
  // Update balance display
  // Recalculate transaction
  // Check for sufficient funds
});
```

### Recipient Selection
```javascript
recipientSelect.addEventListener('change', () => {
  const recipient = addresses[recipientIdx];
  // Show address information
  // Display address type
  // Update transaction flow visual
});
```

### Custom Address Validation
```javascript
// Detects format based on prefix
if (addr.startsWith('bc1'))  → Native SegWit or Taproot
if (addr.startsWith('3'))     → P2SH
if (addr.startsWith('1'))     → Legacy

// Validates length
bc1q... → 42-62 characters
bc1p... → 62 characters
3...    → 34-35 characters
1...    → 26-35 characters
```

### Fee Calculation
```javascript
feeInSats = feeRate × transactionSize
feeInBTC = feeInSats / 100,000,000

total = amount + feeInBTC
change = senderBalance - total
remaining = senderBalance - amount - feeInBTC
```

## UI/UX Improvements

### Before vs After

#### Before
```
Amount: [____] BTC
Fee rate: [____] sats/vB
Size: [____] vBytes

Network fee: –
Total spend: –
Change output: –
```

#### After
```
👤 Your Wallet → 📬 Alice (Friend) → ⛏️ Miners
   0.5 BTC         Native SegWit      Fee: 3,375 sats

From (Sender):
[Dropdown: Your Wallet - 0.5 BTC (Main wallet) ▼]
💡 Choose which wallet to send from

To (Recipient):
[Dropdown: Alice (Friend) - Native SegWit (bc1...) ▼]
💡 Select who to send Bitcoin to

Native SegWit (bc1...)
Your friend Alice - Modern, low-fee address
bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh

Amount to Send:
[0.01] BTC
[0.001 BTC] [0.01 BTC] [0.1 BTC]
💡 Quick amounts for common transactions

Transaction Priority:
[Dropdown: 📦 Standard - ~30 min (15 sats/vB) ▼]

📊 Transaction Summary
Network Fee:      3,375 sats (0.000034 BTC)
Total to Send:    0.010034 BTC
Change Returned:  0.489966 BTC
Remaining Balance: 0.489966 BTC

💡 Educational Tips:
• Different address formats have different fee costs
• Native SegWit (bc1...) is cheapest
• Always verify addresses before sending!
```

## Educational Features Summary

✅ **Visual transaction flow** - See the complete lifecycle
✅ **Pre-populated recipients** - Learn different address types
✅ **Real-time validation** - Immediate feedback on custom addresses
✅ **Format detection** - Automatic address type identification
✅ **Balance checking** - Prevent insufficient funds errors
✅ **Quick amounts** - Common transaction sizes
✅ **Priority levels** - Understand fee/time tradeoffs
✅ **Comprehensive summary** - All transaction details
✅ **Color-coded feedback** - Visual warnings and success states
✅ **Educational tooltips** - Contextual help everywhere

## Technical Implementation

### File Modified
```
frontend/public/js/simulations.js
```

### Key Changes
- Added sender wallet selection (3 wallets)
- Added recipient address dropdown (4 examples + custom)
- Implemented real-time address validation
- Created visual transaction flow diagram
- Added quick amount buttons
- Implemented priority-based fee selection
- Enhanced transaction summary with 4 metrics
- Added educational tooltips throughout

### Integration
Works seamlessly with existing simulation framework:
```javascript
window.loadSimulation('transaction');
```

## Usage Instructions

### For Students
1. **Choose sender wallet** from dropdown
2. **Select recipient** (or enter custom address)
3. **Set amount** (or use quick buttons)
4. **Choose priority** (High/Standard/Low)
5. **Review summary** before sending
6. **Learn** from educational tooltips

### For Educators
1. **Demonstrate** different address formats
2. **Explain** fee calculation mechanics
3. **Show** balance validation
4. **Discuss** priority tradeoffs
5. **Practice** with safe amounts

## Access

Navigate to: http://localhost:3000/#simulate
Click: "Launch Simulator" under "Transaction Simulator"

---

**Created by**: Dalia
**Date**: October 5, 2025
**Purpose**: Educational Bitcoin transaction simulation
**Target Audience**: Bitcoin students learning transaction mechanics
