# Research Space Backend API Documentation

## Base URL
```
http://localhost:3001
```

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

### Get Status
```bash
curl http://localhost:3001/api/storage/status
```

### Configure Storage (AWS S3)
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

### Test Connection (Saved Config)
```bash
curl -X POST http://localhost:3001/api/storage/test \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Remove Lock (Admin)
```bash
curl -X DELETE http://localhost:3001/api/storage/lock \
  -H "Authorization: Bearer YOUR_API_KEY"
```

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

---

## Support

For issues or questions, please refer to the project documentation or contact the development team.
