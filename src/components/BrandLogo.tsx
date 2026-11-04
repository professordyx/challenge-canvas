import { cn } from "@/lib/utils";

type Variant = "horizontal" | "vertical" | "symbol";

interface BrandLogoProps {
  variant?: Variant;
  className?: string;
  /** Height of the symbol in px; wordmark scales with it. */
  size?: number;
}

/** challenge canvas symbol: 48u grid, 20u squares (r=4u), 4u gap, 10u-radius sphere top-right. */
export const BrandSymbol = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="4" className="fill-brand-navy" />
    <circle cx="36" cy="12" r="10" className="fill-brand-teal" />
    <rect x="2" y="26" width="20" height="20" rx="4" className="fill-brand-navy" />
    <rect x="26" y="26" width="20" height="20" rx="4" className="fill-brand-navy" />
  </svg>
);

const BrandLogo = ({ variant = "horizontal", className, size = 32 }: BrandLogoProps) => {
  if (variant === "symbol") {
    return (
      <span role="img" aria-label="challenge canvas" className={className}>
        <BrandSymbol size={size} />
      </span>
    );
  }

  const fontSize = size * 0.62;
  const word = (
    <span
      className={cn("font-display leading-none tracking-tight", variant === "vertical" && "flex flex-col items-center")}
      style={{ fontSize, fontFamily: "'Exo 2', system-ui, sans-serif" }}
    >
      <span className="font-bold text-brand-navy">challenge</span>
      {variant === "horizontal" ? " " : null}
      <span className="font-normal text-brand-teal">canvas</span>
    </span>
  );

  return (
    <span
      role="img"
      aria-label="challenge canvas"
      className={cn(
        "inline-flex items-center",
        variant === "vertical" ? "flex-col gap-2" : "gap-2.5",
        className,
      )}
    >
      <BrandSymbol size={size} />
      {word}
    </span>
  );
};

export default BrandLogo;
