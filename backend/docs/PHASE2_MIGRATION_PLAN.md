# Phase 2: Database Migration Plan
**From JSON File Storage to SQL (SQLite + Postgres)**

## 📋 Executive Summary
Migrate backend from JSON file-based storage to SQL databases using Prisma ORM. Support SQLite for local development and Postgres/MySQL/MariaDB for Railway production.

**Implementation Date**: October 4, 2025  
**Status**: Planning → Implementation  
**Estimated Complexity**: High  
**Breaking Changes**: None (internal only)

---

## 🎯 Migration Objectives

### Primary Goals:
1. **Replace JSON files** with SQL database
2. **Maintain API compatibility** - No endpoint changes
3. **Use Prisma ORM** for type-safe queries
4. **Support multiple databases** - SQLite (dev), Postgres/MySQL/MariaDB (prod)
5. **Preserve existing data** - Automated migration script
6. **Improve performance** - Indexed queries, transactions
7. **Railway compatibility** - DATABASE_URL configuration

### Success Criteria:
- ✅ All existing data migrated successfully
- ✅ All 22 API endpoints working without changes
- ✅ No frontend modifications required
- ✅ Performance maintained or improved
- ✅ Type-safe database operations
- ✅ Railway deployment ready

---

## 📊 Current Data Analysis

### Data Files:
| File | Lines | Size | Records | Purpose |
|------|-------|------|---------|---------|
| `storage-config.json` | 11 | 768B | 1 | Storage provider config |
| `config-lock.json` | 7 | 267B | 1 | Configuration lock |
| `files.json` | 157 | 6.1KB | ~12 | File metadata |
| `folders.json` | 43 | 1.2KB | ~5 | Folder hierarchy |

### Data Structures:

