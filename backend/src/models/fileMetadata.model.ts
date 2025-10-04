/**
 * File Metadata Model
 * Prisma-based storage for file records with soft delete support
 */

import { PrismaClient } from '@prisma/client';
import type { FileMetadata, FileListQuery } from '../types/files.types.js';

const prisma = new PrismaClient();

export class FileMetadataModel {
  static async create(fileData: Omit<FileMetadata, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileMetadata> {
    const file = await prisma.file.create({
      data: {
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        s3Key: fileData.s3Key,
        folderId: fileData.folderId || null,
        starred: fileData.starred || false
      }
    });

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      s3Key: file.s3Key,
      folderId: file.folderId,
      starred: file.starred,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined
    };
  }

  static async findById(id: string): Promise<FileMetadata | null> {
    const file = await prisma.file.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!file) {
      return null;
    }

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      s3Key: file.s3Key,
      folderId: file.folderId,
      starred: file.starred,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined
    };
  }

  static async findByS3Key(s3Key: string): Promise<FileMetadata | null> {
    const file = await prisma.file.findFirst({
      where: { s3Key, deletedAt: null }
    });
    
    if (!file) {
      return null;
    }

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      s3Key: file.s3Key,
      folderId: file.folderId,
      starred: file.starred,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined
    };
  }

  static async update(id: string, updates: Partial<FileMetadata>): Promise<FileMetadata | null> {
    const existing = await prisma.file.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!existing) {
      return null;
    }

    // Prevent changing critical fields
    const { id: _, s3Key, createdAt, deletedAt, ...safeUpdates } = updates;

    const file = await prisma.file.update({
      where: { id },
      data: {
        ...safeUpdates,
        updatedAt: new Date()
      }
    });

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      s3Key: file.s3Key,
      folderId: file.folderId,
      starred: file.starred,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      deletedAt: file.deletedAt || undefined
    };
  }

  static async softDelete(id: string): Promise<boolean> {
    const file = await prisma.file.findFirst({
      where: { id, deletedAt: null }
    });
    
    if (!file) {
      return false;
    }

    await prisma.file.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    return true;
  }

  static async hardDelete(id: string): Promise<boolean> {
    try {
      await prisma.file.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  static async list(query: FileListQuery): Promise<{
    files: FileMetadata[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build where clause
    const where: any = {
      deletedAt: null
    };

    // Filter by folder
    if (query.folderId !== undefined) {
      where.folderId = query.folderId || null;
    }

    // Search by name
    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive'
      };
    }

    // Count total matching records
    const total = await prisma.file.count({ where });

    // Build orderBy
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    // Fetch paginated results
    const files = await prisma.file.findMany({
      where,
      orderBy,
      skip,
      take: limit
    });

    return {
      files: files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        s3Key: f.s3Key,
        folderId: f.folderId,
        starred: f.starred,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        deletedAt: f.deletedAt || undefined
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async findByFolderId(folderId: string | null): Promise<FileMetadata[]> {
    const files = await prisma.file.findMany({
      where: {
        folderId: folderId || null,
        deletedAt: null
      },
      orderBy: { name: 'asc' }
    });

    return files.map(f => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      s3Key: f.s3Key,
      folderId: f.folderId,
      starred: f.starred,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      deletedAt: f.deletedAt || undefined
    }));
  }

  static async bulkDelete(ids: string[]): Promise<{ success: number; failed: number }> {
    const result = await prisma.file.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return {
      success: result.count,
      failed: ids.length - result.count
    };
  }

  static async bulkMove(ids: string[], targetFolderId: string | null): Promise<{ success: number; failed: number }> {
    const result = await prisma.file.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null
      },
      data: {
        folderId: targetFolderId,
        updatedAt: new Date()
      }
    });

    return {
      success: result.count,
      failed: ids.length - result.count
    };
  }
}
