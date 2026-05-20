# Nostr Publishing Playbook — Bitcoin Sovereign Academy

**Status:** v1, May 2026
**Owner:** Dalia
**Identity (locked):** Bitcoin custody and inheritance for families and advisors. Bilingual. LATAM-fluent.
**Voice authority:** `docs/marketing/voice-spec.md` (canonical, supersedes prior voice notes)

This playbook turns existing BSA education into a daily Nostr presence that distributes the curriculum, builds trust, and accepts value-for-value zaps — without ever sounding like spam or AI.

---

## 0. Operating principles (non-negotiable)

- **No price prediction.** No "Bitcoin fixes this." No "few understand." No tribal slogans.
- **Bitcoin only.** Never lump Bitcoin with "crypto" or "web3." Stablecoins and other rails get acknowledged, never blurred.
- **First-principles, inform-not-convince.** One idea per post. Reader leaves smarter, not louder.
- **Zaps are earned.** No begging. No constant CTAs. Mention value-for-value at most once per 4–5 posts.
- **No fully automated posting until the test account proves quality.** Drafts are human-approved.

---

## 1. Account setup checklist

1. Generate a fresh Nostr keypair on a clean device — **not** in a browser tab logged into anything you care about.
   - Recommended: install [Amber](https://github.com/greenart7c3/Amber) (Android) or [nos2x](https://github.com/fiatjaf/nos2x) (browser NIP-07 signer). Or use `nostr-tools` CLI offline. Or generate via [Damus](https://damus.io) on iOS and export the nsec to a password manager.
   - Save the `nsec...` (private key, bech32) and `npub...` (public key, bech32) in 1Password / Bitwarden under "BSA Nostr master keys." **Never paste the nsec into a website.**
   - Save the hex form too (needed for `.well-known/nostr.json`). `nostr-tools` exposes `nip19.decode(nsec)` → `data.hex`.
2. Pick a **signing strategy** before touching the main account:
   - **Phone signer (recommended):** Amber for Android, or Nostore / Damus key delegation on iOS.
   - **Browser extension:** [Alby](https://getalby.com/) or [nos2x](https://github.com/fiatjaf/nos2x) — used only on the desktop you control.
   - **Remote bunker (NIP-46):** for headless automation. The nsec stays on a server you control; the publishing script asks the bunker to sign.
3. Create a **separate test account** with a throwaway nsec. All scripts run against the test account first.
4. Set the BSA profile (kind 0 metadata) using `scripts/nostr/set-profile.mjs` — see §3 for the exact JSON.
5. Add NIP-05 (§2) and Lightning address (§3) to profile.
6. Publish a pinned "Start here" post (§14).
7. Tell ~10 friendly Bitcoin educators about the account in DMs (no mass-tagging). Ask them to follow if useful.

---

## 2. NIP-05 identity setup

### Recommended primary: `_@bitcoinsovereign.academy`

Why the underscore?

- In Nostr clients, when the local part is `_`, most clients render the verified handle as just the domain — i.e. `bitcoinsovereign.academy` with the verified badge. This is the cleanest, most authoritative presentation and is what major institutional accounts use (e.g. `_@damus.io`).
- It is also the lowest-friction to type and impossible to confuse with any other identity.

### Aliases to also publish

In the same `nostr.json`:

- `bsa@bitcoinsovereign.academy` — short, brandable
- `dalia@bitcoinsovereign.academy` — reserved for a future personal account if Dalia wants one separate from the institutional handle. Initially points to the **same** BSA pubkey; can be repointed later without breaking links.

### File location and exact contents

Path on the deployed site: `https://bitcoinsovereign.academy/.well-known/nostr.json`

```json
{
  "names": {
    "_": "REPLACE_WITH_BSA_PUBKEY_HEX_LOWERCASE",
    "bsa": "REPLACE_WITH_BSA_PUBKEY_HEX_LOWERCASE",
    "dalia": "REPLACE_WITH_BSA_PUBKEY_HEX_LOWERCASE"
  },
  "relays": {
    "REPLACE_WITH_BSA_PUBKEY_HEX_LOWERCASE": [
      "wss://relay.damus.io",
      "wss://nos.lol",
      "wss://relay.primal.net",
      "wss://relay.nostr.band",
      "wss://offchain.pub"
    ]
  }
}
```

Spec requirements (verified against [nostr-protocol/nips/05](https://github.com/nostr-protocol/nips/blob/master/05.md)):

- Pubkey must be **lowercase hex**, never `npub...`.
- Server must respond with `Access-Control-Allow-Origin: *` so browser-side Nostr clients can verify.
- File must be served at exactly `/.well-known/nostr.json` (no auth, no redirect).
- Query form is `GET /.well-known/nostr.json?name=<local-part>`. Returning the full file regardless of query is acceptable — clients filter client-side.

### CORS / Vercel config

`vercel.json` `headers` block must include CORS for the well-known path. See §15.

### Verification

Once deployed, verify with:

```bash
curl -sS https://bitcoinsovereign.academy/.well-known/nostr.json | jq .
curl -sSI https://bitcoinsovereign.academy/.well-known/nostr.json | grep -i access-control
# Then in any Nostr client (Damus, Primal, Snort), set NIP-05 to "bitcoinsovereign.academy"
# and confirm the verified badge appears.
```

---

## 3. Lightning zap setup (NIP-57)

### How NIP-57 works in one paragraph

A zap is a normal Lightning payment with a Nostr "zap request" event (kind 9734) attached as a description. The recipient's Lightning Address (e.g. `bsa@coinos.io`) must point at an LNURL-pay endpoint that returns `allowsNostr: true` and the recipient's `nostrPubkey` (hex). When the payment settles, the LSP / zapper publishes a **zap receipt** (kind 9735) to the recipient's relays. Clients then display the receipt as a zap on the original post. Source: [NIP-57](https://github.com/nostr-protocol/nips/blob/master/57.md).

### Options evaluated

| Option | Custody | Onboarding | NIP-57 support | Risk | Verdict for BSA |
|---|---|---|---|---|---|
| **Wallet of Satoshi** | Custodial (Australia) | Instant, app-only | Yes (lud16) | Has geo-blocked users in past; can freeze | Good for first 30 days |
| **Coinos.io** | Custodial, Nostr-aligned | Web signup in 2 min | Yes (zap-native) | Custodial; donations-funded | **Recommended day-1 LN address** |
| **Primal wallet** | Custodial, integrated | Inside Primal app | Yes, deepest UX | Custodial; balance lives in app | Good if BSA team uses Primal |
| **Alby Hub** (self-hosted) | Self-custodial | ~1 hour on a VPS or Umbrel | Yes (LNDhub + lud16) | Operator runs the node | **Recommended sovereign target** |
| **Strike** | Custodial, US-regulated | Identity check | Yes | KYC; not aligned with sovereignty brand | Skip |
| **BTCPay Server** | Self-hosted | Days, requires sysadmin | Yes via plugin | Operator runs node | Overkill for v1 |

### Recommendation

- **Beginner-friendly (start today):** Create `bsa@coinos.io` at https://coinos.io. Free, has a Lightning address by default, and is run by Nostr-friendly people.
- **More sovereign (target within 90 days):** Migrate to [Alby Hub](https://albyhub.com/) on a small VPS or on the existing infrastructure. Lightning address becomes `bsa@<your-domain>` via the Alby Hub LNAddress route.
- **Best current for BSA right now:** start with **Coinos** so the account is live and zappable on day one, **sweep balance weekly** to BSA cold storage (or to a dedicated 1-of-3 multisig managed via The Bitcoin Adviser) so the custodial balance stays small. Plan the Alby Hub migration into the 90-day roadmap.

### Mixing-funds rule

- The Coinos / Alby Hub balance is **BSA tip-jar funds only** — never used for personal spending, never co-mingled with Dalia's personal LN wallet.
- Weekly sweep ritual: every Sunday after the analytics review, sweep balance to a labelled BSA savings wallet. This makes accounting clean and reduces custodial exposure.

### Connecting to Nostr profile

The Lightning address goes into your kind 0 metadata as the `lud16` field. Example metadata (published by `scripts/nostr/set-profile.mjs`):

```json
{
  "name": "Bitcoin Sovereign Academy",
  "display_name": "Bitcoin Sovereign Academy",
  "about": "Bitcoin education, without the confusion.\n\nInteractive lessons on money, Bitcoin, self custody, recovery, inheritance, privacy, and security.\n\nFree lessons: https://bitcoinsovereign.academy\nZaps welcome if a lesson saved you from an expensive mistake. Value for value.",
  "picture": "https://bitcoinsovereign.academy/assets/dalia/bsa-diamond-orange-on-black-1024.png",
  "banner": "https://bitcoinsovereign.academy/assets/dalia/bsa-banner-1500x500.png",
  "website": "https://bitcoinsovereign.academy",
  "nip05": "_@bitcoinsovereign.academy",
  "lud16": "bsa@coinos.io"
}
```

(Use the actual asset paths that exist; if banner asset is not yet produced, omit `banner` rather than 404.)

---

## 4. Relay strategy

Goal: redundancy + reach, not max count. 5–7 relays is the sweet spot. More than 10 wastes bandwidth and slows publishing without adding readers.

### Starting set (publish to all of these)

| Relay | Why included |
|---|---|
| `wss://relay.damus.io` | Largest iOS reach (Damus default) |
| `wss://nos.lol` | Popular, neutral, free, well-maintained |
| `wss://relay.primal.net` | Primal app readership + caching index |
| `wss://relay.nostr.band` | Best search index — your posts become discoverable |
| `wss://offchain.pub` | Bitcoin-focused community, less noise |
| `wss://nostr.mom` | Reliable EU relay, geographic diversity |

### Optional paid relay (add after week 2)

- `wss://nostr.wine` — paid (~$7/mo via Lightning). Sharply reduces spam-reading and improves reachability for paying followers. Add once you confirm a small but real readership exists.

### Read-only relays (subscribe but don't write)

- `wss://relay.snort.social` — Snort web client default; auto-mirrors from your write set, no need to push.

### Configuration

The relay list lives in two places:

1. `config/nostr.json` — used by all `scripts/nostr/*` automation.
2. The `relays` block in `.well-known/nostr.json` — used by clients during NIP-05 verification.

Keep them in sync. If you add a relay, update both files in the same commit.

---

## 5. Content strategy

### Cadence (default week)

| Slot | Type | Notes |
|---|---|---|
| Daily, 1 main note | Pillar post (see below) | One idea, 1–6 lines |
| Daily, ~2 reply notes | Thoughtful replies to other educators / beginners | Not threads, not generic agreement |
| Weekly thread | 5–8 notes, one step each | E.g. "How an inheritance plan actually works" |
| Weekly lesson card | One concept, screenshot-quality formatting | Use Nostr long-form (kind 30023) if image not produced |
| Weekly "mistake of the week" | Mistake prevention, no shame | Pillar 2 |
| Weekly open question | Ask the audience | E.g. "What do most clients get wrong about cold storage?" |
| Monthly long form | Kind 30023 (NIP-23) | Republish from BSA deep-dives where appropriate |

Maximum CTAs per week: **5 soft site CTAs**, **1–2 meeting CTAs**. Everything else is content alone.

### Content pillars

1. **Bitcoin beginner clarity** — what is a UTXO, seed, hardware wallet, Lightning, node
2. **Mistake prevention** — the tool vs. the plan, untested backups, "savings wallet ≠ spending wallet"
3. **First-principles money** — debasement, unit of account drift, exit not gamble
4. **Sovereignty through practice** — heirs, address verification, single-point-of-failure tests
5. **Layer and rail clarity** — Bitcoin vs USDT vs ETF vs custodial app
6. **Advisor / family-office** — ETF gives exposure, custody gives control, inheritance is where most advice quietly breaks
7. **BSA lesson distribution** — pointers to /start/, /paths/curious/, /interactive-demos/, deep-dives

### Pillar rotation by day-of-week

| Day | Pillar |
|---|---|
| Mon | Mistake prevention |
| Tue | Beginner clarity |
| Wed | Money first principles |
| Thu | Custody / inheritance |
| Fri | Layer / rail clarity |
| Sat | Practice / interactive demo |
| Sun | Reflection / weekly recap |

### The "would I zap this?" filter

Before any post leaves drafts/, it must pass all of:

- Useful even without clicking the link?
- Teaches exactly one idea?
- No hype, no price talk, no slogans?
- Reader feels smarter, not lectured at?
- Clear (silent) next step?

### Language

- English primary. Two posts/week in Spanish, written natively (not translated from English). The Spanish post is usually a Saturday or Sunday slot.
- Voice: direct, useful, simple, slightly sharp when useful. Plain language, short paragraphs, occasional questions, no hashtag pile-ups (≤2 hashtags total per post, often zero).

---

## 6. Posting schedule

- **Anchor time:** 14:00 UTC for the main post (mid-morning Americas, evening Europe). Best engagement window for Bitcoin Nostr based on relay activity heatmaps.
- **Reply notes:** scattered organically through the day. Don't batch them into a 5-minute block — looks botted.
- **Weekly thread:** Wednesday or Thursday 14:00 UTC (mid-week traction is highest for long content).
- **No weekend bulk dumps.** One Sat post + one Sun post is enough.

---

## 7. Automation architecture

```
┌───────────────────────┐
│  content/nostr/       │  Markdown / JSON post bank (humans write here)
│  ├── drafts/          │
│  ├── approved/        │  ← human moves files here when ready
│  ├── published/       │  ← script moves files here after publish
│  ├── post-bank.jsonl  │  Catalog of 40 ready posts
│  └── calendar-30day.md│  Day-by-day plan
└──────────┬────────────┘
           │
           ▼
┌─────────────────────────┐
│  scripts/nostr/         │
│  publish-approved.mjs   │  Reads approved/, signs, publishes, moves to published/
│  publish-one.mjs        │  Same but for a single file. Supports --dry-run.
│  set-profile.mjs        │  Publishes kind 0 metadata
│  relay-check.mjs        │  Tests connectivity to configured relays
│  zap-profile-check.mjs  │  Verifies NIP-05 + lud16 round-trips
│  weekly-report.mjs      │  Counts events, replies, zaps over last 7 days
│  generate-from-pages.mjs│  (optional) drafts new posts from BSA HTML
└─────────┬───────────────┘
          │ Reads
          ▼
┌─────────────────────────┐
│  config/nostr.json      │  Relays, kinds, defaults (NOT secrets)
│  .env.local             │  NSEC or NIP-46 bunker URI (gitignored)
└─────────────────────────┘
```

### Signing modes

The publishing script supports three modes, selected by env var `NOSTR_SIGNER_MODE`:

- `env` — reads `NOSTR_PRIVATE_KEY_HEX` from `.env.local`. Used for local CI on a trusted machine. Default for v1.
- `bunker` — reads `NOSTR_BUNKER_URI` (NIP-46 connection string, e.g. `bunker://...?relay=...&secret=...`). The script never touches the nsec; it asks the bunker to sign. Recommended once Amber/Alby Hub bunker is set up.
- `dry-run` — does not publish; prints the signed event to stdout. Use first when testing.

### Why not fully automated day-1

A single AI-sounding post on a brand-new account tanks credibility for weeks. The first 7 days are **fully manual** (you draft, you approve, you publish via the script with `--dry-run` then real). After week 1, the script reads from `approved/` on a schedule, but **you** still have to move files into `approved/`. There is no autonomous generation in v1.

---

## 8. Content extraction pipeline

`scripts/nostr/generate-from-pages.mjs` walks a list of canonical BSA pages and emits one or more **draft JSON files** per page. The script does not call any LLM; it extracts the H1, first paragraph, any callout/warning blocks, and any checklist items, then maps them into the draft schema. The human edits the resulting drafts in `content/nostr/drafts/` to match voice — the extractor is a starting point, not a finisher.

Pages it scans:

```
index.html
start/index.html
start-simple.html
interactive-demos/index.html
paths/curious/index.html
paths/hurried/index.html
paths/pragmatist/index.html
paths/principled/index.html
paths/sovereign/index.html
paths/builder/index.html
deep-dives/index.html
articles/  (all)
answers/  (all)
glossary.html
```

Each emitted draft is tagged with one or more of:

`beginner, custody, inheritance, privacy, security, wallets, lightning, money, advisors, families, mistakes, deep-dive, CTA-light, CTA-meeting, zap-soft`

---

## 9. Draft approval workflow

```
drafts/ ──(human moves)──▶ approved/ ──(publish-approved.mjs)──▶ published/
```

Every draft is a JSON file. Filename convention: `YYYY-MM-DD-<slug>.json` (the date is the **intended** publish date, not when the file was created).

Schema (validated by `scripts/nostr/lib/schema.mjs`):

```json
{
  "version": 1,
  "slug": "hardware-wallet-is-not-a-plan",
  "status": "draft",
  "scheduled_for": "2026-05-25T14:00:00Z",
  "pillar": "custody-mistake",
  "audience": "beginner",
  "lang": "en",
  "cta": "soft-site",
  "zap_ok": false,
  "source_page": "/paths/sovereign/",
  "tags": ["custody", "mistakes"],
  "kind": 1,
  "body": "A hardware wallet is useful.\n\nIt is not a plan...",
  "links": ["https://bitcoinsovereign.academy/paths/sovereign/"]
}
```

`cta` options: `none`, `soft-site`, `soft-demo`, `meeting`, `zap-soft`.
`zap_ok` flips the post into a "value-for-value" framing (used at most once every 4–5 posts).

After publish, the script writes a sibling file in `published/` with the same fields plus:

```json
{
  "published_at": "2026-05-25T14:00:03.812Z",
  "event_id": "abc123…",
  "relays_ok": ["wss://relay.damus.io", "wss://nos.lol"],
  "relays_failed": [],
  "nostr_uri": "nostr:nevent1…"
}
```

---

## 10. Analytics & growth tracking

`scripts/nostr/weekly-report.mjs` queries the configured relays for events authored by the BSA pubkey in the last 7 days and aggregates:

- New followers (count of unique pubkeys that authored kind 3 contact lists including BSA)
- Replies (kind 1 events tagging your event IDs)
- Reposts (kind 6) and quote-reposts
- Zap receipts (kind 9735) — counts and total sats
- Top 5 posts by replies + zaps combined
- Posts with no engagement (candidates to retire from rotation)

Report is written to `content/nostr/analytics/YYYY-MM-DD-week-N.md`.

Manual weekly review (Sunday, 30 min):

1. Read the weekly report.
2. Which post got zapped? Why? Write that down — it goes into the next series.
3. Which post was ignored? Is it the topic, the framing, or the timing?
4. Which question came up in replies more than once? That becomes next week's thread.
5. Update `content/nostr/series/weekly-series.md` with the answer.

---

## 11. Tip and subscriber funnel

```
Nostr feed
   │
   ▼
Pinned "Start here" post (npub bio + lud16)
   │
   ├─▶ Free lesson (BSA path or demo)         → subscriber via /start/
   │       │
   │       └─▶ "If this saved you confusion, zaps welcome" (1 in 5 posts)
   │              │
   │              └─▶ Lightning zap to bsa@coinos.io  → value-for-value loop
   │
   └─▶ Advisor / family CTA (1–2x/week max)
            │
            └─▶ https://meetings.hubspot.com/dalia-platt  → consult
```

Funnel rules:

- The "subscribe" action is "follow on Nostr + bookmark `/start/`." Email subscribe is upstream (Substack) — invite from the BSA `/nostr/` page, never from a Nostr post.
- The meeting CTA points only at `meetings.hubspot.com/dalia-platt`. No alternate URLs.
- Tip framing is always **value-for-value**, never "donate," never "support me."

---

## 12. Technical implementation plan

Files created in this commit — see §15 for the full list. Phased rollout:

### Phase A — site-side (deployable today)

1. `.well-known/nostr.json` with placeholder pubkey
2. `/nostr/` landing page
3. `vercel.json` CORS header for `.well-known/nostr.json`
4. Footer "Follow on Nostr" link on `index.html` (commented hidden until pubkey is live; uncomment in a follow-up commit)

### Phase B — automation (local-only until tested)

5. `config/nostr.json`
6. `content/nostr/` directory (post bank, drafts, calendar)
7. `scripts/nostr/` (all scripts)
8. `.env.example` and `.env.local` template
9. New `package.json` deps: `nostr-tools`, `dotenv`, `ws`

### Phase C — go-live (after 7 days of manual test posts)

10. Generate real keypair → fill in `.well-known/nostr.json` → deploy
11. Configure Coinos LN address → set profile via `set-profile.mjs`
12. Publish pinned "Start here" post manually
13. Begin posting via `publish-approved.mjs` from `approved/` queue
14. Uncomment Nostr link in footer
15. Schedule weekly report (`weekly-report.mjs`) for Sunday 18:00 UTC

---

## 13. Security checklist

### Key handling

- [ ] Master nsec generated on a clean device, stored only in a password manager and in a paper backup in a fireproof box. Never on the laptop's plain filesystem.
- [ ] Hex form of nsec exists only in `.env.local` (gitignored) **or** is never touched at all if using bunker mode.
- [ ] `.env.local` is in `.gitignore` (it already is — verified).
- [ ] No private key ever appears in `index.html`, in any `js/` file, in `api/` functions, or in any committed config.
- [ ] `git log -p` on the repo never shows an nsec or hex private key. If it ever does, **rotate immediately** (publish kind 0 metadata + first kind 1 from a new keypair, mark the old one compromised).
- [ ] A pre-commit hook scans staged files for `nsec1[a-z0-9]{58}` and refuses the commit if found.

### Bunker mode (preferred long-term)

- [ ] Bunker URI lives only in `.env.local` and the bunker host's own config. Never in the repo.
- [ ] The bunker requires per-event approval for the first 30 days (manual whitelist). After confidence is built, can switch to auto-approve for `kind: 1` only.

### Test account first

- [ ] Generate a throwaway nsec, save it under `NOSTR_TEST_PRIVATE_KEY_HEX` in `.env.local`.
- [ ] All scripts default to the test pubkey when `NOSTR_USE_TEST=1`. Verified by inspecting log output before flipping the flag.
- [ ] First 7 days of posts go to the test account only.

### Rotation procedure

If the master nsec is ever exposed:

1. Generate a new keypair.
2. Update `.well-known/nostr.json` with the new pubkey.
3. From the **new** key, publish a kind 1 announcing the rotation and link the new npub.
4. From the **old** key (if still accessible), publish a kind 1 with the same announcement.
5. Update profile (kind 0) on the new key.
6. Update password manager. Burn the old nsec in your records.

### Code-level safeguards

- All scripts default to `--dry-run` if the flag is omitted and `NOSTR_USE_TEST` is not set.
- The publisher refuses to run if `NOSTR_USE_TEST` is unset AND `NOSTR_CONFIRM_LIVE=YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN` is not set.
- Logs never print the nsec, hex private key, or bunker secret. Logs do print the npub (public).

---

## 14. First 30 days of posts

See [`content/nostr/calendar-30day.md`](../../content/nostr/calendar-30day.md) for the day-by-day plan and [`content/nostr/post-bank.jsonl`](../../content/nostr/post-bank.jsonl) for 40 ready-to-publish posts.

Cadence summary for the 30 days:

- 30 main posts (one per day)
- ~60 reply notes (organic, not scripted — guidelines only)
- 4 weekly threads
- 4 weekly lesson cards
- 4 mistake-of-the-week posts
- 4 open questions
- 8 Spanish posts (2/week)
- 1 monthly long-form (kind 30023) on day 28

The pinned "Start here" post (also in the calendar as day 1) is:

```
Bitcoin education, without the confusion.

I build free interactive lessons on money, Bitcoin, self custody, recovery, inheritance, privacy, and security.

Start here:
https://bitcoinsovereign.academy/start/

Practice safely:
https://bitcoinsovereign.academy/interactive-demos/

If the content saves you time, confusion, or an expensive mistake, zaps are welcome.
Value for value.
```

---

## 15. Exact files to create or modify

Created in this commit:

```
docs/marketing/nostr-playbook.md                  ← this file
.well-known/nostr.json                            ← NIP-05 (placeholder pubkey)
nostr/index.html                                  ← /nostr/ landing page
config/nostr.json                                 ← relay list + script defaults
content/nostr/README.md                           ← how this dir works
content/nostr/post-bank.jsonl                     ← 40 ready posts
content/nostr/calendar-30day.md                   ← 30-day plan
content/nostr/series/weekly-series.md             ← weekly series definitions
content/nostr/templates/main-post.md              ← templates
content/nostr/templates/reply.md
content/nostr/templates/thread.md
content/nostr/templates/long-form.md
content/nostr/drafts/.gitkeep
content/nostr/approved/.gitkeep
content/nostr/published/.gitkeep
content/nostr/analytics/.gitkeep
scripts/nostr/README.md
scripts/nostr/lib/nostr-client.mjs                ← SimplePool wrapper
scripts/nostr/lib/sign.mjs                        ← env / bunker / dry-run modes
scripts/nostr/lib/schema.mjs                      ← draft schema validator
scripts/nostr/lib/load-draft.mjs                  ← JSON ↔ event helper
scripts/nostr/publish-approved.mjs                ← main publisher
scripts/nostr/publish-one.mjs                     ← single-file publisher
scripts/nostr/set-profile.mjs                     ← kind 0 metadata publisher
scripts/nostr/relay-check.mjs                     ← connectivity test
scripts/nostr/zap-profile-check.mjs               ← NIP-05 + lud16 round-trip
scripts/nostr/weekly-report.mjs                   ← analytics
scripts/nostr/generate-from-pages.mjs             ← BSA HTML → draft skeletons
```

Modified in this commit:

```
vercel.json                                       ← CORS header for /.well-known/nostr.json
.env.example                                      ← add Nostr block
package.json                                      ← add deps + npm scripts
index.html                                        ← footer "Follow on Nostr" (commented until pubkey live)
```

---

## 16. Commands to run

### One-time setup

```bash
# Install deps (nostr-tools, dotenv, ws)
npm install

# Copy env template, fill in keys
cp .env.example .env.local
# Edit .env.local — add NOSTR_TEST_PRIVATE_KEY_HEX (test account) at minimum

# Verify relays are reachable
NOSTR_USE_TEST=1 node scripts/nostr/relay-check.mjs
```

### Day-1 to day-7 (manual / test account)

```bash
# Set test-account profile
NOSTR_USE_TEST=1 node scripts/nostr/set-profile.mjs

# Move a draft to approved, then publish with dry-run
mv content/nostr/drafts/2026-05-25-hardware-wallet-not-a-plan.json content/nostr/approved/
NOSTR_USE_TEST=1 node scripts/nostr/publish-approved.mjs --dry-run

# Real publish to test account
NOSTR_USE_TEST=1 node scripts/nostr/publish-approved.mjs
```

### Go-live (week 2+)

```bash
# Update .well-known/nostr.json with real BSA pubkey hex, commit, push, deploy
sed -i.bak "s/REPLACE_WITH_BSA_PUBKEY_HEX_LOWERCASE/<actual_hex>/g" .well-known/nostr.json
rm .well-known/nostr.json.bak
git add .well-known/nostr.json && git commit -m "Set BSA Nostr pubkey in NIP-05"

# Publish profile metadata to main account
NOSTR_CONFIRM_LIVE=YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN node scripts/nostr/set-profile.mjs

# Publish queued approved posts
NOSTR_CONFIRM_LIVE=YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN node scripts/nostr/publish-approved.mjs

# Sunday weekly report
node scripts/nostr/weekly-report.mjs
```

### Helpful checks

```bash
# Verify NIP-05 + lud16 resolve and the LNURL endpoint advertises Nostr
node scripts/nostr/zap-profile-check.mjs

# Generate draft skeletons from existing BSA pages
node scripts/nostr/generate-from-pages.mjs --out content/nostr/drafts/
```

---

## 17. Testing checklist

- [ ] `node scripts/nostr/relay-check.mjs` reports all configured relays reachable in under 3s each.
- [ ] `node scripts/nostr/zap-profile-check.mjs` confirms:
  - `/.well-known/nostr.json` returns 200 with `Access-Control-Allow-Origin: *`
  - The hex pubkey is lowercase and matches the test/main account
  - The `lud16` resolves and the LNURL endpoint returns `allowsNostr: true` plus a valid `nostrPubkey`
- [ ] `publish-one.mjs --dry-run` emits a valid signed kind 1 event with no relay write.
- [ ] After a real publish to the test account, the event is visible in Damus, Primal, and Snort within 30s.
- [ ] Duplicate publish guard: re-running `publish-approved.mjs` on the same approved/ does **not** publish a second copy (files have moved to published/).
- [ ] Failed-relay tolerance: if one relay rejects, the script logs it and continues; the draft only moves to `published/` if at least 2 of the configured relays accepted.
- [ ] `git log -p` shows no nsec, no hex private key, no bunker secret.
- [ ] `grep -r 'nsec1' --exclude-dir=node_modules .` returns no matches.
- [ ] The `/nostr/` landing page loads on mobile, the CTAs work, the npub copy-button works.
- [ ] All links in the first 30 days of posts resolve to 200 (run `node scripts/nostr/zap-profile-check.mjs --check-links`).

---

## 18. Launch checklist

Phase A — site (today):

- [ ] Merge this branch to `main`
- [ ] Verify `https://bitcoinsovereign.academy/.well-known/nostr.json` returns 200 with CORS header
- [ ] Verify `https://bitcoinsovereign.academy/nostr/` loads on mobile and desktop

Phase B — account (this week):

- [ ] Generate BSA Nostr keypair
- [ ] Store nsec in password manager + paper backup
- [ ] Replace `REPLACE_WITH_BSA_PUBKEY_HEX_LOWERCASE` in `.well-known/nostr.json` with the real hex pubkey
- [ ] Create `bsa@coinos.io` Lightning address
- [ ] Verify NIP-05 + lud16 resolve via `scripts/nostr/zap-profile-check.mjs`
- [ ] Publish kind 0 profile metadata via `set-profile.mjs`
- [ ] Publish pinned "Start here" post manually
- [ ] Set up Amber (Android) or NIP-46 bunker for ongoing signing

Phase C — content (week 2 onward):

- [ ] First 7 days of posts published manually from test account, voice reviewed
- [ ] Move to main account; publish day-8 through day-30 from `approved/` queue
- [ ] Sunday week-1 report generated
- [ ] Footer "Follow on Nostr" link uncommented in `index.html`

Phase D — optimization (month 2+):

- [ ] Migrate Lightning address from `bsa@coinos.io` to self-hosted Alby Hub on `bsa@bitcoinsovereign.academy`
- [ ] Add paid relay `wss://nostr.wine` once readership is real
- [ ] Cross-post weekly recap to Substack / LinkedIn (manual, not automated)

---

## References (verified May 2026)

- [NIP-05: Mapping Nostr keys to DNS-based internet identifiers](https://github.com/nostr-protocol/nips/blob/master/05.md)
- [NIP-57: Lightning Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md)
- [NIP-46: Nostr Remote Signing (bunker)](https://github.com/nostr-protocol/nips/blob/master/46.md)
- [NIP-23: Long-form content](https://github.com/nostr-protocol/nips/blob/master/23.md)
- [nostr-tools (nbd-wtf)](https://github.com/nbd-wtf/nostr-tools)
- [Coinos.io](https://coinos.io) — recommended initial Lightning address provider
- [Alby Hub](https://albyhub.com/) — recommended sovereign target
- [Amber](https://github.com/greenart7c3/Amber) — Android signer
- [Damus](https://damus.io) — iOS client
- [Primal](https://primal.net) — cross-platform client + caching relay
