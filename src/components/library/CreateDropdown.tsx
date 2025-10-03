import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Folder, FileText, Bookmark, FolderOpen } from 'lucide-react';
import type { CreateOption, DropdownOption } from '@/types/libraryControls';

interface CreateDropdownProps {
  onSelect: (option: CreateOption) => void;
  disabled?: boolean;
}

/**
 * CreateDropdown component for library content creation
 * Features:
 * - Dropdown popover with create options
 * - Keyboard navigation support
 * - Icon integration for visual clarity
 * - Accessibility compliance
 */
export function CreateDropdown({ onSelect, disabled = false }: CreateDropdownProps) {
  const createOptions: Array<DropdownOption & { value: CreateOption }> = [
    {
      value: 'folder',
      label: 'New Folder',
      icon: '📁',
      description: 'Create a new folder to organize your files'
    },
    {
      value: 'document',
      label: 'New Document',
      icon: '📄',
      description: 'Create a new text document'
    },
    {
      value: 'collection',
      label: 'New Collection',
      icon: '📚',
      description: 'Create a themed collection of resources'
    },
    {
      value: 'bookmark',
      label: 'Add Bookmark',
      icon: '🔖',
      description: 'Bookmark a web resource or link'
    }
  ];

  const handleSelect = (option: CreateOption) => {
    onSelect(option);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case '📁':
        return <Folder className="h-4 w-4" />;
      case '📄':
        return <FileText className="h-4 w-4" />;
      case '📚':
        return <FolderOpen className="h-4 w-4" />;
      case '🔖':
        return <Bookmark className="h-4 w-4" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          disabled={disabled}
          className="gap-2"
          aria-label="Create new content"
        >
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {createOptions.map((option, index) => (
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
            {index < createOptions.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}