import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, File, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileItem } from '@/types/library';
import { formatFileSize } from '@/types/library';
import { format } from 'date-fns';

interface FileCardProps {
  file: FileItem;
  isSelected: boolean;
  isSelectionMode: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * FileCard Component
 * Displays a file with thumbnail, metadata, and selection checkbox
 * Features:
 * - Drag-and-drop support with @dnd-kit
 * - Checkbox selection
 * - File type icons
 * - Metadata display (size, date)
 * - Hover and selected states
 * - Performance optimized with React.memo
 */
export const FileCard = memo(function FileCard({
  file,
  isSelected,
  isSelectionMode,
  onCheckboxChange,
  onClick,
  onDoubleClick,
  onContextMenu,
}: FileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get file icon based on file type
  const getFileIcon = () => {
    switch (file.fileType) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500" />;
      case 'image':
        return <Image className="h-12 w-12 text-blue-500" />;
      case 'document':
        return <FileText className="h-12 w-12 text-blue-600" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };

  // Get file type badge color
  const getBadgeVariant = () => {
    switch (file.fileType) {
      case 'pdf':
        return 'destructive';
      case 'image':
        return 'default';
      case 'document':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking checkbox
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    onClick(e);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          'group relative cursor-pointer overflow-hidden transition-all duration-200',
          'hover:shadow-lg hover:scale-[1.02]',
          isSelected && 'ring-2 ring-primary shadow-lg',
          isDragging && 'opacity-50 cursor-grabbing'
        )}
        onClick={handleCardClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        {/* Drag handle overlay */}
        <div
          {...listeners}
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          aria-label="Drag handle"
        />

        {/* Checkbox - always visible in selection mode or when selected */}
        {(isSelectionMode || isSelected) && (
          <div
            className="absolute top-2 left-2 z-20"
            data-checkbox
            onClick={handleCheckboxClick}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={onCheckboxChange}
              aria-label={`Select ${file.name}`}
            />
          </div>
        )}

        {/* Star indicator - show if item is starred */}
        {file.starred && (
          <div className="absolute top-2 right-2 z-20">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}

        {/* File Icon/Thumbnail */}
        <div className="flex items-center justify-center h-32 bg-muted/30 p-4">
          {file.thumbnailUrl ? (
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            getFileIcon()
          )}
        </div>

        {/* File Info */}
        <div className="p-3 space-y-2">
          {/* File Name */}
          <h3
            className="font-medium text-sm line-clamp-2 leading-tight"
            title={file.name}
          >
            {file.name}
          </h3>

          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <Badge variant={getBadgeVariant()} className="text-xs">
              {file.extension.toUpperCase()}
            </Badge>
          </div>

          {/* Date */}
          <div className="text-xs text-muted-foreground">
            {format(file.updatedAt, 'MMM d, yyyy')}
          </div>
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        )}
      </Card>
    </div>
  );
});
