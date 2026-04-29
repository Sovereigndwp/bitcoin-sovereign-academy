# Distribution Engine — Phase 1 design

**Date:** 2026-04-28
**Author:** Dalia (with Claude Opus 4.7)
**Status:** **RECLASSIFIED AS PHASE 2 CANDIDATE** (2026-04-28, post-commit). After this spec was committed (`b543c833`), the brand-direction conversation produced a reframe: the active Phase 1 is now `2026-04-28-phase-1-identity-convergence.md` (Identity Convergence + Asset Surfacing). This spec remains a valid **Phase 2 candidate** (Spanish consumer funnel) — to be revived, modified, or retired after the Phase 1 audit completes. See Phase 1 spec §15 for disposition rationale.

---

## TL;DR

Convert scattered 4-channel content effort into a structured lead funnel for **The Bitcoin Adviser (TBA)**, with **composable voice** as a brand mandate and **privacy-first** as a defensible differentiator. Phase 1 ships 4 components: a voice spec doc, a Spanish-language lead-magnet funnel (PDF + capture + 5-email drip), a content-repurposer script, and a warm-contact playbook. Existing assets (BSA, FSA, Mi Primer Bitcoin curriculum credit, the 21-article English custody+inheritance Substack series in flight, an existing 60-subscriber Spanish Substack, warm contacts at family offices / law firms / tax firms) become inputs to the funnel, not parallel projects.

The funnel terminates in TBA paid engagements. **Success is falsifiable:** ≥1 paid TBA engagement attributable to the funnel by week 8, or Phase 1 is judged not working and we redesign.

---

## 1. Strategic frame

### 1.1 Goal of Phase 1

Build the rails of a distribution engine that:
- captures Spanish-speaking LATAM consumer leads on the user's existing platforms (BSA Spanish modules + a new dedicated landing page),
- nurtures them via a privacy-respecting 5-email drip ending in a low-friction CTA,
- supplies the user with draft repurposed content for LinkedIn / X / Nostr / opposite-language Substack from any source post,
- structures the user's existing warm-contact relationships (family offices, law firms, tax firms) into a documented playbook with templates.

What Phase 1 **is not**: programmatic SEO at scale, Apollo cold-outreach, English professional briefing PDF, BSA cross-linking automation, FSA Employer-Program funnel. Those are Phase 2+ items, scoped separately.

### 1.2 Wedge / thesis (W3)

> *"Tu Bitcoin es tuyo cuando lo reconocen tu notario, tu código, y el riesgo jurisdiccional al mismo tiempo."*

Three domains baked into the wedge: legal/civil-law inheritance practice × cryptographic ownership × LATAM geopolitics. This is the primary thesis line. It appears in the lead magnet intro, the PDF cover, the landing page hero, the first drip email, and the user's bio across channels.

### 1.3 ICPs

**Primary — consumer track (Spanish):** LATAM upper-middle-class business owners and entrepreneurs (35–60), currently hold BTC via ETFs, futures, exchanges, lending platforms, yield products, or "BTC-in-your-bank-app" — paper exposure across multiple custodial / counterparty-risk products. Don't yet grasp self-custody or the practical answer (collaborative 1-of-3 multisig). Colombia is the primary example, the audience is hemispheric. Engagement size: USD $200–$1,500.

**Secondary — professional track (English):** Family offices, law firms, tax firms. The user already has warm contacts in this segment. Both direct clients (principals personally hold BTC) AND referral channels (their HNW clients need TBA). Engagement size: USD $1,000–$5,000, recurring possible. **Phase 1 only addresses this ICP via the warm-contact playbook (Component 4); cold prospecting is Phase 2.**

### 1.4 Brand asset stack

Deployed in every channel bio, every lead-magnet page, every drip email, every outreach intro:

1. *"Wrote the curriculum for The Bitcoin Diploma (Mi Primer Bitcoin)"* — credibility
2. *"Bitcoin Adviser, TheBitcoinAdviser.com — collaborative 1-of-3 multisig"* — offer
3. **Bitcoin Sovereign Academy** (free) — proof of teaching, not selling
4. **Financially Sovereign Academy** — proof of mission beyond commerce
5. *"Native Colombian, only Spanish-speaking adviser at TBA"* — defensible niche

### 1.5 Composable voice — the constraint

**Composability applies at piece level and series level**, not necessarily every title. Technical deep-dives within the 21-article custody+inheritance series may be single-axis if they live within a composable series frame.

**The 5 named domain pairs the brand owns:**

| # | Pair |
|---|---|
| 1 | Bitcoin custody architecture × LATAM civil-law / notarial inheritance practice |
| 2 | Mi Primer Bitcoin pedagogy × HNW client psychology |
| 3 | Sovereignty maximalism × collaborative-custody pragmatism |
| 4 | Cypherpunk ethics × family-office discretion norms |
| 5 | Custodial + counterparty risk across paper-Bitcoin products (ETFs, futures, exchanges, lending, yield, "BTC-in-your-bank-app") × LATAM jurisdictional realities |

