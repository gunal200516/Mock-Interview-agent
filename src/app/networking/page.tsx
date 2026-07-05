import { NetworkingInterface } from "@/components/networking/networking-interface";

export const dynamic = "force-static";

export default function NetworkingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Networking Bot</h1>
        <p className="text-muted-foreground">
          Draft personalized cold outreach, follow-ups, and informational-interview scripts in your own voice — then track replies.
        </p>
      </div>
      
      <NetworkingInterface />
    </div>
  );
}
