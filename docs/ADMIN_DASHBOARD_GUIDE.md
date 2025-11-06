# Admin Dashboard Guide

## Overview

The Bitcoin Sovereign Academy Admin Dashboard provides a comprehensive interface for managing users, viewing statistics, and monitoring payments.

## Access

**URL**: `https://bitcoinsovereign.academy/admin/`

**Authentication**: Password-protected (uses `ADMIN_PASSWORD` environment variable)

## Features

### 1. Dashboard Overview

The main dashboard displays:

- **Total Users**: Count of all registered users with entitlements
- **Total Revenue**: All-time revenue from payments
- **This Month**: Current month's revenue
- **Average Order Value**: Mean transaction amount
- **Recent Users**: Last 10 users who made purchases

### 2. User Management

#### Search Users
- Search by email address
- View all user entitlements
- Check purchase history

#### Grant Manual Access
Use this to provide complimentary access or resolve customer issues:

1. Click "Grant Access" button
2. Enter user email
3. Select path (optional) - choosing a path grants all modules in that path
4. Check "Send access email" to automatically email the token
5. Submit

The system will:
- Generate entitlements
- Create JWT token
- Optionally send access email with token link

#### Revoke Access
- Find user in list
- Click "Revoke" button
- Confirm deletion
- User's access will be immediately revoked

### 3. Payment History

View all successful payments including:
- Customer email
- Amount paid
- Payment provider (Stripe/BTCPay)
- Transaction status
- Purchased items

**Export**: Click "Export CSV" to download payment data for accounting.

### 4. Content Statistics

Track content popularity:
- **Most Accessed Modules**: See which modules users access most
- **Popular Learning Paths**: Track path enrollment
- **Total Grants**: Count of all module/path accesses granted

## API Endpoints

All admin endpoints require authentication via Bearer token.

### Authentication

**POST** `/api/admin/auth`

```json
{
  "password": "your-admin-password"
}
```

Returns:
```json
{
  "success": true,
  "token": "admin-session-token",
  "expiresIn": "24h"
}
```

### Statistics

**GET** `/api/admin/stats`

Headers: `Authorization: Bearer <token>`

Returns dashboard statistics including:
- User counts
- Revenue metrics
- Popular content
- Recent users

### User Management

**GET** `/api/admin/users?email=user@example.com`

Search specific user by email.

**GET** `/api/admin/users?search=keyword`

Search users by partial email match.

**GET** `/api/admin/users?page=1`

List all users with pagination.

**POST** `/api/admin/users`

Manually grant access:
```json
{
  "email": "user@example.com",
  "items": [
    { "type": "path", "id": "curious", "title": "Curious Path", "priceUSD": 0 }
  ],
  "sendEmail": true
}
```

**DELETE** `/api/admin/users?email=user@example.com`

Revoke user access.

### Payments

**GET** `/api/admin/payments?limit=50&offset=0`

Get payment history with pagination.

**GET** `/api/admin/payments/export`

Export payments as CSV file.

## Security

### Password Protection
- Admin password stored in `ADMIN_PASSWORD` environment variable
- Uses constant-time comparison to prevent timing attacks
- Session tokens expire after 24 hours

### Session Management
- Tokens use HMAC-SHA256 signatures
- Token includes timestamp for expiry validation
- Stored in localStorage on client side

### CORS Protection
- Only allowed origin can access admin APIs
- Configured via `ALLOWED_ORIGIN` environment variable

## Environment Variables Required

```bash
# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here

# JWT Secret (for admin tokens)
JWT_SECRET=your-jwt-secret

# CORS Configuration
ALLOWED_ORIGIN=https://bitcoinsovereign.academy
```

## Best Practices

### Security
1. Use a strong admin password (20+ characters, mixed case, numbers, symbols)
2. Change password regularly
3. Don't share admin credentials
4. Log out after each session
5. Monitor access logs

### User Management
1. Only grant manual access for legitimate reasons (customer service, refunds, etc.)
2. Document manual grants in external system
3. Use "Send email" option so users receive their tokens
4. Keep records of revoked access

### Monitoring
1. Check dashboard daily for anomalies
2. Review popular content to improve offerings
3. Monitor payment failures
4. Track revenue trends

## Troubleshooting

### Can't Login
- Verify `ADMIN_PASSWORD` is set correctly
- Check browser console for errors
- Clear localStorage and try again
- Verify API endpoints are accessible

### Users Not Appearing
- Check if entitlements are being created (webhook logs)
- Verify database connection
- Check API authentication

### Stats Not Loading
- Verify admin token is valid
- Check API endpoint `/api/admin/stats` directly
- Review server logs for errors

## Support

For technical issues or questions:
- Email: support@bitcoinsovereign.academy
- Review server logs in Vercel dashboard
- Check webhook delivery logs in Stripe/BTCPay
