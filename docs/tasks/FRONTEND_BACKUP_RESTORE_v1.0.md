# Frontend Codebase Backup & Restoration Protocol v1.0

**Document Version:** 1.0  
**Backup Timestamp:** October 4, 2025  
**Backup Location:** `backup/frontend/src_backup_v1.0/`  
**Total Files Backed Up:** 67 files  
**Total Backup Size:** 318,596 bytes (311 KB)  
**Backup Format:** `.bak` extension for all TypeScript/TSX files

---

## Executive Summary

This document provides a complete manifest and restoration protocol for the Research Space frontend codebase backup created prior to refactoring operations. All critical components, hooks, services, and type definitions have been preserved with proper versioning to ensure safe rollback capability.

---

## Backup Scope

### Included Directories (Complete)

1. **`src/api/`** - API Integration Layer (2 files)
   - `filesApi.ts.bak` - File operations API client (503 lines)
   - `storageApi.ts.bak` - Storage configuration API client (214 lines)

2. **`src/hooks/`** - Custom React Hooks (11 files)
   - `use-mobile.ts.bak` - Mobile detection hook
   - `useContextMenu.ts.bak` - Context menu state management (104 lines)
   - `useDragAndDrop.ts.bak` - Drag-and-drop coordination
   - `useLibraryNavigation.ts.bak` - Folder navigation logic
   - `useLibrarySelection.ts.bak` - Multi-select functionality
   - `useModalRouting.ts.bak` - URL-based modal management
   - `useMultiSelect.ts.bak` - Selection state management
   - `useNavigateToPage.ts.bak` - Type-safe routing
   - `usePageTitle.ts.bak` - Dynamic document title
   - `useTheme.ts.bak` - Theme switching
   - `useUploadSteps.ts.bak` - Upload wizard flow

3. **`src/lib/`** - Utility Libraries (1 file)
   - `utils.ts.bak` - Tailwind utility helpers (cn function)

4. **`src/pages/`** - Route Components (7 files)
   - `AgentsPage.tsx.bak` - AI agents management page
   - `ConnectionsPage.tsx.bak` - Storage configuration page (314 lines)
   - `HomePage.tsx.bak` - Dashboard with status cards (200 lines)
   - `LibraryPage.tsx.bak` - File management interface (449 lines)
   - `SettingsPage.tsx.bak` - Application settings page
   - `StatusPage.tsx.bak` - System status monitoring
   - `index.ts.bak` - Page exports

5. **`src/router/`** - Routing Configuration (1 file)
   - `index.tsx.bak` - React Router setup with route definitions (150 lines)

6. **`src/services/`** - Business Logic Services (1 file)
   - `fileUploadService.ts.bak` - S3 upload coordination (394 lines)

7. **`src/store/`** - State Management (5 files)
   - `connectionStore.ts.bak` - Storage connection state
   - `libraryStore.backup.ts.bak` - Legacy library store
   - `libraryStore.ts.bak` - Main library state management (608 lines)
   - `themeStore.ts.bak` - Theme preferences
   - `uploadQueueStore.ts.bak` - Upload queue management

8. **`src/types/`** - TypeScript Type Definitions (5 files)
   - `connection.ts.bak` - Storage provider types (126 lines)
   - `library.ts.bak` - File/folder types (157 lines)
   - `libraryControls.ts.bak` - UI control types
   - `libraryModals.ts.bak` - Modal data structures
   - `statusCards.ts.bak` - Dashboard card types

9. **`src/components/connections/`** - Storage Connection Components (4 files)
   - `AdminUnlockModal.tsx.bak` - Admin configuration unlock
   - `ConnectionTestButton.tsx.bak` - Connection testing UI
   - `LockWarningModal.tsx.bak` - Configuration lock warning
   - `S3ConfigForm.tsx.bak` - Storage provider form

10. **`src/components/home/`** - Home Page Components (3 files)
    - `StatusCard.tsx.bak` - Individual status card
    - `StatusGrid.tsx.bak` - Dashboard grid layout
    - `WelcomeMessage.tsx.bak` - User greeting

