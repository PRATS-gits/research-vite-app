# Context Menu Operations - Backend Agent Handoff Report

**Date:** October 3, 2025  
**Issue:** HIGH PRIORITY ISSUE #4: Missing Context Menu Operations  
**From:** Frontend Agent  
**To:** Backend Agent  

---

## Executive Summary

The frontend implementation of the context menu operations is **COMPLETE** and operational. The context menu appears on right-click for both files and folders, displaying all required options. However, **three backend API endpoints** are required to enable full functionality.

**Frontend Status:** ✅ **100% Complete**  
**Backend Status:** ⚠️ **Pending Implementation**

---

## Frontend Implementation Summary

### ✅ Completed Components

1. **useContextMenu Hook** (`src/hooks/useContextMenu.ts`)
   - State management for context menu visibility
   - Position calculation with viewport boundary detection
   - Auto-close on outside click, scroll, resize
   - Keyboard navigation (ESC to close)

2. **ContextMenu Component** (`src/components/library/ContextMenu.tsx`)
   - Full Google Drive-like menu with 11 options
   - Proper icon integration (Lucide React)
   - Conditional rendering based on item type (file/folder)
   - Modal integration for complex operations
   - Smooth animations and transitions

3. **ShareModal Component** (`src/components/library/ShareModal.tsx`)
   - Link expiration selection (1, 7, 14, 30 days)
   - One-click copy to clipboard
   - Loading states and error handling
   - Visual feedback for successful copy

4. **MoveToModal Component** (`src/components/library/MoveToModal.tsx`)
   - Folder tree picker with scroll area
   - Root folder option
   - Prevention of circular moves
   - Bulk move support

5. **DetailsPanel Component** (`src/components/library/DetailsPanel.tsx`)
   - Slide-in sheet from right side
   - Comprehensive metadata display
   - File type icons and badges
   - Quick actions (download, star, share)
   - Location breadcrumb

6. **LibraryStore Extensions** (`src/store/libraryStore.ts`)
   - `downloadFile(fileId)` - Download functionality
   - `duplicateFile(fileId)` - File duplication
   - `starItem(itemId)` - Star/favorite toggle

7. **API Client Updates** (`src/api/filesApi.ts`)
   - `generateShareLink(fileId, expiresInDays)` - Frontend ready
   - `duplicateFile(fileId)` - Frontend ready
   - `toggleStarItem(itemId, starred)` - Frontend ready
   - `requestPresignedDownloadUrl(fileId)` - Already exists

8. **Type System Updates** (`src/types/library.ts`)
   - Added `starred?: boolean` property to BaseLibraryItem

9. **UI Components Added**
   - Select component (Shadcn/UI)
   - ScrollArea component (Shadcn/UI)
   - All other required UI primitives already existed

### ✅ Integration Points

- Context menu integrated into `LibraryPage.tsx`
- Event handler added to `DndLibraryGrid.tsx`
- `FileCard` and `FolderCard` already had `onContextMenu` support

---

## Required Backend Implementation

### 🔴 CRITICAL: Three API Endpoints Needed

#### 1. Generate Share Link
```typescript
/**
 * POST /api/files/:id/share
 * Generate a public shareable link with expiration
 */
Request Body:
{
  expiresInDays: number // 1, 7, 14, or 30
}

Response:
{
  success: true,
  data: {
    shareUrl: string,      // Pre-signed S3 URL or public link
    expiresAt: string      // ISO 8601 timestamp
  }
}
```

**Implementation Notes:**
- Use S3 `getSignedUrl` with expiration time
- Consider storing share metadata in database
- Set appropriate content-disposition headers
- Return full public URL, not just S3 key

**S3 Example:**
```typescript
const command = new GetObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: file.s3Key,
  ResponseContentDisposition: `attachment; filename="${file.name}"`,
});

const shareUrl = await getSignedUrl(s3Client, command, {
  expiresIn: expiresInDays * 24 * 60 * 60, // Convert days to seconds
});
```

---

