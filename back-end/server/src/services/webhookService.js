import pool from "../config/db.js";
import { sendDiscordNotification } from "./discordService.js";

const updateSellerSubscriptionStatus = async (companyId, status) => {
  await pool.query(
    "UPDATE sellers SET subscription_status = $1, whop_access_status = $1, whop_last_synced_at = NOW() WHERE company_id = $2",
    [status, companyId]
  );
};

const isSubscriptionActivationEvent = (eventType) =>
  [
    "membership.went_active",
    "membership.activated",
    "membership.renewed",
    "invoice.paid",
    "invoice.created",
  ].includes(eventType);

const isSubscriptionDeactivationEvent = (eventType) =>
  [
    "membership.went_inactive",
    "membership.deactivated",
    "invoice.past_due",
    "invoice.voided",
    "invoice_marked_uncollectible",
  ].includes(eventType);

const handleWhopEvent = async (event) => {
  const { type, company_id, affiliate, amount, product_name, order_id } = event;

  if (company_id && isSubscriptionActivationEvent(type)) {
    await updateSellerSubscriptionStatus(company_id, "active");
  }

  if (company_id && isSubscriptionDeactivationEvent(type)) {
    await updateSellerSubscriptionStatus(company_id, "inactive");
  }

  if (!affiliate?.id || !order_id || amount == null) {
    return;
  }

  const sellerResult = await pool.query(
    "SELECT id, discord_webhook FROM sellers WHERE company_id = $1",
    [company_id]
  );

  if (!sellerResult.rows.length) {
    throw new Error("Seller not found");
  }

  const seller = sellerResult.rows[0];
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const affiliateResult = await client.query(
      "SELECT id FROM affiliates WHERE seller_id = $1 AND affiliate_id = $2",
      [seller.id, affiliate.id]
    );

    let affiliateId = null;
    if (affiliateResult.rows.length === 0) {
      const insertAffiliate = await client.query(
        "INSERT INTO affiliates (seller_id, affiliate_id, affiliate_name) VALUES ($1, $2, $3) RETURNING id",
        [seller.id, affiliate.id, affiliate.name]
      );
      affiliateId = insertAffiliate.rows[0].id;
    } else {
      affiliateId = affiliateResult.rows[0].id;
    }

    const amountCents = Number(amount);

    await client.query(
      "INSERT INTO sales (seller_id, affiliate_id, whop_order_id, amount_cents, product_name) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (whop_order_id) DO NOTHING",
      [seller.id, affiliateId, order_id, amountCents, product_name]
    );

    await client.query(
      "UPDATE affiliates SET sales_count = sales_count + 1, total_sales_cents = total_sales_cents + $2, points = points + ($2 / 100) WHERE id = $1",
      [affiliateId, amountCents]
    );

    await client.query("COMMIT");

    if (seller.discord_webhook) {
      await sendDiscordNotification(seller.discord_webhook, {
        affiliate_name: affiliate.name,
        amount_cents: amountCents,
        product_name,
        points: amountCents / 100,
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export { handleWhopEvent };
