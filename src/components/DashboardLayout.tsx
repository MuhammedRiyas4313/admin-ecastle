import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "./Navbar";
import { AppSidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background md:pl-[230px]">  
        <AppSidebar />
        <div className="flex-1 pt-16 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}