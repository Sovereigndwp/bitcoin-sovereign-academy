#!/usr/bin/env python3
"""
Lab Re-mapping Script — Bitcoin Sovereign Academy
Replaces over-assigned 'explore-mempool' lab cards with contextually
appropriate alternatives matched to each module's actual topic.

Run: python3 scripts/remap-labs.py
     python3 scripts/remap-labs.py --dry-run   (preview only, no writes)
"""

import re
import sys
import glob

BASE = '/Users/dalia/projects/bitcoin-sovereign-academy/paths'
DRY_RUN = '--dry-run' in sys.argv

# ─────────────────────────────────────────────────────────────────────────────
# REMAP TABLE
# Each entry: (relative_path, new_lab_id, icon, card_title, card_desc, network, [tags])
# Set new_lab_id = 'explore-mempool' to intentionally keep the existing card.
# ─────────────────────────────────────────────────────────────────────────────
REMAPS = [

    # ── Builder ──────────────────────────────────────────────────────────────
    # "Bitcoin Protocol Deep Dive" → decode-transaction shows the protocol in bytes
    ('builder/stage-1/module-1.html', 'decode-transaction', '🧾',
     'Decode a Bitcoin Transaction',
     "Parse a raw transaction hex byte-by-byte — see the protocol in action, no abstraction.",
     'mainnet', ['Mempool.space', '20 min']),

    # "Proof of Work" → keep explore-mempool (blocks and hashrate are directly relevant)
    ('builder/stage-1/module-3.html', 'explore-mempool', None, None, None, None, None),

    # "Bitcoin Core Development" → verify-download (first step before contributing)
    ('builder/stage-4/module-1.html', 'verify-download', '🔏',
     'Verify a Bitcoin Core Download',
     "Use GPG signatures and SHA256 to confirm software authenticity before running or contributing.",
     'mainnet', ['GPG + Terminal', '15 min']),

    # "Your First Contribution" → verify-download (verify every build you touch)
    ('builder/stage-4/module-3.html', 'verify-download', '🔏',
     'Verify a Bitcoin Software Download',
     "Before contributing, always verify: SHA256 checksum + GPG signature from the developer.",
     'mainnet', ['GPG + Terminal', '15 min']),

    # ── Curious ───────────────────────────────────────────────────────────────
    # "What is Money?" → keep explore-mempool (seeing live Bitcoin transactions illustrates money)
    ('curious/stage-1/module-1.html', 'explore-mempool', None, None, None, None, None),

    # "Problems with Traditional Money" → first-address (move from problem to alternative)
    ('curious/stage-1/module-2.html', 'first-address', '🔑',
     'Generate Your First Bitcoin Address',
     "Move from theory to practice: create a real Bitcoin address on the signet test network.",
     'signet', ['Sparrow Wallet', '10 min']),

    # "Enter Bitcoin" → full setup walkthrough (enter Bitcoin by actually using it)
    ('curious/stage-1/module-3.html', 'sparrow-sparrow-import', '🚀',
     'Complete Bitcoin Setup Walkthrough',
     "Install Sparrow, create your wallet, back up your seed, and send your first test transaction.",
     'signet', ['Sparrow Wallet', '30 min']),

    # "How Bitcoin Works" → keep explore-mempool (mempool visualizes how txs propagate)
    ('curious/stage-2/module-1.html', 'explore-mempool', None, None, None, None, None),

    # ── Observer ──────────────────────────────────────────────────────────────
    # "Reading the Bitcoin Price" → keep explore-mempool (on-chain context complements price data)
    ('observer/stage-1/module-1.html', 'explore-mempool', None, None, None, None, None),

    # ── Pragmatist ────────────────────────────────────────────────────────────
    # "What is Bitcoin?" → full setup (pragmatist wants to use it, not just understand it)
    ('pragmatist/stage-1/module-1.html', 'sparrow-sparrow-import', '🚀',
     'Complete Bitcoin Setup Walkthrough',
     "Skip straight to doing: install Sparrow, create a wallet, back up your seed, send a test transaction.",
     'signet', ['Sparrow Wallet', '30 min']),

    # "Bitcoin Economics & Strategy" → fee-estimation (economic decisions = fee strategy)
    ('pragmatist/stage-2/module-7-economics.html', 'fee-estimation', '📊',
     'Estimate and Control Transaction Fees',
     "Choose the right fee for your timeframe — and bump a stuck transaction using RBF.",
     'signet', ['Sparrow Wallet', '15 min']),

    # ── Principled ────────────────────────────────────────────────────────────
    # Stage 1: Philosophy of rules and value
    # "Law of Conservation of Value" → decode-transaction (rules enforced without authority)
    ('principled/stage-1/module-1.html', 'decode-transaction', '🧾',
     'Read a Raw Bitcoin Transaction',
     "See how Bitcoin enforces its rules in code — value conserved by cryptography, not trust.",
     'mainnet', ['Mempool.space', '20 min']),

    # "Entropy and Corruption" → verify-download (entropy: corrupt downloads are real)
    ('principled/stage-1/module-2.html', 'verify-download', '🔏',
     'Verify Your Bitcoin Software',
     "Entropy and corruption are real — verify every download with GPG before trusting it.",
     'mainnet', ['GPG + Terminal', '15 min']),

    # "The Role of Rules" → address-types (rules encoded in Bitcoin script)
    ('principled/stage-1/module-3.html', 'address-types', '🔖',
     'Explore Bitcoin Address Types',
     "Rules encoded in script: see how each address type enforces different spending conditions.",
     'mainnet', ['Sparrow Wallet', '15 min']),

    # Stage 2: Coordination, corruption, trust
    # "The Coordination Problem" → coin-control (coordinating UTXOs = coordination theory)
    ('principled/stage-2/module-1.html', 'coin-control', '🎛️',
     'Practice Coin Control for Privacy',
     "Coordination at the UTXO level: choose which coins to combine and what history you reveal.",
     'signet', ['Sparrow Wallet', '20 min']),

    # "The Corruption Curve" → passphrase-wallet (isolation protects against corruption)
    ('principled/stage-2/module-2.html', 'passphrase-wallet', '🔐',
     'Create a Passphrase-Protected Wallet',
     "Separation prevents corruption: add a 25th word and explore plausible deniability.",
     'signet', ['Sparrow Wallet', '20 min']),

    # "Trust, Power, and Accountability" → cold-storage-setup (trust through architecture)
    ('principled/stage-2/module-3.html', 'cold-storage-setup', '🧊',
     'Set Up Cold Storage',
     "Trust through architecture: simulate an air-gapped signing wallet and watch-only companion.",
     'signet', ['Sparrow Wallet', '30 min']),

    # Stage 3: Ledger, truth, memory
    # "The Ledger as Civilization's Memory" → keep explore-mempool (the ledger IS the mempool)
    ('principled/stage-3/module-2.html', 'explore-mempool', None, None, None, None, None),

    # "The Cost of Truth" → decode-transaction (truth costs: every byte has a fee)
    ('principled/stage-3/module-3.html', 'decode-transaction', '🧾',
     'Decode a Bitcoin Transaction',
     "The cost of truth: parse every byte — inputs, outputs, fees, locking scripts.",
     'mainnet', ['Mempool.space', '20 min']),

    # Stage 4: Physics, incentives, organisms
    # "The Physics of Proof" → fee-estimation (proof of work is fee market energy)
    ('principled/stage-4/module-1.html', 'fee-estimation', '⚡',
     'Estimate Transaction Fees',
     "The physics of proof-of-work made tangible: fee markets express real energy and time costs.",
     'signet', ['Sparrow Wallet', '15 min']),

    # "Incentives and Game Theory" → lightning-routing (routing fees = game theory live)
    ('principled/stage-4/module-2.html', 'lightning-routing', '🔀',
     'Explore Lightning Network Routing',
     "Game theory in action: nodes compete, cooperate, and earn fees routing payments.",
     'mainnet', ['amboss.space', '15 min']),

    # "Bitcoin as a Living Organism" → sparrow-watch-only (observe without interfering)
    ('principled/stage-4/module-3.html', 'sparrow-watch-only', '👁️',
     'Create a Watch-Only Wallet',
     "Observe without touching: monitor an address\'s balance and history without holding keys.",
     'signet', ['Sparrow Wallet', '20 min']),

    # Stage 5: Energy, verification, coordination
    # "Energy Civilization" → keep explore-mempool (hashrate/energy context is relevant)
    ('principled/stage-5/module-1.html', 'explore-mempool', None, None, None, None, None),

    # "Verification Culture" → verify-download (verification culture = this exact skill)
    ('principled/stage-5/module-2.html', 'verify-download', '🔏',
     'Verify Bitcoin Software Authenticity',
     "Verification culture practiced: GPG-sign, hash-check, and trust nothing unconfirmed.",
     'mainnet', ['GPG + Terminal', '15 min']),

    # "The Future of Human Coordination" → inheritance-drill (multigenerational coordination)
    ('principled/stage-5/module-3.html', 'inheritance-drill', '📜',
     'Bitcoin Inheritance Drill',
     "Long-term coordination tested: verify your documentation is complete enough for an heir.",
     'signet', ['Sparrow Wallet', '25 min']),

    # ── Sovereign ─────────────────────────────────────────────────────────────
    # "Bitcoin Privacy Fundamentals" → coin-control (the primary privacy tool)
    ('sovereign/stage-2/module-1.html', 'coin-control', '🎛️',
     'Coin Control for Privacy',
     "Privacy fundamentals in practice: select UTXOs deliberately and understand what the blockchain reveals.",
     'signet', ['Sparrow Wallet', '20 min']),
]

