# When the safe asset needs higher yields just to be trusted, what is the exit?

### Bitcoin does not need to replace every payment rail to matter. The deeper question — for advisors, families, and anyone watching local rails get slower — is whether the door is open and the lock is yours.

*Substack draft · v2.1 · 2026-05-19 · ~2,420 words · ~10-minute read · Title option A locked. Voice: `docs/marketing/voice-spec.md`.*

---

A friend in Bogotá pays her web designer in USDT on Tron.

A client in Buenos Aires keeps long term savings in self custodied Bitcoin and short term rent money in dollar stablecoins.

A family office in Miami owns a spot Bitcoin ETF and asks every quarter whether any of it should move into direct custody.

A merchant in El Salvador still accepts Bitcoin, not because the law forces her to, but because her customers actually use it.

These are all called "Bitcoin adoption."

That is where the confusion begins.

They are not the same story. Some are about Bitcoin as a long term asset. Some are about dollar access. Some are about payment rails. Some are about custody. Some are about financial escape routes when the local banking system is slow, expensive, closed, or captured.

So when people ask, *"When does Bitcoin become a medium of exchange?"* the honest answer is not a slogan.

It depends what they mean by *"Bitcoin."*

It depends what they mean by *"exchange."*

And it depends whether the user can actually exit back to Bitcoin without permission.

## The three functions are not the same problem

Money has three classic functions.

A **store of value** holds purchasing power across time. A **medium of exchange** helps people settle transactions today. A **unit of account** is the thing prices, wages, invoices, and contracts are measured in.

These sound like academic categories until real life shows up with a factura, a mortgage, a remittance, a grocery bill, and a cousin who insists he is *"into Bitcoin"* because he once bought Solana on Coinbase.

Each function asks for different properties.

A store of value needs scarcity, durability, verifiability, and credible resistance to dilution. A medium of exchange needs speed, low cost, liquidity, merchant acceptance, and decent user experience. A unit of account needs relative price stability, accounting depth, habit, tax clarity, and contracts written in that unit.

Bitcoin has made its strongest case as a store of value.

That does not mean it has failed as a medium of exchange. It means the medium of exchange question is more layered than people want it to be.

Gold solved store of value better than daily payment. Dollars solve daily payment better than long term scarcity. Stablecoins improve dollar access while keeping dollar dependency. Tron moves USDT cheaply, but it does not give users Bitcoin's neutrality. Ethereum and Solana support faster app environments, but they do not offer Bitcoin's monetary simplicity.

Each system is useful along a different axis.

So the real questions are these.

Are more people using Bitcoin based rails to move value? Are more people pricing goods and services in bitcoin? Are new layers helping Bitcoin serve more monetary functions, or are they quietly importing the same trust problems Bitcoin was designed to avoid?

My read is simple.

Bitcoin's store of value function is already established.

Bitcoin's medium of exchange function is real, but layered.

Bitcoin's unit of account function is still early, narrow, and much harder than most people admit.

## Where Bitcoin as a medium of exchange is already working

There are several ways Bitcoin is already used for exchange. They are not equal. That matters.

### Self custodial Lightning

Lightning is the closest thing Bitcoin has to a native payment layer.

A user opens a payment channel, sends fast payments off chain, and can close the channel back to Bitcoin L1. That last part is the key. If the user is self custodial, the channel has an exit path back to the base layer.

That does not make Lightning magic. It adds new assumptions. Users deal with liquidity, routing, channel management, fees, backup design, and online availability. Some wallets hide those complexities. Sometimes that is good. Sometimes it also hides the custody model.

But the core idea matters. Lightning does not replace Bitcoin settlement. It extends it.

For small payments, remittances, tips, merchant payments, and circular economies, Lightning is the most credible Bitcoin native medium of exchange layer.

### Fedimint

Fedimint is different.

It is not individual self custody. It is community custody.

A group of guardians holds bitcoin in multisig. Users transact privately with ecash notes. The federation can connect to Lightning for payments and redemption.

The tradeoff is clear. You trust the federation.

But for many users, the real alternative is not perfect self custody. The alternative is a custodial exchange, a fintech app, or a bank that may be slow, expensive, surveilled, or unavailable.

Fedimint can replace a distant opaque custodian with a local accountable one. That does not make it Bitcoin L1. It makes it a useful community scale tool where the trust model is visible.

That is already an improvement over pretending every beginner is ready to manage keys, backups, inheritance, and transaction signing alone.

### Liquid

