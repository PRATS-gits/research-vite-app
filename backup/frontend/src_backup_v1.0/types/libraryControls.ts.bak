export type LibraryControlType = 'create' | 'upload' | 'filter' | 'sort' | 'edit' | 'view' | 'delete';

export type CreateOption = 'folder' | 'document' | 'collection' | 'bookmark';
export type UploadOption = 'file' | 'folder' | 'url' | 'cloud';
export type FilterOption = 'all' | 'papers' | 'documents' | 'images' | 'bookmarks';
export type SortOption = 'name' | 'date' | 'size' | 'type';

export interface LibrarySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface LibraryControlsProps {
  onCreateSelect: (option: CreateOption) => void;
  onUploadSelect: (option: UploadOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  isSelectionMode?: boolean;
  selectedCount?: number;
  className?: string;
}

export interface SelectionControlsProps {
  selectedItems: string[];
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
  className?: string;
}

export interface LibrarySelectionState {
  selectedItems: string[];
  isSelectionMode: boolean;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  toggleSelectionMode: () => void;
}

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
}

export interface LibraryItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'bookmark';
  size?: string;
  createdAt: Date;
  updatedAt: Date;
}