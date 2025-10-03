import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  // Get navigation state from store
  const currentFolderId = useLibraryStore((state) => state.currentFolderId);
  const folderPath = useLibraryStore((state) => state.folderPath);
  const items = useLibraryStore((state) => state.items);
  
  // Get current folder item
  const currentFolder = currentFolderId ? items[currentFolderId] : null;
  
  // Check if we can navigate back
  const canNavigateBack = folderPath.length > 0;
  
  // Navigate to folder by ID
  const goToFolder = useCallback((folderId: string | null) => {
    navigate(folderId ? `/library/folders/${folderId}` : '/library');
  }, [navigate]);
  
  // Navigate back to parent folder
  const goBack = useCallback(() => {
    if (canNavigateBack) {
      const parentPath = folderPath.slice(0, -1);
      const parentId = parentPath.length > 0 ? parentPath[parentPath.length - 1].id : null;
      navigate(parentId ? `/library/folders/${parentId}` : '/library');
    }
  }, [canNavigateBack, folderPath, navigate]);
  
  // Navigate to root (My Library)
  const goToRoot = useCallback(() => {
    navigate('/library');
  }, [navigate]);
  
  // Navigate to specific breadcrumb path item
  const navigateToBreadcrumb = useCallback((pathItem: FolderPath) => {
    navigate(pathItem.id ? `/library/folders/${pathItem.id}` : '/library');
  }, [navigate]);
  
  // Get folder display name
  const getFolderName = useCallback(() => {
    if (!currentFolderId) return 'My Library';
    // Get name from breadcrumb path (most reliable for nested folders)
    const lastPathItem = folderPath[folderPath.length - 1];
    if (lastPathItem && lastPathItem.id === currentFolderId) {
      return lastPathItem.name;
    }
    // Fallback to item lookup (for root-level folders before breadcrumb loads)
    return currentFolder?.name || 'Unknown Folder';
  }, [currentFolderId, currentFolder, folderPath]);
  
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
