# The Bitcoin Field Guide (v4)

### Fourteen protocol panels for readers who know Lightning and nothing past it. Every claim sourced, every population named, every limitation stated honestly. v4 adds maturity-status labels, legal-pressure tags, and a stack-wide "what Bitcoin guarantees vs new trust added" table at the top.

*The Sovereign Academy · Field Guide v4 · May 2026 · Companion to "Bitcoin Is No Longer Just the Foundational Layer" (thesis v4)*

---

## How to read this guide

The Bitcoin thesis assumes a stack of protocols most readers have never used. This guide walks through each protocol in plain English with one disciplined structure per panel.

Each panel contains:

**Maturity status** (new in v4) — one of: Research · Testnet · Mainnet-early · Production · Battle-tested. Definitions in the table below.

**Legal-pressure tag** (new in v4) — Low · Moderate · Elevated · Acute. Reflects exposure to current regulatory enforcement, not future risk.

**Like Lightning, but…** — five sentences. What it is, what problem it solves that Lightning doesn't, how the trust model differs, who's using it today, what it costs and what risk you accept.

**Who** — named user populations, not "users."

**Where** — geographic and demographic context.

**Effect** — the most defensible current adoption metric.

**Limits** — what the protocol is *not* good at. The thing the marketing copy hides.

**Sources** — tagged inline by tier:

- `[DEV]` — primary developer source (GitHub, project blog, Optech newsletter, BIP, official docs)
- `[DATA]` — on-chain or public-dashboard data (DefiLlama, mempool.space, CoinGecko, Glassnode)
- `[INST]` — institutional research (Messari, Galaxy, Coinbase Institutional, Chainalysis)
- `[PRESS]` — reputable secondary press (Bitcoin Magazine, The Block, Decrypt, CoinDesk)
- `[PROJ]` — project communication (announcement post, press release, founder thread)
- `[ANEC]` — community report (podcast, community blog, anecdote — weakest tier)

When a panel cites mixed tiers, the strongest tier is presented first.

**Vocabulary check.** v4 of the thesis introduces a four-way taxonomy: **Bitcoin-native** (BTC settles directly), **Bitcoin-secured** (single-honest-operator security via BitVM-class designs), **Bitcoin-adjacent** (federated, multisig, or separate-consensus systems that reference Bitcoin), and **Bitcoin-branded** (anything claiming "Bitcoin DeFi" without trust-minimized exit, excluded from the credible stack). Each panel below tags its category.

---

## Maturity status definitions

| Label | Meaning |
|---|---|
| **Research** | Specification or proof-of-concept; not running production user flows. |
| **Testnet** | Live but on testnet only; no real-asset user activity. |
| **Mainnet-early** | Live on mainnet under 12 months OR with <10K users OR with <$50M in cumulative user-facing flow. UX may be rough. |
| **Production** | Stable mainnet, multi-year track record on small-to-mid scale, well-known operator practices. |
| **Battle-tested** | Multi-year mainnet operation at material scale with known stress events survived. Lightning is the only protocol in this guide currently at this tier. |

---

## What Bitcoin actually guarantees vs the new trust each layer adds

This is the audit's central insight, applied stack-wide. Read this before any individual panel.

| Protocol | What Bitcoin actually provides | New trust the user accepts |
|---|---|---|
| **Lightning (self-custodial)** | BTC liquidity; unilateral channel exit to L1 | Channel-liveness, routing reliability, watchtower availability, LSP behavior |
| **Lightning (operator-assisted / custodial)** | BTC reference asset | Operator custody, signing, KYC, regulatory geofencing |
| **Liquid** | BTC reserve backing via 1:1 peg | 87-member functionary federation; institutional members under their own regulation |
| **Taproot Assets** | Asset issuance commitments on Bitcoin L1; transfer over Lightning | Asset issuer (Tether/Circle); wallet support; non-BTC channel liquidity |
| **RGB** | Bitcoin anchoring of asset commitments; client-side privacy | Asset issuer; client-side proof storage UX; backup discipline |
| **Ark / Arkade** | Settlement reference; unilateral exit via presigned transactions | ASP liveness; timeout-based recovery windows; refresh-or-settle cadence |
| **Spark** | Statechain reference; user-side key share in some configurations | Threshold signer set; Lightspark operator; "self-custodial" semantics actively debated |
| **Fedimint** | BTC reserve backing | Threshold-signature guardian set; legal and social pressure on individually identifiable guardians |
| **Cashu** | BTC backing via mint reserves | Single mint operator (mints have rug-pulled in the past) |
| **BitVM / BitVM2** | Cryptographic challenge games on L1; single-honest-operator security model | Operator liveness; challenge-window infrastructure; pause-and-recover incident handling |
| **Citrea** | ZK proof anchoring; BitVM-class bridge | Bridge security model; sequencer; operator set; pause governance |
| **Botanix** | Settlement reference; EVM-equivalent execution | Spiderchain orchestrator multisig (~30–50 operators currently) |
| **Stacks / sBTC** | Block commitments to Bitcoin; sBTC peg | Stacks consensus; sBTC signer model |
| **BitcoinOS** | ZK proof anchoring | Each constituent rollup's specific security; compression-layer trust |
| **Boltz** | Atomic-swap cryptography settled on L1 | Operator liquidity; frontend access; legal exposure of the operator |

**Two principles to carry through the panels.**

1. *A protocol can settle near Bitcoin without inheriting Bitcoin's full security.* Bitcoin-adjacent execution layers reference Bitcoin but introduce their own consensus and bridge assumptions.
2. *A protocol can improve UX while reducing sovereignty.* Custodial Lightning, "self-custodial" wrappers, and threshold-signature wallets often deliver better UX than self-custody — at the cost of unilateral exit guarantees.

