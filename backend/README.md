# Research Space Backend API

Backend API for Research Space - S3-compatible storage management system supporting AWS S3, Cloudflare R2, and MinIO.

## 🚀 Features

- **Multi-Provider Support**: AWS S3, Cloudflare R2, MinIO
- **Secure Credential Storage**: AES-256-GCM encryption at rest
- **Connection Testing**: Comprehensive bucket testing (read/write/CORS/multipart)
- **Configuration Lock**: Prevents accidental provider changes
- **API Key Authentication**: Secure endpoint protection
- **Rate Limiting**: DDoS protection (100 req/15min)
- **TypeScript Strict Mode**: Type-safe implementation
- **Comprehensive Validation**: Zod schema validation
- **CORS Configured**: Frontend integration ready

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
GET  /api/storage/status        # Get configuration status
POST /api/storage/configure     # Configure storage provider
POST /api/storage/test          # Test connection
DELETE /api/storage/lock        # Remove lock (admin)
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

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
├── src/
│   ├── controllers/         # Request handlers
│   │   └── storage.controller.ts
│   ├── routes/             # API route definitions
│   │   └── storage.routes.ts
│   ├── services/           # Business logic
│   │   ├── encryption.service.ts
│   │   ├── storageProvider.service.ts
│   │   ├── s3Provider.service.ts
│   │   ├── r2Provider.service.ts
│   │   └── minioProvider.service.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/            # Data models
│   │   └── storageConfig.model.ts
│   ├── types/             # TypeScript types
│   │   └── storage.types.ts
│   └── server.ts          # Express app entry point
├── data/                  # Configuration storage (gitignored)
├── dist/                  # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
├── .env                   # Environment variables (gitignored)
├── .env.example          # Environment template
├── README.md
└── API_DOCUMENTATION.md   # Detailed API docs
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
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review troubleshooting section
3. Contact the development team

---

**Backend Version**: 1.0.0  
**Last Updated**: October 2025  
**Status**: ✅ Phase 1 Complete
