# Cook'd AI — IBD Career Prep Dashboard

A pixel-close Next.js 16 rebuild of the **Cook'd AI** dashboard originally shared at
[`chat.z.ai/space/j1bnb5mrawy0-art`](https://chat.z.ai/space/j1bnb5mrawy0-art).

Cook'd AI is a career-prep platform aimed at investment-banking job seekers. The
original share link renders a single dashboard for a user named **Alex K.** showing
their application pipeline, upcoming interviews, weekly prep activity, and recent
applications. This repository reproduces that dashboard as a runnable Next.js app,
plus stub pages for the other seven sidebar destinations.

> The dashboard is intentionally **dark-themed** and **mock-data-driven** — no
> database or external API is required to run it. Edit one TypeScript file to
> change every number, name, and status on the screen.

---

## What's inside

- **Stack** — Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · Recharts · lucide-react
- **Dashboard (`/`)** — fully built, pixel-close to the original share
  - Sidebar with brand mark, four nav sections, "Mock Interview" badge, and user footer
  - Top bar with page title, search, notifications, avatar
  - Greeting header + subtitle
  - Four stat cards: **Applications · Interviews · Practice Score · Courses Done**
  - **Weekly Activity** area chart (Recharts, teal palette)
  - **Upcoming Interviews** list with colored avatar initials
  - **Recent Applications** table with status pills (Interview / Applied / Offer)
- **Seven stub pages** — `/chat`, `/learn`, `/mock-interview`, `/tracker`, `/insights`, `/resume`, `/networking`
  - Same shell as the Dashboard so navigation feels continuous
  - Each surfaces a "Coming soon" panel with a short feature preview
- **No backend required** — all data lives in `src/lib/dashboard-data.ts`

---

## Project structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — dark theme + Geist font
│   │   ├── globals.css             # Cook'd AI dark color tokens
│   │   ├── page.tsx                # Dashboard route (the main deliverable)
│   │   ├── chat/page.tsx           # Stub: Chat with AI Mentor
│   │   ├── learn/page.tsx          # Stub: Learn & Practice
│   │   ├── mock-interview/page.tsx # Stub: Mock Interview
│   │   ├── tracker/page.tsx        # Stub: Application Tracker
│   │   ├── insights/page.tsx       # Stub: Market Insights
│   │   ├── resume/page.tsx         # Stub: Resume Glow-Up
│   │   └── networking/page.tsx     # Stub: Networking Bot
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── shell.tsx                    # Sidebar + topbar + scrollable main
│   │   │   ├── sidebar.tsx                  # Brand, nav sections, user footer
│   │   │   ├── stat-card.tsx                # Stat-card tile
│   │   │   ├── weekly-activity-chart.tsx    # Recharts area chart
│   │   │   ├── upcoming-interview-item.tsx  # Interview list row
│   │   │   ├── recent-applications-table.tsx# Applications table panel
│   │   │   ├── status-pill.tsx              # Status badge component
│   │   │   └── stub-page.tsx                # Reusable "coming soon" panel
│   │   └── ui/                     # shadcn/ui primitives (preinstalled)
│   └── lib/
│       ├── dashboard-data.ts       # ← ALL mock content lives here
│       └── utils.ts                # cn() helper
├── public/
│   ├── original-dashboard.png      # Screenshot of the source link
│   └── rebuilt-dashboard.png       # Screenshot of this rebuild
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting started

```bash
# install deps
bun install            # or: npm install / pnpm install

# start the dev server (http://localhost:3000)
bun run dev
```

Open <http://localhost:3000> in your browser. The dashboard is the landing
page; click the sidebar to walk through the stub routes.

### Scripts

| Script           | What it does                                |
| ---------------- | ------------------------------------------- |
| `bun run dev`    | Start Next.js dev server on port 3000       |
| `bun run lint`   | Run ESLint (Next.js + TypeScript rules)     |
| `bun run build`  | Production build (not needed for local dev) |
| `bun run db:push`| Prisma schema push (only if you add a DB)   |

---

## Customizing the data

Every number, name, and status on the dashboard is sourced from a single file:

```ts
// src/lib/dashboard-data.ts

export const user = { name: "Alex K.", initials: "AK", plan: "Pro Plan" };

export const stats = [
  { id: "applications", label: "Applications", value: "12", ... },
  { id: "interviews",   label: "Interviews",   value: "5",  ... },
  { id: "practice",     label: "Practice Score", value: "78%", ... },
  { id: "courses",      label: "Courses Done",  value: "8/24", ... },
];

export const upcomingInterviews = [ /* Morgan Stanley, KKR, Evercore */ ];
export const recentApplications  = [ /* J.P. Morgan, Goldman, MS, Lazard */ ];
export const weeklyActivity      = [ /* Mon..Sun hours + sessions */ ];
export const navSections         = [ /* MAIN / PREPARE / CAREER / TOOLS */ ];
```

Change a value there and the dashboard updates instantly — no API wiring,
no database migration. The TypeScript types at the top of the file document
every shape.

---

## Design tokens

Extracted from the original screenshot via Python/PIL color analysis and
defined as CSS variables in `src/app/globals.css`:

| Token              | Value      | Used for                       |
| ------------------ | ---------- | ------------------------------ |
| `--background`     | `#0b0b0d`  | Main content area              |
| `--sidebar`        | `#111114`  | Sidebar surface                |
| `--card`           | `#1a1a1f`  | Stat cards, chart panel, table |
| `--accent`         | `#242019`  | Warm-tinted hover / active     |
| `--border`         | `#27272a`  | Hairline borders               |
| `--primary`        | `#d0a040`  | Brand gold (logo, badges)      |
| `--chart-1`        | `#3b8a96`  | Teal — weekly activity bars    |
| `--muted-foreground`| `#a1a1aa` | Captions, subtitles            |

Stat-card icon accents: amber · teal · green · purple.
Status-pill colors: amber (Interview) · emerald (Offer) · zinc (Applied).

---

## Routes

| Path               | Page                       | Status   |
| ------------------ | -------------------------- | -------- |
| `/`                | Dashboard                  | **Built**|
| `/chat`            | Chat with AI Mentor        | Stub     |
| `/learn`           | Learn & Practice           | Stub     |
| `/mock-interview`  | Mock Interview             | Stub     |
| `/tracker`         | Application Tracker        | Stub     |
| `/insights`        | Market Insights            | Stub     |
| `/resume`          | Resume Glow-Up             | Stub     |
| `/networking`      | Networking Bot             | Stub     |

---

## Attribution

The dashboard design and content are reproduced from a publicly shared Z.ai
space. All product names, company names, and stats belong to their respective
owners and are used here only as mock data for demonstration purposes.
"Cook'd AI" is used as the product brand shown in the original share.
