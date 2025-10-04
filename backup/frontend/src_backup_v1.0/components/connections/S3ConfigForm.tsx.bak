/**
 * S3 Configuration Form Component
 * Form for entering S3-compatible storage credentials
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { StorageProvider, PROVIDER_CONFIGS, type StorageCredentials } from '@/types/connection';

interface S3ConfigFormProps {
  provider: StorageProvider;
  credentials: Partial<StorageCredentials>;
  errors: Record<string, string>;
  isConfiguring: boolean;
  isLocked: boolean;
  onCredentialsChange: (credentials: Partial<StorageCredentials>) => void;
  onSubmit: () => Promise<void>;
  onReset: () => void;
}

export function S3ConfigForm({
  provider,
  credentials,
  errors,
  isConfiguring,
  isLocked,
  onCredentialsChange,
  onSubmit,
  onReset,
}: S3ConfigFormProps) {
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  
  const providerConfig = PROVIDER_CONFIGS[provider];
  const requiresEndpoint = providerConfig.requiresEndpoint;
  
  const handleChange = (field: keyof StorageCredentials, value: string) => {
    onCredentialsChange({ [field]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };
  
  const isFormValid = () => {
    const hasRequiredFields = 
      credentials.accessKeyId &&
      credentials.secretAccessKey &&
      credentials.region &&
      credentials.bucket;
    
    const hasEndpointIfRequired = !requiresEndpoint || credentials.endpoint;
    
    return hasRequiredFields && hasEndpointIfRequired;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Provider Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-1">
          {providerConfig.label} Configuration
        </p>
        <p className="text-xs text-blue-700">
          {providerConfig.description}
        </p>
      </div>
      
      {/* Access Key ID */}
      <div className="space-y-2">
        <Label htmlFor="accessKeyId">
          Access Key ID <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="accessKeyId"
            type={showAccessKey ? 'text' : 'password'}
            value={credentials.accessKeyId || ''}
            onChange={(e) => handleChange('accessKeyId', e.target.value)}
            placeholder="AKIA..."
            disabled={isLocked || isConfiguring}
            className={errors.accessKeyId ? 'border-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => setShowAccessKey(!showAccessKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isLocked}
          >
            {showAccessKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.accessKeyId && (
          <p className="text-sm text-red-600">{errors.accessKeyId}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Your {providerConfig.label} access key identifier
        </p>
      </div>
      
      {/* Secret Access Key */}
      <div className="space-y-2">
        <Label htmlFor="secretAccessKey">
          Secret Access Key <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="secretAccessKey"
            type={showSecretKey ? 'text' : 'password'}
            value={credentials.secretAccessKey || ''}
            onChange={(e) => handleChange('secretAccessKey', e.target.value)}
            placeholder="••••••••••••••••••••••••••••••••"
            disabled={isLocked || isConfiguring}
            className={errors.secretAccessKey ? 'border-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isLocked}
          >
            {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.secretAccessKey && (
          <p className="text-sm text-red-600">{errors.secretAccessKey}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Your {providerConfig.label} secret access key
        </p>
      </div>
      
      <Separator />
      
      {/* Region */}
      <div className="space-y-2">
        <Label htmlFor="region">
          Region <span className="text-red-500">*</span>
        </Label>
        <Input
          id="region"
          type="text"
          value={credentials.region || ''}
          onChange={(e) => handleChange('region', e.target.value)}
          placeholder={providerConfig.defaultRegion}
          disabled={isLocked || isConfiguring}
          className={errors.region ? 'border-red-500' : ''}
        />
        {errors.region && (
          <p className="text-sm text-red-600">{errors.region}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {provider === StorageProvider.CLOUDFLARE_R2 
            ? 'For R2, use "auto"' 
            : `e.g., ${providerConfig.defaultRegion || 'us-east-1'}`}
        </p>
      </div>
      
      {/* Bucket Name */}
      <div className="space-y-2">
        <Label htmlFor="bucket">
          Bucket Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bucket"
          type="text"
          value={credentials.bucket || ''}
          onChange={(e) => handleChange('bucket', e.target.value)}
          placeholder="my-research-bucket"
          disabled={isLocked || isConfiguring}
          className={errors.bucket ? 'border-red-500' : ''}
        />
        {errors.bucket && (
          <p className="text-sm text-red-600">{errors.bucket}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers, and hyphens only
        </p>
      </div>
      
      {/* Endpoint (conditional) */}
      {requiresEndpoint && (
        <div className="space-y-2">
          <Label htmlFor="endpoint">
            Endpoint URL <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endpoint"
            type="text"
            value={credentials.endpoint || ''}
            onChange={(e) => handleChange('endpoint', e.target.value)}
            placeholder={providerConfig.endpointPlaceholder}
            disabled={isLocked || isConfiguring}
            className={errors.endpoint ? 'border-red-500' : ''}
          />
          {errors.endpoint && (
            <p className="text-sm text-red-600">{errors.endpoint}</p>
          )}
          <p className="text-xs text-muted-foreground">
            The custom endpoint URL for your {providerConfig.label} instance
          </p>
        </div>
      )}
      
      <Separator />
      
      {/* Form Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLocked || isConfiguring || !isFormValid()}
          className="flex-1"
        >
          {isConfiguring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isLocked || isConfiguring}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      
      {isLocked && (
        <div className="bg-slate-50 border rounded-lg p-3 text-sm text-muted-foreground">
          Configuration is locked. Contact administrator to make changes.
        </div>
      )}
    </form>
  );
}
