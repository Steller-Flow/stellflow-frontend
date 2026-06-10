import { LockKeyhole } from "lucide-react";
import { DashboardShell, EmptyState } from "../../components/DashboardShell";

export default function EscrowsPage() {
  return (
    <DashboardShell
      activeHref="/dashboard/escrows"
      title="Escrows"
      description="Protect contract work with milestone-based escrow workflows."
    >
      <EmptyState
        icon={LockKeyhole}
        title="No active escrows"
        description="Create a secure escrow, define deliverables, and release funds only when work is approved."
        action="Create Escrow"
      />
    </DashboardShell>
  );
}
