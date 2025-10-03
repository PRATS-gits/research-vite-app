/**
 * AWS S3 Provider Implementation
 * Handles AWS S3 bucket operations and connection testing
 */

import { 
  S3Client, 
  HeadBucketCommand, 
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  GetBucketCorsCommand,
  CreateMultipartUploadCommand,
  AbortMultipartUploadCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { StorageCredentials, StorageProvider, StorageTestResult } from '../types/storage.types.js';
import type { FileOperations } from '../types/files.types.js';

export class S3Provider implements StorageProvider, FileOperations {
  private client: S3Client;
  private credentials: StorageCredentials;

  constructor(credentials: StorageCredentials) {
    this.credentials = credentials;
    this.client = new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
      }
    });
  }

  /**
   * Test S3 bucket connection with comprehensive checks
   */
  async testConnection(): Promise<StorageTestResult> {
    const startTime = Date.now();
    const testResults = {
      bucketExists: false,
      readPermission: false,
      writePermission: false,
      corsConfigured: false,
      multipartSupported: false
    };

    try {
      // Test 1: Check if bucket exists and is accessible
      try {
        await this.client.send(new HeadBucketCommand({ Bucket: this.credentials.bucket }));
        testResults.bucketExists = true;
        testResults.readPermission = true;
      } catch (error) {
        return {
          success: false,
          message: 'Bucket does not exist or is not accessible',
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

        // Cleanup test file
        await this.client.send(new DeleteObjectCommand({
          Bucket: this.credentials.bucket,
          Key: testKey
        }));
      } catch (error) {
        return {
          success: false,
          message: 'Write permission denied',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
          details: testResults
        };
      }

      // Test 3: Check CORS configuration
      try {
        await this.client.send(new GetBucketCorsCommand({ 
          Bucket: this.credentials.bucket 
        }));
        testResults.corsConfigured = true;
      } catch (error) {
        // CORS might not be configured, not a critical error
        testResults.corsConfigured = false;
      }

      // Test 4: Check multipart upload support
      try {
        const multipartUpload = await this.client.send(new CreateMultipartUploadCommand({
          Bucket: this.credentials.bucket,
          Key: `.test-multipart-${Date.now()}.txt`
        }));

        if (multipartUpload.UploadId) {
          testResults.multipartSupported = true;
          
          // Abort the multipart upload (cleanup)
          await this.client.send(new AbortMultipartUploadCommand({
            Bucket: this.credentials.bucket,
            Key: `.test-multipart-${Date.now()}.txt`,
            UploadId: multipartUpload.UploadId
          }));
        }
      } catch (error) {
        testResults.multipartSupported = false;
      }

      const responseTime = Date.now() - startTime;

      return {
        success: true,
        message: 'AWS S3 connection successful',
        details: testResults,
        responseTime
      };
    } catch (error) {
      return {
        success: false,
        message: 'AWS S3 connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        details: testResults
      };
    }
  }

  /**
   * Validate S3 credentials
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({ 
        Bucket: this.credentials.bucket 
      }));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get bucket information
   */
  async getBucketInfo(): Promise<{ name: string; region: string }> {
    return {
      name: this.credentials.bucket,
      region: this.credentials.region
    };
  }

  /**
   * Upload file to S3
   */
  async uploadFile(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(new PutObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    }));
  }

  /**
   * Download file from S3
   */
  async downloadFile(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key
    }));
    
    if (!response.Body) {
      throw new Error('File not found');
    }
    
    return Buffer.from(await response.Body.transformToByteArray());
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key
    }));
  }

  /**
   * Copy file within S3 bucket
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    await this.client.send(new CopyObjectCommand({
      Bucket: this.credentials.bucket,
      CopySource: `${this.credentials.bucket}/${sourceKey}`,
      Key: destinationKey
    }));
  }

  /**
   * Generate presigned upload URL
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
   * Generate presigned download URL
   */
  async generatePresignedDownloadUrl(key: string, fileName: string, expiresIn: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"`
    });
    
    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({
        Bucket: this.credentials.bucket,
        Key: key
      }));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file size
   */
  async getFileSize(key: string): Promise<number> {
    const response = await this.client.send(new HeadObjectCommand({
      Bucket: this.credentials.bucket,
      Key: key
    }));
    
    return response.ContentLength || 0;
  }
}
