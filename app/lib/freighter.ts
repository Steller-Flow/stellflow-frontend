"use client";

import {
  isConnected,
  requestAccess,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";
import { Horizon } from "stellar-sdk";

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
  const err = error as { code?: string; message?: string; detail?: string };

  if (err?.code === "NOT_FOUND" || err?.message?.includes("not installed")) {
    return {
      code: "WALLET_NOT_INSTALLED",
      message: "Freighter wallet is not installed",
      detail: "Please install the Freighter browser extension to continue.",
    };
  }

  if (err?.code === "USER_REJECTED" || err?.message?.includes("rejected")) {
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
    const response = await requestAccess();
    if ("address" in response) {
      const networkInfo = await getNetwork();
      return {
        address: response.address,
        network: networkInfo.network,
        networkPassphrase: networkInfo.networkPassphrase,
      };
    }
    throw mapFreighterError({ code: "UNKNOWN_ERROR", message: "Invalid response from Freighter" });
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
