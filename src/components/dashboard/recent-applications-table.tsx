import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { recentApplications } from "@/lib/dashboard-data";
import { StatusPill } from "./status-pill";

export function RecentApplicationsTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-foreground">
          Recent Applications
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          View All
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </TableHead>
            <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Department
            </TableHead>
            <TableHead className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Applied
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentApplications.map((app) => (
            <TableRow
              key={app.id}
              className="border-border transition-colors hover:bg-accent/40"
            >
              <TableCell className="px-5 py-4 text-sm font-medium text-foreground">
                {app.company}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-muted-foreground">
                {app.department}
              </TableCell>
              <TableCell className="px-5 py-4">
                <StatusPill status={app.status} />
              </TableCell>
              <TableCell className="px-5 py-4 text-right text-sm text-muted-foreground">
                {app.applied}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
