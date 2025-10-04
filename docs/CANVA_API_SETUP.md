# Canva API Setup Guide

## Step 1: Create a Canva Developer Account

1. Go to [Canva Developers](https://www.canva.com/developers/)
2. Click "Get Started" or "Sign Up"
3. Use your existing Canva account or create a new one
4. Accept the Developer Terms of Service

## Step 2: Create a New App

1. In the Canva Developers dashboard, click "Create an App"
2. Fill in the app details:
   - **App Name**: "Bitcoin Education Course Updater"
   - **Description**: "Automated tool for updating Bitcoin educational content with live data"
   - **Use Case**: "Education" or "Content Management"
   - **Integration Type**: "Server-side integration"

## Step 3: Get Your API Credentials

After creating your app, you'll receive:
- **App ID**: Your application identifier
- **App Secret**: Your application secret (keep this secure!)
- **Scopes**: Required permissions for your app

Required scopes for course editing:
- `design:read` - Read designs and folders
- `design:write` - Create and modify designs
- `folder:read` - Access folder contents
- `folder:write` - Organize designs in folders

## Step 4: Configure Environment Variables

Add these to your `.env` file:

```bash
# Canva API Configuration
CANVA_API_KEY=your_app_secret_here
CANVA_APP_ID=your_app_id_here
CANVA_BASE_URL=https://api.canva.com/rest/v1

# Optional: Specific folder for your course
CANVA_COURSE_FOLDER_ID=FAFxTnM3zZU
```

## Step 5: Test the Connection

Run this command to test your API setup:
```bash
npm run canva:test-auth
```

## Authentication Flow

The Canva API uses OAuth 2.0 for authentication. For server-side applications like this course updater, you'll use the "Client Credentials" flow:

1. Your app exchanges credentials for an access token
2. The access token is used to make API requests
3. Tokens expire and need to be refreshed

## Troubleshooting

### Common Issues:
- **401 Unauthorized**: Check your API key and app secret
- **403 Forbidden**: Verify your app has the required scopes
- **Rate Limiting**: The API has rate limits - the tool will handle this automatically

### Rate Limits:
- 100 requests per minute per app
- 1000 requests per hour per app
- The tool includes automatic retry logic

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for credentials**
3. **Rotate API keys regularly**
4. **Monitor API usage in the Canva dashboard**

## Next Steps After Setup

Once authenticated, you can:
1. List all designs in your course folder
2. Update designs with current Bitcoin data
3. Apply consistent branding and styling
4. Schedule automated updates

---

**Need Help?**
- Canva API Documentation: https://www.canva.com/developers/docs/
- Support: https://www.canva.com/developers/support/