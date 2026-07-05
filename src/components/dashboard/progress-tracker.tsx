"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target } from "lucide-react";

interface ProgressItem {
  id: string;
  label: string;
  current: number;
  total: number;
  status: "completed" | "in-progress" | "pending";
  category: string;
}

const progressItems: ProgressItem[] = [
  {
    id: "technical-prep",
    label: "Technical Prep",
    current: 18,
    total: 24,
    status: "in-progress",
    category: "Learning"
  },
  {
    id: "mock-interviews",
    label: "Mock Interviews",
    current: 3,
    total: 10,
    status: "in-progress", 
    category: "Practice"
  },
  {
    id: "networking",
    label: "Networking Contacts",
    current: 12,
    total: 20,
    status: "in-progress",
    category: "Outreach"
  },
  {
    id: "applications",
    label: "Target Applications",
    current: 12,
    total: 15,
    status: "in-progress",
    category: "Applications"
  }
];

export function ProgressTracker() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Prep Progress
        </CardTitle>
        <CardDescription>
          Track your IBD recruiting preparation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progressItems.map((item) => {
            const percentage = (item.current / item.total) * 100;
            const StatusIcon = item.status === "completed" ? CheckCircle : Clock;
            
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-4 w-4 ${
                      item.status === "completed" ? "text-green-500" : "text-amber-500"
                    }`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.current}/{item.total}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {Math.round(percentage)}% complete
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}