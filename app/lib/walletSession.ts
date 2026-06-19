"use client";

const WALLET_CONNECTED_KEY = "stellflow_wallet_connected";
const WALLET_ADDRESS_KEY = "stellflow_wallet_address";
const ONBOARDED_KEY = "stellflow_onboarded";
const SESSION_EVENT = "stellflow-session-change";

export type WalletSession = {
  connected: boolean;
  onboarded: boolean;
  address: string | null;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getWalletSession(): WalletSession {
  if (!canUseStorage()) {
    return { connected: false, onboarded: false, address: null };
  }

  return {
    connected: window.localStorage.getItem(WALLET_CONNECTED_KEY) === "true",
    onboarded: window.localStorage.getItem(ONBOARDED_KEY) === "true",
    address: window.localStorage.getItem(WALLET_ADDRESS_KEY),
  };
}

export function connectWallet(address: string) {
  if (!canUseStorage()) return;
  if (!address) return;

  window.localStorage.setItem(WALLET_CONNECTED_KEY, "true");
  window.localStorage.setItem(WALLET_ADDRESS_KEY, address);
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
  window.localStorage.removeItem(ONBOARDED_KEY);
  notifySessionChange();
}

export function onWalletSessionChange(callback: () => void) {
  if (!canUseStorage()) return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === WALLET_CONNECTED_KEY ||
      event.key === WALLET_ADDRESS_KEY ||
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

export function shortenAddress(address: string | null) {
  if (!address) return "Wallet connected";
  if (address.length <= 14) return address;

  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}
