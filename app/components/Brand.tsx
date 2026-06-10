import { WalletCards } from "lucide-react";
import Link from "next/link";

type BrandProps = {
  caption?: string;
  compact?: boolean;
};

export function Brand({ caption, compact = false }: BrandProps) {
  return (
    <Link href="/" className="flex items-center gap-sm">
      <span
        className={`flex items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm ${
          compact ? "h-9 w-9" : "h-11 w-11"
        }`}
      >
        <WalletCards size={compact ? 20 : 24} strokeWidth={2.2} />
      </span>
      <span>
        <span className="font-display block text-xl font-bold text-primary">
          StellFlow
        </span>
        {caption ? (
          <span className="block text-xs font-medium text-text-secondary">
            {caption}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
