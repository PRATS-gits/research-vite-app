/**
 * Folders API Routes
 * Endpoints for folder operations and hierarchy management
 */

import { Router } from 'express';
import { FoldersController } from '../controllers/folders.controller.js';

const router = Router();

// Folder CRUD operations
router.post('/', FoldersController.createFolder);
router.get('/:id', FoldersController.getFolder);
router.put('/:id', FoldersController.renameFolder);
router.delete('/:id', FoldersController.deleteFolder);

// Folder contents and navigation
router.get('/:id/contents', FoldersController.getFolderContents);
router.get('/:id/breadcrumb', FoldersController.getBreadcrumb);

export default router;
