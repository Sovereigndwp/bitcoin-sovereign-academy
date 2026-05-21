// Curated 14-day cross-platform seed set for BSA social.
// Hand-written, brand-voice, useful-without-clicking. Consumed by
// generate-social-drafts.mjs to write individual JSON drafts.
//
// Counts: 14 Nostr · 7 LinkedIn · 4 Substack Notes · 4 X
// Spanish: 3 Nostr + 1 Substack = 4 · Advisor: 2 (LinkedIn) · Family: 2 (Nostr)
// Zap-soft: 2 (Nostr) · Meeting CTA: 0 (kept for later; ≤1/week guideline)
//
// All links point to pages that exist today: /start/, /interactive-demos/.
// The Lightning address is the canonical one: sovereigndwp@getalby.com.

const SITE = 'https://bitcoinsovereign.academy';
const DEMOS = 'https://bitcoinsovereign.academy/interactive-demos/';
const LN = 'sovereigndwp@getalby.com';

export const SEED = [
  // ───────────────────────── NOSTR · WEEK 1 ─────────────────────────
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd01',
    slug: 'hardware-wallet-protects-a-key',
    pillar: 'custody-mistake', audience: 'all', post_type: 'mistake', language: 'en',
    body:
`A hardware wallet protects a key.

It does not decide:
— who can recover the bitcoin
— where the backup lives
— what happens if you die
— whether your heirs understand the setup
— whether someone can be tricked during a send

The device matters.
The system matters more.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p001',
    notes: 'Monday custody-mistake. The flagship distinction: tool vs system.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd02',
    slug: 'recovery-before-macro',
    pillar: 'beginner', audience: 'beginner', post_type: 'question', language: 'en',
    body:
`Before you buy more bitcoin, ask one boring question:

Could you recover the bitcoin you already own if your phone died today?

If the answer is no, the next lesson isn't macro.
It's recovery.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'homepage',
    notes: 'Tuesday beginner clarity. A sharp question that reorders priorities.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd03',
    slug: 'your-inflation-is-your-basket',
    pillar: 'money', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`Inflation isn't the number on the news.

That's an average of a basket you may not buy.

Your inflation is your rent, your food, your school fees — weighted by what you actually spend.

If the unit shrinks, the budget lies before you do.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'deep-dives',
    notes: 'Wednesday money first-principles. Reframes inflation as personal, not abstract.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd04',
    slug: 'seed-in-a-safe-is-not-a-plan',
    pillar: 'inheritance', audience: 'families', post_type: 'one-idea', language: 'en',
    body:
`A seed phrase locked in a safe is not an inheritance plan.

Access is one piece. The others:
— does anyone know it exists?
— do they know how to use it?
— can they prove they're allowed to?
— what happens if one holder is gone?

A secret with no chain of custody isn't a plan.
It's a risk with better packaging.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'paths/sovereign',
    notes: 'Thursday inheritance, family audience.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd05',
    slug: 'usdt-rail-changed-issuer-risk-did-not',
    pillar: 'rail-clarity', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`USDT on Tron can be useful. It's cheap dollar movement.

But the dollar promise still belongs to Tether.
The rail changed. The issuer risk did not.

That's not a Bitcoin failure.
It's a category distinction.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p002',
    notes: 'Friday rail clarity. Stablecoin vs hard money, without dunking.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd06',
    slug: 'salir-del-exchange-no-es-el-plan',
    pillar: 'custody-mistake', audience: 'spanish', post_type: 'spanish', language: 'es',
    body:
`Mucha gente cree que sacar sus bitcoin del exchange ya significa tenerlos bien protegidos.

No necesariamente.

Salir del exchange es un paso.
Tener un plan de recuperación es otro.
Que tu familia sepa qué hacer si tú no estás, es otro completamente distinto.

No confundamos control con planificación.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'paths/curious/stage-1/es',
    notes: 'Saturday Spanish (LATAM). Native phrasing, not a translation.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd07',
    slug: 'week-1-value-for-value',
    pillar: 'zap-soft', audience: 'all', post_type: 'zap-worthy', language: 'en',
    body:
`This week the Academy posted on recovery, rails, and inheritance.

All free. It stays free.

If one of these saved you from an expensive mistake, a zap closes the loop and keeps the lessons coming.

Value for value.
⚡ ${LN}`,
    links: [], cta_type: 'zap-soft', zap_ok: true, meeting_ok: false,
    source: 'content/social',
    notes: 'Sunday recap + soft zap. Zap address in body, no pressure.',
  },

  // ───────────────────────── NOSTR · WEEK 2 ─────────────────────────
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd08',
    slug: 'set-it-up-later-is-the-mistake',
    pillar: 'custody-mistake', audience: 'all', post_type: 'mistake', language: 'en',
    body:
