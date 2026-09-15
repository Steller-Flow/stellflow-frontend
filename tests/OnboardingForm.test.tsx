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

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), prefetch: vi.fn() }),
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

describe("OnboardingForm final step", () => {
  it("completes onboarding and navigates to /dashboard through the Next router", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const { completeOnboarding } = await import("../app/lib/walletSession");
    const user = userEvent.setup();
    mockPush.mockClear();
    render(<OnboardingForm />);

    // Step 1: wallet (pre-filled from session)
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2: profile
    await user.type(screen.getByPlaceholderText(/legal name/i), "Test User");
    await user.type(screen.getByPlaceholderText(/name@company/i), "test@example.com");
    const country = screen.getByRole("combobox");
    await user.selectOptions(country, (country as HTMLSelectElement).options[1].value);
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3: role + workspace
    await user.click(screen.getAllByRole("radio")[0]);
    await user.type(screen.getByPlaceholderText(/freelance business/i), "Test Workspace");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 4: review
    expect(screen.getByText("Step 4 of 4")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /go to dashboard/i }));

    expect(completeOnboarding).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
