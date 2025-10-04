/**
 * useContextMenu Hook
 * Manages context menu state and positioning
 */

import { useState, useCallback, useEffect } from 'react';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface UseContextMenuReturn {
  isOpen: boolean;
  position: ContextMenuPosition | null;
  targetItemId: string | null;
  openContextMenu: (e: React.MouseEvent, itemId: string) => void;
  closeContextMenu: () => void;
}

export function useContextMenu(): UseContextMenuReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition | null>(null);
  const [targetItemId, setTargetItemId] = useState<string | null>(null);

  const openContextMenu = useCallback((e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Context menu approximate dimensions
    const menuWidth = 240;
    const menuHeight = 400;
    
    // Calculate position with boundary checks
    let x = e.clientX;
    let y = e.clientY;
    
    // Adjust if menu would overflow right edge
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }
    
    // Adjust if menu would overflow bottom edge
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }
    
    setPosition({ x, y });
    setTargetItemId(itemId);
    setIsOpen(true);
  }, []);

  const closeContextMenu = useCallback(() => {
    setIsOpen(false);
    setPosition(null);
    setTargetItemId(null);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = () => closeContextMenu();
    const handleScroll = () => closeContextMenu();
    const handleResize = () => closeContextMenu();

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, closeContextMenu]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeContextMenu]);

  return {
    isOpen,
    position,
    targetItemId,
    openContextMenu,
    closeContextMenu,
  };
}
