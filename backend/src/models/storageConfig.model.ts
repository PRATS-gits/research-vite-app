/**
 * Storage Configuration Model
 * File-based storage for configuration with lock mechanism
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { 
  StorageConfiguration, 
  StorageProviderType,
  EncryptedStorageCredentials,
  ConfigurationLock
} from '../types/storage.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const CONFIG_FILE = path.join(DATA_DIR, 'storage-config.json');
const LOCK_FILE = path.join(DATA_DIR, 'config-lock.json');

export class StorageConfigModel {
  /**
   * Initialize data directory and files
   */
  private static async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  /**
   * Save storage configuration
   */
  static async saveConfiguration(
    provider: StorageProviderType,
    encryptedCredentials: EncryptedStorageCredentials
  ): Promise<StorageConfiguration> {
    await this.ensureDataDirectory();

    const config: StorageConfiguration = {
      id: crypto.randomUUID(),
      provider,
      credentials: encryptedCredentials,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return config;
  }

  /**
   * Get current storage configuration
   */
  static async getConfiguration(): Promise<StorageConfiguration | null> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(CONFIG_FILE, 'utf-8');
      const config = JSON.parse(data) as StorageConfiguration;
      
      // Convert string dates back to Date objects
      config.createdAt = new Date(config.createdAt);
      config.updatedAt = new Date(config.updatedAt);
      if (config.lastTestedAt) {
        config.lastTestedAt = new Date(config.lastTestedAt);
      }
      
      return config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update configuration's last tested timestamp
   */
  static async updateLastTested(): Promise<void> {
    const config = await this.getConfiguration();
    if (config) {
      config.lastTestedAt = new Date();
      config.updatedAt = new Date();
      await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    }
  }

  /**
   * Delete configuration
   */
  static async deleteConfiguration(): Promise<void> {
    try {
      await fs.unlink(CONFIG_FILE);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Create configuration lock
   */
  static async createLock(configurationId: string, reason: string): Promise<ConfigurationLock> {
    await this.ensureDataDirectory();

    const lock: ConfigurationLock = {
      id: crypto.randomUUID(),
      configurationId,
      lockedAt: new Date(),
      lockedBy: 'system',
      reason,
      canOverride: false
    };

    await fs.writeFile(LOCK_FILE, JSON.stringify(lock, null, 2), 'utf-8');

    // Update configuration lock status
    const config = await this.getConfiguration();
    if (config) {
      config.isLocked = true;
      config.updatedAt = new Date();
      await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    }

    return lock;
  }

  /**
   * Get configuration lock
   */
  static async getLock(): Promise<ConfigurationLock | null> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(LOCK_FILE, 'utf-8');
      const lock = JSON.parse(data) as ConfigurationLock;
      lock.lockedAt = new Date(lock.lockedAt);
      return lock;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Check if configuration is locked
   */
  static async isLocked(): Promise<boolean> {
    const config = await this.getConfiguration();
    return config?.isLocked ?? false;
  }

  /**
   * Remove lock (admin override)
   */
  static async removeLock(): Promise<void> {
    try {
      await fs.unlink(LOCK_FILE);
      
      const config = await this.getConfiguration();
      if (config) {
        config.isLocked = false;
        config.updatedAt = new Date();
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
