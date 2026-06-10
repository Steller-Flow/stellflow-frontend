import { ShieldCheck } from "lucide-react";

export function LandingDashboardPreview() {
  const rows = [
    {
      name: "Alex Rivera",
      amount: "2,400 USDC",
      status: "Released",
      color: "bg-status-success/10 text-status-success",
      avatar: "bg-secondary-container",
    },
    {
      name: "Sarah Chen",
      amount: "1,850 USDC",
      status: "Funded",
      color: "bg-status-info/10 text-status-info",
      avatar: "bg-tertiary-container",
    },
  ];

  return (
    <div className="relative fade-up [animation-delay:160ms]">
      <div className="rounded-xl border border-border bg-card-bg p-md shadow-xl transition-transform duration-500 hover:rotate-0 md:rotate-2">
        <div className="mb-md flex items-center justify-between border-b border-divider pb-md">
          <div className="flex gap-sm">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-medium text-text-muted">
            app.stellflow.io/dashboard
          </span>
        </div>

        <div className="space-y-md">
          <div className="flex items-end justify-between gap-md">
            <div>
              <p className="text-xs font-semibold uppercase text-text-muted">
                Total Balance
              </p>
              <p className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                45,280.50 USDC
              </p>
            </div>
            <div className="flex h-8 w-24 items-center justify-center rounded bg-primary-tint">
              <span className="text-xs font-bold text-primary">+12.5%</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-3 bg-bg-secondary px-md py-sm text-xs font-bold uppercase text-text-muted">
              <span>Contractor</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>
            <div className="space-y-sm bg-card-bg p-md">
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[1.2fr_0.8fr_0.7fr] items-center gap-sm"
                >
                  <div className="flex min-w-0 items-center gap-sm">
                    <span
                      className={`h-8 w-8 shrink-0 rounded-full ${row.avatar}`}
                    />
                    <span className="truncate text-sm font-medium">
                      {row.name}
                    </span>
                  </div>
                  <span className="text-right text-sm font-bold">
                    {row.amount}
                  </span>
                  <span
                    className={`rounded-full px-sm py-xs text-center text-[10px] font-bold uppercase ${row.color}`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface-container-low p-md">
            <div className="mb-xs flex justify-between gap-md">
              <span className="text-sm font-bold">Milestone 2: UI Design</span>
              <ShieldCheck className="text-primary" size={22} />
            </div>
            <div className="mb-sm h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-[65%] rounded-full bg-primary" />
            </div>
            <p className="text-xs text-text-secondary">
              Release scheduled for Friday, Oct 24
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
