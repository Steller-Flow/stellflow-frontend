import { ArrowRight, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

const features = [
  ["Invoices", "Smart automated billing flow.", FileText],
  ["Escrows", "Multi-signature protected payments.", ShieldCheck],
  ["Analytics", "Real-time financial visibility.", TrendingUp],
];

export default function OnboardingSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-md py-3xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary-tint opacity-70 blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-[30%] w-[30%] rounded-full bg-secondary-container opacity-50 blur-[100px]" />
        </div>

        <section className="relative z-10 w-full max-w-[620px] text-center fade-up">
          <div className="relative mb-xl inline-block">
            <div className="success-pulse absolute inset-0 scale-150 rounded-full bg-primary-container opacity-10" />
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-lg">
              <ShieldCheck size={52} />
            </div>
          </div>

          <h1 className="font-display mb-md text-3xl font-semibold text-text-primary sm:text-4xl">
            Your Workspace Is Ready
          </h1>
          <p className="mx-auto mb-2xl max-w-[460px] text-text-secondary">
            You can now create invoices, manage escrow payments, and track
            transactions with enterprise-grade security.
          </p>

          <div className="mb-2xl grid grid-cols-1 gap-md md:grid-cols-3">
            {features.map(([title, copy, Icon]) => {
              const FeatureIcon = Icon as typeof FileText;

              return (
                <div
                  key={title as string}
                  className="rounded-xl border border-border bg-card-bg p-lg text-left shadow-sm transition hover:-translate-y-1 hover:border-primary"
                >
                  <div className="mb-md flex h-10 w-10 items-center justify-center rounded-lg bg-primary-tint text-primary">
                    <FeatureIcon size={22} />
                  </div>
                  <h4 className="mb-xs text-xs font-semibold uppercase text-text-primary">
                    {title as string}
                  </h4>
                  <p className="text-sm text-text-secondary">{copy as string}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-md">
            <Link
              className="inline-flex h-11 w-full items-center justify-center gap-sm rounded-lg bg-primary-container px-2xl font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95 md:w-auto"
              href="/dashboard"
            >
              Go To Dashboard
              <ArrowRight size={20} />
            </Link>
            <div>
              <Link
                className="py-sm text-sm text-text-muted transition hover:text-primary"
                href="/dashboard"
              >
                Configure later
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center gap-sm px-xl py-xl text-sm text-text-muted">
        <span className="font-display text-xl font-bold text-primary">
          StellFlow
        </span>
        <span className="h-4 w-px bg-border" />
        <span>Enterprise Finance Infrastructure</span>
      </footer>
    </div>
  );
}