---

## Panel 01 — Lightning Network

**Category:** Bitcoin-native (self-custodial Lightning) / Bitcoin-adjacent (custodial or threshold-signed Lightning wrappers).
**Maturity:** Battle-tested.
**Legal pressure:** Moderate — US custodial-wallet pressure (Wallet of Satoshi US delisting **November 2024**); large LSPs face VASP-equivalent exposure in regulated jurisdictions.

**Like Lightning, but… (this is the baseline)** Lightning is Bitcoin's instant payment layer. Two parties open a payment channel funded by an on-chain Bitcoin transaction, then exchange unlimited off-chain updates that settle to Bitcoin only when the channel closes. It solves Bitcoin's slow-block-time problem for retail payments while preserving custody in self-custodial wallets — you hold your channel, you can exit unilaterally. The trust model in self-custodial Lightning is "as good as Bitcoin minus channel-liveness, routing, and LSP assumptions." Per-transaction costs are low (often sub-cent for small payments) but require channel liquidity management or reliance on a Lightning Service Provider (LSP), which changes the trust model.

**Who.** Strike users (100 countries), Bitfinex and Kraken customers, Cash App users (US), Wallet of Satoshi former US users (US-delisted **November 2024**) and current global users, Phoenix wallet holders (self-custodial), Bitcoin Beach merchants and locals in El Zonte, El Salvador.

**Where.** Strongest adoption in El Salvador, Latin America, Sub-Saharan Africa (Strike presence), the Philippines, and US retail (via Cash App and Square POS rollout). Hub-and-spoke routing concentrates liquidity in roughly five large operators (Bitfinex, Kraken, Strike, River, large LSPs).

**Effect.** Public capacity reached **5,637 BTC (~$490M)** in December 2025 — an all-time high. **~14,940 nodes, 48,678 channels.** **Public Lightning volume rose 266% year-over-year in 2025** even as raw transaction count declined (because per-transaction value rose). River alone reports >$1B monthly volume. Strike processes >2M Lightning transactions per month. `[DATA]` `[PROJ]` `[INST]`

**Limits.** Channel-jamming attacks remain unresolved. The hub-and-spoke trend means most volume routes through regulated entities subject to OFAC and KYC rules. Routing failures still occur at 5–10% rates depending on LSP. Lightning is excellent for transactional payments; it is not a smart-contract layer.

