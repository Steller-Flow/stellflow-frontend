"use client";

import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "../../../components/DashboardShell";
import { EscrowStateDiagram } from "../../../components/EscrowStateDiagram";
import { useEscrowStore } from "../../../lib/escrowStore";
import {
  ESCROW_STATE_LABELS,
  ESCROW_STATE_COLORS,
  MILESTONE_STATUS_LABELS,
  MILESTONE_STATUS_COLORS,
  TRANSACTION_TYPE_LABELS,
} from "../../../lib/escrowTypes";

export default function EscrowDetailPage() {
  const params = useParams();
  const escrowId = params.id as string;
  const getEscrow = useEscrowStore((state) => state.getEscrow);

  const escrow = getEscrow(escrowId);

  if (!escrow) {
    return (
      <DashboardShell
        activeHref="/dashboard/escrows"
        title="Escrow Details"
        description="View escrow details and transaction history."
      >
        <div className="flex flex-col items-center py-3xl text-center">
          <FileText size={48} className="mb-lg text-text-muted" />
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Escrow Not Found
          </h2>
          <p className="mt-sm text-text-secondary">
            The escrow you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/dashboard/escrows"
            className="mt-lg inline-flex items-center gap-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Escrows
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const progressPercent =
    escrow.totalAmount > 0
      ? Math.round((escrow.releasedAmount / escrow.totalAmount) * 100)
      : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const shortenAddress = (address: string) => {
    if (address.length <= 14) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <DashboardShell
      activeHref="/dashboard/escrows"
      title={escrow.title}
      description={escrow.description}
    >
      <div className="space-y-lg">
        <Link
          href="/dashboard/escrows"
          className="inline-flex items-center gap-sm text-sm font-medium text-text-secondary transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Escrows
        </Link>

        <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
          <div className="space-y-lg lg:col-span-2">
            <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
              <div className="mb-lg flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  Overview
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-md py-xs text-sm font-semibold ${ESCROW_STATE_COLORS[escrow.state]}`}
                >
                  {ESCROW_STATE_LABELS[escrow.state]}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                <div>
                  <p className="text-sm text-text-muted">Total Amount</p>
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {formatAmount(escrow.totalAmount)}
                  </p>
                  <p className="text-xs text-text-muted">{escrow.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Released</p>
                  <p className="font-display text-2xl font-bold text-status-success">
                    {formatAmount(escrow.releasedAmount)}
                  </p>
                  <p className="text-xs text-text-muted">
                    {progressPercent}% of total
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Remaining</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {formatAmount(escrow.totalAmount - escrow.releasedAmount)}
                  </p>
                  <p className="text-xs text-text-muted">
                    {100 - progressPercent}% pending
                  </p>
                </div>
              </div>

              <div className="mt-lg">
                <div className="mb-xs flex items-center justify-between text-sm">
                  <span className="text-text-muted">Funding Progress</span>
                  <span className="font-semibold text-primary">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
              <h3 className="mb-lg font-display text-lg font-semibold text-text-primary">
                Parties
              </h3>
              <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface-container-low p-md">
                  <p className="mb-xs text-xs font-semibold uppercase text-text-muted">
                    Client
                  </p>
                  <div className="flex items-center gap-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint text-primary">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {escrow.client.name}
                      </p>
                      <p className="flex items-center gap-xs text-xs text-text-muted">
                        {shortenAddress(escrow.client.address)}
                        <ExternalLink size={10} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-surface-container-low p-md">
                  <p className="mb-xs text-xs font-semibold uppercase text-text-muted">
                    Freelancer
                  </p>
                  <div className="flex items-center gap-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-secondary">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {escrow.freelancer.name}
                      </p>
                      <p className="flex items-center gap-xs text-xs text-text-muted">
                        {shortenAddress(escrow.freelancer.address)}
                        <ExternalLink size={10} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
              <h3 className="mb-lg font-display text-lg font-semibold text-text-primary">
                Milestones
              </h3>
              <div className="space-y-md">
                {escrow.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="rounded-lg border border-border bg-surface-container-low p-md"
                  >
                    <div className="mb-sm flex items-start justify-between">
                      <div className="flex items-start gap-md">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            milestone.status === "APPROVED"
                              ? "bg-status-success text-on-primary"
                              : milestone.status === "SUBMITTED"
                                ? "bg-status-warning text-on-primary"
                                : milestone.status === "IN_PROGRESS"
                                  ? "bg-status-info text-on-primary"
                                  : "bg-surface-container text-text-muted"
                          }`}
                        >
                          {milestone.status === "APPROVED" ? (
                            <Check size={16} />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-primary">
                            {milestone.title}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-sm py-xs text-xs font-semibold ${MILESTONE_STATUS_COLORS[milestone.status]}`}
                      >
                        {MILESTONE_STATUS_LABELS[milestone.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-lg pl-12 text-sm text-text-muted">
                      <span className="flex items-center gap-xs">
                        <span className="font-semibold text-primary">
                          {formatAmount(milestone.amount)}
                        </span>
                      </span>
                      {milestone.dueDate && (
                        <span className="flex items-center gap-xs">
                          <Calendar size={12} />
                          Due {formatDate(milestone.dueDate)}
                        </span>
                      )}
                      {milestone.completedAt && (
                        <span className="flex items-center gap-xs text-status-success">
                          <Check size={12} />
                          Completed {formatDate(milestone.completedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-lg">
            <EscrowStateDiagram currentState={escrow.state} />

            <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
              <h3 className="mb-lg font-display text-lg font-semibold text-text-primary">
                Timeline
              </h3>
              <div className="space-y-md">
                {escrow.transactions.slice().reverse().map((tx) => (
                  <div key={tx.id} className="flex gap-md">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-text-muted">
                      <Clock size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {TRANSACTION_TYPE_LABELS[tx.type]}
                      </p>
                      {tx.amount && (
                        <p className="text-xs font-semibold text-primary">
                          {formatAmount(tx.amount)}
                        </p>
                      )}
                      {tx.note && (
                        <p className="mt-xs text-xs text-text-secondary">
                          {tx.note}
                        </p>
                      )}
                      <p className="mt-xs text-xs text-text-muted">
                        {formatDateTime(tx.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card-bg p-lg shadow-sm">
              <h3 className="mb-md font-display text-lg font-semibold text-text-primary">
                Dates
              </h3>
              <div className="space-y-sm text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Created</span>
                  <span className="text-text-primary">
                    {formatDate(escrow.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Last Updated</span>
                  <span className="text-text-primary">
                    {formatDate(escrow.updatedAt)}
                  </span>
                </div>
                {escrow.deadline && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Deadline</span>
                    <span className="font-semibold text-status-warning">
                      {formatDate(escrow.deadline)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
