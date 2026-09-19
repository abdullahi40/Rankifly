import {
  fetchLeaderboard,
  fetchPublicLeaderboard,
} from "../services/leaderboardService.js";
import { syncSellerAffiliates } from "../services/whopService.js";
import { ApiError } from "../utils/errors.js";

const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await fetchLeaderboard(req.seller.id);
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard fetch failed:", error);
    next(new ApiError("Failed to get leaderboard", 500));
  }
};

const getPublicLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await fetchPublicLeaderboard(req.params.companyId);
    res.json(leaderboard);
  } catch (error) {
    console.error("Public leaderboard fetch failed:", error);
    next(new ApiError("Failed to get public leaderboard", 500));
  }
};

const syncLeaderboard = async (req, res, next) => {
  try {
    const result = await syncSellerAffiliates(req.seller);
    res.json(result);
  } catch (error) {
    console.error("Affiliate sync failed:", error);
    next(new ApiError("Failed to sync affiliates", 500));
  }
};

export { getLeaderboard, getPublicLeaderboard, syncLeaderboard };
