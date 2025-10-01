/**
 * Presigned URL Service
 * Generates presigned URLs for direct S3 upload and download
 */

import { StorageConfigModel } from '../models/storageConfig.model.js';
import { FileMetadataModel } from '../models/fileMetadata.model.js';
import { getEncryptionService } from './encryption.service.js';
import { StorageProviderFactory } from './storageProvider.service.js';
import type { 
  PresignedUrlRequest, 
  PresignedUrlResponse,
  PresignedDownloadRequest,
  PresignedDownloadResponse
} from '../types/files.types.js';

export class PresignedUrlService {
  /**
   * Generate presigned upload URL
   */
  static async generateUploadUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    // Get configured storage
    const config = await StorageConfigModel.getConfiguration();
    if (!config) {
      throw new Error('Storage not configured');
    }

    // Decrypt credentials
    const encryptionService = getEncryptionService();
    const credentials = encryptionService.decryptCredentials(config.credentials);

    // Generate S3 key
    const timestamp = Date.now();
    const sanitizedFileName = request.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folderPrefix = request.folderId ? `${request.folderId}/` : '';
    const s3Key = `${folderPrefix}${timestamp}-${sanitizedFileName}`;

    // Get provider
    const provider = StorageProviderFactory.createProvider(config.provider, credentials) as any;

    // Generate presigned URL
    const expiresIn = request.expiresIn || 900; // 15 minutes default
    const uploadUrl = await provider.generatePresignedUploadUrl(s3Key, request.fileType, expiresIn);

    // Create file metadata record
    const fileMetadata = await FileMetadataModel.create({
      name: request.fileName,
      size: request.fileSize,
      type: request.fileType,
      s3Key,
      folderId: request.folderId || null
    });

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    return {
      uploadUrl,
      fileId: fileMetadata.id,
      s3Key,
      expiresAt
    };
  }

  /**
   * Generate presigned download URL
   */
  static async generateDownloadUrl(request: PresignedDownloadRequest): Promise<PresignedDownloadResponse> {
    // Get file metadata
    const file = await FileMetadataModel.findById(request.fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // Get configured storage
    const config = await StorageConfigModel.getConfiguration();
    if (!config) {
      throw new Error('Storage not configured');
    }

    // Decrypt credentials
    const encryptionService = getEncryptionService();
    const credentials = encryptionService.decryptCredentials(config.credentials);

    // Get provider
    const provider = StorageProviderFactory.createProvider(config.provider, credentials) as any;

    // Generate presigned URL
    const expiresIn = request.expiresIn || 900; // 15 minutes default
    const downloadUrl = await provider.generatePresignedDownloadUrl(file.s3Key, file.name, expiresIn);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    return {
      downloadUrl,
      fileName: file.name,
      expiresAt
    };
  }
}
