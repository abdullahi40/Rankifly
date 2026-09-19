import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getBillingPlans,
  getBillingStatus,
  subscribeToPlan,
} from "@/services/leaderboard";

export default function Billing() {
  const queryClient = useQueryClient();
  const whopCheckoutUrl =
    import.meta.env.VITE_WHOP_RANKIFLY_PRO_CHECKOUT_URL ||
    import.meta.env.VITE_WHOP_CHECKOUT_URL ||
    "https://whop.com";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["billingStatus"],
    queryFn: getBillingStatus,
    staleTime: 1000 * 60,
  });
  const { data: plans = [] } = useQuery({
    queryKey: ["billingPlans"],
    queryFn: getBillingPlans,
    staleTime: 1000 * 60,
  });
  const subscribeMutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingStatus"] });
    },
  });

  const planPrice = data?.plan_price_monthly ?? 14.99;
  const currency = data?.currency ?? "USD";
  const status = data?.status ?? "inactive";
  const subscriptionText = status === "active" ? "Active" : "Inactive";
  const trialEndsAt = data?.trial_ends_at ? new Date(data.trial_ends_at) : null;
  const trialText = trialEndsAt
    ? `Trial ends ${trialEndsAt.toLocaleDateString()}`
    : "No active trial";
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load billing status";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing details
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Loading billing status...
        </div>
      )}
      {isError && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {plans[0]?.name ?? "Rankifly Pro"}
              </p>
              <p className="text-xs text-muted-foreground">
                {plans[0]?.description ??
                  "Best for active Whop sellers and affiliate programs"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">
                {currency} {planPrice.toFixed(2)} / mo
              </p>
              <p className="text-xs text-muted-foreground">Billed monthly</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-card p-6 glow-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg gradient-primary p-2.5">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground">Plan Status</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {subscriptionText}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {status === "active"
                    ? trialText
                    : "Subscription is not active."}
                </p>
              </div>
            </div>
            {status === "active" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(whopCheckoutUrl, "_blank", "noopener,noreferrer")
                }
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  subscribeMutation.mutate(
                    plans[0]?.id ?? "rankifly-pro-monthly"
                  )
                }
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending
                  ? "Preparing..."
                  : "Upgrade to Pro"}
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">
            What's Included
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              plans[0]?.features ?? [
                "Unlimited affiliates",
                "Real-time leaderboard",
                "Discord notifications",
                "Public leaderboard page",
                "CSV export",
                "Priority support",
                "Custom branding",
                "API access",
              ]
            ).map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Default payment details
                </p>
                <p className="text-xs text-muted-foreground">
                  Update billing through your Whop product page.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open("https://whop.com", "_blank", "noopener,noreferrer")
              }
            >
              Update
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Current Usage</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Webhooks sent</span>
                <span className="text-foreground font-medium">
                  1,247 / 5,000
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full gradient-primary"
                  style={{ width: "25%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">API calls</span>
                <span className="text-foreground font-medium">
                  8,420 / 50,000
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full gradient-accent"
                  style={{ width: "17%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
