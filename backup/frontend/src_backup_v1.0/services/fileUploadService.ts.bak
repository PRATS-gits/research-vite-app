/**
 * File Upload Service
 * Handles file uploads to S3 using presigned URLs with progress tracking
 * Phase 5: Library Page S3 Integration
 */

import { requestPresignedUploadUrl } from '@/api/filesApi';
import type { PresignedUrlResponse } from '@/api/filesApi';
import { useUploadQueueStore } from '@/store/uploadQueueStore';
import type { UploadItem } from '@/store/uploadQueueStore';

export interface UploadOptions {
  onProgress?: (progress: number, uploadedBytes: number) => void;
  onComplete?: (fileId: string, s3Key: string) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

const UPLOAD_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes – matches backend default

interface UploadTarget {
  url: string;
  fields?: Record<string, string>;
}

type UploadTransportOptions = Pick<UploadOptions, 'onProgress' | 'signal'> & {
  contentType?: string;
};

/**
 * Upload file to S3 using presigned URL
 * Returns fileId from backend
 */
export async function uploadFileToS3(
  uploadId: string,
  file: File,
  folderId?: string,
  options?: UploadOptions
): Promise<{ fileId: string; s3Key: string }> {
  const store = useUploadQueueStore.getState();
  
  try {
    // Step 1: Request presigned URL from backend
    store.setUploadStatus(uploadId, 'uploading');
    
    const presignedData = await requestPresignedUploadUrl(
      file.name,
      file.type,
      file.size,
      folderId
    );
    
    const uploadTarget = createUploadTarget(presignedData);

    store.updateUpload(uploadId, {
      uploadUrl: uploadTarget.url,
      fileId: presignedData.fileId,
      s3Key: presignedData.s3Key,
      error: undefined,
    });
    
    // Step 2: Upload file directly to S3
    await uploadToPresignedUrl(
      uploadTarget,
      file,
      {
        contentType: file.type || 'application/octet-stream',
        onProgress: (progress, uploadedBytes) => {
          store.setUploadProgress(uploadId, progress, uploadedBytes);
          options?.onProgress?.(progress, uploadedBytes);
        },
        signal: options?.signal,
      }
    );
    
    // Step 3: Mark as complete
    store.setUploadComplete(uploadId, presignedData.fileId, presignedData.s3Key);
    options?.onComplete?.(presignedData.fileId, presignedData.s3Key);
    
    return {
      fileId: presignedData.fileId,
      s3Key: presignedData.s3Key,
    };
    
  } catch (error) {
    const normalizedError = normalizeUploadError(error, file.name);
    store.setUploadStatus(uploadId, 'failed', normalizedError.message);
    options?.onError?.(normalizedError);
    throw normalizedError;
  }
}

/**
 * Upload file to presigned URL with progress tracking
 */
async function uploadToPresignedUrl(
  target: UploadTarget,
  file: File,
  options?: UploadTransportOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'text';
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    let settled = false;
    const cleanupCallbacks: Array<() => void> = [];

    const resolveOnce = () => {
      if (settled) return;
      settled = true;
      cleanupCallbacks.forEach((cb) => cb());
      resolve();
    };

    const rejectOnce = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanupCallbacks.forEach((cb) => cb());
      reject(error);
    };

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        options?.onProgress?.(progress, event.loaded);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolveOnce();
      } else {
        rejectOnce(createUploadTransportError(xhr));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      rejectOnce(new Error('Network error during upload'));
    });

    xhr.addEventListener('timeout', () => {
      rejectOnce(new Error('Upload timed out'));
    });

    xhr.addEventListener('abort', () => {
      rejectOnce(new DOMException('Upload aborted', 'AbortError'));
    });

    // Handle abort signal
    if (options?.signal) {
      if (options.signal.aborted) {
        rejectOnce(new DOMException('Upload aborted', 'AbortError'));
        return;
      }

      const abortHandler = () => {
        xhr.abort();
      };

  options.signal.addEventListener('abort', abortHandler, { once: true });
  cleanupCallbacks.push(() => options?.signal?.removeEventListener('abort', abortHandler));
    }

    // Send the file (PUT for direct upload, POST when fields provided)
    const hasFormFields = Boolean(target.fields && Object.keys(target.fields).length > 0);
    xhr.open(hasFormFields ? 'POST' : 'PUT', target.url);

    if (hasFormFields) {
      const formData = new FormData();
      Object.entries(target.fields ?? {}).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);
      xhr.send(formData);
    } else {
      const contentType = options?.contentType && options.contentType.trim().length > 0
        ? options.contentType
        : 'application/octet-stream';
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(file);
    }
  });
}

/**
 * Process upload queue (start pending uploads up to maxConcurrent limit)
 */
