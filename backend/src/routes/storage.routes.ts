/**
 * Storage API Routes
 * Endpoints for storage configuration, testing, and status
 */

import { Router } from 'express';
import { StorageController } from '../controllers/storage.controller.js';
import { validateStorageConfiguration, validateStorageTest } from '../middleware/validation.middleware.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /api/storage/configure
 * Configure storage provider with credentials
 * Requires: provider, credentials
 * Returns: Configuration status and lock information
 */
router.post(
  '/configure',
  validateStorageConfiguration,
  StorageController.configureStorage
);

/**
 * POST /api/storage/test
 * Test storage connection
 * Optional: provider, credentials (uses saved config if not provided)
 * Returns: Connection test results with detailed diagnostics
 */
router.post(
  '/test',
  validateStorageTest,
  StorageController.testStorage
);

/**
 * GET /api/storage/status
 * Get current storage configuration status
 * Returns: Configuration status, provider info, lock status
 */
router.get(
  '/status',
  StorageController.getStatus
);

/**
 * DELETE /api/storage/lock
 * Remove configuration lock (admin only)
 * Returns: Success message
 */
router.delete(
  '/lock',
  authenticateAdmin,
  StorageController.removeLock
);

export default router;
