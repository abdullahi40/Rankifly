import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getBillingPlans,
  getBillingStatus,
  subscribeToPlan,
} from "../controllers/billingController.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/plans", getBillingPlans);
router.post("/subscribe", subscribeToPlan);
router.get("/status", getBillingStatus);

export default router;
