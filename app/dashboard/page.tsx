"use client";

import { LayoutDashboard } from "lucide-react";
import {
  DashboardShell,
  EmptyState,
  OverviewCards,
} from "../components/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell
      activeHref="/dashboard"
      title="Financial Overview"
      description="Monitor your enterprise assets on Stellar."
    >
      <OverviewCards />
      <EmptyState
        icon={LayoutDashboard}
        title="Your dashboard is waiting for activity"
        description="Create your first invoice, fund an escrow, or connect payroll data to populate this workspace."
        action="Create First Workflow"
      />
    </DashboardShell>
  );
}
