# Tutor eval report — 2026-04-26

**Candidate model:** `claude-sonnet-4-6`
**Judge model:** `claude-opus-4-7` (adaptive thinking)
**SYSTEM_PROMPT size:** 14,222 chars (~3556 tokens)
**Test cases:** 12

## Summary

- ✅ Pass: 11
- ⚠️ Marginal: 0
- ❌ Fail: 1

## Dimension averages (0-10)

| Dimension | Avg | N |
|---|---|---|
| socratic_adherence | 7.75 | 12 |
| technical_accuracy | 7.92 | 12 |
| persona_fit | 8.50 | 12 |
| length_discipline | 8.42 | 12 |

## Per-case results

### skeptic-energy — Skeptic — wasted-energy objection

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 8
- persona_fit: 9
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strongest: steelmans objection and reframes with comparative energy data; weakest: figures presented without explicit source caveats beyond 'estimated'.

<details><summary>Candidate response</summary>

```
That's a serious claim — and it deserves a serious test, not a cheerleader's rebuttal.

Before we run it, let me steelman it for you: Bitcoin miners worldwide consume roughly 100–150 TWh of electricity per year. That's comparable to countries like Argentina or the Netherlands. If that energy produces nothing of value, that's a genuine ethical problem. The objection is reasonable on its face.

But "no real purpose" is doing a lot of work in that sentence — and that's where the logic gets interesting.

Here's a test worth running: every large energy-consuming system gets evaluated by what it *secures or produces* relative to what it consumes. The global banking system — data centers, branches, ATMs, armored cars, server farms — consumes an estimated 250+ TWh/year. Gold mining runs roughly 100–130 TWh/year, plus enormous physical and chemical byproducts.

That's not a "Bitcoin wins" declaration. It's a framing question.

If we're going to evaluate Bitcoin's energy use as wasteful, we need a consistent measuring stick — not a selective one.

So here's what I'd want you to sit with: **what exactly is Bitcoin's energy purchasing?** Not "what does Bitcoin do" in general — but what does that specific Proof of Work computation *provide* that couldn't be provided more cheaply?

What's your instinct on that?
```

</details>

---

### hurried-secure-now — Hurried — move BTC off exchange NOW

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 9
- persona_fit: 8
- length_discipline: 10
- language_match: ✓ true

**Judge notes:** Strongest: smart gating question on wallet setup state prevents unsafe sends; weakest: no explicit small test-transaction warning yet, deferred to next turn.

<details><summary>Candidate response</summary>

```
Good — you're making the right move. Let's do this step by step.

**What hardware wallet do you have?** (Ledger, Trezor, Coldcard, Jade, or something else?)

And is it already set up with a PIN and seed words written down, or still in the box?
```

</details>

---

### spanish-privkey — Spanish — what is a private key?

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 7
- language_match: ✓ true

**Judge notes:** Strongest: vivid key/safe analogy with 2^256 scale. Weakest: defines the term before fully eliciting learner's prior knowledge, mildly long.

<details><summary>Candidate response</summary>

```
Buena pregunta para empezar. Antes de responderla directamente, quiero explorar algo contigo.

Piensa en algo valioso que tienes en casa — una caja fuerte, un cajón con llave, o incluso tu billetera física. ¿Qué es lo que hace que *tú* seas el dueño de lo que hay adentro, y no otra persona?

No es el objeto en sí. Es que **tú tienes la llave** y nadie más la tiene.

Ahora imagina que esa llave no es un objeto físico, sino un número. Un número tan grande y tan único que la probabilidad de que otra persona genere el mismo número es prácticamente cero — estamos hablando de un número con 77 dígitos de posibilidades (2²⁵⁶, para ser precisos). Más combinaciones posibles que átomos hay en el universo observable.

En Bitcoin, una **clave privada** funciona exactamente así: es ese número secreto que prueba que *tú* eres el dueño de ciertos bitcoins. Quien tenga ese número, tiene el control. Quien no lo tenga, no puede hacer nada.

No hay banco que te la pueda recuperar. No hay "olvidé mi contraseña". Si la tienes, tienes acceso. Si no, no.

Esto cambia algo fundamental respecto a cómo estamos acostumbrados a pensar sobre el dinero y la propiedad.

¿Qué crees que pasa entonces cuando alguien te dice "tengo bitcoins en un exchange" — realmente tiene la clave privada, o tiene algo diferente?
```

</details>

---

### stuck-learner-escalation — Stuck-learner escalation — "just tell me"

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 9
- persona_fit: 8
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strongest: clear direct definition with vivid scale analogy after acknowledging effort; weakest: ends with another Socratic question, partially re-engaging the loop after escalation.

<details><summary>Candidate response</summary>

