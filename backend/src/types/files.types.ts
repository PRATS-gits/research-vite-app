/**
 * File and Folder Type Definitions
 * Phase 2: S3 File Operations & Upload Coordination
 */

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string; // MIME type
  s3Key: string;
  folderId: string | null;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
  metadata?: Record<string, unknown>;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string; // Full path for breadcrumb
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
}

export interface UploadQueueItem {
  id: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'uploading' | 'complete' | 'failed' | 'cancelled';
  progress: number; // 0-100
  uploadedBytes: number;
  s3Key?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface FileUploadRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
  folderId?: string;
  chunkSize?: number;
}

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  folderId?: string;
  expiresIn?: number; // seconds, default 900 (15 min)
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileId: string;
  s3Key: string;
  expiresAt: Date;
  fields?: Record<string, string>; // For POST uploads
}

export interface PresignedDownloadRequest {
  fileId: string;
  expiresIn?: number; // seconds, default 900 (15 min)
}

export interface PresignedDownloadResponse {
  downloadUrl: string;
  fileName: string;
  expiresAt: Date;
}

export interface FileListQuery {
  folderId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'size' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface FileListResponse {
  files: FileMetadata[];
  folders: Folder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FolderCreateRequest {
  name: string;
  parentId?: string;
}

export interface FolderRenameRequest {
  name: string;
}

export interface FolderContentsResponse {
  folder: Folder;
  files: FileMetadata[];
  subfolders: Folder[];
  breadcrumb: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

export interface BulkDeleteRequest {
  fileIds: string[];
}

export interface BulkMoveRequest {
  fileIds: string[];
  targetFolderId: string | null;
}

export interface BulkDownloadRequest {
  fileIds: string[];
}

export interface BulkDownloadResponse {
  downloadUrls: Array<{
    fileId: string;
    fileName: string;
    downloadUrl: string;
  }>;
  expiresAt: Date;
}

export interface BulkOperationResponse {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: Array<{
    fileId: string;
    error: string;
  }>;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  uploadedBytes: number;
  totalBytes: number;
  progress: number;
  status: string;
}

// Extended storage provider interface for file operations
export interface FileOperations {
  uploadFile(key: string, body: Buffer | ReadableStream, contentType: string): Promise<void>;
  downloadFile(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
  generatePresignedUploadUrl(key: string, contentType: string, expiresIn: number): Promise<string>;
  generatePresignedDownloadUrl(key: string, fileName: string, expiresIn: number): Promise<string>;
  fileExists(key: string): Promise<boolean>;
  getFileSize(key: string): Promise<number>;
}
