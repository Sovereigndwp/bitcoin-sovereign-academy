#!/bin/bash

# Bitcoin Sovereign Academy - Local Production Server Startup Script
# This script handles all deployment options for local testing

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      🚀 Bitcoin Sovereign Academy - Local Production Setup     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on port
kill_port() {
    local PORT=$1
    local PID=$(lsof -t -i :$PORT)
    if [ ! -z "$PID" ]; then
        echo "⚠️  Port $PORT is in use by PID $PID. Stopping..."
        kill -9 $PID 2>/dev/null
        sleep 1
    fi
}

# Parse command line arguments
MODE=${1:-menu}

# Display menu if no argument provided
if [ "$MODE" = "menu" ]; then
    echo "Select deployment option:"
    echo ""
    echo "  1) 🐍 Quick Static Server (Python)"
    echo "  2) 🚀 Full Node.js Server (with MCP API)"
    echo "  3) 🔒 Secure HTTPS Server (self-signed cert)"
    echo "  4) 📦 Install Dependencies First"
    echo "  5) 🧪 Test Current Deployment"
    echo "  6) 🔍 Performance Analysis (Lighthouse)"
    echo "  7) 🛑 Stop All Servers"
    echo ""
    read -p "Enter choice [1-7]: " MODE
fi

case $MODE in
    1|static)
        echo "📦 Starting Python Static Server..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Check if port 8080 is in use
        if check_port 8080; then
            kill_port 8080
        fi
        
        echo "🌐 Server starting at: http://localhost:8080"
        echo "📝 Note: This serves static files only (no MCP API)"
        echo "Press Ctrl+C to stop"
        echo ""
        python3 -m http.server 8080
        ;;
        
    2|node)
        echo "🚀 Starting Full Node.js Server..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Check if dependencies are installed
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm install
        fi
        
        # Check if port 3000 is in use
        if check_port 3000; then
            kill_port 3000
        fi
        
        echo "✨ Features enabled:"
        echo "  • MCP API endpoints"
        echo "  • Analytics tracking"
        echo "  • Quality gates"
        echo "  • PWA support"
        echo ""
        npm run dev
        ;;
        
    3|secure)
        echo "🔒 Starting Secure HTTPS Server..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Check if certificates exist
        if [ ! -f "server.key" ] || [ ! -f "server.cert" ]; then
            echo "🔐 Generating self-signed certificate..."
            openssl req -nodes -new -x509 \
                -keyout server.key \
                -out server.cert \
                -days 365 \
                -subj "/C=US/ST=State/L=City/O=Bitcoin Sovereign Academy/CN=localhost"
        fi
        
        # Check if dependencies are installed
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm install
        fi
        
        # Check ports
        if check_port 3000; then
            kill_port 3000
        fi
        if check_port 3443; then
            kill_port 3443
        fi
        
        echo "🔒 HTTPS available at: https://localhost:3443"
        echo "🌐 HTTP available at: http://localhost:3000"
        echo ""
        NODE_ENV=production npm start
        ;;
        
    4|install)
        echo "📦 Installing Dependencies..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Check Node.js version
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ $NODE_VERSION -lt 18 ]; then
            echo "⚠️  Node.js 18+ required. Current: $(node -v)"
            echo "Please upgrade Node.js first."
            exit 1
        fi
        
        echo "Installing production dependencies..."
        npm install --production
        
        echo "Installing dev dependencies..."
        npm install --save-dev
        
        echo "✅ Dependencies installed successfully!"
        echo ""
        echo "Run './start-local.sh' again to start the server"
        ;;
        
    5|test)
        echo "🧪 Testing Deployment..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Test static files
        echo "Testing static server (port 8080)..."
        curl -s -o /dev/null -w "  HTTP Status: %{http_code}\n" http://localhost:8080/
        
        # Test Node.js server
        echo "Testing Node.js server (port 3000)..."
        curl -s -o /dev/null -w "  HTTP Status: %{http_code}\n" http://localhost:3000/
        
        # Test API health
        echo "Testing API health endpoint..."
        curl -s http://localhost:3000/api/health | python3 -m json.tool
        
        # Test MCP endpoint
        echo "Testing MCP API endpoint..."
        curl -X POST http://localhost:3000/api/mcp/generate-site \
            -H "Content-Type: application/json" \
            -d '{"audience":"high-school","duration":3}' \
            -s | python3 -m json.tool | head -20
        ;;
        
    6|lighthouse)
        echo "🔍 Running Performance Analysis..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Check if lighthouse is installed
        if ! command -v lighthouse &> /dev/null; then
            echo "Installing Lighthouse..."
            npm install -g lighthouse
        fi
        
        echo "Running Lighthouse analysis..."
        lighthouse http://localhost:3000 \
            --output html \
            --output-path ./lighthouse-report.html \
            --only-categories=performance,accessibility,best-practices,seo,pwa
        
        echo "✅ Report saved to: lighthouse-report.html"
        echo "Opening report..."
        open lighthouse-report.html 2>/dev/null || xdg-open lighthouse-report.html 2>/dev/null
        ;;
        
    7|stop)
        echo "🛑 Stopping All Servers..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Kill processes on common ports
        for PORT in 3000 3443 8080 8000; do
            if check_port $PORT; then
                kill_port $PORT
                echo "✅ Stopped server on port $PORT"
            fi
        done
        
        echo "All servers stopped."
        ;;
        
    *)
        echo "❌ Invalid option. Please run './start-local.sh' for menu"
        exit 1
        ;;
esac