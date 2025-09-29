import { useState, useCallback } from 'react';
import type { LibrarySelectionState } from '@/types/libraryControls';

/**
 * Custom hook for managing library item selection state
 * Features:
 * - Multi-select functionality
 * - Selection mode toggle
 * - Performance optimization with useCallback
 * - Clear selection and select all operations
 */
export function useLibrarySelection(allItemIds: string[] = []): LibrarySelectionState {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const selectItem = useCallback((id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const deselectItem = useCallback((id: string) => {
    setSelectedItems(prev => prev.filter(item => item !== id));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedItems(prev => {
      if (prev.length === allItemIds.length) {
        // If all items are selected, clear selection
        return [];
      } else {
        // Select all items
        return [...allItemIds];
      }
    });
  }, [allItemIds]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => {
      if (prev) {
        // Exiting selection mode, clear selections
        setSelectedItems([]);
      }
      return !prev;
    });
  }, []);

  return {
    selectedItems,
    isSelectionMode,
    selectItem,
    deselectItem,
    toggleSelectAll,
    clearSelection,
    toggleSelectionMode
  };
}