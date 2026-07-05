import { StubPage } from "@/components/dashboard/stub-page";

export const dynamic = "force-static";

export default function ResumePage() {
  return (
    <StubPage
      title="Resume Glow-Up"
      description="AI-powered resume review tuned for IBD — bullet rewrites, deal-language upgrades, and ATS optimization in one pass."
      iconName="file-text"
      features={[
        "Bullet-by-bullet rewrites using deal-team language patterns",
        "ATS keyword coverage check against the target job description",
        "One-click PDF export with banker-friendly single-page layout",
      ]}
    />
  );
}
