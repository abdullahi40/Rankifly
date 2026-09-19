import pool from "../config/db.js";

const fetchLeaderboard = async (sellerId) => {
  const result = await pool.query(
    "SELECT affiliate_name, sales_count, total_sales_cents, points FROM affiliates WHERE seller_id = $1 ORDER BY points DESC, total_sales_cents DESC",
    [sellerId]
  );

  return result.rows.map((row, index) => ({
    rank: index + 1,
    name: row.affiliate_name || "Unknown",
    sales: row.sales_count,
    revenue: (row.total_sales_cents / 100).toFixed(2),
    points: row.points,
  }));
};

const fetchPublicLeaderboard = async (companyId) => {
  const sellerResult = await pool.query(
    "SELECT id FROM sellers WHERE company_id = $1",
    [companyId]
  );

  if (!sellerResult.rows.length) {
    throw new Error("Seller not found");
  }

  return fetchLeaderboard(sellerResult.rows[0].id);
};

export { fetchLeaderboard, fetchPublicLeaderboard };
