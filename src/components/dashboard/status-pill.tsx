import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/dashboard-data";

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-zinc-700/50 text-zinc-300",
  Interview: "bg-amber-500/15 text-amber-300",
  Offer: "bg-emerald-500/15 text-emerald-300",
  Rejected: "bg-red-500/15 text-red-300",
  Withdrawn: "bg-zinc-700/50 text-zinc-400",
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
