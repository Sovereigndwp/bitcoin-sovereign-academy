# When does Bitcoin become a medium of exchange?

### Three monetary functions, three different problems. A first-principles read on what is already working, what is structurally ceded, and what the next five years look like — for advisors and for families.

*Substack draft · 2026-05-19 · ~2,050 words · ~9-minute read · Source: derived from the v4 [Foundational Layer Thesis](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/thesis-v4.md) and its [Counter-Map](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/counter-map.md). Voice: `docs/marketing/voice-spec.md`.*

---

A friend in Bogotá pays her web designer in USDT-on-Tron. A client in Buenos Aires keeps his savings in self-custodied Bitcoin and his rent money in USDT — same wallet, different intentions. A family office in Miami holds a spot Bitcoin ETF and asks me, every quarter, whether they should be moving any of it onto a signing device. A merchant in El Salvador stopped accepting Bitcoin in September 2025 the day mandatory legal-tender status was repealed, and another merchant two blocks away still takes it because she always wanted to.

These are, in some superficial sense, all "Bitcoin adoption" stories. But they are not the same story. Treating them as one is the single largest source of confusion in the *"is Bitcoin becoming money?"* debate — and the cleanest place I can find to start, honestly, is by separating what money actually *is.*

## The three functions are three different problems

Money is a coordination technology performing three distinct social functions, in a specific order of difficulty.

A **store of value** is the function of holding purchasing power across time. The relevant properties are scarcity, verifiability, and credible absence of dilution. This is a property of the asset itself.

A **medium of exchange** is the function used to settle present-day transactions. The relevant properties are speed, cost, transferability, and merchant acceptance. This is a property of the payment surface, not just the asset.

A **unit of account** is the denomination in which prices are quoted and contracts are written. The relevant properties are stable purchasing power, denomination depth, and habit. This is a property of the application layer — wages, leases, debt instruments, accounting books.

Gold solved the first better than the second. Dollars solve the second better than the first. Stablecoins improve dollar access but keep dollar dependency. Ethereum and Solana solve app speed better than monetary neutrality. Tron solves cheap USDT movement better than censorship resistance. None of these systems are *bad* — they're each load-bearing along a different axis.

So when someone asks *"is Bitcoin becoming a medium of exchange?"* the question, fairly read, is really three:

- Are people earning, spending, and settling more value on Bitcoin's rails?
- Are merchants quoting prices in BTC?
- Is the credibility that lets Bitcoin hold value across time being eroded by trying to do everything else?

My read, after the v4 red-team audit of the foundational-layer thesis and the May-2026 falsification check, is that the answers are *yes (in a layered way), no (and the bar is higher than people admit), and not yet — but watch.*

## Where Bitcoin-as-MoE is already working — in layered form

Four credible rails for Bitcoin-as-medium-of-exchange exist today. They have different trust profiles, and pretending those differences don't exist is how this conversation usually goes wrong.

**Self-custodial Lightning, through wallets like Phoenix or Zeus.** This inherits Bitcoin L1 settlement and adds channel-liveness and routing assumptions. It is the closest thing to a sovereign medium of exchange Bitcoin has — the user retains unilateral channel-close, which means they retain the right to exit to the base layer. Volume is real and growing, especially in remittance corridors with high local-rail friction. (The contested case is Spark-enabled wallets like Wallet of Satoshi on Spark. Their "self-custodial" framing is disputed by several core Bitcoin developers — Matt Corallo among them. The UX has improved; the custody model deserves a careful read before assumption.)

**Fedimint, the chaumian-mint primitive.** Community-scale custody with privacy guarantees no other chain has an equivalent of. A guardian set holds Bitcoin in multisig; users transact via blinded ecash notes; redemption goes back through Lightning. The trust assumption is the federation — but the alternative isn't usually self-custody for these users; it's a custodial exchange. Fedimint substitutes a known, local, accountable federation for an opaque centralized one. That trade is honest.

**Liquid + Lightning Taproot Assets + Boltz atomic swaps.** Non-custodial dollar access on Bitcoin rails. Tether began native USDT issuance on Lightning via Taproot Assets in late 2025, Boltz added USDT atomic-swap support on March 18, 2026, and USDC followed via CCTP in April 2026. The important caveat: *this is dollar access without a bank account, not Bitcoin medium-of-exchange.* The carrier changed; the issuer risk did not. Tether and Circle remain the counterparties. Calling this "Bitcoin MoE" because the rails are Bitcoin-anchored is the same category error as calling Visa transactions "fiat MoE" — true at the rail level, misleading at the asset level.

**Stacks sBTC, for Bitcoin-collateralized credit.** $437–545M TVL through Q1 2026 makes Stacks the leader of the BTC-collateralized credit category. This is not retail payments. It is BTC-denominated finance — lending, structured products, programmable collateral — built around Bitcoin as the reserve asset. A MEDIUM-HIGH win front for the Bitcoin stack, and one most maximalists undersell because it doesn't fit the "Bitcoin is just money" frame they grew up with.

