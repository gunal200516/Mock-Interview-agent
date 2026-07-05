import {
  Briefcase,
  Calendar,
  TrendingUp,
  BookOpen,
  ArrowUp,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { StatCard as StatCardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const iconMap: Record<StatCardData["icon"], LucideIcon> = {
  briefcase: Briefcase,
  calendar: Calendar,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
};

const accentMap: Record<
  StatCardData["accent"],
  { chip: string; icon: string }
> = {
  amber: {
    chip: "bg-amber-500/15",
    icon: "text-amber-400",
  },
  teal: {
    chip: "bg-teal-500/15",
    icon: "text-teal-400",
  },
  green: {
    chip: "bg-emerald-500/15",
    icon: "text-emerald-400",
  },
  purple: {
    chip: "bg-violet-500/15",
    icon: "text-violet-400",
  },
};

export function StatCard({ stat }: { stat: StatCardData }) {
  const Icon = iconMap[stat.icon];
  const accent = accentMap[stat.accent];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{stat.label}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            accent.chip
          )}
        >
          <Icon className={cn("size-4", accent.icon)} />
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-foreground">
          {stat.value}
        </span>
        {stat.subValue && (
          <span className="text-sm text-muted-foreground">{stat.subValue}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        {stat.trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
              stat.trendPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-zinc-700/40 text-zinc-300"
            )}
          >
            {stat.trendPositive && <ArrowUp className="size-3" />}
            {stat.trend}
          </span>
        )}
        {stat.caption && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3" />
            {stat.caption}
          </span>
        )}
      </div>
    </div>
  );
}
