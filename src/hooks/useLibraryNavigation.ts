import { useCallback } from 'react';
import { useLibraryStore } from '@/store/libraryStore';
import type { FolderPath } from '@/types/library';

/**
 * Custom hook for library folder navigation
 * Provides navigation methods and current folder state
 * Features:
 * - Folder navigation (forward, back, root)
 * - Breadcrumb path tracking
 * - Performance optimized with useCallback
 */
export function useLibraryNavigation() {
  // Get navigation state from store
  const currentFolderId = useLibraryStore((state) => state.currentFolderId);
  const folderPath = useLibraryStore((state) => state.folderPath);
  const items = useLibraryStore((state) => state.items);
  
  // Get navigation actions from store
  const navigateToFolder = useLibraryStore((state) => state.navigateToFolder);
  const navigateBack = useLibraryStore((state) => state.navigateBack);
  const navigateToRoot = useLibraryStore((state) => state.navigateToRoot);
  
  // Get current folder item
  const currentFolder = currentFolderId ? items[currentFolderId] : null;
  
  // Check if we can navigate back
  const canNavigateBack = folderPath.length > 0;
  
  // Navigate to folder by ID
  const goToFolder = useCallback((folderId: string | null) => {
    navigateToFolder(folderId);
  }, [navigateToFolder]);
  
  // Navigate back to parent folder
  const goBack = useCallback(() => {
    if (canNavigateBack) {
      navigateBack();
    }
  }, [canNavigateBack, navigateBack]);
  
  // Navigate to root (My Library)
  const goToRoot = useCallback(() => {
    navigateToRoot();
  }, [navigateToRoot]);
  
  // Navigate to specific breadcrumb path item
  const navigateToBreadcrumb = useCallback((pathItem: FolderPath) => {
    navigateToFolder(pathItem.id);
  }, [navigateToFolder]);
  
  // Get folder display name
  const getFolderName = useCallback(() => {
    if (!currentFolderId) return 'My Library';
    return currentFolder?.name || 'Unknown Folder';
  }, [currentFolderId, currentFolder]);
  
  return {
    // State
    currentFolderId,
    currentFolder,
    folderPath,
    canNavigateBack,
    folderName: getFolderName(),
    
    // Actions
    goToFolder,
    goBack,
    goToRoot,
    navigateToBreadcrumb,
  };
}
