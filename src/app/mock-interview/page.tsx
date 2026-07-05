import { StubPage } from "@/components/dashboard/stub-page";

export const dynamic = "force-static";

export default function MockInterviewPage() {
  return (
    <StubPage
      title="Mock Interview"
      description="Run realistic, role-targeted mock interviews with AI interviewers — get a rubric-based score and transcript review."
      iconName="mic"
      features={[
        "3 pending mock interviews waiting for you (see sidebar badge)",
        "Roles: IBD Technical, PE Behavioral, RX Case Study, and more",
        "Rubric scoring across technical accuracy, structuring, and presence",
      ]}
    />
  );
}
