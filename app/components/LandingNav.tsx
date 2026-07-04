"use client";

import { LayoutDashboard, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getWalletSession,
  onWalletSessionChange,
  type WalletSession,
} from "../lib/walletSession";
import { Brand } from "./Brand";

const navLinks = ["Features", "How It Works", "Use Cases"];

export function LandingNav() {
  const [session, setSession] = useState<WalletSession>({
    connected: false,
    onboarded: false,
    address: null,
    network: null,
    balance: null,
  });

  useEffect(() => {
    const syncSession = () => setSession(getWalletSession());

    syncSession();
    return onWalletSessionChange(syncSession);
  }, []);

  const signInHref = session.onboarded
    ? session.connected
      ? "/dashboard"
      : "/connect-wallet"
    : session.connected
      ? "/onboarding"
      : "/connect-wallet";

  return (
    <nav className="sticky top-0 z-50 flex h-topbar-height items-center border-b border-divider bg-card-bg/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full items-center justify-between px-md sm:px-25">
        <div className="flex min-w-0 items-center gap-xl">
          <Brand />
          <div className="hidden items-center gap-lg md:flex">
            {navLinks.map((item) => (
              <a
                key={item}
                className="font-medium text-text-secondary transition hover:text-primary"
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-sm sm:gap-md">
          <Link
            href={signInHref}
            className="hidden h-10 items-center justify-center rounded-lg px-md font-semibold text-text-primary transition hover:bg-surface-container-low sm:inline-flex"
          >
            {session.onboarded ? (
              <span className="inline-flex items-center gap-xs">
                <LayoutDashboard size={16} />
                View Dashboard
              </span>
            ) : (
              "Sign In"
            )}
          </Link>
          <Link
            href="/connect-wallet"
            className="inline-flex h-10 items-center justify-center gap-sm rounded-lg bg-primary px-md font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95 sm:px-lg"
          >
            <Wallet size={18} />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