#### StorageConfig:
```json
{
  "id": "uuid",
  "provider": "minio|aws-s3|cloudflare-r2",
  "credentials": {
    "encryptedData": "string",
    "iv": "string",
    "authTag": "string"
  },
  "isLocked": boolean,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

#### ConfigLock:
```json
{
  "id": "uuid",
  "configurationId": "uuid",
  "lockedAt": "ISO8601",
  "lockedBy": "string",
  "reason": "string",
  "canOverride": boolean
}
```

#### FileMetadata:
```json
{
  "id": "uuid",
  "name": "string",
  "size": number,
  "type": "string",
  "s3Key": "string",
  "folderId": "uuid|null",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "deletedAt": "ISO8601|null",
  "starred": boolean (optional)
}
```

#### Folder:
```json
{
  "id": "uuid",
  "name": "string",
  "parentId": "uuid|null",
  "path": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "starred": boolean (optional)
}
```

---

## 🏗️ Prisma Schema Design

### Database Configuration:
```prisma
datasource db {
  provider = "sqlite"  // Development
  // provider = "postgresql"  // Railway Production
  // provider = "mysql"  // Alternative Production
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Models:

#### 1. StorageConfig Model:
```prisma
model StorageConfig {
  id                String   @id @default(uuid())
  provider          String   // "minio", "aws-s3", "cloudflare-r2"
  encryptedData     String
  iv                String
  authTag           String
  isLocked          Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  lock              ConfigLock?
  
  @@map("storage_configs")
}
```

#### 2. ConfigLock Model:
```prisma
model ConfigLock {
  id               String   @id @default(uuid())
  configurationId  String   @unique
  lockedAt         DateTime @default(now())
  lockedBy         String
  reason           String
  canOverride      Boolean  @default(false)
  
  config           StorageConfig @relation(fields: [configurationId], references: [id], onDelete: Cascade)
  
  @@map("config_locks")
}
```

#### 3. File Model:
```prisma
model File {
  id          String    @id @default(uuid())
  name        String
  size        Int
  type        String
  s3Key       String    @unique
  folderId    String?
  starred     Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
  
  folder      Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)
  
  @@index([folderId])
  @@index([deletedAt])
  @@index([starred])
  @@map("files")
}
```

#### 4. Folder Model:
```prisma
model Folder {
  id        String   @id @default(uuid())
  name      String
  parentId  String?
  path      String
  starred   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  parent    Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children  Folder[] @relation("FolderHierarchy")
  files     File[]
  
  @@index([parentId])
  @@index([starred])
  @@map("folders")
}
```

### Key Features:
- ✅ UUID primary keys (matching current system)
- ✅ Proper foreign key relationships
- ✅ Cascade deletes for lock cleanup
- ✅ Indexes on frequently queried fields
- ✅ Soft delete support (deletedAt nullable)
- ✅ Self-referential folder hierarchy
- ✅ Timestamps with auto-update

---

## 🔄 Migration Strategy

### Phase 2.1: Prisma Setup
1. Install Prisma dependencies
2. Initialize Prisma with SQLite
3. Create schema.prisma
4. Generate Prisma client
5. Create initial migration

### Phase 2.2: Data Migration Script
1. Read existing JSON files
2. Validate data integrity
3. Transform to Prisma format
4. Insert into SQLite database
5. Verify migration success
6. Backup original JSON files

### Phase 2.3: Model Refactoring
1. Create new Prisma-based models
2. Maintain same interfaces
3. Replace file I/O with Prisma queries
4. Add transaction support
5. Improve error handling

### Phase 2.4: Testing & Validation
1. Unit tests for models
2. Integration tests for controllers
3. Data integrity verification
4. Performance benchmarking
5. Rollback procedure

### Phase 2.5: Railway Preparation
1. Add Postgres support to schema
2. Create production migration guide
3. Update environment variables
4. Document database connection options

---

## 📦 Dependencies to Install

```json
{
  "dependencies": {
    "prisma": "^5.20.0",
    "@prisma/client": "^5.20.0"
  },
  "devDependencies": {
    "prisma": "^5.20.0"
  }
}
```

---

## 🔧 Implementation Steps

### Step 1: Install Prisma
```bash
npm install --save @prisma/client
npm install --save-dev prisma
```

### Step 2: Initialize Prisma
```bash
npx prisma init --datasource-provider sqlite
```

### Step 3: Create Schema
- Write schema.prisma with all models
- Configure DATABASE_URL for SQLite

### Step 4: Generate & Migrate
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 5: Data Migration Script
- Create `src/scripts/migrate-json-to-db.ts`
- Read JSON files
- Insert into database
- Verify success

### Step 6: Refactor Models
- Update `storageConfig.model.ts`
- Update `folder.model.ts`
- Update `fileMetadata.model.ts`
- Remove `uploadQueue.model.ts` (if JSON-based)

### Step 7: Test Everything
- Run all API endpoint tests
- Verify data integrity
- Check performance

### Step 8: Update Documentation
- Update README with database setup
- Create migration guide
- Document Railway deployment

---

## 🔒 Data Integrity Considerations

### Constraints:
- ✅ Unique s3Key per file (prevent duplicates)
- ✅ Foreign key validation (folderId references folders)
- ✅ Cascade deletes (locks deleted with config)
- ✅ Null safety (optional fields properly handled)

### Transactions:
- Use Prisma transactions for multi-step operations
- Ensure atomic folder deletion (with files)
- Lock/unlock operations in single transaction

### Indexes:
- Primary: id (all tables)
- Foreign keys: folderId, parentId, configurationId
- Queries: deletedAt, starred, s3Key
- Performance: Composite indexes where needed

---

## 🚀 Railway Deployment Configuration

### Environment Variables:
```bash
# Development (SQLite)
DATABASE_URL="file:./data/database.db"

# Production (Postgres on Railway)
DATABASE_URL="postgresql://user:password@host:port/database"

# Alternative (MySQL on Railway)
DATABASE_URL="mysql://user:password@host:port/database"
```

### Railway Setup:
1. Add Postgres plugin to Railway project
2. Railway auto-generates DATABASE_URL
3. Run migrations: `npx prisma migrate deploy`
4. Prisma client connects automatically

---

## ⚠️ Risk Mitigation

### Rollback Plan:
1. Keep JSON files as backup (rename to .backup)
2. Create database backup before migration
3. Implement fallback to JSON if migration fails
4. Version control all changes

### Testing Strategy:
1. Test migration on copy of production data
2. Validate all API endpoints post-migration
3. Performance benchmarking (before/after)
4. Load testing with concurrent requests

### Monitoring:
1. Log all database operations
2. Track query performance
3. Monitor connection pool
4. Alert on migration failures

---

## 📊 Expected Improvements

### Performance:
- ✅ Indexed queries (faster searches)
- ✅ Connection pooling (better concurrency)
- ✅ Transactions (data consistency)
- ✅ Query optimization (prepared statements)

### Reliability:
- ✅ ACID compliance
- ✅ Referential integrity
- ✅ Type safety (Prisma)
- ✅ Migration versioning

### Scalability:
- ✅ Support large datasets (> 10k files)
- ✅ Concurrent writes (no file locking issues)
- ✅ Efficient joins (folder hierarchy)
- ✅ Production-grade database (Postgres)

---

## 🎯 Success Metrics

### Pre-Migration Baseline:
- Total files: ~12
- Total folders: ~5
- API endpoints: 22
- Average response time: TBD

### Post-Migration Targets:
- ✅ 100% data migrated
- ✅ 0 API endpoint changes
- ✅ Response time ≤ baseline
- ✅ All tests passing
- ✅ Railway deployment ready

---

## 📝 Next Actions

1. **Review & Approve**: Confirm plan before execution
2. **Backup Data**: Create backup of current JSON files
3. **Install Prisma**: Add dependencies
4. **Create Schema**: Write schema.prisma
5. **Migration Script**: Build data migration tool
6. **Refactor Models**: Update to use Prisma
7. **Test**: Comprehensive testing suite
8. **Document**: Update all documentation
9. **Railway**: Prepare deployment guide
10. **Handoff**: Create frontend integration report

---

**Plan Status**: Ready for Implementation  
**Estimated Time**: 2-3 hours  
**Risk Level**: Medium (mitigated with rollback plan)  
**Breaking Changes**: None  
**User Impact**: Zero (internal migration only)

---

**Awaiting Approval to Proceed with Implementation** ✓
