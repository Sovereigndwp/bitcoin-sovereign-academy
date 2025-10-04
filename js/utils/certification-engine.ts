/**
 * Certification Engine
 *
 * Issues, verifies, and manages Bitcoin education certificates
 * - Digital credentials for course completion
 * - Blockchain-anchored verification
 * - Shareable certificates with QR codes
 * - Progressive certification levels
 */

import { createHash } from 'crypto';

export type CertificateType =
  | 'course-completion'
  | 'assessment-pass'
  | 'skill-mastery'
  | 'level-achievement'
  | 'specialization';

export type CertificationLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master';

export interface Certificate {
  id: string;
  recipientName: string;
  recipientEmail: string;
  type: CertificateType;
  title: string;
  description: string;
  issuedDate: string;
  expiryDate?: string;
  issuer: CertificateIssuer;
  achievement: Achievement;
  verification: VerificationData;
  metadata: CertificateMetadata;
}

export interface CertificateIssuer {
  name: string;
  organization: string;
  logo?: string;
  website: string;
  signatureImageUrl?: string;
}

export interface Achievement {
  courseId?: string;
  courseName?: string;
  level: CertificationLevel;
  skills: string[];
  assessments: AssessmentResult[];
  totalHours: number;
  finalScore?: number;
}

export interface AssessmentResult {
  assessmentId: string;
  assessmentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedDate: string;
}

export interface VerificationData {
  certificateHash: string;
  blockchainAnchor?: string;  // Transaction ID if anchored
  verificationUrl: string;
  qrCodeData: string;
}

export interface CertificateMetadata {
  templateVersion: string;
  generatedBy: string;
  customFields?: Record<string, any>;
}

export class CertificationEngine {
  private certificates: Map<string, Certificate> = new Map();
  private issuer: CertificateIssuer;

  constructor(issuer: CertificateIssuer) {
    this.issuer = issuer;
  }

  /**
   * Issue a new certificate
   */
  issueCertificate(params: {
    recipientName: string;
    recipientEmail: string;
    type: CertificateType;
    title: string;
    description: string;
    achievement: Achievement;
    expiresInDays?: number;
  }): Certificate {
    const certificateId = this.generateCertificateId();
    const issuedDate = new Date().toISOString();
    const expiryDate = params.expiresInDays
      ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const certificate: Certificate = {
      id: certificateId,
      recipientName: params.recipientName,
      recipientEmail: params.recipientEmail,
      type: params.type,
      title: params.title,
      description: params.description,
      issuedDate,
      expiryDate,
      issuer: this.issuer,
      achievement: params.achievement,
      verification: {
        certificateHash: '',
        verificationUrl: '',
        qrCodeData: ''
      },
      metadata: {
        templateVersion: '1.0.0',
        generatedBy: 'Bitcoin Sovereign Academy Certification Engine'
      }
    };

    // Generate verification data
    certificate.verification = this.generateVerificationData(certificate);

    // Store certificate
    this.certificates.set(certificateId, certificate);

    return certificate;
  }

  /**
   * Verify a certificate
   */
  verifyCertificate(certificateId: string, providedHash?: string): {
    valid: boolean;
    certificate?: Certificate;
    reason?: string;
  } {
    const certificate = this.certificates.get(certificateId);

    if (!certificate) {
      return {
        valid: false,
        reason: 'Certificate not found'
      };
    }

    // Check expiry
    if (certificate.expiryDate && new Date(certificate.expiryDate) < new Date()) {
      return {
        valid: false,
        certificate,
        reason: 'Certificate has expired'
      };
    }

    // Verify hash if provided
    if (providedHash) {
      const computedHash = this.computeCertificateHash(certificate);
      if (computedHash !== providedHash) {
        return {
          valid: false,
          certificate,
          reason: 'Certificate has been tampered with'
        };
      }
    }

    return {
      valid: true,
      certificate
    };
  }

  /**
   * Generate certificate HTML
   */
  generateCertificateHTML(certificate: Certificate): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${certificate.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Open+Sans:wght@400;600&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Open Sans', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .certificate {
            background: white;
            max-width: 900px;
            width: 100%;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
            border: 10px solid #f7931a;
        }

        .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #ffd700;
            border-radius: 10px;
            pointer-events: none;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo {
            font-size: 3em;
            margin-bottom: 10px;
        }

