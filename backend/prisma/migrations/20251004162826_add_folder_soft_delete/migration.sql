-- AlterTable
ALTER TABLE "folders" ADD COLUMN "deletedAt" DATETIME;

-- CreateIndex
CREATE INDEX "folders_deletedAt_idx" ON "folders"("deletedAt");
