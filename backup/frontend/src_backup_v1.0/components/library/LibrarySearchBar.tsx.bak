import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LibrarySearchProps } from '@/types/libraryControls';

/**
 * LibrarySearchBar component for searching library contents
 * Features:
 * - Resizable search input
 * - Search icon integration
 * - Positioned in top-left as specified
 * - Responsive behavior
 * - Placeholder search functionality
 * - <50ms interaction response target
 */
export function LibrarySearchBar({
  value,
  onChange,
  placeholder = "Search documents, papers, collections...",
  className
}: LibrarySearchProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Placeholder: Future search logic implementation
      console.log('Search triggered:', value);
    }
  };

  return (
    <div className={cn('relative flex-1 max-w-md', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search 
          className="h-4 w-4 text-muted-foreground" 
          aria-hidden="true"
        />
      </div>
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'pl-10 pr-4 h-10 transition-all duration-200',
          'focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'resize-x min-w-[200px] max-w-[500px]'
        )}
        aria-label="Search library contents"
        role="searchbox"
      />
    </div>
  );
}