#### 2. Duplicate File
```typescript
/**
 * POST /api/files/:id/duplicate
 * Create a copy of the file with new ID
 */
Response:
{
  success: true,
  data: {
    id: string,
    name: string,          // Original name + " (copy)"
    size: number,
    type: string,
    s3Key: string,         // New S3 key
    folderId: string | null,
    createdAt: string,
    updatedAt: string,
    // ... other FileMetadata fields
  }
}
```

**Implementation Notes:**
- Copy S3 object using `CopyObjectCommand`
- Generate new UUID for file ID
- Append " (copy)" to filename
- Create new database record
- Keep same folderId as original

**S3 Example:**
```typescript
const originalFile = await getFileMetadata(fileId);
const newFileId = uuidv4();
const newS3Key = `files/${newFileId}/${originalFile.name}`;

// Copy S3 object
await s3Client.send(new CopyObjectCommand({
  Bucket: process.env.S3_BUCKET,
  CopySource: `${process.env.S3_BUCKET}/${originalFile.s3Key}`,
  Key: newS3Key,
}));

// Create new file record
const duplicatedFile = await createFileMetadata({
  id: newFileId,
  name: `${originalFile.name} (copy)`,
  s3Key: newS3Key,
  size: originalFile.size,
  type: originalFile.type,
  folderId: originalFile.folderId,
});
```

---

#### 3. Toggle Star/Favorite
```typescript
/**
 * PUT /api/files/:id/star
 * Toggle star/favorite status for file or folder
 */
Request Body:
{
  starred: boolean
}

Response:
{
  success: true,
  message: "Item starred successfully" // or "Item unstarred successfully"
}
```

**Implementation Notes:**
- Add `starred` field to FileMetadata model (boolean, default false)
- Add `starred` field to Folder model (boolean, default false)
- Update file/folder record in database
- Consider adding starred items filter endpoint later

**Database Schema Update:**
```typescript
// backend/src/models/fileMetadata.model.ts
export interface FileMetadata {
  // ... existing fields
  starred?: boolean;  // Add this field
}

// backend/src/models/folder.model.ts
export interface Folder {
  // ... existing fields
  starred?: boolean;  // Add this field
}
```

---

## Already Working Features

### ✅ Download File
**Endpoint:** `POST /api/files/:id/download-url` ✅ **ALREADY EXISTS**

The download functionality is **fully operational**. Frontend calls:
```typescript
const { downloadUrl, fileName } = await requestPresignedDownloadUrl(fileId);
// Creates temporary <a> tag and triggers download
```

No backend changes needed for this feature.

---

### ✅ Move Files
**Endpoint:** `POST /api/files/bulk-move` ✅ **ALREADY EXISTS**

The move functionality uses the existing bulk-move endpoint and is **fully operational**.

---

### ✅ Rename & Delete
These operations use existing modals and endpoints. No changes needed.

---

## Testing Requirements for Backend Agent

### Unit Tests
```typescript
describe('Context Menu API Endpoints', () => {
  describe('POST /api/files/:id/share', () => {
    it('should generate share link with 7-day expiration');
    it('should generate share link with custom expiration');
    it('should return 404 for non-existent file');
    it('should validate expiration days range');
  });

  describe('POST /api/files/:id/duplicate', () => {
    it('should duplicate file with new ID');
    it('should append (copy) to filename');
    it('should copy S3 object successfully');
    it('should handle S3 copy failures');
    it('should return 404 for non-existent file');
  });

  describe('PUT /api/files/:id/star', () => {
    it('should star unstarred file');
    it('should unstar starred file');
    it('should work for folders');
    it('should return 404 for non-existent item');
  });
});
```

### Integration Tests
- Verify S3 object copying creates identical file
- Verify share links are accessible without authentication
- Verify share links expire correctly
- Verify starred items persist across server restarts

---

## Error Handling Requirements

All endpoints should follow the established error response format:

```typescript
{
  success: false,
  error: string,
  message?: string,
  timestamp: string
}
```

### Expected Error Cases

1. **Share Link Generation:**
   - File not found (404)
   - Invalid expiration days (400)
   - S3 signing failure (500)

2. **File Duplication:**
   - File not found (404)
   - S3 copy failure (500)
   - Database creation failure (500)
   - Insufficient storage (507)