`"I'll set it up properly later" is the most common custody mistake.

It isn't technical.

Months pass. Coins pile up in the easiest app. The plan stays a plan.

The gap between buying bitcoin and actually custodying it is where most losses happen.
Close it while the amount is still small.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p033',
    notes: 'Monday custody-mistake. Names the behavioral, not technical, failure.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd09',
    slug: 'una-frase-semilla-no-es-contrasena',
    pillar: 'beginner', audience: 'spanish', post_type: 'spanish', language: 'es',
    body:
`Una frase semilla no es una contraseña.

Es la billetera.

Si esas 12 o 24 palabras existen en el orden correcto, cualquiera puede reconstruir tus bitcoin en cualquier dispositivo.

Ese es el poder. Y también la advertencia:
nunca la escribas en una foto, un correo o la nube.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'glossary.html',
    notes: 'Tuesday beginner clarity in Spanish.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd10',
    slug: 'scarcity-stops-the-unit-from-lying',
    pillar: 'money', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`Scarcity isn't a marketing line.

What a fixed supply does is stop the unit from quietly lying about itself.

If no one can print more, the amount you saved last year still means what it meant.

Not a bet on a bigger number.
A unit that holds its shape.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p028',
    notes: 'Wednesday money. Scarcity framed as honesty of the unit, not upside.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd11',
    slug: 'tell-one-person',
    pillar: 'inheritance', audience: 'families', post_type: 'one-idea', language: 'en',
    body:
`The most underrated inheritance step costs nothing:

Tell one trusted person that bitcoin exists, roughly how much, and who to call if something happens to you.

Not the seed. Not the keys. Just that there's something to look for.

Families have lost six figures because no one ever knew to look.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p019',
    notes: 'Thursday inheritance, family audience.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd12',
    slug: 'stablecoin-value-not-sovereignty',
    pillar: 'rail-clarity', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`A stablecoin can hold a dollar's value.

It can't give you dollar sovereignty.

Someone can still freeze the contract, censor the address, or change the rules of the chain it lives on.

Holding a dollar and controlling one are different problems.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'deep-dives',
    notes: 'Friday rail clarity. Value vs sovereignty distinction.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd13',
    slug: 'verifica-la-direccion',
    pillar: 'sovereignty', audience: 'spanish', post_type: 'spanish', language: 'es',
    body:
`Antes de recibir bitcoin, revisa una cosa en el dispositivo que lo va a recibir:

los primeros y últimos caracteres de la dirección.

La mayoría de los robos no son hackeos.
Son direcciones cambiadas por malware o phishing.

Verificar toma cinco segundos.
Recuperar lo perdido no se puede.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p015',
    notes: 'Saturday practice prompt in Spanish.',
  },
  {
    version: 1, status: 'draft', platform: 'nostr', day: 'd14',
    slug: 'week-2-recap-value-for-value',
    pillar: 'zap-soft', audience: 'all', post_type: 'zap-worthy', language: 'en',
    body:
`Two weeks of lessons: recovery, rails, inheritance, and the difference between a wallet and a plan.

Free to read. Free to share.

If the Academy saved you confusion or a costly mistake, a zap tells us which lessons land.

Value for value.
⚡ ${LN}`,
    links: [], cta_type: 'zap-soft', zap_ok: true, meeting_ok: false,
    source: 'content/social',
    notes: 'Sunday recap + soft zap. Second and final zap of the fortnight.',
  },

  // ───────────────────────── LINKEDIN (7) ─────────────────────────
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li01',
    slug: 'three-bitcoin-products-advisors',
    pillar: 'advisors', audience: 'advisors', post_type: 'advisor', language: 'en',
    body:
