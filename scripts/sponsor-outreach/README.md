# Sponsor Outreach Email Automation

Automated email system for Bitcoin Sovereign Academy sponsor outreach.

## Features

- **Personalized emails** based on sponsor category
- **Targeted links** to relevant platform pages per sponsor
- **HTML + plain text** email formats
- **Status tracking** for each contact
- **Follow-up scheduling** (7 days after initial contact)
- **Outreach logging** for auditing

## Setup

1. **Configure SMTP credentials:**
   ```bash
   cp .env.example .env
   # Edit .env with your SMTP credentials
   ```

2. **SMTP Options:**
   - **Proton Mail Bridge** (requires Proton Mail paid plan + Bridge app)
   - **SendGrid** - set `SMTP_HOST=smtp.sendgrid.net`, port 587
   - **Mailgun** - set `SMTP_HOST=smtp.mailgun.org`, port 587
   - **Amazon SES** - set `SMTP_HOST=email-smtp.us-east-1.amazonaws.com`

## Usage

### Preview emails (no sending)
```bash
python send_emails.py --preview
```

### Preview single contact
```bash
python send_emails.py --preview --id=trezor
```

### Check status
```bash
python send_emails.py --status
```

### Send emails
```bash
python send_emails.py --send                    # All contacts
python send_emails.py --send --pending-only     # Only pending
python send_emails.py --send --id=hrf           # Specific contact
```

## Contact Categories

| Category | Subject Focus | Target Platform |
|----------|---------------|-----------------|
| `hardware_wallet` | Self-custody education | bitcoinsovereign.academy demos |
| `infrastructure` | Node/self-hosting | Stage 2-3 modules |
| `education` | Full ecosystem | thesovereign.academy |
| `media` | Platform overview | All platforms |
| `foundation` | Grant application | GitHub + all platforms |

## Files

- `contacts.json` - Contact database with categories and personalized notes
- `outreach_log.json` - Log of all sent emails (auto-generated)
- `.env` - SMTP configuration (create from .env.example)

## Adding Contacts

Edit `contacts.json` to add new sponsors:

```json
{
  "id": "unique_id",
  "company": "Company Name",
  "email": "contact@company.com",
  "category": "hardware_wallet|infrastructure|education|media|foundation",
  "personalNote": "Why this sponsor is relevant to us",
  "featuredPages": [
    "https://bitcoinsovereign.academy/relevant/page",
    "https://thesovereign.academy"
  ],
  "status": "pending",
  "lastContacted": null,
  "followUpDate": null
}
```

## Proton Mail Note

Since your emails forward from `bitcoinsovereign.academy` to `sovereigndwp@proton.me`, you have two options:

1. **Use Proton Mail Bridge** (recommended for Proton users)
   - Install [Proton Mail Bridge](https://proton.me/mail/bridge)
   - Use the Bridge-generated credentials in `.env`

2. **Use a transactional email service**
   - SendGrid, Mailgun, or Amazon SES
   - Better deliverability for cold outreach
   - Configure SPF/DKIM for your domain
