/**
 * Files API Client
 * Client for all file and folder operations with backend
 * Phase 5: Library Page S3 Integration
 */

const API_BASE_URL = 'http://localhost:3001';

// ==================== TYPES ====================

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string; // MIME type
  s3Key: string;
  folderId: string | null;
  uploadedBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
  metadata?: Record<string, unknown>;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileId: string;
  s3Key: string;
  expiresAt: string | Date;
  fields?: Record<string, string>;
}

export interface PresignedDownloadResponse {
  downloadUrl: string;
  fileName: string;
  expiresAt: string | Date;
}

export interface FileListResponse {
  files: FileMetadata[];
  folders: Folder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export interface BulkOperationResponse {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: Array<{
    fileId: string;
    error: string;
  }>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string | Date;
}

// ==================== FILES API ====================

/**
 * Request presigned URL for file upload
 * POST /api/files/presigned-url
 */
export async function requestPresignedUploadUrl(
  fileName: string,
  fileType: string,
  fileSize: number,
  folderId?: string
): Promise<PresignedUrlResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/files/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileType, fileSize, folderId }),
    });

    let result: ApiResponse<PresignedUrlResponse> | undefined;

    try {
      result = await response.json();
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : 'Unknown error';
      throw new Error(`Invalid response from server while requesting presigned URL: ${reason}`);
    }

    if (!response.ok || !result?.success || !result.data) {
      const serverMessage = result?.error || result?.message;
      throw new Error(serverMessage || `Failed to get presigned URL (status ${response.status})`);
    }

    if (!isValidPresignedUploadResponse(result.data)) {
      throw new Error('Received malformed presigned upload payload from server');
    }

    return result.data;
  } catch (cause) {
    if (cause instanceof Error) {
      cause.message = `Presigned upload request failed: ${cause.message}`;
      throw cause;
    }
    throw new Error('Presigned upload request failed: Unknown error');
  }
}

/**
 * Request presigned URL for file download
 * POST /api/files/:id/download-url
 */
export async function requestPresignedDownloadUrl(
  fileId: string
): Promise<PresignedDownloadResponse> {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/download-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const result: ApiResponse<PresignedDownloadResponse> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to get download URL');
  }
  
  return result.data;
}

function isValidPresignedUploadResponse(data: unknown): data is PresignedUrlResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const candidate = data as Partial<PresignedUrlResponse>;

  const hasRequiredStrings =
    typeof candidate.uploadUrl === 'string' &&
    typeof candidate.fileId === 'string' &&
    typeof candidate.s3Key === 'string';

  if (!hasRequiredStrings) {
    return false;
  }

  return typeof candidate.expiresAt === 'string' || candidate.expiresAt instanceof Date;
}

/**
 * List files with pagination and filtering
 * GET /api/files/list
 */
export async function listFiles(params?: {
  folderId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'size' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}): Promise<FileListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.folderId) queryParams.set('folderId', params.folderId);
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);
  if (params?.search) queryParams.set('search', params.search);
  
  const url = `${API_BASE_URL}/api/files/list${queryParams.toString() ? `?${queryParams}` : ''}`;
  const response = await fetch(url);
  
  const result: ApiResponse<FileListResponse> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to list files');
  }
  
  return result.data;
}

/**
 * Get file metadata
 * GET /api/files/:id
 */
export async function getFileMetadata(fileId: string): Promise<FileMetadata> {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`);
  
  const result: ApiResponse<FileMetadata> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to get file metadata');
  }
  
  return result.data;
}

/**
 * Update file metadata (rename)
 * PUT /api/files/:id
 */
export async function updateFile(
  fileId: string,
  updates: { name?: string; folderId?: string | null }
): Promise<FileMetadata> {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  const result: ApiResponse<FileMetadata> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to update file');
  }
  
  return result.data;
}

/**
 * Delete file (soft delete)
 * DELETE /api/files/:id
 */
export async function deleteFile(fileId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
    method: 'DELETE',
  });
  
  const result: ApiResponse<void> = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to delete file');
  }
}

/**
 * Bulk delete files
 * POST /api/files/bulk-delete
 */
export async function bulkDeleteFiles(fileIds: string[]): Promise<BulkOperationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/files/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileIds }),
  });
  
  const result: ApiResponse<BulkOperationResponse> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to bulk delete files');
  }
  
  return result.data;
}

/**
 * Bulk move files to folder
 * POST /api/files/bulk-move
 */
export async function bulkMoveFiles(
  fileIds: string[],
  targetFolderId: string | null
): Promise<BulkOperationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/files/bulk-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileIds, targetFolderId }),
  });
  
  const result: ApiResponse<BulkOperationResponse> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to bulk move files');
  }
  
  return result.data;
}

// ==================== FOLDERS API ====================

/**
 * Create folder
 * POST /api/folders
 */
export async function createFolder(name: string, parentId?: string): Promise<Folder> {
  const response = await fetch(`${API_BASE_URL}/api/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, parentId }),
  });
  
  const result: ApiResponse<Folder> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to create folder');
  }
  
  return result.data;
}

/**
 * Get folder details
 * GET /api/folders/:id
 */
export async function getFolder(folderId: string): Promise<Folder> {
  const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`);
  
  const result: ApiResponse<Folder> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to get folder');
  }
  
  return result.data;
}

/**
 * Rename folder
 * PUT /api/folders/:id
 */
export async function renameFolder(folderId: string, name: string): Promise<Folder> {
  const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  
  const result: ApiResponse<Folder> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to rename folder');
  }
  
  return result.data;
}

/**
 * Delete folder (recursive)
 * DELETE /api/folders/:id
 */
export async function deleteFolder(folderId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
    method: 'DELETE',
  });
  
  const result: ApiResponse<void> = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to delete folder');
  }
}

/**
 * Get folder contents
 * GET /api/folders/:id/contents
 */
export async function getFolderContents(folderId: string): Promise<FolderContentsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}/contents`);
  
  const result: ApiResponse<FolderContentsResponse> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to get folder contents');
  }
  
  return result.data;
}

/**
 * Get breadcrumb path
 * GET /api/folders/:id/breadcrumb
 */
export async function getFolderBreadcrumb(folderId: string): Promise<BreadcrumbItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}/breadcrumb`);
  
  const result: ApiResponse<BreadcrumbItem[]> = await response.json();
  
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to get breadcrumb');
  }
  
  return result.data;
}
