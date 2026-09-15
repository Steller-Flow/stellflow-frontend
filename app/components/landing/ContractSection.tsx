import { ContractStatus } from "../ContractStatus";

/**
 * Replaces the former metrics strip ("$240M+ processed", "150k+ invoices"),
 * none of which was true. Everything in this section is read from the
 * deployed escrow contract at page load.
 */
export function ContractSection() {
  return (
    <section id="contract" className="bg-primary-tint py-2xl">
      <div className="mx-auto w-full max-w-(--container-6xl) px-md sm:px-xl">
        <div className="mb-lg text-center">
          <p className="mb-xs text-sm font-semibold uppercase tracking-wide text-primary">On-chain, today</p>
          <h2 className="font-display text-3xl font-bold text-text-primary">
            The escrow contract is deployed and verifiable
          </h2>
          <p className="mx-auto mt-sm max-w-(--container-2xl) text-text-secondary">
            StellFlow&apos;s Soroban escrow contract runs on Stellar testnet with a SEP-0055
            verified build. This panel queries it live from your browser.
          </p>
        </div>
        <ContractStatus />
      </div>
    </section>
  );
}