**Synthesis check** (testable, applied pre-publish to every draft) — **all three** sub-checks must pass:

**Composability check:**
> *Does this piece visibly bridge at least one of the 5 named pairs — in its title or its core argument? If no, either rewrite OR justify exemption (technical deep-dive within the 21-article series).*

**First-principles check** (see §1.6):
> *Does the argument derive from fundamentals (definitions, mechanisms, primitives) rather than from authority, analogy, or industry convention? Could a careful reader follow the derivation step by step? If no, rewrite — you're transmitting received wisdom, not understanding.*

**Epistemic check** (see §1.7):
> *Does this piece present ≥2 perspectives OR explicitly acknowledge what is contested? Does the title open with a question or frame, rather than a verdict? Are claims accompanied by sources or by genuine uncertainty? If no, rewrite — or this is opinion-broadcasting, not informing.*

The repurposer script (Component 3) prints all three checks at the top of every generated draft, flags which pair(s) the source bridges, and reports pass/fail per check.

### 1.6 First-principles reasoning

Every argument in this brand's content **derives from fundamentals up** — not from authority, analogy, or industry convention. Operationalized in seven rules:

1. **Define primitives explicitly before arguing.** Before claiming anything about ETFs, state what an ETF *is* at its base layer (a legal claim against a custodian holding shares of a trust that holds the underlying asset). Before arguing about custody, define what custody actually means (control of private keys → unilateral ability to authorize transactions). The reader should know exactly what we're arguing about.
2. **Build conclusions step-by-step from primitives.** If a claim is true, show the derivation. If you can't show it, you don't yet understand it well enough to publish it.
3. **Question inherited assumptions.** Industry conventions ("self-custody is sovereignty," "ETFs are bad," "yield is risk-free") are treated as assumptions to verify, not premises to accept. State them, examine them, accept or revise them — out loud, where the reader can follow.
4. **Distinguish empirical from logical claims.** Some are testable (*"this exchange holds X dollars in reserves on a given date"*). Others derive from definitions (*"if you don't hold the keys, you cannot unilaterally authorize a transaction"*). Don't conflate them — readers verify each type differently.
5. **Identify the irreducible mechanism.** Not *"exchanges are risky"* but *"exchanges hold customer funds in pooled custody, so a security failure or insolvency event affects all customers proportionally regardless of any one customer's behavior."* The mechanism is the actual generator of the risk.
6. **Test for circularity.** *"BTC is valuable because people value it"* is circular. Find the non-circular base (e.g., monetary properties — scarcity, divisibility, portability, durability, censorship-resistance — and how each is implemented at the protocol level).
7. **Reject argument-from-authority** as a substitute for analysis. *"Saylor says X"* is data about Saylor's belief, not evidence for X. *"Mi Primer Bitcoin teaches Y"* is similarly insufficient — even when MPB is correct, the *reason* it's correct must be derivable from primitives by the reader.

**Why this matters in this niche:** HNW LATAM clients, family-office principals, and tax/law professionals reason from first principles in their own work. Speaking that language earns trust the way arguments-from-authority cannot. It's also defensible — most Bitcoin marketers argue from analogy (*"Bitcoin is digital gold!"*) or from authority (*"Saylor says…"*). First-principles reasoning is its own moat, and it extends Mi Primer Bitcoin's pedagogy (which itself starts from money's properties and derives Bitcoin's role) into advisory work without diluting it.

This stance composes with **pair #2 (MPB pedagogy × HNW client psychology)** and **pair #4 (cypherpunk ethics × family-office discretion)** — both audiences are trained to demand derivation, not assertion.

### 1.7 Editorial stance / epistemic posture

This brand **informs**, it does not **convince**. The reader decides. Operationalized in seven rules:

1. **Every claim accompanied by ≥1 counter-argument or alternative frame**, steelmanned, not strawmanned.
2. **Use "creo que / based on what I've seen / mi lectura es"** — never *"the truth is / you must / the only correct way is."*
3. **Cite sources** where verification is possible; invite the reader to verify.
4. **Acknowledge what I don't know** explicitly. Where appropriate, add a *"Lo que aún no sé"* / *"Where I could be wrong"* note.
5. **The brand thesis (W3) is one lens, not the only valid one.** Other lenses exist (e.g., maximalist sole-key sovereignty, ETF-as-temporary-vehicle, custodial-with-insurance). Each gets a fair hearing in any piece that argues against it.
6. **Default to questions or frames in titles**, not verdicts. *"¿Qué tan diferente es...?"* over *"X is not Y."*
7. **No FUD, no fearmongering, no urgency manipulation.** If the reader acts on what they read, it's because the analysis was clear — not because the headline scared them.

**Why this matters:** most Bitcoin marketers preach (maxi vs. anti, ETF-good vs. ETF-bad). Refusing to preach is itself a moat — it compounds trust over time and positions the brand as an *adviser* (someone who helps you think), not a *salesperson* (someone who tells you what to do). For HNW LATAM clients especially, the latter has zero credibility; the former is the precondition for advisory-grade trust.

