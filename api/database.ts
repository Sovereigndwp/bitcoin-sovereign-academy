/**
 * Database Client for Supabase/PostgreSQL
 *
 * Provides database operations for:
 * - Users
 * - Sessions
 * - Entitlements
 * - Payments
 */

import { User, UserSession } from './auth';

// ============================================
// Configuration
// ============================================

interface DatabaseConfig {
  url: string;
  apiKey: string;
  serviceKey: string;
}

function getConfig(): DatabaseConfig {
  const url = process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url) {
    throw new Error('SUPABASE_URL not configured');
  }

  return { url, apiKey, serviceKey };
}

// ============================================
// Generic REST API Helper
// ============================================

async function supabaseFetch<T>(
  table: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    select?: string;
    eq?: Record<string, any>;
    body?: any;
    limit?: number;
    single?: boolean;
  } = {}
): Promise<T> {
  const config = getConfig();
  const { method = 'GET', select, eq, body, limit, single } = options;

  let url = `${config.url}/rest/v1/${table}`;
  const params = new URLSearchParams();

  if (select) params.append('select', select);
  if (eq) {
    Object.entries(eq).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
  }
  if (limit) params.append('limit', limit.toString());

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': config.serviceKey,
    'Authorization': `Bearer ${config.serviceKey}`,
    'Prefer': 'return=representation'
  };

  if (single) {
    headers['Accept'] = 'application/vnd.pgrst.object+json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Database error: ${response.statusText} - ${error}`);
  }

  if (method === 'DELETE') {
    return null as T;
  }

  return await response.json();
}

// ============================================
// Entitlement Operations
// ============================================

export async function findEntitlementByEmail(email: string): Promise<{
  modules: string[];
  paths: string[];
  accessToken?: string;
} | null> {
  try {
    // First get user by email
    const users = await supabaseFetch<any[]>('users', {
      select: 'id',
      eq: { email: email.toLowerCase().trim() },
      limit: 1
    });

    if (!users || users.length === 0) return null;

    const userId = users[0].id;

    // Then get entitlements for that user
    const entitlements = await supabaseFetch<any[]>('entitlements', {
      select: 'modules,paths,access_token',
      eq: { user_id: userId },
      limit: 1
    });

    if (!entitlements || entitlements.length === 0) return null;

    return {
      modules: entitlements[0].modules || [],
      paths: entitlements[0].paths || [],
      accessToken: entitlements[0].access_token
    };
  } catch (error) {
    console.error('findEntitlementByEmail error:', error);
    return null;
  }
}

export async function findEntitlementByUserId(userId: string): Promise<{
  modules: string[];
  paths: string[];
  accessToken?: string;
} | null> {
  try {
    const entitlements = await supabaseFetch<any[]>('entitlements', {
      select: 'modules,paths,access_token',
      eq: { user_id: userId },
      limit: 1
    });

    if (!entitlements || entitlements.length === 0) return null;

    return {
      modules: entitlements[0].modules || [],
      paths: entitlements[0].paths || [],
      accessToken: entitlements[0].access_token
    };
  } catch (error) {
    console.error('findEntitlementByUserId error:', error);
    return null;
  }
}

export async function createEntitlement(entitlement: {
  userId: string;
  modules: string[];
  paths: string[];
  accessToken?: string;
}): Promise<string> {
  const result = await supabaseFetch<any>('entitlements', {
    method: 'POST',
    body: {
      user_id: entitlement.userId,
      modules: entitlement.modules,
      paths: entitlement.paths,
      access_token: entitlement.accessToken
    }
  });

  return result[0]?.id || result.id;
}

export async function updateEntitlement(userId: string, modules: string[], paths: string[]): Promise<void> {
  await supabaseFetch('entitlements', {
    method: 'PATCH',
    eq: { user_id: userId },
    body: {
      modules,
      paths,
      updated_at: new Date().toISOString()
    }
  });
}

