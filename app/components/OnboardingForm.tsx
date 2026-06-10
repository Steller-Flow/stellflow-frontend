"use client";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Globe2,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "Tell Us About Yourself",
    description:
      "Set up your profile to personalize your enterprise finance experience.",
  },
  {
    title: "Set Up Your Workspace",
    description:
      "Choose how StellFlow should organize your payroll, invoices, and escrow activity.",
  },
  {
    title: "Security Preferences",
    description:
      "Confirm your compliance posture before your workspace is prepared.",
  },
];

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
      {children}
    </span>
  );
}

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const lastStep = step === steps.length - 1;

  return (
    <section className="w-full max-w-[700px] fade-up">
      <div className="overflow-hidden rounded-xl border border-border bg-card-bg shadow-sm">
        <header className="px-xl pb-base pt-xl">
          <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
            {steps[step].title}
          </h2>
          <p className="mt-base text-text-secondary">{steps[step].description}</p>
        </header>

        <form className="flex flex-col gap-lg p-xl">
          {step === 0 ? (
            <>
              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Full Name
                </span>
                <span className="relative">
                  <FieldIcon>
                    <User size={18} />
                  </FieldIcon>
                  <input
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="Enter your legal name"
                    type="text"
                  />
                </span>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Email Address
                </span>
                <span className="relative">
                  <FieldIcon>
                    <Mail size={18} />
                  </FieldIcon>
                  <input
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="name@company.com"
                    type="email"
                  />
                </span>
              </label>

              <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-primary">
                    Country
                  </span>
                  <span className="relative">
                    <FieldIcon>
                      <Globe2 size={18} />
                    </FieldIcon>
                    <select className="brand-field h-12 w-full appearance-none rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition">
                      <option>Select country</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Japan</option>
                      <option>Singapore</option>
                    </select>
                  </span>
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-primary">
                    Role
                  </span>
                  <span className="relative">
                    <FieldIcon>
                      <BriefcaseBusiness size={18} />
                    </FieldIcon>
                    <select className="brand-field h-12 w-full appearance-none rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition">
                      <option>Select role</option>
                      <option>Freelancer</option>
                      <option>Client</option>
                      <option>Agency</option>
                      <option>Team Manager</option>
                    </select>
                  </span>
                </label>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Workspace Name
                </span>
                <span className="relative">
                  <FieldIcon>
                    <Building2 size={18} />
                  </FieldIcon>
                  <input
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="Acme Global Studio"
                    type="text"
                  />
                </span>
              </label>
              <div className="grid gap-md md:grid-cols-3">
                {["Invoices", "Escrows", "Payroll"].map((item, index) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-start gap-md rounded-xl border border-border bg-white p-md transition hover:border-primary hover:bg-primary-tint/50"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={index < 2}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span>
                      <span className="block font-semibold">{item}</span>
                      <span className="text-sm text-text-secondary">
                        Enable empty state and setup prompts.
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <div className="space-y-md">
              {[
                "Require wallet signature before payouts",
                "Enable encrypted workspace recovery",
                "Send transaction alerts to email",
              ].map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center justify-between gap-md rounded-xl border border-border bg-white p-md transition hover:border-primary hover:bg-primary-tint/50"
                >
                  <span className="flex items-center gap-md">
                    <ShieldCheck className="text-primary" size={22} />
                    <span className="font-medium">{item}</span>
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
            </div>
          ) : null}

          <div className="mt-base flex flex-col items-center gap-md sm:flex-row">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="inline-flex h-11 w-full items-center justify-center gap-xs rounded-lg border border-border bg-white px-xl font-semibold text-text-primary transition hover:bg-surface-container-low active:scale-[0.98] sm:w-auto"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            ) : null}

            {lastStep ? (
              <a
                href="/auth/loading"
                className="inline-flex h-11 w-full flex-1 items-center justify-center gap-xs rounded-lg bg-primary-container font-semibold text-on-primary transition hover:bg-primary-hover active:scale-[0.98]"
              >
                Finish Setup
                <Check size={18} />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setStep((current) => current + 1)}
                className="inline-flex h-11 w-full flex-1 items-center justify-center gap-xs rounded-lg bg-primary-container font-semibold text-on-primary transition hover:bg-primary-hover active:scale-[0.98]"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            )}

            <a
              href="/auth/loading"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border bg-white px-xl font-semibold text-text-primary transition hover:bg-surface-container-low active:scale-[0.98] sm:w-auto"
            >
              Skip For Now
            </a>
          </div>
        </form>

        <footer className="flex items-center justify-between border-t border-divider bg-bg-secondary px-xl py-lg">
          <div className="flex gap-xs">
            {steps.map((item, index) => (
              <span
                key={item.title}
                className={`h-1.5 w-12 rounded-full ${
                  index <= step ? "bg-primary" : "bg-divider"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-text-muted">
            Step {step + 1} of {steps.length}
          </span>
        </footer>
      </div>
    </section>
  );
}
