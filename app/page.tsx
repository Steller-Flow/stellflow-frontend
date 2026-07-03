import {
  ArrowRight,
  Clock3,
  FileText,
  Landmark,
  LockKeyhole,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Brand } from "./components/Brand";
import { LandingNav } from "./components/LandingNav";
import { LandingDashboardPreview } from "./components/LandingDashboardPreview";

const metrics = [
  ["$240M+", "Payments Processed"],
  ["150k+", "Invoices Generated"],
  ["45", "Countries Supported"],
  ["0.5s", "Average Settlement Time"],
];

const problems = [
  {
    title: "Slow Transfers",
    description:
      "Legacy wires take days to clear and create cash-flow friction for distributed teams.",
    icon: Clock3,
  },
  {
    title: "High Fees",
    description:
      "Intermediary banks and conversion spreads eat into payment volume.",
    icon: Landmark,
  },
  {
    title: "No Protection",
    description:
      "Standard transfers lack milestone security and dispute-aware workflows.",
    icon: ShieldAlert,
  },
];

const features = [
  ["Invoice Creation", "Professional billing with instant crypto and fiat reconciliation.", ReceiptText],
  ["Milestone Escrow", "Funds are held securely and released as deliverables are approved.", LockKeyhole],
  ["Payroll Distribution", "Pay contractors worldwide from one operational dashboard.", Users],
  ["Instant Settlement", "USDC arrives in seconds, ready for local off-ramp workflows.", Zap],
];

const useCases = [
  {
    title: "For Freelancers",
    copy: "Use smart escrows to protect each milestone and reduce late payment risk.",
    accent: "bg-primary-tint",
  },
  {
    title: "For Remote Teams",
    copy: "Pay global talent in USDC without bank delays or excessive FX spreads.",
    accent: "bg-secondary-container",
  },
  {
    title: "For Agencies",
    copy: "Centralize client billing and subcontractor payouts in one workspace.",
    accent: "bg-tertiary-container",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-background text-text-primary">
      <LandingNav />

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
              {/* <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card-bg px-xl font-bold text-text-primary transition hover:bg-surface-container-low"
              >
                View Demo
              </Link> */}
            </div>
          </div>
          <LandingDashboardPreview />
        </div>
      </header>

      <section className="py-25 mt-2 bg-primary-tint">
        <div className="mx-auto grid w-full grid-cols-1 gap-lg px-md sm:grid-cols-2 sm:px-[100px] lg:grid-cols-4">
          {metrics.map(([value, label]) => (
            <div
              key={label}
              className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-border bg-card-bg p-lg text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="font-display mb-xs text-3xl font-bold text-primary">
                {value}
              </p>
              <p className="text-sm font-medium text-text-secondary">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-25 ">
        <div className="mx-auto w-full px-md sm:px-25">
          <div className="mx-auto mb-3xl text-center">
            <h2 className="font-display mb-md text-3xl font-semibold">
              Managing Global Payments Is Still Broken
            </h2>
            <p className="text-text-secondary">
              Legacy systems were not built for the modern decentralized
              workforce.
            </p>
          </div>
          <div className="grid gap-xl md:grid-cols-3">
            {problems.map((problem) => {
              const Icon = problem.icon;

              return (
                <div
                  key={problem.title}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card-bg p-xl shadow-sm transition hover:border-status-error"
                >
                  <div className="mb-lg flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-status-error transition group-hover:scale-110">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-display mb-md text-xl font-medium">
                    {problem.title}
                  </h3>
                  <p className="text-text-secondary">{problem.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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

      <section id="how-it-works" className="py-3xl">
        <div className="mx-auto w-full px-md sm:px-25">
          <h2 className="font-display mb-3xl text-center text-3xl font-semibold">
            How StellFlow Works
          </h2>
          <div className="relative grid gap-xl md:grid-cols-4">
            <div className="absolute left-0 top-6 hidden h-[2px] w-full bg-divider md:block" />
            {["Create Invoice", "Fund Escrow", "Complete Work", "Release Payment"].map(
              (item, index) => (
                <div key={item} className="relative text-center">
                  <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-full border-4 border-card-bg bg-primary font-bold text-on-primary shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="mb-xs font-bold">{item}</h4>
                  <p className="text-sm text-text-secondary">
                    {index === 0
                      ? "Define milestones and deliverables."
                      : index === 1
                        ? "Secure USDC on Stellar rails."
                        : index === 2
                          ? "Submit and review project output."
                          : "Release approved funds instantly."}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

       {/* Solution For Professionals Section*/}
      <section id="use-cases" className="bg-bg-secondary py-3xl">
        <div className="mx-auto w-full px-md sm:px-25">
          <h2 className="font-display mb-2xl text-center text-3xl font-semibold">
            Solutions for Every Professional
          </h2>
          <div className="grid gap-xl md:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card-bg shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`h-48 ${item.accent} p-lg`}>
                  <div className="h-full rounded-lg border border-white/70 bg-white/70 p-md shadow-inner">
                    <div className="mb-lg h-4 w-2/3 rounded-full bg-primary/20" />
                    <div className="grid h-[calc(100%-32px)] grid-cols-3 items-end gap-sm">
                      {[45, 75, 55].map((height) => (
                        <span
                          key={height}
                          className="rounded-t-lg bg-primary/70"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-xl">
                  <h4 className="font-display mb-md text-xl font-medium">
                    {item.title}
                  </h4>
                  <p className="mb-lg flex-1 text-text-secondary">{item.copy}</p>
                  <Link
                    href="/connect-wallet"
                    className="inline-flex items-center gap-xs text-sm font-bold text-primary"
                  >
                    Learn more <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      {/* Start sending and recieving globally Section*/}
      <section className="px-md py-3xl">
        <div className="mx-auto w-full rounded-xl bg-primary py-2xl text-center text-on-primary sm:py-3xl sm:px-25">
          <h2 className="font-display mx-auto mb-lg text-3xl font-bold sm:text-5xl">
            Start Sending and Receiving <br/> Payments Globally.
          </h2>
          <p className="mx-auto mb-2xl text-primary-light">
            Join teams using StellFlow for secure, instant, and borderless
            financial operations.
          </p>
          <div className="flex flex-wrap justify-center gap-md">
            <Link
              href="/connect-wallet"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-on-primary px-xl font-extrabold text-primary shadow-lg transition hover:bg-primary-tint"
            >
              Open Free Account
            </Link>
            <a
              href="mailto:sales@stellflow.io"
              className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary-light px-xl font-extrabold text-on-primary transition hover:bg-white/10"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-divider bg-white px-md py-xl sm:px-25 mt-10">
        <div className="mx-auto flex w-full flex-col justify-between gap-md text-sm text-text-muted md:flex-row md:items-center">
          <Brand compact />
          <span>© 2026 StellFlow Infrastructure. All rights reserved.</span>
          <span className="flex items-center gap-xs">
            <ShieldCheck size={16} className="text-status-success" />
            All Systems Operational
          </span>
        </div>
      </footer>
    </div>
  );
}
