import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FolderItem } from '@/types/library';
import { format } from 'date-fns';

interface FolderCardProps {
  folder: FolderItem;
  isSelected: boolean;
  isSelectionMode: boolean;
  isDropTarget?: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * FolderCard Component
 * Displays a folder with item count and selection checkbox
 * Features:
 * - Drag-and-drop support (both source and drop target)
 * - Checkbox selection
 * - Item count badge
 * - Double-click to navigate
 * - Hover and selected states
 * - Performance optimized with React.memo
 */
export const FolderCard = memo(function FolderCard({
  folder,
  isSelected,
  isSelectionMode,
  isDropTarget = false,
  onCheckboxChange,
  onClick,
  onDoubleClick,
  onContextMenu,
}: FolderCardProps) {
  // Sortable for dragging
  const {
    attributes: sortableAttributes,
    listeners: sortableListeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  // Droppable for receiving drops
  const {
    setNodeRef: setDroppableRef,
    isOver,
  } = useDroppable({ id: folder.id });

  // Combine refs
  const setRefs = (element: HTMLDivElement | null) => {
    setSortableRef(element);
    setDroppableRef(element);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking checkbox
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    onClick(e);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div ref={setRefs} style={style} {...sortableAttributes}>
      <Card
        className={cn(
          'group relative cursor-pointer overflow-hidden transition-all duration-200',
          'hover:shadow-lg hover:scale-[1.02]',
          isSelected && 'ring-2 ring-primary shadow-lg',
          isDragging && 'opacity-50 cursor-grabbing',
          isOver && 'ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/20'
        )}
        onClick={handleCardClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        {/* Drag handle overlay */}
        <div
          {...sortableListeners}
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          aria-label="Drag handle"
        />

        {/* Checkbox - always visible in selection mode or when selected */}
        {(isSelectionMode || isSelected) && (
          <div
            className="absolute top-2 left-2 z-20"
            data-checkbox
            onClick={handleCheckboxClick}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={onCheckboxChange}
              aria-label={`Select ${folder.name}`}
            />
          </div>
        )}

        {/* Folder Icon */}
        <div className="flex items-center justify-center h-32 bg-muted/30 p-4">
          {isOver || isDropTarget ? (
            <FolderOpen className="h-16 w-16 text-primary" />
          ) : (
            <Folder className="h-16 w-16 text-yellow-500" />
          )}
        </div>

        {/* Folder Info */}
        <div className="p-3 space-y-2">
          {/* Folder Name */}
          <h3
            className="font-medium text-sm line-clamp-2 leading-tight"
            title={folder.name}
          >
            {folder.name}
          </h3>

          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {folder.itemCount} {folder.itemCount === 1 ? 'item' : 'items'}
            </span>
            <Badge variant="secondary" className="text-xs">
              FOLDER
            </Badge>
          </div>

          {/* Date */}
          <div className="text-xs text-muted-foreground">
            {format(folder.updatedAt, 'MMM d, yyyy')}
          </div>
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        )}

        {/* Drop Target Overlay */}
        {isOver && (
          <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500 border-dashed pointer-events-none rounded-lg" />
        )}
      </Card>
    </div>
  );
});
