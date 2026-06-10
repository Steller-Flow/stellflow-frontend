import { ArrowLeft, RefreshCcw, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function OnboardingFailurePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-md">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-[-8%] h-[36%] w-[36%] rounded-full bg-error-container opacity-70 blur-[110px]" />
        <div className="absolute bottom-[-8%] right-[-5%] h-[34%] w-[34%] rounded-full bg-primary-tint opacity-60 blur-[110px]" />
      </div>

      <section className="relative z-10 w-full max-w-[540px] rounded-xl border border-border bg-card-bg p-xl text-center shadow-sm fade-up">
        <div className="mx-auto mb-lg flex h-20 w-20 items-center justify-center rounded-full bg-error-container text-status-error">
          <ShieldAlert size={42} />
        </div>
        <h1 className="font-display mb-md text-3xl font-semibold text-text-primary">
          Workspace Setup Failed
        </h1>
        <p className="mx-auto mb-xl max-w-[420px] text-text-secondary">
          We could not finish preparing your secure workspace. Your wallet was
          not charged and no funds moved.
        </p>
        <div className="flex flex-col justify-center gap-md sm:flex-row">
          <Link
            href="/auth/loading"
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-xl font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            <RefreshCcw size={18} />
            Try Again
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg border border-border bg-white px-xl font-semibold text-text-primary transition hover:bg-surface-container-low"
          >
            <ArrowLeft size={18} />
            Back to Setup
          </Link>
        </div>
      </section>
    </main>
  );
}
