import { DashboardShell } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartLazy } from "@/components/dashboard/chart-lazy";
import { UpcomingInterviewItem } from "@/components/dashboard/upcoming-interview-item";
import { RecentApplicationsTable } from "@/components/dashboard/recent-applications-table";
import {
  stats,
  upcomingInterviews,
  dashboardHeadline,
} from "@/lib/dashboard-data";

// All data is mock + static — pre-render at build time and serve from the
// CDN edge cache. No per-request work.
export const dynamic = "force-static";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        {/* Greeting */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {dashboardHeadline.greeting}
          </h1>
          <p className="text-sm text-muted-foreground">
            {dashboardHeadline.subtitle}
          </p>
        </div>

        {/* Stat cards — server-rendered, zero client JS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Chart + Upcoming interviews */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Weekly Activity — chart library lazy-loaded on the client */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Weekly Activity
              </h3>
              <span className="rounded-md bg-accent px-2 py-1 text-xs text-muted-foreground">
                This Week
              </span>
            </div>
            <ChartLazy />
          </div>

          {/* Upcoming Interviews — server-rendered */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Upcoming Interviews
              </h3>
              <span className="text-xs text-muted-foreground">
                {upcomingInterviews.length} scheduled
              </span>
            </div>
            <ul className="flex flex-col divide-y divide-border">
              {upcomingInterviews.map((iv) => (
                <UpcomingInterviewItem key={iv.id} interview={iv} />
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Applications table — server-rendered */}
        <RecentApplicationsTable />
      </div>
    </DashboardShell>
  );
}
