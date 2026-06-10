import { FileText } from "lucide-react";
import { DashboardShell, EmptyState } from "../../components/DashboardShell";

export default function InvoicesPage() {
  return (
    <DashboardShell
      activeHref="/dashboard/invoices"
      title="Invoices"
      description="Create and track client invoices with Stellar settlement rails."
    >
      <EmptyState
        icon={FileText}
        title="No invoices yet"
        description="Start with a professional invoice, attach milestones, and let StellFlow track funding and settlement status."
        action="Create Invoice"
      />
    </DashboardShell>
  );
}
