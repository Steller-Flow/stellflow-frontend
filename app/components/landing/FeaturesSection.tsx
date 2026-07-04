import { ArrowRight, FileText, LockKeyhole, ReceiptText, Users, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  ["Invoice Creation", "Professional billing with instant crypto and fiat reconciliation.", ReceiptText],
  ["Milestone Escrow", "Funds are held securely and released as deliverables are approved.", LockKeyhole],
  ["Payroll Distribution", "Pay contractors worldwide from one operational dashboard.", Users],
  ["Instant Settlement", "USDC arrives in seconds, ready for local off-ramp workflows.", Zap],
];

export function FeaturesSection() {
  return (
    <section className="bg-surface-container-low py-3xl">
      <div className="mx-auto w-full px-md sm:px-25">
        <div className="mb-3xl flex flex-col justify-between gap-lg md:flex-row md:items-end">
          <div className="">
            <h2 className="font-display mb-md text-3xl font-semibold">
              One Platform. Global Payments.
            </h2>
            <p className="text-text-secondary">
              Stellar ledger infrastructure and USDC settlement rails for the
              modern economy.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-sm font-bold text-primary hover:underline"
          >
            Explore Infrastructure <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid gap-md md:grid-cols-4">
          {features.map(([title, copy, Icon]) => {
            const FeatureIcon = Icon as typeof FileText;

            return (
              <div
                key={title as string}
                className="flex h-full flex-col rounded-xl border border-border bg-card-bg p-lg shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <FeatureIcon className="mb-md text-primary" size={28} />
                <h4 className="mb-sm font-bold">{title as string}</h4>
                <p className="text-sm text-text-secondary">{copy as string}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
