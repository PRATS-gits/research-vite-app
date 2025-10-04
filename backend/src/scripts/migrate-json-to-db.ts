/**
 * Data Migration Script
 * Migrates data from JSON files to SQLite database using Prisma
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface JSONStorageConfig {
  id: string;
  provider: string;
  credentials: {
    encryptedData: string;
    iv: string;
    authTag: string;
  };
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JSONConfigLock {
  id: string;
  configurationId: string;
  lockedAt: string;
  lockedBy: string;
  reason: string;
  canOverride: boolean;
}

interface JSONFile {
  id: string;
  name: string;
  size: number;
  type: string;
  s3Key: string;
  folderId: string | null;
  starred?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

interface JSONFolder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  starred?: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(__dirname, '../../data');
const BACKUP_DIR = path.join(DATA_DIR, '.backup');

/**
 * Read JSON file safely
 */
function readJSONFile<T>(filename: string): T | null {
  const filePath = path.join(BACKUP_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error);
    return null;
  }
}

/**
 * Migrate Storage Configuration
 */
async function migrateStorageConfig() {
  console.log('\n📦 Migrating Storage Configuration...');
  
  const config = readJSONFile<JSONStorageConfig>('storage-config.json');
  if (!config) {
    console.log('   No storage config to migrate');
    return;
  }

  try {
    await prisma.storageConfig.create({
      data: {
        id: config.id,
        provider: config.provider,
        encryptedData: config.credentials.encryptedData,
        iv: config.credentials.iv,
        authTag: config.credentials.authTag,
        isLocked: config.isLocked,
        createdAt: new Date(config.createdAt),
        updatedAt: new Date(config.updatedAt)
      }
    });
    console.log(`   ✅ Migrated storage config: ${config.provider}`);
  } catch (error) {
    console.error('   ❌ Error migrating storage config:', error);
    throw error;
  }
}

/**
 * Migrate Configuration Lock
 */
async function migrateConfigLock() {
  console.log('\n🔒 Migrating Configuration Lock...');
  
  const lock = readJSONFile<JSONConfigLock>('config-lock.json');
  if (!lock) {
    console.log('   No config lock to migrate');
    return;
  }

  try {
    await prisma.configLock.create({
      data: {
        id: lock.id,
        configurationId: lock.configurationId,
        lockedAt: new Date(lock.lockedAt),
        lockedBy: lock.lockedBy,
        reason: lock.reason,
        canOverride: lock.canOverride
      }
    });
    console.log(`   ✅ Migrated config lock for: ${lock.configurationId}`);
  } catch (error) {
    console.error('   ❌ Error migrating config lock:', error);
    throw error;
  }
}

/**
 * Migrate Folders
 */
async function migrateFolders() {
  console.log('\n📁 Migrating Folders...');
  
  const folders = readJSONFile<JSONFolder[]>('folders.json');
  if (!folders || !Array.isArray(folders)) {
    console.log('   No folders to migrate');
    return;
  }

  let migrated = 0;
  for (const folder of folders) {
    try {
      await prisma.folder.create({
        data: {
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
          path: folder.path,
          starred: folder.starred || false,
          createdAt: new Date(folder.createdAt),
          updatedAt: new Date(folder.updatedAt)
        }
      });
      migrated++;
    } catch (error) {
      console.error(`   ❌ Error migrating folder ${folder.name}:`, error);
      throw error;
    }
  }
  console.log(`   ✅ Migrated ${migrated} folders`);
}

/**
 * Migrate Files
 */
async function migrateFiles() {
  console.log('\n📄 Migrating Files...');
  
  const files = readJSONFile<JSONFile[]>('files.json');
  if (!files || !Array.isArray(files)) {
    console.log('   No files to migrate');
    return;
  }

  let migrated = 0;
  for (const file of files) {
    try {
      await prisma.file.create({
        data: {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          s3Key: file.s3Key,
          folderId: file.folderId,
          starred: file.starred || false,
          createdAt: new Date(file.createdAt),
          updatedAt: new Date(file.updatedAt),
          deletedAt: file.deletedAt ? new Date(file.deletedAt) : null
        }
      });
      migrated++;
    } catch (error) {
      console.error(`   ❌ Error migrating file ${file.name}:`, error);
      throw error;
    }
  }
  console.log(`   ✅ Migrated ${migrated} files`);
}

/**
 * Verify Migration
 */
async function verifyMigration() {
  console.log('\n🔍 Verifying Migration...');
  
  const [configCount, lockCount, folderCount, fileCount] = await Promise.all([
    prisma.storageConfig.count(),
    prisma.configLock.count(),
    prisma.folder.count(),
    prisma.file.count()
  ]);

  console.log(`   Storage Configs: ${configCount}`);
  console.log(`   Config Locks: ${lockCount}`);
  console.log(`   Folders: ${folderCount}`);
  console.log(`   Files: ${fileCount}`);

  return { configCount, lockCount, folderCount, fileCount };
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting Data Migration from JSON to SQLite...\n');
  console.log(`📂 Reading from: ${BACKUP_DIR}`);
  console.log(`🗄️  Writing to: SQLite database\n`);
  console.log('=' .repeat(60));

  try {
    // Migrate in order: config → lock → folders → files
    await migrateStorageConfig();
    await migrateConfigLock();
    await migrateFolders();
    await migrateFiles();

    // Verify
    const counts = await verifyMigration();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!\n');
    
    return counts;
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
main()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
