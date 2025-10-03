/**
 * Files API Controller
 * Handles file operations, presigned URLs, and metadata management
 */

import type { Request, Response } from 'express';
import { FileMetadataModel } from '../models/fileMetadata.model.js';
import { FolderModel } from '../models/folder.model.js';
import { PresignedUrlService } from '../services/presignedUrl.service.js';
import { getEncryptionService } from '../services/encryption.service.js';
import { StorageProviderFactory } from '../services/storageProvider.service.js';
import type { 
  FileListResponse,
  PresignedUrlResponse,
  PresignedDownloadResponse,
  BulkOperationResponse,
  ShareLinkResponse,
  ShareLinkRequest,
  StarItemRequest
} from '../types/files.types.js';
import type { ApiResponse } from '../types/storage.types.js';

export class FilesController {
  /**
   * POST /api/files/presigned-url
   * Generate presigned URL for file upload
   */
  static async getPresignedUploadUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileType, fileSize, folderId, expiresIn } = req.body;

      const result = await PresignedUrlService.generateUploadUrl({
        fileName,
        fileType,
        fileSize,
        folderId,
        expiresIn
      });

      res.status(200).json({
        success: true,
        message: 'Presigned URL generated successfully',
        data: result,
        timestamp: new Date()
      } as ApiResponse<PresignedUrlResponse>);
    } catch (error) {
      console.error('Get presigned upload URL error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestBody: req.body,
        timestamp: new Date().toISOString()
      });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to generate presigned URL',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/files/:id/download-url
   * Generate presigned URL for file download
   */
  static async getPresignedDownloadUrl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { expiresIn } = req.body;

      const result = await PresignedUrlService.generateDownloadUrl({
        fileId: id,
        expiresIn
      });

      res.status(200).json({
        success: true,
        message: 'Download URL generated successfully',
        data: result,
        timestamp: new Date()
      } as ApiResponse<PresignedDownloadResponse>);
    } catch (error) {
      console.error('Get presigned download URL error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to generate download URL',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/files/:id/presigned-preview-url
   * Generate presigned URL for file preview (inline display)
   */
  static async getPresignedPreviewUrl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { expiresIn } = req.body;

      const result = await PresignedUrlService.generatePreviewUrl({
        fileId: id,
        expiresIn
      });

      res.status(200).json({
        success: true,
        message: 'Preview URL generated successfully',
        data: result,
        timestamp: new Date()
      } as ApiResponse<PresignedDownloadResponse>);
    } catch (error) {
      console.error('Get presigned preview URL error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to generate preview URL',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * GET /api/files/list
   * List files with pagination and filtering
```

  /**
   * GET /api/files/list
   * List files with pagination and filtering
   */
  static async listFiles(req: Request, res: Response): Promise<void> {
    try {
      const {
        folderId,
        page = '1',
        limit = '50',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search
      } = req.query;

      const query = {
        folderId: folderId as string | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as any,
        sortOrder: sortOrder as 'asc' | 'desc',
        search: search as string | undefined
      };

      const result = await FileMetadataModel.list(query);
      
      // Get folders for the same folder
      const folders = await FolderModel.findByParentId(folderId as string || null);

      const response: FileListResponse = {
        files: result.files,
        folders,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      };

      res.status(200).json({
        success: true,
        data: response,
        timestamp: new Date()
      } as ApiResponse<FileListResponse>);
    } catch (error) {
      console.error('List files error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to list files',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * GET /api/files/:id
   * Get file metadata
   */
  static async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const file = await FileMetadataModel.findById(id);

      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found',
          message: 'File does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: file,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to get file',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * PUT /api/files/:id
   * Update file metadata (rename)
   */
  static async updateFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedFile = await FileMetadataModel.update(id, { name });

      if (!updatedFile) {
        res.status(404).json({
          success: false,
          error: 'File not found',
          message: 'File does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'File updated successfully',
        data: updatedFile,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Update file error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to update file',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * DELETE /api/files/:id
   * Delete file (soft delete)
   */
  static async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const success = await FileMetadataModel.softDelete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'File not found',
          message: 'File does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to delete file',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/files/bulk-delete
   * Bulk delete files
   */
  static async bulkDelete(req: Request, res: Response): Promise<void> {
    try {
      const { fileIds } = req.body;

      const result = await FileMetadataModel.bulkDelete(fileIds);

      const response: BulkOperationResponse = {
        success: result.failed === 0,
        processedCount: result.success,
        failedCount: result.failed
      };

      res.status(200).json({
        success: true,
        message: `Deleted ${result.success} files successfully`,
        data: response,
        timestamp: new Date()
      } as ApiResponse<BulkOperationResponse>);
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to delete files',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/files/bulk-move
   * Bulk move files to folder
   */
  static async bulkMove(req: Request, res: Response): Promise<void> {
    try {
      const { fileIds, targetFolderId } = req.body;

      const result = await FileMetadataModel.bulkMove(fileIds, targetFolderId);

      const response: BulkOperationResponse = {
        success: result.failed === 0,
        processedCount: result.success,
        failedCount: result.failed
      };

      res.status(200).json({
        success: true,
        message: `Moved ${result.success} files successfully`,
        data: response,
        timestamp: new Date()
      } as ApiResponse<BulkOperationResponse>);
    } catch (error) {
      console.error('Bulk move error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to move files',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/files/:id/share
   * Generate shareable link with expiration
   */
  static async generateShareLink(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { expiresInDays } = req.body as ShareLinkRequest;

      // Validate expiresInDays
      if (!expiresInDays || ![1, 7, 14, 30].includes(expiresInDays)) {
        res.status(400).json({
          success: false,
          error: 'Invalid expiration period',
          message: 'expiresInDays must be one of: 1, 7, 14, or 30',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Get file metadata
      const file = await FileMetadataModel.findById(id);
      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found',
          message: `File with ID ${id} does not exist`,
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Generate presigned URL with longer expiration
      const expiresInSeconds = expiresInDays * 24 * 60 * 60;
      const result = await PresignedUrlService.generateDownloadUrl({
        fileId: id,
        expiresIn: expiresInSeconds
      });

      const response: ShareLinkResponse = {
        shareUrl: result.downloadUrl,
        expiresAt: result.expiresAt
      };

      res.status(200).json({
        success: true,
        message: 'Share link generated successfully',
        data: response,
        timestamp: new Date()
      } as ApiResponse<ShareLinkResponse>);
    } catch (error) {
      console.error('Generate share link error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to generate share link',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/files/:id/duplicate
   * Duplicate file with new ID
   */
  static async duplicateFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get original file metadata
      const originalFile = await FileMetadataModel.findById(id);
      if (!originalFile) {
        res.status(404).json({
          success: false,
          error: 'File not found',
          message: `File with ID ${id} does not exist`,
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Get storage configuration
      const config = await (await import('../models/storageConfig.model.js')).StorageConfigModel.getConfiguration();
      if (!config) {
        res.status(500).json({
          success: false,
          error: 'Storage not configured',
          message: 'Storage provider is not configured',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Get storage provider
      const encryptionService = getEncryptionService();
      const credentials = encryptionService.decryptCredentials(config.credentials);
      const provider = StorageProviderFactory.createProvider(config.provider, credentials);

      // Generate new S3 key
      const timestamp = Date.now();
      const fileExtension = originalFile.name.substring(originalFile.name.lastIndexOf('.'));
      const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
      const newFileName = `${baseName} (copy)${fileExtension}`;
      const folderPrefix = originalFile.folderId ? `${originalFile.folderId}/` : '';
      const newS3Key = `${folderPrefix}${timestamp}-${newFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Copy S3 object (only if provider supports FileOperations)
      if ('copyFile' in provider && typeof provider.copyFile === 'function') {
        await provider.copyFile(originalFile.s3Key, newS3Key);
      } else {
        res.status(501).json({
          success: false,
          error: 'Copy operation not supported',
          message: 'Current storage provider does not support file copying',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Create new file metadata record
      const duplicatedFile = await FileMetadataModel.create({
        name: newFileName,
        size: originalFile.size,
        type: originalFile.type,
        s3Key: newS3Key,
        folderId: originalFile.folderId,
        starred: false
      });

      res.status(201).json({
        success: true,
        message: 'File duplicated successfully',
        data: duplicatedFile,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Duplicate file error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to duplicate file',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * PUT /api/files/:id/star
   * Toggle star/favorite status
   */
  static async toggleStar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { starred } = req.body as StarItemRequest;

      // Validate starred value
      if (typeof starred !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'Invalid starred value',
          message: 'starred must be a boolean',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Try to update file first
      const file = await FileMetadataModel.findById(id);
      if (file) {
        await FileMetadataModel.update(id, { starred });
        
        res.status(200).json({
          success: true,
          message: starred ? 'Item starred successfully' : 'Item unstarred successfully',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // If not a file, try folder
      const folder = await FolderModel.findById(id);
      if (folder) {
        await FolderModel.updateMetadata(id, { starred });
        
        res.status(200).json({
          success: true,
          message: starred ? 'Item starred successfully' : 'Item unstarred successfully',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Item not found
      res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `File or folder with ID ${id} does not exist`,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Toggle star error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to toggle star status',
        timestamp: new Date()
      } as ApiResponse);
    }
  }
}
