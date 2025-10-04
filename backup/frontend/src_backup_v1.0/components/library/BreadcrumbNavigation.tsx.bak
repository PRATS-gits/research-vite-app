import React from 'react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Home, ChevronLeft } from 'lucide-react';
import { useLibraryNavigation } from '@/hooks/useLibraryNavigation';
import { cn } from '@/lib/utils';

interface BreadcrumbNavigationProps {
  className?: string;
}

/**
 * BreadcrumbNavigation Component
 * Displays folder hierarchy and provides navigation
 * Features:
 * - Home/root button
 * - Back button
 * - Clickable breadcrumb path
 * - Current folder indicator
 * - Responsive design
 */
export function BreadcrumbNavigation({ className }: BreadcrumbNavigationProps) {
  const {
    folderPath,
    canNavigateBack,
    goBack,
    goToRoot,
    navigateToBreadcrumb,
  } = useLibraryNavigation();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={goBack}
        disabled={!canNavigateBack}
        aria-label="Go back"
        className="shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Breadcrumb Trail */}
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home/Root */}
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={goToRoot}
              className="flex items-center gap-1 cursor-pointer hover:text-primary"
            >
              <Home className="h-4 w-4" />
              My Library
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Folder Path */}
          {folderPath.map((pathItem, index) => (
            <React.Fragment key={pathItem.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === folderPath.length - 1 ? (
                  // Current folder (not clickable)
                  <BreadcrumbPage className="font-medium">
                    {pathItem.name}
                  </BreadcrumbPage>
                ) : (
                  // Parent folders (clickable)
                  <BreadcrumbLink
                    onClick={() => navigateToBreadcrumb(pathItem)}
                    className="cursor-pointer hover:text-primary"
                  >
                    {pathItem.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
