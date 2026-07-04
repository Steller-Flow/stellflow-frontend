const metrics = [
  ["$240M+", "Payments Processed"],
  ["150k+", "Invoices Generated"],
  ["45", "Countries Supported"],
  ["0.5s", "Average Settlement Time"],
];

export function MetricsSection() {
  return (
    <section className="py-25 mt-2 bg-primary-tint">
      <div className="mx-auto grid w-full grid-cols-1 gap-lg px-md sm:grid-cols-2 sm:px-[100px] lg:grid-cols-4">
        {metrics.map(([value, label]) => (
          <div
            key={label}
            className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-border bg-card-bg p-lg text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="font-display mb-xs text-3xl font-bold text-primary">
              {value}
            </p>
            <p className="text-sm font-medium text-text-secondary">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
