"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Target, TrendingUp } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  href?: string;
  action?: () => void;
  badge?: string;
  variant?: "default" | "primary" | "secondary";
}

const quickActions: QuickAction[] = [
  {
    id: "mock-interview",
    label: "Start Mock Interview",
    description: "Practice with AI interviewer",
    icon: Calendar,
    href: "/mock-interview",
    badge: "3 ready",
    variant: "primary"
  },
  {
    id: "review-pitch",
    label: "Practice Pitch",
    description: "30-second elevator pitch",
    icon: Target,
    variant: "default"
  },
  {
    id: "daily-prep",
    label: "Daily Prep Quiz",
    description: "5 quick technical questions",
    icon: Clock,
    badge: "2 min",
    variant: "default"
  },
  {
    id: "add-application",
    label: "Log Application",
    description: "Track new job application",
    icon: Plus,
    href: "/tracker",
    variant: "secondary"
  }
];

export function DashboardActions() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Jump into high-impact prep activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={selectedAction === action.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-accent/50"
                onClick={() => {
                  setSelectedAction(action.id);
                  if (action.href) {
                    window.location.href = action.href;
                  }
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="h-5 w-5 text-primary" />
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}