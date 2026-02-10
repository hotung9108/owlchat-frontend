import React from "react";

type AdminLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminLayout({
  sidebar,
  children,
}: AdminLayoutProps) {
  return (
    <div className="
      min-h-screen w-full
      flex flex-col lg:flex-row
      gap-4 p-6 md:p-4
      bg-gradient-to-br from-primary via-secondary to-muted
    ">
      {/* Sidebar */}
      <aside className="w-full lg:w-[20%] min-h-0 flex flex-col">
        {sidebar}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

