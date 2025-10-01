import { useState, useCallback, useMemo } from 'react';
import { LibrarySearchBar } from '@/components/library/LibrarySearchBar';
import { LibraryControls } from '@/components/library/LibraryControls';
import { BreadcrumbNavigation } from '@/components/library/BreadcrumbNavigation';
import { MultiSelectControls } from '@/components/library/MultiSelectControls';
import { DndLibraryGrid } from '@/components/library/DndLibraryGrid';
import { GlobalDropZone } from '@/components/library/GlobalDropZone';
import { RenameModal } from '@/components/library/RenameModal';
import { CreateFolderModal } from '@/components/library/CreateFolderModal';
import { UploadModal } from '@/components/library/UploadModal';
import { DeleteConfirmModal } from '@/components/library/DeleteConfirmModal';
import { SweetAlert } from '@/components/ui/SweetAlert';
import { useLibraryStore } from '@/store/libraryStore';
import { useLibraryNavigation } from '@/hooks/useLibraryNavigation';
import { useMultiSelect } from '@/hooks/useMultiSelect';
import { useModalRouting } from '@/hooks/useModalRouting';
import type { CreateOption, UploadOption, FilterOption, SortOption } from '@/types/libraryControls';
import type { CreateFolderData, DeleteConfirmData, SweetAlertData } from '@/types/libraryModals';
import type { LibraryItem } from '@/types/library';

/**
 * LibraryPage component - Phase 1: Google Drive Experience
 * Features:
 * - Drag-and-drop file management
 * - Nested folder navigation with breadcrumbs
 * - Multi-select with shift-click range selection
 * - File and folder cards with thumbnails
 * - Rename modal and context menus
 * - Global drop zone for external file uploads
 * - Performance optimized with React.memo and Zustand
 */
