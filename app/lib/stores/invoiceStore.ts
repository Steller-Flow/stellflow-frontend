"use client";

import { create } from "zustand";
import type { Invoice, InvoiceStatus } from "../types";

type InvoiceState = {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
};

type InvoiceActions = {
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateStatus: (id: string, status: InvoiceStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
};

export const useInvoiceStore = create<InvoiceState & InvoiceActions>()((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,

  setInvoices: (invoices) => set({ invoices }),

  addInvoice: (invoice) =>
    set((state) => ({
      invoices: [invoice, ...state.invoices],
    })),

  updateInvoice: (id, updates) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
      ),
    })),

  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getInvoiceById: (id) => get().invoices.find((inv) => inv.id === id),
  getInvoicesByStatus: (status) => get().invoices.filter((inv) => inv.status === status),
}));
