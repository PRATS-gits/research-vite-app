import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Folder, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateFolderModalProps, FolderTag, CreateFolderData } from '@/types/libraryModals';

/**
 * CreateFolderModal component for creating new folders
 * Features:
 * - Folder name input field
 * - Tag selection system
 * - Form validation
 * - Modal routing integration
 * - Accessibility compliance
 * - <200ms modal transition performance target
 */
export function CreateFolderModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [selectedTags, setSelectedTags] = useState<FolderTag[]>([]);
  const [description, setDescription] = useState('');

  const availableTags: Array<{ value: FolderTag; label: string; color: string }> = [
    { value: 'research-papers', label: 'Research Papers', color: 'bg-blue-100 text-blue-800' },
    { value: 'spreadsheets', label: 'Spreadsheets', color: 'bg-green-100 text-green-800' },
    { value: 'images', label: 'Images', color: 'bg-purple-100 text-purple-800' },
    { value: 'documents', label: 'Documents', color: 'bg-orange-100 text-orange-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleTagToggle = (tag: FolderTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      return;
    }

    const folderData: CreateFolderData = {
      name: folderName.trim(),
      tags: selectedTags,
      description: description.trim() || undefined
    };

    onConfirm(folderData);
    
    // Reset form
    setFolderName('');
    setSelectedTags([]);
    setDescription('');
  };

  const handleCancel = () => {
    // Reset form
    setFolderName('');
    setSelectedTags([]);
    setDescription('');
    onClose();
  };

  const isValid = folderName.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.value);
                return (
                  <Button
                    key={tag.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag.value)}
                    className={cn(
                      "h-8 text-xs",
                      isSelected && tag.color
                    )}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.label}
                    {isSelected && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {selectedTags.map((tag) => {
                  const tagConfig = availableTags.find(t => t.value === tag);
                  return (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={cn("text-xs", tagConfig?.color)}
                    >
                      {tagConfig?.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-description">Description (Optional)</Label>
            <Input
              id="folder-description"
              placeholder="Brief description of folder contents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isValid}
            className="gap-2"
          >
            <Folder className="h-4 w-4" />
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}