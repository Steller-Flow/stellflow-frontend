"use client";

import { User, Wallet } from "lucide-react";

type EscrowFreelancerStepProps = {
  data: {
    freelancerAddress: string;
    freelancerName: string;
  };
  onUpdate: (data: { freelancerAddress?: string; freelancerName?: string }) => void;
};

export function EscrowFreelancerStep({ data, onUpdate }: EscrowFreelancerStepProps) {
  return (
    <div className="space-y-lg">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Select Freelancer
        </h2>
        <p className="mt-xs text-text-secondary">
          Enter the Stellar address and name of the freelancer you want to work with.
        </p>
      </div>

      <div className="space-y-md">
        <label className="flex flex-col gap-xs">
          <span className="text-xs font-semibold uppercase text-text-primary">
            Freelancer Name
          </span>
          <span className="relative">
            <span className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
              <User size={18} />
            </span>
            <input
              type="text"
              value={data.freelancerName}
              onChange={(e) => onUpdate({ freelancerName: e.target.value })}
              className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
              placeholder="John Developer"
            />
          </span>
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-xs font-semibold uppercase text-text-primary">
            Stellar Address
          </span>
          <span className="relative">
            <span className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
              <Wallet size={18} />
            </span>
            <input
              type="text"
              value={data.freelancerAddress}
              onChange={(e) => onUpdate({ freelancerAddress: e.target.value })}
              className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md font-mono text-sm text-text-primary transition"
              placeholder="G..."
              maxLength={56}
            />
          </span>
          <span className="text-xs text-text-muted">
            56-character Stellar public key starting with G
          </span>
        </label>
      </div>

      <div className="rounded-lg bg-primary-tint/50 p-md">
        <p className="text-sm text-primary">
          The freelancer will receive a notification to review and accept the escrow terms.
        </p>
      </div>
    </div>
  );
}
