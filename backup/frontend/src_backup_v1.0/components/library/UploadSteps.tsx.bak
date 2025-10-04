import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  HardDrive, 
  Cloud, 
  Link, 
  FileText,
  Upload,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadStepsProps, UploadSource } from '@/types/libraryModals';

/**
 * UploadSteps component for 4-step upload tracking system
 * Features:
 * - Step-by-step upload workflow
 * - Progress tracking and navigation
 * - Source selection interface
 * - File information display
 * - Upload animation and success message
 * - <100ms step navigation performance target
 */
export function UploadSteps({
  currentStep,
  totalSteps,
  stepData,
  onNext,
  onPrevious,
  onStepDataChange
}: UploadStepsProps) {

  const stepTitles = [
    'Select Source',
    'Choose Files',
    'Review Information',
    'Upload Progress'
  ];

  const uploadSources: Array<{ 
    value: UploadSource; 
    label: string; 
    icon: React.ElementType; 
    description: string;
    available: boolean;
  }> = [
    { 
      value: 'local', 
      label: 'Local Storage', 
      icon: HardDrive, 
      description: 'Upload files from your computer',
      available: true
    },
    { 
      value: 'onedrive', 
      label: 'OneDrive', 
      icon: Cloud, 
      description: 'Import from Microsoft OneDrive',
      available: false
    },
    { 
      value: 'googledrive', 
      label: 'Google Drive', 
      icon: Cloud, 
      description: 'Import from Google Drive',
      available: false
    },
    { 
      value: 'url', 
      label: 'From URL', 
      icon: Link, 
      description: 'Download from web URL',
      available: true
    }
  ];

  const handleSourceSelect = (source: UploadSource) => {
    onStepDataChange({ source });
    onNext();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose where you want to upload files from
            </p>
            <div className="grid grid-cols-1 gap-3">
              {uploadSources.map((source) => {
                const IconComponent = source.icon;
                return (
                  <Button
                    key={source.value}
                    variant="outline"
                    className={cn(
                      "h-auto p-4 justify-start",
                      !source.available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => source.available && handleSourceSelect(source.value)}
                    disabled={!source.available}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{source.label}</span>
                          {!source.available && (
                            <Badge variant="secondary" className="text-xs">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {source.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select files to upload from {stepData.source}
            </p>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                File selection interface placeholder
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  onStepDataChange({
                    selectedFiles: [],
                    fileInfo: [
                      {
                        name: 'sample-document.pdf',
                        size: 2048000,
                        type: 'application/pdf',
                        lastModified: new Date()
                      }
                    ]
                  });
                  onNext();
                }}
              >
                Select Sample Files
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review file information before uploading
            </p>
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Source:</span>
                <Badge variant="outline">{stepData.source}</Badge>
              </div>
              {stepData.fileInfo?.map((file, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-t">
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                    </p>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                onStepDataChange({ uploadProgress: 0 });
                onNext();
                // Simulate upload progress
                let progress = 0;
                const interval = setInterval(() => {
                  progress += 10;
                  onStepDataChange({ uploadProgress: progress });
                  if (progress >= 100) {
                    clearInterval(interval);
                  }
                }, 200);
              }}
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Start Upload
            </Button>
          </div>
        );

      case 4:
        const isComplete = (stepData.uploadProgress || 0) >= 100;
        return (
          <div className="space-y-4">
            <div className="text-center">
              {isComplete ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                  <p className="font-medium text-green-700">Upload Completed!</p>
                  <p className="text-sm text-muted-foreground">
                    Your files have been successfully uploaded
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-blue-500 mx-auto animate-pulse" />
                  <p className="font-medium">Uploading Files...</p>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we process your files
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{stepData.uploadProgress || 0}%</span>
              </div>
              <Progress value={stepData.uploadProgress || 0} className="w-full" />
            </div>
            {isComplete && (
              <Button variant="outline" className="w-full">
                View Uploaded Files
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return stepData.source !== undefined;
      case 2:
        return stepData.fileInfo && stepData.fileInfo.length > 0;
      case 3:
        return true;
      case 4:
        return false;
      default:
        return false;
    }
  };

  const canGoPrevious = currentStep > 1 && currentStep < 4;

  return (
    <div className="space-y-6">
      {/* Step Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Step {currentStep} of {totalSteps}
          </h3>
          <Badge variant="outline">
            {stepTitles[currentStep - 1]}
          </Badge>
        </div>
        <Progress 
          value={(currentStep / totalSteps) * 100} 
          className="h-2" 
        />
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      {/* Navigation Controls */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext()}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}