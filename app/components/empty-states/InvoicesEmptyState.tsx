"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyStateCard } from "./EmptyStateCard";

export function InvoicesEmptyState() {
  const router = useRouter();

  return (
    <EmptyStateCard
      icon={FileText}
      title="No invoices yet"
      description="Create your first invoice to start billing clients with Stellar settlement rails. Track payment status and get paid faster with on-chain settlement."
      actionLabel="Create First Invoice"
      onAction={() => router.push("/dashboard/invoices/new")}
      features={["Create", "Track", "Settle"]}
    />
  );
}
