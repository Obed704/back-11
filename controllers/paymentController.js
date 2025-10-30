import stripePackage from "stripe";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// PayPal environment
function environment() {
  if (process.env.NODE_ENV === "production") {
    return new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
  } else {
    return new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
  }
}
function paypalClient() {
  return new paypal.core.PayPalHttpClient(environment());
}

// ----- Stripe One-Time -----
export const createStripePayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Donation" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe payment error:", err);
    res.status(500).json({ error: "Stripe payment failed" });
  }
};

// ----- Stripe Monthly Subscription -----
export const createStripeSubscription = async (req, res) => {
  const { amount } = req.body;
  try {
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
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe subscription error:", err);
    res.status(500).json({ error: "Stripe subscription failed" });
  }
};

// ----- PayPal Payment -----
export const createPayPalPayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) throw new Error("FRONTEND_URL not defined");

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
      application_context: {
        brand_name: "STEM Inspire",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${frontendUrl}/payment-success`,
        cancel_url: `${frontendUrl}/payment-cancel`,
      },
    });

    const response = await paypalClient().execute(request);
    res.json({ id: response.result.id });
  } catch (err) {
    console.error("PayPal error:", err);
    res.status(500).json({ error: "PayPal payment failed" });
  }
};
