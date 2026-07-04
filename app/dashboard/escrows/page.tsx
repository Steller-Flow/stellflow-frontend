"use client";

import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  LockKeyhole,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "../../components/DashboardShell";
import { EscrowWizard } from "../../components/escrow/EscrowWizard";
import { useEscrowStore } from "../../lib/stores/escrowStore";

const STATUS_LABELS = {
  CREATED: "Created",
  PENDING: "Pending",
  FUNDED: "Funded",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  RELEASED: "Released",
  DISPUTED: "Disputed",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS = {
  CREATED: "bg-surface-container text-text-secondary",
  PENDING: "bg-status-warning/10 text-status-warning",
  FUNDED: "bg-status-info/10 text-status-info",
  IN_PROGRESS: "bg-primary-tint text-primary",
  SUBMITTED: "bg-secondary-container text-secondary",
  APPROVED: "bg-status-success/10 text-status-success",
  RELEASED: "bg-status-success text-on-primary",
  DISPUTED: "bg-status-error/10 text-status-error",
  CANCELLED: "bg-surface-container text-text-muted",
};

export default function EscrowsPage() {
  const [showWizard, setShowWizard] = useState(false);
  const escrows = useEscrowStore((state) => state.escrows);

  if (showWizard) {
    return (
      <DashboardShell
        activeHref="/dashboard/escrows"
        title="Create Escrow"
        description="Set up a new milestone-based escrow for your project."
      >
        <EscrowWizard
          onComplete={() => setShowWizard(false)}
          onCancel={() => setShowWizard(false)}
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      activeHref="/dashboard/escrows"
      title="Escrows"
      description="Protect contract work with milestone-based escrow workflows."
    >
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            {escrows.length} escrow{escrows.length !== 1 ? "s" : ""} total
          </p>
          <button
            type="button"
            onClick={() => setShowWizard(true)}
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95"
          >
            <Plus size={18} />
            Create Escrow
          </button>
        </div>

        {escrows.length === 0 ? (
          <div className="rounded-xl border border-divider bg-card-bg p-xl shadow-sm">
            <div className="mx-auto flex max-w-[520px] flex-col items-center py-2xl text-center">
              <div className="relative mb-lg">
                <div className="absolute inset-0 rounded-full bg-primary-container/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <LockKeyhole size={36} />
                </div>
              </div>
              <h2 className="font-display mb-sm text-2xl font-semibold text-text-primary">
                No active escrows
              </h2>
              <p className="mb-xl text-text-secondary">
                Create a secure escrow, define deliverables, and release funds only
                when work is approved.
              </p>
              <button
                type="button"
                onClick={() => setShowWizard(true)}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-xl font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95"
              >
                Create Escrow
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-lg">
            {escrows.map((escrow) => {
              const progressPercent =
                escrow.totalAmount > 0
                  ? Math.round((escrow.releasedAmount / escrow.totalAmount) * 100)
                  : 0;

              return (
                <Link
                  key={escrow.id}
                  href={`/dashboard/escrows/${escrow.id}`}
                  className="group rounded-xl border border-border bg-card-bg p-lg shadow-sm transition hover:border-primary hover:shadow-md"
                >
                  <div className="mb-lg flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-primary">
                        {escrow.title}
                      </h3>
                      <p className="mt-xs line-clamp-2 text-sm text-text-secondary">
                        {escrow.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-md py-xs text-sm font-semibold ${STATUS_COLORS[escrow.status]}`}
                    >
                      {STATUS_LABELS[escrow.status]}
                    </span>
                  </div>

                  <div className="mb-lg grid grid-cols-2 gap-lg md:grid-cols-4">
                    <div>
                      <p className="text-xs text-text-muted">Total</p>
                      <p className="font-semibold text-text-primary">
                        ${escrow.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Released</p>
                      <p className="font-semibold text-status-success">
                        ${escrow.releasedAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-sm">
                      <Users size={14} className="text-text-muted" />
                      <div>
                        <p className="text-xs text-text-muted">Freelancer</p>
                        <p className="text-sm font-medium text-text-primary">
                          {escrow.freelancer.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <Calendar size={14} className="text-text-muted" />
                      <div>
                        <p className="text-xs text-text-muted">Deadline</p>
                        <p className="text-sm font-medium text-text-primary">
                          {escrow.deadline
                            ? new Date(escrow.deadline).toLocaleDateString()
                            : "None"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-lg">
                    <div className="mb-xs flex items-center justify-between text-sm">
                      <span className="text-text-muted">Progress</span>
                      <span className="font-semibold text-primary">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-md text-sm text-text-muted">
                      <span>
                        {escrow.milestones.length} milestone
                        {escrow.milestones.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        {escrow.transactions.length} transaction
                        {escrow.transactions.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-sm font-semibold text-primary group-hover:underline">
                      View Details
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
