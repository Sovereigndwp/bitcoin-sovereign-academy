# Tutor eval report — 2026-04-26

**Candidate model:** `claude-sonnet-4-6`
**Judge model:** `claude-opus-4-7` (adaptive thinking)
**SYSTEM_PROMPT size:** 15,109 chars (~3777 tokens)
**Test cases:** 12

## Summary

- ✅ Pass: 12
- ⚠️ Marginal: 0
- ❌ Fail: 0

## Dimension averages (0-10)

| Dimension | Avg | N |
|---|---|---|
| socratic_adherence | 8.58 | 12 |
| technical_accuracy | 8.58 | 12 |
| persona_fit | 8.92 | 12 |
| length_discipline | 8.58 | 12 |

## Per-case results

### skeptic-energy — Skeptic — wasted-energy objection

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 7
- persona_fit: 9
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strongest: reframes 'waste' via falsifiable benchmark question; weakest: banking 4-5x energy claim is contested and citation is loosely hedged.

<details><summary>Candidate response</summary>

```
That's a serious objection and it deserves a serious test — not a dismissal.

Let's run your claim through its own logic, because "waste" is doing a lot of work in that sentence.

When you say the energy is wasted, you're implying there's no valuable output. So let's make that falsifiable: what *would* count as a valuable output for an energy expenditure?

Consider: gold mining consumes enormous energy — drilling, refining, shipping, vaulting — to produce a metal whose primary modern use is storing value, not industrial application. Most economists don't call that "waste." They call it the *cost of trustworthy scarcity*.

Now here's the data point worth sitting with: the traditional banking system — buildings, ATMs, data centers, card networks, armored vehicles, compliance departments — consumes an estimated **4–5x more energy than Bitcoin** annually (Galaxy Digital, 2021; Cambridge Centre for Alternative Finance data supports the order of magnitude). Bitcoin currently secures roughly **$1–2 trillion** in value with no trusted intermediary, no bailouts, no headquarters.

So the real question isn't "does Bitcoin use energy?" — obviously yes. The sharper question is: *energy per unit of what?*

Here's what I'd genuinely like you to test: **what specifically would the energy need to produce** — and in what quantity — **for you to consider it non-wasteful?** Name the benchmark, and let's measure Bitcoin against it.
```

</details>

---

### hurried-secure-now — Hurried — move BTC off exchange NOW

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 8
- persona_fit: 9
- length_discipline: 10
- language_match: ✓ true

**Judge notes:** Strongest: tight, imperative opener with a single clarifying question fitting the hurried persona; weakest: skips a brief safety nudge like verifying small test send first.

<details><summary>Candidate response</summary>

```
Good. You have the right instinct. Let's move fast.

**What hardware wallet do you have?** (Ledger, Trezor, Coldcard, Foundation Passport, or something else?)

While you answer — make sure your device is set up and you can see a **receive address** on its screen. That address is where we're sending your Bitcoin.
```

</details>

---

### spanish-privkey — Spanish — what is a private key?

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 10
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strong Socratic framing with relatable physical-world analogies; slightly long with multiple stacked questions that could overwhelm before learner answers.

<details><summary>Candidate response</summary>

```
Buena pregunta para comenzar. Antes de ir directo a la respuesta, quiero entender desde dónde partes.

Piensa en esto: cuando tienes algo valioso en el mundo físico — una casa, una caja fuerte, una bicicleta — ¿qué es lo que te da *control* sobre esa cosa? ¿Qué es lo que te distingue a ti, como dueño, de cualquier otra persona?

Casi siempre hay algún tipo de **secreto** o **instrumento único** que solo tú posees. Una llave física, una firma, un código.

Ahora imagina que tus bitcoins no están en ningún banco ni en ningún servidor — están registrados en un libro contable global que nadie controla. No hay un cajero humano que pueda verificar que eres tú. No hay una contraseña que puedas recuperar llamando al servicio al cliente.

Entonces la pregunta se vuelve interesante: ¿cómo demuestra la red Bitcoin que *tú* eres el dueño legítimo de ciertos fondos, sin que nadie tenga que confiar en tu palabra?

¿Qué se te ocurre? ¿Qué tipo de "objeto" o "mecanismo" necesitaría existir para que eso fuera posible?
```

