import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "./Navbar";
import { PageContent } from "./PageContent";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <PageContent>
          <Outlet />
        </PageContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
