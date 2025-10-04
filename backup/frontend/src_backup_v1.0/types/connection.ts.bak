/**
 * Connection Type Definitions
 * TypeScript interfaces for S3 storage provider configuration and connection management
 */

export const StorageProvider = {
  AWS_S3: 'aws-s3',
  CLOUDFLARE_R2: 'cloudflare-r2',
  MINIO: 'minio',
} as const;

export type StorageProvider = typeof StorageProvider[keyof typeof StorageProvider];

export interface StorageCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string; // Required for R2 and MinIO
}

export interface ConnectionFormData {
  provider: StorageProvider;
  credentials: StorageCredentials;
}

export interface ConnectionStatus {
  configured: boolean;
  locked: boolean;
  provider?: StorageProvider;
  bucketName?: string;
  region?: string;
  lastTested?: Date;
  configuredAt?: Date;
}

export interface ConnectionTestResult {
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string | Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface LockWarningData {
  provider: StorageProvider;
  bucketName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface AdminUnlockData {
  provider?: StorageProvider;
  lockedAt?: Date;
  onUnlock: () => Promise<void>;
  onCancel: () => void;
}

// Provider configuration metadata
export interface ProviderConfig {
  name: string;
  label: string;
  description: string;
  requiresEndpoint: boolean;
  defaultRegion?: string;
  endpointPlaceholder?: string;
}

export const PROVIDER_CONFIGS: Record<StorageProvider, ProviderConfig> = {
  [StorageProvider.AWS_S3]: {
    name: 'aws-s3',
    label: 'AWS S3',
    description: 'Amazon Web Services S3 storage',
    requiresEndpoint: false,
    defaultRegion: 'us-east-1',
  },
  [StorageProvider.CLOUDFLARE_R2]: {
    name: 'cloudflare-r2',
    label: 'Cloudflare R2',
    description: 'Cloudflare R2 S3-compatible storage',
    requiresEndpoint: true,
    defaultRegion: 'auto',
    endpointPlaceholder: 'https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com',
  },
  [StorageProvider.MINIO]: {
    name: 'minio',
    label: 'MinIO',
    description: 'Self-hosted MinIO S3-compatible storage',
    requiresEndpoint: true,
    defaultRegion: 'us-east-1',
    endpointPlaceholder: 'http://localhost:9000',
  },
};

// Form validation utilities
export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export type ConnectionFormValidation = {
  [K in keyof StorageCredentials]?: FieldValidation;
} & {
  provider?: FieldValidation;
};
