"use client";

import {
  ChevronRight,
  CircleHelp,
  Info,
  Orbit,
  ShipWheel,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type WalletModalProps = {
  defaultOpen?: boolean;
};

const walletOptions = [
  {
    name: "Freighter",
    description: "Browser extension",
    icon: ShipWheel,
    recommended: true,
  },
  {
    name: "Albedo",
    description: "Web-based Stellar signer",
    icon: Orbit,
    recommended: false,
  },
  {
    name: "WalletConnect",
    description: "Mobile wallets and QR scan",
    icon: Smartphone,
    recommended: false,
  },
];

export function WalletModal({ defaultOpen = false }: WalletModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95"
      >
        <Wallet size={18} />
        Connect Wallet
      </button>

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 p-md transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        aria-hidden={!open}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="wallet-modal-title"
          className={`w-full max-w-md overflow-hidden rounded-xl border border-divider bg-card-bg shadow-2xl transition-transform duration-300 ${
            open ? "scale-100" : "scale-95"
          }`}
        >
          <header className="flex items-center justify-between border-b border-divider bg-surface-bright p-lg">
            <div>
              <h2
                id="wallet-modal-title"
                className="font-display text-xl font-bold text-text-primary"
              >
                Connect Wallet
              </h2>
              <p className="text-sm text-text-secondary">
                Select your preferred Stellar gateway
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-sm text-text-secondary transition hover:bg-surface-container-low hover:text-text-primary"
              aria-label="Close wallet modal"
            >
              <X size={20} />
            </button>
          </header>

          <div className="space-y-md p-lg">
            <div className="flex gap-md rounded-lg border border-primary-light/30 bg-primary-tint/60 p-md">
              <Info className="mt-0.5 shrink-0 text-primary" size={20} />
              <p className="text-sm text-on-primary-container">
                By connecting a wallet, you agree to StellFlow&apos;s Terms of
                Service and Privacy Policy.
              </p>
            </div>

            <div className="space-y-sm">
              {walletOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <a
                    key={option.name}
                    href="/onboarding"
                    className="group flex w-full items-center justify-between rounded-xl border border-divider bg-white p-md transition hover:border-primary hover:bg-primary-tint/40 active:scale-[0.98]"
                  >
                    <span className="flex min-w-0 items-center gap-md">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary transition group-hover:bg-white">
                        <Icon size={25} />
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block font-semibold text-text-primary">
                          {option.name}
                        </span>
                        <span className="block text-sm text-text-secondary">
                          {option.description}
                          {option.recommended ? " (Recommended)" : ""}
                        </span>
                      </span>
                    </span>
                    <ChevronRight
                      className="shrink-0 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                      size={20}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          <footer className="flex items-center gap-md border-t border-divider bg-surface-container-low p-lg">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary">
              <CircleHelp size={18} />
            </span>
            <p className="text-xs text-text-secondary">
              New to Stellar?{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                Learn how to set up a wallet.
              </a>
            </p>
          </footer>
        </section>
      </div>
    </>
  );
}
