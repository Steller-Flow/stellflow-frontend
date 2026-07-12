import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../app/lib/walletSession", () => ({
  getWalletSession: () => ({
    connected: true,
    onboarded: false,
    address: "GBXGHABC123DEF456GHIJKL789MNO",
    balance: null,
    network: "testnet",
  }),
  onWalletSessionChange: () => () => {},
  completeOnboarding: vi.fn(),
  shortenAddress: (addr: string | null) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Wallet connected",
}));

const { OnboardingForm } = await import("../app/components/OnboardingForm");

describe("OnboardingForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the wallet step when wallet is connected", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("Wallet Connected")).toBeInTheDocument();
  });

  it("renders step progress indicator", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
  });
});
