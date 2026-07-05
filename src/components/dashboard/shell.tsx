"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { user } from "@/lib/dashboard-data";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/chat": "Chat with AI Mentor",
  "/learn": "Learn & Practice",
  "/mock-interview": "Mock Interview",
  "/tracker": "Application Tracker",
  "/insights": "Market Insights",
  "/resume": "Resume Glow-Up",
  "/networking": "Networking Bot",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Dashboard";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-label="Search"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-600 text-xs font-semibold text-primary-foreground">
              {user.initials}
            </div>
          </div>
        </header>

        {/* Page content — scrollable */}
        <main className="scrollbar-thin flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
