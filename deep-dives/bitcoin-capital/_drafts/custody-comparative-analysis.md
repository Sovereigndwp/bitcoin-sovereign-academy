# Custody Architectures — Comparative Analysis

*How each Tier 1 BTC-backed lender actually secures the borrower's Bitcoin. Single points of failure. Proof-of-funds capability. Failure-mode mapping. Foundation document for the Loans deep dive's Custody section.*

---

## The five custody models in BTC lending

Ranked from most sovereign to least:

| Rank | Model | Example | Borrower holds keys? | Proof of funds | SPOFs for collateral movement |
|---|---|---|---|---|---|
| 1 | **Self-custody DLC** | Lava | Yes (sole authority) | Yes, real-time on-chain | None for movement |
| 2 | **Collaborative 2-of-3 multisig** | LMC (TBA), Unchained | Yes (1 of 3 keys) | Yes, real-time on-chain | None (any 2 of 3 required) |
| 3 | **Qualified custodian, ring-fenced** | Ledn Custodied | No | Periodic attestations | Custodian failure |
| 4 | **Qualified custodian, rehypothecation allowed** | Ledn Standard | No | Periodic attestations | Custodian + counterparty institutions |
| 5 | **Pooled lender custody** | Celsius, BlockFi (2022) | No | None / opaque | Lender failure (catastrophic) |

The bottom row is the 2022 cohort. It's been mostly eliminated from BTC-only lending — every Tier 1 provider in our matrix has moved past it. But it's worth knowing what failed and why so the comparisons make sense.

---

## LMC (TBA Collaborative Multisig)

### Key authority structure

2-of-3 multisignature wallet. Three keys distributed:

