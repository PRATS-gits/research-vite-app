/**
 * Connection Test Button Component
 * Button with loading state and test result display
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  PlayCircle 
} from 'lucide-react';
import type { ConnectionTestResult } from '@/types/connection';

interface ConnectionTestButtonProps {
  onTest: () => Promise<void>;
  testResult: ConnectionTestResult | null;
  isTesting: boolean;
  disabled?: boolean;
}

export function ConnectionTestButton({
  onTest,
  testResult,
  isTesting,
  disabled = false,
}: ConnectionTestButtonProps) {
  
  const getResultIcon = () => {
    if (!testResult) return null;
    
    if (testResult.success) {
      // Check for warnings
      const hasWarnings = testResult.details && (
        !testResult.details.corsConfigured || 
        !testResult.details.multipartSupported
      );
      
      return hasWarnings ? (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      );
    }
    
    return <XCircle className="h-4 w-4 text-red-600" />;
  };
  
  const getResultBadge = () => {
    if (!testResult) return null;
    
    if (testResult.success) {
      const hasWarnings = testResult.details && (
        !testResult.details.corsConfigured || 
        !testResult.details.multipartSupported
      );
      
      return (
        <Badge 
          variant={hasWarnings ? "outline" : "default"}
          className={hasWarnings ? "border-yellow-500 text-yellow-700" : "bg-green-100 text-green-800 border-green-200"}
        >
          {hasWarnings ? 'Connected with Warnings' : 'Connection Successful'}
        </Badge>
      );
    }
    
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        Connection Failed
      </Badge>
    );
  };
  
  const getResultDetails = () => {
    if (!testResult) return null;
    
    return (
      <div className="mt-3 p-3 rounded-lg border bg-slate-50 text-sm">
        <div className="flex items-start gap-2">
          {getResultIcon()}
          <div className="flex-1">
            <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </p>
            {testResult.error && (
              <p className="text-red-600 mt-1 text-xs">{testResult.error}</p>
            )}
            {testResult.success && testResult.details && (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Bucket exists: {testResult.details.bucketExists ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Read permission: {testResult.details.readPermission ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Write permission: {testResult.details.writePermission ? 'Yes' : 'No'}</span>
                </div>
                {!testResult.details.corsConfigured && (
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-3 w-3" />
                    <span>CORS not configured (may affect uploads)</span>
                  </div>
                )}
                {!testResult.details.multipartSupported && (
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Multipart uploads not supported</span>
                  </div>
                )}
                <div className="mt-2 text-muted-foreground">
                  Response time: {testResult.responseTime}ms
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onTest}
          disabled={disabled || isTesting}
          variant="outline"
          className="flex-1"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Test Connection
            </>
          )}
        </Button>
        {testResult && getResultBadge()}
      </div>
      {getResultDetails()}
    </div>
  );
}