```
You've been circling around it with the right instincts — "a code that's hard to guess" is actually a really solid starting point.

Here's the direct answer, built on what you said:

A **private key** is essentially a secret number. Specifically, it's a randomly generated number between 1 and roughly 2²⁵⁶ — that's a 1 followed by 77 zeros. To put that in perspective, there are estimated to be about 10⁸⁰ atoms in the observable universe. Your private key is chosen from a pool *larger* than that.

Because of that enormous size, no one can guess yours. Ever. Not even with every computer on Earth working for billions of years.

In Bitcoin, whoever holds the private key controls the bitcoin associated with it. There's no bank, no password reset, no customer service. The key *is* the proof of ownership — like if your house key were the only one in existence and there was no locksmith in the world who could make another.

That's why you'll hear the phrase "not your keys, not your coins."

Now here's a fun thing to test that understanding: if the private key is just a secret number, what do you think *other people* need to know in order to *send you* bitcoin — without ever seeing your private key?
```

</details>

---

### module-aware-custody — Module-aware — custodial vs self-custody

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 7
- persona_fit: 9
- length_discipline: 10
- language_match: ✓ true

**Judge notes:** Strong Socratic opener probing custody mental model; weakest point is no hint yet at exchange-risk precedent (FTX/Mt Gox) to ground stakes.

<details><summary>Candidate response</summary>

```
That's a really common situation — and the fact that you're asking the question means you're already thinking about something important.

Let me ask you this: when you log into Kraken and see your Bitcoin balance, what do you think is actually happening behind the scenes? Like, where do you picture that Bitcoin *living*?
```

</details>

---

### altcoin-curious — Altcoin redirect — curious persona

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 7
- language_match: ✓ true

**Judge notes:** Strong: framing money's purpose as the lens for comparison; Weak: asking two stacked questions (initial probe + ranking) makes it slightly long.

<details><summary>Candidate response</summary>

```
That's a question worth sitting with — and it touches something real.

Before diving in, let me ask: when you look at the two, what's the main thing that makes Ethereum seem like a compelling alternative to you? Is it the technology, the use cases, the community, something else?

The reason I ask is that "why Bitcoin instead of X" actually has very different answers depending on what *problem* you think money needs to solve. So understanding what draws you to Ethereum helps us think through the right comparison.

But let me plant one seed while you think about that: Bitcoin was designed with a very specific, narrow purpose — to be **hard money** that no one can control or inflate. Ethereum was designed with a different goal entirely: to be a programmable world computer.

Here's a thought experiment to start us off. Imagine you had to pick one property as the *most important* thing money should have — scarcity, programmability, speed, decentralization, stability. 

If you had to rank just those five, which would you put at the top — and why?
```

</details>

---

### altcoin-skeptic — Altcoin engagement — skeptic persona (different behavior!)

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 7
- persona_fit: 8
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong PoS stake-concentration question engages skeptic well; weakest point is missing concrete data on issuance schedules, fork history, or client decentralization.

<details><summary>Candidate response</summary>

```
That's a comparison worth taking seriously — let's actually stress-test it rather than dismiss it.

Let me start with what you likely already know: Ethereum switched from Proof of Work to Proof of Stake in 2022 (the "Merge"). Proponents say this makes it more energy-efficient and scalable. Bitcoin people pushed back hard.

But here's the interesting question to sit with: **what problem is a monetary network actually trying to solve?**

Proof of Stake validators secure the network by *locking up capital* — they have an economic stake. Proof of Work miners secure the network by *expending real-world energy*. These are genuinely different security models.

So here's a falsifiable way to frame it: if Proof of Stake is equivalent or superior to Proof of Work for securing a monetary network, what would we expect about the distribution of stake over time? 

Think about it this way — in Proof of Stake, those who already hold the most coins have the most influence over consensus. In a physical analogy: imagine a voting system where the number of votes you get is proportional to how much money you already have. 

Does that property concern you from a monetary neutrality standpoint — or do you think it doesn't matter in practice? And if it doesn't matter, *why* not?
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

**Judge notes:** Strongest: defers to mempool.space and cites injected block height 887,023; weakest: doesn't directly answer the count, which curious learners may want.

<details><summary>Candidate response</summary>

```
That's a live, verifiable number — and the fact that *anyone* can look it up is itself part of the story.

But before we get there: think about how money works today. When you deposit $100 in a bank, does the bank keep exactly $100 sitting in a vault for you? And if not — who actually decides how many dollars exist at any given moment?

Now compare that to Bitcoin. Satoshi Nakamoto wrote into the protocol itself, back in 2008, a precise rule about how new bitcoins can ever come into existence — not a policy, not a committee decision, but code that every participant in the network enforces independently.

Here's what that rule looks like in practice: when Bitcoin launched in January 2009, each new block of transactions rewarded the miner who found it with **50 BTC**. That reward halves every 210,000 blocks — roughly every four years. The most recent halving happened in April 2024, dropping the reward to **3.125 BTC** per block. Right now, at block height 887,023, that means roughly 450 new bitcoins are being created *per day*.

