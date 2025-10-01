/**
 * Upload Queue Model
 * File-based storage for upload tracking and retry management
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { UploadQueueItem } from '../types/files.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const QUEUE_FILE = path.join(DATA_DIR, 'upload-queue.json');

export class UploadQueueModel {
  private static async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private static async readQueue(): Promise<UploadQueueItem[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(QUEUE_FILE, 'utf-8');
      const items = JSON.parse(data) as UploadQueueItem[];
      return items.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        completedAt: item.completedAt ? new Date(item.completedAt) : undefined
      }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private static async writeQueue(items: UploadQueueItem[]): Promise<void> {
    await this.ensureDataDirectory();
    await fs.writeFile(QUEUE_FILE, JSON.stringify(items, null, 2), 'utf-8');
  }

  static async create(fileId: string, fileName: string, fileSize: number): Promise<UploadQueueItem> {
    const queue = await this.readQueue();
    
    const newItem: UploadQueueItem = {
      id: crypto.randomUUID(),
      fileId,
      fileName,
      fileSize,
      status: 'pending',
      progress: 0,
      uploadedBytes: 0,
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    queue.push(newItem);
    await this.writeQueue(queue);
    
    return newItem;
  }

  static async findByFileId(fileId: string): Promise<UploadQueueItem | null> {
    const queue = await this.readQueue();
    const item = queue.find(i => i.fileId === fileId);
    return item || null;
  }

  static async updateStatus(
    fileId: string,
    status: UploadQueueItem['status'],
    updates?: Partial<UploadQueueItem>
  ): Promise<UploadQueueItem | null> {
    const queue = await this.readQueue();
    const index = queue.findIndex(i => i.fileId === fileId);
    
    if (index === -1) {
      return null;
    }

    queue[index] = {
      ...queue[index],
      ...updates,
      status,
      updatedAt: new Date(),
      completedAt: status === 'complete' || status === 'failed' || status === 'cancelled'
        ? new Date()
        : queue[index].completedAt
    };

    await this.writeQueue(queue);
    return queue[index];
  }

  static async updateProgress(fileId: string, uploadedBytes: number): Promise<UploadQueueItem | null> {
    const queue = await this.readQueue();
    const index = queue.findIndex(i => i.fileId === fileId);
    
    if (index === -1) {
      return null;
    }

    const progress = Math.round((uploadedBytes / queue[index].fileSize) * 100);
    
    queue[index].uploadedBytes = uploadedBytes;
    queue[index].progress = progress;
    queue[index].updatedAt = new Date();

    if (progress >= 100) {
      queue[index].status = 'complete';
      queue[index].completedAt = new Date();
    }

    await this.writeQueue(queue);
    return queue[index];
  }

  static async incrementRetry(fileId: string, errorMessage: string): Promise<UploadQueueItem | null> {
    const queue = await this.readQueue();
    const index = queue.findIndex(i => i.fileId === fileId);
    
    if (index === -1) {
      return null;
    }

    queue[index].retryCount++;
    queue[index].errorMessage = errorMessage;
    queue[index].updatedAt = new Date();

    if (queue[index].retryCount >= queue[index].maxRetries) {
      queue[index].status = 'failed';
      queue[index].completedAt = new Date();
    } else {
      queue[index].status = 'pending';
    }

    await this.writeQueue(queue);
    return queue[index];
  }

  static async cancelUpload(fileId: string): Promise<boolean> {
    const queue = await this.readQueue();
    const index = queue.findIndex(i => i.fileId === fileId);
    
    if (index === -1) {
      return false;
    }

    queue[index].status = 'cancelled';
    queue[index].updatedAt = new Date();
    queue[index].completedAt = new Date();

    await this.writeQueue(queue);
    return true;
  }

  static async getPendingUploads(): Promise<UploadQueueItem[]> {
    const queue = await this.readQueue();
    return queue.filter(i => i.status === 'pending' || i.status === 'uploading');
  }

  static async getFailedUploads(): Promise<UploadQueueItem[]> {
    const queue = await this.readQueue();
    return queue.filter(i => i.status === 'failed');
  }

  static async cleanup(olderThanDays: number = 7): Promise<number> {
    const queue = await this.readQueue();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const filtered = queue.filter(item => {
      if (!item.completedAt) {
        return true; // Keep incomplete uploads
      }
      return item.completedAt > cutoffDate;
    });

    const removedCount = queue.length - filtered.length;
    
    if (removedCount > 0) {
      await this.writeQueue(filtered);
    }

    return removedCount;
  }
}
