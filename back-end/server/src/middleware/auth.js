import pool from "../config/db.js";
import { ApiError } from "../utils/errors.js";

const authMiddleware = async (req, res, next) => {
  try {
    const companyId = req.headers["x-company-id"];

    if (!companyId) {
      return next(new ApiError("Missing x-company-id header", 401));
    }

    const result = await pool.query(
      "SELECT id, trial_ends_at, subscription_status FROM sellers WHERE company_id = $1",
      [companyId]
    );

    if (!result.rows.length) {
      return next(new ApiError("Seller not found", 404));
    }

    req.seller = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
