/**
 * Email Notification Service
 *
 * Handles all email communications including:
 * - Access token delivery after purchase
 * - Welcome emails
 * - Payment confirmations
 * - Password reset emails
 */

export interface EmailConfig {
  provider: 'resend' | 'sendgrid';
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface AccessTokenEmailData {
  email: string;
  token: string;
  modules: string[];
  paths: string[];
  totalPaid: number;
}

/**
 * Send email using Resend API
 */
async function sendWithResend(template: EmailTemplate, apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || 'noreply@bitcoinsovereign.academy',
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    return false;
  }

  return true;
}

/**
 * Send email using SendGrid API
 */
async function sendWithSendGrid(template: EmailTemplate, apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: template.to }],
        subject: template.subject
      }],
      from: {
        email: process.env.FROM_EMAIL || 'noreply@bitcoinsovereign.academy',
        name: process.env.FROM_NAME || 'Bitcoin Sovereign Academy'
      },
      content: [
        { type: 'text/html', value: template.html },
        ...(template.text ? [{ type: 'text/plain', value: template.text }] : [])
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('SendGrid API error:', error);
    return false;
  }

  return true;
}

/**
 * Send email via configured provider
 */
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  const provider = (process.env.EMAIL_PROVIDER || 'resend') as 'resend' | 'sendgrid';
  const apiKey = process.env.EMAIL_API_KEY || '';

  if (!apiKey) {
    console.error('Email API key not configured');
    return false;
  }

  try {
    if (provider === 'resend') {
      return await sendWithResend(template, apiKey);
    } else {
      return await sendWithSendGrid(template, apiKey);
    }
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

/**
 * Generate HTML email template for access token delivery
 */
function generateAccessTokenEmailHTML(data: AccessTokenEmailData): string {
  const moduleList = data.modules.map(m => `<li style="margin: 8px 0;">${m}</li>`).join('');
  const pathList = data.paths.map(p => `<li style="margin: 8px 0;">${p}</li>`).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Bitcoin Sovereign Academy</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1a1a1a; color: #e0e0e0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #f7931a; font-size: 32px; margin: 0 0 10px 0;">⚡ Bitcoin Sovereign Academy</h1>
      <p style="color: #999; font-size: 16px; margin: 0;">Welcome! Your access is ready.</p>
    </div>

    <!-- Main Content Card -->
    <div style="background: #2d2d2d; border: 2px solid rgba(247, 147, 26, 0.3); border-radius: 16px; padding: 32px; margin-bottom: 32px;">

      <h2 style="color: #f7931a; font-size: 24px; margin: 0 0 16px 0;">🎉 Payment Confirmed</h2>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        Thank you for joining the Bitcoin Sovereign Academy! Your payment of <strong style="color: #f7931a;">$${data.totalPaid.toFixed(2)}</strong> has been confirmed.
      </p>

      <!-- Access Token -->
      <div style="background: rgba(247, 147, 26, 0.1); border-left: 4px solid #f7931a; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="font-size: 14px; color: #999; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Access Token</p>
        <p style="font-family: 'Courier New', monospace; font-size: 14px; color: #f7931a; margin: 0; word-break: break-all; line-height: 1.6;">
          ${data.token}
        </p>
      </div>

      <p style="font-size: 14px; color: #999; margin: 16px 0 24px 0;">
        ⚠️ Keep this token safe! You'll need it to access your content.
      </p>

      <!-- Purchased Content -->
      ${data.paths.length > 0 ? `
      <div style="margin: 24px 0;">
        <h3 style="color: #4caf50; font-size: 18px; margin: 0 0 12px 0;">📚 Learning Paths Unlocked</h3>
        <ul style="margin: 0; padding-left: 20px; color: #e0e0e0;">
          ${pathList}
        </ul>
      </div>
      ` : ''}

      ${data.modules.length > 0 ? `
      <div style="margin: 24px 0;">
        <h3 style="color: #4caf50; font-size: 18px; margin: 0 0 12px 0;">📖 Modules Unlocked</h3>
        <ul style="margin: 0; padding-left: 20px; color: #e0e0e0;">
          ${moduleList}
        </ul>
      </div>
      ` : ''}

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0 0 0;">
        <a href="https://learn.bitcoinsovereign.academy" style="display: inline-block; background: linear-gradient(135deg, #f7931a, #ffb347); color: #121212; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(247, 147, 26, 0.3);">
          🚀 Start Learning
        </a>
      </div>

    </div>

    <!-- How to Use Your Token -->
    <div style="background: #2d2d2d; border: 1px solid rgba(247, 147, 26, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <h3 style="color: #f7931a; font-size: 18px; margin: 0 0 16px 0;">🔑 How to Use Your Access Token</h3>

      <ol style="margin: 0; padding-left: 20px; color: #e0e0e0; line-height: 1.8;">
        <li>Visit <a href="https://learn.bitcoinsovereign.academy" style="color: #f7931a; text-decoration: none;">learn.bitcoinsovereign.academy</a></li>
        <li>You'll be prompted to enter your access token</li>
        <li>Paste the token from above</li>
        <li>Start learning! All your purchased content is now unlocked</li>
      </ol>

      <p style="font-size: 14px; color: #999; margin: 16px 0 0 0; font-style: italic;">
        💡 Tip: Bookmark the member site for easy access
      </p>
    </div>

    <!-- Support -->
    <div style="text-align: center; padding: 24px 0; border-top: 1px solid rgba(247, 147, 26, 0.2);">
      <p style="font-size: 14px; color: #999; margin: 0 0 8px 0;">
        Questions or issues? We're here to help!
      </p>
      <p style="font-size: 14px; margin: 0;">
        <a href="mailto:support@bitcoinsovereign.academy" style="color: #f7931a; text-decoration: none;">support@bitcoinsovereign.academy</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 0; color: #666; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">© 2024 Bitcoin Sovereign Academy</p>
      <p style="margin: 0;">Learn Bitcoin. Achieve Sovereignty.</p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text version of access token email
 */
function generateAccessTokenEmailText(data: AccessTokenEmailData): string {
  const moduleList = data.modules.map(m => `  • ${m}`).join('\n');
  const pathList = data.paths.map(p => `  • ${p}`).join('\n');

  return `
BITCOIN SOVEREIGN ACADEMY
Welcome! Your access is ready.

========================================
PAYMENT CONFIRMED
========================================

Thank you for joining the Bitcoin Sovereign Academy!
Your payment of $${data.totalPaid.toFixed(2)} has been confirmed.

YOUR ACCESS TOKEN:
${data.token}

⚠️ Keep this token safe! You'll need it to access your content.

========================================
CONTENT UNLOCKED
========================================

${data.paths.length > 0 ? `Learning Paths:\n${pathList}\n\n` : ''}${data.modules.length > 0 ? `Modules:\n${moduleList}\n\n` : ''}
========================================
HOW TO USE YOUR TOKEN
========================================

1. Visit https://learn.bitcoinsovereign.academy
2. You'll be prompted to enter your access token
3. Paste the token from above
4. Start learning! All your purchased content is now unlocked

💡 Tip: Bookmark the member site for easy access

========================================
SUPPORT
========================================

Questions or issues? We're here to help!
Email: support@bitcoinsovereign.academy

© 2024 Bitcoin Sovereign Academy
Learn Bitcoin. Achieve Sovereignty.
  `;
}

/**
 * Send access token email after successful payment
 */
export async function sendAccessTokenEmail(data: AccessTokenEmailData): Promise<boolean> {
  const template: EmailTemplate = {
    to: data.email,
    subject: '🎉 Welcome to Bitcoin Sovereign Academy - Your Access Token',
    html: generateAccessTokenEmailHTML(data),
    text: generateAccessTokenEmailText(data)
  };

  return await sendEmail(template);
}

/**
 * Send welcome email for new users
 */
export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const template: EmailTemplate = {
    to: email,
    subject: '👋 Welcome to Bitcoin Sovereign Academy',
    html: `
      <h1>Welcome to Bitcoin Sovereign Academy!</h1>
      <p>We're excited to have you on your Bitcoin learning journey.</p>
      <p>Explore our free content and when you're ready, unlock full access to all learning paths.</p>
      <a href="https://bitcoinsovereign.academy">Start Exploring</a>
    `,
    text: 'Welcome to Bitcoin Sovereign Academy! Start your learning journey at https://bitcoinsovereign.academy'
  };

  return await sendEmail(template);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `https://bitcoinsovereign.academy/reset-password?token=${resetToken}`;

  const template: EmailTemplate = {
    to: email,
    subject: '🔐 Reset Your Password - Bitcoin Sovereign Academy',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\nIf you didn't request this, please ignore this email.`
  };

  return await sendEmail(template);
}
