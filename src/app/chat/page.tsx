import { DashboardShell } from "@/components/dashboard/shell";
import { ChatInterface } from "@/components/chat/chat-interface";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 h-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Chat with AI Mentor
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask anything about IBD recruiting, technicals, behavioral prep, or your application strategy — your AI mentor remembers your context.
          </p>
        </div>
        
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </DashboardShell>
  );
}
