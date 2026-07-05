"use client";

import {
  MessageCircle,
  GraduationCap,
  Mic,
  Briefcase,
  LineChart,
  FileText,
  Bot,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shell";

const iconMap: Record<string, LucideIcon> = {
  "message-circle": MessageCircle,
  "graduation-cap": GraduationCap,
  mic: Mic,
  briefcase: Briefcase,
  "line-chart": LineChart,
  "file-text": FileText,
  bot: Bot,
};

export interface StubPageProps {
  title: string;
  description: string;
  /** Icon key — must match one of the keys in the iconMap above. */
  iconName:
    | "message-circle"
    | "graduation-cap"
    | "mic"
    | "briefcase"
    | "line-chart"
    | "file-text"
    | "bot";
  /** Optional bullet hints to surface what's coming. */
  features?: string[];
}

export function StubPage({
  title,
  description,
  iconName,
  features,
}: StubPageProps) {
  const Icon = iconMap[iconName];

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 rounded-2xl border border-dashed border-border bg-card/60 p-10">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Coming soon
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            This module is part of the Cook&apos;d AI roadmap.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            The dashboard you just came from is fully wired up with mock data —
            this page is a placeholder so the sidebar navigation has somewhere
            to go. Drop in your own implementation here, or fork the data layer
            in{" "}
            <code className="rounded bg-accent px-1.5 py-0.5 font-mono text-xs text-foreground">
              src/lib/dashboard-data.ts
            </code>{" "}
            to drive it.
          </p>

          {features && features.length > 0 && (
            <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
