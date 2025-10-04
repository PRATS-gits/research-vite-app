# Research Space Backend API

Backend API for Research Space - A comprehensive file management system with S3-compatible storage, supporting AWS S3, Cloudflare R2, and MinIO.

## 🚀 Features

### Core Storage Features
- **Multi-Provider Support**: AWS S3, Cloudflare R2, MinIO
- **Secure Credential Storage**: AES-256-GCM encryption at rest
- **Connection Testing**: Comprehensive bucket testing (read/write/CORS/multipart)
- **Configuration Lock**: Prevents accidental provider changes

### File Management Features
- **Presigned URLs**: Direct upload/download with time-limited URLs
- **File Operations**: Upload, download, rename, move, delete
- **Folder Management**: Create, rename, move, delete folders with hierarchy
- **Bulk Operations**: Batch move and delete files
- **Context Menu Operations**: Share links, duplicate files, star/favorite items
- **File Metadata**: Track file size, type, timestamps, and custom metadata

### Security & Performance
- **API Key Authentication**: Secure endpoint protection
- **Rate Limiting**: DDoS protection (100 req/15min)
- **TypeScript Strict Mode**: Type-safe implementation
- **Comprehensive Validation**: Zod schema validation
- **CORS Configured**: Frontend integration ready
- **File Duplication**: S3-native copy operations (no bandwidth usage)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- S3-compatible storage provider (AWS S3, Cloudflare R2, or MinIO)

## 🛠️ Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=your-32-character-encryption-key-here
API_KEY=your-api-key-for-basic-auth
CORS_ORIGIN=http://localhost:5173
```

**Generate Secure Keys:**
```bash
# Generate encryption key (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. **Build TypeScript**
```bash
npm run build
```

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start at `http://localhost:3001`

## 📚 API Endpoints

### Health Check
```bash
GET /health
```

### Storage Configuration
```bash
GET    /api/storage/status        # Get configuration status
POST   /api/storage/configure     # Configure storage provider
POST   /api/storage/test          # Test connection
DELETE /api/storage/lock          # Remove lock (admin)
```

### File Operations
```bash
POST   /api/files/presigned-url   # Generate presigned upload URL
POST   /api/files/:id/download-url # Generate presigned download URL
GET    /api/files/list            # List files with pagination
GET    /api/files/:id             # Get file metadata
PUT    /api/files/:id             # Update file metadata
DELETE /api/files/:id             # Delete file
POST   /api/files/bulk-delete     # Bulk delete files
POST   /api/files/bulk-move       # Bulk move files
```

### Context Menu Operations (New - October 2025)
```bash
POST   /api/files/:id/share       # Generate shareable link
POST   /api/files/:id/duplicate   # Duplicate file
PUT    /api/files/:id/star        # Toggle star/favorite status
```

### Folder Operations
```bash
POST   /api/folders               # Create folder
GET    /api/folders/list          # List folders
GET    /api/folders/:id           # Get folder details
PUT    /api/folders/:id/rename    # Rename folder
DELETE /api/folders/:id           # Delete folder (soft delete)
GET    /api/folders/:id/breadcrumb # Get folder breadcrumb
```

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for detailed endpoint documentation.

## 🔧 Quick Test Examples

### 1. Check Server Health
```bash
curl http://localhost:3001/health
```

### 2. Get Storage Status
```bash
curl http://localhost:3001/api/storage/status
```

### 3. Configure AWS S3
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

### 4. Configure Cloudflare R2
```bash
curl -X POST http://localhost:3001/api/storage/configure \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "cloudflare-r2",
    "credentials": {
      "accessKeyId": "YOUR_R2_ACCESS_KEY",
      "secretAccessKey": "YOUR_R2_SECRET_KEY",
      "region": "auto",
      "bucket": "your-r2-bucket",
      "endpoint": "https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com"
    }
  }'
```

### 5. Configure MinIO (Local Development)
```bash
curl -X POST http://localhost:3001/api/storage/configure \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "minio",
    "credentials": {
      "accessKeyId": "minioadmin",
      "secretAccessKey": "minioadmin",
      "region": "us-east-1",
      "bucket": "research-bucket",
      "endpoint": "http://localhost:9000"
    }
  }'
```

