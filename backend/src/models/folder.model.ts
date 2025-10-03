/**
 * Folder Model
 * File-based storage for folder hierarchy with breadcrumb support
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Folder, BreadcrumbItem } from '../types/files.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const FOLDERS_FILE = path.join(DATA_DIR, 'folders.json');

export class FolderModel {
  private static async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private static async readFolders(): Promise<Folder[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(FOLDERS_FILE, 'utf-8');
      const folders = JSON.parse(data) as Folder[];
      return folders.map(folder => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
        deletedAt: folder.deletedAt ? new Date(folder.deletedAt) : undefined
      }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private static async writeFolders(folders: Folder[]): Promise<void> {
    await this.ensureDataDirectory();
    await fs.writeFile(FOLDERS_FILE, JSON.stringify(folders, null, 2), 'utf-8');
  }

  private static async buildPath(folderId: string | null, folders: Folder[]): Promise<string> {
    if (!folderId) {
      return '/';
    }

    const folder = folders.find(f => f.id === folderId);
    if (!folder) {
      return '/';
    }

    if (!folder.parentId) {
      return `/${folder.name}`;
    }

    const parentPath = await this.buildPath(folder.parentId, folders);
    return `${parentPath}/${folder.name}`;
  }

  static async create(name: string, parentId: string | null): Promise<Folder> {
    const folders = await this.readFolders();
    
    // Validate parent exists if specified
    if (parentId) {
      const parent = folders.find(f => f.id === parentId && !f.deletedAt);
      if (!parent) {
        throw new Error('Parent folder not found');
      }
    }

    // Check for duplicate name in same parent
    const duplicate = folders.find(
      f => f.name === name && f.parentId === parentId && !f.deletedAt
    );
    if (duplicate) {
      throw new Error('Folder with this name already exists in this location');
    }

    const path = await this.buildPath(parentId, folders);
    const fullPath = parentId ? `${path}/${name}` : `/${name}`;

    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      path: fullPath,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    folders.push(newFolder);
    await this.writeFolders(folders);
    
    return newFolder;
  }

  static async findById(id: string): Promise<Folder | null> {
    const folders = await this.readFolders();
    const folder = folders.find(f => f.id === id && !f.deletedAt);
    return folder || null;
  }

  static async findByParentId(parentId: string | null): Promise<Folder[]> {
    const folders = await this.readFolders();
    return folders.filter(f => f.parentId === parentId && !f.deletedAt);
  }

  static async update(id: string, name: string): Promise<Folder | null> {
    const folders = await this.readFolders();
    const index = folders.findIndex(f => f.id === id && !f.deletedAt);
    
    if (index === -1) {
      return null;
    }

    const folder = folders[index];
    
    // Check for duplicate name in same parent
    const duplicate = folders.find(
      f => f.name === name && f.parentId === folder.parentId && f.id !== id && !f.deletedAt
    );
    if (duplicate) {
      throw new Error('Folder with this name already exists in this location');
    }

    // Update folder name
    folders[index].name = name;
    folders[index].updatedAt = new Date();
    
    // Rebuild path for this folder and all descendants
    await this.rebuildPaths(folders);
    
    await this.writeFolders(folders);
    return folders[index];
  }

  private static async rebuildPaths(folders: Folder[]): Promise<void> {
    for (const folder of folders) {
      if (!folder.deletedAt) {
        folder.path = await this.buildPath(folder.id, folders);
      }
    }
  }

  static async softDelete(id: string): Promise<boolean> {
    const folders = await this.readFolders();
    const index = folders.findIndex(f => f.id === id && !f.deletedAt);
    
    if (index === -1) {
      return false;
    }

    // Mark folder and all descendants as deleted
    const toDelete = await this.getDescendants(id, folders);
    toDelete.push(id);

    for (const folderId of toDelete) {
      const folderIndex = folders.findIndex(f => f.id === folderId);
      if (folderIndex !== -1) {
        folders[folderIndex].deletedAt = new Date();
        folders[folderIndex].updatedAt = new Date();
      }
    }

    await this.writeFolders(folders);
    return true;
  }

  private static async getDescendants(folderId: string, folders: Folder[]): Promise<string[]> {
    const descendants: string[] = [];
    const children = folders.filter(f => f.parentId === folderId && !f.deletedAt);
    
    for (const child of children) {
      descendants.push(child.id);
      const childDescendants = await this.getDescendants(child.id, folders);
      descendants.push(...childDescendants);
    }

    return descendants;
  }

  static async getBreadcrumb(folderId: string | null): Promise<BreadcrumbItem[]> {
    if (!folderId) {
      return [];
    }

    const folders = await this.readFolders();
    const breadcrumb: BreadcrumbItem[] = [];

    let currentId: string | null = folderId;
    const visited = new Set<string>();

    while (currentId) {
      if (visited.has(currentId)) {
        throw new Error('Circular reference detected in folder hierarchy');
      }
      visited.add(currentId);

      const folder = folders.find(f => f.id === currentId && !f.deletedAt);
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
    const folders = await this.readFolders();
    return folders.filter(f => !f.deletedAt);
  }
}
