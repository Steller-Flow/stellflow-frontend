import Link from "next/link";

export function CTASection() {
  return (
    <section className="px-md py-3xl">
      <div className="mx-auto w-full rounded-xl bg-primary py-2xl text-center text-on-primary sm:py-3xl sm:px-25">
        <h2 className="font-display mx-auto mb-lg text-3xl font-bold sm:text-5xl">
          Start Sending and Receiving <br /> Payments Globally.
        </h2>
        <p className="mx-auto mb-2xl text-primary-light">
          Join teams using StellFlow for secure, instant, and borderless
          financial operations.
        </p>
        <div className="flex flex-wrap justify-center gap-md">
          <Link
            href="/connect-wallet"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-on-primary px-xl font-extrabold text-primary shadow-lg transition hover:bg-primary-tint"
          >
            Open Free Account
          </Link>
          <a
            href="mailto:sales@stellflow.io"
            className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary-light px-xl font-extrabold text-on-primary transition hover:bg-white/10"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}
