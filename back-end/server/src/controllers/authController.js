import { createOrUpdateSellerWithSync } from "../services/authService.js";
import { ApiError } from "../utils/errors.js";

const installSeller = async (req, res, next) => {
  try {
    const { seller_id, company_id, company_name } = req.body;

    if (!seller_id || !company_id || !company_name) {
      return res.status(400).json({
        error: "seller_id, company_id, and company_name are required",
      });
    }

    const { seller, syncResult } = await createOrUpdateSellerWithSync({
      seller_id,
      company_id,
      company_name,
    });

    res.json({ seller, sync: syncResult });
  } catch (error) {
    next(new ApiError("Failed to install seller", 500));
  }
};

export { installSeller };
