"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  ContractCallError,
  ESCROW_CONTRACT_ID,
  ESCROW_NOT_FOUND,
  explorerAccountUrl,
  explorerContractUrl,
  getContractStatus,
  getEscrow,
  STELLAR_NETWORK,
  type ContractStatus as ContractStatusData,
  type OnChainEscrow,
} from "../lib/soroban";
import { shortenAddress } from "../lib/walletSession";

type StatusState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: ContractStatusData };

type LookupState =
  | { kind: "idle" }
  | { kind: "loading"; id: string }
  | { kind: "not-found"; id: string; ledger?: number }
  | { kind: "error"; id: string; message: string }
  | { kind: "found"; id: string; escrow: OnChainEscrow; ledger: number };

function describeError(error: unknown): string {
  if (error instanceof ContractCallError) return error.message;
  return error instanceof Error ? error.message : "Unexpected error";
}

/**
 * Live, read-only view of the escrow contract: four getters on mount and a
 * get_escrow lookup by id. Every value shown comes from a Soroban RPC
 * simulation at render time; nothing here is hardcoded or sampled.
 */
export function ContractStatus({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<StatusState>({ kind: "loading" });
  const [lookup, setLookup] = useState<LookupState>({ kind: "idle" });
  const [escrowId, setEscrowId] = useState("1");

  // Bumping this re-runs the effect below (the Retry button).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getContractStatus().then(
      (data) => {
        if (!cancelled) setStatus({ kind: "ready", data });
      },
      (error: unknown) => {
        if (!cancelled) setStatus({ kind: "error", message: describeError(error) });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setStatus({ kind: "loading" });
    setAttempt((n) => n + 1);
  };

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault();
    const id = escrowId.trim();
    if (!/^\d+$/.test(id)) {
      setLookup({ kind: "error", id, message: "Escrow id must be a whole number (u64)." });
      return;
    }
    setLookup({ kind: "loading", id });
    try {
      const { escrow, latestLedger } = await getEscrow(BigInt(id));
      setLookup({ kind: "found", id, escrow, ledger: latestLedger });
    } catch (error) {
      if (error instanceof ContractCallError && error.contractErrorCode === ESCROW_NOT_FOUND) {
        setLookup({ kind: "not-found", id });
      } else {
        setLookup({ kind: "error", id, message: describeError(error) });
      }
    }
  };

  return (
    <section
      aria-labelledby="contract-status-title"
      className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm"
      data-testid="contract-status"
    >
      <header className="mb-md flex flex-wrap items-start justify-between gap-md">
        <div>
          <h2 id="contract-status-title" className="font-display text-xl font-semibold text-text-primary">
            Escrow contract, live on Stellar {STELLAR_NETWORK}
          </h2>
          <p className="text-sm text-text-secondary">
            Read straight from the contract over Soroban RPC — no wallet, no backend, no sample data.
          </p>
        </div>
        <a
          href={explorerContractUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-xs rounded-lg border border-border px-md py-sm text-sm font-semibold text-primary transition hover:bg-primary-tint"
        >
          stellar.expert
          <ExternalLink size={14} />
        </a>
      </header>

      <p className="mb-md break-all rounded-lg bg-surface-container-low p-md font-mono text-xs text-text-secondary">
        {ESCROW_CONTRACT_ID}
      </p>

      {status.kind === "loading" && (
        <p role="status" className="flex items-center gap-sm text-sm text-text-muted">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Simulating get_admin, is_paused, get_version, get_escrow_ttl…
        </p>
      )}

      {status.kind === "error" && (
        <div role="alert" className="flex items-start gap-md rounded-lg border border-status-error/30 bg-error-container/60 p-md">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-status-error" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-status-error">Could not read the contract</p>
            <p className="mt-xs break-words text-xs text-text-secondary">{status.message}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-sm inline-flex items-center gap-xs text-sm font-semibold text-primary hover:underline"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      )}

      {status.kind === "ready" && (
        <dl className={`grid gap-md ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          <Stat label="Admin">
            {status.data.admin ? (
              <a
                href={explorerAccountUrl(status.data.admin)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline"
                title={status.data.admin}
              >
                {shortenAddress(status.data.admin)}
              </a>
            ) : (
              "not initialised"
            )}
          </Stat>
          <Stat label="Paused">
            <span className="inline-flex items-center gap-xs">
              {status.data.paused ? (
                <AlertTriangle size={16} className="text-status-warning" />
              ) : (
                <CheckCircle2 size={16} className="text-status-success" />
              )}
              {status.data.paused ? "yes" : "no"}
            </span>
          </Stat>
          <Stat label="Contract version">{status.data.version}</Stat>
          <Stat label="Escrow storage TTL">{status.data.escrowTtl.toLocaleString("en-US")} ledgers</Stat>
          <Stat label="Latest ledger" className="lg:col-span-2">
            {status.data.latestLedger.toLocaleString("en-US")}
          </Stat>
          <Stat label="RPC" className="lg:col-span-2">
            <span className="break-all font-mono text-xs">{status.data.rpcUrl}</span>
          </Stat>
        </dl>
      )}

      <form onSubmit={handleLookup} className="mt-lg flex flex-col gap-sm sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium text-text-secondary">
          Look up an escrow by id (calls get_escrow(u64))
          <input
            type="text"
            inputMode="numeric"
            value={escrowId}
            onChange={(event) => setEscrowId(event.target.value)}
            className="mt-xs h-11 w-full rounded-lg border border-border bg-white px-md font-mono text-text-primary"
            aria-label="Escrow id"
          />
        </label>
        <button
          type="submit"
          disabled={lookup.kind === "loading"}
          className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary transition hover:bg-primary-hover disabled:opacity-60"
        >
          {lookup.kind === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Look up
        </button>
      </form>

      <div className="mt-md" aria-live="polite" data-testid="escrow-lookup-result">
        {lookup.kind === "not-found" && (
          <p className="rounded-lg border border-border bg-surface-container-low p-md text-sm text-text-secondary">
            No escrow with id <span className="font-mono">{lookup.id}</span> exists on this contract — it
            returned <span className="font-mono">EscrowError::EscrowNotFound (#3)</span>.
          </p>
        )}
        {lookup.kind === "error" && (
          <p role="alert" className="rounded-lg border border-status-error/30 bg-error-container/60 p-md text-sm text-status-error">
            {lookup.message}
          </p>
        )}
        {lookup.kind === "found" && <EscrowDetails escrow={lookup.escrow} ledger={lookup.ledger} />}
      </div>
    </section>
  );
}

function Stat({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-surface-container-low p-md ${className}`}>
      <dt className="text-xs font-medium uppercase text-text-muted">{label}</dt>
      <dd className="mt-xs text-sm font-semibold text-text-primary">{children}</dd>
    </div>
  );
}

function EscrowDetails({ escrow, ledger }: { escrow: OnChainEscrow; ledger: number }) {
  return (
    <div className="rounded-lg border border-status-success/30 bg-status-success/10 p-md text-sm">
      <p className="mb-sm inline-flex items-center gap-xs font-semibold text-text-primary">
        <ShieldCheck size={16} className="text-status-success" />
        Escrow #{escrow.escrowId.toString()} · {escrow.status} · ledger {ledger.toLocaleString("en-US")}
      </p>
      <dl className="grid gap-sm sm:grid-cols-2">
        <Row label="Client" value={escrow.client} mono />
        <Row label="Freelancer" value={escrow.freelancer} mono />
        <Row label="Token" value={escrow.token} mono />
        <Row label="Amount (token base units)" value={escrow.amount.toString()} mono />
        <Row label="Released / refunded" value={`${escrow.totalReleased} / ${escrow.totalRefunded}`} mono />
        <Row label="Fee" value={`${escrow.feePercent} %`} />
        <Row label="Milestones" value={String(escrow.milestones.length)} />
        <Row label="History entries" value={String(escrow.history.length)} />
      </dl>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase text-text-muted">{label}</dt>
      <dd className={`break-all text-text-primary ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
