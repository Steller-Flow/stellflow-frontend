import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getWalletSession,
  connectWallet,
  completeOnboarding,
  logoutWallet,
  shortenAddress,
} from "../app/lib/walletSession";

const WALLET_CONNECTED_KEY = "stellflow_wallet_connected";
const WALLET_ADDRESS_KEY = "stellflow_wallet_address";
const ONBOARDED_KEY = "stellflow_onboarded";

describe("walletSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getWalletSession", () => {
    it("returns default session when nothing is stored", () => {
      const session = getWalletSession();
      expect(session).toEqual({
        connected: false,
        onboarded: false,
        address: null,
        balance: null,
        network: null,
      });
    });

    it("returns stored session values", () => {
      localStorage.setItem(WALLET_CONNECTED_KEY, "true");
      localStorage.setItem(ONBOARDED_KEY, "true");
      localStorage.setItem(WALLET_ADDRESS_KEY, "GBXGH...TEST");

      const session = getWalletSession();
      expect(session.connected).toBe(true);
      expect(session.onboarded).toBe(true);
      expect(session.address).toBe("GBXGH...TEST");
    });
  });

  describe("connectWallet", () => {
    it("stores wallet connection details", () => {
      connectWallet("GBXGHABC123DEF456");

      const session = getWalletSession();
      expect(session.connected).toBe(true);
      expect(session.address).toBe("GBXGHABC123DEF456");
    });

    it("does not store empty address", () => {
      connectWallet("");

      const session = getWalletSession();
      expect(session.connected).toBe(false);
      expect(session.address).toBeNull();
    });

    it("dispatches session change event", () => {
      const handler = vi.fn();
      window.addEventListener("stellflow-session-change", handler);

      connectWallet("GBXGHABC123DEF456");

      expect(handler).toHaveBeenCalled();
      window.removeEventListener("stellflow-session-change", handler);
    });
  });

  describe("completeOnboarding", () => {
    it("marks onboarding as complete", () => {
      connectWallet("GBXGHABC123DEF456");
      completeOnboarding();

      const session = getWalletSession();
      expect(session.onboarded).toBe(true);
      expect(session.connected).toBe(true);
    });
  });

  describe("logoutWallet", () => {
    it("clears all session data", () => {
      connectWallet("GBXGHABC123DEF456");
      completeOnboarding();
      logoutWallet();

      const session = getWalletSession();
      expect(session).toEqual({
        connected: false,
        onboarded: false,
        address: null,
        balance: null,
        network: null,
      });
    });
  });

  describe("shortenAddress", () => {
    it("returns fallback for null address", () => {
      expect(shortenAddress(null)).toBe("Wallet connected");
    });

    it("returns full address if short enough", () => {
      expect(shortenAddress("GBXGH")).toBe("GBXGH");
    });

    it("shortens long addresses", () => {
      const address = "GBXGHABC123DEF456GHIJKL789MNO";
      const result = shortenAddress(address);
      expect(result).toBe("GBXGHA...789MNO");
    });
  });
});
