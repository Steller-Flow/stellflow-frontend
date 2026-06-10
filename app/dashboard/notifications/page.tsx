import { Bell } from "lucide-react";
import { DashboardShell, EmptyState } from "../../components/DashboardShell";

export default function NotificationsPage() {
  return (
    <DashboardShell
      activeHref="/dashboard/notifications"
      title="Notifications"
      description="Stay ahead of approvals, settlement events, and wallet activity."
    >
      <EmptyState
        icon={Bell}
        title="No notifications yet"
        description="Funding alerts, payout approvals, dispute updates, and workspace messages will appear here."
        action="Configure Alerts"
      />
    </DashboardShell>
  );
}
