"use client";

import { motion } from "framer-motion";

type EmptyStateCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  features?: string[];
};

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  features,
}: EmptyStateCardProps) {
  return (
    <section className="rounded-xl border border-divider bg-card-bg p-xl shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex max-w-[520px] flex-col items-center py-2xl text-center"
      >
        <div className="relative mb-lg">
          <div className="absolute inset-0 rounded-full bg-primary-container/20 blur-xl" />
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint text-primary"
          >
            <Icon size={36} />
          </motion.div>
        </div>
        <h2 className="font-display mb-sm text-2xl font-semibold text-text-primary">
          {title}
        </h2>
        <p className="mb-xl text-text-secondary">{description}</p>
        <button
          type="button"
          onClick={onAction}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-xl font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95"
        >
          {actionLabel}
        </button>
      </motion.div>
      {features && features.length > 0 && (
        <div className="grid gap-md md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-lg border border-border bg-surface-container-low p-md"
            >
              <div className="mb-md h-2 w-24 rounded-full bg-primary-tint" />
              <div className="space-y-sm">
                <div className="h-3 rounded-full bg-surface-container-high" />
                <div className="h-3 w-2/3 rounded-full bg-surface-container-high" />
              </div>
              <p className="mt-md text-xs font-semibold uppercase text-text-muted">
                {feature}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
