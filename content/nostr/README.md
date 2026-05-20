# content/nostr — Nostr post pipeline

This directory is the human-edited side of the BSA Nostr publishing system. See `docs/marketing/nostr-playbook.md` for the strategic playbook.

## Flow

```
drafts/  →  approved/  →  published/
```

- **`drafts/`** — JSON files, one per intended post. You edit here. Filename: `YYYY-MM-DD-<slug>.json` (date = intended publish date).
- **`approved/`** — when a draft is voice-checked and ready, **you move it here**. The publishing script only reads from this directory.
- **`published/`** — after `publish-approved.mjs` publishes a post, the script moves the file here and adds `event_id`, `published_at`, and `relays_ok` fields.

## Reference files

- `post-bank.jsonl` — 40+ ready-to-publish posts. JSONL: one JSON object per line.
- `calendar-30day.md` — first 30 days of slots mapped to `post-bank.jsonl` IDs.
- `templates/` — copy-paste templates for main posts, replies, threads, long form.
- `series/weekly-series.md` — recurring weekly series.
- `analytics/` — weekly reports written by `weekly-report.mjs`.

## Promoting a post from the bank into a scheduled draft

```bash
# Pick a post from the bank, write a draft for a specific date
node scripts/nostr/promote-from-bank.mjs --id p001 --date 2026-05-25
# (or do it by hand: copy the JSON object, save as drafts/2026-05-25-hardware-wallet-not-a-plan.json,
#  add a `scheduled_for` ISO timestamp, and set `status: "draft"`.)
```

## Draft schema

```json
{
  "version": 1,
  "slug": "kebab-case-slug",
  "status": "draft",
  "scheduled_for": "2026-05-25T14:00:00Z",
  "pillar": "custody-mistake",
  "audience": "all",
  "lang": "en",
  "cta": "none",
  "zap_ok": false,
  "source_page": "/paths/sovereign/",
  "tags": ["custody", "mistakes"],
  "kind": 1,
  "body": "Post text. \\n for line breaks.",
  "links": []
}
```

Allowed values:
- `pillar`: `beginner` | `custody-mistake` | `money` | `inheritance` | `sovereignty` | `rail-clarity` | `advisors` | `bsa-distribution` | `zap-soft`
- `audience`: `all` | `beginner` | `advisors` | `families`
- `cta`: `none` | `soft-site` | `soft-demo` | `meeting` | `zap-soft`
- `lang`: `en` | `es`
- `kind`: `1` (short note) or `30023` (long form)

## The voice check (run this on every draft before approving)

- Is it useful without clicking the link?
- Does it teach exactly one idea?
- Does it avoid: "Bitcoin fixes this," "few understand," "wake up," "have fun staying poor," "orange pill," "crypto," "web3," price predictions, tribal attacks, AI-sounding hooks, hashtag pile-ups?
- Does it sound like Dalia would actually say it?

If any answer is no, edit. If you can't fix it in two passes, kill the draft.
