#!/usr/bin/env python3
"""
Content Audit Extractor
Extracts text content from HTML module files for analysis
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup
import json

def extract_text_content(html_file):
    """Extract meaningful text content from HTML file"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()

        # Extract key elements
        data = {
            'file': str(html_file),
            'title': soup.find('title').get_text() if soup.find('title') else '',
            'h1': [h.get_text(strip=True) for h in soup.find_all('h1')],
            'h2': [h.get_text(strip=True) for h in soup.find_all('h2')],
            'h3': [h.get_text(strip=True) for h in soup.find_all('h3')],
            'paragraphs': [p.get_text(strip=True) for p in soup.find_all('p') if len(p.get_text(strip=True)) > 20],
            'lists': [li.get_text(strip=True) for li in soup.find_all('li') if len(li.get_text(strip=True)) > 10],
        }

        return data
    except Exception as e:
        return {'file': str(html_file), 'error': str(e)}

def scan_path_modules(base_path):
    """Scan all modules in a learning path"""
    path = Path(base_path)
    modules = []

    for html_file in sorted(path.rglob('*.html')):
        # Skip index files for now, focus on modules
        if 'module' in html_file.name or 'deep-dive' in html_file.name:
            modules.append(extract_text_content(html_file))

    return modules

# Main paths to audit
base = Path('/Users/dalia/projects/bitcoin-sovereign-academy/paths')
paths = {
    'curious': base / 'curious',
    'builder': base / 'builder',
    'sovereign': base / 'sovereign',
    'principled': base / 'principled',
    'pragmatist': base / 'pragmatist',
    'hurried': base / 'hurried',
}

results = {}
for name, path in paths.items():
    if path.exists():
        print(f"Scanning {name} path...")
        results[name] = scan_path_modules(path)

# Save results
with open('content-audit-data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\nExtracted content from all paths. Saved to content-audit-data.json")

# Quick stats
for path_name, modules in results.items():
    print(f"{path_name}: {len(modules)} modules")
