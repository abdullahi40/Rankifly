import express from "express";
import { getPublicLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();
router.get("/leaderboard/:companyId", getPublicLeaderboard);

export default router;
