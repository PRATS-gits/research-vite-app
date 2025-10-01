/**
 * Cloudflare R2 Provider Implementation
 * Handles Cloudflare R2 bucket operations (S3-compatible)
 */

import { 
  S3Client, 
  HeadBucketCommand, 
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';
import type { StorageCredentials, StorageProvider, StorageTestResult } from '../types/storage.types.js';

export class R2Provider implements StorageProvider {
  private client: S3Client;
  private credentials: StorageCredentials;

  constructor(credentials: StorageCredentials) {
    this.credentials = credentials;
    
    if (!credentials.endpoint) {
      throw new Error('Endpoint is required for Cloudflare R2');
    }

    // R2 uses S3-compatible API
    this.client = new S3Client({
      region: 'auto', // R2 uses 'auto' as region
      endpoint: credentials.endpoint,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
      }
    });
  }

  /**
   * Test R2 bucket connection
   */
  async testConnection(): Promise<StorageTestResult> {
    const startTime = Date.now();
    const testResults = {
      bucketExists: false,
      readPermission: false,
      writePermission: false,
      corsConfigured: true, // R2 has CORS enabled by default
      multipartSupported: false
    };

    try {
      // Test 1: Check bucket accessibility
      try {
        await this.client.send(new HeadBucketCommand({ Bucket: this.credentials.bucket }));
        testResults.bucketExists = true;
        testResults.readPermission = true;
      } catch (error) {
        return {
          success: false,
          message: 'R2 bucket does not exist or is not accessible',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
          details: testResults
        };
      }

      // Test 2: Check write permissions
      const testKey = `.test-write-${Date.now()}.txt`;
      try {
        await this.client.send(new PutObjectCommand({
          Bucket: this.credentials.bucket,
          Key: testKey,
          Body: 'test-write-access',
          ContentType: 'text/plain'
        }));
        testResults.writePermission = true;

        // Cleanup
        await this.client.send(new DeleteObjectCommand({
          Bucket: this.credentials.bucket,
          Key: testKey
        }));
      } catch (error) {
        return {
          success: false,
          message: 'R2 write permission denied',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
          details: testResults
        };
      }

      // Test 3: Check multipart upload support
      try {
        const multipartUpload = await this.client.send(new CreateMultipartUploadCommand({
          Bucket: this.credentials.bucket,
          Key: `.test-multipart-${Date.now()}.txt`
        }));

        if (multipartUpload.UploadId) {
          testResults.multipartSupported = true;
          
          await this.client.send(new AbortMultipartUploadCommand({
            Bucket: this.credentials.bucket,
            Key: `.test-multipart-${Date.now()}.txt`,
            UploadId: multipartUpload.UploadId
          }));
        }
      } catch (error) {
        testResults.multipartSupported = false;
      }

      return {
        success: true,
        message: 'Cloudflare R2 connection successful',
        details: testResults,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: 'Cloudflare R2 connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        details: testResults
      };
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.credentials.bucket }));
      return true;
    } catch (error) {
      return false;
    }
  }

  async getBucketInfo(): Promise<{ name: string; region: string }> {
    return {
      name: this.credentials.bucket,
      region: 'auto' // R2 uses 'auto' region
    };
  }
}
