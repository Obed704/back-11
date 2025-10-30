import express from "express";
import {
  createStripePayment,
  createStripeSubscription,
  createPayPalPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/stripe", createStripePayment);           // One-time
router.post("/stripe/subscription", createStripeSubscription); // Monthly
router.post("/paypal", createPayPalPayment);

export default router;
