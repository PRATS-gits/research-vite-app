/**
 * Encryption Service
 * Provides AES-256-GCM encryption for sensitive credential storage
 * Implements secure encryption/decryption with authentication tags
 */

import crypto from 'crypto';
import type { StorageCredentials, EncryptedStorageCredentials } from '../types/storage.types.js';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private encryptionKey: Buffer;

  constructor(encryptionKey?: string) {
    const key = encryptionKey || process.env.ENCRYPTION_KEY;
    
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }

    // Ensure key is exactly 32 bytes for AES-256
    if (key.length !== this.keyLength) {
      // Derive a proper 32-byte key from the provided key
      this.encryptionKey = crypto.scryptSync(key, 'salt', this.keyLength);
    } else {
      this.encryptionKey = Buffer.from(key, 'utf8');
    }
  }

  /**
   * Encrypt storage credentials
   * @param credentials - Plain storage credentials
   * @returns Encrypted credentials with IV and auth tag
   */
  encryptCredentials(credentials: StorageCredentials): EncryptedStorageCredentials {
    try {
      // Generate random initialization vector
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
      
      // Encrypt credentials
      const credentialsJson = JSON.stringify(credentials);
      let encrypted = cipher.update(credentialsJson, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt storage credentials
   * @param encryptedCredentials - Encrypted credentials with IV and auth tag
   * @returns Plain storage credentials
   */
  decryptCredentials(encryptedCredentials: EncryptedStorageCredentials): StorageCredentials {
    try {
      // Convert hex strings back to buffers
      const iv = Buffer.from(encryptedCredentials.iv, 'hex');
      const authTag = Buffer.from(encryptedCredentials.authTag, 'hex');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt data
      let decrypted = decipher.update(encryptedCredentials.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Parse and return credentials
      return JSON.parse(decrypted) as StorageCredentials;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a secure random encryption key
   * @returns 32-byte hex string suitable for AES-256
   */
  static generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash sensitive data (one-way) for comparison
   * @param data - Data to hash
   * @returns SHA-256 hash
   */
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

// Singleton instance
let encryptionServiceInstance: EncryptionService | null = null;

export function getEncryptionService(): EncryptionService {
  if (!encryptionServiceInstance) {
    encryptionServiceInstance = new EncryptionService();
  }
  return encryptionServiceInstance;
}
