import Payment from "../models/payment.js";

// ─── Stripe One-time payment ────────────────────────────────
export const createStripePayment = async (req, res) => {
  try {
    // TODO: integrate Stripe here
    res.json({ message: "Stripe payment placeholder (not implemented yet)" });
  } catch (err) {
    console.error("Stripe payment error:", err);
    res.status(500).json({ error: "Stripe payment failed" });
  }
};

// ─── Stripe Subscription ────────────────────────────────────
export const createStripeSubscription = async (req, res) => {
  try {
    // TODO: Stripe subscription logic
    res.json({ message: "Stripe subscription placeholder (not implemented yet)" });
  } catch (err) {
    console.error("Stripe subscription error:", err);
    res.status(500).json({ error: "Stripe subscription failed" });
  }
};

// ─── PayPal Payment ─────────────────────────────────────────
export const createPayPalPayment = async (req, res) => {
  try {
    // TODO: PayPal integration logic
    res.json({ message: "PayPal payment placeholder (not implemented yet)" });
  } catch (err) {
    console.error("PayPal payment error:", err);
    res.status(500).json({ error: "PayPal payment failed" });
  }
};

// ─── Get all payments with pagination ──────────────────────
export const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(),
    ]);

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};