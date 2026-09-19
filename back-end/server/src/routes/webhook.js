import express from "express";
import { handleWhopWebhook } from "../controllers/webhookController.js";

const router = express.Router();
router.post("/whop", handleWhopWebhook);

export default router;