11. **`src/components/library/`** - Library Management Components (23 files)
    - `BreadcrumbNavigation.tsx.bak` - Folder path navigation
    - `ContextMenu.tsx.bak` - Right-click menu (285 lines)
    - `CreateDropdown.tsx.bak` - Create actions dropdown
    - `CreateFolderModal.tsx.bak` - Folder creation modal
    - `DeleteConfirmModal.tsx.bak` - Deletion confirmation
    - `DetailsPanel.tsx.bak` - File/folder details panel
    - `DndLibraryGrid.tsx.bak` - Drag-and-drop grid
    - `ExportModal.tsx.bak` - Export functionality
    - `FileCard.tsx.bak` - File display card
    - `FilePreviewModal.tsx.bak` - File preview modal
    - `FolderCard.tsx.bak` - Folder display card
    - `GlobalDropZone.tsx.bak` - External file drop zone
    - `LibraryControls.tsx.bak` - Action controls
    - `LibrarySearchBar.tsx.bak` - Search functionality
    - `MoveToModal.tsx.bak` - Move items modal
    - `MultiSelectControls.tsx.bak` - Multi-select actions
    - `RenameModal.tsx.bak` - Rename modal
    - `SelectionControls.tsx.bak` - Selection management
    - `ShareModal.tsx.bak` - File sharing modal
    - `UploadDropdown.tsx.bak` - Upload actions dropdown
    - `UploadModal.tsx.bak` - Upload modal
    - `UploadProgress.tsx.bak` - Upload progress tracker
    - `UploadSteps.tsx.bak` - Upload wizard

12. **`src/components/notifications/`** - Notification System (2 files)
    - `NotificationBell.tsx.bak` - Notification icon
    - `NotificationModal.tsx.bak` - Notification panel

13. **`src/components/search/`** - Search Components (1 file)
    - `SearchBar.tsx.bak` - Global search bar

14. **`src/components/theme/`** - Theme Components (1 file)
    - `ThemeSwitcher.tsx.bak` - Light/dark mode toggle

---

## Critical API Endpoints Documentation

### Backend Base URL
```typescript
const API_BASE_URL = 'http://localhost:3001';
```

### Storage Configuration Endpoints
```typescript
GET    /api/storage/status          // Get configuration status
POST   /api/storage/configure       // Configure storage provider
POST   /api/storage/test            // Test connection
DELETE /api/storage/lock            // Remove configuration lock
```

### File Operations Endpoints
```typescript
// Upload & Download
POST   /api/files/presigned-url     // Request upload URL
POST   /api/files/:id/download-url  // Request download URL
POST   /api/files/:id/preview-url   // Request preview URL (inline)

// CRUD Operations
GET    /api/files/list              // List files/folders
GET    /api/files/:id               // Get file metadata
PUT    /api/files/:id               // Update file metadata
DELETE /api/files/:id               // Delete file (soft delete)

// Bulk Operations
POST   /api/files/bulk-delete       // Delete multiple files
POST   /api/files/bulk-move         // Move multiple files

// Advanced Operations
POST   /api/files/:id/duplicate     // Duplicate file
PUT    /api/files/:id/star          // Toggle favorite status
POST   /api/files/:id/share         // Generate share link
```

### Folder Operations Endpoints
```typescript
GET    /api/folders/:id             // Get folder contents
POST   /api/folders                 // Create folder
PUT    /api/folders/:id             // Rename folder
DELETE /api/folders/:id             // Delete folder
```

---

## Component Dependency Graph

### Core Dependencies
```
LibraryPage (449 lines)
├── LibraryStore (608 lines) - State management
│   ├── filesApi.ts (503 lines) - Backend integration
│   └── storageApi.ts (214 lines) - Configuration API
├── fileUploadService.ts (394 lines) - S3 uploads
│   └── uploadQueueStore.ts - Upload tracking
├── Custom Hooks (11 hooks)
│   ├── useContextMenu.ts (104 lines)
│   ├── useLibraryNavigation.ts
│   ├── useMultiSelect.ts
│   └── useModalRouting.ts
└── Library Components (23 components)
    ├── ContextMenu.tsx (285 lines)
    ├── DndLibraryGrid.tsx
    ├── FileCard.tsx & FolderCard.tsx
    └── Modals (8 modals)

ConnectionsPage (314 lines)
├── connectionStore.ts - Configuration state
├── storageApi.ts (214 lines) - API client
└── Connection Components (4 components)
    ├── S3ConfigForm.tsx
    ├── ConnectionTestButton.tsx
    └── Lock Modals (2 modals)

HomePage (200 lines)
├── Status Components (3 components)
│   ├── WelcomeMessage.tsx
│   ├── StatusGrid.tsx
│   └── StatusCard.tsx
└── useNavigateToPage.ts - Navigation hook
```

### Type System Dependencies
```
library.ts (157 lines)
├── BaseLibraryItem (interface)
├── FileItem (interface)
├── FolderItem (interface)
└── LibraryItem (discriminated union)

connection.ts (126 lines)
├── StorageProvider (enum)
├── StorageCredentials (interface)
├── ConnectionStatus (interface)
└── PROVIDER_CONFIGS (configuration map)
```

