/**
 * Files API Routes
 * Endpoints for file operations, presigned URLs, and metadata
 */

import { Router } from 'express';
import { FilesController } from '../controllers/files.controller.js';

const router = Router();

// Presigned URL endpoints
router.post('/presigned-url', FilesController.getPresignedUploadUrl);
router.post('/:id/download-url', FilesController.getPresignedDownloadUrl);

// File metadata endpoints
router.get('/list', FilesController.listFiles);
router.get('/:id', FilesController.getFile);
router.put('/:id', FilesController.updateFile);
router.delete('/:id', FilesController.deleteFile);

// Bulk operations
router.post('/bulk-delete', FilesController.bulkDelete);
router.post('/bulk-move', FilesController.bulkMove);

export default router;
