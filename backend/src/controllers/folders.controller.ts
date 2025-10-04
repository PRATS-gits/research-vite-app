/**
 * Folders API Controller  
 * Handles folder operations and hierarchy management
 */

import type { Request, Response } from 'express';
import { FolderModel } from '../models/folder.model.js';
import { FileMetadataModel } from '../models/fileMetadata.model.js';
import type { FolderContentsResponse } from '../types/files.types.js';
import type { ApiResponse } from '../types/storage.types.js';

export class FoldersController {
  /**
   * POST /api/folders
   * Create new folder
   */
  static async createFolder(req: Request, res: Response): Promise<void> {
    try {
      const { name, parentId } = req.body;

      const folder = await FolderModel.create(name, parentId || null);

      res.status(201).json({
        success: true,
        message: 'Folder created successfully',
        data: folder,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Create folder error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to create folder',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * GET /api/folders/:id
   * Get folder details
   */
  static async getFolder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const folder = await FolderModel.findById(id);

      if (!folder) {
        res.status(404).json({
          success: false,
          error: 'Folder not found',
          message: 'Folder does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: folder,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Get folder error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to get folder',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * PUT /api/folders/:id
   * Rename folder
   */
  static async renameFolder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const folder = await FolderModel.update(id, name);

      if (!folder) {
        res.status(404).json({
          success: false,
          error: 'Folder not found',
          message: 'Folder does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Folder renamed successfully',
        data: folder,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Rename folder error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to rename folder',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * DELETE /api/folders/:id
   * Delete folder (recursive)
   */
  static async deleteFolder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const success = await FolderModel.softDelete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Folder not found',
          message: 'Folder does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Folder deleted successfully',
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Delete folder error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to delete folder',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * GET /api/folders/:id/contents
   * Get folder contents (files and subfolders)
   */
  static async getFolderContents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const folder = id !== 'root' ? await FolderModel.findById(id) : null;

      if (id !== 'root' && !folder) {
        res.status(404).json({
          success: false,
          error: 'Folder not found',
          message: 'Folder does not exist',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      const folderId = id === 'root' ? null : id;
      
      const files = await FileMetadataModel.findByFolderId(folderId);
      const subfolders = await FolderModel.findByParentId(folderId);
      const breadcrumb = await FolderModel.getBreadcrumb(folderId);

      // Add item counts to each subfolder
      const subfoldersWithCounts = await Promise.all(
        subfolders.map(async (folder) => ({
          ...folder,
          itemCount: await FolderModel.getItemCount(folder.id)
        }))
      );

      const response: FolderContentsResponse = {
        folder: folder || { id: 'root', name: 'Home', parentId: null, path: '/', createdAt: new Date(), updatedAt: new Date() },
        files,
        subfolders: subfoldersWithCounts,
        breadcrumb
      };

      res.status(200).json({
        success: true,
        data: response,
        timestamp: new Date()
      } as ApiResponse<FolderContentsResponse>);
    } catch (error) {
      console.error('Get folder contents error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to get folder contents',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * GET /api/folders/:id/breadcrumb
   * Get breadcrumb path for folder
   */
  static async getBreadcrumb(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const folderId = id === 'root' ? null : id;
      const breadcrumb = await FolderModel.getBreadcrumb(folderId);

      res.status(200).json({
        success: true,
        data: breadcrumb,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Get breadcrumb error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to get breadcrumb',
        timestamp: new Date()
      } as ApiResponse);
    }
  }
}
