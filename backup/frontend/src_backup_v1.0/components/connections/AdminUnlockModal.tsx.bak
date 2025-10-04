/**
 * Admin Unlock Modal Component
 * Admin override modal for unlocking configuration
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Unlock } from 'lucide-react';
import type { AdminUnlockData } from '@/types/connection';
import { PROVIDER_CONFIGS } from '@/types/connection';

interface AdminUnlockModalProps {
  isOpen: boolean;
  data: AdminUnlockData | null;
}

export function AdminUnlockModal({ isOpen, data }: AdminUnlockModalProps) {
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');
  
  if (!data) return null;
  
  const providerConfig = data.provider ? PROVIDER_CONFIGS[data.provider] : null;
  
  const handleUnlock = async () => {
    // Basic password validation (in real app, this would be server-side)
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setIsUnlocking(true);
    setError('');
    
    try {
      await data.onUnlock();
      setPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlock configuration';
      setError(errorMessage);
    } finally {
      setIsUnlocking(false);
    }
  };
  
  const handleCancel = () => {
    setPassword('');
    setError('');
    data.onCancel();
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleString();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-50 border-red-200 mb-4">
          <ShieldAlert className="h-6 w-6 text-red-600" />
        </div>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg text-red-700 flex items-center justify-center gap-2">
            <Unlock className="h-5 w-5" />
            Admin Configuration Unlock
          </DialogTitle>
          <DialogDescription className="text-center mt-2 space-y-2">
            <p className="text-red-700 font-medium">
              ⚠️ Warning: This action requires administrator privileges
            </p>
            <p className="text-sm text-muted-foreground">
              Unlocking the configuration will allow modification of storage settings.
              This action is logged for security purposes.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-50 border rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium">{providerConfig?.label || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Locked Since:</span>
            <span className="font-medium">{formatDate(data.lockedAt)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Administrator Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isUnlocking) {
                  handleUnlock();
                }
              }}
              disabled={isUnlocking}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
            <p className="font-medium text-amber-900 mb-1">Security Notice:</p>
            <p className="text-amber-800">
              This action will be logged with your credentials and timestamp.
              Unauthorized access attempts will be reported to system administrators.
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUnlocking}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnlock}
            disabled={isUnlocking || !password.trim()}
            variant="destructive"
            className="flex-1"
          >
            {isUnlocking ? 'Unlocking...' : 'Unlock Configuration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
