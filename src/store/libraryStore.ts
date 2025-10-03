/**
 * Library Store (Backend Integrated)
 * Phase 5: S3 Integration - Simplified for critical path
 * Replaces mock data with real backend API calls
 */

import { create } from 'zustand';
import {
  listFiles,
  updateFile,
  deleteFile,
  bulkDeleteFiles,
  bulkMoveFiles,
  createFolder as apiCreateFolder,
  renameFolder as apiRenameFolder,
  deleteFolder as apiDeleteFolder,
  getFolderContents,
  type FileMetadata,
  type Folder,
  type BreadcrumbItem,
} from '@/api/filesApi';
import type { LibraryItem } from '@/types/library';

// Convert backend types to UI types
function convertFileToLibraryItem(file: FileMetadata): LibraryItem {
  const extension = file.name.split('.').pop() || '';
  return {
    id: file.id,
    type: 'file',
    name: file.name,
    parentId: file.folderId,
    fileType: getFileType(extension),
    size: file.size,
    extension,
    createdAt: new Date(file.createdAt),
    updatedAt: new Date(file.updatedAt),
  };
}

function convertFolderToLibraryItem(folder: Folder, itemCount: number = 0, childrenIds: string[] = []): LibraryItem {
  return {
    id: folder.id,
    type: 'folder',
    name: folder.name,
    parentId: folder.parentId,
    itemCount,
    childrenIds,
    createdAt: new Date(folder.createdAt),
    updatedAt: new Date(folder.updatedAt),
  };
}

