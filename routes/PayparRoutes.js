// backend/routes/paypalRoutes.js
import express from "express";
import * as paypal from "@paypal/paypal-server-sdk";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Create PayPal order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

// Capture PayPal order
router.post("/capture-order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    res.json(capture.result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to capture PayPal payment" });
  }
});

export default router;
