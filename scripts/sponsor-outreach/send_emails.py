#!/usr/bin/env python3
"""
Sponsor Outreach Email Automation
Bitcoin Sovereign Academy

Sends personalized emails to potential sponsors with targeted links
based on their category and interests.

Usage:
    python send_emails.py --preview          # Preview emails without sending
    python send_emails.py --send             # Send all pending emails
    python send_emails.py --send --id=trezor # Send to specific contact
    python send_emails.py --status           # Show contact status
"""

import argparse
import json
import os
import smtplib
import ssl
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Optional

# Configuration
SCRIPT_DIR = Path(__file__).parent
CONTACTS_FILE = SCRIPT_DIR / "contacts.json"
LOG_FILE = SCRIPT_DIR / "outreach_log.json"
ENV_FILE = SCRIPT_DIR / ".env"

# Email settings - configure in .env file
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.protonmail.ch")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "sponsors@bitcoinsovereign.academy")
SENDER_NAME = os.getenv("SENDER_NAME", "Bitcoin Sovereign Academy")

# Category-specific templates and value propositions
CATEGORY_CONFIG = {
    "hardware_wallet": {
        "subject": "Partnership: Bitcoin Self-Custody Education",
        "value_prop": "Our interactive demos and learning paths teach proper self-custody fundamentals to thousands of users—many who become your future customers.",
        "cta": "See how we prepare users for hardware wallet ownership"
    },
    "infrastructure": {
        "subject": "Partnership: Node & Self-Hosting Education",
        "value_prop": "We teach users why and how to run their own Bitcoin infrastructure—creating informed users ready for solutions like yours.",
        "cta": "View our self-hosting curriculum"
    },
    "education": {
        "subject": "Partnership: Bitcoin Education Ecosystem",
        "value_prop": "Our comprehensive learning paths take users from zero to self-sovereign, including financial literacy and advanced Bitcoin topics.",
        "cta": "Explore our full educational ecosystem"
    },
    "media": {
        "subject": "Partnership: Bitcoin Education Platform",
        "value_prop": "We're building open-source, accessible Bitcoin education with 44+ interactive demos and 5 structured learning paths.",
        "cta": "See our platform in action"
    },
    "foundation": {
        "subject": "Grant Application: Open-Source Bitcoin Education",
        "value_prop": "100% free, no signup required, no tracking—just pure Bitcoin education accessible to anyone with internet access worldwide.",
        "cta": "Review our open-source educational platform"
    }
}

