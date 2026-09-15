"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletSession, type WalletSession } from "../lib/walletSession";

type AuthGuardMode = "connect" | "onboarded";

type AuthGuardProps = {
  mode: AuthGuardMode;
  children: React.ReactNode;
};

function redirectTarget(mode: AuthGuardMode, session: WalletSession): string | null {
  if (!session.connected) return "/connect-wallet";
  if (mode === "onboarded" && !session.onboarded) return "/onboarding";
  if (mode === "connect" && session.onboarded) return "/dashboard";
  return null;
}

/**
 * Client-side route guard. The session lives in localStorage, which the
 * server cannot see, so the guard renders a placeholder until the session
 * has been read on the client, then either redirects or reveals children.
 * The placeholder is what the server renders too, so hydration always
 * matches.
 */
export function AuthGuard({ mode, children }: AuthGuardProps) {
  const router = useRouter();
  const { session, ready } = useWalletSession();
  const target = ready ? redirectTarget(mode, session) : null;

  useEffect(() => {
    if (target) router.replace(target);
  }, [router, target]);

  if (!ready || target) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center text-text-muted"
      >
        <Loader2 size={24} className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  return <>{children}</>;
}
