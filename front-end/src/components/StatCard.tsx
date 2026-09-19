import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "soft-panel rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:glow-primary",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {change && (
            <p
              className={cn("text-xs font-medium", {
                "text-emerald-400": changeType === "positive",
                "text-destructive": changeType === "negative",
                "text-muted-foreground": changeType === "neutral",
              })}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shadow-inner shadow-primary/10 ring-1 ring-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
