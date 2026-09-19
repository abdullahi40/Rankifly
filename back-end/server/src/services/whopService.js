import axios from "axios";
import pool from "../config/db.js";

const WHOP_API_URL = process.env.WHOP_API_URL || "https://api.whop.com";
const WHOP_API_TOKEN =
  process.env.WHOP_API_TOKEN || process.env.WHOP_CLIENT_SECRET;

const getAuthHeaders = () => {
  if (!WHOP_API_TOKEN) {
    throw new Error(
      "Missing WHOP_API_TOKEN environment variable for Whop API access."
    );
  }

  return {
    Authorization: `Bearer ${WHOP_API_TOKEN}`,
    Accept: "application/json",
  };
};

const normalizeAffiliate = (affiliate) => {
  const affiliateId =
    affiliate.id ||
    affiliate.affiliate_id ||
    affiliate.uid ||
    affiliate.whop_affiliate_id;
  const affiliateName =
    affiliate.name ||
    affiliate.username ||
    affiliate.affiliate_name ||
    "Unknown Affiliate";
  const rawTotal =
    affiliate.total_sales_cents ??
    affiliate.total_sales ??
    affiliate.revenue ??
    affiliate.sales_revenue;
  const totalSalesValue = Number(rawTotal ?? 0);
  const multiplier = affiliate.total_sales_cents == null ? 100 : 1;
  const totalSalesCents =
    totalSalesValue >= 0 ? Math.round(totalSalesValue * multiplier) : 0;
  const salesCount =
    affiliate.sales_count ??
    affiliate.total_sales_count ??
    affiliate.sales?.length ??
    0;

  return {
    affiliateId,
    affiliateName,
    salesCount: Number(salesCount) || 0,
    totalSalesCents: Number(totalSalesCents) || 0,
    rawAffiliate: affiliate,
  };
};

const fetchWhopAffiliates = async (companyId) => {
  const url = `${WHOP_API_URL}/v1/affiliates`;
  const response = await axios.get(url, {
    headers: getAuthHeaders(),
    params: {
      company_id: companyId,
    },
  });

  const rawAffiliates = response.data?.data ?? response.data;
  if (!Array.isArray(rawAffiliates)) {
    throw new TypeError("Unexpected Whop affiliates response");
  }

  return rawAffiliates
    .map(normalizeAffiliate)
    .filter((item) => item.affiliateId);
};

const fetchWhopAffiliateSales = async (affiliateId) => {
  try {
    const url = `${WHOP_API_URL}/v1/affiliates/${affiliateId}/sales`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });

    const rawSales = response.data?.data ?? response.data;
    return Array.isArray(rawSales) ? rawSales : [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

const normalizeSale = (sale) => {
  const orderId =
    sale.order_id ||
    sale.whop_order_id ||
    sale.id ||
    sale.orderId ||
    sale.transaction_id;
  const amountRaw =
    sale.amount_cents ?? sale.amount ?? sale.total_amount ?? sale.revenue;
  const amountValue = Number(amountRaw ?? 0);
  const multiplier = sale.amount_cents == null ? 100 : 1;
  const amountCents =
    amountValue >= 0 ? Math.round(amountValue * multiplier) : 0;
  const productName =
    sale.product_name || sale.product || sale.plan_name || "Unknown Product";

  return {
    orderId,
    amountCents,
    productName,
  };
};

const syncSellerAffiliates = async (seller) => {
  if (!seller?.company_id) {
    throw new Error("Seller company_id is required to sync affiliates.");
  }

  const affiliates = await fetchWhopAffiliates(seller.company_id);
  if (!affiliates.length) {
    return {
      message:
        "No affiliates found in Whop. Starting fresh with an empty leaderboard.",
      importedAffiliates: 0,
      importedSales: 0,
    };
  }

  const client = await pool.connect();
  let importedAffiliates = 0;
  let importedSales = 0;

  try {
    await client.query("BEGIN");

    for (const affiliate of affiliates) {
      const salesHistory = Array.isArray(affiliate.rawAffiliate.sales)
        ? affiliate.rawAffiliate.sales
        : await fetchWhopAffiliateSales(affiliate.affiliateId);

      const affiliateInsert = await client.query(
        `INSERT INTO affiliates (seller_id, affiliate_id, affiliate_name, sales_count, total_sales_cents, points)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (seller_id, affiliate_id)
         DO UPDATE SET
           affiliate_name = EXCLUDED.affiliate_name,
           sales_count = EXCLUDED.sales_count,
           total_sales_cents = EXCLUDED.total_sales_cents,
           points = EXCLUDED.points
         RETURNING id`,
        [
          seller.id,
          affiliate.affiliateId,
          affiliate.affiliateName,
          affiliate.salesCount,
          affiliate.totalSalesCents,
          Math.floor(affiliate.totalSalesCents / 100),
        ]
      );

      const affiliateRowId = affiliateInsert.rows[0].id;
      importedAffiliates += 1;

      if (!salesHistory.length) {
        continue;
      }

      const normalizedSales = salesHistory
        .map(normalizeSale)
        .filter((sale) => sale.orderId && sale.amountCents > 0);

      let computedSalesCount = 0;
      let computedTotalCents = 0;

      for (const sale of normalizedSales) {
        await client.query(
          `INSERT INTO sales (seller_id, affiliate_id, whop_order_id, amount_cents, product_name)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (whop_order_id) DO NOTHING`,
          [
            seller.id,
            affiliateRowId,
            sale.orderId,
            sale.amountCents,
            sale.productName,
          ]
        );

        importedSales += 1;
        computedSalesCount += 1;
        computedTotalCents += sale.amountCents;
      }

      if (computedSalesCount > 0) {
        await client.query(
          `UPDATE affiliates SET sales_count = $2, total_sales_cents = $3, points = $4 WHERE id = $1`,
          [
            affiliateRowId,
            computedSalesCount,
            computedTotalCents,
            Math.floor(computedTotalCents / 100),
          ]
        );
      }
    }

    await client.query("COMMIT");

    return {
      message: "Whop post-install sync completed successfully.",
      importedAffiliates,
      importedSales,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export { syncSellerAffiliates, fetchWhopAffiliates, fetchWhopAffiliateSales };
