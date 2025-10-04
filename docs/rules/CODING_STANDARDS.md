# Research Space - TypeScript & TSX Coding Standards

**Document Version:** 1.0  
**Effective Date:** October 4, 2025  
**Status:** ✅ ACTIVE  
**Scope:** All TypeScript and TSX files in the project  
**Enforcement:** Mandatory for all agents and contributors  

---

## Table of Contents

1. [TypeScript File Naming Conventions](#typescript-file-naming-conventions)
2. [TSX File Naming Conventions](#tsx-file-naming-conventions)
3. [Folder Structure & Organization](#folder-structure--organization)
4. [TypeScript Coding Standards](#typescript-coding-standards)
5. [React & TSX Coding Standards](#react--tsx-coding-standards)
6. [Import & Export Patterns](#import--export-patterns)
7. [State Management Patterns](#state-management-patterns)
8. [API Integration Patterns](#api-integration-patterns)
9. [Type Safety & Type Definitions](#type-safety--type-definitions)
10. [Performance Best Practices](#performance-best-practices)
11. [Documentation Standards](#documentation-standards)
12. [Testing Conventions](#testing-conventions)
13. [Git Commit Standards](#git-commit-standards)

---

## TypeScript File Naming Conventions

### General Rules

```typescript
// ✅ CORRECT - camelCase for TypeScript files
myService.ts
userProfile.ts
fileUploadHelper.ts
dashboardService.ts

// ❌ INCORRECT - Avoid PascalCase for non-component files
MyService.ts
UserProfile.ts
FileUploadHelper.ts
```

### Service Files

```typescript
// Pattern: {domain}Service.ts
dashboardService.ts      // ✅ Dashboard data fetching service
fileUploadService.ts     // ✅ File upload coordination service
analyticsService.ts      // ✅ Analytics data service

// Location: src/services/
src/services/dashboardService.ts
src/services/fileUploadService.ts
```

### Store Files (Zustand)

```typescript
// Pattern: {domain}Store.ts
libraryStore.ts          // ✅ Library state management
connectionStore.ts       // ✅ Connection state management
uploadQueueStore.ts      // ✅ Upload queue state
themeStore.ts            // ✅ Theme preferences

// Location: src/store/
src/store/libraryStore.ts
src/store/connectionStore.ts
```

### Type Definition Files

```typescript
// Pattern: {domain}.ts (descriptive, plural if multiple types)
library.ts               // ✅ Library-related types
connection.ts            // ✅ Connection types
libraryControls.ts       // ✅ Library control types
libraryModals.ts         // ✅ Library modal types

// Location: src/types/
src/types/library.ts
src/types/connection.ts
```

### Hook Files

```typescript
// Pattern: use{Name}.ts (camelCase starting with 'use')
useDashboardStats.ts     // ✅ Dashboard statistics hook
useLibraryNavigation.ts  // ✅ Library navigation logic
useLibrarySelection.ts   // ✅ Selection management hook
useModalRouting.ts       // ✅ Modal routing hook
useMultiSelect.ts        // ✅ Multi-select functionality
use-mobile.ts            // ✅ Mobile detection (kebab-case acceptable for primitives)

// Location: src/hooks/
src/hooks/useDashboardStats.ts
src/hooks/useLibraryNavigation.ts
```

### API Client Files

```typescript
// Pattern: {resource}Api.ts
filesApi.ts              // ✅ File operations API client
storageApi.ts            // ✅ Storage configuration API client
usersApi.ts              // ✅ User operations API client

// Location: src/api/
src/api/filesApi.ts
src/api/storageApi.ts
```

### Configuration Files

```typescript
// Pattern: {purpose}.ts (descriptive lowercase)
navigation.ts            // ✅ Navigation configuration
constants.ts             // ✅ Application constants
config.ts                // ✅ General configuration

// Location: src/config/
src/config/navigation.ts
src/config/constants.ts
```

### Utility Files

```typescript
// Pattern: descriptive lowercase or camelCase
utils.ts                 // ✅ General utilities
formatters.ts            // ✅ Formatting utilities
validators.ts            // ✅ Validation utilities

// Location: src/lib/ or src/utils/
src/lib/utils.ts
src/utils/formatters.ts
```

---

## TSX File Naming Conventions

### Component Files (Feature-Specific)

```tsx
// Pattern: PascalCase.tsx for all React components
HomePage.tsx             // ✅ Page component
LibraryPage.tsx          // ✅ Page component
StatusCard.tsx           // ✅ Reusable component
FilePreviewModal.tsx     // ✅ Modal component
LibraryControls.tsx      // ✅ Feature component

// Location: Organized by feature domain
src/pages/HomePage.tsx
src/components/home/StatusCard.tsx
src/components/library/FilePreviewModal.tsx
src/components/library/LibraryControls.tsx
```

### UI Primitive Components (Shadcn/UI)

```tsx
// Pattern: kebab-case.tsx for UI primitives
button.tsx               // ✅ Shadcn button primitive
input.tsx                // ✅ Shadcn input primitive
dialog.tsx               // ✅ Shadcn dialog primitive
card.tsx                 // ✅ Shadcn card primitive
sidebar.tsx              // ✅ Shadcn sidebar primitive

// Location: src/components/ui/
src/components/ui/button.tsx
src/components/ui/input.tsx
src/components/ui/dialog.tsx
```

### Layout Components

```tsx
// Pattern: PascalCase.tsx
Layout.tsx               // ✅ Main layout wrapper
RouteLoadingFallback.tsx // ✅ Loading component
AppSidebar.tsx           // ✅ Application sidebar (note: app- prefix for non-primitive)
NavUser.tsx              // ✅ Navigation user component

// Location: src/components/layout/
src/components/layout/Layout.tsx
src/components/layout/RouteLoadingFallback.tsx
```

### Modal Components

```tsx
// Pattern: {Name}Modal.tsx
UploadModal.tsx          // ✅ Upload functionality modal
FilePreviewModal.tsx     // ✅ File preview modal
ShareModal.tsx           // ✅ Share functionality modal
RenameModal.tsx          // ✅ Rename functionality modal

// Location: src/components/{feature}/
src/components/library/UploadModal.tsx
src/components/library/FilePreviewModal.tsx
```

### Page Components

```tsx
// Pattern: {Name}Page.tsx
HomePage.tsx             // ✅ Home/Dashboard page
LibraryPage.tsx          // ✅ Library management page
AgentsPage.tsx           // ✅ Agents page
ConnectionsPage.tsx      // ✅ Storage connections page
StatusPage.tsx           // ✅ System status page
SettingsPage.tsx         // ✅ Settings page

// Location: src/pages/
src/pages/HomePage.tsx
src/pages/LibraryPage.tsx
```

---

## Folder Structure & Organization

### Project Root Structure

```
research-vite-app/
├── src/                          # Source code
│   ├── api/                      # API client layer
│   ├── assets/                   # Static assets (images, fonts)
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/UI primitives (kebab-case)
│   │   ├── layout/               # Layout components (PascalCase)
│   │   ├── home/                 # Home page components
│   │   ├── library/              # Library feature components
│   │   ├── connections/          # Connections feature components
│   │   ├── notifications/        # Notifications feature components
│   │   ├── search/               # Search feature components
│   │   └── theme/                # Theme feature components
│   ├── config/                   # Configuration files
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   ├── pages/                    # Page components
│   ├── router/                   # React Router configuration
│   ├── services/                 # Business logic services
│   ├── store/                    # Zustand state stores
│   ├── types/                    # TypeScript type definitions
│   ├── App.tsx                   # Root React component
│   ├── App.css                   # Root styles
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Public static assets
├── docs/                         # Documentation
│   ├── plans/                    # Planning documents
│   ├── reports/                  # Completion reports
│   ├── rules/                    # Standards and conventions
│   └── tasks/                    # Task documentation
├── backup/                       # Backup files
├── dist/                         # Build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── components.json               # Shadcn configuration
├── eslint.config.js              # ESLint configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node-specific TS config
└── vite.config.ts                # Vite build configuration
```

### Feature-Based Component Organization

```typescript
// ✅ CORRECT - Feature-based organization
src/components/library/
├── LibraryControls.tsx           // Control panel
├── LibraryGrid.tsx               // Grid view
├── LibraryList.tsx               // List view
├── FileItem.tsx                  // File item component
├── FolderItem.tsx                // Folder item component
├── UploadModal.tsx               // Upload modal
├── FilePreviewModal.tsx          // Preview modal
├── ShareModal.tsx                // Share modal
├── RenameModal.tsx               // Rename modal
├── DetailsPanel.tsx              // Details sidebar
└── UploadProgress.tsx            // Upload progress tracker

// ❌ INCORRECT - Flat organization without grouping
src/components/
├── LibraryControls.tsx
├── LibraryGrid.tsx
├── FileItem.tsx
├── FolderItem.tsx
├── UploadModal.tsx
├── HomePageCard.tsx
├── ConnectionsForm.tsx
└── ... (all components mixed)
```

### Naming Patterns by Location

| Location | Pattern | Example | Purpose |
|----------|---------|---------|---------|
| `src/api/` | `{resource}Api.ts` | `filesApi.ts` | API client |
| `src/components/ui/` | `kebab-case.tsx` | `button.tsx` | UI primitive |
| `src/components/{feature}/` | `PascalCase.tsx` | `FileItem.tsx` | Feature component |
| `src/components/layout/` | `PascalCase.tsx` | `Layout.tsx` | Layout component |
| `src/config/` | `lowercase.ts` | `navigation.ts` | Configuration |
| `src/hooks/` | `use{Name}.ts` | `useDashboardStats.ts` | Custom hook |
| `src/lib/` | `lowercase.ts` | `utils.ts` | Utility |
| `src/pages/` | `{Name}Page.tsx` | `HomePage.tsx` | Page component |
| `src/router/` | `lowercase.tsx` | `index.tsx` | Router config |
| `src/services/` | `{domain}Service.ts` | `dashboardService.ts` | Service layer |
| `src/store/` | `{domain}Store.ts` | `libraryStore.ts` | State store |
| `src/types/` | `lowercase.ts` | `library.ts` | Type definitions |

---

## TypeScript Coding Standards

### Type Safety

```typescript
// ✅ CORRECT - Explicit types, no 'any'
interface DashboardStats {
  library: {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    recentActivity: number;
  };
  agents: {
    active: number;
    total: number;
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/dashboard/stats');
  return response.json() as DashboardStats;
}

// ❌ INCORRECT - Using 'any' or no types
export async function fetchDashboardStats(): Promise<any> {
  const response = await fetch('/api/dashboard/stats');
  return response.json();
}
```

### Strict Null Checking

```typescript
// ✅ CORRECT - Proper null/undefined handling
interface User {
  name: string;
  email: string;
  avatar?: string; // Optional property
}

function getUserAvatar(user: User): string {
  return user.avatar ?? '/default-avatar.png';
}

// ❌ INCORRECT - No null handling
function getUserAvatar(user: User): string {
  return user.avatar; // Type error if avatar is undefined
}
```

### Type Guards

```typescript
// ✅ CORRECT - Type guards for runtime safety
export interface FileItem extends BaseLibraryItem {
  type: 'file';
  size: number;
}

export interface FolderItem extends BaseLibraryItem {
  type: 'folder';
  itemCount: number;
}

export type LibraryItem = FileItem | FolderItem;

export function isFileItem(item: LibraryItem): item is FileItem {
  return item.type === 'file';
}

export function isFolderItem(item: LibraryItem): item is FolderItem {
  return item.type === 'folder';
}

// Usage
const item: LibraryItem = getItem();
if (isFileItem(item)) {
  console.log(item.size); // ✅ TypeScript knows item is FileItem
}
```

### Generics Usage

```typescript
// ✅ CORRECT - Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function apiRequest<T>(
  endpoint: string
): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint);
  return response.json() as ApiResponse<T>;
}

// Usage with type safety
const response = await apiRequest<DashboardStats>('/api/dashboard/stats');
if (response.success && response.data) {
  console.log(response.data.library.totalFiles); // ✅ Fully typed
}
```

### Enums vs Union Types

```typescript
// ✅ PREFERRED - Union types with 'as const'
export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrderType = typeof SortOrder[keyof typeof SortOrder];

// Alternative: String literal union
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';
export type FileType = 'pdf' | 'image' | 'document' | 'other';

// ⚠️ ACCEPTABLE but less preferred - Traditional enums
enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
```

### Interface vs Type

```typescript
// ✅ PREFERRED - Interfaces for object shapes
export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

// ✅ CORRECT - Types for unions, intersections, primitives
export type LibraryItem = FileItem | FolderItem;
export type SortOrder = 'asc' | 'desc';
export type IconType = typeof Home | typeof Library | typeof Bot;

// ✅ CORRECT - Extending interfaces
export interface FileItem extends BaseLibraryItem {
  type: 'file';
  size: number;
  extension: string;
}

// ✅ CORRECT - Intersection types
export type LibraryStore = LibraryState & LibraryStoreActions;
```

### Function Return Types

```typescript
// ✅ CORRECT - Explicit return types
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

// ✅ CORRECT - Promise return type
export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user/profile');
  return response.json() as UserProfile;
}

// ✅ CORRECT - Void for side effects
export function logAnalytics(event: string, data: Record<string, unknown>): void {
  console.log(event, data);
}
```

---

## React & TSX Coding Standards

### Component Structure

```tsx
// ✅ CORRECT - Proper component structure
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { LibraryItem } from '@/types/library';

/**
 * FileItem Component
 * Displays a single file in the library with interaction handlers
 */

interface FileItemProps {
  item: LibraryItem;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function FileItem({
  item,
  isSelected = false,
  onSelect,
  onDoubleClick,
}: FileItemProps) {
  // State hooks
  const [isHovered, setIsHovered] = useState(false);

  // Effect hooks
  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, []);

  // Event handlers
  const handleClick = () => {
    onSelect(item.id);
  };

  // Render
  return (
    <div
      className="file-item"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component JSX */}
    </div>
  );
}
```

### Props Interface Pattern

```tsx
// ✅ CORRECT - Props interface with JSDoc
/**
 * Props for the StatusCard component
 */
interface StatusCardProps {
  /** Unique identifier for the card */
  id: string;
  /** Title displayed on the card */
  title: string;
  /** Numeric value to display */
  value: number | string;
  /** Optional description text */
  description?: string;
  /** Icon component to display */
  icon: LucideIcon;
  /** Click handler for the card */
  onClick?: () => void;
}

export function StatusCard({ id, title, value, description, icon: Icon, onClick }: StatusCardProps) {
  return (
    <div onClick={onClick}>
      <Icon className="h-6 w-6" />
      <h3>{title}</h3>
      <p>{value}</p>
      {description && <span>{description}</span>}
    </div>
  );
}

// ❌ INCORRECT - Inline props, no documentation
export function StatusCard({ id, title, value, description, icon, onClick }) {
  // Missing types and documentation
}
```

### Hooks Usage

```tsx
// ✅ CORRECT - Custom hook pattern
export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchDashboardStats();
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
```

### Component Composition

```tsx
// ✅ CORRECT - Compound component pattern
export function Card({ children, className }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('card-header', className)}>{children}</div>;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('card-content', className)}>{children}</div>;
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    <StatusCards data={stats} />
  </CardContent>
</Card>
```

### Lazy Loading Pattern

```tsx
// ✅ CORRECT - Lazy loading with Suspense
import { lazy, Suspense } from 'react';
import { RouteLoadingFallback } from '@/components/layout/RouteLoadingFallback';

// Lazy load page components
export const LibraryPage = lazy(() => 
  import('./LibraryPage').then(m => ({ default: m.LibraryPage }))
);

// Usage in router
<Suspense fallback={<RouteLoadingFallback />}>
  <LibraryPage />
</Suspense>
```

### Event Handler Naming

```tsx
// ✅ CORRECT - handle prefix for internal handlers
export function FileItem({ item, onSelect, onDelete }: FileItemProps) {
  const handleClick = () => {
    onSelect(item.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div onClick={handleClick}>
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
}

// ✅ CORRECT - on prefix for prop callbacks
interface FileItemProps {
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}
```

---

## Import & Export Patterns

### Import Order

```typescript
// ✅ CORRECT - Organized import order
// 1. React imports
import { useState, useEffect, useCallback } from 'react';

// 2. Third-party library imports
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// 3. Internal absolute imports (using @/ alias)
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/store/libraryStore';
import { fetchDashboardStats } from '@/services/dashboardService';

// 4. Type imports (separate with 'type' keyword)
import type { LibraryItem, FileItem } from '@/types/library';
import type { DashboardStats } from '@/services/dashboardService';

// 5. Relative imports (avoid if possible, prefer absolute)
import { formatFileSize } from './utils';
```

### Export Patterns

```typescript
// ✅ CORRECT - Named exports for components
export function StatusCard({ title, value }: StatusCardProps) {
  return <div>{title}: {value}</div>;
}

// ✅ CORRECT - Re-exports in index files
// src/pages/index.ts
export { HomePage } from './HomePage';
export const LibraryPage = lazy(() => import('./LibraryPage').then(m => ({ default: m.LibraryPage })));

// ✅ CORRECT - Type exports
export type { LibraryItem, FileItem, FolderItem } from './library';
export { isFileItem, isFolderItem } from './library';

// ❌ AVOID - Default exports (except for lazy loading compatibility)
export default function StatusCard() { ... } // Avoid
```

### Path Aliasing

```typescript
// ✅ CORRECT - Use @ alias for src imports
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/store/libraryStore';
import type { LibraryItem } from '@/types/library';

// ❌ INCORRECT - Relative paths from deeply nested files
import { Button } from '../../../components/ui/button';
import { useLibraryStore } from '../../../store/libraryStore';
```

### Barrel Exports

```typescript
// ✅ CORRECT - src/components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card, CardHeader, CardContent } from './card';
export { Dialog, DialogContent, DialogHeader } from './dialog';

// Usage
import { Button, Input, Card } from '@/components/ui';

// ⚠️ CAUTION - Don't re-export everything from large feature folders
// This can hurt tree-shaking and bundle size
```

---

## State Management Patterns

### Zustand Store Pattern

```typescript
// ✅ CORRECT - Zustand store structure
import { create } from 'zustand';
import type { LibraryItem, LibraryState, LibraryStoreActions } from '@/types/library';

export const useLibraryStore = create<LibraryState & LibraryStoreActions>((set, get) => ({
  // Initial state
  items: {},
  currentFolderId: null,
  selectedItemIds: [],
  isLoading: false,
  error: null,
  viewMode: 'grid',

  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),

  selectItem: (itemId) => {
    const state = get();
    set({
      selectedItemIds: [...state.selectedItemIds, itemId],
    });
  },

  clearSelection: () => set({ selectedItemIds: [] }),

  refreshItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchLibraryItems();
      set({ items: response.items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh',
        isLoading: false,
      });
    }
  },
}));
```

### Local State vs Global State

```tsx
// ✅ CORRECT - Local state for component-specific UI
export function FileItem({ item }: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false); // Local UI state
  const selectItem = useLibraryStore((state) => state.selectItem); // Global action

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectItem(item.id)}
    >
      {/* Component JSX */}
    </div>
  );
}

// ✅ CORRECT - Selector pattern for Zustand
export function LibraryGrid() {
  // Select only needed state slices
  const items = useLibraryStore((state) => state.items);
  const viewMode = useLibraryStore((state) => state.viewMode);
  const selectItem = useLibraryStore((state) => state.selectItem);

  // Component logic
}
```

---

## API Integration Patterns

### API Client Structure

```typescript
// ✅ CORRECT - API client pattern
/**
 * Files API Client
 * Handles all file and folder operations with backend
 */

const API_BASE_URL = 'http://localhost:3001';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
}

/**
 * List files and folders
 * GET /api/files
 */
export async function listFiles(params?: {
  folderId?: string;
  limit?: number;
  sortBy?: 'name' | 'size' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}): Promise<FileListResponse> {
  const queryParams = new URLSearchParams(params as Record<string, string>);
  const response = await fetch(`${API_BASE_URL}/api/files?${queryParams}`);

  if (!response.ok) {
    throw new Error(`Failed to list files: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload file to S3
 * POST /api/files/upload
 */
export async function uploadFile(
  file: File,
  folderId?: string
): Promise<FileMetadata> {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId) formData.append('folderId', folderId);

  const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}
```

### Error Handling

```typescript
// ✅ CORRECT - Comprehensive error handling
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Log error for debugging
    console.error('Failed to fetch dashboard stats:', error);

    // Provide fallback data
    return getFallbackDashboardStats();
  }
}

// Fallback mechanism
function getFallbackDashboardStats(): DashboardStats {
  return {
    library: { totalFiles: 0, totalFolders: 0, totalSize: 0, recentActivity: 0 },
    agents: { active: 0, total: 3 },
    connections: { connected: 0, total: 3, status: 'warning' },
  };
}
```

---

## Type Safety & Type Definitions

### Type File Structure

```typescript
// ✅ CORRECT - Comprehensive type definitions
/**
 * Library Type Definitions
 * TypeScript interfaces for file management and library state
 */

// Base interfaces
export interface BaseLibraryItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  starred?: boolean;
}

// Extended interfaces
export interface FileItem extends BaseLibraryItem {
  type: 'file';
  fileType: 'pdf' | 'image' | 'document' | 'other';
  size: number;
  extension: string;
}

export interface FolderItem extends BaseLibraryItem {
  type: 'folder';
  itemCount: number;
  childrenIds: string[];
}

// Union types
export type LibraryItem = FileItem | FolderItem;

// Type guards
export function isFileItem(item: LibraryItem): item is FileItem {
  return item.type === 'file';
}

export function isFolderItem(item: LibraryItem): item is FolderItem {
  return item.type === 'folder';
}

// Utility types
export type SortableField = 'name' | 'date' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';
```

---

## Performance Best Practices

### Lazy Loading

```tsx
// ✅ CORRECT - Route-level lazy loading
import { lazy } from 'react';

export const LibraryPage = lazy(() => 
  import('./LibraryPage').then(m => ({ default: m.LibraryPage }))
);
export const AgentsPage = lazy(() => 
  import('./AgentsPage').then(m => ({ default: m.AgentsPage }))
);
```

### Memoization

```tsx
// ✅ CORRECT - useMemo for expensive computations
export function LibraryGrid({ items }: LibraryGridProps) {
  const sortedItems = useMemo(() => {
    return Object.values(items).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [items]);

  return <div>{sortedItems.map(item => <FileItem key={item.id} item={item} />)}</div>;
}

// ✅ CORRECT - useCallback for stable function references
export function FileItem({ item, onSelect }: FileItemProps) {
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [item.id, onSelect]);

  return <div onClick={handleClick}>{item.name}</div>;
}

// ✅ CORRECT - React.memo for expensive components
export const FileItem = React.memo(function FileItem({ item }: FileItemProps) {
  return <div>{item.name}</div>;
});
```

---

## Documentation Standards

### File Headers

```typescript
/**
 * Dashboard Service
 * Fetches real-time dashboard statistics from the backend API
 * Phase 1: Static Content Elimination
 * 
 * @module services/dashboardService
 * @see {@link src/hooks/useDashboardStats.ts}
 */
```

### Function Documentation

```typescript
/**
 * Fetch dashboard statistics from the backend
 * 
 * @returns Promise resolving to dashboard statistics
 * @throws {Error} When API request fails
 * 
 * @example
 * ```typescript
 * const stats = await fetchDashboardStats();
 * console.log(stats.library.totalFiles);
 * ```
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // Implementation
}
```

### Component Documentation

```tsx
/**
 * StatusCard Component
 * Displays a summary card with title, value, and optional icon
 * 
 * @component
 * @example
 * ```tsx
 * <StatusCard
 *   id="library"
 *   title="Total Files"
 *   value={247}
 *   icon={Library}
 *   description="Research documents"
 * />
 * ```
 */
export function StatusCard({ id, title, value, icon: Icon }: StatusCardProps) {
  // Implementation
}
```

---

## Testing Conventions

### Test File Naming

```typescript
// Pattern: {fileName}.test.ts or {fileName}.spec.ts
dashboardService.test.ts     // ✅ Service tests
useDashboardStats.test.ts    // ✅ Hook tests
StatusCard.test.tsx          // ✅ Component tests
```

### Test Structure

```typescript
// ✅ CORRECT - Organized test structure
describe('dashboardService', () => {
  describe('fetchDashboardStats', () => {
    it('should fetch dashboard statistics successfully', async () => {
      // Arrange
      const mockStats = { library: { totalFiles: 247 } };
      
      // Act
      const result = await fetchDashboardStats();
      
      // Assert
      expect(result).toEqual(mockStats);
    });

    it('should return fallback data on error', async () => {
      // Test error handling
    });
  });
});
```

---

## Git Commit Standards

### Commit Message Format

```bash
# Pattern: <type>(<scope>): <subject>
# 
# <body>
# 
# <footer>

# Examples:
feat(performance): implement route-level code splitting

- Add lazy loading for 5 route components
- Create RouteLoadingFallback component
- Add Suspense boundaries in router configuration

Performance Impact:
- Initial bundle: 813 KB → 477 KB (-41.4%)
- Initial gzip: 248 KB → 151 KB (-39.0%)

Phase 3: Performance Optimization - Complete

# ---

fix(library): resolve file upload race condition

- Add queue management for concurrent uploads
- Implement retry logic with exponential backoff
- Update uploadQueueStore with proper error handling

Fixes #123

# ---

refactor(home): eliminate static dashboard content

- Create dashboardService for API integration
- Add useDashboardStats hook with auto-refresh
- Update HomePage to use dynamic data

Phase 1: Static Content Elimination
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `style`: Code style changes (formatting)
- `docs`: Documentation changes
- `test`: Test additions or modifications
- `chore`: Build process or tooling changes

---

## Enforcement & Validation

### Pre-Commit Checks

```bash
# Run before every commit
npm run lint        # ESLint validation
npm run type-check  # TypeScript compilation
npm run format      # Prettier formatting
npm run test        # Run test suite
```

### Code Review Checklist

- ✅ Follows naming conventions for files and folders
- ✅ Proper TypeScript types (no `any`)
- ✅ Component props properly typed
- ✅ Comprehensive error handling
- ✅ Loading states implemented
- ✅ Performance optimizations applied
- ✅ Documentation complete
- ✅ Tests passing
- ✅ Git commit follows standards

---

## Exceptions & Special Cases

### When to Break Rules

1. **Shadcn/UI Components** - Use kebab-case as per Shadcn standards
2. **Third-party integrations** - Follow their conventions
3. **Legacy code** - Mark with TODO for future refactoring
4. **Performance-critical sections** - Document optimizations clearly

### Documenting Exceptions

```typescript
/**
 * EXCEPTION: Using 'any' type due to third-party library limitation
 * TODO: Replace with proper types when library updates
 * @see https://github.com/library/issues/123
 */
export function handleExternalData(data: any): void {
  // Implementation
}
```

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | October 4, 2025 | Initial document creation | Frontend Development Agent |

---

**Document Status:** ✅ ACTIVE  
**Last Updated:** October 4, 2025  
**Next Review:** When major architectural changes occur  
**Questions:** Refer to frontend.instructions.md or contact repository maintainers
