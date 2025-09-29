import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Upload, File, FolderOpen, Link, Cloud } from 'lucide-react';
import type { UploadOption, DropdownOption } from '@/types/libraryControls';

interface UploadDropdownProps {
  onSelect: (option: UploadOption) => void;
  disabled?: boolean;
}

/**
 * UploadDropdown component for file and content upload
 * Features:
 * - Multiple upload source options
 * - Cloud service integration placeholders
 * - Keyboard navigation and accessibility
 * - Visual icons for clarity
 */
export function UploadDropdown({ onSelect, disabled = false }: UploadDropdownProps) {
  const uploadOptions: Array<DropdownOption & { value: UploadOption }> = [
    {
      value: 'file',
      label: 'Upload File',
      icon: 'file',
      description: 'Upload files from your computer'
    },
    {
      value: 'folder',
      label: 'Upload Folder',
      icon: 'folder',
      description: 'Upload entire folder with contents'
    },
    {
      value: 'url',
      label: 'From URL',
      icon: 'link',
      description: 'Import content from a web link'
    },
    {
      value: 'cloud',
      label: 'From Cloud',
      icon: 'cloud',
      description: 'Import from Google Drive, OneDrive, or S3'
    }
  ];

  const handleSelect = (option: UploadOption) => {
    onSelect(option);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'file':
        return <File className="h-4 w-4" />;
      case 'folder':
        return <FolderOpen className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      case 'cloud':
        return <Cloud className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
          aria-label="Upload content"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {uploadOptions.map((option, index) => (
          <div key={option.value}>
            <DropdownMenuItem
              onClick={() => handleSelect(option.value)}
              className="cursor-pointer gap-3 p-3"
              disabled={option.disabled}
            >
              <div className="flex items-center gap-3 flex-1">
                {getIcon(option.icon || '')}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
            {index < uploadOptions.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}