import { ShieldCheck } from "lucide-react";
import { Brand } from "../Brand";

export function FooterSection() {
  return (
    <footer className="border-t border-divider bg-white px-md py-xl sm:px-25 mt-10">
      <div className="mx-auto flex w-full flex-col justify-between gap-md text-sm text-text-muted md:flex-row md:items-center">
        <Brand compact />
        <span>© 2026 StellFlow Infrastructure. All rights reserved.</span>
        <span className="flex items-center gap-xs">
          <ShieldCheck size={16} className="text-status-success" />
          All Systems Operational
        </span>
      </div>
    </footer>
  );
}
