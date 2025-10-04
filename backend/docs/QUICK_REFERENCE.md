# Backend Quick Reference

**Version**: 2.0.0 | **Updated**: October 4, 2025

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:3001
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers (3 files)
│   ├── routes/          # API routes (3 files)
│   ├── services/        # Business logic (6 files)
│   ├── models/          # Data persistence (4 files)
│   ├── middleware/      # Express middleware (2 files)
│   ├── types/           # TypeScript types (2 files)
│   └── server.ts        # Entry point
├── docs/                # Documentation
├── data/                # JSON databases
└── dist/                # Compiled output
```

## 🔗 API Endpoints (22 Total)

### Health & Storage (5)
```
GET    /health
GET    /api/storage/status
POST   /api/storage/configure
POST   /api/storage/test
DELETE /api/storage/lock
```

### Files (11)
```
POST   /api/files/presigned-url
POST   /api/files/:id/download-url
POST   /api/files/:id/share           # NEW
POST   /api/files/:id/duplicate       # NEW
PUT    /api/files/:id/star            # NEW
GET    /api/files/list
GET    /api/files/:id
PUT    /api/files/:id
DELETE /api/files/:id
POST   /api/files/bulk-delete
POST   /api/files/bulk-move
```

### Folders (6)
```
POST   /api/folders
GET    /api/folders/list
GET    /api/folders/:id
PUT    /api/folders/:id/rename
DELETE /api/folders/:id
GET    /api/folders/:id/breadcrumb
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled JS

# Testing
curl http://localhost:3001/health
curl http://localhost:3001/api/storage/status

# Debugging
npm run dev | tee server.log
tail -f server.log
```

## 🗄️ Data Files

```
data/
├── storage-config.json   # Encrypted storage credentials
├── config-lock.json      # Configuration lock
├── files.json            # File metadata
└── folders.json          # Folder hierarchy
```

## 🔐 Environment Variables

```env
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=<32-byte-hex-string>
API_KEY=<base64-string>
CORS_ORIGIN=http://localhost:5173
```

Generate keys:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📦 Key Dependencies

```json
{
  "express": "^4.18.2",
  "@aws-sdk/client-s3": "^3.600.0",
  "@aws-sdk/s3-request-presigner": "^3.600.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "zod": "^3.22.4"
}
```

## 🏗️ Architecture Layers

1. **Routes** → Define API endpoints
2. **Controllers** → Handle HTTP requests/responses
3. **Services** → Business logic & external integrations
4. **Models** → Data persistence layer
5. **Middleware** → Authentication, validation, CORS

## 🎯 Recent Updates (October 2025)

### Context Menu Operations
- ✅ **Share Links**: Generate time-limited URLs (1-30 days)
- ✅ **File Duplication**: S3-native copy (no bandwidth)
- ✅ **Star/Favorite**: Mark important items

### Implementation Details
- Added `copyFile()` to all storage providers
- Extended `FileOperations` interface
- Added `starred` field to files/folders
- New `FolderModel.updateMetadata()` method

## 🔍 Troubleshooting

### Port in Use
```bash
lsof -ti:3001 | xargs kill -9
```

### Build Errors
```bash
rm -rf dist node_modules
npm install
npm run build
```

### Data Reset
```bash
rm data/*.json  # WARNING: Deletes all data
npm run dev     # Will recreate empty databases
```

## 📊 File Statistics

- **Total TypeScript Files**: 21
- **Total Lines of Code**: ~5,000+
- **Controllers**: 3 (storage, files, folders)
- **Routes**: 3
- **Services**: 6 (providers + utilities)
- **Models**: 4 (config, files, folders, queue)

## 🔗 Documentation Links

- [Complete API Documentation](./API_DOCUMENTATION.md)
- [Backend README](../README.md)
- [Phase 1 Summary](./PHASE1_SUMMARY.md)
- [Phase 2 Summary](./PHASE2_SUMMARY.md)

## 💡 Development Tips

1. **Use TypeScript strict mode** - All code is type-safe
2. **Follow existing patterns** - Consistent controller/service structure
3. **Test with cURL** - Quick endpoint verification
4. **Check logs** - Server logs to `server.log`
5. **JSON pretty print** - All responses are formatted

## 🚦 Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid API key)
- **404** - Not Found
- **423** - Locked (configuration locked)
- **429** - Too Many Requests (rate limit)
- **500** - Internal Server Error

---

**Quick Help**: For detailed endpoint documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
