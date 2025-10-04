import { useState, useCallback, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalDropZoneProps {
  onFileDrop?: (files: File[]) => void;
  children: React.ReactNode;
}

/**
 * GlobalDropZone Component
 * App-level drop zone for external file uploads
 * Features:
 * - Window-level drag event listeners
 * - Visual overlay when files are dragged over
 * - File drop handling
 * - Non-intrusive when not active
 */
export function GlobalDropZone({ onFileDrop, children }: GlobalDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  // @ts-expect-error - dragCounter is used indirectly in setDragCounter
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if dragging files
    if (e.dataTransfer?.types.includes('Files')) {
      setDragCounter(prev => prev + 1);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer?.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length > 0 && onFileDrop) {
      onFileDrop(files);
    }
  }, [onFileDrop]);

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <div className="relative">
      {children}
      
      {/* Drop Overlay */}
      {isDragging && (
        <div className={cn(
          'fixed inset-0 z-50',
          'bg-background/80 backdrop-blur-sm',
          'flex items-center justify-center',
          'animate-in fade-in duration-200'
        )}>
          <div className={cn(
            'border-4 border-dashed border-primary rounded-lg',
            'p-12 bg-muted/50',
            'flex flex-col items-center gap-4'
          )}>
            <Upload className="h-16 w-16 text-primary" />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Drop files here to upload</h3>
              <p className="text-muted-foreground">
                Release to upload files to the current folder
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
