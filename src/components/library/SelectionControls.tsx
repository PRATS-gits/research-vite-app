import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectionControlsProps } from '@/types/libraryControls';

/**
 * SelectionControls component for selected item operations
 * Features:
 * - Hidden controls that appear when items are selected
 * - Edit, View, and Delete operations
 * - Development message placeholders
 * - Show/hide logic based on selections
 * - Accessibility and keyboard navigation
 */
export function SelectionControls({
  selectedItems,
  onEdit,
  onView,
  onDelete,
  onClearSelection,
  className
}: SelectionControlsProps) {
  
  const handleEdit = () => {
    // Development message placeholder
    alert('Edit functionality is under development. Selected items: ' + selectedItems.length);
    onEdit();
  };

  const handleView = () => {
    // File preview placeholder
    alert('File preview functionality coming soon. Selected items: ' + selectedItems.length);
    onView();
  };

  const handleDelete = () => {
    // Delete confirmation will be handled by parent component
    onDelete();
  };

  const isVisible = selectedItems.length > 0;

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center gap-2 p-2 bg-muted/30 rounded-md border',
      'animate-in slide-in-from-top-2 duration-200',
      className
    )}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span className="font-medium">{selectedItems.length}</span>
        <span>item{selectedItems.length !== 1 ? 's' : ''} selected</span>
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="gap-2 h-8 text-xs"
          aria-label={`Edit ${selectedItems.length} selected items`}
        >
          <Edit className="h-3 w-3" />
          Edit
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          className="gap-2 h-8 text-xs"
          aria-label={`View ${selectedItems.length} selected items`}
        >
          <Eye className="h-3 w-3" />
          View
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="gap-2 h-8 text-xs text-destructive hover:text-destructive"
          aria-label={`Delete ${selectedItems.length} selected items`}
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="h-8 w-8 p-0 ml-auto"
        aria-label="Clear selection"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}