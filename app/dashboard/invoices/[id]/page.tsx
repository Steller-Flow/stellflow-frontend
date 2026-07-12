"use client";

import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  FileText,
  Mail,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { DashboardShell } from "../../../components/DashboardShell";
import { useInvoiceStore } from "../../../lib/invoiceStore";
import type { InvoiceStatus } from "../../../lib/types";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; color: string; icon: React.ComponentType<{ size?: number }> }
> = {
  DRAFT: { label: "Draft", color: "bg-surface-container text-text-secondary", icon: FileText },
  SENT: { label: "Sent", color: "bg-status-info/10 text-status-info", icon: Send },
  VIEWED: { label: "Viewed", color: "bg-secondary-container text-secondary", icon: Clock },
  PAID: { label: "Paid", color: "bg-status-success/10 text-status-success", icon: Check },
  OVERDUE: { label: "Overdue", color: "bg-status-error/10 text-status-error", icon: Clock },
  CANCELLED: { label: "Cancelled", color: "bg-surface-container text-text-muted", icon: X },
};

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const invoice = useInvoiceStore((state) =>
    state.invoices.find((inv) => inv.id === invoiceId)
  );
  const updateStatus = useInvoiceStore((state) => state.updateStatus);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);

  if (!invoice) {
    return (
      <DashboardShell
        activeHref="/dashboard/invoices"
        title="Invoice Not Found"
        description="The invoice you're looking for doesn't exist."
      >
        <div className="flex flex-col items-center py-2xl text-center">
          <FileText size={48} className="mb-lg text-text-muted" />
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Invoice not found
          </h2>
          <p className="mt-sm text-text-secondary">
            This invoice may have been deleted or doesn&apos;t exist.
          </p>
          <Link
            href="/dashboard/invoices"
            className="mt-lg inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-xl font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <ArrowLeft size={18} />
            Back to Invoices
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const statusConfig = STATUS_CONFIG[invoice.status];
  const StatusIcon = statusConfig.icon;

  const handleSendReminder = () => {
    updateStatus([invoice.id], "SENT");
    toast.success("Reminder sent successfully");
  };

  const handleMarkPaid = () => {
    updateStatus([invoice.id], "PAID");
    toast.success("Invoice marked as paid");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(invoice.id);
      toast.success("Invoice deleted");
      router.push("/dashboard/invoices");
    }
  };

  const handlePayNow = () => {
    toast.success("Payment initiated via Stellar");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency === "XLM" ? "USD" : invoice.currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isFreelancer = invoice.status === "DRAFT" || invoice.status === "SENT";
  const isClient = invoice.status === "VIEWED" || invoice.status === "OVERDUE";

  return (
    <DashboardShell
      activeHref="/dashboard/invoices"
      title={`Invoice ${invoice.invoiceNumber}`}
      description={`Created on ${formatDate(invoice.createdAt)}`}
    >
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/invoices"
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg border border-border bg-white px-lg font-semibold text-text-primary transition hover:bg-surface-container-low"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <div className="flex items-center gap-sm">
            <span
              className={`inline-flex items-center gap-sm rounded-full px-md py-xs font-semibold ${statusConfig.color}`}
            >
              <StatusIcon size={16} />
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="grid gap-lg lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-lg">
            <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
              <h3 className="font-display mb-lg text-lg font-semibold text-text-primary">
                Invoice Details
              </h3>
              <div className="grid grid-cols-2 gap-md text-sm md:grid-cols-4">
                <div>
                  <p className="text-text-muted">Invoice Number</p>
                  <p className="font-semibold text-text-primary">
                    {invoice.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Issue Date</p>
                  <p className="font-semibold text-text-primary">
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Due Date</p>
                  <p className="font-semibold text-text-primary">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Currency</p>
                  <p className="font-semibold text-text-primary">
                    {invoice.currency}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
              <h3 className="font-display mb-lg text-lg font-semibold text-text-primary">
                Client Information
              </h3>
              <div className="grid grid-cols-1 gap-md text-sm md:grid-cols-2">
                <div className="flex items-center gap-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-tint text-primary">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-text-muted">Client Name</p>
                    <p className="font-semibold text-text-primary">
                      {invoice.clientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-tint text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-text-muted">Email</p>
                    <p className="font-semibold text-text-primary">
                      {invoice.clientEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
              <h3 className="font-display mb-lg text-lg font-semibold text-text-primary">
                Line Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="pb-sm text-left font-semibold text-text-muted">
                        Description
                      </th>
                      <th className="pb-sm text-right font-semibold text-text-muted">
                        Qty
                      </th>
                      <th className="pb-sm text-right font-semibold text-text-muted">
                        Unit Price
                      </th>
                      <th className="pb-sm text-right font-semibold text-text-muted">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-divider/50">
                        <td className="py-md text-text-primary">{item.description}</td>
                        <td className="py-md text-right text-text-secondary">
                          {item.quantity}
                        </td>
                        <td className="py-md text-right text-text-secondary">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-md text-right font-medium text-text-primary">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-lg">
            <div className="rounded-xl border border-primary bg-primary-tint p-lg">
              <h3 className="font-display mb-md text-lg font-semibold text-text-primary">
                Payment Summary
              </h3>
              <div className="space-y-sm text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    Tax ({(invoice.taxRate * 100).toFixed(1)}%)
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(invoice.taxAmount)}
                  </span>
                </div>
                <div className="border-t border-primary/20 pt-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-text-primary">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
              <h3 className="font-display mb-md text-lg font-semibold text-text-primary">
                Actions
              </h3>
              <div className="space-y-sm">
                {isClient && (
                  <button
                    type="button"
                    onClick={handlePayNow}
                    className="inline-flex h-11 w-full items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95"
                  >
                    <CreditCard size={18} />
                    Pay Now
                  </button>
                )}

                {isFreelancer && invoice.status === "SENT" && (
                  <button
                    type="button"
                    onClick={handleSendReminder}
                    className="inline-flex h-11 w-full items-center justify-center gap-sm rounded-lg border border-border bg-white px-lg font-semibold text-text-primary transition hover:bg-surface-container-low active:scale-95"
                  >
                    <Send size={18} />
                    Send Reminder
                  </button>
                )}

                {isFreelancer && invoice.status === "DRAFT" && (
                  <Link
                    href="/dashboard/invoices"
                    className="inline-flex h-11 w-full items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95"
                  >
                    <Send size={18} />
                    Send Invoice
                  </Link>
                )}

                {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
                  <button
                    type="button"
                    onClick={handleMarkPaid}
                    className="inline-flex h-11 w-full items-center justify-center gap-sm rounded-lg border border-border bg-white px-lg font-semibold text-text-primary transition hover:bg-surface-container-low active:scale-95"
                  >
                    <Check size={18} />
                    Mark as Paid
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-11 w-full items-center justify-center gap-sm rounded-lg border border-status-error/30 bg-error-container/30 px-lg font-semibold text-status-error transition hover:bg-error-container active:scale-95"
                >
                  <Trash2 size={18} />
                  Delete Invoice
                </button>
              </div>
            </div>

            {invoice.notes && (
              <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
                <h3 className="font-display mb-md text-lg font-semibold text-text-primary">
                  Notes
                </h3>
                <p className="text-sm text-text-secondary">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
