# Demo truthfulness audit — Custody batch (2026-04-24)

## Summary
- Demos audited: 18
- 🔴 Wrong: 11 findings across 7 demos
- 🟡 Misleading: 18 findings across 10 demos
- 🟢 Could be sharper: 14 findings across 9 demos

The highest-risk items are: listing Samourai Wallet / Whirlpool as if they still operate (DOJ seized Samourai servers and arrested founders in April 2024; Whirlpool was shut down); referring to the Bitfinex 2016 hack without noting the 2022 recovery; outdated hardware-wallet model list (Coldcard Mk4 instead of Q, Trezor Model T instead of Safe 3/5); uncritical mention of Ledger hardware without noting the 2020 customer-data breach and the 2023 "Ledger Recover" seed-extraction backdoor controversy; listing Paxful as a live P2P option (shut down in 2023); and using "testnet3" instructions that no longer match the 2026 reality (testnet3 is effectively deprecated in favor of testnet4 and signet).

## Findings

### account-freeze-locked-out

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/account-freeze-locked-out/index.html`
**One-line pitch:** Branching-story lesson teaching why self-custody matters when banks freeze accounts.

🟢 **Could be sharper**
- L647–L659: The rescue path has a friend sending 0.02 BTC ≈ $2,000 and converting to USD "in 60 seconds." At April 2026 BTC prices, 0.02 BTC is roughly $20,000+, not $2,000. Either change the amount (to ~0.002 BTC) or drop the dollar figure and keep a qualitative "enough to cover rent." As written, the math is off by ~10x.
- L651: Says "First confirmation in 8 minutes." Mempool conditions vary; at non-trivial fee rates, a first confirmation is usually 10–30 minutes. Either soften ("a confirmation within the next block or two") or attach the fee context.

---

### bitcoin-sovereign-game

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/bitcoin-sovereign-game/index.html` (logic in `bitcoin-sovereign-game.js`)
**One-line pitch:** Year-by-year Bitcoin history game where the learner chooses to hold on exchange vs. self-custody.

🟢 **Could be sharper**
- `bitcoin-sovereign-game.js` L842: "Mt. Gox, handling 70% of all Bitcoin transactions" — the commonly cited figure is ~70% of *global Bitcoin volume* at its peak (2013), not transactions. Technically the same idea, but the phrasing is imprecise. Prefer "handling roughly 70% of all Bitcoin trading volume."
- L850: "Terra Luna collapses" refers to 2022; Terra was an altcoin-ecosystem failure, not a Bitcoin failure. The framing is fine but stating plainly "Terra-Luna (a separate blockchain) collapses" would stop readers from mentally bundling it into "Bitcoin problems."

No factually *wrong* claims identified.

---

### coinjoin-simulator

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/coinjoin-simulator/index.html`
**One-line pitch:** Interactive explainer of CoinJoin, anonymity sets, and the list of privacy tools.

🔴 **Wrong**
- L351–356: Samourai Wallet listed as a live "Mobile (Android)" tool with Whirlpool mixing. **Samourai's servers were seized and its founders indicted by the US DOJ on April 24, 2024; Whirlpool was shut down the same day.** The official site is gone and the app is non-functional for mixing. Remove entirely or replace with a historical note and a pointer to Ashigaru (the forked successor, though its status is also questionable).
- L357–362: Sparrow Wallet described as "Supports Whirlpool mixing." Sparrow removed Whirlpool integration on April 24, 2024 after the Samourai takedown (Sparrow 1.9.0 release notes). Today Sparrow still offers manual CoinJoin construction but the Whirlpool client is gone. Fix: describe Sparrow as "UTXO management and coin control; historically supported Whirlpool until April 2024."
- L346–350: Wasabi Wallet described as a live CoinJoin tool. **zkSNACKs, the coordinator for Wasabi, shut down the CoinJoin coordinator on June 1, 2024**, citing sanctions-compliance risk. Wasabi 2.x still ships but with no default coordinator, and the brand has pivoted (Ginger Wallet is a fork that continues similar work). Fix: note the coordinator shutdown and point to Ginger Wallet or state that "no default Wasabi CoinJoin coordinator is currently running."

🟡 **Misleading**
- L364–368: JoinMarket presented as a current production option. JoinMarket is still maintained but had reduced active makers/takers after the Samourai takedown. Acceptable, but should note that liquidity is lower than in 2023.
- L333: "A 10-person CoinJoin gives 10x better privacy than solo" — anonymity-set sizing is more nuanced (sub-set analysis, round-intersection attacks reduce effective set). The 10x framing is a teaching simplification; fine for beginners but flag it.

🟢 **Could be sharper**
- L206–209: "More participants = Better privacy" — true but with diminishing returns when post-mix behavior leaks (e.g., consolidating mixed with unmixed). The "Best Practices" list at L378–395 covers this well; the intro could cross-reference it.

---

### emergency-fifty-scenario

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/emergency-fifty-scenario/index.html`
**One-line pitch:** Narrative scenario where the learner sends $50 in Bitcoin to help a friend buy medicine.

