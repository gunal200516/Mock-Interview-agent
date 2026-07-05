import { StubPage } from "@/components/dashboard/stub-page";

export const dynamic = "force-static";

export default function LearnPage() {
  return (
    <StubPage
      title="Learn & Practice"
      description="Bite-sized lessons on DCF, LBO, accretion/dilution, accounting, and brainteasers — with spaced-repetition practice cards."
      iconName="graduation-cap"
      features={[
        "24 IBD prep courses across technicals, behaviorals, and case studies",
        "Spaced-repetition flashcards with weekly streak tracking",
        "Quiz mode feeds results into your Practice Score on the dashboard",
      ]}
    />
  );
}
