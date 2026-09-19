import { cn } from "@/lib/utils";

export function RankiflyLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        aria-label="Rankifly logo"
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full bg-transparent",
          compact ? "h-9 w-9" : "h-12 w-12"
        )}
      >
        <img
          src="/Rankifly_logo.png"
          alt="Rankifly logo"
          className={cn(
            "h-full w-full object-contain",
            compact ? "scale-110" : "scale-100"
          )}
        />
      </div>
      {!compact && (
        <span className="text-xl font-extrabold tracking-normal text-foreground">
          Rankifly
        </span>
      )}
    </div>
  );
}
