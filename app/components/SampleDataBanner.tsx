"use client";

import { FlaskConical } from "lucide-react";
import { DEMO_MODE } from "../lib/demo";

/**
 * Shown on every dashboard page while demo mode is on. Deliberately not
 * dismissible: the sample rows look exactly like real ones, and the point is
 * that a reviewer can never scroll past the warning.
 */
export function SampleDataBanner() {
  if (!DEMO_MODE) return null;

  return (
    <div
      role="note"
      data-testid="sample-data-banner"
      className="mb-lg flex items-start gap-md rounded-xl border border-status-warning/40 bg-status-warning/10 p-md text-sm text-text-primary"
    >
      <FlaskConical size={20} className="mt-0.5 shrink-0 text-status-warning" aria-hidden="true" />
      <p>
        <span className="font-semibold">Sample data.</span> The invoices, escrows, analytics and
        notifications in this workspace are demo fixtures held in your browser — they are not
        records of real payments and nothing here has touched the Stellar network. The only live
        data is the escrow-contract panel. Set{" "}
        <code className="rounded bg-surface-container-low px-xs font-mono text-xs">
          NEXT_PUBLIC_DEMO_MODE=false
        </code>{" "}
        to start empty.
      </p>
    </div>
  );
}

/** Inline "sample" marker for counts and headings next to fixture rows. */
export function SampleTag() {
  return (
    <span className="ml-sm inline-flex items-center rounded-full border border-status-warning/40 bg-status-warning/10 px-sm py-0.5 text-xs font-semibold uppercase text-status-warning">
      sample data
    </span>
  );
}
