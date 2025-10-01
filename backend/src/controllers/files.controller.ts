/**
 * Files API Controller
 * Handles file operations, presigned URLs, and metadata management
 */

import type { Request, Response } from 'express';
import { FileMetadataModel } from '../models/fileMetadata.model.js';
import { FolderModel } from '../models/folder.model.js';
import { PresignedUrlService } from '../services/presignedUrl.service.js';
import type { 
  FileListResponse,
  PresignedUrlResponse,
  PresignedDownloadResponse,
  BulkOperationResponse
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
      console.error('Get presigned upload URL error:', error);
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
}
