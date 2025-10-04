import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logger } from './logger.js';

export interface KVStoreOptions {
  filename?: string;
  autoSave?: boolean;
  saveInterval?: number;
}

export class KVStore {
  private data: Map<string, any> = new Map();
  private filename: string;
  private autoSave: boolean;
  private saveInterval: number;
  private saveTimer?: NodeJS.Timeout;

  constructor(options: KVStoreOptions = {}) {
    this.filename = options.filename || 'kv-store.json';
    this.autoSave = options.autoSave ?? true;
    this.saveInterval = options.saveInterval || 30000; // 30 seconds

    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    this.filename = join(dataDir, this.filename);
    
    // Load existing data
    this.load();

    // Start auto-save if enabled
    if (this.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * Set a key-value pair
   */
  set(key: string, value: any, ttl?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl ? Date.now() + ttl * 1000 : undefined,
    };

    this.data.set(key, item);
    
    if (!this.autoSave) {
      this.save();
    }
  }

  /**
   * Get a value by key
   */
  get<T = any>(key: string): T | null {
    const item = this.data.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (item.ttl && Date.now() > item.ttl) {
      this.data.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.data.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (item.ttl && Date.now() > item.ttl) {
      this.data.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key
   */
  delete(key: string): boolean {
    return this.data.delete(key);
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.data.clear();
    this.save();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.data.keys());
  }

  /**
   * Get all values
   */
  values(): any[] {
    return Array.from(this.data.values()).map(item => item.value);
  }

  /**
   * Get all entries
   */
  entries(): [string, any][] {
    return Array.from(this.data.entries()).map(([key, item]) => [key, item.value]);
  }

  /**
   * Get the size of the store
   */
  size(): number {
    return this.data.size;
  }

  /**
   * Save data to file
   */
  save(): void {
    try {
      const dataToSave = Object.fromEntries(this.data);
      writeFileSync(this.filename, JSON.stringify(dataToSave, null, 2));
      logger.debug(`KVStore saved to ${this.filename}`);
    } catch (error) {
      logger.error('Failed to save KVStore:', error);
    }
  }

  /**
   * Load data from file
   */
  load(): void {
    try {
      if (existsSync(this.filename)) {
        const data = JSON.parse(readFileSync(this.filename, 'utf8'));
        this.data = new Map(Object.entries(data));
        logger.debug(`KVStore loaded from ${this.filename}`);
      }
    } catch (error) {
      logger.error('Failed to load KVStore:', error);
    }
  }

  /**
   * Start auto-save timer
   */
  private startAutoSave(): void {
    this.saveTimer = setInterval(() => {
      this.save();
    }, this.saveInterval);
  }

  /**
   * Stop auto-save timer
   */
  stopAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = undefined;
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.data.entries()) {
      if (item.ttl && now > item.ttl) {
        this.data.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned up ${cleaned} expired entries from KVStore`);
      this.save();
    }
  }

  /**
   * Destroy the store and clean up
   */
  destroy(): void {
    this.stopAutoSave();
    this.save();
    this.data.clear();
  }
}

// Create default KV store instance
export const kvStore = new KVStore();

// Create specialized stores for different purposes
export const cacheStore = new KVStore({ filename: 'cache.json' });
export const sessionStore = new KVStore({ filename: 'sessions.json' });
export const configStore = new KVStore({ filename: 'config.json' });
