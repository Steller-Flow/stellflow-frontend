"use client";

import { DashboardShell } from "../../components/DashboardShell";
import { AnalyticsCharts } from "../../components/analytics/AnalyticsCharts";

export default function AnalyticsPage() {
  return (
    <DashboardShell
      activeHref="/dashboard/analytics"
      title="Analytics"
      description="View payment volume, settlement speed, and escrow performance."
    >
      <AnalyticsCharts />
    </DashboardShell>
  );
}
