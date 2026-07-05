"use client";

import { LockKeyhole } from "lucide-react";
import { EmptyStateCard } from "./EmptyStateCard";

type EscrowsEmptyStateProps = {
  onCreateEscrow: () => void;
};

export function EscrowsEmptyState({ onCreateEscrow }: EscrowsEmptyStateProps) {
  return (
    <EmptyStateCard
      icon={LockKeyhole}
      title="No active escrows"
      description="Create a secure escrow, define deliverables, and release funds only when work is approved. Milestone-based payments protect both parties."
      actionLabel="Create Escrow"
      onAction={onCreateEscrow}
      features={["Fund", "Milestone", "Release"]}
    />
  );
}
