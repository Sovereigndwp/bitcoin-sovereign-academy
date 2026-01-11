/**
 * Email Service
 * 
 * Provider: Resend (https://resend.com)
 * Alternative: SendGrid
 * 
 * Features:
 * - Magic link emails
 * - Payment receipts
 * - Subscription notifications
 * 
 * Environment Variables:
 * - RESEND_API_KEY or SENDGRID_API_KEY
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface MagicLinkOptions {
  email: string;
  token: string;
  expiresInMinutes: number;
}

interface ReceiptOptions {
  email: string;
  productName: string;
  amount: number;
  currency: string;
  date: Date;
  invoiceId: string;
}

interface SubscriptionNotificationOptions {
  email: string;
  subscriptionName: string;
  action: 'canceled' | 'renewed' | 'failed';
  nextBillingDate?: Date;
}

/**
 * Get email provider
 */
function getEmailProvider(): 'resend' | 'sendgrid' | null {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SENDGRID_API_KEY) return 'sendgrid';
  return null;
}

/**
 * Send email via Resend
 */
async function sendViaResend(options: EmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Bitcoin Sovereign Academy <hello@bitcoinsovereign.academy>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  console.log('Email sent via Resend:', {
    to: options.to,
    subject: options.subject
  });
}

/**
 * Send email via SendGrid
 */
async function sendViaSendGrid(options: EmailOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: options.to }]
      }],
      from: {
        email: process.env.EMAIL_FROM_ADDRESS || 'hello@bitcoinsovereign.academy',
        name: process.env.EMAIL_FROM_NAME || 'Bitcoin Sovereign Academy'
      },
      subject: options.subject,
      content: [
        {
          type: 'text/html',
          value: options.html
        },
        ...(options.text ? [{
          type: 'text/plain',
          value: options.text
        }] : [])
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  console.log('Email sent via SendGrid:', {
    to: options.to,
    subject: options.subject
  });
}

/**
 * Send email (auto-detect provider)
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const provider = getEmailProvider();

  if (!provider) {
    console.warn('No email provider configured. Email would be sent:', options.subject);
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('Email content:', options.html);
      return;
    }
    throw new Error('Email provider not configured');
  }

  if (provider === 'resend') {
    await sendViaResend(options);
  } else {
    await sendViaSendGrid(options);
  }
}

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(options: MagicLinkOptions): Promise<void> {
  const baseUrl = process.env.BASE_URL || 'https://bitcoinsovereign.academy';
  const magicLink = `${baseUrl}/api/auth/verify?token=${options.token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f0f; color: #e0e0e0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: 800; color: #f7931a; margin-bottom: 10px; }
    .content { background: #1a1a1a; border: 2px solid #2d2d2d; border-radius: 16px; padding: 40px; }
    h1 { color: #f7931a; font-size: 28px; margin-bottom: 20px; }
    p { color: #b3b3b3; line-height: 1.6; margin-bottom: 20px; }
    .button { display: inline-block; background: linear-gradient(135deg, #f7931a, #ff8c00); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 20px 0; }
    .button:hover { background: linear-gradient(135deg, #ff8c00, #f7931a); }
    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
    .warning { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 15px; margin: 20px 0; color: #ef4444; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">₿ Bitcoin Sovereign Academy</div>
    </div>
    <div class="content">
      <h1>Sign in to Your Account</h1>
      <p>Click the button below to securely sign in to your Bitcoin Sovereign Academy account.</p>
      
      <a href="${magicLink}" class="button">Sign In Now</a>
      
      <p>This link will expire in ${options.expiresInMinutes} minutes and can only be used once.</p>
      
      <div class="warning">
        <strong>⚠️ Security Notice</strong><br>
        If you didn't request this sign-in link, please ignore this email. Never share this link with anyone.
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all;">${magicLink}</span>
      </p>
    </div>
    <div class="footer">
      <p>Bitcoin Sovereign Academy<br>Empowering Bitcoin Education</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Sign in to Bitcoin Sovereign Academy

Click this link to sign in: ${magicLink}

This link will expire in ${options.expiresInMinutes} minutes.

If you didn't request this, please ignore this email.

---
Bitcoin Sovereign Academy
  `;

  await sendEmail({
    to: options.email,
    subject: 'Sign in to Bitcoin Sovereign Academy',
    html,
    text
  });
}

/**
 * Send payment receipt
 */
