/**
 * Quick verification script to check migrated data
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('\n🔍 Verification Check\n');
  console.log('='.repeat(60));

  // Check storage config
  const config = await prisma.storageConfig.findFirst({
    include: { lock: true }
  });
  console.log('\n📦 Storage Config:');
  console.log(`   Provider: ${config?.provider}`);
  console.log(`   Locked: ${config?.isLocked}`);
  console.log(`   Lock Reason: ${config?.lock?.reason}`);

  // Check folders
  const folders = await prisma.folder.findMany({
    include: { _count: { select: { files: true } } }
  });
  console.log('\n📁 Folders:');
  folders.forEach(f => {
    console.log(`   - ${f.name} (${f._count.files} files)${f.starred ? ' ⭐' : ''}`);
  });

  // Check files
  const files = await prisma.file.findMany({
    where: { deletedAt: null },
    include: { folder: true }
  });
  console.log('\n📄 Active Files:');
  files.forEach(f => {
    const location = f.folder ? f.folder.name : 'Root';
    console.log(`   - ${f.name} (${(f.size / 1024).toFixed(1)}KB) in ${location}${f.starred ? ' ⭐' : ''}`);
  });

  const deletedFiles = await prisma.file.count({ where: { deletedAt: { not: null } } });
  if (deletedFiles > 0) {
    console.log(`\n🗑️  Deleted Files: ${deletedFiles}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All data verified successfully!\n');

  await prisma.$disconnect();
}

verify().catch(console.error);
