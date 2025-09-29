import { useState, useCallback } from 'react';
import type { UploadStep, UploadStepData, UploadStepState } from '@/types/libraryModals';

/**
 * Custom hook for managing upload step progression
 * Features:
 * - 4-step upload workflow management
 * - Step data state management
 * - Navigation between steps
 * - Performance optimization with useCallback
 * - Step validation and progress tracking
 */
export function useUploadSteps(): UploadStepState {
  const [currentStep, setCurrentStep] = useState<UploadStep>(1);
  const [stepData, setStepData] = useState<UploadStepData>({
    currentStep: 1,
    totalSteps: 4,
    source: undefined,
    selectedFiles: [],
    fileInfo: [],
    uploadProgress: 0
  });

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      const nextStepNum = (currentStep + 1) as UploadStep;
      setCurrentStep(nextStepNum);
      setStepData(prev => ({
        ...prev,
        currentStep: nextStepNum
      }));
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      const prevStepNum = (currentStep - 1) as UploadStep;
      setCurrentStep(prevStepNum);
      setStepData(prev => ({
        ...prev,
        currentStep: prevStepNum
      }));
    }
  }, [currentStep]);

  const resetSteps = useCallback(() => {
    setCurrentStep(1);
    setStepData({
      currentStep: 1,
      totalSteps: 4,
      source: undefined,
      selectedFiles: [],
      fileInfo: [],
      uploadProgress: 0
    });
  }, []);

  const updateStepData = useCallback((data: Partial<UploadStepData>) => {
    setStepData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  return {
    currentStep,
    stepData,
    nextStep,
    previousStep,
    resetSteps,
    updateStepData
  };
}