export async function sendPaymentReceipt(options: ReceiptOptions): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f0f; color: #e0e0e0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: 800; color: #f7931a; margin-bottom: 10px; }
    .content { background: #1a1a1a; border: 2px solid #2d2d2d; border-radius: 16px; padding: 40px; }
    h1 { color: #4CAF50; font-size: 28px; margin-bottom: 20px; }
    .receipt-details { background: #0f0f0f; border: 1px solid #2d2d2d; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #2d2d2d; }
    .receipt-row:last-child { border-bottom: none; font-weight: 700; font-size: 18px; color: #f7931a; }
    .label { color: #b3b3b3; }
    .value { color: #e0e0e0; font-weight: 600; }
    .button { display: inline-block; background: linear-gradient(135deg, #f7931a, #ff8c00); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 20px 0; }
    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">₿ Bitcoin Sovereign Academy</div>
    </div>
    <div class="content">
      <h1>✓ Payment Successful</h1>
      <p>Thank you for your purchase! Your payment has been processed successfully.</p>
      
      <div class="receipt-details">
        <div class="receipt-row">
          <span class="label">Product</span>
          <span class="value">${options.productName}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Date</span>
          <span class="value">${options.date.toLocaleDateString()}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Invoice ID</span>
          <span class="value">${options.invoiceId}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Total</span>
          <span class="value">${options.currency} $${options.amount.toFixed(2)}</span>
        </div>
      </div>
      
      <a href="${process.env.BASE_URL}/account.html" class="button">View Your Account</a>
      
      <p style="margin-top: 30px;">You now have full access to your purchased content. Sign in anytime to continue learning.</p>
    </div>
    <div class="footer">
      <p>Bitcoin Sovereign Academy<br>Empowering Bitcoin Education</p>
      <p style="font-size: 12px; margin-top: 10px;">Need help? Reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Payment Successful!

Thank you for your purchase.

Product: ${options.productName}
Date: ${options.date.toLocaleDateString()}
Invoice ID: ${options.invoiceId}
Total: ${options.currency} $${options.amount.toFixed(2)}

View your account: ${process.env.BASE_URL}/account.html

---
Bitcoin Sovereign Academy
  `;

  await sendEmail({
    to: options.email,
    subject: 'Payment Confirmation - Bitcoin Sovereign Academy',
    html,
    text
  });
}

/**
 * Send subscription notification
 */
export async function sendSubscriptionNotification(options: SubscriptionNotificationOptions): Promise<void> {
  let subject: string;
  let heading: string;
  let message: string;
  let color: string;

  switch (options.action) {
    case 'canceled':
      subject = 'Subscription Canceled';
      heading = 'Subscription Canceled';
      message = `Your ${options.subscriptionName} subscription has been canceled. You'll continue to have access until the end of your current billing period.`;
      color = '#ef4444';
      break;
    case 'renewed':
      subject = 'Subscription Renewed';
      heading = '✓ Subscription Renewed';
      message = `Your ${options.subscriptionName} subscription has been successfully renewed. Thank you for continuing your learning journey!`;
      color = '#4CAF50';
      break;
    case 'failed':
      subject = 'Payment Failed';
      heading = '⚠️ Payment Failed';
      message = `We couldn't process the payment for your ${options.subscriptionName} subscription. Please update your payment method to continue your access.`;
      color = '#f59e0b';
      break;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f0f; color: #e0e0e0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: 800; color: #f7931a; margin-bottom: 10px; }
    .content { background: #1a1a1a; border: 2px solid #2d2d2d; border-radius: 16px; padding: 40px; }
    h1 { color: ${color}; font-size: 28px; margin-bottom: 20px; }
    p { color: #b3b3b3; line-height: 1.6; margin-bottom: 20px; }
    .button { display: inline-block; background: linear-gradient(135deg, #f7931a, #ff8c00); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 20px 0; }
    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">₿ Bitcoin Sovereign Academy</div>
    </div>
    <div class="content">
      <h1>${heading}</h1>
      <p>${message}</p>
      
      ${options.nextBillingDate ? `<p>Next billing date: ${options.nextBillingDate.toLocaleDateString()}</p>` : ''}
      
      <a href="${process.env.BASE_URL}/account.html" class="button">Manage Subscription</a>
    </div>
    <div class="footer">
      <p>Bitcoin Sovereign Academy<br>Empowering Bitcoin Education</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${heading}

${message}

${options.nextBillingDate ? `Next billing date: ${options.nextBillingDate.toLocaleDateString()}` : ''}

Manage your subscription: ${process.env.BASE_URL}/account.html

---
Bitcoin Sovereign Academy
  `;

  await sendEmail({
    to: options.email,
    subject: `${subject} - Bitcoin Sovereign Academy`,
    html,
    text
  });
}
