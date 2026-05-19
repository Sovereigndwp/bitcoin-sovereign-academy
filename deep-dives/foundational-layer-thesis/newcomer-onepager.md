# Bitcoin Newcomer One-Pager

### Read this first if you've never used Bitcoin. The background you need before the deep dive.

*The Sovereign Academy · May 2026*

---

## If you're brand new

The Bitcoin Sovereign Academy site is designed for self-directed learners. Before reading this deep dive, you'll get more value if you start with one of our learning paths:

- **[Curious Path](https://bitcoinsovereign.academy/paths/curious/)** — for "I keep hearing about Bitcoin and want to understand it." Plain-English entry point. Start here if you've never owned BTC.
- **[Sovereign Path](https://bitcoinsovereign.academy/paths/sovereign/)** — for "I want to take control of my money." Self-custody focused.
- **[Builder Path](https://bitcoinsovereign.academy/paths/builder/)** — for "I want to build on Bitcoin." Developer track.
- **[All seven paths →](https://bitcoinsovereign.academy/#find-your-path)** — use the "Find Your Path" widget on the homepage.

Once you've worked through Stage 1 of at least one path, come back to this deep dive.

If you're already familiar with Bitcoin basics, you can stay here. This page gives you the eight concepts the deep dive assumes you understand.

---

## The eight concepts

### 1. Bitcoin (BTC)

A digital asset with a fixed supply cap of **21 million coins**. Created in 2009 by an anonymous person or group using the name Satoshi Nakamoto. Nobody can create new BTC outside the protocol's rules — no central bank, no foundation, no government. This is the foundational claim that everything else in this thesis builds on.

### 2. The Blockchain (Layer 1)

The public ledger where Bitcoin transactions live. A new "block" of transactions is added approximately every 10 minutes. Each block builds on the previous one, forming a chain. The whole system is secured by *proof of work* — miners spend real energy to compete for the next block. Rewriting Bitcoin's history would require enormous ongoing cost and coordination, which is why proof of work makes attacks expensive and visible.

### 3. Self-custody

Holding your own Bitcoin without trusting an exchange or a custodian to hold it for you. You control the private key (a long secret number) that proves ownership of your BTC. The mantra "not your keys, not your coins" comes from this. **That also means recovery is your responsibility. If the backup fails, there is no password reset desk hiding behind a curtain.**

### 4. Lightning Network (Layer 2)

A protocol that lets you make near-instant Bitcoin payments at very low fees. You and a counterparty open a *payment channel* funded by an on-chain Bitcoin transaction, then exchange unlimited off-chain updates. The channel settles to Bitcoin only when it closes. Lightning is how Bitcoin handles retail payments without overloading the base layer's 10-minute blocks.

### 5. Stablecoins

Crypto tokens designed to maintain a stable value against a real-world currency (almost always the US dollar). The two largest are **USDT (Tether)** and **USDC (Circle)**. Stablecoins are how most non-Bitcoin crypto users transact in everyday economic activity — Argentine families saving in dollars, Nigerian freelancers receiving payment, Filipino workers sending remittances home. **They are useful, but they are not neutral money. They depend on an issuer, reserves, banks, sanctions rules, and redemption access.** Holding USDT is holding a Tether liability, regardless of which rail carries it.

### 6. Layer 2 vs. Sidechain vs. Rollup

These are different ways to add capabilities to Bitcoin without changing the base protocol:

- **Layer 2 (e.g., Lightning, Ark, Spark)** — payment networks running off-chain that settle to Bitcoin.
- **Sidechain (e.g., Liquid)** — a separate blockchain with its own consensus, pegged to Bitcoin.
- **Rollup (e.g., Citrea)** — execution environment that batches transactions off-chain, posts a cryptographic proof to Bitcoin.

The deep dive uses these terms throughout. They are not interchangeable; they have different trust models.

### 7. The Three Functions of Money

This is the core ontology of the deep dive. Any money serves three functions, and they are not the same:

- **Store of Value (SoV)** — holds purchasing power over time. (Bitcoin is winning this layer.)
- **Medium of Exchange (MoE)** — moves between people for payments. (The 2024–2030 work.)
- **Unit of Account (UoA)** — the denomination you think in, price in, save in. (Emergent and slow.)

Most criticism of Bitcoin from 2017–2024 confused MoE-quality with SoV-quality. The deep dive corrects this confusion.

### 8. Sovereignty

The ability to hold, send, and receive value without permission from any third party. Bitcoin's design gives users a form of monetary exit that modern bank-based money does not normally offer. Almost every architecture decision in the deep dive comes back to: "does this preserve the user's ability to exit to L1 Bitcoin unilaterally?"

---

## Three things the deep dive will NOT do

It will not tell you whether to buy Bitcoin. It will not predict Bitcoin's price. It will not tell you Bitcoin will replace everything. The deep dive's claim is more careful: Bitcoin wins three of nine major fronts within five years; loses six others; and connects symbiotically to all of them via its stack.

## Three things the deep dive WILL do

It will give you a six-layer map of the Bitcoin stack. It will compare Bitcoin's stack honestly against Tron, Base, TON, Solana, Ethereum L2s, and Hyperliquid. It will commit publicly to specific, dated predictions that would invalidate the thesis if they fail.

---

## You're ready

If those eight concepts make sense, you have enough background to read the deep dive without feeling lost.

If any of them are still fuzzy, return to the [Curious Path](https://bitcoinsovereign.academy/paths/curious/) Stage 1 modules, work through them, then come back.

**Next:** [Executive TL;DR](executive-tldr.md) for a 5-minute summary, or [the full thesis v4](thesis-v4.md) for the ~25-minute deep dive.

---

*Published May 2026. ~700 words. Read time: ~4 minutes. Designed to be read once and not returned to.*