🔴 **Wrong**
- L541: "You send 0.0005 BTC (≈$50). Network fee: $2." At April 2026 BTC prices, 0.0005 BTC is ~$50 only if BTC ≈ $100,000. That's within plausible range for April 2026. The fee claim of "$2" is tied to current mempool conditions, not a constant. Fine as a snapshot, but prefer "Network fee: a few dollars (varies)." If this demo is static content, the assumptions will drift.
- L541: "First confirmation: 8 minutes." Average block interval is ~10 minutes, but the first confirmation for a specific tx depends on fee and mempool depth. 8 minutes as a typical number is fine; consider "first confirmation typically ~10 minutes."

🟢 **Could be sharper**
- L537: The demo assumes Strike and Cash App can be set up and used to receive BTC and cash out within minutes. Both require KYC that can take hours/days, especially in many LATAM markets. A "this assumes Strike/CashApp is already verified" caveat would be honest.

---

### kyc-best-practices

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/kyc-best-practices/index.html`
**One-line pitch:** Short guide to KYC exchanges, no-KYC alternatives, and privacy tips.

🟡 **Misleading**
- L208: "Stick to established exchanges (Coinbase, Kraken, Strike) with proper licenses and security track records." Kraken is fine; Coinbase has been SEC-litigated (2023–2024) though still operating; Strike is not an exchange in the traditional sense (it's a Bitcoin-only payment app backed by Bitstamp/Cumberland rails). Consider adding Swan and River (Bitcoin-only, US) as pure-Bitcoin alternatives, and drop Strike from the "exchange" category.
- L236: "+ Regulated & insured" — this overstates insurance. Coinbase and Kraken carry commercial crime insurance for *hot-wallet* assets, but FDIC/SIPC-style deposit insurance **does not apply to crypto**. Post-FTX, this is a critical distinction. Fix: "+ Commercial insurance for hot-wallet funds (not FDIC/SIPC-equivalent)."

🟢 **Could be sharper**
- L224: "Limit data sharing — Only provide required information." True, but worth noting that the 2020 Ledger data breach (272K customer orders, including home addresses) shows that even "required" data gets leaked. Link to the Ledger breach as a cautionary tale for minimizing KYC exposure.

---

### ledger-keeper-dilemma

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/ledger-keeper-dilemma/index.html`
**One-line pitch:** Side-by-side comparison of CBDC / state-rails / bigtech / stablecoins / cooperatives / Bitcoin.

🟡 **Misleading**
- L658: "Bitcoin (2009+): 99.98% uptime since 2009" — Bitcoin has had effectively 100% block-production uptime since the March 2013 0.7/0.8 chain split (48 hours of instability). The 2010 value-overflow bug required a chain-reorganization intervention. "99.98%" is close enough as a lay number but the narrative "no transaction ever blocked" is cleaner and accurate; the uptime percentage is unsourced. Either cite a source or drop the specific number.
- L598: "Pix (Brazil): 140M+ users, 10-second settlement" — The Brazilian Central Bank reported 150M+ users as of 2024; 140M is slightly outdated. Minor.
- L598: "Bre-B (Colombia): Launched Oct 2025" — correct. The withholding-tax proposal claim is accurate per 2025 Colombian DIAN proposals.

