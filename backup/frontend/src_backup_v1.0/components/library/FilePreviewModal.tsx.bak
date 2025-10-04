/**
 * FilePreviewModal Component
 * Phase 5B: File preview with presigned URLs
 * Features:
 * - PDF preview using iframe
 * - Image preview with zoom
 * - Document preview
 * - Loading states
 * - Error handling
 * - Download option
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle, ZoomIn, ZoomOut, X } from 'lucide-react';
import { requestPresignedDownloadUrl } from '@/api/filesApi';
import type { LibraryItem } from '@/types/library';

interface FilePreviewModalProps {
  isOpen: boolean;
  file: LibraryItem | null;
  onClose: () => void;
}

/**
 * FilePreviewModal - Preview files with presigned S3 URLs
 */
export function FilePreviewModal({
  isOpen,
  file,
  onClose,
}: FilePreviewModalProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(100);

  // Fetch presigned URL when file changes
  useEffect(() => {
    if (!file || !isOpen) {
      setDownloadUrl(null);
      setError(null);
      setImageZoom(100);
      return;
    }

    const fetchPreviewUrl = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await requestPresignedDownloadUrl(file.id);
        setDownloadUrl(response.downloadUrl);
      } catch (err) {
        console.error('Failed to fetch preview URL:', err);
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviewUrl();
  }, [file, isOpen]);

  if (!file) return null;

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleZoomIn = () => {
    setImageZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setImageZoom((prev) => Math.max(prev - 25, 50));
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm font-medium mb-1">Failed to load preview</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleDownload}
              disabled={!downloadUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        </div>
      );
    }

    if (!downloadUrl) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-sm text-muted-foreground">No preview available</p>
        </div>
      );
    }

    // Determine file type from extension
    const fileType = file.type === 'file' ? file.fileType : null;

    // Image preview
    if (fileType === 'image') {
      return (
        <div className="relative h-[500px] overflow-auto bg-muted/20">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleZoomOut}
              disabled={imageZoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs bg-secondary px-2 py-1 rounded flex items-center">
              {imageZoom}%
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleZoomIn}
              disabled={imageZoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-full p-4">
            <img
              src={downloadUrl}
              alt={file.name}
              style={{ width: `${imageZoom}%` }}
              className="max-w-none"
            />
          </div>
        </div>
      );
    }

    // PDF preview
    const extension = file.type === 'file' ? file.extension : '';
    if (fileType === 'pdf' || extension === 'pdf') {
      return (
        <iframe
          src={downloadUrl}
          title={file.name}
          className="w-full h-[500px] border-0"
        />
      );
    }

    // Document preview (attempt iframe)
    if (fileType === 'document') {
      return (
        <div className="space-y-4">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`}
            title={file.name}
            className="w-full h-[500px] border rounded"
          />
          <p className="text-xs text-muted-foreground text-center">
            Preview may not work for all document types. Click download to view locally.
          </p>
        </div>
      );
    }

    // Generic preview fallback
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">Preview not available</p>
          <p className="text-xs text-muted-foreground mb-4">
            This file type cannot be previewed in the browser
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download to View
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent 
        className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate mr-4">{file.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {renderPreview()}
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {file.type === 'file' && file.size && (
              <span>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!downloadUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
