"use client";

import {
  AlertTriangle,
  ChevronRight,
  CircleHelp,
  Info,
  Loader2,
  Orbit,
  ShipWheel,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { connectWallet, getWalletSession } from "../lib/walletSession";
import {
  checkFreighterInstalled,
  connectFreighter,
  type FreighterError,
} from "../lib/freighter";

type WalletModalProps = {
  defaultOpen?: boolean;
  className?: string;
};

type ConnectionState = "idle" | "connecting" | "error";

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

export function WalletModal({ defaultOpen = false, className = "" }: WalletModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [error, setError] = useState<FreighterError | null>(null);
  const [freighterInstalled, setFreighterInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    checkFreighterInstalled().then(setFreighterInstalled);
  }, []);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const handleWalletSelect = async (walletName: string) => {
    if (walletName === "Freighter") {
      setConnectionState("connecting");
      setError(null);

      try {
        const result = await connectFreighter();
        connectWallet(result.address, result.network);
        const session = getWalletSession();
        router.push(session.onboarded ? "/dashboard" : "/onboarding");
      } catch (err) {
        const freighterError = err as FreighterError;
        setError(freighterError);
        setConnectionState("error");
      }
    } else {
      connectWallet("");
      const session = getWalletSession();
      router.push(session.onboarded ? "/dashboard" : "/onboarding");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setConnectionState("idle");
    setError(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95 ${className}`}
      >
        <Wallet size={18} />
        Connect Wallet
      </button>

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 p-md transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) handleClose();
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
              onClick={handleClose}
              className="rounded-full p-sm text-text-secondary transition hover:bg-surface-container-low hover:text-text-primary"
              aria-label="Close wallet modal"
            >
              <X size={20} />
            </button>
          </header>

          <div className="space-y-md p-lg">
            {connectionState === "error" && error && (
              <div className="flex gap-md rounded-lg border border-status-error/30 bg-error-container/60 p-md">
                <AlertTriangle className="mt-0.5 shrink-0 text-status-error" size={20} />
                <div>
                  <p className="text-sm font-semibold text-status-error">
                    {error.message}
                  </p>
                  {error.detail && (
                    <p className="mt-xs text-xs text-text-secondary">
                      {error.detail}
                    </p>
                  )}
                  {error.code === "WALLET_NOT_INSTALLED" && (
                    <a
                      href="https://freighter.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-sm inline-flex items-center gap-xs text-sm font-semibold text-primary hover:underline"
                    >
                      Install Freighter
                      <ChevronRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {connectionState === "idle" && (
              <div className="flex gap-md rounded-lg border border-primary-light/30 bg-primary-tint/60 p-md">
                <Info className="mt-0.5 shrink-0 text-primary" size={20} />
                <p className="text-sm text-on-primary-container">
                  By connecting a wallet, you agree to StellFlow&apos;s Terms of
                  Service and Privacy Policy.
                </p>
              </div>
            )}

            <div className="space-y-sm">
              {walletOptions.map((option) => {
                const Icon = option.icon;
                const isFreighter = option.name === "Freighter";
                const isDisabled = isFreighter && freighterInstalled === false;
                const isConnecting = connectionState === "connecting" && isFreighter;

                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => handleWalletSelect(option.name)}
                    disabled={isDisabled || isConnecting}
                    className={`group flex w-full items-center justify-between rounded-xl border border-divider bg-white p-md transition active:scale-[0.98] ${
                      isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-primary hover:bg-primary-tint/40"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-md">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-primary transition group-hover:bg-white">
                        {isConnecting ? (
                          <Loader2 size={25} className="animate-spin" />
                        ) : (
                          <Icon size={25} />
                        )}
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block font-semibold text-text-primary">
                          {option.name}
                        </span>
                        <span className="block text-sm text-text-secondary">
                          {isDisabled
                            ? "Not installed"
                            : option.description}
                          {option.recommended && !isDisabled
                            ? " (Recommended)"
                            : ""}
                        </span>
                      </span>
                    </span>
                    {!isDisabled && !isConnecting && (
                      <ChevronRight
                        className="shrink-0 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                        size={20}
                      />
                    )}
                  </button>
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
              <a href="https://stellar.org/developers" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Learn how to set up a wallet.
              </a>
            </p>
          </footer>
        </section>
      </div>
    </>
  );
}
