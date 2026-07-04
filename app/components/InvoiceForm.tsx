"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Globe2,
  Mail,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import type { Currency } from "../lib/invoiceTypes";
import { CURRENCY_SYMBOLS } from "../lib/invoiceTypes";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0.01, "Unit price must be greater than 0"),
});

const invoiceSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientAddress: z.string().optional(),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  currency: z.enum(["USDC", "XLM", "USD"]),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
  taxRate: z.number().min(0).max(1, "Tax rate must be between 0% and 100%"),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

type InvoiceFormProps = {
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
};

const steps = [
  { title: "Client Details", description: "Who is this invoice for?" },
  { title: "Line Items", description: "What are you billing for?" },
  { title: "Review & Submit", description: "Verify and send your invoice" },
];

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
      {children}
    </span>
  );
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const [step, setStep] = useState(0);
  const lastStep = step === steps.length - 1;

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currency: "USDC",
      lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchedLineItems = form.watch("lineItems");
  const watchedTaxRate = form.watch("taxRate");
  const watchedCurrency = form.watch("currency");

  const subtotal = watchedLineItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const taxAmount = subtotal * watchedTaxRate;
  const total = subtotal + taxAmount;
  const currencySymbol = CURRENCY_SYMBOLS[watchedCurrency];

  const handleNext = async () => {
    if (step === 0) {
      const valid = await form.trigger(["clientName", "clientEmail", "issueDate", "dueDate"]);
      if (!valid) return;
    } else if (step === 1) {
      const valid = await form.trigger(["lineItems"]);
      if (!valid) return;
    }
    setStep((current) => current + 1);
  };

  const handleBack = () => {
    setStep((current) => current - 1);
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <section className="w-full max-w-[800px] fade-up">
      <div className="overflow-hidden rounded-xl border border-border bg-card-bg shadow-sm">
        <header className="px-xl pb-base pt-xl">
          <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
            {steps[step].title}
          </h2>
          <p className="mt-base text-text-secondary">{steps[step].description}</p>
        </header>

        <form className="flex flex-col gap-lg p-xl" onSubmit={(e) => e.preventDefault()}>
          {step === 0 && (
            <>
              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Client Name
                </span>
                <span className="relative">
                  <FieldIcon>
                    <User size={18} />
                  </FieldIcon>
                  <input
                    {...form.register("clientName")}
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="Acme Corporation"
                    type="text"
                  />
                </span>
                {form.formState.errors.clientName && (
                  <span className="text-xs text-status-error">
                    {form.formState.errors.clientName.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Client Email
                </span>
                <span className="relative">
                  <FieldIcon>
                    <Mail size={18} />
                  </FieldIcon>
                  <input
                    {...form.register("clientEmail")}
                    className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    placeholder="billing@acme.com"
                    type="email"
                  />
                </span>
                {form.formState.errors.clientEmail && (
                  <span className="text-xs text-status-error">
                    {form.formState.errors.clientEmail.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-primary">
                  Client Address (Optional)
                </span>
                <textarea
                  {...form.register("clientAddress")}
                  className="brand-field min-h-[80px] w-full rounded-lg border border-border bg-white px-md py-sm text-text-primary transition"
                  placeholder="123 Business St, City, Country"
                />
              </label>

              <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-primary">
                    Issue Date
                  </span>
                  <span className="relative">
                    <FieldIcon>
                      <Calendar size={18} />
                    </FieldIcon>
                    <input
                      {...form.register("issueDate")}
                      className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                      type="date"
                    />
                  </span>
                  {form.formState.errors.issueDate && (
                    <span className="text-xs text-status-error">
                      {form.formState.errors.issueDate.message}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-primary">
                    Due Date
                  </span>
                  <span className="relative">
                    <FieldIcon>
                      <Calendar size={18} />
                    </FieldIcon>
                    <input
                      {...form.register("dueDate")}
                      className="brand-field h-12 w-full rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                      type="date"
                    />
                  </span>
                  {form.formState.errors.dueDate && (
                    <span className="text-xs text-status-error">
                      {form.formState.errors.dueDate.message}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-primary">
                    Currency
                  </span>
                  <span className="relative">
                    <FieldIcon>
                      <Globe2 size={18} />
                    </FieldIcon>
                    <select
                      {...form.register("currency")}
                      className="brand-field h-12 w-full appearance-none rounded-lg border border-border bg-white pl-12 pr-md text-text-primary transition"
                    >
                      <option value="USDC">USDC</option>
                      <option value="XLM">XLM (Stellar)</option>
                      <option value="USD">USD</option>
                    </select>
                  </span>
                </label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-md">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-md rounded-lg border border-border bg-surface-container-low p-md md:grid-cols-[1fr_100px_120px_120px_40px]"
                  >
                    <label className="flex flex-col gap-xs">
                      <span className="text-xs font-semibold uppercase text-text-muted">
                        Description
                      </span>
                      <input
                        {...form.register(`lineItems.${index}.description`)}
                        className="brand-field h-10 w-full rounded-lg border border-border bg-white px-md text-sm text-text-primary transition"
                        placeholder="Service or product"
                      />
                      {form.formState.errors.lineItems?.[index]?.description && (
                        <span className="text-xs text-status-error">
                          {form.formState.errors.lineItems[index]?.description?.message}
                        </span>
                      )}
                    </label>

                    <label className="flex flex-col gap-xs">
                      <span className="text-xs font-semibold uppercase text-text-muted">
                        Qty
                      </span>
                      <input
                        {...form.register(`lineItems.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        className="brand-field h-10 w-full rounded-lg border border-border bg-white px-md text-sm text-text-primary transition"
                        type="number"
                        min="1"
                      />
                    </label>

                    <label className="flex flex-col gap-xs">
                      <span className="text-xs font-semibold uppercase text-text-muted">
                        Unit Price
                      </span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-sm top-1/2 -translate-y-1/2 text-sm text-text-muted">
                          {currencySymbol}
                        </span>
                        <input
                          {...form.register(`lineItems.${index}.unitPrice`, {
                            valueAsNumber: true,
                          })}
                          className="brand-field h-10 w-full rounded-lg border border-border bg-white pl-7 pr-md text-sm text-text-primary transition"
                          type="number"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </label>

                    <div className="flex flex-col gap-xs">
                      <span className="text-xs font-semibold uppercase text-text-muted">
                        Amount
                      </span>
                      <div className="flex h-10 items-center px-md text-sm font-semibold text-text-primary">
                        {currencySymbol}
                        {(
                          (watchedLineItems[index]?.quantity || 0) *
                          (watchedLineItems[index]?.unitPrice || 0)
                        ).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-end">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition hover:bg-error-container hover:text-status-error"
                          aria-label="Remove line item"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  append({ description: "", quantity: 1, unitPrice: 0 })
                }
                className="inline-flex h-11 items-center justify-center gap-sm rounded-lg border border-dashed border-border bg-white font-semibold text-primary transition hover:bg-primary-tint"
              >
                <Plus size={18} />
                Add Line Item
              </button>

              {form.formState.errors.lineItems?.root && (
                <span className="text-xs text-status-error">
                  {form.formState.errors.lineItems.root.message}
                </span>
              )}

              <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                <div className="space-y-md">
                  <label className="flex flex-col gap-xs">
                    <span className="text-xs font-semibold uppercase text-text-primary">
                      Tax Rate (%)
                    </span>
                    <div className="relative">
                      <input
                        {...form.register("taxRate", {
                          valueAsNumber: true,
                          onChange: (e) => {
                            const value = parseFloat(e.target.value);
                            form.setValue("taxRate", isNaN(value) ? 0 : value / 100);
                          },
                        })}
                        className="brand-field h-12 w-full rounded-lg border border-border bg-white px-md text-text-primary transition"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={(watchedTaxRate * 100).toFixed(1)}
                      />
                      <span className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        %
                      </span>
                    </div>
                  </label>

                  <label className="flex flex-col gap-xs">
                    <span className="text-xs font-semibold uppercase text-text-primary">
                      Notes (Optional)
                    </span>
                    <textarea
                      {...form.register("notes")}
                      className="brand-field min-h-[80px] w-full rounded-lg border border-border bg-white px-md py-sm text-text-primary transition"
                      placeholder="Payment terms, thank you note, etc."
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-border bg-surface-container-low p-lg">
                  <h4 className="mb-md font-semibold text-text-primary">Summary</h4>
                  <div className="space-y-sm text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-medium text-text-primary">
                        {currencySymbol}
                        {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        Tax ({(watchedTaxRate * 100).toFixed(1)}%)
                      </span>
                      <span className="font-medium text-text-primary">
                        {currencySymbol}
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-divider pt-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold text-text-primary">Total</span>
                        <span className="font-bold text-primary">
                          {currencySymbol}
                          {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-lg">
              <div className="rounded-xl border border-border bg-surface-container-low p-lg">
                <h4 className="mb-md font-semibold text-text-primary">Client Information</h4>
                <div className="grid grid-cols-1 gap-md text-sm md:grid-cols-2">
                  <div>
                    <p className="text-text-muted">Name</p>
                    <p className="font-medium text-text-primary">
                      {form.getValues("clientName")}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted">Email</p>
                    <p className="font-medium text-text-primary">
                      {form.getValues("clientEmail")}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted">Issue Date</p>
                    <p className="font-medium text-text-primary">
                      {form.getValues("issueDate")}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted">Due Date</p>
                    <p className="font-medium text-text-primary">
                      {form.getValues("dueDate")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-container-low p-lg">
                <h4 className="mb-md font-semibold text-text-primary">Line Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-divider">
                        <th className="pb-sm text-left font-semibold text-text-muted">
                          Description
                        </th>
                        <th className="pb-sm text-right font-semibold text-text-muted">
                          Qty
                        </th>
                        <th className="pb-sm text-right font-semibold text-text-muted">
                          Price
                        </th>
                        <th className="pb-sm text-right font-semibold text-text-muted">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchedLineItems.map((item, index) => (
                        <tr key={index} className="border-b border-divider/50">
                          <td className="py-sm text-text-primary">
                            {item.description || "Untitled"}
                          </td>
                          <td className="py-sm text-right text-text-secondary">
                            {item.quantity}
                          </td>
                          <td className="py-sm text-right text-text-secondary">
                            {currencySymbol}
                            {item.unitPrice?.toFixed(2)}
                          </td>
                          <td className="py-sm text-right font-medium text-text-primary">
                            {currencySymbol}
                            {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-primary bg-primary-tint p-lg">
                <div className="space-y-sm text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-medium text-text-primary">
                      {currencySymbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">
                      Tax ({(watchedTaxRate * 100).toFixed(1)}%)
                    </span>
                    <span className="font-medium text-text-primary">
                      {currencySymbol}
                      {taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-primary/20 pt-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-text-primary">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {currencySymbol}
                        {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {form.getValues("notes") && (
                <div className="rounded-xl border border-border bg-surface-container-low p-lg">
                  <h4 className="mb-sm font-semibold text-text-primary">Notes</h4>
                  <p className="text-sm text-text-secondary">
                    {form.getValues("notes")}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-base flex flex-col items-center gap-md sm:flex-row">
            <button
              type="button"
              onClick={step === 0 ? onCancel : handleBack}
              className="inline-flex h-11 w-full items-center justify-center gap-xs rounded-lg border border-border bg-white px-xl font-semibold text-text-primary transition hover:bg-surface-container-low active:scale-[0.98] sm:w-auto"
            >
              <ArrowLeft size={18} />
              {step === 0 ? "Cancel" : "Back"}
            </button>

            {lastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-11 w-full flex-1 items-center justify-center gap-xs rounded-lg bg-primary-container font-semibold text-on-primary transition hover:bg-primary-hover active:scale-[0.98]"
              >
                Create Invoice
                <Check size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-11 w-full flex-1 items-center justify-center gap-xs rounded-lg bg-primary-container font-semibold text-on-primary transition hover:bg-primary-hover active:scale-[0.98]"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            )}
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
