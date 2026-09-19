import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getLeaderboard,
  syncLeaderboard,
} from "../controllers/leaderboardController.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", getLeaderboard);
router.post("/sync", syncLeaderboard);

export default router;
