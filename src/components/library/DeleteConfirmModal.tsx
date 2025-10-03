import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { DeleteConfirmModalProps } from '@/types/libraryModals';

/**
 * DeleteConfirmModal component for confirming item deletion
 * Features:
 * - Item details display
 * - Confirmation dialog with warning
 * - Accessibility compliance
 * - Keyboard navigation (Enter/Escape)
 * - Clear action buttons
 */
export function DeleteConfirmModal({
  isOpen,
  data,
  onClose,
  onConfirm
}: DeleteConfirmModalProps) {
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const itemText = data?.itemCount === 1 ? 'item' : 'items';

  // Guard clause for null data
  if (!data) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel} modal>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The selected {itemText} will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Items to delete:</span>
            <Badge variant="destructive">
              {data.itemCount} {itemText}
            </Badge>
          </div>

          {data.itemNames.length > 0 && (
            <div className="border rounded-lg p-3 bg-muted/20">
              <h4 className="text-sm font-medium mb-2">Selected items:</h4>
              <ul className="space-y-1">
                {data.itemNames.slice(0, 5).map((name, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    {name}
                  </li>
                ))}
                {data.itemNames.length > 5 && (
                  <li className="text-sm text-muted-foreground italic">
                    ... and {data.itemNames.length - 5} more {itemText}
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Warning</p>
                <p className="text-destructive/80 mt-1">
                  This action is permanent and cannot be undone. Make sure you want to delete these {itemText}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete {data.itemCount} {itemText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}