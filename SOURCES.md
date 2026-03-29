# Sources & References

This document lists the verifiable sources behind statistics, data points, and factual claims used across Bitcoin Sovereign Academy. Per our content policy, every quantitative claim must trace to a named, verifiable source.

## How to Use This File

- Before adding a statistic or data point to any page, verify it against a primary source listed here or add a new entry.
- When a claim is added without a source, mark it `[SOURCE NEEDED]` so it can be tracked and verified.
- Update this file whenever new sourced data is added to the platform.

---

## Bitcoin Protocol & Technical Facts

### Bitcoin Whitepaper
**Claim:** Bitcoin was introduced in 2008 by Satoshi Nakamoto  
**Source:** Nakamoto, S. (2008). "Bitcoin: A Peer-to-Peer Electronic Cash System"  
**URL:** https://bitcoin.org/bitcoin.pdf

### Fixed Supply Cap
**Claim:** Bitcoin's total supply is capped at 21 million BTC  
**Source:** Bitcoin Core source — `MAX_MONEY` constant in `src/consensus/amount.h`  
**URL:** https://github.com/bitcoin/bitcoin/blob/master/src/consensus/amount.h

### Block Time
**Claim:** Bitcoin targets a new block every ~10 minutes  
**Source:** Bitcoin Whitepaper, Section 2; Bitcoin Core — `nTargetSpacing = 10 * 60`  
**URL:** https://bitcoin.org/bitcoin.pdf

### Halving Schedule
**Claim:** Bitcoin block reward halves every 210,000 blocks (~every 4 years)  
**Source:** Bitcoin Whitepaper, Section 6; Bitcoin Core source  
**URL:** https://bitcoin.org/bitcoin.pdf

### Genesis Block
**Claim:** The Bitcoin genesis block (block 0) was mined on January 3, 2009  
**Source:** Bitcoin blockchain — Block 0  
**URL:** https://blockstream.info/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f

### Difficulty Adjustment
**Claim:** Bitcoin adjusts mining difficulty every 2,016 blocks (~every 2 weeks)  
**Source:** Bitcoin Whitepaper, Section 4; Bitcoin Core source  
**URL:** https://bitcoin.org/bitcoin.pdf

### Proof of Work
**Claim:** Bitcoin uses SHA-256 proof-of-work to secure the network  
**Source:** Bitcoin Whitepaper, Section 3; Bitcoin Core — `src/crypto/sha256.cpp`  
**URL:** https://bitcoin.org/bitcoin.pdf

---

## Money Supply & Monetary Policy

### U.S. Money Supply (M2)
**Source:** Federal Reserve Bank of St. Louis — M2 Money Stock (M2SL)  
**URL:** https://fred.stlouisfed.org/series/M2SL

### Federal Reserve Balance Sheet
**Source:** Federal Reserve — Factors Affecting Reserve Balances (H.4.1)  
**URL:** https://www.federalreserve.gov/releases/h41/

### U.S. Dollar Purchasing Power
**Source:** Federal Reserve Bank of Minneapolis — Consumer Price Index Calculator  
**URL:** https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator

### Federal Debt
**Source:** U.S. Treasury — Debt to the Penny  
**URL:** https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/

---

## Inflation

### Consumer Price Index (CPI)
**Source:** U.S. Bureau of Labor Statistics (BLS) — Consumer Price Index  
**URL:** https://www.bls.gov/cpi/

### Historical CPI Data
**Source:** Federal Reserve Bank of St. Louis — FRED  
**URL:** https://fred.stlouisfed.org/series/CPIAUCSL

### Hyperinflation Historical Cases
**Source:** Hanke, S. & Krus, N. (2012). "World Hyperinflations." Cato Working Paper.  
**URL:** https://www.cato.org/sites/cato.org/files/pubs/pdf/workingpaper-8.pdf

---

## Banking & Financial History

### History of the Gold Standard
**Source:** Federal Reserve History — "The Gold Standard"  
**URL:** https://www.federalreservehistory.org/essays/gold-standard

### Bretton Woods System
**Source:** Federal Reserve History — "Bretton Woods and the Reconstruction of the International Monetary System"  
**URL:** https://www.federalreservehistory.org/essays/bretton-woods

### Bank Failures
**Source:** FDIC — Failed Bank List  
**URL:** https://www.fdic.gov/bank/individual/failed/banklist.html

### Fractional Reserve Banking
**Source:** Federal Reserve — "Modern Money Mechanics" (Chicago Fed)  
**URL:** https://www.chicagofed.org/publications/moneymuseum/assets/mmm-modern-money-mechanics.pdf

---

## Bitcoin Network Statistics

### Bitcoin Network Hash Rate
**Source:** Mempool.space — Hash Rate & Difficulty  
**URL:** https://mempool.space/graphs/mining/hashrate-difficulty  
**Also:** Blockchain.com — https://www.blockchain.com/explorer/charts/hash-rate

### Bitcoin Node Count
**Source:** Bitnodes — Global Bitcoin Nodes Distribution  
**URL:** https://bitnodes.io/

### Lightning Network Capacity
**Source:** Mempool.space — Lightning Network Explorer  
**URL:** https://mempool.space/lightning  
**Also:** 1ML.com Statistics — https://1ml.com/statistics

### Bitcoin Transaction Volume
**Source:** Mempool.space — Transaction Stats  
**URL:** https://mempool.space/graphs/mempool#1y

---

## Live Data Sources (Used in Platform)

The platform fetches live Bitcoin data from the following APIs with automatic failover (see `js/bitcoin-data-fallback.js`):

| Source | Data Type | URL |
|--------|-----------|-----|
| CoinGecko | Price (USD) | https://api.coingecko.com/api/v3/simple/price |
| Mempool.space | Fees, block height, difficulty, mempool stats | https://mempool.space/api |
| Blockchain.info | Fallback price and network stats | https://blockchain.info/stats |
| Kraken | Fallback price | https://api.kraken.com/0/public/Ticker |

---

## Claims Pending Verification

The following claims appear in content but currently lack primary source citations. These should be verified and sourced before being retained in production pages.

| Claim | Location | Status |
|-------|----------|--------|
| *(None currently flagged)* | — | — |

---

## Adding New Sources

When adding a new stat or data point to any BSA page:

1. Find the primary source (Bitcoin protocol docs, government data, peer-reviewed research, or authoritative organization)
2. Add an entry to this file under the relevant section
3. Link the source URL directly in the HTML where the stat appears, or add a footnote
4. If no reliable primary source exists, remove the specific number and replace with a qualitative statement
5. For Bitcoin protocol facts, prefer the Bitcoin Whitepaper and Bitcoin Core source code as primary sources
6. Do not use secondary sources (news articles, blog posts) as the sole citation for a quantitative claim
