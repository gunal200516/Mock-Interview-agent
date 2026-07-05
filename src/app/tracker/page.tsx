import { StubPage } from "@/components/dashboard/stub-page";

export default function TrackerPage() {
  return (
    <StubPage
      title="Application Tracker"
      description="Track every application end-to-end — from first touch to offer — with stage timelines, contact notes, and deadline reminders."
      iconName="briefcase"
      features={[
        "Kanban + list views for Applied → Interview → Offer → Decision",
        "Per-application contact log and notes (recruiter, bankers, referrals)",
        "Auto-roll-ups feed the Applications stat card on the Dashboard",
      ]}
    />
  );
}