🟢 **Could be sharper**
- L628: "USDC Freezes (2023): Circle froze USDC in Tornado Cash-connected wallets" — the OFAC Tornado Cash action was in August 2022 (not 2023), and Circle froze addresses at that time. Fix year.
- L628: "Tether Opacity: $100B+ circulation, repeatedly failed to prove 1:1 backing" — Tether does publish quarterly attestations by BDO. "Repeatedly failed to prove" is stronger than the facts warrant; "has not produced a full audit; only attestations" is more accurate.

---

### multisig-setup-wizard

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/multisig-setup-wizard/index.html`
**One-line pitch:** Real-case gallery of multisig successes/failures and scenario-based configuration comparison.

🔴 **Wrong**
- L674: "QuadrigaCX: A 2-of-3 setup with the CTO and CFO would have enabled fund recovery." This framing implies key-loss was the root cause. **The Ontario Securities Commission's June 2020 review concluded Quadriga operated as a Ponzi scheme; Cotten appears to have misappropriated customer funds.** Multisig would not have rescued customer money that was never there. Fix: add a note that investigators concluded this was fraud/mismanagement, not purely a lost-keys problem.
- L761: "Mt. Gox Exchange Hack ... $450 Million Lost" — 850,000 BTC were reported stolen (worth ~$450M at the Feb 2014 collapse price). This is correct at the 2014 dollar value, but today those coins are worth tens of billions. Clarify: "~850,000 BTC (about $450M at 2014 prices, ~$85B+ at 2026 prices)."
- L688: "Hackers exploited a flaw in Bitfinex's multisig implementation with BitGo." **Omits that ~94,000 of the 119,756 BTC were recovered by US authorities in 2022**, and that the 2016 hackers Ilya Lichtenstein and Heather Morgan pled guilty. A demo teaching from this case should include the recovery. Current text presents it as pure loss.

🟡 **Misleading**
- L957: Single-sig success rate "~60% (millions lost)" is a fabricated statistic; there is no known source for that figure. Chainalysis estimates lost-BTC at 17–23% but that's not a "success rate of custody setups." Remove the percentages or flag as illustrative.
- L968, L979, L990: Same issue — "~75%", "~95%", "~98%" success rates have no cited source. Either cite or mark as "illustrative, not empirical."
- L816: "Setting up custody for $500,000 in Bitcoin. Your family knows nothing about Bitcoin." The recommended path is 2-of-3 with family + attorney; good. But for non-technical families, **collaborative custody (Unchained, Casa, Nunchuk, Theya) is often safer than pure self-managed multisig** because of the inheritance-documentation overhead. Mention it.

🟢 **Could be sharper**
- L774: "Modern Exchanges Now Use Multisig ... Single-sig custody is now considered negligent." True of reputable exchanges; clarify "qualified custodians and major exchanges now use multisig, MPC, or cold-storage policies."

---

### node-setup-sandbox

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/node-setup-sandbox/index.html`
**One-line pitch:** Guided walkthrough of installing Bitcoin Core on Linux/macOS/Windows with configuration builder.

🟡 **Misleading**
- L893: "The full Bitcoin blockchain is over 500 GB and growing." As of April 2026 the blockchain is closer to **700 GB** (it surpassed 600GB in late 2024 and has grown ~80–100GB/year due to Ordinals/inscription activity). Update to "approximately 700 GB as of 2026, growing ~80–100 GB/year."
- L968: "Full Node (500+ GB) / Pruned Node (10-50 GB)" — update the full-node number to 700+ GB.
- L976–977: "Minimum 550 MB required. Recommended 5000–10000 MB for better functionality." Since Bitcoin Core 24.0+, the minimum is explicitly documented as 550 MB but recommended pruning values have inched up because of block sizes. 10 GB is the realistic lower bound today. Fine, but could be updated.

🟢 **Could be sharper**
- L912–928: Installation walkthrough doesn't mention **PGP signature verification** in the beginner track, only intermediate/advanced. Given that fake Bitcoin Core downloads are the classic supply-chain attack, verification should be presented to all users. The intermediate/advanced note (L945) is good but buried.
- L968: No mention of current Bitcoin Core version. As of April 2026 the current major is **Bitcoin Core 28.x** (released late 2024); learners should know what version they're targeting. Add a "Latest version: check bitcoincore.org/bin/" line.
- L1013: Generated bitcoin.conf doesn't include `assumevalid=0` option which some purists prefer, nor `blocksonly=1` as a bandwidth-saving option. Not wrong — just sparse.