This stance is itself **composable on pair #4 (cypherpunk ethics × family-office discretion)** — both traditions value epistemic humility and discretion over loud advocacy.

### 1.8 Language tracks

| Channel | Language | Cadence | Role |
|---|---|---|---|
| Substack EN | English | 1/wk (finish 21-article custody+inheritance series) | Professional hub |
| Substack ES | Spanish | 1/wk (5–7 adaptations of top EN pieces + originals on LATAM jurisdictional themes) | Consumer hub |
| LinkedIn | Bilingual (ES Mon, EN Thu) | 2/wk | Repurposed from Substack |
| X | English | 1–2/wk | Credibility broadcast — repurposed from EN Substack |
| WhatsApp (warm group) | Spanish | Reactive only | Warm distribution — see §1.7 |

### 1.9 WhatsApp content-sourcing rule

Identify the 1–2 recurring questions in the warm WhatsApp group that map to the 5 domain pairs. Write Substack pieces *specifically designed to answer them*. Drop the link in the group only when the question next surfaces organically. Content is sourced *from* group conversations, not pushed *to* them.

### 1.10 Funnel terminus — two CTAs by track

- **Consumer (ES):** *"Responde con tu duda más urgente sobre custodia. Si encaja con lo que hago, agendamos 30 min."* — peer language, low friction, lands in `dalia@bitcoinsovereign.academy` inbox.
- **Professional (EN):** *"Reply if you'd like a 20-min peer call to compare notes."* — peer-to-peer, never sales-language. Used in warm-contact playbook (Component 4).

The literal "Book a Consult" button on TheBitcoinAdviser.com remains for self-qualifiers. It is **not** the primary lead-magnet CTA.

---

## 2. The Spanish lead magnet — "Tu Bitcoin no es tuyo aún"

### 2.1 Title

*"Tu Bitcoin no es tuyo aún: 7 formas de tener Bitcoin sin tenerlo (y por qué importa en Latinoamérica)"*

### 2.2 Structure (composability-enforced)

9 chapters, ~10–12 pages total. Each numbered chapter (1–7) bridges domain pair #5 plus one other named pair, so the PDF as a whole tours the full domain palette.

| Ch. | Section | Pair #5 | + Composable pair | Hook (question/frame, not verdict) |
|---|---|---|---|---|
| 0 | Intro: La trifecta W3 | — | #1 + #3 + #5 | Mi Primer Bitcoin → una pregunta que MPB plantea pero no resuelve: *"¿quién firma cuando tú no estás?"* |
| 1 | ETFs | ✓ | #2 (MPB pedagogy × HNW psych) | ¿Qué exactamente compras cuando compras un ETF de Bitcoin? |
| 2 | Futuros / opciones | ✓ | #3 (sovereignty × pragmatism) | Especular Bitcoin y custodiar Bitcoin: dos actividades distintas con resultados distintos |
| 3 | Exchanges centralizados (Bitso, Binance, Lemon, etc.) | ✓ | #1 (custody × LATAM legal) | Si Bitso cae mañana, ¿qué le dices a tu notario? |
| 4 | Lending platforms | ✓ | #4 (cypherpunk × family-office) | "Yield" en Bitcoin: ¿de dónde viene exactamente, y qué riesgo paga? |
| 5 | Yield products | ✓ | #2 (MPB pedagogy × HNW psych) | Por qué la sofisticación financiera no siempre protege — y a veces expone |
| 6 | BTC-en-tu-banco / fintechs | ✓ | #1 (custody × LATAM legal) | Cuando tu banco se vuelve tu custodio: ¿cómo te enteras y qué cambia? |
| 7 | Multisig "custodial" (1 firma efectiva) | ✓ | #3 (sovereignty × pragmatism) | Multisig "colaborativo" vs. multisig "custodial": ¿dónde está la frontera? |
| 8 | Cierre: Custodia colaborativa 1-de-3 (una arquitectura entre varias) | — | #1 + #3 | Cómo se resuelven los 7 riesgos con una arquitectura — y dónde esta arquitectura no es la respuesta |

**Each numbered chapter (1–7) follows the same internal structure** — required by first-principles reasoning (§1.6) and editorial stance (§1.7):

1. **Las primitivas** — what is this thing, *literally*? Define the legal structure, custody model, signature requirements, settlement mechanism. The reader must know what we are talking about before any argument starts.
2. **Cómo funciona** — product mechanics derived from the primitives, plainly described, no judgment loaded
3. **Dónde vive el riesgo** — counterparty + jurisdictional analysis derived from the primitives (not from "experts say" or analogy); sourced where possible; mechanism named explicitly
4. **Otra perspectiva** — *steelmanned* defense of the product (e.g., for ETFs: "the case for ETFs as a temporary holding vehicle in tax-deferred accounts where direct custody is legally constrained"). Genuine, not throwaway. Mandatory.
5. **Lo que aún no sé** — honest uncertainty notes where they apply (e.g., *"No sé cómo la próxima regulación cripto en Colombia tratará BTC en exchanges vs. autocustodia."*)
6. **Aplicación** — 1–2 questions the reader can ask their adviser / exchange / bank to surface the risk concretely

