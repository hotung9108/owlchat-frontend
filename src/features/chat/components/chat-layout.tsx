import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./chat-appsidebar";
import ChatHeader from "./chat-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "400px",
      } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <ChatHeader />
        
        <main className="flex-1 overflow-hidden">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}