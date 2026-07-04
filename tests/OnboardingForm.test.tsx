import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OnboardingForm } from "../app/components/OnboardingForm";

describe("OnboardingForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the first step", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("Tell Us About Yourself")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your legal name")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
    });
  });

  it("advances to step 2 with valid inputs", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);

    await user.type(screen.getByPlaceholderText("Enter your legal name"), "John Doe");
    await user.type(screen.getByPlaceholderText("name@company.com"), "john@example.com");
    await user.selectOptions(screen.getByDisplayValue("Select country"), "US");
    await user.selectOptions(screen.getByDisplayValue("Select role"), "freelancer");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Set Up Your Workspace")).toBeInTheDocument();
    });
  });

  it("shows back button on step 2", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);

    await user.type(screen.getByPlaceholderText("Enter your legal name"), "John Doe");
    await user.type(screen.getByPlaceholderText("name@company.com"), "john@example.com");
    await user.selectOptions(screen.getByDisplayValue("Select country"), "US");
    await user.selectOptions(screen.getByDisplayValue("Select role"), "freelancer");
    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Set Up Your Workspace")).toBeInTheDocument();
      expect(screen.getByText("Back")).toBeInTheDocument();
    });
  });

  it("navigates back to step 1 when back is clicked", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);

    await user.type(screen.getByPlaceholderText("Enter your legal name"), "John Doe");
    await user.type(screen.getByPlaceholderText("name@company.com"), "john@example.com");
    await user.selectOptions(screen.getByDisplayValue("Select country"), "US");
    await user.selectOptions(screen.getByDisplayValue("Select role"), "freelancer");
    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Set Up Your Workspace")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Back"));

    await waitFor(() => {
      expect(screen.getByText("Tell Us About Yourself")).toBeInTheDocument();
    });
  });

  it("renders step progress indicator", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });
});