Liquid is a federated Bitcoin sidechain.

It allows faster settlement, confidential transactions, and issued assets. That includes L-BTC, which is bitcoin pegged into Liquid, and assets like stablecoins or other tokens issued on Liquid.

Liquid is useful for exchanges, traders, institutions, and users who need faster settlement or asset issuance. But Liquid adds a federation. The peg out back to Bitcoin depends on that federation.

So Liquid is not *"just Bitcoin, but faster."* It is Bitcoin connected infrastructure with a different trust model.

That can be useful. It should not be blurred.

### Stablecoins on Bitcoin related rails

This is where people get sloppy.

Stablecoins can move over Bitcoin related systems, including Liquid, Lightning related asset protocols, RGB, Taproot Assets, and atomic swap tools like Boltz.

That may be very useful. A person without a bank account may receive dollar exposure. A family in Colombia may get access to dollar like value without waiting for a bank wire. A freelancer may avoid local currency volatility.

But that is not the same as Bitcoin becoming the medium of exchange. It is dollar access using Bitcoin adjacent rails.

The rail changed. The dollar promise did not.

If the asset is USDT, the user depends on Tether. If the asset is USDC, the user depends on Circle. If the stablecoin issuer freezes, fails, changes terms, loses banking access, or faces regulation, Bitcoin does not magically fix that.

Bitcoin can help move the token. Bitcoin does not make the issuer honest.

That distinction is the whole essay.

### Bitcoin collateralized credit

There is another use case people often miss.

Bitcoin may become very important as collateral before it becomes the thing everyone spends at the grocery store.

A family may not want to sell bitcoin, but may want dollar liquidity. A company may want financing against bitcoin reserves. A borrower may want credit without giving up long term exposure.

This is not retail payment. It is balance sheet infrastructure.

That may matter more for advisors and family offices than whether someone buys coffee with sats.

The medium of exchange question is not only about merchants. It is also about whether Bitcoin can become the final collateral asset behind other forms of liquidity.

## Where Bitcoin probably does not win soon

The honest version must concede ground.

Stablecoin remittances in many emerging markets are not primarily happening on Bitcoin rails today. They are happening on Tron and other cheap stablecoin networks.

That is not because Tron is better money. It is because cheap dollar movement has product market fit.

People who need to send dollars quickly do not start by asking for perfect monetary neutrality. They ask if the transfer works, if fees are low, if the recipient can cash out, and if everyone around them already uses it.

That is a network effect. Bitcoin educators should respect it, not hand wave it away.

The same applies to other categories. Retail crypto apps may grow faster on Base because Coinbase has distribution. High throughput consumer apps may prefer Solana because developers can build fast interactive experiences there. DeFi activity may stay on Ethereum L2s because liquidity and tooling are already deep. Telegram native crypto activity may happen on TON because the user funnel is already there. On chain perpetuals may continue to concentrate where traders already have speed, liquidity, and incentives.

None of this disproves Bitcoin. It clarifies Bitcoin's role.

Activity moves to the fastest rail. Trust moves to the hardest asset. Those are not the same thing.

A good advisor should not confuse them. Specifically:

BTC denominated flows should be counted as Bitcoin medium of exchange. Dollar denominated flows on Bitcoin rails should be counted as Bitcoin rail dollar access. Dollar denominated flows on Tron are stablecoin adoption, not Bitcoin adoption.

A recipient later buying bitcoin with those dollars may be part of the broader savings story. It is not the same as Bitcoin being used as the medium of exchange.

## The function under the function

Step back from the rail debate for a moment.

When people ask what Bitcoin is for, they usually argue about *medium of exchange.* That is the visible function. There is another function underneath it that almost nobody names directly.

It is **exit.**

Not exit in the trading sense. Exit in the monetary sense. The ability to hold, move, borrow against, and step away from a unit of account without asking permission from the systems that issued it, settled it, or recorded it.

Most of monetary history is the story of who controls the exit. Capital controls. Bank holidays. Withdrawal limits. Restricted currency conversions. Frozen accounts. Repatriation rules. Cross border friction. Tax authority over assets the holder no longer trusts. None of these are payment problems. They are exit problems.

