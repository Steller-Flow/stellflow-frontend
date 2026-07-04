import { Clock3, Landmark, ShieldAlert } from "lucide-react";

const problems = [
  {
    title: "Slow Transfers",
    description:
      "Legacy wires take days to clear and create cash-flow friction for distributed teams.",
    icon: Clock3,
  },
  {
    title: "High Fees",
    description:
      "Intermediary banks and conversion spreads eat into payment volume.",
    icon: Landmark,
  },
  {
    title: "No Protection",
    description:
      "Standard transfers lack milestone security and dispute-aware workflows.",
    icon: ShieldAlert,
  },
];

export function ProblemsSection() {
  return (
    <section id="features" className="py-25 ">
      <div className="mx-auto w-full px-md sm:px-25">
        <div className="mx-auto mb-3xl text-center">
          <h2 className="font-display mb-md text-3xl font-semibold">
            Managing Global Payments Is Still Broken
          </h2>
          <p className="text-text-secondary">
            Legacy systems were not built for the modern decentralized
            workforce.
          </p>
        </div>
        <div className="grid gap-xl md:grid-cols-3">
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <div
                key={problem.title}
                className="group flex h-full flex-col rounded-xl border border-border bg-card-bg p-xl shadow-sm transition hover:border-status-error"
              >
                <div className="mb-lg flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-status-error transition group-hover:scale-110">
                  <Icon size={26} />
                </div>
                <h3 className="font-display mb-md text-xl font-medium">
                  {problem.title}
                </h3>
                <p className="text-text-secondary">{problem.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
