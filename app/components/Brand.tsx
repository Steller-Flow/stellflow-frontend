import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  caption?: string;
  compact?: boolean;
};

export function Brand({ caption, compact = false }: BrandProps) {
  return (
    <Link href="/" className="flex items-center gap-sm">
      <span
        className={`relative overflow-hidden rounded-3xl bg-primary shadow-sm ${
          compact ? "h-9 w-9" : "h-11 w-11"
        }`}
      >
        <Image
          src="/stellflow-logo.svg"
          alt="StellFlow logo"
          fill
          className="object-contain"
        />
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
