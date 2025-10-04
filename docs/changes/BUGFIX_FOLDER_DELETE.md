# Bugfix: Folder Delete Not Working

**Date**: October 4, 2025  
**Issue**: Deleted folders reappearing after page refresh  
**Status**: ✅ FIXED

---

## Problem Description

When deleting a folder from the Library page, the folder would reappear after refreshing the page, even though the delete action appeared to succeed in the UI.

### User Report
- Created folder "Prisma Post"
- Attempted to delete it
- Folder disappeared temporarily
- After refresh, folder reappeared

### Backend Logs Analysis
```
[2025-10-04T17:09:39.471Z] GET /api/files/list
[2025-10-04T17:09:39.505Z] GET /api/files/list
[2025-10-04T17:09:44.210Z] POST /api/files/bulk-delete  ← WRONG ENDPOINT
[2025-10-04T17:09:47.036Z] GET /api/files/list
[2025-10-04T17:09:47.051Z] GET /api/files/list
```

### Database Investigation
```sql
SELECT * FROM folders WHERE name LIKE '%Prisma%';

-- Result:
{
  "id": "9d2b0b8a-dc78-4058-8182-9895871d9281",
  "name": "Prisma Post",
  "parentId": null,
  "path": "/Prisma Post",
  "deletedAt": null  ← NEVER DELETED!
}
```

---

## Root Cause

The frontend was calling the **wrong API endpoint** when deleting folders.

### Incorrect Behavior
```typescript
// src/store/libraryStore.ts (OLD CODE)
deleteItems: async (itemIds: string[]) => {
  await get().bulkDelete(itemIds);  // ❌ Only deletes FILES, not folders!
},
```

### What Happened
1. User selected folder "Prisma Post" for deletion
2. Frontend called `deleteItems(['9d2b0b8a-dc78-4058-8182-9895871d9281'])`
3. `deleteItems` called `bulkDelete` which calls `/api/files/bulk-delete`
4. Backend correctly returned success (0 files deleted)
5. Frontend removed folder from UI state
6. Database never updated (folder still has `deletedAt: null`)
7. On refresh, folder reappeared from database

### API Endpoint Mismatch

| Item Type | Correct Endpoint | Called Endpoint | Result |
|-----------|-----------------|-----------------|--------|
| File | `POST /api/files/bulk-delete` | ✅ Correct | Works |
| Folder | `DELETE /api/folders/:id` | ❌ `POST /api/files/bulk-delete` | **Fails silently** |

---

## Solution

Updated the `deleteItems` function to properly handle both files and folders:

### Fixed Code
```typescript
// src/store/libraryStore.ts (NEW CODE)
deleteItems: async (itemIds: string[]) => {
  const items = get().items;
  const fileIds: string[] = [];
  const folderIds: string[] = [];
  
  // Separate files and folders
  itemIds.forEach((id) => {
    const item = items[id];
    if (item) {
      if (item.type === 'file') {
        fileIds.push(id);
      } else if (item.type === 'folder') {
        folderIds.push(id);
      }
    }
  });
  
  // Delete files in bulk
  if (fileIds.length > 0) {
    await get().bulkDelete(fileIds);
  }
  
  // Delete folders individually
  for (const folderId of folderIds) {
    await get().deleteFolder(folderId);
  }
  
  // Clear selection
  set({ selectedItemIds: [] });
},
```

### What Changed
1. ✅ Separate file IDs and folder IDs
2. ✅ Call `bulkDelete()` for files → `POST /api/files/bulk-delete`
3. ✅ Call `deleteFolder()` for folders → `DELETE /api/folders/:id`
4. ✅ Clear selection after deletion

---

## API Endpoints Used

### File Deletion (Bulk)
```http
POST /api/files/bulk-delete
Content-Type: application/json

{
  "fileIds": ["file-id-1", "file-id-2"]
}
```

### Folder Deletion (Individual)
```http
DELETE /api/folders/:folderId
```

**Note**: Folder deletion is recursive and uses soft delete, marking the folder and all descendants with `deletedAt` timestamp.

---

## Testing

### Test Case 1: Delete Single Folder
1. ✅ Create folder "Test Folder"
2. ✅ Select and delete folder
3. ✅ Folder calls `DELETE /api/folders/:id`
4. ✅ Database updated with `deletedAt`
5. ✅ Folder removed from UI
6. ✅ Refresh page → folder stays deleted

### Test Case 2: Delete Multiple Items (Mixed)
1. ✅ Select 2 files + 1 folder
2. ✅ Delete selection
3. ✅ Files call `POST /api/files/bulk-delete`
4. ✅ Folder calls `DELETE /api/folders/:id`
5. ✅ All items properly deleted
6. ✅ Refresh page → all stay deleted

### Test Case 3: Delete Nested Folder
1. ✅ Create parent folder with children
2. ✅ Delete parent folder
3. ✅ Parent and all children soft-deleted (cascading)
4. ✅ Refresh page → folder hierarchy stays deleted

---

## Database Cleanup

The stuck "Prisma Post" folder was manually cleaned up:

```sql
UPDATE folders 
SET deletedAt = CURRENT_TIMESTAMP 
WHERE id = '9d2b0b8a-dc78-4058-8182-9895871d9281';
```

---

## Files Modified

### Frontend
- **src/store/libraryStore.ts** (1 function updated)
  - `deleteItems()` - Now handles both files and folders correctly

### Backend
- No changes required (endpoints already correct)

---

## Verification

### Before Fix
```
1. Create folder "Prisma Post"
2. Delete folder
3. Backend receives: POST /api/files/bulk-delete ❌
4. Folder.deletedAt = null (unchanged)
5. Refresh → folder reappears ❌
```

### After Fix
```
1. Create folder "Test Folder"
2. Delete folder
3. Backend receives: DELETE /api/folders/:id ✅
4. Folder.deletedAt = 2025-10-04T17:15:00.000Z ✅
5. Refresh → folder stays deleted ✅
```

---

## Lessons Learned

### Type Safety
The bug occurred because `deleteItems` accepted generic `itemIds` without checking item types. The fix explicitly checks each item's type before routing to the correct deletion method.

### API Design
- Bulk operations work well for files (homogeneous items)
- Folders require individual deletion due to cascading logic
- Mixed selections need type-aware routing

### Testing Gaps
- No integration test covering mixed file/folder deletion
- Manual testing focused on single-type selections
- Database state not verified after deletion operations

---

## Prevention

### Recommended Tests
1. Add integration test: Delete mixed files + folders
2. Add E2E test: Verify database state after deletion
3. Add unit test: `deleteItems` with different item type combinations

### Code Review Checklist
- [ ] Verify correct API endpoints used for each item type
- [ ] Check database state after operations
- [ ] Test with mixed item selections
- [ ] Verify soft delete behavior

---

## Status

✅ **FIXED** - Folder deletion now works correctly with proper endpoint routing

**Tested**: October 4, 2025  
**Deployed**: Ready for deployment  
**Impact**: HIGH - Core functionality restored
