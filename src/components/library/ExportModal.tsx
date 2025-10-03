/**
 * ExportModal Component
 * Phase 5B: Bulk export with JSZip integration
 * Features:
 * - Bulk file download
 * - ZIP file generation
 * - Progress tracking
 * - Metadata JSON export
 * - Cancel support
 * - Error handling
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Loader2, AlertCircle, FileArchive, CheckCircle2 } from 'lucide-react';
import { requestPresignedDownloadUrl } from '@/api/filesApi';
import JSZip from 'jszip';
import type { LibraryItem } from '@/types/library';

interface ExportModalProps {
  isOpen: boolean;
  selectedItems: LibraryItem[];
  onClose: () => void;
}

type ExportStatus = 'idle' | 'preparing' | 'downloading' | 'generating' | 'complete' | 'error';

/**
 * ExportModal - Bulk download selected files as ZIP
 */
export function ExportModal({
  isOpen,
  selectedItems,
  onClose,
}: ExportModalProps) {
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isCancelled, setIsCancelled] = useState(false);

  const fileItems = selectedItems.filter((item) => item.type === 'file');
  const totalFiles = fileItems.length;

  const handleClose = () => {
    if (status === 'downloading' || status === 'generating') {
      setIsCancelled(true);
    }
    setStatus('idle');
    setProgress(0);
    setError(null);
    setIsCancelled(false);
    onClose();
  };

  const handleExport = async () => {
    if (totalFiles === 0) {
      setError('No files selected for export');
      return;
    }

    setStatus('preparing');
    setError(null);
    setIsCancelled(false);
    setProgress(0);

    try {
      const zip = new JSZip();
      const metadata: Record<string, unknown>[] = [];

      // Download and add files to ZIP
      setStatus('downloading');
      
      for (let i = 0; i < fileItems.length; i++) {
        if (isCancelled) {
          throw new Error('Export cancelled by user');
        }

        const file = fileItems[i];
        setProgress(Math.round(((i + 1) / totalFiles) * 90)); // Reserve 10% for ZIP generation

        try {
          // Get presigned download URL
          const { downloadUrl } = await requestPresignedDownloadUrl(file.id);

          // Fetch file content
          const response = await fetch(downloadUrl);
          if (!response.ok) {
            throw new Error(`Failed to download ${file.name}`);
          }

          const blob = await response.blob();

          // Add to ZIP with folder structure if needed
          const fileName = file.name;
          zip.file(fileName, blob);

          // Collect metadata
          if (includeMetadata) {
            metadata.push({
              id: file.id,
              name: file.name,
              size: file.size,
              type: file.extension,
              createdAt: file.createdAt,
              updatedAt: file.updatedAt,
            });
          }
        } catch (err) {
          console.error(`Failed to add file ${file.name}:`, err);
          // Continue with other files
        }
      }

      // Add metadata JSON if requested
      if (includeMetadata && metadata.length > 0) {
        const metadataJson = JSON.stringify(metadata, null, 2);
        zip.file('metadata.json', metadataJson);
      }

      // Generate ZIP file
      setStatus('generating');
      setProgress(95);

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      setProgress(100);
      setStatus('complete');

      // Trigger download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `research-library-export-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
      setStatus('error');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileArchive className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {totalFiles} file{totalFiles !== 1 ? 's' : ''} selected
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Files will be downloaded and packaged into a ZIP archive
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
              />
              <Label htmlFor="metadata" className="text-sm cursor-pointer">
                Include metadata.json with file information
              </Label>
            </div>

            {totalFiles === 0 && (
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No files selected. Only files can be exported.
                </p>
              </div>
            )}
          </div>
        );

      case 'preparing':
      case 'downloading':
      case 'generating':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-sm font-medium mb-1">
                  {status === 'preparing' && 'Preparing export...'}
                  {status === 'downloading' && `Downloading files...`}
                  {status === 'generating' && 'Generating ZIP archive...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === 'downloading' && `${Math.round(progress * totalFiles / 90)} of ${totalFiles} files`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {progress}%
              </p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-sm font-medium mb-1">Export Complete!</p>
              <p className="text-xs text-muted-foreground">
                Your download should start automatically
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
              <p className="text-sm font-medium mb-1">Export Failed</p>
              <p className="text-xs text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={handleExport}>
                Try Again
              </Button>
            </div>
          </div>
        );
    }
  };

  const isProcessing = ['preparing', 'downloading', 'generating'].includes(status);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Files
          </DialogTitle>
          {status === 'idle' && (
            <DialogDescription>
              Download selected files as a ZIP archive
            </DialogDescription>
          )}
        </DialogHeader>

        {renderContent()}

        <DialogFooter>
          {status === 'idle' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={totalFiles === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </>
          )}

          {isProcessing && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}

          {(status === 'complete' || status === 'error') && (
            <Button onClick={handleClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
