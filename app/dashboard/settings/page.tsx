"use client";

import { Settings } from "lucide-react";
import { DashboardShell, EmptyState } from "../../components/DashboardShell";

export default function SettingsPage() {
  return (
    <DashboardShell
      activeHref="/dashboard/settings"
      title="Settings"
      description="Manage workspace, wallet, compliance, and notification preferences."
    >
      <EmptyState
        icon={Settings}
        title="Settings are ready to configure"
        description="Add team members, adjust approval policies, and tune notification rules for your finance workspace."
        action="Open Preferences"
      />
    </DashboardShell>
  );
}
