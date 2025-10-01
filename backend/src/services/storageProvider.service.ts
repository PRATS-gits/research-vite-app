/**
 * Storage Provider Abstraction Layer
 * Factory pattern for S3-compatible storage providers
 */

import type { 
  StorageCredentials, 
  StorageProvider, 
  StorageTestResult,
  StorageProviderType 
} from '../types/storage.types.js';
import { S3Provider } from './s3Provider.service.js';
import { R2Provider } from './r2Provider.service.js';
import { MinIOProvider } from './minioProvider.service.js';

/**
 * Storage Provider Factory
 * Creates appropriate provider instance based on type
 */
export class StorageProviderFactory {
  static createProvider(
    providerType: StorageProviderType,
    credentials: StorageCredentials
  ): StorageProvider {
    switch (providerType) {
      case 'aws-s3':
        return new S3Provider(credentials);
      case 'cloudflare-r2':
        return new R2Provider(credentials);
      case 'minio':
        return new MinIOProvider(credentials);
      default:
        throw new Error(`Unsupported storage provider: ${providerType}`);
    }
  }

  /**
   * Test connection with any provider
   */
  static async testProvider(
    providerType: StorageProviderType,
    credentials: StorageCredentials
  ): Promise<StorageTestResult> {
    const provider = this.createProvider(providerType, credentials);
    return provider.testConnection();
  }

  /**
   * Validate provider credentials
   */
  static async validateProvider(
    providerType: StorageProviderType,
    credentials: StorageCredentials
  ): Promise<boolean> {
    const provider = this.createProvider(providerType, credentials);
    return provider.validateCredentials();
  }
}
