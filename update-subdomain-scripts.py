#!/usr/bin/env python3
"""
Update all module pages and demos to use subdomain-based access control
"""

import os
import re
from pathlib import Path

PROJECT_ROOT = Path("/Users/dalia/projects/bitcoin-sovereign-academy")

def update_module_page(file_path):
    """Update a module HTML file to use subdomain scripts"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changed = False

    # Remove old module-gate.js script
    old_script_pattern = r'<script\s+src="/js/module-gate\.js"[^>]*>\s*</script>\s*'
    if re.search(old_script_pattern, content):
        content = re.sub(old_script_pattern, '', content)
        changed = True
        print(f"      ✓ Removed old module-gate.js")

    # Check if subdomain scripts already exist
    has_subdomain_scripts = 'subdomain-access-control.js' in content

    if not has_subdomain_scripts:
        # Add subdomain scripts before </head>
        head_close = content.find('</head>')
        if head_close != -1:
            new_scripts = '''    <script src="/js/subdomain-access-control.js"></script>
    <script src="/js/module-gate-subdomain.js"></script>
'''
            content = content[:head_close] + new_scripts + content[head_close:]
            changed = True
            print(f"      ✓ Added subdomain scripts to <head>")
    else:
        print(f"      ✓ Already has subdomain scripts")

    # Write back if changed
    if changed and content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def update_demo_page(file_path):
    """Update a demo HTML file to use subdomain locking scripts"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changed = False

    # Remove any old locking scripts
    old_patterns = [
        r'<script[^>]*demo-lock[^>]*>\s*</script>\s*',
        r'<script[^>]*preview=[^>]*>\s*</script>\s*',
    ]

    for pattern in old_patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, '', content)
            changed = True

    # Check if subdomain scripts already exist
    has_subdomain_scripts = 'demo-lock-subdomain.js' in content

    if not has_subdomain_scripts:
        # Add subdomain scripts after <body>
        body_match = re.search(r'<body[^>]*>', content)
        if body_match:
            insert_pos = body_match.end()
            new_scripts = '''
    <script src="/js/demo-lock-subdomain.js"></script>
    <script src="/js/subdomain-access-control.js"></script>'''
            content = content[:insert_pos] + new_scripts + content[insert_pos:]
            changed = True
            print(f"      ✓ Added subdomain scripts to <body>")
    else:
        print(f"      ✓ Already has subdomain scripts")

    # Write back if changed
    if changed and content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def main():
    print("🚀 Starting subdomain script update...\n")

    # ================================================================
    # Step 1: Update all module pages
    # ================================================================
    print("📝 Step 1: Updating module pages...\n")

    module_count = 0
    module_paths = list(PROJECT_ROOT.glob("paths/**/module-*.html"))

    for file_path in module_paths:
        relative_path = file_path.relative_to(PROJECT_ROOT)
        print(f"   Processing: {relative_path}")

        if update_module_page(file_path):
            module_count += 1
        print()

    print(f"✅ Updated {module_count} module pages\n")

    # ================================================================
    # Step 2: Update all demo pages
    # ================================================================
    print("📝 Step 2: Updating demo pages...\n")

    demo_count = 0
    demo_paths = list(PROJECT_ROOT.glob("interactive-demos/*/index.html"))

    # Exclude the main index
    demo_paths = [p for p in demo_paths if p.parent.name != 'interactive-demos']

    for file_path in demo_paths:
        relative_path = file_path.relative_to(PROJECT_ROOT)
        print(f"   Processing: {relative_path}")

        if update_demo_page(file_path):
            demo_count += 1
        print()

    print(f"✅ Updated {demo_count} demo pages\n")

    # ================================================================
    # Step 3: Verification
    # ================================================================
    print("🔍 Verification:\n")

    # Count modules with subdomain scripts
    module_with_subdomain = sum(1 for p in PROJECT_ROOT.glob("paths/**/module-*.html")
                                 if 'subdomain-access-control.js' in p.read_text(encoding='utf-8'))
    print(f"   Modules with subdomain scripts: {module_with_subdomain}")

    # Count demos with subdomain scripts
    demo_with_subdomain = sum(1 for p in PROJECT_ROOT.glob("interactive-demos/*/index.html")
                              if p.parent.name != 'interactive-demos' and
                              'demo-lock-subdomain.js' in p.read_text(encoding='utf-8'))
    print(f"   Demos with subdomain scripts: {demo_with_subdomain}")

    # Count modules with old scripts
    module_with_old = sum(1 for p in PROJECT_ROOT.glob("paths/**/module-*.html")
                         if 'src="/js/module-gate.js"' in p.read_text(encoding='utf-8'))
    print(f"   Modules with old module-gate.js: {module_with_old}")

    print("\n✅ Update complete!\n")
    print("📋 Summary:")
    print("   • All module pages now use subdomain-based access control")
    print("   • All demo pages now use subdomain-based locking")
    print("   • Old URL parameter-based scripts have been removed\n")
    print("🌐 Access URLs:")
    print("   • Public (gated):     https://bitcoinsovereign.academy")
    print("   • Members (unlocked): https://learn.bitcoinsovereign.academy")
    print("   • Preview (demo):     https://preview.bitcoinsovereign.academy\n")


if __name__ == "__main__":
    main()