</details>

---

### stuck-learner-escalation — Stuck-learner escalation — "just tell me"

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 9
- persona_fit: 8
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong: acknowledges effort and explains directly with vivid scale analogy. Weakest: ends with another Socratic probe, partially reopening the loop after escalation.

<details><summary>Candidate response</summary>

```
Fair enough — you've given it a real shot, and that's the right instinct.

A **private key** is just a massive secret number. Imagine a combination lock, but instead of choosing from 0–99, you're choosing a number from 0 to 2²⁵⁶ — that's a 1 followed by 77 zeros. More possibilities than there are atoms in the observable universe. That's why no one can guess yours.

That number is generated randomly on your device and never needs to leave it. From that one secret number, Bitcoin can mathematically derive your **public address** — the thing you share with others so they can send you bitcoin. But the math only works one way: forward is easy, backward is practically impossible.

Think of it like a padlock you can hand to anyone open. They can snap it shut (send you bitcoin), but only you have the key to open it (spend it).

The critical thing: whoever holds that number *is* the owner of the bitcoin. There's no bank to call if you lose it, no password reset.

Here's what I'd love for you to sit with: if your private key is just a number on a device, what do you think happens to your bitcoin if that device breaks or gets lost?
```

</details>

---

### module-aware-custody — Module-aware — custodial vs self-custody

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 7
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong analogy and Socratic pivot to 'keys'; weakest point is omitting concrete exchange-failure precedent (FTX/Mt Gox) to ground the risk.

<details><summary>Candidate response</summary>

```
That's a situation a lot of people find themselves in — and the fact that you're asking the question is already a good sign.

Let me turn it around with something familiar. Imagine you have some cash, and instead of keeping it in your wallet, you hand it to a friend and say *"hold this for me."* Your friend gives you a receipt. You trust your friend, so it feels fine.

Now — who actually *has* the money in that scenario?

When you hold Bitcoin on Kraken, something very similar is happening. Kraken holds the actual Bitcoin. What you have is Kraken's *promise* that they'll give it to you when you ask.

This raises an interesting question that Bitcoin people think about a lot: what's the difference between *having* something and *being promised* something?

There's even a saying in the Bitcoin world — **"not your keys, not your coins"** — and it points at something specific about how Bitcoin actually works technically. The word "keys" is doing a lot of work in that phrase.

What do you think a "key" might refer to in Bitcoin? Take your best guess — even if it's just an intuition.
```

</details>

---

### altcoin-curious — Altcoin redirect — curious persona

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong: opens with a Socratic reframing about money's properties without dismissing ETH; Weak: never explicitly names Ethereum again, slightly deferring the comparison.

<details><summary>Candidate response</summary>

```
That's a question worth sitting with carefully — because the differences run deeper than most people realize.

Before we compare them, let me ask you something: when you think about what makes money *trustworthy*, what comes to mind? Like, why do you trust (or distrust) the dollars in your pocket right now?

I ask because the answer to "why Bitcoin over Ethereum" actually depends heavily on *what you think money needs to be*. Two people can look at the same two systems and reach opposite conclusions — based entirely on what they think money's job is.

Here's a small thought experiment to start: imagine you're designing a savings account that you want to still be meaningful in 30 years. What's the one property you'd absolutely need to guarantee about it?
```

</details>

---

### altcoin-skeptic — Altcoin engagement — skeptic persona (different behavior!)

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 8
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong steelman + falsifiable framing; weakest moment is the slightly imprecise 'changed monetary policy three times' claim without specifics.

<details><summary>Candidate response</summary>

