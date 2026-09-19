import pool from "../config/db.js";
import { syncSellerAffiliates } from "./whopService.js";

const createOrUpdateSeller = async ({
  seller_id,
  company_id,
  company_name,
}) => {
  const existing = await pool.query(
    "SELECT * FROM sellers WHERE seller_id = $1 OR company_id = $2",
    [seller_id, company_id]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const result = await pool.query(
    "INSERT INTO sellers (seller_id, company_id, company_name, trial_ends_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [seller_id, company_id, company_name, trialEndsAt]
  );

  return result.rows[0];
};

const createOrUpdateSellerWithSync = async ({
  seller_id,
  company_id,
  company_name,
}) => {
  const seller = await createOrUpdateSeller({
    seller_id,
    company_id,
    company_name,
  });
  const syncResult = await syncSellerAffiliates(seller);
  return { seller, syncResult };
};

export { createOrUpdateSeller, createOrUpdateSellerWithSync };
