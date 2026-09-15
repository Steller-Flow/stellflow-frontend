"use client";

import {
  isConnected,
  requestAccess,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";
import { Horizon } from "@stellar/stellar-sdk";

export type FreighterWalletInfo = {
  address: string;
  network: string;
  networkPassphrase: string;
  balance: string;
  balanceUSD: string;
  currency: string;
};

export type FreighterError = {
  code: string;
  message: string;
  detail?: string;
};

const HORIZON_URLS: Record<string, string> = {
  PUBLIC: "https://horizon.stellar.org",
  TESTNET: "https://horizon-testnet.stellar.org",
};

function getHorizonUrl(network: string): string {
  return HORIZON_URLS[network] || HORIZON_URLS.TESTNET;
}

function mapFreighterError(error: unknown): FreighterError {
  const err = error as { code?: string | number; message?: string; detail?: string };

  if (err?.code === "NOT_FOUND" || err?.message?.includes("not installed")) {
    return {
      code: "WALLET_NOT_INSTALLED",
      message: "Freighter wallet is not installed",
      detail: "Please install the Freighter browser extension to continue.",
    };
  }

  if (
    err?.code === "USER_REJECTED" ||
    /rejected|declined|denied|not allowed/i.test(err?.message ?? "")
  ) {
    return {
      code: "CONNECTION_REJECTED",
      message: "Connection request was rejected",
      detail: "You declined the wallet connection request. Please try again.",
    };
  }

  if (err?.code === "NETWORK_ERROR" || err?.message?.includes("network")) {
    return {
      code: "NETWORK_ERROR",
      message: "Network connection error",
      detail: "Unable to connect to the Stellar network. Please check your connection.",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: err?.message || "An unexpected error occurred",
    detail: err?.detail,
  };
}

/**
 * @stellar/freighter-api v6 never rejects. Every call resolves an object with
 * an optional `error`; on failure the data fields are empty strings. Turn
 * that shape back into a thrown FreighterError so callers can't mistake an
 * empty address for a connected wallet.
 */
function unwrap<T extends { error?: { code?: number; message?: string } }>(
  response: T,
  isEmpty: (response: T) => boolean,
  emptyMessage: string
): T {
  if (response.error) {
    throw mapFreighterError(response.error);
  }
  if (isEmpty(response)) {
    throw mapFreighterError({ code: "UNKNOWN_ERROR", message: emptyMessage });
  }
  return response;
}

export async function checkFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return typeof result === "boolean" ? result : result.isConnected === true;
  } catch {
    return false;
  }
}

export async function connectFreighter(): Promise<{
  address: string;
  network: string;
  networkPassphrase: string;
}> {
  const installed = await checkFreighterInstalled();
  if (!installed) {
    throw mapFreighterError({ code: "NOT_FOUND", message: "not installed" });
  }

  try {
    const { address } = unwrap(
      await requestAccess(),
      (r) => !r.address,
      "Freighter did not return an address"
    );
    const networkInfo = unwrap(
      await getNetwork(),
      (r) => !r.network || !r.networkPassphrase,
      "Freighter did not return a network"
    );
    return {
      address,
      network: networkInfo.network,
      networkPassphrase: networkInfo.networkPassphrase,
    };
  } catch (error) {
    if ((error as FreighterError).code) {
      throw error;
    }
    throw mapFreighterError(error);
  }
}

export async function getFreighterBalance(address: string): Promise<FreighterWalletInfo> {
  const installed = await checkFreighterInstalled();
  if (!installed) {
    throw mapFreighterError({ code: "NOT_FOUND", message: "not installed" });
  }

  try {
    const networkInfo = await getNetwork();
    const server = new Horizon.Server(getHorizonUrl(networkInfo.network));

    const account = await server.loadAccount(address);
    const balance = account.balances.find(
      (b) => b.asset_type === "native"
    );

    const nativeBalance = balance
      ? (parseFloat(balance.balance) / 10_000_000).toFixed(7)
      : "0.0000000";

    const usdcBalance = account.balances.find(
      (b) => "asset_code" in b && b.asset_code === "USDC" && "asset_issuer" in b && b.asset_issuer === "GA5ZSEJYB37JDD5GUPFYU6T6VXGVZHB5OGW2IVY36ROC4HX7JYB6O2U4"
    );

    const usdcAmount = usdcBalance && "balance" in usdcBalance ? parseFloat(usdcBalance.balance).toFixed(2) : "0.00";

    return {
      address,
      network: networkInfo.network,
      networkPassphrase: networkInfo.networkPassphrase,
      balance: nativeBalance,
      balanceUSD: usdcAmount,
      currency: networkInfo.network === "PUBLIC" ? "XLM" : "Test XLM",
    };
  } catch (error) {
    if ((error as FreighterError).code) {
      throw error;
    }
    throw mapFreighterError(error);
  }
}

export async function signFreighterTransaction(
  txXdr: string,
  networkPassphrase?: string
): Promise<string> {
  const installed = await checkFreighterInstalled();
  if (!installed) {
    throw mapFreighterError({ code: "NOT_FOUND", message: "not installed" });
  }

  try {
    const network = await getNetwork();
    const passphrase = networkPassphrase || network.networkPassphrase;
    const result = await signTransaction(txXdr, {
      networkPassphrase: passphrase,
    });
    return typeof result === "string" ? result : result.signedTxXdr;
  } catch (error) {
    if ((error as FreighterError).code) {
      throw error;
    }
    throw mapFreighterError(error);
  }
}

export async function getCurrentFreighterAddress(): Promise<string | null> {
  try {
    const installed = await checkFreighterInstalled();
    if (!installed) return null;

    const response = await requestAccess();
    if ("address" in response) {
      return response.address;
    }
    return null;
  } catch {
    return null;
  }
}
