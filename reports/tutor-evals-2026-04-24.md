# Tutor eval report — 2026-04-24

**Candidate model:** `claude-sonnet-4-6`
**Judge model:** `claude-opus-4-7` (adaptive thinking)
**SYSTEM_PROMPT size:** 14,222 chars (~3556 tokens)
**Test cases:** 12

## Summary

- ✅ Pass: 10
- ⚠️ Marginal: 1
- ❌ Fail: 1

## Dimension averages (0-10)

| Dimension | Avg | N |
|---|---|---|
| socratic_adherence | 7.75 | 12 |
| technical_accuracy | 7.58 | 12 |
| persona_fit | 8.67 | 12 |
| length_discipline | 7.92 | 12 |

## Per-case results

### skeptic-energy — Skeptic — wasted-energy objection

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 8
- persona_fit: 9
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strongest: reframes 'waste' as a criterion question with comparable data. Weakest: banking/gold figures are rough ranges without precise sourcing.

<details><summary>Candidate response</summary>

```
That's a serious objection, and it deserves a serious examination — not a defense, but a test.

Let's run your claim through its own logic before we accept or reject it.

You said the energy is wasted "for no real purpose." That word *purpose* is doing a lot of work there. When we say energy use has a purpose, what are we actually measuring? Presumably something like: *the value of what the energy produces* relative to *the energy consumed*.

So here's a question worth sitting with: the global banking system — data centers, branch buildings, ATM networks, armored trucks, server farms processing card transactions — consumes somewhere in the range of 100–250 TWh per year by various estimates. Gold mining consumes roughly 100–130 TWh. Bitcoin's current network consumption is approximately 120–150 TWh annually (Cambridge Centre for Alternative Finance tracks this in near-real-time, if you want to verify).

Those numbers are in the same neighborhood. But notice — you didn't call banking energy "wasted." 

So the interesting question isn't really *how much* energy Bitcoin uses. It's what standard we're applying to decide whether energy use is wasteful or purposeful.

What's the actual criterion you'd use to call one system's energy "waste" and another's not?
```

</details>

---

### hurried-secure-now — Hurried — move BTC off exchange NOW

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 9
- persona_fit: 10
- length_discipline: 10
- language_match: ✓ true

**Judge notes:** Strongest: crisp imperative opener with a gating question about wallet model; weakest: doesn't preview safety checks like test transaction.

<details><summary>Candidate response</summary>

```
Good — you're in the right place. Six steps. Let's move fast.

**Step 1: Set up your hardware wallet first** (don't send anything yet).

Which hardware wallet do you have — Ledger, Trezor, Coldcard, or something else?
```

</details>

---

### spanish-privkey — Spanish — what is a private key?

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strongest: vivid safe-combination analogy leading to a genuine question; weakest: defines 'clave privada' before probing prior knowledge, slightly undercutting Socratic ideal.

<details><summary>Candidate response</summary>

```
Buena pregunta para empezar. Vamos despacio.

Piensa en algo que ya conoces: una caja fuerte física. Para abrirla, necesitas una combinación — un número secreto que solo tú debes saber. Si alguien más aprende ese número, puede abrir la caja y tomar todo lo que hay adentro.

Ahora imagina que esa "caja fuerte" no está en tu casa sino en una red global que nadie controla. No hay banco, no hay empleado, no hay forma de llamar al servicio al cliente si pierdes tu combinación.

En ese mundo, ¿qué tan importante sería ese número secreto?

Eso es, en esencia, lo que hace una **clave privada** en Bitcoin — es *el* secreto que te da control sobre tus fondos. Sin ella, nadie puede mover tu Bitcoin. Con ella, cualquiera puede.

Pero hay algo interesante que vale la pena explorar: en Bitcoin, la clave privada no solo "abre" algo — también *demuestra* que eres tú, sin revelar el secreto en sí mismo.

Antes de explicar cómo funciona eso, cuéntame: cuando piensas en demostrar tu identidad en el mundo físico — mostrar tu cédula, firmar un documento — ¿qué problema crees que tiene ese sistema comparado con algo completamente digital y sin autoridad central?
```

</details>

---

### stuck-learner-escalation — Stuck-learner escalation — "just tell me"

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strongest: acknowledges effort and gives direct definition with vivid scale analogy; weakest: ends with another probing question, partially re-engaging Socratic loop.

<details><summary>Candidate response</summary>

