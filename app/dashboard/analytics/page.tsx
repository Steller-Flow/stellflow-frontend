import { TrendingUp } from "lucide-react";
import { DashboardShell, EmptyState } from "../../components/DashboardShell";

export default function AnalyticsPage() {
  return (
    <DashboardShell
      activeHref="/dashboard/analytics"
      title="Analytics"
      description="View payment volume, settlement speed, and escrow performance."
    >
      <EmptyState
        icon={TrendingUp}
        title="Analytics will appear after your first transaction"
        description="Once invoices or escrows start moving, StellFlow will surface volume trends, settlement times, and payout health."
        action="Explore Sample Metrics"
      />
    </DashboardShell>
  );
}
