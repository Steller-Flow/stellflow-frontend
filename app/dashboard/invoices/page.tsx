"use client";

import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "../../components/DashboardShell";
import { InvoiceFilters } from "../../components/InvoiceFilters";
import { InvoiceTable } from "../../components/InvoiceTable";
import { useInvoiceStore } from "../../lib/invoiceStore";
import toast from "react-hot-toast";

export default function InvoicesPage() {
  const {
    filter,
    sort,
    pagination,
    selectedIds,
    setFilter,
    setSort,
    setPagination,
    toggleSelect,
    selectAll,
    clearSelection,
    deleteInvoice,
    deleteSelected,
    updateStatus,
    getFilteredInvoices,
  } = useInvoiceStore();

  const filteredInvoices = getFilteredInvoices();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(id);
      toast.success("Invoice deleted");
    }
  };

  const handleDeleteSelected = () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedIds.length} invoice(s)?`
      )
    ) {
      deleteSelected();
      toast.success(`${selectedIds.length} invoice(s) deleted`);
    }
  };

  const handleSend = (ids: string[]) => {
    updateStatus(ids, "SENT");
    toast.success(
      `${ids.length} invoice(s) sent successfully`
    );
  };

  return (
    <DashboardShell
      activeHref="/dashboard/invoices"
      title="Invoices"
      description="Create and track client invoices with Stellar settlement rails."
    >
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">
              {filteredInvoices.length} invoice
              {filteredInvoices.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/dashboard/invoices/new"
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95"
          >
            <Plus size={18} />
            New Invoice
          </Link>
        </div>

        <InvoiceFilters filter={filter} onFilterChange={setFilter} />

        <InvoiceTable
          invoices={filteredInvoices}
          sort={sort}
          pagination={pagination}
          selectedIds={selectedIds}
          onSort={setSort}
          onPageChange={(page) => setPagination({ page })}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onDelete={handleDelete}
          onDeleteSelected={handleDeleteSelected}
          onSend={handleSend}
        />
      </div>
    </DashboardShell>
  );
}
