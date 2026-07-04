import { ArrowRight } from "lucide-react";
import Link from "next/link";

const useCases = [
  {
    title: "For Freelancers",
    copy: "Use smart escrows to protect each milestone and reduce late payment risk.",
    accent: "bg-primary-tint",
  },
  {
    title: "For Remote Teams",
    copy: "Pay global talent in USDC without bank delays or excessive FX spreads.",
    accent: "bg-secondary-container",
  },
  {
    title: "For Agencies",
    copy: "Centralize client billing and subcontractor payouts in one workspace.",
    accent: "bg-tertiary-container",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-bg-secondary py-3xl">
      <div className="mx-auto w-full px-md sm:px-25">
        <h2 className="font-display mb-2xl text-center text-3xl font-semibold">
          Solutions for Every Professional
        </h2>
        <div className="grid gap-xl md:grid-cols-3">
          {useCases.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card-bg shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`h-48 ${item.accent} p-lg`}>
                <div className="h-full rounded-lg border border-white/70 bg-white/70 p-md shadow-inner">
                  <div className="mb-lg h-4 w-2/3 rounded-full bg-primary/20" />
                  <div className="grid h-[calc(100%-32px)] grid-cols-3 items-end gap-sm">
                    {[45, 75, 55].map((height) => (
                      <span
                        key={height}
                        className="rounded-t-lg bg-primary/70"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-xl">
                <h4 className="font-display mb-md text-xl font-medium">
                  {item.title}
                </h4>
                <p className="mb-lg flex-1 text-text-secondary">{item.copy}</p>
                <Link
                  href="/connect-wallet"
                  className="inline-flex items-center gap-xs text-sm font-bold text-primary"
                >
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
