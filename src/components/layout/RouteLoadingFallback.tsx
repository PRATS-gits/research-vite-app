/**
 * Route Loading Fallback Component
 * Displays a loading state while lazy-loaded route components are being fetched
 * Phase 3: Performance Optimization
 */

import { Loader2 } from 'lucide-react';

export function RouteLoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