### 6. Test Connection (Saved Config)
```bash
curl -X POST http://localhost:3001/api/storage/test \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🏗️ Project Structure

```
backend/
├── src/                          # TypeScript source files
│   ├── controllers/              # Request handlers (Express controllers)
│   │   ├── storage.controller.ts     # Storage API handlers (configure, test, status)
│   │   ├── files.controller.ts       # File operations (upload, download, share, duplicate)
│   │   └── folders.controller.ts     # Folder management handlers
│   │
│   ├── routes/                   # API route definitions
│   │   ├── storage.routes.ts         # Storage endpoint routing
│   │   ├── files.routes.ts           # File endpoint routing
│   │   └── folders.routes.ts         # Folder endpoint routing
│   │
│   ├── services/                 # Business logic layer
│   │   ├── encryption.service.ts       # AES-256-GCM encryption/decryption
│   │   ├── storageProvider.service.ts  # Provider factory pattern
│   │   ├── s3Provider.service.ts       # AWS S3 implementation + FileOperations
│   │   ├── r2Provider.service.ts       # Cloudflare R2 implementation + FileOperations
│   │   ├── minioProvider.service.ts    # MinIO implementation + FileOperations
│   │   └── presignedUrl.service.ts     # Presigned URL generation service
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.middleware.ts         # API key authentication
│   │   └── validation.middleware.ts   # Zod schema validation
│   │
│   ├── models/                   # Data models & persistence (JSON file-based)
│   │   ├── storageConfig.model.ts     # Storage configuration CRUD
│   │   ├── fileMetadata.model.ts      # File metadata management
│   │   ├── folder.model.ts            # Folder hierarchy management
│   │   └── uploadQueue.model.ts       # Upload queue tracking
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── storage.types.ts           # Storage provider interfaces & types
│   │   └── files.types.ts             # File/folder interfaces & types
│   │
│   ├── config/                   # Configuration files (empty - using env vars)
│   ├── utils/                    # Utility functions (empty - future use)
│   └── server.ts                 # Express app entry point & server setup
│
├── docs/                         # Documentation files
│   ├── API_DOCUMENTATION.md      # Complete API reference (updated Oct 2025)
│   ├── PHASE1_SUMMARY.md         # Phase 1 implementation summary
│   └── PHASE2_SUMMARY.md         # Phase 2 implementation summary
│
├── data/                         # Runtime data storage (gitignored)
│   ├── storage-config.json       # Encrypted storage configuration
│   ├── config-lock.json          # Configuration lock metadata
│   ├── files.json                # File metadata database
│   └── folders.json              # Folder hierarchy database
│
├── dist/                         # Compiled JavaScript output (gitignored)
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── models/
│   ├── types/
│   └── server.js
│
├── node_modules/                 # npm dependencies (gitignored)
├── package.json                  # Project dependencies & scripts
├── package-lock.json             # Dependency lock file
├── tsconfig.json                 # TypeScript compiler configuration
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── server.log                    # Server logs (gitignored)
├── server-test.log               # Test logs (gitignored)
└── README.md                     # This file
```

### File Count Summary
- **Controllers:** 3 files (storage, files, folders)
- **Routes:** 3 files (storage, files, folders)
- **Services:** 6 files (providers, encryption, presigned URLs)
- **Models:** 4 files (storage config, files, folders, upload queue)
- **Middleware:** 2 files (auth, validation)
- **Types:** 2 files (storage, files)
- **Documentation:** 3 files (API docs, Phase 1 & 2 summaries)
- **Total TypeScript Files:** 21 source files
- **Total Lines of Code:** ~5,000+ (excluding tests and node_modules)

### Architecture Overview
```
Express Server (server.ts)
    │
    ├── Middleware Layer
    │   ├── CORS
    │   ├── Helmet (Security Headers)
    │   ├── Compression
    │   ├── Rate Limiting (100 req/15min)
    │   ├── Authentication (auth.middleware.ts)
    │   └── Validation (validation.middleware.ts)
    │
    ├── Routes
    │   ├── Health: GET /health
    │   │
    │   ├── Storage Routes (storage.routes.ts)
    │   │   ├── GET    /api/storage/status
    │   │   ├── POST   /api/storage/configure
    │   │   ├── POST   /api/storage/test
    │   │   └── DELETE /api/storage/lock
    │   │
    │   ├── Files Routes (files.routes.ts)
    │   │   ├── POST   /api/files/presigned-url
    │   │   ├── POST   /api/files/:id/download-url
    │   │   ├── POST   /api/files/:id/share          # NEW: Context Menu
    │   │   ├── POST   /api/files/:id/duplicate      # NEW: Context Menu
    │   │   ├── PUT    /api/files/:id/star           # NEW: Context Menu
    │   │   ├── GET    /api/files/list
    │   │   ├── GET    /api/files/:id
    │   │   ├── PUT    /api/files/:id
    │   │   ├── DELETE /api/files/:id
    │   │   ├── POST   /api/files/bulk-delete
    │   │   └── POST   /api/files/bulk-move
    │   │
    │   └── Folders Routes (folders.routes.ts)
    │       ├── POST   /api/folders
    │       ├── GET    /api/folders/list
    │       ├── GET    /api/folders/:id
    │       ├── PUT    /api/folders/:id/rename
    │       ├── DELETE /api/folders/:id
    │       └── GET    /api/folders/:id/breadcrumb
    │
    ├── Controllers Layer
    │   ├── StorageController (storage.controller.ts)
    │   ├── FilesController (files.controller.ts)
    │   └── FoldersController (folders.controller.ts)
    │
    ├── Services Layer
    │   ├── PresignedUrlService (presignedUrl.service.ts)
    │   │   └── Generates time-limited upload/download URLs
    │   │
    │   ├── StorageProvider Factory (storageProvider.service.ts)
    │   │   ├── S3Provider (s3Provider.service.ts)
    │   │   │   └── Implements: StorageProvider + FileOperations
    │   │   ├── R2Provider (r2Provider.service.ts)
    │   │   │   └── Implements: StorageProvider + FileOperations
    │   │   └── MinIOProvider (minioProvider.service.ts)
    │   │       └── Implements: StorageProvider + FileOperations
    │   │
    │   └── EncryptionService (encryption.service.ts)
    │       └── AES-256-GCM encryption for credentials
    │
    └── Models Layer (JSON File-Based Persistence)
        ├── StorageConfigModel (storageConfig.model.ts)
        ├── FileMetadataModel (fileMetadata.model.ts)
        ├── FolderModel (folder.model.ts)
        └── UploadQueueModel (uploadQueue.model.ts)
