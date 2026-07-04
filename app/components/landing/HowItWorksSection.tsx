const steps = [
  { title: "Create Invoice", description: "Define milestones and deliverables." },
  { title: "Fund Escrow", description: "Secure USDC on Stellar rails." },
  { title: "Complete Work", description: "Submit and review project output." },
  { title: "Release Payment", description: "Release approved funds instantly." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-3xl">
      <div className="mx-auto w-full px-md sm:px-25">
        <h2 className="font-display mb-3xl text-center text-3xl font-semibold">
          How StellFlow Works
        </h2>
        <div className="relative grid gap-xl md:grid-cols-4">
          <div className="absolute left-0 top-6 hidden h-[2px] w-full bg-divider md:block" />
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-full border-4 border-card-bg bg-primary font-bold text-on-primary shadow-sm">
                {index + 1}
              </div>
              <h4 className="mb-xs font-bold">{step.title}</h4>
              <p className="text-sm text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
