/**
 * User Authentication & Account Management
 *
 * Handles:
 * - User registration
 * - Login/logout
 * - Password hashing and verification
 * - Session management
 * - Password reset
 * - Email verification
 */

import { createHash, randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';

const pbkdf2Async = promisify(pbkdf2);

// ============================================
// Types
// ============================================

export interface User {
  id: string;                    // UUID
  email: string;
  passwordHash: string;
  passwordSalt: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserSession {
  userId: string;
  email: string;
  sessionToken: string;
  expiresAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// ============================================
// In-Memory Storage (Replace with database)
// ============================================

// TODO: Replace with actual database queries
const users: Map<string, User> = new Map();
const sessions: Map<string, UserSession> = new Map();

// ============================================
// Password Hashing
// ============================================

/**
 * Hash password using PBKDF2
 */
async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const passwordSalt = salt || randomBytes(32).toString('hex');
  const hash = await pbkdf2Async(
    password,
    passwordSalt,
    100000, // iterations
    64,     // key length
    'sha512'
  );

  return {
    hash: hash.toString('hex'),
    salt: passwordSalt
  };
}

/**
 * Verify password against hash
 */
async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const { hash: computedHash } = await hashPassword(password, salt);
  return computedHash === hash;
}

// ============================================
// User ID Generation
// ============================================

/**
 * Generate user ID from email (deterministic)
 */
function generateUserId(email: string): string {
  return createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex')
    .substring(0, 16);
}

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return randomBytes(16).toString('hex')
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

/**
 * Generate random token
 */
function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

// ============================================
// User Registration
// ============================================

/**
 * Register new user
 */
export async function registerUser(request: RegisterRequest): Promise<{
  success: boolean;
  userId?: string;
  verificationToken?: string;
  error?: string;
}> {
  const email = request.email.toLowerCase().trim();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Invalid email address' };
  }

  // Validate password
  if (!request.password || request.password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  // Check if user already exists
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Hash password
  const { hash, salt } = await hashPassword(request.password);

  // Generate verification token
  const verificationToken = generateToken();

  // Create user
  const userId = generateUUID();
  const user: User = {
    id: userId,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    createdAt: new Date()
  };

  // Store user (TODO: Save to database)
  users.set(userId, user);

  return {
    success: true,
    userId,
    verificationToken
  };
}

// ============================================
// Email Verification
// ============================================

/**
 * Verify user email with token
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
  // Find user by verification token
  const user = Array.from(users.values()).find(u => u.emailVerificationToken === token);

  if (!user) {
    return { success: false, error: 'Invalid or expired verification token' };
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;

  // Update user (TODO: Save to database)
  users.set(user.id, user);

  return { success: true };
}

// ============================================
// User Login
// ============================================

/**
 * Login user and create session
 */
export async function loginUser(request: LoginRequest): Promise<{
  success: boolean;
  sessionToken?: string;
  userId?: string;
  error?: string;
}> {
  const email = request.email.toLowerCase().trim();

  // Find user
  const user = Array.from(users.values()).find(u => u.email === email);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Verify password
  const isValid = await verifyPassword(request.password, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Check email verification (optional - can be enabled later)
  // if (!user.isEmailVerified) {
  //   return { success: false, error: 'Please verify your email first' };
  // }

  // Create session
  const sessionToken = generateToken();
  const session: UserSession = {
    userId: user.id,
    email: user.email,
    sessionToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };

  // Store session (TODO: Save to database)
  sessions.set(sessionToken, session);

  // Update last login
  user.lastLoginAt = new Date();
  users.set(user.id, user);

  return {
    success: true,
    sessionToken,
    userId: user.id
  };
}

// ============================================
// Session Management
// ============================================

/**
 * Validate session token
 */
export async function validateSession(sessionToken: string): Promise<{
  valid: boolean;
  userId?: string;
  email?: string;
}> {
  const session = sessions.get(sessionToken);

  if (!session) {
    return { valid: false };
  }

  // Check expiration
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionToken);
    return { valid: false };
  }

  return {
    valid: true,
    userId: session.userId,
    email: session.email
  };
}

