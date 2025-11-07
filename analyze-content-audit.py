#!/usr/bin/env python3
"""
Content Audit Analyzer
Analyzes extracted content for logic flow, redundancy, and clarity issues
"""

import json
import re
from collections import defaultdict, Counter
from pathlib import Path

# Load extracted content
with open('content-audit-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 80)
print("BITCOIN SOVEREIGN ACADEMY - COMPREHENSIVE CONTENT AUDIT")
print("=" * 80)

# ===============================================
# 1. TERM FREQUENCY ANALYSIS (Redundancy Check)
# ===============================================
print("\n" + "=" * 80)
print("1. TERM FREQUENCY ANALYSIS - Identifying Redundancies")
print("=" * 80)

key_terms = {
    '21 million': r'21\s*million|21M',
    'halving': r'halving|halvening',
    'private key': r'private\s*key',
    'public key': r'public\s*key',
    'seed phrase': r'seed\s*phrase|recovery\s*phrase|backup\s*phrase',
    'UTXO': r'UTXO|unspent\s*transaction\s*output',
    'blockchain': r'blockchain|block\s*chain',
    'Lightning Network': r'Lightning\s*Network|Layer\s*2',
    'inflation': r'\binflation\b',
    'decentralization': r'decentrali[sz]ation',
    'Bitcoin': r'\bBitcoin\b',  # Uppercase
    'bitcoin': r'\bbitcoin\b',  # Lowercase
    'wallet': r'\bwallet\b',
}

term_counts = {path: {term: 0 for term in key_terms} for path in data.keys()}

for path_name, modules in data.items():
    for module in modules:
        all_text = ' '.join(module.get('paragraphs', []) + module.get('h2', []) + module.get('h3', []))

        for term, pattern in key_terms.items():
            matches = len(re.findall(pattern, all_text, re.IGNORECASE))
            term_counts[path_name][term] += matches

print("\nKey Term Frequencies by Path:")
print("-" * 80)
for term in key_terms.keys():
    print(f"\n{term}:")
    for path in ['curious', 'builder', 'sovereign', 'principled', 'pragmatist']:
        if path in term_counts:
            count = term_counts[path][term]
            print(f"  {path:15s}: {count:4d} mentions")

# ===============================================
# 2. "WHAT IS BITCOIN?" REDUNDANCY
# ===============================================
print("\n" + "=" * 80)
print("2. 'WHAT IS BITCOIN?' - Cross-Path Redundancy Check")
print("=" * 80)

bitcoin_intro_modules = []
for path_name, modules in data.items():
    for module in modules:
        title = module.get('title', '').lower()
        h1 = ' '.join(module.get('h1', [])).lower()
        h2 = ' '.join(module.get('h2', [])).lower()

        if any(phrase in (title + h1 + h2) for phrase in ['what is bitcoin', 'enter bitcoin', 'bitcoin basics']):
            bitcoin_intro_modules.append({
                'path': path_name,
                'file': Path(module['file']).name,
                'title': module.get('title', 'N/A'),
                'headings': module.get('h2', [])[:5]
            })

print(f"\nFound {len(bitcoin_intro_modules)} modules introducing Bitcoin:")
for mod in bitcoin_intro_modules:
    print(f"\n- {mod['path']} / {mod['file']}")
    print(f"  Title: {mod['title']}")
    print(f"  Key sections: {', '.join(mod['headings'][:3])}")

# ===============================================
# 3. PREREQUISITE FLOW ANALYSIS
# ===============================================
print("\n" + "=" * 80)
print("3. PREREQUISITE FLOW ANALYSIS - Key Concept Introduction Order")
print("=" * 80)

# Track where key concepts are first introduced
concepts = {
    'blockchain': r'blockchain|block\s*chain',
    'UTXO': r'UTXO|unspent\s*transaction\s*output',
    'private key': r'private\s*key',
    'mining': r'\bmining\b|\bminer\b',
    'halving': r'halving|halvening',
    'Lightning': r'Lightning\s*Network',
    'multisig': r'multisig|multi-signature',
    'cold storage': r'cold\s*storage',
    'hash': r'hash|SHA-256|cryptographic\s*hash',
}

for path_name in ['curious', 'builder', 'sovereign', 'principled']:
    if path_name not in data:
        continue

    print(f"\n{path_name.upper()} Path - Concept Introduction Order:")
    print("-" * 60)

    concept_found = {concept: False for concept in concepts}

    for idx, module in enumerate(data[path_name], 1):
        file_name = Path(module['file']).name
        all_text = ' '.join(module.get('paragraphs', [])[:10] + module.get('h2', []))

        introduced_here = []
        for concept, pattern in concepts.items():
            if not concept_found[concept]:
                if re.search(pattern, all_text, re.IGNORECASE):
                    concept_found[concept] = True
                    introduced_here.append(concept)

        if introduced_here:
            print(f"  Module {idx} ({file_name}): {', '.join(introduced_here)}")

# ===============================================
# 4. JARGON WITHOUT DEFINITION
# ===============================================
print("\n" + "=" * 80)
print("4. POTENTIAL JARGON ISSUES - Terms Used Without Definition")
print("=" * 80)

# Check if technical terms are used before being explained
# Simple heuristic: if term appears in early modules, is it defined?

technical_terms = ['UTXO', 'SHA-256', 'elliptic curve', 'Byzantine', 'consensus',
                   'Merkle tree', 'nonce', 'difficulty adjustment', 'mempool']

print("\nScanning for unexplained technical terms in beginner content...")
print("-" * 80)

for path_name in ['curious', 'pragmatist']:  # Beginner paths
    if path_name not in data:
        continue

    print(f"\n{path_name.upper()} Path:")

    # Look at first 3 modules only
    for module in data[path_name][:3]:
        file_name = Path(module['file']).name
        paragraphs = ' '.join(module.get('paragraphs', []))

        found_terms = []
        for term in technical_terms:
            if re.search(r'\b' + re.escape(term) + r'\b', paragraphs, re.IGNORECASE):
                # Check if it's explained (heuristic: followed by definition markers)
                context = paragraphs[max(0, paragraphs.lower().find(term.lower())-100):
                                     paragraphs.lower().find(term.lower())+200]

                if not any(marker in context.lower() for marker in [' is ', ' means ', ' refers to', 'called', 'definition']):
                    found_terms.append(term)

        if found_terms:
            print(f"  {file_name}: {', '.join(found_terms)} (possibly undefined)")

# ===============================================
# 5. SENTENCE LENGTH ANALYSIS (Readability)
# ===============================================
print("\n" + "=" * 80)
print("5. READABILITY - Sentence Length Analysis")
print("=" * 80)

def analyze_sentences(paragraphs):
    """Basic sentence length analysis"""
    all_text = ' '.join(paragraphs)
    sentences = re.split(r'[.!?]+', all_text)
    sentences = [s.strip() for s in sentences if len(s.strip().split()) > 3]

    if not sentences:
        return None

    word_counts = [len(s.split()) for s in sentences]
    avg_length = sum(word_counts) / len(word_counts)
    long_sentences = [s for s in sentences if len(s.split()) > 35]

    return {
        'avg': avg_length,
        'long_count': len(long_sentences),
        'total': len(sentences),
        'long_pct': (len(long_sentences) / len(sentences) * 100) if sentences else 0
    }

print("\nAverage sentence length by path (ideal: 15-20 words):")
print("-" * 80)

for path_name in ['curious', 'builder', 'sovereign', 'principled']:
    if path_name not in data or not data[path_name]:
        continue

    all_paragraphs = []
    for module in data[path_name]:
        all_paragraphs.extend(module.get('paragraphs', []))

    stats = analyze_sentences(all_paragraphs)
    if stats:
        print(f"{path_name:15s}: {stats['avg']:.1f} words/sentence | "
              f"{stats['long_pct']:.1f}% are 35+ words ({stats['long_count']}/{stats['total']})")

# ===============================================
# 6. HEADING STRUCTURE ANALYSIS
# ===============================================
print("\n" + "=" * 80)
print("6. MODULE STRUCTURE - Heading Hierarchy Check")
print("=" * 80)

for path_name in ['curious', 'builder']:
    if path_name not in data:
        continue

    print(f"\n{path_name.upper()} Path - Module Structures:")
    print("-" * 60)

    for module in data[path_name][:5]:  # First 5 modules
        file_name = Path(module['file']).name
        h1_count = len(module.get('h1', []))
        h2_count = len(module.get('h2', []))
        h3_count = len(module.get('h3', []))

        print(f"{file_name:30s}: H1={h1_count}, H2={h2_count}, H3={h3_count}")

        # Check for issues
        if h1_count > 1:
            print(f"  ⚠️  WARNING: Multiple H1 tags (should be 1)")
        if h2_count > 8:
            print(f"  ⚠️  WARNING: Many H2 sections ({h2_count}) - might be too dense")

# ===============================================
# 7. CROSS-PATH CONTENT COMPARISON
# ===============================================
print("\n" + "=" * 80)
print("7. CROSS-PATH REDUNDANCY - Similar Content Detection")
print("=" * 80)

def get_module_text_sample(module, words=100):
    """Get first N words of module content"""
    paragraphs = module.get('paragraphs', [])
    all_text = ' '.join(paragraphs)
    words_list = all_text.split()[:words]
    return ' '.join(words_list)

# Compare "What is Money" modules across paths
print("\nComparing 'What is Money?' / Stage 1 Module 1 across paths:")
print("-" * 80)

stage1_mod1 = {}
for path_name in ['curious', 'builder', 'principled']:
    if path_name in data and data[path_name]:
        # Get first module
        first_mod = data[path_name][0]
        stage1_mod1[path_name] = {
            'file': Path(first_mod['file']).name,
            'title': first_mod.get('title', ''),
            'h2_count': len(first_mod.get('h2', [])),
            'text_sample': get_module_text_sample(first_mod, 50)
        }

for path, info in stage1_mod1.items():
    print(f"\n{path}:")
    print(f"  File: {info['file']}")
    print(f"  Title: {info['title']}")
    print(f"  Sections: {info['h2_count']}")
    print(f"  Sample: {info['text_sample'][:150]}...")

print("\n" + "=" * 80)
print("END OF AUTOMATED ANALYSIS")
print("=" * 80)

# Save detailed report
with open('content-audit-report.txt', 'w', encoding='utf-8') as f:
    f.write("CONTENT AUDIT AUTOMATED ANALYSIS COMPLETE\n")
    f.write("See console output for detailed findings.\n")

print("\n✅ Audit analysis complete. Check console output for findings.")
