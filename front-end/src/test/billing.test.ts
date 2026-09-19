import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBillingPlans, subscribeToPlan } from "../services/leaderboard";

describe("billing service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns the available Whop subscription plans", async () => {
    const plans = await getBillingPlans();

    expect(Array.isArray(plans)).toBe(true);
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      currency: expect.any(String),
    });
  });

  it("redirects to the Whop checkout URL when a checkout link is returned", async () => {
    vi.stubEnv("VITE_WHOP_RANKIFLY_PRO_CHECKOUT_URL", "");
    vi.stubEnv("VITE_WHOP_CHECKOUT_URL", "");
    vi.stubEnv("VITE_WHOP_PRODUCT_URL", "");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Redirecting to Whop checkout",
        status: "redirect_required",
        plan: {
          id: "rankifly-pro-monthly",
          name: "Rankifly Pro",
          price: 14.99,
          currency: "USD",
          interval: "month",
          description: "Whop plan",
          features: ["Unlimited affiliates"],
        },
        checkout_url: "https://whop.com/checkout/test-product",
        requires_redirect: true,
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const originalLocation = window.location;
    // @ts-expect-error jsdom location is writable in tests
    delete window.location;
    // @ts-expect-error test override for navigation behavior
    window.location = { href: "http://localhost:3000/billing" };

    const result = await subscribeToPlan("rankifly-pro-monthly");

    expect(result.checkout_url).toBe("https://whop.com/checkout/test-product");
    expect(window.location.href).toBe("https://whop.com/checkout/test-product");

    // restore original location
    window.location = originalLocation;
  });

  it("prefers the configured Rankifly Pro checkout URL when redirecting to Whop", async () => {
    vi.stubEnv(
      "VITE_WHOP_RANKIFLY_PRO_CHECKOUT_URL",
      "https://whop.com/checkout/plan_HpyCNBkz8Cymm"
    );
    vi.stubEnv("VITE_WHOP_CHECKOUT_URL", "https://whop.com/checkout/old-link");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Redirecting to Whop checkout",
        status: "redirect_required",
        plan: {
          id: "rankifly-pro-monthly",
          name: "Rankifly Pro",
          price: 14.99,
          currency: "USD",
          interval: "month",
          description: "Whop plan",
          features: ["Unlimited affiliates"],
        },
        requires_redirect: true,
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const originalLocation = window.location;
    // @ts-expect-error jsdom location is writable in tests
    delete window.location;
    // @ts-expect-error test override for navigation behavior
    window.location = { href: "http://localhost:3000/billing" };

    const result = await subscribeToPlan("rankifly-pro-monthly");

    expect(result.checkout_url).toBe(
      "https://whop.com/checkout/plan_HpyCNBkz8Cymm"
    );
    expect(window.location.href).toBe(
      "https://whop.com/checkout/plan_HpyCNBkz8Cymm"
    );

    window.location = originalLocation;
  });
});