The closing chapter (Ch. 8) presents the 1-of-3 collaborative custody as **one architecture, not the only one**, with explicit acknowledgment of where it's *not* the right answer (e.g., for very small holdings, single-key may genuinely be simpler and safer; for institutional holdings, qualified custodians may be required by mandate). Soft track-A CTA: *"Si quieres entender cómo se aplicaría — o no se aplicaría — a tu situación específica, responde a este email con tu duda más urgente."*

### 2.3 Source layout

```
content/lead-magnets/tu-bitcoin-no-es-tuyo-es/
├── 00-intro.md
├── 01-etfs.md
├── 02-futuros.md
├── 03-exchanges.md
├── 04-lending.md
├── 05-yield.md
├── 06-btc-en-tu-banco.md
├── 07-multisig-custodial.md
├── 08-cierre.md
├── metadata.yml          # title, author, brand asset stack, version
└── style.css             # Pandoc PDF styling (BSA brand colors)
```

### 2.4 Build pipeline

`scripts/build-pdf.mjs` invokes Pandoc:

```
pandoc content/lead-magnets/tu-bitcoin-no-es-tuyo-es/*.md \
  --pdf-engine=xelatex \
  --css=content/lead-magnets/tu-bitcoin-no-es-tuyo-es/style.css \
  --metadata-file=content/lead-magnets/tu-bitcoin-no-es-tuyo-es/metadata.yml \
  -o public/assets/lead-magnets/tu-bitcoin-no-es-tuyo-es.pdf
```

PDF is **gated**: not linked from any public page. The download URL is delivered only via Email 1 (which itself goes only to people who completed the capture form).

### 2.5 Repurposing built-in

Each numbered chapter is designed to also stand alone as a Substack post. Chapters 1–7 = 7 free Substack pieces queued from one PDF. The repurposer script (Component 3) can take any chapter as input and generate LinkedIn / X / Nostr drafts.

---

## 3. Capture form + API + Supabase

### 3.1 Capture form

Single shared component included on all capture surfaces. Lightweight HTML + minimal JS, no third-party widgets.

```html
<form data-capture="es-consumer" data-source="<page-id>">
  <label>Email <input type="email" name="email" required></label>
  <button type="submit">Recibir el PDF gratis</button>
  <p class="privacy-note">
    Sin pixels, sin terceros, sin ventas.
    Solo emails que escribo yo. Cancela con un clic.
  </p>
</form>
```

On submit, posts JSON `{email, track: 'es-consumer', source: <page-id>}` to `POST /api/subscribe`.

### 3.2 Capture surfaces (Phase 1)

| Surface | Path | Lang gate |
|---|---|---|
| Dedicated landing | `/lead-magnet/tu-bitcoin/` | always Spanish |
| BSA Spanish module footers | `/paths/curious/stage-1/es/*.html` | always Spanish |
| BSA homepage modal | `/index.html` | only when `<html lang="es">` OR browser prefers Spanish; dismissable; 30s delay; localStorage flag prevents re-show |

**Not Phase 1:** FSA homepage (no Spanish content yet), FSA Employer Program landing (B2B funnel, Phase 2), English BSA pages (will need Phase 2 English lead magnet).

### 3.3 API endpoint

New file: `api/subscribe.ts`.

Responsibilities:
- Validate email format (existing `api/validators.ts` patterns).
- Rate-limit via existing `api/rate-limiter.ts` (10 / hour / IP).
- Dedupe: if email already exists in `subscribers` table with same `track`, return 200 idempotently (do not re-send Email 0).
- Insert row to Supabase `subscribers` table.
- Trigger Email 0 send (welcome + PDF link) via existing `api/email.ts` (Resend) with tracking disabled (see §6); on 200 from Resend, set `email_0_sent_at = now()`.
- Log to `/api/track` as `funnel_step.step=lead_magnet_capture` with `track` and `source`.

### 3.4 Supabase schema

```sql
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  track text not null check (track in ('es-consumer', 'en-pro')),
  source text,                           -- page id where capture happened
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  email_0_sent_at timestamptz,           -- welcome
  email_1_sent_at timestamptz,           -- day 2
  email_2_sent_at timestamptz,           -- day 5
  email_3_sent_at timestamptz,           -- day 8
  email_4_sent_at timestamptz,           -- day 12 — track-A CTA
  unique (email, track)
);

create index on subscribers (track, subscribed_at)
  where unsubscribed_at is null;
```

Row-level security: only the service role (server) reads/writes. No public read.

### 3.5 Privacy: unsubscribe

Every drip email includes an unsubscribe link of the form
`https://bitcoinsovereign.academy/api/unsubscribe?token=<signed-jwt>` (token contains email + issued-at; signed with existing `api/auth.ts` secret). The handler sets `unsubscribed_at = now()` and the daily cron skips any row where `unsubscribed_at IS NOT NULL`.

