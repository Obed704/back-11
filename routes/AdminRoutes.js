import express from "express";
import { changePassword } from "../controllers/AdminController.js";
import { getAllPayments } from "../controllers/AdminController.js";
import { protect } from "../middleware/authMidleware.js";

const router = express.Router();

// Admin password change
router.put("/change-password", protect, changePassword);

// Admin: view all payments/donations (protected)
router.get("/payments", protect, getAllPayments);

export default router;
