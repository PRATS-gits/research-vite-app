import * as React from "react";
import { cn } from "@/lib/utils";

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-4 pt-0", className)}>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="h-full p-6">
          {children}
        </div>
      </div>
    </div>
  );
}