`Three Bitcoin products. Three different problems they solve. Clients confuse them constantly.

A spot ETF gives exposure and clean tax reporting. It does not give control, censorship resistance, or a path to hold value outside the traditional system. If a client's reason for owning bitcoin is "in case the system breaks," an ETF is the wrong tool for that job.

Self custody gives control. The client holds the keys, and no counterparty can freeze or lose the funds. The tradeoff is responsibility: backups, tested recovery, and a plan for what happens when the client isn't the one holding the keys.

Collaborative custody sits between them. The client holds one key, a professional holds one, a third party holds one — any two can sign. No single party can move funds alone, and no single party can lock the client out. For families who want self custody without becoming a single point of failure for their own wealth, this is often the right structure.

The failure I see most often isn't choosing wrong. It's not realizing these are three different questions.

We work through this distinction with advisors and families at Bitcoin Sovereign Academy. Free lessons: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'institutional/wealth-advisors',
    notes: 'Advisor #1. ETF vs self custody vs collaborative custody.',
  },
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li02',
    slug: 'inheritance-is-where-advice-breaks',
    pillar: 'advisors', audience: 'advisors', post_type: 'advisor', language: 'en',
    body:
`Most Bitcoin advice ends at "buy and self-custody." It rarely makes it to the part that actually breaks families: what happens when the client isn't the one holding the keys.

Inheritance is where most Bitcoin planning quietly fails. A seed phrase in a safe is access, not a plan. A real plan answers four questions:

1. Who knows the bitcoin exists?
2. Who knows how to access it?
3. What proves they have the authority to?
4. What happens if any one of those people is unavailable?

If an estate plan can't answer all four out loud, the bitcoin is one event away from being stranded — recoverable in theory, lost in practice.

This is solvable. It takes deliberate setup: documented authority, tested recovery, and ideally a custody structure with no single point of failure. But it has to be built before it's needed, not after.

If your firm advises clients who hold bitcoin and inheritance hasn't been addressed, that's the gap to close first.

Walkthroughs and tools: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'paths/sovereign',
    notes: 'Advisor #2. The inheritance gap, four-question framework.',
  },
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li03',
    slug: 'tool-vs-system-linkedin',
    pillar: 'custody-mistake', audience: 'all', post_type: 'mistake', language: 'en',
    body:
`A hardware wallet is one of the best security tools an individual can own. It also gives people a false sense that the job is done.

The device protects a private key. It signs transactions offline. It keeps secrets off an internet-connected machine. All real, all valuable.

But the device does not decide who can recover the bitcoin if it's lost. It doesn't choose where the backup lives, or who else knows it exists. It can't tell whether your heirs understand the setup, or whether you'll be tricked into approving a payment to the wrong address.

Those are system questions, not device questions. And the system is where most real-world losses happen — not in the chip, but in the gap around it: an untested backup, a single point of failure, a plan that lived only in one person's head.

Buy good tools. Then spend at least as much effort on the system that surrounds them: backup location, recovery test, inheritance, and a sober look at how a send could go wrong.

The tool matters. The system matters more.

First-principles custody lessons: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p001',
    notes: 'Longer LinkedIn treatment of the tool-vs-system idea.',
  },
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li04',
    slug: 'money-is-the-unit-you-measure-by',
    pillar: 'money', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`We talk about money as the thing we spend. That's the smallest part of what it does.

Money is mostly the unit we measure life in. Salary, rent, the cost of raising a child, the price of a year of retirement — all denominated in one unit. Every long-term plan is really a bet that the unit will mean roughly the same thing in the future as it does today.

When the unit loses value steadily, the plans built on it drift without anyone deciding to change them. "I earn more than I did five years ago" and "I can afford more than I could five years ago" quietly stop being the same statement. The number went up. The measuring stick got shorter.

This is the first-principles reason a predictable, fixed-supply money is interesting. Not because of price, and not as a trade. Because a unit that can't be quietly expanded is a more honest ruler for measuring a life.

You can disagree with the conclusion. But the question — "what is my plan actually denominated in?" — is worth sitting with.

