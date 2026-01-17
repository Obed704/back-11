import express from "express";
import {
  createStripePayment,
  createStripeSubscription,
  createPayPalPayment,
  GetPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/stripe", createStripePayment);           // One-time
router.post("/stripe/subscription", createStripeSubscription); // Monthly
router.post("/paypal", createPayPalPayment);
router.get("/",GetPayments)

export default router;