The honest collective claim is: *some Bitcoin-as-MoE volume is real, growing, and credibly sovereign.* It is also smaller, more layered, and more trust-heterogeneous than the loudest version of the story implies.

## Where Bitcoin probably does *not* become the medium of exchange — within five years

The most useful part of the v4 thesis is the part that concedes ground. Of ten major use-case fronts, six are explicitly ceded to other rails over a five-year horizon.

**Stablecoin remittance in emerging markets** belongs to Tron. Tron processed roughly [**$7.9 trillion in USDT transfer volume in 2025**](https://www.cryptopolitan.com/tron-records-7-9-trillion-in-usdt-transfer-volume-in-2025-new-research-from-messari-rwa-io-and-stablecoin-insider/), with **1.15 million daily-active accounts** moving USDT. Tron holds over 60% of all USDT in circulation, around $83.9B as of March 2026. Bitcoin-anchored stablecoin volume across Liquid, Lightning Taproot Assets, RGB, and Boltz combined is, conservatively, one to two percent of that. The corridor share — Argentina-Spain, Nigeria-UK, Philippines-Saudi, Mexico-US — is far smaller still, because user-side network effects are real and locked in.

**US retail consumer crypto** belongs to Base. Coinbase's 110M-user distribution is structural; Bitcoin L2s do not match it within this horizon.

**Mature DeFi TVL** is [Arbitrum and Base, roughly $30B combined](https://defillama.com/chain/base). **Telegram-native crypto** is TON, riding a 900M-MAU funnel. **High-throughput consumer apps** sit on Solana, where consumer-app density is structurally different from anything Bitcoin's L2s have produced. **On-chain perpetuals** are dominated by Hyperliquid, with around 70% of on-chain perp volume.

Activity moves to the fastest rail. Trust moves to the hardest asset. Conflating the two — counting USDT remittance on Tron as *"Bitcoin adoption"* because the recipient eventually converts some to BTC — is where the inflated MoE numbers come from. The cleanest discipline I can recommend, especially for advisors writing client memos, is to count BTC-denominated flows as Bitcoin MoE and count dollar-denominated flows on Bitcoin rails as *Bitcoin-rail dollar access.* Two different things. Two different trust models. Two different five-year trajectories.

## The honest steelman

The most uncomfortable critique of the whole *"SoV first, MoE later"* path is the gold analogy. Gold solved store of value. Gold never *became* the medium of exchange. Gold became digital paper claims — vault receipts, then bank notes, then central-bank-issued currency — and the medium-of-exchange layer migrated to paper that was *about* gold rather than *being* gold. The MoE layer eventually de-coupled from gold entirely (1971), and the SoV layer survived inside central-bank reserves and private holdings.

It is honest to ask: does Bitcoin follow this path? Becomes the reserve asset of corporate treasuries (MSTR), sovereign reserves (US ~328,372 BTC across agencies, El Salvador 7,565 BTC, Bhutan ~6,000 BTC), and ETFs that issue paper claims at scale — while the actual transactional layer settles on dollars, stablecoins, and faster non-Bitcoin rails?

My read is that the situation is genuinely different in one specific way: Bitcoin is programmable at issuance. The unit of account *is* the verification, all the way down. There is no gold-vault auditor in the loop, no central authority issuing the paper. Lightning, Liquid, Fedimint, and Taproot Assets are infrastructure that lets the *same asset* serve different functions at different layers, without the layered claim system that paper-gold required. That is a real structural difference from the gold path — but it is not yet a proven outcome.

Where I could be wrong: if ETF and custodial wrappers continue to scale faster than self-custodial rails, and if Lightning + Fedimint volume stays a rounding error against Tron's, the practical outcome in 2030 may look more like "digital gold + dollar rails on top" than the integrated layered-money picture. That is the version of the gold-disprove-the-thesis argument I take most seriously, and the one the [falsification framework](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/falsification-framework-v4.md) is designed to test against quarterly.

## The El Salvador lesson, properly read

El Salvador's 2025 rollback of mandatory Bitcoin acceptance is the cleanest data point we have on what doesn't work. Not because Bitcoin failed there — Bukele's strategic reserve thesis is intact and the country still holds 7,565 BTC on the public ledger — but because *mandatory* legal-tender status produced a fragile distribution. Merchant compliance survived only as long as the political coalition mandating it survived. When the IMF made repeal a condition of a financing arrangement, the coalition negotiated; the mandate fell; voluntary acceptance continued where it had organically taken root.

The general principle, which composes well with the v4 thesis: **voluntary acceptance is durable; mandatory acceptance is fragile.** This is the same principle that explains why bottom-up custody competence outlasts top-down regulatory-licensed wrappers. The path to Bitcoin medium-of-exchange runs through merchant choice, BTC-denominated salaries, and BTC-denominated debt — none of which compress into a quarterly OKR. The path also runs through self-custody competence, which is itself a multi-year craft: signing devices, recovery design, inheritance plans that survive a notary in a civil-law jurisdiction.

The medium-of-exchange question and the custody-architecture question are the same question, observed at different time scales.

## What this means for advisors and for families

For **advisors** — particularly those serving HNW LATAM and diaspora clients — the practical reading is that the Bitcoin allocation conversation is not, today, an MoE conversation. It is a balance-sheet conversation. Bitcoin's deepest competition is not other chains; it is gold, Treasuries, money market funds, real estate, offshore dollars, and sovereign monetary credibility. The MoE rails matter mostly insofar as the client may need *exit pathways* that don't depend on the local banking system — Lightning self-custody, Fedimint deployments in family or community contexts, Boltz for non-custodial dollar exposure where USD access is the genuine need. These are advisory tools, not transactional defaults.

For **families** — particularly multi-generational ones with assets in more than one jurisdiction — the medium-of-exchange story compounds with the inheritance-architecture story. A spending wallet is not an inheritance plan. A Lightning channel is not a notarial document. The composability of voluntary acceptance and self-custody competence is something a family designs over years, not something a platform sells. (This is what the curriculum at Mi Primer Bitcoin and the collaborative-multisig practice at The Bitcoin Adviser both work on, from different angles. Neither pretends the work is finished.)

For **builders** — three fronts have structural advantage and are worth working on: Bitcoin-collateralized credit (build on Stacks or Citrea, and call it *"Bitcoin-collateralized credit"* rather than *"Bitcoin DeFi"* for institutional credibility), non-custodial dollar exit (atomic-swap UX), and community-scale custody (Fedimint deployments at the parish, cooperative, or family scale). The other six fronts are structurally uphill within this horizon.

## Where I could be wrong

The five-expert red-team audit on the v4 thesis logged three open critiques I take seriously and want to name here rather than bury:

1. The Tron stablecoin distribution gap may be structurally permanent in the dominant remittance corridors, not just temporal. The user-side network effect is locked in for at least a half-decade.
2. Miner economics (F16 in the falsification framework) is the framework's only current PRESSURE point. Q1 2026 saw public miners liquidate 32K+ BTC pivoting to AI compute. If treasury discipline does not hold across the 2028 halving, the security-budget question becomes harder.
3. The quantum-threat horizon (F17) is a unilateral-invalidation lever. The thesis can be rejected on F17 alone regardless of the other 16 falsifiers' status. [BIP-360](https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki) entered the Bitcoin BIPs repository on February 10, 2026; the migration runway is 2028–2032 under reasonable assumptions.

If 6 or more of the framework's 17 falsifiers fire by end of 2028, the thesis is publicly rejected and rebuilt visibly. That commitment is the discipline, and it is the part of this work I most want readers to verify for themselves.

## Where to go from here

The v4 thesis itself ([~7,800 words](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/thesis-v4.md), ~25-minute read) goes deeper than this essay can. The [falsification dashboard](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/dashboard.html) tracks the 17 predictions in public, updated quarterly. The [Counter-Map](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/counter-map.md) walks through each of the six ceded fronts with sourced detail. If you're new to any of this, the [Curious path](https://bitcoinsovereign.academy/paths/curious/) on Bitcoin Sovereign Academy is the place to start.

The honest one-line version: Bitcoin's monetary anchor function is intact and getting stronger. Its medium-of-exchange function is real, layered, and smaller than the loudest claims. The work of the next five years is to make the layers visible enough that families, advisors, and builders can choose their own trade-offs, rather than inheriting someone else's.

---

*I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy.*

*Created by Dalia · bitcoinsovereign.academy*

---

## Editorial notes (strip before publishing)

- **Title:** *When does Bitcoin become a medium of exchange?* (locked — option A).
- **Format:** standalone essay (not part of the 21-article custody+inheritance series).
- **Hero image:** the SoV/MoE/UoA × Bitcoin stack figure — saved alongside this draft at `drafts/svg/sov-moe-uoa-stack.svg`.
- **Substack tags:** Bitcoin, Money, Lightning, Stablecoins, Custody, Sovereignty.
- **Cross-post:** LinkedIn EN (Thursday professional slot per voice spec §7) — variant saved at `drafts/linkedin-bitcoin-moe.md`.
- **Composability bridges:** pair #1 (Bitcoin custody architecture × LATAM civil-law / notarial inheritance practice), pair #4 (cypherpunk ethics × family-office discretion norms), pair #5 (counterparty risk in stablecoin overlays × LATAM jurisdictional reality).
- **Voice applied:** `docs/marketing/voice-spec.md` — first-principles (§4), inform-not-convince (§5), unbounded mode (§11). Closing line per §6.1 included verbatim.
- **Inline citations selected:** Cryptopolitan/Messari on Tron 2025 USDT volume; DefiLlama on Base TVL; bitcoin/bips repo on BIP-360. Internal links route to the v4 thesis, falsification framework v4, counter-map, dashboard, and Curious path on BSA. Sovereign-holdings figures (US ~328,372 BTC, El Salvador 7,565 BTC, Bhutan ~6,000 BTC) inherit the v4 thesis's citation chain rather than being relinked in the essay body — chase those through the thesis at publish time if a reader asks.
