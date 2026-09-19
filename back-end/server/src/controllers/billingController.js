import {
  getBillingPlans,
  getBillingStatus,
  subscribeToPlan,
} from "../services/billingService.js";
import { ApiError } from "../utils/errors.js";

const getBillingStatusHandler = async (req, res, next) => {
  try {
    const status = await getBillingStatus(req.seller);
    res.json(status);
  } catch (error) {
    next(new ApiError("Failed to get billing status", 500));
  }
};

const getBillingPlansHandler = async (_req, res, next) => {
  try {
    const plans = await getBillingPlans();
    res.json(plans);
  } catch (error) {
    next(new ApiError("Failed to get billing plans", 500));
  }
};

const subscribeToPlanHandler = async (req, res, next) => {
  try {
    const { plan_id } = req.body ?? {};
    const result = await subscribeToPlan(req.seller, plan_id);
    res.json(result);
  } catch (error) {
    next(new ApiError("Failed to subscribe to the plan", 500));
  }
};

export {
  getBillingStatusHandler as getBillingStatus,
  getBillingPlansHandler as getBillingPlans,
  subscribeToPlanHandler as subscribeToPlan,
};
