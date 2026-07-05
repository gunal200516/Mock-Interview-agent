import { cn } from "@/lib/utils";
import type { UpcomingInterview } from "@/lib/dashboard-data";

const avatarAccentMap: Record<
  UpcomingInterview["avatarAccent"],
  string
> = {
  purple: "bg-violet-500/15 text-violet-300",
  teal: "bg-teal-500/15 text-teal-300",
  amber: "bg-amber-500/15 text-amber-300",
};

export function UpcomingInterviewItem({
  interview,
}: {
  interview: UpcomingInterview;
}) {
  return (
    <li className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-accent/50">
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          avatarAccentMap[interview.avatarAccent]
        )}
      >
        {interview.initials}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">
          {interview.company}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {interview.role}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-xs font-medium text-foreground">
          {interview.when}
        </span>
        <span className="text-xs text-muted-foreground">{interview.time}</span>
      </div>
    </li>
  );
}
