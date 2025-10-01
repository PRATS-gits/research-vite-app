/**
 * AWS S3 Provider Implementation
 * Handles AWS S3 bucket operations and connection testing
 */

import { 
  S3Client, 
  HeadBucketCommand, 
  PutObjectCommand,
  DeleteObjectCommand,
  GetBucketCorsCommand,
  CreateMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';
import type { StorageCredentials, StorageProvider, StorageTestResult } from '../types/storage.types.js';

export class S3Provider implements StorageProvider {
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
}
