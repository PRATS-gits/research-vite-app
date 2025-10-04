/**
 * Folder Model
 * Prisma-based storage for folder hierarchy with breadcrumb support
 */

import { PrismaClient } from '@prisma/client';
import type { Folder, BreadcrumbItem } from '../types/files.types.js';

const prisma = new PrismaClient();

export class FolderModel {
  private static async buildPath(folderId: string | null): Promise<string> {
    if (!folderId) {
      return '/';
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId }
    });

    if (!folder) {
      return '/';
    }

    if (!folder.parentId) {
      return `/${folder.name}`;
    }

    const parentPath = await this.buildPath(folder.parentId);
    return `${parentPath}/${folder.name}`;
  }

  static async create(name: string, parentId: string | null): Promise<Folder> {
    // Validate parent exists if specified
    if (parentId) {
      const parent = await prisma.folder.findFirst({
        where: { id: parentId, deletedAt: null }
      });
      if (!parent) {
        throw new Error('Parent folder not found');
      }
    }

    // Check for duplicate name in same parent
    const duplicate = await prisma.folder.findFirst({
      where: {
        name,
        parentId,
        deletedAt: null
      }
    });
    if (duplicate) {
      throw new Error('Folder with this name already exists in this location');
    }

    const path = await this.buildPath(parentId);
    const fullPath = parentId ? `${path}/${name}` : `/${name}`;

    const newFolder = await prisma.folder.create({
      data: {
        name,
        parentId,
        path: fullPath
      }
    });

    return {
      id: newFolder.id,
      name: newFolder.name,
      parentId: newFolder.parentId,
      path: newFolder.path,
      createdAt: newFolder.createdAt,
      updatedAt: newFolder.updatedAt,
      deletedAt: newFolder.deletedAt || undefined
    };
  }

  static async findById(id: string): Promise<Folder | null> {
    const folder = await prisma.folder.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!folder) {
      return null;
    }

    return {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      path: folder.path,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      deletedAt: folder.deletedAt || undefined
    };
  }

  static async findByParentId(parentId: string | null): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { parentId, deletedAt: null },
      orderBy: { name: 'asc' }
    });

    return folders.map(f => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      path: f.path,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      deletedAt: f.deletedAt || undefined
    }));
  }

  static async update(id: string, name: string): Promise<Folder | null> {
    const folder = await prisma.folder.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!folder) {
      return null;
    }

    // Check for duplicate name in same parent
    const duplicate = await prisma.folder.findFirst({
      where: {
        name,
        parentId: folder.parentId,
        id: { not: id },
        deletedAt: null
      }
    });
    if (duplicate) {
      throw new Error('Folder with this name already exists in this location');
    }

    // Update folder name
    await prisma.folder.update({
      where: { id },
      data: {
        name,
        updatedAt: new Date()
      }
    });
    
    // Rebuild paths for this folder and all descendants
    await this.rebuildPaths(id);
    
    // Fetch updated folder with rebuilt path
    const final = await prisma.folder.findUnique({ where: { id } });
    if (!final) return null;

    return {
      id: final.id,
      name: final.name,
      parentId: final.parentId,
      path: final.path,
      createdAt: final.createdAt,
      updatedAt: final.updatedAt,
      deletedAt: final.deletedAt || undefined
    };
  }

  static async updateMetadata(id: string, updates: Partial<Folder>): Promise<Folder | null> {
    const folder = await prisma.folder.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!folder) {
      return null;
    }

    // Prevent changing critical fields
    const { id: _, parentId, path, createdAt, deletedAt, ...safeUpdates } = updates;

    const updated = await prisma.folder.update({
      where: { id },
      data: {
        ...safeUpdates,
        updatedAt: new Date()
      }
    });

    return {
      id: updated.id,
      name: updated.name,
      parentId: updated.parentId,
      path: updated.path,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      deletedAt: updated.deletedAt || undefined
    };
  }

  private static async rebuildPaths(startFolderId: string): Promise<void> {
    const descendants = await this.getDescendantIds(startFolderId);
    descendants.push(startFolderId);

    for (const folderId of descendants) {
      const newPath = await this.buildPath(folderId);
      await prisma.folder.update({
        where: { id: folderId },
        data: { path: newPath }
      });
    }
  }

  static async softDelete(id: string): Promise<boolean> {
    const folder = await prisma.folder.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!folder) {
      return false;
    }

    // Get all descendants
    const descendants = await this.getDescendantIds(id);
    const toDelete = [id, ...descendants];

    // Mark folder and all descendants as deleted
    await prisma.folder.updateMany({
      where: { id: { in: toDelete } },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return true;
  }

  private static async getDescendantIds(folderId: string): Promise<string[]> {
    const descendants: string[] = [];
    const children = await prisma.folder.findMany({
      where: { parentId: folderId, deletedAt: null },
      select: { id: true }
    });
    
    for (const child of children) {
      descendants.push(child.id);
      const childDescendants = await this.getDescendantIds(child.id);
      descendants.push(...childDescendants);
    }

    return descendants;
  }

  static async getBreadcrumb(folderId: string | null): Promise<BreadcrumbItem[]> {
    if (!folderId) {
      return [];
    }

    const breadcrumb: BreadcrumbItem[] = [];
    let currentId: string | null = folderId;
    const visited = new Set<string>();

    while (currentId) {
      if (visited.has(currentId)) {
        throw new Error('Circular reference detected in folder hierarchy');
      }
      visited.add(currentId);

      const folder: { id: string; name: string; path: string; parentId: string | null } | null = await prisma.folder.findFirst({
        where: { id: currentId, deletedAt: null },
        select: { id: true, name: true, path: true, parentId: true }
      });
      
      if (!folder) {
        break;
      }

      breadcrumb.unshift({
        id: folder.id,
        name: folder.name,
        path: folder.path
      });

      currentId = folder.parentId;
    }

    return breadcrumb;
  }

  static async getHierarchy(): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { deletedAt: null },
      orderBy: { path: 'asc' }
    });

    return folders.map(f => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      path: f.path,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      deletedAt: f.deletedAt || undefined
    }));
  }

  /**
   * Get the count of items (files + subfolders) in a folder
   */
  static async getItemCount(folderId: string): Promise<number> {
    const subfolderCount = await prisma.folder.count({
      where: { parentId: folderId, deletedAt: null }
    });

    const fileCount = await prisma.file.count({
      where: { folderId, deletedAt: null }
    });
    
    return subfolderCount + fileCount;
  }
}
