import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, changePassword } from "../controllers/AuthController.js";
import { getAllPayments } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
router.get("/payments", protect, getAllPayments);

export default router;