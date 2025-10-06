#!/bin/bash

# Script to create remaining Builder and Sovereign path structures
# This creates placeholder pages that can be filled with content later

echo "Creating remaining learning path structure..."

# Create Builder Stage 2-4 overview pages
cat > paths/builder/stage-2/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stage 2: Lightning Network | The Builder Path</title>
    <meta http-equiv="refresh" content="0;url=/paths/builder/">
</head>
<body>
    <p>Redirecting to Builder Path overview...</p>
    <p>Stage 2 content is under construction. Check back soon!</p>
</body>
</html>
EOF

cat > paths/builder/stage-3/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stage 3: Building Applications | The Builder Path</title>
    <meta http-equiv="refresh" content="0;url=/paths/builder/">
</head>
<body>
    <p>Redirecting to Builder Path overview...</p>
    <p>Stage 3 content is under construction. Check back soon!</p>
</body>
</html>
EOF

cat > paths/builder/stage-4/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stage 4: Contributing to Bitcoin | The Builder Path</title>
    <meta http-equiv="refresh" content="0;url=/paths/builder/">
</head>
<body>
    <p>Redirecting to Builder Path overview...</p>
    <p>Stage 4 content is under construction. Check back soon!</p>
</body>
</html>
EOF

# Create Sovereign Path structure
mkdir -p paths/sovereign/stage-{1,2,3}

cat > paths/sovereign/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Sovereign Path | Bitcoin Sovereign Academy</title>
    <meta http-equiv="refresh" content="0;url=/">
</head>
<body>
    <p>Redirecting to homepage...</p>
    <p>The Sovereign Path content is under construction. Check back soon!</p>
</body>
</html>
EOF

for i in {1..3}; do
    cat > paths/sovereign/stage-$i/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stage $i | The Sovereign Path</title>
    <meta http-equiv="refresh" content="0;url=/paths/sovereign/">
</head>
<body>
    <p>Redirecting to Sovereign Path overview...</p>
    <p>Stage $i content is under construction. Check back soon!</p>
</body>
</html>
EOF
done

echo "✓ Created Builder Stage 2-4 placeholders"
echo "✓ Created Sovereign Path placeholders"
echo ""
echo "Next steps:"
echo "1. Create full Builder Stage 1 Module 1 with UTXO content"
echo "2. Fill in Builder Stage 2-4 modules progressively"
echo "3. Fill in Sovereign Path modules based on architecture doc"
echo ""
echo "All paths now have basic structure for navigation!"
