/**
 * Lock Warning Modal Component
 * Warns users before configuration lock is applied
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock } from 'lucide-react';
import type { LockWarningData } from '@/types/connection';
import { PROVIDER_CONFIGS } from '@/types/connection';

interface LockWarningModalProps {
  isOpen: boolean;
  data: LockWarningData | null;
}

export function LockWarningModal({ isOpen, data }: LockWarningModalProps) {
  if (!data) return null;
  
  const providerConfig = PROVIDER_CONFIGS[data.provider];
  
  return (
    <Dialog open={isOpen} onOpenChange={() => data.onCancel()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-yellow-50 border-yellow-200 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg text-yellow-700 flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            Configuration Will Be Locked
          </DialogTitle>
          <DialogDescription className="text-center mt-2 space-y-2">
            <p>
              You are about to configure <strong>{providerConfig.label}</strong> storage
              with bucket <strong>{data.bucketName}</strong>.
            </p>
            <p className="text-amber-700 font-medium">
              Once saved, this configuration will be permanently locked to prevent accidental changes.
            </p>
            <p className="text-sm text-muted-foreground">
              You will need administrator access to modify or unlock this configuration later.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-amber-900 mb-2">⚠️ Important:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li>Verify all credentials are correct</li>
            <li>Test the connection before saving</li>
            <li>Configuration cannot be easily changed</li>
            <li>Admin override required for modifications</li>
          </ul>
        </div>
        
        <DialogFooter className="gap-2 mt-6">
          <Button
            variant="outline"
            onClick={data.onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={data.onConfirm}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          >
            Confirm & Lock Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
