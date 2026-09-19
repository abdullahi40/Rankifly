import { useQuery } from "@tanstack/react-query";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TopPerformers } from "@/components/TopPerformers";
import { getLeaderboard } from "@/services/leaderboard";

export default function Leaderboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });
  const errorMessage = error instanceof Error ? error.message : "Unable to load leaderboard";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rankifly Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Full rankings of all your affiliates by sales, revenue, and points</p>
      </div>

      <TopPerformers affiliates={data} />

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">All Affiliates</h2>
        </div>
        <LeaderboardTable items={data} />
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading leaderboard...</div>}
      {isError && <div className="text-sm text-destructive">{errorMessage}</div>}
    </div>
  );
}
