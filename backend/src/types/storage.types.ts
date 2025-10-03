/**
 * Storage Type Definitions
 * Comprehensive TypeScript interfaces for S3-compatible storage providers
 */

export enum StorageProviderType {
  AWS_S3 = 'aws-s3',
  CLOUDFLARE_R2 = 'cloudflare-r2',
  MINIO = 'minio'
}

export interface StorageCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string; // Required for R2 and MinIO
}

export interface EncryptedStorageCredentials {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export interface StorageConfiguration {
  id: string;
  provider: StorageProviderType;
  credentials: EncryptedStorageCredentials;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTestedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface StorageConfigurationRequest {
  provider: StorageProviderType;
  credentials: StorageCredentials;
}

export interface StorageTestRequest {
  provider?: StorageProviderType;
  credentials?: StorageCredentials;
}

export interface StorageTestResult {
  success: boolean;
  message: string;
  details?: {
    bucketExists: boolean;
    readPermission: boolean;
    writePermission: boolean;
    corsConfigured: boolean;
    multipartSupported: boolean;
  };
  error?: string;
  responseTime: number;
}

export interface StorageStatusResponse {
  configured: boolean;
  locked: boolean;
  provider?: StorageProviderType;
  bucketName?: string;
  region?: string;
  lastTested?: Date;
  configuredAt?: Date;
}

export interface StorageProvider {
  testConnection(): Promise<StorageTestResult>;
  validateCredentials(): Promise<boolean>;
  getBucketInfo(): Promise<{ name: string; region: string }>;
  generatePresignedUploadUrl(key: string, contentType: string, expiresIn: number): Promise<string>;
  generatePresignedDownloadUrl(key: string, fileName: string, expiresIn: number): Promise<string>;
  generatePresignedPreviewUrl(key: string, fileName: string, expiresIn: number): Promise<string>;
}

export interface ConfigurationLock {
  id: string;
  configurationId: string;
  lockedAt: Date;
  lockedBy: string;
  reason: string;
  canOverride: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
