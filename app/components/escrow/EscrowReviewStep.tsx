"use client";

import { Calendar, Check, DollarSign, FileText, User, Wallet } from "lucide-react";

type ReviewData = {
  freelancerAddress: string;
  freelancerName: string;
  title: string;
  description: string;
  totalAmount: number;
  currency: "USDC" | "XLM";
  milestones: Array<{
    title: string;
    description: string;
    amount: number;
    dueDate?: string;
  }>;
};

type EscrowReviewStepProps = {
  data: ReviewData;
};

export function EscrowReviewStep({ data }: EscrowReviewStepProps) {
  return (
    <div className="space-y-lg">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Review Escrow Details
        </h2>
        <p className="mt-xs text-text-secondary">
          Please review all details before signing and funding the escrow.
        </p>
      </div>

      {/* Freelancer Info */}
      <div className="rounded-lg border border-divider bg-surface-container-low p-md">
        <div className="mb-sm flex items-center gap-sm text-xs font-semibold uppercase text-text-muted">
          <User size={14} />
          Freelancer
        </div>
        <div className="flex items-center gap-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-secondary">
            <User size={20} />
          </div>
          <div>
            <p className="font-semibold text-text-primary">{data.freelancerName}</p>
            <p className="font-mono text-xs text-text-muted">
              {data.freelancerAddress.slice(0, 8)}...{data.freelancerAddress.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="rounded-lg border border-divider bg-surface-container-low p-md">
        <div className="mb-sm flex items-center gap-sm text-xs font-semibold uppercase text-text-muted">
          <FileText size={14} />
          Project
        </div>
        <h3 className="font-semibold text-text-primary">{data.title}</h3>
        <p className="mt-xs text-sm text-text-secondary">{data.description}</p>
      </div>

      {/* Amount */}
      <div className="rounded-lg border border-divider bg-surface-container-low p-md">
        <div className="mb-sm flex items-center gap-sm text-xs font-semibold uppercase text-text-muted">
          <DollarSign size={14} />
          Escrow Amount
        </div>
        <div className="flex items-baseline gap-sm">
          <span className="font-display text-2xl font-bold text-primary">
            ${data.totalAmount.toFixed(2)}
          </span>
          <span className="text-sm text-text-muted">{data.currency}</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-lg border border-divider bg-surface-container-low p-md">
        <div className="mb-sm flex items-center gap-sm text-xs font-semibold uppercase text-text-muted">
          <Check size={14} />
          Milestones ({data.milestones.length})
        </div>
        <div className="space-y-sm">
          {data.milestones.map((milestone, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-white p-sm"
            >
              <div className="flex items-center gap-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-tint text-xs font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {milestone.title}
                  </p>
                  {milestone.dueDate && (
                    <p className="flex items-center gap-xs text-xs text-text-muted">
                      <Calendar size={10} />
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-text-primary">
                ${milestone.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-md rounded-lg border border-status-warning/30 bg-status-warning/10 p-md">
        <Wallet className="mt-0.5 shrink-0 text-status-warning" size={20} />
        <div>
          <p className="text-sm font-semibold text-status-warning">
            Transaction Required
          </p>
          <p className="mt-xs text-sm text-text-secondary">
            Click &quot;Sign & Fund Escrow&quot; to sign the transaction with your wallet and
            fund the escrow. This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
}
