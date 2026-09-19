import express from "express";
import authMiddleware from "../middleware/auth.js";
import { updateDiscordWebhook } from "../controllers/settingsController.js";

const router = express.Router();
router.use(authMiddleware);
router.put("/discord", updateDiscordWebhook);

export default router;
