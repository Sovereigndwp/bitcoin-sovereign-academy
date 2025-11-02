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
}

function getConfig(): DatabaseConfig {
  const url = process.env.SUPABASE_URL || process.env.DATABASE_URL;
  const apiKey = process.env.SUPABASE_ANON_KEY || '';

  if (!url) {
    throw new Error('Database URL not configured');
  }

  return { url, apiKey };
}

// ============================================
// Generic Query Function
// ============================================

async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  const config = getConfig();

  // For Supabase, use REST API
  if (config.url.includes('supabase')) {
    return await querySupabase<T>(sql, params);
  }

  // For direct PostgreSQL connection
  return await queryPostgres<T>(sql, params);
}

/**
 * Query via Supabase REST API
 */
async function querySupabase<T>(sql: string, params: any[]): Promise<T[]> {
  const config = getConfig();

  // Supabase REST API endpoint
  const response = await fetch(`${config.url}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.apiKey,
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({ query: sql, params })
  });

  if (!response.ok) {
    throw new Error(`Database query failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Query via direct PostgreSQL connection (using pg library)
 * This would require: npm install pg
 */
async function queryPostgres<T>(sql: string, params: any[]): Promise<T[]> {
  // TODO: Implement direct PostgreSQL connection if needed
  throw new Error('Direct PostgreSQL connection not implemented. Use Supabase.');
}

// ============================================
// User Operations
// ============================================

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<string> {
  const result = await query<{ id: string }>(`
    INSERT INTO users (email, password_hash, password_salt, is_email_verified, email_verification_token)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [user.email, user.passwordHash, user.passwordSalt, user.isEmailVerified, user.emailVerificationToken]);

  return result[0].id;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query<User>(`
    SELECT * FROM users WHERE email = $1 LIMIT 1
  `, [email.toLowerCase().trim()]);

  return result[0] || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await query<User>(`
    SELECT * FROM users WHERE id = $1 LIMIT 1
  `, [id]);

  return result[0] || null;
}

export async function updateUserPassword(userId: string, passwordHash: string, passwordSalt: string): Promise<void> {
  await query(`
    UPDATE users
    SET password_hash = $1, password_salt = $2, updated_at = NOW()
    WHERE id = $3
  `, [passwordHash, passwordSalt, userId]);
}

export async function updateUserEmail(userId: string, email: string, verificationToken: string): Promise<void> {
  await query(`
    UPDATE users
    SET email = $1, is_email_verified = FALSE, email_verification_token = $2, updated_at = NOW()
    WHERE id = $3
  `, [email, verificationToken, userId]);
}

export async function verifyUserEmail(token: string): Promise<boolean> {
  const result = await query<{ success: boolean }>(`
    UPDATE users
    SET is_email_verified = TRUE, email_verification_token = NULL, updated_at = NOW()
    WHERE email_verification_token = $1
    RETURNING TRUE as success
  `, [token]);

  return result.length > 0;
}

export async function setPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
  await query(`
    UPDATE users
    SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW()
    WHERE id = $3
  `, [token, expiresAt, userId]);
}

export async function findUserByResetToken(token: string): Promise<User | null> {
  const result = await query<User>(`
    SELECT * FROM users
    WHERE password_reset_token = $1 AND password_reset_expires > NOW()
    LIMIT 1
  `, [token]);

  return result[0] || null;
}

export async function updateLastLogin(userId: string): Promise<void> {
  await query(`
    UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1
  `, [userId]);
}

export async function deleteUserById(userId: string): Promise<void> {
  await query(`DELETE FROM users WHERE id = $1`, [userId]);
}

// ============================================
// Session Operations
// ============================================

export async function createSession(session: Omit<UserSession, 'id'>): Promise<string> {
  const result = await query<{ id: string }>(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id
  `, [session.userId, session.sessionToken, session.expiresAt]);

  return result[0].id;
}

export async function findSessionByToken(token: string): Promise<UserSession | null> {
  const result = await query<UserSession>(`
    SELECT * FROM sessions WHERE session_token = $1 AND expires_at > NOW() LIMIT 1
  `, [token]);

  return result[0] || null;
}

export async function deleteSession(sessionToken: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken]);
}

export async function deleteUserSessions(userId: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
}

export async function cleanExpiredSessions(): Promise<number> {
  const result = await query<{ count: number }>(`
    SELECT clean_expired_sessions() as count
  `);

  return result[0]?.count || 0;
}

// ============================================
// Entitlement Operations
// ============================================

export async function createEntitlement(entitlement: {
  userId: string;
  modules: string[];
  paths: string[];
  accessToken?: string;
}): Promise<string> {
  const result = await query<{ id: string }>(`
    INSERT INTO entitlements (user_id, modules, paths, access_token)
    VALUES ($1, $2::text[], $3::text[], $4)
    RETURNING id
  `, [entitlement.userId, entitlement.modules, entitlement.paths, entitlement.accessToken]);

  return result[0].id;
}