---

### onramp-chooser

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/onramp-chooser/index.html` (data in `onramp-data.js`)
**One-line pitch:** Interactive quiz routing users to recommended Bitcoin on-ramps based on country, KYC comfort, amount, speed.

🔴 **Wrong**
- `onramp-data.js` L549–557: **Paxful is listed as an active P2P option.** Paxful shut down in April 2023. It briefly reopened under different leadership but then shut again, and the platform is unreliable-to-unavailable as of 2026. Remove entirely, or replace with HodlHodl / RoboSats / Peach.
- `onramp-data.js` L349: "HodlHodl ... Latin America liquidity" — HodlHodl is still operating but has reduced Colombia/LatAm liquidity significantly since 2023. OK to list, but the "Latin America liquidity" framing is overstated.

🟡 **Misleading**
- `onramp-data.js` L310–317: "Binance P2P ... Binance (Asia) 0.1% (spot)". Binance settled with US authorities for $4.3B in November 2023 and CZ stepped down. Binance is functional but banned in many jurisdictions (US, Netherlands, Germany partial). A one-line cautionary note is warranted — currently the `notes` field says "caution on custody" which is only partial.
- `onramp-data.js` L107: "Cash App fee: 1.76% spread." Cash App's spread varies (typically 1–2%). Fixed figure may mislead; use "~1–3% spread."
- `onramp-data.js` L86–94: "Strike: 0.3–0.8%." Strike's fees are often cited as ~0.5% for US Bitcoin buys; upper range 0.8% for smaller transactions. Plausible; worth sourcing.

🟢 **Could be sharper**
- `onramp-data.js` L1: "Updated quarterly with current fees and methods" — this claim ages fast; make it accurate with a real "last updated YYYY-MM" stamp.
- No mention of Strike having **expanded internationally in 2024** (available in much of EU and Africa). The EU-focused results (L207–237) should include Strike.

---

### quiz-demo

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/quiz-demo/index.html`
**One-line pitch:** Demonstration of the BitcoinQuiz widget with 7 fundamentals questions.

No factual issues found. The seven Bitcoin basics questions (decentralization, 21M supply, irreversibility, satoshi units, public blockchain, private-key ownership, pseudonymity) are all accurate.

---

### security-dojo-enhanced

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/security-dojo-enhanced/index.html`
**One-line pitch:** Multi-modal security training — hardware wallets, phishing, OPSEC, attacks, inheritance drills.

🔴 **Wrong**
- L2226–2254: Hardware wallet comparison table is **materially out of date**. (1) Coldcard Mk4 is listed at $160; the current production model is the **Coldcard Q** (released 2024, ~$239). Mk4 is still sold but the flagship has changed. (2) Trezor Model T is shown; Trezor discontinued the Model T in 2024 and the current lineup is **Trezor Safe 3 and Safe 5**. (3) Ledger Nano X is listed with no mention of the **2023 "Ledger Recover" controversy** (opt-in seed-extraction service that contradicted Ledger's prior "seed never leaves the device" marketing) or the **2020 data breach** leaking 272K customer addresses. Both are material security concerns that any 2026 hardware-wallet comparison should address. (4) "Passport" — current model is **Passport Core** (previous batch) or Passport gen-2; price ~$199–259 depending on variant. Fix the entire table.
- L1149: Hardware wallet examples "Ledger, Trezor, Coldcard, etc." in the assessment form — acceptable list, but dropping Ledger from the top-3 default for Bitcoin-only users is a common current recommendation given the Recover controversy.
- L2012: "Billfodl — Titanium seed phrase backup device." **Billfodl is marine-grade stainless steel, not titanium.** Also, the Billfodl brand was acquired by Privacy Pros and the product has had multiple name/ownership changes; currently listed at privacypros.io. Correct the material.

🟡 **Misleading**
- L2316–2319: "Bitcoin trader posted screenshots with holdings on Twitter. Three months later, armed robbers broke into his home. Forced to transfer 100 BTC at gunpoint." Presented as a case study without citation. Multiple similar incidents exist (e.g., 2017 Russia, 2021 France, 2024 Malaysia), but a specific attribution is needed or it should be framed as "representative scenario, not a single documented case."
- L2322–2326: "Developer reused Bitcoin address on GitHub donations page. Blockchain analysis revealed $2M+ holdings." No specific case cited; likely inspired by real-but-unnamed cases. Either name the case or frame as illustrative.
- L2473: "NEVER use SMS for 2FA on exchanges." Correct, but strong. Better: "SMS 2FA is the weakest option; prefer TOTP or hardware security keys." The demo does this later (Authy, YubiKey), so fine.

🟢 **Could be sharper**
- L2273–2277: "Coldcard (Coinkite) — Bitcoin-only hardware wallet — Maximum security." Link is `https://coldcard.com/` — correct. Add that Coldcard is closed-source for the bootloader (a common criticism).
- L2295–2298: "Blockstream Jade — Affordable, fully open-source." Correct.

