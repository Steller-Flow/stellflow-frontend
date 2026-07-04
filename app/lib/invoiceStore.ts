"use client";

import { create } from "zustand";
import type {
  Invoice,
  InvoiceFormData,
  InvoiceFilter,
  InvoiceSort,
  InvoicePagination,
  InvoiceStatus,
  InvoiceLineItem,
} from "./invoiceTypes";

type InvoiceStore = {
  invoices: Invoice[];
  filter: InvoiceFilter;
  sort: InvoiceSort;
  pagination: InvoicePagination;
  selectedIds: string[];
  setFilter: (filter: InvoiceFilter) => void;
  setSort: (sort: InvoiceSort) => void;
  setPagination: (pagination: Partial<InvoicePagination>) => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addInvoice: (data: InvoiceFormData) => Invoice;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  deleteSelected: () => void;
  updateStatus: (ids: string[], status: InvoiceStatus) => void;
  getFilteredInvoices: () => Invoice[];
};

let invoiceCounter = 1000;

function generateInvoiceNumber(): string {
  invoiceCounter++;
  return `INV-${invoiceCounter}`;
}

function calculateLineItemAmount(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

function calculateInvoiceTotals(
  lineItems: InvoiceLineItem[],
  taxRate: number
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, total };
}

const sampleInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-1001",
    status: "PAID",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    issueDate: "2026-06-15",
    dueDate: "2026-07-15",
    currency: "USDC",
    lineItems: [
      { id: "li-1", description: "Website Redesign", quantity: 1, unitPrice: 5000, amount: 5000 },
      { id: "li-2", description: "SEO Optimization", quantity: 1, unitPrice: 1500, amount: 1500 },
    ],
    subtotal: 6500,
    taxRate: 0,
    taxAmount: 0,
    total: 6500,
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-20T14:30:00Z",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-1002",
    status: "SENT",
    clientName: "Global Tech Solutions",
    clientEmail: "finance@globaltech.io",
    issueDate: "2026-06-20",
    dueDate: "2026-07-20",
    currency: "USDC",
    lineItems: [
      { id: "li-3", description: "Mobile App Development", quantity: 1, unitPrice: 12000, amount: 12000 },
      { id: "li-4", description: "API Integration", quantity: 40, unitPrice: 150, amount: 6000 },
    ],
    subtotal: 18000,
    taxRate: 0.05,
    taxAmount: 900,
    total: 18900,
    createdAt: "2026-06-20T09:00:00Z",
    updatedAt: "2026-06-20T09:00:00Z",
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-1003",
    status: "OVERDUE",
    clientName: "Digital Innovations Ltd",
    clientEmail: "accounts@digitalinnovations.co",
    issueDate: "2026-05-01",
    dueDate: "2026-06-01",
    currency: "USDC",
    lineItems: [
      { id: "li-5", description: "Consulting Services", quantity: 20, unitPrice: 200, amount: 4000 },
    ],
    subtotal: 4000,
    taxRate: 0,
    taxAmount: 0,
    total: 4000,
    createdAt: "2026-05-01T08:00:00Z",
    updatedAt: "2026-06-02T00:00:00Z",
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-1004",
    status: "DRAFT",
    clientName: "Startup Labs",
    clientEmail: "hello@startuplabs.com",
    issueDate: "2026-06-25",
    dueDate: "2026-07-25",
    currency: "USDC",
    lineItems: [
      { id: "li-6", description: "Brand Identity Design", quantity: 1, unitPrice: 3500, amount: 3500 },
      { id: "li-7", description: "Logo Design Package", quantity: 1, unitPrice: 1500, amount: 1500 },
      { id: "li-8", description: "Brand Guidelines Document", quantity: 1, unitPrice: 800, amount: 800 },
    ],
    subtotal: 5800,
    taxRate: 0.1,
    taxAmount: 580,
    total: 6380,
    createdAt: "2026-06-25T11:00:00Z",
    updatedAt: "2026-06-25T11:00:00Z",
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-1005",
    status: "VIEWED",
    clientName: "CloudNine Services",
    clientEmail: "payments@cloudnine.dev",
    issueDate: "2026-06-22",
    dueDate: "2026-07-22",
    currency: "USDC",
    lineItems: [
      { id: "li-9", description: "Cloud Infrastructure Setup", quantity: 1, unitPrice: 2500, amount: 2500 },
      { id: "li-10", description: "Monthly Maintenance", quantity: 3, unitPrice: 500, amount: 1500 },
    ],
    subtotal: 4000,
    taxRate: 0,
    taxAmount: 0,
    total: 4000,
    createdAt: "2026-06-22T16:00:00Z",
    updatedAt: "2026-06-23T09:00:00Z",
  },
];

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: sampleInvoices,
  filter: {},
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10, total: sampleInvoices.length },
  selectedIds: [],

  setFilter: (filter) =>
    set({ filter, pagination: { ...get().pagination, page: 1 } }),

  setSort: (sort) => set({ sort }),

  setPagination: (partial) =>
    set({ pagination: { ...get().pagination, ...partial } }),

  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    })),

  selectAll: (ids) => set({ selectedIds: ids }),

  clearSelection: () => set({ selectedIds: [] }),

  addInvoice: (data) => {
    const lineItems: InvoiceLineItem[] = data.lineItems.map((item, index) => ({
      ...item,
      id: `li-${Date.now()}-${index}`,
      amount: calculateLineItemAmount(item.quantity, item.unitPrice),
    }));

    const { subtotal, taxAmount, total } = calculateInvoiceTotals(
      lineItems,
      data.taxRate
    );

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      status: "DRAFT",
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: data.clientAddress,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      currency: data.currency,
      lineItems,
      subtotal,
      taxRate: data.taxRate,
      taxAmount,
      total,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      invoices: [invoice, ...state.invoices],
      pagination: {
        ...state.pagination,
        total: state.pagination.total + 1,
      },
    }));

    return invoice;
  },

  updateInvoice: (id, data) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...data, updatedAt: new Date().toISOString() } : inv
      ),
    })),

  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
      selectedIds: state.selectedIds.filter((i) => i !== id),
      pagination: {
        ...state.pagination,
        total: state.pagination.total - 1,
      },
    })),

  deleteSelected: () =>
    set((state) => ({
      invoices: state.invoices.filter(
        (inv) => !state.selectedIds.includes(inv.id)
      ),
      pagination: {
        ...state.pagination,
        total: state.pagination.total - state.selectedIds.length,
      },
      selectedIds: [],
    })),

  updateStatus: (ids, status) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        ids.includes(inv.id)
          ? { ...inv, status, updatedAt: new Date().toISOString() }
          : inv
      ),
      selectedIds: [],
    })),

  getFilteredInvoices: () => {
    const { invoices, filter, sort, pagination } = get();

    let filtered = [...invoices];

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((inv) => filter.status!.includes(inv.status));
    }

    if (filter.client) {
      const clientLower = filter.client.toLowerCase();
      filtered = filtered.filter((inv) =>
        inv.clientName.toLowerCase().includes(clientLower)
      );
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchLower) ||
          inv.clientName.toLowerCase().includes(searchLower) ||
          inv.clientEmail.toLowerCase().includes(searchLower)
      );
    }

    if (filter.dateRange) {
      filtered = filtered.filter((inv) => {
        const issueDate = new Date(inv.issueDate);
        const start = filter.dateRange!.start ? new Date(filter.dateRange!.start) : null;
        const end = filter.dateRange!.end ? new Date(filter.dateRange!.end) : null;
        if (start && issueDate < start) return false;
        if (end && issueDate > end) return false;
        return true;
      });
    }

    if (filter.amountRange) {
      filtered = filtered.filter((inv) => {
        if (filter.amountRange!.min !== undefined && inv.total < filter.amountRange!.min)
          return false;
        if (filter.amountRange!.max !== undefined && inv.total > filter.amountRange!.max)
          return false;
        return true;
      });
    }

    filtered.sort((a, b) => {
      const { field, direction } = sort;
      let comparison = 0;

      switch (field) {
        case "invoiceNumber":
          comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
          break;
        case "clientName":
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "dueDate":
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return direction === "asc" ? comparison : -comparison;
    });

    return filtered;
  },
}));
