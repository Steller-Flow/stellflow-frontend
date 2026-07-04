"use client";

import { Calendar, DollarSign, Filter, Search, X } from "lucide-react";
import { useState } from "react";
import type { InvoiceFilter, InvoiceStatus } from "../lib/invoiceTypes";
import { STATUS_LABELS } from "../lib/invoiceTypes";

type InvoiceFiltersProps = {
  filter: InvoiceFilter;
  onFilterChange: (filter: InvoiceFilter) => void;
};

const statusOptions: InvoiceStatus[] = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

export function InvoiceFilters({ filter, onFilterChange }: InvoiceFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filter.search || "");

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onFilterChange({ ...filter, search: value || undefined });
  };

  const handleStatusToggle = (status: InvoiceStatus) => {
    const current = filter.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({
      ...filter,
      status: updated.length > 0 ? updated : undefined,
    });
  };

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    const current = filter.dateRange || { start: "", end: "" };
    onFilterChange({
      ...filter,
      dateRange: { ...current, [field]: value },
    });
  };

  const handleAmountRangeChange = (field: "min" | "max", value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    const current = filter.amountRange || {};
    onFilterChange({
      ...filter,
      amountRange: { ...current, [field]: numValue },
    });
  };

  const handleClientChange = (value: string) => {
    onFilterChange({
      ...filter,
      client: value || undefined,
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange({});
  };

  const hasActiveFilters =
    filter.status?.length ||
    filter.search ||
    filter.dateRange ||
    filter.amountRange ||
    filter.client;

  return (
    <div className="space-y-md">
      <div className="flex flex-col gap-md sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted"
            size={18}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search invoices by number, client, or email..."
            className="brand-field h-11 w-full rounded-lg border border-border bg-white pl-11 pr-md text-text-primary transition"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`inline-flex h-11 items-center justify-center gap-sm rounded-lg border px-lg font-semibold transition ${
            showAdvanced || hasActiveFilters
              ? "border-primary bg-primary-tint text-primary"
              : "border-border bg-white text-text-primary hover:bg-surface-container-low"
          }`}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-on-primary">
              {(filter.status?.length || 0) +
                (filter.search ? 1 : 0) +
                (filter.dateRange ? 1 : 0) +
                (filter.amountRange ? 1 : 0) +
                (filter.client ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg border border-border bg-white px-lg font-semibold text-text-secondary transition hover:bg-surface-container-low"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
          <div className="space-y-lg">
            <div>
              <h4 className="mb-sm text-sm font-semibold text-text-primary">
                Status
              </h4>
              <div className="flex flex-wrap gap-sm">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusToggle(status)}
                    className={`inline-flex h-8 items-center rounded-full px-md text-sm font-medium transition ${
                      filter.status?.includes(status)
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-text-secondary hover:bg-surface-container-high"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
              <div>
                <h4 className="mb-sm flex items-center gap-sm text-sm font-semibold text-text-primary">
                  <Calendar size={14} />
                  Date Range
                </h4>
                <div className="flex items-center gap-sm">
                  <input
                    type="date"
                    value={filter.dateRange?.start || ""}
                    onChange={(e) => handleDateRangeChange("start", e.target.value)}
                    className="brand-field h-10 flex-1 rounded-lg border border-border bg-white px-md text-sm text-text-primary transition"
                  />
                  <span className="text-text-muted">to</span>
                  <input
                    type="date"
                    value={filter.dateRange?.end || ""}
                    onChange={(e) => handleDateRangeChange("end", e.target.value)}
                    className="brand-field h-10 flex-1 rounded-lg border border-border bg-white px-md text-sm text-text-primary transition"
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-sm flex items-center gap-sm text-sm font-semibold text-text-primary">
                  <DollarSign size={14} />
                  Amount Range
                </h4>
                <div className="flex items-center gap-sm">
                  <input
                    type="number"
                    value={filter.amountRange?.min || ""}
                    onChange={(e) => handleAmountRangeChange("min", e.target.value)}
                    placeholder="Min"
                    className="brand-field h-10 flex-1 rounded-lg border border-border bg-white px-md text-sm text-text-primary transition"
                  />
                  <span className="text-text-muted">to</span>
                  <input
                    type="number"
                    value={filter.amountRange?.max || ""}
                    onChange={(e) => handleAmountRangeChange("max", e.target.value)}
                    placeholder="Max"
                    className="brand-field h-10 flex-1 rounded-lg border border-border bg-white px-md text-sm text-text-primary transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-sm text-sm font-semibold text-text-primary">
                Client
              </h4>
              <input
                type="text"
                value={filter.client || ""}
                onChange={(e) => handleClientChange(e.target.value)}
                placeholder="Filter by client name..."
                className="brand-field h-10 w-full rounded-lg border border-border bg-white px-md text-sm text-text-primary transition md:w-1/2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
