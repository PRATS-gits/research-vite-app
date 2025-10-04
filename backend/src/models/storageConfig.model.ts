/**
 * Storage Configuration Model
 * Prisma-based storage for configuration with lock mechanism
 */

import { PrismaClient } from '@prisma/client';
import type { 
  StorageConfiguration, 
  StorageProviderType,
  EncryptedStorageCredentials,
  ConfigurationLock
} from '../types/storage.types.js';

const prisma = new PrismaClient();

export class StorageConfigModel {
  /**
   * Save storage configuration
   */
  static async saveConfiguration(
    provider: StorageProviderType,
    encryptedCredentials: EncryptedStorageCredentials
  ): Promise<StorageConfiguration> {
    // Check if config already exists
    const existing = await prisma.storageConfig.findFirst();
    
    let config;
    if (existing) {
      // Update existing configuration
      config = await prisma.storageConfig.update({
        where: { id: existing.id },
        data: {
          provider,
          encryptedData: encryptedCredentials.encryptedData,
          iv: encryptedCredentials.iv,
          authTag: encryptedCredentials.authTag,
          isLocked: false,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new configuration
      config = await prisma.storageConfig.create({
        data: {
          provider,
          encryptedData: encryptedCredentials.encryptedData,
          iv: encryptedCredentials.iv,
          authTag: encryptedCredentials.authTag,
          isLocked: false
        }
      });
    }

    // Transform to StorageConfiguration format
    return {
      id: config.id,
      provider: config.provider as StorageProviderType,
      credentials: {
        encryptedData: config.encryptedData,
        iv: config.iv,
        authTag: config.authTag
      },
      isLocked: config.isLocked,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    };
  }

  /**
   * Get current storage configuration
   */
  static async getConfiguration(): Promise<StorageConfiguration | null> {
    const config = await prisma.storageConfig.findFirst({
      include: { lock: true }
    });

    if (!config) {
      return null;
    }

    return {
      id: config.id,
      provider: config.provider as StorageProviderType,
      credentials: {
        encryptedData: config.encryptedData,
        iv: config.iv,
        authTag: config.authTag
      },
      isLocked: config.isLocked,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      lastTestedAt: config.updatedAt // Use updatedAt as lastTestedAt proxy
    };
  }

  /**
   * Update configuration's last tested timestamp
   */
  static async updateLastTested(): Promise<void> {
    const config = await prisma.storageConfig.findFirst();
    if (config) {
      await prisma.storageConfig.update({
        where: { id: config.id },
        data: { updatedAt: new Date() }
      });
    }
  }

  /**
   * Delete configuration
   */
  static async deleteConfiguration(): Promise<void> {
    const config = await prisma.storageConfig.findFirst();
    if (config) {
      await prisma.storageConfig.delete({
        where: { id: config.id }
      });
    }
  }

  /**
   * Create configuration lock
   */
  static async createLock(configurationId: string, reason: string): Promise<ConfigurationLock> {
    // Delete existing lock if any
    await prisma.configLock.deleteMany({
      where: { configurationId }
    });

    // Create new lock
    const lock = await prisma.configLock.create({
      data: {
        configurationId,
        lockedBy: 'system',
        reason,
        canOverride: false
      }
    });

    // Update configuration lock status
    await prisma.storageConfig.update({
      where: { id: configurationId },
      data: { isLocked: true }
    });

    return {
      id: lock.id,
      configurationId: lock.configurationId,
      lockedAt: lock.lockedAt,
      lockedBy: lock.lockedBy,
      reason: lock.reason,
      canOverride: lock.canOverride
    };
  }

  /**
   * Get configuration lock
   */
  static async getLock(): Promise<ConfigurationLock | null> {
    const lock = await prisma.configLock.findFirst();
    
    if (!lock) {
      return null;
    }

    return {
      id: lock.id,
      configurationId: lock.configurationId,
      lockedAt: lock.lockedAt,
      lockedBy: lock.lockedBy,
      reason: lock.reason,
      canOverride: lock.canOverride
    };
  }

  /**
   * Check if configuration is locked
   */
  static async isLocked(): Promise<boolean> {
    const config = await prisma.storageConfig.findFirst({
      select: { isLocked: true }
    });
    return config?.isLocked ?? false;
  }

  /**
   * Remove lock (admin override)
   */
  static async removeLock(): Promise<void> {
    const config = await prisma.storageConfig.findFirst();
    if (config) {
      // Delete the lock
      await prisma.configLock.deleteMany({
        where: { configurationId: config.id }
      });

      // Update configuration lock status
      await prisma.storageConfig.update({
        where: { id: config.id },
        data: { isLocked: false }
      });
    }
  }
}
