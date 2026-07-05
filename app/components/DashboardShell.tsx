"use client";

import {
  Bell,
  CircleHelp,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Settings,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "./Brand";
import { DashboardAccount, DashboardGuard } from "./DashboardAccount";
import { useUIStore } from "../lib/stores/uiStore";

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

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
  const {
    sidebar: { collapsed, mobileOpen },
    toggleSidebar,
    setSidebarCollapsed,
    setMobileSidebarOpen,
  } = useUIStore();

  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileOpen]);

  const sidebarExpanded = isHovering && collapsed && !isMobile;
  const showSidebarText = !collapsed || sidebarExpanded || mobileOpen;

  return (
    <DashboardGuard>
      <div className="min-h-screen bg-surface-bright text-text-primary">
        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileOpen)}
          className="fixed left-md top-md z-50 flex h-11 w-11 items-center justify-center rounded-lg border border-divider bg-card-bg shadow-sm lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <motion.aside
          className="fixed left-0 top-0 z-40 hidden h-full flex-col overflow-y-auto border-r border-divider bg-card-bg p-md lg:flex"
          animate={{
            width: sidebarExpanded ? 280 : collapsed ? 72 : 280,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onMouseEnter={() => collapsed && setIsHovering(true)}
          onMouseLeave={() => collapsed && setIsHovering(false)}
        >
          <div className="mb-xl px-xs">
            <Brand caption={showSidebarText ? "Enterprise Finance" : undefined} compact />
          </div>
          <nav className="flex-1 space-y-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!showSidebarText ? item.label : undefined}
                  className={`flex items-center gap-md rounded-lg p-md font-medium transition active:translate-x-1 ${
                    active
                      ? "bg-primary-tint text-primary"
                      : "text-text-secondary hover:bg-surface-container-high hover:text-primary"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  <AnimatePresence>
                    {showSidebarText && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>
          <div className="space-y-xs border-t border-divider pt-xl">
            <a
              className="flex items-center gap-md rounded-lg p-md text-text-secondary transition hover:bg-surface-container-high"
              href="#"
              title={!showSidebarText ? "Support" : undefined}
            >
              <CircleHelp size={20} className="shrink-0" />
              <AnimatePresence>
                {showSidebarText && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Support
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          </div>
        </motion.aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isMobile && mobileOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col overflow-y-auto border-r border-divider bg-card-bg p-md lg:hidden"
            >
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
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-md rounded-lg p-md font-medium transition active:translate-x-1 ${
                        active
                          ? "bg-primary-tint text-primary"
                          : "text-text-secondary hover:bg-surface-container-high hover:text-primary"
                      }`}
                    >
                      <Icon size={20} className="shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="space-y-xs border-t border-divider pt-xl">
                <a
                  className="flex items-center gap-md rounded-lg p-md text-text-secondary transition hover:bg-surface-container-high"
                  href="#"
                >
                  <CircleHelp size={20} className="shrink-0" />
                  <span>Support</span>
                </a>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.main
          className="min-h-screen p-md lg:p-lg"
          animate={{
            marginLeft: isMobile ? 0 : sidebarExpanded ? 280 : collapsed ? 72 : 280,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
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
            <DashboardAccount />
          </header>

          {children}
        </motion.main>
      </div>
    </DashboardGuard>
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
  const cards: Array<{
    label: string;
    value: string;
    icon: IconComponent;
  }> = [
    { label: "Total Balance", value: "0.00 USDC", icon: ShieldCheck },
    { label: "Open Invoices", value: "0", icon: FileText },
    { label: "Active Escrows", value: "0", icon: LockKeyhole },
  ];

  return (
    <div className="mb-lg grid gap-lg md:grid-cols-3">
      {cards.map(({ label, value, icon: CardIcon }) => {
        return (
          <div
            key={label}
            className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm"
          >
            <div className="mb-lg flex h-11 w-11 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <CardIcon size={22} />
            </div>
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <p className="font-display mt-xs text-3xl font-semibold text-text-primary">
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