```
Fair question — and one worth taking seriously rather than dismissing.

Let's start with what you're actually comparing, because "why not Ethereum" can mean several different things depending on what you think Bitcoin *is for*.

So let me steelman the Ethereum case first: it has smart contracts, a large developer ecosystem, faster iteration, and has already shipped major protocol changes (the merge to Proof of Stake, EIP-1559 fee burning, multiple hard forks). If you want a programmable global computer, that's a real value proposition.

Now here's where it gets interesting. Ethereum has changed its monetary policy at least three times. Bitcoin has never changed its 21 million cap — not once in 15 years, through enormous political and financial pressure to do so (per the block size wars, 2015–2017).

That's not a trivial difference if you're thinking about *money specifically* rather than programmable infrastructure.

Here's a falsifiable test: **what properties do you actually need from money that you don't need from a general-purpose platform?**

Aristotle identified a few: durability, portability, divisibility, fungibility — and crucially, **scarcity**. Hayek added *credibility of the rule* — meaning, a monetary system you can trust won't be changed by whoever controls the protocol.

So here's the question I'd put to you: if a monetary asset's issuance schedule has already been changed multiple times by a core team, what does that tell you about who actually controls it — and does that matter to you?
```

</details>

---

### citation-current-supply — Truth-over-trust — defer to live data

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strongest: defers to mempool.space and cites block 887,023 with correct 3.125 BTC reward; weakest: '450 new bitcoins/day' is slightly rough (~450 is fine).

<details><summary>Candidate response</summary>

```
That's a live question with a live answer — and the network itself is the most honest source to check.

Here's what we know with certainty from the protocol: Bitcoin was designed with a hard cap of exactly **21,000,000 BTC**, written into the rules that every node on the network enforces. The system started issuing 50 BTC with every new block back in January 2009, and that reward **halves** every 210,000 blocks — roughly every four years.

We're currently at block 887,023. The most recent halving happened in April 2024, so miners are now earning **3.125 BTC** per block. That's about 450 new bitcoins entering existence every single day — but slowing down over time.

For the precise circulating supply *right now*, the most trustworthy place is mempool.space — it reads directly from the chain rather than relying on anyone's word.

But here's something worth sitting with: not all "existing" bitcoins are the same. Some are actively circulating. Some haven't moved in over a decade. Some are almost certainly lost forever — locked in addresses whose keys no one has.

So maybe the more interesting question isn't just *how many exist*, but...

What do you think it means for Bitcoin's scarcity if a meaningful portion of those 21 million coins can never actually be spent?
```

</details>

---

### depth-calibration-expert — Depth calibration — expert BIP32 question

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 10
- persona_fit: 10
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strongest: precise hardened/non-hardened HMAC inputs and IL/IR split with invalid-index check; weakest: Socratic question comes only at the end after heavy exposition.

<details><summary>Candidate response</summary>

```
Good timing to verify the fundamentals — the hardened vs non-hardened split is where most implementation bugs live.

**BIP32 child key derivation** (per [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)) works as follows:

**Input to HMAC-SHA512** is the key difference:

- **Non-hardened** (`index < 0x80000000`): `HMAC-SHA512(Key=parent_chain_code, Data=ser_P(parent_pubkey) || ser_32(index))`
- **Hardened** (`index >= 0x80000000`, i.e., `index'`): `HMAC-SHA512(Key=parent_chain_code, Data=0x00 || ser_256(parent_privkey) || ser_32(index))`

The HMAC output is 64 bytes. Split it exactly at byte 32:
- **Left 32 bytes** (`IL`): used to derive the child key
- **Right 32 bytes** (`IR`): becomes the child chain code

For child private key derivation: `child_privkey = (parse_256(IL) + parent_privkey) mod n` where `n` is the secp256k1 curve order. If `parse_256(IL) >= n` or `child_privkey == 0`, that index is **invalid** — increment and retry.

**Things to verify specifically:**
- Is your `ser_32(index)` big-endian? It must be.
- For hardened, are you prepending exactly one `0x00` byte before the private key scalar (not the WIF-encoded key)?
- Are you splitting the HMAC output at byte index 32 (not 31 or 33)?

