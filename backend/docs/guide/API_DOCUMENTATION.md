# Research Space Backend API Documentation

**Version:** 2.0.0  
**Last Updated:** October 4, 2025  
**Status:** Production Ready

## Base URL
```
http://localhost:3001
```

## Table of Contents
1. [Authentication](#authentication)
2. [Health Check](#1-health-check)
3. [Storage Management](#storage-management)
   - [Get Storage Status](#2-get-storage-status)
   - [Configure Storage](#3-configure-storage)
   - [Test Storage Connection](#4-test-storage-connection)
   - [Remove Configuration Lock](#5-remove-configuration-lock)
4. [File Operations](#file-operations)
   - [Generate Presigned Upload URL](#6-generate-presigned-upload-url)
   - [Generate Presigned Download URL](#7-generate-presigned-download-url)
   - [List Files](#8-list-files)
   - [Get File Metadata](#9-get-file-metadata)
   - [Update File Metadata](#10-update-file-metadata)
   - [Delete File](#11-delete-file)
   - [Bulk Delete Files](#12-bulk-delete-files)
   - [Bulk Move Files](#13-bulk-move-files)
5. [Context Menu Operations](#context-menu-operations-new) 🆕
   - [Generate Share Link](#14-generate-share-link)
   - [Duplicate File](#15-duplicate-file)
   - [Toggle Star/Favorite](#16-toggle-starfavorite)
6. [Folder Operations](#folder-operations)
   - [Create Folder](#17-create-folder)
   - [List Folders](#18-list-folders)
   - [Get Folder Details](#19-get-folder-details)
   - [Rename Folder](#20-rename-folder)
   - [Delete Folder](#21-delete-folder)
   - [Get Folder Breadcrumb](#22-get-folder-breadcrumb)
7. [Error Responses](#error-responses)

## Authentication
Most endpoints require API key authentication (optional in development mode).

### Headers
```
Authorization: Bearer YOUR_API_KEY
```
or
```
X-API-Key: YOUR_API_KEY
```

---

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the server is running.

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-01T06:36:38.967Z",
    "uptime": 2.939440752
  },
  "timestamp": "2025-10-01T06:36:38.967Z"
}
```

---

### 2. Get Storage Status
**GET** `/api/storage/status`

Get current storage configuration status.

**Response (200 OK) - Not Configured**
```json
{
  "success": true,
  "data": {
    "configured": false,
    "locked": false
  },
  "timestamp": "2025-10-01T06:36:46.370Z"
}
```

**Response (200 OK) - Configured**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "locked": true,
    "provider": "aws-s3",
    "bucketName": "my-research-bucket",
    "region": "us-east-1",
    "lastTested": "2025-10-01T06:30:00.000Z",
    "configuredAt": "2025-10-01T06:00:00.000Z"
  },
  "timestamp": "2025-10-01T06:36:46.370Z"
}
```

---

### 3. Configure Storage
**POST** `/api/storage/configure`

Configure storage provider with credentials. Tests connection before saving.

**Request Body**
```json
{
  "provider": "aws-s3",
  "credentials": {
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "region": "us-east-1",
    "bucket": "my-research-bucket"
  }
}
```

**For Cloudflare R2**
```json
{
  "provider": "cloudflare-r2",
  "credentials": {
    "accessKeyId": "YOUR_R2_ACCESS_KEY",
    "secretAccessKey": "YOUR_R2_SECRET_KEY",
    "region": "auto",
    "bucket": "my-r2-bucket",
    "endpoint": "https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com"
  }
}
```

**For MinIO**
```json
{
  "provider": "minio",
  "credentials": {
    "accessKeyId": "minioadmin",
    "secretAccessKey": "minioadmin",
    "region": "us-east-1",
    "bucket": "research-bucket",
    "endpoint": "http://localhost:9000"
  }
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Storage configured successfully",
  "data": {
    "provider": "aws-s3",
    "isLocked": true,
    "configuredAt": "2025-10-01T06:40:00.000Z"
  },
  "timestamp": "2025-10-01T06:40:00.000Z"
}
```

**Response (400 Bad Request) - Validation Error**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Invalid request data",
  "data": {
    "errors": [
      {
        "field": "provider",
        "message": "Provider must be aws-s3, cloudflare-r2, or minio",
        "code": "invalid_type"
      }
    ]
  },
  "timestamp": "2025-10-01T06:40:00.000Z"
}
```

**Response (400 Bad Request) - Connection Test Failed**
```json
{
  "success": false,
  "error": "Bucket does not exist or is not accessible",
  "message": "Bucket does not exist or is not accessible",
  "data": {
    "bucketExists": false,
    "readPermission": false,
    "writePermission": false,
    "corsConfigured": false,
    "multipartSupported": false
  },
  "timestamp": "2025-10-01T06:40:00.000Z"
}
```

**Response (423 Locked) - Configuration Locked**
```json
{
  "success": false,
  "error": "Storage configuration is locked. Use admin override to reconfigure.",
  "message": "Configuration locked",
  "timestamp": "2025-10-01T06:40:00.000Z"
}
```

---

### 4. Test Storage Connection
**POST** `/api/storage/test`

Test storage connection with provided or saved credentials.

**Request Body (Test new credentials)**
```json
{
  "provider": "aws-s3",
  "credentials": {
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "region": "us-east-1",
    "bucket": "test-bucket"
  }
}
```

**Request Body (Test saved configuration)**
```json
{}
```

**Response (200 OK) - Success**
```json
{
  "success": true,
  "message": "AWS S3 connection successful",
  "data": {
    "success": true,
    "message": "AWS S3 connection successful",
    "details": {
      "bucketExists": true,
      "readPermission": true,
      "writePermission": true,
      "corsConfigured": true,
      "multipartSupported": true
    },
    "responseTime": 1847
  },
  "timestamp": "2025-10-01T06:45:00.000Z"
}
```

**Response (400 Bad Request) - Failed**
```json
{
  "success": false,
  "message": "Write permission denied",
  "data": {
    "success": false,
    "message": "Write permission denied",
    "error": "AccessDenied: Access Denied",
    "details": {
      "bucketExists": true,
      "readPermission": true,
      "writePermission": false,
      "corsConfigured": false,
      "multipartSupported": false
    },
    "responseTime": 234
  },
  "timestamp": "2025-10-01T06:45:00.000Z"
}
```

---

### 5. Remove Configuration Lock
**DELETE** `/api/storage/lock`

Remove configuration lock (admin only).

**Headers Required**
```
Authorization: Bearer YOUR_ADMIN_API_KEY
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Configuration lock removed successfully",
  "timestamp": "2025-10-01T06:50:00.000Z"
}
```

**Response (401 Unauthorized)**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Valid API key required",
  "timestamp": "2025-10-01T06:50:00.000Z"
}
```

---

## File Operations

### 6. Generate Presigned Upload URL
**POST** `/api/files/presigned-url`

Generate a presigned URL for direct file upload to S3.

**Request Body**
```json
{
  "fileName": "example.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "folderId": "folder-id-123",
  "expiresIn": 900
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Presigned URL generated successfully",
  "data": {
    "uploadUrl": "https://bucket.s3.amazonaws.com/path?X-Amz-Algorithm=...",
    "fileId": "new-file-id",
    "s3Key": "folder-id/timestamp-filename.pdf",
    "expiresAt": "2025-10-03T10:00:00.000Z"
  },
  "timestamp": "2025-10-03T09:45:00.000Z"
}
```

---

### 7. Generate Presigned Download URL
**POST** `/api/files/:id/download-url`

Generate a presigned URL for file download.

**URL Parameters**
- `id` (string) - File ID

**Request Body**
```json
{
  "expiresIn": 900
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Download URL generated successfully",
  "data": {
    "downloadUrl": "https://bucket.s3.amazonaws.com/path?X-Amz-Algorithm=...",
    "fileName": "example.pdf",
    "expiresAt": "2025-10-03T10:00:00.000Z"
  },
  "timestamp": "2025-10-03T09:45:00.000Z"
}
```

---

### 8. List Files
**GET** `/api/files/list`

List files with pagination and filtering.

**Query Parameters**
- `folderId` (string, optional) - Filter by folder
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50) - Items per page
- `sortBy` (string, default: 'createdAt') - Sort field
- `sortOrder` (string, default: 'desc') - Sort order (asc/desc)
- `search` (string, optional) - Search query

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file-id-1",
        "name": "document.pdf",
        "size": 1024000,
        "type": "application/pdf",
        "s3Key": "folder/timestamp-document.pdf",
        "folderId": "folder-id",
        "starred": false,
        "createdAt": "2025-10-03T09:00:00.000Z",
        "updatedAt": "2025-10-03T09:00:00.000Z"
      }
    ],
    "folders": [],
    "total": 42,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  },
  "timestamp": "2025-10-03T09:45:00.000Z"
}
```

---

### 9. Get File Metadata
**GET** `/api/files/:id`

Get detailed metadata for a specific file.

**URL Parameters**
- `id` (string) - File ID

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "file-id-1",
    "name": "document.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "s3Key": "folder/timestamp-document.pdf",
    "folderId": "folder-id",
    "starred": true,
    "createdAt": "2025-10-03T09:00:00.000Z",
    "updatedAt": "2025-10-03T09:30:00.000Z"
  },
  "timestamp": "2025-10-03T09:45:00.000Z"
}
```

---

### 10. Update File Metadata
**PUT** `/api/files/:id`

Update file metadata (name, folder location).

**URL Parameters**
- `id` (string) - File ID

**Request Body**
```json
{
  "name": "renamed-document.pdf",
  "folderId": "new-folder-id"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    "id": "file-id-1",
    "name": "renamed-document.pdf",
    "folderId": "new-folder-id",
    "updatedAt": "2025-10-03T09:50:00.000Z"
  },
  "timestamp": "2025-10-03T09:50:00.000Z"
}
```

---

### 11. Delete File
**DELETE** `/api/files/:id`

Soft delete a file (marks as deleted, doesn't remove from S3 immediately).

**URL Parameters**
- `id` (string) - File ID

**Response (200 OK)**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "timestamp": "2025-10-03T09:55:00.000Z"
}
```

---

### 12. Bulk Delete Files
**POST** `/api/files/bulk-delete`

Delete multiple files at once.

**Request Body**
```json
{
  "fileIds": ["file-id-1", "file-id-2", "file-id-3"]
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Deleted 3 files successfully",
  "data": {
    "success": true,
    "processedCount": 3,
    "failedCount": 0
  },
  "timestamp": "2025-10-03T10:00:00.000Z"
}
```

---

### 13. Bulk Move Files
**POST** `/api/files/bulk-move`

Move multiple files to a different folder.

**Request Body**
```json
{
  "fileIds": ["file-id-1", "file-id-2"],
  "targetFolderId": "new-folder-id"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Moved 2 files successfully",
  "data": {
    "success": true,
    "processedCount": 2,
    "failedCount": 0
  },
  "timestamp": "2025-10-03T10:05:00.000Z"
}
```

---

## Context Menu Operations (NEW)

### 14. Generate Share Link
**POST** `/api/files/:id/share`

Generate a shareable presigned URL with configurable expiration.

**URL Parameters**
- `id` (string) - File ID

**Request Body**
```json
{
  "expiresInDays": 7
}
```

**Valid expiration values**: 1, 7, 14, or 30 days

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Share link generated successfully",
  "data": {
    "shareUrl": "https://bucket.s3.amazonaws.com/path/to/file?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
    "expiresAt": "2025-10-10T09:33:09.000Z"
  },
  "timestamp": "2025-10-03T09:33:09.965Z"
}
```

**Response (400 Bad Request) - Invalid Expiration**
```json
{
  "success": false,
  "error": "Invalid expiration period",
  "message": "expiresInDays must be one of: 1, 7, 14, or 30",
  "timestamp": "2025-10-03T09:33:09.965Z"
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "error": "File not found",
  "message": "File with ID abc-123 does not exist",
  "timestamp": "2025-10-03T09:33:09.965Z"
}
```

**cURL Example**
```bash
curl -X POST http://localhost:3001/api/files/abc-123/share \
  -H "Content-Type: application/json" \
  -d '{"expiresInDays": 7}'
```

---

### 15. Duplicate File
**POST** `/api/files/:id/duplicate`

Create an exact copy of a file with a new ID. Uses S3-native copy operation (no bandwidth usage).

**URL Parameters**
- `id` (string) - File ID to duplicate

**Request Body**
None required

**Response (201 Created)**
```json
{
  "success": true,
  "message": "File duplicated successfully",
  "data": {
    "id": "new-file-id-456",
    "name": "Debug vibing (copy).jpg",
    "size": 128327,
    "type": "image/jpeg",
    "s3Key": "folder-id/1759484187237-Debug_vibing__copy_.jpg",
    "folderId": "folder-id-789",
    "starred": false,
    "createdAt": "2025-10-03T09:36:27.961Z",
    "updatedAt": "2025-10-03T09:36:27.961Z"
  },
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "error": "File not found",
  "message": "File with ID abc-123 does not exist",
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**Response (500 Internal Server Error) - S3 Copy Failed**
```json
{
  "success": false,
  "error": "Failed to copy S3 object",
  "message": "Failed to duplicate file",
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**cURL Example**
```bash
curl -X POST http://localhost:3001/api/files/abc-123/duplicate \
  -H "Content-Type: application/json"
```

**Notes:**
- Appends " (copy)" to the filename before the extension
- Creates a new file record with a new UUID
- Uses S3 CopyObject command (efficient, no data transfer through server)
- Keeps the same folder location as the original
- Supported by all providers: AWS S3, Cloudflare R2, MinIO

---

### 16. Toggle Star/Favorite
**PUT** `/api/files/:id/star`

Toggle star/favorite status for a file or folder.

**URL Parameters**
- `id` (string) - File or Folder ID

**Request Body**
```json
{
  "starred": true
}
```

**Response (200 OK) - Starred**
```json
{
  "success": true,
  "message": "Item starred successfully",
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**Response (200 OK) - Unstarred**
```json
{
  "success": true,
  "message": "Item unstarred successfully",
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**Response (400 Bad Request) - Invalid Value**
```json
{
  "success": false,
  "error": "Invalid starred value",
  "message": "starred must be a boolean",
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "error": "Item not found",
  "message": "File or folder with ID abc-123 does not exist",
  "timestamp": "2025-10-03T09:36:27.965Z"
}
```

**cURL Examples**
```bash
# Star a file
curl -X PUT http://localhost:3001/api/files/abc-123/star \
  -H "Content-Type: application/json" \
  -d '{"starred": true}'

# Unstar a folder
curl -X PUT http://localhost:3001/api/files/folder-456/star \
  -H "Content-Type: application/json" \
  -d '{"starred": false}'
```

**Notes:**
- Works for both files and folders
- Starred status persists in database (files.json or folders.json)
- Can be used to build "Favorites" or "Starred Items" views

---

## Folder Operations

### 17. Create Folder
**POST** `/api/folders`

Create a new folder in the hierarchy.

**Request Body**
```json
{
  "name": "My Documents",
  "parentId": null
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": "folder-id-123",
    "name": "My Documents",
    "parentId": null,
    "path": "/My Documents",
    "createdAt": "2025-10-03T10:00:00.000Z",
    "updatedAt": "2025-10-03T10:00:00.000Z"
  },
  "timestamp": "2025-10-03T10:00:00.000Z"
}
```

---

### 18. List Folders
**GET** `/api/folders/list`

List all folders or folders in a specific parent.

**Query Parameters**
- `parentId` (string, optional) - Parent folder ID (null for root)

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "folder-id-1",
      "name": "Documents",
      "parentId": null,
      "path": "/Documents",
      "starred": false,
      "createdAt": "2025-10-03T09:00:00.000Z",
      "updatedAt": "2025-10-03T09:00:00.000Z"
    },
    {
      "id": "folder-id-2",
      "name": "Images",
      "parentId": null,
      "path": "/Images",
      "starred": true,
      "createdAt": "2025-10-03T09:30:00.000Z",
      "updatedAt": "2025-10-03T09:30:00.000Z"
    }
  ],
  "timestamp": "2025-10-03T10:05:00.000Z"
}
```

---

### 19. Get Folder Details
**GET** `/api/folders/:id`

Get detailed information about a specific folder.

**URL Parameters**
- `id` (string) - Folder ID

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "folder-id-1",
    "name": "Documents",
    "parentId": null,
    "path": "/Documents",
    "starred": false,
    "createdAt": "2025-10-03T09:00:00.000Z",
    "updatedAt": "2025-10-03T09:00:00.000Z"
  },
  "timestamp": "2025-10-03T10:10:00.000Z"
}
```

---

### 20. Rename Folder
**PUT** `/api/folders/:id/rename`

Rename a folder (automatically updates path and descendant paths).

**URL Parameters**
- `id` (string) - Folder ID

**Request Body**
```json
{
  "name": "Important Documents"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Folder renamed successfully",
  "data": {
    "id": "folder-id-1",
    "name": "Important Documents",
    "parentId": null,
    "path": "/Important Documents",
    "updatedAt": "2025-10-03T10:15:00.000Z"
  },
  "timestamp": "2025-10-03T10:15:00.000Z"
}
```

---

### 21. Delete Folder
**DELETE** `/api/folders/:id`

Soft delete a folder and all its contents (recursive).

**URL Parameters**
- `id` (string) - Folder ID

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Folder deleted successfully",
  "timestamp": "2025-10-03T10:20:00.000Z"
}
```

**Notes:**
- Deletes all descendant folders recursively
- Soft delete (marks as deleted, doesn't remove from storage)
- Files in deleted folders remain in S3 but are marked as deleted

---

### 22. Get Folder Breadcrumb
**GET** `/api/folders/:id/breadcrumb`

Get the breadcrumb trail from root to the specified folder.

**URL Parameters**
- `id` (string) - Folder ID

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "folder-id-1",
      "name": "Documents",
      "path": "/Documents"
    },
    {
      "id": "folder-id-2",
      "name": "Work",
      "path": "/Documents/Work"
    },
    {
      "id": "folder-id-3",
      "name": "Projects",
      "path": "/Documents/Work/Projects"
    }
  ],
  "timestamp": "2025-10-03T10:25:00.000Z"
}
```

**Notes:**
- Returns array ordered from root to target folder
- Useful for navigation breadcrumbs in UI
- Detects circular references and returns error if found

---

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": "Not Found",
  "message": "The requested resource was not found",
  "timestamp": "2025-10-01T06:50:00.000Z"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "timestamp": "2025-10-01T06:50:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2025-10-01T06:50:00.000Z"
}
```

---

## Testing with cURL

### Health Check
```bash
curl http://localhost:3001/health
```

### Storage Operations
```bash
# Get Status
curl http://localhost:3001/api/storage/status

# Configure Storage (AWS S3)
curl -X POST http://localhost:3001/api/storage/configure \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws-s3",
    "credentials": {
      "accessKeyId": "YOUR_ACCESS_KEY",
      "secretAccessKey": "YOUR_SECRET_KEY",
      "region": "us-east-1",
      "bucket": "your-bucket-name"
    }
  }'

# Test Connection
curl -X POST http://localhost:3001/api/storage/test \
  -H "Content-Type: application/json" \
  -d '{}'

# Remove Lock (Admin)
curl -X DELETE http://localhost:3001/api/storage/lock \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### File Operations
```bash
# List Files
curl "http://localhost:3001/api/files/list?page=1&limit=20"

# Get File
curl http://localhost:3001/api/files/file-id-123

# Delete File
curl -X DELETE http://localhost:3001/api/files/file-id-123

# Bulk Move
curl -X POST http://localhost:3001/api/files/bulk-move \
  -H "Content-Type: application/json" \
  -d '{
    "fileIds": ["file-id-1", "file-id-2"],
    "targetFolderId": "new-folder-id"
  }'
```

### Context Menu Operations
```bash
# Generate Share Link (7 days)
curl -X POST http://localhost:3001/api/files/file-id-123/share \
  -H "Content-Type: application/json" \
  -d '{"expiresInDays": 7}'

# Duplicate File
curl -X POST http://localhost:3001/api/files/file-id-123/duplicate \
  -H "Content-Type: application/json"

# Star Item
curl -X PUT http://localhost:3001/api/files/item-id-456/star \
  -H "Content-Type: application/json" \
  -d '{"starred": true}'
```

### Folder Operations
```bash
# Create Folder
curl -X POST http://localhost:3001/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name": "My Folder", "parentId": null}'

# List Folders
curl "http://localhost:3001/api/folders/list?parentId=null"

# Rename Folder
curl -X PUT http://localhost:3001/api/folders/folder-id-123/rename \
  -H "Content-Type: application/json" \
  -d '{"name": "Renamed Folder"}'

# Get Breadcrumb
curl http://localhost:3001/api/folders/folder-id-123/breadcrumb

# Delete Folder
curl -X DELETE http://localhost:3001/api/folders/folder-id-123
```

---

## API Summary

### Endpoint Count by Category
- **Health Check**: 1 endpoint
- **Storage Management**: 4 endpoints
- **File Operations**: 8 endpoints
- **Context Menu Operations**: 3 endpoints (NEW - October 2025)
- **Folder Operations**: 6 endpoints
- **Total**: 22 endpoints

### New Features (October 2025)
1. **Share Link Generation** - Create time-limited shareable links (1-30 days)
2. **File Duplication** - S3-native copy operation (efficient, no bandwidth)
3. **Star/Favorite System** - Mark important files and folders

### Storage Provider Support
- ✅ AWS S3 (fully supported)
- ✅ Cloudflare R2 (fully supported)
- ✅ MinIO (fully supported)

All providers support:
- Presigned URLs (upload/download)
- File operations (copy, delete)
- Connection testing
- Multipart uploads

---

## Security Considerations

1. **Credential Encryption**: All credentials are encrypted at rest using AES-256-GCM
2. **API Key Authentication**: Production deployments require API keys
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **CORS**: Configured to only allow requests from frontend origin
5. **Configuration Lock**: Prevents accidental provider changes after initial setup
6. **HTTPS**: Always use HTTPS in production
7. **Environment Variables**: Never commit `.env` file with real credentials

---

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
API_KEY=your-api-key-for-basic-auth

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Generate Secure Keys
```bash
# Generate encryption key (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit info included in response headers
- **Override**: Can be adjusted in server.ts configuration

---

## Data Persistence

Backend uses JSON file-based storage for development:

- `data/storage-config.json` - Encrypted storage credentials
- `data/config-lock.json` - Configuration lock metadata
- `data/files.json` - File metadata database
- `data/folders.json` - Folder hierarchy database

For production, consider migrating to:
- PostgreSQL for relational data
- MongoDB for document storage
- Redis for caching

---

## Support & Documentation

- **Backend README**: [../README.md](../README.md)
- **Phase 1 Summary**: [PHASE1_SUMMARY.md](PHASE1_SUMMARY.md)
- **Phase 2 Summary**: [PHASE2_SUMMARY.md](PHASE2_SUMMARY.md)
- **GitHub Repository**: [research-vite-app](https://github.com/PRATS-gits/research-vite-app)

---

**API Version**: 2.0.0  
**Last Updated**: October 4, 2025  
**Status**: ✅ Production Ready

**Changelog:**
- **v2.0.0** (Oct 2025) - Added context menu operations (share, duplicate, star)
- **v1.5.0** (Oct 2025) - Added file and folder management operations
- **v1.0.0** (Oct 2025) - Initial release with storage configuration
