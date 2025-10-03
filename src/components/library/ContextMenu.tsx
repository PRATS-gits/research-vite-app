/**
 * ContextMenu Component
 * Google Drive-like right-click context menu for files and folders
 */

import React, { useState } from 'react';
import {
  FolderOpen,
  Download,
  Share2,
  FolderInput,
  Copy,
  Edit,
  Star,
  Info,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/store/libraryStore';
import type { LibraryItem } from '@/types/library';
import { ShareModal } from './ShareModal';
import { MoveToModal } from './MoveToModal';
import { DetailsPanel } from './DetailsPanel';
import { RenameModal } from './RenameModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ContextMenuProps {
  item: LibraryItem;
  position: { x: number; y: number };
  onClose: () => void;
}

interface ContextMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
  className?: string;
}

export function ContextMenu({ item, position, onClose }: ContextMenuProps) {
  const [activeModal, setActiveModal] = useState<
    'share' | 'move' | 'details' | 'rename' | 'delete' | null
  >(null);

  const downloadFile = useLibraryStore((state) => state.downloadFile);
  const duplicateFile = useLibraryStore((state) => state.duplicateFile);
  const starItem = useLibraryStore((state) => state.starItem);
  const navigateToFolder = useLibraryStore((state) => state.navigateToFolder);

  const handleOpen = () => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    }
    onClose();
  };

  const handleDownload = async () => {
    if (item.type === 'file') {
      try {
        await downloadFile(item.id);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
    onClose();
  };

  const handleShare = () => {
    setActiveModal('share');
  };

  const handleMove = () => {
    setActiveModal('move');
  };

  const handleCopy = async () => {
    if (item.type === 'file') {
      try {
        await duplicateFile(item.id);
      } catch (error) {
        console.error('Duplicate failed:', error);
      }
    }
    onClose();
  };

  const handleRename = () => {
    setActiveModal('rename');
  };

  const handleStar = async () => {
    try {
      await starItem(item.id);
    } catch (error) {
      console.error('Star failed:', error);
    }
    onClose();
  };

  const handleDetails = () => {
    setActiveModal('details');
  };

  const handleDelete = () => {
    setActiveModal('delete');
  };

  const closeModal = () => {
    setActiveModal(null);
    onClose();
  };

  const menuItems: (ContextMenuItem | { divider: true })[] = [
    {
      id: 'open',
      label: item.type === 'folder' ? 'Open' : 'Preview',
      icon: FolderOpen,
      action: handleOpen,
    },
    { divider: true },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      action: handleDownload,
      disabled: item.type === 'folder', // TODO: Implement folder download as ZIP
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      action: handleShare,
      disabled: item.type === 'folder', // Only files for now
    },
    { divider: true },
    {
      id: 'move',
      label: 'Move to...',
      icon: FolderInput,
      action: handleMove,
    },
    {
      id: 'copy',
      label: 'Make a copy',
      icon: Copy,
      action: handleCopy,
      disabled: item.type === 'folder', // TODO: Implement folder duplication
    },
    {
      id: 'rename',
      label: 'Rename',
      icon: Edit,
      action: handleRename,
    },
    { divider: true },
    {
      id: 'star',
      label: item.starred ? 'Remove from starred' : 'Add to starred',
      icon: Star,
      action: handleStar,
    },
    {
      id: 'details',
      label: 'Details',
      icon: Info,
      action: handleDetails,
    },
    { divider: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      action: handleDelete,
      className: 'text-red-600 hover:bg-red-50 hover:text-red-700',
    },
  ];

  return (
    <>
      <div
        className="fixed z-50 min-w-[240px] rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((menuItem, index) => {
          if ('divider' in menuItem) {
            return (
              <div
                key={`divider-${index}`}
                className="my-1 h-px bg-border"
              />
            );
          }

          const { id, label, icon: Icon, action, disabled, className } = menuItem;

          return (
            <button
              key={id}
              onClick={action}
              disabled={disabled}
              className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground',
                'disabled:pointer-events-none disabled:opacity-50',
                className
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {activeModal === 'share' && item.type === 'file' && (
        <ShareModal fileId={item.id} onClose={closeModal} />
      )}

      {activeModal === 'move' && (
        <MoveToModal itemIds={[item.id]} onClose={closeModal} />
      )}

      {activeModal === 'details' && (
        <DetailsPanel itemId={item.id} onClose={closeModal} />
      )}

      {activeModal === 'rename' && (
        <RenameModal
          itemName={item.name}
          itemType={item.type}
          isOpen={true}
          onClose={closeModal}
          onConfirm={async (newName) => {
            try {
              const renameItem = useLibraryStore.getState().renameItem;
              await renameItem(item.id, newName);
              closeModal();
            } catch (error) {
              console.error('Rename failed:', error);
            }
          }}
        />
      )}

      {activeModal === 'delete' && (
        <DeleteConfirmModal
          isOpen={true}
          data={{
            itemIds: [item.id],
            itemNames: [item.name],
            itemCount: 1,
          }}
          onClose={closeModal}
          onConfirm={async () => {
            try {
              const deleteItems = useLibraryStore.getState().deleteItems;
              await deleteItems([item.id]);
              closeModal();
            } catch (error) {
              console.error('Delete failed:', error);
            }
          }}
        />
      )}
    </>
  );
}
