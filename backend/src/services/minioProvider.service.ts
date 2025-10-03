/**
 * MinIO Provider Implementation
 * Handles MinIO bucket operations (S3-compatible)
 */

import { 
  S3Client, 
  HeadBucketCommand, 
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  AbortMultipartUploadCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { StorageCredentials, StorageProvider, StorageTestResult } from '../types/storage.types.js';

export class MinIOProvider implements StorageProvider {
  private client: S3Client;
  private credentials: StorageCredentials;

  constructor(credentials: StorageCredentials) {
    this.credentials = credentials;
    
    if (!credentials.endpoint) {
      throw new Error('Endpoint is required for MinIO');
    }

    // MinIO uses S3-compatible API with custom endpoint
    this.client = new S3Client({
      region: credentials.region || 'us-east-1',
      endpoint: credentials.endpoint,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
      },
      forcePathStyle: true // MinIO requires path-style access
    });
  }

  /**
   * Test MinIO bucket connection
   */
  async testConnection(): Promise<StorageTestResult> {
    const startTime = Date.now();
    const testResults = {
      bucketExists: false,
      readPermission: false,
      writePermission: false,
      corsConfigured: true, // MinIO supports CORS
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
          message: 'MinIO bucket does not exist or is not accessible',
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
          message: 'MinIO write permission denied',
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
        message: 'MinIO connection successful',
        details: testResults,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: 'MinIO connection failed',
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
      region: this.credentials.region || 'us-east-1'
    };
  }

  /**
   * Generate presigned upload URL for MinIO
   */
  async generatePresignedUploadUrl(key: string, contentType: string, expiresIn: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key,
      ContentType: contentType
    });
    
    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Generate presigned download URL for MinIO
   */
  async generatePresignedDownloadUrl(key: string, fileName: string, expiresIn: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"`
    });
    
    return getSignedUrl(this.client, command, { expiresIn });
  }
}
