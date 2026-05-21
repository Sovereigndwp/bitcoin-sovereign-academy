# BSA Social Automation Workflow

This folder is the safe social publishing layer for Bitcoin Sovereign Academy.

It does **not** publish live.
It does **not** store private keys.
It does **not** require an `nsec`.
It produces daily copy-paste-ready drafts for manual publishing or for a future signer-based workflow.

## Current official identity

- Nostr account: `npub1fn3afycdlus5u495ge45ajvzrwm2mxt2sxc07yckme5al3kvs97qag2y5c`
- NIP-05: `_@bitcoinsovereign.academy`
- Lightning address: `sovereigndwp@getalby.com`
- Website: `https://bitcoinsovereign.academy`
- Support page: `https://bitcoinsovereign.academy/support/`

## Daily workflow

Run:

```bash
npm run social:daily
```

This creates:

- `content/social/daily/YYYY-MM-DD.json`
- `content/social/daily/YYYY-MM-DD.md`
- updates `content/social/daily-index.json`

The Markdown file includes copy-paste-ready drafts for:

- Nostr
- LinkedIn
- Substack Notes
- X

## Dry run

```bash
npm run social:daily:dry
```

## What this system does not do

It does not publish to Nostr.
It does not publish to LinkedIn.
It does not publish to Substack.
It does not publish to X.
It does not move sats.
It does not touch BTCPay.

Those require credentials, API approvals, platform schedulers, or a safe signer.

## Private key rule

Never place an `nsec1...` key in:

- this repo
- Codespaces
- GitHub Actions secrets unless using a fully reviewed signer architecture
- Vercel
- `.env.local`
- Claude
- ChatGPT

## Next step

Use the daily Markdown export to publish manually for the first week.
Only after the content quality is proven should a signer or scheduler be connected.
