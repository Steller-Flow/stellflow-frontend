"use client";

import { DollarSign, FileText, Info } from "lucide-react";

type EscrowAmountStepProps = {
  data: {
    title: string;
    description: string;
    totalAmount: number;
    currency: "USDC" | "XLM";
  };
  onUpdate: (data: { title?: string; description?: string; totalAmount?: number; currency?: "USDC" | "XLM" }) => void;
};

export function EscrowAmountStep({ data, onUpdate }: EscrowAmountStepProps) {
  return (
    <div className="space-y-lg">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Set Escrow Amount
        </h2>
        <p className="mt-xs text-text-secondary">
          Define the project details and total escrow amount.
        </p>
      </div>

      <div className="space-y-md">
        <label className="flex flex-col gap-xs">
          <span className="text-xs font-semibold uppercase text-text-primary">
            Project Title
          </span>
          <span className="relative">
            <span className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
              <FileText size={18} />
            </span>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
              placeholder="E-Commerce Platform Development"
            />
          </span>
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-xs font-semibold uppercase text-text-primary">
            Project Description
          </span>
          <textarea
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="brand-field min-h-[100px] w-full rounded-lg border border-border bg-white px-md py-sm text-text-primary transition"
            placeholder="Describe the project scope and deliverables..."
          />
        </label>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="text-xs font-semibold uppercase text-text-primary">
              Total Amount
            </span>
            <span className="relative">
              <span className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                <DollarSign size={18} />
              </span>
              <input
                type="number"
                value={data.totalAmount || ""}
                onChange={(e) => onUpdate({ totalAmount: parseFloat(e.target.value) || 0 })}
                className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </span>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-xs font-semibold uppercase text-text-primary">
              Currency
            </span>
            <select
              value={data.currency}
              onChange={(e) => onUpdate({ currency: e.target.value as "USDC" | "XLM" })}
              className="brand-field h-12 w-full appearance-none rounded-lg border border-border bg-white px-md text-text-primary transition"
            >
              <option value="USDC">USDC</option>
              <option value="XLM">XLM (Stellar)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-md rounded-lg border border-primary-light/30 bg-primary-tint/60 p-md">
        <Info className="mt-0.5 shrink-0 text-primary" size={20} />
        <p className="text-sm text-on-primary-container">
          Funds will be held in escrow until milestones are approved. You can release
          funds incrementally as work is completed.
        </p>
      </div>
    </div>
  );
}
