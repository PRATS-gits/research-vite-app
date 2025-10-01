/**
 * Storage API Client
 * HTTP client for backend storage configuration endpoints
 */

import {
  StorageProvider,
  type ConnectionFormData,
  type ConnectionStatus,
  type ConnectionTestResult,
  type ApiResponse,
  type StorageCredentials,
} from '@/types/connection';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Fetch storage configuration status
 * GET /api/storage/status
 */
export async function getStorageStatus(): Promise<ConnectionStatus> {
  const response = await fetch(`${API_BASE_URL}/api/storage/status`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch storage status: ${response.statusText}`);
  }
  
  const result: ApiResponse<ConnectionStatus> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch storage status');
  }
  
  return result.data;
}

/**
 * Configure storage provider
 * POST /api/storage/configure
 */
export async function configureStorage(
  formData: ConnectionFormData
): Promise<ApiResponse<ConnectionStatus>> {
  const response = await fetch(`${API_BASE_URL}/api/storage/configure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: formData.provider,
      credentials: formData.credentials,
    }),
  });
  
  const result: ApiResponse<ConnectionStatus> = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || `Configuration failed: ${response.statusText}`);
  }
  
  return result;
}

/**
 * Test storage connection
 * POST /api/storage/test
 * 
 * Can test with provided credentials or saved configuration
 */
export async function testStorageConnection(
  formData?: ConnectionFormData
): Promise<ConnectionTestResult> {
  const body = formData
    ? {
        provider: formData.provider,
        credentials: formData.credentials,
      }
    : {};
  
  const response = await fetch(`${API_BASE_URL}/api/storage/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  const result: ApiResponse<ConnectionTestResult> = await response.json();
  
  if (!result.success || !result.data) {
    // Return error as test result
    return {
      success: false,
      message: result.error || result.message || 'Connection test failed',
      error: result.error,
      responseTime: 0,
    };
  }
  
  return result.data;
}

/**
 * Remove configuration lock (admin override)
 * DELETE /api/storage/lock
 */
export async function removeConfigurationLock(): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/api/storage/lock`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const result: ApiResponse<void> = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || `Failed to remove lock: ${response.statusText}`);
  }
  
  return result;
}

/**
 * Validate form data before submission
 */
export function validateConnectionForm(
  provider: StorageProvider,
  credentials: Partial<StorageCredentials>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Access Key ID validation
  if (!credentials.accessKeyId?.trim()) {
    errors.accessKeyId = 'Access Key ID is required';
  } else if (credentials.accessKeyId.length < 16) {
    errors.accessKeyId = 'Access Key ID appears invalid (too short)';
  }
  
  // Secret Access Key validation
  if (!credentials.secretAccessKey?.trim()) {
    errors.secretAccessKey = 'Secret Access Key is required';
  } else if (credentials.secretAccessKey.length < 32) {
    errors.secretAccessKey = 'Secret Access Key appears invalid (too short)';
  }
  
  // Region validation
  if (!credentials.region?.trim()) {
    errors.region = 'Region is required';
  }
  
  // Bucket validation
  if (!credentials.bucket?.trim()) {
    errors.bucket = 'Bucket name is required';
  } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(credentials.bucket)) {
    errors.bucket = 'Invalid bucket name format';
  }
  
  // Endpoint validation (required for R2 and MinIO)
  if (provider === StorageProvider.CLOUDFLARE_R2 || provider === StorageProvider.MINIO) {
    if (!credentials.endpoint?.trim()) {
      errors.endpoint = 'Endpoint is required for this provider';
    } else {
      try {
        new URL(credentials.endpoint);
      } catch {
        errors.endpoint = 'Invalid endpoint URL';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format test result for display
 */
export function formatTestResult(result: ConnectionTestResult): {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning';
} {
  if (result.success) {
    const details = result.details;
    const warnings: string[] = [];
    
    if (details) {
      if (!details.corsConfigured) {
        warnings.push('CORS not configured (may affect browser uploads)');
      }
      if (!details.multipartSupported) {
        warnings.push('Multipart uploads not supported (limits file size)');
      }
    }
    
    return {
      title: 'Connection Successful',
      message: warnings.length > 0
        ? `Connected successfully, but: ${warnings.join(', ')}`
        : result.message || 'All connection tests passed',
      type: warnings.length > 0 ? 'warning' : 'success',
    };
  }
  
  return {
    title: 'Connection Failed',
    message: result.error || result.message || 'Unable to connect to storage provider',
    type: 'error',
  };
}
