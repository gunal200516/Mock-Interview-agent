import { ResumeInterface } from "@/components/resume/resume-interface";

export const dynamic = "force-static";

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Glow-Up</h1>
        <p className="text-muted-foreground">
          AI-powered resume review tuned for IBD — bullet rewrites, deal-language upgrades, and ATS optimization in one pass.
        </p>
      </div>
      
      <ResumeInterface />
    </div>
  );
}