---

## 4. Drip sequence

### 4.1 The 5 emails

All in Spanish. Sender: `dalia@bitcoinsovereign.academy`. Reply-to: same. Tracking: **disabled** (`tracking: { opens: false, clicks: false }` on every send).

| # | Day | Subject (ES) — question/frame, not verdict | Bridges | Body summary |
|---|---|---|---|---|
| 0 | 0 | "Aquí está tu PDF: Tu Bitcoin no es tuyo aún" | #1 + #5 | Welcome + PDF download link + privacy note + W3 framing as *one lens among several* + what to expect (4 more emails over 12 days, then I stop) |
| 1 | 2 | "¿Qué tan diferente es un ETF de tener Bitcoin?" | #5 + #2 | Riff on Ch. 1; one example; *"Otra perspectiva"* paragraph (the legitimate case for ETFs); one question for the reader's adviser |
| 2 | 5 | "Si cae el exchange mañana, ¿qué le dices a tu notario?" | #5 + #1 | Riff on Ch. 3 + Ch. 8 preview; the legal-recognition gap; alternative custody paths besides 1-of-3 multisig |
| 3 | 8 | "Tres lentes para mirar tu Bitcoin: ¿cuál usas tú?" | #1 + #3 + #5 | Present W3's three lenses as a *thinking tool*, not a verdict; invite the reader to identify which lens they currently use; introduce 1-of-3 collaborative custody as one architecture among several |
| 4 | 12 | "Una pregunta para ti" — track-A CTA | n/a (invitation) | *"Si has llegado hasta aquí, gracias por leer. Una sola pregunta: ¿cuál es la duda más urgente que tienes hoy sobre tu Bitcoin? Responde y la leo personalmente. Si encaja con lo que hago, agendamos 30 min — y si no encaja, te digo eso también."* |

### 4.2 Source layout

```
content/drip/es-consumer/
├── 00-welcome.md
├── 01-etf-vs-btc.md
├── 02-si-cae-el-exchange.md
├── 03-tres-lentes.md
├── 04-una-pregunta.md
└── _shared/
    ├── header.html         # Brand asset stack, MPB credit
    ├── footer.html         # Privacy line, unsubscribe link template
    └── send-config.json    # Resend tracking-disabled flags
```

Each markdown has frontmatter:
```yaml
---
day: 2
subject: "El ETF de Bitcoin que no es Bitcoin"
bridges: [5, 2]
preview_text: "..."
---
```

### 4.3 Cron-driven sending

New file: `api/cron/drip.ts`. Vercel cron config in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/drip", "schedule": "0 14 * * *" }
  ]
}
```

Daily run at 14:00 UTC (≈09:00 Bogotá / 10:00 Bogotá in DST). Logic:

```
For each N in [1, 2, 3, 4]:
  daysSince = N == 1 ? 2 : N == 2 ? 5 : N == 3 ? 8 : 12
  rows = subscribers where:
    track == 'es-consumer'
    AND unsubscribed_at IS NULL
    AND email_${N}_sent_at IS NULL
    AND date_trunc('day', subscribed_at) <= now() - interval '${daysSince} days'
  For each row:
    render content/drip/es-consumer/{N}-*.md
    POST to Resend with tracking disabled
    If 200: update email_${N}_sent_at = now()
    If error: log to console (Vercel surfaces it), do not update timestamp; next day's cron retries
```

Idempotent: missing a day means next day's run picks it up. Safe to re-run.

### 4.4 Migration of existing 60 Substack subs

**Do not bulk-import.** Privacy promise requires explicit re-consent.

Migration plan:
1. User publishes one final Substack post in Spanish: *"Estoy moviendo todo a una lista directa. Si quieres seguir recibiendo (más este nuevo PDF + 4 piezas más en los próximos 12 días), haz clic aquí."*
2. The link points to `/lead-magnet/tu-bitcoin/?source=substack-migration`.
3. Voluntary opt-ins flow through the standard capture pipeline. Source field tags them as `substack-migration` for attribution.
4. Realistic conversion: 30–40 of 60 (50–67%). Higher quality than full bulk.

---

## 5. Repurposer script — `scripts/syndicate.mjs`

### 5.1 Purpose

Take any source piece (Substack URL or local markdown) and generate channel-specific drafts for the user to review, edit, and publish manually. Reduces ~60 minutes of repurposing labor to ~10 minutes of editing.

### 5.2 Invocation

```bash
node scripts/syndicate.mjs --source <substack-url-or-path> [--source-lang en|es]
```

If `--source-lang` is omitted, the script detects from content (or asks).

### 5.3 Process

1. **Fetch source content.**
   - If URL: parse Substack RSS feed → find the matching item → extract full HTML → Markdown via Turndown.
   - If local path: read the file directly.
2. **Identify bridged domain pairs.**
   - Single Claude API call with the voice spec (the 5 pairs) as system prompt.
   - Output: `{ "primary_pair": <1-5>, "secondary_pairs": [<1-5>, ...], "rationale": "..." }`.
3. **Generate 5 draft files** (sequential Claude API calls, each given the source + voice spec):
   - `substack-<other-lang>.md` — register-shifted adaptation (NOT 1:1 translation)
   - `linkedin-es.md` — 180–300 words, hook → bridge → CTA
   - `linkedin-en.md` — 180–300 words, hook → bridge → CTA
   - `x-thread.md` — 8–12 tweets, English
   - `nostr.md` — 1 short note, English, ≤280 chars
4. **Write all files** to `outbox/YYYY-MM-DD-<slug>/`.
5. **Prepend `_synthesis-check.md`** to the directory containing:
   - The 5-pair palette
   - Source piece's identified bridge(s)
   - Per-draft pass/fail check against the synthesis rule
   - Any flagged issues for user review

### 5.4 Output structure

```
outbox/
└── 2026-04-30-cuando-cae-el-exchange/
    ├── _synthesis-check.md       # what bridges; pass/fail per draft
    ├── _source.md                # original (for reference)
    ├── substack-en.md            # if source was ES
    ├── linkedin-es.md
    ├── linkedin-en.md
    ├── x-thread.md
    └── nostr.md
