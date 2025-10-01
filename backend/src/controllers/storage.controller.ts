/**
 * Storage API Controller
 * Handles storage configuration, testing, and status endpoints
 */

import type { Request, Response } from 'express';
import { getEncryptionService } from '../services/encryption.service.js';
import { StorageProviderFactory } from '../services/storageProvider.service.js';
import { StorageConfigModel } from '../models/storageConfig.model.js';
import type { 
  StorageConfigurationRequest,
  StorageTestRequest,
  ApiResponse,
  StorageStatusResponse 
} from '../types/storage.types.js';

export class StorageController {
  /**
   * POST /api/storage/configure
   * Configure storage provider with credentials
   */
  static async configureStorage(req: Request, res: Response): Promise<void> {
    try {
      const { provider, credentials } = req.body as StorageConfigurationRequest;

      // Check if configuration is locked
      const isLocked = await StorageConfigModel.isLocked();
      if (isLocked) {
        res.status(423).json({
          success: false,
          error: 'Storage configuration is locked. Use admin override to reconfigure.',
          message: 'Configuration locked',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Validate credentials by testing connection
      const testResult = await StorageProviderFactory.testProvider(provider, credentials);
      
      if (!testResult.success) {
        res.status(400).json({
          success: false,
          error: testResult.error || 'Connection test failed',
          message: testResult.message,
          data: testResult.details,
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Encrypt credentials
      const encryptionService = getEncryptionService();
      const encryptedCredentials = encryptionService.encryptCredentials(credentials);

      // Save configuration
      const config = await StorageConfigModel.saveConfiguration(provider, encryptedCredentials);

      // Create lock on first successful configuration
      await StorageConfigModel.createLock(
        config.id,
        'Initial configuration lock to prevent accidental provider changes'
      );

      res.status(201).json({
        success: true,
        message: 'Storage configured successfully',
        data: {
          provider: config.provider,
          isLocked: true,
          configuredAt: config.createdAt
        },
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Configure storage error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to configure storage',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * POST /api/storage/test
   * Test storage connection with provided or saved credentials
   */
  static async testStorage(req: Request, res: Response): Promise<void> {
    try {
      const { provider, credentials } = req.body as StorageTestRequest;

      let testProvider = provider;
      let testCredentials = credentials;

      // If no credentials provided, use saved configuration
      if (!credentials) {
        const config = await StorageConfigModel.getConfiguration();
        
        if (!config) {
          res.status(404).json({
            success: false,
            error: 'No storage configuration found',
            message: 'Please configure storage first',
            timestamp: new Date()
          } as ApiResponse);
          return;
        }

        testProvider = config.provider;
        const encryptionService = getEncryptionService();
        testCredentials = encryptionService.decryptCredentials(config.credentials);
      }

      if (!testProvider || !testCredentials) {
        res.status(400).json({
          success: false,
          error: 'Provider and credentials are required',
          message: 'Invalid request',
          timestamp: new Date()
        } as ApiResponse);
        return;
      }

      // Test connection
      const testResult = await StorageProviderFactory.testProvider(testProvider, testCredentials);

      // Update last tested timestamp if using saved config
      if (!credentials) {
        await StorageConfigModel.updateLastTested();
      }

      res.status(testResult.success ? 200 : 400).json({
        success: testResult.success,
        message: testResult.message,
        data: testResult,
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Test storage error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to test storage connection',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * GET /api/storage/status
   * Get current storage configuration status
   */
  static async getStatus(_req: Request, res: Response): Promise<void> {
    try {
      const config = await StorageConfigModel.getConfiguration();

      if (!config) {
        res.status(200).json({
          success: true,
          data: {
            configured: false,
            locked: false
          } as StorageStatusResponse,
          timestamp: new Date()
        } as ApiResponse<StorageStatusResponse>);
        return;
      }

      // Decrypt credentials to get bucket info
      const encryptionService = getEncryptionService();
      const credentials = encryptionService.decryptCredentials(config.credentials);

      const statusResponse: StorageStatusResponse = {
        configured: true,
        locked: config.isLocked,
        provider: config.provider,
        bucketName: credentials.bucket,
        region: credentials.region,
        lastTested: config.lastTestedAt,
        configuredAt: config.createdAt
      };

      res.status(200).json({
        success: true,
        data: statusResponse,
        timestamp: new Date()
      } as ApiResponse<StorageStatusResponse>);
    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to get storage status',
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  /**
   * DELETE /api/storage/lock
   * Remove configuration lock (admin only)
   */
  static async removeLock(_req: Request, res: Response): Promise<void> {
    try {
      await StorageConfigModel.removeLock();

      res.status(200).json({
        success: true,
        message: 'Configuration lock removed successfully',
        timestamp: new Date()
      } as ApiResponse);
    } catch (error) {
      console.error('Remove lock error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to remove lock',
        timestamp: new Date()
      } as ApiResponse);
    }
  }
}