def load_env():
    """Load environment variables from .env file if it exists."""
    if ENV_FILE.exists():
        with open(ENV_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ[key.strip()] = value.strip().strip('"\'')

def load_contacts() -> dict:
    """Load contacts from JSON file."""
    with open(CONTACTS_FILE) as f:
        return json.load(f)

def save_contacts(data: dict):
    """Save contacts to JSON file."""
    with open(CONTACTS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def load_log() -> list:
    """Load outreach log."""
    if LOG_FILE.exists():
        with open(LOG_FILE) as f:
            return json.load(f)
    return []

def save_log(log: list):
    """Save outreach log."""
    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2, default=str)

def generate_email(contact: dict) -> tuple[str, str, str]:
    """
    Generate personalized email for a contact.
    Returns (subject, plain_text, html_body)
    """
    category = contact["category"]
    config = CATEGORY_CONFIG.get(category, CATEGORY_CONFIG["education"])
    
    # Build featured links section
    links_html = ""
    links_text = ""
    for url in contact.get("featuredPages", []):
        links_html += f'<li><a href="{url}">{url}</a></li>\n'
        links_text += f"  • {url}\n"
    
    subject = config["subject"]
    
    # Plain text version
    plain_text = f"""Hi {contact['company']} Team,

I'm reaching out from Bitcoin Sovereign Academy, an open-source educational platform dedicated to Bitcoin and financial sovereignty.

{contact.get('personalNote', '')}

{config['value_prop']}

What we offer:
• 44+ interactive educational demos (no signup required)
• 5 structured learning paths from beginner to expert
• Complete Sovereign Path for self-custody mastery
• Financial literacy foundations at financiallysovereign.academy

{config['cta']}:
{links_text}
We're seeking sponsors and partners who share our mission of accessible Bitcoin education. Sponsorship options include:
• Logo placement and recognition
• Featured content integration
• Educational partnerships

Would you be open to a brief conversation about how we might work together?

Best regards,
The Bitcoin Sovereign Academy Team
sponsors@bitcoinsovereign.academy

---
Main Platform: https://bitcoinsovereign.academy
Full Ecosystem: https://thesovereign.academy
Financial Literacy: https://financiallysovereign.academy
GitHub: https://github.com/Sovereigndwp/bitcoin-sovereign-academy
"""

    # HTML version
    html_body = f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; }}
        .highlight {{ background: #f7931a20; padding: 15px; border-left: 4px solid #f7931a; margin: 20px 0; }}
        .cta {{ margin: 25px 0; }}
        .cta a {{ background: #f7931a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }}
        .links {{ background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }}
        .links ul {{ margin: 10px 0; padding-left: 20px; }}
        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.9em; color: #666; }}
    </style>
</head>
<body>
    <p>Hi {contact['company']} Team,</p>
    
    <p>I'm reaching out from <strong>Bitcoin Sovereign Academy</strong>, an open-source educational platform dedicated to Bitcoin and financial sovereignty.</p>
    
    <div class="highlight">
        <p><em>{contact.get('personalNote', '')}</em></p>
    </div>
    
    <p>{config['value_prop']}</p>
    
    <p><strong>What we offer:</strong></p>
    <ul>
        <li>44+ interactive educational demos (no signup required)</li>
        <li>5 structured learning paths from beginner to expert</li>
        <li>Complete Sovereign Path for self-custody mastery</li>
        <li>Financial literacy foundations at <a href="https://financiallysovereign.academy">financiallysovereign.academy</a></li>
    </ul>
    
    <div class="links">
        <p><strong>{config['cta']}:</strong></p>
        <ul>
            {links_html}
        </ul>
    </div>
    
    <p>We're seeking sponsors and partners who share our mission of accessible Bitcoin education. Sponsorship options include:</p>
    <ul>
        <li>Logo placement and recognition</li>
        <li>Featured content integration</li>
        <li>Educational partnerships</li>
    </ul>
    
    <p><strong>Would you be open to a brief conversation about how we might work together?</strong></p>
    
    <p>Best regards,<br>
    <strong>The Bitcoin Sovereign Academy Team</strong><br>
    <a href="mailto:sponsors@bitcoinsovereign.academy">sponsors@bitcoinsovereign.academy</a></p>
    
    <div class="footer">
        <p>
            <a href="https://bitcoinsovereign.academy">Main Platform</a> •
            <a href="https://thesovereign.academy">Full Ecosystem</a> •
            <a href="https://financiallysovereign.academy">Financial Literacy</a> •
            <a href="https://github.com/Sovereigndwp/bitcoin-sovereign-academy">GitHub</a>
        </p>
    </div>
</body>
</html>
"""
    
    return subject, plain_text, html_body

def send_email(contact: dict, dry_run: bool = True) -> bool:
    """Send email to a contact. Returns True on success."""
    subject, plain_text, html_body = generate_email(contact)
    
    if dry_run:
        print(f"\n{'='*60}")
        print(f"TO: {contact['email']} ({contact['company']})")
        print(f"SUBJECT: {subject}")
        print(f"{'='*60}")
        print(plain_text)
        return True
    
    # Create message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["To"] = contact["email"]
    msg["Reply-To"] = SENDER_EMAIL
    
    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(html_body, "html"))
    
    # Get SMTP password from environment
    smtp_password = os.getenv("SMTP_PASSWORD")
    if not smtp_password:
        print("ERROR: SMTP_PASSWORD not set. Add it to .env file.")
        return False
    
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SENDER_EMAIL, smtp_password)
            server.sendmail(SENDER_EMAIL, contact["email"], msg.as_string())
        print(f"✓ Sent to {contact['company']} ({contact['email']})")
        return True
    except Exception as e:
        print(f"✗ Failed to send to {contact['company']}: {e}")
        return False

def update_contact_status(contact_id: str, status: str, data: dict):
    """Update contact status after sending."""
    for contact in data["contacts"]:
        if contact["id"] == contact_id:
            contact["status"] = status
            contact["lastContacted"] = datetime.now().isoformat()
            contact["followUpDate"] = (datetime.now() + timedelta(days=7)).isoformat()
            break
    save_contacts(data)

def log_outreach(contact: dict, success: bool, log: list):
    """Log the outreach attempt."""
    log.append({
        "timestamp": datetime.now().isoformat(),
        "contact_id": contact["id"],
        "company": contact["company"],
        "email": contact["email"],
        "success": success
    })
    save_log(log)

def show_status():
    """Display current status of all contacts."""
    data = load_contacts()
    print("\n📊 Sponsor Outreach Status\n")
    print(f"{'Company':<30} {'Category':<15} {'Status':<12} {'Last Contact':<12}")
    print("-" * 75)
    
    for contact in data["contacts"]:
        last = contact.get("lastContacted") or ""
        if last:
            last = last[:10]
        print(f"{contact['company']:<30} {contact['category']:<15} {contact['status']:<12} {last:<12}")

def main():
    parser = argparse.ArgumentParser(description="Sponsor outreach email automation")
    parser.add_argument("--preview", action="store_true", help="Preview emails without sending")
    parser.add_argument("--send", action="store_true", help="Actually send the emails")
    parser.add_argument("--id", type=str, help="Send to specific contact ID only")
    parser.add_argument("--status", action="store_true", help="Show contact status")
    parser.add_argument("--pending-only", action="store_true", help="Only process pending contacts")
    
    args = parser.parse_args()
    
    load_env()
    
    if args.status:
        show_status()
        return
    
    if not args.preview and not args.send:
        parser.print_help()
        return
    
    data = load_contacts()
    log = load_log()
    
    contacts_to_process = data["contacts"]
    
    if args.id:
        contacts_to_process = [c for c in contacts_to_process if c["id"] == args.id]
        if not contacts_to_process:
            print(f"Contact '{args.id}' not found")
            return
    
    if args.pending_only:
        contacts_to_process = [c for c in contacts_to_process if c["status"] == "pending"]
    
    dry_run = args.preview
    
    if dry_run:
        print("\n🔍 PREVIEW MODE - No emails will be sent\n")
    else:
        print("\n📧 SENDING MODE - Emails will be sent\n")
        confirm = input("Are you sure you want to send emails? (yes/no): ")
        if confirm.lower() != "yes":
            print("Aborted.")
            return
    
    for contact in contacts_to_process:
        success = send_email(contact, dry_run=dry_run)
        
        if not dry_run and success:
            update_contact_status(contact["id"], "contacted", data)
            log_outreach(contact, success, log)
    
    if not dry_run:
        print(f"\n✅ Processed {len(contacts_to_process)} contacts")
        print(f"📝 Log saved to {LOG_FILE}")

if __name__ == "__main__":
    main()
