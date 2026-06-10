import {
  Bell,
  CircleHelp,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Settings,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Brand } from "./Brand";
import { WalletModal } from "./WalletModal";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/escrows", label: "Escrows", icon: LockKeyhole },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type DashboardShellProps = {
  title: string;
  description: string;
  activeHref: string;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  description,
  activeHref,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-surface-bright text-text-primary">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-sidebar-width flex-col overflow-y-auto border-r border-divider bg-card-bg p-md lg:flex">
        <div className="mb-xl px-xs">
          <Brand caption="Enterprise Finance" compact />
        </div>
        <nav className="flex-1 space-y-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-md rounded-lg p-md font-medium transition active:translate-x-1 ${
                  active
                    ? "bg-primary-tint text-primary"
                    : "text-text-secondary hover:bg-surface-container-high hover:text-primary"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="space-y-xs border-t border-divider pt-xl">
          <a
            className="flex items-center gap-md rounded-lg p-md text-text-secondary transition hover:bg-surface-container-high"
            href="#"
          >
            <CircleHelp size={20} />
            <span>Support</span>
          </a>
        </div>
      </aside>

      <main className="min-h-screen p-md lg:ml-sidebar-width lg:p-lg">
        <header className="mb-xl flex min-h-topbar-height flex-col justify-center gap-md rounded-xl border border-divider bg-card-bg p-md shadow-sm md:flex-row md:items-center md:justify-between lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <div>
            <p className="mb-xs flex items-center gap-xs text-xs font-semibold uppercase text-primary">
              <Gauge size={15} />
              Workspace
            </p>
            <h1 className="font-display text-2xl font-semibold text-text-primary sm:text-4xl">
              {title}
            </h1>
            <p className="mt-xs text-text-secondary">{description}</p>
          </div>
          <div className="flex items-center gap-md">
            <Link
              href="/dashboard/notifications"
              className="rounded-full p-md text-text-secondary transition hover:bg-surface-container-low hover:text-primary"
              aria-label="Open notifications"
            >
              <Bell size={20} />
            </Link>
            <WalletModal />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <section className="rounded-xl border border-divider bg-card-bg p-xl shadow-sm">
      <div className="mx-auto flex max-w-[520px] flex-col items-center py-2xl text-center">
        <div className="relative mb-lg">
          <div className="absolute inset-0 rounded-full bg-primary-container/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint text-primary">
            <Icon size={36} />
          </div>
        </div>
        <h2 className="font-display mb-sm text-2xl font-semibold text-text-primary">
          {title}
        </h2>
        <p className="mb-xl text-text-secondary">{description}</p>
        <button className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-xl font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95">
          {action}
        </button>
      </div>
      <div className="grid gap-md md:grid-cols-3">
        {["Create", "Track", "Automate"].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-border bg-surface-container-low p-md"
          >
            <div className="mb-md h-2 w-24 rounded-full bg-primary-tint" />
            <div className="space-y-sm">
              <div className="h-3 rounded-full bg-surface-container-high" />
              <div className="h-3 w-2/3 rounded-full bg-surface-container-high" />
            </div>
            <p className="mt-md text-xs font-semibold uppercase text-text-muted">
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OverviewCards() {
  return (
    <div className="mb-lg grid gap-lg md:grid-cols-3">
      {[
        ["Total Balance", "0.00 USDC", ShieldCheck],
        ["Open Invoices", "0", FileText],
        ["Active Escrows", "0", LockKeyhole],
      ].map(([label, value, Icon]) => {
        const CardIcon = Icon as typeof ShieldCheck;

        return (
          <div
            key={label as string}
            className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm"
          >
            <div className="mb-lg flex h-11 w-11 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <CardIcon size={22} />
            </div>
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <p className="font-display mt-xs text-3xl font-semibold text-text-primary">
              {value as string}
            </p>
          </div>
        );
      })}
    </div>
  );
}
