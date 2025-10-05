/**
 * White-Labeling System
 *
 * Enables multi-tenant theming and customization:
 * - Custom branding (logo, colors, fonts)
 * - Environment-specific configuration
 * - Tenant isolation
 * - Custom domains and subdomains
 * - Localization and language support
 */

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  subdomain?: string;
  branding: BrandingConfig;
  features: FeatureFlags;
  content: ContentConfig;
  integrations: IntegrationConfig;
  locale: LocaleConfig;
}

export interface BrandingConfig {
  organizationName: string;
  logo: {
    light: string;  // URL or path
    dark: string;
    favicon: string;
  };
  colors: ColorScheme;
  typography: TypographyConfig;
  customCSS?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TypographyConfig {
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  fontSize: {
    base: string;
    scale: number;
  };
}

export interface FeatureFlags {
  enableCertificates: boolean;
  enableAnalytics: boolean;
  enableABTesting: boolean;
  enableSocial: boolean;
  enablePayments: boolean;
  enableGamification: boolean;
  enableCommunity: boolean;
  customFeatures?: Record<string, boolean>;
}

export interface ContentConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  customCourses: string[];
  contentFilters?: string[];
  customization: {
    hideTopics?: string[];
    emphasizeTopics?: string[];
    customIntroText?: string;
    customFooterText?: string;
  };
}

export interface IntegrationConfig {
  analytics: {
    plausible?: {
      domain: string;
      enabled: boolean;
    };
    google?: {
      trackingId: string;
      enabled: boolean;
    };
  };
  payments?: {
    stripe?: {
      publishableKey: string;
      enabled: boolean;
    };
  };
  email?: {
    provider: 'sendgrid' | 'mailgun' | 'ses';
    fromAddress: string;
    fromName: string;
  };
}

export interface LocaleConfig {
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

export class WhiteLabelManager {
  private tenants: Map<string, TenantConfig> = new Map();
  private currentTenant: TenantConfig | null = null;

  /**
   * Register a new tenant
   */
  registerTenant(config: TenantConfig): void {
    this.tenants.set(config.id, config);
  }

  /**
   * Get tenant by ID or domain
   */
  getTenant(identifier: string): TenantConfig | undefined {
    // Try by ID first
    let tenant = this.tenants.get(identifier);

    if (!tenant) {
      // Try by domain
      tenant = Array.from(this.tenants.values()).find(
        t => t.domain === identifier || t.subdomain === identifier
      );
    }

    return tenant;
  }

  /**
   * Set active tenant
   */
  setActiveTenant(tenantId: string): void {
    const tenant = this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }
    this.currentTenant = tenant;
  }

  /**
   * Get current tenant
   */
  getCurrentTenant(): TenantConfig | null {
    return this.currentTenant;
  }

  /**
   * Auto-detect tenant from hostname
   */
  detectTenantFromHostname(hostname: string): TenantConfig | undefined {
    return Array.from(this.tenants.values()).find(tenant => {
      return (
        tenant.domain === hostname ||
        (tenant.subdomain && tenant.subdomain === hostname) ||
        (tenant.subdomain && hostname.endsWith(tenant.subdomain))
      );
    });
  }

  /**
   * Generate themed CSS
   */
  generateThemeCSS(tenantId?: string): string {
    const tenant = tenantId ? this.getTenant(tenantId) : this.currentTenant;
    if (!tenant) return '';

    const { colors, typography } = tenant.branding;

    return `
:root {
  /* Brand Colors */
  --brand-primary: ${colors.primary};
  --brand-secondary: ${colors.secondary};
  --brand-accent: ${colors.accent};
  --brand-background: ${colors.background};
  --brand-surface: ${colors.surface};

  /* Text Colors */
  --text-primary: ${colors.text.primary};
  --text-secondary: ${colors.text.secondary};
  --text-disabled: ${colors.text.disabled};

  /* Status Colors */
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-error: ${colors.error};
  --color-info: ${colors.info};

  /* Typography */
  --font-primary: ${typography.fontFamily.primary};
  --font-secondary: ${typography.fontFamily.secondary};
  --font-monospace: ${typography.fontFamily.monospace};
  --font-base-size: ${typography.fontSize.base};
  --font-scale: ${typography.fontSize.scale};
}

body {
  font-family: var(--font-primary);
  font-size: var(--font-base-size);
  color: var(--text-primary);
  background: var(--brand-background);
}

.btn-primary {
  background: var(--brand-primary);
  color: white;
}

.btn-secondary {
  background: var(--brand-secondary);
  color: white;
}

.header {
  background: var(--brand-surface);
}

.accent {
  color: var(--brand-accent);
}

${tenant.branding.customCSS || ''}
`;
  }

