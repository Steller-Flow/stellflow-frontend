import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WalletModal } from "../app/components/WalletModal";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("WalletModal", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it("renders connect wallet button", () => {
    render(<WalletModal />);
    expect(screen.getAllByText("Connect Wallet").length).toBeGreaterThanOrEqual(1);
  });

  it("opens modal when button is clicked", () => {
    render(<WalletModal />);
    const buttons = screen.getAllByText("Connect Wallet");
    fireEvent.click(buttons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Select your preferred Stellar gateway")).toBeInTheDocument();
  });

  it("displays wallet options", () => {
    render(<WalletModal />);
    const buttons = screen.getAllByText("Connect Wallet");
    fireEvent.click(buttons[0]);

    expect(screen.getByText("Freighter")).toBeInTheDocument();
    expect(screen.getByText("Albedo")).toBeInTheDocument();
    expect(screen.getByText("WalletConnect")).toBeInTheDocument();
  });

  it("closes modal on escape key", () => {
    render(<WalletModal />);
    const buttons = screen.getAllByText("Connect Wallet");
    fireEvent.click(buttons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes modal when clicking backdrop", () => {
    render(<WalletModal />);
    const buttons = screen.getAllByText("Connect Wallet");
    fireEvent.click(buttons[0]);

    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.mouseDown(backdrop);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
