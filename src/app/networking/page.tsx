import { StubPage } from "@/components/dashboard/stub-page";

export default function NetworkingPage() {
  return (
    <StubPage
      title="Networking Bot"
      description="Draft personalized cold outreach, follow-ups, and informational-interview scripts in your own voice — then track replies."
      iconName="bot"
      features={[
        "Cold-email drafts personalized to firm, group, and your background",
        "Auto-generated follow-up sequences with reply tracking",
        "Informational-interview question banks tailored to the banker's group",
      ]}
    />
  );
}
