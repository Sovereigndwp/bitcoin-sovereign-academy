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
import * as db from './database';

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
  const existingUser = await db.findUserByEmail(email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Hash password
  const { hash, salt } = await hashPassword(request.password);

  // Generate verification token
  const verificationToken = generateToken();

  // Create user
  const userId = await db.createUser({
    email,
    passwordHash: hash,
    passwordSalt: salt,
    isEmailVerified: false,
    emailVerificationToken: verificationToken
  });

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
  const user = await db.findUserByVerificationToken(token);

  if (!user) {
    return { success: false, error: 'Invalid or expired verification token' };
  }

  // Mark email as verified
  await db.updateUser(user.id, {
    isEmailVerified: true,
    emailVerificationToken: null as any
  });

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
  const user = await db.findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Verify password
  const isValid = await verifyPassword(request.password, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Create session (stateless JWT)
  const sessionToken = generateJWTToken(user.id, user.email);

  // Update last login
  await db.updateUser(user.id, { lastLoginAt: new Date() });

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
  // Verify JWT
  const verification = verifyJWTToken(sessionToken);
  
  if (!verification.valid) {
    return { valid: false };
  }

  return {
    valid: true,
    userId: verification.userId,
    email: verification.email
  };
}

/**
 * Logout user (invalidate session)
 */
export async function logoutUser(sessionToken: string): Promise<{ success: boolean }> {
  // Stateless JWTs cannot be easily invalidated without a blacklist.
  // For now, we assume client-side removal is sufficient.
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
  const user = await db.findUserByEmail(email);
  if (!user) {
    // Don't reveal that user doesn't exist (security)
    return { success: true };
  }

  // Generate reset token
  const resetToken = generateToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Update user
  await db.updateUser(user.id, {
    passwordResetToken: resetToken,
    passwordResetExpires: resetExpires
  });

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
  const user = await db.findUserByResetToken(request.token);

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
  await db.updateUser(user.id, {
    passwordHash: hash,
    passwordSalt: salt,
    passwordResetToken: null as any,
    passwordResetExpires: null as any
  });

  return { success: true };
}

// ============================================
// User Management
// ============================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  return await db.findUserById(userId);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return await db.findUserByEmail(email);
}

/**
 * Update user email
 */
export async function updateUserEmail(
  userId: string,
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = newEmail.toLowerCase().trim();

  // Check if email already exists
  const existingUser = await db.findUserByEmail(normalizedEmail);
  if (existingUser && existingUser.id !== userId) {
    return { success: false, error: 'Email already in use' };
  }

  // Update email and mark as unverified
  await db.updateUser(userId, {
    email: normalizedEmail,
    isEmailVerified: false,
    emailVerificationToken: generateToken()
  });

  return { success: true };
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  await db.deleteUser(userId);
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
    // In-memory export no longer supported
    return [];
}

/**
 * Import users (for database migration)
 */
export function importUsers(userList: User[]): void {
  // In-memory import no longer supported
}
