import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { ContextMenu } from '@/components/library/ContextMenu';
import { useLibraryStore } from '@/store/libraryStore';
import { useLibraryNavigation } from '@/hooks/useLibraryNavigation';
import { useMultiSelect } from '@/hooks/useMultiSelect';
import { useModalRouting } from '@/hooks/useModalRouting';
import { useContextMenu } from '@/hooks/useContextMenu';
import { UploadProgress } from '@/components/library/UploadProgress';
import { FilePreviewModal } from '@/components/library/FilePreviewModal';
import { ExportModal } from '@/components/library/ExportModal';
import type { CreateOption, UploadOption, FilterOption, SortOption } from '@/types/libraryControls';
import type { CreateFolderData, DeleteConfirmData, SweetAlertData, UploadCompletionSummary } from '@/types/libraryModals';
import type { LibraryItem } from '@/types/library';
import { queueFiles, waitForUploads } from '@/services/fileUploadService';

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
  const [previewFile, setPreviewFile] = useState<LibraryItem | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const { folderId } = useParams<{ folderId?: string }>();
  
  // Context menu state
  const { isOpen: isContextMenuOpen, position: contextMenuPosition, targetItemId, openContextMenu, closeContextMenu } = useContextMenu();
  
  // Get library state - extract only what we need
  const items = useLibraryStore((state) => state.items);
  const currentFolderId = useLibraryStore((state) => state.currentFolderId);
  const filterBy = useLibraryStore((state) => state.filterBy);
  const sortBy = useLibraryStore((state) => state.sortBy);
  const sortOrder = useLibraryStore((state) => state.sortOrder);
  const fetchFiles = useLibraryStore((state) => state.fetchFiles);
  const navigateToFolder = useLibraryStore((state) => state.navigateToFolder);
  const createFolder = useLibraryStore((state) => state.createFolder);
  const deleteItems = useLibraryStore((state) => state.deleteItems);
  const renameItemAction = useLibraryStore((state) => state.renameItem);
  const refreshCurrentFolder = useLibraryStore((state) => state.refreshCurrentFolder);
  const previewFileAction = useLibraryStore((state) => state.previewFile);
  
  // Fetch initial data on mount and sync with URL params
  useEffect(() => {
    if (folderId) {
      navigateToFolder(folderId).catch((error) => {
        console.error('Failed to navigate to folder', error);
      });
    } else if (currentFolderId !== null) {
      // URL is /library but store thinks we're in a folder - reset to root
      navigateToFolder(null).catch((error) => {
        console.error('Failed to navigate to root', error);
      });
    } else {
      fetchFiles().catch((error) => {
        console.error('Failed to fetch library root', error);
      });
    }
  }, [folderId, fetchFiles, navigateToFolder]);
  
  // Separate effect to keep store in sync with URL changes
  useEffect(() => {
    const urlFolderId = folderId || null;
    
    // Only navigate if URL folder doesn't match current store folder
    if (urlFolderId !== currentFolderId) {
      navigateToFolder(urlFolderId).catch((error) => {
        console.error('Failed to sync folder with URL', error);
      });
    }
  }, [folderId, currentFolderId, navigateToFolder]);
  
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
        case 'size': {
          const aSize = a.type === 'file' ? a.size : 0;
          const bSize = b.type === 'file' ? b.size : 0;
          comparison = bSize - aSize;
          break;
        }
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

  // Preview handler
  const handlePreview = useCallback(() => {
    const items = getSelectedItems();
    if (items.length === 1 && items[0].type === 'file') {
      // Use the same preview action as context menu (opens in new tab)
      previewFileAction(items[0].id);
    }
  }, [getSelectedItems, previewFileAction]);

  // Export handler
  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  // Modal handlers
  const handleCreateFolder = useCallback((data: CreateFolderData) => {
    createFolder(data.name, currentFolderId || undefined);
    openModal('sweetAlert', {
      type: 'success',
      title: 'Folder Created',
      message: `Folder "${data.name}" has been created successfully.`,
      confirmText: 'OK'
    } as SweetAlertData);
  }, [currentFolderId, createFolder, openModal]);

  const showUploadSummary = useCallback((summary: UploadCompletionSummary, title = 'Upload Summary') => {
  const { successful, failed, errors } = summary;
    const hasSuccess = successful > 0;
    const hasFailure = failed > 0;

    if (!hasSuccess && !hasFailure) {
      return;
    }

    const type: SweetAlertData['type'] = hasFailure ? (hasSuccess ? 'warning' : 'error') : 'success';

    const messageParts: string[] = [];
    if (hasSuccess) {
      messageParts.push(`${successful} file${successful === 1 ? '' : 's'} uploaded successfully.`);
    }
    if (hasFailure) {
      messageParts.push(`${failed} file${failed === 1 ? '' : 's'} failed to upload.`);
    }
    if (hasFailure && errors.length > 0) {
      messageParts.push(`Last error: ${errors[errors.length - 1]}`);
    }

    openModal('sweetAlert', {
      type,
      title,
      message: messageParts.join(' '),
      confirmText: 'OK'
    } as SweetAlertData);
  }, [openModal]);

  const handleUploadComplete = useCallback((summary: UploadCompletionSummary) => {
    showUploadSummary(summary, summary.failed > 0 ? 'Upload Complete with Issues' : 'Upload Complete');
  }, [showUploadSummary]);

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
  const startUploads = useCallback(async (files: File[]): Promise<UploadCompletionSummary> => {
    if (files.length === 0) {
      return { files, successful: 0, failed: 0, errors: [] };
    }

    const uploadIds = queueFiles(files, currentFolderId || undefined);
    const results = await waitForUploads(uploadIds);
    const successful = results.filter((result) => result.status === 'complete').length;
    const failed = results.length - successful;
    const errors = results
      .filter((result) => result.status !== 'complete' && result.error)
      .map((result) => result.error as string);

    if (successful > 0) {
      await refreshCurrentFolder();
    }

    return { files, successful, failed, errors };
  }, [currentFolderId, refreshCurrentFolder]);

  const handleFileDrop = useCallback(async (files: File[]) => {
    try {
      const summary = await startUploads(files);
      showUploadSummary(summary, summary.failed > 0 ? 'Upload Complete with Issues' : 'Files Uploaded');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      showUploadSummary(
        {
          files,
          successful: 0,
          failed: files.length,
          errors: [message],
        },
        'Upload Failed'
      );
    }
  }, [startUploads, showUploadSummary]);

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
          onPreview={handlePreview}
          onRename={handleRename}
          onExport={handleExport}
          onDelete={handleDelete}
        />

        {/* Library Content Grid with Drag-and-Drop */}
        {visibleItems.length > 0 ? (
          <DndLibraryGrid 
            items={visibleItems}
            onItemContextMenu={(item, e) => openContextMenu(e, item.id)}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No items in this folder</p>
            <p className="text-sm mt-2">Create a folder or upload files to get started</p>
          </div>
        )}

        {/* Context Menu */}
        {isContextMenuOpen && contextMenuPosition && targetItemId && items[targetItemId] && (
          <ContextMenu
            item={items[targetItemId]}
            position={contextMenuPosition}
            onClose={closeContextMenu}
          />
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

        {/* File Preview Modal */}
        <FilePreviewModal
          isOpen={!!previewFile}
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />

        {/* Export Modal */}
        <ExportModal
          isOpen={exportModalOpen}
          selectedItems={getSelectedItems()}
          onClose={() => setExportModalOpen(false)}
        />
      </div>
      
      {/* Upload Progress Widget */}
      <UploadProgress />
    </GlobalDropZone>
  );
}