```
You've been circling around it with the right instincts — "code" and "hard to guess" are exactly the right framing.

Here's the straight answer: a **private key** is a secret number. That's really it. A randomly generated number so astronomically large that no one else could ever guess it.

How large? Imagine every atom in the observable universe. Now imagine that number, then square it. A Bitcoin private key is chosen from a range of 2²⁵⁶ possibilities — that's larger than the number of atoms in the observable universe. The chances of someone guessing yours are effectively zero.

This secret number is *yours alone*, and it mathematically controls your bitcoin. Whoever holds the private key controls the funds — there's no bank, no password reset, no customer service. The number *is* the ownership.

Think of it like a physical safe. The safe (your bitcoin) doesn't know your name or your ID — it only opens for whoever has the right combination. Your private key is that combination.

Now here's something worth chewing on: if this number is so powerful, how do you think people actually store it — given that writing down a 78-digit number by hand sounds like a nightmare?
```

</details>

---

### module-aware-custody — Module-aware — custodial vs self-custody

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 7
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong Socratic opener probing learner's mental model; weakest point is no hint yet at custody/exchange risk framing (FTX/Mt Gox).

<details><summary>Candidate response</summary>

```
That's a situation a lot of people find themselves in — and the question you're asking is exactly the right one.

Let me ask you something first: when you say your Bitcoin is "on Kraken," what do you picture? Like, where do you imagine it actually *is*?
```

</details>

---

### altcoin-curious — Altcoin redirect — curious persona

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 7
- persona_fit: 9
- length_discipline: 7
- language_match: ✓ true

**Judge notes:** Strong Socratic engagement with the gift-card analogy; weakest moment is the 'gun to your head' phrasing which jars the gentle tone.

<details><summary>Candidate response</summary>

```
That's a genuinely interesting comparison to start with — most people ask "what *is* Bitcoin?" before asking "why *this* one?" So you're already thinking competitively, which is good.

Let me meet you where you are. When you picture Ethereum versus Bitcoin, what's your mental model of the difference? Like, if someone put a gun to your head and said "explain the difference in one sentence" — what would you say?

I ask because the answer to "why Bitcoin over Ethereum" depends a lot on *what you think each one is for*. Some people think they're solving the same problem. Others think they're solving completely different problems. And which camp you land in changes the answer dramatically.

Here's a small thought experiment to warm up: imagine you have two kinds of money in your pocket. One is a simple dollar bill — it does one thing, it's money, that's it. The other is a programmable gift card that can *also* run apps, execute contracts, change its own rules under certain conditions, and has a committee that occasionally updates how it works.

Which one feels more like *money* to you — and which feels more like *software*?

Sit with that for a second. What's your instinct?
```

</details>

---

### altcoin-skeptic — Altcoin engagement — skeptic persona (different behavior!)

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 8
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong: frames supply predictability as load-bearing and asks sharp governance question. Weak: omits decentralization/validator concentration and fork history specifics.

<details><summary>Candidate response</summary>

```
That's a comparison worth taking seriously — let's actually stress-test it rather than wave it away.

Let me start with what I think is the sharpest version of the argument: Ethereum is programmable, has a large developer ecosystem, and switched to Proof of Stake to reduce energy use. On the surface, that sounds like it dominates Bitcoin on multiple dimensions.

So let's run the claim through its own logic.

Ethereum's supply schedule: can you tell me, right now, what the maximum supply of ETH will be in 2040? Not asking you to know — I'm asking whether that number is *knowable in advance*, the way Bitcoin's 21 million is specified in code (per Nakamoto, 2008).

Here's why that matters: if you're evaluating something as *money* — specifically as a store of value or a savings technology — predictability of supply is arguably the most load-bearing property. Gold was trusted for millennia partly because no one could inflate it at will.

Ethereum's monetary policy has changed multiple times (EIP-1559, The Merge, various issuance adjustments). That's not a smear — it reflects a deliberate design philosophy that the protocol should evolve based on governance decisions.

The question is: **is "can be improved by governance" a feature or a vulnerability in a money system?**

What's your intuition there — and what would you need to see to change it?
```

</details>

---

### citation-current-supply — Truth-over-trust — defer to live data

**Verdict:** ⚠️ marginal

**Scores:**
- socratic_adherence: 7
- technical_accuracy: 5
- persona_fit: 8
- length_discipline: 8
- language_match: ✓ true

**Judge notes:** Strong Socratic framing and avoids stale numbers, but weakest moment: never references the injected block height 887,023 which would enable a verifiable supply answer.

<details><summary>Candidate response</summary>

```
That's one of Bitcoin's most fascinating properties — and the answer is actually verifiable by anyone on earth, right now, without asking permission from any bank or government.

But let's build toward it rather than just state a number.

You probably know that new dollar bills get printed regularly. The US Federal Reserve decides how many, and the public doesn't always find out until later. Now think about Bitcoin for a moment — if you were *designing* a currency from scratch, and you wanted people to be able to trust the supply without trusting any single institution... what kind of rule would you want to have about how new coins are created?
```

