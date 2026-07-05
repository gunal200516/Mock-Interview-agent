"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "urgent";
  title: string;
  description: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

const insights: Insight[] = [
  {
    id: "interview-prep",
    type: "urgent",
    title: "Mock Interview Due Tomorrow",
    description: "Morgan Stanley technical interview prep scheduled for 2:00 PM",
    action: "Review pitch deck",
    priority: "high"
  },
  {
    id: "application-deadline",
    type: "warning", 
    title: "Application Deadline Approaching",
    description: "Goldman Sachs application due in 3 days",
    action: "Complete application",
    priority: "high"
  },
  {
    id: "practice-streak",
    type: "success",
    title: "7-Day Practice Streak!",
    description: "You've completed daily prep for a full week",
    priority: "low"
  },
  {
    id: "networking-follow-up",
    type: "info",
    title: "Follow-up Reminder",
    description: "3 networking contacts haven't replied in 1+ weeks",
    action: "Send follow-ups",
    priority: "medium"
  }
];

const getInsightIcon = (type: Insight["type"]) => {
  switch (type) {
    case "success": return CheckCircle;
    case "warning": return AlertCircle;
    case "urgent": return AlertCircle;
    case "info": return Clock;
    default: return Clock;
  }
};

const getInsightColor = (type: Insight["type"]) => {
  switch (type) {
    case "success": return "text-green-500";
    case "warning": return "text-amber-500";
    case "urgent": return "text-red-500";
    case "info": return "text-blue-500";
    default: return "text-gray-500";
  }
};

const getBadgeVariant = (priority: Insight["priority"]) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "default";
    case "low": return "secondary";
    default: return "outline";
  }
};

export function DashboardInsights() {
  const sortedInsights = insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Smart Insights
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on your activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const iconColor = getInsightColor(insight.type);
            
            return (
              <div key={insight.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                <Icon className={`h-5 w-5 ${iconColor} mt-0.5 shrink-0`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm leading-tight">{insight.title}</h4>
                    <Badge variant={getBadgeVariant(insight.priority)} className="text-xs shrink-0">
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <p className="text-xs text-primary font-medium">
                      → {insight.action}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}