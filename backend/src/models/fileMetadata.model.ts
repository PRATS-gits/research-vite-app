/**
 * File Metadata Model
 * File-based storage for file records with soft delete support
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { FileMetadata, FileListQuery } from '../types/files.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const FILES_FILE = path.join(DATA_DIR, 'files.json');

export class FileMetadataModel {
  private static async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private static async readFiles(): Promise<FileMetadata[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(FILES_FILE, 'utf-8');
      const files = JSON.parse(data) as FileMetadata[];
      return files.map(file => ({
        ...file,
        createdAt: new Date(file.createdAt),
        updatedAt: new Date(file.updatedAt),
        deletedAt: file.deletedAt ? new Date(file.deletedAt) : undefined
      }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private static async writeFiles(files: FileMetadata[]): Promise<void> {
    await this.ensureDataDirectory();
    await fs.writeFile(FILES_FILE, JSON.stringify(files, null, 2), 'utf-8');
  }

  static async create(fileData: Omit<FileMetadata, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileMetadata> {
    const files = await this.readFiles();
    
    const newFile: FileMetadata = {
      ...fileData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    files.push(newFile);
    await this.writeFiles(files);
    
    return newFile;
  }

  static async findById(id: string): Promise<FileMetadata | null> {
    const files = await this.readFiles();
    const file = files.find(f => f.id === id && !f.deletedAt);
    return file || null;
  }

  static async findByS3Key(s3Key: string): Promise<FileMetadata | null> {
    const files = await this.readFiles();
    const file = files.find(f => f.s3Key === s3Key && !f.deletedAt);
    return file || null;
  }

  static async update(id: string, updates: Partial<FileMetadata>): Promise<FileMetadata | null> {
    const files = await this.readFiles();
    const index = files.findIndex(f => f.id === id && !f.deletedAt);
    
    if (index === -1) {
      return null;
    }

    files[index] = {
      ...files[index],
      ...updates,
      id: files[index].id, // Prevent ID change
      createdAt: files[index].createdAt, // Prevent creation date change
      updatedAt: new Date()
    };

    await this.writeFiles(files);
    return files[index];
  }

  static async softDelete(id: string): Promise<boolean> {
    const files = await this.readFiles();
    const index = files.findIndex(f => f.id === id && !f.deletedAt);
    
    if (index === -1) {
      return false;
    }

    files[index].deletedAt = new Date();
    files[index].updatedAt = new Date();
    
    await this.writeFiles(files);
    return true;
  }

  static async hardDelete(id: string): Promise<boolean> {
    const files = await this.readFiles();
    const filteredFiles = files.filter(f => f.id !== id);
    
    if (filteredFiles.length === files.length) {
      return false;
    }

    await this.writeFiles(filteredFiles);
    return true;
  }

  static async list(query: FileListQuery): Promise<{
    files: FileMetadata[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const files = await this.readFiles();
    
    // Filter by folder and soft delete
    let filtered = files.filter(f => !f.deletedAt);
    
    if (query.folderId !== undefined) {
      filtered = filtered.filter(f => f.folderId === (query.folderId || null));
    }

    // Search by name
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(f => f.name.toLowerCase().includes(searchLower));
    }

    // Sort
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = aVal.getTime();
        bVal = bVal.getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedFiles = filtered.slice(startIndex, endIndex);
    
    return {
      files: paginatedFiles,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  }

  static async findByFolderId(folderId: string | null): Promise<FileMetadata[]> {
    const files = await this.readFiles();
    return files.filter(f => f.folderId === folderId && !f.deletedAt);
  }

  static async bulkDelete(ids: string[]): Promise<{ success: number; failed: number }> {
    const files = await this.readFiles();
    let success = 0;
    
    for (const id of ids) {
      const index = files.findIndex(f => f.id === id && !f.deletedAt);
      if (index !== -1) {
        files[index].deletedAt = new Date();
        files[index].updatedAt = new Date();
        success++;
      }
    }

    await this.writeFiles(files);
    return { success, failed: ids.length - success };
  }

  static async bulkMove(ids: string[], targetFolderId: string | null): Promise<{ success: number; failed: number }> {
    const files = await this.readFiles();
    let success = 0;
    
    for (const id of ids) {
      const index = files.findIndex(f => f.id === id && !f.deletedAt);
      if (index !== -1) {
        files[index].folderId = targetFolderId;
        files[index].updatedAt = new Date();
        success++;
      }
    }

    await this.writeFiles(files);
    return { success, failed: ids.length - success };
  }
}
