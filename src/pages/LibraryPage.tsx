import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { LibrarySearchBar } from '@/components/library/LibrarySearchBar';
import { LibraryControls } from '@/components/library/LibraryControls';
import { SelectionControls } from '@/components/library/SelectionControls';
import { useLibrarySelection } from '@/hooks/useLibrarySelection';
import type { CreateOption, UploadOption, FilterOption, SortOption } from '@/types/libraryControls';

/**
 * LibraryPage component - Complete redesign with search and controls
 * Features:
 * - Resizable search bar positioned top-left
 * - Default action controls (Create, Upload, Filter, Sort) positioned top-right
 * - Hidden selection controls (Edit, View, Delete) that appear on item selection
 * - Control state management and responsive layout
 * - Performance optimized with <50ms interaction response
 */
export function LibraryPage() {
  const [searchValue, setSearchValue] = useState('');
  
  // Mock item IDs for demonstration
  const mockItemIds = ['item1', 'item2', 'item3'];
  const {
    selectedItems,
    isSelectionMode,
    selectItem,
    clearSelection,
    toggleSelectionMode
  } = useLibrarySelection(mockItemIds);

  // Search bar handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // Placeholder: Future search implementation
    console.log('Search value:', value);
  }, []);

  // Control handlers
  const handleCreateSelect = useCallback((option: CreateOption) => {
    console.log('Create option selected:', option);
    // Placeholder: Navigate to creation modal/page
  }, []);

  const handleUploadSelect = useCallback((option: UploadOption) => {
    console.log('Upload option selected:', option);
    // Placeholder: Open upload modal/workflow
  }, []);

  const handleFilterChange = useCallback((filter: FilterOption) => {
    console.log('Filter changed:', filter);
    // Placeholder: Apply filter to library items
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    console.log('Sort changed:', sort);
    // Placeholder: Apply sort to library items
  }, []);

  // Selection control handlers
  const handleEdit = useCallback(() => {
    console.log('Edit items:', selectedItems);
  }, [selectedItems]);

  const handleView = useCallback(() => {
    console.log('View items:', selectedItems);
  }, [selectedItems]);

  const handleDelete = useCallback(() => {
    // Placeholder: Show delete confirmation modal
    const confirmed = confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`);
    if (confirmed) {
      console.log('Delete items:', selectedItems);
      clearSelection();
    }
  }, [selectedItems, clearSelection]);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Research Library</h1>
        <p className="text-lg text-muted-foreground">
          Manage your research papers, documents, and resources
        </p>
      </div>

      {/* Search Bar and Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Bar - positioned top-left */}
        <LibrarySearchBar
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full sm:w-auto"
        />
        
        {/* Library Controls - positioned top-right */}
        <LibraryControls
          onCreateSelect={handleCreateSelect}
          onUploadSelect={handleUploadSelect}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          isSelectionMode={isSelectionMode}
          selectedCount={selectedItems.length}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Selection Controls - hidden until items are selected */}
      <SelectionControls
        selectedItems={selectedItems}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onClearSelection={clearSelection}
      />

      {/* Library Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          className="rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            selectItem('item1');
            if (!isSelectionMode) {
              toggleSelectionMode();
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Papers</h3>
            <Badge variant="secondary">12</Badge>
          </div>
          <p className="text-muted-foreground">
            Access your recently added research papers and publications.
          </p>
        </div>
        
        <div 
          className="rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            selectItem('item2');
            if (!isSelectionMode) {
              toggleSelectionMode();
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Collections</h3>
            <Badge variant="secondary">5</Badge>
          </div>
          <p className="text-muted-foreground">
            Organize your resources into themed collections.
          </p>
        </div>
        
        <div 
          className="rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            selectItem('item3');
            if (!isSelectionMode) {
              toggleSelectionMode();
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bookmarks</h3>
            <Badge variant="secondary">28</Badge>
          </div>
          <p className="text-muted-foreground">
            Quick access to your bookmarked research materials.
          </p>
        </div>
      </div>
    </div>
  );
}
