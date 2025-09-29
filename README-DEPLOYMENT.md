# 🚀 Bitcoin Sovereign Academy - Local Production Deployment

## Quick Start

The easiest way to deploy locally is using our interactive startup script:

```bash
./start-local.sh
```

This will show you a menu with all available deployment options.

## Deployment Options

### 1. 🐍 Quick Static Server (Python)
**Best for:** Quick testing of HTML/CSS/JS without backend features

```bash
# Using the menu
./start-local.sh
# Select option 1

# Or directly
./start-local.sh static

# Or manually
python3 -m http.server 8080
```

- **URL:** http://localhost:8080
- **Features:** Static files only
- **Requirements:** Python 3.x
- **Note:** MCP API endpoints won't work

### 2. 🚀 Full Node.js Server (with MCP API)
**Best for:** Full feature testing including MCP integration

```bash
# Using the menu
./start-local.sh
# Select option 2

# Or directly
./start-local.sh node

# Or manually
npm install
npm run dev
```

- **URL:** http://localhost:3000
- **Features:** 
  - ✅ MCP API endpoints
  - ✅ Analytics tracking
  - ✅ Quality gates
  - ✅ PWA support
  - ✅ Bilingual support
- **Requirements:** Node.js 18+

### 3. 🔒 Secure HTTPS Server
**Best for:** Testing PWA features and secure contexts

```bash
# Using the menu
./start-local.sh
# Select option 3

# Or directly
./start-local.sh secure

# Or manually
npm run serve:secure
```

- **HTTP URL:** http://localhost:3000
- **HTTPS URL:** https://localhost:3443
- **Features:** All Node.js features + HTTPS
- **Note:** Uses self-signed certificate (browser warning expected)

## Environment Variables

Create a `.env` file for configuration:

```bash
# MCP Configuration
MCP_BASE_URL=http://localhost:3001
MCP_API_KEY=your-api-key-here

# Server Ports
PORT=3000
HTTPS_PORT=3443

# Environment
NODE_ENV=development
```

## API Endpoints

When running the Node.js server, these endpoints are available:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/mcp/generate-site` | POST | Generate course content |
| `/api/analytics/event` | POST | Track analytics events |

### Example API Calls

```bash
# Health check
curl http://localhost:3000/api/health

# Generate course
curl -X POST http://localhost:3000/api/mcp/generate-site \
  -H "Content-Type: application/json" \
  -d '{
    "audience": "high-school",
    "duration": 3,
    "language": "en",
    "sources": ["bitcoin.org", "learnmeabitcoin.com"]
  }'
```

## Testing

Run the test suite to verify deployment:

```bash
# Test all endpoints
./start-local.sh test

# Or manually
npm test

# Performance analysis
./start-local.sh lighthouse
```

## Directory Structure

```
bitcoin-sovereign-academy/
├── index.html                    # Homepage
├── server-local.js              # Node.js server
├── start-local.sh               # Startup script
├── package.json                 # Dependencies
├── api/
│   └── mcp/
│       └── generate-site.js    # MCP API handler
├── css/
│   └── style.css               # Main styles
├── js/
│   ├── script.js              # Main JavaScript
│   └── mcp-client.js          # MCP client
├── interactive-demos/
│   └── bitcoin-sovereign-game/
│       └── index.html         # Game demo
└── public/
    ├── manifest.json          # PWA manifest
    └── service-worker.js     # Service worker
```

## Troubleshooting

### Port Already in Use

If you see "Port already in use" error:

```bash
# Stop all servers
./start-local.sh stop

# Or manually kill specific port
lsof -ti:3000 | xargs kill -9
```

### Node.js Version Error

Requires Node.js 18+. Check version:

```bash
node --version
```

Update if needed:
```bash
# Using nvm
nvm install 18
nvm use 18

# Using brew (macOS)
brew upgrade node
```

### Dependencies Not Found

Install dependencies:

```bash
./start-local.sh install

# Or manually
npm install
```

### HTTPS Certificate Issues

Generate new certificate:

```bash
npm run cert

# Or manually
openssl req -nodes -new -x509 \
  -keyout server.key \
  -out server.cert \
  -days 365 \
  -subj "/CN=localhost"
```

## Production Deployment

For actual production deployment:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# With custom domain
vercel --prod --scope bitcoin-sovereign-academy
```

### Docker
```bash
# Build image
docker build -t bitcoin-sovereign-academy .

# Run container
docker run -p 80:3000 bitcoin-sovereign-academy
```

### PM2 (Process Manager)
```bash
# Install PM2
npm i -g pm2

# Start with PM2
pm2 start server-local.js --name bitcoin-academy

# Save config
pm2 save
pm2 startup
```

## Support

For issues or questions:
- Check logs in console
- Review `lighthouse-report.html` for performance issues
- Test API endpoints individually
- Verify environment variables are set

---

**Happy Deploying! 🚀⚡️**