```

### 5.5 Constraints

- **Never auto-publish.** Drafts only. User reviews and posts manually.
- **Reuses `ANTHROPIC_API_KEY`** already configured in environment for `api/tutor.ts`.
- **Single execution path:** failures write `_error.md` to the outbox dir with the source content so the user can hand-adapt; the script does not retry silently.
- **Idempotent:** running twice on the same source overwrites the outbox dir (with a confirmation prompt).

### 5.6 Brand-voice prompt

The system prompt for every Claude API call references the voice spec doc (Component 1) directly. The doc is the canonical brand-voice reference; the script reads it from `docs/marketing/voice-spec.md` at runtime so changes propagate without a code edit.

**Constraints the system prompt enforces alongside composability** (per first-principles reasoning §1.6 and editorial stance §1.7):

1. **Build arguments from primitives up.** When the source piece makes a claim, the generated drafts must preserve the chain of reasoning, not just the conclusion. If primitives aren't explicit in the source, flag this in the synthesis-check report so the user can add them before publishing.
2. **Reject argument-from-authority phrasing** in generated drafts. Replace *"Saylor says X"* / *"experts agree"* / *"studies show"* with the actual underlying mechanism or evidence. If the source uses authority phrasing, flag it.
3. Every generated draft presents **≥2 perspectives** OR explicitly flags a contested point.
4. Titles default to **questions or frames**; never verdicts (*"X is not Y"*, *"the truth about Y"*).
5. Claims accompanied by **sources** where possible; otherwise hedged with *"creo que / mi lectura es."*
6. **No strawmanning, no FUD, no urgency manipulation.** Counter-positions get steelmanned, not caricatured.
7. For pieces over 300 words, **a "Otra perspectiva" or counter-argument paragraph is mandatory.**
8. **Acknowledge uncertainty** where genuine. The model should be willing to write *"I don't know"* or *"this is contested"* when the source piece warrants it, rather than producing false confidence.

The `_synthesis-check.md` file in each outbox dir has three pass/fail rows per draft: composability, first-principles, and epistemic. Drafts failing any check are flagged for the user with specific suggested fixes.

---

## 6. Privacy architecture

The "no tracking" brand promise is operationalized as architecture, not aspiration.

| Layer | Decision |
|---|---|
| **Email open-tracking** | Disabled in Resend — every send sets `tracking: { opens: false }` |
| **Email click-tracking** | Disabled in Resend — every send sets `tracking: { clicks: false }` |
| **Pixel trackers in email** | None. Plain HTML, plain `<a href>` links. No third-party domains in email body. |
| **Outbound link UTMs** | Allowed (visible, inspectable, no behavioral profile). Used to attribute "did this email drive a BSA visit?" |
| **Site-side analytics** | First-party only (`/api/track` → Supabase). Anonymized. No PII. Already aligned. |
| **Third-party scripts on site** | None added. Audit pre-launch. |
| **Subscriber data** | Stored in Supabase, never sold, never shared, never exported to ad platforms |
| **Privacy line on every form** | *"Sin pixels, sin terceros, sin ventas. Solo emails que escribo yo. Cancela con un clic."* |
| **Privacy line in Email 1** | *"Recibirás 4 emails más en los próximos 12 días. Luego paro. No vendo, no comparto, no rastreo abiertos."* |
| **Unsubscribe** | Single-click, signed-token URL, no confirmation page required |

This becomes a **composable brand asset** itself: bridges pair #4 (cypherpunk ethics × family-office discretion) — usable as a positioning line in the warm-contact playbook for the professional track.

---

## 7. Warm-contact playbook — `docs/marketing/warm-contacts.md`

### 7.1 Purpose

Structure the user's existing warm relationships at family offices, law firms, and tax firms into a documented, low-friction outreach cadence. No automation: drafted in markdown, sent manually from the user's email client, status tracked in the same doc.

### 7.2 Structure

```markdown
# Warm contacts — playbook

