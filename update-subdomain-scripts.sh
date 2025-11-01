#!/bin/bash

# ================================================================
# Update all module pages and demos to use subdomain-based access
# ================================================================

set -e

PROJECT_ROOT="/Users/dalia/projects/bitcoin-sovereign-academy"
cd "$PROJECT_ROOT"

echo "🚀 Starting subdomain script update..."
echo ""

# ================================================================
# Step 1: Update all module pages
# ================================================================

echo "📝 Step 1: Updating module pages..."
echo ""

MODULE_COUNT=0

# Find all module HTML files
find paths -name "module-*.html" -type f | while read -r file; do
    echo "   Processing: $file"

    # Check if file has old module-gate.js
    if grep -q '<script src="/js/module-gate.js"' "$file"; then
        echo "      ✓ Found old module-gate.js, replacing..."

        # Remove old script
        sed -i.backup 's|<script src="/js/module-gate.js"[^>]*></script>||g' "$file"

        # Add new scripts to <head> section (before </head>)
        if ! grep -q 'subdomain-access-control.js' "$file"; then
            sed -i '' '/<\/head>/i\
    <script src="/js/subdomain-access-control.js"></script>\
    <script src="/js/module-gate-subdomain.js"></script>
' "$file"
            echo "      ✓ Added subdomain scripts to <head>"
        else
            echo "      ⚠ Subdomain scripts already present"
        fi

        MODULE_COUNT=$((MODULE_COUNT + 1))
    else
        echo "      ⚠ No old module-gate.js found, checking for subdomain scripts..."

        # If no subdomain scripts, add them
        if ! grep -q 'subdomain-access-control.js' "$file"; then
            sed -i '' '/<\/head>/i\
    <script src="/js/subdomain-access-control.js"></script>\
    <script src="/js/module-gate-subdomain.js"></script>
' "$file"
            echo "      ✓ Added subdomain scripts to <head>"
            MODULE_COUNT=$((MODULE_COUNT + 1))
        else
            echo "      ✓ Already has subdomain scripts"
        fi
    fi

    echo ""
done

echo "✅ Updated $MODULE_COUNT module pages"
echo ""

# ================================================================
# Step 2: Update all demo pages
# ================================================================

echo "📝 Step 2: Updating demo pages..."
echo ""

DEMO_COUNT=0

# Find all demo index.html files
find interactive-demos -name "index.html" -type f | while read -r file; do
    echo "   Processing: $file"

    # Check if it's the main index (skip it)
    if [ "$file" = "interactive-demos/index.html" ]; then
        echo "      ⚠ Skipping main index"
        echo ""
        continue
    fi

    # Check for any existing lock scripts
    HAS_OLD_SCRIPTS=false
    if grep -q 'demo-lock' "$file" || grep -q 'preview=' "$file"; then
        HAS_OLD_SCRIPTS=true
        echo "      ✓ Found old lock scripts"
    fi

    # Remove any old locking scripts from body
    sed -i.backup 's|<script[^>]*demo-lock[^>]*></script>||g' "$file"
    sed -i '' 's|<script[^>]*access-control[^>]*></script>||g' "$file"

    # Add subdomain scripts to body (after <body> tag)
    if ! grep -q 'demo-lock-subdomain.js' "$file"; then
        # Find the <body> tag and add scripts after it
        sed -i '' '/<body>/a\
    <script src="/js/demo-lock-subdomain.js"></script>\
    <script src="/js/subdomain-access-control.js"></script>
' "$file"
        echo "      ✓ Added subdomain locking scripts to <body>"
        DEMO_COUNT=$((DEMO_COUNT + 1))
    else
        echo "      ✓ Already has subdomain scripts"
    fi

    echo ""
done

echo "✅ Updated $DEMO_COUNT demo pages"
echo ""

# ================================================================
# Step 3: Clean up backup files
# ================================================================

echo "🧹 Cleaning up backup files..."
find paths interactive-demos -name "*.backup" -delete
echo "✅ Cleanup complete"
echo ""

# ================================================================
# Step 4: Verification
# ================================================================

echo "🔍 Verification:"
echo ""

MODULE_WITH_SUBDOMAIN=$(find paths -name "module-*.html" -type f -exec grep -l "subdomain-access-control.js" {} \; | wc -l)
echo "   Modules with subdomain scripts: $MODULE_WITH_SUBDOMAIN"

DEMO_WITH_SUBDOMAIN=$(find interactive-demos -name "index.html" -type f ! -path "interactive-demos/index.html" -exec grep -l "demo-lock-subdomain.js" {} \; | wc -l)
echo "   Demos with subdomain scripts: $DEMO_WITH_SUBDOMAIN"

MODULE_WITH_OLD=$(find paths -name "module-*.html" -type f -exec grep -l 'src="/js/module-gate.js"' {} \; | wc -l)
echo "   Modules with old module-gate.js: $MODULE_WITH_OLD"

echo ""
echo "✅ Update complete!"
echo ""
echo "📋 Summary:"
echo "   • All module pages now use subdomain-based access control"
echo "   • All demo pages now use subdomain-based locking"
echo "   • Old URL parameter-based scripts have been removed"
echo ""
echo "🌐 Access URLs:"
echo "   • Public (gated):     https://bitcoinsovereign.academy"
echo "   • Members (unlocked): https://learn.bitcoinsovereign.academy"
echo "   • Preview (demo):     https://preview.bitcoinsovereign.academy"
echo ""
