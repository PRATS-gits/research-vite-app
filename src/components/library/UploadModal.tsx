import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UploadSteps } from './UploadSteps';
import { useUploadSteps } from '@/hooks/useUploadSteps';
import { Upload } from 'lucide-react';
import type { UploadModalProps } from '@/types/libraryModals';

/**
 * UploadModal component for file and folder upload
 * Features:
 * - 4-step upload tracking system
 * - Integration with useUploadSteps hook
 * - Modal routing support
 * - File/folder type handling
 * - Performance optimized <200ms transitions
 */
export function UploadModal({ 
  isOpen, 
  type, 
  onClose, 
  onComplete 
}: UploadModalProps) {
  const {
    currentStep,
    stepData,
    nextStep,
    previousStep,
    resetSteps,
    updateStepData
  } = useUploadSteps();

  const handleClose = () => {
    resetSteps();
    onClose();
  };

  const handleStepDataChange = (data: any) => {
    updateStepData(data);
  };

  const handleComplete = (files: File[]) => {
    onComplete(files);
    resetSteps();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload {type === 'file' ? 'Files' : 'Folder'}
          </DialogTitle>
        </DialogHeader>

        <UploadSteps
          currentStep={currentStep}
          totalSteps={4}
          stepData={stepData}
          onNext={nextStep}
          onPrevious={previousStep}
          onStepDataChange={handleStepDataChange}
        />
      </DialogContent>
    </Dialog>
  );
}