export function processUploadQueue(): void {
  const store = useUploadQueueStore.getState();
  const { activeUploads, maxConcurrent } = store;
  
  // Check if we can start more uploads
  if (activeUploads >= maxConcurrent) {
    return;
  }
  
  // Get pending uploads
  const pendingUploads = store.getPendingUploads();
  if (pendingUploads.length === 0) {
    return;
  }
  
  // Start uploads up to the limit
  const slotsAvailable = maxConcurrent - activeUploads;
  const uploadsToStart = pendingUploads.slice(0, slotsAvailable);
  
  uploadsToStart.forEach((upload) => {
    uploadFileToS3(upload.id, upload.file, upload.folderId, {
      onComplete: () => {
        // Process next in queue after completion
        setTimeout(() => processUploadQueue(), 100);
      },
      onError: () => {
        // Process next in queue even after error
        setTimeout(() => processUploadQueue(), 100);
      },
    }).catch((error) => {
      console.error('Upload error:', error);
    });
  });
}

/**
 * Add files to upload queue and start processing
 */
export function queueFiles(files: File[], folderId?: string): string[] {
  const store = useUploadQueueStore.getState();
  
  const uploadIds = files.map((file) => {
    return store.addUpload(file, folderId);
  });
  
  // Start processing the queue
  processUploadQueue();
  
  return uploadIds;
}

function createUploadTarget(presignedData: PresignedUrlResponse): UploadTarget {
  if (!presignedData.uploadUrl) {
    throw new Error('Presigned upload response is missing the uploadUrl');
  }

  let normalizedUrl: URL;

  try {
    // Validate URL format – throws if invalid
    normalizedUrl = new URL(presignedData.uploadUrl);
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : 'Invalid URL';
    throw new Error(`Presigned upload response returned an invalid uploadUrl: ${reason}`);
  }

  return {
    url: normalizedUrl.toString(),
    fields: presignedData.fields,
  };
}

function normalizeUploadError(error: unknown, fileName: string): Error {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new Error(`Upload aborted for "${fileName}"`);
  }

  if (error instanceof Error) {
    if (!error.message.includes(fileName)) {
      error.message = `Upload failed for "${fileName}": ${error.message}`;
    }
    return error;
  }

  return new Error(`Upload failed for "${fileName}"`);
}

function createUploadTransportError(xhr: XMLHttpRequest): Error {
  const status = xhr.status || 0;
  const statusText = xhr.statusText || 'Unknown error';
  const baseMessage = `Upload failed with status ${status} ${statusText}`.trim();

  const responseText = typeof xhr.responseText === 'string' ? xhr.responseText.trim() : '';
  const requestId = xhr.getResponseHeader('x-amz-request-id');
  const extendedDetails = [
    responseText ? responseText.substring(0, 500) : '',
    requestId ? `RequestId: ${requestId}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  const message = extendedDetails ? `${baseMessage} – ${extendedDetails}` : baseMessage;
  const error = new Error(message);
  error.name = 'UploadTransportError';
  return error;
}

/**
 * Cancel upload
 */
export function cancelUpload(uploadId: string): void {
  const store = useUploadQueueStore.getState();
  store.cancelUpload(uploadId);
}

/**
 * Retry failed upload
 */
export function retryUpload(uploadId: string): void {
  const store = useUploadQueueStore.getState();
  store.retryUpload(uploadId);
  
  // Restart queue processing
  setTimeout(() => processUploadQueue(), 100);
}

export interface UploadResult {
  uploadId: string;
  status: UploadItem['status'];
  fileId?: string;
  s3Key?: string;
  error?: string;
}

export async function waitForUploads(uploadIds: string[]): Promise<UploadResult[]> {
  return Promise.all(uploadIds.map((uploadId) => waitForSingleUpload(uploadId)));
}

function waitForSingleUpload(uploadId: string): Promise<UploadResult> {
  const initial = useUploadQueueStore.getState().uploads[uploadId];
  if (!initial) {
    return Promise.resolve({ uploadId, status: 'cancelled', error: 'Upload removed' });
  }

  if (isTerminalStatus(initial.status)) {
    return Promise.resolve(convertToUploadResult(uploadId, initial));
  }

  return new Promise((resolve) => {
    const unsubscribe = useUploadQueueStore.subscribe((state) => {
      const upload = state.uploads[uploadId];

      if (!upload) {
        unsubscribe();
        resolve({ uploadId, status: 'cancelled', error: 'Upload removed' });
        return;
      }

      if (isTerminalStatus(upload.status)) {
        unsubscribe();
        resolve(convertToUploadResult(uploadId, upload));
      }
    });
  });
}

function isTerminalStatus(status: UploadItem['status']): boolean {
  return status === 'complete' || status === 'failed' || status === 'cancelled';
}

function convertToUploadResult(uploadId: string, upload: UploadItem): UploadResult {
  return {
    uploadId,
    status: upload.status,
    fileId: upload.fileId,
    s3Key: upload.s3Key,
    error: upload.error,
  };
}

/**
 * Get upload statistics
 */
export function getUploadStats(): {
  total: number;
  pending: number;
  uploading: number;
  complete: number;
  failed: number;
  totalProgress: number;
} {
  const store = useUploadQueueStore.getState();
  
  return {
    total: Object.keys(store.uploads).length,
    pending: store.getPendingUploads().length,
    uploading: store.getActiveUploads().length,
    complete: store.getCompletedUploads().length,
    failed: store.getFailedUploads().length,
    totalProgress: store.getTotalProgress(),
  };
}
