#!/bin/bash

# Bitcoin Sovereign Academy - Site Enhancement Monitor
# Run regular checks on SEO and Security improvements

echo "🚀 Running Site Enhancement Monitor..."
echo "======================================"

# Run SEO check
echo "📈 SEO Check:"
node tools/seo-optimizer.js --directory . --verbose

echo ""

# Run Security check  
echo "🛡️ Security Check:"
node tools/security-headers.js --url https://bitcoinsovereign.academy

echo ""

# Run combined analysis
echo "🔍 Combined Analysis:"
node tools/site-enhancer.js --directory . --url https://bitcoinsovereign.academy

echo "✅ Monitoring complete - check reports/ directory for detailed results"
