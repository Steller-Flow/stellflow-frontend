import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingNav } from "../app/components/LandingNav";

describe("LandingNav", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders brand name", () => {
    render(<LandingNav />);
    expect(screen.getByText("StellFlow")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<LandingNav />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Use Cases")).toBeInTheDocument();
  });

  it("renders connect wallet button", () => {
    render(<LandingNav />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });

  it("renders sign in link when not connected", () => {
    render(<LandingNav />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});
