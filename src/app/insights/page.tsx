import { DashboardShell } from "@/components/dashboard/shell";
import { MarketInsightsInterface } from "@/components/insights/market-insights-interface";

export const dynamic = "force-dynamic";

export default function InsightsPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Market Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            Live league tables, deal flow trends, and hiring signals across bulge brackets, elite boutiques, and PE shops.
          </p>
        </div>
        
        <MarketInsightsInterface />
      </div>
    </DashboardShell>
  );
}