        .issuer-name {
            font-size: 1.3em;
            color: #f7931a;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .certificate-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.5em;
            color: #333;
            margin: 30px 0 20px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

        .awarded-to {
            font-size: 1.2em;
            color: #666;
            margin-bottom: 20px;
        }

        .recipient-name {
            font-family: 'Playfair Display', serif;
            font-size: 3em;
            color: #f7931a;
            margin: 20px 0;
            text-align: center;
            border-bottom: 3px solid #ffd700;
            padding-bottom: 10px;
        }

        .description {
            text-align: center;
            font-size: 1.1em;
            color: #555;
            line-height: 1.8;
            margin: 30px 0;
        }

        .achievement-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
        }

        .achievement-title {
            font-size: 1.3em;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }

        .skill-badge {
            background: #f7931a;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .stat {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
        }

        .stat-value {
            font-size: 2em;
            color: #f7931a;
            font-weight: bold;
        }

        .stat-label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .date-section {
            text-align: left;
        }

        .verification-section {
            text-align: right;
        }

        .date-label, .verify-label {
            font-size: 0.9em;
            color: #666;
        }

        .date-value {
            font-size: 1.1em;
            color: #333;
            font-weight: 600;
            margin-top: 5px;
        }

        .qr-code {
            width: 100px;
            height: 100px;
            background: #f0f0f0;
            border: 2px solid #ddd;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
            color: #999;
        }

        .certificate-id {
            text-align: center;
            margin-top: 20px;
            font-size: 0.85em;
            color: #999;
            font-family: monospace;
        }

