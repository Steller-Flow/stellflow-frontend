import { vi } from "vitest";

export function mockFreighter() {
  return {
    checkFreighterInstalled: vi.fn().mockResolvedValue(true),
    connectFreighter: vi.fn().mockResolvedValue({
      address: "GBXGHABC123DEF456GHIJKL789MNO",
      network: "TESTNET",
    }),
    getPublicKey: vi.fn().mockResolvedValue("GBXGHABC123DEF456GHIJKL789MNO"),
    signTransaction: vi.fn().mockResolvedValue("signed-tx-xdr"),
    isInstalled: vi.fn().mockResolvedValue(true),
  };
}

export function mockStellarSdk() {
  return {
    Server: vi.fn().mockImplementation(() => ({
      transactions: vi.fn().mockReturnThis(),
      payments: vi.fn().mockReturnThis(),
      forAccount: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      call: vi.fn().mockResolvedValue({ records: [] }),
    })),
    Keypair: {
      fromPublicKey: vi.fn().mockReturnValue({
        accountId: "GBXGHABC123DEF456GHIJKL789MNO",
      }),
    },
    Horizon: {
      Server: vi.fn().mockImplementation(() => ({
        transactions: vi.fn().mockReturnThis(),
        payments: vi.fn().mockReturnThis(),
        forAccount: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        call: vi.fn().mockResolvedValue({ records: [] }),
      })),
    },
  };
}

export function setupWalletSession(overrides?: {
  connected?: boolean;
  onboarded?: boolean;
  address?: string | null;
}) {
  const defaults = {
    connected: true,
    onboarded: true,
    address: "GBXGHABC123DEF456GHIJKL789MNO",
  };
  const values = { ...defaults, ...overrides };

  if (values.connected) {
    localStorage.setItem("stellflow_wallet_connected", "true");
  }
  if (values.onboarded) {
    localStorage.setItem("stellflow_onboarded", "true");
  }
  if (values.address) {
    localStorage.setItem("stellflow_wallet_address", values.address);
  }
}

export function clearWalletSession() {
  localStorage.removeItem("stellflow_wallet_connected");
  localStorage.removeItem("stellflow_wallet_address");
  localStorage.removeItem("stellflow_wallet_network");
  localStorage.removeItem("stellflow_wallet_balance");
  localStorage.removeItem("stellflow_onboarded");
}
