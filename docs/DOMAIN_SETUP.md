# Custom Domain Configuration for Bitcoin Sovereign Academy

## Current Domain Setup
- **Suggested Domain**: bitcoinsovereign.academy
- **Alternative Domains**: 
  - bitcoinsovereign.education
  - btcsovereign.academy
  - learnbitcoin.academy

## Step-by-Step Domain Configuration

### 1. Domain Purchase (if not already owned)
Choose a domain registrar:
- **Namecheap**: https://www.namecheap.com
- **Google Domains**: https://domains.google
- **Cloudflare**: https://www.cloudflare.com/products/registrar/

### 2. DNS Configuration

#### Option A: Using Apex Domain (bitcoinsovereign.academy)
Add these DNS records at your domain registrar:

```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

#### Option B: Using Subdomain (www.bitcoinsovereign.academy)
Add this DNS record:

```
Type    Name    Value
CNAME   www     sovereigndwp.github.io
```

### 3. GitHub Pages Configuration

1. **Push CNAME file to repository**:
   ```bash
   git add CNAME
   git commit -m "Add custom domain configuration"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to: https://github.com/Sovereigndwp/bitcoin-sovereign-academy/settings/pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Custom domain: Enter your domain
   - Enforce HTTPS: ✓ (check after DNS propagation)

### 4. SSL/HTTPS Configuration
- GitHub automatically provisions SSL certificate via Let's Encrypt
- This process takes up to 24 hours after DNS propagation
- Once ready, check "Enforce HTTPS" in GitHub Pages settings

### 5. Verification Steps

#### Test DNS Propagation:
```bash
# Check A records
dig bitcoinsovereign.academy

# Check CNAME (if using www)
dig www.bitcoinsovereign.academy

# Test DNS globally
# Visit: https://www.whatsmydns.net/
```

#### Test Site Access:
```bash
# Test HTTP redirect to HTTPS
curl -I http://bitcoinsovereign.academy

# Test HTTPS
curl -I https://bitcoinsovereign.academy

# Test www subdomain (if configured)
curl -I https://www.bitcoinsovereign.academy
```

### 6. Cloudflare Configuration (Optional but Recommended)

Benefits:
- Free CDN and DDoS protection
- Advanced caching
- Web analytics
- Page rules for redirects

Setup:
1. Add site to Cloudflare (free plan)
2. Update nameservers at registrar
3. Configure these settings:
   - SSL/TLS: Full
   - Always Use HTTPS: On
   - Auto Minify: HTML, CSS, JS
   - Brotli: On

### 7. Monitoring and Maintenance

#### Uptime Monitoring:
- **UptimeRobot**: https://uptimerobot.com (free)
- **Pingdom**: https://www.pingdom.com

#### SSL Certificate Check:
```bash
# Check certificate expiry
echo | openssl s_client -servername bitcoinsovereign.academy -connect bitcoinsovereign.academy:443 2>/dev/null | openssl x509 -noout -dates
```

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours for global propagation
- Clear local DNS cache:
  ```bash
  # macOS
  sudo dscacheutil -flushcache
  
  # Alternative
  sudo killall -HUP mDNSResponder
  ```

### GitHub Pages Not Updating
- Check Actions tab in GitHub for build errors
- Verify CNAME file is in root directory
- Ensure domain is correctly entered in Pages settings

### SSL Certificate Issues
- Ensure DNS is properly configured
- Wait for automatic provisioning (up to 24 hours)
- Check GitHub Pages settings for any warnings

## Alternative Custom Domain Providers

### Free Subdomain Services (for testing):
- **FreeDNS**: https://freedns.afraid.org
- **No-IP**: https://www.noip.com

### Premium Domain Features:
- **ENS (Ethereum Name Service)**: Blockchain-based domains
- **Unstoppable Domains**: Cryptocurrency-friendly domains
- **Handshake**: Decentralized naming protocol

## Contact for Issues
If you encounter issues, check:
1. GitHub Status: https://www.githubstatus.com
2. GitHub Community Forum: https://github.community
3. Your domain registrar's support

---
Last Updated: 2025-09-28