We teach money from first principles, before we ever get to Bitcoin: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'deep-dives',
    notes: 'Money first principles, professional register.',
  },
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li05',
    slug: 'bitcoin-is-not-the-whole-category',
    pillar: 'rail-clarity', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`"Crypto" is a single word doing far too much work. It lumps together thousands of unrelated things: tokens, trading platforms, payment rails, and a small number of genuinely scarce assets. Treating them as one category is how people get hurt.

Bitcoin is not a tech startup with a token attached. There is no company, no foundation that can print more, no executive to lean on. Its proposition is narrow and unusual: a fixed-supply, neutral monetary asset you can hold and move without anyone's permission.

Most of what trades under the same banner is closer to the opposite — a team, a roadmap, and a token whose supply and rules can change. That can be a reasonable speculation. It is a different category of risk, answering a different question.

For an advisor or a family, the move isn't to win a taxonomy argument. It's to ask what the client is actually trying to solve. Exposure to a volatile asset class? Or a long-term, censorship-resistant store of value held outside the banking system?

Different goals, different instruments. Naming them clearly is most of the work.

First-principles education, Bitcoin only: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'deep-dives',
    notes: 'Rail clarity / Bitcoin-is-not-the-category. Careful, non-tribal framing.',
  },
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li06',
    slug: 'fast-is-not-sovereign',
    pillar: 'sovereignty', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`Speed and sovereignty are not the same feature, and confusing them leads to bad decisions.

A custodial app can move value across the world in seconds. It's fast and convenient. It is also a permissioned database — the provider can freeze it, reverse it, or be ordered to. The speed is real. So is the dependency.

Bitcoin's base layer settles more slowly and deliberately by design. The point was never to be the fastest payment method. The point is that final settlement doesn't require anyone's permission.

Higher layers — Lightning, custodial wallets, exchanges — buy speed and convenience by adding assumptions back in. That's a fine trade for buying coffee. It's a poor trade for the savings you can't afford to have frozen.

So the useful question isn't "how fast is it?" It's "do I have a real exit path if I ever need one?"

Fast is a feature you can rent. Sovereign is a property you have to hold. Don't mistake one for the other.