## Tracking table

| Name | Firm | Role | Lang | Last touch | Status | Hypothesis | Next step |
|---|---|---|---|---|---|---|---|

## Email templates

### 1. Reconnect after long gap (EN / ES)
### 2. Share lead magnet — warm intro (EN / ES)
### 3. Follow up after first send (EN / ES)
### 4. Propose 20-min peer call (EN / ES)

## Cadence rule

Maximum 2 contacts touched per week. Quality over volume.

## Status taxonomy

- `cold` — no contact in 12+ months
- `warming` — initial reconnect sent, awaiting reply
- `responding` — replied; ongoing exchange
- `meeting-scheduled`
- `met` — peer call done, deciding next step
- `referred` — they referred a client to TBA
- `client` — they engaged TBA personally
- `passed` — declined, parked
```

### 7.3 Templates

8 templates total: 4 categories × {EN, ES}. Each ≤150 words. Each opens with a personal hook (something specific to the relationship). None are pure pitch — every one offers value (lead magnet, observation, introduction, etc.).

Templates are committed to the repo so they are version-controlled and improvable.

### 7.4 No automation in Phase 1

The playbook is a **doc and a rhythm**, not a tool. The user runs the cadence weekly: review the table, pick 2 contacts, customize the relevant template, send. Apollo-driven cold outreach is Phase 2 — and only after the warm playbook is documented and yielding.

### 7.5 Editorial principle for templates

Templates **offer perspective, not conclusions, and reason from primitives, not from authority.** Default tone: *"Here's how I think about X — derived from [the underlying mechanism/definition]. Curious how you'd approach it."* Never *"Here's what you should do because [expert] says so."* The contact (a peer or warm relationship) is treated as someone whose judgment is worth hearing, not someone to be sold to. Every template avoids:

- Sales-language verbs (*"close," "convert," "convince"*)
- Urgency manipulation (*"limited time," "before it's too late"*)
- Verdict framings (*"X is wrong," "you must do Y"*)
- Argument-from-authority phrasing (*"studies show," "experts agree," "Saylor says"*) — replace with the actual underlying mechanism or evidence
- Asymmetric one-way pitches (always include an invitation to respond / disagree / share their own view)

This is consistent with first-principles reasoning (§1.6) and the editorial stance (§1.7), and is itself composable on **pair #4 (cypherpunk ethics × family-office discretion)** — both traditions value epistemic humility, conversational discretion, and derivation over assertion.

---

## 8. Voice spec doc — Component 1

### 8.1 Path

`docs/marketing/voice-spec.md`

### 8.2 Contents

This is the canonical brand-voice reference, referenced by the repurposer (Component 3) at runtime and by the user when writing manually:

1. **Wedge (W3)** — verbatim
2. **The 5 named domain pairs** — the palette
3. **Synthesis check** — composability + first-principles + epistemic, all three required
4. **First-principles reasoning** — the 7 rules of derivation from fundamentals (§1.6)
5. **Editorial stance** — the 7 rules of inform-not-convince (§1.7)
6. **Brand asset stack** — the 5 deployable lines
7. **Language tracks table** — what goes where
8. **Funnel terminus CTAs** — the 2 track-specific phrases
9. **WhatsApp content-sourcing rule** — reactive only
10. **L1 outline** — the 9-chapter map (referenced from §2.2 of this spec)

The doc is the single source of truth. Changes to it propagate automatically to the repurposer via runtime read.

---

## 9. Data flow

### 9.1 Lead-magnet path

```
Reader visits BSA Spanish module / landing / homepage modal
  → submits capture form (email, track=es-consumer, source=<page-id>)
  → POST /api/subscribe
    → validate + rate-limit + dedupe
    → INSERT subscribers row
    → Resend send Email 0 (welcome + PDF link), tracking disabled
    → 200 to client → "Revisa tu correo" success state
  → Daily Vercel cron at 14:00 UTC runs /api/cron/drip
    → for each N in 1..4: find ready rows, send corresponding email
  → Reader replies to Email 4 (track-A CTA)
    → Reply lands in dalia@bitcoinsovereign.academy inbox
    → User qualifies manually, books 30-min call if appropriate
    → Call leads to TBA paid engagement (or not)
```

### 9.2 Repurposer path

```
User publishes a Substack post (EN or ES, source canonical)
  → User runs: node scripts/syndicate.mjs --source <substack-url>
    → Script fetches source via RSS
    → Claude API: identify bridged domain pair(s)
    → Claude API: generate 5 drafts (other-lang Substack, LI ES, LI EN, X, Nostr)
    → Write all to outbox/YYYY-MM-DD-<slug>/
    → Print synthesis-check report
  → User reviews drafts in editor
  → User edits + publishes manually to LinkedIn, X, Nostr, opposite-language Substack
