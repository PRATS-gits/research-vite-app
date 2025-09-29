import * as React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/search/SearchBar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationModal } from "@/components/notifications/NotificationModal";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { pageTitle, pathname } = usePageTitle();
  const isHomePage = pathname === '/';
  const [notificationModalOpen, setNotificationModalOpen] = React.useState(false);
  
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };
  
  return (
    <>
      <header className={`sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 ${className || ""}`}>
        {/* Left section: Sidebar trigger and breadcrumb */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {!isHomePage && (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        {/* Center section: Search bar */}
        <div className="flex-1 flex justify-center px-4">
          <SearchBar onSearch={handleSearch} className="max-w-md" />
        </div>
        
        {/* Right section: Notifications and theme switcher */}
        <div className="flex items-center gap-2">
          <NotificationBell 
            notificationCount={2} 
            onClick={() => setNotificationModalOpen(true)}
          />
          <ThemeSwitcher showDropdown={true} />
        </div>
      </header>
      
      {/* Notification Modal */}
      <NotificationModal 
        open={notificationModalOpen}
        onOpenChange={setNotificationModalOpen}
      />
    </>
  );
}