---

### security-risk-simulator

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/security-risk-simulator.html`
**One-line pitch:** 8-question interactive risk assessment that runs scenario simulations based on user choices.

🟡 **Misleading**
- L1384: "Mt. Gox, QuadrigaCX, FTX — all real examples" — correct but under-nuanced. Mt. Gox was a 2014 hack-plus-mismanagement; QuadrigaCX was Ponzi/fraud; FTX was outright fraud. Grouping them as "exchange hacks" is lossy. Minor.
- L1448: "Approximately 20% of all bitcoin may be lost this way." Chainalysis estimated 17–23% of circulating supply was unmoved for 5+ years (which includes Satoshi's coins, dormant whales, and true losses). The "20% lost" figure is widely repeated but has no firm source; the real lost-supply number is debated and probably lower. Either source the claim or qualify as "estimates vary from 10–20%."
- L1520: "Real scam: 'Trezor Mobile Wallet' stole millions." There is no official Trezor mobile wallet — Trezor is hardware-only. The scam-app phenomenon (fake wallet apps using the Trezor name) is real and well-documented, but the "stole millions" claim should have a source or be removed.

🟢 **Could be sharper**
- L654: "Store on a dedicated hardware device (Coldcard, Ledger, etc.)" — same Ledger-Recover caveat as security-dojo. 2026 best practice is to note the Ledger controversy.
- L1486–1488: "Wallet of Satoshi (WoS) shuts down or gets hacked" — **Wallet of Satoshi discontinued US customer service in April 2024** following FinCEN concerns. Currently operates outside US. Worth mentioning.
- L929: "RaspiBlitz, Umbrel, or similar" — **Start9 embassyOS/StartOS** is worth adding; it's become a leading Bitcoin-focused node OS. Also note that **Umbrel shifted to a more general-purpose app-store model** in 2023, which some Bitcoin-purists criticize.

---

### sovereign-vault

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/sovereign-vault/index.html`
**One-line pitch:** Documentation tool for recording wallet configs, backup locations, heirs, and emergency documents.

🟡 **Misleading**
- L705–711: Collaborative custody providers listed: Theya, Unchained Capital, Casa, Nunchuk, The Bitcoin Adviser. All real and operating. **Missing: Bitkey by Block** (launched 2024, a 2-of-3 with phone + hardware + server recovery) which is a significant new entrant. Consider adding.
- L774: "Caravan" listed as a coordinator. **Caravan was archived by Unchained in 2024** (repo marked archived; no longer maintained). Remove or flag as "archived — no longer maintained."
- L812: "Metal Plate (Cryptosteel, Billfodl, etc.)" — Billfodl, as noted, has had brand churn and is not the marketing reference it once was. Cryptosteel (Capsule/Cassette) and Seedor are current references.

🟢 **Could be sharper**
- L716–719: Provider info card is populated dynamically but no provider-specific descriptors — e.g., Casa offers a 3-of-5 "Diamond" plan, Unchained offers 2-of-3 vault+concierge, Theya is 2-of-3 with a phone-based co-signer. A short static blurb helps learners differentiate.

