"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  sidebar: {
    collapsed: boolean;
    mobileOpen: boolean;
  };
  modals: {
    createInvoice: boolean;
    createEscrow: boolean;
    walletConnect: boolean;
    notificationCenter: boolean;
  };
  toasts: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>;
};

type UIActions = {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  openModal: (modal: keyof UIState["modals"]) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
  closeAllModals: () => void;
  addToast: (toast: { message: string; type: "success" | "error" | "info" | "warning" }) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      sidebar: {
        collapsed: false,
        mobileOpen: false,
      },
      modals: {
        createInvoice: false,
        createEscrow: false,
        walletConnect: false,
        notificationCenter: false,
      },
      toasts: [],

      toggleSidebar: () =>
        set((state) => ({
          sidebar: { ...state.sidebar, collapsed: !state.sidebar.collapsed },
        })),

      setSidebarCollapsed: (collapsed) =>
        set((state) => ({
          sidebar: { ...state.sidebar, collapsed },
        })),

      setMobileSidebarOpen: (open) =>
        set((state) => ({
          sidebar: { ...state.sidebar, mobileOpen: open },
        })),

      openModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: true },
        })),

      closeModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: false },
        })),

      closeAllModals: () =>
        set({
          modals: {
            createInvoice: false,
            createEscrow: false,
            walletConnect: false,
            notificationCenter: false,
          },
        }),

      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { ...toast, id: `toast-${Date.now()}-${Math.random().toString(36).slice(2)}` },
          ],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: "stellflow-ui",
      partialize: (state) => ({ sidebar: state.sidebar }),
    }
  )
);
