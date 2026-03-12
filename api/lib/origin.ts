import { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://bitcoinsovereign.academy',
  'https://www.bitcoinsovereign.academy',
  'https://learn.bitcoinsovereign.academy',
  'https://preview.bitcoinsovereign.academy'
];

function normalizeOrigin(value?: string | null): string | null {
  if (!value || typeof value !== 'string') {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isDevelopmentHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return normalized === 'localhost' ||
    normalized === '127.0.0.1' ||
    normalized === '0.0.0.0' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.vercel.app');
}

export function getConfiguredOrigins(): string[] {
  const origins = new Set<string>(DEFAULT_ALLOWED_ORIGINS);

  const configuredValues = [
    process.env.BASE_URL,
    ...(process.env.ALLOWED_ORIGIN || '').split(/[\n,]/)
  ];

  configuredValues.forEach((value) => {
    const origin = normalizeOrigin(value?.trim());
    if (origin) {
      origins.add(origin);
    }
  });

  return Array.from(origins);
}

export function isAllowedOrigin(value?: string | null): boolean {
  const origin = normalizeOrigin(value);
  if (!origin) {
    return false;
  }

  try {
    const hostname = new URL(origin).hostname;
    if (isDevelopmentHostname(hostname)) {
      return true;
    }
  } catch {
    return false;
  }

  return getConfiguredOrigins().includes(origin);
}

export function getRequestOrigin(req: VercelRequest): string | null {
  const requestOrigin = req.headers.origin;
  return typeof requestOrigin === 'string' ? normalizeOrigin(requestOrigin) : null;
}

export function getPreferredOrigin(req?: VercelRequest): string {
  const requestOrigin = req ? getRequestOrigin(req) : null;
  if (requestOrigin && isAllowedOrigin(requestOrigin)) {
    return requestOrigin;
  }

  return getConfiguredOrigins()[0];
}

export function resolveAllowedRedirectUrl(
  requestedUrl: string | undefined,
  fallbackPath: string,
  req?: VercelRequest
): string {
  const baseOrigin = getPreferredOrigin(req);

  if (!requestedUrl) {
    return new URL(fallbackPath, baseOrigin).toString();
  }

  let candidate: URL;

  try {
    candidate = new URL(requestedUrl, baseOrigin);
  } catch {
    throw new Error('Invalid redirect URL');
  }

  if (!isAllowedOrigin(candidate.origin)) {
    throw new Error('Redirect URL origin is not allowed');
  }

  return candidate.toString();
}

export function appendLiteralQueryParam(urlString: string, name: string, value: string): string {
  if (!urlString) {
    return urlString;
  }

  const separator = urlString.includes('?') ? '&' : '?';
  return `${urlString}${separator}${name}=${value}`;
}

export function setCorsHeaders(
  req: VercelRequest,
  res: VercelResponse,
  methods = 'GET, POST, OPTIONS',
  headers = 'Content-Type, Authorization'
): string {
  const requestOrigin = getRequestOrigin(req);
  const corsOrigin = requestOrigin && isAllowedOrigin(requestOrigin)
    ? requestOrigin
    : getPreferredOrigin(req);

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);

  return corsOrigin;
}
