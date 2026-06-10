import { WorkspaceLoader } from "../../components/WorkspaceLoader";

export default function AuthLoadingPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-text-primary">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary-tint blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-secondary-container blur-[120px]" />
      </div>
      <WorkspaceLoader />
    </div>
  );
}
