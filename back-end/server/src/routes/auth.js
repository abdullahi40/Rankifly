import express from "express";
import { installSeller } from "../controllers/authController.js";

const router = express.Router();
router.post("/install", installSeller);

export default router;
