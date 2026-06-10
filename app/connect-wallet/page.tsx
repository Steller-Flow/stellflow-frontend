import { CheckCircle2, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { Brand } from "../components/Brand";
import { WalletModal } from "../components/WalletModal";

export default function ConnectWalletPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_0%_0%,rgba(140,179,105,0.12),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(217,223,245,0.62),transparent_34%),#f8f9fa] px-md py-3xl text-text-primary">
      <section className="grid w-full max-w-6xl items-center gap-2xl lg:grid-cols-[1fr_440px]">
        <div className="fade-up">
          <Link href="/" className="mb-2xl inline-flex">
            <Brand caption="Enterprise Finance" />
          </Link>
          <p className="mb-md inline-flex items-center gap-sm rounded-full bg-primary-tint px-md py-xs text-sm font-semibold text-primary">
            <ShieldCheck size={16} />
            Secure Stellar wallet handoff
          </p>
          <h1 className="font-display mb-lg max-w-3xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
            Connect your wallet before creating your StellFlow workspace.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-text-secondary">
            Choose a Stellar wallet, confirm access, then continue through the
            onboarding steps before the dashboard is prepared.
          </p>
        </div>

        <div className="fade-up rounded-xl border border-border bg-card-bg p-xl shadow-sm [animation-delay:140ms]">
          <div className="mb-xl flex h-14 w-14 items-center justify-center rounded-lg bg-primary-tint text-primary">
            <Wallet size={30} />
          </div>
          <h2 className="font-display mb-sm text-2xl font-semibold">
            Start onboarding
          </h2>
          <p className="mb-xl text-text-secondary">
            Your dashboard stays locked until wallet selection and setup are
            complete.
          </p>
          <div className="mb-xl space-y-md">
            {[
              "Select a Stellar wallet",
              "Complete profile and workspace setup",
              "Verify security preferences",
            ].map((item) => (
              <div key={item} className="flex items-center gap-md">
                <CheckCircle2 className="shrink-0 text-primary" size={20} />
                <span className="font-medium text-text-primary">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-md sm:flex-row">
            <WalletModal defaultOpen />
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-white px-lg font-semibold text-text-primary transition hover:bg-surface-container-low"
            >
              Back Home
            </Link>
          </div>
          <div className="mt-lg flex items-center gap-sm rounded-lg bg-surface-container-low p-md text-sm text-text-secondary">
            <LockKeyhole className="shrink-0 text-primary" size={18} />
            Wallet access is used only to continue setup in this prototype.
          </div>
        </div>
      </section>
    </main>
  );
}
