/**
 * Validation Middleware
 * Request validation using Zod schemas
 */

import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/storage.types.js';

// Storage credentials schema
const storageCredentialsSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  region: z.string().min(1, 'Region is required'),
  bucket: z.string().min(1, 'Bucket name is required'),
  endpoint: z.string().url('Invalid endpoint URL').optional()
});

// Storage configuration schema
const storageConfigurationSchema = z.object({
  provider: z.enum(['aws-s3', 'cloudflare-r2', 'minio'], {
    errorMap: () => ({ message: 'Provider must be aws-s3, cloudflare-r2, or minio' })
  }),
  credentials: storageCredentialsSchema
});

// Storage test schema
const storageTestSchema = z.object({
  provider: z.enum(['aws-s3', 'cloudflare-r2', 'minio']).optional(),
  credentials: storageCredentialsSchema.optional()
});

/**
 * Validate storage configuration request
 */
export function validateStorageConfiguration(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const result = storageConfigurationSchema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid request data',
        data: { errors },
        timestamp: new Date()
      } as ApiResponse);
      return;
    }

    req.body = result.data;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Validation error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    } as ApiResponse);
  }
}

/**
 * Validate storage test request
 */
export function validateStorageTest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const result = storageTestSchema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid request data',
        data: { errors },
        timestamp: new Date()
      } as ApiResponse);
      return;
    }

    req.body = result.data;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Validation error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    } as ApiResponse);
  }
}
