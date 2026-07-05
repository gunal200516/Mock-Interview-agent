"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { weeklyActivity } from "@/lib/dashboard-data";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {payload[0].value}h · {payload[0].value} sessions
      </p>
    </div>
  );
}

export function WeeklyActivityChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={weeklyActivity}
          margin={{ top: 10, right: 12, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="weeklyArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b8a96" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#3b8a96" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#3b8a96", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#3b8a96"
            strokeWidth={2.5}
            fill="url(#weeklyArea)"
            dot={{ r: 3, fill: "#3b8a96", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#3b8a96", strokeWidth: 2, stroke: "#0b0b0d" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