# ─────────────────────────────────────────────────────────────────────────────
# Card HTML builder
# ─────────────────────────────────────────────────────────────────────────────
def make_card(lab_id, icon, title, desc, network, tags):
    net_cls = ' signet' if network == 'signet' else ' mainnet'
    tags_html = f'<span class="lab-card-tag{net_cls}">{network}</span>'
    for t in tags:
        tags_html += f'<span class="lab-card-tag">{t}</span>'
    # Use single quotes inside onclick to avoid escaping issues
    return (
        f'<div class="lab-card" data-lab="{lab_id}" '
        f"onclick=\"openLab('{lab_id}')\" style=\"cursor:pointer;\">\n"
        f'    <div class="lab-card-icon">{icon}</div>\n'
        f'    <div class="lab-card-body">\n'
        f'        <div class="lab-card-eyebrow">⚡ Try It Now</div>\n'
        f'        <h3>{title}</h3>\n'
        f'        <p>{desc}</p>\n'
        f'        <div class="lab-card-meta">\n'
        f'            {tags_html}\n'
        f'        </div>\n'
        f'    </div>\n'
        f'    <div class="lab-card-arrow">→</div>\n'
        f'</div>'
    )

# ─────────────────────────────────────────────────────────────────────────────
# Find closing </div> of a card starting at start_idx
# ─────────────────────────────────────────────────────────────────────────────
def find_card_end(content, start_idx):
    depth = 0
    i = start_idx
    while i < len(content):
        if content[i:i+4] == '<div':
            depth += 1
        elif content[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return i + 6
        i += 1
    return -1

# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
changed = 0
kept = 0
errors = []

print(f"{'[DRY RUN] ' if DRY_RUN else ''}Lab re-mapping — Bitcoin Sovereign Academy\n")

for entry in REMAPS:
    fpath_rel, new_lab, icon, title, desc, network, tags = entry
    fpath = BASE + '/' + fpath_rel

    # Intentionally kept as explore-mempool
    if new_lab == 'explore-mempool':
        print(f'  KEEP  {fpath_rel}  (explore-mempool fits topic)')
        kept += 1
        continue

    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        marker = '<div class="lab-card" data-lab="explore-mempool"'
        start_idx = content.find(marker)

        if start_idx == -1:
            errors.append(f'NOT FOUND: {fpath_rel}')
            print(f'  SKIP  {fpath_rel}  (explore-mempool card not found)')
            continue

        end_idx = find_card_end(content, start_idx)
        if end_idx == -1:
            errors.append(f'CARD END NOT FOUND: {fpath_rel}')
            print(f'  SKIP  {fpath_rel}  (could not find closing </div>)')
            continue

        new_card = make_card(new_lab, icon, title, desc, network, tags)
        new_content = content[:start_idx] + new_card + content[end_idx:]

        if DRY_RUN:
            print(f'  WOULD CHANGE  {fpath_rel}  →  {new_lab}')
        else:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'  ✓  {fpath_rel}  →  {new_lab}')

        changed += 1

    except Exception as e:
        errors.append(f'ERROR {fpath_rel}: {e}')
        print(f'  ERROR  {fpath_rel}: {e}')

print(f'\nSummary: {"Would change" if DRY_RUN else "Changed"}: {changed}, Kept explore-mempool: {kept}')
if errors:
    print(f'Errors ({len(errors)}):')
    for e in errors:
        print(f'  {e}')