The exact circulating supply at this moment is verifiable on [mempool.space](https://mempool.space) — I'd encourage you to look it up directly rather than take my word for it.

The hard ceiling written into the protocol is exactly **21,000,000 BTC** — ever.

What do you think happens to that daily creation of 450 new bitcoins when the next halving comes around in roughly four years?
```

</details>

---

### depth-calibration-expert — Depth calibration — expert BIP32 question

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 9
- persona_fit: 10
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong: precise hardened/non-hardened data-prefix distinction and 32-byte zero-padding catch. Weak: didn't explicitly note IR becomes child chain code.

<details><summary>Candidate response</summary>

```
Good debugging instinct to isolate the HMAC-SHA512 handling specifically — that's exactly where hardened vs non-hardened diverge.

Before I give you a checklist, let me ask the question that will sharpen the diagnosis: **what are you feeding as the HMAC-SHA512 key and data for each case?**

Specifically — per BIP32, the split between hardened and non-hardened is in the *data* input, not the key. Walk me through what your code constructs for each:

- For a **non-hardened child** (`index < 0x80000000`): what bytes go into the data parameter?
- For a **hardened child** (`index >= 0x80000000`, conventionally written `i'`): what bytes go into the data parameter?

The key in both cases should be the parent **chain code** (32 bytes). The divergence is in the data prefix — one uses the compressed **public key**, the other uses `0x00 || parent_private_key`. If your implementation is swapping those, or if you're passing the wrong byte length (e.g., not zero-padding the private key scalar to exactly 32 bytes before prepending `0x00`), the HMAC output will be deterministically wrong in a way that looks random.

Also worth checking: after you split the 64-byte HMAC output into `IL` (left 32 bytes) and `IR` (right 32 bytes) — are you interpreting `IL` as a big-endian 256-bit integer before adding it to the parent key mod `n` (the secp256k1 curve order)?

What does your data serialization look like for each branch?
```

</details>

---

### no-lecture-opener — Forbidden openers — "Great question!" etc.

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 10
- language_match: ✓ true

**Judge notes:** Strongest: pivots to a concrete cash/bank analogy with a probing question; weakest: 'fascinating place to start' flirts with the banned-opener spirit.

<details><summary>Candidate response</summary>

```
That's a fascinating place to start. Before we get to Bitcoin specifically, let's build from something you already know.

Think about the cash in your wallet — or the balance in your bank app. Someone decided how much of it exists. Someone can decide to make more.

Here's a question worth sitting with: **who do you think makes that decision**, and what do you imagine guides them when they do?
```

</details>

---

### emergency-direct — Emergency-kit context — direct mode

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 9
- persona_fit: 8
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strongest: sharp disambiguation of two very different scenarios before acting; weakest: still asks a clarifying question rather than giving any immediate triage steps.

<details><summary>Candidate response</summary>

```
Those are actually two separate problems — let's make sure we're solving the right one first.

When you say the transaction is "stuck unconfirmed," do you mean:

**A)** You sent to the wrong address, the transaction confirmed, and the Bitcoin is gone — and you want to know if recovery is possible.

**B)** The transaction is genuinely unconfirmed (still pending in the mempool), and you're worried it might confirm to the wrong address before you can stop it.

Which situation are you in?
```

</details>

---

### bip39-citation — BIP39 citation behavior

**Verdict:** ❌ fail

**Scores:**
- socratic_adherence: 3
- technical_accuracy: 1
- persona_fit: 6
- length_discipline: 5
- language_match: ✓ true

**Judge notes:** Strongest: evocative framing of ownership via Szabo; weakest: zero BIP39 mechanics (no 2048 wordlist, 11 bits/word, PBKDF2) and no canonical citation.

<details><summary>Candidate response</summary>

```
There's a quiet philosophical puzzle hiding inside your question — before we get to the mechanics, let's surface it.

You have 12 ordinary words. Words from a dictionary. Words a child could memorize. And somehow, those words *are* a wallet containing potentially life-changing wealth. No bank. No account number. No authority to verify identity.

So let me ask you something foundational first: **what is a wallet, really?**

Not in the Bitcoin sense yet — just in general. When you carry a leather wallet, what does it actually *contain*? Is it the money itself? Or is it something that *represents access* to money?

And then push that one step further: if a wallet is fundamentally about *access*, what is the minimum thing you need in order to *prove* that access is yours — and yours alone?

This isn't rhetorical throat-clearing. Szabo spent years thinking about what he called **"unforgeable costliness"** — the idea that anything which functions as money or a claim to property must be hard to counterfeit but easy to verify. The 12-word seed sits squarely inside that tradition.

Once you've thought about what a wallet fundamentally *is*, the BIP39 mechanism will feel less like an engineering trick and more like a philosophical statement about the nature of ownership.

What do you think a wallet actually contains?
```

</details>

---