What does your current HMAC input look like for a hardened derivation — can you share the byte construction you're doing?
```

</details>

---

### no-lecture-opener — Forbidden openers — "Great question!" etc.

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 10
- technical_accuracy: 9
- persona_fit: 10
- length_discipline: 7
- language_match: ✓ true

**Judge notes:** Strongest: vivid inflation thought-experiment engages curiosity; weakest: slightly long with multiple question clusters that could overwhelm a beginner.

<details><summary>Candidate response</summary>

```
Think about the last time you held cash — a bill, a coin. Who decided it was worth something? Who printed it?

Now here's a question worth sitting with: **what actually gives money its value?** Not the paper, not the ink — but the *trust* behind it.

Fiat money (the word "fiat" is Latin for "let it be done") gets its value from a government decree. A central authority — a treasury, a central bank — decides how much exists, and can decide to make more. You've probably seen news about central banks "printing money" or raising interest rates. That power sits in a small number of hands.

Here's a thought experiment: imagine you had a savings account, and every year, someone could quietly add more bills to every other account in the country — diluting the purchasing power of yours — without asking you. What would you call that? Is it more like a tax? A slow leak?

Bitcoin was designed with a radically different idea — that *the rules of money shouldn't require trusting any single person or institution.* Its supply is determined by code, not committees. Per Nakamoto (2008), the whitepaper describes a system where anyone can verify the rules independently.

But before we go further — what do *you* already know, or suspect, about how governments control money today? What have you noticed in your own life about prices, savings, or purchasing power over time?
```

</details>

---

### emergency-direct — Emergency-kit context — direct mode

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 8
- persona_fit: 7
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strongest: correctly separates 'wrong address' vs 'stuck' and points to mempool.space; weakest: asks too many questions at once instead of taking direct action.

<details><summary>Candidate response</summary>

```
Two separate problems worth untangling — let's make sure we solve the right one.

"Sent to wrong address" and "stuck unconfirmed" are actually different issues with different fixes. Which one is your immediate priority right now?

But first, one quick clarifying question that changes everything: **is the transaction still unconfirmed in the mempool, or does it already show at least 1 confirmation?**

You can check by pasting your transaction ID into **mempool.space** — it will show clearly whether it's pending or confirmed.

Tell me what you see there, and also: did you mean to send to the wrong address (typo, copied incorrectly), or are you most worried about the stuck part? That will tell us exactly which problem to tackle first.
```

</details>

---

### bip39-citation — BIP39 citation behavior

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 10
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strongest: precise technical breakdown of both phases with correct bit math; weakest: Hayek tangent feels slightly forced but fits principled persona.

<details><summary>Candidate response</summary>

```
The mechanism here is concrete enough to lead with directly.

**BIP39** works in two distinct phases (per the BIP39 specification, Palatinus et al., 2013):

**Phase 1 — Entropy to Mnemonic:**
You start with 128 bits of random entropy (for 12 words). A checksum is appended — the first 4 bits of SHA-256(entropy) — giving 132 bits total. Those bits are split into 12 groups of 11 bits each. Every 11-bit value (0–2047) indexes one word from a fixed 2048-word list. That's why 2¹¹ = 2048 words exist: the list size is not arbitrary, it's the exact cardinality needed to encode 11 bits per word.

**Phase 2 — Mnemonic to Seed:**
The 12 words are fed into **PBKDF2-HMAC-SHA512** — a key-stretching function — with your optional passphrase as the salt, run for exactly **2048 iterations**, producing a **512-bit seed**. That seed then enters BIP32's HD derivation to generate your entire key tree.

The 2048 iterations are deliberate friction: fast enough for legitimate wallets, slow enough to make brute-force guessing of a partial mnemonic computationally expensive.

Notice that the 12 words themselves are not the seed — they're an encoding of entropy that *generates* the seed through a one-way function.

Here's what I find philosophically striking about this design: Hayek argued that information in complex systems must be *compressed* into signals that individuals can act on without needing to understand the underlying complexity. Your 12 words are exactly that — a human-legible compression of a mathematical object that controls everything. What does it mean to you that *sovereignty over wealth* reduces to memorizing a sentence?
```

</details>

---
