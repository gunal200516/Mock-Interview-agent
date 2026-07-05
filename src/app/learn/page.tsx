import { DashboardShell } from "@/components/dashboard/shell";
import { LearningInterface } from "@/components/learn/learning-interface";

export const dynamic = "force-dynamic";

export default function LearnPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Learn & Practice
          </h1>
          <p className="text-sm text-muted-foreground">
            Bite-sized lessons on DCF, LBO, accretion/dilution, accounting, and brainteasers — with spaced-repetition practice cards.
          </p>
        </div>
        
        <LearningInterface />
      </div>
    </DashboardShell>
  );
}
