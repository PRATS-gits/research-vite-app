/**
 * UploadProgress Component
 * Phase 5B: Visualize upload queue with progress tracking
 * Features:
 * - Real-time upload progress display
 * - Queue status indicators
 * - Cancel and retry buttons
 * - Error handling and display
 * - Performance optimized with React.memo
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  CheckCircle,
  XCircle,
  X,
  RotateCw,
  Clock,
  Loader2,
} from 'lucide-react';
import { useUploadQueueStore } from '@/store/uploadQueueStore';
import { cancelUpload, retryUpload } from '@/services/fileUploadService';
import { cn } from '@/lib/utils';

interface UploadProgressProps {
  className?: string;
  maxVisible?: number;
}

/**
 * UploadProgress - Shows active uploads with progress
 */
export const UploadProgress = React.memo(function UploadProgress({
  className,
  maxVisible = 5,
}: UploadProgressProps) {
  const uploads = useUploadQueueStore((state) => state.uploads);
  const removeUpload = useUploadQueueStore((state) => state.removeUpload);

  // Get active uploads (uploading, pending, or failed)
  const activeUploads = Object.values(uploads).filter(
    (upload) => upload.status !== 'complete'
  );

  // Show nothing if no active uploads
  if (activeUploads.length === 0) {
    return null;
  }

  // Limit visible uploads
  const visibleUploads = activeUploads.slice(0, maxVisible);
  const hiddenCount = activeUploads.length - visibleUploads.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-500" />;
      default:
        return <Upload className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      uploading: 'default',
      complete: 'secondary',
      failed: 'destructive',
      pending: 'outline',
      cancelled: 'secondary',
    };

    const labels: Record<string, string> = {
      uploading: 'Uploading',
      complete: 'Complete',
      failed: 'Failed',
      pending: 'Pending',
      cancelled: 'Cancelled',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {labels[status] || status}
      </Badge>
    );
  };

  const handleCancel = async (id: string) => {
    await cancelUpload(id);
  };

  const handleRetry = async (id: string) => {
    await retryUpload(id);
  };

  const handleRemove = (id: string) => {
    removeUpload(id);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Card
      className={cn('fixed bottom-4 right-4 w-96 shadow-lg z-50', className)}
      aria-live="polite"
      aria-atomic="false"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Uploads ({activeUploads.length})
          </div>
          {hiddenCount > 0 && (
            <span className="text-xs text-muted-foreground font-normal">
              +{hiddenCount} more
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
        {visibleUploads.map((upload) => (
          <div
            key={upload.id}
            className="space-y-2 p-3 rounded-lg border bg-card"
          >
            {/* File Info Row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {getStatusIcon(upload.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(upload.file.size)}
                  </p>
                </div>
              </div>
              {getStatusBadge(upload.status)}
            </div>

            {/* Progress Bar */}
            {upload.status === 'uploading' && (
              <div className="space-y-1">
                <Progress value={upload.progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {upload.progress}%
                </p>
              </div>
            )}

            {upload.status === 'pending' && (
              <p className="text-xs text-muted-foreground">
                Preparing upload… waiting for an available slot
              </p>
            )}

            {/* Error Message */}
            {upload.status === 'failed' && upload.error && (
              <p className="text-xs text-red-500" role="alert">
                {upload.error}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {upload.status === 'uploading' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => handleCancel(upload.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              )}

              {upload.status === 'failed' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handleRetry(upload.id)}
                  >
                    <RotateCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => handleRemove(upload.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </>
              )}

              {upload.status === 'complete' && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs ml-auto"
                  onClick={() => handleRemove(upload.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
