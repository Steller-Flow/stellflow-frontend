"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import {
  getWalletSession,
  onWalletSessionChange,
  updateWalletBalance,
  type WalletSession,
} from "../lib/walletSession";
import { getFreighterBalance, type FreighterWalletInfo } from "../lib/freighter";

type WalletInfoProps = {
  showBalance?: boolean;
  compact?: boolean;
};

export function WalletInfo({ showBalance = true, compact = false }: WalletInfoProps) {
  const [session, setSession] = useState<WalletSession>({
    connected: false,
    onboarded: false,
    address: null,
    network: null,
    balance: null,
  });
  const [walletInfo, setWalletInfo] = useState<FreighterWalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncSession = () => setSession(getWalletSession());
    syncSession();
    return onWalletSessionChange(syncSession);
  }, []);

  useEffect(() => {
    if (session.connected && session.address && showBalance) {
      refreshBalance();
    }
  }, [session.connected, session.address, showBalance]);

  const refreshBalance = async () => {
    if (!session.address) return;

    setLoading(true);
    setError(null);

    try {
      const info = await getFreighterBalance(session.address);
      setWalletInfo(info);
      updateWalletBalance(info.balanceUSD);
    } catch (err) {
      const freighterError = err as { message?: string };
      setError(freighterError.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  if (!session.connected) {
    return (
      <div className="flex items-center gap-sm text-text-muted">
        <WifiOff size={16} />
        <span className="text-sm">Not connected</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-md ${compact ? "" : "rounded-xl border border-border bg-card-bg p-md"}`}>
      <div className="flex items-center gap-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-status-success/10 text-status-success">
          <Wifi size={16} />
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted">Network</p>
          <p className="text-sm font-semibold text-text-primary">
            {session.network || "Testnet"}
          </p>
        </div>
      </div>

      {showBalance && (
        <div className="flex items-center gap-sm">
          <div>
            <p className="text-xs font-medium text-text-muted">Balance</p>
            <p className="text-sm font-semibold text-text-primary">
              {loading ? (
                <span className="inline-flex items-center gap-xs">
                  <RefreshCw size={12} className="animate-spin" />
                  Loading...
                </span>
              ) : error ? (
                <span className="text-status-error">{error}</span>
              ) : walletInfo ? (
                <>
                  {walletInfo.balance} {walletInfo.currency}
                  <span className="ml-xs text-text-muted">
                    (${walletInfo.balanceUSD} USDC)
                  </span>
                </>
              ) : (
                session.balance || "0.00"
              )}
            </p>
          </div>
          {!loading && (
            <button
              type="button"
              onClick={refreshBalance}
              className="rounded-full p-sm text-text-muted transition hover:bg-surface-container-low hover:text-primary"
              aria-label="Refresh balance"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
