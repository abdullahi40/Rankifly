import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { TopPerformers } from "@/components/TopPerformers";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Link } from "react-router-dom";
import { getLeaderboard } from "@/services/leaderboard";

export default function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    staleTime: 1000 * 60,
  });

  const totalRevenue = useMemo(
    () => data?.reduce((sum, item) => sum + Number(item.revenue), 0) ?? 0,
    [data]
  );

  const totalSales = useMemo(
    () => data?.reduce((sum, item) => sum + item.sales, 0) ?? 0,
    [data]
  );

  const activeAffiliates = data?.length ?? 0;
  const conversionRate = activeAffiliates
    ? `${Math.round((totalSales / activeAffiliates) * 10) / 10}%`
    : "0%";
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load data";

  return (
    <div className="space-y-6">
      <div className="soft-panel overflow-hidden rounded-3xl p-6 md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              <Bell className="h-3.5 w-3.5" />
              Creator overview
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                Rankifly Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                Track affiliate growth, sales momentum, and revenue performance
                across your Whop ecosystem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/connect"
              className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/15"
            >
              Connect Whop
            </Link>
            <Link
              to="/billing"
              className="rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="Live from backend"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Active Affiliates"
          value={`${activeAffiliates}`}
          change="Live leaderboard count"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Total Sales"
          value={`${totalSales}`}
          change="Live sales total"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Average Sales"
          value={conversionRate}
          change="Based on affiliate data"
          changeType={data ? "positive" : "negative"}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="soft-panel flex items-center gap-3 rounded-2xl px-5 py-4">
          <div className="rounded-xl bg-accent/20 p-2.5">
            <Bell className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Discord Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              Webhook status updates come from backend settings
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
        </div>

        <div className="soft-panel flex items-center gap-3 rounded-2xl px-5 py-4">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Subscription</p>
            <p className="text-xs text-muted-foreground">
              Status available through backend billing endpoint
            </p>
          </div>
          <Link
            to="/billing"
            className="text-xs font-medium text-primary hover:underline"
          >
            Manage →
          </Link>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Top Performers
        </h2>
        <TopPerformers affiliates={data} />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Leaderboard
            </h2>
            <Link
              to="/leaderboard"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="soft-panel overflow-hidden rounded-2xl">
            <LeaderboardTable items={data} limit={5} />
          </div>
        </div>
        <div className="xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <ActivityFeed />
        </div>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">
          Loading leaderboard data...
        </div>
      )}
      {isError && (
        <div className="text-sm text-destructive">
          Unable to load leaderboard: {errorMessage}
        </div>
      )}
    </div>
  );
}