Right now the bond market is reminding people what fragile exit looks like in real time. Long dated sovereign debt is selling off. Buyers are [demanding higher yields](https://www.reuters.com/markets/rates-bonds/global-bond-rout-fed-rate-cut-talk-fade-2025-01-09/) to hold the same paper. Mortgage and consumer borrowing costs are rising in turn. None of this proves Bitcoin wins. It explains why the Bitcoin question keeps coming back.

When the asset everyone calls *safe* needs more yield just to be trusted, the conversation is no longer about the speed of a payment. It is about whose permission you need to step out.

That is the function Bitcoin uniquely improves.

A medium of exchange that works only inside one rail is not really an exit. A store of value that you cannot move without authorization is not really sovereign. A unit of account you do not denominate your own contracts in is not really yours.

Exit is the function that ties all three back together.

It does not require Bitcoin to displace Tron. It does not require Bitcoin to outperform Solana. It does not require merchants to switch their cash registers. It requires that the door is open, that the lock is yours, and that someone other than the issuing system can verify the door still works.

That is a smaller, harder, more durable claim than *"Bitcoin replaces every payment rail."*

It is also the part of the argument that gets stronger the more stressed the surrounding rails become.

## The uncomfortable gold analogy

The strongest critique of the *"store of value first, medium of exchange later"* thesis is gold.

Gold became a store of value. Gold did not remain the everyday medium of exchange.

The payment layer moved to claims on gold. Then paper notes. Then bank money. Then central bank money. Eventually, in 1971, the dollar fully decoupled from gold.

Gold survived as a reserve asset, but it did not remain the daily settlement layer for ordinary people.

So it is fair to ask whether Bitcoin follows the same path.

Maybe Bitcoin becomes digital gold. Maybe institutions hold it. Maybe ETFs scale faster than self custody. Maybe corporations put it on balance sheets. Maybe nation states hold it quietly. Maybe families own exposure through custodians while daily life keeps running on dollars, stablecoins, cards, and bank rails.

That outcome is possible.

But Bitcoin is different from gold in one important way. Bitcoin is natively digital and directly verifiable.

Gold needed paper claims because physical gold is hard to move, divide, assay, and settle globally at internet speed. Bitcoin does not need a vault receipt in order to move.

It can settle directly on L1. It can move through Lightning. It can be held in multisig. It can be verified by a node. It can be recovered through a designed custody plan. It can be moved across borders with knowledge and keys rather than a shipping container and a very polite customs officer.

That does not guarantee Bitcoin becomes a broad medium of exchange. It means the gold analogy is incomplete.

Bitcoin can support layers without requiring the same kind of paper claim structure gold required.

The risk is that people choose the paper claim anyway because it is easier.

That is why custody matters.

## The El Salvador lesson

El Salvador is useful because it shows what does not work.

Bitcoin adoption does not become durable because a government orders merchants to accept it.

In 2025, El Salvador amended its Bitcoin law after its agreement with the IMF. Acceptance became voluntary, tax payment rules changed, and the official Chivo wallet was set to be wound down or sold. [Reuters reported](https://www.reuters.com/world/americas/el-salvadors-congress-approves-reforms-bitcoin-law-2025-01-29/) that the reform made Bitcoin acceptance voluntary while the government continued to signal support for holding bitcoin reserves.

That is not the same as saying Bitcoin failed. It means mandatory acceptance is fragile.

Voluntary acceptance is different.

If a merchant accepts Bitcoin because customers use it, because fees are lower, because settlement is useful, or because she wants bitcoin instead of local currency, that behavior can survive political changes.

If a merchant accepts Bitcoin only because the law says so, the adoption is as durable as the law.

That is the lesson.

Real medium of exchange adoption does not come from forcing the sticker onto the cash register. It comes from actual usefulness.

And actual usefulness requires education, wallets, liquidity, merchant tools, tax clarity, custody competence, and time.

The boring parts are the parts that survive.

## What this means for advisors

For advisors, the Bitcoin conversation today is mostly not a retail payment conversation. It is a balance sheet conversation.

Bitcoin competes with gold, real estate, offshore dollars, Treasury bills, money market funds, and local sovereign credibility.

For high net worth families in Latin America, the practical question is not whether they will buy coffee with sats tomorrow.

The better question is: *what portion of long term savings should sit outside a currency and banking system they do not fully control?*

Then the next question is: *can they custody it safely?*

Then: *can heirs recover it?*

Then: *can liquidity be accessed without selling at the wrong time?*

Then: *can the family move value if local rails become expensive, restricted, or politically uncomfortable?*

That is where Lightning, Liquid, Fedimint, multisig, stablecoin exit routes, and Bitcoin backed credit become advisory tools.

Not all of them are pure Bitcoin. Not all of them are sovereign. But they may solve different problems in a family's financial architecture.

The advisor's job is to name the tradeoffs clearly.

The medium of exchange question and the custody architecture question are the same question, observed at different time scales.

## What this means for families

For families, the medium of exchange debate is personal.

A spending wallet is not an inheritance plan. A Lightning wallet is not a recovery design. An ETF is not self custody. A seed phrase in a drawer is not a family governance system. A stablecoin balance is not dollar sovereignty. A hardware wallet is not automatically a plan.

Bitcoin can help a family preserve purchasing power across time, but only if the custody structure survives real life.

Real life means lost phones, dead relatives, divorces, bad backups, scared heirs, unclear legal authority, phishing, SIM swaps, wrong addresses, forgotten passphrases, and the classic family office sentence: *"We thought someone else had that."*

This is why Bitcoin education and custody design cannot be separated.

If Bitcoin becomes more useful as a medium of exchange, families will need more than payments. They will need spending wallets, savings wallets, recovery procedures, inheritance instructions, signer policies, privacy habits, and a shared understanding of who can do what.

That is not a product feature. That is a family system.

## What this means for builders

The best opportunities are not necessarily where crypto Twitter is loudest. Three fronts look more useful than the rest.

First, **Bitcoin collateralized credit.** Do not call it *"Bitcoin DeFi"* if the audience is institutional. Call it what it is. Bitcoin collateralized credit. That language is clearer, less speculative, and easier for advisors to understand.

Second, **non custodial dollar exit.** Many people do not need a new coin. They need access to dollars without surrendering all control to a bank or exchange. Atomic swaps, Liquid, Lightning, and stablecoin tools can matter here, as long as issuer risk is named honestly.

Third, **community custody.** Fedimint style models may matter in places where the real alternative is custodial dependence. A parish, cooperative, family, school, or local group may trust a known federation more than a distant exchange.

That is not perfect sovereignty. It is visible trust.

Sometimes visible trust is a major upgrade.

## Where I could be wrong

There are several ways this thesis can fail.

The first is **stablecoin distribution.** If Tron and other cheap dollar rails stay dominant in remittance corridors, Bitcoin based dollar rails may remain a niche tool rather than a mass market payment system.

The second is **custodial capture.** If ETFs, exchanges, banks, and custodial wallets grow much faster than self custody, Bitcoin may become mostly institutional digital gold. Valuable, but less sovereign in practice.

The third is **miner economics.** Public miners have increasingly explored AI and high performance computing as mining margins tighten. Recent reporting has described miners facing profitability pressure after the halving cycle, with some companies shifting toward AI infrastructure. That does not mean Bitcoin security is failing. It does mean the security budget debate should stay live, not hidden under slogans.

The fourth is **technical complexity.** If higher layers require users to trust bridges, federations, mints, issuers, sequencers, or operators they do not understand, then many *"Bitcoin based"* tools may repeat the same dependency patterns Bitcoin was meant to reduce.

The fifth is **quantum migration.** The serious point is not panic. It is time. If cryptographic migration becomes necessary, social coordination will matter. Bitcoin can adapt, but not casually. ([BIP-360](https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki) is the current proposal for post-quantum address types.) Any honest long term thesis should keep that risk visible.

## The practical answer

So when does Bitcoin become a medium of exchange?

It already is, in specific contexts.

It is a medium of exchange in Lightning payments. It is a settlement asset behind some higher layer systems. It is collateral in Bitcoin backed credit. It is an exit asset for families and businesses that want a way out of local monetary risk.

It is not yet the default unit people use to price rent, salaries, groceries, invoices, or debt. That is a much higher bar.

The mistake is thinking Bitcoin has to replace every payment rail to win.

It does not.

Bitcoin's deepest role may be as the monetary anchor, with different layers serving different needs around it. Some layers will be more sovereign. Some will be faster. Some will be more private. Some will be dollar based. Some will be useful but compromised.

The work of the next five years is not to pretend those tradeoffs disappear. It is to make them visible enough that families, advisors, and builders can choose them consciously.

Bitcoin's monetary anchor function is intact and getting stronger.

Its medium of exchange function is real, layered, and smaller than the loudest claims.

The question is not whether every transaction in the world moves to Bitcoin.

The question is whether more people can hold, move, borrow against, and exit through Bitcoin without asking permission from the systems that made them need an exit in the first place.

---

*If you want the full argument — the layered taxonomy, the quarterly falsification record, and the source detail behind each ceded front — the long-form [Foundational Layer Thesis](https://bitcoinsovereign.academy/deep-dives/foundational-layer-thesis/) on Bitcoin Sovereign Academy is the next door.*

*I write about Bitcoin, custody, privacy, and financial sovereignty at bitcoinsovereign.academy.*

*Created by Dalia · bitcoinsovereign.academy*

---

## Editorial notes (strip before publishing)

- **Title (locked, option A):** *When the safe asset needs higher yields just to be trusted, what is the exit?*
- **Subtitle:** *Bitcoin does not need to replace every payment rail to matter. The deeper question — for advisors, families, and anyone watching local rails get slower — is whether the door is open and the lock is yours.*
- **Title selection rationale:** Question framing (voice spec §5.6). Integrates the live macro moment without naming specific yield numbers. Foregrounds the *exit* spine added in the "function under the function" section. Pairs with the macro-hook LinkedIn variant for timely cross-posting. Body opens with the four-scene vignette; the textbook MoE question lands mid-piece as the framing the essay undermines — title sets up the deeper claim, body shows how the textbook framing misses it.
- **Format:** standalone Substack essay. ~2,100 words.
- **Hero image (locked):** `drafts/svg/sov-moe-uoa-exit-v2.svg` — exit-coded, mirrors the locked title and subtitle. Use this as the Substack header / OG card / LinkedIn preview.
- **Figure two (optional, mid-essay):** `drafts/svg/sov-moe-uoa-stack.svg` — the analytic-backbone figure mapping the three monetary functions to the Bitcoin stack layers. Useful as a body figure if you want a second image partway through the essay (near the *"Where Bitcoin as a medium of exchange is already working"* section feels right). Keep or drop at your discretion.
- **Substack tags:** Bitcoin, Money, Lightning, Stablecoins, Custody, Sovereignty.
- **Cross-post:** macro-hook LinkedIn variant at `drafts/linkedin-bitcoin-moe-macro.md` (recommended for live-bond-stress weeks); soft-tone variant at `drafts/linkedin-bitcoin-moe.md` kept for evergreen slots.
- **Composability bridges:** pair #1 (Bitcoin custody architecture × LATAM civil-law / notarial inheritance practice), pair #4 (cypherpunk ethics × family-office discretion norms), pair #5 (counterparty risk in stablecoin overlays × LATAM jurisdictional reality).
- **Voice applied:** `docs/marketing/voice-spec.md` — first-principles (§4), inform-not-convince (§5), unbounded mode (§11). Closing line per §6.1 included verbatim.

### Accuracy improvements vs. the original draft

- **Removed:** Tether-on-Lightning-via-Taproot-Assets late-2025 timeline · Boltz USDT March 18, 2026 · USDC via CCTP April 2026 · Tron $7.9T 2025 USDT volume (specific number) · 1.15M daily-active accounts · 60% USDT share / $83.9B as of March 2026 · Stacks sBTC $437–545M TVL · US ~328,372 BTC across agencies · El Salvador 7,565 BTC · Bhutan ~6,000 BTC · BIP-360 February 10, 2026 repository date.
- **Softened:** Tron-dominance claim now qualitative ("not primarily happening on Bitcoin rails today") rather than quantitative. El Salvador framing is "voluntary acceptance after IMF-linked reform" with Reuters citation, not "the cleanest data point we have on what doesn't work."
- **Kept (with safer framing):** the SoV-MoE-UoA structure, the spine quote, the three-way analytic distinction (BTC flows / Bitcoin-rail dollar access / stablecoin adoption), the gold-programmability rebuttal, the "MoE question = custody-architecture question" line, the *"where I could be wrong"* discipline expanded to five risks.
- **Added link, no date:** BIP-360 — points to the BIPs repository so the reader can verify status at publish time without us committing to a date that may be stale.
- **Single internal link** to the v4 thesis as a *"next door"* at the foot of the essay, rather than the four inline thesis links the original had. Keeps the piece public-facing.

### Suggested LinkedIn variant adjustment

The LinkedIn variant in `drafts/linkedin-bitcoin-moe.md` references the Tron $7.9T number directly. To stay consistent with this v2's tone, swap the line *"Tron alone moved roughly $7.9 trillion in USDT in 2025. Bitcoin-anchored stablecoin volume across all four rails combined is one to two percent of that"* with: *"Stablecoin remittance volume is dominated by Tron and other cheap dollar rails. Bitcoin-anchored stablecoin volume is a small fraction of it. That is a network-effect story, not a Bitcoin failure."* Flagging — happy to apply that edit if you confirm.
