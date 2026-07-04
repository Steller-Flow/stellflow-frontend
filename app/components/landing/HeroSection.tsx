import Link from "next/link";
import { LandingDashboardPreview } from "../LandingDashboardPreview";

export function HeroSection() {
  return (
    <header className="relative overflow-hidden py-2xl sm:py-3xl mt-20">
      <div className="mx-auto grid w-full items-center gap-2xl px-md sm:px-25 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)]">
        <div className="min-w-0 fade-up">
          <span className="mb-md inline-block rounded-full bg-primary-tint px-md py-xs text-sm font-semibold text-primary">
            Built on Stellar Network
          </span>
          <h1 className="font-display mb-lg max-w-170 text-4xl font-bold leading-[1.08] text-text-primary sm:text-5xl lg:text-[56px]">
            Borderless Payroll & Escrow Infrastructure for Modern Teams.
          </h1>
          <p className="mb-xl max-w-140 text-lg leading-8 text-text-secondary">
            Manage global payroll, streamline USDC settlements, and protect
            contractors with smart milestone-based escrows.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link
              href="/connect-wallet"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-xl font-bold text-on-primary shadow-md transition hover:bg-primary-hover"
            >
              Get Started
            </Link>
          </div>
        </div>
        <LandingDashboardPreview />
      </div>
    </header>
  );
}
