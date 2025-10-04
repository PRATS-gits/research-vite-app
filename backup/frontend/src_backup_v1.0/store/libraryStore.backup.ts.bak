import { create } from 'zustand';
import type {
  LibraryStore,
  LibraryItem,
  FileItem,
  FolderItem,
  FolderPath
} from '@/types/library';

// Mock data generator
function generateMockData(): Record<string, LibraryItem> {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  
  const items: Record<string, LibraryItem> = {
    // Root folders
    'folder-1': {
      id: 'folder-1',
      type: 'folder',
      name: 'Research Papers',
      parentId: null,
      itemCount: 5,
      childrenIds: ['file-1', 'file-2', 'file-3', 'folder-4', 'folder-5'],
      createdAt: new Date(now.getTime() - 30 * oneDay),
      updatedAt: new Date(now.getTime() - 5 * oneDay),
    },
    'folder-2': {
      id: 'folder-2',
      type: 'folder',
      name: 'Collections',
      parentId: null,
      itemCount: 3,
      childrenIds: ['file-4', 'file-5', 'folder-6'],
      createdAt: new Date(now.getTime() - 20 * oneDay),
      updatedAt: new Date(now.getTime() - 3 * oneDay),
    },
    'folder-3': {
      id: 'folder-3',
      type: 'folder',
      name: 'Resources',
      parentId: null,
      itemCount: 4,
      childrenIds: ['file-6', 'file-7', 'file-8', 'file-9'],
      createdAt: new Date(now.getTime() - 15 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    
    // Files in Research Papers folder
    'file-1': {
      id: 'file-1',
      type: 'file',
      name: 'Machine Learning Fundamentals.pdf',
      parentId: 'folder-1',
      fileType: 'pdf',
      size: 2457600, // 2.4 MB
      extension: 'pdf',
      createdAt: new Date(now.getTime() - 25 * oneDay),
      updatedAt: new Date(now.getTime() - 10 * oneDay),
    },
    'file-2': {
      id: 'file-2',
      type: 'file',
      name: 'Neural Networks Architecture.pdf',
      parentId: 'folder-1',
      fileType: 'pdf',
      size: 3145728, // 3 MB
      extension: 'pdf',
      createdAt: new Date(now.getTime() - 20 * oneDay),
      updatedAt: new Date(now.getTime() - 8 * oneDay),
    },
    'file-3': {
      id: 'file-3',
      type: 'file',
      name: 'Deep Learning Research.pdf',
      parentId: 'folder-1',
      fileType: 'pdf',
      size: 4194304, // 4 MB
      extension: 'pdf',
      createdAt: new Date(now.getTime() - 18 * oneDay),
      updatedAt: new Date(now.getTime() - 6 * oneDay),
    },
    
    // Nested folders in Research Papers
    'folder-4': {
      id: 'folder-4',
      type: 'folder',
      name: 'AI Papers 2024',
      parentId: 'folder-1',
      itemCount: 2,
      childrenIds: ['file-10', 'file-11'],
      createdAt: new Date(now.getTime() - 15 * oneDay),
      updatedAt: new Date(now.getTime() - 4 * oneDay),
    },
    'folder-5': {
      id: 'folder-5',
      type: 'folder',
      name: 'Computer Vision',
      parentId: 'folder-1',
      itemCount: 0,
      childrenIds: [],
      createdAt: new Date(now.getTime() - 10 * oneDay),
      updatedAt: new Date(now.getTime() - 2 * oneDay),
    },
    
    // Files in Collections folder
    'file-4': {
      id: 'file-4',
      type: 'file',
      name: 'Research Notes.docx',
      parentId: 'folder-2',
      fileType: 'document',
      size: 512000, // 500 KB
      extension: 'docx',
      createdAt: new Date(now.getTime() - 12 * oneDay),
      updatedAt: new Date(now.getTime() - 3 * oneDay),
    },
    'file-5': {
      id: 'file-5',
      type: 'file',
      name: 'Dataset Analysis.txt',
      parentId: 'folder-2',
      fileType: 'document',
      size: 102400, // 100 KB
      extension: 'txt',
      createdAt: new Date(now.getTime() - 10 * oneDay),
      updatedAt: new Date(now.getTime() - 2 * oneDay),
    },
    
    // Nested folder in Collections
    'folder-6': {
      id: 'folder-6',
      type: 'folder',
      name: 'Archived Studies',
      parentId: 'folder-2',
      itemCount: 0,
      childrenIds: [],
      createdAt: new Date(now.getTime() - 8 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    
    // Files in Resources folder
    'file-6': {
      id: 'file-6',
      type: 'file',
      name: 'Chart Diagram.png',
      parentId: 'folder-3',
      fileType: 'image',
      size: 1048576, // 1 MB
      extension: 'png',
      createdAt: new Date(now.getTime() - 7 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    'file-7': {
      id: 'file-7',
      type: 'file',
      name: 'Neural Network Visualization.jpg',
      parentId: 'folder-3',
      fileType: 'image',
      size: 819200, // 800 KB
      extension: 'jpg',
      createdAt: new Date(now.getTime() - 6 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    'file-8': {
      id: 'file-8',
      type: 'file',
      name: 'Data Flow Diagram.svg',
      parentId: 'folder-3',
      fileType: 'image',
      size: 256000, // 250 KB
      extension: 'svg',
      createdAt: new Date(now.getTime() - 5 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    'file-9': {
      id: 'file-9',
      type: 'file',
      name: 'References.md',
      parentId: 'folder-3',
      fileType: 'document',
      size: 51200, // 50 KB
      extension: 'md',
      createdAt: new Date(now.getTime() - 4 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    
    // Files in nested AI Papers 2024 folder
    'file-10': {
      id: 'file-10',
      type: 'file',
      name: 'Transformer Architecture.pdf',
      parentId: 'folder-4',
      fileType: 'pdf',
      size: 2621440, // 2.5 MB
      extension: 'pdf',
      createdAt: new Date(now.getTime() - 3 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
    'file-11': {
      id: 'file-11',
      type: 'file',
      name: 'Attention Mechanisms.pdf',
      parentId: 'folder-4',
      fileType: 'pdf',
      size: 1835008, // 1.75 MB
      extension: 'pdf',
      createdAt: new Date(now.getTime() - 2 * oneDay),
      updatedAt: new Date(now.getTime() - 1 * oneDay),
    },
  };
  
  return items;
}

// Create the Zustand store
export const useLibraryStore = create<LibraryStore>((set, get) => ({
  // Initial state
  items: generateMockData(),
  currentFolderId: null, // Start at root
  folderPath: [],
  selectedItemIds: [],
  lastSelectedIndex: null,
  isSelectionMode: false,
  viewMode: 'grid',
  sortBy: 'name',
  sortOrder: 'asc',
  filterBy: 'all',
  isDragging: false,
  draggedItemId: null,
  
  // Navigation actions
  navigateToFolder: (folderId: string | null) => {
    const state = get();
    
    if (folderId === state.currentFolderId) return;
    
    let newPath: FolderPath[] = [];
    
    if (folderId !== null) {
      const folder = state.items[folderId];
      if (!folder || folder.type !== 'folder') return;
      
      // Build path from root to current folder
      newPath = [{ id: folderId, name: folder.name }];
      let currentParentId = folder.parentId;
      
      while (currentParentId !== null) {
        const parentFolder = state.items[currentParentId];
        if (parentFolder && parentFolder.type === 'folder') {
          newPath.unshift({ id: currentParentId, name: parentFolder.name });
          currentParentId = parentFolder.parentId;
        } else {
          break;
        }
      }
    }
    
    set({
      currentFolderId: folderId,
      folderPath: newPath,
      selectedItemIds: [],
      isSelectionMode: false,
    });
  },
  
  navigateBack: () => {
    const state = get();
    if (state.folderPath.length === 0) return;
    
    const parentPath = state.folderPath.slice(0, -1);
    const parentId = parentPath.length > 0 ? parentPath[parentPath.length - 1].id : null;
    
    get().navigateToFolder(parentId);
  },
  
  navigateToRoot: () => {
    get().navigateToFolder(null);
  },
  
  // Selection actions
  selectItem: (itemId: string, isShiftClick: boolean = false) => {
    const state = get();
    
    if (state.selectedItemIds.includes(itemId)) return;
    
    if (isShiftClick && state.lastSelectedIndex !== null) {
      // Shift-click range selection
      const visibleItems = get().getVisibleItems();
      const currentIndex = visibleItems.findIndex(item => item.id === itemId);
      
      if (currentIndex !== -1) {
        const start = Math.min(state.lastSelectedIndex, currentIndex);
        const end = Math.max(state.lastSelectedIndex, currentIndex);
        const rangeIds = visibleItems.slice(start, end + 1).map(item => item.id);
        
        set({
          selectedItemIds: Array.from(new Set([...state.selectedItemIds, ...rangeIds])),
          lastSelectedIndex: currentIndex,
        });
        return;
      }
    }
    
    // Normal single selection
    const visibleItems = get().getVisibleItems();
    const currentIndex = visibleItems.findIndex(item => item.id === itemId);
    
    set({
      selectedItemIds: [...state.selectedItemIds, itemId],
      lastSelectedIndex: currentIndex,
      isSelectionMode: true,
    });
  },
  
  deselectItem: (itemId: string) => {
    set((state) => ({
      selectedItemIds: state.selectedItemIds.filter(id => id !== itemId),
    }));
  },
  
  toggleSelectAll: () => {
    const state = get();
    const visibleItems = get().getVisibleItems();
    const visibleIds = visibleItems.map(item => item.id);
    
    if (state.selectedItemIds.length === visibleIds.length) {
      set({ selectedItemIds: [], isSelectionMode: false });
    } else {
      set({ selectedItemIds: visibleIds, isSelectionMode: true });
    }
  },
  
  clearSelection: () => {
    set({ selectedItemIds: [], isSelectionMode: false, lastSelectedIndex: null });
  },
  
  setSelectionMode: (enabled: boolean) => {
    set({ isSelectionMode: enabled });
    if (!enabled) {
      get().clearSelection();
    }
  },
  
  // Item operations
  renameItem: (itemId: string, newName: string) => {
    set((state) => ({
      items: {
        ...state.items,
        [itemId]: {
          ...state.items[itemId],
          name: newName,
          updatedAt: new Date(),
        },
      },
    }));
  },
  
  deleteItems: (itemIds: string[]) => {
    set((state) => {
      const newItems = { ...state.items };
      
      itemIds.forEach(id => {
        const item = newItems[id];
        if (!item) return;
        
        // Remove from parent's childrenIds
        if (item.parentId) {
          const parent = newItems[item.parentId];
          if (parent && parent.type === 'folder') {
            parent.childrenIds = parent.childrenIds.filter(childId => childId !== id);
            parent.itemCount = parent.childrenIds.length;
          }
        }
        
        delete newItems[id];
      });
      
      return {
        items: newItems,
        selectedItemIds: [],
        isSelectionMode: false,
      };
    });
  },
  
  moveItems: (itemIds: string[], targetFolderId: string | null) => {
    set((state) => {
      const newItems = { ...state.items };
      
      itemIds.forEach(id => {
        const item = newItems[id];
        if (!item) return;
        
        // Remove from old parent
        if (item.parentId) {
          const oldParent = newItems[item.parentId];
          if (oldParent && oldParent.type === 'folder') {
            oldParent.childrenIds = oldParent.childrenIds.filter(childId => childId !== id);
            oldParent.itemCount = oldParent.childrenIds.length;
          }
        }
        
        // Add to new parent
        item.parentId = targetFolderId;
        if (targetFolderId) {
          const newParent = newItems[targetFolderId];
          if (newParent && newParent.type === 'folder') {
            newParent.childrenIds.push(id);
            newParent.itemCount = newParent.childrenIds.length;
          }
        }
      });
      
      return { items: newItems };
    });
  },
  
  createFolder: (name: string, parentId: string | null) => {
    const newId = `folder-${Date.now()}`;
    const now = new Date();
    
    set((state) => {
      const newFolder: FolderItem = {
        id: newId,
        type: 'folder',
        name,
        parentId,
        itemCount: 0,
        childrenIds: [],
        createdAt: now,
        updatedAt: now,
      };
      
      const newItems = { ...state.items, [newId]: newFolder };
      
      // Add to parent's children
      if (parentId) {
        const parent = newItems[parentId];
        if (parent && parent.type === 'folder') {
          parent.childrenIds.push(newId);
          parent.itemCount = parent.childrenIds.length;
        }
      }
      
      return { items: newItems };
    });
  },
  
  uploadFiles: (files: File[], parentId: string | null) => {
    const now = new Date();
    
    set((state) => {
      const newItems = { ...state.items };
      
      files.forEach((file, index) => {
        const extension = file.name.split('.').pop() || '';
        const newId = `file-${Date.now()}-${index}`;
        
        const newFile: FileItem = {
          id: newId,
          type: 'file',
          name: file.name,
          parentId,
          fileType: getFileTypeFromExt(extension),
          size: file.size,
          extension,
          createdAt: now,
          updatedAt: now,
        };
        
        newItems[newId] = newFile;
        
        // Add to parent's children
        if (parentId) {
          const parent = newItems[parentId];
          if (parent && parent.type === 'folder') {
            parent.childrenIds.push(newId);
            parent.itemCount = parent.childrenIds.length;
          }
        }
      });
      
      return { items: newItems };
    });
  },
  
  // View controls
  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy });
  },
  
  toggleSortOrder: () => {
    set((state) => ({
      sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  },
  
  setFilterBy: (filterBy) => {
    set({ filterBy });
  },
  
  // Drag and drop
  setDragging: (isDragging: boolean, itemId: string | null) => {
    set({ isDragging, draggedItemId: itemId });
  },
  
  // Utility methods
  getItemsByFolder: (folderId: string | null) => {
    const state = get();
    return Object.values(state.items).filter(item => item.parentId === folderId);
  },
  
  getVisibleItems: () => {
    const state = get();
    let items = get().getItemsByFolder(state.currentFolderId);
    
    // Apply filter
    if (state.filterBy === 'files') {
      items = items.filter(item => item.type === 'file');
    } else if (state.filterBy === 'folders') {
      items = items.filter(item => item.type === 'folder');
    }
    
    // Apply sort
    items.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
          break;
        case 'size':
          const aSize = a.type === 'file' ? a.size : 0;
          const bSize = b.type === 'file' ? b.size : 0;
          comparison = bSize - aSize;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return state.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return items;
  },
}));

// Helper function
function getFileTypeFromExt(extension: string): FileItem['fileType'] {
  const ext = extension.toLowerCase();
  
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['doc', 'docx', 'txt', 'md'].includes(ext)) return 'document';
  
  return 'other';
}