Learn the layers and the trade-offs: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'deep-dives',
    notes: 'Sovereignty / exit. Layers add assumptions.',
  },
  {
    version: 1, status: 'draft', platform: 'linkedin', day: 'li07',
    slug: 'practice-where-it-is-free',
    pillar: 'bsa-distribution', audience: 'all', post_type: 'lesson-link', language: 'en',
    body:
`The cheapest way to learn Bitcoin custody is to make your mistakes where they don't cost anything.

Most people learn the hard way: a wrong send, a wallet they can't recover, a backup they never tested. The lesson sticks, but the tuition is paid in real money.

We built a set of interactive demos so you can practice the risky parts first — build a multisig, walk through a recovery, decode a transaction, verify a receive address — without touching real funds. It runs in the browser, and you don't need an account to start.

If you advise clients or teach family members, it's also a low-friction way to show them how custody actually works before they hold anything meaningful. People remember what they've done with their own hands far better than what they were told.

Practice here, free: ${DEMOS}`,
    links: [DEMOS], cta_type: 'soft-demo', zap_ok: false, meeting_ok: false,
    source: 'interactive-demos',
    notes: 'Distribution / practice. Points to demos.',
  },

  // ───────────────────────── SUBSTACK NOTES (4) ─────────────────────────
  {
    version: 1, status: 'draft', platform: 'substack', day: 'ss01',
    slug: 'a-backup-you-never-tested',
    pillar: 'custody-mistake', audience: 'all', post_type: 'mistake', language: 'en',
    body:
`A backup you never tested is a hope with better packaging.

Once a year, restore your wallet from the seed onto a clean device. Match the first receive address. Then wipe it.

That's the whole drill. The families who lose bitcoin rarely skipped the backup — they skipped the test.

New lessons weekly: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p007',
    notes: 'Substack note. Tight, actionable drill.',
  },
  {
    version: 1, status: 'draft', platform: 'substack', day: 'ss02',
    slug: 'money-is-a-measuring-stick',
    pillar: 'money', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`Money isn't only what you spend. It's the unit you measure your life in.

Rent, salary, savings, the cost of a year of school — all priced in one unit. If that unit keeps changing, every plan built on it quietly drifts.

That's the first-principles reason a fixed-supply money matters. Not price. Measurement.

More, from first principles: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'deep-dives',
    notes: 'Substack note. Money as ruler.',
  },
  {
    version: 1, status: 'draft', platform: 'substack', day: 'ss03',
    slug: 'family-can-just-access-my-phone',
    pillar: 'inheritance', audience: 'families', post_type: 'family', language: 'en',
    body:
`"My family can just access my phone."

That's not an inheritance plan. That's a guess.

A real plan answers: does anyone know the bitcoin exists, do they know how to reach it, can they prove they're allowed to, and what happens if one key holder is gone?

Access is one piece. Authority, instructions, and redundancy are the rest.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'paths/sovereign',
    notes: 'Substack note. Family inheritance, no CTA.',
  },
  {
    version: 1, status: 'draft', platform: 'substack', day: 'ss04',
    slug: 'salir-del-exchange-es-el-comienzo',
    pillar: 'sovereignty', audience: 'spanish', post_type: 'spanish', language: 'es',
    body:
`Salir del exchange no es el final del trabajo. Es el comienzo.

Tener tus llaves significa que nadie puede congelar ni perder tu bitcoin por ti.
También significa que nadie puede recuperarlo por ti.

Por eso el plan de respaldo y recuperación importa tanto como la compra.

Control y responsabilidad vienen juntos.

Lecciones gratuitas: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'paths/curious/stage-1/es',
    notes: 'Substack note in Spanish — 4th Spanish post of the fortnight.',
  },

  // ───────────────────────── X / TWITTER (4) ─────────────────────────
  {
    version: 1, status: 'draft', platform: 'x', day: 'x01',
    slug: 'x-tool-vs-system',
    pillar: 'custody-mistake', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`A hardware wallet protects a key.

It doesn't decide who recovers your bitcoin, where the backup lives, or what happens if you die.

The device matters. The system matters more.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p001',
    notes: 'X single, under 280.',
  },
  {
    version: 1, status: 'draft', platform: 'x', day: 'x02',
    slug: 'x-recovery-before-macro',
    pillar: 'beginner', audience: 'beginner', post_type: 'question', language: 'en',
    body:
`Before buying more bitcoin, one boring question:

Could you recover what you already own if your phone died today?

If no, the next lesson isn't macro. It's recovery.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'homepage',
    notes: 'X single, under 280.',
  },
  {
    version: 1, status: 'draft', platform: 'x', day: 'x03',
    slug: 'x-usdt-rail-vs-issuer',
    pillar: 'rail-clarity', audience: 'all', post_type: 'one-idea', language: 'en',
    body:
`USDT on Tron is cheap dollar movement.

But the dollar promise still belongs to Tether. The rail changed. The issuer risk didn't.

Not a Bitcoin failure. A category distinction.`,
    links: [], cta_type: 'none', zap_ok: false, meeting_ok: false,
    source: 'content/nostr/post-bank.jsonl#p002',
    notes: 'X single, under 280.',
  },
  {
    version: 1, status: 'draft', platform: 'x', day: 'x04',
    slug: 'x-thread-inheritance-questions',
    pillar: 'inheritance', audience: 'families', post_type: 'thread', language: 'en',
    body:
`1/ A seed phrase in a safe is not an inheritance plan. It's access. A plan answers four questions most families never write down.

2/ Who knows the bitcoin exists? If the answer is "no one," it's already at risk — families have lost six figures because nobody knew to look.

3/ Who knows how to access it? Knowing it exists and being able to reach it are different. Instructions matter as much as keys.

4/ What proves they're allowed to? Authority. An executor or heir needs a way to act that holds up — not just knowledge of a secret.

5/ What happens if one key holder is gone? Redundancy. A plan with a single point of failure isn't a plan; it's a countdown.

6/ Access, authority, instructions, redundancy. Build all four before they're needed. Free walkthroughs: ${SITE}`,
    links: [SITE], cta_type: 'soft-site', zap_ok: false, meeting_ok: false,
    source: 'paths/sovereign',
    notes: 'X thread (post_type=thread so length is allowed). Each note stands alone.',
  },
];