// ============================================
// User Operations
// ============================================

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
  const result = await supabaseFetch<any>('users', {
    method: 'POST',
    body: {
      email: user.email.toLowerCase().trim(),
      password_hash: user.passwordHash,
      password_salt: user.passwordSalt,
      is_email_verified: user.isEmailVerified,
      email_verification_token: user.emailVerificationToken
    }
  });

  return result[0]?.id || result.id;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await supabaseFetch<any[]>('users', {
      select: '*',
      eq: { email: email.toLowerCase().trim() },
      limit: 1
    });

    if (!users || users.length === 0) return null;

    const u = users[0];
    return {
      id: u.id,
      email: u.email,
      passwordHash: u.password_hash,
      passwordSalt: u.password_salt,
      isEmailVerified: u.is_email_verified,
      emailVerificationToken: u.email_verification_token,
      passwordResetToken: u.password_reset_token,
      passwordResetExpires: u.password_reset_expires ? new Date(u.password_reset_expires) : undefined,
      createdAt: new Date(u.created_at),
      lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : undefined
    };
  } catch (error) {
    console.error('findUserByEmail error:', error);
    return null;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  try {
    const users = await supabaseFetch<any[]>('users', {
      select: '*',
      eq: { id },
      limit: 1
    });

    if (!users || users.length === 0) return null;

    const u = users[0];
    return {
      id: u.id,
      email: u.email,
      passwordHash: u.password_hash,
      passwordSalt: u.password_salt,
      isEmailVerified: u.is_email_verified,
      emailVerificationToken: u.email_verification_token,
      passwordResetToken: u.password_reset_token,
      passwordResetExpires: u.password_reset_expires ? new Date(u.password_reset_expires) : undefined,
      createdAt: new Date(u.created_at),
      lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : undefined
    };
  } catch (error) {
    console.error('findUserById error:', error);
    return null;
  }
}

// ============================================
// Payment Operations
// ============================================

export interface Payment {
  id?: string;
  userId?: string;
  email: string;
  provider: 'stripe' | 'btcpay';
  providerPaymentId: string;
  amountUsd: number;
  items: any;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: any;
  paidAt?: Date;
}

export async function createPayment(payment: Omit<Payment, 'id'>): Promise<string> {
  const result = await supabaseFetch<any>('payments', {
    method: 'POST',
    body: {
      user_id: payment.userId,
      email: payment.email,
      provider: payment.provider,
      provider_payment_id: payment.providerPaymentId,
      amount_usd: payment.amountUsd,
      items: payment.items,
      status: payment.status,
      metadata: payment.metadata || {}
    }
  });

  return result[0]?.id || result.id;
}

export async function findPaymentByProviderId(provider: string, providerId: string): Promise<Payment | null> {
  try {
    const payments = await supabaseFetch<any[]>('payments', {
      select: '*',
      eq: { provider, provider_payment_id: providerId },
      limit: 1
    });

    if (!payments || payments.length === 0) return null;

    const p = payments[0];
    return {
      id: p.id,
      userId: p.user_id,
      email: p.email,
      provider: p.provider,
      providerPaymentId: p.provider_payment_id,
      amountUsd: p.amount_usd,
      items: p.items,
      status: p.status,
      metadata: p.metadata,
      paidAt: p.paid_at ? new Date(p.paid_at) : undefined
    };
  } catch (error) {
    console.error('findPaymentByProviderId error:', error);
    return null;
  }
}

export async function updatePaymentStatus(paymentId: string, status: string, paidAt?: Date): Promise<void> {
  await supabaseFetch('payments', {
    method: 'PATCH',
    eq: { id: paymentId },
    body: {
      status,
      paid_at: paidAt?.toISOString(),
      updated_at: new Date().toISOString()
    }
  });
}

// ============================================
// Health Check
// ============================================

export async function healthCheck(): Promise<boolean> {
  try {
    await supabaseFetch('users', { select: 'id', limit: 1 });
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
