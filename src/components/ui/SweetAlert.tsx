import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SweetAlertProps } from '@/types/libraryModals';

/**
 * SweetAlert component for development feature alerts and notifications
 * Features:
 * - Multiple alert types (info, success, warning, error)
 * - Customizable title and message
 * - Optional confirmation/cancel actions
 * - Icon-based visual feedback
 * - Accessibility compliance
 */
export function SweetAlert({
  isOpen,
  data,
  onClose
}: SweetAlertProps) {
  
  // Guard clause for null data
  if (!data) {
    return null;
  }
  
  const handleConfirm = () => {
    if (data.onConfirm) {
      data.onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (data.onCancel) {
      data.onCancel();
    }
    onClose();
  };

  const getIcon = () => {
    switch (data.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getHeaderColor = () => {
    switch (data.type) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-700';
      case 'error':
        return 'text-red-700';
      case 'info':
      default:
        return 'text-blue-700';
    }
  };

  const getBackgroundColor = () => {
    switch (data.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const hasActions = data.onConfirm || data.onCancel;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className={cn(
          'flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4',
          getBackgroundColor()
        )}>
          {getIcon()}
        </div>

        <DialogHeader className="text-center">
          <DialogTitle className={cn('text-lg', getHeaderColor())}>
            {data.title}
          </DialogTitle>
          {data.message && (
            <DialogDescription className="text-center mt-2">
              {data.message}
            </DialogDescription>
          )}
        </DialogHeader>

        {hasActions ? (
          <DialogFooter className="gap-2 mt-6">
            {data.onCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                {data.cancelText || 'Cancel'}
              </Button>
            )}
            {data.onConfirm && (
              <Button
                onClick={handleConfirm}
                variant={data.type === 'error' ? 'destructive' : 'default'}
              >
                {data.confirmText || 'OK'}
              </Button>
            )}
          </DialogFooter>
        ) : (
          <DialogFooter className="mt-6">
            <Button onClick={onClose} className="w-full">
              OK
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}