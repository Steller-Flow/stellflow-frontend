"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import type { EscrowState } from "../lib/escrowTypes";
import { ESCROW_STATE_LABELS, ESCROW_STATE_FLOW } from "../lib/escrowTypes";

type EscrowStateDiagramProps = {
  currentState: EscrowState;
  showAlternative?: boolean;
};

export function EscrowStateDiagram({
  currentState,
  showAlternative = true,
}: EscrowStateDiagramProps) {
  const mainFlowStates = ESCROW_STATE_FLOW;
  const currentIndex = mainFlowStates.indexOf(currentState);

  const getStateStatus = (state: EscrowState, index: number) => {
    if (state === currentState) return "current";
    if (currentIndex >= 0 && index < currentIndex) return "completed";
    if (currentIndex >= 0 && index > currentIndex) return "upcoming";
    return "upcoming";
  };

  const alternativeStates: EscrowState[] = ["DISPUTED", "REFUNDED", "CANCELLED"];

  return (
    <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
      <h3 className="mb-lg font-display text-lg font-semibold text-text-primary">
        Escrow Lifecycle
      </h3>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-divider" />

        <div className="relative space-y-lg">
          {mainFlowStates.map((state, index) => {
            const status = getStateStatus(state, index);

            return (
              <div key={state} className="relative flex items-start gap-md">
                <div
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    status === "current"
                      ? "border-primary bg-primary text-on-primary shadow-lg shadow-primary/20"
                      : status === "completed"
                        ? "border-status-success bg-status-success text-on-primary"
                        : "border-divider bg-white text-text-muted"
                  }`}
                >
                  {status === "current" ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : status === "completed" ? (
                    <Check size={20} />
                  ) : (
                    <Circle size={20} />
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-sm">
                    <h4
                      className={`font-semibold ${
                        status === "current"
                          ? "text-primary"
                          : status === "completed"
                            ? "text-status-success"
                            : "text-text-muted"
                      }`}
                    >
                      {ESCROW_STATE_LABELS[state]}
                    </h4>
                    {status === "current" && (
                      <span className="inline-flex items-center rounded-full bg-primary-tint px-sm py-xs text-xs font-semibold text-primary">
                        Current
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="inline-flex items-center rounded-full bg-status-success/10 px-sm py-xs text-xs font-semibold text-status-success">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="mt-xs text-sm text-text-secondary">
                    {getStateDescription(state)}
                  </p>
                </div>

                {index < mainFlowStates.length - 1 && (
                  <div className="absolute left-[22px] top-12 bottom-0 w-[2px] bg-divider" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAlternative && (
        <div className="mt-xl border-t border-divider pt-xl">
          <h4 className="mb-md text-sm font-semibold text-text-muted">
            Alternative States
          </h4>
          <div className="flex flex-wrap gap-sm">
            {alternativeStates.map((state) => (
              <div
                key={state}
                className={`inline-flex items-center gap-sm rounded-lg border px-md py-sm text-sm ${
                  currentState === state
                    ? state === "DISPUTED"
                      ? "border-status-error bg-status-error/10 text-status-error"
                      : state === "REFUNDED"
                        ? "border-status-error bg-status-error/10 text-status-error"
                        : "border-text-muted bg-surface-container text-text-muted"
                    : "border-border bg-surface-container-low text-text-secondary"
                }`}
              >
                <Circle
                  size={8}
                  className={
                    currentState === state ? "fill-current" : "text-text-muted"
                  }
                />
                {ESCROW_STATE_LABELS[state]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStateDescription(state: EscrowState): string {
  const descriptions: Record<EscrowState, string> = {
    CREATED: "Escrow contract has been created and is awaiting funding.",
    FUNDED: "Funds have been deposited and the escrow is active.",
    IN_PROGRESS: "Work is being performed by the freelancer.",
    SUBMITTED: "Milestone deliverables have been submitted for review.",
    UNDER_REVIEW: "Client is reviewing the submitted deliverables.",
    APPROVED: "Deliverables have been approved for payment release.",
    RELEASED: "Funds have been released to the freelancer.",
    DISPUTED: "A dispute has been raised and requires resolution.",
    REFUNDED: "Funds have been returned to the client.",
    CANCELLED: "The escrow has been cancelled.",
  };
  return descriptions[state];
}
