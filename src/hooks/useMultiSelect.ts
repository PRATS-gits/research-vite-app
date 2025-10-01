import { useCallback, useMemo } from 'react';
import { useLibraryStore } from '@/store/libraryStore';

/**
 * Custom hook for multi-select functionality
 * Provides checkbox selection with shift-click range support
 * Features:
 * - Single item selection/deselection
 * - Shift-click range selection
 * - Select all/clear all
 * - Selection mode toggle
 * - Performance optimized with useCallback
 */
export function useMultiSelect() {
  // Get selection state from store
  const selectedItemIds = useLibraryStore((state) => state.selectedItemIds);
  const isSelectionMode = useLibraryStore((state) => state.isSelectionMode);
  
  // Get store state for computing visible items
  const items = useLibraryStore((state) => state.items);
  const currentFolderId = useLibraryStore((state) => state.currentFolderId);
  const filterBy = useLibraryStore((state) => state.filterBy);
  const sortBy = useLibraryStore((state) => state.sortBy);
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  
  // Compute visible items with useMemo
  const visibleItems = useMemo(() => {
    const folderItems = Object.values(items).filter(item => item.parentId === currentFolderId);
    
    // Apply filter
    let filtered = folderItems;
    if (filterBy === 'files') {
      filtered = folderItems.filter(item => item.type === 'file');
    } else if (filterBy === 'folders') {
      filtered = folderItems.filter(item => item.type === 'folder');
    }
    
    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
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
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [items, currentFolderId, filterBy, sortBy, sortOrder]);
  
  // Get selection actions from store
  const selectItem = useLibraryStore((state) => state.selectItem);
  const deselectItem = useLibraryStore((state) => state.deselectItem);
  const toggleSelectAll = useLibraryStore((state) => state.toggleSelectAll);
  const clearSelection = useLibraryStore((state) => state.clearSelection);
  const setSelectionMode = useLibraryStore((state) => state.setSelectionMode);
  
  // Check if item is selected
  const isItemSelected = useCallback((itemId: string): boolean => {
    return selectedItemIds.includes(itemId);
  }, [selectedItemIds]);
  
  // Toggle single item selection
  const toggleItemSelection = useCallback((itemId: string, isShiftClick: boolean = false) => {
    if (isItemSelected(itemId)) {
      deselectItem(itemId);
      // Exit selection mode if no items selected
      if (selectedItemIds.length === 1) {
        setSelectionMode(false);
      }
    } else {
      selectItem(itemId, isShiftClick);
    }
  }, [isItemSelected, selectItem, deselectItem, selectedItemIds.length, setSelectionMode]);
  
  // Handle checkbox change
  const handleCheckboxChange = useCallback((itemId: string, checked: boolean) => {
    if (checked) {
      selectItem(itemId);
    } else {
      deselectItem(itemId);
      // Exit selection mode if no items left selected
      if (selectedItemIds.length === 1) {
        setSelectionMode(false);
      }
    }
  }, [selectItem, deselectItem, selectedItemIds.length, setSelectionMode]);
  
  // Handle select all checkbox
  const handleSelectAllChange = useCallback((checked: boolean) => {
    if (checked) {
      // Select all visible items
      const allIds = visibleItems.map(item => item.id);
      allIds.forEach(id => {
        if (!isItemSelected(id)) {
          selectItem(id);
        }
      });
      setSelectionMode(true);
    } else {
      clearSelection();
    }
  }, [visibleItems, isItemSelected, selectItem, clearSelection, setSelectionMode]);
  
  // Check if all visible items are selected - memoized to prevent infinite loops
  const isAllSelected = useMemo((): boolean => {
    if (visibleItems.length === 0) return false;
    return visibleItems.every(item => selectedItemIds.includes(item.id));
  }, [visibleItems, selectedItemIds]);
  
  // Check if some (but not all) visible items are selected - memoized
  const isSomeSelected = useMemo((): boolean => {
    if (selectedItemIds.length === 0) return false;
    const selectedVisibleCount = visibleItems.filter(item => 
      selectedItemIds.includes(item.id)
    ).length;
    return selectedVisibleCount > 0 && selectedVisibleCount < visibleItems.length;
  }, [visibleItems, selectedItemIds]);
  
  // Enter selection mode
  const enterSelectionMode = useCallback(() => {
    setSelectionMode(true);
  }, [setSelectionMode]);
  
  // Exit selection mode
  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    clearSelection();
  }, [setSelectionMode, clearSelection]);
  
  // Get selected items details
  const getSelectedItems = useCallback(() => {
    const store = useLibraryStore.getState();
    return selectedItemIds.map(id => store.items[id]).filter(Boolean);
  }, [selectedItemIds]);
  
  return {
    // State
    selectedItemIds,
    selectedCount: selectedItemIds.length,
    isSelectionMode,
    isAllSelected,
    isSomeSelected,
    
    // Item checks
    isItemSelected,
    
    // Actions
    toggleItemSelection,
    handleCheckboxChange,
    handleSelectAllChange,
    selectItem,
    deselectItem,
    toggleSelectAll,
    clearSelection,
    enterSelectionMode,
    exitSelectionMode,
    getSelectedItems,
  };
}
