import express from "express";
import { getBanner, updateBanner } from "../controllers/BannerController.js";

const router = express.Router();

// Get banner
router.get("/", getBanner);

// Update banner (edit only)
router.put("/", updateBanner);

export default router;
