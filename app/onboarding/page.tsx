import { Brand } from "../components/Brand";
import { OnboardingForm } from "../components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_0%_0%,rgba(140,179,105,0.08),transparent_32%),radial-gradient(circle_at_100%_100%,rgba(217,223,245,0.7),transparent_34%),#fafbfc] p-md">
      <div className="flex w-full flex-col items-center gap-xl">
        <Brand />
        <OnboardingForm />
        <p className="text-center text-sm text-text-muted">
          Having trouble?{" "}
          <a className="font-semibold text-primary hover:underline" href="#">
            Contact Support
          </a>{" "}
          or visit our{" "}
          <a className="font-semibold text-primary hover:underline" href="#">
            Help Center
          </a>
          .
        </p>
      </div>
    </main>
  );
}
