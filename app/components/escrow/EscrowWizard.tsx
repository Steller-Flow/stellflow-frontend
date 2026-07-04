"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Wallet,
} from "lucide-react";
import { z } from "zod";
import { EscrowFreelancerStep } from "./EscrowFreelancerStep";
import { EscrowAmountStep } from "./EscrowAmountStep";
import { EscrowMilestonesStep } from "./EscrowMilestonesStep";
import { EscrowReviewStep } from "./EscrowReviewStep";
import { EscrowConfirmationStep } from "./EscrowConfirmationStep";
import { useEscrowStore } from "../../lib/stores/escrowStore";
import { useAuthStore } from "../../lib/stores/authStore";
import type { Escrow, EscrowMilestone, EscrowParty } from "../../lib/types";

const escrowSchema = z.object({
  freelancerAddress: z.string().min(56, "Invalid Stellar address"),
  freelancerName: z.string().min(1, "Name is required"),
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  totalAmount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.enum(["USDC", "XLM"]),
  milestones: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    dueDate: z.string().optional(),
  })).min(1, "At least one milestone is required"),
});

type EscrowFormData = z.infer<typeof escrowSchema>;

type EscrowWizardProps = {
  onComplete: () => void;
  onCancel: () => void;
};

const steps = [
  { id: 1, title: "Freelancer", description: "Select freelancer" },
  { id: 2, title: "Amount", description: "Set amount" },
  { id: 3, title: "Milestones", description: "Define deliverables" },
  { id: 4, title: "Review", description: "Confirm details" },
  { id: 5, title: "Confirm", description: "Transaction status" },
];

export function EscrowWizard({ onComplete, onCancel }: EscrowWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "signing" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EscrowFormData>({
    freelancerAddress: "",
    freelancerName: "",
    title: "",
    description: "",
    totalAmount: 0,
    currency: "USDC",
    milestones: [{ title: "", description: "", amount: 0, dueDate: "" }],
  });

  const addEscrow = useEscrowStore((state) => state.addEscrow);
  const session = useAuthStore((state) => state.session);

  const updateFormData = (data: Partial<EscrowFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTransactionStatus("signing");
    setError(null);

    try {
      // Simulate Freighter transaction signing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTransactionStatus("pending");

      // Simulate blockchain confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTransactionStatus("success");
      setTxHash(`tx_${Date.now()}_${Math.random().toString(36).slice(2)}`);

      // Create escrow in store
      const milestones: EscrowMilestone[] = formData.milestones.map((m, i) => ({
        id: `ms_${Date.now()}_${i}`,
        title: m.title,
        description: m.description,
        amount: m.amount,
        status: "PENDING" as const,
        dueDate: m.dueDate || undefined,
      }));

      const freelancer: EscrowParty = {
        address: formData.freelancerAddress,
        name: formData.freelancerName,
        role: "FREELANCER",
      };

      const client: EscrowParty = {
        address: session.address || "",
        role: "CLIENT",
      };

      const newEscrow: Escrow = {
        id: `esc_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        status: "FUNDED",
        client,
        freelancer,
        totalAmount: formData.totalAmount,
        releasedAmount: 0,
        currency: formData.currency,
        milestones,
        transactions: [
          {
            id: `tx_${Date.now()}`,
            type: "CREATED",
            amount: formData.totalAmount,
            from: session.address || "",
            to: formData.freelancerAddress,
            timestamp: new Date().toISOString(),
            txHash: txHash || undefined,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addEscrow(newEscrow);
    } catch (err) {
      setTransactionStatus("error");
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EscrowFreelancerStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <EscrowAmountStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <EscrowMilestonesStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 4:
        return <EscrowReviewStep data={formData} />;
      case 5:
        return (
          <EscrowConfirmationStep
            status={transactionStatus}
            txHash={txHash}
            error={error}
            escrowTitle={formData.title}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length;
  const canProceed = currentStep < 4 || currentStep === 5;

  return (
    <div className="w-full max-w-3xl">
      {/* Progress Steps */}
      <div className="mb-xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  currentStep > step.id
                    ? "border-primary bg-primary text-on-primary"
                    : currentStep === step.id
                    ? "border-primary bg-primary-tint text-primary"
                    : "border-divider bg-surface-container text-text-muted"
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={18} />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-sm hidden h-0.5 w-12 sm:block ${
                    currentStep > step.id ? "bg-primary" : "bg-divider"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-md flex justify-between text-xs text-text-muted sm:hidden">
          {steps.map((step) => (
            <span
              key={step.id}
              className={currentStep === step.id ? "text-primary font-semibold" : ""}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="mt-lg flex items-center justify-between">
        <button
          type="button"
          onClick={currentStep === 1 ? onCancel : prevStep}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-sm rounded-lg border border-border bg-white px-lg font-semibold text-text-primary transition hover:bg-surface-container-low disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          {currentStep === 1 ? "Cancel" : "Back"}
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={currentStep === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
          >
            {currentStep === 4 ? (
              <>
                <Wallet size={18} />
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing...
                  </>
                ) : (
                  "Sign & Fund Escrow"
                )}
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-95"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
