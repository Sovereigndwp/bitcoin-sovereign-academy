# Foundation 2 of 5 — Anatomy of a Bitcoin Wallet — Content Brief

> **Phase 1 Task 3 deliverable.** This brief drives the graphic-design work in Task 4 (production of the `.png` infographic). The brief locks the *content*; Task 4 locks the *visual*.

**Voice-spec compliance pre-checked** (per `docs/marketing/voice-spec.md` synthesis check):
- ✅ **Composability:** bridges pair #2 (MPB pedagogy × HNW client psychology) and pair #4 (cypherpunk ethics × consumer-grade understanding)
- ✅ **First-principles:** defines RNG → seed → key tree → signing → broadcast as primitives, then derives wallet behavior from their combination
- ✅ **Epistemic:** includes "Common misconceptions" section with steelmanned counter-positions

**Operating frame** (per voice spec §11): this artifact is **unbounded-mode** — the reader who studies it gets a *generator* (they can analyze new wallets they've never seen) not a fact list. No quizzes, no badges, no completion percentage.

---

## Hook (top of infographic)

**Tag (top-left):** `FOUNDATION 2 OF 5`

**Title:** **ANATOMY OF A BITCOIN WALLET**

**Subtitle:** *A wallet is not one thing. It's a small system that does five jobs at once.*

---

## Lead paragraph (~30 words, top-right area)

> A Bitcoin wallet is software (or hardware) that holds the parts you need to prove ownership and move bitcoin. Open one up and you'll find five components — each doing distinct work.

---

## The 5 components (the anatomy — main grid)

Each rendered as a numbered card in a 5-card grid. Same visual style as the 6-step process grid in Foundation #4 (*"From Seed Phrase to Address"*).

**1. Random number generator (RNG)**
*What it does:* produces the entropy (randomness) that becomes the seed.
*If it fails:* a weak RNG means the wallet's seed is guessable from day one — every other component built on top is compromised.
*Icon hint:* a die with the orange highlight, the same icon used for "Randomness" in Foundation 3v2.

**2. Seed phrase storage**
*What it does:* turns the entropy + checksum into 12 or 24 human-readable words (BIP39); this is the human backup.
*If it fails:* losing the seed phrase loses access to every key the wallet ever derives.
*Icon hint:* notepad with numbered list, same as Foundations 3 and 4.

**3. Key derivation engine**
*What it does:* turns the seed into a tree of private keys (BIP32 hierarchical deterministic structure). One seed → millions of derived keys.
*If it fails (or differs between wallets):* "the same 12 words" can produce different wallets if the derivation paths differ.
*Icon hint:* tree branching, gold/orange.

**4. Signing engine**
*What it does:* uses a private key to sign transactions — proof you have the right to spend.
*If it fails:* the wallet can read balances but cannot move funds.
*Icon hint:* signature + key, same orange palette as Foundation 5's signing icon.

**5. Network interface**
*What it does:* broadcasts signed transactions, queries balances, watches addresses for incoming payments.
*If it fails:* the wallet can sign but cannot transmit. (This is *intentional* on air-gapped signing devices.)
*Icon hint:* broadcast tower or network nodes — same as Foundation 1's "Broadcast" step.

---

## How they combine (mid-section, derivation arc)

A horizontal arrow flow showing the chain:

```
RNG  →  Seed phrase  →  Key derivation  →  Signing  →  Network
       (human backup)    (BIP32 tree)
```

**Caption beneath the arc** (~25 words):

> *Five separate jobs in one chain. Strong randomness becomes a backup, becomes a key tree, becomes a signature, becomes a transaction. Every step depends on the one before.*

This is the **Turing-complete moment** of the infographic — once the reader sees the chain, they can reason about new wallets they've never used. (Voice spec §11 unbounded mode in action.)

---

## Common misconceptions section (4 entries, mirroring Foundation 3v2 layout)

Each rendered as a red-X mistake → green-check correction, same visual style as Foundation 3v2's "What people usually get wrong" block.

**1.** *"My wallet stores my bitcoin."*
→ **Better:** Bitcoin lives on the network. Your wallet stores the *keys* that let you move it.

**2.** *"Hot vs cold is the only safety distinction that matters."*
→ **Better:** The components matter more. A cold wallet with a weak RNG isn't safe; a hot wallet with strong key isolation can be safer than you'd guess. The categories oversimplify what's actually happening inside.

**3.** *"All wallets that take 12 words are equivalent."*
→ **Better:** Different wallets implement different derivation paths, address types, and passphrase models. Same words, different wallet ≠ contradiction. (Connects to Foundation #3's "different passphrase + same words = different wallet.")

**4.** *"My wallet's password protects my bitcoin."*
→ **Better:** The password protects access to the wallet *software* on a single device. The seed phrase is what protects the bitcoin across all devices, all time, all situations.

---

## Key takeaway (footer band)

**Format:** orange callout band at bottom, same as the existing Foundations.

**Text:**

> **KEY LESSON**
> *Five parts. One job: prove you can move bitcoin without giving away how.*

---

## Footer line (brand convention — every infographic)

**Center-bottom, small:**

`Created by Dalia | bitcoinsovereign.academy`

With the BSA Bitcoin-shield logo, same as Foundations 1, 3v2, 4, 5.

---

## Visual constraints (binding contract for Task 4)

Same visual style as Foundations 1, 3v2, 4, 5. Specifically:

- **Color palette:**
  - Background: `#000000` to `#1a1a1a` gradient (dark)
  - Primary accent: `#f7931a` (BSA orange)
  - Secondary: yellow `#facc15` for callout text
  - Section accents: orange/gold for primitives; muted blues/purples for diagrams; red `#ef4444` for "if it fails"; green `#22c55e` for "Better"
- **Typography:**
  - Same headline / body / caption fonts as siblings
  - Title weight: heaviest available; subtitle medium-weight italic
- **Layout:**
  - Aspect ratio **1024 × 1536 (portrait)** — matches Foundations 1, 4, 5
  - Header band (top ~20%): tag + title + subtitle + lead paragraph
  - Main 5-card grid (next ~40%): the 5 components, equal cells
  - Derivation arc (next ~10%): horizontal arrow flow + caption
  - Misconceptions block (next ~20%): 4 mistake → better rows
  - Key lesson band (next ~5%): orange callout
  - Footer (bottom ~5%): brand attribution
- **Footer:** *Created by Dalia | bitcoinsovereign.academy* + BSA Bitcoin-shield logo, exactly as on siblings

---

## Source-of-truth derivation references

For the user's reference while authoring the visual — these are the standards underlying each component (cite/link in production if there's room, otherwise omit and trust the reader to verify):

- **BIP32** (HD wallets): [github.com/bitcoin/bips/blob/master/bip-0032.mediawiki](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- **BIP39** (seed phrase encoding): [github.com/bitcoin/bips/blob/master/bip-0039.mediawiki](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- **BIP44 / BIP84 / BIP86** (derivation paths for different address types): same repo
- Reader-friendly walkthroughs: [learnmeabitcoin.com](https://learnmeabitcoin.com)

These are not citations *on* the infographic — too much noise. They're for the user's reference while drafting and for the user's confidence that every claim derives from a published primitive.

---

## Where Foundation #2 sits in the unbounded curriculum

The 5-Foundations series is itself an unbounded artifact (per voice spec §11):

- After understanding all 5, the reader has a **generator** for analyzing wallets they've never seen — not a memorized list
- Each Foundation opens onto the next: #1 (network distinction) → #2 (anatomy) → #3 (recovery vs signing) → #4 (seed-to-address derivation) → #5 (transaction lifecycle)
- The series ends but the reading does not — these are entry doors to actual custody decisions, not a closed curriculum

Foundation #2 specifically opens the door from "what a wallet *is*" (#1) to "what a wallet *contains*" — and once that door is open, #3 (the recovery/signing distinction inside #2's components) and #4 (the path from seed to address inside #2's derivation engine) follow naturally.

---

## Self-check before handing to Task 4

Before producing the PNG (Task 4), verify the brief one more time against the voice-spec synthesis check:

- [ ] **Composability:** Do the 5 components and the derivation arc visibly bridge ≥1 named pair? *(Yes — pair #2 + #4)*
- [ ] **First-principles:** Does the derivation chain show *each step* from primitive (RNG) to outcome (broadcast transaction)? *(Yes — five labeled steps + caption)*
- [ ] **Epistemic:** Does the misconceptions section steelman the wrong views before correcting? *(Yes — each "Better" reframes rather than dismisses)*
- [ ] **Unbounded mode:** Does the artifact yield a generator, not a fact list? *(Yes — once the chain is understood, the reader can reason about new wallets)*

If any check fails, revise the brief before opening the design tool.

---

## Source

- Phase 1 spec §8.2: `docs/superpowers/specs/2026-04-28-phase-1-identity-convergence.md` (Foundation #2 topic locked)
- Phase 1 plan Task 3: `docs/superpowers/plans/2026-04-28-phase-1-identity-convergence-plan.md`
- Voice spec: `docs/marketing/voice-spec.md`
- Sibling infographics: Foundations 1, 3v2, 4, 5 (visual templates)
