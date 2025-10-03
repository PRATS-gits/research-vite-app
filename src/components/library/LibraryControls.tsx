import { Button } from '@/components/ui/button';
import { CreateDropdown } from './CreateDropdown';
import { UploadDropdown } from './UploadDropdown';
import { Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LibraryControlsProps, FilterOption, SortOption } from '@/types/libraryControls';

/**
 * LibraryControls component containing default action controls
 * Features:
 * - Create and Upload dropdowns
 * - Filter and Sort buttons with placeholder functionality
 * - Positioned in top-right opposite search bar
 * - Responsive layout and accessibility
 * - <50ms interaction response target
 */
export function LibraryControls({
  onCreateSelect,
  onUploadSelect,
  onFilterChange,
  onSortChange,
  isSelectionMode = false,
  selectedCount = 0,
  className
}: LibraryControlsProps) {
  
  const handleFilterClick = () => {
    // Placeholder: Cycle through filter options
    const filterOptions: FilterOption[] = ['all', 'papers', 'documents', 'images', 'bookmarks'];
    const currentIndex = 0; // This would be tracked in state
    const nextFilter = filterOptions[(currentIndex + 1) % filterOptions.length];
    onFilterChange(nextFilter);
    console.log('Filter changed to:', nextFilter);
  };

  const handleSortClick = () => {
    // Placeholder: Cycle through sort options
    const sortOptions: SortOption[] = ['name', 'date', 'size', 'type'];
    const currentIndex = 0; // This would be tracked in state
    const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length];
    onSortChange(nextSort);
    console.log('Sort changed to:', nextSort);
  };

  return (
    <div className={cn(
      'flex items-center gap-2',
      'justify-end flex-wrap',
      className
    )}>
      {/* Selection mode indicator */}
      {isSelectionMode && selectedCount > 0 && (
        <div className="text-sm text-muted-foreground mr-2">
          {selectedCount} selected
        </div>
      )}
      
      {/* Default Action Controls */}
      <div className="flex items-center gap-2">
        <CreateDropdown 
          onSelect={onCreateSelect}
          disabled={isSelectionMode}
        />
        
        <UploadDropdown 
          onSelect={onUploadSelect}
          disabled={isSelectionMode}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleFilterClick}
          disabled={isSelectionMode}
          className="gap-2"
          aria-label="Filter library contents"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortClick}
          disabled={isSelectionMode}
          className="gap-2"
          aria-label="Sort library contents"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </div>
    </div>
  );
}