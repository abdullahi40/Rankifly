import { apiGet, apiPost, apiPut } from "@/services/api";

export interface Affiliate {
  rank: number;
  name: string;
  sales: number;
  revenue: string;
  points: number;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: string[];
}

const FALLBACK_BILLING_PLANS: BillingPlan[] = [
  {
    id: "rankifly-pro-monthly",
    name: "Rankifly Pro",
    price: 14.99,
    currency: "USD",
    interval: "month",
    description: "Best for active Whop sellers and affiliate programs",
    features: [
      "Unlimited affiliates",
      "Real-time leaderboard",
      "Discord notifications",
      "Public leaderboard page",
      "CSV export",
      "Priority support",
      "Custom branding",
      "API access",
    ],
  },
];

export const getLeaderboard = async (): Promise<Affiliate[]> => {
  return apiGet<Affiliate[]>("/leaderboard");
};

export const getPublicLeaderboard = async (
  companyId: string
): Promise<Affiliate[]> => {
  if (!companyId) {
    throw new Error("Missing companyId");
  }

  return apiGet<Affiliate[]>(
    `/public/leaderboard/${encodeURIComponent(companyId)}`
  );
};

export const getBillingPlans = async (): Promise<BillingPlan[]> => {
  try {
    return await apiGet<BillingPlan[]>("/billing/plans");
  } catch (error) {
    return FALLBACK_BILLING_PLANS;
  }
};

export const getBillingStatus = async (): Promise<{
  status: string;
  trial_ends_at: string | null;
  subscription_status: string;
  plan_price_monthly: number;
  currency: string;
}> => {
  try {
    return await apiGet<{
      status: string;
      trial_ends_at: string | null;
      subscription_status: string;
      plan_price_monthly: number;
      currency: string;
    }>("/billing/status");
  } catch (error) {
    return {
      status: "inactive",
      trial_ends_at: null,
      subscription_status: "trial",
      plan_price_monthly: 14.99,
      currency: "USD",
    };
  }
};

export const subscribeToPlan = async (
  planId: string
): Promise<{
  message: string;
  status: string;
  plan: BillingPlan;
  checkout_url?: string | null;
  requires_redirect?: boolean;
}> => {
  const response = await apiPost<{
    message: string;
    status: string;
    plan: BillingPlan;
    checkout_url?: string | null;
    requires_redirect?: boolean;
  }>("/billing/subscribe", { plan_id: planId });

  const checkoutUrl =
    import.meta.env.VITE_WHOP_RANKIFLY_PRO_CHECKOUT_URL ||
    import.meta.env.VITE_WHOP_CHECKOUT_URL ||
    import.meta.env.VITE_WHOP_PRODUCT_URL ||
    response.checkout_url ||
    null;

  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  }

  return {
    ...response,
    checkout_url: checkoutUrl,
    requires_redirect: Boolean(checkoutUrl),
  };
};

export const syncAffiliates = async (): Promise<{
  message: string;
  importedAffiliates: number;
  importedSales: number;
}> => {
  return apiPost<{
    message: string;
    importedAffiliates: number;
    importedSales: number;
  }>("/leaderboard/sync", {});
};

export const saveDiscordWebhook = async (
  webhook_url: string
): Promise<{ message: string }> => {
  return apiPut<{ message: string }>("/settings/discord", { webhook_url });
};
