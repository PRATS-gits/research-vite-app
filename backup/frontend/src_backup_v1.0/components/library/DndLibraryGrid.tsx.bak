import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { FileCard } from './FileCard';
import { FolderCard } from './FolderCard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useMultiSelect } from '@/hooks/useMultiSelect';
import { useLibraryNavigation } from '@/hooks/useLibraryNavigation';
import { useLibraryStore } from '@/store/libraryStore';
import { cn } from '@/lib/utils';
import type { LibraryItem } from '@/types/library';

interface DndLibraryGridProps {
  items: LibraryItem[];
  onItemClick?: (item: LibraryItem, event: React.MouseEvent) => void;
  onItemDoubleClick?: (item: LibraryItem, event: React.MouseEvent) => void;
  onItemContextMenu?: (item: LibraryItem, event: React.MouseEvent) => void;
  className?: string;
}

/**
 * DndLibraryGrid Component
 * Drag-and-drop enabled grid layout for library items
 * Features:
 * - @dnd-kit drag-and-drop integration
 * - SortableContext for item ordering
 * - File and folder card rendering
 * - Multi-select integration
 * - Drag overlay for visual feedback
 * - Performance optimized with useMemo
 */
export function DndLibraryGrid({
  items,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
  className,
}: DndLibraryGridProps) {
  const { goToFolder } = useLibraryNavigation();
  const previewFile = useLibraryStore((state) => state.previewFile);
  const {
    isItemSelected,
    handleCheckboxChange,
    isSelectionMode,
  } = useMultiSelect();

  const {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isDragging,
    draggedItem,
  } = useDragAndDrop();

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Get item IDs for SortableContext
  const itemIds = useMemo(() => items.map(item => item.id), [items]);

  // Handle item click - do nothing, selection only via checkbox
  const handleItemClick = (item: LibraryItem, e: React.MouseEvent) => {
    // Call custom handler if provided
    if (onItemClick) {
      onItemClick(item, e);
    }
    // Note: Selection is now only handled via checkbox
  };

  // Handle double-click to open items
  const handleItemDoubleClick = (item: LibraryItem, e: React.MouseEvent) => {
    if (onItemDoubleClick) {
      onItemDoubleClick(item, e);
    }
    
    // Open folder or file on double-click
    if (item.type === 'folder') {
      goToFolder(item.id);
    } else {
      // For files, open preview in new tab
      previewFile(item.id);
    }
  };

  // Handle right-click context menu
  const handleItemContextMenu = (item: LibraryItem, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onItemContextMenu) {
      onItemContextMenu(item, e);
    }
  };

  // Render individual item (file or folder card)
  const renderItem = (item: LibraryItem) => {
    const isSelected = isItemSelected(item.id);
    
    const commonProps = {
      isSelected,
      isSelectionMode,
      onCheckboxChange: (checked: boolean) => handleCheckboxChange(item.id, checked),
      onClick: (e: React.MouseEvent) => handleItemClick(item, e),
      onDoubleClick: (e: React.MouseEvent) => handleItemDoubleClick(item, e),
      onContextMenu: (e: React.MouseEvent) => handleItemContextMenu(item, e),
    };

    if (item.type === 'file') {
      return (
        <FileCard
          key={item.id}
          file={item}
          {...commonProps}
        />
      );
    } else {
      return (
        <FolderCard
          key={item.id}
          folder={item}
          {...commonProps}
        />
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        {/* Grid Layout */}
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
            isDragging && 'cursor-grabbing',
            className
          )}
        >
          {items.map(renderItem)}
        </div>
      </SortableContext>

      {/* Drag Overlay - shows item being dragged */}
      <DragOverlay>
        {draggedItem ? (
          <div className="opacity-80 rotate-3 scale-105">
            {draggedItem.type === 'file' ? (
              <FileCard
                file={draggedItem}
                isSelected={false}
                isSelectionMode={false}
                onCheckboxChange={() => {}}
                onClick={() => {}}
              />
            ) : (
              <FolderCard
                folder={draggedItem}
                isSelected={false}
                isSelectionMode={false}
                onCheckboxChange={() => {}}
                onClick={() => {}}
              />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