---

### testnet-practice-guide

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/testnet-practice-guide/index.html`
**One-line pitch:** Step-by-step guide to practicing with Bitcoin testnet (get a wallet, copy address, use a faucet, watch it confirm).

🔴 **Wrong**
- L398: "Bitcoin testnet (testnet3, currently on version 3 since 2011)." **Testnet3 is effectively deprecated.** BIP 94 introduced **testnet4** which activated in Bitcoin Core 28.0 (Oct 2024) as the successor, because testnet3 had suffered from: (1) stuck difficulty resets abused by miners, (2) unmanageable blockchain size, (3) spam from testnet coin re-organization. The current 2026 recommendation is **testnet4** or **signet** for practice. Fix: update the demo to point at testnet4 (and emphasize signet as the most stable learning environment). The current instructions guide the user to a chain most development tooling is migrating away from.
- L550–552: Faucet list (mempool.space/testnet, testnet-faucet.com, coinfaucet.eu) — mempool.space now supports **testnet4 and signet faucets**; the testnet3 faucets are increasingly dry or nonfunctional. Replace with `https://mempool.space/testnet4/faucet` and `https://signetfaucet.com/` (or `https://alt.signetfaucet.com/`).

🟡 **Misleading**
- L540: Primary faucet is `bitcoinfaucet.uo1.net` which is widely used and known (mentioned in project memory as canonical). As of 2026 it still operates for testnet3 but funding is often insufficient. A note ("may be empty; try alternatives") would help.
- L410: "Signet: Centrally-signed blocks, more stable for development." Correct. Should be **promoted** as the primary recommendation, not listed as a footnote.
- L454–459: bitcoin-cli example uses `bitcoin-cli -testnet` which targets testnet3. If the demo updates to testnet4, the flag becomes `-testnet4`; for signet it's `-signet`.

🟢 **Could be sharper**
- L431: "Phoenix" listed as a testnet wallet. **Phoenix removed US availability in May 2024** (same FinCEN guidance that pushed WoS out). Phoenix works for testnet/signet users elsewhere. Add geographic caveat.

---

### transaction-builder

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/transaction-builder/index.html`
**One-line pitch:** Drag-and-drop UTXO transaction builder with fee estimation and change-address logic.

🟡 **Misleading**
- L351–355: The address dropdown labels are inconsistent. `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq` is labeled "Native SegWit" (correct), `3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy` is "Nested SegWit" (correct as a convention — technically P2SH could be anything, but in context fine), `bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4` is labeled "Bech32" which is **also a Native SegWit (P2WPKH)** — the label is redundant/confusing since the first `bc1q...` entry is already labeled Native SegWit. Suggest "Native SegWit (bech32 P2WPKH) example 2" or just unify the labels.
- L392: Fee range "1 sat/vB to 100 sat/vB" with "Medium (10 sat/vB)." In April 2026, typical medium-priority fees fluctuate from 2–40 sat/vB depending on mempool; 10 sat/vB is a reasonable middle-of-the-road default. Consider making the default track live mempool.space API fees instead of hard-coded.

🟢 **Could be sharper**
- L364: "the remainder goes to fees unless you create a 'change' output back to yourself." Correct — but students often don't realize the "change detection" heuristic used by chain analysis. Could cross-reference the CoinJoin demo.

---

### utxo-visualizer-enhanced

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/utxo-visualizer-enhanced/index.html`
**One-line pitch:** Multi-level scenario trainer for UTXO selection, consolidation, dust management, privacy trade-offs.

🟡 **Misleading**
- L1222–1226: Privacy scenario's explanatory text says "some UTXOs share the same address... when you combine UTXOs from different addresses, you link them publicly... to send 0.35 BTC with better privacy, use UTXOs from the SAME address." The reasoning is correct (combining already-linked UTXOs adds no new linkage) but the phrasing will confuse beginners who just learned "don't reuse addresses." Clarify: "Because address 1 is already reused, combining those two UTXOs reveals no *new* information — the damage was done when the address was reused. But combining UTXOs across *different* addresses creates a fresh linkage."
- L1246–1251: "At 20 sats/vB, spending the 0.00001 BTC UTXO costs ~3,000 sats, but it's only worth 1,000 sats!" A typical P2WPKH input is ~68 vbytes. At 20 sat/vB that's 1,360 sats (not 3,000). The math is off by ~2x. Either recalculate or note "including overhead."

