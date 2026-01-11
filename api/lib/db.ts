/**
 * Secure Database Client
 * 
 * Security:
 * - Connection pooling
 * - SSL/TLS encryption
 * - Parameterized queries only
 * - Automatic error handling
 */

import { Pool, PoolClient, QueryResult } from 'pg';

// Singleton pool instance
let pool: Pool | null = null;

/**
 * Get database connection pool
 * Security: SSL required, connection limits enforced
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable not set');
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: true
      },
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000 // 30 second query timeout
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }

  return pool;
}

/**
 * Execute a parameterized query
 * Security: NEVER concatenate user input into queries
 * 
 * @example
 * const result = await query(
 *   'SELECT * FROM users WHERE email = $1',
 *   ['user@example.com']
 * );
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  
  try {
    return await pool.query(text, params);
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
      // Don't log the actual query to avoid leaking sensitive data
    });
    throw new DatabaseError('Database query failed', error);
  }
}

/**
 * Execute query with a specific client (for transactions)
 */
export async function queryWithClient<T = any>(
  client: PoolClient,
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  try {
    return await client.query(text, params);
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
    });
    throw new DatabaseError('Database query failed', error);
  }
}

/**
 * Execute a transaction
 * Security: Automatic rollback on error
 * 
 * @example
 * await transaction(async (client) => {
 *   await queryWithClient(client, 'INSERT INTO users ...', []);
 *   await queryWithClient(client, 'INSERT INTO devices ...', []);
 * });
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close database pool (cleanup)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Database Error class
 */
export class DatabaseError extends Error {
  public originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

/**
 * Helper: Get single row or null
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

/**
 * Helper: Get all rows
 */
export async function queryMany<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

/**
 * Helper: Check if record exists
 */
export async function exists(
  text: string,
  params?: any[]
): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    `SELECT EXISTS(${text})`,
    params
  );
  return result.rows[0]?.exists || false;
}

/**
 * Helper: Insert and return inserted row
 */
export async function insertOne<T = any>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');

  const text = `
    INSERT INTO ${table} (${columns})
    VALUES (${placeholders})
    RETURNING *
  `;

  const result = await query<T>(text, values);
  return result.rows[0];
}

/**
 * Helper: Update and return updated row
 */
export async function updateOne<T = any>(
  table: string,
  id: string,
  data: Record<string, any>
): Promise<T | null> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');

  const text = `
    UPDATE ${table}
    SET ${setClause}, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query<T>(text, [id, ...values]);
  return result.rows[0] || null;
}

/**
 * Helper: Delete by ID
 */
export async function deleteById(
  table: string,
  id: string
): Promise<boolean> {
  const text = `DELETE FROM ${table} WHERE id = $1`;
  const result = await query(text, [id]);
  return (result.rowCount || 0) > 0;
}

/**
 * Helper: Clean expired sessions (maintenance task)
 */
export async function cleanExpiredSessions(): Promise<number> {
  const result = await query(
    'DELETE FROM sessions WHERE expires_at < NOW()'
  );
  return result.rowCount || 0;
}

/**
 * Helper: Clean expired magic link tokens
 */
export async function cleanExpiredMagicLinks(): Promise<number> {
  const result = await query(
    'UPDATE users SET magic_link_token = NULL, magic_link_expires = NULL WHERE magic_link_expires < NOW()'
  );
  return result.rowCount || 0;
}

/**
 * Security Event Logging
 */
export interface SecurityEvent {
  event_type: 'AUTH_FAILURE' | 'PAYMENT_MISMATCH' | 'RATE_LIMIT_HIT' | 'SUSPICIOUS_ACTIVITY' | 'WEBHOOK_FAILURE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    await query(
      `INSERT INTO security_events (event_type, severity, user_id, ip_address, user_agent, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        event.event_type,
        event.severity,
        event.user_id || null,
        event.ip_address || null,
        event.user_agent || null,
        event.metadata ? JSON.stringify(event.metadata) : null
      ]
    );

    // Alert on critical events (implement your alerting here)
    if (event.severity === 'CRITICAL') {
      console.error('CRITICAL SECURITY EVENT:', event);
      // TODO: Send alert (email, SMS, Slack, etc.)
    }
  } catch (error) {
    // Don't throw - logging should never break the main flow
    console.error('Failed to log security event:', error);
  }
}

/**
 * Create security_events table if it doesn't exist
 * Call this during initialization
 */
export async function ensureSecurityEventsTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS security_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type VARCHAR(100) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      user_id UUID,
      ip_address INET,
      user_agent TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_security_events_created
    ON security_events(created_at DESC)
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_security_events_severity
    ON security_events(severity)
    WHERE severity IN ('HIGH', 'CRITICAL')
  `);
}
