import { Star } from "lucide-react";

interface TopPerformersProps {
  affiliates?: Affiliate[];
}

interface Affiliate {
  rank: number;
  name: string;
  sales: number;
  revenue: string;
  points: number;
  trend?: "up" | "down" | "same";
}

function getTopThree(affiliates?: Affiliate[]) {
  return affiliates
    ? [...affiliates].sort((a, b) => a.rank - b.rank).slice(0, 3)
    : [];
}

export function TopPerformers({ affiliates }: TopPerformersProps) {
  const topAffiliates = getTopThree(affiliates);

  if (topAffiliates.length === 0) {
    return (
      <div className="soft-panel rounded-2xl p-6 text-center text-sm text-muted-foreground">
        No leaderboard data available yet. Connect to the backend to show top
        performers.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {topAffiliates.map((affiliate) => (
        <div
          key={affiliate.rank}
          className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 ${
            affiliate.rank === 1
              ? "border-primary/30 bg-primary/[0.04] glow-primary"
              : affiliate.rank === 2
              ? "border-warning/20 bg-warning/[0.03]"
              : "border-border/80 bg-card/70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                affiliate.rank === 1
                  ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : affiliate.rank === 2
                  ? "bg-warning/20 text-warning"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {affiliate.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{affiliate.name}</p>
              <p className="text-xs text-muted-foreground">
                Rank #{affiliate.rank}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/80 bg-background/40 p-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Sales
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {affiliate.sales}
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/40 p-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Points
              </p>
              <p className="mt-1 text-lg font-bold text-primary">
                {affiliate.points.toLocaleString()}
              </p>
            </div>
          </div>
          {affiliate.rank === 1 && (
            <div className="absolute -right-2 -top-2 rounded-full gradient-primary p-2 shadow-lg shadow-primary/25">
              <Star className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