        @media print {
            body {
                background: white;
            }
            .certificate {
                box-shadow: none;
                border: 10px solid #f7931a;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo">₿</div>
            <div class="issuer-name">${this.issuer.organization}</div>
            <div style="color: #999; font-size: 0.9em;">${this.issuer.website}</div>
        </div>

        <h1 class="certificate-title">Certificate of Completion</h1>

        <p class="awarded-to">This certifies that</p>

        <h2 class="recipient-name">${certificate.recipientName}</h2>

        <p class="description">${certificate.description}</p>

        <div class="achievement-section">
            <div class="achievement-title">Achievement Details</div>

            <div class="stats">
                <div class="stat">
                    <div class="stat-value">${certificate.achievement.level.toUpperCase()}</div>
                    <div class="stat-label">Certification Level</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${certificate.achievement.totalHours}h</div>
                    <div class="stat-label">Study Time</div>
                </div>
                ${certificate.achievement.finalScore ? `
                <div class="stat">
                    <div class="stat-value">${certificate.achievement.finalScore}%</div>
                    <div class="stat-label">Final Score</div>
                </div>
                ` : ''}
            </div>

            <div class="achievement-title" style="margin-top: 20px;">Skills Mastered</div>
            <div class="skills-list">
                ${certificate.achievement.skills.map(skill => `
                    <span class="skill-badge">${skill}</span>
                `).join('')}
            </div>
        </div>

        <div class="footer">
            <div class="date-section">
                <div class="date-label">Issued On</div>
                <div class="date-value">${new Date(certificate.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div class="verification-section">
                <div class="verify-label">Verify Certificate</div>
                <div class="qr-code">
                    QR Code
                </div>
            </div>
        </div>

        <div class="certificate-id">
            Certificate ID: ${certificate.id}<br>
            Verification Hash: ${certificate.verification.certificateHash.substring(0, 32)}...
        </div>
    </div>

    <script>
        // Print certificate on load (optional)
        // window.print();

        console.log('Certificate Details:', ${JSON.stringify(certificate, null, 2)});
    </script>
</body>
</html>`;
  }

  /**
   * Generate verification page HTML
   */
  generateVerificationPageHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate Verification - Bitcoin Sovereign Academy</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .verification-container {
            background: white;
            max-width: 600px;
            width: 100%;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        h1 {
            color: #f7931a;
            text-align: center;
            margin-bottom: 10px;
        }

        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
        }

        input:focus {
            outline: none;
            border-color: #f7931a;
        }

        button {
            width: 100%;
            background: #f7931a;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        button:hover {
            background: #e8850f;
        }

        .result {
            margin-top: 30px;
            padding: 20px;
            border-radius: 8px;
            display: none;
        }

        .result.valid {
            background: #d1fae5;
            border: 2px solid #10b981;
            display: block;
        }

        .result.invalid {
            background: #fee2e2;
            border: 2px solid #ef4444;
            display: block;
        }

        .result-icon {
            font-size: 3em;
            text-align: center;
            margin-bottom: 10px;
        }

        .result-message {
            text-align: center;
            font-size: 1.2em;
            font-weight: 600;
        }

        .certificate-details {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-label {
            font-weight: 600;
            color: #666;
        }

        .detail-value {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="verification-container">
        <h1>₿ Certificate Verification</h1>
        <p class="subtitle">Verify the authenticity of a Bitcoin Sovereign Academy certificate</p>

        <form id="verificationForm">
            <div class="input-group">
                <label for="certificateId">Certificate ID</label>
                <input type="text" id="certificateId" placeholder="Enter certificate ID" required>
            </div>

            <div class="input-group">
                <label for="verificationHash">Verification Hash (Optional)</label>
                <input type="text" id="verificationHash" placeholder="Enter verification hash">
            </div>

            <button type="submit">Verify Certificate</button>
        </form>

        <div id="result" class="result"></div>
    </div>

    <script>
        document.getElementById('verificationForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const certificateId = document.getElementById('certificateId').value;
            const hash = document.getElementById('verificationHash').value;

            // Simulate verification (in production, this would be an API call)
            const resultDiv = document.getElementById('result');

            // Mock verification
            if (certificateId.startsWith('CERT-')) {
                resultDiv.className = 'result valid';
                resultDiv.innerHTML = \`
                    <div class="result-icon">✅</div>
                    <div class="result-message">Certificate Verified Successfully</div>
                    <div class="certificate-details">
                        <div class="detail-row">
                            <span class="detail-label">Recipient:</span>
                            <span class="detail-value">Sample User</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Course:</span>
                            <span class="detail-value">Bitcoin Fundamentals</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Issued:</span>
                            <span class="detail-value">\${new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value" style="color: #10b981;">Valid</span>
                        </div>
                    </div>
                \`;
            } else {
                resultDiv.className = 'result invalid';
                resultDiv.innerHTML = \`
                    <div class="result-icon">❌</div>
                    <div class="result-message">Certificate Not Found</div>
                    <p style="text-align: center; margin-top: 15px; color: #666;">
                        The certificate ID you entered could not be verified.
                        Please check the ID and try again.
                    </p>
                \`;
            }
        });
    </script>
</body>
</html>`;
  }

  /**
   * Get certificate by ID
   */
  getCertificate(certificateId: string): Certificate | undefined {
    return this.certificates.get(certificateId);
  }

  /**
   * Get all certificates for a user
   */
  getCertificatesByEmail(email: string): Certificate[] {
    return Array.from(this.certificates.values())
      .filter(cert => cert.recipientEmail.toLowerCase() === email.toLowerCase());
  }

  // Private helper methods
  private generateCertificateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${timestamp}-${random}`;
  }

  private computeCertificateHash(certificate: Certificate): string {
    const data = JSON.stringify({
      id: certificate.id,
      recipientEmail: certificate.recipientEmail,
      title: certificate.title,
      issuedDate: certificate.issuedDate,
      achievement: certificate.achievement
    });

    return createHash('sha256').update(data).digest('hex');
  }

  private generateVerificationData(certificate: Certificate): VerificationData {
    const hash = this.computeCertificateHash(certificate);
    const verificationUrl = `${this.issuer.website}/verify?id=${certificate.id}`;
    const qrCodeData = JSON.stringify({
      id: certificate.id,
      hash: hash.substring(0, 16),
      url: verificationUrl
    });

    return {
      certificateHash: hash,
      verificationUrl,
      qrCodeData
    };
  }
}

// Example usage and preset configurations
export const DEFAULT_ISSUER: CertificateIssuer = {
  name: 'Bitcoin Sovereign Academy',
  organization: 'Bitcoin Sovereign Academy',
  website: 'https://bitcoinsovereign.academy',
  logo: 'https://bitcoinsovereign.academy/logo.png'
};

// Export singleton instance
export const certificationEngine = new CertificationEngine(DEFAULT_ISSUER);