/**
 * Logout user (invalidate session)
 */
export async function logoutUser(sessionToken: string): Promise<{ success: boolean }> {
  sessions.delete(sessionToken);
  return { success: true };
}

// ============================================
// Password Reset
// ============================================

/**
 * Initiate password reset (generate token)
 */
export async function initiatePasswordReset(request: PasswordResetRequest): Promise<{
  success: boolean;
  resetToken?: string;
  error?: string;
}> {
  const email = request.email.toLowerCase().trim();

  // Find user
  const user = Array.from(users.values()).find(u => u.email === email);
  if (!user) {
    // Don't reveal that user doesn't exist (security)
    return { success: true };
  }

  // Generate reset token
  const resetToken = generateToken();
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Update user (TODO: Save to database)
  users.set(user.id, user);

  return {
    success: true,
    resetToken
  };
}

/**
 * Confirm password reset with token
 */
export async function confirmPasswordReset(request: PasswordResetConfirm): Promise<{
  success: boolean;
  error?: string;
}> {
  // Find user by reset token
  const user = Array.from(users.values()).find(u => u.passwordResetToken === request.token);

  if (!user) {
    return { success: false, error: 'Invalid or expired reset token' };
  }

  // Check expiration
  if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    return { success: false, error: 'Reset token has expired' };
  }

  // Validate new password
  if (!request.newPassword || request.newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  // Hash new password
  const { hash, salt } = await hashPassword(request.newPassword);

  // Update user
  user.passwordHash = hash;
  user.passwordSalt = salt;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Update user (TODO: Save to database)
  users.set(user.id, user);

  return { success: true };
}

// ============================================
// User Management
// ============================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  return users.get(userId) || null;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase().trim();
  return Array.from(users.values()).find(u => u.email === normalizedEmail) || null;
}

/**
 * Update user email
 */
export async function updateUserEmail(
  userId: string,
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  const user = users.get(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const normalizedEmail = newEmail.toLowerCase().trim();

  // Check if email already exists
  const existingUser = Array.from(users.values()).find(u => u.email === normalizedEmail);
  if (existingUser && existingUser.id !== userId) {
    return { success: false, error: 'Email already in use' };
  }

  // Update email and mark as unverified
  user.email = normalizedEmail;
  user.isEmailVerified = false;
  user.emailVerificationToken = generateToken();

  users.set(userId, user);

  return { success: true };
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  users.delete(userId);

  // Remove all sessions for this user
  const sessionEntries = Array.from(sessions.entries());
  for (const [token, session] of sessionEntries) {
    if (session.userId === userId) {
      sessions.delete(token);
    }
  }

  return { success: true };
}

// ============================================
// JWT Token Generation (for API access)
// ============================================

/**
 * Generate JWT access token for API authentication
 */
export function generateJWTToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable not configured. Cannot generate tokens.');
  }

  if (secret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters long for security.');
  }

  return jwt.sign(
    {
      userId,
      email,
      type: 'access',
      iat: Math.floor(Date.now() / 1000)
    },
    secret,
    {
      expiresIn: '30d',
      algorithm: 'HS256'
    }
  );
}

/**
 * Verify JWT access token
 */
export function verifyJWTToken(token: string): {
  valid: boolean;
  userId?: string;
  email?: string;
} {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('FATAL: JWT_SECRET environment variable not configured. Cannot verify tokens.');
    }

    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as any;

    return {
      valid: true,
      userId: decoded.userId,
      email: decoded.email
    };
  } catch (error) {
    return { valid: false };
  }
}

// ============================================
// Export/Import for Migration
// ============================================

/**
 * Export all users (for database migration)
 */
export function exportUsers(): User[] {
  return Array.from(users.values());
}

/**
 * Import users (for database migration)
 */
export function importUsers(userList: User[]): void {
  userList.forEach(user => {
    users.set(user.id, user);
  });
}
