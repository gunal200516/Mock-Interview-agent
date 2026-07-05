import { DashboardShell } from "@/components/dashboard/shell";
import { ApplicationTracker } from "@/components/tracker/application-tracker";

export const dynamic = "force-dynamic";

export default function TrackerPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Application Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Track every application end-to-end — from first touch to offer — with stage timelines, contact notes, and deadline reminders.
          </p>
        </div>
        
        <ApplicationTracker />
      </div>
    </DashboardShell>
  );
}
