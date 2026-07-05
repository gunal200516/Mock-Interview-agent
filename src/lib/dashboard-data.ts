/**
 * Mock data for the Cook'd AI dashboard.
 * Mirrors the content captured from the original shared Z.ai space:
 * https://chat.z.ai/space/j1bnb5mrawy0-art
 *
 * Edit this file to customize the dashboard — no database required.
 */

export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";

export interface User {
  name: string;
  initials: string;
  plan: string;
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  /** Optional sub-value shown beneath the main number (e.g. "8/24"). */
  subValue?: string;
  /** Trend pill copy, e.g. "+3 this week". */
  trend?: string;
  /** Whether the trend is positive (green) or neutral (muted). */
  trendPositive?: boolean;
  /** Footer caption, e.g. "33% completion". */
  caption?: string;
  /** Lucide icon name. */
  icon: "briefcase" | "calendar" | "trending-up" | "book-open";
  /** Accent color token for the icon chip. */
  accent: "amber" | "teal" | "green" | "purple";
}

export interface UpcomingInterview {
  id: string;
  company: string;
  initials: string;
  role: string;
  when: string;
  time: string;
  avatarAccent: "purple" | "teal" | "amber";
}

export interface Application {
  id: string;
  company: string;
  department: string;
  status: ApplicationStatus;
  applied: string; // ISO-ish display string
}

export interface WeeklyActivityPoint {
  day: string;
  hours: number;
  sessions: number;
}

export const user: User = {
  name: "Alex K.",
  initials: "AK",
  plan: "Pro Plan",
};

export const dashboardHeadline = {
  greeting: "Welcome back, Alex",
  subtitle:
    "Your IBD prep pipeline at a glance. 4 applications active, 2 interviews this week.",
};

export const stats: StatCard[] = [
  {
    id: "applications",
    label: "Applications",
    value: "12",
    trend: "3 this week",
    trendPositive: true,
    icon: "briefcase",
    accent: "amber",
  },
  {
    id: "interviews",
    label: "Interviews",
    value: "5",
    trend: "2 upcoming",
    trendPositive: false,
    icon: "calendar",
    accent: "teal",
  },
  {
    id: "practice",
    label: "Practice Score",
    value: "78%",
    trend: "+12% vs last week",
    trendPositive: true,
    icon: "trending-up",
    accent: "green",
  },
  {
    id: "courses",
    label: "Courses Done",
    value: "8/24",
    caption: "33% completion",
    icon: "book-open",
    accent: "purple",
  },
];

export const upcomingInterviews: UpcomingInterview[] = [
  {
    id: "iv-ms",
    company: "Morgan Stanley",
    initials: "MS",
    role: "IBD Technical — Round 2",
    when: "Tomorrow",
    time: "2:00 PM",
    avatarAccent: "purple",
  },
  {
    id: "iv-kkr",
    company: "KKR",
    initials: "KKR",
    role: "Private Equity — Behavioral",
    when: "Thu, Jul 10",
    time: "10:00 AM",
    avatarAccent: "teal",
  },
  {
    id: "iv-evr",
    company: "Evercore",
    initials: "EVR",
    role: "Restructuring — Case Study",
    when: "Fri, Jul 11",
    time: "4:30 PM",
    avatarAccent: "amber",
  },
];

export const recentApplications: Application[] = [
  {
    id: "app-jpm",
    company: "J.P. Morgan",
    department: "Investment Banking Division",
    status: "Interview",
    applied: "Jul 1, 2025",
  },
  {
    id: "app-gs",
    company: "Goldman Sachs",
    department: "Global Markets",
    status: "Applied",
    applied: "Jun 28, 2025",
  },
  {
    id: "app-ms",
    company: "Morgan Stanley",
    department: "M&A Advisory",
    status: "Interview",
    applied: "Jun 25, 2025",
  },
  {
    id: "app-laz",
    company: "Lazard",
    department: "Restructuring",
    status: "Offer",
    applied: "Jun 20, 2025",
  },
];

/**
 * Weekly prep activity — hours spent and sessions completed per day.
 * Numbers chosen to produce a visually varied bar chart that matches
 * the original dashboard's "Weekly Activity" panel.
 */
export const weeklyActivity: WeeklyActivityPoint[] = [
  { day: "Mon", hours: 2.5, sessions: 3 },
  { day: "Tue", hours: 4.0, sessions: 5 },
  { day: "Wed", hours: 3.2, sessions: 4 },
  { day: "Thu", hours: 5.1, sessions: 6 },
  { day: "Fri", hours: 3.8, sessions: 4 },
  { day: "Sat", hours: 6.4, sessions: 7 },
  { day: "Sun", hours: 4.6, sessions: 5 },
];

export interface NavItem {
  label: string;
  href: string;
  icon:
    | "layout-dashboard"
    | "message-circle"
    | "graduation-cap"
    | "mic"
    | "briefcase"
    | "line-chart"
    | "file-text"
    | "bot";
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/", icon: "layout-dashboard" },
      { label: "Chat with AI Mentor", href: "/chat", icon: "message-circle" },
    ],
  },
  {
    title: "PREPARE",
    items: [
      { label: "Learn & Practice", href: "/learn", icon: "graduation-cap" },
      { label: "Mock Interview", href: "/mock-interview", icon: "mic", badge: "3" },
    ],
  },
  {
    title: "CAREER",
    items: [
      { label: "Application Tracker", href: "/tracker", icon: "briefcase" },
      { label: "Market Insights", href: "/insights", icon: "line-chart" },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { label: "Resume Glow-Up", href: "/resume", icon: "file-text" },
      { label: "Networking Bot", href: "/networking", icon: "bot" },
    ],
  },
];
