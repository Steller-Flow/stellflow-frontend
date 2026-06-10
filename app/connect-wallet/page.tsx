import { Bell, BarChart3 } from "lucide-react";
import { Brand } from "../components/Brand";
import { WalletModal } from "../components/WalletModal";

export default function ConnectWalletPage() {
  return (
    <div className="min-h-screen bg-surface-bright text-text-primary">
      <aside className="fixed left-0 top-0 hidden h-full w-sidebar-width flex-col border-r border-divider bg-card-bg p-md lg:flex">
        <div className="mb-xl px-xs">
          <Brand caption="Enterprise Finance" compact />
        </div>
        <nav className="space-y-xs">
          {["Dashboard", "Invoices", "Escrows", "Analytics"].map((item, index) => (
            <div
              key={item}
              className={`rounded-lg p-md font-medium ${
                index === 0
                  ? "bg-primary-tint text-primary"
                  : "text-text-secondary"
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen p-lg lg:ml-sidebar-width">
        <header className="mb-xl flex min-h-topbar-height items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">
              Financial Overview
            </h1>
            <p className="text-text-secondary">
              Monitor your enterprise assets on Stellar
            </p>
          </div>
          <div className="flex items-center gap-md">
            <button className="rounded-full p-md transition hover:bg-surface-container-low">
              <Bell size={20} />
            </button>
            <WalletModal defaultOpen />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-lg md:grid-cols-3">
          <div className="rounded-xl border border-divider bg-card-bg p-lg shadow-sm md:col-span-2">
            <div className="mb-xl flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">
                Volume Analytics
              </h2>
              <span className="rounded-full bg-primary-tint px-md py-xs text-xs font-semibold text-primary">
                7 Days
              </span>
            </div>
            <div className="flex h-64 items-end gap-sm">
              {[40, 60, 35, 85, 55, 70, 95].map((height) => (
                <span
                  key={height}
                  className="flex-1 rounded-t-lg bg-primary-container transition hover:bg-primary"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-lg text-on-primary shadow-sm">
            <div>
              <span className="text-xs font-semibold uppercase opacity-80">
                Global Network
              </span>
              <h2 className="font-display mt-xs text-3xl font-semibold">
                Real-time settlement.
              </h2>
            </div>
            <div>
              <BarChart3 className="my-xl opacity-70" size={64} />
              <p className="mb-lg">
                Access institutional-grade assets with StellFlow&apos;s direct
                bridge.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
