# Research Space API Documentation

**High-Level API Overview and Quick Reference**

> **Version:** 2.0  
> **Last Updated:** October 5, 2025  
> **Base URL:** `http://localhost:3001` (development)  
> **Status:** Production Ready

---

## 📖 Documentation Navigation

This document provides a **high-level overview** of the Research Space API for quick reference and getting started.

**For detailed technical documentation, see:**
- 📚 **[Backend API Reference](../../backend/docs/guide/API_DOCUMENTATION.md)** - Complete endpoint documentation (1200+ lines)
- 🔧 **[Backend README](../../backend/README.md)** - Setup, configuration, and examples
- 🚀 **[Deployment Guide](../../backend/docs/guide/DEPLOYMENT_GUIDE.md)** - Production deployment instructions

---

## 📋 Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Quick Start](#quick-start)
4. [Endpoint Categories](#endpoint-categories)
5. [Common Response Format](#common-response-format)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [API Versioning](#api-versioning)

---

## API Overview

Research Space provides a **RESTful API** for managing files and folders with S3-compatible storage backends. The API supports:

- ✅ Multi-provider S3 support (AWS S3, Cloudflare R2, MinIO)
- ✅ Presigned URL generation for direct client-to-S3 transfers
- ✅ Folder hierarchy with unlimited nesting
- ✅ Soft delete with recovery options
- ✅ Bulk operations (move, delete)
- ✅ Context menu operations (share, duplicate, star)
- ✅ Library statistics and metadata management

### **Key Features**

| Feature | Description |
|---------|-------------|
| **Direct Uploads** | Presigned URLs enable client-to-S3 uploads without backend bandwidth |
| **Type-Safe** | Full TypeScript coverage with Prisma ORM |
| **Secure** | AES-256-GCM credential encryption, Helmet.js security headers |
| **Performant** | Rate limiting, compression, optimized database queries |
| **Flexible** | Provider abstraction supports multiple S3-compatible services |

---

## Authentication

### **Development Mode**

API authentication is **optional** in development mode (`NODE_ENV=development`).

### **Production Mode**

Most endpoints require API key authentication in production.

**Authentication Methods:**

**1. Bearer Token (Recommended)**
```http
Authorization: Bearer YOUR_API_KEY
```

**2. Custom Header**
```http
X-API-Key: YOUR_API_KEY
```

**Admin-Only Endpoints** (require admin credentials):
- `DELETE /api/storage/lock` - Remove configuration lock

---

## Quick Start

### **1. Health Check**

Verify the server is running:

```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-05T10:00:00.000Z",
    "uptime": 12.5
  }
}
```

### **2. Check Storage Status**

Check if S3 is configured:

```bash
curl http://localhost:3001/api/storage/status
```

**Response (Not Configured):**
```json
{
  "success": true,
  "data": {
    "configured": false,
    "locked": false
  }
}
```

### **3. Configure S3 Storage**

Configure AWS S3, Cloudflare R2, or MinIO:

```bash
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
```

### **4. Get Presigned Upload URL**

Request a presigned URL for file upload:

```bash
curl -X POST http://localhost:3001/api/files/presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "example.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "folderId": null
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://bucket.s3.amazonaws.com/...",
    "fileId": "uuid-here",
    "s3Key": "uploads/2025-10-05/example.pdf",
    "expiresAt": "2025-10-05T10:15:00.000Z"
  }
}
```

### **5. Upload File to S3**

Use the presigned URL to upload directly to S3:

```bash
curl -X PUT "PRESIGNED_UPLOAD_URL" \
  -H "Content-Type: application/pdf" \
  --upload-file example.pdf
```

---

## Endpoint Categories

### **🏥 Health Check**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

### **☁️ Storage Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/storage/status` | Get configuration status |
| POST | `/api/storage/configure` | Configure S3 provider |
| POST | `/api/storage/test` | Test connection |
| DELETE | `/api/storage/lock` | Remove config lock (admin) |

**Supported Providers:**
- AWS S3
- Cloudflare R2
- MinIO (self-hosted)

### **📁 File Operations**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/presigned-url` | Generate upload URL |
| POST | `/api/files/:id/download-url` | Generate download URL |
| POST | `/api/files/:id/preview-url` | Generate preview URL |
| GET | `/api/files/list` | List files (paginated) |
| GET | `/api/files/stats` | Library statistics |
| GET | `/api/files/:id` | Get file metadata |
| PUT | `/api/files/:id` | Update file metadata |
| DELETE | `/api/files/:id` | Delete file (soft delete) |
| POST | `/api/files/bulk-delete` | Delete multiple files |
| POST | `/api/files/bulk-move` | Move multiple files |

### **⭐ Context Menu Operations**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/:id/share` | Generate share link |
| POST | `/api/files/:id/duplicate` | Duplicate file (S3 copy) |
| PUT | `/api/files/:id/star` | Toggle star/favorite |

### **📂 Folder Operations**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/folders` | Create folder |
| GET | `/api/folders` | List folders |
| GET | `/api/folders/:id` | Get folder details |
| GET | `/api/folders/:id/contents` | Get folder contents |
| GET | `/api/folders/:id/breadcrumb` | Get folder path |
| PUT | `/api/folders/:id` | Update folder (rename) |
| DELETE | `/api/folders/:id` | Delete folder (recursive) |

---

## Common Response Format

All API responses follow a **consistent structure**:

### **Success Response**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": "2025-10-05T10:00:00.000Z"
}
```

### **Error Response**

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "timestamp": "2025-10-05T10:00:00.000Z"
}
```

### **Validation Error Response**

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Invalid request data",
  "data": {
    "errors": [
      {
        "field": "fieldName",
        "message": "Field-specific error message",
        "code": "validation_error_code"
      }
    ]
  },
  "timestamp": "2025-10-05T10:00:00.000Z"
}
```

---

## Error Handling

### **HTTP Status Codes**

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| **200** | OK | Successful GET, PUT, DELETE |
| **201** | Created | Successful POST (resource created) |
| **400** | Bad Request | Invalid input or validation error |
| **401** | Unauthorized | Missing or invalid authentication |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Resource conflict (e.g., duplicate) |
| **423** | Locked | Configuration locked |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server-side error |

### **Common Error Types**

| Error | Description | Status Code |
|-------|-------------|-------------|
| `Validation failed` | Invalid request body/query | 400 |
| `File not found` | Requested file doesn't exist | 404 |
| `Folder not found` | Requested folder doesn't exist | 404 |
| `Storage not configured` | S3 not configured | 400 |
| `Configuration locked` | Cannot modify locked config | 423 |
| `Bucket not accessible` | S3 connection failed | 400 |
| `Unauthorized` | Missing/invalid API key | 401 |
| `Rate limit exceeded` | Too many requests | 429 |

### **Error Handling Example**

```typescript
// Frontend error handling
try {
  const response = await fetch('http://localhost:3001/api/files/list');
  const result = await response.json();
  
  if (!result.success) {
    console.error('API Error:', result.error);
    // Handle error (show toast, etc.)
  }
  
  // Use result.data
} catch (error) {
  console.error('Network Error:', error);
  // Handle network errors
}
```

---

## Rate Limiting

### **Configuration**

- **Limit:** 100 requests per 15 minutes per IP address
- **Scope:** All `/api/*` endpoints
- **Response:** HTTP 429 when exceeded

### **Rate Limit Response**

```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "timestamp": "2025-10-05T10:00:00.000Z"
}
```

### **Headers**

Rate limit information is returned in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1728126000
```

---

## API Versioning

### **Current Version**

- **Version:** 2.0
- **Status:** Stable
- **Breaking Changes:** None expected

### **Versioning Strategy**

The API currently follows **implicit versioning** (no version in URL). Future versions may introduce explicit versioning:

```
/api/v2/files/list
```

### **Deprecation Policy**

- **Notice Period:** 6 months minimum
- **Migration Guide:** Provided with deprecation notices
- **Backwards Compatibility:** Maintained whenever possible

---

## Example Workflows

### **Complete File Upload Flow**

```bash
# 1. Check storage configuration
curl http://localhost:3001/api/storage/status

# 2. Request presigned upload URL
curl -X POST http://localhost:3001/api/files/presigned-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"report.pdf","fileType":"application/pdf","fileSize":512000}'

# 3. Upload file to S3 using presigned URL
curl -X PUT "PRESIGNED_URL_HERE" \
  -H "Content-Type: application/pdf" \
  --upload-file report.pdf

# 4. Verify file in list
curl http://localhost:3001/api/files/list
```

### **Create Folder and Upload File**

```bash
# 1. Create folder
curl -X POST http://localhost:3001/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"Documents","parentId":null}'

# Returns: {"data":{"id":"folder-123",...}}

# 2. Upload file to folder
curl -X POST http://localhost:3001/api/files/presigned-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"doc.pdf","fileType":"application/pdf","fileSize":100000,"folderId":"folder-123"}'

# 3. Upload using presigned URL
# ... (upload step)
```

### **Download File**

```bash
# 1. Get file metadata
curl http://localhost:3001/api/files/FILE_ID

# 2. Request download URL
curl -X POST http://localhost:3001/api/files/FILE_ID/download-url

# Returns: {"data":{"downloadUrl":"https://..."}}

# 3. Download file
curl -o downloaded-file.pdf "DOWNLOAD_URL_HERE"
```

---

## Security Best Practices

### **API Key Management**

```bash
# Store API keys securely
export RESEARCH_SPACE_API_KEY="your-api-key"

# Use in requests
curl -H "Authorization: Bearer $RESEARCH_SPACE_API_KEY" \
  http://localhost:3001/api/files/list
```

### **S3 Credentials**

- ✅ Credentials are encrypted at rest (AES-256-GCM)
- ✅ Configuration can be locked to prevent unauthorized changes
- ✅ Admin password required to override lock
- ✅ Test connection before saving credentials

### **Presigned URLs**

- ⏱️ Upload URLs expire after 15 minutes
- ⏱️ Download URLs expire after 5 minutes
- 🔒 URLs are time-limited and single-use
- 🔐 No credentials exposed in URLs

---

## Performance Tips

### **Pagination**

Always use pagination for large datasets:

```bash
# Get first page (50 items)
curl http://localhost:3001/api/files/list?page=1&limit=50

# Get second page
curl http://localhost:3001/api/files/list?page=2&limit=50
```

### **Bulk Operations**

Use bulk endpoints for multiple operations:

```bash
# Delete multiple files at once
curl -X POST http://localhost:3001/api/files/bulk-delete \
  -H "Content-Type: application/json" \
  -d '{"fileIds":["id1","id2","id3"]}'
```

### **Compression**

The API automatically compresses responses. Ensure your client accepts gzip:

```http
Accept-Encoding: gzip, deflate
```

---

## Development Tools

### **API Testing**

**Postman Collection** (Planned)
- Import from: `docs/postman/Research_Space_API.json`

**cURL Examples**
- See [Backend API Reference](../../backend/docs/guide/API_DOCUMENTATION.md) for comprehensive cURL examples

**Swagger/OpenAPI** (Planned)
- Interactive docs: `http://localhost:3001/api-docs`

### **Debugging**

**Enable verbose logging:**

```bash
# Backend logs
cd backend
npm run dev

# View logs in real-time
tail -f server.log
```

**Check database:**

```bash
# Open Prisma Studio
cd backend
npx prisma studio

# Accessible at: http://localhost:5555
```

---

## Migrations and Breaking Changes

### **Version 2.0 Changes**

- ✅ Complete rewrite with Prisma ORM (from JSON storage)
- ✅ Added folder hierarchy support
- ✅ Implemented soft delete mechanism
- ✅ Added context menu operations (share, duplicate, star)
- ✅ Improved error handling and validation
- ✅ Enhanced security with credential encryption

### **Migration from v1.x**

If migrating from JSON-based storage (v1.x):

1. Run database migrations: `npx prisma migrate deploy`
2. Use migration script: `npm run migrate:from-json` (planned)
3. Verify data integrity with test endpoint

---

## Support and Resources

### **Documentation**

- 📚 [Backend API Reference](../../backend/docs/guide/API_DOCUMENTATION.md) - Complete technical documentation
- 🔧 [Backend README](../../backend/README.md) - Setup and configuration
- 📖 [Project Overview](../../PROJECT_OVERVIEW.md) - Architecture and structure
- 🚀 [Deployment Guide](../../backend/docs/guide/DEPLOYMENT_GUIDE.md) - Production deployment

### **Guides**

- ⚡ [Quick Start](../tasks/QUICK_START.md) - Fast setup instructions
- 🐳 [MinIO Setup](MINIO_SETUP_GUIDE.md) - Local S3 storage
- 📏 [Coding Standards](../rules/CODING_STANDARDS.md) - Development guidelines

### **Support Channels**

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/PRATS-gits/research-vite-app/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/PRATS-gits/research-vite-app/discussions)
- 📧 **Email:** support@researchspace.dev

---

## Next Steps

1. ✅ **Read the [Backend API Reference](../../backend/docs/guide/API_DOCUMENTATION.md)** for detailed endpoint documentation
2. ✅ **Follow the [Quick Start Guide](../../README.md#quick-start)** to set up your development environment
3. ✅ **Explore the [Project Overview](../../PROJECT_OVERVIEW.md)** to understand the architecture
4. ✅ **Check [Coding Standards](../rules/CODING_STANDARDS.md)** before contributing

---

**Last Updated:** October 5, 2025  
**Maintained by:** Research Space Development Team  
**Version:** 2.0
