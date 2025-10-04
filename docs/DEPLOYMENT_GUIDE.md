# Bitcoin MCP Agent Kit - Deployment Guide

This guide will help you deploy both the **Web Interface** and **MCP Server** to free cloud platforms.

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended for Web Interface)
- **Free Tier**: 512MB RAM, $5/month free credits
- **Best For**: Web interface with API endpoints
- **URL**: https://railway.app

### Option 2: Render (Alternative)
- **Free Tier**: 512MB RAM, auto-sleeps after 15min inactivity
- **Best For**: Web interface backup option
- **URL**: https://render.com

### Option 3: Fly.io (For MCP Server)
- **Free Tier**: 3 shared-CPU-1x machines with 256MB RAM
- **Best For**: MCP server component
- **URL**: https://fly.io

## 📋 Prerequisites

### Required API Keys
1. **Canva API** (required for design features)
   - Go to: https://www.canva.com/developers/
   - Create an app and get: `CANVA_API_KEY`, `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`

### Optional API Keys
2. **GitHub Token** (for development tracking)
   - Go to: https://github.com/settings/tokens
   - Create token with `public_repo` scope

3. **Notion API** (if using content management)
   - Go to: https://developers.notion.com/
   - Create integration and get workspace access

## 🌐 Deploy Web Interface to Railway

### Step 1: Prepare Repository
```bash
# Clone/fork the repository
git clone <your-repo-url>
cd mcp-agent-kit

# Test build locally
npm run build:deploy
```

### Step 2: Deploy to Railway
1. **Connect Repository**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   
   # Required for Canva features
   CANVA_API_TOKEN=your_canva_token
   CANVA_API_KEY=your_canva_key
   CANVA_CLIENT_ID=your_client_id
   CANVA_CLIENT_SECRET=your_client_secret
   
   # Optional
   GITHUB_TOKEN=your_github_token
   NOTION_TOKEN=your_notion_token
   
   # Logging
   LOG_LEVEL=info
   ```

3. **Configure Build Settings**
   - **Build Command**: `npm run build:deploy`
   - **Start Command**: `npm run start:deploy`
   - **Root Directory**: `/` (default)

### Step 3: Deploy and Test
- Railway will automatically build and deploy
- Your app will be available at: `https://your-app-name.railway.app`
- Test health endpoint: `https://your-app-name.railway.app/api/health`

## 🔧 Deploy MCP Server to Fly.io

### Step 1: Install Fly CLI
```bash
# macOS
brew install flyctl

# Other platforms: https://fly.io/docs/getting-started/installing-flyctl/
```

### Step 2: Initialize Fly App
```bash
# Login to Fly
flyctl auth login

# Initialize app (in project directory)
flyctl launch
```

### Step 3: Configure fly.toml
```toml
# fly.toml
app = "your-mcp-agent-kit"
primary_region = "dfw"

[build]
  image = "registry.fly.io/your-mcp-agent-kit:latest"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  memory = '256mb'
  cpu_kind = 'shared'
  cpus = 1

[env]
  NODE_ENV = "production"
  PORT = "3000"
```

### Step 4: Set Secrets
```bash
# Set environment variables as secrets
flyctl secrets set CANVA_API_TOKEN="your_canva_token"
flyctl secrets set CANVA_API_KEY="your_canva_key"
flyctl secrets set CANVA_CLIENT_ID="your_client_id"
flyctl secrets set CANVA_CLIENT_SECRET="your_client_secret"

# Optional secrets
flyctl secrets set GITHUB_TOKEN="your_github_token"
flyctl secrets set NOTION_TOKEN="your_notion_token"
```

### Step 5: Deploy
```bash
flyctl deploy
```

## 🔍 API Endpoints (Web Interface)

Once deployed, your web interface will have these endpoints:

### Health & Status
- `GET /api/health` - Health check
- `GET /` - Main interface (if HTML exists)

### Bitcoin Data
- `GET /api/bitcoin/price` - Current BTC price
- `GET /api/bitcoin/fees` - Fee estimates
- `GET /api/fx/rate?from=usd&to=cop` - Exchange rates

### News & Analysis  
- `GET /api/news?query=bitcoin&limit=10` - Bitcoin news

### Simulations
- `POST /api/simulation/create` - Create fee simulation
- `POST /api/simulation/analyze` - Analyze transaction costs

### Educational Content
- `GET /api/curriculum` - Bitcoin curriculum
- `GET /api/learning/demo` - Learning modules

### Canva Integration
- `GET /api/canva/snippets` - Design snippets (if implemented)

## 📡 MCP Server Usage

The MCP server component is designed to work with MCP-compatible AI systems. It provides:

### Tools Available
- `get_bitcoin_price` - Real-time BTC pricing
- `get_fee_estimates` - Network fee estimates  
- `calculate_optimal_fee` - Fee optimization
- `get_mempool_stats` - Network statistics
- `list_canva_designs` - Design management
- `create_canva_design` - Design creation

### Agents Available
- `news_scout` - News monitoring and sentiment analysis
- `simulation_builder` - Fee simulations and scenarios
- `canva_agent` - Design automation
- `custody_coach` - Security guidance

## 🛡️ Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use platform-specific secret management
- Rotate API keys regularly

### API Rate Limits
- Most endpoints have caching to prevent rate limiting
- GitHub: 5,000 requests/hour (authenticated)
- Canva: Varies by endpoint
- Mempool.space: No limits on public API

### Network Security
- All deployments use HTTPS by default
- Consider adding API key authentication for production use

## 📊 Monitoring & Troubleshooting

### Health Checks
```bash
# Test web interface
curl https://your-app.railway.app/api/health

# Test Bitcoin price endpoint
curl https://your-app.railway.app/api/bitcoin/price

# Test news endpoint  
curl "https://your-app.railway.app/api/news?query=bitcoin&limit=5"
```

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires ≥18)
   - Verify TypeScript compilation: `npm run build:deploy`
   - Check dependency conflicts

2. **Runtime Errors**
   - Missing environment variables
   - API key authentication issues
   - Network connectivity problems

3. **Performance Issues**
   - Enable caching: `CACHE_ENABLED=true`
   - Adjust cache TTL values
   - Monitor memory usage

### Logs
```bash
# Railway logs
railway logs

# Fly.io logs  
flyctl logs

# Local testing
npm run web
```

## 💰 Cost Estimation

### Free Tier Limits
- **Railway**: $5/month in credits (enough for personal use)
- **Fly.io**: 3 machines × 256MB RAM (usually sufficient)
- **Render**: Free tier with auto-sleep (good for testing)

### Scaling Considerations
- Both platforms offer pay-as-you-scale pricing
- Bitcoin data APIs are mostly free (public endpoints)
- Canva API has generous free limits
- Consider caching strategies for high-traffic scenarios

## 🔄 CI/CD Setup (Optional)

### Automatic Deployment
Both Railway and Fly.io support GitHub integration:

1. **Connect Repository**: Link your GitHub repo
2. **Auto-Deploy**: Enable automatic deployments on push
3. **Branch Protection**: Deploy from main/production branch only
4. **Environment Parity**: Use same env vars across environments

### Example GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:deploy
      - run: npm run test
```

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Test API endpoints individually
4. Verify environment variable configuration

Your deployment should now be live! 🎉
