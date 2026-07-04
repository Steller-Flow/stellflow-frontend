"use client";

import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";

type EscrowConfirmationStepProps = {
  status: "idle" | "signing" | "pending" | "success" | "error";
  txHash: string | null;
  error: string | null;
  escrowTitle: string;
};

export function EscrowConfirmationStep({
  status,
  txHash,
  error,
  escrowTitle,
}: EscrowConfirmationStepProps) {
  return (
    <div className="space-y-lg py-lg text-center">
      {status === "signing" && (
        <>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint">
                <Loader2 size={40} className="animate-spin text-primary" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Signing Transaction
            </h2>
            <p className="mt-xs text-text-secondary">
              Please confirm the transaction in your wallet...
            </p>
          </div>
        </>
      )}

      {status === "pending" && (
        <>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-status-info/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-status-info/10">
                <Loader2 size={40} className="animate-spin text-status-info" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Confirming on Chain
            </h2>
            <p className="mt-xs text-text-secondary">
              Your transaction is being processed on the Stellar network...
            </p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-status-success/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-status-success/10">
                <CheckCircle2 size={40} className="text-status-success" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Escrow Created Successfully
            </h2>
            <p className="mt-xs text-text-secondary">
              &quot;{escrowTitle}&quot; has been funded and is now active.
            </p>
          </div>
          {txHash && (
            <div className="mx-auto max-w-sm rounded-lg bg-surface-container-low p-md">
              <p className="mb-xs text-xs font-semibold uppercase text-text-muted">
                Transaction Hash
              </p>
              <div className="flex items-center justify-center gap-sm">
                <p className="font-mono text-xs text-text-primary">
                  {txHash.slice(0, 12)}...{txHash.slice(-12)}
                </p>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-status-error/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-status-error/10">
                <XCircle size={40} className="text-status-error" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Transaction Failed
            </h2>
            <p className="mt-xs text-text-secondary">
              {error || "Something went wrong. Please try again."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
