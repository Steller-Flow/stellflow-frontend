"use client";

import { Bell } from "lucide-react";
import { EmptyStateCard } from "./EmptyStateCard";

type NotificationsEmptyStateProps = {
  onNavigate?: () => void;
};

export function NotificationsEmptyState({ onNavigate }: NotificationsEmptyStateProps) {
  return (
    <EmptyStateCard
      icon={Bell}
      title="No notifications yet"
      description="Funding alerts, payout approvals, dispute updates, and workspace messages will appear here. Stay informed about your transactions."
      actionLabel={onNavigate ? "Go to Dashboard" : "Enable Notifications"}
      onAction={onNavigate || (() => {})}
      features={["Alerts", "Approvals", "Updates"]}
    />
  );
}
