import stripePackage from "stripe";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import Payment from "../models/payment.js";

dotenv.config();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// PayPal environment helper
function environment() {
  const { NODE_ENV, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials are missing");
  }

  // Use live only if explicitly in production
  return NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
}

function paypalClient() {
  return new paypal.core.PayPalHttpClient(environment());
}

// --- Stripe One-Time Payment ---
export const createStripePayment = async (req, res) => {
  const { amount, name, email, message } = req.body;

  try {
    if (!amount || !name || !email) throw new Error("Amount, name, and email are required.");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Donation" },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await Payment.create({ name, email, amount, message, provider: "stripe", type: "one-time" });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- Stripe Subscription ---
export const createStripeSubscription = async (req, res) => {
  const { amount, name, email, message } = req.body;

  try {
    if (!amount || !name || !email) throw new Error("Amount, name, and email are required.");

    const product = await stripe.products.create({ name: "Monthly Donation" });
    const price = await stripe.prices.create({
      unit_amount: amount * 100,
      currency: "usd",
      recurring: { interval: "month" },
      product: product.id,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await Payment.create({ name, email, amount, message, provider: "stripe", type: "monthly" });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe subscription error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- PayPal Payment ---
export const createPayPalPayment = async (req, res) => {
  const { amount, name, email, message } = req.body;

  try {
    if (!amount || !name || !email) throw new Error("Amount, name, and email are required.");

    const formattedAmount = Number(amount).toFixed(2); // ensure string with 2 decimals

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: formattedAmount } }],
      application_context: {
        brand_name: "STEM Inspire",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      },
    });

    const response = await paypalClient().execute(request);

    if (!response || !response.result || !response.result.id) {
      throw new Error("Failed to create PayPal order");
    }

    await Payment.create({ name, email, amount, message, provider: "paypal", type: "one-time" });

    // Send back correct URL depending on environment
    const paypalBaseUrl = process.env.NODE_ENV === "production"
      ? "https://www.paypal.com/checkoutnow?token="
      : "https://www.sandbox.paypal.com/checkoutnow?token=";

    res.json({ url: `${paypalBaseUrl}${response.result.id}` });
  } catch (err) {
    console.error("PayPal payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- Get All Payments ---
export const GetPayments = async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.json(payments);
  } catch (err) {
    console.error("GetPayments error:", err);
    res.status(500).json({ error: err.message });
  }
};
