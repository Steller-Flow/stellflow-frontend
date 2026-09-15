"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardShell } from "../../components/DashboardShell";
import { AnalyticsCharts } from "../../components/analytics/AnalyticsCharts";
import { SkeletonAnalytics } from "../../components/Skeleton";
import { AnalyticsEmptyState } from "../../components/empty-states";
import { DEMO_MODE } from "../../lib/demo";

export default function AnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardShell
      activeHref="/dashboard/analytics"
      title="Analytics"
      description="View payment volume, settlement speed, and escrow performance."
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SkeletonAnalytics />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {DEMO_MODE ? (
              <AnalyticsCharts />
            ) : (
              <AnalyticsEmptyState onNavigate={() => router.push("/dashboard/invoices/new")} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