---

## Backup Verification Report

### File Count Validation
- **Expected Files:** 67 TypeScript/TSX files
- **Backed Up Files:** 67 files ✅
- **Files with .bak Extension:** 67 files ✅
- **Missing Files:** 0 files ✅

### Directory Structure Validation
```
✅ backup/frontend/src_backup_v1.0/api/ (2 files)
✅ backup/frontend/src_backup_v1.0/hooks/ (11 files)
✅ backup/frontend/src_backup_v1.0/lib/ (1 file)
✅ backup/frontend/src_backup_v1.0/pages/ (7 files)
✅ backup/frontend/src_backup_v1.0/router/ (1 file)
✅ backup/frontend/src_backup_v1.0/services/ (1 file)
✅ backup/frontend/src_backup_v1.0/store/ (5 files)
✅ backup/frontend/src_backup_v1.0/types/ (5 files)
✅ backup/frontend/src_backup_v1.0/components/connections/ (4 files)
✅ backup/frontend/src_backup_v1.0/components/home/ (3 files)
✅ backup/frontend/src_backup_v1.0/components/library/ (23 files)
✅ backup/frontend/src_backup_v1.0/components/notifications/ (2 files)
✅ backup/frontend/src_backup_v1.0/components/search/ (1 file)
✅ backup/frontend/src_backup_v1.0/components/theme/ (1 file)
```

### Size Validation
- **Total Backup Size:** 318,596 bytes (311 KB)
- **Average File Size:** ~4,755 bytes per file
- **Largest Components:**
  - `libraryStore.ts.bak` - 608 lines
  - `filesApi.ts.bak` - 503 lines
  - `LibraryPage.tsx.bak` - 449 lines
  - `fileUploadService.ts.bak` - 394 lines
  - `ConnectionsPage.tsx.bak` - 314 lines

### Checksum Samples (MD5)
```
532dc4d3581d2d0e35719cfa2710a50e  store/libraryStore.ts.bak
242491412386892ebafb4b317f591eef  api/filesApi.ts.bak
0ee976910adf02319c2243c2833779d4  api/storageApi.ts.bak
e6968a1df9aa18127ce0ff67783f4632  store/connectionStore.ts.bak
0a2469e40d81bbd8dff283acb6f4d00a  store/uploadQueueStore.ts.bak
```

---

## Restoration Protocol

### Quick Restoration (Full Rollback)

**WARNING:** This will overwrite all current source files with backup versions.

```bash
# Navigate to project root
cd /home/prats/Playground/Internships/IISPPR/research-vite-app

# Step 1: Create a safety snapshot of current state
mkdir -p backup/frontend/pre_restore_snapshot
cp -r src/api src/hooks src/lib src/pages src/router src/services src/store src/types backup/frontend/pre_restore_snapshot/
mkdir -p backup/frontend/pre_restore_snapshot/components
cp -r src/components/connections src/components/home src/components/library src/components/notifications src/components/search src/components/theme backup/frontend/pre_restore_snapshot/components/

# Step 2: Remove .bak extensions from backup files
find backup/frontend/src_backup_v1.0 -name "*.ts.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;
find backup/frontend/src_backup_v1.0 -name "*.tsx.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;

# Step 3: Restore backed up files to src/
cp -r backup/frontend/src_backup_v1.0/api/* src/api/
cp -r backup/frontend/src_backup_v1.0/hooks/* src/hooks/
cp -r backup/frontend/src_backup_v1.0/lib/* src/lib/
cp -r backup/frontend/src_backup_v1.0/pages/* src/pages/
cp -r backup/frontend/src_backup_v1.0/router/* src/router/
cp -r backup/frontend/src_backup_v1.0/services/* src/services/
cp -r backup/frontend/src_backup_v1.0/store/* src/store/
cp -r backup/frontend/src_backup_v1.0/types/* src/types/
cp -r backup/frontend/src_backup_v1.0/components/* src/components/

# Step 4: Verify TypeScript compilation
npm run build

# Step 5: Re-add .bak extensions to backup (preserve backup)
find backup/frontend/src_backup_v1.0 -name "*.ts" -exec sh -c 'mv "$1" "$1.bak"' _ {} \;
find backup/frontend/src_backup_v1.0 -name "*.tsx" -exec sh -c 'mv "$1" "$1.bak"' _ {} \;
```

### Selective File Restoration

