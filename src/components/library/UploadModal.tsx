import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Folder } from 'lucide-react';
import { queueFiles, waitForUploads } from '@/services/fileUploadService';
import { useLibraryStore } from '@/store/libraryStore';
import { cn } from '@/lib/utils';
import type { UploadModalProps, UploadCompletionSummary } from '@/types/libraryModals';

/**
 * UploadModal component - Phase 5B Real Upload Integration
 * Features:
 * - Direct file/folder selection
 * - Real upload to S3 via presigned URLs
 * - Upload queue integration
 * - Automatic folder refresh after upload
 * - Performance optimized <200ms response
 */
export function UploadModal({ 
  isOpen, 
  type, 
  onClose, 
  onComplete 
}: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const currentFolderId = useLibraryStore((state) => state.currentFolderId);
  const refreshCurrentFolder = useLibraryStore((state) => state.refreshCurrentFolder);
  const folderInputProps = type === 'folder'
    ? ({ webkitdirectory: 'true', directory: 'true' } as Record<string, string>)
    : undefined;

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }, []);

  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);

    const filesSnapshot = [...selectedFiles];

    try {
      const uploadIds = queueFiles(filesSnapshot, currentFolderId || undefined);
      const results = await waitForUploads(uploadIds);

      const successful = results.filter((result) => result.status === 'complete').length;
      const failed = results.length - successful;
      const errors = results
        .filter((result) => result.status !== 'complete' && result.error)
        .map((result) => result.error as string);

      if (successful > 0) {
        await refreshCurrentFolder();
      }

      const summary: UploadCompletionSummary = {
        files: filesSnapshot,
        successful,
        failed,
        errors,
      };

      onComplete(summary);
      handleClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      onComplete({
        files: filesSnapshot,
        successful: 0,
        failed: filesSnapshot.length,
        errors: [message],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload {type === 'file' ? 'Files' : 'Folder'}
          </DialogTitle>
          <DialogDescription>
            {type === 'file' 
              ? 'Select one or more files to upload to your library'
              : 'Select a folder to upload all its contents'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors break-words',
              isDragOver ? 'border-primary bg-primary/5' : 'border-muted',
              selectedFiles.length > 0 && 'border-primary'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {type === 'file' ? (
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            ) : (
              <Folder className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            )}
            
            <p className="text-sm font-medium mb-2">
              {isDragOver
                ? 'Drop files here'
                : selectedFiles.length > 0
                ? `${selectedFiles.length} file(s) selected`
                : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-muted-foreground mb-4">or</p>
            
            <label>
              <Button variant="outline" asChild>
                <span>
                  Browse {type === 'file' ? 'Files' : 'Folder'}
                </span>
              </Button>
              <input
                type="file"
                multiple={type === 'file'}
                {...(folderInputProps ?? {})}
                onChange={type === 'file' ? handleFileSelect : handleFolderSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* File List */}
          {selectedFiles.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
              <p className="text-sm font-medium mb-2">Selected Files:</p>
              {selectedFiles.map((file, index) => {
                const fileName = file.name;
                const lastDotIndex = fileName.lastIndexOf('.');
                const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
                const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
                const displayName = nameWithoutExt.length > 30 
                  ? `${nameWithoutExt.substring(0, 27)}...${extension}`
                  : fileName;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded bg-muted/50 gap-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                      <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span 
                        className="truncate text-ellipsis overflow-hidden block" 
                        title={fileName}
                      >
                        {displayName}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            aria-busy={isUploading}
          >
            {isUploading ? 'Uploading…' : 'Upload'}
            {!isUploading && selectedFiles.length > 0 && ` (${selectedFiles.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
