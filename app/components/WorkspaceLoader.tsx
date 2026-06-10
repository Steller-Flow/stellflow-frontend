"use client";

import {
  Check,
  Gauge,
  LayoutDashboard,
  RefreshCw,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const loaderSteps = [
  {
    title: "Verifying Wallet",
    activeText: "Signature authenticated successfully",
    completeText: "Verified",
    icon: ShieldCheck,
  },
  {
    title: "Creating Account",
    activeText: "Generating on-chain credentials...",
    completeText: "Account created",
    icon: Gauge,
  },
  {
    title: "Syncing Profile",
    activeText: "Fetching encrypted metadata...",
    completeText: "Profile synced",
    icon: RefreshCw,
  },
  {
    title: "Loading Dashboard",
    activeText: "Preparing interface...",
    completeText: "Ready",
    icon: LayoutDashboard,
  },
];

export function WorkspaceLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= loaderSteps.length) {
      const redirect = window.setTimeout(() => {
        window.location.href = "/onboarding/success";
      }, 1300);
      return () => window.clearTimeout(redirect);
    }

    const timer = window.setTimeout(() => {
      setActiveStep((current) => current + 1);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [activeStep]);

  const progress = Math.min(100, Math.round(((activeStep + 1) / loaderSteps.length) * 100));

  return (
    <main className="relative z-10 w-full max-w-[480px] px-md fade-up">
      <div className="mb-xl flex flex-col items-center">
        <div className="mb-md flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card-bg text-primary shadow-sm">
          <Rocket size={38} />
        </div>
        <h1 className="font-display mb-xs text-3xl font-semibold text-primary">
          StellFlow
        </h1>
        <p className="text-text-secondary">Enterprise Finance Protocol</p>
      </div>

      <section className="rounded-xl border border-border bg-card-bg p-xl shadow-sm">
        <header className="mb-xl text-center">
          <h2 className="font-display mb-xs text-xl font-medium text-text-primary">
            Preparing Your Workspace
          </h2>
          <p className="text-sm text-text-secondary">
            Please wait while we initialize your secure environment.
          </p>
        </header>

        <div className="relative space-y-lg">
          <div className="absolute bottom-6 left-[18px] top-6 z-0 w-[2px] bg-divider" />
          {loaderSteps.map((step, index) => {
            const Icon = step.icon;
            const complete = index < activeStep || activeStep >= loaderSteps.length;
            const active = index === activeStep && activeStep < loaderSteps.length;
            const pending = !complete && !active;

            return (
              <div
                key={step.title}
                className={`relative z-10 flex items-center gap-md transition ${
                  pending ? "opacity-50" : "opacity-100"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    complete
                      ? "bg-primary text-on-primary"
                      : active
                        ? "bg-primary-tint text-primary shadow-[0_0_0_4px_rgba(140,179,105,0.15)]"
                        : "bg-surface-container-low text-text-muted"
                  }`}
                >
                  {complete ? (
                    <Check size={20} />
                  ) : active ? (
                    <span className="loader-ring h-5 w-5 rounded-full border-2 border-primary" />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{step.title}</p>
                  <p className="text-sm text-text-secondary">
                    {complete ? step.completeText : active ? step.activeText : "Waiting to start..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-xl">
          <div className="mb-xs flex items-end justify-between">
            <span className="text-xs font-semibold uppercase text-text-muted">
              Overall Progress
            </span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="mt-lg flex items-center justify-center gap-sm text-text-muted">
        <ShieldCheck size={18} />
        <span className="text-sm">End-to-end encrypted connection</span>
      </div>
    </main>
  );
}
