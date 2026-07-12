"use client";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Invoice, InvoiceSort, InvoicePagination } from "../lib/invoiceTypes";
import { STATUS_LABELS, STATUS_COLORS, CURRENCY_SYMBOLS } from "../lib/invoiceTypes";

type InvoiceTableProps = {
  invoices: Invoice[];
  sort: InvoiceSort;
  pagination: InvoicePagination;
  selectedIds: string[];
  onSort: (sort: InvoiceSort) => void;
  onPageChange: (page: number) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
  onDelete: (id: string) => void;
  onDeleteSelected: () => void;
  onSend: (ids: string[]) => void;
};

type SortableField = InvoiceSort["field"];

function SortIcon({
  field,
  currentSort,
}: {
  field: SortableField;
  currentSort: InvoiceSort;
}) {
  return (
    <ArrowUpDown
      size={14}
      className={`ml-xs inline ${
        currentSort.field === field ? "text-primary" : "text-text-muted"
      }`}
    />
  );
}

export function InvoiceTable({
  invoices,
  sort,
  pagination,
  selectedIds,
  onSort,
  onPageChange,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDelete,
  onDeleteSelected,
  onSend,
}: InvoiceTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const totalPages = Math.ceil(invoices.length / pagination.pageSize);
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedInvoices = invoices.slice(
    startIndex,
    startIndex + pagination.pageSize
  );

  const allSelected =
    paginatedInvoices.length > 0 &&
    paginatedInvoices.every((inv) => selectedIds.includes(inv.id));

  const handleSort = (field: SortableField) => {
    onSort({
      field,
      direction:
        sort.field === field && sort.direction === "asc" ? "desc" : "asc",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: Invoice["currency"]) => {
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="rounded-xl border border-divider bg-card-bg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-surface-container-low">
              <th className="w-12 px-md py-lg">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    allSelected
                      ? onClearSelection()
                      : onSelectAll(paginatedInvoices.map((inv) => inv.id))
                  }
                  className="h-4 w-4 rounded border-border accent-primary"
                />
              </th>
              <th
                className="cursor-pointer px-md py-lg text-left font-semibold text-text-muted hover:text-text-primary"
                onClick={() => handleSort("invoiceNumber")}
              >
                Invoice
                <SortIcon field="invoiceNumber" currentSort={sort} />
              </th>
              <th
                className="cursor-pointer px-md py-lg text-left font-semibold text-text-muted hover:text-text-primary"
                onClick={() => handleSort("clientName")}
              >
                Client
                <SortIcon field="clientName" currentSort={sort} />
              </th>
              <th
                className="cursor-pointer px-md py-lg text-left font-semibold text-text-muted hover:text-text-primary"
                onClick={() => handleSort("status")}
              >
                Status
                <SortIcon field="status" currentSort={sort} />
              </th>
              <th
                className="cursor-pointer px-md py-lg text-right font-semibold text-text-muted hover:text-text-primary"
                onClick={() => handleSort("total")}
              >
                Amount
                <SortIcon field="total" currentSort={sort} />
              </th>
              <th
                className="cursor-pointer px-md py-lg text-left font-semibold text-text-muted hover:text-text-primary"
                onClick={() => handleSort("dueDate")}
              >
                Due Date
                <SortIcon field="dueDate" currentSort={sort} />
              </th>
              <th className="w-12 px-md py-lg"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-md py-3xl text-center">
                  <div className="flex flex-col items-center">
                    <FileText size={48} className="mb-md text-text-muted" />
                    <p className="font-semibold text-text-primary">
                      No invoices found
                    </p>
                    <p className="text-sm text-text-secondary">
                      Try adjusting your filters or create a new invoice.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`border-b border-divider/50 transition hover:bg-surface-container-low ${
                    selectedIds.includes(invoice.id) ? "bg-primary-tint/30" : ""
                  }`}
                >
                  <td className="px-md py-lg">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(invoice.id)}
                      onChange={() => onToggleSelect(invoice.id)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                  </td>
                  <td className="px-md py-lg">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatDate(invoice.issueDate)}
                      </p>
                    </div>
                  </td>
                  <td className="px-md py-lg">
                    <div>
                      <p className="font-medium text-text-primary">
                        {invoice.clientName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {invoice.clientEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-md py-lg">
                    <span
                      className={`inline-flex items-center rounded-full px-sm py-xs text-xs font-semibold ${STATUS_COLORS[invoice.status]}`}
                    >
                      {STATUS_LABELS[invoice.status]}
                    </span>
                  </td>
                  <td className="px-md py-lg text-right">
                    <p className="font-semibold text-text-primary">
                      {formatAmount(invoice.total, invoice.currency)}
                    </p>
                  </td>
                  <td className="px-md py-lg">
                    <div className="flex items-center gap-sm">
                      <Clock size={14} className="text-text-muted" />
                      <span className="text-text-secondary">
                        {formatDate(invoice.dueDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-md py-lg">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === invoice.id ? null : invoice.id
                          )
                        }
                        className="rounded-full p-sm text-text-muted transition hover:bg-surface-container-high hover:text-text-primary"
                        aria-label="More actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === invoice.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-xs w-48 overflow-hidden rounded-xl border border-divider bg-card-bg shadow-lg">
                            {invoice.status === "DRAFT" && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSend([invoice.id]);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-sm px-md py-sm text-sm text-text-primary transition hover:bg-surface-container-low"
                              >
                                <Send size={16} />
                                Send Invoice
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(invoice.id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-sm px-md py-sm text-sm text-status-error transition hover:bg-error-container/50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-t border-divider bg-primary-tint/30 px-md py-md">
          <span className="text-sm font-medium text-text-primary">
            {selectedIds.length} invoice{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => onSend(selectedIds)}
              className="inline-flex h-9 items-center justify-center gap-sm rounded-lg bg-primary px-md text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
            >
              <Send size={14} />
              Send
            </button>
            <button
              type="button"
              onClick={onDeleteSelected}
              className="inline-flex h-9 items-center justify-center gap-sm rounded-lg border border-status-error bg-white px-md text-sm font-semibold text-status-error transition hover:bg-error-container/50"
            >
              <Trash2 size={14} />
              Delete
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-white px-md text-sm font-semibold text-text-secondary transition hover:bg-surface-container-low"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-divider px-md py-md">
          <p className="text-sm text-text-secondary">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pagination.pageSize, invoices.length)} of{" "}
            {invoices.length} invoices
          </p>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-secondary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                    pagination.page === pageNum
                      ? "bg-primary text-on-primary"
                      : "border border-border bg-white text-text-secondary hover:bg-surface-container-low"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-secondary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