```

### Data Flow Example: File Upload
```
1. Frontend → POST /api/files/presigned-url
2. FilesController.getPresignedUploadUrl()
3. PresignedUrlService.generateUploadUrl()
4. StorageProvider.generatePresignedUploadUrl() (S3/R2/MinIO)
5. FileMetadataModel.create() → Save to files.json
6. Return presigned URL to frontend
7. Frontend uploads directly to S3 (no backend bandwidth)
```

### Data Flow Example: Share Link
```
1. Frontend → POST /api/files/:id/share { expiresInDays: 7 }
2. FilesController.generateShareLink()
3. FileMetadataModel.findById() → Get file metadata
4. PresignedUrlService.generateDownloadUrl() with extended expiration
5. Return shareable URL (valid for 7 days)
```

## 🔒 Security Features

1. **AES-256-GCM Encryption**: All credentials encrypted at rest
2. **API Key Authentication**: Bearer token or X-API-Key header
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **CORS Protection**: Only configured origins allowed
5. **Configuration Lock**: Prevents accidental changes
6. **Helmet.js**: Security headers
7. **Input Validation**: Zod schema validation
8. **No Plaintext Storage**: Credentials never stored in plain text

## 🧪 Testing

### Manual Testing
```bash
# Run tests with the server running
npm run dev

# In another terminal
curl http://localhost:3001/health
curl http://localhost:3001/api/storage/status
```

### TypeScript Compilation Test
```bash
npm run build
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Permission Errors
Ensure your S3 credentials have the following permissions:
- `s3:HeadBucket`
- `s3:PutObject`
- `s3:DeleteObject`
- `s3:GetBucketCors`
- `s3:CreateMultipartUpload`
- `s3:AbortMultipartUpload`

### Encryption Key Issues
Generate a proper 32-byte key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3001 | Server port |
| NODE_ENV | No | development | Environment mode |
| ENCRYPTION_KEY | Yes | - | 32-character encryption key |
| API_KEY | No | - | API authentication key |
| CORS_ORIGIN | No | http://localhost:5173 | Allowed CORS origin |
| LOG_LEVEL | No | info | Logging level |

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `ENCRYPTION_KEY` (32 bytes)
- [ ] Set strong `API_KEY`
- [ ] Configure proper `CORS_ORIGIN`
- [ ] Use HTTPS
- [ ] Enable firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security audits

### Docker Deployment (Future)
```dockerfile
# Dockerfile (to be created)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

## 📄 License

MIT License - See project root for details

## 🤝 Contributing

See CONTRIBUTING.md in the project root

## 📞 Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
2. Review troubleshooting section
3. Contact the development team

---

## 📋 Recent Updates

### October 2025 - Context Menu Operations
- ✅ Added share link generation with configurable expiration (1, 7, 14, 30 days)
- ✅ Implemented file duplication with S3-native copy (all providers)
- ✅ Added star/favorite functionality for files and folders
- ✅ Extended `FileOperations` interface with `copyFile()` method
- ✅ Updated all storage providers (S3, R2, MinIO) with full FileOperations support
- ✅ Added `starred` field to FileMetadata and Folder schemas
- ✅ Implemented `FolderModel.updateMetadata()` for partial updates

### Phase 2 - File & Folder Management
- ✅ Presigned URL generation for direct S3 uploads/downloads
- ✅ File metadata management with soft delete
- ✅ Folder hierarchy with breadcrumb navigation
- ✅ Bulk operations (move, delete)
- ✅ Upload queue tracking

### Phase 1 - Storage Configuration
- ✅ Multi-provider storage configuration (AWS S3, Cloudflare R2, MinIO)
- ✅ Credential encryption with AES-256-GCM
- ✅ Connection testing with comprehensive checks
- ✅ Configuration lock mechanism

---

**Backend Version**: 2.0.0  
**Last Updated**: October 4, 2025  
**Status**: ✅ Production Ready - Context Menu Complete

**Total API Endpoints**: 24  
**Supported Storage Providers**: 3 (AWS S3, Cloudflare R2, MinIO)  
**Database**: JSON file-based (4 collections)  
**Authentication**: API Key (Bearer token)