function getFileType(extension: string): 'pdf' | 'image' | 'document' | 'other' {
  const ext = extension.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
  if (['doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) return 'document';
  return 'other';
}

export interface LibraryStoreState {
  // Data
  items: Record<string, LibraryItem>;
  currentFolderId: string | null;
  folderPath: BreadcrumbItem[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Selection
  selectedItemIds: string[];
  isSelectionMode: boolean;
  
  // View settings
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'size' | 'createdAt' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
  filterBy: 'all' | 'files' | 'folders';
  
  // Actions
  fetchFiles: (folderId?: string) => Promise<void>;
  navigateToFolder: (folderId: string | null) => Promise<void>;
  navigateBack: () => Promise<void>;
  navigateToRoot: () => Promise<void>;
  refreshCurrentFolder: () => Promise<void>;
  
  // File operations
  renameFile: (fileId: string, newName: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  bulkDelete: (fileIds: string[]) => Promise<void>;
  bulkMove: (fileIds: string[], targetFolderId: string | null) => Promise<void>;
  
  // Folder operations
  createFolder: (name: string, parentId?: string) => Promise<Folder>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  
  // Selection
  selectItem: (itemId: string) => void;
  deselectItem: (itemId: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  setSelectionMode: (enabled: boolean) => void;
  
  // View
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: 'name' | 'size' | 'createdAt', sortOrder?: 'asc' | 'desc') => void;
  setFilterBy: (filter: 'all' | 'files' | 'folders') => void;
  
  // Backward compatibility
  uploadFiles: (files: File[], folderId: string | null) => Promise<void>;
  deleteItems: (itemIds: string[]) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<void>;
  
  // Getters
  getVisibleItems: () => LibraryItem[];
  isAllSelected: () => boolean;
  isSomeSelected: () => boolean;
}

export const useLibraryStore = create<LibraryStoreState>((set, get) => ({
  // Initial state
  items: {},
  currentFolderId: null,
  folderPath: [],
  isLoading: false,
  error: null,
  selectedItemIds: [],
  isSelectionMode: false,
  viewMode: 'grid',
  sortBy: 'name',
  sortOrder: 'asc',
  filterBy: 'all',
  
  // Fetch files and folders
  fetchFiles: async (folderId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const state = get();
      // Map UI sortBy values to backend API values
      const apiSortBy = state.sortBy === 'createdAt' || state.sortBy === 'date' 
        ? 'createdAt' as const
        : state.sortBy === 'name'
        ? 'name' as const
        : 'size' as const;
      
      const response = await listFiles({
        folderId: folderId || undefined,
        limit: 50,
        sortBy: apiSortBy,
        sortOrder: state.sortOrder,
      });
      
      // Convert to library items
      const items: Record<string, LibraryItem> = {};
      
      response.files.forEach((file) => {
        items[file.id] = convertFileToLibraryItem(file);
      });
      
      response.folders.forEach((folder) => {
        items[folder.id] = convertFolderToLibraryItem(folder);
      });
      
      set({ items, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch files';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Navigate to folder
  navigateToFolder: async (folderId: string | null) => {
    const state = get();
    if (folderId === state.currentFolderId) return;
    
    set({ isLoading: true, error: null, currentFolderId: folderId });
    
    try {
      if (folderId) {
        // Get folder contents with breadcrumb
        const contents = await getFolderContents(folderId);
        
        const items: Record<string, LibraryItem> = {};
        
        contents.files.forEach((file) => {
          items[file.id] = convertFileToLibraryItem(file);
        });
        
        contents.subfolders.forEach((folder) => {
          items[folder.id] = convertFolderToLibraryItem(folder);
        });
        
        set({
          items,
          folderPath: contents.breadcrumb,
          selectedItemIds: [],
          isSelectionMode: false,
          isLoading: false,
        });
      } else {
        // Root folder
        await get().fetchFiles();
        set({ folderPath: [], selectedItemIds: [], isSelectionMode: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Navigation failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Navigate back
  navigateBack: async () => {
    const state = get();
    if (state.folderPath.length === 0) return;
    
    const parentPath = state.folderPath.slice(0, -1);
    const parentId = parentPath.length > 0 ? parentPath[parentPath.length - 1].id : null;
    
    await get().navigateToFolder(parentId);
  },
  
  // Navigate to root
  navigateToRoot: async () => {
    await get().navigateToFolder(null);
  },
  
  // Refresh current folder
  refreshCurrentFolder: async () => {
    const state = get();
    const folderId = state.currentFolderId;
    
    // Force re-fetch without full navigation to preserve URL
    try {
      set({ isLoading: true, error: null });
      
      if (folderId) {
        const contents = await getFolderContents(folderId);
        
        const items: Record<string, LibraryItem> = {};
        
        contents.files.forEach((file) => {
          items[file.id] = convertFileToLibraryItem(file);
        });
        
        contents.subfolders.forEach((folder) => {
          items[folder.id] = convertFolderToLibraryItem(folder);
        });
        
        set({
          items,
          isLoading: false,
        });
      } else {
        // Root folder refresh
        const apiSortBy = state.sortBy === 'createdAt' || state.sortBy === 'date' 
          ? 'createdAt' as const
          : state.sortBy === 'name'
          ? 'name' as const
          : 'size' as const;
        
        const response = await listFiles({
          limit: 50,
          sortBy: apiSortBy,
          sortOrder: state.sortOrder,
        });
        
        const items: Record<string, LibraryItem> = {};
        
        response.files.forEach((file) => {
          items[file.id] = convertFileToLibraryItem(file);
        });
        
        response.folders.forEach((folder) => {
          items[folder.id] = convertFolderToLibraryItem(folder);
        });
        
        set({ items, isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  // Rename file
  renameFile: async (fileId: string, newName: string) => {
    await updateFile(fileId, { name: newName });
    
    // Update local state
    set((state) => ({
      items: {
        ...state.items,
        [fileId]: {
          ...state.items[fileId],
          name: newName,
          updatedAt: new Date(),
        },
      },
    }));
  },
  
  // Delete file
  deleteFile: async (fileId: string) => {
    await deleteFile(fileId);
    
    // Remove from local state
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fileId]: _removed, ...rest } = state.items;
      return { items: rest };
    });
  },
  
  // Bulk delete
  bulkDelete: async (fileIds: string[]) => {
    await bulkDeleteFiles(fileIds);
    
    // Remove from local state
    set((state) => {
      const items = { ...state.items };
      fileIds.forEach((id) => delete items[id]);
      return { items, selectedItemIds: [] };
    });
  },
  
  // Bulk move
  bulkMove: async (fileIds: string[], targetFolderId: string | null) => {
    await bulkMoveFiles(fileIds, targetFolderId);
    
    // Refresh current folder
    await get().refreshCurrentFolder();
    set({ selectedItemIds: [] });
  },
  
  // Create folder
  createFolder: async (name: string, parentId?: string) => {
    const folder = await apiCreateFolder(name, parentId);
    
    // Add to local state
    const libraryItem = convertFolderToLibraryItem(folder);
    set((state) => ({
      items: {
        ...state.items,
        [folder.id]: libraryItem,
      },
    }));
    
    return folder;
  },
  
  // Rename folder
  renameFolder: async (folderId: string, newName: string) => {
    await apiRenameFolder(folderId, newName);
    
    // Update local state
    set((state) => ({
      items: {
        ...state.items,
        [folderId]: {
          ...state.items[folderId],
          name: newName,
          updatedAt: new Date(),
        },
      },
    }));
  },
  
  // Delete folder
  deleteFolder: async (folderId: string) => {
    await apiDeleteFolder(folderId);
    
    // Remove from local state
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [folderId]: _removed, ...rest } = state.items;
      return { items: rest };
    });
  },
  
  // Selection actions
  selectItem: (itemId: string) => {
    set((state) => ({
      selectedItemIds: [...state.selectedItemIds, itemId],
      isSelectionMode: true,
    }));
  },
  
  deselectItem: (itemId: string) => {
    set((state) => ({
      selectedItemIds: state.selectedItemIds.filter((id) => id !== itemId),
    }));
  },
  
  toggleSelectAll: () => {
    const state = get();
    const visibleItems = get().getVisibleItems();
    const visibleIds = visibleItems.map((item) => item.id);
    
    if (state.selectedItemIds.length === visibleIds.length) {
      set({ selectedItemIds: [], isSelectionMode: false });
    } else {
      set({ selectedItemIds: visibleIds, isSelectionMode: true });
    }
  },
  
  clearSelection: () => {
    set({ selectedItemIds: [], isSelectionMode: false });
  },
  
  setSelectionMode: (enabled: boolean) => {
    set({ isSelectionMode: enabled });
    if (!enabled) {
      set({ selectedItemIds: [] });
    }
  },
  
  // View actions
  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },
  
  setSortBy: (sortBy: 'name' | 'size' | 'createdAt', sortOrder?: 'asc' | 'desc') => {
    set({ sortBy, sortOrder: sortOrder || get().sortOrder });
    // Refresh to apply sorting
    get().refreshCurrentFolder();
  },
  
  setFilterBy: (filter: 'all' | 'files' | 'folders') => {
    set({ filterBy: filter });
  },
  
  // Backward compatibility methods
  uploadFiles: async (files: File[], folderId: string | null) => {
    // Import upload service dynamically to avoid circular dependency
    const { uploadFileToS3 } = await import('@/services/fileUploadService');
    const { useUploadQueueStore } = await import('@/store/uploadQueueStore');
    
    // Add files to upload queue
    for (const file of files) {
      const itemId = useUploadQueueStore.getState().addUpload(file, folderId || undefined);
      
      // Start upload
      await uploadFileToS3(itemId, file, folderId || undefined);
    }
    
    // Refresh current folder after uploads
    await get().refreshCurrentFolder();
  },
  
  deleteItems: async (itemIds: string[]) => {
    await get().bulkDelete(itemIds);
  },
  
  renameItem: async (itemId: string, newName: string) => {
    const item = get().items[itemId];
    if (!item) throw new Error('Item not found');
    
    if (item.type === 'file') {
      await get().renameFile(itemId, newName);
    } else {
      await get().renameFolder(itemId, newName);
    }
  },
  
  // Getters
  getVisibleItems: () => {
    return Object.values(get().items);
  },
  
  isAllSelected: () => {
    const state = get();
    const visibleItems = get().getVisibleItems();
    return visibleItems.length > 0 && state.selectedItemIds.length === visibleItems.length;
  },
  
  isSomeSelected: () => {
    const state = get();
    return state.selectedItemIds.length > 0 && !get().isAllSelected();
  },
}));
