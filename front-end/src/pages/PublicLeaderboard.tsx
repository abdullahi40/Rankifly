import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { RankiflyLogo } from "@/components/RankiflyLogo";
import { getPublicLeaderboard } from "@/services/leaderboard";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary shadow-lg shadow-primary/20">
        <Trophy className="h-4 w-4 text-primary-foreground" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/20">
        <Medal className="h-4 w-4 text-warning" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chart-5/20">
        <Medal className="h-4 w-4 text-chart-5" />
      </div>
    );
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
      {rank}
    </div>
  );
}

export default function PublicLeaderboard() {
  const { companyId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicLeaderboard", companyId],
    queryFn: () => getPublicLeaderboard(companyId ?? ""),
    enabled: Boolean(companyId),
  });

  const topAffiliates = data?.slice(0, 3) ?? [];
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load leaderboard";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 bg-primary/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <RankiflyLogo />
          <a
            href="https://whop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by Whop <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            🏆 Top Affiliates
          </h2>
          <p className="text-muted-foreground">
            Live rankings for{" "}
            <span className="font-medium text-foreground">{companyId}</span>
          </p>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading public leaderboard...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {topAffiliates.map((affiliate) => (
                <div
                  key={affiliate.rank}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-6 transition-all hover:scale-[1.02] bg-card",
                    affiliate.rank === 1
                      ? "border-primary/40 glow-primary md:order-2 md:-mt-4"
                      : affiliate.rank === 2
                      ? "border-warning/20 md:order-1"
                      : "border-border md:order-3"
                  )}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold",
                        affiliate.rank === 1
                          ? "gradient-primary text-primary-foreground"
                          : affiliate.rank === 2
                          ? "bg-warning/20 text-warning"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {affiliate.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {affiliate.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rank #{affiliate.rank}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Sales
                        </p>
                        <p className="text-base font-bold text-foreground">
                          {affiliate.sales}
                        </p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Revenue
                        </p>
                        <p className="text-base font-bold text-foreground">
                          ${affiliate.revenue}
                        </p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Points
                        </p>
                        <p className="text-base font-bold text-primary">
                          {affiliate.points.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {affiliate.rank === 1 && (
                    <div className="absolute -right-1 -top-1 rounded-full gradient-primary p-2.5 shadow-lg shadow-primary/30">
                      <Star className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border px-6 py-4">
                <h3 className="font-semibold text-foreground">All Rankings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">Affiliate</th>
                      <th className="px-6 py-3 text-right">Sales</th>
                      <th className="px-6 py-3 text-right">Revenue</th>
                      <th className="px-6 py-3 text-right">Points</th>
                      <th className="px-6 py-3 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((affiliate) => (
                      <tr
                        key={affiliate.rank}
                        className="border-b border-border/50 transition-colors hover:bg-primary/10"
                      >
                        <td className="px-6 py-4">
                          <RankBadge rank={affiliate.rank} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                              {affiliate.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">
                              {affiliate.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-foreground">
                          {affiliate.sales}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-foreground">
                          ${affiliate.revenue}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-primary">
                          {affiliate.points.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs font-medium text-muted-foreground">
                            —
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-primary">Rankifly</span> ·
            Real-time affiliate leaderboards for Whop sellers
          </p>
        </div>
      </div>
    </div>
  );
}
