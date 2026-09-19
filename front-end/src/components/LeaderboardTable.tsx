import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Affiliate {
  rank: number;
  name: string;
  sales: number;
  revenue: string;
  points: number;
  trend?: "up" | "down" | "same";
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary">
        <Trophy className="h-3.5 w-3.5 text-primary-foreground" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/20">
        <Medal className="h-3.5 w-3.5 text-warning" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-chart-5/20">
        <Medal className="h-3.5 w-3.5 text-chart-5" />
      </div>
    );
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
      {rank}
    </div>
  );
}

export function LeaderboardTable({
  items,
  limit,
}: {
  items?: Affiliate[];
  limit?: number;
}) {
  const data = items ? (limit ? items.slice(0, limit) : items) : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/80 bg-background/30 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Affiliate</th>
            <th className="px-4 py-3 text-right">Sales</th>
            <th className="px-4 py-3 text-right">Revenue</th>
            <th className="px-4 py-3 text-right">Points</th>
            <th className="px-4 py-3 text-right">Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 text-center text-sm text-muted-foreground"
              >
                No affiliate data found yet. Connect Rankifly to your Whop
                account and load backend data.
              </td>
            </tr>
          ) : (
            data.map((affiliate) => (
              <tr
                key={affiliate.rank}
                className="border-b border-border/50 transition-colors hover:bg-primary/[0.03]"
              >
                <td className="px-4 py-3">
                  <RankBadge rank={affiliate.rank} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                      {affiliate.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">
                      {affiliate.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  {affiliate.sales}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  $
                  {Number(affiliate.revenue).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  {affiliate.points.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn("text-xs font-medium", {
                      "text-emerald-400": affiliate.trend === "up",
                      "text-destructive": affiliate.trend === "down",
                      "text-muted-foreground":
                        !affiliate.trend || affiliate.trend === "same",
                    })}
                  >
                    {affiliate.trend === "up"
                      ? "▲"
                      : affiliate.trend === "down"
                      ? "▼"
                      : "—"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
