#!/usr/bin/env python3
"""
Link Checker for Bitcoin Sovereign Academy
Tests all internal links in HTML files
"""

import os
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

# ANSI color codes
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

def find_html_files(root_dir):
    """Find all HTML files in the project"""
    html_files = []
    for path in Path(root_dir).rglob('*.html'):
        # Skip node_modules, .git, etc.
        if any(skip in str(path) for skip in ['node_modules', '.git', 'dist', 'build']):
            continue
        html_files.append(path)
    return html_files

def extract_links(file_path):
    """Extract all href and src links from an HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"{YELLOW}⚠ Could not read {file_path}: {e}{NC}")
        return []

    # Extract href attributes
    href_pattern = r'href=["\']([^"\']+)["\']'
    hrefs = re.findall(href_pattern, content)

    # Extract src attributes
    src_pattern = r'src=["\']([^"\']+)["\']'
    srcs = re.findall(src_pattern, content)

    return hrefs + srcs

def is_external_link(link):
    """Check if a link is external"""
    return link.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:'))

def resolve_path(file_path, link, root_dir):
    """Resolve a relative link to an absolute file path"""
    # Remove anchor
    link_without_anchor = link.split('#')[0]

    if not link_without_anchor:
        return None  # Just an anchor

    # Handle absolute paths from root
    if link_without_anchor.startswith('/'):
        return root_dir / link_without_anchor.lstrip('/')

    # Handle relative paths
    file_dir = file_path.parent
    return (file_dir / link_without_anchor).resolve()

def check_links(root_dir):
    """Check all links in HTML files"""
    root_path = Path(root_dir)
    html_files = find_html_files(root_path)

    print(f"{BLUE}🔍 Bitcoin Sovereign Academy - Link Testing{NC}")
    print("=" * 50)
    print(f"\nFound {len(html_files)} HTML files\n")
    print("Testing links...\n")

    broken_links = []
    total_links = 0
    files_checked = 0

    for html_file in sorted(html_files):
        links = extract_links(html_file)
        files_checked += 1

        for link in links:
            # Skip external links
            if is_external_link(link):
                continue

            # Skip empty links and pure anchors
            if not link or link.startswith('#'):
                continue

            total_links += 1

            # Resolve the link
            target = resolve_path(html_file, link, root_path)

            if target is None:
                continue  # Just an anchor

            # Check if target exists
            if not target.exists():
                broken_links.append({
                    'file': html_file.relative_to(root_path),
                    'link': link,
                    'resolved': target
                })

    # Print results
    print("=" * 50)
    print(f"\nFiles checked: {files_checked}")
    print(f"Internal links tested: {total_links}")
    print()

    if broken_links:
        print(f"{RED}✗ Found {len(broken_links)} broken link(s):{NC}\n")
        for item in broken_links:
            print(f"{RED}✗ BROKEN{NC}")
            print(f"  File: {item['file']}")
            print(f"  Link: {item['link']}")
            print(f"  Expected: {item['resolved']}")
            print()
        return 1
    else:
        print(f"{GREEN}✓ All {total_links} internal links are working!{NC}")
        return 0

if __name__ == '__main__':
    root_directory = Path(__file__).parent
    exit_code = check_links(root_directory)
    exit(exit_code)
