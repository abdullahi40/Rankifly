import axios from "axios";
import pool from "../config/db.js";

const BILLING_PLAN_PRICE = 14.99;
const BILLING_CURRENCY = "USD";
const BILLING_PLANS = [
  {
    id: "rankifly-pro-monthly",
    name: "Rankifly Pro",
    price: BILLING_PLAN_PRICE,
    currency: BILLING_CURRENCY,
    interval: "month",
    description: "Best for active Whop sellers and affiliate programs",
    features: [
      "Unlimited affiliates",
      "Real-time leaderboard",
      "Discord notifications",
      "Public leaderboard page",
      "CSV export",
      "Priority support",
    ],
  },
];

const getWhopCheckoutUrl = () =>
  process.env.WHOP_RANKIFLY_PRO_CHECKOUT_URL ||
  process.env.WHOP_CHECKOUT_URL ||
  process.env.WHOP_PRODUCT_URL ||
  process.env.WHOP_CHECKOUT_LINK ||
  null;

const normalizeWhopAccessState = (value) => {
  const normalized = String(value ?? "").toLowerCase();

  if (
    ["active", "paid", "paid_active", "subscribed", "entitled"].includes(
      normalized
    )
  ) {
    return "active";
  }

  if (
    [
      "inactive",
      "cancelled",
      "canceled",
      "expired",
      "failed",
      "past_due",
      "revoked",
      "unpaid",
    ].includes(normalized)
  ) {
    return "inactive";
  }

  return normalized || "inactive";
};

const readWhopMembershipStatus = (payload) => {
  if (!payload) return null;

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.memberships)
    ? payload.memberships
    : Array.isArray(payload.results)
    ? payload.results
    : [];

  for (const item of items) {
    const status =
      item?.status ||
      item?.subscription_status ||
      item?.access_status ||
      item?.state ||
      item?.membership?.status ||
      item?.subscription?.status ||
      item?.entitlement?.status;

    const active =
      item?.is_active ??
      item?.active ??
      item?.isActive ??
      item?.subscription?.active ??
      item?.membership?.active ??
      item?.entitlement?.active;

    if (status) {
      return normalizeWhopAccessState(status);
    }

    if (active !== undefined) {
      return active ? "active" : "inactive";
    }
  }

  return null;
};

const verifySellerAccessWithWhop = async (seller) => {
  if (!seller?.company_id) {
    return { status: "inactive", source: "local" };
  }

  const whopApiToken =
    process.env.WHOP_API_TOKEN || process.env.WHOP_CLIENT_SECRET;
  if (!whopApiToken) {
    return {
      status: seller.subscription_status === "active" ? "active" : "inactive",
      source: "local",
    };
  }

  const whopApiBaseUrl = process.env.WHOP_API_URL || "https://api.whop.com";
  const candidateUrls = [
    `${whopApiBaseUrl}/v1/memberships?company_id=${encodeURIComponent(
      seller.company_id
    )}`,
    `${whopApiBaseUrl}/v1/memberships?company=${encodeURIComponent(
      seller.company_id
    )}`,
    `${whopApiBaseUrl}/v1/memberships`,
  ];

  for (const url of candidateUrls) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${whopApiToken}`,
          Accept: "application/json",
        },
        timeout: 10000,
      });

      const status = readWhopMembershipStatus(response.data);
      if (status) {
        return { status, source: "whop" };
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        break;
      }
      if (status === 404) {
        continue;
      }
    }
  }

  return {
    status: seller.subscription_status === "active" ? "active" : "inactive",
    source: "local",
  };
};

const getBillingPlans = async () => BILLING_PLANS;

const getBillingStatus = async (seller) => {
  const verifiedAccess = await verifySellerAccessWithWhop(seller);
  const status = verifiedAccess.status === "active" ? "active" : "inactive";

  const now = new Date();
  const trialEndsAt = seller.trial_ends_at
    ? new Date(seller.trial_ends_at)
    : null;
  const trialActive = !!(trialEndsAt && trialEndsAt > now);

  const finalStatus =
    status === "active" || trialActive ? "active" : "inactive";

  if (seller?.id) {
    await pool.query(
      "UPDATE sellers SET subscription_status = $1, whop_access_status = $2, whop_last_synced_at = NOW() WHERE id = $3",
      [finalStatus, finalStatus, seller.id]
    );
  }

  return {
    status: finalStatus,
    trial_ends_at: seller.trial_ends_at,
    subscription_status: finalStatus ? "active" : "inactive",
    plan_price_monthly: BILLING_PLAN_PRICE,
    currency: BILLING_CURRENCY,
  };
};

const subscribeToPlan = async (seller, planId) => {
  const selectedPlan =
    BILLING_PLANS.find((plan) => plan.id === planId) ?? BILLING_PLANS[0];

  const checkoutUrl = getWhopCheckoutUrl();

  if (checkoutUrl) {
    return {
      message: `Redirecting to Whop checkout for ${selectedPlan.name}.`,
      status: "redirect_required",
      plan: selectedPlan,
      checkout_url: checkoutUrl,
      requires_redirect: true,
    };
  }

  await pool.query(
    "UPDATE sellers SET subscription_status = 'active', whop_access_status = 'active' WHERE id = $1",
    [seller.id]
  );

  return {
    message: `${selectedPlan.name} subscription is active. Billing is managed through Whop.`,
    status: "active",
    plan: selectedPlan,
    checkout_url: null,
    requires_redirect: false,
  };
};

export { getBillingPlans, getBillingStatus, subscribeToPlan };