**Sources.** [Lightning Labs — Summer of Lightning](https://lightninglabs.substack.com/p/summer-of-lightning) `[DEV]` · [BTC.network — USDT live on Lightning analysis](https://btc.network/blog/usdt-live-lightning-network-taproot-assets-fee-market-2026) `[PRESS]` · [Bitcoin Visuals Lightning charts](https://bitcoinvisuals.com/lightning) `[DATA]`

---

## Panel 02 — Liquid Network

**Category:** Bitcoin-secured federated sidechain.
**Maturity:** Production (institutional rail).
**Legal pressure:** Moderate — federation members individually regulated; USDT-on-Liquid inherits Tether's MiCA non-compliance (Binance EEA delisting March 2025, Kraken sell-only March 24, 2025).

**Like Lightning, but…** Liquid is a *sidechain*, not a payment channel. It runs as a federated parallel blockchain with 1-minute blocks, anchored to Bitcoin via a 1:1 BTC peg held by 87 federation members (Blockstream, exchanges, market makers). Liquid solves the asset-issuance problem Lightning doesn't — you can issue stablecoins, security tokens, and real-world assets on Liquid with confidential transactions (amounts hidden) and fast finality. The trust model is "trust the 87-member federation." Transactions cost roughly $0.01 and confirm in one minute.

**Who.** Institutional OTC desks, Bitfinex ecosystem traders, market makers, USDT-on-Liquid holders for confidential settlement, RWA issuers, Blockstream Mining customers.

**Where.** Primarily institutional — invisible at retail. Geographic distribution follows institutional crypto trading hubs: London, Singapore, Hong Kong, Zug.

**Effect.** Liquid processed **1,163,119 transactions in Q1 2026** — nearly 5x Q1 2025, 72% jump over Q4 2025. **More than $5B in RWAs issued on the network.** USDT-on-Liquid moves billions monthly through institutional channels. Federation grew to 87 members. `[DEV]` `[DATA]`

**Limits.** Federated trust model — if a supermajority of federation members collude, peg can break. No retail-facing distribution. Confidential transactions are powerful but unfamiliar to most regulators. Liquid is structurally an institutional rail; it does not solve consumer-payment UX.

**Sources.** [Liquid Federation Q1 2026 Quarterly Update](https://blog.liquid.net/liquid-federation-quarterly-update-q1-2026/) `[DEV]` · [Blockstream Liquid documentation](https://docs.liquid.net/docs/technical-overview) `[DEV]`

---

## Panel 03 — Taproot Assets (incl. USDT on Lightning)

**Category:** Bitcoin-native overlay (asset commitments on L1; transfer over Lightning).
**Maturity:** Mainnet-early (USDT production confirmed March 21, 2026).
**Legal pressure:** Moderate — inherits Tether's MiCA non-compliance for USDT routes; USDC paths cleaner.

**Like Lightning, but…** Taproot Assets is a protocol from Lightning Labs that lets you issue arbitrary assets (stablecoins, RWAs) directly on Bitcoin L1 via Taproot commitments, then transfer those assets *over Lightning*. It solves the "Lightning is only for BTC" limitation — now Lightning can carry USDT, USDC, and any other tokenized asset using the same channels. The trust model inherits from Lightning for transfers, with additional dependence on the asset issuer (Tether, Circle, etc.). Costs are comparable to Lightning; the additional risk is issuer freezing.

**Who.** Speed wallet users, Tether USDT-on-Lightning early adopters, exchanges integrating Taproot Assets stablecoin routing, merchants accepting USDT settlement via Lightning channels. **Bitfinex, Joltz, LnFi** confirmed integrations.

**Where.** Global, but adoption is still preliminary. The chronology matters: **announcement January 30, 2025** (Tether + Lightning Labs partnership at Plan B Forum); **production confirmation March 21, 2026** (Ardoino confirmed USDT live on Lightning via Taproot Assets, completing the 14-month integration). Real-world flow data is still emerging as of May 2026.

**Effect.** **Announced January 30, 2025; production-live March 21, 2026** — that 14-month gap matters for any "USDT has displaced X" claim that pre-dates March 2026. **Taproot Assets v0.7 (December 2025)** added reusable static addresses and auditable supply commitments — the production-grade features USDT needed. **Speed Wallet, Bitfinex, Joltz, LnFi integrations** live or rolling out. Theoretical addressable volume: Tether's $83.9B Tron-resident USDT supply could in principle migrate, but in practice migration is gradual and most USDT activity stays on Tron in 2026. `[DEV]` `[PROJ]`

**Limits.** **It is too early to claim adoption scale.** Anyone telling you USDT-on-Lightning has displaced USDT-on-Tron at any meaningful volume in 2026 is guessing — production confirmation is barely two months old at field-guide-v4 publication. Issuer freezing risk is identical to USDT anywhere else — Tether can freeze addresses. Channel liquidity for non-BTC assets is still building.

**Sources.** [Lightning Labs Taproot Assets v0.7 announcement](https://lightning.engineering/posts/2025-12-16-tapd-0.7-launch/) `[DEV]` · [Tether brings USDT to Lightning](https://tether.io/news/tether-brings-usdt-to-bitcoins-lightning-network-ushering-in-a-new-era-of-unstoppable-technology/) `[PROJ]` · [Speed Wallet USDT-on-Lightning](https://www.speed.app/blog/usdt-on-lightning-network) `[PROJ]`

---

## Panel 04 — RGB Protocol

**Category:** Bitcoin-native overlay (client-side validation; on-chain commitments only).
**Maturity:** Mainnet-early (Tether USDT-on-RGB *announced* August 28, 2025; rollout in progress).
**Legal pressure:** Low currently — privacy-by-design lives in a less-trodden regulatory area; that does not mean it stays low.

**Like Lightning, but…** RGB takes the opposite design choice from Taproot Assets: instead of putting commitments on Bitcoin L1 with on-chain asset metadata, RGB keeps all asset state *off-chain* via client-side validation. Bitcoin transactions only carry cryptographic anchors; the actual asset history lives between the parties who hold the asset. It solves the privacy problem Lightning and Taproot Assets don't — your asset transfers aren't broadcast or visible to the network. The trust model is "trust the parties you transact with to maintain valid asset history off-chain." Costs are minimal; risk is asset-history loss if you lose the proofs.

**Who.** Tether (publicly **announced** USDT issuance on RGB on **August 28, 2025**; production deployment is ongoing as of May 2026 — not yet a meaningful retail-volume rail), Utexo (Lightning + RGB stablecoin settlement infrastructure), Solv Protocol (Bitcoin-native yield via Utexo on RGB + Lightning, April 15, 2026), privacy-focused asset issuers.

**Where.** Primarily developer and institutional adoption. Solv + Utexo + Tether is the canonical 2026 case but should be read as a rollout, not a settled retail-flow capability.

**Effect.** **Tether's August 28, 2025 announcement** — clearly framed as plans-and-rollout, not live-since. As of May 2026, RGB is not yet a meaningful retail USDT rail. **Solv Protocol launched Bitcoin-native yield via Utexo on RGB + Lightning, April 15, 2026.** RGB Core Library actively developed. `[DEV]` `[PROJ]`

**Limits.** Client-side validation is conceptually elegant but operationally demanding — losing your asset-history proofs means losing your asset. UX is harder than Taproot Assets. Adoption is genuinely early-stage; most Bitcoin users have never used RGB, and treating the Tether-RGB announcement as production-live USDT-on-RGB volume is a category error.

**Sources.** [RGB Protocol Documentation](https://docs.rgb.info) `[DEV]` · [Solv Protocol + Utexo announcement (April 2026)](https://www.globenewswire.com/news-release/2026/04/15/3274292/0/en/solv-protocol-becomes-first-to-deliver-bitcoin-native-yield-via-utexo-on-rgb-lightning-network-aligning-with-tether-s-usdt-expansion.html) `[PROJ]`

---

## Panel 05 — Ark / Arkade

**Category:** Bitcoin-native (Ark) when configured with user-side unilateral exit; Bitcoin-adjacent in some operator-coordinated deployments.
**Maturity:** Mainnet-early (Arkade beta October 2025 — confirm exact mainnet date from Ark Labs primary source `[VERIFY]`).
**Legal pressure:** Low — early enough that operator perimeter has not become a regulatory target.

**Like Lightning, but…** Ark removes the channel-management problem. Instead of each user opening a private Lightning channel, an Ark Service Provider (ASP) coordinates a shared on-chain UTXO and gives each user a virtual UTXO (VTXO) backed by a presigned transaction. It solves the "users have to manage liquidity" problem Lightning has — Ark users have Lightning-like UX without channels. The trust model is "trust the ASP for liveness, but never for custody" — the presigned transactions mean you can exit unilaterally to L1 BTC even if the ASP goes offline or acts maliciously.

**Who.** Arkade public-beta users, Chimera Wallet users (first super-app integration), developers building on the Ark Protocol specification. Backed by Tether, Tim Draper, Anchorage Digital, Ego Death Capital.

**Where.** Arkade beta is global; production adoption is still small. Chimera Wallet is launching alongside the May 2026 TGE.

**Effect.** **Arkade Protocol mainnet went live in October 2025**, public beta. **$7.7M raise** from Tether, Draper, Anchorage. **Chimera Wallet ($15M backing) launching as Bitcoin super-app** with Arkade as primary payment layer, May 2026 TGE. V-PACK (stateless VTXO verification) and hArk (hash-lock-based Ark) released in 2026. `[DEV]` `[PROJ]` `[PRESS]`

**Limits.** Adoption is still early. ASPs are a centralization point even if non-custodial — they coordinate the shared UTXO tree. Periodic on-chain settlement creates timing constraints (VTXOs expire and must be refreshed or settled). Compared to mature Lightning, the wallet and ASP ecosystem is thin.

**Sources.** [Ark Labs documentation](https://docs.arklabs.xyz/ark/) `[DEV]` · [Ark Labs $5.2M raise announcement](https://www.prnewswire.com/news-releases/ark-labs-raises-5-2m-backed-by-tether-to-build-programmable-finance-on-bitcoin-302712201.html) `[PROJ]` · [Invezz on Arkade + Chimera TGE](https://invezz.com/news/2026/05/13/arkade-protocol-and-chimera-wallet-bitcoin-l2-self-custody-ahead-of-the-may-tge/) `[PRESS]`

---

## Panel 06 — Spark (Lightspark) — distinguishing Spark protocol from Lightspark Grid product

**Category:** Mixed — Spark *protocol* is Bitcoin-adjacent (threshold-signed statechains); Lightspark *Grid* is a payment-infrastructure product layered on top, with its own institutional trust model.
**Maturity:** Mainnet-early (Spark protocol; mainnet date per Lightspark `[VERIFY]`).
**Legal pressure:** Moderate — Spark's "self-custodial" framing is actively contested by some Bitcoin developers, including Matt Corallo; the regulatory categorization of threshold-signed wallets is unsettled.

**Like Lightning, but…** Spark is Lightspark's open-source Layer 2 protocol built around statechain technology with threshold signatures (FROST). Spark's native BTKN standard aims to let stablecoins like USDB operate directly on Spark without bridging or channel constraints. **The trust model is "threshold signatures across a signer set" — Lightspark and Wallet of Satoshi describe this as enabling a self-custodial Lightning experience, but the exact custody semantics of Spark are an active community debate.** Some Bitcoin developers — notably Matt Corallo — have publicly contested whether "self-custodial" is the right description for the Spark integration; readers should treat WoS-on-Spark as a different category from legacy custodial Wallet of Satoshi without assuming the unilateral-exit guarantees of self-custodial Lightning. The Lightspark Grid product is a separate institutional payment-infrastructure layer on top, intended for branded USD accounts, Visa debit card issuance, and payouts to 65+ countries / 14,000 banks.

**Important reporting separation.** Spark protocol adoption (self-custody, statechain mainnet activity) and Lightspark Grid distribution (branded USD accounts, Visa rails, fintech integrations) are related but **not** the same metric. v4 commits to reporting them separately — collapsing them into a single "Spark adoption" number overstates the protocol's user base and understates Grid's distribution achievement.

**Who.** Lightspark Grid customers (fintechs building branded USD accounts), Wallet of Satoshi (Spark integration for what is described as a self-custodial Lightning experience — custody semantics contested), Breez SDK integrations, Tether's WDK (wallet development kit) adopting Spark.

**Where.** Institutional and fintech distribution channels (Grid). Grid connects to 175M Visa merchants across 33 countries, with payouts to 65 nations and 14,000 banks. Spark *protocol* mainnet activity is global but smaller and less well-instrumented in public dashboards.

**Effect.** **Spark protocol** — mainnet launched in 2025 (specific date per Lightspark `[VERIFY]`); Q2 2026 roadmap unveiled; Tether WDK integration; Wallet of Satoshi using Spark for the integration described above. **Lightspark Grid product** — Grid Global Accounts launched at Bitcoin 2026 conference; Visa partnership; 175M Visa merchants / 14,000 banks distribution. `[DEV]` `[PROJ]`

**Limits.** Spark TVL and user numbers are not publicly disclosed at the granularity Ethereum L2s report. The "open-source Layer 2" framing is sometimes more accurately read as "Lightspark-led Layer 2" — most validators and infrastructure today are Lightspark-operated. Spark vs Lightning vs Ark is still an open competitive question. The custody debate (above) is the most important nuance for users reading marketing copy.

**Sources.** [Lightspark introducing Spark](https://www.lightspark.com/news/spark/introducing-spark) `[DEV]` · [Lightspark Grid Global Accounts (Bitcoin Magazine)](https://bitcoinmagazine.com/news/lightspark-launches-grid-global-accounts) `[PRESS]` · [Wallet of Satoshi + Spark integration](https://bitcoinmagazine.com/news/wallet-of-satoshi-partners-with-spark-to-offer-self-custodial-bitcoin-lightning-experience) `[PRESS]`

---

## Panel 07 — Fedimint

**Category:** Bitcoin-secured federated mint (community-scale custody).
**Maturity:** Production at small community scale.
**Legal pressure:** Moderate — federation guardians are individually identifiable legal entities subject to local financial-services frameworks; the Chaumian-ecash design limits federation-side transaction visibility but does not remove guardian-level legal exposure.

**Like Lightning, but…** Fedimint is a *community custody* layer, not a payment channel. A federation of 4+ guardians (people in your community, running Fedimint server software) uses threshold signatures to hold Bitcoin for your community's members, who receive privacy-preserving Chaumian ecash notes they can spend instantly within the federation or send out via Lightning. It solves the "self-custody is too hard for normal people" problem Lightning doesn't — **Fedimint trades full sovereignty for community-scale custody with Venmo-grade UX. Fedimint shifts trust from a company to a local guardian set; it does not remove trust.** The trust model is "trust the threshold-signature federation, with your community electing guardians." User-facing fees are typically low, though guardians may charge for operations; risk is guardian collusion or legal/operational pressure on individually identifiable guardians.

**Who.** Free Madeira federation (Portugal — Bitcoin Atlantis community), Bitcoin Beach community wallet (El Salvador, via Blink integration), refugee/diaspora federations in Kenya and South Africa, the "Fedi Order" deployment team supporting humanitarian community onboarding.

**Where.** Communities where unilateral self-custody is impractical: weak-banking-infrastructure regions, refugee communities, family / village-scale economic units, privacy-conscious networks.

**Effect.** **Free Madeira federation operating since 2024** as the first public Fedimint Federation, supporting the local Bitcoin economy. **Fedi multi-sig guardian creation feature shipped** — communities of any size can spin up federations in a few clicks. Roughly **10-20 active production federations** as of mid-2026, including humanitarian and diaspora deployments. `[DEV]` `[PRESS]` `[ANEC]`

**Limits.** Federated custody is not self-custody. If a supermajority of guardians collude, the community's BTC is at risk. Recovery if a federation fails is non-trivial. Real production adoption remains small compared to Lightning. Most users have never heard of Fedimint.

**Sources.** [Fedimint.org documentation](https://fedimint.org/) `[DEV]` · [Bitcoin Atlantis / Free Madeira Federation launch](https://stacker.news/items/480296) `[ANEC]` · [Fedi multi-sig guardians announcement](https://bitcoinmagazine.com/business/from-stealth-to-scale-fedi-unveils-multi-sig-guardians-for-federated-bitcoin-e-cash-mints) `[PRESS]`

---

## Panel 08 — Cashu

**Category:** Single-operator Chaumian ecash on Bitcoin (mint operator is the trust root).
**Maturity:** Production for small balances; **not appropriate for large savings.**
**Legal pressure:** Acute — single-operator Chaumian mints face the highest regulatory risk in the privacy stack. Tornado Cash precedent + KYC-evasion concerns make Cashu operators in regulated jurisdictions vulnerable.

**Like Lightning, but…** Cashu is single-operator Chaumian ecash on Bitcoin — same privacy primitive as Fedimint, but with a single mint operator instead of a federation. The mint doesn't store accounts; ecash notes are bearer instruments that exist purely between the mint and the holder. It solves the "Fedimint requires forming a federation" friction — anyone can spin up a Cashu mint in hours. **The trust model is "trust the single mint operator." User fees can be near zero, but users still accept mint risk and may incur Lightning routing or redemption costs.** Mints have rug-pulled in the past. Cashu is excellent for small balances and privacy-sensitive payments; it is not appropriate for large savings.

**Who.** Privacy-focused users (journalists, dissidents, Western European privacy advocates), ChatNut users (pay-per-request AI services), Cashu.me web wallet users, Nutstash, Minibits, eNuts wallet users.

**Where.** Geographically diffuse — wherever there are tech-literate privacy-conscious users. Strongest in Western Europe; not a mainstream payment rail anywhere.

**Effect.** **Nutshell 0.20.0** (reference Cashu mint) shipped in Q1 2026 with NUT-21 and NUT-22 (OAuth identity provider support and blind authentication). **Multiple grants** from OpenSats, Btrust supporting Nutshell, Nutstash, and OpenCash development. **ChatNut launched** — privacy-preserving LLM payments without accounts. `[DEV]` `[ANEC]`

**Limits.** Single-operator trust is fragile. Cashu mints have rug-pulled in the past. Volume is tiny compared to Lightning or Fedimint. Use cases concentrate in privacy-sensitive niches rather than mainstream payment.

**Sources.** [Cashu.space official site](https://cashu.space/) `[DEV]` · [Cashu Nutshell GitHub](https://github.com/cashubtc/nutshell) `[DEV]` · [Cashu OpenSats funding](https://opensats.org/projects/cashu) `[DEV]`

---

## Panel 09 — BitVM / BitVM2

**Category:** Bitcoin-secured cryptographic primitive (not a user-facing chain; enables single-honest-operator bridges).
**Maturity:** Mainnet-early. Bitlayer BitVM Bridge live mid-2025; Citrea's Clementine bridge live January 27, 2026.
**Legal pressure:** Moderate — bridges face the same regulatory ambiguity as Tornado Cash; a designation of bridge smart contracts as sanctionable infrastructure is theoretically possible.

**Like Lightning, but…** BitVM is not a user-facing protocol — it's a cryptographic primitive that lets any computation be *verified* on Bitcoin without changing Bitcoin's base protocol. BitVM solves the "Bitcoin can't host smart contracts or trust-minimized bridges" problem by encoding fraud-proof challenge games into Bitcoin Script. **The trust model aims for "single-honest-operator" security — BTC deposits cannot be stolen as long as one honest party is watching and able to challenge within the required window. That party can be the depositor themselves.** BitVM2 is the production-iteration enabling real bridges. Costs are high (large proof sizes); pause-and-recover incident handling is part of the operational hygiene of bridges built on BitVM-class designs.

**Who.** Developers building Bitcoin-anchored L2 bridges — Citrea's Clementine bridge, Bitlayer's BitVM Bridge (live mainnet mid-2025), BOB (Bank of Bitcoin) BitVM bridge prototype, every project pursuing trust-minimized Bitcoin programmability.

**Where.** Developer-facing infrastructure. End users interact with BitVM via the bridges built on top.

**Effect.** **Bitlayer BitVM Bridge launched mainnet mid-2025**, first production trust-minimized Bitcoin bridge. **Citrea's Clementine bridge live with mainnet (January 27, 2026)** using BitVM-based verification. **BitVM2 specification published** establishing the single-honest-node security model. `[DEV]`

**Limits.** **BitVM "trust-minimization" is doing rhetorical work it has not yet earned in production.** Real BitVM-class bridges in 2026 are functionally federated bridges with BitVM-flavored challenge games on top. No BitVM bridge has yet survived a serious adversarial test in production. Bridge exploits are the single largest historical category of crypto losses (~$2.8B across Ronin, Wormhole, Nomad, etc.). **The honest 2026 read: BitVM is a research program in active hardening, not a settled primitive.**

**Sources.** [BitVM2 Bridge Paper](https://bitvm.org/bitvm_bridge.pdf) `[DEV]` · [BitVM GitHub](https://github.com/BitVM/BitVM) `[DEV]` · [Bitlayer BitVM Bridge mainnet (Yahoo Finance)](https://finance.yahoo.com/news/bitlayers-bitvm-bridge-debuts-mainnet-080000626.html) `[PRESS]`

---

## Panel 10 — Citrea

**Category:** Bitcoin-secured execution (via Clementine BitVM-class bridge — discount the "Bitcoin-secured" label by bridge-risk).
**Maturity:** Mainnet-early (January 27, 2026).
**Legal pressure:** Moderate — BitVM-bridge regulatory ambiguity; sequencer regulatory exposure to be determined.

**Like Lightning, but…** Citrea is a *ZK-rollup* on Bitcoin — a separate execution environment that runs an Ethereum-compatible virtual machine, batches thousands of transactions off-chain, generates a zero-knowledge proof of correctness, and posts that proof to Bitcoin L1 for finality via the BitVM-based Clementine bridge. It solves the "Bitcoin can't run smart contracts at scale" problem by anchoring to Bitcoin's settlement security while moving execution off-chain. **The trust model depends on (a) ZK proof correctness, (b) Clementine bridge security under BitVM-class assumptions, (c) the sequencer, and (d) the operator set. Bridge pause governance and incident-response procedures are part of the security model `[VERIFY]`.** Costs are L2-scale (cents per transaction).

**Who.** Early DeFi users on 30+ apps including Satsuma and Tanari, $50M+ in planned liquidity commitments from Galaxy Digital and other asset managers, 26,000+ holders of "₿apper Badge" from the testnet campaign, ctUSD (Bitcoin-native stablecoin issued by MoonPay on M0 infrastructure) early holders.

**Where.** Global, primarily DeFi-aware Bitcoin holders. No retail consumer use cases at scale.

**Effect.** **Citrea mainnet activated January 27, 2026** — first production ZK-rollup on Bitcoin. **30+ apps at mainnet launch.** **ctUSD stablecoin live.** **CTR genesis airdrop snapshot taken May 5, 2026.** **TVL: $5.6M (May 2026), up 97% in one week.** `[DATA]` `[DEV]` `[PROJ]`

**Limits.** **$5.6M TVL is two orders of magnitude smaller than Ethereum L2 leaders.** The thesis "Bitcoin will absorb DeFi" has not yet shown evidence of scale on Citrea. Type-2 zkEVM means full EVM equivalence but with proof-generation overhead. BitVM bridge security caveats apply — Citrea's "Bitcoin-secured" claim should be discounted by bridge risk, not taken at face value. Adoption is genuinely early.

**Sources.** [Citrea DefiLlama page](https://defillama.com/chain/citrea) `[DATA]` · [Citrea mainnet announcement](https://www.blog.citrea.xyz/citrea-mainnet-is-live/) `[DEV]` · [The Block on Citrea launch](https://www.theblock.co/post/387140/zk-powered-bitcoin-layer-2-citrea-launches-mainnet) `[PRESS]`

---

## Panel 11 — Botanix

**Category:** Bitcoin-adjacent (federated multisig bridge; separate consensus).
**Maturity:** Mainnet-early (July 2025).
**Legal pressure:** Moderate — Spiderchain orchestrator set is a multi-operator construct that could become a regulatory target if scale increases.

**Like Lightning, but…** Botanix is an EVM-equivalent Layer 2 on Bitcoin using the Spiderchain architecture — a federation of BTC-staked Orchestrator nodes managing a rotating multisig that secures bridged BTC. It solves the "Bitcoin needs Ethereum-compatibility to attract DeFi developers" problem by running unmodified EVM bytecode anchored to Bitcoin. The trust model is "trust the rotating Spiderchain orchestrator set." Block times of ~5 seconds, fees ~$0.02. Costs are L2-scale; risk is operator-set collusion.

**Who.** GMX (perpetuals trading), Dolomite (lending and borrowing), Chainlink (price feeds), Fireblocks (custody), Antpool, Alchemy, Galaxy (node operators). Perpetuals traders and Bitcoin-aware DeFi users.

**Where.** Global DeFi audience. Not retail consumer; Bitcoin-aware DeFi power users.

**Effect.** **Botanix mainnet launched July 2025** with GMX and Dolomite live at launch. **Block times ~5 seconds, fees ~$0.02.** **Operator set targeted to exceed 100 nodes by end of 2026** (currently ~30-50). `[PROJ]` `[PRESS]`

**Limits.** Specific TVL numbers are not consistently disclosed; Botanix's reporting is less transparent than Ethereum L2s on DefiLlama. The Spiderchain "decentralized from the start" framing assumes the federation grows — currently the operator set is small enough that collusion risk is real. EVM compatibility means Botanix inherits Ethereum's developer tooling, but also competes directly with Arbitrum, Base, and Optimism for the same applications.

**Sources.** [Botanix Labs mainnet launch](https://botanixlabs.com/blog/botanix-launches-mainnet-to-power-the-bitcoin-economy) `[DEV]` · [The Block on Botanix mainnet](https://www.theblock.co/post/360558/botanix-labs-launches-mainnet-for-its-bitcoin-programmability-layer-with-support-from-alchemy-antpool-galaxy-among-other-node-operators) `[PRESS]` · [Samara AG analysis](https://www.samara-ag.com/market-insights/botanix-spiderchain) `[INST]`

---

## Panel 12 — Stacks / sBTC

**Category:** Bitcoin-adjacent (separate consensus; sBTC bridge peg).
**Maturity:** Production (most-adopted Bitcoin programmability path).
**Legal pressure:** Moderate — STX has historical SEC scrutiny; sBTC peg signer model is a regulated-entity-style construct.

**Like Lightning, but…** Stacks is a separate blockchain that uses Bitcoin as its security anchor — every Stacks block is committed to a Bitcoin transaction, and post-Nakamoto-upgrade, Stacks transactions reach Bitcoin-finality reorg resistance. Stacks runs the Clarity smart-contract language (not EVM), and sBTC is the Bitcoin-pegged asset bridge that lets BTC holders deposit BTC and receive sBTC for use in **Bitcoin-collateralized credit and BTC-denominated DeFi** (the more accurate framing — v4's "Bitcoin-native DeFi" label overclaims the category). It solves the "Bitcoin holders want to use BTC as collateral or productive capital without selling it" problem. The trust model is "trust the Stacks consensus and the sBTC peg signer set." Costs are sub-cent; risk is sBTC peg breakage.

**Who.** Bitcoin holders using BTC as collateral or productive capital through Stacks credit protocols — Zest Protocol ($75.9M TVL, lending), Granite ($26M TVL), StackingDAO ($20M TVL). Sophisticated BTC holders, not retail. Bitcoin staking pilot participants.

**Where.** Global, DeFi-aware Bitcoin holders. Less geographically concentrated than Bitcoin-payment use cases.

**Effect.** **sBTC TVL peaked at $545M during Q1 2026**, closed Q1 at **$437M**. **Total Stacks DeFi deployed capital: $121M.** **400,000+ wallets created**, 15% in Q1 2026 alone. **Daily transactions +20% vs 2025 average.** **Bitcoin staking pilot: 320 BTC net inflows in Q1, total participation $100M+.** Integrations live with Fireblocks, Circle USDC, BitGo. `[DEV]` `[DATA]`

**Limits.** sBTC is a peg, not native BTC — peg risk applies. Stacks competes for Bitcoin-collateralized credit mindshare with Botanix, Citrea, and BitcoinOS. The Clarity language is less familiar to developers than EVM, which limits ecosystem speed. 400K wallets is meaningful but tiny vs Ethereum L2s. Calling Stacks the home of "Bitcoin-native DeFi" overclaims — "Bitcoin-collateralized credit" is more institutionally credible and less likely to attract the "where does the yield come from" critique.

**Sources.** [Stacks Q1 2026 Snapshot](https://www.stacks.co/blog/q1-2026-snapshot) `[DEV]` · [Stacks sBTC DefiLlama](https://defillama.com/protocol/stacks-sbtc) `[DATA]` · [Stacks Q1 2026 ecosystem update](https://bingx.com/en/flash-news/post/stacks-q-sbtc-tvl-hits-million-as-defi-deployed-capital-reaches-million) `[PRESS]`

---

## Panel 13 — BitcoinOS

**Category:** Bitcoin-adjacent meta-framework (multi-VM rollups; trust model varies per rollup).
**Maturity:** Research — pre-mainnet for end-user features.
**Legal pressure:** Low currently — no production user surface to regulate yet.

**Like Lightning, but…** BitcoinOS is a meta-framework, not a single chain — it's a "superlayer" of interoperable rollups on Bitcoin, supporting multiple virtual machines (EVM, SolanaVM, MoveVM) with a shared compression and settlement module that posts joint validity proofs to Bitcoin. It solves the "every Bitcoin rollup is siloed" problem by making rollups interoperable at the settlement layer. The trust model depends on each rollup's specific security plus the BitcoinOS compression layer.

**Who.** Sovryn (the incubator and key contributor), partner rollups in development, early DeFi builders exploring multi-VM Bitcoin deployment.

**Where.** Developer-facing infrastructure; end-user adoption is genuinely early.

**Effect.** **BitcoinOS delivered the first ZK-proof verification on Bitcoin mainnet** (via Sovryn's contribution). Multiple partner projects building rollups under the BitcoinOS framework. Currently pre-mainnet for end-user features. `[DEV]`

**Limits.** **Adoption is the earliest of any protocol in this guide.** BitcoinOS is more vision than production at mid-2026. The multi-VM ambition (EVM + SolanaVM + MoveVM) is enormous in scope; execution risk is high. Most readers of this guide will encounter BitcoinOS through a rollup built on it, not BitcoinOS directly.

**Sources.** [Sovryn BitcoinOS wiki](https://wiki.sovryn.com/en/bitcoinos/description) `[DEV]` · [Decrypt on BitcoinOS](https://decrypt.co/214329/bitcoin-rollups-bitcoinos-superlayer-sovryn-protocol) `[PRESS]`

---

## Panel 14 — Boltz

**Category:** Bitcoin-native swap infrastructure (atomic swaps anchored to L1 cryptography); operator-side legal exposure is the load-bearing risk.
**Maturity:** Production (multi-year track record on BTC↔LN; USDT swaps March 18, 2026; USDC via CCTP April 2026).
**Legal pressure:** Acute — Tornado Cash precedent is the directly applicable case. v4 of the thesis frames this precedent as a *multi-vector* enforcement template: operators, frontends, relayers, developers, infrastructure, and liquidity providers can all be compliance targets, even when the underlying protocol remains usable.

**Like Lightning, but…** Boltz is a non-custodial *atomic swap* service — it lets you swap between Lightning sats and external assets (USDT, USDC, on-chain BTC) often without an account or KYC (depending on jurisdiction, frontend, asset, and operator policy), without trusting a counterparty with custody. It solves the "I want dollar liquidity without leaving Bitcoin's sovereignty model" problem Lightning alone cannot. The trust model is "trust the cryptography of atomic swaps for settlement, plus the operator for liquidity and frontend access" — funds are locked in hash-time-locked or routing primitives that release atomically. Costs are swap fees (typically 0.1–0.5%).

**Who.** Bitcoin holders rotating between BTC and stablecoins for short-term spending without using a centralized exchange, privacy-conscious traders, users in countries where centralized exchange access is restricted.

**Where.** Global, jurisdiction-conditional (Boltz operates in a regulatory gray zone that could narrow; specific frontend access varies by jurisdiction).

**Effect.** **Boltz USDT Swaps launched March 18, 2026** — Lightning sats ↔ USDT via tBTC + LayerZero OFT routing. **Boltz USDC Swaps via Circle CCTP launched April 2026.** Daily swap volumes not publicly disclosed at granular level; the launches arrived as Lightning crossed $1B/month volume — the addressable swap demand is substantial. `[PROJ]` `[PRESS]`

**Limits.** **Regulatory gray zone is real and narrowing.** Non-custodial swap operators face mounting legal pressure under FinCEN guidance and MiCA enforcement; the post-Tornado-Cash enforcement template applies pressure to operators, frontends, developers, and liquidity providers individually, not only to the protocol contracts. Volume data is not yet at the granularity that DefiLlama would track. The USDT you receive after swapping is still Tether — issuer freezing risk applies once you hold it.

**Sources.** [Boltz introducing USDT Swaps](https://blog.boltz.exchange/p/introducing-usdt-swaps-from-sats) `[DEV]` · [Bitcoin News on Boltz USDT launch](https://news.bitcoin.com/boltz-launches-non-custodial-usdt-swaps-connecting-lightning-to-stablecoins/) `[PRESS]` · [Bitcoin Magazine on Boltz USDC via CCTP](https://bitcoinmagazine.com/business/boltz-launches-non-custodial-usdc-swaps-bridging-bitcoin-directly-to-circles-regulated-dollar) `[PRESS]`

---

## How to use this guide

When the thesis article mentions a protocol, this guide gives you the named population using it and the most defensible adoption number. When a number looks bigger than it should — Citrea at "30+ apps" but $5.6M TVL is a good example — this guide is where the honest reality check lives.

If you are presenting the thesis to an audience that only knows Lightning, walk them through panels in this order: Lightning (baseline) → Boltz (the dollar-swap surprise) → Fedimint (the community-custody answer to "self-custody is too hard") → Stacks (the most-adopted programmability layer) → Citrea (the most ambitious programmability layer with honest scale gap) → Taproot Assets (the stablecoin-on-Lightning entry point).

Six panels in that order land the thesis without overwhelming the reader. The other eight panels reward deeper interest.

---

## Cross-references

- Main thesis (v4): [`thesis-v4.md`](thesis-v4.md)
- Executive TL;DR: [`executive-tldr.md`](executive-tldr.md)
- Newcomer One-Pager: [`newcomer-onepager.md`](newcomer-onepager.md)
- Competitive counter-map (Tron, Base, TON, Solana, Hyperliquid): [`counter-map.md`](counter-map.md)
- Falsification framework (v4): [`falsification-framework-v4.md`](falsification-framework-v4.md)
- Quantum scenario: [`quantum-scenario.md`](quantum-scenario.md)
- Regulatory deep-dive: [`regulatory-deep-dive.md`](regulatory-deep-dive.md)
- Methodology & disclosure: [`disclosure-methodology.md`](disclosure-methodology.md)
- Interactive dashboard: [`dashboard.html`](dashboard.html)

---

*Field Guide v4 published May 2026. Methodology version 4.0 (companion to thesis v4). v1 (May 18, 2026) is superseded. Source tier markers `[DEV] [DATA] [INST] [PRESS] [PROJ] [ANEC]` apply throughout; `[VERIFY]` flags claims needing pre-publish primary-source confirmation. Corrections welcomed.*