3. **Star Toggle:**
   - Item not found (404)
   - Invalid starred value (400)
   - Database update failure (500)

---

## Frontend-Backend Contract

### API Client Location
`src/api/filesApi.ts` - All API functions are already defined and typed

### TypeScript Interfaces
```typescript
// Already defined in src/api/filesApi.ts
export interface ShareLinkResponse {
  shareUrl: string;
  expiresAt: string | Date;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  s3Key: string;
  folderId: string | null;
  starred?: boolean;  // Added for star feature
  createdAt: string | Date;
  updatedAt: string | Date;
  // ... other fields
}
```

### Expected Response Times
- Share link generation: < 500ms
- File duplication: < 2s (depends on file size)
- Star toggle: < 200ms

---

## Database Migration Needed

### Add Starred Field

**Files Table:**
```sql
ALTER TABLE files 
ADD COLUMN starred BOOLEAN DEFAULT FALSE;
```

**Folders Table:**
```sql
ALTER TABLE folders 
ADD COLUMN starred BOOLEAN DEFAULT FALSE;
```

---

## Implementation Priority

1. **HIGH:** Star/Favorite (simplest, no S3 interaction)
2. **HIGH:** Share Link Generation (moderate complexity)
3. **MEDIUM:** File Duplication (most complex, involves S3 copy)

---

## Verification Steps

Once backend endpoints are implemented:

1. ✅ Right-click any file → Share → Generate Link
   - Verify link is created
   - Verify copy-to-clipboard works
   - Verify link expires after selected duration

2. ✅ Right-click any file → Make a copy
   - Verify new file appears with "(copy)" suffix
   - Verify original file remains unchanged
   - Verify S3 object is actually copied

3. ✅ Right-click any item → Add to starred
   - Verify star icon appears in details panel
   - Verify starred state persists after page reload
   - Verify unstar works correctly

4. ✅ Right-click any file → Download
   - Already working, just verify it still works

5. ✅ Right-click any item → Details
   - Verify panel shows correct metadata
   - Verify all quick actions work

---

## Code References for Backend Agent

### Router Setup
Add to `backend/src/routes/files.routes.ts`:
```typescript
// Context menu operations
router.post('/:id/share', FilesController.generateShareLink);
router.post('/:id/duplicate', FilesController.duplicateFile);
router.put('/:id/star', FilesController.toggleStar);
```

### Controller Methods
Create in `backend/src/controllers/files.controller.ts`:
```typescript
export class FilesController {
  static async generateShareLink(req: Request, res: Response) { ... }
  static async duplicateFile(req: Request, res: Response) { ... }
  static async toggleStar(req: Request, res: Response) { ... }
}
```

---

## Questions for Backend Agent

1. Should share links be tracked in a separate `shares` table for analytics?
2. Should there be a maximum file size limit for duplication?
3. Should starred items have their own endpoint (`GET /api/files/starred`)?
4. Should share links be revocable (require database tracking)?

---

## Frontend Testing Completed

✅ Context menu appears on right-click  
✅ All menu items render correctly  
✅ Modals open for share, move, details, rename, delete  
✅ Context menu closes on outside click  
✅ Context menu closes on ESC key  
✅ Download triggers (pending backend URL generation)  
✅ Star toggle updates UI state  
✅ Move modal shows folder tree  
✅ Details panel displays metadata  
✅ TypeScript compilation passes  
✅ No runtime errors in browser console  
✅ Build succeeds without errors  

---

## Next Steps for Backend Agent

1. Review this handoff document
2. Add starred field to database schemas
3. Implement the three API endpoints
4. Test with frontend (dev server on port 5173)
5. Verify all error cases
6. Run integration tests
7. Update API documentation

---

## Contact Information

**Frontend Implementation:** All code in `src/components/library/` and `src/store/libraryStore.ts`  
**API Contracts:** Defined in `src/api/filesApi.ts`  
**Type Definitions:** `src/types/library.ts` and `src/api/filesApi.ts`

---

**Frontend Agent Sign-off:** Context menu frontend implementation complete and ready for backend integration. All UI components tested and operational. Backend Agent can proceed with API endpoint implementation.
