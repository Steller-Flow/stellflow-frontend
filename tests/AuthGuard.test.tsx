import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGuard } from "../app/components/AuthGuard";
import {
  connectWallet,
  completeOnboarding,
  logoutWallet,
} from "../app/lib/walletSession";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockPush,
  }),
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it("renders children when wallet is connected and mode is connect", () => {
    connectWallet("GBXGHABC123DEF456");

    render(
      <AuthGuard mode="connect">
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to connect-wallet when wallet is not connected", () => {
    render(
      <AuthGuard mode="connect">
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith("/connect-wallet");
  });

  it("redirects to onboarding when mode is onboarded but not onboarded", () => {
    connectWallet("GBXGHABC123DEF456");

    render(
      <AuthGuard mode="onboarded">
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith("/onboarding");
  });

  it("renders children when onboarded and mode is onboarded", () => {
    connectWallet("GBXGHABC123DEF456");
    completeOnboarding();

    render(
      <AuthGuard mode="onboarded">
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
