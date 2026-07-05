"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  GraduationCap,
  Mic,
  Briefcase,
  LineChart,
  FileText,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { navSections, user } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "message-circle": MessageCircle,
  "graduation-cap": GraduationCap,
  mic: Mic,
  briefcase: Briefcase,
  "line-chart": LineChart,
  "file-text": FileText,
  bot: Bot,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-lg font-bold leading-none">C</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">
            Cook&apos;d AI
          </span>
          <span className="text-[11px] text-muted-foreground">
            IBD Prep Platform
          </span>
        </div>
      </div>

      {/* Nav sections — scrollable */}
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-600 text-sm font-semibold text-primary-foreground">
            {user.initials}
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="text-[11px] text-primary">{user.plan}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
