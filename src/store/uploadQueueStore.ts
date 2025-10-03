/**
 * Upload Queue Store
 * Zustand store for managing file upload queue and progress
 * Phase 5: Library Page S3 Integration
 */

import { create } from 'zustand';

export interface UploadItem {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  folderId?: string;
  status: 'pending' | 'uploading' | 'complete' | 'failed' | 'cancelled';
  progress: number; // 0-100
  uploadedBytes: number;
  error?: string;
  s3Key?: string;
  fileId?: string;
  startTime?: number;
  endTime?: number;
  uploadUrl?: string;
}

interface UploadQueueStore {
  uploads: Record<string, UploadItem>;
  activeUploads: number;
  maxConcurrent: number;
  
  // Actions
  addUpload: (file: File, folderId?: string) => string;
  removeUpload: (uploadId: string) => void;
  updateUpload: (uploadId: string, updates: Partial<UploadItem>) => void;
  setUploadProgress: (uploadId: string, progress: number, uploadedBytes: number) => void;
  setUploadStatus: (uploadId: string, status: UploadItem['status'], error?: string) => void;
  setUploadComplete: (uploadId: string, fileId: string, s3Key: string) => void;
  cancelUpload: (uploadId: string) => void;
  retryUpload: (uploadId: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  
  // Getters
  getUpload: (uploadId: string) => UploadItem | undefined;
  getPendingUploads: () => UploadItem[];
  getActiveUploads: () => UploadItem[];
  getCompletedUploads: () => UploadItem[];
  getFailedUploads: () => UploadItem[];
  getTotalProgress: () => number;
}

function generateUploadId(): string {
  return `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useUploadQueueStore = create<UploadQueueStore>((set, get) => ({
  uploads: {},
  activeUploads: 0,
  maxConcurrent: 5,
  
  // Add new upload to queue
  addUpload: (file: File, folderId?: string) => {
    const uploadId = generateUploadId();
    const uploadItem: UploadItem = {
      id: uploadId,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      folderId,
      status: 'pending',
      progress: 0,
      uploadedBytes: 0,
      startTime: Date.now(),
    };
    
    set((state) => ({
      uploads: {
        ...state.uploads,
        [uploadId]: uploadItem,
      },
    }));
    
    return uploadId;
  },
  
  // Remove upload from queue
  removeUpload: (uploadId: string) => {
    set((state) => {
      const uploadsCopy = { ...state.uploads };
      delete uploadsCopy[uploadId];
      return { uploads: uploadsCopy };
    });
  },
  
  // Update upload data
  updateUpload: (uploadId: string, updates: Partial<UploadItem>) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;
      
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: { ...upload, ...updates },
        },
      };
    });
  },
  
  // Update upload progress
  setUploadProgress: (uploadId: string, progress: number, uploadedBytes: number) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;

      const clampedProgress = Math.min(100, Math.max(0, progress));
      const hasJustStarted = upload.status === 'pending';

      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            progress: clampedProgress,
            uploadedBytes,
            status: hasJustStarted ? 'uploading' : upload.status,
          },
        },
        activeUploads: hasJustStarted
          ? state.activeUploads + 1
          : state.activeUploads,
      };
    });
  },
  
  // Update upload status
  setUploadStatus: (uploadId: string, status: UploadItem['status'], error?: string) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;
      
      const updates: Partial<UploadItem> = { status };
      if (error) updates.error = error;
      if (status === 'uploading' && !upload.startTime) {
        updates.startTime = Date.now();
      }
      if ((status === 'complete' || status === 'failed') && !upload.endTime) {
        updates.endTime = Date.now();
      }
      
      // Update active uploads count
      const wasActive = upload.status === 'uploading';
      const isActive = status === 'uploading';
      const activeChange = (isActive ? 1 : 0) - (wasActive ? 1 : 0);
      
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: { ...upload, ...updates },
        },
        activeUploads: Math.max(0, state.activeUploads + activeChange),
      };
    });
  },
  
  // Mark upload as complete
  setUploadComplete: (uploadId: string, fileId: string, s3Key: string) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;
      
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            status: 'complete',
            progress: 100,
            uploadedBytes: upload.fileSize,
            fileId,
            s3Key,
            endTime: Date.now(),
          },
        },
        activeUploads: Math.max(0, state.activeUploads - (upload.status === 'uploading' ? 1 : 0)),
      };
    });
  },
  
  // Cancel upload
  cancelUpload: (uploadId: string) => {
    get().setUploadStatus(uploadId, 'cancelled', 'Upload cancelled by user');
  },
  
  // Retry failed upload
  retryUpload: (uploadId: string) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload || upload.status !== 'failed') return state;
      
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            status: 'pending',
            progress: 0,
            uploadedBytes: 0,
            error: undefined,
            startTime: undefined,
            endTime: undefined,
          },
        },
      };
    });
  },
  
  // Clear completed uploads
  clearCompleted: () => {
    set((state) => {
      const uploads = Object.entries(state.uploads).reduce((acc, [id, upload]) => {
        if (upload.status !== 'complete') {
          acc[id] = upload;
        }
        return acc;
      }, {} as Record<string, UploadItem>);
      
      return { uploads };
    });
  },
  
  // Clear all uploads
  clearAll: () => {
    set({ uploads: {}, activeUploads: 0 });
  },
  
  // Get single upload
  getUpload: (uploadId: string) => {
    return get().uploads[uploadId];
  },
  
  // Get pending uploads
  getPendingUploads: () => {
    return Object.values(get().uploads).filter((u) => u.status === 'pending');
  },
  
  // Get active uploads
  getActiveUploads: () => {
    return Object.values(get().uploads).filter((u) => u.status === 'uploading');
  },
  
  // Get completed uploads
  getCompletedUploads: () => {
    return Object.values(get().uploads).filter((u) => u.status === 'complete');
  },
  
  // Get failed uploads
  getFailedUploads: () => {
    return Object.values(get().uploads).filter((u) => u.status === 'failed');
  },
  
  // Get total progress (average of all uploads)
  getTotalProgress: () => {
    const uploads = Object.values(get().uploads);
    if (uploads.length === 0) return 0;
    
    const totalProgress = uploads.reduce((sum, upload) => sum + upload.progress, 0);
    return Math.round(totalProgress / uploads.length);
  },
}));