export async function findEntitlementByUserId(userId: string): Promise<{
  modules: string[];
  paths: string[];
  accessToken?: string;
} | null> {
  const result = await query<{
    modules: string[];
    paths: string[];
    access_token?: string;
  }>(`
    SELECT modules, paths, access_token FROM entitlements WHERE user_id = $1 LIMIT 1
  `, [userId]);

  if (!result[0]) return null;

  return {
    modules: result[0].modules,
    paths: result[0].paths,
    accessToken: result[0].access_token
  };
}

export async function findEntitlementByEmail(email: string): Promise<{
  modules: string[];
  paths: string[];
  accessToken?: string;
} | null> {
  const result = await query<{
    modules: string[];
    paths: string[];
    access_token?: string;
  }>(`
    SELECT e.modules, e.paths, e.access_token
    FROM entitlements e
    JOIN users u ON e.user_id = u.id
    WHERE u.email = $1
    LIMIT 1
  `, [email]);

  if (!result[0]) return null;

  return {
    modules: result[0].modules,
    paths: result[0].paths,
    accessToken: result[0].access_token
  };
}

export async function updateEntitlement(userId: string, modules: string[], paths: string[]): Promise<void> {
  await query(`
    UPDATE entitlements
    SET modules = $1::text[], paths = $2::text[], updated_at = NOW()
    WHERE user_id = $3
  `, [modules, paths, userId]);
}

export async function addModulesToEntitlement(userId: string, newModules: string[]): Promise<void> {
  await query(`
    UPDATE entitlements
    SET modules = array_cat(modules, $1::text[]), updated_at = NOW()
    WHERE user_id = $2
  `, [newModules, userId]);
}

export async function addPathsToEntitlement(userId: string, newPaths: string[]): Promise<void> {
  await query(`
    UPDATE entitlements
    SET paths = array_cat(paths, $1::text[]), updated_at = NOW()
    WHERE user_id = $2
  `, [newPaths, userId]);
}

export async function hasModuleAccess(email: string, moduleId: string): Promise<boolean> {
  const result = await query<{ has_access: boolean }>(`
    SELECT has_module_access($1, $2) as has_access
  `, [email, moduleId]);

  return result[0]?.has_access || false;
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
  const result = await query<{ id: string }>(`
    INSERT INTO payments (user_id, email, provider, provider_payment_id, amount_usd, items, status, metadata)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8::jsonb)
    RETURNING id
  `, [
    payment.userId,
    payment.email,
    payment.provider,
    payment.providerPaymentId,
    payment.amountUsd,
    JSON.stringify(payment.items),
    payment.status,
    JSON.stringify(payment.metadata || {})
  ]);

  return result[0].id;
}

export async function findPaymentByProviderId(provider: string, providerId: string): Promise<Payment | null> {
  const result = await query<Payment>(`
    SELECT * FROM payments WHERE provider = $1 AND provider_payment_id = $2 LIMIT 1
  `, [provider, providerId]);

  return result[0] || null;
}

export async function updatePaymentStatus(paymentId: string, status: string, paidAt?: Date): Promise<void> {
  await query(`
    UPDATE payments
    SET status = $1, paid_at = $2, updated_at = NOW()
    WHERE id = $3
  `, [status, paidAt, paymentId]);
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  return await query<Payment>(`
    SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC
  `, [userId]);
}

// ============================================
// Webhook Event Logging
// ============================================

export async function logWebhookEvent(provider: string, eventType: string, payload: any): Promise<void> {
  await query(`
    INSERT INTO webhook_events (provider, event_type, payload)
    VALUES ($1, $2, $3::jsonb)
  `, [provider, eventType, JSON.stringify(payload)]);
}

export async function markWebhookProcessed(eventId: string, error?: string): Promise<void> {
  await query(`
    UPDATE webhook_events
    SET processed = TRUE, processed_at = NOW(), error = $1
    WHERE id = $2
  `, [error, eventId]);
}

// ============================================
// Analytics
// ============================================

export async function getRevenueByMonth(): Promise<{
  month: Date;
  paymentCount: number;
  totalRevenue: number;
  avgOrderValue: number;
}[]> {
  return await query<any>(`SELECT * FROM revenue_by_month ORDER BY month DESC LIMIT 12`);
}

export async function getActiveUserStats(): Promise<{
  totalUsers: number;
  active30d: number;
  active7d: number;
}> {
  const result = await query<any>(`SELECT * FROM active_users LIMIT 1`);
  return result[0] || { totalUsers: 0, active30d: 0, active7d: 0 };
}

export async function getContentAccessStats(): Promise<{ moduleId: string; accessCount: number }[]> {
  return await query<any>(`SELECT * FROM content_access_stats ORDER BY access_count DESC LIMIT 50`);
}

// ============================================
// Health Check
// ============================================

export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
