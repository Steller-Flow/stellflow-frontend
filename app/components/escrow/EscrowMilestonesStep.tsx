"use client";

import { Plus, Trash2, Calendar, DollarSign, FileText } from "lucide-react";

type Milestone = {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
};

type EscrowMilestonesStepProps = {
  data: {
    milestones: Milestone[];
    totalAmount: number;
  };
  onUpdate: (data: { milestones?: Milestone[] }) => void;
};

export function EscrowMilestonesStep({ data, onUpdate }: EscrowMilestonesStepProps) {
  const addMilestone = () => {
    onUpdate({
      milestones: [
        ...data.milestones,
        { title: "", description: "", amount: 0, dueDate: "" },
      ],
    });
  };

  const removeMilestone = (index: number) => {
    if (data.milestones.length <= 1) return;
    onUpdate({
      milestones: data.milestones.filter((_, i) => i !== index),
    });
  };

  const updateMilestone = (index: number, updates: Partial<Milestone>) => {
    const updated = data.milestones.map((m, i) =>
      i === index ? { ...m, ...updates } : m
    );
    onUpdate({ milestones: updated });
  };

  const totalMilestoneAmount = data.milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const remaining = data.totalAmount - totalMilestoneAmount;

  return (
    <div className="space-y-lg">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Define Milestones
        </h2>
        <p className="mt-xs text-text-secondary">
          Break down the project into deliverable milestones with individual amounts.
        </p>
      </div>

      <div className="space-y-md">
        {data.milestones.map((milestone, index) => (
          <div
            key={index}
            className="rounded-lg border border-divider bg-surface-container-low p-md"
          >
            <div className="mb-md flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                Milestone {index + 1}
              </span>
              {data.milestones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="rounded p-sm text-text-muted transition hover:bg-error-container hover:text-status-error"
                  aria-label="Remove milestone"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="space-y-md">
              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-muted">
                  Title
                </span>
                <span className="relative">
                  <span className="pointer-events-none absolute left-sm top-1/2 -translate-y-1/2 text-text-muted">
                    <FileText size={14} />
                  </span>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, { title: e.target.value })}
                    className="brand-field h-10 w-full rounded-lg border border-border bg-white pl-8 pr-md text-sm text-text-primary transition"
                    placeholder="Frontend Development"
                  />
                </span>
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-xs font-semibold uppercase text-text-muted">
                  Description
                </span>
                <textarea
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, { description: e.target.value })}
                  className="brand-field min-h-[60px] w-full rounded-lg border border-border bg-white px-md py-sm text-sm text-text-primary transition"
                  placeholder="What will be delivered in this milestone?"
                />
              </label>

              <div className="grid grid-cols-2 gap-md">
                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-muted">
                    Amount
                  </span>
                  <span className="relative">
                    <span className="pointer-events-none absolute left-sm top-1/2 -translate-y-1/2 text-text-muted">
                      <DollarSign size={14} />
                    </span>
                    <input
                      type="number"
                      value={milestone.amount || ""}
                      onChange={(e) =>
                        updateMilestone(index, { amount: parseFloat(e.target.value) || 0 })
                      }
                      className="brand-field h-10 w-full rounded-lg border border-border bg-white pl-8 pr-md text-sm text-text-primary transition"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </span>
                </label>

                <label className="flex flex-col gap-xs">
                  <span className="text-xs font-semibold uppercase text-text-muted">
                    Due Date
                  </span>
                  <span className="relative">
                    <span className="pointer-events-none absolute left-sm top-1/2 -translate-y-1/2 text-text-muted">
                      <Calendar size={14} />
                    </span>
                    <input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) => updateMilestone(index, { dueDate: e.target.value })}
                      className="brand-field h-10 w-full rounded-lg border border-border bg-white pl-8 pr-md text-sm text-text-primary transition"
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMilestone}
        className="inline-flex h-11 items-center justify-center gap-sm rounded-lg border border-dashed border-border bg-white px-lg font-semibold text-primary transition hover:bg-primary-tint"
      >
        <Plus size={18} />
        Add Milestone
      </button>

      <div className="rounded-lg bg-surface-container-low p-md">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total Milestone Amount</span>
          <span className="font-semibold text-text-primary">
            ${totalMilestoneAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Escrow Amount</span>
          <span className="font-semibold text-text-primary">
            ${data.totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="mt-sm flex justify-between border-t border-divider pt-sm text-sm">
          <span className="font-semibold text-text-primary">Remaining</span>
          <span
            className={`font-semibold ${
              remaining < 0
                ? "text-status-error"
                : remaining === 0
                ? "text-status-success"
                : "text-text-primary"
            }`}
          >
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
