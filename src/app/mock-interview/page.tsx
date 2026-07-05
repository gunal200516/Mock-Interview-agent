import { DashboardShell } from "@/components/dashboard/shell";
import { MockInterviewInterface } from "@/components/mock-interview/mock-interview-interface";

export const dynamic = "force-dynamic";

export default function MockInterviewPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Mock Interview
          </h1>
          <p className="text-sm text-muted-foreground">
            Run realistic, role-targeted mock interviews with AI interviewers — get a rubric-based score and transcript review.
          </p>
        </div>
        
        <MockInterviewInterface />
      </div>
    </DashboardShell>
  );
}