  /**
   * Generate environment configuration file
   */
  generateEnvFile(tenantId: string): string {
    const tenant = this.getTenant(tenantId);
    if (!tenant) return '';

    const lines = [
      '# Tenant Configuration',
      `TENANT_ID=${tenant.id}`,
      `TENANT_NAME=${tenant.name}`,
      `TENANT_DOMAIN=${tenant.domain}`,
      '',
      '# Branding',
      `ORG_NAME=${tenant.branding.organizationName}`,
      `LOGO_LIGHT=${tenant.branding.logo.light}`,
      `LOGO_DARK=${tenant.branding.logo.dark}`,
      `FAVICON=${tenant.branding.logo.favicon}`,
      `PRIMARY_COLOR=${tenant.branding.colors.primary}`,
      `SECONDARY_COLOR=${tenant.branding.colors.secondary}`,
      '',
      '# Features',
      `ENABLE_CERTIFICATES=${tenant.features.enableCertificates}`,
      `ENABLE_ANALYTICS=${tenant.features.enableAnalytics}`,
      `ENABLE_AB_TESTING=${tenant.features.enableABTesting}`,
      `ENABLE_PAYMENTS=${tenant.features.enablePayments}`,
      '',
      '# Content',
      `DEFAULT_LANGUAGE=${tenant.content.defaultLanguage}`,
      `SUPPORTED_LANGUAGES=${tenant.content.supportedLanguages.join(',')}`,
      '',
      '# Integrations',
    ];

    if (tenant.integrations.analytics.plausible?.enabled) {
      lines.push(
        `PLAUSIBLE_DOMAIN=${tenant.integrations.analytics.plausible.domain}`,
        'PLAUSIBLE_ENABLED=true'
      );
    }

    if (tenant.integrations.email) {
      lines.push(
        '',
        '# Email',
        `EMAIL_PROVIDER=${tenant.integrations.email.provider}`,
        `EMAIL_FROM=${tenant.integrations.email.fromAddress}`,
        `EMAIL_FROM_NAME=${tenant.integrations.email.fromName}`
      );
    }

    return lines.join('\n');
  }

  /**
   * Generate multi-tenant HTML template
   */
  generateTenantHTML(tenantId: string, pageContent: string): string {
    const tenant = this.getTenant(tenantId);
    if (!tenant) return pageContent;

    return `<!DOCTYPE html>
<html lang="${tenant.content.defaultLanguage}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tenant.branding.organizationName}</title>

    <!-- Favicon -->
    <link rel="icon" href="${tenant.branding.logo.favicon}">

    <!-- Analytics -->
    ${tenant.features.enableAnalytics && tenant.integrations.analytics.plausible?.enabled ? `
    <script defer data-domain="${tenant.integrations.analytics.plausible.domain}"
            src="https://plausible.io/js/script.js"></script>
    ` : ''}

    <!-- Custom Theme -->
    <style>
${this.generateThemeCSS(tenantId)}
    </style>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(tenant.branding.typography.fontFamily.primary.split(',')[0])}&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="logo-container">
            <img src="${tenant.branding.logo.light}" alt="${tenant.branding.organizationName}" class="logo">
        </div>
    </header>

    <main>
        ${tenant.content.customization.customIntroText ? `
        <div class="custom-intro">
            ${tenant.content.customization.customIntroText}
        </div>
        ` : ''}

        ${pageContent}
    </main>

    <footer>
        ${tenant.content.customization.customFooterText || `
        <p>&copy; ${new Date().getFullYear()} ${tenant.branding.organizationName}. All rights reserved.</p>
        `}
    </footer>

    <script>
        // Tenant configuration
        window.TENANT_CONFIG = ${JSON.stringify({
          id: tenant.id,
          name: tenant.name,
          features: tenant.features,
          locale: tenant.locale
        }, null, 2)};

        console.log('Tenant:', window.TENANT_CONFIG.name);
    </script>
</body>
</html>`;
  }

  /**
   * Create tenant configuration template
   */
  static createTenantTemplate(
    id: string,
    name: string,
    domain: string,
    primaryColor: string = '#f7931a'
  ): TenantConfig {
    return {
      id,
      name,
      domain,
      branding: {
        organizationName: name,
        logo: {
          light: `/assets/${id}/logo-light.png`,
          dark: `/assets/${id}/logo-dark.png`,
          favicon: `/assets/${id}/favicon.ico`
        },
        colors: {
          primary: primaryColor,
          secondary: '#667eea',
          accent: '#ffd700',
          background: '#ffffff',
          surface: '#f8f9fa',
          text: {
            primary: '#333333',
            secondary: '#666666',
            disabled: '#999999'
          },
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        },
        typography: {
          fontFamily: {
            primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            secondary: '"Playfair Display", serif',
            monospace: '"Courier New", monospace'
          },
          fontSize: {
            base: '16px',
            scale: 1.2
          }
        }
      },
      features: {
        enableCertificates: true,
        enableAnalytics: true,
        enableABTesting: true,
        enableSocial: true,
        enablePayments: false,
        enableGamification: true,
        enableCommunity: true
      },
      content: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'es'],
        customCourses: [],
        customization: {}
      },
      integrations: {
        analytics: {
          plausible: {
            domain: domain,
            enabled: true
          }
        }
      },
      locale: {
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        numberFormat: 'en-US'
      }
    };
  }
}

// Example tenant configurations
export const EXAMPLE_TENANTS: Record<string, TenantConfig> = {
  default: WhiteLabelManager.createTenantTemplate(
    'default',
    'Bitcoin Sovereign Academy',
    'bitcoinsovereign.academy',
    '#f7931a'
  ),

  school: WhiteLabelManager.createTenantTemplate(
    'school',
    'High School Bitcoin Program',
    'bitcoin.school',
    '#3b82f6'
  ),

  enterprise: WhiteLabelManager.createTenantTemplate(
    'enterprise',
    'Corporate Bitcoin Training',
    'bitcoin.enterprise',
    '#8b5cf6'
  ),

  government: WhiteLabelManager.createTenantTemplate(
    'government',
    'Policymaker Bitcoin Education',
    'bitcoin.gov.example',
    '#059669'
  )
};

// Export singleton instance
export const whiteLabelManager = new WhiteLabelManager();

// Register default tenants
Object.values(EXAMPLE_TENANTS).forEach(tenant => {
  whiteLabelManager.registerTenant(tenant);
});
