import { StubPage } from "@/components/dashboard/stub-page";

export default function InsightsPage() {
  return (
    <StubPage
      title="Market Insights"
      description="Live league tables, deal flow trends, and hiring signals across bulge brackets, elite boutiques, and PE shops."
      iconName="line-chart"
      features={[
        "Quarterly M&A league tables by region and sector",
        "Hiring signals: which desks are growing, which are freezing",
        "Salary + bonus benchmarks by firm, role, and cohort year",
      ]}
    />
  );
}
