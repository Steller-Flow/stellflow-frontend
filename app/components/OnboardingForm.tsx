"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Globe2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getWalletSession, shortenAddress } from "../lib/walletSession";
import { completeOnboarding } from "../lib/walletSession";

const walletSchema = z.object({
  walletConnected: z.literal(true, {
    message: "Please connect your wallet to continue",
  }),
});

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(1, "Please select a country"),
});

const roleSchema = z.object({
  role: z.string().min(1, "Please select a role"),
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters"),
});

type WalletForm = z.infer<typeof walletSchema>;
type ProfileForm = z.infer<typeof profileSchema>;
type RoleForm = z.infer<typeof roleSchema>;

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your Stellar wallet to get started with StellFlow.",
    icon: Wallet,
  },
  {
    title: "Set Up Your Profile",
    description: "Tell us about yourself to personalize your experience.",
    icon: User,
  },
  {
    title: "Choose Your Role",
    description: "Select how you'll use StellFlow and name your workspace.",
    icon: BriefcaseBusiness,
  },
  {
    title: "You're All Set!",
    description: "Your workspace is ready. Start managing your finances.",
    icon: CheckCircle2,
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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const lastStep = step === steps.length - 1;

  const walletForm = useForm<WalletForm>({
    resolver: zodResolver(walletSchema),
    defaultValues: { walletConnected: false as unknown as true },
  });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "", country: "" },
  });

  const roleForm = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: { role: "", workspaceName: "" },
  });

  useEffect(() => {
    const session = getWalletSession();
    if (session.connected && session.address) {
      setWalletAddress(session.address);
      walletForm.setValue("walletConnected", true as unknown as true);
    }
  }, [walletForm]);

  const handleNext = async () => {
    if (step === 0) {
      const session = getWalletSession();
      if (!session.connected) {
        walletForm.setError("walletConnected", {
          message: "Please connect your wallet to continue",
        });
        return;
      }
      setWalletAddress(session.address);
      walletForm.setValue("walletConnected", true as unknown as true);
    } else if (step === 1) {
      const valid = await profileForm.trigger();
      if (!valid) return;
    } else if (step === 2) {
      const valid = await roleForm.trigger();
      if (!valid) return;
    } else if (step === 3) {
      completeOnboarding();
      window.location.href = "/dashboard";
      return;
    }
    setStep((current) => current + 1);
  };

  return (
    <section className="w-full max-w-[700px] fade-up">
      <div className="overflow-hidden rounded-xl border border-border bg-card-bg shadow-sm">
        <header className="px-xl pb-base pt-xl">
          <div className="mb-md flex items-center gap-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-tint text-primary">
              {(() => {
                const StepIcon = steps[step].icon;
                return <StepIcon size={20} />;
              })()}
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
                {steps[step].title}
              </h2>
              <p className="mt-base text-text-secondary">{steps[step].description}</p>
            </div>
          </div>
        </header>

        <form className="flex flex-col gap-lg p-xl" onSubmit={(e) => e.preventDefault()}>
          {step === 0 && (
            <div className="space-y-lg">
              <div className="rounded-xl border border-divider bg-surface-container-low p-lg">
                <div className="flex items-center gap-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <LockKeyhole size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">
                      {walletAddress
                        ? "Wallet Connected"
                        : "Connect Your Stellar Wallet"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {walletAddress
                        ? `Connected: ${shortenAddress(walletAddress)}`
                        : "Click below to connect via Freighter or another Stellar wallet"}
                    </p>
                  </div>
                  {walletAddress && (
                    <CheckCircle2 size={24} className="text-status-success" />
                  )}
                </div>
              </div>

              {!walletAddress && (
                <div className="rounded-xl border border-status-warning/30 bg-status-warning/10 p-md">
                  <p className="text-sm text-status-warning">
                    A Stellar wallet is required to use StellFlow. You can connect
                    Freighter, Albedo, or WalletConnect.
                  </p>
                </div>
              )}

              {walletForm.formState.errors.walletConnected && (
                <span className="text-xs text-status-error">
                  {walletForm.formState.errors.walletConnected.message}
                </span>
              )}
            </div>
          )}

          {step === 1 && (
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
                    {...profileForm.register("fullName")}
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="Enter your legal name"
                    type="text"
                  />
                </span>
                {profileForm.formState.errors.fullName && (
                  <span className="text-xs text-status-error">
                    {profileForm.formState.errors.fullName.message}
                  </span>
                )}
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
                    {...profileForm.register("email")}
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="name@company.com"
                    type="email"
                  />
                </span>
                {profileForm.formState.errors.email && (
                  <span className="text-xs text-status-error">
                    {profileForm.formState.errors.email.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Country
                </span>
                <span className="relative">
                  <FieldIcon>
                    <Globe2 size={18} />
                  </FieldIcon>
                  <select
                    {...profileForm.register("country")}
                    className="brand-field h-12 w-full appearance-none rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="SG">Singapore</option>
                  </select>
                </span>
                {profileForm.formState.errors.country && (
                  <span className="text-xs text-status-error">
                    {profileForm.formState.errors.country.message}
                  </span>
                )}
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Role
                </span>
                <div className="grid grid-cols-2 gap-md">
                  {[
                    { value: "freelancer", label: "Freelancer", icon: BriefcaseBusiness },
                    { value: "client", label: "Client", icon: Building2 },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-md rounded-xl border p-md transition ${
                        roleForm.watch("role") === option.value
                          ? "border-primary bg-primary-tint"
                          : "border-border bg-white hover:border-primary hover:bg-primary-tint/50"
                      }`}
                    >
                      <input
                        type="radio"
                        {...roleForm.register("role")}
                        value={option.value}
                        className="sr-only"
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-tint text-primary">
                        <option.icon size={20} />
                      </div>
                      <span className="font-semibold text-text-primary">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {roleForm.formState.errors.role && (
                  <span className="text-xs text-status-error">
                    {roleForm.formState.errors.role.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Workspace Name
                </span>
                <span className="relative">
                  <FieldIcon>
                    <Building2 size={18} />
                  </FieldIcon>
                  <input
                    {...roleForm.register("workspaceName")}
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="My Freelance Business"
                    type="text"
                  />
                </span>
                {roleForm.formState.errors.workspaceName && (
                  <span className="text-xs text-status-error">
                    {roleForm.formState.errors.workspaceName.message}
                  </span>
                )}
              </label>

              <div className="rounded-xl border border-primary-light/30 bg-primary-tint/60 p-md">
                <div className="flex gap-md">
                  <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={20} />
                  <p className="text-sm text-on-primary-container">
                    Your workspace is secured with wallet-based authentication.
                    All transactions require your wallet signature.
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-lg">
              <div className="rounded-xl border border-status-success/30 bg-status-success/10 p-lg text-center">
                <CheckCircle2 size={48} className="mx-auto mb-md text-status-success" />
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  Welcome to StellFlow!
                </h3>
                <p className="mt-sm text-text-secondary">
                  Your workspace is ready. Start creating invoices, managing escrows,
                  and tracking your finances.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-md">
                {[
                  { label: "Invoices", description: "Create and send" },
                  { label: "Escrows", description: "Secure payments" },
                  { label: "Analytics", description: "Track performance" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-surface-container-low p-md text-center"
                  >
                    <p className="font-semibold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-base flex flex-col items-center gap-md sm:flex-row">
            {step > 0 && step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="inline-flex h-11 w-full items-center justify-center gap-xs rounded-lg border border-border bg-white px-xl font-semibold text-text-primary transition hover:bg-surface-container-low active:scale-[0.98] sm:w-auto"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-11 w-full flex-1 items-center justify-center gap-xs rounded-lg bg-primary-container font-semibold text-on-primary transition hover:bg-primary-hover active:scale-[0.98]"
            >
              {lastStep ? (
                <>
                  Go to Dashboard
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  {step === 0 && walletAddress ? "Continue" : "Continue"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
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
