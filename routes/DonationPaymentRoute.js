import express from "express";
import {
  createStripePayment,
  createStripeSubscription,
  createPayPalPayment,
  getAllPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// ─── Payments ────────────────────────────────────────────────
router.post("/stripe", createStripePayment);
router.post("/stripe/subscription", createStripeSubscription);
router.post("/paypal", createPayPalPayment);

// ✔ FIXED HERE
router.get("/", getAllPayments);

export default router;