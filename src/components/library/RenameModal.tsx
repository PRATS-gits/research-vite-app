import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RenameModalProps {
  isOpen: boolean;
  itemName: string;
  itemType: 'file' | 'folder';
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

/**
 * RenameModal Component
 * Modal for renaming files and folders with validation
 * Features:
 * - Name validation (no empty, no invalid characters)
 * - File extension preservation for files
 * - Error messaging
 * - Keyboard shortcuts (Enter to confirm, Esc to cancel)
 */
export function RenameModal({
  isOpen,
  itemName,
  itemType,
  onClose,
  onConfirm,
}: RenameModalProps) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  // Initialize name when modal opens
  useEffect(() => {
    if (isOpen) {
      // For files, remove extension for editing
      if (itemType === 'file') {
        const lastDot = itemName.lastIndexOf('.');
        if (lastDot > 0) {
          setNewName(itemName.substring(0, lastDot));
        } else {
          setNewName(itemName);
        }
      } else {
        setNewName(itemName);
      }
      setError('');
    }
  }, [isOpen, itemName, itemType]);

  // Validate name
  const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Name cannot be empty';
    }

    if (name.length > 255) {
      return 'Name is too long (max 255 characters)';
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/g;
    if (invalidChars.test(name)) {
      return 'Name cannot contain: < > : " / \\ | ? *';
    }

    return null;
  };

  const handleConfirm = () => {
    const validationError = validateName(newName);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Add extension back for files
    let finalName = newName.trim();
    if (itemType === 'file') {
      const extension = itemName.substring(itemName.lastIndexOf('.'));
      if (extension) {
        finalName += extension;
      }
    }

    onConfirm(finalName);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Rename {itemType === 'file' ? 'File' : 'Folder'}</DialogTitle>
          <DialogDescription>
            Enter a new name for "{itemName}"
            {itemType === 'file' && ' (extension will be preserved)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rename-input">New name</Label>
            <Input
              id="rename-input"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Enter ${itemType} name`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
