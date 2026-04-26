# Service status — current vs retired

> Source of truth for which Bitcoin services, wallets, and exchanges are safe to recommend
> in BSA content. Cross-referenced by `scripts/check-defunct-services.mjs` (CI lint).
>
> **Verify truth before adding entries.** This file should grow only after a real status change
> is confirmed against primary sources (project's own announcement, court filing, news of record).
> When in doubt, leave the entry out.

**Last reviewed:** 2026-04-26.

---

## How to use this file

- **Authors / editors:** before adding a tool, wallet, exchange, or coordinator name to a demo,
  module, or recommendation list, check the **Retired** and **Restricted** sections below.
- **Demo / module updates:** if you remove a retired service from current-recommendation copy,
  keep a brief historical note explaining why — that's both honest and good pedagogy.
- **CI lint:** the lint flags any reference to a Retired service that isn't accompanied by
  historical-context phrases (e.g., "shut down", "seized", "archived", "bankrupt", "historical")
  within ~300 characters. If a reference is intentional and the lint is a false positive,
  add the file to the allowlist in `scripts/check-defunct-services.config.mjs`.
- **Updating this file:** when a service status changes, update both this file *and*
  `scripts/check-defunct-services.config.mjs` in the same commit so CI stays in sync.

---

## 🔴 Retired — do not list as current

These should never appear in "tools you can use today" lists, dropdowns, or recommendation
tables. Historical references (e.g., explaining why custody self-sovereignty matters) are fine
*if* the historical status is made explicit in the same passage.

| Service | Status | Date | Notes |
|---|---|---|---|
| **Samourai Wallet** | Seized | 2024-04-24 | US DOJ seized servers, indicted founders for unlicensed money transmission. App and Whirlpool coordinator stopped operating same day. |
| **Whirlpool** (Samourai's CoinJoin) | Discontinued | 2024-04-24 | Coordinator went dark with the DOJ seizure. Sparrow Wallet 1.9.0 removed its Whirlpool integration the same evening. |
| **Wasabi (zkSNACKs coordinator)** | Discontinued | 2024-06-01 | zkSNACKs Ltd shut the coordinator down citing sanctions-compliance risk. Wasabi Wallet 2.x still ships as software but has no default coordinator. Ginger Wallet (community fork) runs its own. |
| **Caravan** | Archived | 2023-12 | Unchained archived the public Caravan repo. The hosted UI may still resolve, but the project is unmaintained. Use Sparrow / Specter / Electrum / Nunchuk for new multisig setups. |
| **FTX** | Bankrupt | 2022-11 | Filed Chapter 11 November 2022. Founders convicted of fraud. Only acceptable as a historical example of custody risk. |
| **Celsius** | Bankrupt | 2022-07 | Filed Chapter 11 July 2022. Wind-down ongoing. Historical-only. |
| **Voyager** | Bankrupt | 2022-07 | Filed Chapter 11 July 2022; assets liquidated. Historical-only. |
| **BlockFi** | Bankrupt | 2022-11 | Filed Chapter 11 November 2022 in the FTX contagion. Historical-only. |
| **Mt. Gox** | Collapsed | 2014-02 | The original "exchange that loses your coins" cautionary tale. Historical-only; trustee distribution still ongoing. |
| **QuadrigaCX** | Collapsed | 2019-01 | Founder died; ~$190M CAD in customer funds unrecoverable. Historical-only. |
| **Paxful (original)** | Shut down | 2023-04 | Original Paxful Inc. shut down April 2023. A successor product launched late 2023 under new ownership; treat the brand cautiously and link only with explicit "relaunched under new ownership" context. |

---

## 🟡 Restricted — list only with jurisdiction caveat

These services are operational but withdrew from major markets (notably US). Do not list them
as a default recommendation without flagging the geographic restriction.

| Service | Restriction | Date | Notes |
|---|---|---|---|
| **Phoenix Wallet** (ACINQ) | Withdrawn from US | 2024-05 | ACINQ pulled Phoenix from US App/Play stores citing FinCEN's proposed money-transmitter guidance. Still available elsewhere. |
| **Wallet of Satoshi** | Withdrawn from US | 2024-04 | Pulled US users in April 2024. Still operates in other regions. |
| **Strike** | US-focused with international | varies | Available in many countries but feature parity differs by region; check current coverage before recommending. |

---

## 🟢 Currently operational — safe to recommend

> "Currently" means *as of this file's "Last reviewed" date.* These names should still be
> sanity-checked when authoring content. Inclusion here is a green light to **list**,
> not an endorsement of any specific configuration.

**Self-custody wallets (desktop):**
- Sparrow Wallet — active maintenance, signet/mainnet, hardware-wallet integration
- Specter Desktop — active maintenance, multisig-focused
- Electrum — long-running, battle-tested
- Bitcoin Core — reference implementation

**Self-custody wallets (mobile / cross-platform):**
- BlueWallet — active maintenance
- Nunchuk — active maintenance, mobile + desktop, multisig-friendly
- Mutiny Wallet — Lightning-focused, self-custodial
- Aqua Wallet — Lightning + Liquid

**CoinJoin / privacy:**
- JoinMarket — decentralized maker/taker market, no central coordinator
- Ginger Wallet — community-maintained Wasabi fork running its own coordinator

**Exchanges / onramps (US-available, self-custody-friendly):**
- River — US, withdraw-friendly
- Strike — US (with international footprint, see Restricted)
- Swan Bitcoin — US, withdraw-friendly DCA
- Kraken — US, withdraw-friendly
- Cash App — US, Bitcoin-only on the BTC side
- Coinbase — US, large surface area; check current fee structure
- Bisq — fully decentralized P2P (no KYC)
- Bitrefill — gift-card → Bitcoin (no traditional KYC)
- Robosats — federated P2P over Lightning

**Hardware wallets (active product lines):**
- COLDCARD — Coinkite
- Trezor Model T / Safe 3 / Safe 5 — SatoshiLabs
- Ledger Nano S+ / Nano X / Stax / Flex — Ledger
- BitBox02 — Shift Crypto
- Foundation Passport — Foundation Devices
- Jade — Blockstream
- SeedSigner — open-source DIY (build it yourself)

---

## Adding or changing entries

1. **Confirm against a primary source.** A tweet is not enough; cite the project's own
   announcement, a court filing, or a news outlet of record.
2. **Update both files in one commit.** This file *and* `scripts/check-defunct-services.config.mjs`.
3. **If you're moving a service into "Retired,"** grep the codebase for the name and either
   (a) remove it from current-recommendation copy, (b) add explicit historical context, or
   (c) add the file to the lint allowlist with a comment explaining why.
4. **Update "Last reviewed"** at the top of this file when you do a full pass.
