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
      h-screen w-full
      flex flex-col lg:flex-row
      gap-4 p-6 md:p-4
      bg-gradient-to-br from-primary via-secondary to-muted
    ">
      {/* Sidebar */}
      <aside className="min-h-0 w-[20%] flex flex-col flex-shrink-0">
        {sidebar}
      </aside>

      {/* Main */}
      <main className="flex-1 w-[80%]">
        {children}
      </main>
    </div>
  );
}

