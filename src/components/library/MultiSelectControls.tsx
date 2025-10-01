import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { useMultiSelect } from '@/hooks/useMultiSelect';
import { cn } from '@/lib/utils';

interface MultiSelectControlsProps {
  onDelete?: () => void;
  onRename?: () => void;
  className?: string;
}

/**
 * MultiSelectControls Component
 * Provides select all checkbox and selection count display
 * Features:
 * - Select all/none checkbox with indeterminate state
 * - Selection count indicator
 * - Clear selection button
 * - Responsive design
 * - Hidden when no selection mode
 */
export function MultiSelectControls({
  onDelete,
  onRename,
  className,
}: MultiSelectControlsProps) {
  const {
    isSelectionMode,
    selectedCount,
    isAllSelected,
    isSomeSelected,
    handleSelectAllChange,
    clearSelection,
  } = useMultiSelect();

  // Don't render if not in selection mode
  if (!isSelectionMode || selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 bg-muted/50 rounded-lg border',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      {/* Select All Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAllChange}
          // @ts-expect-error - indeterminate is valid but not in type def
          indeterminate={isSomeSelected}
          aria-label="Select all items"
        />
        <span className="text-sm font-medium">
          Select All
        </span>
      </div>

      {/* Selection Count */}
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onRename && selectedCount === 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRename}
            className="shrink-0"
          >
            Rename
          </Button>
        )}

        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="shrink-0"
          >
            Delete ({selectedCount})
          </Button>
        )}

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          aria-label="Clear selection"
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
