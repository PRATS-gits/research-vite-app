/**
 * Connection Store
 * Zustand store for storage provider connection state management
 */

import { create } from 'zustand';
import {
  StorageProvider,
  type StorageCredentials,
  type ConnectionStatus,
  type ConnectionTestResult,
  type LockWarningData,
  type AdminUnlockData,
} from '@/types/connection';
import {
  getStorageStatus,
  configureStorage,
  testStorageConnection,
  removeConfigurationLock,
} from '@/api/storageApi';

interface ConnectionStore {
  // Connection status
  status: ConnectionStatus | null;
  isLoadingStatus: boolean;
  statusError: string | null;
  
  // Form state
  selectedProvider: StorageProvider;
  credentials: Partial<StorageCredentials>;
  formErrors: Record<string, string>;
  
  // Test result
  testResult: ConnectionTestResult | null;
  isTestingConnection: boolean;
  
  // Configuration submission
  isConfiguring: boolean;
  configurationError: string | null;
  
  // Lock warning modal
  lockWarningData: LockWarningData | null;
  isLockWarningOpen: boolean;
  
  // Admin unlock modal
  adminUnlockData: AdminUnlockData | null;
  isAdminUnlockOpen: boolean;
  
  // Actions
  fetchStatus: () => Promise<void>;
  setSelectedProvider: (provider: StorageProvider) => void;
  setCredentials: (credentials: Partial<StorageCredentials>) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  testConnection: () => Promise<void>;
  submitConfiguration: () => Promise<void>;
  openLockWarning: (data: LockWarningData) => void;
  closeLockWarning: () => void;
  openAdminUnlock: () => void;
  closeAdminUnlock: () => void;
  performUnlock: () => Promise<void>;
  resetForm: () => void;
}

const initialCredentials: Partial<StorageCredentials> = {
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1',
  bucket: '',
  endpoint: '',
};

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  // Initial state
  status: null,
  isLoadingStatus: false,
  statusError: null,
  
  selectedProvider: StorageProvider.AWS_S3,
  credentials: { ...initialCredentials },
  formErrors: {},
  
  testResult: null,
  isTestingConnection: false,
  
  isConfiguring: false,
  configurationError: null,
  
  lockWarningData: null,
  isLockWarningOpen: false,
  
  adminUnlockData: null,
  isAdminUnlockOpen: false,
  
  // Fetch current configuration status
  fetchStatus: async () => {
    set({ isLoadingStatus: true, statusError: null });
    
    try {
      const status = await getStorageStatus();
      set({ status, isLoadingStatus: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch status';
      set({ statusError: errorMessage, isLoadingStatus: false });
    }
  },
  
  // Set selected provider
  setSelectedProvider: (provider: StorageProvider) => {
    const state = get();
    const newCredentials = { ...state.credentials };
    
    // Update region default based on provider
    if (provider === StorageProvider.CLOUDFLARE_R2) {
      newCredentials.region = 'auto';
    } else if (provider === StorageProvider.AWS_S3 || provider === StorageProvider.MINIO) {
      newCredentials.region = 'us-east-1';
    }
    
    set({
      selectedProvider: provider,
      credentials: newCredentials,
      formErrors: {},
      testResult: null,
    });
  },
  
  // Update credentials
  setCredentials: (credentials: Partial<StorageCredentials>) => {
    set((state) => ({
      credentials: { ...state.credentials, ...credentials },
    }));
  },
  
  // Set form validation errors
  setFormErrors: (errors: Record<string, string>) => {
    set({ formErrors: errors });
  },
  
  // Test connection with current form data
  testConnection: async () => {
    const state = get();
    set({ isTestingConnection: true, testResult: null });
    
    try {
      const result = await testStorageConnection({
        provider: state.selectedProvider,
        credentials: state.credentials as StorageCredentials,
      });
      
      set({ testResult: result, isTestingConnection: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      set({
        testResult: {
          success: false,
          message: errorMessage,
          error: errorMessage,
          responseTime: 0,
        },
        isTestingConnection: false,
      });
    }
  },
  
  // Submit configuration
  submitConfiguration: async () => {
    const state = get();
    
    // Check if already configured and locked
    if (state.status?.configured && !state.status?.locked) {
      // Show lock warning before first configuration
      get().openLockWarning({
        provider: state.selectedProvider,
        bucketName: state.credentials.bucket || '',
        onConfirm: async () => {
          get().closeLockWarning();
          await get().performConfiguration();
        },
        onCancel: () => {
          get().closeLockWarning();
        },
      });
      return;
    }
    
    // If not configured or already locked, proceed directly
    await get().performConfiguration();
  },
  
  // Internal: Perform configuration
  performConfiguration: async () => {
    const state = get();
    set({ isConfiguring: true, configurationError: null });
    
    try {
      const result = await configureStorage({
        provider: state.selectedProvider,
        credentials: state.credentials as StorageCredentials,
      });
      
      if (result.success && result.data) {
        set({
          status: result.data,
          isConfiguring: false,
          testResult: null,
        });
      } else {
        throw new Error(result.error || 'Configuration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Configuration failed';
      set({
        configurationError: errorMessage,
        isConfiguring: false,
      });
      throw error;
    }
  },
  
  // Open lock warning modal
  openLockWarning: (data: LockWarningData) => {
    set({
      lockWarningData: data,
      isLockWarningOpen: true,
    });
  },
  
  // Close lock warning modal
  closeLockWarning: () => {
    set({
      lockWarningData: null,
      isLockWarningOpen: false,
    });
  },
  
  // Open admin unlock modal
  openAdminUnlock: () => {
    const state = get();
    set({
      adminUnlockData: {
        provider: state.status?.provider,
        lockedAt: state.status?.configuredAt,
        onUnlock: async () => {
          await get().performUnlock();
        },
        onCancel: () => {
          get().closeAdminUnlock();
        },
      },
      isAdminUnlockOpen: true,
    });
  },
  
  // Close admin unlock modal
  closeAdminUnlock: () => {
    set({
      adminUnlockData: null,
      isAdminUnlockOpen: false,
    });
  },
  
  // Perform unlock
  performUnlock: async () => {
    try {
      await removeConfigurationLock();
      
      // Refresh status
      await get().fetchStatus();
      
      get().closeAdminUnlock();
    } catch (error) {
      throw error;
    }
  },
  
  // Reset form to initial state
  resetForm: () => {
    set({
      credentials: { ...initialCredentials },
      formErrors: {},
      testResult: null,
      configurationError: null,
    });
  },
}));