🟢 **Could be sharper**
- L1247: "Some UTXOs are so small they're called 'dust'" — Bitcoin Core defines dust relative to fee rate (output must be spendable at 3× the current minimum relay rate). The demo could link the definition: `getdustthreshold` / BIP 376. Not required for a visualizer but a nice educator note.

---

### wallet-security-workshop

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/wallet-security-workshop/index.html`
**One-line pitch:** Deep-dive lab on seed generation, BIP39, derivation paths, descriptors, recovery, and inheritance planning.

🔴 **Wrong**
- L2350: "Native SegWit — p2wpkh ... Default in Sparrow, Blue Wallet, **Coldcard Mk4**." Coldcard Mk4 is no longer the flagship; Coldcard Q is current (2024+). Update to "Coldcard Q / Mk4" or just "Coldcard."
- L2380: "Wallets that support [passphrase]: Coldcard, **Trezor Model T/Safe 3**, Sparrow Wallet, Blue Wallet (advanced), Electrum." Trezor Model T is discontinued; current lineup is **Safe 3 and Safe 5**. Fix.
- L2414: "Coldcard shortcut: Advanced → Seed Tools → Verify Seed — checks without wiping." This function name is correct for Mk4 firmware; Coldcard Q has a slightly different menu structure. Low-impact but worth a version note.
- L2424: "Recommended setup: 2-of-3 with Coldcard (home) + **Trezor** (office or safe deposit box) + Jade (trusted family or collaborative custodian)." Solid device-diversity advice; just specify "Trezor Safe 3 or Safe 5" to match current models.

🟡 **Misleading**
- L2431: "Unchained Capital: You hold 2 keys, they hold 1. Requires ID verification. **Cannot steal from you — ever.**" Overstated. Unchained cannot move funds unilaterally — that's true. But phrase "cannot steal ever" glosses over collusion/subpoena risk and should be softened to "cannot unilaterally move your funds." The demo does this earlier (L2434) but the summary here is absolute.
- L2441: "Cryptosteel Capsule: Stainless steel tiles you arrange manually. ~$80." Correct product; typical retail is $96–129 depending on version. Low impact.
- L2442: "SteelWallet: ~$30. DIY" — there are multiple products with similar names; be specific or drop.
- L2445: "You only need the first 4 letters of each BIP39 word — every word in the official wordlist is uniquely identified by its first 4 characters." Correct fact about BIP39, but it only helps for 12/24-word seeds that use the standard wordlist. Worth restating that the 4-letter rule only works if the reader's wallet uses the English BIP39 wordlist (SLIP-39 Shamir shares have different rules).

🟢 **Could be sharper**
- L2380: Passphrase wallet list omits **Sparrow Wallet** already listed, and Electrum, but doesn't mention that passphrase support also works on **BitBox02 and Foundation Passport**. Expand the list.
- L2395: "Coin control lets you choose which UTXOs to spend... Available in Sparrow, Electrum, and advanced mobile wallets." Also available in Bitcoin Core GUI and Specter. Minor.

---

### wallet-workshop

**File:** `/Users/dalia/projects/bitcoin-sovereign-academy/interactive-demos/wallet-workshop/index.html` (logic in `wallet-workshop.js`)
**One-line pitch:** Beginner-friendly tour of wallet types (custodial/non-custodial, hot/cold, single-sig/multisig) with setup guides.

🔴 **Wrong**
- L874: "Software: BlueWallet, Sparrow, Electrum, **Samourai**." Samourai Wallet is **dead as of April 2024** (US DOJ seizure). Remove. Consider replacing with Nunchuk or Ashigaru.
- L1042: "Order direct from manufacturer (Coldcard, Trezor, Ledger, etc.)." Same Ledger-2020-breach and Ledger-Recover caveats apply — the beginner guide shouldn't uncritically recommend Ledger without noting the Recover opt-in service that extracts seeds to Ledger's partners. Either add the caveat or lead with Coldcard/Trezor/Jade/Passport.

🟡 **Misleading**
- L876: "Mobile: Muun, Phoenix, Breez" — **Phoenix removed US support in May 2024** per FinCEN pressure; Breez has similarly restricted availability. US readers will hit KYC/geo-blocks. Add a geo-availability note.
- L916: "Examples: BlueWallet, Sparrow (on laptop), Muun, Phoenix" — Muun is technically a self-custodial Lightning wallet using submarine swaps, not a typical on-chain hot wallet. Phoenix is an LN wallet. Listing them under "hot wallets" is true but the distinction (Lightning-first vs on-chain-first) matters. Consider labelling.
- L1073: "Many people buy 2 hardware wallets of the same model — one for daily use, one as backup. Both can hold the same seed for redundancy." True but risky framing for beginners: if one device is compromised, both are. The redundancy argument holds for *physical loss/damage* but not for *security*. Flag the distinction.

🟢 **Could be sharper**
- L940: Cold wallet examples "Coldcard, Trezor, Ledger, Passport, Jade" — add BitBox02 (open-source, Swiss-made) and Foundation Passport (newer generation). The list is reasonable but a little dated.
- L1054: "Some devices (Coldcard) never show seed on screen — extra security" — correct (Coldcard can use words-from-dice or verify without display). Clarify this is an optional Coldcard feature, not default behavior.

---

## Meta-observations

1. **The Samourai / Whirlpool takedown is unacknowledged across the batch.** Four demos (coinjoin-simulator, wallet-workshop, and implicit references in security-dojo-enhanced and wallet-security-workshop) mention Samourai or Whirlpool without noting the April 2024 DOJ seizure and arrests. This is the single biggest factual blind spot in the custody batch.

2. **The Wasabi zkSNACKs coordinator shutdown (June 2024) is similarly missed.** Wasabi is referenced as a live option in coinjoin-simulator.

3. **Hardware-wallet model inventory is 2022–2023 vintage.** Coldcard Mk4 → Q, Trezor Model T → Safe 3/5, Ledger uncritically recommended despite the 2020 breach and 2023 Recover controversy. A one-sweep update across security-dojo-enhanced, wallet-security-workshop, wallet-workshop, and security-risk-simulator would fix ~90% of these.

4. **Testnet3 is effectively deprecated** (testnet4 per BIP 94 in Bitcoin Core 28, signet is the more stable learning environment). testnet-practice-guide needs a ground-up update.

5. **Defunct or restricted services are listed as current**: Paxful (onramp-chooser), Caravan (sovereign-vault), Wallet of Satoshi in US (security-risk-simulator), Phoenix/Breez in US (wallet-workshop, testnet-practice-guide).

6. **Exchange-failure framing is sometimes sloppy** — QuadrigaCX was a Ponzi, not just "CEO died with the keys"; Mt. Gox was a multi-year hack plus mismanagement; FTX was outright fraud. Lumping them under "exchange hacks" (security-risk-simulator L1384) conflates distinct threat models.

7. **Unsourced statistics are common**: "20% of all bitcoin may be lost," "~60%/75%/95% success rates for different multisig setups," "$650M+ lost due to poor key management," "$120M saved by multisig," "99.98% Bitcoin uptime." Per project policy in SOURCES.md, every quantitative claim should trace to a named, verifiable source. None of these do.

8. **Inheritance-custody advice is strong** across security-risk-simulator, sovereign-vault, multisig-setup-wizard, and wallet-security-workshop. The narrative lines up with current best practice (2-of-3 with geographic distribution, documented descriptors, tested recovery). This is a strength of the batch.

9. **The Ledger Nano trust question (post-2020 breach, post-2023 Recover) is the single most important hardware-wallet ethical issue of the 2023–2026 era, and the platform should take a position** — either "Ledger is still acceptable if Recover is never enabled" or "prefer Coldcard/Trezor/BitBox/Jade for Bitcoin-only sovereignty use cases." The current silence reads as a 2019 worldview.

10. **Strike is treated inconsistently** — as an "exchange" in kyc-best-practices L208 but as a Bitcoin-only payment app in onramp-chooser. Pick a framing and apply it consistently.
