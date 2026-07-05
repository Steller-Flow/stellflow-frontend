"use client";

import { TrendingUp } from "lucide-react";
import { EmptyStateCard } from "./EmptyStateCard";

type AnalyticsEmptyStateProps = {
  onNavigate: () => void;
};

export function AnalyticsEmptyState({ onNavigate }: AnalyticsEmptyStateProps) {
  return (
    <EmptyStateCard
      icon={TrendingUp}
      title="Analytics are ready to track"
      description="View payment volume, settlement speed, and escrow performance. Data will populate as you create invoices and fund escrows."
      actionLabel="View Dashboard"
      onAction={onNavigate}
      features={["Revenue", "Volume", "Settlements"]}
    />
  );
}
