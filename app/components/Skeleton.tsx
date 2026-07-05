"use client";

import { motion } from "framer-motion";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      className={`shimmer rounded bg-surface-container-high ${className}`}
    />
  );
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div className={`rounded-xl border border-divider bg-card-bg p-lg shadow-sm ${className}`}>
      <div className="space-y-md">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-divider bg-card-bg shadow-sm">
      <div className="p-lg">
        <Skeleton className="mb-md h-4 w-1/4" />
        <div className="space-y-md">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-md">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={`h-4 ${colIndex === 0 ? "w-1/4" : "w-1/6"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart({ className = "" }: SkeletonProps) {
  return (
    <div className={`rounded-xl border border-divider bg-card-bg p-lg shadow-sm ${className}`}>
      <div className="mb-lg flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className="h-[200px] flex items-end gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm">
      <div className="flex items-start justify-between">
        <Skeleton className="h-11 w-11 rounded-lg" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-md h-3 w-24" />
      <Skeleton className="mt-xs h-8 w-32" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonButton({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-11 w-32 rounded-lg ${className}`} />;
}

export function SkeletonInvoiceList() {
  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <SkeletonButton />
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />

      <div className="rounded-xl border border-divider bg-card-bg shadow-sm">
        <div className="divide-y divide-divider">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-lg px-lg py-lg">
              <SkeletonAvatar />
              <div className="flex-1 space-y-sm">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <SkeletonButton className="!h-9 !w-9 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonEscrowList() {
  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <SkeletonButton />
      </div>

      <div className="grid gap-lg">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm"
          >
            <div className="mb-lg flex items-start justify-between">
              <div className="flex-1 space-y-sm">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="mb-lg grid grid-cols-2 gap-lg md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-xs">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>

            <Skeleton className="mb-lg h-2 w-full rounded-full" />

            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonAnalytics() {
  return (
    <div className="space-y-lg">
      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      <SkeletonChart className="max-w-lg mx-auto" />
    </div>
  );
}
