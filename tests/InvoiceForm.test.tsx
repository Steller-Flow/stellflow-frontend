import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvoiceForm } from "../app/components/InvoiceForm";

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

describe("InvoiceForm", () => {
  beforeEach(() => {
    localStorage.clear();
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it("renders the first step with client details form", () => {
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText("Client Details")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Acme Corporation")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("billing@acme.com")).toBeInTheDocument();
  });

  it("shows step progress indicator", () => {
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Client name is required")).toBeInTheDocument();
    });
  });

  it("advances to step 2 with valid inputs", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
    });
  });

  it("shows back button on step 2", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
      expect(screen.getByText("Back")).toBeInTheDocument();
    });
  });

  it("navigates back to step 1 when back is clicked", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Back"));

    await waitFor(() => {
      expect(screen.getByText("Client Details")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel button is clicked on step 1", () => {
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("renders line items form on step 2", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
      expect(screen.getByText("Add Line Item")).toBeInTheDocument();
      expect(screen.getByText("Summary")).toBeInTheDocument();
    });
  });

  it("allows adding a new line item", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Line Item"));

    const descriptions = screen.getAllByPlaceholderText("Service or product");
    expect(descriptions.length).toBe(2);
  });

  it("displays currency symbols correctly", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
    });

    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("renders review step on step 3", async () => {
    const user = userEvent.setup();
    render(<InvoiceForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText("Acme Corporation"), "Acme Corp");
    await user.type(screen.getByPlaceholderText("billing@acme.com"), "billing@acme.com");
    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Line Items")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Review & Submit")).toBeInTheDocument();
      expect(screen.getByText("Client Information")).toBeInTheDocument();
      expect(screen.getByText("Create Invoice")).toBeInTheDocument();
    });
  });
});
