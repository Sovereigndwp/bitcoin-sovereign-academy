#!/usr/bin/env python3
"""
Inject analytics, email capture, and tip CTA components into all content pages.

Idempotent: skips files that already have the components.
"""

import os
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Content directories to process
CONTENT_DIRS = [
    os.path.join(ROOT, "paths"),
    os.path.join(ROOT, "interactive-demos"),
    os.path.join(ROOT, "deep-dives"),
]

# Snippet to inject (before </body>)
SNIPPET = """
<!-- Analytics, Email Capture & Tip CTAs -->
<div class="container" style="margin: 2rem auto; max-width: 900px; padding: 0 1.5rem;">
    <div id="email-capture-page" data-email-capture="page-footer" data-title="📬 Stay Updated" data-subtitle="Get Bitcoin insights and new content announcements. No spam, ever."></div>
    <div id="tip-page" data-tip-cta="compact"></div>
</div>
<script src="/js/analytics.js"></script>
<script src="/js/email-capture.js"></script>
<script src="/js/tip-cta.js"></script>
"""

MARKER = "/js/analytics.js"

stats = {"injected": 0, "skipped": 0, "errors": 0}


def process_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        # Skip if already has analytics (idempotent)
        if MARKER in content:
            stats["skipped"] += 1
            return

        # Find </body> tag (case-insensitive)
        lower = content.lower()
        idx = lower.rfind("</body>")
        if idx == -1:
            stats["skipped"] += 1
            return

        # Also skip injecting duplicate tip-cta if already present
        # (we'll still add analytics and email-capture)
        snippet = SNIPPET
        if "/js/tip-cta.js" in content:
            # Remove tip-cta lines from snippet
            lines = snippet.split("\n")
            lines = [l for l in lines if "tip-cta" not in l]
            snippet = "\n".join(lines)

        if "/js/email-capture.js" in content:
            lines = snippet.split("\n")
            lines = [l for l in lines if "email-capture" not in l]
            snippet = "\n".join(lines)

        # Inject before </body>
        new_content = content[:idx] + snippet + "\n" + content[idx:]

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

        stats["injected"] += 1

    except Exception as e:
        print(f"  ERROR: {filepath}: {e}")
        stats["errors"] += 1


def main():
    files = []
    for d in CONTENT_DIRS:
        files.extend(glob.glob(os.path.join(d, "**", "*.html"), recursive=True))

    print(f"Found {len(files)} HTML files to process")

    for f in sorted(files):
        process_file(f)
        rel = os.path.relpath(f, ROOT)
        if stats["injected"] and stats["injected"] % 25 == 0:
            print(f"  ...processed {stats['injected']} files")

    print(f"\nDone!")
    print(f"  Injected: {stats['injected']}")
    print(f"  Skipped (already had scripts): {stats['skipped']}")
    print(f"  Errors: {stats['errors']}")


if __name__ == "__main__":
    main()
