export type ModalType = 'createFolder' | 'uploadFile' | 'uploadFolder' | 'deleteConfirm' | 'sweetAlert';

export type UploadSource = 'local' | 'onedrive' | 'googledrive' | 'url';
export type FolderTag = 'research-papers' | 'spreadsheets' | 'images' | 'documents' | 'other';
export type UploadStep = 1 | 2 | 3 | 4;

export interface CreateFolderData {
  name: string;
  tags: FolderTag[];
  description?: string;
}

export interface UploadStepData {
  currentStep: UploadStep;
  totalSteps: 4;
  source?: UploadSource;
  selectedFiles?: File[];
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
  }[];
  uploadProgress?: number;
}

export interface DeleteConfirmData {
  itemIds: string[];
  itemNames: string[];
  itemCount: number;
}

export interface SweetAlertData {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: CreateFolderData | UploadStepData | DeleteConfirmData | SweetAlertData | null;
}

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateFolderData) => void;
}

export interface UploadCompletionSummary {
  files: File[];
  successful: number;
  failed: number;
  errors: string[];
}

export interface UploadModalProps {
  isOpen: boolean;
  type: 'file' | 'folder';
  onClose: () => void;
  onComplete: (summary: UploadCompletionSummary) => void;
}

export interface UploadStepsProps {
  currentStep: UploadStep;
  totalSteps: number;
  stepData: UploadStepData;
  onNext: () => void;
  onPrevious: () => void;
  onStepDataChange: (data: Partial<UploadStepData>) => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  data: DeleteConfirmData;
  onClose: () => void;
  onConfirm: () => void;
}

export interface SweetAlertProps {
  isOpen: boolean;
  data: SweetAlertData;
  onClose: () => void;
}

export interface ModalRouting {
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  modalState: ModalState;
}

export interface UploadStepState {
  currentStep: UploadStep;
  stepData: UploadStepData;
  nextStep: () => void;
  previousStep: () => void;
  resetSteps: () => void;
  updateStepData: (data: Partial<UploadStepData>) => void;
}