export function LibraryPage() {
  const [searchValue, setSearchValue] = useState('');
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<LibraryItem | null>(null);
  
  // Get library state - extract only what we need
  const items = useLibraryStore((state) => state.items);
  const currentFolderId = useLibraryStore((state) => state.currentFolderId);
  const filterBy = useLibraryStore((state) => state.filterBy);
  const sortBy = useLibraryStore((state) => state.sortBy);
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  const createFolder = useLibraryStore((state) => state.createFolder);
  const uploadFiles = useLibraryStore((state) => state.uploadFiles);
  const deleteItems = useLibraryStore((state) => state.deleteItems);
  const renameItemAction = useLibraryStore((state) => state.renameItem);
  
  // Compute visible items with useMemo to prevent infinite loops
  const visibleItems = useMemo(() => {
    const folderItems = Object.values(items).filter(item => item.parentId === currentFolderId);
    
    // Apply filter
    let filtered = folderItems;
    if (filterBy === 'files') {
      filtered = folderItems.filter(item => item.type === 'file');
    } else if (filterBy === 'folders') {
      filtered = folderItems.filter(item => item.type === 'folder');
    }
    
    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
          break;
        case 'size':
          const aSize = a.type === 'file' ? a.size : 0;
          const bSize = b.type === 'file' ? b.size : 0;
          comparison = bSize - aSize;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [items, currentFolderId, filterBy, sortBy, sortOrder]);
  
  // Navigation and selection hooks
  const { folderName } = useLibraryNavigation();
  const { selectedItemIds, getSelectedItems } = useMultiSelect();

  // Modal routing integration
  const { openModal, closeModal, modalState } = useModalRouting();

  // Search bar handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // Placeholder: Future search implementation
    console.log('Search value:', value);
  }, []);

  // Control handlers
  const handleCreateSelect = useCallback((option: CreateOption) => {
    if (option === 'folder') {
      openModal('createFolder');
    } else {
      openModal('sweetAlert', {
        type: 'info',
        title: 'Feature Coming Soon',
        message: `Creating ${option} is under development.`,
        confirmText: 'OK'
      } as SweetAlertData);
    }
  }, [openModal]);

  const handleUploadSelect = useCallback((option: UploadOption) => {
    if (option === 'file') {
      openModal('uploadFile');
    } else if (option === 'folder') {
      openModal('uploadFolder');
    } else {
      openModal('sweetAlert', {
        type: 'info',
        title: 'Feature Coming Soon',
        message: `Upload from ${option} is under development.`,
        confirmText: 'OK'
      } as SweetAlertData);
    }
  }, [openModal]);

  const handleFilterChange = useCallback((filter: FilterOption) => {
    // Filtering is handled by libraryStore
    console.log('Filter changed:', filter);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    // Sorting is handled by libraryStore
    console.log('Sort changed:', sort);
  }, []);

  // Rename handler
  const handleRename = useCallback(() => {
    const items = getSelectedItems();
    if (items.length === 1) {
      setRenameItem(items[0]);
      setRenameModalOpen(true);
    }
  }, [getSelectedItems]);

  // Delete handler
  const handleDelete = useCallback(() => {
    const items = getSelectedItems();
    const itemNames = items.map(item => item.name);
    
    const deleteData: DeleteConfirmData = {
      itemIds: selectedItemIds,
      itemNames,
      itemCount: selectedItemIds.length
    };
    
    openModal('deleteConfirm', deleteData);
  }, [selectedItemIds, getSelectedItems, openModal]);

  // Modal handlers
  const handleCreateFolder = useCallback((data: CreateFolderData) => {
    createFolder(data.name, currentFolderId);
    openModal('sweetAlert', {
      type: 'success',
      title: 'Folder Created',
      message: `Folder "${data.name}" has been created successfully.`,
      confirmText: 'OK'
    } as SweetAlertData);
  }, [currentFolderId, createFolder, openModal]);

  const handleUploadComplete = useCallback((files: File[]) => {
    uploadFiles(files, currentFolderId);
    openModal('sweetAlert', {
      type: 'success',
      title: 'Upload Complete',
      message: `${files.length} file(s) uploaded successfully.`,
      confirmText: 'OK'
    } as SweetAlertData);
  }, [currentFolderId, uploadFiles, openModal]);

  const handleDeleteConfirm = useCallback(() => {
    deleteItems(selectedItemIds);
    openModal('sweetAlert', {
      type: 'success',
      title: 'Items Deleted',
      message: 'Selected items have been deleted successfully.',
      confirmText: 'OK'
    } as SweetAlertData);
  }, [selectedItemIds, deleteItems, openModal]);

  const handleRenameConfirm = useCallback((newName: string) => {
    if (renameItem) {
      renameItemAction(renameItem.id, newName);
      setRenameModalOpen(false);
      setRenameItem(null);
    }
  }, [renameItem, renameItemAction]);

  // Global file drop handler
  const handleFileDrop = useCallback((files: File[]) => {
    uploadFiles(files, currentFolderId);
    openModal('sweetAlert', {
      type: 'success',
      title: 'Files Uploaded',
      message: `${files.length} file(s) uploaded successfully.`,
      confirmText: 'OK'
    } as SweetAlertData);
  }, [currentFolderId, uploadFiles, openModal]);

  return (
    <GlobalDropZone onFileDrop={handleFileDrop}>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">{folderName}</h1>
          <p className="text-lg text-muted-foreground">
            Manage your research papers, documents, and resources
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        {/* Search Bar and Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <LibrarySearchBar
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-auto"
          />
          
          <LibraryControls
            onCreateSelect={handleCreateSelect}
            onUploadSelect={handleUploadSelect}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            className="w-full sm:w-auto"
          />
        </div>

        {/* Multi-Select Controls */}
        <MultiSelectControls
          onRename={handleRename}
          onDelete={handleDelete}
        />

        {/* Library Content Grid with Drag-and-Drop */}
        {visibleItems.length > 0 ? (
          <DndLibraryGrid items={visibleItems} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No items in this folder</p>
            <p className="text-sm mt-2">Create a folder or upload files to get started</p>
          </div>
        )}

        {/* Modal Components */}
        <CreateFolderModal
          isOpen={modalState.isOpen && modalState.type === 'createFolder'}
          onClose={closeModal}
          onConfirm={handleCreateFolder}
        />

        <UploadModal
          isOpen={modalState.isOpen && (modalState.type === 'uploadFile' || modalState.type === 'uploadFolder')}
          type={modalState.type === 'uploadFile' ? 'file' : 'folder'}
          onClose={closeModal}
          onComplete={handleUploadComplete}
        />

        <RenameModal
          isOpen={renameModalOpen}
          itemName={renameItem?.name || ''}
          itemType={renameItem?.type || 'file'}
          onClose={() => {
            setRenameModalOpen(false);
            setRenameItem(null);
          }}
          onConfirm={handleRenameConfirm}
        />

        {modalState.isOpen && modalState.type === 'deleteConfirm' && modalState.data && (
          <DeleteConfirmModal
            isOpen={true}
            data={modalState.data as DeleteConfirmData}
            onClose={closeModal}
            onConfirm={handleDeleteConfirm}
          />
        )}

        {modalState.isOpen && modalState.type === 'sweetAlert' && modalState.data && (
          <SweetAlert
            isOpen={true}
            data={modalState.data as SweetAlertData}
            onClose={closeModal}
          />
        )}
      </div>
    </GlobalDropZone>
  );
}
