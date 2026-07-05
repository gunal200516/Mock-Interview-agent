"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Lazy-loaded chart wrapper.
 *
 * Recharts adds ~150KB to the client bundle. By code-splitting it with
 * `ssr: false`, the initial HTML stays small and the chart library only
 * downloads after hydration. The skeleton below is shown in the meantime.
 *
 * This component is a Client Component so it can use `next/dynamic` with
 * `ssr: false` (not allowed directly inside Server Components).
 */
const WeeklyActivityChart = dynamic(
  () =>
    import("@/components/dashboard/weekly-activity-chart").then(
      (m) => m.WeeklyActivityChart
    ),
  {
    loading: () => (
      <Skeleton className="h-72 w-full rounded-lg bg-card" />
    ),
    ssr: false,
  }
);

export function ChartLazy() {
  return <WeeklyActivityChart />;
}
