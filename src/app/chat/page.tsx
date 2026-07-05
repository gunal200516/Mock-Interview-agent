import { StubPage } from "@/components/dashboard/stub-page";

export default function ChatPage() {
  return (
    <StubPage
      title="Chat with AI Mentor"
      description="Ask anything about IBD recruiting, technicals, behavioral prep, or your application strategy — your AI mentor remembers your context."
      iconName="message-circle"
      features={[
        "Voice + text chat with persistent memory of your prep history",
        "Curated answers grounded in IBD-specific knowledge (M&A, RX, coverage)",
        "Inline practice prompts that link back to Mock Interview",
      ]}
    />
  );
}