- **Key 1: Borrower** — held by the BTC holder personally (typically via TBA's standard onboarding: hardware wallet, seed-phrase backup, geographic distribution recommended)
- **Key 2: The Bitcoin Adviser (TBA)** — held by TBA on behalf of LMC
- **Key 3: Independent Key Agent** — held by a separate party (typically a regulated trust or qualified third party)

To move BTC from the collateral address: any 2 of these 3 keys must sign. No single party (including TBA) can unilaterally move the BTC.

### Proof of funds

**Yes, real-time, on-chain, anyone can verify.** The multisig address is public. The borrower (and anyone they share the address with) can see the balance at any time using any block explorer.

This is structurally stronger than any periodic attestation — the borrower doesn't need to trust LMC's audit cycle. They can verify continuously.

### Single points of failure for collateral movement

**None.** No single party can move the BTC.

### Failure-mode scenarios

| Scenario | What happens to the BTC |
|---|---|
| LMC / TBA becomes insolvent | Borrower + Key Agent can still recover the BTC using their 2 keys. The bankruptcy estate has no claim on the multisig (LMC never had unilateral control). |
| Borrower loses their key | TBA + Key Agent can co-sign with appropriate identity verification to recover the BTC. Standard TBA protocol covers this. |
| Key Agent fails or becomes uncooperative | Borrower + TBA can co-sign to recover the BTC. The two surviving parties cooperate. |
| 2 of 3 parties collude maliciously | Theoretically can move the BTC. Mitigated by: (a) parties are separate legal entities with fiduciary duties, (b) collusion is provably reckless and creates legal liability, (c) on-chain visibility means any movement is immediately detectable. |
| Borrower defaults on loan obligation | TBA + Key Agent can co-sign to liquidate the collateral in accordance with the loan agreement. Note: this is contractual, not unilateral. |

### Rehypothecation

**No.** TBA's product disclosure explicitly states the collateral is held, not lent out. The multisig structure makes rehypothecation operationally infeasible — TBA can't move the BTC alone to lend it to anyone.

### Bankruptcy remoteness

**Strong.** Since LMC/TBA never has sole control of the BTC, the BTC is never legally part of LMC's or TBA's balance sheet. In a bankruptcy filing, the borrower's collateral is not a claimable asset of the estate.

---

## Unchained (Collaborative Multisig)

### Key authority structure

Functionally identical to LMC: **2-of-3 multisig** with the borrower holding 1 of 3 keys. Unchained holds 1 key. An independent key agent holds the third.

This is the structure Unchained pioneered for retail Bitcoin custody starting in 2017–18. LMC adapted the same architecture for the loan product. Both share the same underlying security properties.

### Proof of funds

**Yes, real-time, on-chain.** Same as LMC — borrower can verify their specific multisig vault address at any time. Unchained provides a dashboard but the verification doesn't depend on the dashboard.

### Single points of failure

**None for collateral movement.** Identical to LMC.

### Failure-mode scenarios

Functionally identical to LMC. The differences are operational rather than structural:
- Unchained has a longer track record (since 2017)
- Different key-agent counterparty
- Different fee model and operational scale

### Rehypothecation

**No.** Unchained's marketing emphasizes "no rehypothecation" as a core differentiator.

### Bankruptcy remoteness

**Strong.** Same architecture as LMC, same outcome.

---

## Ledn (Qualified Custodian)

### Key authority structure

This is fundamentally different from the multisig models. Ledn uses a **qualified third-party custodian** (publicly disclosed as BitGo, a regulated trust company with insurance and audited cold storage).

- **Borrower keys:** None. The borrower does not hold any keys to their collateral.
- **Ledn keys:** Ledn directs operations but does not hold custody keys.
- **BitGo keys:** BitGo holds the keys in their multisig (typically 3-of-N internal multisig structure for security, but this is *internal to BitGo*, not split across Ledn / borrower / agent).

### Two product variants

**Custodied option (13.9% APR):**
- Collateral held in **segregated on-chain addresses** specifically attributable to the borrower
- Legally **ring-fenced** from Ledn's funding partner's balance sheet
- **No rehypothecation** — the collateral sits in cold storage
- In Ledn's funding partner's bankruptcy, the collateral should be returnable to borrowers via the segregated-address structure

**Standard option (12.4% APR):**
- Collateral held in BitGo custody but **Ledn can rehypothecate** — lend the BTC to institutions for yield
- The yield is what subsidizes the lower 12.4% APR vs. the 13.9% Custodied rate
- Counterparty risk: if the institution Ledn lent the BTC to fails, recovery may be impaired
- This structure has more in common with the 2022 cohort's risk profile (though Ledn survived 2022, so they appear to manage this counterparty risk competently)

### Proof of funds

**Periodic attestation, not real-time on-chain.** Ledn publishes proof-of-reserves reports periodically (typically quarterly). These are independently audited. Borrowers cannot verify their specific collateral position in real time — they trust the audit cycle.

This is a meaningful difference from the multisig models. Verification is **mediated through audit**, not **direct on-chain inspection**.

### Single points of failure

1. **Ledn's funding partner failure.** Custodied option is bankruptcy-remote in theory; Standard option has more exposure if rehypothecated counterparty also fails.
2. **BitGo failure.** BitGo is a regulated trust company with $250M insurance, audited cold storage, and a strong operational track record. Failure risk is low but non-zero.
3. **For Standard option only:** Counterparty failure at the institutions BitGo lends to on Ledn's behalf.

### Failure-mode scenarios

| Scenario | Custodied option | Standard option |
|---|---|---|
| Ledn's funding partner becomes insolvent | Collateral returned via bankruptcy-remote structure (ring-fenced addresses) | Some collateral may be trapped if rehypothecated to a counterparty also affected |
| BitGo becomes insolvent | BitGo insurance + regulatory protection apply; collateral recovery via insolvency proceeding | Same |
| Counterparty institution defaults on rehypothecation | N/A (no rehypothecation) | Loss event for Ledn; could pass through to borrowers if Ledn lacks capital to cover |
| Borrower loses access to Ledn account | KYC/identity verification recovers account access; collateral remains | Same |

### Rehypothecation

- **Custodied option: No.** Explicit non-rehypothecation, audit-verified.
- **Standard option: Yes.** This is the structural reason for the rate discount.

### Bankruptcy remoteness

- **Custodied option: Strong in theory.** Ring-fenced addresses, legal opinion on bankruptcy-remoteness.
- **Standard option: Weaker.** Rehypothecated collateral has been moved off Ledn's protected addresses; recovery in bankruptcy depends on counterparty solvency.

---

## Lava (DLC Self-Custody)

### Key authority structure

This is the most novel architecture in the matrix. Lava uses **Discreet Log Contracts (DLCs)** — an on-chain Bitcoin smart contract construct.

- **Borrower keys:** Yes — held entirely by the borrower. The DLC is funded by the borrower into a contract address.
- **Lava keys:** None over the BTC. Lava's role is to be a counterparty to the DLC, not a custodian.
- **Oracle:** A price oracle is used to trigger settlement events (e.g., if BTC drops to liquidation threshold).

The DLC encodes the loan logic on-chain. At settlement, the DLC pays out based on the oracle's attestation: either back to the borrower (loan repaid) or to Lava (default / liquidation).

### Proof of funds

**Yes, fully on-chain, fully transparent.** The DLC address is public; the borrower can see exactly what's locked. Lava cannot lie about reserves because the borrower controls the address.

This is the strongest proof-of-funds model in the matrix.

### Single points of failure

**For collateral movement: None.** The DLC contract enforces the rules; Lava cannot unilaterally take the BTC outside the contract terms.

**For protocol-level risk:**
1. **Oracle failure.** The DLC relies on a price oracle to trigger settlement. If the oracle fails or is compromised, settlement can be disrupted.
2. **DLC implementation bugs.** Newer technology; less battle-tested than multisig.
3. **Lava insolvency.** If Lava becomes insolvent while loans are outstanding, the DLC continues to run but loan servicing may be impaired. Borrowers may need to navigate complex on-chain settlement unilaterally.

### Failure-mode scenarios

| Scenario | What happens to the BTC |
|---|---|
| Lava becomes insolvent | Borrower retains full custody. The DLC runs independently. Loan obligation may become unenforceable, transferred to a receiver, or settled per the DLC's encoded terms. Risk: USD liquidity Lava was supposed to provide may stop. |
| Borrower loses their key | **BTC is lost permanently.** No recovery mechanism — Lava cannot help, because they don't have keys. This is the trade-off for full self-custody. |
| Oracle attack or failure | DLC settlement may be disrupted or manipulated. Lava has implemented oracle redundancy, but this is a category of risk that doesn't exist in multisig models. |
| Price-based liquidation triggered | DLC executes per contract: Lava receives the BTC, borrower keeps the USD already disbursed. No "margin call cure window" — settlement is automatic and on-chain. |
| Borrower defaults on loan | Same as price-based liquidation — DLC settlement executes per contract. |

### Rehypothecation

**Impossible by design.** Lava never has the keys, so they cannot lend out the BTC.

### Bankruptcy remoteness

**Strongest of all models.** Lava's bankruptcy is structurally irrelevant to the BTC — the BTC is in a DLC the borrower controls. The legal claim Lava has on the BTC is encoded in the DLC, not in Lava's balance sheet.

The trade-off: **borrower key loss = total loss of BTC.** No recovery via key agent. This is real custody risk that doesn't exist in 2-of-3 multisig.

---

## Comparative summary — what really matters

### Proof of funds

| Model | Verification | Real-time? |
|---|---|---|
| Lava (DLC) | On-chain, public | Yes |
| LMC (TBA multisig) | On-chain, public | Yes |
| Unchained multisig | On-chain, public | Yes |
| Ledn Custodied | Quarterly attestation | No |
| Ledn Standard | Quarterly attestation | No |

The multisig and DLC models give borrowers structural certainty that doesn't depend on the lender's audit cycle or honesty. **This is the deepest differentiation from the 2022 cohort.**

### Single points of failure for collateral

| Model | Catastrophic SPOF? | Mitigations |
|---|---|---|
| Lava (DLC) | Borrower's own key loss | Borrower's responsibility |
| LMC (TBA multisig) | None | Recovery via 2 of 3 keys |
| Unchained multisig | None | Recovery via 2 of 3 keys |
| Ledn Custodied | Custodian (BitGo) failure | BitGo insurance, regulated trust |
| Ledn Standard | Custodian + rehypothecation counterparty | Insurance + Ledn's underwriting |
| Pooled lender (2022) | The lender itself | None |

### What's structurally distinctive about TBA's collaborative security

What makes TBA's architecture (powering LMC) particularly strong:

1. **Borrower-held key is real custody, not nominal.** The borrower doesn't just "see" the BTC — they hold an actual signing key. They can refuse to sign any movement.

2. **Recovery without lender cooperation.** If TBA disappears entirely tomorrow, the borrower and the independent key agent can still recover the BTC. Independent counterparties = independent recovery paths.

3. **Continuous on-chain proof of funds.** Not "we audit quarterly" — verifiable second-by-second on the public blockchain.

4. **Operationally proven.** TBA has been running this architecture since 2016 with a "perfect safety record" per their public marketing. Multisig has been battle-tested across the Bitcoin space (Casa, Unchained, Onramp, etc.) for nearly a decade.

The Lava DLC model is arguably *more* sovereign (no third-party signature at all) but is newer technology and the borrower bears full key-loss risk.

The 2-of-3 multisig (TBA/Unchained) is the **sweet spot of sovereignty + recovery**: borrower has real control, no single party can move funds, but key loss is recoverable.

---

## Visual treatment for the deep dive

This analysis should appear in the Loans deep dive as **Part VI — Custody Architectures, Decoded**. Visual elements:

1. **Custody model ranking infographic** — vertical ladder showing the five models with key icons (no keys / 1 key / 2-of-3 / etc.)

2. **Per-provider custody diagram** — for each Tier 1 provider, a small SVG showing:
   - Who holds keys
   - Who can sign / verify
   - On-chain visibility status
   - The actual signature threshold (2-of-3, etc.)

3. **Failure-mode comparison table** — exactly as drafted above

4. **2022 cohort callout** — sidebar reminding readers what failed and why this matters

5. **TBA's collaborative architecture in detail** — a featured callout (since LMC is the BTC-for-BTC model) showing the 3-key distribution and recovery paths

The visual treatment should make it instantly obvious that custody is *the* most important dimension and that the providers really are different.

---

## Next steps

1. Update `providers.json` with structured custody analysis per provider (already drafted above — convert to JSON)
2. Build the SVG diagrams for the deep dive
3. Write the deep dive's Part VI section using this document as foundation
4. After Tier 2 verification, do the same custody analysis for Coinbase/Morpho, SALT, Arch, Bitfinex, Debifi

---

*Document version: 1.0 · 2026-05-11 · Tier 1 only. Tier 2 to follow.*
