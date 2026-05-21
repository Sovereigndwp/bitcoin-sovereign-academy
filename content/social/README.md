# content/social — Cross-platform social pipeline (manual approval)

Brand-first social posting for Bitcoin Sovereign Academy across Nostr, LinkedIn,
Substack Notes, and X. **Manual approval only. No private keys. No autonomous
publishing.** Nostr is the priority platform; the others are optional reuse.

This sits alongside the Nostr-only pipeline in `content/nostr/` and reuses the
same voice rules. Strategy: `docs/marketing/nostr-playbook.md`.

## Identity (current)

- npub: `npub1fn3afycdlus5u495ge45ajvzrwm2mxt2sxc07yckme5al3kvs97qag2y5c`
- NIP-05: `_@bitcoinsovereign.academy` (shows as `bitcoinsovereign.academy`)
- Lightning (zaps): **`sovereigndwp@getalby.com`** — the only correct address.
  Do not use any prior candidate (`bsa@coinos.io`, `dulcetsurf67367@getalby.com`,
  `creambulldog12@primal.net`).
- Site: `https://bitcoinsovereign.academy` · Support: `/support/` · Meeting: `https://meetings.hubspot.com/dalia-platt`

## Folders

```
content/social/
  nostr/            Nostr draft bank (JSON, one post per file)
  linkedin/         LinkedIn draft bank
  substack-notes/   Substack Notes draft bank
  x/                X / Twitter draft bank
  approved/         ← you move drafts here when ready to publish
  published/        ← archive + manual export bundles
  templates/        Per-post-type and per-platform templates
  calendar-30day.md Cross-platform 30-day calendar
  weekly-review.md  Weekly metrics + learning (auto-updated by the report script)
  README.md         This file
```

## Workflow

```
generate ──▶ drafts in nostr|linkedin|substack-notes|x ──▶ you review + edit
   │                                                            │
   │                                                  (move file you approve)
   ▼                                                            ▼
validate (any time)                                    content/social/approved/
                                                                │
                                                       export-approved (copy-paste)
                                                                │
                                                  you publish MANUALLY in each app
                                                                │
                                              move JSON approved/ ──▶ published/
```

1. **Generate** — `npm run social:generate` writes the curated 14-day seed set
   (14 Nostr · 7 LinkedIn · 4 Substack · 4 X) into the platform folders.
   `--extract` mode turns `content/nostr/post-bank.jsonl` into skeletons for more.
2. **Review + edit** — read each JSON, tighten the `body` to BSA voice.
3. **Validate** — `npm run social:validate` checks banned phrases, hashtags,
   links, char limits, secret-exposure language, financial-claim language, and
   per-platform CTA cadence. Fix anything that errors.
4. **Approve** — move the file into `content/social/approved/`. Only approved
   posts get exported.
5. **Export** — `npm run social:export` writes a clean copy-paste bundle into
   `published/<date>-export.txt`. Use `--dry-run` to preview without writing.
6. **Publish manually** — paste each block into the platform yourself (Nostr via
   your signer/extension; LinkedIn/Substack/X in their composers). No script
   ever touches your nsec.
7. **Archive** — move the JSON from `approved/` to `published/` and note where/when.
8. **Review weekly** — `npm run social:report` refreshes `weekly-review.md` with
   pipeline counts and a metrics/learning template to fill in.

## Draft schema

```json
{
  "version": 1,
  "status": "draft",
  "platform": "nostr",
  "slug": "short-clear-slug",
  "pillar": "custody-mistake",
  "audience": "beginner",
  "post_type": "one-idea",
  "language": "en",
  "body": "post text here",
  "links": [],
  "cta_type": "none",
  "zap_ok": false,
  "meeting_ok": false,
  "source": "source page or file",
  "notes": "why this post exists"
}
```

Allowed values:
- `platform`: `nostr` | `linkedin` | `substack` | `x`
- `pillar`: `beginner` `custody-mistake` `money` `inheritance` `sovereignty` `rail-clarity` `advisors` `families` `bsa-distribution` `zap-soft` `spanish`
- `audience`: `all` `beginner` `advisors` `families` `builders` `spanish`
- `post_type`: `one-idea` `mistake` `checklist` `question` `thread` `lesson-link` `zap-worthy` `advisor` `family` `spanish`
- `cta_type`: `none` `soft-site` `soft-demo` `lesson-link` `meeting` `zap-soft` `support`
- `language`: `en` | `es`

## Validation rules (enforced)

- Banned phrases: few understand, wake up, orange pill, have fun staying poor,
  web3, "Bitcoin fixes this", gm, to the moon, number go up, crypto revolution,
  financial revolution, future of finance, game-changer, revolutionary,
  "follow for more" (full list in `scripts/social/lib/validate.mjs`).
- ≤ 2 hashtags. ≤ 2 links per post.
- Meeting CTA ≤ 1 per 7 posts. Zap CTA ≤ 2 per 7 posts (set-level warning).
- No secret-exposure language (anything that nudges users to share a seed/nsec).
- No guaranteed returns, price targets, or "investment advice" framing.
- No repeated identical CTA lines across the batch.
- Platform char limits: Nostr ≤ 2000 (ideal < 800); X ≤ 280 unless `thread`;
  LinkedIn ideal 900–1500 (hard 3000); Substack ideal 400–1000 (hard 1500).

Errors block. "Slightly under ideal length" is a warning, not an error — short
and useful beats padded.

## Hard rules (do not change)

- No live autonomous publishing from the main account.
- No nsec / private key in any repo file, env var, GitHub Action, or Vercel.
- Future signer/bunker support may be **documented** but not activated here.
