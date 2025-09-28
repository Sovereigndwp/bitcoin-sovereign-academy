#!/bin/bash

# Bitcoin Sovereign Academy - Domain Configuration Tester
# This script tests various aspects of domain configuration

DOMAIN="${1:-bitcoinsovereign.academy}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Testing domain configuration for: $DOMAIN"
echo "================================================"

# Function to check command availability
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    fi
    return 0
}

# Test 1: DNS Resolution
echo -e "\n${YELLOW}1. DNS Resolution Test${NC}"
if check_command dig; then
    echo "Testing A records..."
    dig +short $DOMAIN
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ DNS resolution successful${NC}"
    else
        echo -e "${RED}✗ DNS resolution failed${NC}"
    fi
fi

# Test 2: Check if domain points to GitHub Pages
echo -e "\n${YELLOW}2. GitHub Pages IP Test${NC}"
GITHUB_IPS="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
RESOLVED_IP=$(dig +short $DOMAIN | head -n1)
if [[ " $GITHUB_IPS " =~ " $RESOLVED_IP " ]]; then
    echo -e "${GREEN}✓ Domain points to GitHub Pages ($RESOLVED_IP)${NC}"
else
    echo -e "${RED}✗ Domain does not point to GitHub Pages IPs${NC}"
    echo "  Current IP: $RESOLVED_IP"
    echo "  Expected: One of $GITHUB_IPS"
fi

# Test 3: HTTP to HTTPS Redirect
echo -e "\n${YELLOW}3. HTTP to HTTPS Redirect Test${NC}"
if check_command curl; then
    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L http://$DOMAIN 2>/dev/null)
    if [ "$HTTP_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✓ HTTP redirects successfully (Status: $HTTP_RESPONSE)${NC}"
    else
        echo -e "${YELLOW}⚠ HTTP response code: $HTTP_RESPONSE${NC}"
    fi
fi

# Test 4: HTTPS Connection
echo -e "\n${YELLOW}4. HTTPS Connection Test${NC}"
if check_command curl; then
    HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null)
    if [ "$HTTPS_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✓ HTTPS connection successful (Status: $HTTPS_RESPONSE)${NC}"
    else
        echo -e "${RED}✗ HTTPS connection failed (Status: $HTTPS_RESPONSE)${NC}"
    fi
fi

# Test 5: SSL Certificate
echo -e "\n${YELLOW}5. SSL Certificate Test${NC}"
if check_command openssl; then
    echo "Checking SSL certificate..."
    CERT_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ SSL certificate is valid${NC}"
        echo "$CERT_INFO"
    else
        echo -e "${RED}✗ SSL certificate check failed${NC}"
    fi
fi

# Test 6: Check CNAME file in repo
echo -e "\n${YELLOW}6. Repository CNAME File Test${NC}"
if [ -f "../CNAME" ]; then
    CNAME_CONTENT=$(cat ../CNAME)
    echo -e "${GREEN}✓ CNAME file exists${NC}"
    echo "  Content: $CNAME_CONTENT"
    if [ "$CNAME_CONTENT" = "$DOMAIN" ]; then
        echo -e "${GREEN}✓ CNAME matches tested domain${NC}"
    else
        echo -e "${YELLOW}⚠ CNAME contains different domain: $CNAME_CONTENT${NC}"
    fi
else
    echo -e "${RED}✗ CNAME file not found in repository${NC}"
fi

# Test 7: Test www subdomain (if applicable)
echo -e "\n${YELLOW}7. WWW Subdomain Test${NC}"
WWW_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://www.$DOMAIN 2>/dev/null)
if [ "$WWW_RESPONSE" = "200" ] || [ "$WWW_RESPONSE" = "301" ] || [ "$WWW_RESPONSE" = "302" ]; then
    echo -e "${GREEN}✓ WWW subdomain is configured (Status: $WWW_RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ WWW subdomain not configured or not responding (Status: $WWW_RESPONSE)${NC}"
fi

# Test 8: Check DNS propagation globally
echo -e "\n${YELLOW}8. Global DNS Propagation${NC}"
echo "For comprehensive global DNS propagation check, visit:"
echo "  https://www.whatsmydns.net/#A/$DOMAIN"

# Summary
echo -e "\n${YELLOW}========================================${NC}"
echo -e "${YELLOW}Summary:${NC}"
echo "Domain: $DOMAIN"
echo "Current IP: $RESOLVED_IP"
echo "HTTPS Status: $HTTPS_RESPONSE"
echo -e "${YELLOW}========================================${NC}"

# Provide next steps if domain is not yet configured
if [ -z "$RESOLVED_IP" ] || [[ ! " $GITHUB_IPS " =~ " $RESOLVED_IP " ]]; then
    echo -e "\n${YELLOW}📋 Next Steps:${NC}"
    echo "1. Configure DNS records at your domain registrar"
    echo "2. Add A records pointing to GitHub Pages IPs:"
    for ip in $GITHUB_IPS; do
        echo "   - $ip"
    done
    echo "3. Wait for DNS propagation (can take up to 48 hours)"
    echo "4. Push CNAME file to repository"
    echo "5. Configure custom domain in GitHub Pages settings"
fi