</details>

---

### depth-calibration-expert — Depth calibration — expert BIP32 question

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 9
- technical_accuracy: 7
- persona_fit: 8
- length_discipline: 6
- language_match: ✓ true

**Judge notes:** Strong leading question about byte serialization targets the classic hardened/non-hardened bug; weakest point is omitting any mention of IL/IR split or the 2^31 threshold as anchors.

<details><summary>Candidate response</summary>

```
Good question to dig into carefully — the hardened/non-hardened split is where most BIP32 implementation bugs live.

Before I point you anywhere specific: what are you feeding into the HMAC-SHA512 as the *data* input for each case? Walk me through the byte construction you're using for both a hardened and a non-hardened index — specifically what's getting prepended or serialized before the index itself.

The answer to that will tell us exactly where the divergence is happening.
```

</details>

---

### no-lecture-opener — Forbidden openers — "Great question!" etc.

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 10
- technical_accuracy: 9
- persona_fit: 9
- length_discipline: 9
- language_match: ✓ true

**Judge notes:** Strong Socratic opener inviting reflection on fiat's backing; slightly soft by not hinting at where the inquiry leads next.

<details><summary>Candidate response</summary>

```
What a rich place to start. Before we go to Bitcoin specifically, let me ask you something about the money you already use every day.

When you hold a dollar — or a peso, or a euro — what do you think *gives it value*? Like, what's actually backing it up?

Take a moment with that. There's no wrong answer here — I'm genuinely curious what your instinct says.
```

</details>

---

### emergency-direct — Emergency-kit context — direct mode

**Verdict:** ✅ pass

**Scores:**
- socratic_adherence: 8
- technical_accuracy: 9
- persona_fit: 8
- length_discipline: 7
- language_match: ✓ true

**Judge notes:** Strongest: correctly separates two problems and asks triage questions including wallet/time/access; weakest: mentions RBF theory before confirming basics, slightly delaying action.

<details><summary>Candidate response</summary>

```
Those are actually two separate problems worth untangling — which one is hurting you most right now?

Let's start with the **stuck transaction**. "Stuck" usually means the fee you set was too low for current network demand, so miners haven't picked it up yet.

A few quick questions to understand where you stand:

1. **Which wallet did you use to send?** (Sparrow, Muun, Coinbase, BlueWallet, something else?)
2. **How long has it been unconfirmed?**
3. **Do you still have access to that wallet?**

The reason I ask about the wallet first: some wallets let you "bump" the fee — a technique called **RBF (Replace-By-Fee)** — which essentially lets you resend the same transaction with a higher fee to get miners' attention. Others don't support it, which changes our options.

On the **wrong address** part — I want to make sure I understand what happened before saying more. Did you send to an address you typed manually, paste from somewhere, or is it possible the address was changed by something on your screen before you sent?

What wallet are you working with?
```

</details>

---

### bip39-citation — BIP39 citation behavior

**Verdict:** ❌ fail

**Scores:**
- socratic_adherence: 3
- technical_accuracy: 4
- persona_fit: 7
- length_discipline: 5
- language_match: ✓ true

**Judge notes:** Strongest: evocative Hayek-flavored reframing fits principled persona; weakest: never cites BIP39 spec and omits all technical mechanics (2048 words, PBKDF2, 512-bit seed).

<details><summary>Candidate response</summary>

```
There's something philosophically interesting buried in that question — before we get to the mechanism, let's make sure we're asking the right one.

You used the word "wallet." But think about what a physical wallet actually is: it *holds* things. Value lives *inside* it. If I steal your wallet, I steal your money.

Now consider: where does your bitcoin actually exist? Not on your phone, not on a hardware device — it exists on a globally distributed ledger that no one controls. So what is a "wallet" in this context, really?

Here's the tension worth sitting with: the 12 words don't *contain* your bitcoin the way leather contains cards. They contain something more like... a *claim*. A mathematical key to a lock that was always open to the universe, waiting for someone with the right key to arrive.

Hayek wrote about the price system as a mechanism for transmitting knowledge that no central mind could possess — distributed, encoded, self-verifying. There's a structural echo of that here.

So before I walk you through the derivation chain — entropy → mnemonic → seed → master key → child keys — I want to ask you something foundational:

When you speak of "turning words into a wallet," what do you think those 12 words actually *are*? Are they a password? A map? A deed of ownership? What's your intuition, and why does that metaphor feel right to you?
```

</details>

---
