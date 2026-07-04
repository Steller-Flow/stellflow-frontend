"use client";

import { useRouter } from "next/navigation";
import { InvoiceForm } from "../../../components/InvoiceForm";
import { DashboardShell } from "../../../components/DashboardShell";
import { useInvoiceStore } from "../../../lib/invoiceStore";
import toast from "react-hot-toast";

export default function NewInvoicePage() {
  const router = useRouter();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);

  const handleSubmit = (data: Parameters<typeof addInvoice>[0]) => {
    const invoice = addInvoice(data);
    toast.success(`Invoice ${invoice.invoiceNumber} created successfully!`);
    router.push("/dashboard/invoices");
  };

  const handleCancel = () => {
    router.push("/dashboard/invoices");
  };

  return (
    <DashboardShell
      activeHref="/dashboard/invoices"
      title="Create Invoice"
      description="Create a new invoice with line items and send it to your client."
    >
      <div className="flex justify-center">
        <InvoiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </DashboardShell>
  );
}
