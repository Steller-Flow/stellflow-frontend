"use client";

import { create } from "zustand";
import type { Escrow, EscrowStatus } from "../types";

type EscrowState = {
  escrows: Escrow[];
  isLoading: boolean;
  error: string | null;
  selectedEscrow: Escrow | null;
};

type EscrowActions = {
  setEscrows: (escrows: Escrow[]) => void;
  addEscrow: (escrow: Escrow) => void;
  updateEscrow: (id: string, updates: Partial<Escrow>) => void;
  deleteEscrow: (id: string) => void;
  updateStatus: (id: string, status: EscrowStatus) => void;
  selectEscrow: (escrow: Escrow | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getEscrowById: (id: string) => Escrow | undefined;
  getEscrowsByStatus: (status: EscrowStatus) => Escrow[];
};

export const useEscrowStore = create<EscrowState & EscrowActions>()((set, get) => ({
  escrows: [],
  isLoading: false,
  error: null,
  selectedEscrow: null,

  setEscrows: (escrows) => set({ escrows }),

  addEscrow: (escrow) =>
    set((state) => ({
      escrows: [escrow, ...state.escrows],
    })),

  updateEscrow: (id, updates) =>
    set((state) => ({
      escrows: state.escrows.map((esc) =>
        esc.id === id ? { ...esc, ...updates, updatedAt: new Date().toISOString() } : esc
      ),
    })),

  deleteEscrow: (id) =>
    set((state) => ({
      escrows: state.escrows.filter((esc) => esc.id !== id),
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      escrows: state.escrows.map((esc) =>
        esc.id === id ? { ...esc, status, updatedAt: new Date().toISOString() } : esc
      ),
    })),

  selectEscrow: (escrow) => set({ selectedEscrow: escrow }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getEscrowById: (id) => get().escrows.find((esc) => esc.id === id),
  getEscrowsByStatus: (status) => get().escrows.filter((esc) => esc.status === status),
}));
