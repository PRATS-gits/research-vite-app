import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ModalType, ModalState, ModalRouting } from '@/types/libraryModals';

/**
 * Custom hook for modal routing and state management
 * Features:
 * - URL-based modal routing (e.g., /library/#/createFolder)
 * - Modal state management
 * - Browser navigation integration
 * - Keyboard navigation support (Escape key)
 * - Performance optimization with useCallback
 */
export function useModalRouting(): ModalRouting {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null
  });

  // Parse modal type from URL hash
  const parseModalFromUrl = useCallback(() => {
    const hash = location.hash;
    if (hash.startsWith('#/')) {
      const modalPath = hash.substring(2);
      switch (modalPath) {
        case 'createFolder':
          return 'createFolder' as ModalType;
        case 'uploadFile':
          return 'uploadFile' as ModalType;
        case 'uploadFolder':
          return 'uploadFolder' as ModalType;
        default:
          return null;
      }
    }
    return null;
  }, [location.hash]);

  // Update modal state based on URL changes
  useEffect(() => {
    const modalType = parseModalFromUrl();
    
    if (modalType) {
      setModalState(prev => ({
        ...prev,
        isOpen: true,
        type: modalType
      }));
    } else {
      setModalState(prev => ({
        ...prev,
        isOpen: false,
        type: null,
        data: null
      }));
    }
  }, [parseModalFromUrl]);

  const closeModal = useCallback(() => {
    // Remove hash from URL
    const currentPath = location.pathname + location.search;
    navigate(currentPath, { replace: true });
    
    setModalState({
      isOpen: false,
      type: null,
      data: null
    });
  }, [navigate, location.pathname, location.search]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalState.isOpen) {
        closeModal();
      }
    };

    if (modalState.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [modalState.isOpen, closeModal]);

  const openModal = useCallback((type: ModalType, data?: any) => {
    // Update URL with modal route
    const currentPath = location.pathname;
    let modalRoute = '';
    
    switch (type) {
      case 'createFolder':
        modalRoute = `${currentPath}#/createFolder`;
        break;
      case 'uploadFile':
        modalRoute = `${currentPath}#/uploadFile`;
        break;
      case 'uploadFolder':
        modalRoute = `${currentPath}#/uploadFolder`;
        break;
      case 'deleteConfirm':
      case 'sweetAlert':
        // These modals don't use URL routing
        setModalState({
          isOpen: true,
          type,
          data
        });
        return;
      default:
        return;
    }

    navigate(modalRoute);
    
    if (data) {
      setModalState(prev => ({
        ...prev,
        data
      }));
    }
  }, [navigate, location.pathname]);


  return {
    openModal,
    closeModal,
    modalState
  };
}