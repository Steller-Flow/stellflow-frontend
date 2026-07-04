"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletSession } from "../types";

type AuthState = {
  session: WalletSession;
  isConnecting: boolean;
  error: string | null;
};

type AuthActions = {
  setSession: (session: WalletSession) => void;
  connect: (address: string) => void;
  disconnect: () => void;
  setOnboarded: (onboarded: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      session: {
        connected: false,
        onboarded: false,
        address: null,
      },
      isConnecting: false,
      error: null,

      setSession: (session) => set({ session }),

      connect: (address) =>
        set({
          session: { connected: true, onboarded: false, address },
          isConnecting: false,
          error: null,
        }),

      disconnect: () =>
        set({
          session: { connected: false, onboarded: false, address: null },
          error: null,
        }),

      setOnboarded: (onboarded) =>
        set((state) => ({
          session: { ...state.session, onboarded },
        })),

      setConnecting: (connecting) => set({ isConnecting: connecting }),
      setError: (error) => set({ error, isConnecting: false }),
    }),
    {
      name: "stellflow-auth",
      partialize: (state) => ({ session: state.session }),
    }
  )
);
