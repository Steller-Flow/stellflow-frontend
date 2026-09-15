"use client";

import { useEffect, useState } from "react";

const WALLET_CONNECTED_KEY = "stellflow_wallet_connected";
const WALLET_ADDRESS_KEY = "stellflow_wallet_address";
const WALLET_NETWORK_KEY = "stellflow_wallet_network";
const WALLET_BALANCE_KEY = "stellflow_wallet_balance";
const ONBOARDED_KEY = "stellflow_onboarded";
const SESSION_EVENT = "stellflow-session-change";

export type WalletSession = {
  connected: boolean;
  onboarded: boolean;
  address: string | null;
  network: string | null;
  balance: string | null;
};

export const EMPTY_SESSION: WalletSession = {
  connected: false,
  onboarded: false,
  address: null,
  network: null,
  balance: null,
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getWalletSession(): WalletSession {
  if (!canUseStorage()) {
    return EMPTY_SESSION;
  }

  return {
    connected: window.localStorage.getItem(WALLET_CONNECTED_KEY) === "true",
    onboarded: window.localStorage.getItem(ONBOARDED_KEY) === "true",
    address: window.localStorage.getItem(WALLET_ADDRESS_KEY),
    network: window.localStorage.getItem(WALLET_NETWORK_KEY),
    balance: window.localStorage.getItem(WALLET_BALANCE_KEY),
  };
}

export function connectWallet(address: string, network?: string, balance?: string) {
  if (!canUseStorage()) return;
  if (!address) return;

  window.localStorage.setItem(WALLET_CONNECTED_KEY, "true");
  window.localStorage.setItem(WALLET_ADDRESS_KEY, address);
  if (network) {
    window.localStorage.setItem(WALLET_NETWORK_KEY, network);
  }
  if (balance !== undefined) {
    window.localStorage.setItem(WALLET_BALANCE_KEY, balance);
  }
  notifySessionChange();
}

export function updateWalletBalance(balance: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(WALLET_BALANCE_KEY, balance);
  notifySessionChange();
}

export function completeOnboarding() {
  if (!canUseStorage()) return;

  window.localStorage.setItem(ONBOARDED_KEY, "true");
  notifySessionChange();
}

export function logoutWallet() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(WALLET_CONNECTED_KEY);
  window.localStorage.removeItem(WALLET_ADDRESS_KEY);
  window.localStorage.removeItem(WALLET_NETWORK_KEY);
  window.localStorage.removeItem(WALLET_BALANCE_KEY);
  window.localStorage.removeItem(ONBOARDED_KEY);
  notifySessionChange();
}

export function onWalletSessionChange(callback: () => void) {
  if (!canUseStorage()) return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === WALLET_CONNECTED_KEY ||
      event.key === WALLET_ADDRESS_KEY ||
      event.key === WALLET_NETWORK_KEY ||
      event.key === WALLET_BALANCE_KEY ||
      event.key === ONBOARDED_KEY
    ) {
      callback();
    }
  };

  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export type WalletSessionState = {
  session: WalletSession;
  /**
   * false until the first client-side read of localStorage has happened.
   * On the server, and during hydration, it is always false, so a component
   * that renders on `session` must render the same "not yet known" output in
   * both places and only branch once `ready` is true.
   */
  ready: boolean;
};

/**
 * Subscribe a component to the wallet session without reading localStorage
 * during render. Reading it during render is a hydration mismatch waiting to
 * happen: the server has no localStorage, so it renders the logged-out tree,
 * and a browser that does have a session renders the logged-in tree on its
 * first pass — React then discards the server HTML and logs error #418.
 */
export function useWalletSession(): WalletSessionState {
  const [state, setState] = useState<WalletSessionState>({
    session: EMPTY_SESSION,
    ready: false,
  });

  useEffect(() => {
    const syncSession = () => setState({ session: getWalletSession(), ready: true });

    syncSession();
    return onWalletSessionChange(syncSession);
  }, []);

  return state;
}

export function shortenAddress(address: string | null) {
  if (!address) return "Wallet connected";
  if (address.length <= 14) return address;

  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}
