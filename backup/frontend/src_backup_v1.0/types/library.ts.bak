/**
 * Library Type Definitions
 * TypeScript interfaces for file management, drag-drop, and library state
 */

export type ItemType = 'file' | 'folder';

export interface BaseLibraryItem {
  id: string;
  name: string;
  parentId: string | null; // null for root items
  createdAt: Date;
  updatedAt: Date;
  isSelected?: boolean;
  starred?: boolean; // Star/favorite status
}

export interface FileItem extends BaseLibraryItem {
  type: 'file';
  fileType: 'pdf' | 'image' | 'document' | 'other';
  size: number; // in bytes
  extension: string;
  thumbnailUrl?: string;
  url?: string;
}

export interface FolderItem extends BaseLibraryItem {
  type: 'folder';
  itemCount: number; // Number of items in folder
  childrenIds: string[]; // IDs of direct children
}

export type LibraryItem = FileItem | FolderItem;

export interface FolderPath {
  id: string;
  name: string;
}

export interface LibraryState {
  // All items (files and folders)
  items: Record<string, LibraryItem>;
  
  // Current folder navigation
  currentFolderId: string | null; // null for root
  folderPath: FolderPath[]; // Breadcrumb trail
  
  // Selection state
  selectedItemIds: string[];
  lastSelectedIndex: number | null; // For shift-click range selection
  
  // UI state
  isSelectionMode: boolean;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  filterBy: 'all' | 'files' | 'folders';
  
  // Drag and drop state
  isDragging: boolean;
  draggedItemId: string | null;
}

export interface DragDropState {
  isDragging: boolean;
  draggedItem: LibraryItem | null;
  dropTargetId: string | null;
}

export interface RenameData {
  itemId: string;
  currentName: string;
  newName: string;
}

export interface ContextMenuData {
  itemId: string;
  itemType: ItemType;
  position: { x: number; y: number };
}

export interface LibraryStoreActions {
  // Navigation
  navigateToFolder: (folderId: string | null) => void;
  navigateBack: () => void;
  navigateToRoot: () => void;
  
  // Selection
  selectItem: (itemId: string, isShiftClick?: boolean) => void;
  deselectItem: (itemId: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  setSelectionMode: (enabled: boolean) => void;
  
  // Item operations
  renameItem: (itemId: string, newName: string) => void;
  deleteItems: (itemIds: string[]) => void;
  moveItems: (itemIds: string[], targetFolderId: string | null) => void;
  createFolder: (name: string, parentId: string | null) => void;
  uploadFiles: (files: File[], parentId: string | null) => void;
  
  // View controls
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: LibraryState['sortBy']) => void;
  toggleSortOrder: () => void;
  setFilterBy: (filterBy: LibraryState['filterBy']) => void;
  
  // Drag and drop
  setDragging: (isDragging: boolean, itemId: string | null) => void;
  
  // Utility
  getItemsByFolder: (folderId: string | null) => LibraryItem[];
  getVisibleItems: () => LibraryItem[];
}

export type LibraryStore = LibraryState & LibraryStoreActions;

// Helper type guards
export function isFileItem(item: LibraryItem): item is FileItem {
  return item.type === 'file';
}

export function isFolderItem(item: LibraryItem): item is FolderItem {
  return item.type === 'folder';
}

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function getFileIcon(fileType: FileItem['fileType']): string {
  const iconMap: Record<FileItem['fileType'], string> = {
    pdf: 'file-text',
    image: 'image',
    document: 'file',
    other: 'file'
  };
  return iconMap[fileType] || 'file';
}

export function getFileTypeFromExtension(extension: string): FileItem['fileType'] {
  const ext = extension.toLowerCase();
  
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['doc', 'docx', 'txt', 'md'].includes(ext)) return 'document';
  
  return 'other';
}