```

### 9.3 Warm-contact path

```
Each Monday: user opens docs/marketing/warm-contacts.md
  → review table, pick 2 contacts to touch this week
  → for each: pick the relevant template, customize, send from email client
  → update Last-touch + Status columns in the doc
  → commit changes
```

---

## 10. Verification — falsifiable success criteria

Measured at week 4 and week 8 from launch (date of first capture-form deployment).

| Metric | Week 4 target | Week 8 target |
|---|---|---|
| Lead-magnet downloads | ≥10 | ≥40 |
| Drip completion rate (≥4 of 5 emails delivered, no unsub) | n/a — too small | ≥40% |
| CTA replies (consumer track) | ≥1 | ≥4 |
| Warm-contact replies / meetings booked | ≥3 | ≥8 |
| Substack subscribers (Spanish track) | 70 (60 + 10) | 100 |
| **Outcome:** paid TBA engagements attributable to the funnel | 0 acceptable | **≥1 required** |

Attribution: any new TBA client whose first contact came via lead-magnet drip OR warm-contact playbook OR Substack-migration opt-in, within the 8-week window. Tracked manually by the user.

**If the week-8 outcome metric fails (zero attributable paid engagements), Phase 1 is judged not working.** We do not expand to Phase 2; we redesign Phase 1 based on what the week-8 review reveals.

---

## 11. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Resend deliverability for `dalia@bitcoinsovereign.academy` (if domain is new to Resend) | medium | high | Verify SPF/DKIM/DMARC pre-launch; warm domain by sending Email 0 to a small test cohort first |
| Cron unreliability (Vercel cron is "best effort") | low | low | Idempotent design — missed days are caught up next run |
| Pandoc rendering issues on first PDF build | medium | medium | Test build in CI; ship iteration #1 even if styling is plain; iterate on style.css separately |
| Repurposer drafts feel AI-generated, drift from voice | medium | high | Voice spec doc is read at runtime; user reviews every draft; iterate the prompt as drafts get shipped |
| Capture form on BSA homepage modal is intrusive | medium | medium | 30s delay + dismissable + localStorage flag; test on a subset of pages first |
| Migration Substack post yields <30% opt-in | medium | low | Acceptable — quality > quantity; tells us the original list was lower-engagement than thought |
| Privacy claim is undermined by a 3rd-party script we forgot to audit | low | high | Pre-launch checklist: scan the 3 capture surfaces + drip emails for any external domain |
| Voice drift (assertion headlines, FUD-tilt, argument-from-authority, missing counter-arguments, missing derivations from primitives) | medium | high | First-principles §1.6 + Editorial stance §1.7 + three-part synthesis check §1.5 + repurposer prompt §5.6 enforce ex-ante; weekly self-audit of last 7 days of published pieces against the combined 14 rules |

---

## 12. Out of scope (Phase 2+)

Explicitly **not** in Phase 1, listed here so they don't slip in during implementation:

- English professional briefing PDF (the compiled 21-article custody+inheritance series; ships when series completes)
- Apollo cold-prospecting outreach to peers of warm contacts
- BSA cross-linking JSON manifest (auto-generated module-footer CTAs)
- Sitemap / RSS hygiene CI check
- Programmatic SEO landing pages (per-product, per-country)
- FSA Spanish localization (currently English-only)
- FSA Employer Program funnel (separate B2B track — Colombia "FSA-Institutions" course already exists, undistributed; needs its own Phase 2 spec)
- Nostr growth (sub-zero ROI at current follower count)
- Auto-translation (the Claude API can translate; Phase 1 keeps the user in the loop on every adaptation)

---

## 13. Open items requiring user action before implementation

1. **Verify `dalia@bitcoinsovereign.academy` deliverability** — can the user receive at this address, AND is the domain already configured in Resend with verified SPF/DKIM/DMARC? If not, this is the first thing to set up.
2. **Confirm Supabase write access** — the existing `subscribers` table doesn't exist yet; user needs to apply the migration in §3.4.
3. **Lead-magnet writing time** — the 9 chapters of the PDF are user-authored content (not auto-generated). Estimated drafting effort: 8–12 hours of focused writing. The implementation plan must account for this as user labor, not Claude labor.
4. **Migration Substack post timing** — user picks the right moment to publish the migration post (e.g., immediately after the lead magnet ships).

---

## 14. References

- Strategic context: `MEMORY.md` (project_strategic_positioning.md, feedback_orchestration_lens.md, feedback_challenge_and_teach.md)
- Funnel diagnosis: `reports/funnel-diagnosis-2026-04-27.md` (the immediate prior — explains why traffic itself is the bottleneck)
- Existing email infra: `api/email.ts` (Resend integration)
- Existing analytics: `api/track.ts`, `js/analytics.js`, `js/kpi-tracking.js`
- Existing rate-limiter: `api/rate-limiter.ts`
- Brand: `CLAUDE.md` (BSA voice, audience personas, design tokens)