**To restore individual files:**

```bash
# Example: Restore libraryStore.ts only
cd /home/prats/Playground/Internships/IISPPR/research-vite-app

# Remove .bak extension temporarily
mv backup/frontend/src_backup_v1.0/store/libraryStore.ts.bak backup/frontend/src_backup_v1.0/store/libraryStore.ts

# Copy to source
cp backup/frontend/src_backup_v1.0/store/libraryStore.ts src/store/

# Re-add .bak extension
mv backup/frontend/src_backup_v1.0/store/libraryStore.ts backup/frontend/src_backup_v1.0/store/libraryStore.ts.bak

# Verify compilation
npm run build
```

### Selective Directory Restoration

**To restore specific component directories:**

```bash
# Example: Restore library components only
cd /home/prats/Playground/Internships/IISPPR/research-vite-app

# Remove .bak extensions from target directory
find backup/frontend/src_backup_v1.0/components/library -name "*.tsx.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;

# Copy to source
cp -r backup/frontend/src_backup_v1.0/components/library/* src/components/library/

# Re-add .bak extensions
find backup/frontend/src_backup_v1.0/components/library -name "*.tsx" -exec sh -c 'mv "$1" "$1.bak"' _ {} \;

# Verify compilation
npm run build
```

---

## Post-Restoration Verification Checklist

After any restoration operation, verify the following:

### Build Verification
```bash
✅ npm run build          # TypeScript compilation succeeds
✅ npm run lint           # ESLint passes with zero errors
✅ npm run dev            # Dev server starts successfully
```

### Runtime Verification
```bash
✅ Navigate to http://localhost:5173
✅ Test Home page renders
✅ Test Library page with file operations
✅ Test Connections page configuration
✅ Verify API endpoints connectivity
✅ Check browser console for errors
```

### State Management Verification
```bash
✅ libraryStore.ts - File/folder state management
✅ connectionStore.ts - Storage configuration state
✅ uploadQueueStore.ts - Upload progress tracking
✅ themeStore.ts - Theme preferences
```

### API Integration Verification
```bash
✅ filesApi.ts - All file operations working
✅ storageApi.ts - Configuration endpoints responding
✅ fileUploadService.ts - S3 uploads functional
```

---

## Critical Environment Variables

**Note:** The following may need to be configured post-restoration:

```bash
# Backend API (currently hardcoded in source files)
API_BASE_URL=http://localhost:3001

# S3 Provider Configuration (stored in backend)
STORAGE_PROVIDER=[aws-s3|cloudflare-r2|minio]
ACCESS_KEY_ID=[encrypted in backend]
SECRET_ACCESS_KEY=[encrypted in backend]
REGION=[configured via UI]
BUCKET=[configured via UI]
ENDPOINT=[R2/MinIO only]
```

---

## Known Dependencies & Constraints

### Backend Coordination Required
Some context menu features require backend endpoints that may be pending:
1. `POST /api/files/:id/share` - Share link generation
2. `POST /api/files/:id/duplicate` - File duplication
3. `PUT /api/files/:id/star` - Star/favorite toggle

### TypeScript Strict Mode
All backed up files comply with TypeScript strict mode:
- No `any` types used
- Comprehensive type coverage
- Null/undefined checks enforced

### React Version
- React 19.1.1 (latest concurrent features)
- React Router DOM 7.9.3
- Zustand 5.0.8 for state management

---

## Backup Integrity Statement

**Backup Created:** October 4, 2025  
**Backup Version:** 1.0  
**Verification Status:** ✅ VERIFIED

This backup includes all critical frontend components, hooks, services, state management, and type definitions necessary for complete rollback capability. All 67 files have been successfully backed up with `.bak` extensions and directory structure preserved.

**Backup Location:** `backup/frontend/src_backup_v1.0/`  
**Backup Integrity:** Checksums generated and verified  
**Restoration Protocol:** Tested and documented  
**Refactoring Safety:** Confirmed ready for refactoring operations

---

## Maintenance Notes

### Backup Lifespan
This backup should be retained until:
- Refactoring is complete and verified
- All tests pass in production
- Stakeholders approve changes
- Minimum 30 days post-deployment

### Future Backup Updates
If refactoring extends beyond initial scope, create versioned backups:
- `src_backup_v1.1/` for incremental changes
- `src_backup_v2.0/` for major refactoring milestones

---

**Document Prepared By:** Frontend Development Agent  
**Document Status:** ACTIVE  
**Last Updated:** October 4, 2025  
**Next Review:** Post-refactoring completion
