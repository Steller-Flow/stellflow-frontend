/**
 * @stellar/freighter-api v6 never rejects: every call resolves an object that
 * carries an optional `error`. On "User declined access" requestAccess()
 * resolves `{ address: "", error }`. Before the fix connectFreighter() treated
 * that as success, WalletModal then called connectWallet("") (a no-op) and
 * navigated to /onboarding, whose guard bounced the user straight back to
 * /connect-wallet with no message.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const freighter = vi.hoisted(() => ({
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getNetwork: vi.fn(),
  signTransaction: vi.fn(),
}));

vi.mock("@stellar/freighter-api", () => freighter);

const { connectFreighter, checkFreighterInstalled } = await import("../app/lib/freighter");

const ADDRESS = "GBXGHABC123DEF456GHIJKL789MNOPQRSTUVWXYZ1234567890ABCDEFGH";
const TESTNET = { network: "TESTNET", networkPassphrase: "Test SDF Network ; September 2015" };

describe("connectFreighter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    freighter.isConnected.mockResolvedValue({ isConnected: true });
    freighter.getNetwork.mockResolvedValue(TESTNET);
  });

  it("returns address and network when the user approves", async () => {
    freighter.requestAccess.mockResolvedValue({ address: ADDRESS });

    await expect(connectFreighter()).resolves.toEqual({
      address: ADDRESS,
      network: "TESTNET",
      networkPassphrase: TESTNET.networkPassphrase,
    });
  });

  it("rejects with CONNECTION_REJECTED when the user declines in the Freighter popup", async () => {
    freighter.requestAccess.mockResolvedValue({
      address: "",
      error: { code: -3, message: "User declined access" },
    });

    await expect(connectFreighter()).rejects.toMatchObject({ code: "CONNECTION_REJECTED" });
  });

  it("rejects when Freighter resolves an empty address with no error", async () => {
    freighter.requestAccess.mockResolvedValue({ address: "" });

    await expect(connectFreighter()).rejects.toMatchObject({ code: expect.any(String) });
  });

  it("rejects when Freighter reports an error while reading the network", async () => {
    freighter.requestAccess.mockResolvedValue({ address: ADDRESS });
    freighter.getNetwork.mockResolvedValue({
      network: "",
      networkPassphrase: "",
      error: { code: -1, message: "The wallet encountered an internal error." },
    });

    await expect(connectFreighter()).rejects.toMatchObject({ code: expect.any(String) });
  });

  it("rejects with WALLET_NOT_INSTALLED when the extension is absent", async () => {
    freighter.isConnected.mockResolvedValue({ isConnected: false });

    await expect(connectFreighter()).rejects.toMatchObject({ code: "WALLET_NOT_INSTALLED" });
    expect(freighter.requestAccess).not.toHaveBeenCalled();
  });
});

describe("checkFreighterInstalled", () => {
  it("handles the v6 object shape", async () => {
    freighter.isConnected.mockResolvedValue({ isConnected: true });
    await expect(checkFreighterInstalled()).resolves.toBe(true);
    freighter.isConnected.mockResolvedValue({ isConnected: false });
    await expect(checkFreighterInstalled()).resolves.toBe(false);
  });

  it("returns false when isConnected itself fails", async () => {
    freighter.isConnected.mockRejectedValue(new Error("boom"));
    await expect(checkFreighterInstalled()).resolves.toBe(false);
  });
});
