/**
 * NEXT_PUBLIC_DEMO_MODE gates the in-memory fixtures and the "Sample data"
 * banner. The flag is read at module load, so each case stubs the env and
 * re-imports the modules.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

async function loadWithDemoMode(value: string | undefined) {
  vi.resetModules();
  if (value === undefined) vi.unstubAllEnvs();
  else vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", value);
  const [{ DEMO_MODE }, { useInvoiceStore }, { useEscrowStore }, { SampleDataBanner }] = await Promise.all([
    import("../app/lib/demo"),
    import("../app/lib/invoiceStore"),
    import("../app/lib/escrowStore"),
    import("../app/components/SampleDataBanner"),
  ]);
  return { DEMO_MODE, useInvoiceStore, useEscrowStore, SampleDataBanner };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("demo mode", () => {
  it("is on by default: fixtures are loaded and the banner is shown", async () => {
    const { DEMO_MODE, useInvoiceStore, useEscrowStore, SampleDataBanner } = await loadWithDemoMode(undefined);

    expect(DEMO_MODE).toBe(true);
    expect(useInvoiceStore.getState().invoices.length).toBeGreaterThan(0);
    expect(useEscrowStore.getState().escrows.length).toBeGreaterThan(0);

    render(<SampleDataBanner />);
    const banner = screen.getByTestId("sample-data-banner");
    expect(banner).toHaveTextContent(/sample data/i);
    expect(banner).toHaveTextContent(/not records of real payments/i);
    expect(banner.querySelector("button")).toBeNull(); // not dismissible
  });

  it('NEXT_PUBLIC_DEMO_MODE="false": stores start empty and there is no banner', async () => {
    const { DEMO_MODE, useInvoiceStore, useEscrowStore, SampleDataBanner } = await loadWithDemoMode("false");

    expect(DEMO_MODE).toBe(false);
    expect(useInvoiceStore.getState().invoices).toEqual([]);
    expect(useInvoiceStore.getState().pagination.total).toBe(0);
    expect(useEscrowStore.getState().escrows).toEqual([]);

    render(<SampleDataBanner />);
    expect(screen.queryByTestId("sample-data-banner")).toBeNull();
  });

  it("any value other than the string \"false\" keeps demo mode on", async () => {
    const { DEMO_MODE } = await loadWithDemoMode("0");
    expect(DEMO_MODE).toBe(true);
  });
});
