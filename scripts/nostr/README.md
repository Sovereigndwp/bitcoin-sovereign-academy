# scripts/nostr — Nostr automation

Node ESM scripts that turn `content/nostr/approved/*.json` into signed, published Nostr events. See `docs/marketing/nostr-playbook.md` §7 for the architecture and §13 for the security model.

## Setup (one time)

```bash
npm install                       # installs nostr-tools, dotenv, ws
cp .env.example .env.local
# Edit .env.local — minimum:
#   NOSTR_TEST_PRIVATE_KEY_HEX=<64-char hex of throwaway nsec>
#   NOSTR_SIGNER_MODE=env
```

Verify env is set up correctly:

```bash
NOSTR_USE_TEST=1 node scripts/nostr/relay-check.mjs
```

## Daily commands

```bash
# Check NIP-05 + lud16 resolution end-to-end
node scripts/nostr/zap-profile-check.mjs

# Publish all approved drafts (dry-run, prints signed events, does not write)
NOSTR_USE_TEST=1 node scripts/nostr/publish-approved.mjs --dry-run

# Real publish to test account
NOSTR_USE_TEST=1 node scripts/nostr/publish-approved.mjs

# Real publish to MAIN account (requires explicit confirm flag)
NOSTR_CONFIRM_LIVE=YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN \
  node scripts/nostr/publish-approved.mjs

# Publish kind 0 profile metadata
NOSTR_USE_TEST=1 node scripts/nostr/set-profile.mjs

# Weekly analytics report
node scripts/nostr/weekly-report.mjs
```

## Safety gates

- Scripts default to **test account** unless `NOSTR_USE_TEST=0` is explicitly set OR `NOSTR_CONFIRM_LIVE` env var matches the exact string `YES_I_REALLY_WANT_TO_PUBLISH_FROM_MAIN`.
- `--dry-run` flag is supported on every publisher.
- Logs never print the private key, hex private key, or bunker secret. Logs do print the npub.

## File map

```
lib/
  nostr-client.mjs    SimplePool wrapper, relay timeouts, multi-relay publish
  sign.mjs            env / bunker / dry-run signer abstraction
  schema.mjs          draft JSON validator
  load-draft.mjs      converts draft JSON into a Nostr event object
publish-approved.mjs  reads approved/, signs, publishes, moves to published/
publish-one.mjs       publishes one file. Supports --dry-run, --file=...
set-profile.mjs       kind 0 (metadata) publisher from config/nostr.json
relay-check.mjs       latency + connectivity test for each configured relay
zap-profile-check.mjs verifies NIP-05 hex pubkey + lud16 LNURL allowsNostr
weekly-report.mjs     pulls last 7 days of own events + replies + zaps
generate-from-pages.mjs  walks BSA HTML pages, drafts skeletons into drafts/
```

## Signer modes

Set via `NOSTR_SIGNER_MODE` in `.env.local`.

- `env` — uses `NOSTR_PRIVATE_KEY_HEX` (or `NOSTR_TEST_PRIVATE_KEY_HEX` when test mode). Default for v1.
- `bunker` — uses `NOSTR_BUNKER_URI` (NIP-46). Recommended once Amber or Alby Hub bunker is wired up. The nsec never enters this repo or this process — the bunker signs remotely.
- `dry-run` — does not sign or publish; prints what would be signed. Useful for CI lint.
