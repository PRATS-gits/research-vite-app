/**
 * Connections Page Component
 * S3 storage provider configuration and connection management
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Database, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle,
  Cloud,
  Server,
  HardDrive
} from 'lucide-react';
import { useConnectionStore } from '@/store/connectionStore';
import { StorageProvider, PROVIDER_CONFIGS } from '@/types/connection';
import { S3ConfigForm } from '@/components/connections/S3ConfigForm';
import { ConnectionTestButton } from '@/components/connections/ConnectionTestButton';
import { LockWarningModal } from '@/components/connections/LockWarningModal';
import { AdminUnlockModal } from '@/components/connections/AdminUnlockModal';
import { validateConnectionForm } from '@/api/storageApi';
import { SweetAlert } from '@/components/ui/SweetAlert';

export function ConnectionsPage() {
  const {
    status,
    isLoadingStatus,
    selectedProvider,
    credentials,
    formErrors,
    testResult,
    isTestingConnection,
    isConfiguring,
    lockWarningData,
    isLockWarningOpen,
    adminUnlockData,
    isAdminUnlockOpen,
    fetchStatus,
    setSelectedProvider,
    setCredentials,
    setFormErrors,
    testConnection,
    submitConfiguration,
    openAdminUnlock,
    resetForm,
  } = useConnectionStore();
  
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning', title: string, message: string } | null>(null);
  
  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);
  
  const getProviderIcon = (provider: StorageProvider) => {
    switch (provider) {
      case StorageProvider.AWS_S3:
        return <Cloud className="h-4 w-4" />;
      case StorageProvider.CLOUDFLARE_R2:
        return <Server className="h-4 w-4" />;
      case StorageProvider.MINIO:
        return <HardDrive className="h-4 w-4" />;
    }
  };
  
  const handleProviderChange = (provider: StorageProvider) => {
    setSelectedProvider(provider);
  };
  
  const handleTestConnection = async () => {
    // Validate before testing
    const validation = validateConnectionForm(selectedProvider, credentials);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setAlert({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the form errors before testing the connection.'
      });
      return;
    }
    
    setFormErrors({});
    await testConnection();
  };
  
  const handleSubmit = async () => {
    // Validate before submission
    const validation = validateConnectionForm(selectedProvider, credentials);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setAlert({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the form errors before saving.'
      });
      return;
    }
    
    setFormErrors({});
    
    try {
      await submitConfiguration();
      setAlert({
        type: 'success',
        title: 'Configuration Saved',
        message: 'Storage configuration has been saved successfully and locked.'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Configuration failed';
      setAlert({
        type: 'error',
        title: 'Configuration Failed',
        message: errorMessage
      });
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Storage Connections</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Configure S3-compatible storage for your research library
        </p>
      </div>
      
      {/* Status Banner */}
      {isLoadingStatus ? (
        <Card className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </Card>
      ) : status?.configured ? (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">
                  Storage Configured: {status.provider ? PROVIDER_CONFIGS[status.provider].label : 'Unknown'}
                </p>
                <p className="text-sm text-green-700">
                  Bucket: {status.bucketName} • Region: {status.region}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status.locked ? (
                <>
                  <Badge variant="outline" className="border-red-500 text-red-700">
                    <Lock className="mr-1 h-3 w-3" />
                    Locked
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openAdminUnlock}
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Admin Unlock
                  </Button>
                </>
              ) : (
                <Badge variant="outline" className="border-green-500 text-green-700">
                  <Unlock className="mr-1 h-3 w-3" />
                  Unlocked
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">No Storage Configured</p>
              <p className="text-sm text-blue-700">
                Configure an S3-compatible storage provider to enable file storage
              </p>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Selection */}
        <Card className="lg:col-span-1 p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Provider
          </h3>
          
          <div className="space-y-3">
            {Object.values(StorageProvider).map((provider) => {
              const config = PROVIDER_CONFIGS[provider];
              const isSelected = selectedProvider === provider;
              const isDisabled = status?.locked && status?.provider !== provider;
              
              return (
                <button
                  key={provider}
                  onClick={() => !isDisabled && handleProviderChange(provider)}
                  disabled={isDisabled}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getProviderIcon(provider)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{config.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {config.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Valid credentials</li>
              <li>Bucket with read/write access</li>
              <li>CORS configured (recommended)</li>
            </ul>
          </div>
        </Card>
        
        {/* Configuration Form */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            {getProviderIcon(selectedProvider)}
            {PROVIDER_CONFIGS[selectedProvider].label} Configuration
          </h3>
          
          <S3ConfigForm
            provider={selectedProvider}
            credentials={credentials}
            errors={formErrors}
            isConfiguring={isConfiguring}
            isLocked={status?.locked || false}
            onCredentialsChange={setCredentials}
            onSubmit={handleSubmit}
            onReset={resetForm}
          />
          
          <Separator className="my-6" />
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Connection Testing</h4>
            <ConnectionTestButton
              onTest={handleTestConnection}
              testResult={testResult}
              isTesting={isTestingConnection}
              disabled={status?.locked || false}
            />
          </div>
        </Card>
      </div>
      
      {/* Modals */}
      <LockWarningModal
        isOpen={isLockWarningOpen}
        data={lockWarningData}
      />
      
      <AdminUnlockModal
        isOpen={isAdminUnlockOpen}
        data={adminUnlockData}
      />
      
      {/* Alert */}
      {alert && (
        <SweetAlert
          isOpen={true}
          data={{
            type: alert.type,
            title: alert.title,
            message: alert.message,
          }}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
