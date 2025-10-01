import { useCallback } from 'react';
import { useLibraryStore } from '@/store/libraryStore';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { LibraryItem } from '@/types/library';

/**
 * Custom hook for drag-and-drop functionality
 * Provides event handlers for @dnd-kit integration
 * Features:
 * - Drag start/end/over event handling
 * - Item move operations
 * - Drop zone state management
 * - Performance optimized with useCallback
 */
export function useDragAndDrop() {
  // Get drag state from store
  const isDragging = useLibraryStore((state) => state.isDragging);
  const draggedItemId = useLibraryStore((state) => state.draggedItemId);
  const items = useLibraryStore((state) => state.items);
  
  // Get drag actions from store
  const setDragging = useLibraryStore((state) => state.setDragging);
  const moveItems = useLibraryStore((state) => state.moveItems);
  
  /**
   * Handle drag start event
   * Sets dragging state and marks the dragged item
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const itemId = active.id as string;
    
    console.log('Drag started:', itemId);
    setDragging(true, itemId);
  }, [setDragging]);
  
  /**
   * Handle drag over event
   * Can be used for visual feedback during drag
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Optional: Add visual feedback logic here
    console.log('Dragging over:', { activeId, overId });
  }, []);
  
  /**
   * Handle drag end event
   * Performs the actual move operation if valid
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setDragging(false, null);
    
    if (!over) {
      console.log('Drag cancelled - no drop target');
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Don't move if dropped on itself
    if (activeId === overId) {
      console.log('Dropped on itself - no action');
      return;
    }
    
    const draggedItem = items[activeId];
    const targetItem = items[overId];
    
    if (!draggedItem || !targetItem) {
      console.log('Invalid drag operation - items not found');
      return;
    }
    
    // Can only drop into folders
    if (targetItem.type !== 'folder') {
      console.log('Cannot drop into non-folder item');
      return;
    }
    
    // Prevent dropping folder into its own children
    if (draggedItem.type === 'folder') {
      if (isDescendant(targetItem.id, draggedItem.id, items)) {
        console.log('Cannot drop folder into its own children');
        return;
      }
    }
    
    // Perform the move
    console.log('Moving item:', { from: draggedItem.name, to: targetItem.name });
    moveItems([activeId], targetItem.id);
    
  }, [items, setDragging, moveItems]);
  
  /**
   * Handle drag cancel event
   * Resets dragging state
   */
  const handleDragCancel = useCallback(() => {
    console.log('Drag cancelled');
    setDragging(false, null);
  }, [setDragging]);
  
  /**
   * Check if a folder is a descendant of another folder
   * Prevents circular moves
   */
  const isDescendant = useCallback((
    potentialChildId: string,
    potentialParentId: string,
    allItems: typeof items
  ): boolean => {
    let currentId: string | null = potentialChildId;
    
    while (currentId !== null) {
      if (currentId === potentialParentId) {
        return true;
      }
      
      const currentItem: LibraryItem | undefined = allItems[currentId];
      if (!currentItem) break;
      
      currentId = currentItem.parentId;
    }
    
    return false;
  }, []);
  
  /**
   * Get dragged item details
   */
  const getDraggedItem = useCallback(() => {
    if (!draggedItemId) return null;
    return items[draggedItemId] || null;
  }, [draggedItemId, items]);
  
  /**
   * Check if an item can be dropped into a target
   */
  const canDropInto = useCallback((targetId: string): boolean => {
    if (!draggedItemId) return false;
    
    const draggedItem = items[draggedItemId];
    const targetItem = items[targetId];
    
    if (!draggedItem || !targetItem) return false;
    if (targetItem.type !== 'folder') return false;
    if (draggedItemId === targetId) return false;
    
    // Check for circular dependency
    if (draggedItem.type === 'folder') {
      return !isDescendant(targetId, draggedItemId, items);
    }
    
    return true;
  }, [draggedItemId, items, isDescendant]);
  
  return {
    // State
    isDragging,
    draggedItemId,
    draggedItem: getDraggedItem(),
    
    // Event handlers
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    
    // Utilities
    canDropInto,
    isDescendant,
  };
}
